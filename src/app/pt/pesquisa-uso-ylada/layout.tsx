import type { Metadata } from 'next'

const OG_IMAGE =
  'https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

const SURVEY_TITLE = 'Pesquisa de 1 minuto — YLADA'
const SURVEY_SLOGAN = 'Pergunte menos, venda mais.'
const SURVEY_DESCRIPTION =
  'Em cerca de um minuto, anônimo e sem cadastro: conte onde você trava e o que espera do YLADA. A gente usa suas respostas para priorizar melhorias que destravam sua rotina — sem julgamento, só evolução do produto. Obrigado por esse tempinho.'

export const metadata: Metadata = {
  title: {
    absolute: `${SURVEY_TITLE} · ${SURVEY_SLOGAN}`,
  },
  description: SURVEY_DESCRIPTION,
  alternates: {
    canonical: 'https://www.ylada.com/pt/pesquisa-uso-ylada',
  },
  openGraph: {
    title: `${SURVEY_TITLE} · ${SURVEY_SLOGAN}`,
    description: SURVEY_DESCRIPTION,
    url: 'https://www.ylada.com/pt/pesquisa-uso-ylada',
    siteName: 'YLADA',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1080,
        height: 1080,
        alt: `YLADA — ${SURVEY_SLOGAN}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SURVEY_TITLE} · ${SURVEY_SLOGAN}`,
    description: SURVEY_DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function PesquisaUsoYladaLayout({ children }: { children: React.ReactNode }) {
  return children
}
