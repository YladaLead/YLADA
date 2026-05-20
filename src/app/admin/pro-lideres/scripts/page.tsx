'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

/* ─── Tipos ─────────────────────────────────────────────────────────── */
type Tool = {
  id: string
  name: string
  emoji: string
  description: string | null
  is_active: boolean
  display_order: number
}

type Script = {
  id: string
  tool_id: string
  stage: Stage
  title: string | null
  content: string
  is_active: boolean
  display_order: number
}

type Stage = 'gerar_contato' | 'abordagem' | 'followup' | 'objecoes'

const STAGES: { key: Stage; label: string }[] = [
  { key: 'gerar_contato', label: '📣 Gerar Contato' },
  { key: 'abordagem',     label: '💬 Abordagem' },
  { key: 'followup',      label: '🔁 Follow-up' },
  { key: 'objecoes',      label: '🛡️ Objeções' },
]

/* ─── Helpers de fetch ───────────────────────────────────────────────── */
async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: 'include', ...options })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Erro desconhecido')
  return json
}

/* ─── Componente principal ───────────────────────────────────────────── */
function ScriptsAdminContent() {
  const [tools, setTools]         = useState<Tool[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [scripts, setScripts]     = useState<Script[]>([])
  const [activeStage, setActiveStage] = useState<Stage>('gerar_contato')
  const [telegramLink, setTelegramLink] = useState('')
  const [settingsId, setSettingsId]    = useState('')

  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Modais
  const [showNewTool, setShowNewTool]       = useState(false)
  const [showNewScript, setShowNewScript]   = useState(false)
  const [editingScript, setEditingScript]   = useState<Script | null>(null)

  // Formulários
  const [newToolName, setNewToolName]       = useState('')
  const [newToolEmoji, setNewToolEmoji]     = useState('🔧')
  const [newToolDesc, setNewToolDesc]       = useState('')
  const [scriptTitle, setScriptTitle]       = useState('')
  const [scriptContent, setScriptContent]  = useState('')

  /* ─── Load tools + settings ─── */
  const loadTools = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [toolsRes, settingsRes] = await Promise.all([
        apiFetch('/api/admin/prolider/tools'),
        apiFetch('/api/admin/prolider/settings'),
      ])
      setTools(toolsRes.tools ?? [])
      setTelegramLink(settingsRes.settings?.telegram_link ?? '')
      setSettingsId(settingsRes.settings?.id ?? '')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTools() }, [loadTools])

  /* ─── Load scripts quando seleciona ferramenta ─── */
  const loadScripts = useCallback(async (toolId: string) => {
    try {
      const res = await apiFetch(`/api/admin/prolider/scripts?tool_id=${toolId}`)
      setScripts(res.scripts ?? [])
    } catch (e: any) {
      setError(e.message)
    }
  }, [])

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool)
    setActiveStage('gerar_contato')
    loadScripts(tool.id)
  }

  /* ─── Toggle ativo/inativo ─── */
  const toggleTool = async (tool: Tool) => {
    try {
      await apiFetch(`/api/admin/prolider/tools/${tool.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !tool.is_active }),
      })
      setTools(prev => prev.map(t => t.id === tool.id ? { ...t, is_active: !t.is_active } : t))
      if (selectedTool?.id === tool.id) setSelectedTool(prev => prev ? { ...prev, is_active: !prev.is_active } : prev)
    } catch (e: any) { setError(e.message) }
  }

  /* ─── Nova ferramenta ─── */
  const createTool = async () => {
    if (!newToolName.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch('/api/admin/prolider/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newToolName, emoji: newToolEmoji, description: newToolDesc }),
      })
      setTools(prev => [...prev, res.tool])
      setShowNewTool(false)
      setNewToolName(''); setNewToolEmoji('🔧'); setNewToolDesc('')
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  /* ─── Deletar ferramenta ─── */
  const deleteTool = async (toolId: string) => {
    if (!confirm('Apagar esta ferramenta e todos os scripts dela?')) return
    try {
      await apiFetch(`/api/admin/prolider/tools/${toolId}`, { method: 'DELETE' })
      setTools(prev => prev.filter(t => t.id !== toolId))
      if (selectedTool?.id === toolId) { setSelectedTool(null); setScripts([]) }
    } catch (e: any) { setError(e.message) }
  }

  /* ─── Novo script ─── */
  const createScript = async () => {
    if (!scriptContent.trim() || !selectedTool) return
    setSaving(true)
    try {
      const res = await apiFetch('/api/admin/prolider/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: selectedTool.id, stage: activeStage, title: scriptTitle, content: scriptContent }),
      })
      setScripts(prev => [...prev, res.script])
      setShowNewScript(false)
      setScriptTitle(''); setScriptContent('')
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  /* ─── Editar script ─── */
  const saveEditScript = async () => {
    if (!editingScript || !scriptContent.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/admin/prolider/scripts/${editingScript.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: scriptTitle, content: scriptContent }),
      })
      setScripts(prev => prev.map(s => s.id === editingScript.id ? res.script : s))
      setEditingScript(null)
      setScriptTitle(''); setScriptContent('')
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  /* ─── Deletar script ─── */
  const deleteScript = async (scriptId: string) => {
    if (!confirm('Apagar este script?')) return
    try {
      await apiFetch(`/api/admin/prolider/scripts/${scriptId}`, { method: 'DELETE' })
      setScripts(prev => prev.filter(s => s.id !== scriptId))
    } catch (e: any) { setError(e.message) }
  }

  /* ─── Salvar Telegram ─── */
  const saveTelegram = async () => {
    setSaving(true)
    try {
      await apiFetch('/api/admin/prolider/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_link: telegramLink }),
      })
      alert('Link do Telegram salvo!')
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  /* ─── Abrir modal de edição ─── */
  const openEdit = (script: Script) => {
    setEditingScript(script)
    setScriptTitle(script.title ?? '')
    setScriptContent(script.content)
  }

  const stageScripts = scripts.filter(s => s.stage === activeStage)

  /* ─── Render ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📋 Scripts Pró Líderes</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gerencie ferramentas e scripts para o time</p>
          </div>
          <button
            onClick={() => setShowNewTool(true)}
            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Nova ferramenta
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mt-4 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex justify-between">
            {error}
            <button onClick={() => setError(null)} className="font-bold ml-4">✕</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6">

        {/* ── Coluna esquerda: lista de ferramentas ── */}
        <div className="w-64 flex-shrink-0 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Ferramentas</p>

          {tools.map(tool => (
            <div
              key={tool.id}
              onClick={() => selectTool(tool)}
              className={`group relative bg-white rounded-xl border-2 p-3 cursor-pointer transition ${
                selectedTool?.id === tool.id
                  ? 'border-indigo-500 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{tool.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{tool.name}</p>
                    <p className="text-xs text-gray-400">
                      {scripts.filter(s => s.tool_id === tool.id).length} scripts
                    </p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={e => { e.stopPropagation(); toggleTool(tool) }}
                  className={`w-10 h-5 rounded-full flex-shrink-0 relative transition-colors ${
                    tool.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    tool.is_active ? 'left-5' : 'left-0.5'
                  }`} />
                </button>
              </div>
              {/* Botão deletar — só aparece no hover */}
              <button
                onClick={e => { e.stopPropagation(); deleteTool(tool.id) }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity hidden group-hover:flex"
                title="Apagar ferramenta"
              >
                🗑
              </button>
            </div>
          ))}

          {tools.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma ferramenta ainda</p>
          )}

          {/* Configurações — Telegram */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">📲 Link Telegram</p>
            <input
              type="url"
              value={telegramLink}
              onChange={e => setTelegramLink(e.target.value)}
              placeholder="https://t.me/seucanal"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={saveTelegram}
              disabled={saving}
              className="mt-2 w-full bg-gray-800 text-white text-xs font-semibold py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar link'}
            </button>
          </div>
        </div>

        {/* ── Coluna direita: scripts ── */}
        <div className="flex-1 min-w-0">
          {!selectedTool ? (
            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">👈</span>
              <p className="text-gray-500 font-medium">Selecione uma ferramenta para ver os scripts</p>
              <p className="text-gray-400 text-sm mt-1">ou crie uma nova usando o botão acima</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Cabeçalho da ferramenta */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTool.emoji}</span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{selectedTool.name}</h2>
                    {selectedTool.description && (
                      <p className="text-xs text-gray-400">{selectedTool.description}</p>
                    )}
                  </div>
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedTool.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {selectedTool.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <button
                  onClick={() => { setShowNewScript(true); setScriptTitle(''); setScriptContent('') }}
                  className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  + Adicionar script
                </button>
              </div>

              {/* Tabs de etapa */}
              <div className="flex gap-0 border-b border-gray-100 px-6">
                {STAGES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setActiveStage(s.key)}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
                      activeStage === s.key
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {s.label}
                    <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {scripts.filter(sc => sc.stage === s.key).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Lista de scripts */}
              <div className="p-6 space-y-4">
                {stageScripts.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-3xl mb-2">📝</p>
                    <p className="text-sm">Nenhum script nesta etapa ainda.</p>
                    <p className="text-xs mt-1">Clique em "+ Adicionar script" para criar o primeiro.</p>
                  </div>
                )}

                {stageScripts.map((script, idx) => (
                  <div key={script.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Script {idx + 1}
                          </span>
                          {script.title && (
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {script.title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {script.content}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEdit(script)}
                          className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          ✎ Editar
                        </button>
                        <button
                          onClick={() => deleteScript(script.id)}
                          className="text-xs font-semibold bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Nova ferramenta ── */}
      {showNewTool && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-4">Nova ferramenta</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newToolEmoji}
                  onChange={e => setNewToolEmoji(e.target.value)}
                  placeholder="🔧"
                  className="w-16 text-center text-xl border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-400"
                  maxLength={4}
                />
                <input
                  type="text"
                  value={newToolName}
                  onChange={e => setNewToolName(e.target.value)}
                  placeholder="Nome da ferramenta"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
              <input
                type="text"
                value={newToolDesc}
                onChange={e => setNewToolDesc(e.target.value)}
                placeholder="Descrição curta (opcional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowNewTool(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={createTool}
                disabled={saving || !newToolName.trim()}
                className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Criando...' : 'Criar ferramenta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Novo / Editar script ── */}
      {(showNewScript || editingScript) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {editingScript ? 'Editar script' : `Novo script — ${STAGES.find(s => s.key === activeStage)?.label}`}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Filosofia: pergunta concreta, reflexão e pedido de permissão. Copy leve, sem travessão (—).
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={scriptTitle}
                onChange={e => setScriptTitle(e.target.value)}
                placeholder="Título/label do script (opcional — ex: WhatsApp direto)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              <textarea
                value={scriptContent}
                onChange={e => setScriptContent(e.target.value)}
                placeholder="Escreva o script aqui..."
                rows={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
              />
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setShowNewScript(false); setEditingScript(null); setScriptTitle(''); setScriptContent('') }}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={editingScript ? saveEditScript : createScript}
                disabled={saving || !scriptContent.trim()}
                className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingScript ? 'Salvar alterações' : 'Adicionar script'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ScriptsAdminPage() {
  return (
    <AdminProtectedRoute>
      <ScriptsAdminContent />
    </AdminProtectedRoute>
  )
}
