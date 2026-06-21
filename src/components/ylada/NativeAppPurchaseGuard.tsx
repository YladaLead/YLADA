'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isIOSNativeApp, isAndroidTWA } from '@/lib/native-app'
import { isPurchasePageRoute } from '@/lib/purchase-routes'
import NativeAppPaywall from '@/components/ylada/NativeAppPaywall'
import NativeAppNotice from '@/components/ylada/NativeAppNotice'
import AndroidWebCheckoutNotice from '@/components/ylada/AndroidWebCheckoutNotice'
import { ANDROID_WEB_CHECKOUT_ENABLED } from '@/config/android-checkout'

/**
 * Guard global (montado no layout raiz). Em qualquer rota de compra/assinatura:
 *
 * - **iOS (Capacitor):** mostra o PAYWALL NATIVO (In-App Purchase) — modelo
 *   IAP-tampão: o IAP existe e é o único caminho de compra dentro do app, o que
 *   torna legal acessar o plano contratado por fora (Apple 3.1.3b).
 * - **Android (TWA):** mostra uma TELA NEUTRA, sem venda. Modelo B2B só-login
 *   (Slack/Notion): o app não vende nada dentro, então a regra do Google Play
 *   Billing não se aplica. A venda acontece fora (consultoria/web).
 *
 * Usa `window.Capacitor` (confiável e SEM falso-positivo para web / Instagram /
 * Facebook), então só age dentro do app real. Na web e no Android, nada muda:
 * os checkouts Mercado Pago/Pix seguem normais.
 */
export default function NativeAppPurchaseGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isIOSApp, setIsIOSApp] = useState(false)
  const [isTWA, setIsTWA] = useState(false)

  useEffect(() => {
    setIsIOSApp(isIOSNativeApp())
    setIsTWA(isAndroidTWA())
  }, [])

  const onPurchaseRoute = isPurchasePageRoute(pathname || '')

  if (isIOSApp && onPurchaseRoute) {
    return <NativeAppPaywall homeHref="/pt" />
  }
  if (isTWA && onPurchaseRoute) {
    // Padrão (A): tela neutra, sem venda. Flag ON (B): botão "Assinar no site"
    // que abre o checkout web num navegador externo (ver android-checkout.ts).
    return ANDROID_WEB_CHECKOUT_ENABLED ? (
      <AndroidWebCheckoutNotice homeHref="/pt" />
    ) : (
      <NativeAppNotice homeHref="/pt" />
    )
  }

  return <>{children}</>
}
