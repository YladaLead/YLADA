'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  PROLIDER_SCRIPT_CANAIS,
  PROLIDER_SCRIPT_PUBLICOS,
  PROLIDER_SCRIPT_STAGES,
  proLiderScriptCanalInfo,
  proLiderScriptPublicoInfo,
  type ProliderScriptCanal,
  type ProliderScriptPublico,
  type ProliderScriptStage,
} from '@/lib/pro-lideres-y-scripts-filters'

/* ─── Tipos ──────────────────────────────────────────────────────────── */
type Tool = {
  id: string
  name: string
  emoji: string
  description: string | null
  is_active: boolean
  display_order: number
}

type Publico = ProliderScriptPublico
type Canal = ProliderScriptCanal
type Stage = ProliderScriptStage

type Script = {
  id: string
  tool_id: string
  stage: Stage
  contexto: Publico
  canal: Canal
  title: string | null
  content: string
  is_active: boolean
}

const STAGES = PROLIDER_SCRIPT_STAGES
const PUBLICOS = PROLIDER_SCRIPT_PUBLICOS
const CANAIS = PROLIDER_SCRIPT_CANAIS

function publicoInfo(c?: Publico | null) {
  return proLiderScriptPublicoInfo(c)
}
function canalInfo(c?: Canal | null) {
  return proLiderScriptCanalInfo(c)
}

async function apiFetch(url: string, options?: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000) // 12s timeout
  try {
    const res = await fetch(url, { credentials: 'include', signal: controller.signal, ...options })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((json as { error?: string }).error ?? 'Erro desconhecido')
    return json as Record<string, unknown>
  } finally {
    clearTimeout(timeout)
  }
}

