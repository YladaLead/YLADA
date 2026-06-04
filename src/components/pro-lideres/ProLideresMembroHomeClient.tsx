'use client'

import { useState } from 'react'
import Link from 'next/link'

export type ProLideresMembroHomeLinkItem = {
  linkId: string
  slug: string
  title: string
  publicUrl: string
}

export type ProLideresMembroHomeStats = {
  views: number
  starts: number
  completions: number
  whatsapp: number
}

type Props = {
  firstName: string
  noelEnabled: boolean
  noelHref: string
  linksHref: string
  boardsHref: string
  links: ProLideresMembroHomeLinkItem[]
  stats: ProLideresMembroHomeStats
  statsDays: number
  hasActivity: boolean
}

const FILOSOFIA_QUOTES = [
  '"Sirva antes de vender. Quem educa, cria gratidão. Quem cria gratidão, converte."',
  '"A pergunta certa vale mais do que a resposta pronta."',
  '"Links que servem antes de vender. Esse é o método Ylada."',
]

function CopyButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silencioso
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copiar link ${label}`}
      className="flex-shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 active:scale-95"
    >
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}

export default function ProLideresMembroHomeClient({
  firstName,
  noelEnabled,
  noelHref,
  linksHref,
  boardsHref,
  links,
  stats,
  statsDays,
  hasActivity,
}: Props) {
  const quote = FILOSOFIA_QUOTES[0]

  return (
    <div className="space-y-5">

      {/* Card de filosofia */}
      <div className="rounded-2xl bg-blue-600 px-5 py-5">
        <p className="mb-1 text-xs font-medium tracking-wide text-blue-200">Filosofia Ylada</p>
        <p className="text-sm italic leading-relaxed text-white">{quote}</p>
        <p className="mt-2 text-xs text-blue-300">— Método Ylada</p>
      </div>

      {/* Saudação */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Oi, {firstName}!</h1>
        <p className="text-sm text-gray-500">Tudo que você precisa pra atender e crescer — num só lugar.</p>
      </div>

      {/* 3 quadradinhos de acesso rápido */}
      <div className="grid grid-cols-3 gap-3">

        {/* Noel */}
        {noelEnabled ? (
          <Link
            href={noelHref}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-4 text-center shadow-sm transition hover:border-blue-200 hover:shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
            </div>
            <span className="text-xs font-medium text-gray-800">Noel</span>
            <span className="text-[10px] text-gray-400">Seu assistente</span>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-4 text-center opacity-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-500">Noel</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">Bloqueado</span>
          </div>
        )}

        {/* Seus links */}
        <Link
          href={linksHref}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-4 text-center shadow-sm transition hover:border-blue-200 hover:shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <LinkIcon className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-800">Meus links</span>
          <span className="text-[10px] text-gray-400">Compartilhar</span>
        </Link>

        {/* Boards */}
        <Link
          href={boardsHref}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-4 text-center shadow-sm transition hover:border-blue-200 hover:shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <BoardIcon className="h-5 w-5 text-amber-700" />
          </div>
          <span className="text-xs font-medium text-gray-800">Boards</span>
          <span className="text-[10px] text-gray-400">WhatsApp</span>
        </Link>

      </div>

      {/* Box Noel bloqueado */}
      {!noelEnabled && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50">
            <SparklesIcon className="h-6 w-6 text-gray-300" />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-700">Seu Noel não está liberado</p>
          <p className="mb-3 text-xs leading-relaxed text-gray-400">
            O assistente inteligente está disponível em planos selecionados. Fale com seu líder para ativar.
          </p>
          <span className="inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            Quero ativar o Noel
          </span>
        </div>
      )}

      {/* Seus links */}
      {links.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Seus links</p>
            <Link href={linksHref} className="text-xs text-blue-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="space-y-2">
            {links.map((item) => (
              <li
                key={item.linkId}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <LinkIcon className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="truncate text-[11px] text-gray-400">{item.publicUrl}</p>
                </div>
                <CopyButton url={item.publicUrl} label={item.title} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Atividade resumida */}
      {hasActivity && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Sua atividade — {statsDays} dias
          </p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Cliques" value={stats.starts} />
            <StatCard label="Conversas WhatsApp" value={stats.whatsapp} />
            <StatCard label="Resultados vistos" value={stats.completions} />
            <StatCard label="Visualizações" value={stats.views} />
          </div>
        </section>
      )}

      {!hasActivity && (
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-5 text-center">
          <p className="text-sm text-gray-500">
            Ainda sem atividade registrada.{' '}
            <Link href={linksHref} className="font-medium text-blue-600 hover:underline">
              Copie seus links
            </Link>{' '}
            e compartilhe para começar.
          </p>
        </div>
      )}

    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="mb-0.5 text-[11px] text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4m2-2h-4M4 17v2m1-1H3"/>
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  )
}

function BoardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}
