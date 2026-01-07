import { ReactNode } from 'react'

interface CreativeStudioLayoutProps {
  children: ReactNode
}

/**
 * Layout do Creative Studio
 * Página pública - não requer autenticação
 */
export default function CreativeStudioLayout({ children }: CreativeStudioLayoutProps) {
  return <>{children}</>
}


