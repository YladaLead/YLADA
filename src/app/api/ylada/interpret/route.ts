/**
 * POST /api/ylada/interpret — Interpretação unificada (Noel pensa pelo profissional).
 * Recebe texto + perfil (ylada_noel_profile) e retorna em uma única chamada:
 * flow_id, theme, questions[], architecture, cta_suggestion, interpretacao.
 * Modo profile_first: sem text obrigatório; usa strategy-engine para diagnóstico + 2 estratégias.
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { interpretStrategyContext } from '@/lib/ylada/strategic-interpreter'
import { getFlowById, VALID_FLOW_IDS } from '@/config/ylada-flow-catalog'
import { SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import { getStrategyRecommendation } from '@/lib/ylada/strategy-engine'
import { buildProfileInput, fetchBehavior } from '@/lib/ylada/strategy-engine/profile-fetcher'
import type { ProfessionalDiagnosis } from '@/lib/ylada/strategy-engine'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DOR_VALUES = [
  'agenda_vazia',
  'nao_converte',
  'sem_indicacao',
  'conteudo_nao_funciona',
  'precificacao_ruim',
  'falta_de_clareza',
] as const

/** Objetivos do link. */
export const LINK_OBJECTIVES = ['captar', 'educar', 'reter', 'propagar', 'indicar'] as const
export type LinkObjective = (typeof LINK_OBJECTIVES)[number]

/** Interpretação estrutural (compatível com generate). */
export interface InterpretacaoEstrutural {
  objetivo: 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar'
  tema: string
  tipo_publico: 'pacientes' | 'clientes' | 'leads' | 'indicados' | string
  area_profissional: string
  contexto_detectado: string[]
}

/** Pergunta sugerida pela IA. */
export interface InterpretQuestion {
  id: string
  label: string
  type?: string
}

/** Resposta unificada do interpret. */
export interface InterpretResponse {
  flow_id: string
  flow_id_secondary?: string
  theme: string
  questions: InterpretQuestion[]
  architecture: string
  cta_suggestion: string
  interpretacao: InterpretacaoEstrutural
  profileSuggest: {
    segment?: string
    category?: string
    sub_category?: string
    dor_principal?: string
  }
  strategies: [string, string]
  strategyCards: Array<{ slot: string; flow_id: string; title: string; subtitle?: string; description?: string }>
  o_que_captar: string | null
  recommendedTemplateId: string | null
  recommendedTemplateName?: string
  diagnosticSummary?: string | null
  safe_theme?: string | null
  confidence: number
  /** Modo profile_first: diagnóstico estratégico do profissional. */
  professional_diagnosis?: ProfessionalDiagnosis | null
  /** Modo profile_first: foco recomendado (alias de professional_diagnosis.focus). */
  strategic_focus?: string | null
}

