'use client'

import { usePathname } from 'next/navigation'
import SupportChatWidget from '@/components/nutri/support/SupportChatWidget'
import WhatsAppFloatingButton from '@/components/nutri/WhatsAppFloatingButton'
import { useEffect, useState } from 'react'

export default function ConditionalWidget() {
  const pathname = usePathname()
  const [toolData, setToolData] = useState<{
    whatsapp_number?: string
    custom_whatsapp_message?: string
    country_code?: string | null
  } | null>(null)

  // Verificar se é página pública de ferramenta
  const isPublicToolPage = pathname?.match(/^\/pt\/nutri\/[^\/]+\/[^\/]+$/)

  useEffect(() => {
    if (isPublicToolPage) {
      // Buscar dados da ferramenta para obter WhatsApp
      const fetchToolData = async () => {
        try {
          const match = pathname?.match(/^\/pt\/nutri\/([^\/]+)\/([^\/]+)$/)
          if (!match) return

          const [, userSlug, toolSlug] = match
          const response = await fetch(
            `/api/nutri/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
          )

          if (response.ok) {
            const data = await response.json()
            if (data.tool) {
              setToolData({
                whatsapp_number: data.tool.whatsapp_number,
                custom_whatsapp_message: data.tool.custom_whatsapp_message,
                country_code: data.tool.user_profiles?.country_code || null,
              })
            }
          } else {
            // Se não conseguir buscar, limpar dados
            setToolData(null)
          }
        } catch (err) {
          console.error('Erro ao buscar dados da ferramenta:', err)
          setToolData(null)
        }
      }

      fetchToolData()
    } else {
      // Se não for página pública, limpar dados
      setToolData(null)
    }
  }, [pathname, isPublicToolPage])

  // Se for página pública de ferramenta, mostrar botão WhatsApp
  if (isPublicToolPage) {
    return (
      <WhatsAppFloatingButton
        whatsappNumber={toolData?.whatsapp_number}
        customMessage={toolData?.custom_whatsapp_message}
        countryCode={toolData?.country_code}
      />
    )
  }

  // Caso contrário, mostrar chat de suporte
  return <SupportChatWidget />
}

