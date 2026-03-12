import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Escolha sua área | YLADA',
  description: 'Aplique o Método YLADA na sua profissão. Use diagnósticos inteligentes para iniciar conversas com mais contexto. Um único plano para todas as profissões.',
}

export default function PrecosLayout({ children }: { children: React.ReactNode }) {
  return children
}
