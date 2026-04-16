import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Preview · Sucesso inscrição (dev)',
  robots: { index: false, follow: false },
}

export default function PreviewSucessoLayout({ children }: { children: ReactNode }) {
  return children
}
