import type { Metadata } from 'next'
import { PROMO_BEM_ESTAR_BR } from '@/lib/promo-bem-estar'
import PromoBemEstarCheckoutClient from './PromoBemEstarCheckoutClient'

const CANONICAL = 'https://www.ylada.com/promo/bem-estar'

const promoDesc = `Convite Coach do bem-estar. Plano anual: até 12× no cartão no Mercado Pago (total R$ ${PROMO_BEM_ESTAR_BR.annualTotal}). Verificação de e-mail e pagamento.`

export const metadata: Metadata = {
  title: 'Convite | YLADA',
  description: promoDesc,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Convite | YLADA',
    description: promoDesc,
    url: CANONICAL,
    siteName: 'YLADA',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function PromoBemEstarPage() {
  return <PromoBemEstarCheckoutClient />
}
