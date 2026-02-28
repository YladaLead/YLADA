/**
 * Strong Diagnosis Engine — motor de decisão (contrato fixo).
 * Saída: profile_title, profile_summary, main_blocker, consequence, growth_potential, cta_text, whatsapp_prefill.
 * Regras D1–D6 + validação semântica (perda/risco em consequence, ganho em growth_potential, CTA imperativo).
 */
import type {
  DiagnosisInput,
  DiagnosisDecisionOutput,
  DiagnosisGenerationResult,
  RiskLevel,
  BlockerType,
  ProfileTypeName,
} from './diagnosis-types'
import { DiagnosisValidationError } from './diagnosis-types'
import {
  DIAGNOSIS_TEMPLATES,
  fillSlots,
  pickTitle,
} from './diagnosis-templates'
import { validateDiagnosisDecision } from './diagnosis-validation'

const BLOCKER_LABELS: Record<BlockerType, string> = {
  rotina: 'Rotina desorganizada',
  emocional: 'Bloqueio emocional',
  processo: 'Processo pouco claro',
  habitos: 'Hábitos inconsistentes',
  expectativa: 'Expectativa descalibrada',
}

// --- D0: normalização de visitor_answers (sinônimos) ---
function getArr(answers: Record<string, unknown>, ...keys: string[]): unknown[] {
  for (const k of keys) {
    const v = answers[k]
    if (Array.isArray(v)) return v
  }
  return []
}

function getStr(answers: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = answers[k]
    if (typeof v === 'string') return v
  }
  return ''
}

function getNum(answers: Record<string, unknown>, key: string, def: number): number {
  const v = answers[key]
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    if (!Number.isNaN(n)) return n
  }
  return def
}

// --- D1: RISK_DIAGNOSIS → level + evidence ---
function calcRiskLevel(answers: Record<string, unknown>): { level: RiskLevel; evidence: string[] } {
  const symptoms = getArr(answers, 'symptoms', 'sintomas')
  const history = getArr(answers, 'history_flags', 'historico', 'history')
  const impactRaw = answers.impact_level ?? answers.impact
  let impactPoints = 0
  if (typeof impactRaw === 'string') {
    if (impactRaw === 'baixo') impactPoints = 0
    else if (impactRaw === 'medio') impactPoints = 2
    else if (impactRaw === 'alto') impactPoints = 4
  } else if (typeof impactRaw === 'number') {
    if (impactRaw <= 3) impactPoints = 0
    else if (impactRaw <= 6) impactPoints = 2
    else impactPoints = 4
  }
  const attempts = getNum(answers, 'attempts_count', 0)
  let attemptPoints = 0
  if (attempts >= 4) attemptPoints = 2
  else if (attempts >= 2) attemptPoints = 1
  const age = getNum(answers, 'age', 0)
  let agePoints = 0
  if (age >= 45) agePoints = 2
  else if (age >= 30) agePoints = 1

  const symptomCap = Math.min(symptoms.length, 6)
  const historyCap = Math.min(Array.isArray(history) ? history.length : 0, 6)
  const total =
    symptomCap * 1 + historyCap * 2 + impactPoints + attemptPoints + agePoints

  let level: RiskLevel = 'baixo'
  if (total >= 11) level = 'alto'
  else if (total >= 6) level = 'medio'

  const evidence: string[] = []
  if (symptoms.length > 0)
    evidence.push(`Sinais relatados: ${symptoms.length} ponto(s) considerado(s).`)
  if (historyCap > 0) evidence.push(`Histórico: ${historyCap} fator(es) considerado(s).`)
  if (impactPoints > 0) evidence.push('Impacto no dia a dia foi considerado no resultado.')
  if (attempts > 0) evidence.push(`Tentativas anteriores: ${attempts} — influenciaram o nível de risco.`)
  if (evidence.length === 0) evidence.push('Suas respostas indicam um padrão que merece atenção.')
  return { level, evidence: evidence.slice(0, 3) }
}

// --- D2: BLOCKER_DIAGNOSIS → blocker_type + evidence ---
const BLOCKER_ORDER: BlockerType[] = ['rotina', 'processo', 'habitos', 'emocional', 'expectativa']

