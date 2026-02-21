import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sistema de Conversas Ativas para Nutricionistas | YLADA',
  description:
    'Sua agenda não está vazia por falta de competência. Está vazia por falta de sistema. Venda não nasce do post. Nasce da conversa.',
  openGraph: {
    title: 'Sistema de Conversas Ativas para Nutricionistas | YLADA',
    description: 'Método que posiciona a captação em conversa — não em post ou algoritmo.',
  },
}

export default function SistemaConversasAtivasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
