'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConsultoriaKindEditor } from '@/components/admin/consultoria/ConsultoriaKindEditor'
import {
  buildEsteticaConsultoriaResponderUrl,
  esteticaConsultSegmentLabel,
  type YladaEsteticaConsultClientRow,
  type YladaEsteticaConsultancyFormResponseRow,
  type YladaEsteticaConsultancyMaterialRow,
  type YladaEsteticaConsultancyShareLinkRow,
} from '@/lib/estetica-consultoria'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE,
  TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE,
  buildDiagnosticoCapilarV1Fields,
  buildDiagnosticoCorporalV1Fields,
  buildPreAvaliacaoCapilarClienteV1Fields,
  buildPreDiagnosticoCapilarV1Fields,
  buildPreDiagnosticoCorporalV1Fields,
} from '@/lib/estetica-consultoria-form-templates'
import { consultoriaCsvFilenameBase, consultoriaFormResponsesToCsv } from '@/lib/consultoria-form-csv'
import {
  consultoriaAnswersToDisplayRows,
  groupConsultoriaAnswerRowsBySection,
  type ConsultoriaAnswerRow,
} from '@/lib/consultoria-form-display'
import {
  consultoriaKindLabel,
  defaultContentForKind,
  getConsultoriaFormFields,
  type ConsultoriaFormField,
  type ProLideresConsultoriaMaterialKind,
} from '@/lib/pro-lideres-consultoria'

type TabKey = 'editar' | 'execucao' | 'links' | 'respostas'

type DiagnosticCorporalLink = YladaEsteticaConsultancyShareLinkRow & { responder_url?: string }

type DiagnosticCorporalBundle = {
  client: { id: string; business_name: string; segment: string }
  material: YladaEsteticaConsultancyMaterialRow
  links: DiagnosticCorporalLink[]
  responses: YladaEsteticaConsultancyFormResponseRow[]
}

type CoachingNoteRow = {
  id: string
  created_at: string
  client_id: string
  note_kind: string
  body: string
  created_by_user_id: string | null
}

const NOTE_KIND_LABEL: Record<string, string> = {
  acompanhamento: 'Acompanhamento',
  observacao: 'Observação',
  recomendacao: 'Recomendação',
  evolucao: 'Evolução',
}

const ESTETICA_MODELO_CAMPOS_CORPORAL = buildDiagnosticoCorporalV1Fields()
const ESTETICA_MODELO_CAMPOS_CAPILAR = buildDiagnosticoCapilarV1Fields()
const ESTETICA_MODELO_CAMPOS_PRE_CORPORAL = buildPreDiagnosticoCorporalV1Fields()
const ESTETICA_MODELO_CAMPOS_PRE_CAPILAR = buildPreDiagnosticoCapilarV1Fields()
const ESTETICA_MODELO_CAMPOS_PRE_AVALIACAO_CLIENTE_CAPILAR = buildPreAvaliacaoCapilarClienteV1Fields()

type EsteticaFormModelKind =
  | 'corporal'
  | 'capilar'
  | 'pre_corporal'
  | 'pre_capilar'
  | 'pre_avaliacao_cliente_capilar'

function emptyMaterialRow(clientId: string, kind: ProLideresConsultoriaMaterialKind): YladaEsteticaConsultancyMaterialRow {
  const now = new Date().toISOString()
  return {
    id: '',
    client_id: clientId,
    template_key: null,
    created_at: now,
    updated_at: now,
    title: '',
    material_kind: kind,
    description: null,
    content: defaultContentForKind(kind),
    sort_order: 0,
    is_published: false,
    created_by_user_id: null,
  }
}

type ConsultoriaAdminResponseCardProps = {
  tone: 'rose' | 'gray' | 'sky'
  submittedAt: string
  respondentName?: string | null
  respondentEmail?: string | null
  rows: ConsultoriaAnswerRow[]
  rawAnswers: unknown
}

