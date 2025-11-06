// =====================================================
// YLADA - COMPONENTE CTA BUTTON COMPARTILHADO WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'

interface WellnessCTAButtonProps {
  config?: ToolConfig
  resultado?: any
  resultadoTexto?: string
  nomeCliente?: string
  className?: string
}

export default function WellnessCTAButton({
  config,
  resultado,
  resultadoTexto,
  nomeCliente,
  className = ''
}: WellnessCTAButtonProps) {
  // Se não tem config, não renderiza nada
  if (!config) return null

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
    const numeroLimpo = config.whatsapp_number.replace(/[^0-9]/g, '')
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
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
        >
          📱 Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}