/* ─── Modal mover script do Noel (auto-suficiente) ──────────────────── */
export function MoverParaFerramentaModal({
  entryId,
  entryTitle,
  onClose,
  onMoved,
}: {
  entryId: string
  entryTitle: string
  onClose: () => void
  onMoved: () => void
}) {
  const [tools, setTools]   = useState<Tool[]>([])
  const [toolId, setToolId] = useState('')
  const [stage, setStage]   = useState<Stage>('gerar_contato')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  // Carrega ferramentas ao abrir
  useEffect(() => {
    apiFetch('/api/pro-lideres/ferramentas')
      .then(res => {
        const list = (res.tools as Tool[]) ?? []
        setTools(list)
        if (list.length > 0) setToolId(list[0].id)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Erro ao carregar ferramentas'))
      .finally(() => setLoading(false))
  }, [])

  async function mover() {
    if (!toolId) return
    setSaving(true)
    setError(null)
    try {
      await apiFetch('/api/pro-lideres/ferramentas/scripts/from-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_id: entryId, tool_id: toolId, stage }),
      })
      onMoved()
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h3 className="text-base font-bold text-gray-900 mb-1">Mover para ferramenta</h3>
        <p className="text-xs text-gray-500 mb-4 truncate">"{entryTitle}"</p>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        {loading ? (
          <p className="text-sm text-gray-400 py-4 text-center">Carregando ferramentas…</p>
        ) : tools.length === 0 ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Crie pelo menos uma ferramenta na aba "Ferramentas" antes de mover.
          </p>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ferramenta</label>
              <select
                value={toolId}
                onChange={e => setToolId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              >
                {tools.map(t => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Etapa</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as Stage)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              >
                {STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">O original continua na biblioteca — apague depois se quiser.</p>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={mover}
            disabled={saving || !toolId || loading || tools.length === 0}
            className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? 'Movendo...' : 'Mover →'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Componente principal ───────────────────────────────────────────── */
export function ProLideresFerramentasTab() {
  const [tools, setTools]             = useState<Tool[]>([])
  const [canEdit, setCanEdit]         = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [scripts, setScripts]         = useState<Script[]>([])
  const [activeStage, setActiveStage] = useState<Stage>('gerar_contato')
  const [loading, setLoading]         = useState(true)
  const [slowLoad, setSlowLoad]       = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [copiedId, setCopiedId]       = useState<string | null>(null)
  const [activePublico, setActivePublico] = useState<Publico | 'todos'>('todos')
  const [activeCanal, setActiveCanal]   = useState<Canal | 'todos'>('todos')

  // Modais
  const [showNewTool, setShowNewTool]     = useState(false)
  const [showNewScript, setShowNewScript] = useState(false)
  const [editingScript, setEditingScript] = useState<Script | null>(null)

  // Formulários
  const [newToolName, setNewToolName]     = useState('')
  const [newToolEmoji, setNewToolEmoji]   = useState('🔧')
  const [newToolDesc, setNewToolDesc]     = useState('')
  const [scriptTitle, setScriptTitle]     = useState('')
  const [scriptContent, setScriptContent] = useState('')
  const [scriptPublico, setScriptPublico] = useState<Publico>('geral')
  const [scriptCanal, setScriptCanal]     = useState<Canal>('geral')

  const loadTools = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/pro-lideres/ferramentas')
      const list = (res.tools as Tool[]) ?? []
      const canEditResult = Boolean(res.canEdit)
      setCanEdit(canEditResult)

      // Primeira visita: seed automático se líder e sem ferramentas
      if (list.length === 0 && canEditResult) {
        try {
          await apiFetch('/api/pro-lideres/ferramentas/seed', { method: 'POST' })
          const reloaded = await apiFetch('/api/pro-lideres/ferramentas')
          setTools((reloaded.tools as Tool[]) ?? [])
        } catch {
          // Se o seed falhar, mostra vazio — o líder pode criar manualmente
          setTools([])
        }
      } else {
        setTools(list)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTools()
    const slowTimer = setTimeout(() => setSlowLoad(true), 8000)
    return () => clearTimeout(slowTimer)
  }, [loadTools])

  const loadScripts = useCallback(async (toolId: string) => {
    try {
      const res = await apiFetch(`/api/pro-lideres/ferramentas/${toolId}/scripts`)
      setScripts((res.scripts as Script[]) ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar scripts')
    }
  }, [])

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool)
    setActiveStage('gerar_contato')
    setActivePublico('todos')
    setActiveCanal('todos')
    void loadScripts(tool.id)
  }

  /* ─── Toggle ativo ─── */
  const toggleTool = async (tool: Tool) => {
    try {
      await apiFetch(`/api/pro-lideres/ferramentas/${tool.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !tool.is_active }),
      })
      setTools(prev => prev.map(t => t.id === tool.id ? { ...t, is_active: !t.is_active } : t))
      if (selectedTool?.id === tool.id) setSelectedTool(p => p ? { ...p, is_active: !p.is_active } : p)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
  }

  /* ─── Criar ferramenta ─── */
  const createTool = async () => {
    if (!newToolName.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch('/api/pro-lideres/ferramentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newToolName, emoji: newToolEmoji, description: newToolDesc }),
      })
      setTools(prev => [...prev, res.tool as Tool])
      setShowNewTool(false)
      setNewToolName(''); setNewToolEmoji('🔧'); setNewToolDesc('')
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
    setSaving(false)
  }

  /* ─── Deletar ferramenta ─── */
  const deleteTool = async (toolId: string) => {
    if (!confirm('Apagar esta ferramenta e todos os scripts dela?')) return
    try {
      await apiFetch(`/api/pro-lideres/ferramentas/${toolId}`, { method: 'DELETE' })
      setTools(prev => prev.filter(t => t.id !== toolId))
      if (selectedTool?.id === toolId) { setSelectedTool(null); setScripts([]) }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
  }

  /* ─── Criar script ─── */
  const createScript = async () => {
    if (!scriptContent.trim() || !selectedTool) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/pro-lideres/ferramentas/${selectedTool.id}/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: activeStage, title: scriptTitle, content: scriptContent, contexto: scriptPublico, canal: scriptCanal }),
      })
      setScripts(prev => [...prev, res.script as Script])
      setShowNewScript(false)
      setScriptTitle(''); setScriptContent(''); setScriptPublico('geral'); setScriptCanal('geral')
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
    setSaving(false)
  }

  /* ─── Salvar edição ─── */
  const saveEdit = async () => {
    if (!editingScript || !scriptContent.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/pro-lideres/ferramentas/scripts/${editingScript.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: scriptTitle, content: scriptContent, contexto: scriptPublico, canal: scriptCanal }),
      })
      setScripts(prev => prev.map(s => s.id === editingScript.id ? res.script as Script : s))
      setEditingScript(null)
      setScriptTitle(''); setScriptContent(''); setScriptPublico('geral'); setScriptCanal('geral')
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
    setSaving(false)
  }

  /* ─── Deletar script ─── */
  const deleteScript = async (id: string) => {
    if (!confirm('Apagar este script?')) return
    try {
      await apiFetch(`/api/pro-lideres/ferramentas/scripts/${id}`, { method: 'DELETE' })
      setScripts(prev => prev.filter(s => s.id !== id))
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro') }
  }

  /* ─── Copiar ─── */
  const copyScript = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* fallback silencioso */ }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openEdit = (s: Script) => {
    setEditingScript(s)
    setScriptTitle(s.title ?? '')
    setScriptContent(s.content)
    setScriptPublico(s.contexto ?? 'geral')
    setScriptCanal(s.canal ?? 'geral')
  }

  const stageScripts = scripts.filter(s => s.stage === activeStage)
  const filteredScripts = stageScripts.filter(s => {
    const pub   = s.contexto ?? 'geral'
    const canal = s.canal ?? 'geral'
    const publicoOk = activePublico === 'todos' || pub === 'geral' || pub === activePublico
    const canalOk   = activeCanal === 'todos' || canal === 'geral' || canal === activeCanal
    return publicoOk && canalOk
  })
  const activeStageInfo = STAGES.find(s => s.key === activeStage)!

  /* ─── Render ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="py-12 text-center space-y-3">
      <p className="text-sm text-gray-500">Preparando ferramentas…</p>
      <p className="text-xs text-gray-400">Primeira vez? Estamos montando tudo automaticamente 🙂</p>
      {slowLoad && (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-amber-600">Está demorando mais que o esperado.</p>
          <button
            onClick={() => { setSlowLoad(false); void loadTools() }}
            className="text-xs font-semibold text-indigo-600 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex justify-between">
      {error}
      <button onClick={() => setError(null)} className="font-bold">✕</button>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Scripts organizados por ferramenta e etapa da conversa.
          {!canEdit && ' Toque para copiar e usar.'}
        </p>
        {canEdit && (
          <button
            onClick={() => setShowNewTool(true)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
          >
            + Ferramenta
          </button>
        )}
      </div>

      {/* Cards de ferramentas */}
      {tools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-indigo-200/90 bg-indigo-50/40 px-5 py-12 text-center">
          <p className="text-base font-semibold text-gray-800">Nenhuma ferramenta ainda</p>
          {canEdit && (
            <p className="text-sm text-gray-500 mt-1">Clique em "+ Ferramenta" para criar a primeira.</p>
          )}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => selectTool(tool)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                selectedTool?.id === tool.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              } ${!tool.is_active && canEdit ? 'opacity-50' : ''}`}
            >
              <span className="text-base">{tool.emoji}</span>
              <span>{tool.name}</span>
              {canEdit && !tool.is_active && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">inativo</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Área de scripts da ferramenta selecionada */}
      {selectedTool && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {/* Header da ferramenta */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedTool.emoji}</span>
              <span className="font-bold text-gray-900">{selectedTool.name}</span>
              {canEdit && (
                <>
                  <button
                    onClick={() => toggleTool(selectedTool)}
                    className={`ml-2 w-9 h-5 rounded-full relative transition-colors ${selectedTool.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={selectedTool.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${selectedTool.is_active ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <button
                    onClick={() => deleteTool(selectedTool.id)}
                    className="ml-1 text-xs text-red-400 hover:text-red-600 transition"
                    title="Apagar ferramenta"
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
            {canEdit && (
              <button
                onClick={() => { setShowNewScript(true); setScriptTitle(''); setScriptContent('') }}
                className="text-sm font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                + Script
              </button>
            )}
          </div>

          {/* Tabs de etapa */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {STAGES.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveStage(s.key)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition -mb-px ${
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

          {/* Filtros — duas dimensões independentes */}
          <div className="px-5 py-3 border-b border-gray-100 space-y-2">
            {/* Quem: tipo de contato */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-gray-400 w-10 shrink-0">Quem</span>
              {PUBLICOS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setActivePublico(prev => prev === p.key ? 'todos' : p.key)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                    activePublico === p.key
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                  <span className="ml-1 opacity-60">
                    {stageScripts.filter(s => (s.contexto ?? 'geral') === p.key).length}
                  </span>
                </button>
              ))}
            </div>
            {/* Como: canal */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-gray-400 w-10 shrink-0">Como</span>
              {CANAIS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setActiveCanal(prev => prev === c.key ? 'todos' : c.key)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                    activeCanal === c.key
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {c.label}
                  <span className="ml-1 opacity-60">
                    {stageScripts.filter(s => (s.canal ?? 'geral') === c.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de scripts */}
          <div className="p-5 space-y-4">
            {filteredScripts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-2xl mb-2">📝</p>
                <p className="text-sm">
                  {(activePublico !== 'todos' || activeCanal !== 'todos')
                    ? 'Nenhum script neste filtro ainda.'
                    : canEdit
                      ? 'Nenhum script nesta etapa. Adicione um ou mova da biblioteca do Noel.'
                      : 'O líder ainda não adicionou scripts nesta etapa.'}
                </p>
              </div>
            )}

            {filteredScripts.map(script => {
              const pub  = publicoInfo(script.contexto)
              const can  = canalInfo(script.canal)
              return (
                <div key={script.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  {/* Cabeçalho do card */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-50">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {script.title && (
                        <span className="text-xs font-bold text-gray-800 mr-1">{script.title}</span>
                      )}
                      {pub && pub.key !== 'geral' && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${pub.badge}`}>
                          {pub.label}
                        </span>
                      )}
                      {can && can.key !== 'geral' && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${can.badge}`}>
                          {can.label}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => void copyScript(script.id, script.content)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                          copiedId === script.id
                            ? 'bg-green-500 text-white'
                            : !canEdit
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {copiedId === script.id ? '✓ Copiado' : 'Copiar'}
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => openEdit(script)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => void deleteScript(script.id)}
                            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Corpo do script */}
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{script.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Modal nova ferramenta ── */}
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
                  maxLength={4}
                  className="w-14 text-center text-xl border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-400"
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
              <button onClick={() => setShowNewTool(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={createTool} disabled={saving || !newToolName.trim()} className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                {saving ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal novo/editar script ── */}
      {(showNewScript || editingScript) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {editingScript ? 'Editar script' : `Novo script — ${activeStageInfo.label}`}
            </h3>
            <p className="text-xs text-gray-400 mb-4">{activeStageInfo.desc}</p>
            <div className="space-y-3">
              <input
                type="text"
                value={scriptTitle}
                onChange={e => setScriptTitle(e.target.value)}
                placeholder="Título do script (opcional — ex: Abordagem direta)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              {/* Quem */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Quem você está contatando? <span className="font-normal text-gray-400">(deixe sem seleção = serve pra todos)</span></p>
                <div className="flex flex-wrap gap-1.5">
                  {PUBLICOS.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setScriptPublico(prev => prev === p.key ? 'geral' : p.key)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                        scriptPublico === p.key
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Como */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Qual o canal? <span className="font-normal text-gray-400">(deixe sem seleção = serve pra ambos)</span></p>
                <div className="flex flex-wrap gap-1.5">
                  {CANAIS.map(c => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setScriptCanal(prev => prev === c.key ? 'geral' : c.key)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                        scriptCanal === c.key
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={scriptContent}
                onChange={e => setScriptContent(e.target.value)}
                placeholder="Escreva o script aqui…"
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
                onClick={editingScript ? saveEdit : createScript}
                disabled={saving || !scriptContent.trim()}
                className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingScript ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
