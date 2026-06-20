'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isIOSNativeApp } from '@/lib/native-app'
import { isPurchasePageRoute } from '@/lib/purchase-routes'
import NativeAppPaywall from '@/components/ylada/NativeAppPaywall'

/**
 * Guard global (montado no layout raiz). Dentro do app iOS, qualquer rota de
 * compra/assinatura é substituída pelo PAYWALL NATIVO (In-App Purchase via
 * RevenueCat/StoreKit) — não pelas páginas de checkout web. Isso atende a
 * guideline 3.1.1 da Apple (a venda de conteúdo digital usado no app precisa
 * ser via IAP) e ao mesmo tempo permite o app vender o plano. Modelo IAP-tampão
 * (decisão 20/06 noite): o IAP existe e é o único caminho de compra DENTRO do
 * app, o que torna legal acessar no app o plano contratado por fora (3.1.3b).
 *
 * Usa `window.Capacitor` (confiável e SEM falso-positivo para web / Instagram /
 * Facebook), então só age dentro do app real. Na web e no Android, nada muda:
 * os checkouts Mercado Pago/Pix seguem normais.
 */
export default function NativeAppPurchaseGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isIOSApp, setIsIOSApp] = useState(false)

  useEffect(() => {
    setIsIOSApp(isIOSNativeApp())
  }, [])

  if (isIOSApp && isPurchasePageRoute(pathname || '')) {
    return <NativeAppPaywall homeHref="/pt" />
  }

  return <>{children}</>
}
