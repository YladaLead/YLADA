'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { MessageSquare, ExternalLink, Copy, CheckCircle } from 'lucide-react'

interface LinkData {
  id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  secure_id: string
  is_active: boolean
  professional: {
    name: string
    specialty: string
    company: string
  }
}

export default function ToolPage() {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const ref = urlParams.get('ref')
        
        if (!ref) {
          setError('Link inválido ou expirado')
          setLoading(false)
          return
        }

        // Buscar dados do link usando o secure_id
        const { data, error: linkError } = await supabase
          .from('professional_links')
          .select(`
            *,
            professional:professionals(name, specialty, company)
          `)
          .eq('secure_id', ref)
          .eq('is_active', true)
          .single()

        if (linkError || !data) {
          setError('Link não encontrado ou desativado')
          setLoading(false)
          return
        }

        // Verificar se o profissional está ativo (aqui você pode adicionar lógica de pagamento)
        if (!data.professional) {
          setError('Profissional não encontrado')
          setLoading(false)
          return
        }

        setLinkData(data)

        // Incrementar contador de visualizações
        await supabase
          .from('professional_links')
          .update({ 
            views: data.views + 1,
            last_accessed: new Date().toISOString()
          })
          .eq('id', data.id)

      } catch (err) {
        console.error('Erro ao carregar link:', err)
        setError('Erro interno do servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [supabase])

  const handleRedirect = () => {
    if (!linkData) return
    
    // Registrar clique (opcional)
    supabase
      .from('professional_links')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', linkData.id)

    // Redirecionar
    window.open(linkData.redirect_url, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Carregando ferramenta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Link Inválido</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  if (!linkData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {linkData.tool_name === 'bmi' && 'Calculadora de IMC'}
                {linkData.tool_name === 'protein' && 'Necessidades de Proteína'}
                {linkData.tool_name === 'body-composition' && 'Composição Corporal'}
                {linkData.tool_name === 'meal-planner' && 'Planejador de Refeições'}
                {linkData.tool_name === 'hydration' && 'Monitor de Hidratação'}
                {linkData.tool_name === 'nutrition-assessment' && 'Avaliação Nutricional'}
                {linkData.tool_name === 'health-goals' && 'Objetivos de Saúde'}
                {linkData.tool_name === 'lifestyle-evaluation' && 'Avaliação de Estilo de Vida'}
                {linkData.tool_name === 'wellness-checkup' && 'Check-up de Bem-estar'}
              </h1>
              <p className="text-gray-600 mt-1">
                Por {linkData.professional.name} • {linkData.professional.specialty}
              </p>
            </div>
            <button
              onClick={copyLink}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tool Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-3xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ferramenta Profissional de Saúde
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Use esta ferramenta desenvolvida por {linkData.professional.name} para avaliar sua saúde e receber recomendações personalizadas.
              </p>
            </div>

            {/* Custom Message */}
            {linkData.custom_message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Mensagem do Especialista</h3>
                    <p className="text-blue-800 leading-relaxed">{linkData.custom_message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tool Placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500 text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ferramenta em Desenvolvimento</h3>
                <p className="text-gray-600">
                  Esta ferramenta será implementada em breve. Por enquanto, você pode entrar em contato com o especialista.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={handleRedirect}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <ExternalLink className="w-6 h-6" />
                <span>{linkData.cta_text}</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                {linkData.redirect_type === 'whatsapp' && 'Será redirecionado para o WhatsApp'}
                {linkData.redirect_type === 'website' && 'Será redirecionado para o site'}
                {linkData.redirect_type === 'instagram' && 'Será redirecionado para o Instagram'}
                {linkData.redirect_type === 'telegram' && 'Será redirecionado para o Telegram'}
                {linkData.redirect_type === 'email' && 'Será redirecionado para o email'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Ferramenta desenvolvida por <span className="font-semibold">{linkData.professional.name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {linkData.professional.company && `${linkData.professional.company} • `}
                  {linkData.professional.specialty}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  Link protegido e monitorado
                </p>
                <p className="text-xs text-gray-400">
                  Powered by YLADA
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

