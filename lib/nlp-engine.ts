// ============================================================
// ResumeMatch AI — NLP Engine (TF-IDF + Cosine Similarity + Semantic Embeddings)
// ============================================================

import { semanticSimilarity, extractSkillsSemantically } from './semantic-engine'

// Normalização de skills - mapeia variações para termo canônico
const SKILL_NORMALIZATION: Record<string, string> = {
  // React variations
  'reactjs': 'react',
  'react.js': 'react',
  'react-js': 'react',
  'reactjs': 'react',
  
  // JavaScript variations
  'js': 'javascript',
  'ecmascript': 'javascript',
  'es6': 'javascript',
  'es2015': 'javascript',
  
  // Docker variations
  'docker-compose': 'docker compose',
  'dockercompose': 'docker compose',
  
  // Node variations
  'nodejs': 'node',
  'node.js': 'node',
  
  // HTML/CSS variations
  'html5': 'html',
  'css3': 'css',
  
  // REST variations
  'rest': 'apis rest',
  'restful': 'apis rest',
  'rest api': 'apis rest',
  
  // PostgreSQL variations
  'postgres': 'postgresql',
  
  // MongoDB variations
  'mongo': 'mongodb',
  
  // Vue variations
  'vuejs': 'vue',
  'vue.js': 'vue',
  'vue3': 'vue',
  
  // Angular variations
  'angularjs': 'angular',
  
  // Next.js variations
  'nextjs': 'next.js',
  'next': 'next.js',
}

// Master skills list with categories - Expanded with variations and synonyms
const SKILL_DATABASE: Record<string, string[]> = {
  languages: [
    "python", "javascript", "typescript", "java", "c#", "c++", "csharp", "cpp",
    "golang", "go language", "rust", "ruby", "php", "swift", "kotlin", "scala", 
    "r language", "r programming", "dart", "lua", "perl", "haskell", "elixir", "clojure",
    "node", "nodejs", "node.js", "html", "html5", "css", "css3",
  ],
  frameworks: [
    "react", "reactjs", "react.js", "nextjs", "next.js", "next",
    "angular", "angularjs", "vue", "vuejs", "vue.js", "vue3",
    "svelte", "django", "flask", "fastapi", "spring", "spring boot",
    "express", "expressjs", "nestjs", "nest.js", "nest",
    "rails", "ruby on rails", "laravel", "flutter", "react native",
    ".net", "asp.net", "aspnet", "nuxt", "remix", "gatsby",
    "sveltekit", "astro", "solidjs", "qwik",
  ],
  databases: [
    "sql", "postgresql", "postgres", "mysql", "mongodb", "mongo",
    "redis", "sqlite", "oracle", "sql server", "mssql",
    "dynamodb", "cassandra", "elasticsearch", "neo4j",
    "supabase", "firebase", "firestore",
    "prisma", "drizzle", "sequelize", "typeorm", "knex",
  ],
  devops: [
    "docker", "docker compose", "docker-compose", "dockercompose",
    "kubernetes", "k8s", "aws", "amazon web services",
    "azure", "gcp", "google cloud", "terraform", "ansible",
    "jenkins", "github actions", "gitlab ci", "ci/cd", "cicd",
    "linux", "ubuntu", "debian", "centos", "nginx", "apache",
    "vercel", "netlify", "heroku", "cloudflare",
    "ec2", "s3", "lambda", "ecs", "eks",
  ],
  tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "figma", "postman", "insomnia", "vscode", "visual studio code",
    "vim", "neovim", "webpack", "vite", "babel", "eslint", "prettier",
    "npm", "yarn", "pnpm",
  ],
  concepts: [
    "api rest", "rest", "restful", "rest api", "apis rest",
    "graphql", "grpc", "websocket", "websockets",
    "microservicos", "microservices", "micro servicos",
    "tdd", "test driven development", "bdd", "solid", "solid principles",
    "design patterns", "padroes de projeto", "clean code",
    "clean architecture", "ddd", "domain driven design",
    "event driven", "serverless", "oauth", "oauth2", "jwt",
    "agile", "scrum", "kanban", "ci/cd", "devops",
  ],
  data: [
    "machine learning", "deep learning", "dl", "nlp",
    "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn",
    "scikit learn", "data science", "big data", "spark", "hadoop",
    "etl", "power bi", "tableau", "data analysis", "analise de dados",
  ],
  softskills: [
    "lideranca", "comunicacao", "trabalho em equipe", "proatividade",
    "resolucao de problemas", "pensamento critico", "gestao de tempo",
    "adaptabilidade", "criatividade", "colaboracao", "empatia",
    "organizacao", "autonomia", "negociacao", "comunicacao interpessoal",
  ],
}

