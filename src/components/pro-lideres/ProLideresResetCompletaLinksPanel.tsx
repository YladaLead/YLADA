'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { copyYladaLinkQrAsPng } from '@/lib/ylada-link-share-actions'

type CompletaLinkData = {
  resetCompletaUrl: string | null
  shareSlug: string | null
  leaderTeamPreview?: boolean
}

export default function ProLideresResetCompletaLinksPanel({
  isLeaderWorkspace = false,
}: {
  isLeaderWorkspace?: boolean
}) {
  const [data, setData] = useState<CompletaLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedQr, setCopiedQr] = useState(false)

  useEffect(() => {
    fetch('/api/pro-lideres/reset/meu-link')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const copyLink = async () => {
    if (!data?.resetCompletaUrl) return
    try {
      await navigator.clipboard.writeText(data.resetCompletaUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      //
    }
  }

  const copyQr = async () => {
    if (!data?.resetCompletaUrl) return
    const ok = await copyYladaLinkQrAsPng(data.resetCompletaUrl)
    if (ok) {
      setCopiedQr(true)
      setTimeout(() => setCopiedQr(false), 2500)
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-sm text-gray-500">Carregando…</p>
  }

  return (
    <div className="space-y-4">
      {isLeaderWorkspace ? (
        <p className="rounded-xl border border-[#A0D150]/40 bg-[#A0D150]/10 px-4 py-3 text-sm text-[#1E4620]">
          A página completa usa o <strong>vídeo da bebida</strong> (Reset Metabólico) e o{' '}
          <strong>vídeo de negócio</strong> (HOM). Configure cada um nos atalhos 🥤 e 🎥 acima.
        </p>
      ) : null}

      {data?.resetCompletaUrl ? (
        <div
          className="rounded-2xl border border-[#5A8D2A]/30 p-5"
          style={{ background: 'linear-gradient(to bottom right, #A0D15012, #FCDA0008)' }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E4620] text-xl text-white">
              📋
            </span>
            <div>
              <h3 className="font-bold text-gray-900">Link Reset completo</h3>
              <p className="text-xs text-[#5A8D2A]">Bebida + oportunidade de negócio (sem botão sacola)</p>
            </div>
          </div>
          <div className="mb-3 rounded-xl bg-white px-4 py-3 shadow-inner">
            <p className="break-all text-sm font-mono text-gray-700">{data.resetCompletaUrl}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={copyLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1E4620 0%, #5A8D2A 100%)' }}
            >
              {copied ? '✅ Copiado!' : '📋 Copiar link'}
            </button>
            <Link
              href={data.resetCompletaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#5A8D2A]/30 bg-white px-4 py-3 text-sm font-semibold text-[#1E4620]"
            >
              👁️ Visualizar
            </Link>
            <button
              type="button"
              onClick={copyQr}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-teal-300/60 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900"
            >
              {copiedQr ? '✅ QR copiado!' : '🔳 Copiar QR'}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {isLeaderWorkspace
            ? 'Use o slug /lider para pré-visualizar, ou peça aos membros que cadastrem o slug de divulgação.'
            : 'Cadastre seu slug de divulgação no perfil para gerar o link completo.'}
          {!isLeaderWorkspace ? (
            <>
              {' '}
              <Link href="/pro-lideres/membro/perfil" className="font-semibold underline">
                Ir para o perfil →
              </Link>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
