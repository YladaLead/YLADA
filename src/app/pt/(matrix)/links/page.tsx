'use client'

import { useState, useEffect } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

type Template = { id: string; name: string; type: string; version: number; suggested_prompts?: string[] }
type LinkRow = { id: string; slug: string; title: string | null; status: string; created_at: string; url: string }

/** Lembretes vindos do banco: cada um já aponta para um template. */
function buildSuggestions(templates: Template[]): { phrase: string; templateId: string }[] {
  const out: { phrase: string; templateId: string }[] = []
  for (const t of templates) {
    const prompts = Array.isArray(t.suggested_prompts) ? t.suggested_prompts : []
    for (const p of prompts) {
      if (typeof p === 'string' && p.trim()) out.push({ phrase: p.trim(), templateId: t.id })
    }
  }
  return out
}

export default function MatrixLinksPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [interpretText, setInterpretText] = useState('')
  const [interpreting, setInterpreting] = useState(false)
  const [interpretResult, setInterpretResult] = useState<{
    profileSuggest: Record<string, string>
    recommendedTemplateId: string | null
    recommendedTemplateName?: string
    diagnosticSummary?: string | null
    confidence: number
  } | null>(null)

  const loadTemplatesAndLinks = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const [tRes, lRes] = await Promise.all([
        fetch('/api/ylada/templates', { credentials: 'include' }),
        fetch('/api/ylada/links', { credentials: 'include' }),
      ])
      const tJson = await tRes.json()
      const lJson = await lRes.json()
      if (tJson?.success && Array.isArray(tJson.data)) setTemplates(tJson.data)
      if (lJson?.success && Array.isArray(lJson.data)) setLinks(lJson.data)
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível carregar.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplatesAndLinks()
  }, [])

  const handleCreateLink = async () => {
    if (!selectedTemplateId) {
      setMessage({ type: 'error', text: 'Escolha um template.' })
      return
    }
    setCreating(true)
    setMessage(null)
    try {
      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ template_id: selectedTemplateId }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setLinks((prev) => [{ ...json.data, url: json.data.url || `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${json.data.slug}` }, ...prev])
        setMessage({ type: 'success', text: `Link criado: ${json.data.url || `/l/${json.data.slug}`}` })
        setSelectedTemplateId('')
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao criar link.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar link. Tente novamente.' })
    } finally {
      setCreating(false)
    }
  }

  const copyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setMessage({ type: 'success', text: 'URL copiada!' })
    }
  }

  const handleInterpret = async () => {
    if (!interpretText.trim()) {
      setMessage({ type: 'error', text: 'Digite um texto para interpretar.' })
      return
    }
    setInterpreting(true)
    setInterpretResult(null)
    setMessage(null)
    try {
      const res = await fetch('/api/ylada/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: interpretText.trim() }),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setInterpretResult(json.data)
        if (json.data.recommendedTemplateId) {
          setSelectedTemplateId(json.data.recommendedTemplateId)
        }
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao interpretar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao interpretar. Tente novamente.' })
    } finally {
      setInterpreting(false)
    }
  }

  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Links inteligentes</h1>
          <p className="text-gray-600 mb-2">
            Crie ferramentas (quiz, calculadora) para compartilhar com seus possíveis clientes ou pacientes — eles preenchem, veem um resultado e podem falar com você no WhatsApp.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            O conteúdo do quiz e da calculadora é <strong>oficial da plataforma</strong> (definido pelos templates). Você só gera o link para compartilhar.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.text}
          </div>
        )}

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Para que você quer usar este link?</h2>
          <p className="text-xs text-gray-500 mb-3">
            Escolha uma sugestão abaixo ou descreva como quer engajar. O template já define o conteúdo oficial (quiz ou calculadora).
          </p>
          {templates.length > 0 && buildSuggestions(templates).length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Sugestões (clique para usar):</p>
              <div className="flex flex-wrap gap-2">
                {buildSuggestions(templates).map((s) => (
                  <button
                    key={`${s.templateId}-${s.phrase.slice(0, 20)}`}
                    type="button"
                    onClick={() => {
                      setInterpretText(s.phrase)
                      setSelectedTemplateId(s.templateId)
                      setInterpretResult(null)
                      setMessage(null)
                    }}
                    className="rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors"
                  >
                    {s.phrase}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 mb-4">
            <textarea
              placeholder="Ex: Quero um quiz para qualificar quem tem interesse em agendar comigo"
              value={interpretText}
              onChange={(e) => setInterpretText(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <button
              type="button"
              onClick={handleInterpret}
              disabled={interpreting}
              className="self-start rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {interpreting ? 'Interpretando...' : 'Interpretar'}
            </button>
          </div>
          {interpretResult && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm space-y-2">
              <p className="font-medium text-gray-700">Sugestão (processo reverso — apenas valide):</p>
              <p className="text-gray-600">
                Perfil: {Object.entries(interpretResult.profileSuggest)
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${k}=${v}`)
                  .join(', ') || '—'}
              </p>
              <p className="text-gray-600">
                Template: {interpretResult.recommendedTemplateName || interpretResult.recommendedTemplateId || '—'} (confiança: {(interpretResult.confidence * 100).toFixed(0)}%)
              </p>
              {interpretResult.diagnosticSummary && (
                <>
                  <p className="font-medium text-gray-700 mt-2">Diagnóstico (conteúdo oficial deste link):</p>
                  <p className="text-gray-600 italic">{interpretResult.diagnosticSummary}</p>
                  <p className="text-xs text-gray-500 mt-1">Se estiver de acordo, use &quot;Gerar link&quot; abaixo para criar o link e compartilhar.</p>
                </>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Criar novo link</h2>
          <p className="text-xs text-gray-500 mb-3">
            Escolha um template (ou clique numa sugestão acima) e gere o link. Sem perguntas extras — o diagnóstico e a calculadora já estão definidos pela plataforma.
          </p>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum template disponível. Execute a migration 208 (seed).</p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                <option value="">Selecione o template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCreateLink}
                disabled={creating || !selectedTemplateId}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Gerar link'}
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Seus links</h2>
          {links.length === 0 ? (
            <p className="text-gray-500 text-sm">Você ainda não criou nenhum link. Use o bloco acima para criar.</p>
          ) : (
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.id} className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{link.title || link.slug}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyUrl(link.url)}
                    className="shrink-0 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Copiar URL
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </YladaAreaShell>
  )
}