function calcBlocker(answers: Record<string, unknown>): { blocker_type: BlockerType; evidence: string[] } {
  const barriers = getArr(answers, 'barriers', 'barreiras') as string[]
  const keywords: Record<BlockerType, string[]> = {
    rotina: ['rotina', 'tempo', 'horário', 'organização', 'routine', 'schedule'],
    emocional: ['emocional', 'ansiedade', 'estresse', 'medo', 'emotional', 'stress'],
    processo: ['processo', 'clareza', 'passo a passo', 'process', 'clarity'],
    habitos: ['habitos', 'hábitos', 'constância', 'habits', 'consistency'],
    expectativa: ['expectativa', 'meta', 'realismo', 'expectation', 'goal'],
  }
  const points: Record<BlockerType, number> = {
    rotina: 0,
    emocional: 0,
    processo: 0,
    habitos: 0,
    expectativa: 0,
  }
  const barrierStrs = barriers.map((b) => String(b).toLowerCase())
  for (const [blocker, kws] of Object.entries(keywords)) {
    for (const kw of kws) {
      if (barrierStrs.some((b) => b.includes(kw))) points[blocker as BlockerType] += 2
    }
  }
  const routine = getNum(answers, 'routine_consistency', 5)
  const emotional = getNum(answers, 'emotional_triggers', 5)
  const process = getNum(answers, 'process_clarity', 5)
  const habits = getNum(answers, 'habits_quality', 5)
  const goal = getNum(answers, 'goal_realism', 5)
  if (routine <= 4) points.rotina += 2
  if (emotional <= 4) points.emocional += 2
  if (process <= 4) points.processo += 2
  if (habits <= 4) points.habitos += 2
  if (goal <= 4) points.expectativa += 2

  let chosen: BlockerType = 'rotina'
  let maxP = -1
  for (const b of BLOCKER_ORDER) {
    if (points[b] > maxP) {
      maxP = points[b]
      chosen = b
    }
  }

  const evidence: string[] = []
  if (barriers.length > 0) evidence.push('Sua descrição dos obstáculos apontou para este padrão.')
  evidence.push(`O bloqueio predominante identificado foi: ${chosen}.`)
  if (evidence.length < 3) evidence.push('Ajustar esse ponto tende a destravar os demais.')
  return { blocker_type: chosen, evidence: evidence.slice(0, 3) }
}

// --- D3: PROFILE_TYPE → profile_type + evidence ---
const PROFILE_ORDER: ProfileTypeName[] = ['consistente', 'analitico', 'ansioso', '8ou80', 'improvisador']

function calcProfile(answers: Record<string, unknown>): { profile_type: ProfileTypeName; evidence: string[] } {
  const consistency = getNum(answers, 'consistency', 5)
  const planning = getStr(answers, 'planning_style', 'planning')
  const emotion = getNum(answers, 'emotion_level', 5)
  const decision = getNum(answers, 'decision_speed', 5)
  const follow = getNum(answers, 'follow_through', 5)

  const points: Record<ProfileTypeName, number> = {
    consistente: 0,
    '8ou80': 0,
    ansioso: 0,
    analitico: 0,
    improvisador: 0,
  }
  if (consistency >= 7 && follow >= 7) points.consistente += 3
  if (consistency <= 3 && follow <= 4) points['8ou80'] += 2
  if (emotion >= 7) points.ansioso += 2
  if (planning.toLowerCase().includes('plano') || planning.toLowerCase().includes('plan') || decision <= 4)
    points.analitico += 2
  if (decision >= 7 && planning.toLowerCase().includes('improvis') || follow <= 4) points.improvisador += 2

  let chosen: ProfileTypeName = 'consistente'
  let maxP = -1
  for (const p of PROFILE_ORDER) {
    if (points[p] > maxP) {
      maxP = points[p]
      chosen = p
    }
  }

  const evidence: string[] = []
  evidence.push(`Seu estilo dominante em relação ao tema: ${chosen}.`)
  evidence.push('Forças e armadilhas típicas desse perfil foram consideradas.')
  if (evidence.length < 3) evidence.push('A estratégia ideal será adaptada a esse perfil.')
  return { profile_type: chosen, evidence: evidence.slice(0, 3) }
}

