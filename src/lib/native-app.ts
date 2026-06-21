'use client'

import { useEffect, useState } from 'react'

/**
 * Detecção confiável de "app iOS nativo" (Capacitor / WKWebView).
 *
 * Por que existe: a Apple (guideline 3.1.1) não permite que o app mostre
 * preços, botões de assinatura ou links para compra externa (ex.: ylada.com).
 * Dentro do app iOS escondemos toda a vitrine de venda; no navegador e no
 * Android o comportamento continua o mesmo de sempre.
 *
 * Detecção: o runtime do Capacitor injeta `window.Capacitor` mesmo quando o
 * app carrega o site live (server.url). `getPlatform()` é a fonte mais
 * confiável; UA é só fallback (o user-agent do WKWebView no iPad é instável,
 * foi o que deixou os preços vazarem na revisão da Apple).
 */
export function isIOSNativeApp(): boolean {
  if (typeof window === 'undefined') return false

  const cap = (window as unknown as Record<string, any>)['Capacitor']

  if (cap) {
    if (typeof cap.getPlatform === 'function') {
      return cap.getPlatform() === 'ios'
    }
    // Capacitor presente mas sem getPlatform: confirma por UA.
    return /iPhone|iPad|iPod/.test(navigator.userAgent)
  }

  // Sem bridge do Capacitor: WKWebView puro não traz "Safari/" no UA,
  // enquanto o Safari de verdade traz. Serve como última linha de defesa.
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !/Safari\//.test(navigator.userAgent)
}

/**
 * Hook React: retorna false na renderização do servidor / primeiro paint
 * (evita mismatch de hidratação) e resolve para o valor real após montar.
 */
export function useIsIOSNativeApp(): boolean {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(isIOSNativeApp())
  }, [])

  return isIOS
}

/**
 * Detecção do app Android (TWA / Bubblewrap, package `com.ylada.app`).
 *
 * Por que existe: modelo B2B — o app Android é só login + uso, NÃO vende nada
 * dentro (padrão Slack/Notion). Assim a regra do Google Play Billing não se
 * aplica. Dentro do TWA escondemos toda a vitrine de venda (preço, assinar,
 * checkout); no navegador e no iOS o comportamento segue o de sempre.
 *
 * Detecção: a TWA abre a PWA com `document.referrer` = `android-app://...`.
 * Esse referrer só aparece no PRIMEIRO load, então persistimos a flag em
 * sessionStorage para sobreviver à navegação SPA dentro da mesma sessão.
 */
export function isAndroidTWA(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem('ylada_is_twa') === '1') return true
    const ref = document.referrer || ''
    if (ref.startsWith('android-app://')) {
      try {
        sessionStorage.setItem('ylada_is_twa', '1')
      } catch {
        /* ignore */
      }
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}

/**
 * Hook React do TWA Android (mesma lógica anti-mismatch do useIsIOSNativeApp).
 */
export function useIsAndroidTWA(): boolean {
  const [isTWA, setIsTWA] = useState(false)

  useEffect(() => {
    setIsTWA(isAndroidTWA())
  }, [])

  return isTWA
}

/** App nativo (iOS Capacitor OU Android TWA). Útil para esconder venda nas duas lojas. */
export function isNativeApp(): boolean {
  return isIOSNativeApp() || isAndroidTWA()
}

/** Hook combinado: true em qualquer app de loja (iOS ou Android). */
export function useIsNativeApp(): boolean {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    setIsNative(isIOSNativeApp() || isAndroidTWA())
  }, [])

  return isNative
}
