// ============================================================
// Semantic Engine - Embeddings para análise semântica
// ============================================================

import { pipeline, Pipeline } from '@xenova/transformers'

// Cache do modelo para não recarregar a cada requisição
let embeddingPipeline: Pipeline | null = null

// Inicializar o modelo de embeddings (lazy loading)
async function getEmbeddingModel(): Promise<Pipeline> {
  if (!embeddingPipeline) {
    // Usar modelo leve e rápido: all-MiniLM-L6-v2
    // Alternativas: sentence-transformers/all-mpnet-base-v2 (mais preciso, mais lento)
    embeddingPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        quantized: true, // Usar versão quantizada (menor, mais rápida)
      }
    )
  }
  return embeddingPipeline
}

// Calcular embedding de um texto
export async function getTextEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbeddingModel()
    const output = await model(text, { pooling: 'mean', normalize: true })
    
    // Converter tensor para array
    if (Array.isArray(output)) {
      return output as number[]
    }
    
    // Se for tensor, converter
    if (output && typeof output === 'object' && 'data' in output) {
      return Array.from(output.data as any)
    }
    
    return output as number[]
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Fallback: retornar vetor vazio (sistema usará métodos tradicionais)
    return []
  }
}

// Calcular similaridade semântica entre dois textos
export async function semanticSimilarity(text1: string, text2: string): Promise<number> {
  try {
    const embedding1 = await getTextEmbedding(text1)
    const embedding2 = await getTextEmbedding(text2)
    
    if (embedding1.length === 0 || embedding2.length === 0) {
      return 0
    }
    
    return cosineSimilarity(embedding1, embedding2)
  } catch (error) {
    console.error('Error calculating semantic similarity:', error)
    return 0
  }
}

// Cosine similarity entre dois vetores
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    return 0
  }
  
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

// Verificar se um texto menciona uma skill semanticamente
// Compara o texto com variações da skill usando embeddings
export async function hasSkillSemantically(
  text: string,
  skillVariations: string[]
): Promise<{ found: boolean; confidence: number; matchedVariation?: string }> {
  try {
    const textEmbedding = await getTextEmbedding(text)
    
    if (textEmbedding.length === 0) {
      return { found: false, confidence: 0 }
    }
    
    let maxSimilarity = 0
    let bestMatch: string | undefined
    
    // Comparar com cada variação da skill
    for (const variation of skillVariations) {
      const variationEmbedding = await getTextEmbedding(variation)
      
      if (variationEmbedding.length > 0) {
        const similarity = cosineSimilarityHelper(textEmbedding, variationEmbedding)
        
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          bestMatch = variation
        }
      }
    }
    
    // Threshold: 0.3 é um bom balanço (ajustável)
    // Valores típicos: 0.3-0.4 para match, 0.5+ para match forte
    const threshold = 0.3
    const found = maxSimilarity >= threshold
    
    return {
      found,
      confidence: maxSimilarity,
      matchedVariation: found ? bestMatch : undefined,
    }
  } catch (error) {
    console.error('Error in semantic skill detection:', error)
    return { found: false, confidence: 0 }
  }
}

// Extrair skills do texto usando embeddings (complementa detecção por regex)
// Otimizado: só verifica skills que não foram encontradas por regex
export async function extractSkillsSemantically(
  text: string,
  skillDatabase: Record<string, string[]>,
  alreadyFound: Set<string> = new Set()
): Promise<Map<string, { category: string; confidence: number }>> {
  const found = new Map<string, { category: string; confidence: number }>()
  
  // Criar embedding do texto uma vez (otimização)
  let textEmbedding: number[] = []
  try {
    textEmbedding = await getTextEmbedding(text)
  } catch (error) {
    console.warn('Failed to generate text embedding for semantic search')
    return found
  }
  
  if (textEmbedding.length === 0) {
    return found
  }
  
  // Processar apenas skills que não foram encontradas por regex
  // Focar nas mais importantes primeiro
  const priorityCategories = ['languages', 'frameworks', 'databases', 'devops']
  const allSkills: Array<{ skill: string; category: string }> = []
  
  for (const [category, skills] of Object.entries(skillDatabase)) {
    const isPriority = priorityCategories.includes(category)
    for (const skill of skills) {
      // Pular se já foi encontrada por regex
      if (alreadyFound.has(skill)) continue
      
      allSkills.push({ skill, category })
    }
  }
  
  // Ordenar: prioridade primeiro, depois por frequência esperada
  allSkills.sort((a, b) => {
    const aPriority = priorityCategories.includes(a.category) ? 1 : 0
    const bPriority = priorityCategories.includes(b.category) ? 1 : 0
    return bPriority - aPriority
  })
  
  // Processar em lotes menores para não sobrecarregar
  const batchSize = 10
  for (let i = 0; i < Math.min(allSkills.length, 50); i += batchSize) {
    // Limitar a 50 skills para não demorar muito
    const batch = allSkills.slice(i, i + batchSize)
    
    await Promise.all(
      batch.map(async ({ skill, category }) => {
        // Criar variações comuns da skill
        const variations = [
          skill,
          skill.toLowerCase(),
          skill.replace(/[-_]/g, ' '),
        ]
        
        // Verificar cada variação
        for (const variation of variations) {
          try {
            const variationEmbedding = await getTextEmbedding(variation)
            
            if (variationEmbedding.length > 0) {
              const similarity = cosineSimilarityHelper(textEmbedding, variationEmbedding)
              
              // Threshold mais alto para evitar falsos positivos
              if (similarity > 0.35) {
                const existing = found.get(skill)
                if (!existing || similarity > existing.confidence) {
                  found.set(skill, {
                    category,
                    confidence: similarity,
                  })
                  break // Encontrou, não precisa testar outras variações
                }
              }
            }
          } catch (error) {
            // Continuar com próxima variação
            continue
          }
        }
      })
    )
  }
  
  return found
}

// Helper para cosine similarity
function cosineSimilarityHelper(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    return 0
  }
  
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

