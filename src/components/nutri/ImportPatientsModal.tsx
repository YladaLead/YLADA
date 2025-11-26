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
  const [files, setFiles] = useState<File[]>([])
  const [parsedData, setParsedData] = useState<ParsedData[]>([])
  const [fieldMappings, setFieldMappings] = useState<MappedField[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isStandardTemplate, setIsStandardTemplate] = useState(false)

  const downloadTemplate = () => {
    const headers = FIELD_MAPPINGS.map(field => field.label)
    
    const wb = XLSX.utils.book_new()
    const wsData = [
      headers,
      [
        'Maria Silva',
        'maria@email.com',
        '(11) 98765-4321',
        '70',
        '165',
        'Emagrecimento saudável',
        'Paciente com histórico de ansiedade',
        '15/03/1990',
        'Feminino'
      ]
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = FIELD_MAPPINGS.map(() => ({ wch: 20 }))
    
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
    
    try {
      const parsed = await parseFiles(acceptedFiles)
      setParsedData(parsed)
      
      // Verificar se é template padrão
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
      } else {
        // Auto-detectar mapeamentos
        const autoMappings = autoDetectMappings(parsed[0]?.headers || [])
        setFieldMappings(autoMappings)
      }
      
      setStep('preview')
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
        throw new Error(`Erro ao processar ${file.name}`)
      }
      
      const data = await response.json()
      results.push({
        headers: data.headers,
        rows: data.rows,
        fileName: file.name,
        totalRows: data.rows.length
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

  const importData = async () => {
    setStep('importing')
    setImporting(true)
    setImportProgress(0)
    
    try {
      const response = await fetch('/api/nutri/import/process', {
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
      }, 500)
      
    } catch (err: any) {
      setError(err.message || 'Erro na importação')
      setImporting(false)
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

              {/* Seção: Seu modelo é diferente? */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
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
                    <div className="bg-white rounded-lg border-2 border-purple-200 p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                          📋 Prompt pronto para o ChatGPT:
                        </label>
                        <button
                          onClick={() => {
                            const prompt = `Preciso converter uma planilha de pacientes para o formato padrão do sistema YLADA Nutri. 

FORMATO DE ENTRADA: [Cole aqui os cabeçalhos da sua planilha atual]

FORMATO DE SAÍDA (template padrão YLADA Nutri):
Nome | Email | Telefone | Peso Atual (kg) | Altura (cm) | Objetivo | Observações | Data de Nascimento | Gênero

INSTRUÇÕES:
1. Analise os cabeçalhos da minha planilha e identifique correspondências com o template padrão
2. Mapeie os campos equivalentes (ex: "Nome Completo" → "Nome", "Peso" → "Peso Atual (kg)")
3. Para campos que não existem na minha planilha, deixe vazio
4. Mantenha a ordem exata das colunas do template padrão
5. Retorne apenas os dados convertidos, sem explicações adicionais
6. Use formato Excel/CSV (separado por tabulação ou vírgula)

Por favor, converta os dados da minha planilha para este formato padrão.`
                            navigator.clipboard.writeText(prompt)
                            alert('Prompt copiado! Cole no ChatGPT e adicione seus dados.')
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          📋 Copiar Prompt
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
{`Preciso converter uma planilha de pacientes para o formato padrão do sistema YLADA Nutri.

FORMATO DE ENTRADA: [Cole aqui os cabeçalhos da sua planilha atual]

FORMATO DE SAÍDA (template padrão YLADA Nutri):
Nome | Email | Telefone | Peso Atual (kg) | Altura (cm) | Objetivo | Observações | Data de Nascimento | Gênero

INSTRUÇÕES:
1. Analise os cabeçalhos da minha planilha e identifique correspondências
2. Mapeie os campos equivalentes (ex: "Nome Completo" → "Nome")
3. Para campos inexistentes, deixe vazio
4. Mantenha a ordem exata das colunas do template padrão
5. Retorne apenas os dados convertidos em formato Excel/CSV`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>💡 Dica:</strong> Copie o prompt acima, cole no ChatGPT junto com os dados da sua planilha, e o ChatGPT fará a conversão automaticamente para o formato padrão!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opção de Upload (apenas para template padrão) */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  📤 Importar Planilha no Template Padrão
                </h4>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Após preencher o template padrão (ou converter com ChatGPT), faça o upload aqui:
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
                    Seu arquivo está no formato padrão. {parsedData.reduce((sum, data) => sum + data.totalRows, 0)} paciente(s) será(ão) importado(s) automaticamente.
                  </p>
                  <button
                    onClick={async () => await validateData()}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ✓ Confirmar e Importar
                  </button>
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
            {step === 'preview' && !isStandardTemplate && (
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
