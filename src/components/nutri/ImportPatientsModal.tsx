'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'

interface ImportPatientsModalProps {
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

interface ExtractedClient {
  name: string
  email?: string
  phone?: string
  weight?: number
  height?: number
  goal?: string
  notes?: string
  birth_date?: string
  gender?: 'masculino' | 'feminino'
}

const FIELD_MAPPINGS = [
  { key: 'name', label: 'Nome', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Telefone', required: false },
  { key: 'weight', label: 'Peso Atual (kg)', required: false },
  { key: 'height', label: 'Altura (cm)', required: false },
  { key: 'goal', label: 'Objetivo', required: false },
  { key: 'notes', label: 'Observações', required: false },
  { key: 'birth_date', label: 'Data de Nascimento', required: false },
  { key: 'gender', label: 'Gênero', required: false },
]

export default function ImportPatientsModal({ isOpen, onClose, onImportSuccess }: ImportPatientsModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'validation' | 'importing' | 'success'>('upload')
  const [importMode, setImportMode] = useState<'excel' | 'text'>('excel')
  const [files, setFiles] = useState<File[]>([])
  const [parsedData, setParsedData] = useState<ParsedData[]>([])
  const [fieldMappings, setFieldMappings] = useState<MappedField[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isStandardTemplate, setIsStandardTemplate] = useState(false)
  
  // Estados para importação por texto
  const [textInput, setTextInput] = useState('')
  const [extractedClients, setExtractedClients] = useState<ExtractedClient[]>([])
  const [processingText, setProcessingText] = useState(false)
  const [editingClients, setEditingClients] = useState<ExtractedClient[]>([])

  const downloadTemplate = () => {
    const headers = FIELD_MAPPINGS.map(field => field.label)
    
    const wb = XLSX.utils.book_new()
    const wsData = [
      headers,
      [
        'Anastácia Silva Santos',
        'anastacia.santos@email.com',
        '(11) 98765-4321',
        '75.5',
        '165',
        'Emagrecimento saudável com foco em redução de gordura abdominal e melhora da composição corporal. Meta: perder 8-10 kg em 4 meses de forma sustentável.',
        'Hipertensão controlada com medicação. Hipotireoidismo (em uso de levotiroxina). Nenhuma alergia alimentar conhecida. Café da manhã: pão com manteiga e café com açúcar. Almoço: arroz, feijão, carne e salada. Lanche da tarde: fruta ou biscoito. Jantar: geralmente come pouco ou pula. Consome doces e chocolate 2-3x por semana. Bebe 1,5L de água por dia. Caminhada 3x por semana (30-40 min). Academia 2x por semana (treino de força). Dorme 6-7 horas por noite. Intestino funciona 1x ao dia, regular. Às vezes sente inchaço após refeições. Paciente motivada, primeira vez fazendo acompanhamento nutricional.',
        '1990-03-15',
        'Feminino'
      ],
      [
        'João Pedro Oliveira',
        'joao.oliveira@email.com',
        '(21) 91234-5678',
        '85',
        '175',
        'Ganho de massa muscular e melhora do condicionamento físico',
        'Sem histórico de doenças. Treina 5x por semana. Alimentação balanceada. Objetivo: aumentar massa magra.',
        '1985-07-20',
        'Masculino'
      ],
      [
        'Maria Fernanda Costa',
        'maria.costa@email.com',
        '(11) 99876-5432',
        '62',
        '160',
        'Manutenção do peso e melhora da qualidade de vida',
        'Vegetariana há 3 anos. Pratica yoga 2x por semana. Consome bastante água. Intestino regular.',
        '1992-11-10',
        'Feminino'
      ]
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    // Definir largura das colunas
    ws['!cols'] = FIELD_MAPPINGS.map(() => ({ wch: 30 }))
    // Garantir que a primeira linha seja tratada como cabeçalho
    ws['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: headers.length - 1, r: wsData.length - 1 }
    })
    
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes')
    XLSX.writeFile(wb, 'template-importacao-pacientes.xlsx')
  }

  const isStandardTemplateFormat = (headers: string[]): boolean => {
    const standardHeaders = FIELD_MAPPINGS.map(field => field.label)
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
    setImporting(true)
    setImportProgress(10)
    
    try {
      // Primeiro, fazer parse básico dos arquivos
      const parsed = await parseFiles(acceptedFiles)
      setImportProgress(30)
      
      // Verificar se há dados
      if (!parsed[0] || !parsed[0].rows || parsed[0].rows.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha. Verifique se o arquivo contém linhas de dados além do cabeçalho.')
      }
      
      // Verificar se é template padrão
      const isStandard = parsed[0]?.headers ? isStandardTemplateFormat(parsed[0].headers) : false
      setIsStandardTemplate(isStandard)
      
      if (isStandard) {
        // Se for template padrão, importar direto (sem preview/mapping/validação)
        const standardMappings: MappedField[] = FIELD_MAPPINGS.map((field, index) => ({
          sourceColumn: parsed[0].headers[index] || '',
          targetField: field.key,
          required: field.required
        }))
        setFieldMappings(standardMappings)
        setParsedData(parsed)
        setIsStandardTemplate(true)
        
        // Validar e importar direto
        setImportProgress(50)
        await validateAndImportDirectly(parsed, standardMappings)
      } else {
        // Se não for padrão, usar IA para reestruturar automaticamente
        setImportProgress(50)
        setError(null)
        
        try {
          // Processar cada arquivo com LYA
          const processedFiles: ParsedData[] = []
          let finalMappings: MappedField[] = []
          
          for (const fileData of parsed) {
            // Verificar se há dados antes de processar
            if (!fileData.rows || fileData.rows.length === 0) {
              throw new Error(`Nenhum dado encontrado no arquivo ${fileData.fileName}. Verifique se o arquivo contém linhas de dados além do cabeçalho.`)
            }
            
            const response = await fetch('/api/nutri/import/smart-parse', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                headers: fileData.headers,
                rows: fileData.rows,
                fileName: fileData.fileName
              }),
              credentials: 'include'
            })
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.error || `Erro ao processar ${fileData.fileName} com IA`)
            }
            
            const result = await response.json()
            processedFiles.push({
              headers: result.headers,
              rows: result.rows,
              fileName: result.fileName,
              totalRows: result.totalRows
            })
            
            // Usar os mappings retornados pela API (já estão corretos)
            if (result.mappings && result.mappings.length > 0) {
              // Converter os mappings da API para o formato esperado
              const apiMappings: MappedField[] = result.mappings.map((m: any) => {
                const field = FIELD_MAPPINGS.find(f => f.key === m.targetField)
                return {
                  sourceColumn: m.sourceColumn || '',
                  targetField: m.targetField,
                  required: field?.required || false
                }
              })
              
              // Completar com todos os campos padrão
              finalMappings = FIELD_MAPPINGS.map(field => {
                const existing = apiMappings.find(m => m.targetField === field.key)
                if (existing) {
                  return existing
                }
                // Se não encontrou, usar o header padrão na posição correta
                const headerIndex = FIELD_MAPPINGS.findIndex(f => f.key === field.key)
                const standardHeader = result.headers[headerIndex] || ''
                return {
                  sourceColumn: standardHeader,
                  targetField: field.key,
                  required: field.required
                }
              })
            } else {
              // Fallback: criar mappings baseado na ordem dos headers padrão retornados pela IA
              const standardHeaders = result.headers || []
              finalMappings = FIELD_MAPPINGS.map((field, index) => ({
                sourceColumn: standardHeaders[index] || '',
                targetField: field.key,
                required: field.required
              }))
            }
          }
          
          setImportProgress(80)
          
          // Garantir que temos mappings válidos
          if (finalMappings.length === 0 && processedFiles.length > 0) {
            // Último fallback: criar baseado nos headers padrão
            const standardHeaders = processedFiles[0].headers
            finalMappings = FIELD_MAPPINGS.map((field, index) => ({
              sourceColumn: standardHeaders[index] || '',
              targetField: field.key,
              required: field.required
            }))
          }
          
          // Validar que temos mappings válidos antes de continuar
          if (finalMappings.length === 0) {
            throw new Error('Não foi possível criar mapeamentos automáticos. Tente novamente ou use o template padrão.')
          }
          
          setFieldMappings(finalMappings)
          setParsedData(processedFiles)
          setIsStandardTemplate(true) // Agora está no formato padrão
          
          // Importar direto após IA processar (sem preview/mapping/validação)
          setImportProgress(90)
          await validateAndImportDirectly(processedFiles, finalMappings)
        } catch (aiError: any) {
          // Se falhar com LYA, usar detecção automática tradicional
          console.warn('LYA não disponível, usando detecção automática:', aiError)
          
          // Tentar detecção automática primeiro
          const autoMappings = autoDetectMappings(parsed[0]?.headers || [])
          
          // Se a detecção automática encontrou pelo menos o nome (campo obrigatório), tentar importar direto
          const hasNameMapping = autoMappings.some(m => m.targetField === 'name' && m.sourceColumn)
          
          if (hasNameMapping) {
            setFieldMappings(autoMappings)
            setParsedData(parsed)
            setImportProgress(90)
            // Tentar importar direto mesmo com detecção automática
            await validateAndImportDirectly(parsed, autoMappings)
          } else {
            // Só mostrar preview/mapping se realmente não conseguir detectar nada
            setFieldMappings(autoMappings)
            setParsedData(parsed)
            setImportProgress(100)
            setImporting(false)
            setStep('preview')
            setError('Não foi possível detectar automaticamente os campos. Revise o mapeamento abaixo.')
          }
        }
      }
    } catch (err: any) {
      console.error('Erro ao processar arquivos:', err)
      const errorMessage = err.message || 'Erro ao processar arquivos. Verifique se o arquivo está no formato correto.'
      setError(errorMessage)
      setImporting(false)
      setImportProgress(0)
      setStep('upload') // Voltar para o passo de upload em caso de erro
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    multiple: true
  })

  const parseFiles = async (files: File[]): Promise<ParsedData[]> => {
    const results: ParsedData[] = []
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/nutri/import/parse', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Erro ao processar ${file.name}`
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || `Erro ao processar ${file.name}`)
      }
      
      if (!data.headers || data.headers.length === 0) {
        throw new Error(`Não foi possível detectar cabeçalhos no arquivo ${file.name}`)
      }
      
      results.push({
        headers: data.headers,
        rows: data.rows || [],
        fileName: data.fileName || file.name,
        totalRows: data.rows?.length || 0
      })
    }
    
    return results
  }

  const autoDetectMappings = (headers: string[]): MappedField[] => {
    const mappings: MappedField[] = []
    
    FIELD_MAPPINGS.forEach(field => {
      const detectedColumn = detectColumn(headers, field.key)
      mappings.push({
        sourceColumn: detectedColumn || '',
        targetField: field.key,
        required: field.required
      })
    })
    
    return mappings
  }

  const detectColumn = (headers: string[], fieldKey: string): string | null => {
    const patterns: Record<string, string[]> = {
      name: ['nome', 'name', 'paciente', 'cliente', 'nome completo', 'nome_completo'],
      email: ['email', 'e-mail', 'mail', 'correio'],
      phone: ['telefone', 'phone', 'fone', 'celular', 'contato', 'whatsapp'],
      weight: ['peso', 'weight', 'kg', 'peso atual', 'peso_atual'],
      height: ['altura', 'height', 'cm', 'estatura'],
      goal: ['objetivo', 'goal', 'meta', 'finalidade'],
      notes: ['observações', 'notes', 'obs', 'comentários', 'anotações'],
      birth_date: ['nascimento', 'birth', 'data nascimento', 'data_nascimento', 'aniversário'],
      gender: ['gênero', 'gender', 'sexo', 'genero']
    }

    const fieldPatterns = patterns[fieldKey] || []
    
    for (const header of headers) {
      const normalizedHeader = header.toLowerCase().trim()
      for (const pattern of fieldPatterns) {
        if (normalizedHeader.includes(pattern)) {
          return header
        }
      }
    }
    
    return null
  }

  const validateAndImportDirectly = async (data: ParsedData[], mappings: MappedField[]) => {
    setStep('importing')
    setImporting(true)
    setImportProgress(60)
    
    try {
      // Validar primeiro
      const validateResponse = await fetch('/api/nutri/import/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          mappings: mappings
        }),
        credentials: 'include'
      })
      
      if (!validateResponse.ok) {
        const errorData = await validateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erro na validação dos dados')
      }
      
      const validationResult = await validateResponse.json()
      
      if (!validationResult.success) {
        throw new Error(validationResult.error || 'Erro na validação dos dados')
      }
      
      setValidationResult(validationResult)
      setImportProgress(70)
      
      // Se houver erros críticos OU nenhuma linha válida, mostrar preview
      if (!validationResult.valid || validationResult.validRows === 0) {
        // Se houver erros críticos, mostrar preview para o usuário corrigir
        setImporting(false)
        setImportProgress(100)
        setStep('preview')
        if (validationResult.errors && validationResult.errors.length > 0) {
          setError(`Erros encontrados: ${validationResult.errors.slice(0, 3).join(', ')}${validationResult.errors.length > 3 ? '...' : ''}`)
        } else if (validationResult.validRows === 0) {
          setError('Nenhuma linha válida encontrada para importar')
        }
        return
      }
      
      // Se validou, importar direto
      setImportProgress(80)
      await importDataDirectly(data, mappings)
    } catch (err: any) {
      console.error('Erro na validação/importação direta:', err)
      // Em caso de erro, mostrar preview para o usuário
      setImporting(false)
      setImportProgress(100)
      setStep('preview')
      setError(err.message || 'Erro ao processar. Revise os dados abaixo.')
    }
  }

  const importDataDirectly = async (data: ParsedData[], mappings: MappedField[]) => {
    setImportProgress(85)
    
    try {
      const response = await fetch('/api/nutri/import/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          mappings: mappings
        }),
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erro na importação dos dados')
      }
      
      const result = await response.json()
      setImportProgress(100)
      
      setTimeout(() => {
        setStep('success')
        setImporting(false)
        setValidationResult(prev => prev ? { ...prev, validRows: result.imported || 0 } : null)
      }, 500)
      
    } catch (err: any) {
      setError(err.message || 'Erro na importação')
      setImporting(false)
      setStep('preview') // Voltar para preview em caso de erro
    }
  }

  const validateData = async () => {
    setStep('validation')
    
    try {
      const response = await fetch('/api/nutri/import/validate', {
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

  const processTextWithAI = async () => {
    if (!textInput.trim()) {
      setError('Por favor, cole ou digite o texto com informações dos pacientes')
      return
    }

    setProcessingText(true)
    setError(null)

    try {
      const response = await fetch('/api/nutri/import/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textInput }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erro ao processar texto com IA')
      }

      const result = await response.json()
      
      if (result.clients && result.clients.length > 0) {
        setExtractedClients(result.clients)
        setEditingClients([...result.clients])
        setStep('preview')
      } else {
        setError('Nenhum paciente foi encontrado no texto. Tente adicionar mais detalhes ou verifique se o texto contém informações de pacientes.')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar texto com LYA')
    } finally {
      setProcessingText(false)
    }
  }

  const importData = async () => {
    setStep('importing')
    setImporting(true)
    setImportProgress(0)
    
    try {
      let response: Response
      
      if (importMode === 'text' && editingClients.length > 0) {
        // Importar dados extraídos do texto
        // Converter para formato compatível com a API de processamento
        const convertedData: ParsedData[] = [{
          headers: FIELD_MAPPINGS.map(f => f.label),
          rows: editingClients.map(client => [
            client.name || '',
            client.email || '',
            client.phone || '',
            client.weight?.toString() || '',
            client.height?.toString() || '',
            client.goal || '',
            client.notes || '',
            client.birth_date || '',
            client.gender || ''
          ]),
          fileName: 'texto-livre',
          totalRows: editingClients.length
        }]

        const standardMappings: MappedField[] = FIELD_MAPPINGS.map((field, index) => ({
          sourceColumn: convertedData[0].headers[index] || '',
          targetField: field.key,
          required: field.required
        }))

        response = await fetch('/api/nutri/import/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: convertedData,
            mappings: standardMappings
          }),
          credentials: 'include'
        })
      } else {
        // Importar dados do Excel
        response = await fetch('/api/nutri/import/process', {
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
      }
      
      if (!response.ok) {
        throw new Error('Erro na importação dos dados')
      }
      
      // Simular progresso
      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 200)
      
      const result = await response.json()
      setImportProgress(100)
      
      setTimeout(() => {
        setStep('success')
        setImporting(false)
        setValidationResult(prev => prev ? { ...prev, validRows: result.imported || 0 } : null)
      }, 500)
      
    } catch (err: any) {
      setError(err.message || 'Erro na importação')
      setImporting(false)
    }
  }

  const resetModal = () => {
    setStep('upload')
    setImportMode('excel')
    setFiles([])
    setParsedData([])
    setFieldMappings([])
    setValidationResult(null)
    setImporting(false)
    setImportProgress(0)
    setError(null)
    setTextInput('')
    setExtractedClients([])
    setEditingClients([])
    setProcessingText(false)
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
            <h2 className="text-xl font-semibold text-gray-900">Importar Pacientes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Importe seus pacientes de planilhas Excel, CSV ou Google Sheets
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
                    ? 'bg-blue-600 text-white' 
                    : ['upload', 'preview', 'mapping', 'validation', 'importing', 'success'].indexOf(step) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepItem.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === stepItem.key ? 'text-blue-600' : 'text-gray-600'
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

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Seletor de Modo */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Escolha como deseja importar:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setImportMode('excel')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      importMode === 'excel'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">📊</div>
                    <div className="font-semibold text-gray-900 mb-1">Planilha Excel/CSV</div>
                    <div className="text-sm text-gray-600">Para quem já tem planilhas organizadas</div>
                  </button>
                  <button
                    onClick={() => setImportMode('text')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      importMode === 'text'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">🤖</div>
                    <div className="font-semibold text-gray-900 mb-1">LYA te ajuda a importar</div>
                    <div className="text-sm text-gray-600">Cole suas anotações e deixe a LYA organizar</div>
                  </button>
                </div>
              </div>

              {/* Modo Excel */}
              {importMode === 'excel' && (
                <>
              {/* Template Padrão - Destaque Principal */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Padrão</h3>
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  Use nosso template padrão para garantir <strong>100% de precisão</strong> na importação. 
                  Baixe, preencha e importe - tudo automático, sem erros!
                </p>
                <button
                  onClick={downloadTemplate}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  📥 Baixar Template Excel
                </button>
              </div>

              {/* Seção: IA Reestrutura Automaticamente */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">✨</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      ✨ Seu modelo é diferente? Não tem problema!
                    </h4>
                    <p className="text-gray-700 mb-4">
                      <strong>Nossa IA reestrutura automaticamente!</strong> Faça upload da sua planilha em qualquer formato e nossa inteligência artificial vai entender, mapear e organizar tudo automaticamente. Você não precisa fazer nada!
                    </p>
                    
                    <div className="bg-white rounded-lg border-2 border-green-200 p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">🤖</div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Como funciona:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>✅ Faça upload da sua planilha (qualquer formato)</li>
                            <li>✅ A LYA analisa os cabeçalhos automaticamente</li>
                            <li>✅ Mapeia e reestrutura no formato padrão</li>
                            <li>✅ Pronto para importar!</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>💡 Tudo acontece automaticamente!</strong> Basta fazer upload da sua planilha e deixar a IA trabalhar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opção de Upload */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    📤 Importar Planilha
                  </h4>
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span>📥</span>
                    Baixar Template Padrão
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Faça upload da sua planilha em qualquer formato. A LYA vai reestruturar automaticamente!
                </p>
              <div
                {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center ${
                  isDragActive 
                        ? 'border-blue-500 bg-blue-100' 
                        : 'border-blue-300 hover:border-blue-400 bg-gray-50'
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
                </>
              )}

              {/* Modo Texto Livre */}
              {importMode === 'text' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8">
                    <div className="text-5xl mb-4 text-center">🤖</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      LYA te ajuda a importar
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto text-center">
                      <strong>Não precisa de Excel!</strong> Cole suas anotações em qualquer formato e a LYA vai extrair e organizar os dados dos pacientes automaticamente.
                    </p>
                    
                    <div className="bg-white rounded-lg p-6 mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📝 Cole ou digite suas anotações sobre os pacientes:
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Exemplo:
Maria Silva, email: maria@email.com, telefone: (11) 98765-4321, peso: 70kg, altura: 165cm, objetivo: emagrecimento
João Santos, joao@email.com, (11) 91234-5678, 85kg, 175cm, ganho de massa muscular
Ana Costa, anacosta@gmail.com, (21) 99876-5432, 60kg, 160cm, melhora da saúde..."
                        className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Você pode colar anotações em qualquer formato: listas, textos corridos, planilhas copiadas, etc. A LYA vai entender e organizar!
                      </p>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={processTextWithAI}
                        disabled={!textInput.trim() || processingText}
                        className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {processingText ? (
                          <>
                            <span className="inline-block animate-spin mr-2">⚙️</span>
                            LYA está processando...
                          </>
                        ) : (
                          <>
                            🤖 Pedir ajuda da LYA
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4">
                      <p className="text-sm text-gray-700">
                        <strong>💡 Dica:</strong> Quanto mais informações você colar, melhor! A IA consegue extrair nomes, emails, telefones, pesos, alturas, objetivos e outras informações mesmo que estejam em formatos diferentes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div>
              {/* Preview para dados extraídos do texto */}
              {importMode === 'text' && editingClients.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="text-5xl mb-3">🤖</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Dados Extraídos pela LYA
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {editingClients.length} paciente(s) encontrado(s). Revise e edite se necessário:
                    </p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {editingClients.map((client, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Nome *
                            </label>
                            <input
                              type="text"
                              value={client.name || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].name = e.target.value
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={client.email || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].email = e.target.value
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Telefone
                            </label>
                            <input
                              type="text"
                              value={client.phone || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].phone = e.target.value
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="(11) 98765-4321"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Peso (kg)
                            </label>
                            <input
                              type="number"
                              value={client.weight || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].weight = e.target.value ? parseFloat(e.target.value) : undefined
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Altura (cm)
                            </label>
                            <input
                              type="number"
                              value={client.height || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].height = e.target.value ? parseFloat(e.target.value) : undefined
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Objetivo
                            </label>
                            <input
                              type="text"
                              value={client.goal || ''}
                              onChange={(e) => {
                                const updated = [...editingClients]
                                updated[index].goal = e.target.value
                                setEditingClients(updated)
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Observações
                          </label>
                          <textarea
                            value={client.notes || ''}
                            onChange={(e) => {
                              const updated = [...editingClients]
                              updated[index].notes = e.target.value
                              setEditingClients(updated)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = editingClients.filter((_, i) => i !== index)
                            setEditingClients(updated)
                          }}
                          className="mt-2 text-xs text-red-600 hover:text-red-800"
                        >
                          🗑️ Remover
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ {editingClients.length} paciente(s) pronto(s) para importar. Revise os dados acima e clique em "Importar" quando estiver satisfeito.
                    </p>
                  </div>
                </div>
              )}

              {/* Preview para dados do Excel */}
              {importMode === 'excel' && parsedData.length > 0 && (
                <>
              {isStandardTemplate && (
                <div className="text-center py-8">
                  {error ? (
                    <>
                      <div className="text-6xl mb-4">⚠️</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Erros Encontrados</h3>
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto text-left">
                        <p className="text-red-800 font-semibold mb-2">{error}</p>
                        {validationResult?.errors && validationResult.errors.length > 0 && (
                          <ul className="text-sm text-red-700 space-y-1">
                            {validationResult.errors.slice(0, 5).map((err: string, idx: number) => (
                              <li key={idx}>• {err}</li>
                            ))}
                            {validationResult.errors.length > 5 && (
                              <li className="text-red-600">... e mais {validationResult.errors.length - 5} erro(s)</li>
                            )}
                          </ul>
                        )}
                      </div>
                      <p className="text-gray-600 mb-6">
                        Corrija os erros acima e tente novamente, ou clique em "Continuar" para revisar os dados.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => setStep('mapping')}
                          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                        >
                          Revisar Mapeamento
                        </button>
                        <button
                          onClick={async () => await validateData()}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Validar Novamente
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Padrão Confirmado!</h3>
                      <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                        Seu arquivo está no formato padrão. {parsedData.reduce((sum, data) => sum + data.totalRows, 0)} paciente(s) será(ão) importado(s) automaticamente.
                      </p>
                      <button
                        onClick={async () => await validateData()}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        ✓ Confirmar e Importar
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {!isStandardTemplate && (
                <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Encontrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {parsedData.reduce((sum, data) => sum + data.totalRows, 0)}
                    </div>
                    <div className="text-sm text-blue-800">Total de Registros</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{parsedData.length}</div>
                    <div className="text-sm text-green-800">Arquivos Processados</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {parsedData[0]?.headers.length || 0}
                    </div>
                    <div className="text-sm text-purple-800">Colunas Detectadas</div>
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
                </>
              )}
            </div>
          )}

          {/* Mapping Step */}
          {step === 'mapping' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapeamento de Campos</h3>
                <p className="text-gray-600">
                  Conecte as colunas da sua planilha com os campos do sistema
                </p>
              </div>

              <div className="space-y-4">
                {FIELD_MAPPINGS.map((field) => {
                  const mapping = fieldMappings.find(m => m.targetField === field.key)
                  return (
                    <div key={field.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      <div className="flex-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Não mapear</option>
                          {parsedData[0]?.headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20 text-center">
                        {mapping?.sourceColumn && (
                          <span className="text-green-600 text-xl">✅</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Dicas de Mapeamento</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Campos obrigatórios devem ser mapeados</li>
                  <li>• O sistema detectou automaticamente alguns campos</li>
                  <li>• Você pode ajustar os mapeamentos conforme necessário</li>
                </ul>
              </div>
            </div>
          )}

          {/* Validation Step */}
          {step === 'validation' && validationResult && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Validação dos Dados</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{validationResult.validRows}</div>
                  <div className="text-sm text-green-800">Registros Válidos</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{validationResult.duplicates}</div>
                  <div className="text-sm text-yellow-800">Duplicatas Removidas</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{validationResult.errors.length}</div>
                  <div className="text-sm text-red-800">Erros Encontrados</div>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">❌ Erros Encontrados</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">⚠️ Avisos</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.valid && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">✅ Pronto para Importar!</h4>
                  <p className="text-sm text-green-800">
                    {validationResult.validRows} pacientes serão importados com sucesso.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Importando Pacientes...</h3>
              <p className="text-gray-600 mb-6">Aguarde enquanto processamos seus dados</p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
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
                Seus pacientes foram importados com sucesso e já estão disponíveis no sistema.
              </p>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult?.validRows || 0}
                    </div>
                    <div className="text-sm text-green-800">Pacientes Importados</div>
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
            {step === 'preview' && importMode === 'text' && editingClients.length > 0 && (
              <button
                onClick={importData}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={importing || editingClients.some(c => !c.name || c.name.trim() === '')}
              >
                Importar {editingClients.length} Paciente(s)
              </button>
            )}
            
            {step === 'preview' && importMode === 'excel' && !isStandardTemplate && (
              <button
                onClick={() => setStep('mapping')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            )}
            
            {step === 'mapping' && (
              <button
                onClick={validateData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!fieldMappings.some(m => m.required && m.sourceColumn)}
              >
                Validar Dados
              </button>
            )}
            
            {step === 'validation' && validationResult?.valid && (
              <button
                onClick={importData}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={importing}
              >
                Importar Agora
              </button>
            )}
            
            {step === 'success' && (
              <button
                onClick={handleSuccess}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Pacientes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
