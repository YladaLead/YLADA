'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

export default function EnviarFormularioNutri() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <EnviarFormularioNutriContent />
    </ProtectedRoute>
  )
}

function EnviarFormularioNutriContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string
  const [carregando, setCarregando] = useState(true)
  const [formulario, setFormulario] = useState<any>(null)
  const [linkGerado, setLinkGerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !formId) return

    const carregarFormulario = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/coach/formularios/${formId}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Formulário não encontrado')
        }

        const data = await response.json()
        if (data.success && data.data.form) {
          setFormulario(data.data.form)
          // Gerar link automaticamente
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
          const link = `${baseUrl}/f/${formId}`
          setLinkGerado(link)
        }
      } catch (error: any) {
        console.error('Erro ao carregar formulário:', error)
        setMensagemErro('Erro ao carregar formulário')
      } finally {
        setCarregando(false)
      }
    }

    carregarFormulario()
  }, [user, formId])

  const copiarLink = () => {
    if (linkGerado) {
      navigator.clipboard.writeText(linkGerado)
      setCopiado(true)
      setMensagemSucesso('Link copiado para a área de transferência!')
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const enviarPorEmail = () => {
    if (linkGerado) {
      const assunto = encodeURIComponent(`Formulário: ${formulario?.name || 'Formulário'}`)
      const corpo = encodeURIComponent(`Olá!\n\nPreencha este formulário:\n${linkGerado}\n\nObrigado!`)
      window.open(`mailto:?subject=${assunto}&body=${corpo}`)
    }
  }

  const enviarPorWhatsApp = () => {
    if (linkGerado) {
      const mensagem = encodeURIComponent(`Olá! Preencha este formulário: ${linkGerado}`)
      window.open(`https://wa.me/?text=${mensagem}`, '_blank')
    }
  }

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!formulario) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Notificações */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-1">Sucesso!</h3>
              <p className="text-xs text-green-700">{mensagemSucesso}</p>
            </div>
            <button 
              onClick={() => setMensagemSucesso(null)}
              className="text-green-600 hover:text-green-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
              <p className="text-xs text-red-700">{mensagemErro}</p>
            </div>
            <button 
              onClick={() => setMensagemErro(null)}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Enviar Formulário</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pt/c/formularios')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Enviar Formulário</h1>
            <p className="text-gray-600 mt-1">Compartilhe este formulário com seus clientes</p>
          </div>

          {/* Informações do Formulário */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{formulario.name}</h2>
            {formulario.description && (
              <p className="text-gray-600 mb-4">{formulario.description}</p>
            )}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {formulario.structure?.fields?.length || 0} campos
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {formulario.form_type === 'anamnese' ? 'Anamnese' : 
                 formulario.form_type === 'avaliacao' ? 'Avaliação' :
                 formulario.form_type === 'questionario' ? 'Questionário' :
                 formulario.form_type === 'consentimento' ? 'Consentimento' : 'Outro'}
              </span>
            </div>
          </div>

          {/* Link do Formulário */}
          {linkGerado && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Link do Formulário</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={linkGerado}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copiarLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copiado
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {copiado ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Compartilhe este link com seus clientes. Eles poderão preencher o formulário diretamente.
              </p>
            </div>
          )}

          {/* Opções de Envio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar por</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={enviarPorEmail}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <span className="text-3xl">✉️</span>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">E-mail</h4>
                  <p className="text-sm text-gray-600">Enviar link por e-mail</p>
                </div>
              </button>

              <button
                onClick={enviarPorWhatsApp}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <span className="text-3xl">💬</span>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <p className="text-sm text-gray-600">Enviar link por WhatsApp</p>
                </div>
              </button>
            </div>
          </div>

          {/* QR Code (opcional) */}
          {linkGerado && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkGerado)}`}
                  alt="QR Code"
                  className="mb-4"
                />
                <p className="text-xs text-gray-500 text-center">
                  Cliente pode escanear este código para acessar o formulário
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}






















