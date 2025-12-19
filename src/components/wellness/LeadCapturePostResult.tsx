'use client'

// =====================================================
// COMPONENTE DE CAPTURA DE LEAD PÓS-RESULTADO
// Estratégia: Mostrar resultado PRIMEIRO, capturar DEPOIS (opcional)
// =====================================================

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ToolConfig } from '@/types/wellness'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

interface LeadCapturePostResultProps {
  config?: ToolConfig
  ferramenta: string // Nome da ferramenta (ex: "Calculadora de Água")
  resultadoTexto: string // Resultado para incluir na mensagem WhatsApp
  mensagemConvite: string // Mensagem convidativa (ex: "Quer um plano completo de hidratação?")
  beneficios: string[] // Lista de benefícios de deixar contato
  className?: string
}

export default function LeadCapturePostResult({
  config,
  ferramenta,
  resultadoTexto,
  mensagemConvite,
  beneficios,
  className = ''
}: LeadCapturePostResultProps) {
  const params = useParams()
  const toolSlug = params?.['tool-slug'] as string | undefined
  const userSlug = params?.['user-slug'] as string | undefined

  // 🔍 DEBUG: Verificar parâmetros
  console.log('🔍 LeadCapturePostResult - Params:', { params, toolSlug, userSlug })

  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('BR') // Padrão: Brasil
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  // Obter número WhatsApp do nutricionista/coach
  let numeroWhatsApp = ''
  if (config?.whatsapp_number) {
    let numeroLimpo = config.whatsapp_number.replace(/[^0-9]/g, '')
    
    // Adicionar código do país se necessário
    if (config.country_code && config.country_code !== 'OTHER') {
      const { getCountryByCode } = require('@/components/CountrySelector')
      const country = getCountryByCode(config.country_code)
      
      if (country && country.phoneCode) {
        const phoneCode = country.phoneCode.replace(/[^0-9]/g, '')
        if (!numeroLimpo.startsWith(phoneCode)) {
          numeroLimpo = phoneCode + numeroLimpo
        }
      }
    } else if (numeroLimpo.length === 10) {
      // Assumir EUA se tiver 10 dígitos
      numeroLimpo = '1' + numeroLimpo
    } else if (numeroLimpo.length === 11 && numeroLimpo.startsWith('11')) {
      // Assumir Brasil se tiver 11 dígitos começando com 11
      numeroLimpo = '55' + numeroLimpo
    }
    
    numeroWhatsApp = numeroLimpo
  }

  // Mensagem WhatsApp pré-preenchida
  const mensagemWhatsApp = `Oi! Acabei de usar ${ferramenta} e gostei do resultado: ${resultadoTexto}. Gostaria de saber mais!`

  // Enviar contato (captura de lead)
  const handleEnviarContato = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      alert('Por favor, preencha seu nome.')
      return
    }

    if (!whatsapp.trim()) {
      alert('Por favor, preencha seu WhatsApp.')
      return
    }

    setEnviando(true)

    // 🔍 DEBUG: Dados que serão enviados
    const dadosEnvio = {
      name: nome,
      phone: whatsapp,
      phone_country_code: phoneCountryCode, // Incluir código do país
      tool_slug: toolSlug,
      user_slug: userSlug,
      ferramenta,
      resultado: resultadoTexto,
      template_id: config?.id
    }
    console.log('🔍 Enviando lead:', dadosEnvio)

    try {
      // Para ferramentas wellness, usar endpoint específico de templates
      const response = await fetch('/api/wellness/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      })

      const data = await response.json()

      console.log('🔍 Resposta da API:', data)

      if (data.success) {
        setSucesso(true)
        console.log('✅ Lead capturado com sucesso! ID:', data.data?.leadId)
        
        // Rastrear conversão
        if (config?.id || toolSlug) {
          await fetch('/api/wellness/conversions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              template_id: config?.id,
              slug: toolSlug,
              lead_id: data.data?.leadId
            })
          }).catch((err) => {
            console.warn('⚠️ Erro ao rastrear conversão (não crítico):', err)
          })
        }
      } else {
        console.error('❌ Erro na resposta da API:', data)
        const errorMessage = data.error || data.debug?.message || 'Erro ao enviar contato. Tente novamente.'
        alert(`Erro: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar contato:', error)
      console.error('❌ Detalhes do erro:', error.message, error.stack)
      alert(`Erro ao enviar contato: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div 
      className={`rounded-2xl p-8 border-2 ${className}`}
      style={{
        background: config?.custom_colors
          ? `linear-gradient(135deg, ${config.custom_colors.principal}10 0%, ${config.custom_colors.secundaria}10 100%)`
          : 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
        borderColor: config?.custom_colors?.principal || '#93c5fd'
      }}
    >
      {!sucesso ? (
        <>
          {/* Título convidativo */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {mensagemConvite}
            </h3>
            <p className="text-gray-600">
              Te ajudo a alcançar seus objetivos de forma personalizada!
            </p>
          </div>

          {/* Benefícios */}
          {beneficios.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">✨</span>
                O que você vai receber:
              </h4>
              <ul className="space-y-2">
                {beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2 text-lg">✓</span>
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Formulário de captura */}
          <form onSubmit={handleEnviarContato} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <PhoneInputWithCountry
                value={whatsapp}
                onChange={(phone, countryCode) => {
                  setWhatsapp(phone)
                  setPhoneCountryCode(countryCode || 'BR')
                }}
                defaultCountryCode={phoneCountryCode}
                className="w-full"
                placeholder="11 99999-9999"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-4 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: config?.custom_colors?.principal || '#2563eb'
              }}
            >
              {enviando ? 'Enviando...' : '📞 Quero Receber Contato'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
            </div>
          </div>

          {/* Botão WhatsApp direto */}
          {numeroWhatsApp && (
            <div className="text-center">
              <p className="text-gray-600 mb-3 text-sm">
                💬 Prefere falar agora?
              </p>
              <a
                href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chamar Agora no WhatsApp
              </a>
            </div>
          )}
        </>
      ) : (
        /* Mensagem de sucesso - Centralizada e bonita */
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              🎉 Tudo certo!
            </h3>
            
            <p className="text-lg text-gray-700 mb-2">
              Seu contato foi enviado com sucesso!
            </p>
            
            <p className="text-gray-600 mb-8">
              Em breve entrarei em contato com orientações personalizadas para você alcançar seus objetivos! 💚
            </p>
            
            {numeroWhatsApp && (
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    💬 Prefere falar agora? Chama no WhatsApp!
                  </div>
                </a>
                
                <button
                  onClick={() => setSucesso(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

