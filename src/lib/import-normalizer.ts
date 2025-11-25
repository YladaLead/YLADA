/**
 * Sistema de Normalização e Pré-formatação de Planilhas
 * 
 * Analisa planilhas personalizadas e as transforma automaticamente
 * para o formato padrão do sistema antes da importação
 */

import { analyzeSpreadsheet, DetectionResult } from './import-detection'

export interface NormalizedData {
  headers: string[]
  rows: any[][]
  transformations: Transformation[]
  confidence: number
}

export interface Transformation {
  originalColumn: string
  targetColumn: string
  transformation: string // Descrição da transformação aplicada
  confidence: number
}

/**
 * Normaliza uma planilha para o formato padrão
 */
export function normalizeSpreadsheet(
  headers: string[],
  rows: any[][],
  fieldMappings: Array<{ key: string, label: string, required: boolean }>
): NormalizedData {
  const standardHeaders = fieldMappings.map(f => f.label)
  const transformations: Transformation[] = []
  
  // Analisar a planilha original
  const sampleRows = rows.slice(0, Math.min(10, rows.length))
  const detection = analyzeSpreadsheet(headers, sampleRows, fieldMappings)
  
  // Criar nova estrutura normalizada
  const normalizedRows: any[][] = []
  
  // Para cada linha, transformar para formato padrão
  for (const row of rows) {
    const normalizedRow: any[] = new Array(standardHeaders.length).fill('')
    
    // Para cada campo padrão
    fieldMappings.forEach((targetField, targetIndex) => {
      // Encontrar melhor match na detecção
      const bestMatch = detection.mappings.find(m => m.targetField === targetField.key)
      
      if (bestMatch && bestMatch.confidence >= 50) {
        const sourceIndex = headers.indexOf(bestMatch.sourceColumn)
        
        if (sourceIndex !== -1 && row[sourceIndex] !== undefined && row[sourceIndex] !== null) {
          let value = String(row[sourceIndex]).trim()
          
          // Aplicar transformações específicas por tipo
          value = applyTransformations(value, targetField.key, bestMatch.dataType)
          
          normalizedRow[targetIndex] = value
          
          // Registrar transformação
          if (!transformations.find(t => t.originalColumn === bestMatch.sourceColumn)) {
            transformations.push({
              originalColumn: bestMatch.sourceColumn,
              targetColumn: targetField.label,
              transformation: getTransformationDescription(bestMatch, targetField.key),
              confidence: bestMatch.confidence
            })
          }
        }
      }
    })
    
    normalizedRows.push(normalizedRow)
  }
  
  return {
    headers: standardHeaders,
    rows: normalizedRows,
    transformations,
    confidence: detection.overallConfidence
  }
}

/**
 * Aplica transformações específicas baseadas no tipo de campo
 */
function applyTransformations(value: string, targetField: string, dataType?: string): string {
  // Email: normalizar
  if (targetField === 'email' || dataType === 'email') {
    return value.toLowerCase().trim()
  }
  
  // Telefone: normalizar formato
  if (targetField === 'phone' || dataType === 'phone') {
    const digits = value.replace(/\D/g, '')
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return value
  }
  
  // Data: normalizar formato
  if (targetField.includes('date') || dataType === 'date') {
    return normalizeDate(value)
  }
  
  // CPF: remover formatação
  if (targetField === 'cpf') {
    return value.replace(/\D/g, '')
  }
  
  // CEP: remover formatação
  if (targetField === 'address_zipcode') {
    return value.replace(/\D/g, '')
  }
  
  // Estado: maiúsculas, 2 caracteres
  if (targetField === 'address_state') {
    return value.toUpperCase().substring(0, 2)
  }
  
  // Instagram: remover @
  if (targetField === 'instagram') {
    return value.replace(/^@/, '')
  }
  
  // Peso: garantir formato numérico
  if (targetField === 'weight' || dataType === 'weight') {
    const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    return isNaN(num) ? '' : num.toString()
  }
  
  // Altura: normalizar (se estiver em cm, converter para m)
  if (targetField === 'height' || dataType === 'height') {
    const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    if (isNaN(num)) return ''
    // Se for > 3, provavelmente está em cm, converter para m
    if (num > 3) {
      return (num / 100).toFixed(2)
    }
    return num.toString()
  }
  
  // Números: normalizar (remover unidades, vírgulas, etc)
  if (dataType === 'number' || dataType === 'measurement') {
    const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    return isNaN(num) ? '' : num.toString()
  }
  
  // Texto: apenas trim
  return value.trim()
}

/**
 * Normaliza formato de data
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return ''
  
  // DD/MM/YYYY ou DD-MM-YYYY
  const ddmmyyyy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  
  // YYYY-MM-DD (já está no formato certo)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr
  }
  
  // Tentar parse direto
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }
  
  return dateStr
}

/**
 * Gera descrição da transformação aplicada
 */
function getTransformationDescription(match: any, targetField: string): string {
  const reasons: string[] = []
  
  if (match.reasons) {
    reasons.push(...match.reasons)
  }
  
  // Adicionar transformações específicas
  if (targetField === 'phone') {
    reasons.push('Formato de telefone normalizado')
  }
  if (targetField === 'email') {
    reasons.push('Email normalizado (minúsculas)')
  }
  if (targetField.includes('date')) {
    reasons.push('Data convertida para formato padrão (YYYY-MM-DD)')
  }
  if (targetField === 'height') {
    reasons.push('Altura normalizada (se estava em cm, convertida para m)')
  }
  
  return reasons.join('; ')
}

/**
 * Valida se a normalização foi bem-sucedida
 */
export function validateNormalization(normalized: NormalizedData): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Verificar se campos obrigatórios foram mapeados
  const requiredFields = ['Nome Completo'] // Ajustar conforme necessário
  const mappedFields = normalized.transformations.map(t => t.targetColumn)
  
  requiredFields.forEach(field => {
    if (!mappedFields.includes(field)) {
      errors.push(`Campo obrigatório "${field}" não foi mapeado`)
    }
  })
  
  // Avisos sobre baixa confiança
  normalized.transformations.forEach(trans => {
    if (trans.confidence < 50) {
      warnings.push(`Mapeamento "${trans.originalColumn}" → "${trans.targetColumn}" tem baixa confiança (${trans.confidence}%)`)
    }
  })
  
  // Verificar se há dados nas linhas
  if (normalized.rows.length === 0) {
    errors.push('Nenhuma linha de dados encontrada após normalização')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

