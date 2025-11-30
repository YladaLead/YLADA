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
    const numeroOriginal = numeroLimpo
    
    // Debug: verificar config recebido
    console.log('📱 WhatsApp CTA - Config recebido:', {
      whatsapp_number: config.whatsapp_number,
      country_code: config.country_code,
      numeroLimpo: numeroOriginal
    })
    
    // Função auxiliar para verificar se número já tem código do país
    const numeroTemCodigoPais = (numero: string, phoneCode: string): boolean => {
      // Para códigos de 1 dígito (EUA, Canadá), verificar se número tem 11+ dígitos E começa com 1
      if (phoneCode === '1') {
        return numero.length >= 11 && numero.startsWith('1')
      }
      // Para outros países, verificar se começa com o código
      return numero.startsWith(phoneCode)
    }
    
    // SEMPRE tentar adicionar código do país se country_code estiver disponível
    if (config.country_code && config.country_code !== 'OTHER' && config.country_code !== null && config.country_code !== '') {
      // Buscar código telefônico do país
      const { getCountryByCode } = require('@/components/CountrySelector')
      const country = getCountryByCode(config.country_code)
      
      console.log('📱 WhatsApp CTA - País encontrado:', {
        country_code: config.country_code,
        country: country ? { code: country.code, phoneCode: country.phoneCode } : null
      })
      
      if (country && country.phoneCode) {
        const phoneCode = country.phoneCode.replace(/[^0-9]/g, '')
        
        // Verificar se número já tem código do país usando lógica melhorada
        const jaTemCodigo = numeroTemCodigoPais(numeroLimpo, phoneCode)
        
        if (!jaTemCodigo) {
          numeroLimpo = phoneCode + numeroLimpo
          console.log('✅ WhatsApp CTA - Adicionado código do país:', {
            country_code: config.country_code,
            phoneCode,
            numeroOriginal,
            numeroFinal: numeroLimpo
          })
        } else {
          console.log('ℹ️ WhatsApp CTA - Número já tem código do país:', {
            country_code: config.country_code,
            phoneCode,
            numeroOriginal: numeroLimpo
          })
        }
      } else {
        console.warn('⚠️ WhatsApp CTA - País não encontrado no CountrySelector:', config.country_code)
        // Se país não foi encontrado, tentar adicionar código padrão baseado no tamanho do número
        // Números dos EUA têm 10 dígitos, então se tiver 10 dígitos e não começar com código, adicionar 1
        if (numeroLimpo.length === 10 && !numeroLimpo.startsWith('1') && !numeroLimpo.startsWith('55')) {
          // Provavelmente é número dos EUA
          numeroLimpo = '1' + numeroLimpo
          console.log('📱 WhatsApp CTA - Número de 10 dígitos, assumindo EUA:', {
            numeroOriginal,
            numeroFinal: numeroLimpo
          })
        }
      }
    } else {
      // Se não tem country_code, tentar inferir pelo tamanho do número
      console.warn('⚠️ WhatsApp CTA - country_code não disponível, tentando inferir:', {
        country_code: config.country_code,
        numeroOriginal,
        tamanho: numeroLimpo.length
      })
      
      // Números dos EUA têm 10 dígitos (sem código)
      if (numeroLimpo.length === 10 && !numeroLimpo.startsWith('1') && !numeroLimpo.startsWith('55')) {
        numeroLimpo = '1' + numeroLimpo
        console.log('📱 WhatsApp CTA - Número de 10 dígitos, assumindo EUA:', {
          numeroOriginal,
          numeroFinal: numeroLimpo
        })
      }
      // Números brasileiros têm 11 dígitos (2 DDD + 9 número) ou 13 com código 55
      else if (numeroLimpo.length === 11 && numeroLimpo.startsWith('11') && !numeroLimpo.startsWith('55')) {
        numeroLimpo = '55' + numeroLimpo
        console.log('📱 WhatsApp CTA - Número de 11 dígitos começando com 11, assumindo Brasil:', {
          numeroOriginal,
          numeroFinal: numeroLimpo
        })
      }
      // Se número já tem 11+ dígitos e começa com código conhecido, manter como está
      else if (numeroLimpo.length >= 11 && (numeroLimpo.startsWith('1') || numeroLimpo.startsWith('55'))) {
        console.log('ℹ️ WhatsApp CTA - Número já parece ter código do país:', {
          numeroOriginal: numeroLimpo
        })
      }
      // Se número tem menos de 10 dígitos, assumir Brasil (padrão)
      else if (numeroLimpo.length < 10) {
        numeroLimpo = '55' + numeroLimpo
        console.log('📱 WhatsApp CTA - Número muito curto, assumindo Brasil:', {
          numeroOriginal,
          numeroFinal: numeroLimpo
        })
      }
    }
    
    // Garantir que o número final não está vazio
    if (!numeroLimpo || numeroLimpo.length === 0) {
      console.error('❌ WhatsApp CTA - Número final está vazio!', {
        whatsapp_number: config.whatsapp_number,
        country_code: config.country_code,
        numeroOriginal
      })
      numeroLimpo = numeroOriginal || '5511999999999' // Fallback para número padrão
    }
    
    // Log final do número que será usado
    console.log('📱 WhatsApp CTA - Número final que será usado:', {
      numeroOriginal,
      numeroFinal: numeroLimpo,
      country_code: config.country_code,
      link: `https://wa.me/${numeroLimpo}`
    })
    
    const mensagem = config.custom_whatsapp_message
      ? formatarMensagem(config.custom_whatsapp_message)
      : 'Olá! Gostaria de saber mais sobre como posso melhorar minha saúde.'

    // Mensagem simples para o botão WhatsApp pequeno
    const mensagemSimples = 'Olá! Gostaria de falar com você.'

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
          <div className="flex items-center justify-center gap-3">
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
            <a
              href={`https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagemSimples)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
              title="Fale conosco no WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar botão URL Externa
  if (config.cta_type === 'url_externa' && config.external_url) {
    // Se tiver WhatsApp configurado, mostrar botão pequeno também
    let numeroLimpo = config.whatsapp_number ? config.whatsapp_number.replace(/[^0-9]/g, '') : null
    const mensagemSimples = 'Olá! Gostaria de falar com você.'
    
    // Aplicar mesma lógica de formatação do número do WhatsApp principal
    if (numeroLimpo && config.country_code && config.country_code !== 'OTHER' && config.country_code !== null && config.country_code !== '') {
      const { getCountryByCode } = require('@/components/CountrySelector')
      const country = getCountryByCode(config.country_code)
      if (country && country.phoneCode) {
        const phoneCode = country.phoneCode.replace(/[^0-9]/g, '')
        const numeroTemCodigoPais = (phoneCode === '1' && numeroLimpo.length >= 11 && numeroLimpo.startsWith('1')) || 
                                     (phoneCode !== '1' && numeroLimpo.startsWith(phoneCode))
        if (!numeroTemCodigoPais) {
          numeroLimpo = phoneCode + numeroLimpo
        }
      }
    } else if (numeroLimpo && numeroLimpo.length === 10 && !numeroLimpo.startsWith('1') && !numeroLimpo.startsWith('55')) {
      numeroLimpo = '1' + numeroLimpo
    } else if (numeroLimpo && numeroLimpo.length === 11 && numeroLimpo.startsWith('11') && !numeroLimpo.startsWith('55')) {
      numeroLimpo = '55' + numeroLimpo
    } else if (numeroLimpo && numeroLimpo.length < 10) {
      numeroLimpo = '55' + numeroLimpo
    }

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
          <div className="flex items-center justify-center gap-3">
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
            {numeroLimpo && config.show_whatsapp_button !== false && (
              <a
                href={`https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagemSimples)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                title="Fale conosco no WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Fallback: botão padrão WhatsApp (se não tem config completa)
  const mensagemSimples = 'Olá! Gostaria de falar com você.'
  return (
    <div className={`rounded-xl p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}>
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-4">
          💬 Quer orientações personalizadas?
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href={`https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Gostaria de conversar sobre bem-estar.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={rastrearConversao}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            📱 Falar no WhatsApp
          </a>
          <a
            href={`https://wa.me/5511999999999?text=${encodeURIComponent(mensagemSimples)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
            title="Fale conosco no WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}























