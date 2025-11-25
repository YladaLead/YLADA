/**
 * Sistema de Detecção Automática Inteligente para Importação
 * Analisa planilhas personalizadas e mapeia automaticamente para campos padrão
 */

export interface MappingScore {
  sourceColumn: string
  targetField: string
  confidence: number // 0-100
  reasons: string[]
  dataType?: 'text' | 'email' | 'phone' | 'date' | 'number' | 'weight' | 'height' | 'measurement'
}

export interface DetectionResult {
  mappings: MappingScore[]
  overallConfidence: number
  highConfidence: MappingScore[] // >80%
  mediumConfidence: MappingScore[] // 50-80%
  lowConfidence: MappingScore[] // <50%
  unmappedColumns: string[]
}

/**
 * Calcula similaridade entre duas strings usando múltiplos algoritmos
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1)
  const s2 = normalizeString(str2)
  
  if (s1 === s2) return 1.0
  
  // Levenshtein distance (normalizado)
  const maxLen = Math.max(s1.length, s2.length)
  if (maxLen === 0) return 1.0
  
  const distance = levenshteinDistance(s1, s2)
  const levenshteinScore = 1 - (distance / maxLen)
  
  // Jaccard similarity (palavras em comum)
  const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 2))
  const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 2))
  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])
  const jaccardScore = union.size > 0 ? intersection.size / union.size : 0
  
  // Substring match (uma contém a outra)
  let substringScore = 0
  if (s1.includes(s2) || s2.includes(s1)) {
    substringScore = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length)
  }
  
  // Combinar scores (peso maior para Levenshtein)
  return (levenshteinScore * 0.5) + (jaccardScore * 0.3) + (substringScore * 0.2)
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[✔✓✗✘📧📱📞📝💬]/g, '') // Remove emojis e símbolos
    .replace(/[^\w\s]/g, ' ') // Remove caracteres especiais
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim()
}

/**
 * Detecta o tipo de dados de uma coluna analisando o conteúdo
 */
export function detectDataType(columnData: any[]): 'text' | 'email' | 'phone' | 'date' | 'number' | 'weight' | 'height' | 'measurement' | null {
  if (!columnData || columnData.length === 0) return null
  
  const sample = columnData.slice(0, Math.min(10, columnData.length)).filter(v => v && String(v).trim())
  if (sample.length === 0) return null
  
  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (sample.every(v => emailPattern.test(String(v)))) return 'email'
  
  // Telefone (formato brasileiro)
  const phonePattern = /[\d\s\(\)\-]{10,15}/
  const phoneCount = sample.filter(v => phonePattern.test(String(v).replace(/\D/g, '')) && String(v).replace(/\D/g, '').length >= 10).length
  if (phoneCount / sample.length > 0.7) return 'phone'
  
  // Data (DD/MM/YYYY, YYYY-MM-DD, etc)
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{1,2}-\d{1,2}-\d{4}$/
  ]
  const dateCount = sample.filter(v => datePatterns.some(p => p.test(String(v)))).length
  if (dateCount / sample.length > 0.7) return 'date'
  
  // Números
  const numbers = sample.map(v => parseFloat(String(v).replace(/[^\d.,]/g, '').replace(',', '.'))).filter(n => !isNaN(n))
  if (numbers.length / sample.length > 0.7) {
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length
    
    // Peso (30-300 kg)
    if (avg >= 30 && avg <= 300) return 'weight'
    
    // Altura (1.40-2.20 m) ou (140-220 cm)
    if ((avg >= 1.40 && avg <= 2.20) || (avg >= 140 && avg <= 220)) return 'height'
    
    // Medidas (circunferências, dobras) - números menores
    if (avg >= 10 && avg <= 200) return 'measurement'
    
    // Número genérico
    return 'number'
  }
  
  // Texto (padrão)
  return 'text'
}

/**
 * Padrões conhecidos de anotação
 */
