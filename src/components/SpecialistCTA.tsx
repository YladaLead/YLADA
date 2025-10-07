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
  professional: {
    name: string
    specialty: string
    company: string
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
      const urlParams = new URLSearchParams(window.location.search)
      const linkId = urlParams.get('link')
      
      if (linkId) {
        try {
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
            .eq('id', linkId)
            .single()

          if (!error && data) {
            // Corrigir estrutura dos dados do Supabase
            const linkData: LinkData = {
              ...data,
              professional: Array.isArray(data.professional) ? data.professional[0] : data.professional
            }
            setLinkData(linkData)
          }
        } catch (error) {
          console.error('Erro ao buscar dados do link:', error)
        }
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
        <p className="text-sm text-emerald-700 mb-3">
          💡 <strong>{linkData.custom_message}</strong>
        </p>
      )}
      
      {linkData?.professional && (
        <p className="text-xs text-emerald-600 mb-3">
          👨‍⚕️ <strong>{linkData.professional.name}</strong>
          {linkData.professional.specialty && ` - ${linkData.professional.specialty}`}
          {linkData.professional.company && ` (${linkData.professional.company})`}
        </p>
      )}
      
      <button
        onClick={handleContactSpecialist}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {linkData?.cta_text || 'Falar com Especialista'}
      </button>
    </div>
  )
}
