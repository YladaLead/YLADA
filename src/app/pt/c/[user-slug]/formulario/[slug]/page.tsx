'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function PreencherFormularioCoachPage() {
  const params = useParams()
  const userSlug = params['user-slug'] as string
  const slug = params['slug'] as string
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [formulario, setFormulario] = useState<any>(null)
  const [respostas, setRespostas] = useState<Record<string, any>>({})
  const [mensagemSucesso, setMensagemSucesso] = useState(false)
  const [responseId, setResponseId] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [countryCodes, setCountryCodes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!userSlug || !slug) return

    const carregarFormulario = async () => {
      try {
        setCarregando(true)
        setErro(null)
        
        console.log('🔍 Carregando formulário:', {
          userSlug,
          slug
        })
        
        // Buscar formulário por user_slug e slug (rota pública, sem autenticação)
        const apiUrl = `/api/public/formularios/by-slug?user_slug=${encodeURIComponent(userSlug)}&slug=${encodeURIComponent(slug)}`
        console.log('📡 Chamando API:', apiUrl)
        
        const response = await fetch(apiUrl)
        
        console.log('📥 Resposta da API:', {
          status: response.status,
          ok: response.ok
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Erro na API:', errorData)
          throw new Error(errorData.error || 'Formulário não encontrado')
        }

        const data = await response.json()
        console.log('📦 Dados recebidos:', {
          success: data.success,
          hasForm: !!data.data?.form,
          formName: data.data?.form?.name
        })
        
        if (data.success && data.data.form) {
          setFormulario(data.data.form)
          // Inicializar respostas vazias
          const respostasIniciais: Record<string, any> = {}
          data.data.form.structure?.fields?.forEach((field: any) => {
            if (field.type === 'checkbox') {
              respostasIniciais[field.id] = []
            } else if (field.type === 'file') {
              respostasIniciais[field.id] = null
            } else {
              respostasIniciais[field.id] = ''
            }
          })
          setRespostas(respostasIniciais)
        } else {
          throw new Error('Formulário não encontrado')
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar formulário:', error)
        setErro(error.message || 'Formulário não encontrado ou não está mais disponível.')
      } finally {
        setCarregando(false)
      }
    }

    carregarFormulario()
  }, [userSlug, slug])

  const handleChange = (fieldId: string, value: any) => {
    setRespostas(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setErro(null)

    if (!formulario) {
      setErro('Formulário não carregado')
      setEnviando(false)
      return
    }

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
      const response = await fetch(`/api/public/formularios/${formulario.id}/respostas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: respostas
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMensagemSucesso(true)
        setResponseId(data.data?.response?.id || null)
        // Limpar formulário após sucesso
        setTimeout(() => {
          setRespostas({})
        }, 2000)
      } else {
        setErro(data.error || 'Erro ao enviar formulário')
      }
    } catch (error: any) {
      console.error('Erro ao enviar:', error)
      setErro('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  if (erro && !formulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <YLADALogo />
          <div className="mt-6">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
            <p className="text-gray-600 mb-6">{erro}</p>
            <button
              onClick={() => window.location.href = '/pt/c/formularios'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Voltar para Formulários
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!formulario) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {formulario.name}
            </h1>
            {formulario.description && (
              <p className="text-gray-600">{formulario.description}</p>
            )}
          </div>

          {mensagemSucesso ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Formulário enviado com sucesso!</h2>
              <p className="text-gray-600 mb-6">Obrigado por preencher o formulário.</p>
              {responseId && (
                <p className="text-sm text-gray-500">ID da resposta: {responseId}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formulario.structure?.fields?.map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.helpText && (
                    <p className="text-xs text-gray-500">{field.helpText}</p>
                  )}

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'tel' && (
                    <PhoneInputWithCountry
                      value={respostas[field.id] || ''}
                      onChange={(phone, countryCode) => {
                        handleChange(field.id, phone)
                        setCountryCodes(prev => ({ ...prev, [field.id]: countryCode }))
                      }}
                      defaultCountryCode={countryCodes[field.id] || 'BR'}
                      className="w-full"
                      placeholder={field.placeholder || "11 99999-9999"}
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'time' && (
                    <input
                      type="time"
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={respostas[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Selecione...</option>
                      {field.options?.map((option: string, idx: number) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options?.map((option: string, idx: number) => (
                        <label key={idx} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={respostas[field.id] === option}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            required={field.required}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && (
                    <div className="space-y-2">
                      {field.options?.map((option: string, idx: number) => (
                        <label key={idx} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(respostas[field.id] || []).includes(option)}
                            onChange={(e) => {
                              const current = respostas[field.id] || []
                              if (e.target.checked) {
                                handleChange(field.id, [...current, option])
                              } else {
                                handleChange(field.id, current.filter((v: string) => v !== option))
                              }
                            }}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'yesno' && (
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={field.id}
                          value="sim"
                          checked={respostas[field.id] === 'sim'}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          required={field.required}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Sim</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={field.id}
                          value="nao"
                          checked={respostas[field.id] === 'nao'}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          required={field.required}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Não</span>
                      </label>
                    </div>
                  )}

                  {field.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={field.min || 1}
                        max={field.max || 10}
                        step={field.step || 1}
                        value={respostas[field.id] || field.min || 1}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{field.min || 1}</span>
                        <span className="font-semibold text-purple-600">{respostas[field.id] || field.min || 1}</span>
                        <span>{field.max || 10}</span>
                      </div>
                    </div>
                  )}

                  {field.type === 'file' && (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleChange(field.id, file.name)
                        }
                      }}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}
                </div>
              ))}

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{erro}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enviando ? 'Enviando...' : 'Enviar Formulário'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