const KNOWN_PATTERNS: Record<string, Array<{ patterns: string[], weight: number, dataType?: string }>> = {
  name: [
    { patterns: ['nome', 'name', 'cliente', 'paciente'], weight: 1.0 },
    { patterns: ['ficha', 'cadastro', 'avaliação', 'avaliacao'], weight: 0.8 },
    { patterns: ['pessoa', 'contato', 'aluno', 'atleta'], weight: 0.7 },
    { patterns: ['nome completo', 'nome_completo', 'nomecompleto'], weight: 1.0 },
    { patterns: ['identificação', 'identificacao', 'id cliente'], weight: 0.6 },
    { patterns: ['dados pessoais', 'dados_pessoais'], weight: 0.5 }
  ],
  email: [
    { patterns: ['email', 'e-mail', 'mail'], weight: 1.0 },
    { patterns: ['correio'], weight: 0.9, dataType: 'email' }
  ],
  phone: [
    { patterns: ['telefone', 'phone', 'fone', 'celular'], weight: 1.0 },
    { patterns: ['whatsapp', 'whats', 'contato'], weight: 0.9, dataType: 'phone' }
  ],
  weight: [
    { patterns: ['peso', 'weight'], weight: 1.0 },
    { patterns: ['kg', 'kilograma', 'quilograma'], weight: 0.95, dataType: 'weight' },
    { patterns: ['massa', 'peso atual', 'peso_atual', 'pesoatual'], weight: 0.7, dataType: 'weight' },
    { patterns: ['peso inicial', 'peso_inicial'], weight: 0.8, dataType: 'weight' },
    { patterns: ['peso corporal', 'peso_corporal'], weight: 0.75, dataType: 'weight' }
  ],
  height: [
    { patterns: ['altura', 'height', 'estatura'], weight: 1.0 },
    { patterns: ['cm', 'centímetros', 'centimetros'], weight: 0.9, dataType: 'height' },
    { patterns: ['metro', 'm ', 'metros'], weight: 0.85, dataType: 'height' },
    { patterns: ['tamanho', 'stature'], weight: 0.6, dataType: 'height' }
  ],
  birth_date: [
    { patterns: ['nascimento', 'birth', 'data nascimento'], weight: 1.0 },
    { patterns: ['aniversário', 'idade'], weight: 0.8, dataType: 'date' }
  ],
  gender: [
    { patterns: ['gênero', 'gender', 'sexo'], weight: 1.0 }
  ],
  waist_circumference: [
    { patterns: ['cintura', 'waist'], weight: 1.0 },
    { patterns: ['abdomen', 'abdominal'], weight: 0.8, dataType: 'measurement' }
  ],
  hip_circumference: [
    { patterns: ['quadril', 'hip'], weight: 1.0 },
    { patterns: ['bacia'], weight: 0.7, dataType: 'measurement' }
  ],
  body_fat_percentage: [
    { patterns: ['gordura', 'body fat', 'bf'], weight: 1.0 },
    { patterns: ['% gordura', '%bf'], weight: 0.95, dataType: 'number' }
  ],
  muscle_mass: [
    { patterns: ['massa muscular', 'muscle', 'massa magra'], weight: 1.0 },
    { patterns: ['mm', 'lean mass'], weight: 0.9, dataType: 'number' }
  ],
  waist_circumference: [
    { patterns: ['cintura', 'waist'], weight: 1.0 },
    { patterns: ['abdomen', 'abdominal', 'circunferência cintura', 'circunferencia cintura'], weight: 0.8, dataType: 'measurement' },
    { patterns: ['cint', 'cintura abdominal'], weight: 0.75, dataType: 'measurement' }
  ],
  hip_circumference: [
    { patterns: ['quadril', 'hip'], weight: 1.0 },
    { patterns: ['bacia', 'circunferência quadril', 'circunferencia quadril'], weight: 0.7, dataType: 'measurement' },
    { patterns: ['quad', 'quadril bacia'], weight: 0.65, dataType: 'measurement' }
  ],
  neck_circumference: [
    { patterns: ['pescoço', 'neck'], weight: 1.0 },
    { patterns: ['cervical'], weight: 0.8, dataType: 'measurement' }
  ],
  chest_circumference: [
    { patterns: ['tórax', 'chest', 'peito'], weight: 1.0 },
    { patterns: ['torax'], weight: 0.9, dataType: 'measurement' }
  ],
  arm_circumference: [
    { patterns: ['braço', 'arm'], weight: 1.0 },
    { patterns: ['braco'], weight: 0.9, dataType: 'measurement' }
  ],
  thigh_circumference: [
    { patterns: ['coxa', 'thigh'], weight: 1.0 },
    { patterns: ['perna'], weight: 0.7, dataType: 'measurement' }
  ],
  first_assessment_date: [
    { patterns: ['data avaliação', 'data avaliacao', 'avaliação'], weight: 1.0, dataType: 'date' },
    { patterns: ['data primeira', 'primeira avaliação'], weight: 0.95, dataType: 'date' }
  ],
  bmi: [
    { patterns: ['imc', 'bmi'], weight: 1.0, dataType: 'number' },
    { patterns: ['índice massa'], weight: 0.9, dataType: 'number' }
  ],
  water_percentage: [
    { patterns: ['água', 'water', 'agua'], weight: 1.0, dataType: 'number' },
    { patterns: ['% água', '%agua'], weight: 0.95, dataType: 'number' }
  ],
  bone_mass: [
    { patterns: ['massa óssea', 'bone mass', 'massa ossea'], weight: 1.0, dataType: 'number' }
  ],
  visceral_fat: [
    { patterns: ['gordura visceral', 'visceral fat'], weight: 1.0, dataType: 'number' },
    { patterns: ['visceral'], weight: 0.8, dataType: 'number' }
  ]
}

