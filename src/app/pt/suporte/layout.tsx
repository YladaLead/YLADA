import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Suporte | YLADA',
  description: 'Converse com a equipe YLADA',
}

export default function SuportePlataformaLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>
}
