'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type HOMData = {
  homUrl: string | null
  shareSlug: string | null
  hasWhatsapp: boolean
  memberName: string | null
  headline: string | null
  videoConfigured: boolean
  leaderTeamPreview?: boolean
}

export default function ProLideresHOMMembroClient() {
  const [data, setData] = useState<HOMData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/pro-lideres/hom/meu-link')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const copyLink = async () => {
    if (!data?.homUrl) return
    try {
      await navigator.clipboard.writeText(data.homUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      //
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Carregando...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {data?.leaderTeamPreview ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <strong className="font-semibold">Pré-visualização do líder</strong> — você está vendo a tela como a
          equipe. O link abaixo é o <strong>exemplo do líder</strong> (mesmo vídeo e botões). Cada membro precisa do{' '}
          <strong>slug de divulgação</strong> no perfil para ter o link próprio.
        </div>
      ) : null}

      {/* Link do membro */}
      {data?.homUrl ? (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl shadow">
              🎥
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Seu link da apresentação</h2>
              <p className="text-sm text-emerald-700">
                {data.headline ?? 'Apresentação HOM personalizada'}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-xl bg-white px-4 py-3 shadow-inner">
            <p className="break-all text-sm font-mono text-gray-700">{data.homUrl}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              {copied ? '✅ Copiado!' : '📋 Copiar meu link'}
            </button>
            <Link
              href={data.homUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              👁️ Visualizar página
            </Link>
          </div>

          {/* Alertas */}
          {!data.hasWhatsapp && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-sm font-semibold text-amber-800">
                ⚠️ Seu WhatsApp não está cadastrado
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Sem o WhatsApp, os botões da página não vão funcionar para os seus prospects.
                Cadastre em{' '}
                <Link href="/pro-lideres/membro/perfil" className="underline font-semibold">
                  Perfil
                </Link>.
              </p>
            </div>
          )}

          {!data.videoConfigured && (
            <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 px-4 py-3">
              <p className="text-sm text-sky-800">
                ℹ️ O vídeo da apresentação ainda não foi configurado pelo líder.
                A página já funciona — os botões de contato aparecem normalmente.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="mb-2 font-bold text-amber-900">🔗 Seu link ainda não está ativo</h2>
          {!data?.shareSlug ? (
            <p className="text-sm text-amber-800">
              {data?.videoConfigured ? (
                <>
                  O vídeo da HOM já está configurado pelo líder. Falta cadastrar o seu{' '}
                  <strong>slug de divulgação</strong> no perfil para gerar o seu link pessoal.{' '}
                </>
              ) : (
                <>
                  Para ter um link personalizado da HOM, você precisa cadastrar o seu{' '}
                  <strong>slug de divulgação</strong> no perfil.{' '}
                </>
              )}
              <Link href="/pro-lideres/membro/perfil" className="font-semibold underline">
                Ir para o perfil →
              </Link>
            </p>
          ) : (
            <p className="text-sm text-amber-800">
              Algo deu errado ao gerar o seu link. Fale com o líder.
            </p>
          )}
        </div>
      )}

      {/* Como usar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-3 font-bold text-gray-900">💡 Como usar este link</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-emerald-600">1.</span>
            <span>Copie o link acima e envie por WhatsApp para quem você quer apresentar a oportunidade.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-emerald-600">2.</span>
            <span>A pessoa assiste ao vídeo da HOM e escolhe entre <em>"Tenho dúvida"</em> ou <em>"Quero começar"</em>.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-emerald-600">3.</span>
            <span>Ao clicar, ela abre o WhatsApp <strong>direto com você</strong> — com uma mensagem já preenchida.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold text-emerald-600">4.</span>
            <span>Cada membro da equipe tem o próprio link — o contato sempre vai para quem indicou.</span>
          </li>
        </ul>
      </div>

    </div>
  )
}
