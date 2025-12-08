'use client'

import { useState, useEffect } from 'react'

interface FormPreviewModalProps {
  form: any
  link: string
  userSlug: string | null
  onClose: () => void
}

export default function FormPreviewModal({ form, link, userSlug, onClose }: FormPreviewModalProps) {
  const [formularioCompleto, setFormularioCompleto] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!form || !form.id) {
      setErro('Formulário inválido')
      setCarregando(false)
      return
    }

    const carregarFormulario = async () => {
      try {
        setCarregando(true)
        setErro(null)

        console.log('🔍 Carregando formulário para preview:', {
          formId: form.id,
          formName: form.name,
          shortCode: form.short_code,
          slug: form.slug,
          userSlug: userSlug,
          isTemplate: form.is_template,
          hasStructure: !!form.structure
        })

        // Se for template e já tiver estrutura, usar diretamente
        if (form.is_template && form.structure) {
          console.log('✅ Usando estrutura do template diretamente')
          setFormularioCompleto({
            ...form,
            name: form.name,
            description: form.description,
            structure: form.structure
          })
          setCarregando(false)
          return
        }

        // Para formulários do usuário, buscar pela API
        // Determinar qual API usar baseado no tipo de link
        // Adicionar ?preview=true para permitir preview mesmo se não estiver ativo
        let apiUrl = ''
        if (form.short_code) {
          apiUrl = `/api/public/formularios/${form.id}?preview=true`
        } else if (userSlug && form.slug) {
          apiUrl = `/api/public/formularios/by-slug?user_slug=${encodeURIComponent(userSlug)}&slug=${encodeURIComponent(form.slug)}&preview=true`
        } else {
          apiUrl = `/api/public/formularios/${form.id}?preview=true`
        }

        console.log('📡 Chamando API:', apiUrl)

        const response = await fetch(apiUrl)
        
        console.log('📥 Resposta da API:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Erro na resposta:', errorData)
          throw new Error(errorData.error || `Erro ${response.status}: Formulário não encontrado`)
        }

        const data = await response.json()
        console.log('📦 Dados recebidos:', data)

        if (data.success && data.data && data.data.form) {
          console.log('✅ Formulário carregado com sucesso')
          setFormularioCompleto(data.data.form)
        } else if (data.form) {
          // Fallback: se a resposta vier direto com form
          console.log('✅ Formulário carregado (fallback)')
          setFormularioCompleto(data.form)
        } else {
          console.error('❌ Formato de resposta inválido:', data)
          throw new Error('Formulário não encontrado ou formato de resposta inválido')
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar formulário:', error)
        setErro(error.message || 'Erro ao carregar formulário')
      } finally {
        setCarregando(false)
      }
    }

    carregarFormulario()
  }, [form?.id, form?.short_code, form?.slug, form?.is_template, form?.structure, userSlug])

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            disabled
            placeholder={field.placeholder || 'Exemplo de resposta...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
      case 'textarea':
        return (
          <textarea
            disabled
            rows={4}
            placeholder={field.placeholder || 'Digite sua resposta aqui...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
      case 'email':
        return (
          <input
            type="email"
            disabled
            placeholder={field.placeholder || 'exemplo@email.com'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
      case 'tel':
      case 'phone':
        return (
          <div className="flex items-stretch border border-gray-300 rounded-lg bg-gray-50">
            <div className="w-12 h-full flex items-center justify-center border-r border-gray-300 rounded-l-lg">
              <span className="text-xl">🌍</span>
            </div>
            <span className="text-gray-500 px-2 border-r border-gray-300 text-sm font-medium min-w-[42px] text-center flex items-center">+--</span>
            <input
              type="tel"
              disabled
              placeholder={field.placeholder || '11 99999-9999'}
              className="flex-1 px-3 py-2 bg-transparent text-gray-500"
            />
          </div>
        )
      case 'number':
        return (
          <input
            type="number"
            disabled
            placeholder={field.placeholder || '0'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
      case 'select':
        return (
          <select
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          >
            <option value="">Selecione uma opção...</option>
            {field.options?.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-2 text-gray-500">
                <input type="radio" disabled className="text-purple-600" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" disabled className="text-purple-600" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
            <p className="text-sm text-gray-500">Área de upload de arquivo</p>
          </div>
        )
      default:
        return (
          <input
            type="text"
            disabled
            placeholder="Campo de texto"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        )
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{form.name}</h2>
              {form.description && (
                <p className="text-purple-100 text-sm mt-1">{form.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Abrir em nova aba
              </a>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Preview do Formulário */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {carregando ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando formulário...</p>
              </div>
            </div>
          ) : erro ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-medium mb-2">⚠️ {erro}</p>
              <p className="text-red-600 text-sm mb-4">O formulário pode não estar ativo ou não estar mais disponível.</p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Tentar abrir em nova aba
              </a>
            </div>
          ) : formularioCompleto ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{formularioCompleto.name}</h3>
              {formularioCompleto.description && (
                <p className="text-gray-600 mb-6">{formularioCompleto.description}</p>
              )}

              <div className="space-y-6">
                {formularioCompleto.structure?.fields?.map((field: any) => (
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
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-800 font-medium mb-2">📝 Este é um preview do formulário</p>
                  <p className="text-xs text-purple-600">Os campos estão desabilitados. Para preencher, abra o formulário em uma nova aba.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}


