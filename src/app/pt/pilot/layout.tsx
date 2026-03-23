import type { Metadata } from 'next'

const SHARE_TITLE = 'Explique menos. Venda mais.'
const SHARE_DESCRIPTION = 'Explique menos. Venda mais.'

const OG_IMAGE = 'https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

export const metadata: Metadata = {
  title: `${SHARE_TITLE} | YLADA`,
  description: SHARE_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    siteName: 'YLADA',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.ylada.com/pt/pilot',
    images: [
      {
        url: OG_IMAGE,
        width: 1080,
        height: 1080,
        alt: SHARE_TITLE,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function PilotLayout({ children }: { children: React.ReactNode }) {
  return children
}
