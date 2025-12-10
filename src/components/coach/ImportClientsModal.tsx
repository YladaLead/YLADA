'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { analyzeSpreadsheet, DetectionResult } from '@/lib/import-detection'
import { normalizeSpreadsheet, validateNormalization, NormalizedData } from '@/lib/import-normalizer'

interface ImportClientsModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
}

interface ParsedData {
  headers: string[]
  rows: any[][]
  fileName: string
  totalRows: number
}

interface MappedField {
  sourceColumn: string
  targetField: string
  required: boolean
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  duplicates: number
  validRows: number
}

const FIELD_MAPPINGS = [
  // Dados Pessoais
  { key: 'name', label: 'Nome Completo', required: true },
  { key: 'birth_date', label: 'Data de Nascimento', required: false },
  { key: 'gender', label: 'Gênero', required: false },
  { key: 'cpf', label: 'CPF', required: false },
  // Contato
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Telefone', required: false },
  { key: 'instagram', label: 'Instagram', required: false },
  // Endereço
  { key: 'address_street', label: 'Rua', required: false },
  { key: 'address_number', label: 'Número', required: false },
  { key: 'address_complement', label: 'Complemento', required: false },
  { key: 'address_neighborhood', label: 'Bairro', required: false },
  { key: 'address_city', label: 'Cidade', required: false },
  { key: 'address_state', label: 'Estado', required: false },
  { key: 'address_zipcode', label: 'CEP', required: false },
  // Status e Objetivo
  { key: 'status', label: 'Status', required: false },
  { key: 'goal', label: 'Objetivo da Cliente', required: false },
  // Primeira Avaliação - Data
  { key: 'first_assessment_date', label: 'Data da Primeira Avaliação', required: false },
  // Primeira Avaliação - Medidas Básicas
  { key: 'weight', label: 'Peso (kg)', required: false },
  { key: 'height', label: 'Altura (m)', required: false },
  { key: 'bmi', label: 'IMC', required: false },
  // Primeira Avaliação - Circunferências (cm)
  { key: 'neck_circumference', label: 'Circunferência do Pescoço (cm)', required: false },
  { key: 'chest_circumference', label: 'Circunferência do Tórax (cm)', required: false },
  { key: 'waist_circumference', label: 'Circunferência da Cintura (cm)', required: false },
  { key: 'hip_circumference', label: 'Circunferência do Quadril (cm)', required: false },
  { key: 'arm_circumference', label: 'Circunferência do Braço (cm)', required: false },
  { key: 'thigh_circumference', label: 'Circunferência da Coxa (cm)', required: false },
  // Primeira Avaliação - Dobras Cutâneas (mm)
  { key: 'triceps_skinfold', label: 'Dobra Cutânea Tríceps (mm)', required: false },
  { key: 'biceps_skinfold', label: 'Dobra Cutânea Bíceps (mm)', required: false },
  { key: 'subscapular_skinfold', label: 'Dobra Cutânea Subescapular (mm)', required: false },
  { key: 'iliac_skinfold', label: 'Dobra Cutânea Ilíaca (mm)', required: false },
  { key: 'abdominal_skinfold', label: 'Dobra Cutânea Abdominal (mm)', required: false },
  { key: 'thigh_skinfold', label: 'Dobra Cutânea Coxa (mm)', required: false },
  // Primeira Avaliação - Composição Corporal
  { key: 'body_fat_percentage', label: 'Gordura Corporal (%)', required: false },
  { key: 'muscle_mass', label: 'Massa Muscular (kg)', required: false },
  { key: 'bone_mass', label: 'Massa Óssea (kg)', required: false },
  { key: 'water_percentage', label: 'Água Corporal (%)', required: false },
  { key: 'visceral_fat', label: 'Gordura Visceral', required: false },
  // Primeira Avaliação - Observações
  { key: 'assessment_notes', label: 'Observações da Avaliação', required: false },
]

