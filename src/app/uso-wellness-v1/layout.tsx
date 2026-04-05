import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const OG_IMAGE =
  'https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

const TITLE = 'Pesquisa de uso · YLADA Wellness'
const DESCRIPTION =
  'Ajude a melhorar o YLADA: uso, link, diagnóstico e, se quiser, feedback sobre o Noel. Anônima, sem cadastro.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://www.ylada.com/uso-wellness-v1',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.ylada.com/uso-wellness-v1',
    siteName: 'YLADA',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1080, height: 1080, alt: 'YLADA', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function UsoWellnessV1Layout({ children }: { children: ReactNode }) {
  return children
}
