// ============================================================
// ResumeMatch AI — NLP Engine (TF-IDF + Cosine Similarity)
// ============================================================

// Master skills list with categories
const SKILL_DATABASE: Record<string, string[]> = {
  languages: [
    "python", "javascript", "typescript", "java", "c#", "c++", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "lua",
    "perl", "haskell", "elixir", "clojure",
  ],
  frameworks: [
    "react", "nextjs", "next.js", "angular", "vue", "vuejs", "vue.js",
    "svelte", "django", "flask", "fastapi", "spring", "express", "nestjs",
    "nest.js", "rails", "laravel", "flutter", "react native",
    ".net", "asp.net", "nuxt", "remix", "gatsby",
  ],
  databases: [
    "sql", "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite",
    "dynamodb", "cassandra", "elasticsearch", "neo4j", "supabase", "firebase",
    "prisma", "drizzle", "sequelize",
  ],
  devops: [
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform",
    "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", "cicd",
    "linux", "nginx", "apache", "vercel", "netlify", "heroku",
  ],
  tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "figma", "postman", "insomnia", "vscode", "vim",
    "webpack", "vite", "babel", "eslint", "prettier",
  ],
  concepts: [
    "api rest", "rest", "restful", "graphql", "grpc", "websocket",
    "microservicos", "microservices", "tdd", "bdd", "solid",
    "design patterns", "padroes de projeto", "clean code", "clean architecture",
    "ddd", "event driven", "serverless", "oauth", "jwt",
    "agile", "scrum", "kanban",
  ],
  data: [
    "machine learning", "deep learning", "nlp", "pandas", "numpy",
    "tensorflow", "pytorch", "scikit-learn", "data science",
    "big data", "spark", "hadoop", "etl", "power bi", "tableau",
  ],
  softskills: [
    "lideranca", "comunicacao", "trabalho em equipe", "proatividade",
    "resolucao de problemas", "pensamento critico", "gestao de tempo",
    "adaptabilidade", "criatividade", "colaboracao", "empatia",
    "organizacao", "autonomia", "negociacao",
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

// Experience level keywords
const EXPERIENCE_LEVELS = {
  junior: ["junior", "jr", "estagio", "estagiario", "trainee", "aprendiz", "intern", "entry level", "iniciante"],
  pleno: ["pleno", "mid", "mid-level", "intermediario", "analista"],
  senior: ["senior", "sr", "especialista", "lead", "principal", "staff", "architect"],
}

// ============================================================
// Text cleaning & tokenization
// ============================================================

export function cleanText(text: string): string {
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

function extractSkills(text: string): Map<string, string> {
  const cleaned = cleanText(text)
  const found = new Map<string, string>()

  for (const [category, skills] of Object.entries(SKILL_DATABASE)) {
    for (const skill of skills) {
      // Check for exact match or word boundary match
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "i")
      if (regex.test(cleaned)) {
        found.set(skill, category)
      }
    }
  }

  return found
}

function compareSkills(jobText: string, resumeText: string): SkillMatch[] {
  const jobSkills = extractSkills(jobText)
  const resumeSkills = extractSkills(resumeText)
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

function generateSuggestions(skills: SkillMatch[], score: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Missing skills
  const missing = skills.filter((s) => s.status === "missing")

  // Critical: technical skills missing
  const criticalCategories = ["languages", "frameworks", "databases"]
  for (const skill of missing) {
    if (criticalCategories.includes(skill.category)) {
      suggestions.push({
        type: "critical",
        message: `Inclua experiencia pratica com ${skill.skill.toUpperCase()} no seu curriculo. Esta e uma competencia-chave para esta vaga.`,
        skill: skill.skill,
      })
    }
  }

  // Important: devops and tools
  const importantCategories = ["devops", "tools", "concepts"]
  for (const skill of missing) {
    if (importantCategories.includes(skill.category)) {
      suggestions.push({
        type: "important",
        message: `Mencione conhecimento em ${skill.skill} — mesmo projetos pessoais contam.`,
        skill: skill.skill,
      })
    }
  }

  // Soft skills
  for (const skill of missing) {
    if (skill.category === "softskills") {
      suggestions.push({
        type: "nice-to-have",
        message: `Considere adicionar exemplos de ${skill.skill} na descricao das suas experiencias.`,
        skill: skill.skill,
      })
    }
  }

  // General suggestions based on score
  if (score < 40) {
    suggestions.push({
      type: "critical",
      message: "Seu curriculo tem baixa compatibilidade com esta vaga. Considere reescrever focando nas palavras-chave e tecnologias mencionadas.",
    })
  } else if (score < 60) {
    suggestions.push({
      type: "important",
      message: "Voce esta no caminho certo! Foque em adicionar as tecnologias que faltam e use termos similares aos da descricao da vaga.",
    })
  } else if (score < 80) {
    suggestions.push({
      type: "nice-to-have",
      message: "Boa compatibilidade! Refine os detalhes: adicione metricas de impacto e projetos relevantes para se destacar.",
    })
  }

  return suggestions
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

export function analyzeResume(jobDescription: string, resumeText: string): AnalysisResult {
  // 1. Tokenize
  const jobTokens = tokenize(jobDescription)
  const resumeTokens = tokenize(resumeText)

  // 2. TF-IDF + Cosine Similarity
  const { vec1, vec2 } = computeTfIdf(jobTokens, resumeTokens)
  const rawSimilarity = cosineSimilarity(vec1, vec2)
  const similarityScore = Math.round(rawSimilarity * 100)

  // 3. Skills comparison
  const skills = compareSkills(jobDescription, resumeText)
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
  const suggestions = generateSuggestions(skills, overallScore)

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
