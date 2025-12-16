'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function VerRespostaFormularioPage() {
  const params = useParams()
  const formId = params.formId as string
  const responseId = params.responseId as string
  const [carregando, setCarregando] = useState(true)
  const [formulario, setFormulario] = useState<any>(null)
  const [resposta, setResposta] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)

  useEffect(() => {
    if (!formId || !responseId) return

    const carregarDados = async () => {
      try {
        setCarregando(true)
        
        // Buscar formulário
        const formResponse = await fetch(`/api/public/formularios/${formId}`)
        if (!formResponse.ok) {
          throw new Error('Formulário não encontrado')
        }
        const formData = await formResponse.json()
        if (formData.success) {
          setFormulario(formData.data.form)
          // Determinar área baseado no perfil do usuário ou form_type
          const userArea = formData.data.form.user_area
          const formType = formData.data.form.form_type
          if (userArea === 'coach' || userArea === 'nutri') {
            setArea(userArea)
          } else if (formType === 'coach' || formType === 'nutri') {
            setArea(formType)
          }
        }

        // Buscar resposta
        const responseResponse = await fetch(`/api/public/formularios/${formId}/respostas/${responseId}`)
        if (!responseResponse.ok) {
          throw new Error('Resposta não encontrada')
        }
        const responseData = await responseResponse.json()
        if (responseData.success) {
          setResposta(responseData.data.response)
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error)
        setErro(error.message || 'Erro ao carregar dados')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [formId, responseId])

  const formatarResposta = (field: any, resposta: any) => {
    if (resposta === null || resposta === undefined || resposta === '') {
      return <span className="text-gray-400 italic">Não respondido</span>
    }

    switch (field.type) {
      case 'checkbox':
        return Array.isArray(resposta) && resposta.length > 0
          ? resposta.join(', ')
          : <span className="text-gray-400 italic">Nenhuma opção selecionada</span>
      case 'radio':
      case 'select':
        return resposta
      case 'yesno':
        return resposta === true || resposta === 'true' || resposta === 'sim' ? 'Sim' : 'Não'
      case 'date':
        if (resposta) {
          const date = new Date(resposta)
          return date.toLocaleDateString('pt-BR')
        }
        return '-'
      case 'time':
        return resposta
      case 'file':
        return resposta ? (
          <div className="flex items-center gap-2">
            <a 
              href={resposta} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a2 2 0 000-2.828l-6.414-6.414a2 2 0 10-2.828 2.828L15.172 7z" />
              </svg>
              Ver arquivo enviado
            </a>
          </div>
        ) : '-'
      default:
        return String(resposta)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas respostas...</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600">{erro}</p>
        </div>
      </div>
    )
  }

  if (!formulario || !resposta) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Image
            src={
              area === 'coach'
                ? "/images/logo/coach-horizontal.png"
                : area === 'nutri'
                ? "/images/logo/nutri-horizontal.png"
                : "/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
            }
            alt={
              area === 'coach'
                ? "Coach by YLADA"
                : area === 'nutri'
                ? "Nutri by YLADA"
                : "YLADA Logo"
            }
            width={area === 'coach' || area === 'nutri' ? 280 : 280}
            height={area === 'coach' || area === 'nutri' ? 84 : 84}
            className="h-12 w-auto object-contain"
            style={{ backgroundColor: 'transparent' }}
            priority
          />
        </div>
      </div>

      {/* Respostas */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{formulario.name}</h1>
          {formulario.description && (
            <p className="text-gray-600 mb-6">{formulario.description}</p>
          )}

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📋 <strong>Suas respostas enviadas em:</strong> {new Date(resposta.completed_at || resposta.created_at).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="space-y-6">
            {formulario.structure?.fields?.map((field: any) => {
              const respostaCampo = resposta.responses[field.id]
              return (
                <div key={field.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-600 ml-1">*</span>}
                  </label>
                  <div className="text-gray-900">
                    {formatarResposta(field, respostaCampo)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


