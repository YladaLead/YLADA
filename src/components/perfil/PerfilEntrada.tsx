/**
 * UI da página de entrada `/[perfil]` nua (porta 3): apresentação do
 * profissional (foto + nome + manchete + bio) + vitrine curada de fluxos + selo.
 * Server component presentacional — recebe dados já resolvidos/curados.
 * @see blueprint-plataforma/Perfil_Nu_Porta3_Build.md
 */
import Link from 'next/link'
import type { PerfilApresentacao } from '@/lib/ylada-flow/perfil-apresentacao'

type PerfilEntradaProps = {
  perfil: string
  apresentacao: PerfilApresentacao
  seloHref: string
}

export default function PerfilEntrada({ perfil, apresentacao, seloHref }: PerfilEntradaProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-5 py-12">
      <Cabecalho
        nome={apresentacao.nome}
        headline={apresentacao.headline}
        bio={apresentacao.bio}
        avatarUrl={apresentacao.avatarUrl}
      />
      <Vitrine perfil={perfil} fluxos={apresentacao.fluxos} />
      <Selo href={seloHref} />
    </main>
  )
}

function Cabecalho({
  nome,
  headline,
  bio,
  avatarUrl,
}: {
  nome: string
  headline: string | null
  bio: string | null
  avatarUrl: string | null
}) {
  const exibicao = nome || 'Profissional YLADA'
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <Avatar nome={exibicao} avatarUrl={avatarUrl} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">{exibicao}</h1>
        {headline ? <p className="text-base font-medium text-slate-700">{headline}</p> : null}
        {bio ? <p className="text-sm leading-relaxed text-slate-500">{bio}</p> : null}
      </div>
    </header>
  )
}

function Avatar({ nome, avatarUrl }: { nome: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={nome}
        className="h-24 w-24 rounded-full object-cover ring-1 ring-slate-200"
      />
    )
  }
  const inicial = nome.trim().charAt(0).toUpperCase() || 'Y'
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-3xl font-semibold text-slate-400 ring-1 ring-slate-200">
      {inicial}
    </div>
  )
}

function Vitrine({
  perfil,
  fluxos,
}: {
  perfil: string
  fluxos: PerfilApresentacao['fluxos']
}) {
  if (fluxos.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500">
        Os diagnósticos deste profissional aparecem aqui em breve.
      </p>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Comece por aqui</h2>
      <ul className="flex flex-col gap-3">
        {fluxos.map((fluxo) => (
          <li key={fluxo.slug}>
            <CartaoFluxo perfil={perfil} slug={fluxo.slug} titulo={fluxo.titulo} subtitulo={fluxo.subtitulo} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartaoFluxo({
  perfil,
  slug,
  titulo,
  subtitulo,
}: {
  perfil: string
  slug: string
  titulo: string
  subtitulo: string | null
}) {
  return (
    <Link
      href={`/${perfil}/${slug}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-5 py-4 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="flex flex-col">
        <span className="text-base font-medium text-slate-800">{titulo}</span>
        {subtitulo ? <span className="text-xs text-slate-400">{subtitulo}</span> : null}
      </span>
      <span aria-hidden className="text-slate-300">→</span>
    </Link>
  )
}

function Selo({ href }: { href: string }) {
  return (
    <footer className="mt-auto pt-6 text-center">
      <Link href={href} className="text-xs text-slate-400 transition hover:text-slate-600">
        Powered by YLADA — crie o seu
      </Link>
    </footer>
  )
}
