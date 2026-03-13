import type { ReactNode } from 'react'

export const metadata = {
  title: 'YLADA — Motor de conversas',
  description:
    'Diagnósticos inteligentes, trilha empresarial e Noel para qualquer profissional: gere conversas qualificadas no WhatsApp.',
}

export default function YladaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
