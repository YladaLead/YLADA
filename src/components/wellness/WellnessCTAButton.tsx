'use client'

// =====================================================
// YLADA - COMPONENTE CTA BUTTON COMPARTILHADO WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'
import { useParams } from 'next/navigation'

interface WellnessCTAButtonProps {
  config?: ToolConfig
  resultado?: any
  resultadoTexto?: string
  nomeCliente?: string
  className?: string
  template_id?: string // ID do template para rastrear conversões
  lead_id?: string // ID do lead (opcional)
}

export default function WellnessCTAButton({
  config,
  resultado,
  resultadoTexto,
  nomeCliente,
  className = '',
  template_id,
  lead_id
}: WellnessCTAButtonProps) {
  // Se não tem config, não renderiza nada
  if (!config) return null

  // Tentar obter slug da URL se não tiver template_id
  const params = useParams()
  const toolSlug = params?.['tool-slug'] as string | undefined

  // Função para rastrear conversão quando botão é clicado
  const rastrearConversao = async () => {
    try {
      // Só rastrear se tiver template_id ou slug
      if (!template_id && !toolSlug) return

      await fetch('/api/wellness/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: template_id || undefined,
          slug: toolSlug || undefined,
          lead_id: lead_id || undefined
        }),
      })
      // Silencioso - não interrompe o fluxo se falhar
    } catch (error) {
      console.error('Erro ao rastrear conversão:', error)
      // Não mostrar erro para o usuário
    }
  }

  // Formatar mensagem do WhatsApp com placeholders
  const formatarMensagem = (mensagem: string): string => {
    let msg = mensagem
    if (resultadoTexto) {
      msg = msg.replace(/\[RESULTADO\]/g, resultadoTexto)
    }
    if (nomeCliente) {
      msg = msg.replace(/\[NOME_CLIENTE\]/g, nomeCliente)
    }
    msg = msg.replace(/\[DATA\]/g, new Date().toLocaleString('pt-BR'))
    return msg
  }

  // Renderizar botão WhatsApp
  if (config.cta_type === 'whatsapp' && config.whatsapp_number) {
    // Limpar número e verificar se já tem código do país
    let numeroLimpo = config.whatsapp_number.replace(/[^0-9]/g, '')
    
    // Se country_code está disponível e o número não começa com código de país conhecido, adicionar
    if (config.country_code && config.country_code !== 'BR' && config.country_code !== 'OTHER') {
      // Buscar código telefônico do país
      const { getCountryByCode } = require('@/components/CountrySelector')
      const country = getCountryByCode(config.country_code)
      
      if (country && country.phoneCode) {
        const phoneCode = country.phoneCode.replace(/[^0-9]/g, '')
        // Se o número não começa com o código do país, adicionar
        if (!numeroLimpo.startsWith(phoneCode)) {
          numeroLimpo = phoneCode + numeroLimpo
        }
      }
    } else if (!config.country_code || config.country_code === 'BR') {
      // Para Brasil, garantir que tem código 55 se não tiver
      if (!numeroLimpo.startsWith('55')) {
        numeroLimpo = '55' + numeroLimpo
      }
    }
    
    const mensagem = config.custom_whatsapp_message
      ? formatarMensagem(config.custom_whatsapp_message)
      : 'Olá! Gostaria de saber mais sobre como posso melhorar minha saúde.'

    return (
      <div 
        className={`rounded-xl p-6 border-2 ${className}`}
        style={{
          background: config.custom_colors
            ? `linear-gradient(135deg, ${config.custom_colors.principal}15 0%, ${config.custom_colors.secundaria}15 100%)`
            : 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)',
          borderColor: config.custom_colors?.principal || '#93c5fd'
        }}
      >
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">
            💬 Quer orientações personalizadas para alcançar seu objetivo?
          </p>
          <a
            href={`https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={rastrearConversao}
            className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg"
            style={{
              background: config.custom_colors
                ? `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                : '#16a34a'
            }}
          >
            📱 {config.cta_button_text || 'Falar no WhatsApp'}
          </a>
        </div>
      </div>
    )
  }

  // Renderizar botão URL Externa
  if (config.cta_type === 'url_externa' && config.external_url) {
    return (
      <div 
        className={`rounded-xl p-6 border-2 ${className}`}
        style={{
          background: config.custom_colors
            ? `linear-gradient(135deg, ${config.custom_colors.principal}15 0%, ${config.custom_colors.secundaria}15 100%)`
            : 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)',
          borderColor: config.custom_colors?.principal || '#93c5fd'
        }}
      >
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">
            💬 Quer saber mais?
          </p>
          <a
            href={config.external_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={rastrearConversao}
            className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg"
            style={{
              background: config.custom_colors
                ? `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                : '#16a34a'
            }}
          >
            {config.cta_button_text || 'Saiba Mais'}
          </a>
        </div>
      </div>
    )
  }

  // Fallback: botão padrão WhatsApp (se não tem config completa)
  return (
    <div className={`rounded-xl p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}>
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-4">
          💬 Quer orientações personalizadas?
        </p>
        <a
          href={`https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Gostaria de conversar sobre bem-estar.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={rastrearConversao}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
        >
          📱 Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}