/**
 * Verifica se uma coluna corresponde a um padrão conhecido
 */
function checkKnownPatterns(header: string, targetField: string, dataType: string | null): { weight: number, pattern: string } | null {
  const patterns = KNOWN_PATTERNS[targetField]
  if (!patterns) return null
  
  const normalizedHeader = normalizeString(header)
  
  for (const patternGroup of patterns) {
    for (const pattern of patternGroup.patterns) {
      if (normalizedHeader.includes(pattern)) {
        // Bonus se o tipo de dados também corresponder
        let weight = patternGroup.weight
        if (patternGroup.dataType && dataType === patternGroup.dataType) {
          weight = Math.min(1.0, weight + 0.1)
        }
        return { weight, pattern }
      }
    }
  }
  
  return null
}

/**
 * Analisa contexto da coluna (posição, colunas próximas)
 */
function analyzeContext(headers: string[], index: number, targetField: string): number {
  let score = 0
  
  // Primeira coluna geralmente é nome
  if (index === 0 && targetField === 'name') {
    score += 0.3
  }
  
  // Colunas próximas a email geralmente são telefone
  const emailIndex = headers.findIndex(h => normalizeString(h).includes('email') || normalizeString(h).includes('mail'))
  if (emailIndex !== -1 && Math.abs(index - emailIndex) <= 2 && targetField === 'phone') {
    score += 0.2
  }
  
  // Colunas após dados pessoais geralmente são medidas
  const personalDataFields = ['name', 'email', 'phone', 'birth_date']
  const hasPersonalDataBefore = headers.slice(0, index).some((h, i) => {
    const normalized = normalizeString(h)
    return personalDataFields.some(field => {
      const patterns = KNOWN_PATTERNS[field]
      return patterns?.some(p => p.patterns.some(pat => normalized.includes(pat)))
    })
  })
  
  if (hasPersonalDataBefore && ['weight', 'height', 'waist_circumference', 'hip_circumference'].includes(targetField)) {
    score += 0.2
  }
  
  return Math.min(1.0, score)
}

/**
 * Calcula score de mapeamento entre uma coluna e um campo alvo
 */
