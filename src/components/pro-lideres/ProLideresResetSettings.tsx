'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  PRO_LIDERES_RESET_DEFAULT_DESCRIPTION,
  PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE,
  PRO_LIDERES_RESET_DEFAULT_VIDEO_URL,
} from '@/lib/pro-lideres-reset-content'

type ResetConfig = {
  videoUrl: string | null
  headline: string
  subheadline: string
  description: string
}

type MemberLink = {
  userId: string
  displayName: string | null
  shareSlug: string | null
  resetUrl: string | null
  hasWhatsapp: boolean
}

export default function ProLideresResetSettings() {
  const [config, setConfig] = useState<ResetConfig>({
    videoUrl: '',
    headline: '',
    subheadline: '',
    description: '',
  })
  const [members, setMembers] = useState<MemberLink[]>([])
  const [leaderUrl, setLeaderUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [cfgRes, memRes] = await Promise.all([
        fetch('/api/pro-lideres/reset/config'),
        fetch('/api/pro-lideres/reset/members'),
      ])
      const cfgJson = await cfgRes.json()
      const memJson = await memRes.json()
      if (cfgJson.config) {
        setConfig({
          videoUrl: cfgJson.config.videoUrl ?? '',
          headline: cfgJson.config.headline ?? '',
          subheadline: cfgJson.config.subheadline ?? '',
          description: cfgJson.config.description ?? '',
        })
      }
      if (Array.isArray(memJson.members)) setMembers(memJson.members)
      if (memJson.leaderUrl) setLeaderUrl(memJson.leaderUrl)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveOk(false)
    try {
      const res = await fetch('/api/pro-lideres/reset/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: config.videoUrl?.trim() || null,
          headline: config.headline?.trim(),
          subheadline: config.subheadline?.trim(),
          description: config.description?.trim(),
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
            description: json.config.description ?? '',
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

  const activeMembers = members.filter((m) => m.resetUrl)
  const noSlugMembers = members.filter((m) => !m.resetUrl)

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[#A0D150]/40 bg-gradient-to-br from-[#1E4620]/5 to-[#FCDA00]/10 p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 text-lg font-bold text-[#1E4620]">🎥 Configurar Reset Metabólico</h2>
        <p className="mb-5 text-sm text-gray-600">
          Cole o link do vídeo sobre a bebida (YouTube, Vimeo ou .mp4). Todos os membros usam o mesmo vídeo; cada um
          compartilha a página com o WhatsApp dele para encomendas de sacola.
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
              placeholder={PRO_LIDERES_RESET_DEFAULT_VIDEO_URL}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-[#5A8D2A] transition focus:border-[#5A8D2A] focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Título (opcional)</label>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => setConfig((c) => ({ ...c, headline: e.target.value }))}
              placeholder="Reset Metabólico"
              maxLength={200}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-[#5A8D2A] transition focus:border-[#5A8D2A] focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tagline</label>
            <input
              type="text"
              value={config.subheadline}
              onChange={(e) => setConfig((c) => ({ ...c, subheadline: e.target.value }))}
              placeholder={PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE}
              maxLength={300}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-[#5A8D2A] transition focus:border-[#5A8D2A] focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Texto introdutório</label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig((c) => ({ ...c, description: e.target.value }))}
              placeholder={PRO_LIDERES_RESET_DEFAULT_DESCRIPTION}
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-[#5A8D2A] transition focus:border-[#5A8D2A] focus:ring-2"
            />
          </div>
        </div>

        {saveError ? (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {saveError}</div>
        ) : null}
        {saveOk ? (
          <div className="mt-4 rounded-xl bg-[#A0D150]/20 px-4 py-3 text-sm font-medium text-[#1E4620]">
            ✅ Configuração salva!
          </div>
        ) : null}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1E4620 0%, #5A8D2A 100%)' }}
          >
            {saving ? 'Salvando...' : 'Salvar configuração'}
          </button>
        </div>
      </div>

      {leaderUrl ? (
        <div className="rounded-2xl border border-[#5A8D2A]/30 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 text-lg font-bold text-gray-900">🎯 Seu link pessoal</h2>
          <p className="mb-4 text-sm text-gray-600">
            Use quando <strong>você</strong> for apresentar a bebida para alguém.
          </p>
          <div className="mb-3 rounded-xl bg-gray-50 px-4 py-3">
            <p className="break-all text-sm font-mono text-gray-700">{leaderUrl}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => copyLink(leaderUrl, '__leader__')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: '#1E4620' }}
            >
              {copiedId === '__leader__' ? '✅ Copiado!' : '📋 Copiar meu link'}
            </button>
            <a
              href={leaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#5A8D2A]/40 bg-white px-5 py-3 text-sm font-semibold text-[#1E4620]"
            >
              👁️ Visualizar
            </a>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900">🔗 Links dos membros</h2>
        <p className="mb-5 text-sm text-gray-500">
          Cada membro tem link único da página Reset Metabólico com o WhatsApp dele para encomendas.
        </p>

        {activeMembers.length > 0 ? (
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
                  <p className="truncate text-xs text-gray-400">{m.resetUrl}</p>
                  {!m.hasWhatsapp ? (
                    <p className="mt-0.5 text-xs text-amber-600">⚠️ WhatsApp não cadastrado</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => m.resetUrl && copyLink(m.resetUrl, m.userId)}
                  className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1E4620] shadow-sm ring-1 ring-[#A0D150]/50"
                >
                  {copiedId === m.userId ? '✅ Copiado!' : '📋 Copiar'}
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {noSlugMembers.length > 0 ? (
          <div className="mt-4 text-xs text-amber-800">
            <p className="font-semibold">⚠️ Membros sem link ({noSlugMembers.length})</p>
            <p className="mt-1 text-gray-500">Precisam cadastrar o slug de divulgação no perfil.</p>
            <ul className="mt-2 space-y-1">
              {noSlugMembers.map((m) => (
                <li key={m.userId} className="text-gray-600">
                  · {m.displayName ?? 'Membro sem nome'}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[#A0D150]/30 bg-[#A0D150]/10 p-5 sm:p-6">
        <h3 className="mb-2 font-bold text-[#1E4620]">💡 Como funciona</h3>
        <ul className="space-y-1.5 text-sm text-[#1E4620]/90">
          <li>1. Configure o vídeo sobre o Reset Metabólico acima.</li>
          <li>2. Cada membro copia o link e envia para quem pode se interessar pela sacola.</li>
          <li>3. A pessoa assiste ao vídeo, vê os benefícios e clica em encomendar sacola.</li>
          <li>4. O WhatsApp abre direto com quem compartilhou o link.</li>
        </ul>
      </div>
    </div>
  )
}
