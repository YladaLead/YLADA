'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isIOSNativeApp } from '@/lib/native-app'
import { isPurchasePageRoute } from '@/lib/purchase-routes'
import NativeAppNotice from '@/components/ylada/NativeAppNotice'

/**
 * Guard global (montado no layout raiz). Dentro do app iOS, qualquer rota de
 * compra/assinatura é substituída por uma tela neutra — sem preço, plano,
 * botão de assinar ou link de pagamento (guideline 3.1.1 da Apple).
 *
 * Usa `window.Capacitor` (confiável e SEM falso-positivo para web / Instagram /
 * Facebook), então só age dentro do app real. Na web e no Android, nada muda.
 */
export default function NativeAppPurchaseGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isIOSApp, setIsIOSApp] = useState(false)

  useEffect(() => {
    setIsIOSApp(isIOSNativeApp())
  }, [])

  if (isIOSApp && isPurchasePageRoute(pathname || '')) {
    return <NativeAppNotice homeHref="/pt" />
  }

  return <>{children}</>
}
