'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'

export default function PreencherFormularioPage() {
  const params = useParams()
  const formId = params.formId as string
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [formulario, setFormulario] = useState<any>(null)
  const [respostas, setRespostas] = useState<Record<string, any>>({})
  const [mensagemSucesso, setMensagemSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!formId) return

    const carregarFormulario = async () => {
      try {
        setCarregando(true)
        // Buscar formulário (rota pública, sem autenticação)
        const response = await fetch(`/api/public/formularios/${formId}`)
        
        if (!response.ok) {
          throw new Error('Formulário não encontrado')
        }

        const data = await response.json()
        if (data.success && data.data.form) {
          setFormulario(data.data.form)
          // Inicializar respostas vazias
          const respostasIniciais: Record<string, any> = {}
          data.data.form.structure?.fields?.forEach((field: any) => {
            if (field.type === 'checkbox') {
              respostasIniciais[field.id] = []
            } else {
              respostasIniciais[field.id] = ''
            }
          })
          setRespostas(respostasIniciais)
        }
      } catch (error: any) {
        console.error('Erro ao carregar formulário:', error)
        setErro('Formulário não encontrado ou não está mais disponível.')
      } finally {
        setCarregando(false)
      }
    }

    carregarFormulario()
  }, [formId])

  const handleChange = (fieldId: string, value: any) => {
    setRespostas(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)

    // Validar campos obrigatórios
    const camposObrigatorios = formulario.structure?.fields?.filter((f: any) => f.required) || []
    for (const campo of camposObrigatorios) {
      const resposta = respostas[campo.id]
      if (!resposta || (Array.isArray(resposta) && resposta.length === 0)) {
        setErro(`O campo "${campo.label}" é obrigatório`)
        setEnviando(false)
        return
      }
    }

    try {
      const response = await fetch(`/api/public/formularios/${formId}/respostas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: respostas
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar formulário')
      }

      if (data.success) {
        setMensagemSucesso(true)
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error)
      setErro(error.message || 'Erro ao enviar formulário. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const renderField = (field: any) => {
    const value = respostas[field.id] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        )
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma opção</option>
            {field.options?.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="text-blue-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={opt}
                  checked={Array.isArray(value) && value.includes(opt)}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleChange(field.id, [...current, opt])
                    } else {
                      handleChange(field.id, current.filter((v: string) => v !== opt))
                    }
                  }}
                  className="text-blue-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              required={field.required}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${field.unit ? 'pr-12' : ''}`}
            />
            {field.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {field.unit}
              </span>
            )}
          </div>
        )
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )
      case 'time':
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )
      case 'yesno':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
              <input
                type="radio"
                name={field.id}
                value="sim"
                checked={value === 'sim'}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="text-blue-600"
              />
              <span>Sim</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
              <input
                type="radio"
                name={field.id}
                value="nao"
                checked={value === 'nao'}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="text-blue-600"
              />
              <span>Não</span>
            </label>
          </div>
        )
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 1}
              max={field.max || 10}
              step={field.step || 1}
              value={value || field.min || 1}
              onChange={(e) => handleChange(field.id, parseInt(e.target.value))}
              required={field.required}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min || 1}</span>
              <span className="font-semibold text-blue-600">{value || field.min || 1}</span>
              <span>{field.max || 10}</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  if (erro && !formulario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário não encontrado</h1>
          <p className="text-gray-600">{erro}</p>
        </div>
      </div>
    )
  }

  if (mensagemSucesso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário enviado!</h1>
          <p className="text-gray-600">Obrigado por preencher o formulário. Suas respostas foram enviadas com sucesso.</p>
        </div>
      </div>
    )
  }

  if (!formulario) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <YLADALogo />
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{formulario.name}</h1>
          {formulario.description && (
            <p className="text-gray-600 mb-6">{formulario.description}</p>
          )}

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {formulario.structure?.fields?.map((field: any) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-600 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.helpText && (
                  <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={enviando}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar Formulário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

