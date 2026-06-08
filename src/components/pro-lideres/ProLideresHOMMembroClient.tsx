'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { copyYladaLinkQrAsPng } from '@/lib/ylada-link-share-actions'

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
  const [copiedQr, setCopiedQr] = useState(false)

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

  const copyQr = async () => {
    if (!data?.homUrl) return
    const ok = await copyYladaLinkQrAsPng(data.homUrl)
    if (ok) {
      setCopiedQr(true)
      setTimeout(() => setCopiedQr(false), 2500)
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
        <div className="rounded-xl border border-[#A0D150]/50 bg-[#A0D150]/15 px-4 py-3 text-sm text-[#1E4620]">
          <strong className="font-semibold">Pré-visualização do líder</strong> — tela como a equipe vê. Cada membro
          precisa do <strong>slug de divulgação</strong> no perfil para o link próprio.
        </div>
      ) : null}

      {data?.homUrl ? (
        <div
          className="rounded-2xl border border-[#A0D150]/40 p-5 shadow-sm sm:p-6"
          style={{ background: 'linear-gradient(to bottom right, #A0D15015, #FCDA0010)' }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-white shadow"
              style={{ backgroundColor: '#1E4620' }}
            >
              📈
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Seu link da apresentação</h2>
              <p className="text-sm text-[#5A8D2A]">
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow"
              style={{ background: 'linear-gradient(135deg, #1E4620 0%, #5A8D2A 100%)' }}
            >
              {copied ? '✅ Copiado!' : '📋 Copiar meu link'}
            </button>
            <Link
              href={data.homUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#5A8D2A]/30 bg-white px-5 py-3 text-sm font-semibold text-[#1E4620]"
            >
              👁️ Visualizar página
            </Link>
            <button
              type="button"
              onClick={copyQr}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-teal-300/60 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-900"
            >
              {copiedQr ? '✅ QR copiado!' : '🔳 Copiar QR'}
            </button>
          </div>

          {!data.hasWhatsapp ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-amber-800">⚠️ Seu WhatsApp não está cadastrado</p>
              <p className="mt-1 text-xs text-amber-700">
                Sem WhatsApp, os botões da página não funcionam. Cadastre em{' '}
                <Link href="/pro-lideres/membro/perfil" className="font-semibold underline">
                  Perfil
                </Link>
                .
              </p>
            </div>
          ) : null}

          {!data.videoConfigured ? (
            <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              ℹ️ O vídeo ainda não foi configurado pelo líder. A página já funciona — os botões de contato aparecem
              normalmente.
            </div>
          ) : null}
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
    </div>
  )
}
