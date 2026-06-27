'use client'

import { useState, useEffect, useCallback } from 'react'
import { copyYladaLinkQrAsPng } from '@/lib/ylada-link-share-actions'
import type { VideoShareKind } from '@/lib/pro-lideres-video-share'

type ShareConfig = {
  videoUrl: string | null
  headline: string
  subheadline: string
}

type MemberLink = {
  userId: string
  displayName: string | null
  shareSlug: string | null
  shareUrl: string | null
  hasWhatsapp: boolean
}

export default function ProLideresVideoShareSettings({
  kind,
  videoLabel,
}: {
  kind: VideoShareKind
  videoLabel: string
}) {
  const [config, setConfig] = useState<ShareConfig>({ videoUrl: '', headline: '', subheadline: '' })
  const [members, setMembers] = useState<MemberLink[]>([])
  const [leaderUrl, setLeaderUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedQrId, setCopiedQrId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [cfgRes, memRes] = await Promise.all([
        fetch(`/api/pro-lideres/video-share/${kind}/config`),
        fetch(`/api/pro-lideres/video-share/${kind}/members`),
      ])
      const cfgJson = await cfgRes.json()
      const memJson = await memRes.json()
      if (cfgJson.config) {
        setConfig({
          videoUrl: cfgJson.config.videoUrl ?? '',
          headline: cfgJson.config.headline ?? '',
          subheadline: cfgJson.config.subheadline ?? '',
        })
      }
      if (Array.isArray(memJson.members)) setMembers(memJson.members)
      if (memJson.leaderUrl) setLeaderUrl(memJson.leaderUrl)
    } finally {
      setLoading(false)
    }
  }, [kind])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveOk(false)
    try {
      const res = await fetch(`/api/pro-lideres/video-share/${kind}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: config.videoUrl?.trim() || null,
          headline: config.headline?.trim(),
          subheadline: config.subheadline?.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSaveError(json.error ?? 'Erro ao salvar')
      } else {
        setSaveOk(true)
        if (json.config) {
          setConfig({
            videoUrl: json.config.videoUrl ?? '',
            headline: json.config.headline ?? '',
            subheadline: json.config.subheadline ?? '',
          })
        }
        setTimeout(() => setSaveOk(false), 3000)
      }
    } catch {
      setSaveError('Erro de rede. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }

  const copyQr = async (url: string, id: string) => {
    const ok = await copyYladaLinkQrAsPng(url)
    if (ok) {
      setCopiedQrId(id)
      setTimeout(() => setCopiedQrId(null), 2000)
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

  const activeMembers = members.filter((m) => m.shareUrl)
  const noSlugMembers = members.filter((m) => !m.shareUrl)

  return (
    <div className="space-y-8">
      {/* Config do vídeo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">🎥 Configurar {videoLabel}</h2>
        <p className="mb-5 text-sm text-gray-500">
          Vídeo padrão hospedado no Ylada. Cole outro link só se quiser trocar.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Link do vídeo (YouTube, Vimeo ou .mp4)
            </label>
            <input
              type="url"
              value={config.videoUrl ?? ''}
              onChange={(e) => setConfig((c) => ({ ...c, videoUrl: e.target.value }))}
              placeholder="Deixe em branco para usar o vídeo padrão"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Título da página</label>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => setConfig((c) => ({ ...c, headline: e.target.value }))}
              maxLength={200}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Subtítulo</label>
            <input
              type="text"
              value={config.subheadline}
              onChange={(e) => setConfig((c) => ({ ...c, subheadline: e.target.value }))}
              maxLength={300}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-400 focus:ring-2"
            />
          </div>
        </div>

        {saveError && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {saveError}</div>
        )}
        {saveOk && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            ✅ Configuração salva com sucesso!
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar configuração'}
          </button>
        </div>
      </div>

      {/* Seu próprio link */}
      {leaderUrl && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 text-lg font-bold text-gray-900">🎯 Seu link pessoal</h2>
          <p className="mb-4 text-sm text-gray-600">
            Use este link quando <strong>você mesmo</strong> for compartilhar.
          </p>
          <div className="mb-3 rounded-xl bg-white px-4 py-3 shadow-inner">
            <p className="break-all text-sm font-mono text-gray-700">{leaderUrl}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => copyLink(leaderUrl, '__leader__')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-indigo-700"
            >
              {copiedId === '__leader__' ? '✅ Copiado!' : '📋 Copiar meu link'}
            </button>
            <a
              href={leaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              👁️ Visualizar
            </a>
            <button
              type="button"
              onClick={() => copyQr(leaderUrl, '__leader__')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-teal-300/60 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
            >
              {copiedQrId === '__leader__' ? '✅ QR copiado!' : '🔳 Copiar QR'}
            </button>
          </div>
        </div>
      )}

      {/* Links dos membros */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">🔗 Links dos membros</h2>
        <p className="mb-5 text-sm text-gray-500">
          Cada membro tem o próprio link único. Copie e envie para ele compartilhar com os prospects.
        </p>

        {activeMembers.length > 0 && (
          <div className="space-y-3">
            {activeMembers.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {m.displayName ?? 'Membro sem nome'}
                  </p>
                  <p className="truncate text-xs text-gray-400">{m.shareUrl}</p>
                  {!m.hasWhatsapp && <p className="mt-0.5 text-xs text-amber-600">⚠️ WhatsApp não cadastrado</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => m.shareUrl && copyLink(m.shareUrl, m.userId)}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                  >
                    {copiedId === m.userId ? <>✅ Copiado!</> : <>📋 Copiar link</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => m.shareUrl && copyQr(m.shareUrl, m.userId)}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-teal-800 shadow-sm ring-1 ring-teal-300/60 transition hover:bg-teal-50"
                  >
                    {copiedQrId === m.userId ? <>✅ QR</> : <>🔳 QR</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {noSlugMembers.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-amber-700">
              ⚠️ Membros sem link configurado ({noSlugMembers.length})
            </p>
            <p className="text-xs text-gray-500">
              Estes membros precisam cadastrar o slug de partilha no perfil deles para ter link:
            </p>
            <ul className="mt-2 space-y-1">
              {noSlugMembers.map((m) => (
                <li key={m.userId} className="text-xs text-gray-600">
                  · {m.displayName ?? 'Membro sem nome'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
