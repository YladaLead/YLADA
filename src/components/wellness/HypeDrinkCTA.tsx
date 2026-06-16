'use client'

import { useState } from 'react'
import { ToolConfig } from '@/types/wellness'
import { obterMensagemWhatsApp, mensagemPadraoWhatsApp } from '@/lib/ylada-flow/mensagens-whatsapp-por-ferramenta'

interface HypeDrinkCTAProps {
  config?: ToolConfig
  resultado?: string
  className?: string
  mensagemPersonalizada?: string
}

export default function HypeDrinkCTA({
  config,
  resultado,
  className = '',
  mensagemPersonalizada
}: HypeDrinkCTAProps) {
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false)

  // Verificar se tem URL externa configurada
  const temUrlExterna = config?.cta_type === 'url_externa' && config?.external_url
  const temWhatsApp = config?.whatsapp_number

  // Obter mensagem WhatsApp: personalizada (com diagnóstico) > específica da ferramenta > padrão
  // Priorizar mensagemPersonalizada para que link e QR entreguem a mensagem com resultado/diagnóstico (paridade com WellnessCTAButton)
  let mensagemWhatsApp = ''
  let botaoTexto = config?.cta_button_text || 'Quero falar no WhatsApp'
  
  if (mensagemPersonalizada) {
    mensagemWhatsApp = mensagemPersonalizada
  } else {
    const toolSlug = config?.template_slug || config?.slug
    if (toolSlug) {
      const mensagemFerramenta = obterMensagemWhatsApp(toolSlug)
      if (mensagemFerramenta) {
        mensagemWhatsApp = mensagemFerramenta.mensagem
        botaoTexto = mensagemFerramenta.botaoTexto || botaoTexto
      }
    }
    if (!mensagemWhatsApp) {
      mensagemWhatsApp = mensagemPadraoWhatsApp.mensagem
      botaoTexto = mensagemPadraoWhatsApp.botaoTexto || botaoTexto
    }
  }
  
  // Incluir resultado/diagnóstico na mensagem quando disponível (mesmo formato do link - paridade com WellnessCTAButton)
  if (resultado && mensagemWhatsApp && !mensagemWhatsApp.includes(resultado)) {
    mensagemWhatsApp = `${mensagemWhatsApp}\n\n📊 Meu resultado: ${resultado}`
  }

  // Formatar número WhatsApp
  let numeroWhatsApp = ''
  if (temWhatsApp) {
    let numeroLimpo = config.whatsapp_number!.replace(/[^0-9]/g, '')
    
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
      numeroLimpo = '1' + numeroLimpo
    } else if (numeroLimpo.length === 11 && numeroLimpo.startsWith('11')) {
      numeroLimpo = '55' + numeroLimpo
    }
    
    numeroWhatsApp = numeroLimpo
  }

  // Se tiver apenas uma opção, mostrar direto
  if (temUrlExterna && !temWhatsApp) {
    return (
      <div className={`${className}`}>
        <a
          href={config.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse-once"
        >
          <span className="mr-3 text-2xl">🚀</span>
          <span>{config.cta_button_text || 'Quero falar no WhatsApp'}</span>
          <span className="ml-3">→</span>
        </a>
        <p className="text-center text-sm text-gray-600 mt-3">
          ⚡ Clique para continuar
        </p>
      </div>
    )
  }

  if (temWhatsApp && !temUrlExterna) {
    return (
      <div className={`${className}`}>
        <a
          href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse-once"
        >
          <span className="mr-3 text-2xl">💬</span>
          <span>{botaoTexto}</span>
          <span className="ml-3">→</span>
        </a>
        <p className="text-center text-sm text-gray-600 mt-3">
          ⚡ Clique para continuar
        </p>
      </div>
    )
  }

  // Se tiver ambas as opções, mostrar botão principal com opções
  if (temUrlExterna && temWhatsApp) {
    return (
      <div className={`${className}`}>
        {/* Botão Principal - CTA Forte */}
        <button
          onClick={() => setMostrarOpcoes(!mostrarOpcoes)}
          className="w-full inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="mr-3 text-2xl">🚀</span>
          <span>{config.cta_button_text || 'Quero falar no WhatsApp'}</span>
          <span className="ml-3">{mostrarOpcoes ? '↑' : '↓'}</span>
        </button>

        {/* Opções quando expandido */}
        {mostrarOpcoes && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <a
              href={config.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-white border-2 border-yellow-500 text-yellow-600 font-bold rounded-lg hover:bg-yellow-50 transition-all shadow-md hover:shadow-lg"
            >
              <span className="mr-2 text-xl">🌐</span>
              Ver mais informações
            </a>
            <a
              href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20BA5A] transition-all shadow-md hover:shadow-lg"
            >
              <span className="mr-2 text-xl">💬</span>
              Quero falar no WhatsApp
            </a>
          </div>
        )}
        {!mostrarOpcoes && (
          <p className="text-center text-sm text-gray-600 mt-3">
            ⚡ Escolha como prefere continuar
          </p>
        )}
      </div>
    )
  }

  // Fallback se não tiver nenhuma opção (WhatsApp/URL vêm do perfil ou da ferramenta)
  return (
    <div className={`${className} p-4 bg-yellow-50 border border-yellow-200 rounded-lg`}>
      <p className="text-yellow-800 text-sm">
        ⚠️ Configure o WhatsApp ou uma URL externa no seu perfil (Meus Links → Perfil) para que o botão de contato apareça aqui.
      </p>
    </div>
  )
}

