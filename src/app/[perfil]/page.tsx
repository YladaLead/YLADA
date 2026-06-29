import type { Metadata } from 'next'
import Link from 'next/link'
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

/**
 * Porta 3 (Paginas_Entrada_Arquitetura §1.1): página de entrada `/[perfil]` nua.
 * Apresenta o profissional + pendura os fluxos dele + selo do loop.
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
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-5 py-12">
      <PerfilHeader nome={apresentacao.nome} bio={apresentacao.bio} />
      <FluxosHub perfil={normalizeSlug(perfil)} fluxos={apresentacao.fluxos} />
      <SeloLoop href={seloHref} />
    </main>
  )
}

function PerfilHeader({ nome, bio }: { nome: string; bio: string | null }) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold text-slate-900">{nome || 'Profissional YLADA'}</h1>
      {bio ? <p className="text-base leading-relaxed text-slate-600">{bio}</p> : null}
    </header>
  )
}

function FluxosHub({
  perfil,
  fluxos,
}: {
  perfil: string
  fluxos: PerfilApresentacao['fluxos']
}) {
  if (fluxos.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Os diagnósticos deste profissional aparecem aqui em breve.
      </p>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Diagnósticos</h2>
      <ul className="flex flex-col gap-3">
        {fluxos.map((fluxo) => (
          <li key={fluxo.slug}>
            <Link
              href={`/${perfil}/${fluxo.slug}`}
              className="block rounded-xl border border-slate-200 px-5 py-4 text-base font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {fluxo.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SeloLoop({ href }: { href: string }) {
  return (
    <footer className="mt-auto pt-6 text-center">
      <Link href={href} className="text-xs text-slate-400 transition hover:text-slate-600">
        Powered by YLADA — crie o seu
      </Link>
    </footer>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { perfil } = await params
  const apresentacao = await loadApresentacao(perfil)
  if (!apresentacao) return { title: 'YLADA' }
  const nome = apresentacao.nome || 'Profissional'
  return {
    title: `${nome} | YLADA`,
    alternates: { canonical: `/${normalizeSlug(perfil)}` },
  }
}
