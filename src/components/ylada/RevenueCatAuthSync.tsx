'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { isIOSNativeApp } from '@/lib/native-app'
import { configureRevenueCat, logInRevenueCat } from '@/lib/iap/revenuecat-client'

/**
 * Mantém o RevenueCat sincronizado com a sessão do Supabase DENTRO do app iOS.
 *
 * Por que importa: o webhook do RevenueCat precisa receber o `app_user_id` =
 * user_id do Supabase para gravar a assinatura na conta certa. Assim que o
 * usuário está autenticado, chamamos Purchases.logIn(user.id).
 *
 * Em web/Android é NO-OP total (isIOSNativeApp() é false e nada do plugin
 * nativo é carregado). Não renderiza nada.
 */
export default function RevenueCatAuthSync() {
  const { user, loading } = useAuth()
  const lastUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!isIOSNativeApp()) return
    if (loading) return

    const uid = user?.id || null

    // Configura cedo mesmo sem usuário (para a oferta carregar no paywall).
    if (!uid) {
      void configureRevenueCat()
      return
    }

    if (lastUserId.current === uid) return
    lastUserId.current = uid
    void logInRevenueCat(uid)
  }, [user?.id, loading])

  return null
}
