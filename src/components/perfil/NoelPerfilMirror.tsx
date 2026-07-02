'use client'

/**
 * NoelPerfilMirror — O que o Noel sabe sobre o seu negócio.
 *
 * Substitui o wizard pesado por uma tela de espelho:
 * - Mostra os campos que o Noel usa para orientar o usuário
 * - Verde/amarelo/vermelho conforme completude
 * - Edição inline em cada campo
 * - "O Noel preenche conforme você conversa" quando vazio
 *
 * Os dados vêm de GET /api/ylada/noel-profile e são salvos via
 * PATCH /api/ylada/noel-profile.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FaseNegocio = 'iniciante' | 'em_crescimento' | 'estabilizado' | 'escalando'

interface PerfilNoel {
  dor_principal: string | null
  prioridade_atual: string | null
  fase_negocio: FaseNegocio | null
  ticket_medio: number | null
  canais_principais: string[]
  metas_principais: string | null
}

const FASE_LABELS: Record<FaseNegocio, string> = {
  iniciante: 'Iniciante',
  em_crescimento: 'Em crescimento',
  estabilizado: 'Estabilizado',
  escalando: 'Escalando',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** 🟢 🟡 🔴 */
function statusDoCampo(valor: string | number | string[] | null): 'green' | 'yellow' | 'red' {
  if (valor === null || valor === undefined) return 'red'
  if (Array.isArray(valor)) return valor.length > 0 ? 'green' : 'red'
  if (typeof valor === 'number') return valor > 0 ? 'green' : 'red'
  return String(valor).trim().length > 2 ? 'green' : 'yellow'
}

