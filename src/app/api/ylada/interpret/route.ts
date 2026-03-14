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
import { YLADA_SEGMENT_CODES, YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
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
  options?: string[]
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
4. questions: array de 3 a 6 perguntas. Para QUIZ (diagnostico_risco, diagnostico_bloqueio, checklist_prontidao, perfil_comportamental): cada item deve ter { "id": "q1", "label": "Texto da pergunta", "type": "single", "options": ["Opção A", "Opção B", "Opção C", "Opção D"] } com exatamente 4 opções cada. Para CALCULADORA (calculadora_projecao): use { "id": "q1", "label": "Texto", "type": "number" } sem options.
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
- Para captar + profissional liberal: diagnostico_bloqueio ou perfil_comportamental (evitar checklist_prontidao quando o link é para compartilhar)
- Para captar + vendas: diagnostico_bloqueio ou calculadora_projecao (evitar checklist_prontidao quando o link é para compartilhar)
- IMPORTANTE — Link para compartilhar: Quando o profissional pede link para "captar", "atrair clientes", "qualificar" — o link é para COMPARTILHAR com pacientes/clientes. As perguntas DEVEM ser do ponto de vista do PACIENTE/CLIENTE (ex.: "O que mais atrapalha você?", "Qual seu maior desafio hoje?", "Você consegue manter rotina?"). NUNCA use perguntas sobre a estratégia do profissional (ex.: "Você definiu seu público-alvo?", "Você tem estratégia de marketing?", "Você usa redes sociais para atrair?") — essas são para o profissional se autoavaliar, não para compartilhar.
- Tema (theme): Use APENAS o tema do ponto de vista do paciente (ex.: "cáries e saúde bucal", "perda de peso"). NUNCA inclua no tema termos como "atração de pacientes", "captação", "captar clientes" — o paciente não deve ver isso no resultado.
- Use checklist_prontidao APENAS quando o profissional deixar explícito que quer um link para ELE MESMO avaliar sua estratégia (ex.: "quero um quiz para eu ver como estou", "link para eu avaliar minha prontidão").
- Use o segmento/área do profissional: medico/nutricionista → perguntas clínicas (ex.: exames, medicamentos, acompanhamento); estetica → pele, tratamentos, procedimentos; dentista → saúde bucal; coach → objetivos, bloqueios. NUNCA use perguntas genéricas de coaching quando o perfil for médico ou de saúde.
- ESTRUTURA 4D DO DIAGNÓSTICO (para diagnostico_risco e diagnostico_bloqueio): SEMPRE gere perguntas em 4 dimensões, nesta ordem (mini funil: identificação → qualificação → conversa):
  1. Situação (identificação): a PRIMEIRA pergunta decide 70-80% da retenção. OBRIGATÓRIO: "Qual dessas situações mais parece com você hoje?" ou "Qual dessas situações acontece mais com você?" — situação real + identificação rápida. Opções curtas que a pessoa reconhece na hora (ex.: "tento emagrecer mas o peso volta", "metabolismo parece mais lento", "dificuldade em manter dieta").
  2. Tentativa anterior (histórico): o que já tentou (ex.: "O que você já tentou para emagrecer?", "Nos últimos 12 meses, você já tentou o quê?") — mais fácil de responder logo após identificação.
  3. Causa/bloqueio: o que mais dificulta (ex.: "O que mais dificulta seu emagrecimento hoje?", "Qual dessas situações parece mais relacionada ao seu caso?")
  4. Objetivo: o que quer melhorar (ex.: "O que você gostaria de melhorar agora?", "Qual é seu principal objetivo?")
- PROIBIDO na primeira pergunta (geram abandono): "Como você organiza sua rotina...", "Com que frequência...", "Como você avalia...", "Como você se sente em relação à motivação..." — exigem reflexão, parecem questionário psicológico, não criam identificação.
- PROIBIDO em qualquer pergunta: motivação, organização, disciplina, expectativas abstratas — são perguntas de coaching, não de diagnóstico. Foque em: situação real, tentativa, objetivo.
- Opções: curtas, situações reais, que gerem identificação (ex.: "emagrecer ficou mais difícil" vs "pouco motivado").
- QUIZ = sempre com 4 opções. CALCULADORA = campos numéricos sem opções.
- CTA em 1ª pessoa, consultivo (ex.: "Quero analisar meu caso", nunca "Falar com especialista")

Resposta APENAS em JSON válido, sem markdown.`

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const segmentHint = typeof body.segment === 'string' ? body.segment.trim() : 'ylada'
    const locale = (body.locale === 'en' || body.locale === 'es') ? body.locale as 'en' | 'es' : null
    const profileType = typeof body.profile_type === 'string' ? body.profile_type.trim() : null
    const profession = typeof body.profession === 'string' ? body.profession.trim() : null
    const objective = typeof body.objective === 'string' && LINK_OBJECTIVES.includes(body.objective as LinkObjective) ? body.objective as LinkObjective : null
    const variation = body.variation === true
    const modeProfileFirst = body.mode === 'profile_first'
    const previousLinkContext = body.previousLinkContext && typeof body.previousLinkContext === 'object'
      ? body.previousLinkContext as { flow_id?: string; theme?: string; questions?: Array<{ id?: string; label?: string }> }
      : null

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

    if (locale === 'en') {
      profileContext += `CRITICAL: The professional's audience speaks ENGLISH. Generate ALL questions (labels and options) in ENGLISH. Do NOT use Portuguese.\n\n`
    } else if (locale === 'es') {
      profileContext += `CRITICAL: The professional's audience speaks SPANISH. Generate ALL questions (labels and options) in SPANISH. Do NOT use Portuguese.\n\n`
    }

    let userMessage = `${profileContext}Texto do profissional:\n${text}`
    if (previousLinkContext?.flow_id) {
      const prevQuestions = Array.isArray(previousLinkContext.questions)
        ? previousLinkContext.questions
            .map((q, i) => {
              const opts = Array.isArray((q as { options?: string[] }).options) ? (q as { options: string[] }).options : []
              return opts.length > 0
                ? `${i + 1}. ${q.label ?? q.id ?? ''} (opções: ${opts.join(' | ')})`
                : `${i + 1}. ${q.label ?? q.id ?? ''}`
            })
            .join('\n')
        : ''
      userMessage = `${profileContext}CONTEXTO DE AJUSTE: O profissional está pedindo alteração no link que acabou de criar.
Link anterior: tema="${previousLinkContext.theme ?? ''}", flow_id=${previousLinkContext.flow_id}
Perguntas anteriores:
${prevQuestions || '(nenhuma)'}

Pedido de ajuste do profissional:
${text}

REGRAS: Retorne o JSON com flow_id (mantenha o mesmo), theme, e questions AJUSTADAS conforme o pedido.
- Se pedir ADICIONAR ou INCLUIR uma pergunta (mesmo sem especificar qual): sugira uma pergunta relevante ao tema e ADICIONE ao array questions. O array DEVE ter 5 itens.
- Se pedir trocar/remover: faça a alteração. Mantenha o que não foi pedido para mudar.
- Para QUIZ: cada pergunta deve ter options com exatamente 4 opções (A, B, C, D).`
    }

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

    // Priorizar diagnostico_risco ou diagnostico_bloqueio para temas de saúde/paciente (emagrecimento, intestino, etc.)
    // Evitar checklist_prontidao que gera score X/100 e perguntas genéricas
    const themeLower = (parsed.theme ?? parsed.interpretacao?.tema ?? text).toString().toLowerCase()
    const isPatientHealthTheme = /emagrecimento|perda de peso|intestino|energia|bem-estar|ansiedade|sono|suplementação|pele|clareamento|implantes|alimentação|saúde|peso|dieta|b12/.test(themeLower)
    if (isPatientHealthTheme && (finalFlowId === 'checklist_prontidao' || flowId === 'checklist_prontidao')) {
      const riskFlow = VALID_FLOW_IDS.find((id) => getFlowById(id)?.architecture === 'RISK_DIAGNOSIS')
      const blockerFlow = VALID_FLOW_IDS.find((id) => getFlowById(id)?.architecture === 'BLOCKER_DIAGNOSIS')
      finalFlowId = riskFlow ?? blockerFlow ?? 'diagnostico_risco'
    }

    // Link para compartilhar (atrair clientes, captar): checklist_prontidao gera perguntas sobre a estratégia do profissional.
    // Redirecionar para diagnostico_bloqueio (perguntas do ponto de vista do paciente).
    const isShareIntentTheme = /atrair clientes|captar clientes|captar pacientes|captação|link para atrair|qualificar quem quer/.test(themeLower)
    const objetivoCaptar = (parsed.interpretacao?.objetivo ?? 'captar') === 'captar'
    let questionsFinal = Array.isArray(parsed.questions) ? parsed.questions : []
    if (isShareIntentTheme && objetivoCaptar && (finalFlowId === 'checklist_prontidao' || flowId === 'checklist_prontidao')) {
      const blockerFlow = VALID_FLOW_IDS.find((id) => getFlowById(id)?.architecture === 'BLOCKER_DIAGNOSIS')
      if (blockerFlow) {
        finalFlowId = blockerFlow
        // Descartar perguntas de autoavaliação do profissional; o generate usará as do fluxo (paciente)
        questionsFinal = []
      }
    }

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
      questions: questionsFinal.length > 0 ? questionsFinal : (Array.isArray(parsed.questions) ? parsed.questions : []),
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
          const opts = Array.isArray(item.options)
            ? (item.options as unknown[]).filter((x): x is string => typeof x === 'string').slice(0, 6)
            : undefined
          return {
            id: typeof item.id === 'string' ? item.id : `q${i + 1}`,
            label: typeof item.label === 'string' ? item.label : 'Pergunta',
            type: typeof item.type === 'string' ? item.type : opts?.length ? 'single' : 'text',
            options: opts && opts.length > 0 ? opts : undefined,
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
      { slot: 'qualidade', flow_id: flowId, title: flow?.display_name ?? 'Diagnóstico', subtitle: 'Volume', description: flow?.impact_line },
      { slot: 'volume', flow_id: 'checklist_prontidao', title: 'Checklist de Prontidão', subtitle: 'Qualidade', description: 'Leads que já se veem prontos.' },
    ],
    o_que_captar: null,
    recommendedTemplateId: null,
    diagnosticSummary: buildDiagnosticSummary(flowId, []),
    confidence: 0,
  }
}