// --- D4: READINESS_CHECKLIST → score + gaps ---
interface ChecklistItem {
  id?: string
  label?: string
  value?: boolean | string | number
}

function isChecked(v: unknown): boolean {
  if (v === true || v === 1 || v === 'sim' || v === 's' || v === 'yes') return true
  if (typeof v === 'string' && v.toLowerCase() === 'sim') return true
  return false
}

function calcReadiness(answers: Record<string, unknown>): { score: number; top_gaps: string[]; evidence: string[] } {
  const raw = answers.checklist
  const list: ChecklistItem[] = Array.isArray(raw) ? raw : []
  if (list.length === 0) {
    return {
      score: 50,
      top_gaps: ['Preencha o checklist para um resultado personalizado.'],
      evidence: ['Checklist não preenchido; exibindo pontuação padrão.'],
    }
  }
  let ok = 0
  const gaps: string[] = []
  for (const item of list) {
    if (isChecked(item.value)) ok++
    else if (item.label) gaps.push(item.label)
  }
  const score = list.length > 0 ? Math.round((ok / list.length) * 100) : 0
  const top_gaps = gaps.slice(0, 3)
  const evidence: string[] = []
  evidence.push(`Você marcou ${ok}/${list.length} como sim.`)
  if (top_gaps.length > 0) evidence.push(`Pontos críticos: ${top_gaps.join(', ')}.`)
  if (evidence.length < 3 && list.length > 0)
    evidence.push('Revisar os pontos não marcados aumenta muito a chance de resultado.')
  return { score, top_gaps, evidence: evidence.slice(0, 3) }
}

// --- D5: PROJECTION_CALCULATOR → projection ---
function calcProjection(answers: Record<string, unknown>): {
  projection: { min: number; max: number; unit?: string }
  evidence: string[]
  warning: boolean
} {
  const current = getNum(answers, 'current_value', 0)
  const target = getNum(answers, 'target_value', current + 10)
  const days = getNum(answers, 'days', 30)
  const consistencyRaw = getStr(answers, 'consistency_level', 'media')
  let factor = 0.6
  if (typeof answers.consistency_level === 'number') {
    const n = answers.consistency_level
    if (n <= 3) factor = 0.35
    else if (n <= 6) factor = 0.6
    else factor = 0.85
  } else {
    if (consistencyRaw.toLowerCase().includes('baix')) factor = 0.35
    else if (consistencyRaw.toLowerCase().includes('alt')) factor = 0.85
  }
  const delta = target - current
  const projected = current + delta * factor
  const min = Math.min(current + delta * 0.5, projected)
  const max = Math.max(projected, current + delta * 0.9)
  const warning = (days < 21 && Math.abs(delta) > 20) || (factor < 0.5 && Math.abs(delta) > 15)
  const evidence: string[] = []
  evidence.push(`Consistência considerada: ${(factor * 100).toFixed(0)}% do potencial.`)
  evidence.push(`Diferença entre ponto atual e meta: ${delta}.`)
  evidence.push(`Prazo informado: ${days} dias.`)
  return {
    projection: { min: Math.round(min), max: Math.round(max), unit: answers.unit as string | undefined },
    evidence: evidence.slice(0, 3),
    warning,
  }
}

// --- Bloqueio único visível (uma string por arquitetura) ---
function getMainBlocker(
  arch: DiagnosisInput['meta']['architecture'],
  payload: {
    level?: RiskLevel
    blocker_type?: BlockerType
    profile_type?: string
    score?: number
    warning?: boolean
  }
): string {
  switch (arch) {
    case 'RISK_DIAGNOSIS':
      return payload.level === 'alto'
        ? 'Risco alto ignorado'
        : payload.level === 'medio'
          ? 'Risco médio acumulado'
          : 'Risco recorrente não tratado'
    case 'BLOCKER_DIAGNOSIS':
      return payload.blocker_type ? BLOCKER_LABELS[payload.blocker_type] : 'Padrão que quebra constância'
    case 'PROFILE_TYPE':
      return payload.profile_type ? `Estratégia desalinhada ao perfil ${payload.profile_type}` : 'Estratégia desalinhada ao perfil'
    case 'READINESS_CHECKLIST':
      return (payload.score ?? 0) < 50 ? 'Pontos críticos em aberto' : 'Gaps de prontidão'
    case 'PROJECTION_CALCULATOR':
      return payload.warning ? 'Meta descalibrada' : 'Projeção a calibrar'
    default:
      return 'Padrão a ajustar'
  }
}