export default function ImportClientsModal({ isOpen, onClose, onImportSuccess }: ImportClientsModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'validation' | 'importing' | 'success'>('upload')
  const [files, setFiles] = useState<File[]>([])
  const [parsedData, setParsedData] = useState<ParsedData[]>([])
  const [fieldMappings, setFieldMappings] = useState<MappedField[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isStandardTemplate, setIsStandardTemplate] = useState(false)
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null)
  const [autoMappingEnabled, setAutoMappingEnabled] = useState(true)
  const [normalizedData, setNormalizedData] = useState<NormalizedData | null>(null)
  const [showNormalizedPreview, setShowNormalizedPreview] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<number | null>(null)
  const [isProcessingOcr, setIsProcessingOcr] = useState(false)
  const [pastedText, setPastedText] = useState('')

  const downloadTemplate = () => {
    // Definir cabeçalhos padrão - TODOS os campos da ficha completa de cliente
    const headers = [
      // Dados Pessoais
      'Nome Completo',
      'Data de Nascimento',
      'Gênero',
      'CPF',
      // Contato
      'Email',
      'Telefone',
      'Instagram',
      // Endereço
      'Rua',
      'Número',
      'Complemento',
      'Bairro',
      'Cidade',
      'Estado',
      'CEP',
      // Status e Objetivo
      'Status',
      'Objetivo da Cliente',
      // Primeira Avaliação - Data
      'Data da Primeira Avaliação',
      // Primeira Avaliação - Medidas Básicas
      'Peso (kg)',
      'Altura (m)',
      'IMC',
      // Primeira Avaliação - Circunferências (cm)
      'Circunferência do Pescoço (cm)',
      'Circunferência do Tórax (cm)',
      'Circunferência da Cintura (cm)',
      'Circunferência do Quadril (cm)',
      'Circunferência do Braço (cm)',
      'Circunferência da Coxa (cm)',
      // Primeira Avaliação - Dobras Cutâneas (mm)
      'Dobra Cutânea Tríceps (mm)',
      'Dobra Cutânea Bíceps (mm)',
      'Dobra Cutânea Subescapular (mm)',
      'Dobra Cutânea Ilíaca (mm)',
      'Dobra Cutânea Abdominal (mm)',
      'Dobra Cutânea Coxa (mm)',
      // Primeira Avaliação - Composição Corporal
      'Gordura Corporal (%)',
      'Massa Muscular (kg)',
      'Massa Óssea (kg)',
      'Água Corporal (%)',
      'Gordura Visceral',
      // Primeira Avaliação - Observações
      'Observações da Avaliação'
    ]
    
    // Criar workbook
    const wb = XLSX.utils.book_new()
    
    // Criar worksheet com cabeçalhos e uma linha de exemplo
    const wsData = [
      headers,
      [
        // Dados Pessoais
        'João Silva',
        '15/03/1990',
        'Masculino',
        '123.456.789-00',
        // Contato
        'joao@email.com',
        '(11) 98765-4321',
        '@joaosilva',
        // Endereço
        'Rua das Flores',
        '123',
        'Apto 45',
        'Centro',
        'São Paulo',
        'SP',
        '01234-567',
        // Status e Objetivo
        'lead',
        'Ganhar massa muscular e melhorar condicionamento físico',
        // Primeira Avaliação - Data
        '01/01/2024',
        // Primeira Avaliação - Medidas Básicas
        '85.5',
        '1.75',
        '27.9',
        // Primeira Avaliação - Circunferências (cm)
        '38',
        '105',
        '95',
        '102',
        '32',
        '58',
        // Primeira Avaliação - Dobras Cutâneas (mm)
        '12',
        '8',
        '15',
        '18',
        '22',
        '20',
        // Primeira Avaliação - Composição Corporal
        '18.5',
        '65.2',
        '3.8',
        '55.2',
        '8',
        // Primeira Avaliação - Observações
        'Cliente iniciante, sem histórico de treino regular'
      ]
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    
    // Ajustar largura das colunas
    ws['!cols'] = [
      { wch: 25 }, // Nome Completo
      { wch: 18 }, // Data de Nascimento
      { wch: 12 }, // Gênero
      { wch: 15 }, // CPF
      { wch: 25 }, // Email
      { wch: 18 }, // Telefone
      { wch: 15 }, // Instagram
      { wch: 25 }, // Rua
      { wch: 10 }, // Número
      { wch: 15 }, // Complemento
      { wch: 20 }, // Bairro
      { wch: 20 }, // Cidade
      { wch: 8 },  // Estado
      { wch: 12 }, // CEP
      { wch: 15 }, // Status
      { wch: 40 }, // Objetivo da Cliente
      { wch: 22 }, // Data da Primeira Avaliação
      { wch: 12 }, // Peso (kg)
      { wch: 12 }, // Altura (m)
      { wch: 8 },  // IMC
      { wch: 28 }, // Circunferência do Pescoço (cm)
      { wch: 28 }, // Circunferência do Tórax (cm)
      { wch: 28 }, // Circunferência da Cintura (cm)
      { wch: 28 }, // Circunferência do Quadril (cm)
      { wch: 28 }, // Circunferência do Braço (cm)
      { wch: 28 }, // Circunferência da Coxa (cm)
      { wch: 28 }, // Dobra Cutânea Tríceps (mm)
      { wch: 28 }, // Dobra Cutânea Bíceps (mm)
      { wch: 28 }, // Dobra Cutânea Subescapular (mm)
      { wch: 28 }, // Dobra Cutânea Ilíaca (mm)
      { wch: 28 }, // Dobra Cutânea Abdominal (mm)
      { wch: 28 }, // Dobra Cutânea Coxa (mm)
      { wch: 20 }, // Gordura Corporal (%)
      { wch: 20 }, // Massa Muscular (kg)
      { wch: 18 }, // Massa Óssea (kg)
      { wch: 18 }, // Água Corporal (%)
      { wch: 18 }, // Gordura Visceral
      { wch: 35 }  // Observações da Avaliação
    ]
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes')
    
    // Baixar arquivo
    XLSX.writeFile(wb, 'template-importacao-clientes.xlsx')
  }

  const isStandardTemplateFormat = (headers: string[]): boolean => {
    const standardHeaders = [
      'Nome Completo',
      'Data de Nascimento',
      'Gênero',
      'CPF',
      'Email',
      'Telefone',
      'Instagram',
      'Rua',
      'Número',
      'Complemento',
      'Bairro',
      'Cidade',
      'Estado',
      'CEP',
      'Status',
      'Objetivo da Cliente',
      'Data da Primeira Avaliação',
      'Peso (kg)',
      'Altura (m)',
      'IMC',
      'Circunferência do Pescoço (cm)',
      'Circunferência do Tórax (cm)',
      'Circunferência da Cintura (cm)',
      'Circunferência do Quadril (cm)',
      'Circunferência do Braço (cm)',
      'Circunferência da Coxa (cm)',
      'Dobra Cutânea Tríceps (mm)',
      'Dobra Cutânea Bíceps (mm)',
      'Dobra Cutânea Subescapular (mm)',
      'Dobra Cutânea Ilíaca (mm)',
      'Dobra Cutânea Abdominal (mm)',
      'Dobra Cutânea Coxa (mm)',
      'Gordura Corporal (%)',
      'Massa Muscular (kg)',
      'Massa Óssea (kg)',
      'Água Corporal (%)',
      'Gordura Visceral',
      'Observações da Avaliação'
    ]
    
    // Verificar se todos os cabeçalhos padrão estão presentes e na ordem correta
    if (headers.length < standardHeaders.length) return false
    
    for (let i = 0; i < standardHeaders.length; i++) {
      if (headers[i]?.trim() !== standardHeaders[i]) {
        return false
      }
    }
    
    return true
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setError(null)
    
    try {
      const parsed = await parseFiles(acceptedFiles)
      setParsedData(parsed)
      
      // Verificar se é o template padrão
      const isStandard = parsed[0]?.headers ? isStandardTemplateFormat(parsed[0].headers) : false
      setIsStandardTemplate(isStandard)
      
      if (isStandard) {
        // Se for template padrão, criar mapeamento automático direto
        const standardMappings: MappedField[] = FIELD_MAPPINGS.map((field, index) => ({
          sourceColumn: parsed[0].headers[index] || '',
          targetField: field.key,
          required: field.required
        }))
        setFieldMappings(standardMappings)
        // Pular direto para validação
      setStep('preview')
      } else {
        // Se não for template padrão, usar detecção inteligente + normalização
        const headers = parsed[0]?.headers || []
        const allRows = parsed[0]?.rows || []
        const sampleRows = allRows.slice(0, 10) // Primeiras 10 linhas para análise
        
        // ETAPA 1: Análise inteligente automática
        const detection = analyzeSpreadsheet(headers, sampleRows, FIELD_MAPPINGS)
        setDetectionResult(detection)
        
        // ETAPA 2: Normalização automática (pré-formatação para modelo padrão)
        const normalized = normalizeSpreadsheet(headers, allRows, FIELD_MAPPINGS)
        setNormalizedData(normalized)
        
        // Validar normalização
        const validation = validateNormalization(normalized)
        
        // Criar mapeamentos baseados na detecção (para exibição)
        const autoMappings: MappedField[] = FIELD_MAPPINGS.map(field => {
          const bestMatch = detection.mappings.find(m => m.targetField === field.key)
          return {
            sourceColumn: bestMatch?.sourceColumn || '',
            targetField: field.key,
            required: field.required
          }
        })
        
        setFieldMappings(autoMappings)
        setStep('preview')
        
        // Se normalização foi bem-sucedida e confiança alta, usar dados normalizados
        if (validation.valid && normalized.confidence >= 70) {
          setAutoMappingEnabled(true)
          // Substituir dados originais pelos normalizados
          setParsedData([{
            headers: normalized.headers,
            rows: normalized.rows,
            fileName: parsed[0].fileName,
            totalRows: normalized.rows.length
          }])
          
          // Criar mapeamentos diretos (já está no formato padrão)
          const directMappings: MappedField[] = FIELD_MAPPINGS.map((field, index) => ({
            sourceColumn: normalized.headers[index] || '',
            targetField: field.key,
            required: field.required
          }))
          setFieldMappings(directMappings)
          
          setIsStandardTemplate(true) // Agora está no formato padrão após normalização!
        } else if (detection.overallConfidence >= 80) {
          setAutoMappingEnabled(true)
        } else {
          setAutoMappingEnabled(false)
          if (validation.errors.length > 0) {
            setError(`⚠️ ${validation.errors[0]}`)
          } else {
            setError(`⚠️ Detecção automática com confiança de ${detection.overallConfidence}%. Revise os mapeamentos antes de continuar.`)
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivos')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    multiple: true
  })

  const parsePastedText = (text: string): ParsedData[] => {
    if (!text || text.trim().length === 0) {
      throw new Error('Nenhum texto foi colado')
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    if (lines.length === 0) {
      throw new Error('Nenhum dado válido encontrado no texto colado')
    }

    // Detectar separador (tab, ponto e vírgula, vírgula, ou múltiplos espaços)
    const firstLine = lines[0]
    let useMultipleSpaces = false
    let separator = '\t' // Tab é o padrão quando copia do Excel
    
    // Verificar separadores na ordem de preferência
    if (firstLine.includes('\t')) {
      separator = '\t'
    } else if (firstLine.includes(';')) {
      separator = ';' // Ponto e vírgula comum em Excel brasileiro
    } else if (firstLine.includes(',')) {
      separator = ','
    } else if (firstLine.match(/\s{2,}/)) {
      useMultipleSpaces = true
      separator = '\t' // Não usado quando useMultipleSpaces é true
    }

    // Processar linhas
    const processedLines = lines.map(line => {
      if (useMultipleSpaces) {
        // Regex para múltiplos espaços
        return line.split(/\s{2,}/).map(cell => cell.trim()).filter(cell => cell.length > 0)
      } else {
        return line.split(separator).map(cell => cell.trim())
      }
    })

    // Encontrar número máximo de colunas
    const maxCols = Math.max(...processedLines.map(line => line.length), 1)

    // Normalizar todas as linhas para ter o mesmo número de colunas
    const normalizedLines = processedLines.map(line => {
      const normalized = Array(maxCols).fill('')
      for (let i = 0; i < Math.min(line.length, maxCols); i++) {
        normalized[i] = line[i] || ''
      }
      return normalized
    })

    // Primeira linha são os cabeçalhos
    const headers = normalizedLines[0] || []
    
    // Limpar cabeçalhos vazios do final
    while (headers.length > 0 && (!headers[headers.length - 1] || headers[headers.length - 1].trim() === '')) {
      headers.pop()
    }
    
    // Se os cabeçalhos estão vazios ou são genéricos, tentar detectar
    if (headers.length === 0 || headers.every(h => !h || h.trim() === '')) {
      // Usar nomes genéricos
      for (let i = 0; i < maxCols; i++) {
        if (i < headers.length) {
          headers[i] = headers[i] || `Coluna ${i + 1}`
        } else {
          headers.push(`Coluna ${i + 1}`)
        }
      }
    }

    // Resto são os dados (se houver)
    const rows = normalizedLines.slice(1).filter(row => 
      row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
    )

    // Se não há dados, criar uma linha vazia para permitir mapeamento apenas dos cabeçalhos
    const finalRows = rows.length > 0 ? rows : [Array(headers.length).fill('')]

    return [{
      headers,
      rows: finalRows,
      fileName: 'Cabeçalhos Colados',
      totalRows: rows.length || 0
    }]
  }

  const handlePasteData = async () => {
    if (!pastedText || pastedText.trim().length === 0) {
      setError('Por favor, cole os cabeçalhos antes de continuar')
      return
    }

    setError(null)
    
    try {
      const parsed = parsePastedText(pastedText)
      setParsedData(parsed)
      setFiles([]) // Limpar arquivos já que estamos usando dados colados
      
      // Verificar se é o template padrão
      const isStandard = parsed[0]?.headers ? isStandardTemplateFormat(parsed[0].headers) : false
      setIsStandardTemplate(isStandard)
      
      if (isStandard) {
        // Se for template padrão, criar mapeamento automático direto
        const standardMappings: MappedField[] = FIELD_MAPPINGS.map((field, index) => ({
          sourceColumn: parsed[0].headers[index] || '',
          targetField: field.key,
          required: field.required
        }))
        setFieldMappings(standardMappings)
        setStep('preview')
      } else {
        // Se não for template padrão, usar detecção inteligente
        const headers = parsed[0]?.headers || []
        const allRows = parsed[0]?.rows || []
        const sampleRows = allRows.slice(0, 10)
        
        // Análise inteligente automática
        const detection = analyzeSpreadsheet(headers, sampleRows, FIELD_MAPPINGS)
        setDetectionResult(detection)
        
        // Normalização automática
        const normalized = normalizeSpreadsheet(headers, allRows, FIELD_MAPPINGS)
        setNormalizedData(normalized)
        
        // Criar mapeamentos baseados na detecção
        const autoMappings: MappedField[] = FIELD_MAPPINGS.map(field => {
          const bestMatch = detection.mappings.find(m => m.targetField === field.key)
          return {
            sourceColumn: bestMatch?.sourceColumn || '',
            targetField: field.key,
            required: field.required
          }
        })
        
        setFieldMappings(autoMappings)
        setStep('preview')
      }
      
      setPastedText('')
    } catch (err: any) {
      setError(err.message || 'Erro ao processar cabeçalhos colados')
    }
  }

  const parseFiles = async (files: File[]): Promise<ParsedData[]> => {
    const results: ParsedData[] = []
    
    for (const file of files) {
      const fileName = file.name.toLowerCase()
      const isImage = fileName.endsWith('.png') || 
                      fileName.endsWith('.jpg') || 
                      fileName.endsWith('.jpeg') ||
                      fileName.endsWith('.webp')
      
      if (isImage) {
        setIsProcessingOcr(true)
        setOcrProgress(0)
      }
      
      const formData = new FormData()
      formData.append('file', file)
      
      // Usar API de OCR para imagens, API de parse para Excel/CSV
      const apiEndpoint = isImage ? '/api/c/import/ocr' : '/api/c/import/parse'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      
      if (isImage) {
        setIsProcessingOcr(false)
        setOcrProgress(null)
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Erro ao processar ${file.name}`
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || `Erro ao processar ${file.name}`)
      }
      
      // Se for texto bruto (OCR não detectou estrutura), criar estrutura básica
      if (data.rawText && data.headers.length === 0) {
        // Tentar processar texto bruto manualmente
        const lines = data.text.split('\n').filter((l: string) => l.trim().length > 0)
        const firstLine = lines[0] || ''
        
        // Tentar detectar colunas na primeira linha
        const columns = firstLine.split(/\s{2,}|\t/).filter((col: string) => col.trim().length > 0)
        
        if (columns.length >= 2) {
          data.headers = columns.map((col: string) => col.trim())
          data.rows = lines.slice(1).map((line: string) => {
            const rowCols = line.split(/\s{2,}|\t/).filter((col: string) => col.trim().length > 0)
            const normalizedRow = Array(data.headers.length).fill('')
            for (let i = 0; i < Math.min(rowCols.length, data.headers.length); i++) {
              normalizedRow[i] = rowCols[i].trim()
            }
            return normalizedRow
          }).filter((row: string[]) => row.some(cell => cell.trim() !== ''))
        } else {
          // Fallback: criar estrutura genérica
          data.headers = ['Coluna 1', 'Coluna 2']
          data.rows = lines.map((line: string) => [line.trim(), ''])
        }
      }
      
      results.push({
        headers: data.headers || [],
        rows: data.rows || [],
        fileName: file.name,
        totalRows: data.rows?.length || 0
      })
    }
    
    return results
  }

  // Função antiga mantida para compatibilidade, mas agora usa o novo sistema
  const autoDetectMappings = (headers: string[]): MappedField[] => {
    const mappings: MappedField[] = []
    
    FIELD_MAPPINGS.forEach(field => {
      const detectedColumn = detectColumnLegacy(headers, field.key)
      mappings.push({
        sourceColumn: detectedColumn || '',
        targetField: field.key,
        required: field.required
      })
    })
    
    return mappings
  }

  const detectColumnLegacy = (headers: string[], fieldKey: string): string | null => {
    // Padrões expandidos para detectar mais variações comuns
    const patterns: Record<string, string[]> = {
      // Dados Pessoais
      name: [
        'nome', 'name', 'cliente', 'nome completo', 'nome_completo',
        'paciente', 'aluno', 'atleta', 'pessoa', 'contato',
        'ficha', 'formulário', 'cadastro', 'avaliação'
      ],
      birth_date: [
        'nascimento', 'birth', 'data nascimento', 'data_nascimento', 'aniversário',
        'data de nascimento', 'nasc', 'dt nasc', 'dt. nasc', 'data nasc',
        'idade', 'nascido em', 'data de aniversário'
      ],
      gender: [
        'gênero', 'gender', 'sexo', 'sex', 'genero'
      ],
      cpf: [
        'cpf', 'documento', 'doc', 'rg', 'identidade'
      ],
      // Contato
      email: [
        'email', 'e-mail', 'mail', 'correio', 'e_mail',
        'email pessoal', 'email corporativo', 'endereço email'
      ],
      phone: [
        'telefone', 'phone', 'fone', 'celular', 'contato', 'whatsapp',
        'tel', 'telefone celular', 'telefone fixo', 'cel', 'whats',
        'telefone 1', 'telefone 2', 'contato telefônico'
      ],
      instagram: [
        'instagram', 'insta', 'ig', '@'
      ],
      // Endereço
      address_street: [
        'rua', 'street', 'endereço', 'logradouro', 'avenida', 'av', 'travessa'
      ],
      address_number: [
        'número', 'number', 'num', 'nº', 'numero'
      ],
      address_complement: [
        'complemento', 'complement', 'apto', 'apartamento', 'bloco', 'sala'
      ],
      address_neighborhood: [
        'bairro', 'neighborhood', 'distrito'
      ],
      address_city: [
        'cidade', 'city', 'município', 'municipio'
      ],
      address_state: [
        'estado', 'state', 'uf', 'unidade federativa'
      ],
      address_zipcode: [
        'cep', 'zipcode', 'zip code', 'código postal', 'codigo postal'
      ],
      // Status e Objetivo
      status: [
        'status', 'situação', 'situacao', 'estado do cliente'
      ],
      goal: [
        'objetivo', 'goal', 'meta', 'finalidade', 'propósito',
        'objetivos', 'metas', 'objetivo do cliente', 'o que busca'
      ]
    }

    const fieldPatterns = patterns[fieldKey] || []
    
    // Estratégia 1: Busca exata ou parcial nos nomes das colunas
    for (const header of headers) {
      const normalizedHeader = header.toLowerCase().trim()
      
      // Remover caracteres especiais e símbolos para melhor matching
      const cleanHeader = normalizedHeader
        .replace(/[✔✓✗✘]/g, '') // Remove símbolos de check
        .replace(/[^\w\s]/g, ' ') // Remove outros símbolos
        .replace(/\s+/g, ' ') // Normaliza espaços
        .trim()
      
      for (const pattern of fieldPatterns) {
        // Busca exata
        if (cleanHeader === pattern) {
          return header
        }
        // Busca parcial (contém a palavra)
        if (cleanHeader.includes(pattern)) {
          return header
        }
        // Busca por palavras separadas
        const headerWords = cleanHeader.split(/\s+/)
        const patternWords = pattern.split(/\s+/)
        if (patternWords.every(pw => headerWords.some(hw => hw.includes(pw) || pw.includes(hw)))) {
          return header
        }
      }
    }
    
    // Estratégia 2: Se for campo "name" e não encontrou, tenta primeira coluna que parece ter texto
    if (fieldKey === 'name' && headers.length > 0) {
      // Se a primeira coluna não foi mapeada para nada, pode ser o nome
      const firstHeader = headers[0].toLowerCase().trim()
      // Se não contém palavras que indicam outras coisas (data, número, etc)
      if (!firstHeader.match(/\d{2,4}[-/]\d{2}[-/]\d{2,4}/) && // não é data
          !firstHeader.match(/^\d+$/) && // não é só número
          !firstHeader.includes('id') && // não é ID
          firstHeader.length > 2) { // tem conteúdo
        return headers[0]
      }
    }
    
    return null
  }

  const validateData = async () => {
    setStep('validation')
    
    try {
      const response = await fetch('/api/coach/import/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: parsedData,
          mappings: fieldMappings
        }),
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Erro na validação dos dados')
      }
      
      const result = await response.json()
      setValidationResult(result)
    } catch (err: any) {
      setError(err.message || 'Erro na validação')
    }
  }

  const importData = async () => {
    setStep('importing')
    setImporting(true)
    setImportProgress(0)
    setError(null)
    
    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      // Simular progresso enquanto processa
      progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            return prev
          }
          return prev + 10
        })
      }, 200)
      
      const response = await fetch('/api/c/import/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: parsedData,
          mappings: fieldMappings
        }),
        credentials: 'include'
      })
      
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Erro na importação dos dados'
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      setImportProgress(100)
      
      setTimeout(() => {
        setStep('success')
        setImporting(false)
        setValidationResult(prev => prev ? { ...prev, validRows: result.imported || 0 } : null)
      }, 500)
      
    } catch (err: any) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setError(err.message || 'Erro na importação dos dados')
      setImporting(false)
      setStep('validation') // Voltar para validação para mostrar o erro
    }
  }

  const resetModal = () => {
    setStep('upload')
    setFiles([])
    setParsedData([])
    setFieldMappings([])
    setValidationResult(null)
    setImporting(false)
    setImportProgress(0)
    setError(null)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleSuccess = () => {
    resetModal()
    onImportSuccess()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Importar Clientes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Importe seus clientes de planilhas Excel, CSV ou Google Sheets
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[
              { key: 'upload', label: 'Upload', icon: '📁' },
              { key: 'preview', label: 'Preview', icon: '👀' },
              { key: 'mapping', label: 'Mapeamento', icon: '🔗' },
              { key: 'validation', label: 'Validação', icon: '✅' },
              { key: 'importing', label: 'Importando', icon: '⚡' },
              { key: 'success', label: 'Concluído', icon: '🎉' }
            ].map((stepItem, index) => (
              <div key={stepItem.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step === stepItem.key 
                    ? 'bg-purple-600 text-white' 
                    : ['upload', 'preview', 'mapping', 'validation', 'importing', 'success'].indexOf(step) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepItem.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === stepItem.key ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {stepItem.label}
                </span>
                {index < 5 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isProcessingOcr && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Processando imagem com OCR...</h4>
                  <p className="text-sm text-blue-800">
                    Extraindo texto da imagem. Isso pode levar alguns segundos.
                  </p>
                  {ocrProgress !== null && ocrProgress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ocrProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">{Math.round(ocrProgress)}% concluído</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Template Padrão - Destaque Principal */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Padrão</h3>
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  Use nosso template padrão para garantir <strong>100% de precisão</strong> na importação. 
                  Baixe, preencha e importe - tudo automático, sem erros!
                </p>
                <button
                  onClick={downloadTemplate}
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  📥 Baixar Template Excel
                </button>
              </div>

              {/* Seção: Seu modelo é diferente? */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🤖</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Seu modelo é diferente? Use o ChatGPT!
                    </h4>
                    <p className="text-gray-700 mb-4">
                      Se você já tem uma planilha com formato diferente, use o ChatGPT para converter automaticamente para nosso template padrão. É rápido e fácil!
                    </p>
                    
                    {/* Prompt pronto para copiar */}
                    <div className="bg-white rounded-lg border-2 border-blue-200 p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                          📋 Prompt pronto para o ChatGPT:
                        </label>
                        <button
                          onClick={() => {
                            const headersText = pastedText.trim() || '[Cole aqui os cabeçalhos da sua planilha atual]'
                            const prompt = `Preciso converter uma planilha de clientes para o formato padrão do sistema YLADA Coach.

FORMATO DE ENTRADA (cabeçalhos da minha planilha):
${headersText}

FORMATO DE SAÍDA (template padrão YLADA):
Nome Completo | Data de Nascimento | Gênero | CPF | Email | Telefone | Instagram | Rua | Número | Complemento | Bairro | Cidade | Estado | CEP | Status | Objetivo da Cliente | Data da Primeira Avaliação | Peso (kg) | Altura (m) | IMC | Circunferência do Pescoço (cm) | Circunferência do Tórax (cm) | Circunferência da Cintura (cm) | Circunferência do Quadril (cm) | Circunferência do Braço (cm) | Circunferência da Coxa (cm) | Dobra Cutânea Tríceps (mm) | Dobra Cutânea Bíceps (mm) | Dobra Cutânea Subescapular (mm) | Dobra Cutânea Ilíaca (mm) | Dobra Cutânea Abdominal (mm) | Dobra Cutânea Coxa (mm) | Gordura Corporal (%) | Massa Muscular (kg) | Massa Óssea (kg) | Água Corporal (%) | Gordura Visceral | Observações da Avaliação

INSTRUÇÕES:
1. Analise os cabeçalhos da minha planilha e identifique correspondências com o template padrão
2. Mapeie os campos equivalentes (ex: "Nome" → "Nome Completo", "Data Nasc" → "Data de Nascimento", "Tel" → "Telefone")
3. Para campos que não existem na minha planilha, deixe vazio
4. Mantenha a ordem exata das colunas do template padrão
5. Retorne apenas os dados convertidos em formato Excel/CSV (separado por tabulação ou ponto e vírgula)
6. Se eu enviar apenas os cabeçalhos, me retorne os cabeçalhos convertidos. Se enviar dados também, converta tudo.

Por favor, converta os dados da minha planilha para este formato padrão.`
                            navigator.clipboard.writeText(prompt)
                            alert(pastedText.trim() 
                              ? '✅ Prompt copiado com seus cabeçalhos! Cole no ChatGPT e ele já terá os cabeçalhos para converter.' 
                              : '⚠️ Cole os cabeçalhos primeiro no campo acima, depois copie o prompt novamente.')
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          📋 Copiar Prompt {pastedText.trim() ? '(com cabeçalhos)' : ''}
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
{`Preciso converter uma planilha de clientes para o formato padrão do sistema YLADA Coach.

FORMATO DE ENTRADA (cabeçalhos da minha planilha):
[Cole aqui os cabeçalhos da sua planilha atual]

FORMATO DE SAÍDA (template padrão YLADA):
Nome Completo | Data de Nascimento | Gênero | CPF | Email | Telefone | Instagram | Rua | Número | Complemento | Bairro | Cidade | Estado | CEP | Status | Objetivo da Cliente | Data da Primeira Avaliação | Peso (kg) | Altura (m) | IMC | Circunferência do Pescoço (cm) | Circunferência do Tórax (cm) | Circunferência da Cintura (cm) | Circunferência do Quadril (cm) | Circunferência do Braço (cm) | Circunferência da Coxa (cm) | Dobra Cutânea Tríceps (mm) | Dobra Cutânea Bíceps (mm) | Dobra Cutânea Subescapular (mm) | Dobra Cutânea Ilíaca (mm) | Dobra Cutânea Abdominal (mm) | Dobra Cutânea Coxa (mm) | Gordura Corporal (%) | Massa Muscular (kg) | Massa Óssea (kg) | Água Corporal (%) | Gordura Visceral | Observações da Avaliação

INSTRUÇÕES:
1. Analise os cabeçalhos da minha planilha e identifique correspondências
2. Mapeie os campos equivalentes (ex: "Nome" → "Nome Completo", "Data Nasc" → "Data de Nascimento")
3. Para campos inexistentes, deixe vazio
4. Mantenha a ordem exata das colunas do template padrão
5. Retorne apenas os dados convertidos em formato Excel/CSV (separado por tabulação ou ponto e vírgula)
6. Se eu enviar apenas os cabeçalhos, me retorne os cabeçalhos convertidos`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>💡 Dica:</strong> Copie o prompt acima, cole no ChatGPT junto com os cabeçalhos da sua planilha (ou toda a planilha), e o ChatGPT fará a conversão automaticamente para o formato padrão!
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Passo a passo:</strong> 1) Cole os cabeçalhos no campo abaixo → 2) Clique em "Copiar Prompt" → 3) Cole no ChatGPT → 4) ChatGPT retorna planilha convertida → 5) Importe aqui!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opção de Upload (apenas para template padrão) */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  📤 Importar Planilha
                </h4>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Faça o upload da sua planilha (Excel ou CSV). O sistema processa automaticamente!
                </p>
              <div
                {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center ${
                  isDragActive 
                        ? 'border-purple-500 bg-purple-100' 
                        : 'border-purple-300 hover:border-purple-400 bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                    <div className="text-5xl mb-3">📁</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {isDragActive ? 'Solte o arquivo aqui' : 'Arraste sua planilha aqui'}
                    </p>
                    <p className="text-sm text-gray-500">
                      ou clique para selecionar (Excel, CSV)
                </p>
                  </div>
              </div>

              {/* Opção alternativa: Colar apenas cabeçalhos (para ChatGPT) */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🤖</span>
                  Alternativa: Colar Cabeçalhos para ChatGPT
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  Se o sistema não conseguir processar seu Excel automaticamente, você pode colar apenas os cabeçalhos aqui e usar o ChatGPT para converter:
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cole aqui apenas a primeira linha (cabeçalhos) da sua planilha:
                    </label>
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Exemplo: Nome; Data Nasc; Telefone; Endereço; Peso; Altura; ..."
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Dica: No Excel, selecione apenas a primeira linha e copie (Ctrl+C). Cole aqui e depois use o ChatGPT para converter.
                    </p>
                  </div>
                  <button
                    onClick={handlePasteData}
                    disabled={!pastedText || pastedText.trim().length === 0}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📋 Processar Cabeçalhos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && parsedData.length > 0 && (
            <div>
              {isStandardTemplate && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Padrão Confirmado!</h3>
                  <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                    Seu arquivo está no formato padrão. {parsedData.reduce((sum, data) => sum + data.totalRows, 0)} cliente(s) será(ão) importado(s) automaticamente.
                  </p>
                  <button
                    onClick={async () => await validateData()}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ✓ Confirmar e Importar
                  </button>
                </div>
              )}
              
              {!isStandardTemplate && (
                <>
              {/* Aviso se poucas colunas foram detectadas */}
              {parsedData[0]?.headers && parsedData[0].headers.length <= 2 && (
                <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="font-semibold text-red-900">
                      Poucas Colunas Detectadas
                    </h4>
                  </div>
                  <div className="text-sm text-red-800 space-y-2">
                    <p>
                      <strong>Problema:</strong> Apenas {parsedData[0].headers.length} coluna(s) foi(ram) detectada(s) na sua planilha.
                    </p>
                    <p>
                      <strong>Possíveis causas:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>A planilha tem células mescladas na primeira linha (título)</li>
                      <li>Os cabeçalhos estão em uma linha diferente da primeira</li>
                      <li>A planilha tem um formato não padrão</li>
                      <li>O arquivo pode estar corrompido ou em formato incompatível</li>
                    </ul>
                    <p className="mt-2">
                      <strong>💡 Solução:</strong> Tente usar o <strong>Template Padrão</strong> (Opção A) ou verifique se sua planilha tem os cabeçalhos na primeira linha, sem células mescladas.
                    </p>
                  </div>
                </div>
              )}

              {!isStandardTemplate && detectionResult && normalizedData && (
                <div className={`mb-6 border-2 rounded-lg p-4 ${
                  normalizedData.confidence >= 70
                    ? 'bg-green-50 border-green-300'
                    : normalizedData.confidence >= 50
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {normalizedData.confidence >= 70 ? '✅' : normalizedData.confidence >= 50 ? '⚠️' : '❌'}
                    </span>
                    <h4 className="font-semibold">
                      {normalizedData.confidence >= 70 
                        ? 'Planilha Normalizada Automaticamente!' 
                        : 'Normalização Parcial - Revisão Recomendada'}
                    </h4>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Confiança da normalização:</strong> {normalizedData.confidence}%
                    </p>
                    <p className="text-gray-700">
                      Sua planilha foi <strong>analisada e pré-formatada</strong> automaticamente para o modelo padrão do sistema.
                      {normalizedData.confidence >= 70 && ' Os dados foram transformados e estão prontos para importação!'}
                    </p>
                    
                    {normalizedData.transformations.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowNormalizedPreview(!showNormalizedPreview)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          {showNormalizedPreview ? 'Ocultar' : 'Ver'} transformações aplicadas ({normalizedData.transformations.length})
                        </button>
                        
                        {showNormalizedPreview && (
                          <div className="mt-2 bg-white rounded-lg p-3 border border-gray-200 max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                              {normalizedData.transformations.map((trans, idx) => (
                                <div key={idx} className="text-xs border-l-2 border-blue-300 pl-2">
                                  <div className="font-medium text-gray-900">
                                    "{trans.originalColumn}" → "{trans.targetColumn}"
                                  </div>
                                  <div className="text-gray-600 mt-1">
                                    {trans.transformation}
                                  </div>
                                  <div className="text-gray-500 mt-1">
                                    Confiança: {trans.confidence}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-white rounded p-2 border">
                        <div className="text-lg font-bold text-green-600">{detectionResult.highConfidence.length}</div>
                        <div className="text-xs text-gray-600">Alta confiança (≥80%)</div>
                      </div>
                      <div className="bg-white rounded p-2 border">
                        <div className="text-lg font-bold text-yellow-600">{detectionResult.mediumConfidence.length}</div>
                        <div className="text-xs text-gray-600">Média confiança (50-79%)</div>
                      </div>
                      <div className="bg-white rounded p-2 border">
                        <div className="text-lg font-bold text-red-600">{detectionResult.unmappedColumns.length}</div>
                        <div className="text-xs text-gray-600">Não mapeadas</div>
                      </div>
                    </div>
                    
                    {normalizedData.confidence >= 70 && (
                      <p className="mt-3 text-green-800 font-medium">
                        ✅ <strong>Planilha normalizada com sucesso!</strong> Os dados foram transformados para o formato padrão e estão prontos para importação.
                      </p>
                    )}
                    {normalizedData.confidence < 70 && (
                      <p className="mt-3 text-yellow-800 font-medium">
                        ⚠️ Alguns campos podem precisar de ajuste manual. Revise os mapeamentos na próxima etapa.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Encontrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {parsedData.reduce((sum, data) => sum + data.totalRows, 0)}
                    </div>
                    <div className="text-sm text-purple-800">Total de Registros</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{parsedData.length}</div>
                    <div className="text-sm text-green-800">Arquivos Processados</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {parsedData[0]?.headers.length || 0}
                    </div>
                    <div className="text-sm text-blue-800">Colunas Detectadas</div>
                  </div>
                </div>
              </div>

              {parsedData.map((data, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">📄 {data.fileName}</h4>
                  <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          {data.headers.map((header, i) => (
                            <th key={i} className="text-left font-medium text-gray-900 px-2 py-1">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.rows.slice(0, 3).map((row, i) => (
                          <tr key={i} className="border-t border-gray-200">
                            {row.map((cell, j) => (
                              <td key={j} className="px-2 py-1 text-gray-600">
                                {cell || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {data.rows.length > 3 && (
                      <p className="text-xs text-gray-500 mt-2">
                        ... e mais {data.rows.length - 3} registros
                      </p>
                    )}
                  </div>
                </div>
              ))}
                </>
              )}
            </div>
          )}

          {/* Mapping Step */}
          {step === 'mapping' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapeamento de Campos</h3>
                <p className="text-gray-600 mb-4">
                  O mapeamento conecta as <strong>colunas da sua planilha</strong> com os <strong>campos do sistema</strong>.
                  Isso permite que o sistema saiba onde encontrar cada informação na sua planilha.
                </p>
                
                {detectionResult && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Detecção automática aplicada:</strong> Os campos abaixo foram mapeados automaticamente com {detectionResult.overallConfidence}% de confiança. 
                      Você pode ajustar qualquer mapeamento se necessário.
                </p>
              </div>
                )}
                
                {/* Exemplo visual */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <span>📋</span>
                    Como funciona?
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      <strong>Exemplo:</strong> Se na sua planilha você tem uma coluna chamada "Nome Completo", 
                      você deve mapeá-la para o campo "Nome" do sistema.
                    </p>
                    <div className="bg-white rounded p-3 border border-blue-300 mt-2">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="font-semibold text-blue-900 mb-1">Sua Planilha:</div>
                          <div className="text-gray-700">Coluna: "Nome Completo"</div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-blue-600 text-lg">→</span>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900 mb-1">Sistema:</div>
                          <div className="text-gray-700">Campo: "Nome"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {FIELD_MAPPINGS.map((field) => {
                  const mapping = fieldMappings.find(m => m.targetField === field.key)
                  const detectionMatch = detectionResult?.mappings.find(m => m.targetField === field.key)
                  
                  // Calcular exemplo corretamente
                  let exampleValue = null
                  if (mapping?.sourceColumn && parsedData[0]?.headers && parsedData[0]?.rows?.[0]) {
                    const columnIndex = parsedData[0].headers.indexOf(mapping.sourceColumn)
                    if (columnIndex !== -1 && parsedData[0].rows[0][columnIndex] !== undefined) {
                      exampleValue = parsedData[0].rows[0][columnIndex]
                    }
                  }
                  
                  // Determinar cor da borda baseado na confiança
                  let borderColor = 'border-gray-200'
                  let confidenceBadge = null
                  
                  if (detectionMatch) {
                    if (detectionMatch.confidence >= 80) {
                      borderColor = 'border-green-300'
                      confidenceBadge = <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Alta confiança ({detectionMatch.confidence}%)</span>
                    } else if (detectionMatch.confidence >= 50) {
                      borderColor = 'border-yellow-300'
                      confidenceBadge = <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Média confiança ({detectionMatch.confidence}%)</span>
                    } else {
                      borderColor = 'border-red-300'
                      confidenceBadge = <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Baixa confiança ({detectionMatch.confidence}%)</span>
                    }
                  }
                  
                  return (
                    <div key={field.key} className={`border-2 ${borderColor} rounded-lg p-4 bg-white hover:border-purple-300 transition-colors`}>
                      <div className="flex items-start gap-4">
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <label className="block text-sm font-semibold text-gray-900">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                              {!field.required && <span className="text-gray-400 text-xs ml-2">(opcional)</span>}
                        </label>
                            {confidenceBadge}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            Campo do sistema onde esta informação será salva
                          </p>
                          {detectionMatch && detectionMatch.reasons.length > 0 && (
                            <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2">
                              <span className="text-blue-700 font-medium">Por que foi mapeado:</span>
                              <ul className="text-blue-800 mt-1 list-disc list-inside">
                                {detectionMatch.reasons.map((reason, idx) => (
                                  <li key={idx}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {mapping?.sourceColumn && exampleValue !== null && exampleValue !== undefined && String(exampleValue).trim() !== '' && (
                            <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded p-2">
                              <span className="text-green-700 font-medium">Exemplo de valor:</span>
                              <span className="text-green-800 ml-1 font-mono">"{String(exampleValue).substring(0, 50)}{String(exampleValue).length > 50 ? '...' : ''}"</span>
                            </div>
                          )}
                      </div>
                      <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Selecione a coluna da planilha:
                          </label>
                        <select
                          value={mapping?.sourceColumn || ''}
                          onChange={(e) => {
                            const newMappings = fieldMappings.map(m => 
                              m.targetField === field.key 
                                ? { ...m, sourceColumn: e.target.value }
                                : m
                            )
                            setFieldMappings(newMappings)
                          }}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        >
                            <option value="">-- Selecione uma coluna --</option>
                          {parsedData[0]?.headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                        {mapping?.sourceColumn && (
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <span>✓</span>
                              Mapeado para: "{mapping.sourceColumn}"
                            </p>
                          )}
                        </div>
                        <div className="w-16 text-center flex items-center justify-center">
                          {mapping?.sourceColumn ? (
                            <div className="bg-green-100 rounded-full p-2">
                          <span className="text-green-600 text-xl">✅</span>
                            </div>
                          ) : field.required ? (
                            <div className="bg-red-100 rounded-full p-2">
                              <span className="text-red-600 text-xl">⚠️</span>
                            </div>
                          ) : (
                            <div className="bg-gray-100 rounded-full p-2">
                              <span className="text-gray-400 text-xl">○</span>
                            </div>
                        )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Dicas Importantes
                </h4>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span><strong>Campos obrigatórios</strong> (marcados com *) devem ser mapeados para continuar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>O sistema <strong>detectou automaticamente</strong> alguns campos baseado nos nomes das colunas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Você pode <strong>ajustar os mapeamentos</strong> se a detecção automática não estiver correta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Campos opcionais podem ficar sem mapeamento - apenas não serão importados</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Validation Step */}
          {step === 'validation' && validationResult && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Validação dos Dados</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Verificamos seus dados antes da importação. Veja abaixo o resumo:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">✅</span>
                  <div className="text-2xl font-bold text-green-600">{validationResult.validRows}</div>
                </div>
                  <div className="text-sm font-medium text-green-800">Registros Válidos</div>
                  <div className="text-xs text-green-700 mt-1">
                    Estes registros serão importados com sucesso
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                  <div className="text-2xl font-bold text-yellow-600">{validationResult.duplicates}</div>
                </div>
                  <div className="text-sm font-medium text-yellow-800">Duplicatas Removidas</div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Registros duplicados que serão ignorados
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">❌</span>
                  <div className="text-2xl font-bold text-red-600">{validationResult.errors.length}</div>
                  </div>
                  <div className="text-sm font-medium text-red-800">Erros Encontrados</div>
                  <div className="text-xs text-red-700 mt-1">
                    Problemas que precisam ser corrigidos
                  </div>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">❌</span>
                    Erros que Precisam ser Corrigidos
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    Os seguintes problemas foram encontrados. Corrija-os na planilha antes de continuar:
                  </p>
                  <ul className="text-sm text-red-800 space-y-2 bg-white rounded p-3 border border-red-200">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    Avisos (Não Impedem a Importação)
                  </h4>
                  <p className="text-sm text-yellow-800 mb-3">
                    Estes são avisos informativos. A importação pode continuar, mas verifique:
                  </p>
                  <ul className="text-sm text-yellow-800 space-y-2 bg-white rounded p-3 border border-yellow-200">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.validRows > 0 && (
                <div className={`border-2 rounded-lg p-4 ${
                  validationResult.valid 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                    validationResult.valid 
                      ? 'text-green-900' 
                      : 'text-blue-900'
                  }`}>
                    <span className="text-xl">
                      {validationResult.valid ? '✅' : '⚠️'}
                    </span>
                    {validationResult.valid ? 'Pronto para Importar!' : 'Pode Importar Registros Válidos'}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    validationResult.valid ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    <strong>{validationResult.validRows}</strong> {validationResult.validRows === 1 ? 'cliente será importado' : 'clientes serão importados'} com sucesso.
                  </p>
                  {validationResult.errors.length > 0 && (
                    <p className={`text-xs mt-2 ${
                      validationResult.valid ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      ⚠️ <strong>{validationResult.errors.length}</strong> {validationResult.errors.length === 1 ? 'registro com erro será ignorado' : 'registros com erro serão ignorados'} e não serão importados.
                    </p>
                  )}
                  {validationResult.duplicates > 0 && (
                    <p className={`text-xs mt-2 ${
                      validationResult.valid ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      Nota: {validationResult.duplicates} {validationResult.duplicates === 1 ? 'registro duplicado foi' : 'registros duplicados foram'} removido{validationResult.duplicates > 1 ? 's' : ''} automaticamente.
                    </p>
                  )}
                </div>
              )}

              {validationResult.validRows === 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    Nenhum Registro Válido
                  </h4>
                  <p className="text-sm text-yellow-800">
                    Não foram encontrados registros válidos para importar. Verifique se os campos obrigatórios estão mapeados corretamente e se há dados nas linhas.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Importando Clientes...</h3>
              <p className="text-gray-600 mb-6">Aguarde enquanto processamos seus dados</p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{importProgress}% concluído</p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Importação Concluída!</h3>
              <p className="text-gray-600 mb-6">
                Seus clientes foram importados com sucesso e já estão disponíveis no sistema.
              </p>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult?.validRows || 0}
                    </div>
                    <div className="text-sm text-green-800">Clientes Importados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-green-800">Taxa de Sucesso</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === 'success' ? 'Fechar' : 'Cancelar'}
          </button>
          
          <div className="flex gap-3">
            {step === 'preview' && !isStandardTemplate && (
              <button
                onClick={async () => {
                  if (detectionResult && detectionResult.overallConfidence >= 80 && autoMappingEnabled) {
                    // Se detecção com alta confiança, pular mapeamento
                    await validateData()
                  } else {
                    setStep('mapping')
                  }
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {detectionResult && detectionResult.overallConfidence >= 80 && autoMappingEnabled
                  ? 'Validar Dados' 
                  : 'Revisar Mapeamento'}
              </button>
            )}
            
            {step === 'mapping' && (
              <button
                onClick={validateData}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!fieldMappings.some(m => m.required && m.sourceColumn)}
              >
                Validar Dados
              </button>
            )}
            
            {step === 'validation' && validationResult && validationResult.validRows > 0 && (
              <div className="flex gap-3">
                {validationResult.errors.length > 0 && (
                  <button
                    onClick={() => setStep('mapping')}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ← Voltar e Corrigir
                  </button>
                )}
              <button
                onClick={importData}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                disabled={importing}
              >
                  {validationResult.errors.length > 0 
                    ? `Importar ${validationResult.validRows} Válidos` 
                    : 'Importar Agora'}
              </button>
              </div>
            )}
            
            {step === 'success' && (
              <button
                onClick={handleSuccess}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ver Clientes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