// Portuguese stop words for text cleaning
const STOP_WORDS = new Set([
  "a", "o", "e", "de", "da", "do", "em", "um", "uma", "para", "com",
  "no", "na", "os", "as", "dos", "das", "por", "se", "que", "ao",
  "ou", "ser", "ter", "seu", "sua", "mais", "como", "mas", "foi",
  "the", "and", "or", "in", "on", "at", "to", "for", "of", "with",
  "is", "are", "was", "be", "has", "have", "had", "this", "that",
  "from", "an", "not", "but", "by", "we", "you", "it", "our",
  "nos", "nas", "pelo", "pela", "sobre", "entre", "ate", "muito",
  "tambem", "ja", "so", "ainda", "quando", "onde", "como",
])

// Experience level keywords - Expanded detection
const EXPERIENCE_LEVELS = {
  junior: [
    "junior", "jr", "júnior", "estagio", "estágio", "estagiario", "estagiário",
    "trainee", "aprendiz", "intern", "internship", "entry level", "entry-level",
    "iniciante", "iniciante em", "primeiro emprego", "sem experiencia",
    "sem experiência", "sem experiencia previa", "sem experiência prévia",
    "comecando", "começando", "inicio de carreira", "início de carreira",
  ],
  pleno: [
    "pleno", "mid", "mid-level", "mid level", "intermediario", "intermediário",
    "analista", "desenvolvedor", "developer", "programador", "programmer",
    "2 anos", "3 anos", "4 anos", "dois anos", "tres anos", "quatro anos",
    "2+ anos", "3+ anos", "experiencia media", "experiência média",
  ],
  senior: [
    "senior", "sr", "sênior", "especialista", "specialist", "lead", "lider",
    "leader", "principal", "staff", "architect", "arquiteto", "tech lead",
    "5 anos", "5+ anos", "cinco anos", "mais de 5 anos",
    "experiencia avancada", "experiência avançada", "vasta experiencia",
    "vasta experiência", "expert", "expertise",
  ],
}

// ============================================================
// Text cleaning & tokenization
// ============================================================

export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s.#+\/\-]/g, " ") // keep alphanumeric and key symbols (preserve #, ., +, /, -)
    .replace(/\s+/g, " ")
    .trim()
}

// Preserve original text for skill extraction (less aggressive cleaning)
function cleanTextForSkills(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s.#+\/\-]/g, " ") // keep alphanumeric and key symbols
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(text: string): string[] {
  const cleaned = cleanText(text)
  return cleaned
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
}

// ============================================================
// TF-IDF Implementation
// ============================================================

function termFrequency(terms: string[]): Map<string, number> {
  const freq = new Map<string, number>()
  for (const term of terms) {
    freq.set(term, (freq.get(term) || 0) + 1)
  }
  // Normalize by document length
  const len = terms.length || 1
  for (const [term, count] of freq) {
    freq.set(term, count / len)
  }
  return freq
}

function computeTfIdf(
  doc1Terms: string[],
  doc2Terms: string[],
): { vec1: number[]; vec2: number[] } {
  const tf1 = termFrequency(doc1Terms)
  const tf2 = termFrequency(doc2Terms)

  // Get all unique terms
  const allTerms = new Set([...tf1.keys(), ...tf2.keys()])
  const numDocs = 2

  const vec1: number[] = []
  const vec2: number[] = []

  for (const term of allTerms) {
    // IDF: log(numDocs / docsContainingTerm)
    let docsWithTerm = 0
    if (tf1.has(term)) docsWithTerm++
    if (tf2.has(term)) docsWithTerm++
    const idf = Math.log(numDocs / docsWithTerm)

    vec1.push((tf1.get(term) || 0) * idf)
    vec2.push((tf2.get(term) || 0) * idf)
  }

  return { vec1, vec2 }
}

// ============================================================
// Cosine Similarity
// ============================================================

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0
  let mag1 = 0
  let mag2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    mag1 += vec1[i] * vec1[i]
    mag2 += vec2[i] * vec2[i]
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2)
  if (magnitude === 0) return 0

  return dotProduct / magnitude
}