function ConsultoriaAdminResponseCard({
  tone,
  submittedAt,
  respondentName,
  respondentEmail,
  rows,
  rawAnswers,
}: ConsultoriaAdminResponseCardProps) {
  const sections = useMemo(() => groupConsultoriaAnswerRowsBySection(rows), [rows])
  const shell =
    tone === 'rose'
      ? 'border-rose-200/90 bg-white shadow-sm'
      : tone === 'sky'
        ? 'border-sky-200/90 bg-white shadow-sm'
        : 'border-gray-200 bg-white shadow-sm'
  const accentBar = tone === 'rose' ? 'bg-rose-600' : tone === 'sky' ? 'bg-sky-600' : 'bg-gray-700'
  const blockTitle = tone === 'rose' ? 'text-rose-900/55' : tone === 'sky' ? 'text-sky-900/55' : 'text-gray-500'
  const qTone = tone === 'rose' ? 'text-rose-950/90' : tone === 'sky' ? 'text-sky-950/90' : 'text-gray-800'
  const aTone =
    tone === 'rose'
      ? 'border-rose-100/90 bg-rose-50/40 text-gray-900'
      : tone === 'sky'
        ? 'border-sky-100/90 bg-sky-50/40 text-gray-900'
        : 'border-gray-200/90 bg-gray-50 text-gray-900'

  return (
    <article className={`overflow-hidden rounded-xl border ${shell}`}>
      <div className={`h-1 w-full ${accentBar}`} aria-hidden />
      <div className="p-4">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] pb-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Envio</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(submittedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <div className="min-w-0 max-w-full text-right text-xs sm:max-w-[55%]">
            {respondentName ? <p className="font-semibold text-gray-900">{respondentName}</p> : null}
            {respondentEmail ? (
              <p className="break-all text-gray-600" title={respondentEmail ?? undefined}>
                {respondentEmail}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mt-4 space-y-6">
          {sections.map((sec, idx) => (
            <section key={`${sec.sectionKey}-${idx}`}>
              <h5 className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider ${blockTitle}`}>
                {sec.sectionTitle}
              </h5>
              <dl className="space-y-3">
                {sec.rows.map((row) => (
                  <div
                    key={row.fieldId}
                    className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-start sm:gap-x-4"
                  >
                    <dt className={`text-xs font-semibold leading-snug sm:pt-1.5 ${qTone}`}>{row.label}</dt>
                    <dd
                      className={`rounded-lg border px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${aTone}`}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <details className="mt-4 border-t border-black/[0.06] pt-3">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">JSON bruto (avançado)</summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-gray-900/[0.04] p-2.5 text-[11px] text-gray-600">
            {JSON.stringify(rawAnswers, null, 2)}
          </pre>
        </details>
      </div>
    </article>
  )
}

function describeConsultoriaModelField(f: ConsultoriaFormField): string {
  const typePt =
    f.type === 'textarea'
      ? 'Texto longo'
      : f.type === 'select'
        ? 'Escolha única (lista)'
        : f.type === 'checkbox_group'
          ? 'Várias opções (marque as que aplicam)'
          : 'Texto curto'
  const lines: string[] = [
    f.required ? 'Obrigatório' : 'Opcional',
    `ID interno: ${f.id}`,
    `Tipo: ${typePt}`,
  ]
  if (f.options?.length) {
    lines.push('')
    lines.push(`Opções (${f.options.length}):`)
    for (const o of f.options) {
      lines.push(`· ${o}`)
    }
  }
  return lines.join('\n')
}

function preAnswerString(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

function preInstagramHref(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  if (/^https?:\/\//i.test(t)) return t
  const h = t.replace(/^@/, '').replace(/^\s+|\s+$/g, '')
  if (!h) return ''
  return `https://www.instagram.com/${h.replace(/^instagram\.com\//i, '')}`
}

type PreLeituraVariant = 'corporal' | 'capilar'

function PreDiagnosticoLeituraRapidaCard({
  variant,
  submittedAt,
  answers,
}: {
  variant: PreLeituraVariant
  submittedAt: string
  answers: Record<string, unknown>
}) {
  const a = (k: string) => preAnswerString(answers[k]).trim()
  const shell =
    variant === 'corporal'
      ? 'border-rose-200/90 bg-gradient-to-br from-rose-50/90 via-white to-white'
      : 'border-sky-200/90 bg-gradient-to-br from-sky-50/90 via-white to-white'
  const labelClass = variant === 'corporal' ? 'text-rose-800/70' : 'text-sky-800/70'
  const valueClass = variant === 'corporal' ? 'text-rose-950' : 'text-sky-950'
  const chip =
    variant === 'corporal' ? 'bg-rose-100/90 text-rose-950' : 'bg-sky-100/90 text-sky-950'
  const dor = a('pre_dor_principal')
  const queixaKey = variant === 'corporal' ? 'pre_queixa_corporal' : 'pre_queixa_capilar'
  const queixaOutrosKey = variant === 'corporal' ? 'pre_queixa_corporal_outros' : 'pre_queixa_capilar_outros'
  const queixaRaw = a(queixaKey)
  const queixaOutros = a(queixaOutrosKey)
  const queixa =
    queixaRaw.includes('Outros') && queixaOutros ? `${queixaRaw} — ${queixaOutros}` : queixaRaw
  const ig = a('instagram')
  const wa = a('whatsapp')
  const ddi = a('whatsapp_ddi')
  const igHref = preInstagramHref(ig)

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${shell}`}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-black/[0.06] pb-2">
        <h4 className="text-sm font-bold tracking-tight text-gray-900">Leitura rápida — último pré</h4>
        <p className="text-[11px] text-gray-500">
          Enviado em{' '}
          {new Date(submittedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      </div>
      {dor ? (
        <p className={`mb-4 rounded-xl px-3 py-2.5 text-sm font-semibold leading-snug ${chip}`}>
          <span className="mr-1 font-normal text-gray-600">O que mais incomoda: </span>
          {dor}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Quem</p>
          <p className={`mt-0.5 text-sm font-medium ${valueClass}`}>{a('nome_proprietaria') || '—'}</p>
          <p className="text-xs text-gray-600">{a('nome_clinica') || '—'}</p>
        </div>
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Cidade</p>
          <p className={`mt-0.5 text-sm ${valueClass}`}>{a('cidade_estado') || '—'}</p>
        </div>
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>WhatsApp</p>
          <p className="mt-0.5 font-mono text-sm text-gray-900">
            {!ddi && !wa ? (
              '—'
            ) : (
              <>
                {ddi ? (
                  <span className="font-semibold text-gray-800">
                    {ddi.replace(/\s+—\s+.+$/, '').trim()}
                  </span>
                ) : null}
                {ddi && wa ? <span className="mx-1 text-gray-400">·</span> : null}
                {wa ? <span>{wa}</span> : null}
              </>
            )}
          </p>
        </div>
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Instagram</p>
          {ig ? (
            <a
              href={igHref}
              className="mt-0.5 block text-sm font-medium text-blue-700 break-all hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {ig}
            </a>
          ) : (
            <p className="mt-0.5 text-sm text-gray-500">—</p>
          )}
        </div>
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {(
          [
            ['Agenda hoje', a('pre_agenda')],
            ['Clientes voltam', a('pre_retorno')],
            ['Dificuldade em cobrar', a('pre_cobrar_preco')],
            [variant === 'corporal' ? 'Buscas no corporal' : 'Queixa capilar', queixa],
          ] as const
        ).map(([label, val]) => (
          <div key={label} className="rounded-lg border border-black/[0.05] bg-white/60 px-2.5 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm text-gray-900">{val || '—'}</p>
          </div>
        ))}
        <div className="rounded-lg border border-black/[0.05] bg-white/60 px-2.5 py-2 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Canais de aquisição</p>
          <p className="mt-0.5 whitespace-pre-wrap text-sm text-gray-900">{a('pre_canais') || '—'}</p>
        </div>
        <div className="rounded-lg border border-black/[0.05] bg-white/60 px-2.5 py-2 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Aberta a ajustar estratégia (30 dias)
          </p>
          <p className="mt-0.5 text-sm text-gray-900">{a('pre_aberta_estrategia') || '—'}</p>
        </div>
        <div className="rounded-lg border border-black/[0.05] bg-white/60 px-2.5 py-2 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Interesse em plano</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">{a('pre_interesse_plano') || '—'}</p>
        </div>
      </div>
    </div>
  )
}

function EsteticaConsultoriaFormModelDialog({
  open,
  variant,
  onClose,
}: {
  open: boolean
  variant: EsteticaFormModelKind | null
  onClose: () => void
}) {
  const fields = useMemo(() => {
    if (variant === 'corporal') return ESTETICA_MODELO_CAMPOS_CORPORAL
    if (variant === 'capilar') return ESTETICA_MODELO_CAMPOS_CAPILAR
    if (variant === 'pre_corporal') return ESTETICA_MODELO_CAMPOS_PRE_CORPORAL
    if (variant === 'pre_capilar') return ESTETICA_MODELO_CAMPOS_PRE_CAPILAR
    if (variant === 'pre_avaliacao_cliente_capilar') return ESTETICA_MODELO_CAMPOS_PRE_AVALIACAO_CLIENTE_CAPILAR
    return []
  }, [variant])

  const sections = useMemo(() => {
    const previewRows: ConsultoriaAnswerRow[] = fields.map((f) => ({
      fieldId: f.id,
      label: f.label,
      value: describeConsultoriaModelField(f),
    }))
    return groupConsultoriaAnswerRowsBySection(previewRows)
  }, [fields])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !variant) return null

  const isCorporal = variant === 'corporal' || variant === 'pre_corporal'
  const isPre =
    variant === 'pre_corporal' || variant === 'pre_capilar' || variant === 'pre_avaliacao_cliente_capilar'
  const title =
    variant === 'corporal'
      ? TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE
      : variant === 'capilar'
        ? TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE
        : variant === 'pre_corporal'
          ? TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE
          : variant === 'pre_avaliacao_cliente_capilar'
            ? TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE
            : TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE
  const bar = isCorporal ? 'bg-rose-600' : 'bg-sky-600'
  const secTitle = isCorporal ? 'text-rose-900/60' : 'text-sky-900/60'
  const qClass = isCorporal ? 'text-rose-950/90' : 'text-sky-950/90'
  const boxClass = isCorporal
    ? 'border-rose-100/90 bg-rose-50/50 text-gray-900'
    : 'border-sky-100/90 bg-sky-50/50 text-gray-900'

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estetica-form-model-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 w-full shrink-0 ${bar}`} aria-hidden />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
          <div className="min-w-0 pr-2">
            <h2 id="estetica-form-model-title" className="text-base font-semibold leading-snug text-gray-900">
              {title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Vista prévia do <strong>modelo global</strong> ({fields.length} campos)
              {isPre
                ? variant === 'pre_avaliacao_cliente_capilar'
                  ? ' — para cliente final (captação)'
                  : ' — formulário curto antes da reunião'
                : ''}
              . O texto e as opções vivem no código (
              <code className="rounded bg-gray-100 px-1 text-[11px]">estetica-consultoria-form-templates.ts</code>) e no
              material global no Supabase; alterar perguntas implica mudança de código e/ou migração.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <section key={`${sec.sectionKey}-${idx}`}>
                <h3 className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider ${secTitle}`}>
                  {sec.sectionTitle}
                </h3>
                <dl className="space-y-3">
                  {sec.rows.map((row) => (
                    <div
                      key={row.fieldId}
                      className="grid gap-1.5 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:items-start sm:gap-x-4"
                    >
                      <dt className={`text-xs font-semibold leading-snug sm:pt-1.5 ${qClass}`}>{row.label}</dt>
                      <dd
                        className={`rounded-lg border px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${boxClass}`}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function clientFormDefaults(c: YladaEsteticaConsultClientRow) {
  return {
    business_name: c.business_name,
    segment: c.segment,
    contact_name: c.contact_name ?? '',
    contact_email: c.contact_email ?? '',
    phone: c.phone ?? '',
    leader_tenant_id: c.leader_tenant_id ?? '',
    consulting_paid_amount:
      c.consulting_paid_amount == null ? '' : String(c.consulting_paid_amount).replace('.', ','),
    payment_currency: c.payment_currency || 'BRL',
    last_payment_at: c.last_payment_at ? c.last_payment_at.slice(0, 16) : '',
    is_annual_plan: c.is_annual_plan,
    annual_plan_start: c.annual_plan_start ?? '',
    annual_plan_end: c.annual_plan_end ?? '',
    access_valid_until: c.access_valid_until ?? '',
    admin_notes: c.admin_notes ?? '',
  }
}

export default function EsteticaConsultoriaAdminClient() {
  const searchParams = useSearchParams()
  const segmentoFiltro = useMemo(() => {
    const raw = searchParams.get('segmento')?.trim().toLowerCase()
    if (raw === 'capilar' || raw === 'corporal') return raw
    return null
  }, [searchParams])
  const clienteParam = useMemo(() => searchParams.get('cliente')?.trim() ?? '', [searchParams])
  const deepLinkClienteAplicado = useRef<string>('')

  const [clients, setClients] = useState<YladaEsteticaConsultClientRow[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<YladaEsteticaConsultClientRow | null>(null)
  const [clientForm, setClientForm] = useState<ReturnType<typeof clientFormDefaults> | null>(null)
  const [savingClient, setSavingClient] = useState(false)

  const [newBusinessName, setNewBusinessName] = useState('')
  const [newSegment, setNewSegment] = useState<'capilar' | 'corporal' | 'ambos'>('capilar')
  const [creatingClient, setCreatingClient] = useState(false)

  const [items, setItems] = useState<YladaEsteticaConsultancyMaterialRow[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<YladaEsteticaConsultancyMaterialRow | null>(null)
  const [tab, setTab] = useState<TabKey>('editar')
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [kindFilter, setKindFilter] = useState<string>('all')

  const [shareLinks, setShareLinks] = useState<YladaEsteticaConsultancyShareLinkRow[]>([])
  const [responses, setResponses] = useState<YladaEsteticaConsultancyFormResponseRow[]>([])
  const [auxLoading, setAuxLoading] = useState(false)

  const [coachingNotes, setCoachingNotes] = useState<CoachingNoteRow[]>([])
  const [coachingLoading, setCoachingLoading] = useState(false)
  const [newNoteBody, setNewNoteBody] = useState('')
  const [newNoteKind, setNewNoteKind] = useState<string>('acompanhamento')
  const [savingNote, setSavingNote] = useState(false)

  const [diagnosticCorporal, setDiagnosticCorporal] = useState<DiagnosticCorporalBundle | null>(null)
  const [diagnosticCapilar, setDiagnosticCapilar] = useState<DiagnosticCorporalBundle | null>(null)
  const [diagnosticCorporalLoading, setDiagnosticCorporalLoading] = useState(false)
  const [diagnosticCapilarLoading, setDiagnosticCapilarLoading] = useState(false)
  const [diagnosticCorporalLinkLoading, setDiagnosticCorporalLinkLoading] = useState(false)
  const [diagnosticCapilarLinkLoading, setDiagnosticCapilarLinkLoading] = useState(false)
  const [diagnosticPreCorporal, setDiagnosticPreCorporal] = useState<DiagnosticCorporalBundle | null>(null)
  const [diagnosticPreCapilar, setDiagnosticPreCapilar] = useState<DiagnosticCorporalBundle | null>(null)
  const [diagnosticPreCorporalLoading, setDiagnosticPreCorporalLoading] = useState(false)
  const [diagnosticPreCapilarLoading, setDiagnosticPreCapilarLoading] = useState(false)
  const [diagnosticPreCorporalLinkLoading, setDiagnosticPreCorporalLinkLoading] = useState(false)
  const [diagnosticPreCapilarLinkLoading, setDiagnosticPreCapilarLinkLoading] = useState(false)
  const [diagnosticPreAvaliacaoClienteCapilar, setDiagnosticPreAvaliacaoClienteCapilar] =
    useState<DiagnosticCorporalBundle | null>(null)
  const [diagnosticPreAvaliacaoClienteCapilarLoading, setDiagnosticPreAvaliacaoClienteCapilarLoading] =
    useState(false)
  const [diagnosticPreAvaliacaoClienteCapilarLinkLoading, setDiagnosticPreAvaliacaoClienteCapilarLinkLoading] =
    useState(false)
  const [formModelDialog, setFormModelDialog] = useState<EsteticaFormModelKind | null>(null)

  type OpenPreLinkPack = { token: string; responder_url: string }
  const [openPreLinks, setOpenPreLinks] = useState<{
    corporal: OpenPreLinkPack | null
    capilar: OpenPreLinkPack | null
  } | null>(null)
  const [openPreLinksLoading, setOpenPreLinksLoading] = useState(true)
  const [openPreLinksError, setOpenPreLinksError] = useState<string | null>(null)

  const closeFormModelDialog = useCallback(() => setFormModelDialog(null), [])

  const loadClients = useCallback(async (search?: string) => {
    setClientsLoading(true)
    setError(null)
    const q = (search ?? '').trim()
    const qs = q ? `?q=${encodeURIComponent(q)}` : ''
    const res = await fetch(`/api/admin/estetica-consultoria/clients${qs}`, { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao carregar clientes.')
      setClients([])
      setClientsLoading(false)
      return
    }
    setClients(((data as { items?: YladaEsteticaConsultClientRow[] }).items ?? []) as YladaEsteticaConsultClientRow[])
    setClientsLoading(false)
  }, [])

  useEffect(() => {
    void loadClients()
  }, [loadClients])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setOpenPreLinksLoading(true)
      const res = await fetch('/api/admin/estetica-consultoria/open-pre-links', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (cancelled) return
      if (res.ok) {
        setOpenPreLinksError(null)
        setOpenPreLinks({
          corporal: (data as { corporal?: OpenPreLinkPack | null }).corporal ?? null,
          capilar: (data as { capilar?: OpenPreLinkPack | null }).capilar ?? null,
        })
      } else {
        setOpenPreLinks(null)
        setOpenPreLinksError(
          (data as { error?: string; hint?: string }).error ??
            (data as { hint?: string }).hint ??
            'Não foi possível carregar os links públicos de pré.'
        )
      }
      setOpenPreLinksLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (segmentoFiltro === 'capilar') setNewSegment('capilar')
    else if (segmentoFiltro === 'corporal') setNewSegment('corporal')
  }, [segmentoFiltro])

  const clientsVisiveis = useMemo(() => {
    if (!segmentoFiltro) return clients
    return clients.filter((c) => {
      if (segmentoFiltro === 'capilar') return c.segment === 'capilar' || c.segment === 'ambos'
      return c.segment === 'corporal' || c.segment === 'ambos'
    })
  }, [clients, segmentoFiltro])

  useEffect(() => {
    if (!selectedClient) return
    if (!clientsVisiveis.some((c) => c.id === selectedClient.id)) {
      setSelectedClient(null)
      setClientForm(null)
      setSelected(null)
    }
  }, [clientsVisiveis, selectedClient])

  const loadMaterials = useCallback(async (clientId: string) => {
    setLoadingMaterials(true)
    setError(null)
    const qs = kindFilter !== 'all' ? `?kind=${encodeURIComponent(kindFilter)}` : ''
    const res = await fetch(
      `/api/admin/estetica-consultoria/clients/${encodeURIComponent(clientId)}/materials${qs}`,
      { credentials: 'include' }
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao carregar materiais.')
      setItems([])
      setLoadingMaterials(false)
      return
    }
    setItems(((data as { items?: YladaEsteticaConsultancyMaterialRow[] }).items ?? []) as YladaEsteticaConsultancyMaterialRow[])
    setLoadingMaterials(false)
  }, [kindFilter])

  useEffect(() => {
    if (!selectedClient?.id) {
      setItems([])
      setSelected(null)
      return
    }
    void loadMaterials(selectedClient.id)
  }, [selectedClient?.id, loadMaterials])

  const loadCoachingNotes = useCallback(async (clientId: string) => {
    setCoachingLoading(true)
    try {
      const res = await fetch(`/api/admin/estetica-consultoria/clients/${encodeURIComponent(clientId)}/notes`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      setCoachingNotes(
        res.ok ? ((data as { items?: CoachingNoteRow[] }).items ?? []) as CoachingNoteRow[] : []
      )
    } finally {
      setCoachingLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selectedClient?.id) {
      setCoachingNotes([])
      setNewNoteBody('')
      return
    }
    void loadCoachingNotes(selectedClient.id)
  }, [selectedClient?.id, loadCoachingNotes])

  const loadDiagnosticCorporal = useCallback(async () => {
    if (!selectedClient?.id) return
    if (selectedClient.segment !== 'corporal' && selectedClient.segment !== 'ambos') {
      setDiagnosticCorporal(null)
      return
    }
    setDiagnosticCorporalLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/diagnostic-corporal`,
        { credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDiagnosticCorporal(null)
        setError((data as { error?: string }).error || 'Erro ao carregar diagnóstico corporal.')
        return
      }
      setDiagnosticCorporal(data as DiagnosticCorporalBundle)
    } finally {
      setDiagnosticCorporalLoading(false)
    }
  }, [selectedClient])

  const loadDiagnosticCapilar = useCallback(async () => {
    if (!selectedClient?.id) return
    if (selectedClient.segment !== 'capilar' && selectedClient.segment !== 'ambos') {
      setDiagnosticCapilar(null)
      return
    }
    setDiagnosticCapilarLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/diagnostic-capilar`,
        { credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDiagnosticCapilar(null)
        setError((data as { error?: string }).error || 'Erro ao carregar diagnóstico capilar.')
        return
      }
      setDiagnosticCapilar(data as DiagnosticCorporalBundle)
    } finally {
      setDiagnosticCapilarLoading(false)
    }
  }, [selectedClient])

  useEffect(() => {
    void loadDiagnosticCorporal()
  }, [loadDiagnosticCorporal])

  useEffect(() => {
    void loadDiagnosticCapilar()
  }, [loadDiagnosticCapilar])

  const loadDiagnosticPreCorporal = useCallback(async () => {
    if (!selectedClient?.id) return
    if (selectedClient.segment !== 'corporal' && selectedClient.segment !== 'ambos') {
      setDiagnosticPreCorporal(null)
      return
    }
    setDiagnosticPreCorporalLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-diagnostico-corporal`,
        { credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDiagnosticPreCorporal(null)
        setError((data as { error?: string }).error || 'Erro ao carregar pré-diagnóstico corporal.')
        return
      }
      setDiagnosticPreCorporal(data as DiagnosticCorporalBundle)
    } finally {
      setDiagnosticPreCorporalLoading(false)
    }
  }, [selectedClient])

  const loadDiagnosticPreCapilar = useCallback(async () => {
    if (!selectedClient?.id) return
    if (selectedClient.segment !== 'capilar' && selectedClient.segment !== 'ambos') {
      setDiagnosticPreCapilar(null)
      return
    }
    setDiagnosticPreCapilarLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-diagnostico-capilar`,
        { credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDiagnosticPreCapilar(null)
        setError((data as { error?: string }).error || 'Erro ao carregar pré-diagnóstico capilar.')
        return
      }
      setDiagnosticPreCapilar(data as DiagnosticCorporalBundle)
    } finally {
      setDiagnosticPreCapilarLoading(false)
    }
  }, [selectedClient])

  useEffect(() => {
    void loadDiagnosticPreCorporal()
  }, [loadDiagnosticPreCorporal])

  useEffect(() => {
    void loadDiagnosticPreCapilar()
  }, [loadDiagnosticPreCapilar])

  const loadDiagnosticPreAvaliacaoClienteCapilar = useCallback(async () => {
    if (!selectedClient?.id) return
    if (selectedClient.segment !== 'capilar' && selectedClient.segment !== 'ambos') {
      setDiagnosticPreAvaliacaoClienteCapilar(null)
      return
    }
    setDiagnosticPreAvaliacaoClienteCapilarLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-avaliacao-capilar-cliente`,
        { credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDiagnosticPreAvaliacaoClienteCapilar(null)
        setError((data as { error?: string }).error || 'Erro ao carregar pré-avaliação cliente capilar.')
        return
      }
      setDiagnosticPreAvaliacaoClienteCapilar(data as DiagnosticCorporalBundle)
    } finally {
      setDiagnosticPreAvaliacaoClienteCapilarLoading(false)
    }
  }, [selectedClient])

  useEffect(() => {
    void loadDiagnosticPreAvaliacaoClienteCapilar()
  }, [loadDiagnosticPreAvaliacaoClienteCapilar])

  const itemsDisplayed = useMemo(() => {
    if (!selectedClient?.id) return items
    const hasCorp = Boolean(diagnosticCorporal?.material?.template_key)
    const hasCap = Boolean(diagnosticCapilar?.material?.template_key)
    if (!hasCorp && !hasCap) return items
    return items.filter((m) => {
      const dupCorp =
        hasCorp &&
        m.title === TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE &&
        m.client_id === selectedClient.id &&
        !m.template_key
      const dupCap =
        hasCap &&
        m.title === TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE &&
        m.client_id === selectedClient.id &&
        !m.template_key
      return !(dupCorp || dupCap)
    })
  }, [items, diagnosticCorporal?.material?.template_key, diagnosticCapilar?.material?.template_key, selectedClient?.id])

  const diagnosticCorporalFieldDefs = useMemo(() => {
    const c =
      diagnosticCorporal?.material?.content && typeof diagnosticCorporal.material.content === 'object'
        ? diagnosticCorporal.material.content
        : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [diagnosticCorporal?.material?.content])

  const diagnosticCapilarFieldDefs = useMemo(() => {
    const c =
      diagnosticCapilar?.material?.content && typeof diagnosticCapilar.material.content === 'object'
        ? diagnosticCapilar.material.content
        : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [diagnosticCapilar?.material?.content])

  const diagnosticPreCorporalFieldDefs = useMemo(() => {
    const c =
      diagnosticPreCorporal?.material?.content && typeof diagnosticPreCorporal.material.content === 'object'
        ? diagnosticPreCorporal.material.content
        : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [diagnosticPreCorporal?.material?.content])

  const diagnosticPreCapilarFieldDefs = useMemo(() => {
    const c =
      diagnosticPreCapilar?.material?.content && typeof diagnosticPreCapilar.material.content === 'object'
        ? diagnosticPreCapilar.material.content
        : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [diagnosticPreCapilar?.material?.content])

  const diagnosticPreAvaliacaoClienteCapilarFieldDefs = useMemo(() => {
    const c =
      diagnosticPreAvaliacaoClienteCapilar?.material?.content &&
      typeof diagnosticPreAvaliacaoClienteCapilar.material.content === 'object'
        ? diagnosticPreAvaliacaoClienteCapilar.material.content
        : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [diagnosticPreAvaliacaoClienteCapilar?.material?.content])

  const latestPreCorporalResponse = useMemo(() => {
    const list = diagnosticPreCorporal?.responses ?? []
    if (list.length === 0) return null
    return [...list].sort(
      (x, y) => new Date(y.submitted_at).getTime() - new Date(x.submitted_at).getTime()
    )[0]
  }, [diagnosticPreCorporal?.responses])

  const latestPreCapilarResponse = useMemo(() => {
    const list = diagnosticPreCapilar?.responses ?? []
    if (list.length === 0) return null
    return [...list].sort(
      (x, y) => new Date(y.submitted_at).getTime() - new Date(x.submitted_at).getTime()
    )[0]
  }, [diagnosticPreCapilar?.responses])

  const createDiagnosticCorporalLink = async () => {
    if (!selectedClient?.id) return
    setDiagnosticCorporalLinkLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/diagnostic-corporal`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link.')
        return
      }
      await loadDiagnosticCorporal()
    } finally {
      setDiagnosticCorporalLinkLoading(false)
    }
  }

  const createDiagnosticCapilarLink = async () => {
    if (!selectedClient?.id) return
    setDiagnosticCapilarLinkLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/diagnostic-capilar`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link.')
        return
      }
      await loadDiagnosticCapilar()
    } finally {
      setDiagnosticCapilarLinkLoading(false)
    }
  }

  const createDiagnosticPreCorporalLink = async () => {
    if (!selectedClient?.id) return
    setDiagnosticPreCorporalLinkLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-diagnostico-corporal`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link do pré.')
        return
      }
      await loadDiagnosticPreCorporal()
    } finally {
      setDiagnosticPreCorporalLinkLoading(false)
    }
  }

  const createDiagnosticPreCapilarLink = async () => {
    if (!selectedClient?.id) return
    setDiagnosticPreCapilarLinkLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-diagnostico-capilar`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link do pré.')
        return
      }
      await loadDiagnosticPreCapilar()
    } finally {
      setDiagnosticPreCapilarLinkLoading(false)
    }
  }

  const createDiagnosticPreAvaliacaoClienteCapilarLink = async () => {
    if (!selectedClient?.id) return
    setDiagnosticPreAvaliacaoClienteCapilarLinkLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/pre-avaliacao-capilar-cliente`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link da pré-avaliação.')
        return
      }
      await loadDiagnosticPreAvaliacaoClienteCapilar()
    } finally {
      setDiagnosticPreAvaliacaoClienteCapilarLinkLoading(false)
    }
  }

  const addCoachingNote = async () => {
    if (!selectedClient?.id) return
    const body = newNoteBody.trim()
    if (body.length < 2) return
    setSavingNote(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/estetica-consultoria/clients/${selectedClient.id}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, note_kind: newNoteKind }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao salvar nota.')
        return
      }
      setNewNoteBody('')
      await loadCoachingNotes(selectedClient.id)
    } finally {
      setSavingNote(false)
    }
  }

  const selectClient = (c: YladaEsteticaConsultClientRow) => {
    setSelectedClient(c)
    setClientForm(clientFormDefaults(c))
    setSelected(null)
    setTab('editar')
  }

  useEffect(() => {
    if (!clienteParam) {
      deepLinkClienteAplicado.current = ''
      return
    }
    if (deepLinkClienteAplicado.current === clienteParam) return
    if (clientsLoading) return
    const c = clients.find((x) => x.id === clienteParam)
    if (c) {
      setSelectedClient(c)
      setClientForm(clientFormDefaults(c))
      setSelected(null)
      setTab('editar')
      deepLinkClienteAplicado.current = clienteParam
    }
  }, [clienteParam, clients, clientsLoading])

  const saveClientData = async () => {
    if (!selectedClient?.id || !clientForm) return
    setSavingClient(true)
    setError(null)
    try {
      const amtStr = clientForm.consulting_paid_amount.replace(',', '.').trim()
      const consulting_paid_amount = amtStr === '' ? null : Number(amtStr)
      const res = await fetch(`/api/admin/estetica-consultoria/clients/${selectedClient.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: clientForm.business_name,
          segment: clientForm.segment,
          contact_name: clientForm.contact_name || null,
          contact_email: clientForm.contact_email || null,
          phone: clientForm.phone || null,
          leader_tenant_id: clientForm.leader_tenant_id || null,
          consulting_paid_amount:
            consulting_paid_amount != null && Number.isFinite(consulting_paid_amount) ? consulting_paid_amount : null,
          payment_currency: clientForm.payment_currency || 'BRL',
          last_payment_at: clientForm.last_payment_at ? `${clientForm.last_payment_at}:00` : null,
          is_annual_plan: clientForm.is_annual_plan,
          annual_plan_start: clientForm.annual_plan_start || null,
          annual_plan_end: clientForm.annual_plan_end || null,
          access_valid_until: clientForm.access_valid_until || null,
          admin_notes: clientForm.admin_notes || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao salvar dados da estética.')
        return
      }
      const item = (data as { item?: YladaEsteticaConsultClientRow }).item
      if (item) {
        setSelectedClient(item)
        setClientForm(clientFormDefaults(item))
        setClients((prev) => prev.map((x) => (x.id === item.id ? item : x)))
      }
    } finally {
      setSavingClient(false)
    }
  }

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingClient(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/estetica-consultoria/clients', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: newBusinessName,
          segment: newSegment,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao criar cliente.')
        return
      }
      const item = (data as { item?: YladaEsteticaConsultClientRow }).item
      if (item) {
        setClients((prev) => [item, ...prev])
        selectClient(item)
        setNewBusinessName('')
        setNewSegment(segmentoFiltro === 'corporal' ? 'corporal' : 'capilar')
      }
    } finally {
      setCreatingClient(false)
    }
  }

  const deleteClient = async () => {
    if (!selectedClient?.id) return
    if (!confirm('Excluir esta estética e todos os materiais/respostas associados?')) return
    const res = await fetch(`/api/admin/estetica-consultoria/clients/${selectedClient.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string }).error || 'Erro ao excluir.')
      return
    }
    setSelectedClient(null)
    setClientForm(null)
    setSelected(null)
    await loadClients()
  }

  const loadAuxForForm = useCallback(async (materialId: string, filterClientId: string | null) => {
    setAuxLoading(true)
    try {
      const qc = filterClientId
        ? `?estetica_consult_client_id=${encodeURIComponent(filterClientId)}`
        : ''
      const [r1, r2] = await Promise.all([
        fetch(`/api/admin/estetica-consultoria/materials/${materialId}/share-links${qc}`, {
          credentials: 'include',
        }),
        fetch(`/api/admin/estetica-consultoria/materials/${materialId}/responses${qc}`, { credentials: 'include' }),
      ])
      const d1 = await r1.json().catch(() => ({}))
      const d2 = await r2.json().catch(() => ({}))
      setShareLinks(r1.ok ? ((d1 as { items?: YladaEsteticaConsultancyShareLinkRow[] }).items ?? []) : [])
      setResponses(r2.ok ? ((d2 as { items?: YladaEsteticaConsultancyFormResponseRow[] }).items ?? []) : [])
    } finally {
      setAuxLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selected?.id || selected.material_kind !== 'formulario') {
      setShareLinks([])
      setResponses([])
      return
    }
    if (tab === 'links' || tab === 'respostas') {
      const filterId =
        selected.template_key && selectedClient?.id ? selectedClient.id : null
      void loadAuxForForm(selected.id, filterId)
    }
  }, [selected, selected?.id, selected?.material_kind, selected?.template_key, selectedClient?.id, tab, loadAuxForForm])

  const openNew = (kind: ProLideresConsultoriaMaterialKind) => {
    if (!selectedClient?.id) return
    setSelected(emptyMaterialRow(selectedClient.id, kind))
    setTab('editar')
    setCreating(true)
  }

  const patchSelected = (patch: Partial<YladaEsteticaConsultancyMaterialRow>) => {
    setSelected((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const patchContent = (next: Record<string, unknown>) => {
    setSelected((prev) => (prev ? { ...prev, content: next } : prev))
  }

  const save = async () => {
    if (!selected || !selectedClient?.id) return
    setSaving(true)
    setError(null)
    try {
      if (!selected.id) {
        const res = await fetch(
          `/api/admin/estetica-consultoria/clients/${encodeURIComponent(selectedClient.id)}/materials`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: selected.title,
              material_kind: selected.material_kind,
              description: selected.description,
              content: selected.content,
              sort_order: selected.sort_order,
              is_published: selected.is_published,
            }),
          }
        )
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((data as { error?: string }).error || 'Erro ao criar.')
          return
        }
        const item = (data as { item?: YladaEsteticaConsultancyMaterialRow }).item
        if (item) {
          setSelected(item)
          setCreating(false)
          await loadMaterials(selectedClient.id)
        }
        return
      }

      const res = await fetch(`/api/admin/estetica-consultoria/materials/${selected.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selected.title,
          material_kind: selected.material_kind,
          description: selected.description,
          content: selected.content,
          sort_order: selected.sort_order,
          is_published: selected.is_published,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao salvar.')
        return
      }
      const item = (data as { item?: YladaEsteticaConsultancyMaterialRow }).item
      if (item) setSelected(item)
      await loadMaterials(selectedClient.id)
      if (selected.template_key) {
        void loadDiagnosticCorporal()
        void loadDiagnosticCapilar()
      }
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!selectedClient?.id) return
    if (!confirm('Excluir este material e respostas associadas?')) return
    const res = await fetch(`/api/admin/estetica-consultoria/materials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string }).error || 'Erro ao excluir.')
      return
    }
    if (selected?.id === id) setSelected(null)
    await loadMaterials(selectedClient.id)
  }

  const createShareLink = async () => {
    if (!selected?.id || !selectedClient?.id) return
    setAuxLoading(true)
    setError(null)
    const payload =
      selected.template_key && selectedClient.id
        ? { estetica_consult_client_id: selectedClient.id }
        : {}
    const res = await fetch(`/api/admin/estetica-consultoria/materials/${selected.id}/share-links`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    setAuxLoading(false)
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao criar link.')
      return
    }
    await loadAuxForForm(
      selected.id,
      selected.template_key && selectedClient?.id ? selectedClient.id : null
    )
  }

  const copyResponderUrl = (token: string) => {
    const url = buildEsteticaConsultoriaResponderUrl(typeof window !== 'undefined' ? window.location.origin : '', token)
    void navigator.clipboard.writeText(url)
  }

  const content = selected?.content as Record<string, unknown>

  const renewalHint = useMemo(() => {
    if (!selectedClient?.annual_plan_end || !selectedClient.is_annual_plan) return null
    const end = new Date(`${selectedClient.annual_plan_end}T12:00:00`)
    if (!Number.isFinite(end.getTime())) return null
    const days = Math.ceil((end.getTime() - Date.now()) / (86400 * 1000))
    if (days < 0) return { tone: 'red' as const, text: `Plano anual terminou há ${Math.abs(days)} dia(s).` }
    if (days <= 60) return { tone: 'amber' as const, text: `Renovação em ${days} dia(s) (${selectedClient.annual_plan_end}).` }
    return { tone: 'gray' as const, text: `Plano até ${selectedClient.annual_plan_end}.` }
  }, [selectedClient])

  const accessValidityHint = useMemo(() => {
    const until = selectedClient?.access_valid_until
    if (!until) return null
    const end = new Date(`${until}T12:00:00`)
    if (!Number.isFinite(end.getTime())) return null
    const days = Math.ceil((end.getTime() - Date.now()) / (86400 * 1000))
    if (days < 0) {
      return { tone: 'red' as const, text: `Acesso caducado há ${Math.abs(days)} dia(s) (${until}).` }
    }
    if (days <= 15) {
      return { tone: 'amber' as const, text: `Acesso caduca em ${days} dia(s), até ${until} (inclusive).` }
    }
    return { tone: 'gray' as const, text: `Acesso válido até ${until} (inclusive).` }
  }, [selectedClient?.access_valid_until])

  const formFieldsForResponses = useMemo(() => {
    if (!selected || selected.material_kind !== 'formulario') return []
    const c = selected.content && typeof selected.content === 'object' ? selected.content : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [selected])

  const triggerCsvDownload = useCallback((filename: string, csv: string) => {
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadDiagnosticCorporalResponsesCsv = useCallback(() => {
    if (!selectedClient || !diagnosticCorporal?.responses.length) return
    const csv = consultoriaFormResponsesToCsv(diagnosticCorporalFieldDefs, diagnosticCorporal.responses)
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, 'diagnostico-corporal-respostas')
    triggerCsvDownload(fn, csv)
  }, [selectedClient, diagnosticCorporal?.responses, diagnosticCorporalFieldDefs, triggerCsvDownload])

  const downloadDiagnosticCapilarResponsesCsv = useCallback(() => {
    if (!selectedClient || !diagnosticCapilar?.responses.length) return
    const csv = consultoriaFormResponsesToCsv(diagnosticCapilarFieldDefs, diagnosticCapilar.responses)
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, 'diagnostico-capilar-respostas')
    triggerCsvDownload(fn, csv)
  }, [selectedClient, diagnosticCapilar?.responses, diagnosticCapilarFieldDefs, triggerCsvDownload])

  const downloadDiagnosticPreCorporalResponsesCsv = useCallback(() => {
    if (!selectedClient || !diagnosticPreCorporal?.responses.length) return
    const csv = consultoriaFormResponsesToCsv(diagnosticPreCorporalFieldDefs, diagnosticPreCorporal.responses)
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, 'pre-diagnostico-corporal-respostas')
    triggerCsvDownload(fn, csv)
  }, [selectedClient, diagnosticPreCorporal?.responses, diagnosticPreCorporalFieldDefs, triggerCsvDownload])

  const downloadDiagnosticPreCapilarResponsesCsv = useCallback(() => {
    if (!selectedClient || !diagnosticPreCapilar?.responses.length) return
    const csv = consultoriaFormResponsesToCsv(diagnosticPreCapilarFieldDefs, diagnosticPreCapilar.responses)
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, 'pre-diagnostico-capilar-respostas')
    triggerCsvDownload(fn, csv)
  }, [selectedClient, diagnosticPreCapilar?.responses, diagnosticPreCapilarFieldDefs, triggerCsvDownload])

  const downloadDiagnosticPreAvaliacaoClienteCapilarResponsesCsv = useCallback(() => {
    if (!selectedClient || !diagnosticPreAvaliacaoClienteCapilar?.responses.length) return
    const csv = consultoriaFormResponsesToCsv(
      diagnosticPreAvaliacaoClienteCapilarFieldDefs,
      diagnosticPreAvaliacaoClienteCapilar.responses
    )
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, 'pre-avaliacao-capilar-cliente-respostas')
    triggerCsvDownload(fn, csv)
  }, [
    selectedClient,
    diagnosticPreAvaliacaoClienteCapilar?.responses,
    diagnosticPreAvaliacaoClienteCapilarFieldDefs,
    triggerCsvDownload,
  ])

  const downloadSelectedMaterialResponsesCsv = useCallback(() => {
    if (!selectedClient || !selected?.title || responses.length === 0) return
    const slug = (selected.title || 'formulario').replace(/\s+/g, '-').slice(0, 32)
    const csv = consultoriaFormResponsesToCsv(formFieldsForResponses, responses)
    const fn = consultoriaCsvFilenameBase(selectedClient.business_name, `${slug}-respostas`)
    triggerCsvDownload(fn, csv)
  }, [selectedClient, selected?.title, responses, formFieldsForResponses, triggerCsvDownload])

  const execBlock = useMemo(() => {
    if (!selected) return null
    const k = selected.material_kind
    if (k === 'roteiro') {
      const steps = Array.isArray(content?.steps) ? content.steps : []
      return (
        <ol className="list-decimal space-y-4 pl-5 text-sm text-gray-800">
          {steps.map((s: unknown, i: number) => {
            const step = s as { title?: string; detail?: string; links?: { label: string; url: string }[] }
            return (
              <li key={i} className="pl-1">
                <p className="font-semibold text-gray-900">{step.title || `Passo ${i + 1}`}</p>
                {step.detail ? <p className="mt-1 whitespace-pre-wrap text-gray-700">{step.detail}</p> : null}
                {Array.isArray(step.links) && step.links.length ? (
                  <ul className="mt-2 space-y-1">
                    {step.links.map((l, j) => (
                      <li key={j}>
                        <a href={l.url} className="text-blue-700 underline" target="_blank" rel="noreferrer">
                          {l.label || l.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      )
    }
    if (k === 'checklist') {
      const itemsList = Array.isArray(content?.items) ? content.items : []
      return (
        <ul className="space-y-2">
          {itemsList.map((it: unknown, i: number) => (
            <li key={i} className="flex gap-2 text-sm text-gray-800">
              <span className="text-gray-400">☐</span>
              <span>{String((it as { text?: string })?.text ?? '')}</span>
            </li>
          ))}
        </ul>
      )
    }
    if (k === 'dicas') {
      const tips = Array.isArray(content?.tips) ? content.tips : []
      return (
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-800">
          {tips.map((t: unknown, i: number) => (
            <li key={i}>{String(t)}</li>
          ))}
        </ul>
      )
    }
    if (k === 'documento') {
      const md = String(content?.markdown ?? '')
      return (
        <pre className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800">
          {md || '—'}
        </pre>
      )
    }
    if (k === 'formulario') {
      return (
        <p className="text-sm text-gray-600">
          Abra a aba <strong>Links</strong>, envie o URL para a profissional e acompanhe as respostas na aba{' '}
          <strong>Respostas</strong>.
        </p>
      )
    }
    return null
  }, [selected, content])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-pink-700">Estética · YLADA</p>
        <h1 className="text-2xl font-bold text-gray-900">Consultoria (capilar / corporal)</h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          O <strong>pré-diagnóstico</strong> tem <strong>link público fixo</strong> (abaixo): a pessoa responde sem ficha
          pré-criada e o sistema <strong>cria a clínica automaticamente</strong> ao enviar. Depois escolhe a ficha na
          lista para diagnóstico completo, pagamento e materiais. Os <strong>diagnósticos fixos YLADA</strong> e outros
          materiais aparecem <strong>depois de selecionar uma clínica</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {segmentoFiltro ? (
            <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-900">
              Vista: {segmentoFiltro === 'capilar' ? 'Capilar (+ ambos)' : 'Corporal (+ ambos)'}
            </span>
          ) : null}
          <Link href="/admin/consultorias" className="font-semibold text-blue-600 underline hover:text-blue-800">
            Todas as consultorias
          </Link>
          {segmentoFiltro ? (
            <>
              <span className="text-gray-300">·</span>
              <Link href="/admin/estetica-consultoria" className="text-blue-600 underline hover:text-blue-800">
                Ver todas as estéticas
              </Link>
            </>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setFormModelDialog('corporal')}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-900 hover:bg-rose-100"
          >
            Ver formulário modelo — corporal
          </button>
          <button
            type="button"
            onClick={() => setFormModelDialog('capilar')}
            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900 hover:bg-sky-100"
          >
            Ver formulário modelo — capilar
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-indigo-950">Links públicos — pré-diagnóstico (entrada)</h2>
        <p className="text-xs text-indigo-900/85 max-w-3xl">
          Envie um destes URLs no WhatsApp ou Instagram. Cada envio válido <strong>cria uma nova ficha</strong> na lista
          «Estéticas acompanhadas» com segmento capilar ou corporal conforme o formulário. O mesmo link serve para
          todas as pessoas; não precisa criar a clínica antes.
        </p>
        {openPreLinksLoading ? (
          <p className="text-sm text-indigo-800/80">A carregar links…</p>
        ) : openPreLinksError ? (
          <p className="text-sm text-red-800">{openPreLinksError}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: 'corporal' as const, label: 'Pré — estética corporal', pack: openPreLinks?.corporal },
                { key: 'capilar' as const, label: 'Pré — terapia capilar', pack: openPreLinks?.capilar },
              ] as const
            ).map(({ key, label, pack }) => (
              <div
                key={key}
                className={`rounded-xl border p-3 ${key === 'corporal' ? 'border-rose-200 bg-white' : 'border-sky-200 bg-white'}`}
              >
                <p className="text-xs font-semibold text-gray-800">{label}</p>
                {pack?.responder_url ? (
                  <>
                    <code className="mt-2 block break-all text-[11px] text-gray-800">{pack.responder_url}</code>
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(pack.responder_url)}
                      className="mt-2 text-xs font-medium text-blue-700 hover:underline"
                    >
                      Copiar URL
                    </button>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-amber-800">Link ainda não disponível. Aplique a migração 336 no Supabase e recarregue.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estéticas acompanhadas</h2>
          <p className="mt-1 text-xs text-gray-600 max-w-2xl">
            Inclui fichas criadas pelo pré público. Clique num nome ou use <strong>Criar e abrir</strong> só quando
            quiseres abrir uma ficha manualmente (ex.: antes da pessoa preencher o pré).
          </p>
        </div>
        <form className="flex flex-wrap gap-2 items-end" onSubmit={(e) => void createClient(e)}>
          <label className="text-sm flex-1 min-w-[180px]">
            <span className="text-gray-600">Nova estética (nome)</span>
            <input
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={newBusinessName}
              onChange={(e) => setNewBusinessName(e.target.value)}
              placeholder="Nome da clínica / profissional"
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Segmento</span>
            <select
              className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value as typeof newSegment)}
            >
              <option value="capilar">Capilar</option>
              <option value="corporal">Corporal</option>
              <option value="ambos">Ambos</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={creatingClient}
            className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
          >
            {creatingClient ? 'Criando…' : 'Criar e abrir'}
          </button>
        </form>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1 min-w-[200px]"
            placeholder="Pesquisar…"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={() => void loadClients(clientSearch)}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          >
            Pesquisar
          </button>
        </div>
        {clientsLoading ? (
          <p className="text-sm text-gray-500">Carregando clientes…</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {clientsVisiveis.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectClient(c)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedClient?.id === c.id
                      ? 'border-pink-500 bg-pink-50/80'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{c.business_name}</span>
                  <span className="ml-2 text-xs text-gray-500">{esteticaConsultSegmentLabel(c.segment)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedClient && clientForm ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Dados administrativos</h2>
            <div className="flex flex-wrap gap-2 justify-end">
              {accessValidityHint ? (
                <p
                  className={`text-xs rounded-lg px-2 py-1 ${
                    accessValidityHint.tone === 'red'
                      ? 'bg-red-50 text-red-900 border border-red-100'
                      : accessValidityHint.tone === 'amber'
                        ? 'bg-amber-50 text-amber-900 border border-amber-100'
                        : 'bg-gray-50 text-gray-700 border border-gray-100'
                  }`}
                >
                  {accessValidityHint.text}
                </p>
              ) : null}
              {renewalHint ? (
                <p
                  className={`text-xs rounded-lg px-2 py-1 ${
                    renewalHint.tone === 'red'
                      ? 'bg-red-50 text-red-900 border border-red-100'
                      : renewalHint.tone === 'amber'
                        ? 'bg-amber-50 text-amber-900 border border-amber-100'
                        : 'bg-gray-50 text-gray-700 border border-gray-100'
                  }`}
                >
                  {renewalHint.text}
                </p>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 space-y-2">
            <label className="block text-sm max-w-md">
              <span className="font-medium text-gray-900">Acesso (plano) válido até</span>
              <span className="block text-xs text-gray-600 mt-0.5">
                Uma data para esta ficha inteira — capilar, corporal ou ambos. Inclusive neste dia. Com{' '}
                <strong>Leader tenant ID</strong> preenchido e migrações 339–340 aplicadas: o painel Pro Estética bloqueia
                após esta data; o cron diário (Resend + <code className="text-[10px]">CRON_SECRET</code>) pode enviar
                lembretes ~15, ~7 e ~1 dia antes ao e-mail dos dados administrativos.
              </span>
              <input
                type="date"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                value={clientForm.access_valid_until}
                onChange={(e) => setClientForm((f) => (f ? { ...f, access_valid_until: e.target.value } : f))}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600">Nome da estética</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.business_name}
                onChange={(e) => setClientForm((f) => (f ? { ...f, business_name: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Segmento</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.segment}
                onChange={(e) =>
                  setClientForm((f) =>
                    f ? { ...f, segment: e.target.value as YladaEsteticaConsultClientRow['segment'] } : f
                  )
                }
              >
                <option value="capilar">Capilar</option>
                <option value="corporal">Corporal</option>
                <option value="ambos">Ambos</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Contacto — nome</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.contact_name}
                onChange={(e) => setClientForm((f) => (f ? { ...f, contact_name: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">E-mail</span>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.contact_email}
                onChange={(e) => setClientForm((f) => (f ? { ...f, contact_email: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Telefone</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.phone}
                onChange={(e) => setClientForm((f) => (f ? { ...f, phone: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600">Leader tenant ID (opcional — ligação ao painel Pro Estética)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
                value={clientForm.leader_tenant_id}
                onChange={(e) => setClientForm((f) => (f ? { ...f, leader_tenant_id: e.target.value } : f))}
                placeholder="UUID do tenant"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Valor pago (consultoria)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.consulting_paid_amount}
                onChange={(e) => setClientForm((f) => (f ? { ...f, consulting_paid_amount: e.target.value } : f))}
                placeholder="ex: 1500 ou 1500,50"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Moeda</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.payment_currency}
                onChange={(e) => setClientForm((f) => (f ? { ...f, payment_currency: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Data do último pagamento</span>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.last_payment_at}
                onChange={(e) => setClientForm((f) => (f ? { ...f, last_payment_at: e.target.value } : f))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-3 pt-1">
              <input
                type="checkbox"
                checked={clientForm.is_annual_plan}
                onChange={(e) => setClientForm((f) => (f ? { ...f, is_annual_plan: e.target.checked } : f))}
              />
              <span>Incluída no plano anual</span>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Início plano anual</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.annual_plan_start}
                onChange={(e) => setClientForm((f) => (f ? { ...f, annual_plan_start: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Fim plano anual (renovação)</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.annual_plan_end}
                onChange={(e) => setClientForm((f) => (f ? { ...f, annual_plan_end: e.target.value } : f))}
              />
            </label>
            <label className="block text-sm sm:col-span-3">
              <span className="text-gray-600">Notas internas</span>
              <textarea
                className="mt-1 w-full min-h-[80px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={clientForm.admin_notes}
                onChange={(e) => setClientForm((f) => (f ? { ...f, admin_notes: e.target.value } : f))}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void saveClientData()}
              disabled={savingClient}
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
            >
              {savingClient ? 'Salvando…' : 'Salvar dados da estética'}
            </button>
            <button
              type="button"
              onClick={() => void deleteClient()}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
            >
              Excluir estética
            </button>
          </div>
        </section>
      ) : null}

      {selectedClient ? (
        <section className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Acompanhamento ao vivo</h2>
            <p className="mt-1 text-xs text-gray-600 max-w-2xl">
              Regista o que observas em tempo real, recomendações e evolução da clínica. Tudo fica por cliente, com
              data — base para conduzires a consultoria e, mais tarde, para análise assistida (IA).
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="text-gray-600">Tipo de cadastro</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={newNoteKind}
                onChange={(e) => setNewNoteKind(e.target.value)}
              >
                <option value="acompanhamento">Acompanhamento</option>
                <option value="observacao">Observação</option>
                <option value="recomendacao">Recomendação</option>
                <option value="evolucao">Evolução</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-gray-600">Nota</span>
              <textarea
                className="mt-1 w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={newNoteBody}
                onChange={(e) => setNewNoteBody(e.target.value)}
                placeholder="Ex.: combinado na call, próximo foco, risco, vitória da semana…"
              />
            </label>
          </div>
          <button
            type="button"
            disabled={savingNote || newNoteBody.trim().length < 2}
            onClick={() => void addCoachingNote()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {savingNote ? 'Salvando…' : 'Adicionar nota'}
          </button>
          {coachingLoading ? (
            <p className="text-sm text-gray-500">Carregando notas…</p>
          ) : coachingNotes.length === 0 ? (
            <p className="text-sm text-gray-500">Ainda não há notas de acompanhamento.</p>
          ) : (
            <ul className="max-h-[360px] space-y-3 overflow-auto border-t border-gray-100 pt-3">
              {coachingNotes.map((n) => (
                <li key={n.id} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm">
                  <p className="text-xs text-gray-500">
                    {new Date(n.created_at).toLocaleString('pt-BR')}
                    <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 font-medium text-indigo-900">
                      {NOTE_KIND_LABEL[n.note_kind] ?? n.note_kind}
                    </span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-gray-900">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {selectedClient ? (
        <>
          {(selectedClient.segment === 'corporal' || selectedClient.segment === 'ambos') ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm space-y-4">
              <div className="rounded-xl border border-rose-200/90 bg-white/70 p-3 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-rose-950">
                    Pré-diagnóstico corporal (antes da reunião)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFormModelDialog('pre_corporal')}
                    className="shrink-0 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-900 hover:bg-rose-100"
                  >
                    Ver perguntas do pré
                  </button>
                </div>
                <p className="text-xs text-rose-900/85 max-w-2xl">
                  O fluxo principal é o <strong>link público</strong> no topo da página (cria ficha ao enviar). Aqui:
                  opcionalmente, gera um link <strong>só desta clínica</strong> com dados pré-preenchidos a partir do
                  cadastro admin.
                </p>
                {diagnosticPreCorporalLoading ? (
                  <p className="text-sm text-rose-900/80">Carregando pré…</p>
                ) : diagnosticPreCorporal?.material ? (
                  <>
                    {latestPreCorporalResponse ? (
                      <PreDiagnosticoLeituraRapidaCard
                        variant="corporal"
                        submittedAt={latestPreCorporalResponse.submitted_at}
                        answers={
                          (latestPreCorporalResponse.answers &&
                          typeof latestPreCorporalResponse.answers === 'object' &&
                          !Array.isArray(latestPreCorporalResponse.answers)
                            ? latestPreCorporalResponse.answers
                            : {}) as Record<string, unknown>
                        }
                      />
                    ) : null}
                    <p className="text-xs text-rose-900/80">
                      Estado:{' '}
                      {diagnosticPreCorporal.material.is_published ? (
                        <span className="font-semibold text-emerald-800">Ativo</span>
                      ) : (
                        <span className="font-semibold text-amber-800">Rascunho</span>
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={diagnosticPreCorporalLinkLoading || !diagnosticPreCorporal.material.is_published}
                      onClick={() => void createDiagnosticPreCorporalLink()}
                      className="rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
                    >
                      {diagnosticPreCorporalLinkLoading ? 'Gerando…' : 'Gerar link do pré só desta clínica (opcional)'}
                    </button>
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-rose-950/90">
                        Links do pré
                      </h4>
                      {diagnosticPreCorporal.links.length === 0 ? (
                        <p className="mt-1 text-xs text-rose-900/70">Nenhum link ainda.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {diagnosticPreCorporal.links.map((lk) => (
                            <li key={lk.id} className="rounded-lg border border-rose-100 bg-white p-2 text-xs">
                              <code className="break-all text-gray-800">
                                {lk.responder_url ??
                                  buildEsteticaConsultoriaResponderUrl(
                                    typeof window !== 'undefined' ? window.location.origin : '',
                                    lk.token
                                  )}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  const url =
                                    lk.responder_url ??
                                    buildEsteticaConsultoriaResponderUrl(
                                      typeof window !== 'undefined' ? window.location.origin : '',
                                      lk.token
                                    )
                                  void navigator.clipboard.writeText(url)
                                }}
                                className="mt-1 block text-xs font-medium text-blue-700 hover:underline"
                              >
                                Copiar URL
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-rose-950/90">
                          Respostas do pré
                        </h4>
                        {diagnosticPreCorporal.responses.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => downloadDiagnosticPreCorporalResponsesCsv()}
                            className="shrink-0 rounded-lg border border-rose-300 bg-white px-2 py-0.5 text-[11px] font-medium text-rose-900 hover:bg-rose-100"
                          >
                            CSV
                          </button>
                        ) : null}
                      </div>
                      {diagnosticPreCorporal.responses.length === 0 ? (
                        <p className="mt-1 text-xs text-rose-900/70">Ainda sem envios.</p>
                      ) : (
                        <div className="mt-2 max-h-[min(40vh,320px)] space-y-3 overflow-auto pr-1">
                          {diagnosticPreCorporal.responses.map((r) => {
                            const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                              ? r.answers
                              : {}) as Record<string, unknown>
                            const rows = consultoriaAnswersToDisplayRows(diagnosticPreCorporalFieldDefs, ans)
                            return (
                              <ConsultoriaAdminResponseCard
                                key={r.id}
                                tone="rose"
                                submittedAt={r.submitted_at}
                                respondentName={r.respondent_name}
                                respondentEmail={r.respondent_email}
                                rows={rows}
                                rawAnswers={r.answers}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-rose-900/80">Não foi possível carregar o pré-diagnóstico.</p>
                )}
              </div>

              <div className="border-t border-rose-200/80 pt-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-rose-950">
                  Diagnóstico completo — estética corporal (YLADA fixo)
                </h3>
                <button
                  type="button"
                  onClick={() => setFormModelDialog('corporal')}
                  className="shrink-0 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-900 hover:bg-rose-100"
                >
                  Ver perguntas do diagnóstico completo
                </button>
              </div>
              <div>
                <p className="mt-1 text-xs text-rose-900/90 max-w-2xl">
                  Questionário <strong>fixo YLADA</strong> (igual para todas as clínicas) — não se edita no painel. Cada{' '}
                  <strong>link</strong> é só para <strong>{selectedClient.business_name}</strong>: primeiro enviamos
                  confirmação para o <strong>e-mail dos dados administrativos</strong>; depois ela preenche o
                  questionário completo aqui.
                </p>
                <p className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 max-w-2xl">
                  Garanta um <strong>e-mail válido</strong> em «Dados administrativos» antes de gerar o link — é para lá
                  que vai o convite de confirmação.
                </p>
              </div>
              {diagnosticCorporalLoading ? (
                <p className="text-sm text-rose-900/80">Preparando o formulário global…</p>
              ) : diagnosticCorporal?.material ? (
                <>
                  <p className="text-xs text-rose-900/80">
                    Estado:{' '}
                    {diagnosticCorporal.material.is_published ? (
                      <span className="font-semibold text-emerald-800">Ativo — você pode gerar links</span>
                    ) : (
                      <span className="font-semibold text-amber-800">Rascunho — fale com o suporte se o global não estiver publicado</span>
                    )}
                  </p>
                  <button
                    type="button"
                    disabled={diagnosticCorporalLinkLoading || !diagnosticCorporal.material.is_published}
                    onClick={() => void createDiagnosticCorporalLink()}
                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    {diagnosticCorporalLinkLoading ? 'Gerando…' : 'Gerar novo link para esta clínica'}
                  </button>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-950/90">
                      Links desta clínica
                    </h4>
                    {diagnosticCorporal.links.length === 0 ? (
                      <p className="mt-1 text-xs text-rose-900/70">Ainda não há links. Use o botão acima para gerar um.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {diagnosticCorporal.links.map((lk) => (
                          <li key={lk.id} className="rounded-lg border border-rose-100 bg-white p-2 text-xs">
                            <code className="break-all text-gray-800">
                              {lk.responder_url ??
                                buildEsteticaConsultoriaResponderUrl(
                                  typeof window !== 'undefined' ? window.location.origin : '',
                                  lk.token
                                )}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                const url =
                                  lk.responder_url ??
                                  buildEsteticaConsultoriaResponderUrl(
                                    typeof window !== 'undefined' ? window.location.origin : '',
                                    lk.token
                                  )
                                void navigator.clipboard.writeText(url)
                              }}
                              className="mt-1 block text-xs font-medium text-blue-700 hover:underline"
                            >
                              Copiar URL
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-950/90">
                        Respostas do diagnóstico — {selectedClient.business_name}
                      </h4>
                      {diagnosticCorporal.responses.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => downloadDiagnosticCorporalResponsesCsv()}
                          className="shrink-0 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-medium text-rose-900 hover:bg-rose-100"
                        >
                          Baixar CSV
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-rose-900/75">
                      Cada envio mostra <strong>todas</strong> as perguntas e respostas desta clínica (acompanhamento no
                      painel). CSV em UTF-8 com separador <strong>ponto e vírgula</strong> (BOM; compatível com Excel
                      PT-BR).
                    </p>
                    {diagnosticCorporal.responses.length === 0 ? (
                      <p className="mt-1 text-xs text-rose-900/70">Ainda sem envios por este link.</p>
                    ) : (
                      <div className="mt-2 max-h-[min(70vh,560px)] space-y-4 overflow-auto pr-1">
                        {diagnosticCorporal.responses.map((r) => {
                          const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                            ? r.answers
                            : {}) as Record<string, unknown>
                          const rows = consultoriaAnswersToDisplayRows(diagnosticCorporalFieldDefs, ans)
                          return (
                            <ConsultoriaAdminResponseCard
                              key={r.id}
                              tone="rose"
                              submittedAt={r.submitted_at}
                              respondentName={r.respondent_name}
                              respondentEmail={r.respondent_email}
                              rows={rows}
                              rawAnswers={r.answers}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-rose-900/80">
                  Não foi possível carregar o diagnóstico. Confirme se a migração 331 está aplicada no Supabase e recarregue a página.
                </p>
              )}
              </div>
            </section>
          ) : null}

          {(selectedClient.segment === 'capilar' || selectedClient.segment === 'ambos') ? (
            <section className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 shadow-sm space-y-4">
              <div className="rounded-xl border border-sky-200/90 bg-white/70 p-3 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-sky-950">
                    Pré-diagnóstico capilar (antes da reunião)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFormModelDialog('pre_capilar')}
                    className="shrink-0 rounded-lg border border-sky-300 bg-white px-2.5 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
                  >
                    Ver perguntas do pré
                  </button>
                </div>
                <p className="text-xs text-sky-900/85 max-w-2xl">
                  O fluxo principal é o <strong>link público</strong> no topo. Aqui: link opcional <strong>só desta
                  ficha</strong>, com pré-preenchimento a partir dos dados administrativos.
                </p>
                {diagnosticPreCapilarLoading ? (
                  <p className="text-sm text-sky-900/80">Carregando pré…</p>
                ) : diagnosticPreCapilar?.material ? (
                  <>
                    {latestPreCapilarResponse ? (
                      <PreDiagnosticoLeituraRapidaCard
                        variant="capilar"
                        submittedAt={latestPreCapilarResponse.submitted_at}
                        answers={
                          (latestPreCapilarResponse.answers &&
                          typeof latestPreCapilarResponse.answers === 'object' &&
                          !Array.isArray(latestPreCapilarResponse.answers)
                            ? latestPreCapilarResponse.answers
                            : {}) as Record<string, unknown>
                        }
                      />
                    ) : null}
                    <p className="text-xs text-sky-900/80">
                      Estado:{' '}
                      {diagnosticPreCapilar.material.is_published ? (
                        <span className="font-semibold text-emerald-800">Ativo</span>
                      ) : (
                        <span className="font-semibold text-amber-800">Rascunho</span>
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={diagnosticPreCapilarLinkLoading || !diagnosticPreCapilar.material.is_published}
                      onClick={() => void createDiagnosticPreCapilarLink()}
                      className="rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
                    >
                      {diagnosticPreCapilarLinkLoading ? 'Gerando…' : 'Gerar link do pré só desta clínica (opcional)'}
                    </button>
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-sky-950/90">
                        Links do pré
                      </h4>
                      {diagnosticPreCapilar.links.length === 0 ? (
                        <p className="mt-1 text-xs text-sky-900/70">Nenhum link ainda.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {diagnosticPreCapilar.links.map((lk) => (
                            <li key={lk.id} className="rounded-lg border border-sky-100 bg-white p-2 text-xs">
                              <code className="break-all text-gray-800">
                                {lk.responder_url ??
                                  buildEsteticaConsultoriaResponderUrl(
                                    typeof window !== 'undefined' ? window.location.origin : '',
                                    lk.token
                                  )}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  const url =
                                    lk.responder_url ??
                                    buildEsteticaConsultoriaResponderUrl(
                                      typeof window !== 'undefined' ? window.location.origin : '',
                                      lk.token
                                    )
                                  void navigator.clipboard.writeText(url)
                                }}
                                className="mt-1 block text-xs font-medium text-blue-700 hover:underline"
                              >
                                Copiar URL
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-sky-950/90">
                          Respostas do pré
                        </h4>
                        {diagnosticPreCapilar.responses.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => downloadDiagnosticPreCapilarResponsesCsv()}
                            className="shrink-0 rounded-lg border border-sky-300 bg-white px-2 py-0.5 text-[11px] font-medium text-sky-900 hover:bg-sky-100"
                          >
                            CSV
                          </button>
                        ) : null}
                      </div>
                      {diagnosticPreCapilar.responses.length === 0 ? (
                        <p className="mt-1 text-xs text-sky-900/70">Ainda sem envios.</p>
                      ) : (
                        <div className="mt-2 max-h-[min(40vh,320px)] space-y-3 overflow-auto pr-1">
                          {diagnosticPreCapilar.responses.map((r) => {
                            const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                              ? r.answers
                              : {}) as Record<string, unknown>
                            const rows = consultoriaAnswersToDisplayRows(diagnosticPreCapilarFieldDefs, ans)
                            return (
                              <ConsultoriaAdminResponseCard
                                key={r.id}
                                tone="sky"
                                submittedAt={r.submitted_at}
                                respondentName={r.respondent_name}
                                respondentEmail={r.respondent_email}
                                rows={rows}
                                rawAnswers={r.answers}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-sky-900/80">Não foi possível carregar o pré-diagnóstico.</p>
                )}
              </div>

              <div className="rounded-xl border border-sky-200/90 bg-white/70 p-3 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-sky-950">
                    Pré-avaliação capilar — cliente final (YLADA)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFormModelDialog('pre_avaliacao_cliente_capilar')}
                    className="shrink-0 rounded-lg border border-sky-300 bg-white px-2.5 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
                  >
                    Ver perguntas do quiz
                  </button>
                </div>
                <p className="text-xs text-sky-900/85 max-w-2xl">
                  Questionário para a <strong>cliente</strong> refletir sobre couro, fios e interesse em protocolos
                  antes de falar com <strong>{selectedClient.business_name}</strong>. Cada link fica associado a esta
                  ficha; não há entrada pública sem clínica.
                </p>
                {diagnosticPreAvaliacaoClienteCapilarLoading ? (
                  <p className="text-sm text-sky-900/80">Carregando pré-avaliação…</p>
                ) : diagnosticPreAvaliacaoClienteCapilar?.material ? (
                  <>
                    <p className="text-xs text-sky-900/80">
                      Estado:{' '}
                      {diagnosticPreAvaliacaoClienteCapilar.material.is_published ? (
                        <span className="font-semibold text-emerald-800">Ativo</span>
                      ) : (
                        <span className="font-semibold text-amber-800">Rascunho</span>
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={
                        diagnosticPreAvaliacaoClienteCapilarLinkLoading ||
                        !diagnosticPreAvaliacaoClienteCapilar.material.is_published
                      }
                      onClick={() => void createDiagnosticPreAvaliacaoClienteCapilarLink()}
                      className="rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
                    >
                      {diagnosticPreAvaliacaoClienteCapilarLinkLoading
                        ? 'Gerando…'
                        : 'Gerar link para enviar à cliente'}
                    </button>
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-sky-950/90">
                        Links da pré-avaliação
                      </h4>
                      {diagnosticPreAvaliacaoClienteCapilar.links.length === 0 ? (
                        <p className="mt-1 text-xs text-sky-900/70">Nenhum link ainda.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {diagnosticPreAvaliacaoClienteCapilar.links.map((lk) => (
                            <li key={lk.id} className="rounded-lg border border-sky-100 bg-white p-2 text-xs">
                              <code className="break-all text-gray-800">
                                {lk.responder_url ??
                                  buildEsteticaConsultoriaResponderUrl(
                                    typeof window !== 'undefined' ? window.location.origin : '',
                                    lk.token
                                  )}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  const url =
                                    lk.responder_url ??
                                    buildEsteticaConsultoriaResponderUrl(
                                      typeof window !== 'undefined' ? window.location.origin : '',
                                      lk.token
                                    )
                                  void navigator.clipboard.writeText(url)
                                }}
                                className="mt-1 block text-xs font-medium text-blue-700 hover:underline"
                              >
                                Copiar URL
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-sky-950/90">
                          Respostas (clientes finais)
                        </h4>
                        {diagnosticPreAvaliacaoClienteCapilar.responses.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => downloadDiagnosticPreAvaliacaoClienteCapilarResponsesCsv()}
                            className="shrink-0 rounded-lg border border-sky-300 bg-white px-2 py-0.5 text-[11px] font-medium text-sky-900 hover:bg-sky-100"
                          >
                            CSV
                          </button>
                        ) : null}
                      </div>
                      {diagnosticPreAvaliacaoClienteCapilar.responses.length === 0 ? (
                        <p className="mt-1 text-xs text-sky-900/70">Ainda sem envios.</p>
                      ) : (
                        <div className="mt-2 max-h-[min(40vh,320px)] space-y-3 overflow-auto pr-1">
                          {diagnosticPreAvaliacaoClienteCapilar.responses.map((r) => {
                            const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                              ? r.answers
                              : {}) as Record<string, unknown>
                            const rows = consultoriaAnswersToDisplayRows(
                              diagnosticPreAvaliacaoClienteCapilarFieldDefs,
                              ans
                            )
                            return (
                              <ConsultoriaAdminResponseCard
                                key={r.id}
                                tone="sky"
                                submittedAt={r.submitted_at}
                                respondentName={r.respondent_name}
                                respondentEmail={r.respondent_email}
                                rows={rows}
                                rawAnswers={r.answers}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-sky-900/80">Não foi possível carregar a pré-avaliação cliente.</p>
                )}
              </div>

              <div className="border-t border-sky-200/80 pt-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-sky-950">
                  Diagnóstico completo — terapia capilar (YLADA fixo)
                </h3>
                <button
                  type="button"
                  onClick={() => setFormModelDialog('capilar')}
                  className="shrink-0 rounded-lg border border-sky-300 bg-white px-2.5 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
                >
                  Ver perguntas do diagnóstico completo
                </button>
              </div>
              <div>
                <p className="mt-1 text-xs text-sky-900/90 max-w-2xl">
                  Questionário <strong>fixo YLADA</strong> (igual para todas as clínicas capilar) — não se edita no
                  painel. Cada <strong>link</strong> é só para <strong>{selectedClient.business_name}</strong>: primeiro
                  enviamos confirmação para o <strong>e-mail dos dados administrativos</strong>; depois ela preenche o
                  questionário completo aqui.
                </p>
                <p className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 max-w-2xl">
                  Garanta um <strong>e-mail válido</strong> em «Dados administrativos» antes de gerar o link — é para lá
                  que vai o convite de confirmação.
                </p>
              </div>
              {diagnosticCapilarLoading ? (
                <p className="text-sm text-sky-900/80">Preparando o formulário global…</p>
              ) : diagnosticCapilar?.material ? (
                <>
                  <p className="text-xs text-sky-900/80">
                    Estado:{' '}
                    {diagnosticCapilar.material.is_published ? (
                      <span className="font-semibold text-emerald-800">Ativo — você pode gerar links</span>
                    ) : (
                      <span className="font-semibold text-amber-800">Rascunho — fale com o suporte se o global não estiver publicado</span>
                    )}
                  </p>
                  <button
                    type="button"
                    disabled={diagnosticCapilarLinkLoading || !diagnosticCapilar.material.is_published}
                    onClick={() => void createDiagnosticCapilarLink()}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                  >
                    {diagnosticCapilarLinkLoading ? 'Gerando…' : 'Gerar novo link (capilar) para esta clínica'}
                  </button>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-950/90">
                      Links capilar desta clínica
                    </h4>
                    {diagnosticCapilar.links.length === 0 ? (
                      <p className="mt-1 text-xs text-sky-900/70">Ainda não há links. Use o botão acima para gerar um.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {diagnosticCapilar.links.map((lk) => (
                          <li key={lk.id} className="rounded-lg border border-sky-100 bg-white p-2 text-xs">
                            <code className="break-all text-gray-800">
                              {lk.responder_url ??
                                buildEsteticaConsultoriaResponderUrl(
                                  typeof window !== 'undefined' ? window.location.origin : '',
                                  lk.token
                                )}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                const url =
                                  lk.responder_url ??
                                  buildEsteticaConsultoriaResponderUrl(
                                    typeof window !== 'undefined' ? window.location.origin : '',
                                    lk.token
                                  )
                                void navigator.clipboard.writeText(url)
                              }}
                              className="mt-1 block text-xs font-medium text-blue-700 hover:underline"
                            >
                              Copiar URL
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-950/90">
                        Respostas do diagnóstico capilar — {selectedClient.business_name}
                      </h4>
                      {diagnosticCapilar.responses.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => downloadDiagnosticCapilarResponsesCsv()}
                          className="shrink-0 rounded-lg border border-sky-300 bg-white px-2.5 py-1 text-xs font-medium text-sky-900 hover:bg-sky-100"
                        >
                          Baixar CSV
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-sky-900/75">
                      Cada envio mostra <strong>todas</strong> as perguntas e respostas desta clínica. CSV em UTF-8 com
                      separador vírgula (BOM para Excel).
                    </p>
                    {diagnosticCapilar.responses.length === 0 ? (
                      <p className="mt-1 text-xs text-sky-900/70">Ainda sem envios por este link.</p>
                    ) : (
                      <div className="mt-2 max-h-[min(70vh,560px)] space-y-4 overflow-auto pr-1">
                        {diagnosticCapilar.responses.map((r) => {
                          const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                            ? r.answers
                            : {}) as Record<string, unknown>
                          const rows = consultoriaAnswersToDisplayRows(diagnosticCapilarFieldDefs, ans)
                          return (
                            <ConsultoriaAdminResponseCard
                              key={r.id}
                              tone="sky"
                              submittedAt={r.submitted_at}
                              respondentName={r.respondent_name}
                              respondentEmail={r.respondent_email}
                              rows={rows}
                              rawAnswers={r.answers}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-sky-900/80">
                  Não foi possível carregar o diagnóstico capilar. Confirme se a migração 331 está aplicada no Supabase e
                  recarregue a página.
                </p>
              )}
              </div>
            </section>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-gray-600">
              Filtrar materiais:
              <select
                className="ml-2 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="roteiro">Passo a passo</option>
                <option value="formulario">Formulários</option>
                <option value="checklist">Checklists</option>
                <option value="dicas">Dicas</option>
                <option value="documento">Documentos</option>
              </select>
            </label>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">Novo material:</span>
            {(['roteiro', 'formulario', 'checklist', 'dicas', 'documento'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => openNew(k)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
              >
                + {consultoriaKindLabel(k)}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 mb-2">
            <p className="text-xs text-gray-700">
              <span className="font-semibold text-gray-900">Outros envios</span> — abaixo estão roteiros, checklists e
              formulários <em>criados por você</em> para esta clínica. Os diagnósticos fixos ficam nos blocos{' '}
              <span className="text-rose-800 font-medium">rosa</span> (corporal) e/ou{' '}
              <span className="text-sky-800 font-medium">azul</span> (capilar), conforme o segmento — não entram nesta
              lista.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Materiais desta estética (além do diagnóstico fixo)
              </h2>
              {loadingMaterials ? (
                <p className="text-sm text-gray-500">Carregando…</p>
              ) : itemsDisplayed.length === 0 ? (
                <p className="text-sm text-gray-500">Ainda não há materiais. Crie um com os botões acima.</p>
              ) : (
                <ul className="space-y-2">
                  {itemsDisplayed.map((it) => (
                    <li key={it.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(it)
                          setCreating(false)
                          setTab('editar')
                        }}
                        className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                          selected?.id === it.id
                            ? 'border-pink-500 bg-pink-50/80'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900 line-clamp-2">{it.title}</span>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5">{consultoriaKindLabel(it.material_kind)}</span>
                          {it.is_published ? (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900">Publicado</span>
                          ) : (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Rascunho</span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[320px]">
              {!selected ? (
                <p className="text-sm text-gray-500">Selecione um material à esquerda ou crie um novo.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
                    {(['editar', 'execucao'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                          tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t === 'editar' ? 'Editar' : 'Modo consultoria'}
                      </button>
                    ))}
                    {selected.material_kind === 'formulario' && selected.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setTab('links')}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                            tab === 'links' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Links
                        </button>
                        <button
                          type="button"
                          onClick={() => setTab('respostas')}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                            tab === 'respostas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Respostas
                        </button>
                      </>
                    ) : null}
                  </div>

                  {tab === 'execucao' ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">{selected.title || 'Sem título'}</h3>
                      {selected.description ? (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.description}</p>
                      ) : null}
                      {execBlock}
                    </div>
                  ) : null}

                  {tab === 'links' && selected.material_kind === 'formulario' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">Links para a profissional</h3>
                        <button
                          type="button"
                          disabled={!selected.is_published || auxLoading}
                          onClick={() => void createShareLink()}
                          className="rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
                        >
                          Gerar novo link
                        </button>
                      </div>
                      {!selected.is_published ? (
                        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                          Publique o formulário na aba Editar para os links funcionarem.
                        </p>
                      ) : null}
                      {auxLoading ? <p className="text-xs text-gray-500">Carregando…</p> : null}
                      <ul className="space-y-2 text-sm">
                        {shareLinks.map((lk) => (
                          <li key={lk.id} className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <code className="text-xs break-all text-gray-800">
                              {buildEsteticaConsultoriaResponderUrl(
                                typeof window !== 'undefined' ? window.location.origin : '',
                                lk.token
                              )}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyResponderUrl(lk.token)}
                              className="self-start text-xs font-medium text-blue-700 hover:underline"
                            >
                              Copiar URL
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {tab === 'respostas' && selected.material_kind === 'formulario' ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Respostas recebidas —{' '}
                          <span className="text-pink-800">{selectedClient.business_name}</span>
                        </h3>
                        {responses.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => downloadSelectedMaterialResponsesCsv()}
                            className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
                          >
                            Baixar CSV
                          </button>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-500">
                        Cada envio fica ligado a esta estética; o material é «{selected.title}». Todas as perguntas
                        aparecem abaixo. CSV com separador <strong>ponto e vírgula</strong> (Excel PT-BR).
                      </p>
                      {auxLoading ? <p className="text-xs text-gray-500">Carregando…</p> : null}
                      {responses.length === 0 ? (
                        <p className="text-sm text-gray-500">Ainda não há respostas.</p>
                      ) : (
                        <div className="max-h-[420px] space-y-4 overflow-auto">
                          {responses.map((r) => {
                            const ans = (r.answers && typeof r.answers === 'object' && !Array.isArray(r.answers)
                              ? r.answers
                              : {}) as Record<string, unknown>
                            const rows = consultoriaAnswersToDisplayRows(formFieldsForResponses, ans)
                            return (
                              <ConsultoriaAdminResponseCard
                                key={r.id}
                                tone="gray"
                                submittedAt={r.submitted_at}
                                respondentName={r.respondent_name}
                                respondentEmail={r.respondent_email}
                                rows={rows}
                                rawAnswers={r.answers}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {tab === 'editar' ? (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-sm">
                          <span className="text-gray-600">Título</span>
                          <input
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selected.title}
                            onChange={(e) => patchSelected({ title: e.target.value })}
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="text-gray-600">Tipo</span>
                          <select
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selected.material_kind}
                            onChange={(e) => {
                              const k = e.target.value as ProLideresConsultoriaMaterialKind
                              patchSelected({
                                material_kind: k,
                                content: defaultContentForKind(k),
                              })
                            }}
                          >
                            <option value="roteiro">{consultoriaKindLabel('roteiro')}</option>
                            <option value="formulario">{consultoriaKindLabel('formulario')}</option>
                            <option value="checklist">{consultoriaKindLabel('checklist')}</option>
                            <option value="dicas">{consultoriaKindLabel('dicas')}</option>
                            <option value="documento">{consultoriaKindLabel('documento')}</option>
                          </select>
                        </label>
                      </div>
                      <label className="block text-sm">
                        <span className="text-gray-600">Descrição (opcional)</span>
                        <textarea
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[72px]"
                          value={selected.description ?? ''}
                          onChange={(e) => patchSelected({ description: e.target.value || null })}
                        />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2 items-end">
                        <label className="block text-sm">
                          <span className="text-gray-600">Ordem (lista)</span>
                          <input
                            type="number"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selected.sort_order}
                            onChange={(e) => patchSelected({ sort_order: Number(e.target.value) || 0 })}
                          />
                        </label>
                        <label className="flex items-center gap-2 text-sm pb-2">
                          <input
                            type="checkbox"
                            checked={selected.is_published}
                            onChange={(e) => patchSelected({ is_published: e.target.checked })}
                          />
                          <span className="text-gray-800">Publicado</span>
                        </label>
                      </div>

                      <ConsultoriaKindEditor kind={selected.material_kind} content={content} onChange={patchContent} />

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => void save()}
                          disabled={saving}
                          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
                        >
                          {saving ? 'Salvando…' : creating ? 'Criar material' : 'Salvar alterações'}
                        </button>
                        {selected.id && !selected.template_key ? (
                          <button
                            type="button"
                            onClick={() => void remove(selected.id)}
                            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        ) : !selected.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(null)
                              setCreating(false)
                            }}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      <EsteticaConsultoriaFormModelDialog
        open={formModelDialog !== null}
        variant={formModelDialog}
        onClose={closeFormModelDialog}
      />
    </div>
  )
}
