import type { ReactNode } from 'react'

/**
 * Layout estética: apenas repassa children para não bloquear carregamento.
 * Rotas protegidas (/pt/estetica/home etc.) validam auth no próprio page ou em layout aninhado.
 */
export default function EsteticaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
