'use client'

import { MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface SpecialistCTAProps {
  toolName?: string
  className?: string
}

interface LinkData {
  id: string
  tool_name: string
  cta_text: string
  redirect_url: string
  custom_message: string
  redirect_type: string
  project_name?: string
  custom_slug?: string
  professional: {
    name: string
  }
}

export default function SpecialistCTA({ className = '' }: SpecialistCTAProps) {
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchLinkData = async () => {
      console.log('🔍 SpecialistCTA: Iniciando busca de dados...')
      const urlParams = new URLSearchParams(window.location.search)
      const linkId = urlParams.get('ref') || urlParams.get('link')
      
      console.log('🌐 URL atual:', window.location.href)
      console.log('🔗 LinkId encontrado:', linkId)
      
      if (linkId) {
        try {
          console.log('🔍 Buscando dados do link com ref:', linkId)
          
          // O ref agora é o custom_slug diretamente
          const customSlug = linkId
          
          console.log('🔗 Custom slug extraído:', customSlug)
          
          // Buscar por custom_slug
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
              custom_slug,
              professional:professional_id (
                name
              )
            `)
            .eq('custom_slug', customSlug)
            .eq('is_active', true)
            .single()
          
          console.log('📊 Dados encontrados:', { data, error })
          
          if (!error && data) {
            console.log('✅ Dados carregados com sucesso:', data)
            // Corrigir estrutura dos dados do Supabase
            const linkData: LinkData = {
              ...data,
              professional: Array.isArray(data.professional) ? data.professional[0] : data.professional
            }
            setLinkData(linkData)
            console.log('🎯 LinkData final:', linkData)
          } else {
            console.error('❌ Erro ao buscar dados:', error)
          }
        } catch (error) {
          console.error('❌ Erro ao buscar dados do link:', error)
        }
      } else {
        console.log('⚠️ Nenhum ref encontrado na URL')
      }
      setLoading(false)
    }

    fetchLinkData()
  }, [supabase])

  const handleContactSpecialist = () => {
    if (linkData?.redirect_url) {
      window.location.href = linkData.redirect_url
    } else {
      window.location.href = '/fitlead'
    }
  }

  if (loading) {
    return (
      <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-emerald-200 rounded mb-3"></div>
          <div className="h-10 bg-emerald-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 ${className}`}>
      {linkData?.custom_message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Mensagem Personalizada:</strong><br/>
            {linkData.custom_message}
          </p>
        </div>
      )}
      
      {linkData?.professional && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            👨‍⚕️ <strong>Profissional:</strong> {linkData.professional.name}
          </p>
          {linkData.project_name && (
            <p className="text-xs text-gray-600 mt-1">
              📋 <strong>Projeto:</strong> {linkData.project_name}
            </p>
          )}
        </div>
      )}
      
      <button
        onClick={handleContactSpecialist}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {linkData?.cta_text || 'Falar com Especialista'}
      </button>
      
      {linkData && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Link personalizado • {linkData.redirect_type}
        </div>
      )}
      
      {/* Debug info - remover depois */}
      {process.env.NODE_ENV === 'development' && linkData && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> {linkData.custom_slug} → {linkData.redirect_url}
        </div>
      )}
    </div>
  )
}
