import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Assista | Como gerar contatos sem depender de sorte | YLADA Nutri',
  description:
    'Para nutricionistas cansadas de agenda ociosa. Assista ao vídeo e veja como o sistema pode te ajudar a ter agenda previsível.',
  openGraph: {
    title: 'Assista | YLADA Nutri',
    description:
      'Para nutricionistas cansadas de agenda ociosa. Assista e veja os próximos passos.',
  },
}

export default function NutriVideoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
