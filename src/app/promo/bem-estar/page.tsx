import type { Metadata } from 'next'
import PromoBemEstarCheckoutClient from './PromoBemEstarCheckoutClient'

const CANONICAL = 'https://www.ylada.com/promo/bem-estar'

export const metadata: Metadata = {
  title: 'Convite | YLADA',
  description: 'Convite Coach do bem-estar: verificação de assinatura wellness e pagamento promocional.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Convite | YLADA',
    description: 'Convite Coach do bem-estar.',
    url: CANONICAL,
    siteName: 'YLADA',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function PromoBemEstarPage() {
  return <PromoBemEstarCheckoutClient />
}