function Dot({ status }: { status: 'green' | 'yellow' | 'red'; className?: string }) {
  const cls = {
    green: 'bg-emerald-400',
    yellow: 'bg-amber-400',
    red: 'bg-red-400',
  }[status]
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1.5 ${cls}`} />
}

// ─── Campos com edição inline ─────────────────────────────────────────────────

interface FieldRowProps {
  label: string
  value: string | null
  placeholder: string
  onSave: (v: string) => Promise<void>
  multiline?: boolean
}

function FieldRow({ label, value, placeholder, onSave, multiline }: FieldRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (draft === (value ?? '')) { setEditing(false); return }
    setSaving(true)
    await onSave(draft)
    setSaving(false)
    setEditing(false)
  }

  const status = statusDoCampo(value)

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Dot status={status} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        {editing ? (
          <div className="space-y-2">
            {multiline ? (
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full text-sm rounded-lg border border-sky-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
              />
            ) : (
              <input
                autoFocus
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                className="w-full text-sm rounded-lg border border-sky-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs font-medium rounded-lg bg-sky-600 text-white px-3 py-1.5 hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
              <button
                onClick={() => { setDraft(value ?? ''); setEditing(false) }}
                className="text-xs rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full text-left group"
          >
            {value ? (
              <span className="text-sm text-gray-900 group-hover:text-sky-700">{value}</span>
            ) : (
              <span className="text-sm text-gray-400 italic group-hover:text-sky-500">
                {placeholder} — toque para preencher
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Campo de fase (select) ───────────────────────────────────────────────────

function FaseField({ value, onSave }: { value: FaseNegocio | null; onSave: (v: FaseNegocio) => Promise<void> }) {
  const [saving, setSaving] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as FaseNegocio
    setSaving(true)
    await onSave(v)
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <Dot status={statusDoCampo(value)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-1">Fase do negócio</p>
        <select
          value={value ?? ''}
          onChange={handleChange}
          disabled={saving}
          className="text-sm rounded-lg border border-gray-200 px-3 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
        >
          <option value="">Não informado</option>
          {(Object.entries(FASE_LABELS) as [FaseNegocio, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ─── Campo de ticket (número) ─────────────────────────────────────────────────

function TicketField({ value, onSave }: { value: number | null; onSave: (v: number) => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ? String(value) : '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const n = Number(draft.replace(/\D/g, ''))
    if (!n || n === value) { setEditing(false); return }
    setSaving(true)
    await onSave(n)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <Dot status={statusDoCampo(value)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-0.5">Ticket médio (R$)</p>
        {editing ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">R$</span>
            <input
              autoFocus
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              className="w-32 text-sm rounded-lg border border-sky-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium rounded-lg bg-sky-600 text-white px-3 py-1.5 hover:bg-sky-700"
            >
              {saving ? '…' : 'OK'}
            </button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-left group">
            {value ? (
              <span className="text-sm text-gray-900 group-hover:text-sky-700">
                R$ {value.toLocaleString('pt-BR')}
              </span>
            ) : (
              <span className="text-sm text-gray-400 italic group-hover:text-sky-500">
                Não informado — toque para preencher
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface NoelPerfilMirrorProps {
  areaCodigo?: string
  areaLabel?: string
}

export default function NoelPerfilMirror({
  areaCodigo = 'ylada',
  areaLabel = 'YLADA',
}: NoelPerfilMirrorProps) {
  const [perfil, setPerfil] = useState<PerfilNoel | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // ── Busca o perfil ──────────────────────────────────────────────────────────
  const fetchPerfil = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ylada/noel-profile')
      if (!res.ok) throw new Error('Erro ao carregar perfil')
      const data = await res.json()
      setPerfil(data.profile)
    } catch {
      setErro('Não foi possível carregar o perfil.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPerfil() }, [fetchPerfil])

  // ── Salva um campo ──────────────────────────────────────────────────────────
  const salvar = async (fields: Partial<PerfilNoel>) => {
    const res = await fetch('/api/ylada/noel-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    if (!res.ok) throw new Error('Erro ao salvar')
    setPerfil((prev) => prev ? { ...prev, ...fields } : prev)
  }

  // ── Helpers de save por campo ───────────────────────────────────────────────
  const salvarTexto = (campo: keyof PerfilNoel) => async (valor: string) => {
    await salvar({ [campo]: valor || null } as Partial<PerfilNoel>)
  }

  // ── Contagem de campos preenchidos ──────────────────────────────────────────
  const CAMPOS_TOTAL = 6
  const camposPreenchidos = perfil
    ? [
        perfil.dor_principal,
        perfil.prioridade_atual,
        perfil.fase_negocio,
        perfil.ticket_medio,
        perfil.canais_principais?.length ? perfil.canais_principais : null,
        perfil.metas_principais,
      ].filter(Boolean).length
    : 0
  const percentual = Math.round((camposPreenchidos / CAMPOS_TOTAL) * 100)

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-xl">

        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Meu negócio</h1>
          <p className="text-sm text-gray-500">
            O Noel usa essas informações para te orientar melhor. Ele vai preenchendo conforme vocês conversam — você pode corrigir qualquer campo aqui.
          </p>
        </div>

        {/* Barra de completude */}
        {!loading && perfil && (
          <div className="mb-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-700">
                {camposPreenchidos === CAMPOS_TOTAL
                  ? '✅ Perfil completo — o Noel tem tudo que precisa.'
                  : `${camposPreenchidos} de ${CAMPOS_TOTAL} campos preenchidos`}
              </p>
              <span className="text-xs font-semibold text-sky-700">{percentual}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${percentual}%` }}
              />
            </div>
            {camposPreenchidos < 3 && (
              <p className="text-xs text-gray-500 mt-2">
                💬 Quanto mais o Noel sabe, mais certeiros ficam os diagnósticos e links que ele gera.{' '}
                <Link href="/pt/home" className="text-sky-600 underline">Conversar com o Noel</Link>
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {erro}{' '}
            <button onClick={fetchPerfil} className="underline">Tentar novamente</button>
          </div>
        )}

        {/* Campos */}
        {perfil && !loading && (
          <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-100 px-4">
            <FieldRow
              label="Maior dificuldade atual"
              value={perfil.dor_principal}
              placeholder="Ex: clientes que somem após a consulta"
              onSave={salvarTexto('dor_principal')}
            />
            <FieldRow
              label="Foco principal agora"
              value={perfil.prioridade_atual}
              placeholder="Ex: atrair mais clientes qualificados"
              onSave={salvarTexto('prioridade_atual')}
            />
            <FaseField
              value={perfil.fase_negocio}
              onSave={async (v) => salvar({ fase_negocio: v })}
            />
            <TicketField
              value={perfil.ticket_medio}
              onSave={async (v) => salvar({ ticket_medio: v })}
            />
            <FieldRow
              label="Canais principais"
              value={perfil.canais_principais?.join(', ') ?? null}
              placeholder="Ex: Instagram, WhatsApp, indicação"
              onSave={async (v) => salvar({
                canais_principais: v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [],
              })}
            />
            <FieldRow
              label="Metas principais"
              value={perfil.metas_principais}
              placeholder="Ex: fechar 3 contratos novos este mês"
              onSave={salvarTexto('metas_principais')}
              multiline
            />
          </div>
        )}

        {/* Legenda */}
        <div className="mt-4 flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Preenchido</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Parcial</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Vazio</span>
        </div>
      </div>
    </YladaAreaShell>
  )
}
