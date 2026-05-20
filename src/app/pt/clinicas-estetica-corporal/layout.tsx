import type { Metadata } from 'next'

const OG_IMAGE =
  'https://www.ylada.com/images/logo/ylada/novo/ylada-og-1200x630.png'

const TITLE = 'Diagnóstico gratuito · clínicas de estética corporal'
const DESC =
  'Perguntas rápidas sobre captação, conversão e margem — com pré-diagnóstico na hora. Foco comercial e estratégico.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · YLADA` },
  description: DESC,
  alternates: {
    canonical: 'https://www.ylada.com/pt/clinicas-estetica-corporal',
  },
  openGraph: {
    title: `${TITLE} · YLADA`,
    description: DESC,
    url: 'https://www.ylada.com/pt/clinicas-estetica-corporal',
    siteName: 'YLADA',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'YLADA', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · YLADA`,
    description: DESC,
    images: [OG_IMAGE],
  },
}

export default function ClinicasEsteticaCorporalLayout({ children }: { children: React.ReactNode }) {
  return children
}
