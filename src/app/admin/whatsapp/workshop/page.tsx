'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type WorkshopSettings = {
  id: string
  area: string
  flyer_url: string | null
  flyer_caption: string | null
}

type WorkshopSession = {
  id: string
  area: string
  title: string
  starts_at: string
  zoom_link: string
  is_active: boolean
}

function formatDateTimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatPtBR(iso: string) {
  const d = new Date(iso)
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${weekday}, ${date} • ${time}`
}

function WorkshopContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<WorkshopSettings | null>(null)
  const [sessions, setSessions] = useState<WorkshopSession[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [flyerUrl, setFlyerUrl] = useState('')
  const [flyerCaption, setFlyerCaption] = useState('')

  const [newTitle, setNewTitle] = useState('Aula Prática ao Vivo (Agenda Instável)')
  const [newStartsAt, setNewStartsAt] = useState('')
  const [newZoomLink, setNewZoomLink] = useState('')
  const [newActive, setNewActive] = useState(true)

  const upcoming = useMemo(
    () => sessions.filter((s) => s.is_active).sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [sessions]
  )

  const loadAll = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const [settingsRes, sessionsRes] = await Promise.all([
        fetch('/api/admin/whatsapp/workshop-settings', { credentials: 'include' }),
        fetch('/api/admin/whatsapp/workshop-sessions', { credentials: 'include' }),
      ])
      const settingsJson = await settingsRes.json()
      const sessionsJson = await sessionsRes.json()

      if (!settingsRes.ok) throw new Error(settingsJson.error || 'Erro ao carregar settings')
      if (!sessionsRes.ok) throw new Error(sessionsJson.error || 'Erro ao carregar sessões')

      setSettings(settingsJson.settings)
      setSessions(sessionsJson.sessions || [])

      setFlyerUrl(settingsJson.settings?.flyer_url || '')
      setFlyerCaption(settingsJson.settings?.flyer_caption || '')
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const uploadFlyer = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/community/upload', {
      method: 'POST',
      credentials: 'include',
      body: form,
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'Erro ao fazer upload do flyer')
    return json.url as string
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const res = await fetch('/api/admin/whatsapp/workshop-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          flyer_url: flyerUrl || null,
          flyer_caption: flyerCaption || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao salvar settings')
      setSettings(json.settings)
      setSuccess('Configurações salvas!')
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar settings')
    } finally {
      setSaving(false)
    }
  }

  const createSession = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!newStartsAt || !newZoomLink.trim()) {
        throw new Error('Preencha data/hora e link do Zoom')
      }

      const iso = new Date(newStartsAt).toISOString()
      const res = await fetch('/api/admin/whatsapp/workshop-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTitle,
          starts_at: iso,
          zoom_link: newZoomLink.trim(),
          is_active: newActive,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao criar sessão')
      setSuccess('Sessão criada!')
      setNewZoomLink('')
      setNewStartsAt('')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao criar sessão')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s: WorkshopSession) => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`/api/admin/whatsapp/workshop-sessions/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !s.is_active }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao atualizar sessão')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao atualizar sessão')
    } finally {
      setSaving(false)
    }
  }

  const deleteSession = async (s: WorkshopSession) => {
    if (!confirm('Deletar esta sessão?')) return
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`/api/admin/whatsapp/workshop-sessions/${s.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao deletar sessão')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao deletar sessão')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/admin/whatsapp" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Voltar
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Workshop (Nutri)</h1>
            <p className="text-xs text-gray-500">Agenda + Flyer padrão</p>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Flyer padrão</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (URL)</label>
                  <div className="flex gap-2">
                    <input
                      value={flyerUrl}
                      onChange={(e) => setFlyerUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <label className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 cursor-pointer text-sm">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          try {
                            setSaving(true)
                            const url = await uploadFlyer(file)
                            setFlyerUrl(url)
                            setSuccess('Flyer enviado. Clique em “Salvar” para aplicar.')
                          } catch (err: any) {
                            setError(err.message || 'Erro ao subir flyer')
                          } finally {
                            setSaving(false)
                            e.target.value = ''
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Esse flyer será enviado como imagem no WhatsApp.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
                  <input
                    value={flyerCaption}
                    onChange={(e) => setFlyerCaption(e.target.value)}
                    placeholder="Ex.: Aula prática gratuita"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Se vazio, a legenda usa título + data/hora.</p>
                </div>
              </div>

              {flyerUrl && (
                <div className="mt-4">
                  <div className="text-sm text-gray-700 mb-2">Preview</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flyerUrl} alt="Flyer" className="max-h-80 rounded-lg border border-gray-200" />
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Agenda (próximas aulas)</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e hora</label>
                  <input
                    type="datetime-local"
                    value={newStartsAt}
                    onChange={(e) => setNewStartsAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={newActive}
                      onChange={(e) => setNewActive(e.target.checked)}
                    />
                    Ativa
                  </label>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Zoom</label>
                  <input
                    value={newZoomLink}
                    onChange={(e) => setNewZoomLink(e.target.value)}
                    placeholder="https://us02web.zoom.us/j/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={createSession}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quando</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                          Nenhuma sessão cadastrada.
                        </td>
                      </tr>
                    ) : (
                      sessions.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatPtBR(s.starts_at)}</div>
                            <div className="text-xs text-gray-500">{s.title}</div>
                          </td>
                          <td className="px-3 py-3">
                            <a className="text-sm text-blue-600 underline break-all" href={s.zoom_link} target="_blank" rel="noreferrer">
                              {s.zoom_link}
                            </a>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {s.is_active ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-right">
                            <button
                              onClick={() => toggleActive(s)}
                              disabled={saving}
                              className="text-sm text-gray-700 hover:text-gray-900 mr-3"
                            >
                              {s.is_active ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              onClick={() => deleteSession(s)}
                              disabled={saving}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {upcoming.length > 0 && (
                <div className="mt-4 text-sm text-gray-700">
                  <span className="font-medium">Próxima ativa:</span> {formatPtBR(upcoming[0].starts_at)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function WorkshopAdminPage() {
  return (
    <AdminProtectedRoute>
      <WorkshopContent />
    </AdminProtectedRoute>
  )
}