export function scoreMapping(
  sourceColumn: string,
  targetField: string,
  targetFieldLabel: string,
  columnData: any[],
  headers: string[],
  columnIndex: number
): MappingScore {
  let score = 0
  const reasons: string[] = []
  
  // 1. Similaridade de texto (0-40 pontos)
  const textSimilarity = calculateSimilarity(sourceColumn, targetFieldLabel)
  const textScore = textSimilarity * 40
  score += textScore
  if (textSimilarity > 0.7) {
    reasons.push(`Nome muito similar (${Math.round(textSimilarity * 100)}%)`)
  }
  
  // 2. Tipo de dados (0-30 pontos)
  const dataType = detectDataType(columnData)
  const expectedTypes: Record<string, string[]> = {
    email: ['email'],
    phone: ['phone'],
    birth_date: ['date'],
    first_assessment_date: ['date'],
    weight: ['weight', 'number'],
    height: ['height', 'number'],
    bmi: ['number'],
    waist_circumference: ['measurement', 'number'],
    hip_circumference: ['measurement', 'number'],
    neck_circumference: ['measurement', 'number'],
    chest_circumference: ['measurement', 'number'],
    arm_circumference: ['measurement', 'number'],
    thigh_circumference: ['measurement', 'number'],
    triceps_skinfold: ['measurement', 'number'],
    biceps_skinfold: ['measurement', 'number'],
    subscapular_skinfold: ['measurement', 'number'],
    iliac_skinfold: ['measurement', 'number'],
    abdominal_skinfold: ['measurement', 'number'],
    thigh_skinfold: ['measurement', 'number'],
    body_fat_percentage: ['number'],
    muscle_mass: ['number'],
    bone_mass: ['number'],
    water_percentage: ['number'],
    visceral_fat: ['number']
  }
  
  const expectedType = expectedTypes[targetField]
  if (expectedType && dataType && expectedType.includes(dataType)) {
    score += 30
    reasons.push(`Tipo de dados compatível (${dataType})`)
  } else if (dataType === 'text' && !expectedType) {
    // Campos de texto sem tipo específico
    score += 20
  }
  
  // 3. Padrões conhecidos (0-20 pontos)
  const patternMatch = checkKnownPatterns(sourceColumn, targetField, dataType)
  if (patternMatch) {
    const patternScore = patternMatch.weight * 20
    score += patternScore
    reasons.push(`Padrão conhecido: "${patternMatch.pattern}"`)
  }
  
  // 4. Contexto e posição (0-10 pontos)
  const contextScore = analyzeContext(headers, columnIndex, targetField) * 10
  score += contextScore
  if (contextScore > 5) {
    reasons.push('Contexto adequado (posição na planilha)')
  }
  
  return {
    sourceColumn,
    targetField,
    confidence: Math.min(100, Math.round(score)),
    reasons,
    dataType: dataType || undefined
  }
}

/**
 * Analisa uma planilha e retorna mapeamentos sugeridos
 */
export function analyzeSpreadsheet(
  headers: string[],
  sampleRows: any[][],
  fieldMappings: Array<{ key: string, label: string, required: boolean }>
): DetectionResult {
  const allMappings: MappingScore[] = []
  const mappedColumns = new Set<string>()
  
  // Para cada campo do sistema
  for (const targetField of fieldMappings) {
    let bestMatch: MappingScore | null = null
    
    // Para cada coluna da planilha
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      
      // Pular se já foi mapeada
      if (mappedColumns.has(header)) continue
      
      // Extrair dados da coluna
      const columnData = sampleRows.map(row => row[i]).filter(v => v !== null && v !== undefined && v !== '')
      
      if (columnData.length === 0) continue
      
      // Calcular score
      const score = scoreMapping(
        header,
        targetField.key,
        targetField.label,
        columnData,
        headers,
        i
      )
      
      // Manter o melhor match
      if (!bestMatch || score.confidence > bestMatch.confidence) {
        bestMatch = score
      }
    }
    
    // Adicionar mapeamento se confiança > 50%
    if (bestMatch && bestMatch.confidence >= 50) {
      allMappings.push(bestMatch)
      mappedColumns.add(bestMatch.sourceColumn)
    }
  }
  
  // Categorizar por confiança
  const highConfidence = allMappings.filter(m => m.confidence >= 80)
  const mediumConfidence = allMappings.filter(m => m.confidence >= 50 && m.confidence < 80)
  const lowConfidence = allMappings.filter(m => m.confidence < 50)
  
  // Colunas não mapeadas
  const unmappedColumns = headers.filter(h => !mappedColumns.has(h))
  
  // Confiança geral (média ponderada)
  const overallConfidence = allMappings.length > 0
    ? Math.round(allMappings.reduce((sum, m) => sum + m.confidence, 0) / allMappings.length)
    : 0
  
  return {
    mappings: allMappings,
    overallConfidence,
    highConfidence,
    mediumConfidence,
    lowConfidence,
    unmappedColumns
  }
}