// --- D6: next_step coerente (interno; não exposto no contrato de decisão) ---
function getNextStep(
  architecture: DiagnosisInput['meta']['architecture'],
  payload: {
    level?: RiskLevel
    blocker_type?: BlockerType
    profile_type?: ProfileTypeName
    score?: number
    warning?: boolean
    top_gaps?: string[]
  }
): string {
  switch (architecture) {
    case 'RISK_DIAGNOSIS':
      return payload.level === 'alto'
        ? 'Recomendamos uma avaliação direcionada para definir o primeiro passo com segurança.'
        : 'O próximo passo é um plano simples e coerente com seu padrão atual.'
    case 'BLOCKER_DIAGNOSIS':
      return payload.blocker_type === 'rotina'
        ? 'O foco inicial é construir uma rotina mínima que sustente o resultado.'
        : 'O próximo passo é um ajuste prático nesse bloqueio no seu contexto.'
    case 'PROFILE_TYPE':
      return payload.profile_type === 'analitico'
        ? 'O caminho ideal para você inclui métricas e um plano claro passo a passo.'
        : 'O caminho ideal para seu perfil será adaptado na conversa.'
    case 'READINESS_CHECKLIST':
      return (payload.score ?? 0) < 50 && (payload.top_gaps?.length ?? 0) > 0
        ? `Priorize estes pontos primeiro: ${(payload.top_gaps ?? []).slice(0, 3).join(', ')}.`
        : 'Revisar os pontos críticos do checklist é o próximo passo.'
    case 'PROJECTION_CALCULATOR':
      return payload.warning
        ? 'Recomendamos recalibrar meta ou prazo para aumentar a chance de consistência.'
        : 'O próximo passo é montar um plano com base nessa projeção.'
    default:
      return 'O próximo passo será definido na conversa com o profissional.'
  }
}

/** Trunca em último ponto ou último espaço antes do limite (evita cortar no meio da palavra/frase). */
function truncateAtLastSentenceOrSpace(text: string, maxLen: number): string {
  const t = text.trim()
  if (t.length <= maxLen) return t
  const slice = t.slice(0, maxLen)
  const lastPoint = slice.lastIndexOf('.')
  const lastSpace = slice.lastIndexOf(' ')
  const cutAtPeriod = lastPoint >= 0 && lastPoint >= maxLen - 80 ? lastPoint + 1 : 0
  const cutAtSpace = lastSpace >= maxLen - 40 ? lastSpace : 0
  const cut = cutAtPeriod || cutAtSpace || maxLen
  return (cut < maxLen ? slice.slice(0, cut) : slice).trim()
}

/** Fallback seguro quando validação falha: não quebra UX; log + template que passa na validação. */
function getSafeFallback(
  theme: string,
  name: string,
  context: { main_blocker: string; profile_title: string; objective?: string }
): DiagnosisDecisionOutput {
  const nome = name || 'aí'
  const blocker = context.main_blocker || 'padrão a ajustar'
  const titulo = context.profile_title || `Seu padrão em ${theme}`
  const obj = context.objective ? ` (objetivo: ${context.objective})` : ''
  const out: DiagnosisDecisionOutput = {
    profile_title: titulo,
    profile_summary:
      'Seu resultado indica um padrão que merece atenção. Sinais se acumulam quando a estratégia não é ajustada no que realmente influencia o resultado. A boa notícia: com direção clara, dá para destravar progresso.',
    main_blocker: blocker,
    consequence:
      'Se isso continuar, é comum o problema ficar estável ou piorar mesmo com esforço isolado. O risco invisível é manter a mesma abordagem.',
    growth_potential:
      'A boa notícia: com ajustes direcionados e um plano coerente, dá para destravar progresso e melhorar o resultado.',
    cta_text: 'Analise seu caso',
    whatsapp_prefill: `Oi ${nome}, fiz a análise sobre ${theme}${obj}. Meu resultado apontou: ${blocker}. Quero entender o próximo passo para o meu caso.`,
  }
  validateDiagnosisDecision(out)
  return out
}

