import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { buildWellnessTemplatePreviewMetadata } from '@/lib/wellness-template-preview-metadata'

/**
 * Prévia de links (/pt/wellness/templates/...) — OG por ferramenta, não o hero "10 pessoas" do layout raiz.
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const match = pathname.match(/\/pt\/wellness\/templates\/([^/?#]+)/i)
  if (!match?.[1]) {
    return {}
  }
  return buildWellnessTemplatePreviewMetadata(match[1], pathname)
}

export default function WellnessTemplatesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