// ============================================================
// Skills Extraction
// ============================================================

export interface SkillMatch {
  skill: string
  category: string
  foundInJob: boolean
  foundInResume: boolean
  status: "match" | "missing" | "extra"
}

async function extractSkills(text: string, useSemantic: boolean = true): Promise<Map<string, string>> {
  // Keep original text for better matching
  const originalText = text.toLowerCase()
  const cleaned = cleanTextForSkills(text)
  const found = new Map<string, string>()

  // Create multiple normalized versions for flexible matching
  const normalizedText = cleaned
    .replace(/[,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Also preserve original with minimal cleaning for exact matches
  const originalNormalized = originalText
    .replace(/[,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Combine both for comprehensive search
  const searchText = normalizedText + " " + originalNormalized

  for (const [category, skills] of Object.entries(SKILL_DATABASE)) {
    // Sort skills by length (longer first) to avoid partial matches
    const sortedSkills = [...skills].sort((a, b) => b.length - a.length)
    
    for (const skill of sortedSkills) {
      // Skip if already found
      if (found.has(skill)) continue
      
      // Escape special regex characters
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      
      // Create multiple patterns - be more permissive
      const patterns = [
        // Pattern 1: Word boundary (most reliable)
        new RegExp(`\\b${escapedSkill}\\b`, "i"),
        // Pattern 2: With any non-alphanumeric before/after
        new RegExp(`[^a-z0-9]${escapedSkill}[^a-z0-9]`, "i"),
        // Pattern 3: Start or end of string
        new RegExp(`(^|\\s)${escapedSkill}(\\s|$)`, "i"),
        // Pattern 4: In lists with punctuation
        new RegExp(`[,:;]\\s*${escapedSkill}\\s*[,:;]`, "i"),
        // Pattern 5: After common section headers
        new RegExp(`(front-end|frontend|back-end|backend|devops|tools|frameworks|linguagens|bancos|databases|habilidades|skills)[:;]?\\s*${escapedSkill}`, "i"),
      ]
      
      let matched = false
      
      for (const regex of patterns) {
        // Test in all text versions
        const testTexts = [normalizedText, originalNormalized, searchText]
        
        for (const testText of testTexts) {
          if (regex.test(testText)) {
            // Get all matches for validation
            const matches = [...testText.matchAll(new RegExp(regex.source, "gi"))]
            
            for (const match of matches) {
              if (!match.index) continue
              
              const matchIndex = match.index
              const matchText = match[0]
              const beforeChar = matchIndex > 0 ? testText[matchIndex - 1] : " "
              const afterIndex = matchIndex + matchText.length
              const afterChar = afterIndex < testText.length ? testText[afterIndex] : " "
              
              // Very lenient validation - accept if surrounded by non-alphanumeric or spaces
              const isValidBoundary = 
                /[^a-z0-9]/.test(beforeChar) && /[^a-z0-9]/.test(afterChar) ||
                beforeChar === " " && (afterChar === " " || /[,;:\.]/.test(afterChar)) ||
                /[,;:]/.test(beforeChar) && /[^a-z0-9]/.test(afterChar) ||
                matchIndex === 0 || afterIndex >= testText.length // At start/end of text
              
              if (isValidBoundary) {
                found.set(skill, category)
                matched = true
                break
              }
            }
            
            if (matched) break
          }
        }
        
        if (matched) break
      }
      
      // Handle conflicts with shorter/longer variations
      if (matched) {
        for (const [foundSkill, foundCategory] of Array.from(found.entries())) {
          if (foundSkill !== skill) {
            // If one is substring of another, keep the longer one
            if (skill.includes(foundSkill) && skill.length > foundSkill.length) {
              found.delete(foundSkill)
              found.set(skill, category)
            } else if (foundSkill.includes(skill) && foundSkill.length > skill.length) {
              found.delete(skill)
              found.set(foundSkill, foundCategory)
              matched = false
              break
            }
          }
        }
      }
    }
  }

  // Complementar com detecção semântica se habilitada
  if (useSemantic) {
    try {
      // Passar skills já encontradas para otimizar (não re-verificar)
      const alreadyFoundSet = new Set(found.keys())
      const semanticSkills = await extractSkillsSemantically(text, SKILL_DATABASE, alreadyFoundSet)
      
      // Adicionar skills encontradas semanticamente que não foram encontradas por regex
      for (const [skill, { category, confidence }] of semanticSkills.entries()) {
        if (!found.has(skill) && confidence > 0.35) {
          // Só adicionar se confiança for boa
          found.set(skill, category)
        }
        // Se já foi encontrada por regex, manter (regex é mais rápido e confiável para exact matches)
      }
    } catch (error) {
      console.warn('Semantic skill extraction failed, using regex only:', error)
      // Continuar apenas com regex se embeddings falharem
    }
  }
  
  // Normalizar skills encontradas (mapear variações para termos canônicos)
  const normalized = new Map<string, string>()
  for (const [skill, category] of found.entries()) {
    const normalizedSkill = SKILL_NORMALIZATION[skill.toLowerCase()] || skill
    // Se já existe a versão normalizada, manter a mais específica
    if (!normalized.has(normalizedSkill) || skill.length > normalizedSkill.length) {
      normalized.set(normalizedSkill, category)
    }
  }
  
  return normalized
}

async function compareSkills(jobText: string, resumeText: string, useSemantic: boolean = true): Promise<SkillMatch[]> {
  const jobSkills = await extractSkills(jobText, useSemantic)
  const resumeSkills = await extractSkills(resumeText, useSemantic)
  const results: SkillMatch[] = []
  const seen = new Set<string>()

  // Skills in job
  for (const [skill, category] of jobSkills) {
    const inResume = resumeSkills.has(skill)
    results.push({
      skill,
      category,
      foundInJob: true,
      foundInResume: inResume,
      status: inResume ? "match" : "missing",
    })
    seen.add(skill)
  }

  // Extra skills in resume (not in job)
  for (const [skill, category] of resumeSkills) {
    if (!seen.has(skill)) {
      results.push({
        skill,
        category,
        foundInJob: false,
        foundInResume: true,
        status: "extra",
      })
    }
  }

  return results
}

// ============================================================
// Experience Level Detection
// ============================================================

function detectExperienceLevel(text: string): string {
  const cleaned = cleanText(text)
  for (const [level, keywords] of Object.entries(EXPERIENCE_LEVELS)) {
    for (const keyword of keywords) {
      if (cleaned.includes(keyword)) return level
    }
  }
  return "nao especificado"
}

// ============================================================
// Generate Suggestions
// ============================================================

export interface Suggestion {
  type: "critical" | "important" | "nice-to-have"
  message: string
  skill?: string
}

function generateSuggestions(skills: SkillMatch[], score: number, jobLevel: string, resumeLevel: string): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Missing skills
  const missing = skills.filter((s) => s.status === "missing")
  const matched = skills.filter((s) => s.status === "match")

  // Group missing skills by category for better suggestions
  const missingByCategory: Record<string, SkillMatch[]> = {}
  for (const skill of missing) {
    if (!missingByCategory[skill.category]) {
      missingByCategory[skill.category] = []
    }
    missingByCategory[skill.category].push(skill)
  }

  // Critical: technical skills missing (limit to top 5 most important)
  const criticalCategories = ["languages", "frameworks", "databases"]
  const criticalMissing = missing.filter(s => criticalCategories.includes(s.category)).slice(0, 5)
  
  for (const skill of criticalMissing) {
    const categoryLabel = getCategoryLabel(skill.category)
    suggestions.push({
      type: "critical",
      message: `🔴 CRÍTICO: Adicione ${skill.skill.toUpperCase()} na seção de habilidades técnicas. Se você já tem experiência, mencione projetos ou cursos que demonstrem conhecimento prático.`,
      skill: skill.skill,
    })
  }

  // Important: devops and tools (limit to top 3)
  const importantCategories = ["devops", "tools"]
  const importantMissing = missing.filter(s => importantCategories.includes(s.category)).slice(0, 3)
  
  for (const skill of importantMissing) {
    suggestions.push({
      type: "important",
      message: `🟡 IMPORTANTE: Inclua ${skill.skill} mesmo que seja em projetos pessoais ou estudos. Mencione onde você usou (ex: "Projeto X usando ${skill.skill} para...").`,
      skill: skill.skill,
    })
  }

  // Concepts (limit to top 2)
  const conceptsMissing = missing.filter(s => s.category === "concepts").slice(0, 2)
  for (const skill of conceptsMissing) {
    suggestions.push({
      type: "important",
      message: `💡 Adicione ${skill.skill} na descrição das suas experiências. Mostre como você aplica esse conceito na prática.`,
      skill: skill.skill,
    })
  }

  // Soft skills (limit to top 2)
  const softskillsMissing = missing.filter(s => s.category === "softskills").slice(0, 2)
  for (const skill of softskillsMissing) {
    suggestions.push({
      type: "nice-to-have",
      message: `✨ Mencione ${skill.skill} com exemplos concretos nas descrições de experiência (ex: "Demonstrei ${skill.skill} ao...").`,
      skill: skill.skill,
    })
  }

  // Experience level mismatch
  if (jobLevel !== "nao especificado" && resumeLevel !== "nao especificado" && jobLevel !== resumeLevel) {
    if (jobLevel === "junior" && (resumeLevel === "pleno" || resumeLevel === "senior")) {
      suggestions.push({
        type: "important",
        message: "⚠️ A vaga é para JÚNIOR, mas seu currículo indica nível mais avançado. Considere destacar sua disposição para aprender e crescimento, ou procure vagas mais alinhadas ao seu nível.",
      })
    } else if (jobLevel === "senior" && resumeLevel === "junior") {
      suggestions.push({
        type: "critical",
        message: "🔴 A vaga requer nível SÊNIOR, mas seu currículo indica JÚNIOR. Foque em adicionar mais experiências, projetos complexos e resultados mensuráveis para demonstrar senioridade.",
      })
    }
  }

  // Score-based actionable suggestions
  if (score < 40) {
    const topMissing = missing.slice(0, 3).map(s => s.skill).join(", ")
    suggestions.push({
      type: "critical",
      message: `📉 Score baixo (${score}%). AÇÃO IMEDIATA: Reescreva seu currículo incluindo as palavras-chave da vaga. Priorize: ${topMissing}. Use os mesmos termos que aparecem na descrição da vaga.`,
    })
  } else if (score < 60) {
    const topMissing = missing.slice(0, 2).map(s => s.skill).join(" e ")
    suggestions.push({
      type: "important",
      message: `📊 Você está no caminho certo (${score}%)! Para melhorar: adicione ${topMissing} e reformule experiências usando termos similares aos da vaga.`,
    })
  } else if (score < 80) {
    suggestions.push({
      type: "nice-to-have",
      message: `✅ Boa compatibilidade (${score}%)! Para se destacar: adicione métricas de impacto (ex: "Aumentei performance em X%"), resultados quantificáveis e projetos relevantes no topo do currículo.`,
    })
  } else {
    suggestions.push({
      type: "nice-to-have",
      message: `🎉 Excelente compatibilidade (${score}%)! Seu currículo está bem alinhado. Dica final: personalize a carta de apresentação destacando os pontos fortes identificados nesta análise.`,
    })
  }

  // If many skills matched, give positive feedback
  if (matched.length > 5) {
    suggestions.push({
      type: "nice-to-have",
      message: `💪 Você já possui ${matched.length} habilidades técnicas que a vaga requer! Destaque essas competências no topo do currículo e na carta de apresentação.`,
    })
  }

  return suggestions.slice(0, 10) // Limit to 10 most relevant suggestions
}

// ============================================================
// Main Analysis Function
// ============================================================

export interface AnalysisResult {
  overallScore: number
  similarityScore: number
  skillsScore: number
  experienceScore: number
  skills: SkillMatch[]
  suggestions: Suggestion[]
  jobLevel: string
  resumeLevel: string
  categoryScores: Record<string, { matched: number; total: number }>
  strengths: string[]
  gaps: string[]
}

export async function analyzeResume(jobDescription: string, resumeText: string): Promise<AnalysisResult> {
  // 1. Tokenize
  const jobTokens = tokenize(jobDescription)
  const resumeTokens = tokenize(resumeText)

  // 2. TF-IDF + Cosine Similarity (método tradicional)
  const { vec1, vec2 } = computeTfIdf(jobTokens, resumeTokens)
  const rawSimilarity = cosineSimilarity(vec1, vec2)
  const tfidfScore = Math.round(rawSimilarity * 100)

  // 2.1. Similaridade Semântica (embeddings) - complementa TF-IDF
  let semanticScore = 0
  try {
    const semanticSim = await semanticSimilarity(jobDescription, resumeText)
    semanticScore = Math.round(semanticSim * 100)
  } catch (error) {
    console.warn('Semantic similarity failed, using TF-IDF only:', error)
    semanticScore = tfidfScore // Fallback para TF-IDF
  }

  // Combinar scores: 60% semântico (mais preciso) + 40% TF-IDF (mais rápido)
  const similarityScore = Math.round(semanticScore * 0.6 + tfidfScore * 0.4)

  // 3. Skills comparison (híbrido: regex + semântico)
  const skills = await compareSkills(jobDescription, resumeText, true)
  const matchedSkills = skills.filter((s) => s.status === "match").length
  const jobRequiredSkills = skills.filter((s) => s.foundInJob).length
  const skillsScore = jobRequiredSkills > 0
    ? Math.round((matchedSkills / jobRequiredSkills) * 100)
    : 50

  // 4. Experience level matching
  const jobLevel = detectExperienceLevel(jobDescription)
  const resumeLevel = detectExperienceLevel(resumeText)
  let experienceScore = 50 // default
  if (jobLevel !== "nao especificado" && resumeLevel !== "nao especificado") {
    experienceScore = jobLevel === resumeLevel ? 100 : 40
  } else if (resumeLevel !== "nao especificado") {
    experienceScore = 60
  }

  // 5. Category breakdown
  const categoryScores: Record<string, { matched: number; total: number }> = {}
  for (const skill of skills) {
    if (skill.foundInJob) {
      if (!categoryScores[skill.category]) {
        categoryScores[skill.category] = { matched: 0, total: 0 }
      }
      categoryScores[skill.category].total++
      if (skill.status === "match") {
        categoryScores[skill.category].matched++
      }
    }
  }

  // 6. Overall weighted score
  const overallScore = Math.round(
    skillsScore * 0.6 +
    similarityScore * 0.25 +
    experienceScore * 0.15
  )

  // 7. Strengths & Gaps
  const strengths: string[] = []
  const gaps: string[] = []

  for (const [cat, scores] of Object.entries(categoryScores)) {
    const pct = scores.total > 0 ? scores.matched / scores.total : 0
    const label = getCategoryLabel(cat)
    if (pct >= 0.7) {
      strengths.push(`Forte em ${label} (${Math.round(pct * 100)}% match)`)
    } else if (pct < 0.4) {
      gaps.push(`Lacuna em ${label} (${Math.round(pct * 100)}% match)`)
    }
  }

  if (similarityScore > 60) {
    strengths.push("Linguagem do curriculo alinhada com a vaga")
  }
  if (similarityScore < 30) {
    gaps.push("Vocabulario muito diferente da vaga — adapte os termos")
  }

  // 8. Suggestions
  const suggestions = generateSuggestions(skills, overallScore, jobLevel, resumeLevel)

  return {
    overallScore: Math.min(overallScore, 100),
    similarityScore,
    skillsScore,
    experienceScore,
    skills,
    suggestions,
    jobLevel,
    resumeLevel,
    categoryScores,
    strengths,
    gaps,
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    languages: "Linguagens",
    frameworks: "Frameworks",
    databases: "Bancos de Dados",
    devops: "DevOps/Infra",
    tools: "Ferramentas",
    concepts: "Conceitos",
    data: "Dados/ML",
    softskills: "Soft Skills",
  }
  return labels[category] || category
}
