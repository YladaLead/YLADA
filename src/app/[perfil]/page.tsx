import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeSlug } from '@/lib/slug-utils'
import { isPerfilNuEnabled } from '@/lib/ylada-flow/perfil-nu-flag'
import { isValidPerfilSegment } from '@/lib/ylada-flow/legacy-url-redirect'
import {
  fetchPerfilApresentacao,
  type PerfilApresentacao,
} from '@/lib/ylada-flow/perfil-apresentacao'
import { buildReferralLandingUrl } from '@/lib/referrals/referral-url'
import PerfilEntrada from '@/components/perfil/PerfilEntrada'

/**
 * Porta 3 (Paginas_Entrada_Arquitetura §1.1): página de entrada `/[perfil]` nua.
 * Apresenta o profissional + vitrine curada dos fluxos dele + selo do loop.
 * Atrás da flag PERFIL_NU_ENABLED; com OFF o middleware nem roteia pra cá.
 */
type PageProps = {
  params: Promise<{ perfil: string }>
}

async function loadApresentacao(perfilRaw: string): Promise<PerfilApresentacao | null> {
  if (!isPerfilNuEnabled()) return null
  if (!supabaseAdmin) return null
  const perfil = perfilRaw?.trim()
  if (!perfil || !isValidPerfilSegment(perfil)) return null
  return fetchPerfilApresentacao(supabaseAdmin, perfil)
}

export default async function PerfilNuPage({ params }: PageProps) {
  const { perfil } = await params
  const apresentacao = await loadApresentacao(perfil)
  if (!apresentacao) notFound()

  const seloHref = buildReferralLandingUrl({ code: apresentacao.seloRef, source: 'conteudo' })

  return (
    <PerfilEntrada perfil={normalizeSlug(perfil)} apresentacao={apresentacao} seloHref={seloHref} />
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { perfil } = await params
  const apresentacao = await loadApresentacao(perfil)
  if (!apresentacao) return { title: 'YLADA' }
  const nome = apresentacao.nome || 'Profissional'
  return {
    title: `${nome} | YLADA`,
    description: apresentacao.headline ?? undefined,
    alternates: { canonical: `/${normalizeSlug(perfil)}` },
  }
}
