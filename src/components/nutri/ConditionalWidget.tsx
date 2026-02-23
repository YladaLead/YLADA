'use client'

import { usePathname } from 'next/navigation'
import WhatsAppFloatingButton from '@/components/nutri/WhatsAppFloatingButton'
import { useEffect, useState } from 'react'

export default function ConditionalWidget() {
  const pathname = usePathname()
  const [toolData, setToolData] = useState<{
    whatsapp_number?: string
    custom_whatsapp_message?: string
    country_code?: string | null
  } | null>(null)

  // Verificar se é página pública de ferramenta (Nutri, Coach ou Wellness)
  // Excluir rotas internas que têm 2 segmentos mas não são user-slug/tool-slug (ex: /pt/nutri/metodo/jornada)
  const reservedSegments = ['metodo', 'formacao', 'ferramentas', 'configuracao', 'diagnostico', 'checkout', 'login', 'home', 'onboarding', 'recuperar-senha', 'reset-password', 'pagamento-sucesso', 'suporte', 'cursos', 'leads', 'clientes', 'quiz-personalizado', 'descobrir', 'oferta']
  const pathSegments = pathname?.split('/').filter(Boolean) || []
  const secondSegment = pathSegments[2] // ex: "metodo" em /pt/nutri/metodo/jornada
  const isReservedPath = secondSegment && reservedSegments.includes(secondSegment)
  const isPublicToolPage = !isReservedPath && pathname?.match(/^\/pt\/(nutri|coach|wellness)\/[^\/]+\/[^\/]+$/)
  const areaMatch = pathname?.match(/^\/pt\/(nutri|coach|wellness)\//)
  const area = areaMatch ? areaMatch[1] : null

  useEffect(() => {
    if (isPublicToolPage && area) {
      // Buscar dados da ferramenta para obter WhatsApp
      const fetchToolData = async () => {
        try {
          const match = pathname?.match(/^\/pt\/(nutri|coach|wellness)\/([^\/]+)\/([^\/]+)$/)
          if (!match) return

          const [, areaSlug, userSlug, toolSlug] = match
          
          // Usar API apropriada para cada área
          const apiUrl = `/api/${areaSlug}/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
          const response = await fetch(apiUrl)

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
  }, [pathname, isPublicToolPage, area])

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

  // Caso contrário, não mostrar widgets na área Nutri
  // (o botão "Tirar dúvida com uma consultora" está na landing page)
  if (area === 'nutri') {
    return null
  }

  // Para Coach e Wellness, não mostrar nada por enquanto
  // (pode adicionar chat de suporte específico depois se necessário)
  return null
}

