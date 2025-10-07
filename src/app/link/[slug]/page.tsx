'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface LinkData {
  id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  project_name?: string
  professional: {
    name: string
    specialty: string
    company: string
  }
}

export default function CustomLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const resolvedParams = await params
        const { data, error } = await supabase
          .from('professional_links')
          .select(`
            id,
            tool_name,
            cta_text,
            redirect_url,
            custom_message,
            redirect_type,
            project_name,
            professional:professional_id (
              name,
              specialty,
              company
            )
          `)
          .eq('custom_slug', resolvedParams.slug)
          .eq('is_active', true)
          .single()

        if (error) {
          console.error('Erro ao buscar link:', error)
          setError('Link não encontrado ou inativo')
          return
        }

        if (data) {
          // Corrigir estrutura dos dados do Supabase
          const linkData: LinkData = {
            ...data,
            professional: Array.isArray(data.professional) ? data.professional[0] : data.professional
          }
          console.log('📊 Link data encontrado:', linkData)
          console.log('🔗 Redirect URL:', linkData.redirect_url)
          setLinkData(linkData)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do link:', error)
        setError('Erro interno do servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [params, supabase])

  const handleRedirect = () => {
    if (linkData?.redirect_url) {
      console.log('🔗 Redirecionando para:', linkData.redirect_url)
      window.location.href = linkData.redirect_url
    } else {
      console.error('❌ URL de redirecionamento não encontrada')
      alert('Erro: URL de redirecionamento não encontrada')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando link...</p>
        </div>
      </div>
    )
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'Este link não existe ou foi desativado'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {linkData.project_name || 'Link Personalizado'}
          </h1>
          <p className="text-gray-600">
            Ferramenta: {linkData.tool_name.replace('-', ' ')}
          </p>
        </div>

        {linkData.custom_message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Mensagem:</strong><br/>
              {linkData.custom_message}
            </p>
          </div>
        )}

        {linkData.professional && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              👨‍⚕️ <strong>Profissional:</strong> {linkData.professional.name}
              {linkData.professional.specialty && ` - ${linkData.professional.specialty}`}
              {linkData.professional.company && ` (${linkData.professional.company})`}
            </p>
          </div>
        )}

        <button
          onClick={handleRedirect}
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
        >
          {linkData.cta_text || 'Falar com Especialista'}
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Link personalizado • {linkData.redirect_type}
        </div>
      </div>
    </div>
  )
}
