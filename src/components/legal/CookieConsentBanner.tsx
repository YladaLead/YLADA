'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, Settings } from 'lucide-react'

type CookiePreferences = {
  essential: boolean
  functional: boolean
  analytics: boolean
}

const COOKIE_CONSENT_KEY = 'ylada_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'ylada_cookie_preferences'
const COOKIE_CONSENT_DATE_KEY = 'ylada_cookie_consent_date'

// Função auxiliar para verificar consentimento de forma segura
function hasConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    return consent === 'true'
  } catch (e) {
    console.error('Erro ao verificar consentimento:', e)
    return false
  }
}

// Função auxiliar para salvar cookie HTTP também (mais persistente)
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Função auxiliar para ler cookie HTTP
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export default function CookieConsentBanner() {
  // Verificar consentimento imediatamente no estado inicial
  const [mounted, setMounted] = useState(false)
  const [hasConsentState, setHasConsentState] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Sempre true, não pode ser desativado
    functional: false,
    analytics: false,
  })

  useEffect(() => {
    // Garantir que só executa no cliente
    setMounted(true)
    
    // Verificar se já tem consentimento salvo (localStorage + cookie HTTP)
    if (typeof window === 'undefined') return

    // Verificar localStorage primeiro
    const consentLocalStorage = localStorage.getItem(COOKIE_CONSENT_KEY)
    // Verificar cookie HTTP também (backup)
    const consentCookie = getCookie(COOKIE_CONSENT_KEY)
    
    // Se tem consentimento em qualquer lugar, não mostrar banner
    const hasConsentValue = consentLocalStorage === 'true' || consentCookie === 'true'
    
    if (hasConsentValue) {
      // Já tem consentimento - garantir que o banner NÃO apareça
      setHasConsentState(true)
      setShowBanner(false)
      setShowSettings(false)
      
      // Sincronizar: se tem no cookie mas não no localStorage, salvar no localStorage
      if (consentCookie === 'true' && consentLocalStorage !== 'true') {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
      }
      // Sincronizar: se tem no localStorage mas não no cookie, salvar no cookie
      if (consentLocalStorage === 'true' && consentCookie !== 'true') {
        setCookie(COOKIE_CONSENT_KEY, 'true', 365)
      }
      
      // Carregar preferências salvas se existirem
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          setPreferences(parsed)
        } catch (e) {
          console.error('Erro ao carregar preferências de cookies:', e)
        }
      }
    } else {
      // Primeira visita - mostrar banner apenas após 2 segundos (não atrapalha experiência inicial)
      setHasConsentState(false)
      const timer = setTimeout(() => {
        // Verificar novamente antes de mostrar (pode ter sido salvo em outra aba)
        if (!hasConsent()) {
          setShowBanner(true)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
    }
    saveConsent(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
    }
    saveConsent(onlyEssential)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined') return

    try {
      // Salvar no localStorage (persistência principal)
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
      localStorage.setItem(COOKIE_CONSENT_DATE_KEY, new Date().toISOString())

      // Salvar também em cookie HTTP (backup mais persistente, sobrevive a limpezas de localStorage)
      setCookie(COOKIE_CONSENT_KEY, 'true', 365)
      setCookie(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), 365)
      setCookie(COOKIE_CONSENT_DATE_KEY, new Date().toISOString(), 365)

      // Atualizar estado
      setHasConsentState(true)

      // Salvar no servidor (se usuário estiver logado)
      // Isso será feito pela API de consentimento

      // Aplicar preferências
      applyCookiePreferences(prefs)

      // Fechar banner
      setShowBanner(false)
      setShowSettings(false)
    } catch (e) {
      console.error('Erro ao salvar consentimento:', e)
      // Mesmo com erro, tentar fechar o banner para não travar o usuário
      setShowBanner(false)
      setShowSettings(false)
    }
  }

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Aqui você pode adicionar lógica para ativar/desativar cookies específicos
    // Por exemplo, carregar Google Analytics apenas se analytics for true
    if (prefs.analytics) {
      // Carregar scripts de analytics
      console.log('[Cookies] Analytics habilitado')
    } else {
      // Desabilitar analytics
      console.log('[Cookies] Analytics desabilitado')
    }

    if (prefs.functional) {
      // Carregar scripts funcionais
      console.log('[Cookies] Funcionalidades habilitadas')
    } else {
      // Desabilitar funcionalidades opcionais
      console.log('[Cookies] Funcionalidades desabilitadas')
    }
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Não pode desativar essenciais

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return null
  }

  // Verificação robusta: se já tem consentimento salvo (localStorage ou cookie), não mostrar nada
  // Esta verificação é feita tanto no estado quanto diretamente no localStorage/cookie
  // para garantir que mesmo se o estado não estiver sincronizado, o banner não apareça
  const hasConsentNow = hasConsentState || (typeof window !== 'undefined' && hasConsent())
  
  if (hasConsentNow && !showSettings) {
    return null
  }

  // Se não tem consentimento e não está mostrando banner nem settings, não mostrar nada
  if (!showBanner && !showSettings) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-6xl">
        {!showSettings ? (
          // Banner principal
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Cookies
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Usamos cookies para deixar tudo funcionando melhor para você. Tudo tranquilo! 
                Se quiser saber mais, veja nossa{' '}
                <Link 
                  href="/pt/politica-de-cookies" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  política de cookies
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Personalizar
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Rejeitar
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aceitar Todos
              </button>
            </div>
          </div>
        ) : (
          // Painel de configurações
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Cookies
              </h3>
              <button
                onClick={() => {
                  setShowSettings(false)
                  if (!hasConsent()) {
                    setShowBanner(true)
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Cookies Essenciais */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cookies Essenciais</h4>
                    <p className="text-sm text-gray-600">
                      Necessários para o funcionamento básico da plataforma
                    </p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700">
                    Sempre Ativo
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Estes cookies são necessários para autenticação, segurança e funcionalidades básicas. 
                  Não podem ser desativados.
                </p>
              </div>

              {/* Cookies Funcionais */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cookies Funcionais</h4>
                    <p className="text-sm text-gray-600">
                      Permitem funcionalidades aprimoradas e personalização
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Lembram suas preferências (idioma, configurações) para melhorar sua experiência.
                </p>
              </div>

              {/* Cookies de Análise */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cookies de Análise</h4>
                    <p className="text-sm text-gray-600">
                      Nos ajudam a entender como você usa a plataforma
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Coletam informações sobre como você usa a plataforma para melhorarmos nossos serviços.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSettings(false)
                  if (!hasConsent()) {
                    setShowBanner(true)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
