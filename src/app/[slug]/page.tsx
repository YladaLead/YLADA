'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface LinkData {
  id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  project_name: string
  professional: {
    name: string
    specialty: string
    company: string
  }
}

export default function UserLinkPage({ params }: { params: Promise<{ slug: string }> }) {
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
        const { slug } = resolvedParams
        
        // Buscar o link diretamente pelo custom_slug
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
          .eq('custom_slug', slug)
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
          setLinkData(linkData)
          
          // REDIRECIONAMENTO IMEDIATO para a ferramenta (sem tela intermediária)
          if (data.tool_name) {
            // Construir URL da ferramenta com ref do usuário
            const toolUrl = `https://fitlead.ylada.com/tools/${data.tool_name}?ref=${slug}`
            console.log('🚀 Redirecionando IMEDIATAMENTE para ferramenta:', toolUrl)
            // Redirecionamento IMEDIATO - sem delay
            window.location.replace(toolUrl)
            return
          }
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
      window.location.href = linkData.redirect_url
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando link...</p>
        </div>
      </div>
    )
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link não encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'Este link não existe ou foi desativado'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div className="text-emerald-600 text-4xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {linkData.project_name}
          </h1>
          <p className="text-gray-600 mb-4">
            {linkData.custom_message || 'Clique no botão abaixo para acessar a ferramenta'}
          </p>
        </div>

        {linkData.professional && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Profissional</h3>
            <p className="text-gray-700 font-medium">{linkData.professional.name}</p>
          </div>
        )}

        <button
          onClick={handleRedirect}
          className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 font-medium text-lg transition-colors"
        >
          {linkData.cta_text}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Powered by YLADA
        </p>
      </div>
    </div>
  )
}
