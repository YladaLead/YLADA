import { notFound } from 'next/navigation'
import PublicLinkView from '@/components/ylada/PublicLinkView'
import { fetchPublicLinkPayload } from '@/app/l/[slug]/public-link-utils'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

/**
 * Página pública do link inteligente em espanhol (/es/l/[slug]).
 */
export default async function PublicLinkPageEs({ params }: PageProps) {
  const { slug } = await params
  if (!slug) notFound()

  const payload = await fetchPublicLinkPayload(slug)
  return <PublicLinkView payload={payload} locale="es" />
}