// --- main ---
export function generateDiagnosis(input: DiagnosisInput): DiagnosisGenerationResult {
  const { meta, professional, visitor_answers } = input
  const theme = meta.theme?.raw ?? 'seu objetivo'
  const name = professional?.name?.trim() || ''

  const slots: Record<string, string | number | undefined> = {
    THEME: theme,
    NAME: name || 'aí',
    LEVEL: '',
    BLOCKER: '',
    PROFILE: '',
    SCORE: '',
    DAYS: '',
  }

  let level: RiskLevel | undefined
  let score: number | undefined
  let profile_type: string | undefined
  let blocker_type: string | undefined
  let projection: { min?: number; max?: number; unit?: string } | undefined
  let evidence_bullets: string[] = []
  let next_step = ''
  let warning = false
  let top_gaps: string[] = []

  switch (meta.architecture) {
    case 'RISK_DIAGNOSIS': {
      const r = calcRiskLevel(visitor_answers)
      level = r.level
      evidence_bullets = r.evidence
      slots.LEVEL = r.level
      next_step = getNextStep(meta.architecture, { level })
      break
    }
    case 'BLOCKER_DIAGNOSIS': {
      const b = calcBlocker(visitor_answers)
      blocker_type = b.blocker_type
      evidence_bullets = b.evidence
      slots.BLOCKER = b.blocker_type
      next_step = getNextStep(meta.architecture, { blocker_type: b.blocker_type })
      break
    }
    case 'PROFILE_TYPE': {
      const p = calcProfile(visitor_answers)
      profile_type = p.profile_type
      evidence_bullets = p.evidence
      slots.PROFILE = p.profile_type
      next_step = getNextStep(meta.architecture, { profile_type: p.profile_type })
      break
    }
    case 'READINESS_CHECKLIST': {
      const r = calcReadiness(visitor_answers)
      score = r.score
      top_gaps = r.top_gaps
      evidence_bullets = r.evidence
      slots.SCORE = r.score
      next_step = getNextStep(meta.architecture, { score: r.score, top_gaps: r.top_gaps })
      break
    }
    case 'PROJECTION_CALCULATOR': {
      const proj = calcProjection(visitor_answers)
      projection = proj.projection
      evidence_bullets = proj.evidence
      warning = proj.warning
      next_step = getNextStep(meta.architecture, { warning: proj.warning })
      break
    }
  }

  const arch = meta.architecture
  const t = DIAGNOSIS_TEMPLATES[arch]
  const profile_title = pickTitle(arch, slots)
  const explanation = fillSlots(t.explanation, slots)
  let profile_summary = explanation.trim()
  if (profile_summary.length < 180) {
    profile_summary = (profile_summary + ' Se você mantiver isso, o resultado tende a ficar instável.').trim()
  }
  profile_summary = truncateAtLastSentenceOrSpace(profile_summary, 350)
  const main_blocker = getMainBlocker(arch, {
    level,
    blocker_type: blocker_type ?? undefined,
    profile_type,
    score,
    warning,
  })
  const consequence = fillSlots(t.consequence, slots)
  const growth_potential = fillSlots(t.possibility, slots)
  const cta_text = t.cta_imperative
  const whatsapp_prefill = fillSlots(t.whatsapp_prefill, {
    ...slots,
    NAME: name || 'aí',
    LEVEL: level ?? '',
    BLOCKER: blocker_type ?? main_blocker,
    PROFILE: profile_type ?? '',
    SCORE: score ?? '',
  })

  const result: DiagnosisDecisionOutput = {
    profile_title,
    profile_summary,
    main_blocker,
    consequence,
    growth_potential,
    cta_text,
    whatsapp_prefill,
  }
  try {
    validateDiagnosisDecision(result)
    return { diagnosis: result, fallbackUsed: false, level }
  } catch (err) {
    if (err instanceof DiagnosisValidationError) {
      console.warn('[generateDiagnosis] Validação falhou, aplicando fallback seguro:', err.field, err.message)
      const fallback = getSafeFallback(theme, name, {
        main_blocker,
        profile_title,
        objective: meta.objective,
      })
      return { diagnosis: fallback, fallbackUsed: true, level }
    }
    throw err
  }
}
