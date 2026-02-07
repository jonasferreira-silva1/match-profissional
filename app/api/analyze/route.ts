import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { analyzeResume } from "@/lib/nlp-engine"

const sql = neon(process.env.DATABASE_URL!)

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
      // Read PDF as text - extract readable content
      const buffer = await resumeFile.arrayBuffer()
      finalResumeText = extractTextFromPdf(Buffer.from(buffer))
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

    // Run analysis
    const result = analyzeResume(jobDescription, finalResumeText)

    // Save to database
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

// Simple PDF text extraction (reads raw text content from PDF binary)
function extractTextFromPdf(buffer: Buffer): string {
  const text = buffer.toString("utf-8")

  // Extract text between BT and ET markers (PDF text objects)
  const textParts: string[] = []
  const btEtRegex = /BT\s([\s\S]*?)ET/g
  let match

  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1]
    // Extract text from Tj and TJ operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g
    let tjMatch
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textParts.push(tjMatch[1])
    }

    // TJ array
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g
    let arrayMatch
    while ((arrayMatch = tjArrayRegex.exec(block)) !== null) {
      const innerRegex = /\(([^)]*)\)/g
      let innerMatch
      while ((innerMatch = innerRegex.exec(arrayMatch[1])) !== null) {
        textParts.push(innerMatch[1])
      }
    }
  }

  // If PDF text extraction works
  if (textParts.length > 0) {
    return textParts.join(" ").replace(/\s+/g, " ").trim()
  }

  // Fallback: extract any readable text
  const readable = text
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return readable
}
