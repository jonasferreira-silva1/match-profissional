import { NextResponse } from "next/server"
import postgres from "postgres"
import pdfParse from "pdf-parse"
import { analyzeResume } from "@/lib/nlp-engine"

// Lazy initialization - só cria a conexão quando necessário
let sql: ReturnType<typeof postgres> | null = null

function getDb() {
  if (sql) return sql
  
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não está configurada")
  }
  
  // Usa postgres.js para conexões PostgreSQL locais
  sql = postgres(databaseUrl, { 
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  })
  
  return sql
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const jobDescription = formData.get("jobDescription") as string
    const resumeFile = formData.get("resume") as File | null
    const resumeText = formData.get("resumeText") as string | null

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Descricao da vaga e obrigatoria" },
        { status: 400 }
      )
    }

    // Extract text from PDF or use pasted text
    let finalResumeText = ""

    if (resumeFile && resumeFile.size > 0) {
      // Read PDF using pdf-parse library for proper extraction
      try {
        const buffer = await resumeFile.arrayBuffer()
        const pdfData = await pdfParse(Buffer.from(buffer))
        finalResumeText = pdfData.text
        
        // If extraction failed or returned very little text, try fallback
        if (!finalResumeText || finalResumeText.trim().length < 50) {
          console.warn("PDF parsing returned little text, trying fallback extraction")
          finalResumeText = extractTextFromPdf(Buffer.from(buffer))
        }
      } catch (pdfError) {
        console.error("PDF parsing error, using fallback:", pdfError)
        // Fallback to manual extraction if pdf-parse fails
        const buffer = await resumeFile.arrayBuffer()
        finalResumeText = extractTextFromPdf(Buffer.from(buffer))
      }
    } else if (resumeText) {
      finalResumeText = resumeText
    } else {
      return NextResponse.json(
        { error: "Envie um curriculo (PDF ou texto)" },
        { status: 400 }
      )
    }

    if (finalResumeText.trim().length < 20) {
      return NextResponse.json(
        { error: "Texto do curriculo muito curto. Envie um curriculo mais completo." },
        { status: 400 }
      )
    }

    // Log extracted text for debugging
    console.log("=== PDF EXTRACTION DEBUG ===")
    console.log("Extracted resume text length:", finalResumeText.length)
    console.log("First 1000 chars:", finalResumeText.substring(0, 1000))
    console.log("Last 500 chars:", finalResumeText.substring(Math.max(0, finalResumeText.length - 500)))
    
    // Check if key skills are in extracted text
    const keySkills = ["react", "angular", "javascript", "docker", "git", "mysql", "postgresql"]
    const foundSkills = keySkills.filter(skill => 
      finalResumeText.toLowerCase().includes(skill.toLowerCase())
    )
    console.log("Key skills found in extracted text:", foundSkills)
    console.log("============================")

    // Run analysis (agora é async devido aos embeddings)
    const result = await analyzeResume(jobDescription, finalResumeText)
    
    // Log analysis results
    console.log("=== ANALYSIS RESULTS ===")
    console.log("Skills found in resume:", result.skills.filter(s => s.foundInResume).map(s => s.skill))
    console.log("Skills score:", result.skillsScore)
    console.log("Overall score:", result.overallScore)
    console.log("========================")

    // Save to database (lazy connection)
    const sql = getDb()
    const analysisRows = await sql`
      INSERT INTO analyses (job_description, resume_text, score, skills_score, similarity_score, experience_score)
      VALUES (${jobDescription}, ${finalResumeText}, ${result.overallScore}, ${result.skillsScore}, ${result.similarityScore}, ${result.experienceScore})
      RETURNING id
    `
    const analysisId = analysisRows[0].id

    // Save skills
    for (const skill of result.skills) {
      await sql`
        INSERT INTO analysis_skills (analysis_id, skill_name, found_in_job, found_in_resume, status, category)
        VALUES (${analysisId}, ${skill.skill}, ${skill.foundInJob}, ${skill.foundInResume}, ${skill.status}, ${skill.category})
      `
    }

    return NextResponse.json({
      id: analysisId,
      ...result,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Erro ao analisar o curriculo. Tente novamente." },
      { status: 500 }
    )
  }
}

