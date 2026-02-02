'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

/** Chaves dos templates editáveis. Descrição e placeholder. */
const FLOW_KEYS: Array<{
  key: string
  label: string
  description: string
  placeholder: string
  phase: string
}> = [
  {
    key: 'welcome_form_greeting',
    label: 'Saudação (automação formulário – não é Carol)',
    description: 'Enviada quando a pessoa se inscreve no formulário e ainda não clicou no WhatsApp. Use {{nome}} para o primeiro nome.',
    placeholder: 'Oi {{nome}}, tudo bem? 😊\n\nSeja muito bem-vinda!\nEu sou a Carol, da equipe Ylada Nutri.',
    phase: 'Formulário',
  },
  {
    key: 'welcome_form_body',
    label: 'Corpo + opções (automação formulário – não é Carol)',
    description: 'Texto da aula e opções de dia/horário. As opções são preenchidas automaticamente; você edita só o texto antes e depois.',
    placeholder: 'Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.\n\nEssa aula é 100% prática...\n\n[OPÇÕES inseridas automaticamente]\n\n💬 Qual você prefere? 💚',
    phase: 'Formulário',
  },
  {
    key: 'link_after_participou',
    label: 'Quando participou da aula (link oferta/cadastro)',
    description: 'Enviada quando o admin marca "Participou". Use {{nome}} e {{link}}. Se não preencher, usa o texto padrão do sistema.',
    placeholder:
      'Oi {{nome}}! 💚\n\nQue bom que você participou da aula.\nPra eu te orientar certinho: qual foi o ponto que mais fez sentido pra você hoje?\n\n🔗 {{link}}\n\nVocê prefere começar no *mensal* ou no *anual*?',
    phase: 'Participou',
  },
  {
    key: 'remarketing_nao_participou',
    label: 'Abertura remarketing (não participou)',
    description: 'Texto de referência para a Carol quando a pessoa não participou (pode ser passado ao contexto da IA em atualização futura). Use {{nome}} se quiser.',
    placeholder:
      'Oi {{nome}}! 💚\n\nVi que você não conseguiu entrar na aula — acontece.\nQuer que eu te encaixe na próxima turma? Qual período costuma ser melhor pra você: manhã, tarde ou noite?',
    phase: 'Não participou',
  },
]

const DEFAULT_TEMPLATES: Record<string, string> = {
  welcome_form_greeting: 'Oi {{nome}}, tudo bem? 😊\n\nSeja muito bem-vinda!\nEu sou a Carol, da equipe Ylada Nutri.',
  welcome_form_body: 'Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.\n\nEssa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica.\n\nAs próximas aulas ao vivo vão acontecer nos seguintes dias e horários:\n\n[OPÇÕES inseridas automaticamente]\n\n💬 Qual você prefere? 💚',
  link_after_participou:
    'Oi {{nome}}! 💚\n\nQue bom que você participou da aula.\nPra eu te orientar certinho: qual foi o ponto que mais fez sentido pra você hoje?\n\n🔗 {{link}}\n\nVocê prefere começar no *mensal* ou no *anual*?',
  remarketing_nao_participou:
    'Oi {{nome}}! 💚\n\nVi que você não conseguiu entrar na aula — acontece.\nQuer que eu te encaixe na próxima turma? Qual período costuma ser melhor pra você: manhã, tarde ou noite?',
}

function FluxoContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [flow_templates, setFlow_templates] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/whatsapp/flow-templates', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar')
      const templates = (data.flow_templates && typeof data.flow_templates === 'object')
        ? { ...DEFAULT_TEMPLATES, ...data.flow_templates }
        : { ...DEFAULT_TEMPLATES }
      setFlow_templates(templates)
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar templates')
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/whatsapp/flow-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ flow_templates }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar')
      setSuccess('Templates salvos! Eles serão usados na automação (formulário e quando marcar participou/não participou).')
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  function setTemplate(key: string, value: string) {
    setFlow_templates((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Carregando fluxo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <Link href="/admin/whatsapp" className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block">
              ← WhatsApp
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Fluxo e textos do WhatsApp (Nutri)</h1>
            <p className="text-sm text-gray-500 mt-1">
              Edite os textos enviados em cada etapa. Participou → um caminho; não participou → outro. Quando não é a Carol (automação do formulário), use os textos abaixo.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Caminho para verificar todo o fluxo */}
        <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Como verificar todo o fluxo</h2>
          <p className="text-sm text-blue-800 mb-3">
            Use estes caminhos no admin para acompanhar cada etapa do WhatsApp (Nutri):
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Conversas e tags:</strong> <Link href="/admin/whatsapp" className="underline">/admin/whatsapp</Link> — ver conversas, editar tags (ex.: Link Workshop), enviar link manualmente.</li>
            <li><strong>Textos deste fluxo:</strong> você está em <code className="bg-blue-100 px-1 rounded">/admin/whatsapp/fluxo</code> — editar mensagens do formulário, Carol, participou e não participou.</li>
            <li><strong>Sessões de aula (Zoom):</strong> <Link href="/admin/whatsapp/workshop" className="underline">/admin/whatsapp/workshop</Link> — datas, links e participantes.</li>
            <li><strong>Cadastros workshop:</strong> <Link href="/admin/whatsapp/cadastros-workshop" className="underline">/admin/whatsapp/cadastros-workshop</Link> — inscrições e integração com o formulário.</li>
            <li><strong>Automação em lote:</strong> <Link href="/admin/whatsapp/automation" className="underline">/admin/whatsapp/automation</Link> — processar pendentes e reprocessar fluxo.</li>
          </ul>
        </div>

        {/* Diagrama simples do fluxo */}
        <div className="mb-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visão do fluxo</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg">Inscrito</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg">Formulário (não é Carol)</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg">Carol: opções</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg">Link Zoom</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg">Participou → Link oferta</span>
            <span className="text-gray-400">|</span>
            <span className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg">Não participou → Remarketing</span>
          </div>
        </div>

        {/* Blocos de edição por fase */}
        <div className="space-y-8">
          {FLOW_KEYS.map(({ key, label, description, placeholder, phase }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{phase}</span>
                <h3 className="font-semibold text-gray-900 mt-0.5">{label}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              <div className="p-6">
                <textarea
                  value={flow_templates[key] ?? ''}
                  onChange={(e) => setTemplate(key, e.target.value)}
                  placeholder={placeholder}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Salvando...' : 'Salvar todos os textos'}
          </button>
          <Link
            href="/admin/whatsapp"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Voltar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FluxoPage() {
  return (
    <AdminProtectedRoute>
      <FluxoContent />
    </AdminProtectedRoute>
  )
}