const SYSTEM_PROMPT = `Você é o Noel, assistente que pensa pelo profissional e infere o fluxo completo de link inteligente.

Entrada: texto livre do profissional (ex.: "Quero captar pessoas para perder peso") + contexto do perfil (área, profissão, dor, fase, objetivos).

Sua tarefa: em UMA resposta JSON, inferir TUDO que o profissional precisa para gerar o link:
1. flow_id: um de diagnostico_risco, diagnostico_bloqueio, calculadora_projecao, perfil_comportamental, checklist_prontidao
2. flow_id_secondary: outro flow_id para mostrar como alternativa (para o segundo card)
3. theme: 2 a 5 palavras do tema (ex.: perda de peso, emagrecimento)
4. questions: array de 3 a 6 perguntas para o formulário. Cada item: { "id": "q1", "label": "Texto da pergunta", "type": "text" }
5. architecture: RISK_DIAGNOSIS, BLOCKER_DIAGNOSIS, PROJECTION_CALCULATOR, PROFILE_TYPE ou READINESS_CHECKLIST (deve bater com flow_id)
6. cta_suggestion: texto do botão CTA (ex.: "Quero analisar meu caso", "Quero destravar isso")
7. interpretacao: { objetivo, tema, tipo_publico, area_profissional, contexto_detectado }
   - objetivo: captar | educar | reter | propagar | indicar
   - tema: mesmo que theme
   - tipo_publico: pacientes | clientes | leads | indicados
   - area_profissional: medico | nutricionista | psicologo | dentista | coach | vendedor | estetica | geral
   - contexto_detectado: array de 2 a 5 palavras (ex.: ["saude", "emagrecimento"])
8. confidence: 0.0 a 1.0

Regras:
- Se o tema envolver medicamentos, prescrição, caneta, injeção, semaglutida, ozempic etc → use flow_id diagnostico_bloqueio e architecture BLOCKER_DIAGNOSIS (evitar RISK_DIAGNOSIS)
- Para captar + saúde: diagnostico_risco ou diagnostico_bloqueio
- Para captar + profissional liberal: checklist_prontidao ou perfil_comportamental
- Para captar + vendas: checklist_prontidao ou calculadora_projecao
- Perguntas devem ser específicas ao tema e à área do profissional
- CTA em 1ª pessoa, consultivo (ex.: "Quero analisar meu caso", nunca "Falar com especialista")

Resposta APENAS em JSON válido, sem markdown.`

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const segmentHint = typeof body.segment === 'string' ? body.segment.trim() : 'ylada'
    const profileType = typeof body.profile_type === 'string' ? body.profile_type.trim() : null
    const profession = typeof body.profession === 'string' ? body.profession.trim() : null
    const objective = typeof body.objective === 'string' && LINK_OBJECTIVES.includes(body.objective as LinkObjective) ? body.objective as LinkObjective : null
    const variation = body.variation === true
    const modeProfileFirst = body.mode === 'profile_first'

    if (!modeProfileFirst && !text) {
      return NextResponse.json({ success: false, error: 'text é obrigatório (ou use mode: "profile_first")' }, { status: 400 })
    }

    if (!modeProfileFirst && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'Serviço de interpretação não configurado' }, { status: 503 })
    }

    // --- Modo profile_first: usa strategy-engine, sem IA ---
    if (modeProfileFirst) {
      const segment = segmentHint && YLADA_SEGMENT_CODES.includes(segmentHint as any) ? segmentHint : 'ylada'
      const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim() || null
      const profileInput = await buildProfileInput(user.id, segment, { profileType, profession, objective }, simulateKey)
      const behavior = await fetchBehavior(user.id)
      const recommendation = getStrategyRecommendation(profileInput, behavior)

      const [activation, authority] = recommendation.strategies
      const diagnosis = recommendation.professional_diagnosis

      const questionsForInterpret = activation.questions.map((q) => ({
        id: q.key,
        label: q.label,
        type: q.type,
      }))

      const areaProf = profileInput.area_profissional ?? profileInput.profession ?? 'geral'
      const interpretacao: InterpretacaoEstrutural = {
        objetivo: 'captar',
        tema: activation.theme,
        tipo_publico: 'pacientes',
        area_profissional: areaProf,
        contexto_detectado: diagnosis.summary_lines.slice(0, 3),
      }

      const flow1 = getFlowById(activation.flow_id)
      const flow2 = getFlowById(authority.flow_id)
      const strategyCards = [
        { slot: 'qualidade' as const, flow_id: activation.flow_id, title: activation.title, subtitle: 'Conversas Diretas', description: activation.reason },
        { slot: 'volume' as const, flow_id: authority.flow_id, title: authority.title, subtitle: 'Autoridade', description: authority.reason },
      ]

      let recommendedTemplateId: string | null = null
      if (supabaseAdmin) {
        const templateType = flow1?.architecture === 'PROJECTION_CALCULATOR' ? 'calculator' : 'diagnostico'
        const { data: t } = await supabaseAdmin
          .from('ylada_link_templates')
          .select('id')
          .eq('type', templateType)
          .eq('active', true)
          .limit(1)
          .maybeSingle()
        recommendedTemplateId = t?.id ?? null
      }

      const response: InterpretResponse = {
        flow_id: activation.flow_id,
        flow_id_secondary: authority.flow_id,
        theme: activation.theme,
        questions: questionsForInterpret,
        architecture: flow1?.architecture ?? 'BLOCKER_DIAGNOSIS',
        cta_suggestion: activation.cta_suggestion,
        interpretacao,
        profileSuggest: { segment: 'ylada', category: areaProf },
        strategies: [activation.flow_id, authority.flow_id],
        strategyCards,
        o_que_captar: activation.theme,
        recommendedTemplateId,
        recommendedTemplateName: flow1?.architecture === 'PROJECTION_CALCULATOR' ? 'calculadora_perda' : 'diagnostico_agenda',
        diagnosticSummary: `Fluxo "${activation.title}" com ${activation.questions.length} pergunta(s). ${activation.reason}`,
        safe_theme: null,
        confidence: 0.95,
        professional_diagnosis: diagnosis,
        strategic_focus: diagnosis.focus,
      }

      return NextResponse.json({ success: true, data: response })
    }

    // Buscar perfil do profissional (ylada_noel_profile)
    let profileContext = ''
    if (supabaseAdmin) {
      const segment = segmentHint && YLADA_SEGMENT_CODES.includes(segmentHint as any) ? segmentHint : 'ylada'
      const { data: profileRow } = await supabaseAdmin
        .from('ylada_noel_profile')
        .select('profile_type, profession, category, sub_category, dor_principal, fase_negocio, prioridade_atual, objetivos_curto_prazo, metas_principais')
        .eq('user_id', user.id)
        .eq('segment', segment)
        .maybeSingle()

      if (profileRow) {
        const parts: string[] = []
        if (profileRow.profile_type) parts.push(`Tipo: ${profileRow.profile_type}`)
        if (profileRow.profession) parts.push(`Profissão: ${profileRow.profession}`)
        if (profileRow.category) parts.push(`Categoria: ${profileRow.category}`)
        if (profileRow.sub_category) parts.push(`Subcategoria: ${profileRow.sub_category}`)
        if (profileRow.dor_principal) parts.push(`Principal dor: ${profileRow.dor_principal}`)
        if (profileRow.fase_negocio) parts.push(`Fase do negócio: ${profileRow.fase_negocio}`)
        if (profileRow.prioridade_atual) parts.push(`Prioridade: ${profileRow.prioridade_atual}`)
        if (profileRow.objetivos_curto_prazo) parts.push(`Objetivos: ${profileRow.objetivos_curto_prazo}`)
        if (profileRow.metas_principais) parts.push(`Metas: ${profileRow.metas_principais}`)
        if (parts.length) profileContext = `Perfil do profissional:\n${parts.join('\n')}\n\n`
      }
    }

    // Overrides do body (podem vir da UI antes do perfil estar salvo)
    const overrides: string[] = []
    if (profileType) overrides.push(`Tipo de atuação: ${profileType}`)
    if (profession) overrides.push(`Área/profissão: ${profession}`)
    if (objective) overrides.push(`Objetivo do link: ${objective}`)
    if (variation) overrides.push('O usuário pediu OUTRA IDEIA: sugira a opção alternativa (ex.: se antes era quiz, sugira calculadora).')
    if (overrides.length) profileContext += `Contexto adicional:\n${overrides.join('\n')}\n\n`

    const userMessage = `${profileContext}Texto do profissional:\n${text}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const parsed = parseUnifiedResponse(raw)

    if (!parsed) {
      console.warn('[ylada/interpret] Resposta da IA não é JSON válido:', raw.slice(0, 200))
      return NextResponse.json({
        success: true,
        data: buildFallbackResponse(text),
      })
    }

    // Validar flow_id
    const flowId = VALID_FLOW_IDS.includes(parsed.flow_id) ? parsed.flow_id : 'diagnostico_bloqueio'
    const flowIdSecondary = parsed.flow_id_secondary && VALID_FLOW_IDS.includes(parsed.flow_id_secondary)
      ? parsed.flow_id_secondary
      : flowId

    // Camada 0: segurança (tema sensível → forçar BLOCKER)
    const strategyDecision = interpretStrategyContext({
      objective: parsed.interpretacao?.objetivo ?? 'captar',
      theme_raw: parsed.theme ?? parsed.interpretacao?.tema ?? '',
      area_profissional: parsed.interpretacao?.area_profissional,
    })

    let finalFlowId = flowId
    if (strategyDecision.safety_mode && strategyDecision.allowed_architectures.length === 1) {
      const blockerFlow = VALID_FLOW_IDS.find((id) => getFlowById(id)?.architecture === 'BLOCKER_DIAGNOSIS')
      if (blockerFlow) finalFlowId = blockerFlow
    }

    // Montar strategies e strategyCards
    const strategies: [string, string] = [finalFlowId, flowIdSecondary === finalFlowId ? flowIdSecondary : flowIdSecondary]
    const flow1 = getFlowById(finalFlowId)
    const flow2 = getFlowById(flowIdSecondary)
    const strategyCards = [
      { slot: 'qualidade' as const, flow_id: finalFlowId, title: flow1?.display_name ?? 'Estratégia 1', subtitle: flow1?.type ?? 'Qualidade', description: flow1?.impact_line },
      { slot: 'volume' as const, flow_id: flowIdSecondary, title: flow2?.display_name ?? 'Estratégia 2', subtitle: flow2?.type ?? 'Volume', description: flow2?.impact_line },
    ]

    // ProfileSuggest
    const areaProf = parsed.interpretacao?.area_profissional ?? 'geral'
    if (parsed.profileSuggest?.segment && !YLADA_SEGMENT_CODES.includes(parsed.profileSuggest.segment as any)) {
      parsed.profileSuggest.segment = 'ylada'
    }
    if (parsed.profileSuggest?.dor_principal && !DOR_VALUES.includes(parsed.profileSuggest.dor_principal as any)) {
      parsed.profileSuggest.dor_principal = undefined
    }

    // recommendedTemplateId: mapear flow para template (generate usa flow_id, mas UI legado pode precisar)
    const templateByArch = (getFlowById(finalFlowId)?.architecture ?? '') === 'PROJECTION_CALCULATOR' ? 'calculator' : 'diagnostico'
    let recommendedTemplateId: string | null = null
    if (supabaseAdmin) {
      const { data: t } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('id')
        .eq('type', templateByArch)
        .eq('active', true)
        .limit(1)
        .maybeSingle()
      recommendedTemplateId = t?.id ?? null
    }

    const response: InterpretResponse = {
      flow_id: finalFlowId,
      flow_id_secondary: flowIdSecondary,
      theme: parsed.theme ?? parsed.interpretacao?.tema ?? '',
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      architecture: parsed.architecture ?? flow1?.architecture ?? 'BLOCKER_DIAGNOSIS',
      cta_suggestion: parsed.cta_suggestion ?? flow1?.cta_default ?? 'Quero analisar meu caso',
      interpretacao: parsed.interpretacao ?? buildDefaultInterpretacao(text),
      profileSuggest: parsed.profileSuggest ?? { segment: 'ylada', category: areaProf },
      strategies,
      strategyCards,
      o_que_captar: parsed.theme ?? parsed.interpretacao?.tema ?? null,
      recommendedTemplateId,
      recommendedTemplateName: templateByArch === 'calculator' ? 'calculadora_perda' : 'diagnostico_agenda',
      diagnosticSummary: buildDiagnosticSummary(finalFlowId, parsed.questions),
      safe_theme: strategyDecision.safety_mode ? strategyDecision.safe_theme : null,
      confidence: typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.8,
    }

    return NextResponse.json({ success: true, data: response })
  } catch (e) {
    console.error('[ylada/interpret]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao interpretar texto' },
      { status: 500 }
    )
  }
}

function parseUnifiedResponse(raw: string): Partial<InterpretResponse> | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const obj = JSON.parse(cleaned) as Record<string, unknown>

    const objetivo = typeof obj.interpretacao === 'object' && obj.interpretacao && typeof (obj.interpretacao as Record<string, unknown>).objetivo === 'string'
      && LINK_OBJECTIVES.includes((obj.interpretacao as Record<string, unknown>).objetivo as LinkObjective)
      ? (obj.interpretacao as Record<string, unknown>).objetivo as LinkObjective
      : 'captar'
    const tema = typeof obj.theme === 'string' ? obj.theme.trim() : (typeof (obj.interpretacao as Record<string, unknown>)?.tema === 'string' ? (obj.interpretacao as Record<string, unknown>).tema as string : '')
    const tipoPublico = typeof (obj.interpretacao as Record<string, unknown>)?.tipo_publico === 'string' ? (obj.interpretacao as Record<string, unknown>).tipo_publico as string : 'pacientes'
    const areaProf = typeof (obj.interpretacao as Record<string, unknown>)?.area_profissional === 'string' ? (obj.interpretacao as Record<string, unknown>).area_profissional as string : 'geral'
    const contextoDetectado = Array.isArray((obj.interpretacao as Record<string, unknown>)?.contexto_detectado)
      ? ((obj.interpretacao as Record<string, unknown>).contexto_detectado as string[]).filter((x): x is string => typeof x === 'string').slice(0, 6)
      : []

    const interpretacao: InterpretacaoEstrutural = {
      objetivo,
      tema: tema || 'interesse do profissional',
      tipo_publico: tipoPublico || 'pacientes',
      area_profissional: areaProf || 'geral',
      contexto_detectado: contextoDetectado,
    }

    const questions: InterpretQuestion[] = Array.isArray(obj.questions)
      ? (obj.questions as unknown[]).map((q, i) => {
          const item = q as Record<string, unknown>
          return {
            id: typeof item.id === 'string' ? item.id : `q${i + 1}`,
            label: typeof item.label === 'string' ? item.label : 'Pergunta',
            type: typeof item.type === 'string' ? item.type : 'text',
          }
        })
      : []

    return {
      flow_id: typeof obj.flow_id === 'string' ? obj.flow_id : 'diagnostico_bloqueio',
      flow_id_secondary: typeof obj.flow_id_secondary === 'string' ? obj.flow_id_secondary : undefined,
      theme: tema || interpretacao.tema,
      questions,
      architecture: typeof obj.architecture === 'string' ? obj.architecture : 'BLOCKER_DIAGNOSIS',
      cta_suggestion: typeof obj.cta_suggestion === 'string' ? obj.cta_suggestion : '',
      interpretacao,
      profileSuggest: obj.profileSuggest && typeof obj.profileSuggest === 'object' ? obj.profileSuggest as InterpretResponse['profileSuggest'] : {},
      confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.8,
    }
  } catch {
    return null
  }
}

function buildDefaultInterpretacao(text: string): InterpretacaoEstrutural {
  return {
    objetivo: 'captar',
    tema: text.slice(0, 50) || 'interesse do profissional',
    tipo_publico: 'pacientes',
    area_profissional: 'geral',
    contexto_detectado: [],
  }
}

function buildDiagnosticSummary(flowId: string, questions: InterpretQuestion[]): string {
  const flow = getFlowById(flowId)
  if (!flow) return ''
  const n = Array.isArray(questions) && questions.length ? questions.length : flow.question_labels.length
  return `Fluxo "${flow.display_name}" com ${n} pergunta(s). O visitante responde e recebe um diagnóstico; depois pode clicar no WhatsApp.`
}

function buildFallbackResponse(text: string): InterpretResponse {
  const flowId = 'diagnostico_bloqueio'
  const flow = getFlowById(flowId)
  return {
    flow_id: flowId,
    theme: text.slice(0, 50) || 'seu tema',
    questions: (flow?.question_labels ?? []).map((label, i) => ({ id: `q${i + 1}`, label, type: 'text' })),
    architecture: 'BLOCKER_DIAGNOSIS',
    cta_suggestion: flow?.cta_default ?? 'Quero analisar meu caso',
    interpretacao: buildDefaultInterpretacao(text),
    profileSuggest: {},
    strategies: [flowId, 'checklist_prontidao'],
    strategyCards: [
      { slot: 'qualidade', flow_id: flowId, title: flow?.display_name ?? 'Raio-X', subtitle: 'Volume', description: flow?.impact_line },
      { slot: 'volume', flow_id: 'checklist_prontidao', title: 'Checklist de Prontidão', subtitle: 'Qualidade', description: 'Leads que já se veem prontos.' },
    ],
    o_que_captar: null,
    recommendedTemplateId: null,
    diagnosticSummary: buildDiagnosticSummary(flowId, []),
    confidence: 0,
  }
}