// Comprehensive PDF text extraction with aggressive strategies
function extractTextFromPdf(buffer: Buffer): string {
  const text = buffer.toString("utf-8")
  const textParts: string[] = []
  const seen = new Set<string>()

  // Helper to decode PDF string escapes
  function decodePdfString(str: string): string {
    return str
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\")
      .replace(/\\([0-7]{1,3})/g, (_, oct) => {
        try {
          const char = String.fromCharCode(parseInt(oct, 8))
          return char.charCodeAt(0) < 128 ? char : " "
        } catch {
          return " "
        }
      })
      .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => {
        try {
          const char = String.fromCharCode(parseInt(hex, 16))
          return char.charCodeAt(0) < 128 ? char : " "
        } catch {
          return " "
        }
      })
  }

  // Strategy 1: Extract from BT/ET blocks (most reliable for text-based PDFs)
  const btEtRegex = /BT\s*([\s\S]*?)\s*ET/gs
  let match
  const btMatches: string[] = []
  
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1]
    
    // Extract from Tj: (text) Tj
    const tjRegex = /\(([^)]*)\)\s*Tj/g
    let tjMatch
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const decoded = decodePdfString(tjMatch[1])
      if (decoded.trim().length > 0) {
        btMatches.push(decoded)
      }
    }

    // Extract from TJ: [(text1) (text2) ...] TJ
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g
    let arrayMatch
    while ((arrayMatch = tjArrayRegex.exec(block)) !== null) {
      const innerRegex = /\(([^)]*)\)/g
      let innerMatch
      const tjParts: string[] = []
      while ((innerMatch = innerRegex.exec(arrayMatch[1])) !== null) {
        const decoded = decodePdfString(innerMatch[1])
        tjParts.push(decoded)
      }
      if (tjParts.length > 0) {
        btMatches.push(tjParts.join(""))
      }
    }
  }

  // Strategy 2: Extract text from /Contents streams
  const contentsRegex = /\/Contents\s*(\d+)\s+\d+\s+R/gs
  const streamRefs: number[] = []
  while ((match = contentsRegex.exec(text)) !== null) {
    const objNum = parseInt(match[1])
    if (!isNaN(objNum)) streamRefs.push(objNum)
  }

  // Strategy 3: Extract from stream objects (including compressed)
  const streamRegex = /(\d+)\s+\d+\s+obj\s*<<[^>]*>>\s*stream\s*([\s\S]*?)\s*endstream/gs
  const streamTexts: string[] = []
  
  while ((match = streamRegex.exec(text)) !== null) {
    const streamContent = match[2]
    // Try to extract readable text from stream
    // Look for patterns that look like text
    const textPattern = /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\s\.\,\:\;\!\?\-\(\)\/]{5,}/g
    const found = streamContent.match(textPattern)
    if (found) {
      streamTexts.push(...found.filter(t => t.trim().length > 5))
    }
  }

  // Strategy 4: Direct text extraction - look for readable sequences
  // This catches text that might be in different PDF structures
  const directTextPattern = /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\s\.\,\:\;\!\?\-\(\)\/\&]{10,}/g
  const directMatches = text.match(directTextPattern)
  if (directMatches) {
    for (const match of directMatches) {
      // Filter out hex/code patterns
      if (!/^[0-9A-Fa-f\s]+$/.test(match) && 
          !match.startsWith("obj") && 
          !match.startsWith("endobj") &&
          match.length > 10) {
        streamTexts.push(match)
      }
    }
  }

  // Strategy 5: Extract from PDF text objects more aggressively
  // Look for any pattern that looks like (text) or [text]
  const anyTextRegex = /[\(\[][A-Za-zÀ-ÿ0-9\s\.\,\:\;\!\?\-\(\)\/]{3,}[\)\]]/g
  const anyMatches = text.match(anyTextRegex)
  if (anyMatches) {
    for (const m of anyMatches) {
      const cleaned = m.replace(/[\(\)\[\]]/g, "").trim()
      if (cleaned.length > 3 && /[A-Za-z]/.test(cleaned)) {
        streamTexts.push(cleaned)
      }
    }
  }

  // Combine all extracted text
  const allText = [...btMatches, ...streamTexts]
  
  // Remove duplicates and clean
  for (const txt of allText) {
    const cleaned = txt.trim()
    if (cleaned.length > 0 && !seen.has(cleaned.toLowerCase())) {
      textParts.push(cleaned)
      seen.add(cleaned.toLowerCase())
    }
  }

  // Join and normalize
  let result = textParts
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E\xA0-\xFF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // If we got good extraction, return it
  if (result.length > 50 && /[A-Za-z]{3,}/.test(result)) {
    return result
  }

  // Final fallback: extract ALL readable text from buffer
  const fallback = text
    .split(/[\x00-\x1F\x7F-\x9F]/) // Split on control characters
    .map(part => part.replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")) // Keep only printable
    .filter(part => part.trim().length > 5 && /[A-Za-z]{3,}/.test(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()

  return fallback.length > result.length ? fallback : result
}
