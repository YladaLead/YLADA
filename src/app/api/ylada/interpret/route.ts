/**
 * POST /api/ylada/interpret — Interpretação Estrutural + Estratégias (Etapa 1 + 3).
 * Transforma texto livre em estrutura e retorna 2 estratégias (qualidade + volume) via getStrategies.
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md (Etapa 3)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { getStrategies, interpretStrategyContext } from '@/lib/ylada'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** IDs dos templates no seed (208) */
const TEMPLATE_IDS = {
  diagnostico_agenda: 'a0000001-0001-4000-8000-000000000001',
  calculadora_perda: 'a0000002-0002-4000-8000-000000000002',
} as const

const DOR_VALUES = [
  'agenda_vazia',
  'nao_converte',
  'sem_indicacao',
  'conteudo_nao_funciona',
  'precificacao_ruim',
  'falta_de_clareza',
] as const

/** Saída da Etapa 1 — interpretação pura (sem decisão de fluxo). */
export interface InterpretacaoEstrutural {
  objetivo: 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar'
  tema: string
  tipo_publico: 'pacientes' | 'clientes' | 'leads' | 'indicados' | string
  area_profissional: string
  contexto_detectado: string[]
}

export interface InterpretResponse {
  /** Etapa 1: saída estrutural. */
  interpretacao?: InterpretacaoEstrutural | null
  /** Etapa 3: 2 IDs do catálogo [qualidade, volume] para os cards de estratégia. */
  strategies?: [string, string]
  profileSuggest: {
    segment?: string
    category?: string
    sub_category?: string
    dor_principal?: string
  }
  /** Tema (espelho de interpretacao.tema para compatibilidade). */
  o_que_captar?: string | null
  recommendedTemplateId: string | null
  recommendedTemplateName?: string
  diagnosticSummary?: string | null
  confidence: number
}

/** Objetivos do link: norte para sugerir quiz vs calculadora e texto. */
export const LINK_OBJECTIVES = ['captar', 'educar', 'reter', 'propagar', 'indicar'] as const
export type LinkObjective = (typeof LINK_OBJECTIVES)[number]

/** ETAPA 1 — Interpretação Estrutural. Só extrai e classifica; NÃO sugere fluxo nem template. */
const SYSTEM_PROMPT_ETAPA1 = `Você é um assistente que transforma o que o PROFISSIONAL escreveu em ESTRUTURA CLARA. Você NÃO sugere fluxo, quiz ou calculadora. Apenas interpreta e classifica.

Entrada: texto livre (ex.: "Quero captar pessoas para perder peso"). Tarefas: 1) OBJETIVO: um de captar, educar, reter, propagar, indicar. 2) TEMA: 2 a 5 palavras (ex.: perda de peso, emagrecimento). 3) TIPO_PUBLICO: pacientes, clientes, leads, indicados. 4) AREA_PROFISSIONAL: medico, nutricionista, psicologo, dentista, coach, vendedor, estetica. 5) CONTEXTO_DETECTADO: array 2 a 5 palavras (ex.: saude, emagrecimento).

IMPORTANTE: Se no Contexto for informado "Tipo de atuação" ou "Área/profissão" do profissional, USE ESSES VALORES para preencher tipo_publico e area_profissional na resposta (ex.: medico → area_profissional "medico", liberal → tipo_publico "pacientes" quando fizer sentido). Só mude se o texto do usuário indicar outra área ou público de forma explícita.

Resposta em JSON exato: {"objetivo":"...","tema":"...","tipo_publico":"...","area_profissional":"...","contexto_detectado":[...],"confidence":0.0 a 1.0}


`

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth

    const body = await request.json().catch(() => ({}))
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const segmentHint = typeof body.segment === 'string' ? body.segment.trim() : null
    const profileType = typeof body.profile_type === 'string' ? body.profile_type.trim() : null
    const profession = typeof body.profession === 'string' ? body.profession.trim() : null
    const objective = typeof body.objective === 'string' && LINK_OBJECTIVES.includes(body.objective as LinkObjective) ? body.objective as LinkObjective : null
    const variation = body.variation === true
    const previousTemplateId = typeof body.previous_template_id === 'string' ? body.previous_template_id : null

    if (!text) {
      return NextResponse.json({ success: false, error: 'text é obrigatório' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'Serviço de interpretação não configurado' }, { status: 503 })
    }

    const profileContext: string[] = []
    if (segmentHint) profileContext.push(`Segmento: ${segmentHint}`)
    if (profileType) profileContext.push(`Tipo de atuação do profissional: ${profileType}`)
    if (profession) profileContext.push(`Área/profissão: ${profession}`)
    if (objective) profileContext.push(`Objetivo principal do link: ${objective} (use para priorizar quiz ou calculadora e o tom da sugestão)`)
    if (variation) profileContext.push('O usuário pediu OUTRA IDEIA: sugira a opção alternativa (se antes era quiz, sugira calculadora; se era calculadora, sugira quiz), desde que faça sentido para o texto.')
    const contextBlock = profileContext.length
      ? `Contexto:\n${profileContext.join('\n')}\n\n`
      : ''

    const userMessage = `${contextBlock}Texto do usuário:\n${text}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_ETAPA1 },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.3,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const parsed = parseInterpretResponse(raw)

    if (!parsed) {
      const fallbackStrategies = getStrategies({
        objetivo: 'captar',
        area_profissional: 'geral',
      })
      console.warn('[ylada/interpret] Resposta da IA não é JSON válido:', raw.slice(0, 200))
      return NextResponse.json({
        success: true,
        data: {
          interpretacao: null,
          strategies: [fallbackStrategies.qualityFlowId, fallbackStrategies.volumeFlowId],
          profileSuggest: {},
          o_que_captar: null,
          recommendedTemplateId: null,
          recommendedTemplateName: null,
          diagnosticSummary: null,
          confidence: 0,
          raw: raw.slice(0, 300),
        } as InterpretResponse,
      })
    }

    // Validar segment e dor contra listas conhecidas
    if (parsed.profileSuggest?.segment && !YLADA_SEGMENT_CODES.includes(parsed.profileSuggest.segment as any)) {
      parsed.profileSuggest.segment = 'ylada'
    }
    if (parsed.profileSuggest?.dor_principal && !DOR_VALUES.includes(parsed.profileSuggest.dor_principal as any)) {
      parsed.profileSuggest.dor_principal = undefined
    }
    // Garantir que recommendedTemplateId seja um dos nossos
    const templateIds = Object.values(TEMPLATE_IDS)
    if (parsed.recommendedTemplateId && !templateIds.includes(parsed.recommendedTemplateId)) {
      parsed.recommendedTemplateId = null
      parsed.recommendedTemplateName = undefined
    }

    // "Quero outra ideia": forçar o outro template se veio o mesmo
    if (variation && previousTemplateId && templateIds.includes(previousTemplateId)) {
      const otherId = templateIds.find((id) => id !== previousTemplateId)
      if (otherId) {
        parsed.recommendedTemplateId = otherId
        parsed.recommendedTemplateName = otherId === TEMPLATE_IDS.diagnostico_agenda ? 'diagnostico_agenda' : 'calculadora_perda'
      }
    }

    // Etapa 3: decidir 2 estratégias (qualidade + volume) a partir da interpretação
    const strategiesResult = getStrategies({
      objetivo: parsed.interpretacao?.objetivo ?? 'captar',
      area_profissional: parsed.interpretacao?.area_profissional ?? 'geral',
      tema: parsed.interpretacao?.tema,
      tipo_publico: parsed.interpretacao?.tipo_publico,
    })
    const strategies: [string, string] = [
      strategiesResult.qualityFlowId,
      strategiesResult.volumeFlowId,
    ]
    const strategyCards = strategiesResult.strategyCards ?? []
    const interpretacaoForContext = parsed.interpretacao
    const decision = interpretStrategyContext({
      objective: interpretacaoForContext?.objetivo ?? 'captar',
      theme_raw: interpretacaoForContext?.tema ?? '',
      area_profissional: interpretacaoForContext?.area_profissional,
    })
    const safe_theme = decision.safety_mode ? decision.safe_theme : undefined

    // Processo reverso: resumo do diagnóstico (conteúdo oficial do template) para o profissional apenas validar
    let diagnosticSummary: string | null = null
    if (parsed.recommendedTemplateId && supabaseAdmin) {
      const { data: template } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('type, schema_json')
        .eq('id', parsed.recommendedTemplateId)
        .maybeSingle()
      if (template?.schema_json) {
        diagnosticSummary = buildDiagnosticSummary(template.type, template.schema_json as Record<string, unknown>)
      }
    }
    const response = { ...parsed, strategies, strategyCards, safe_theme, diagnosticSummary }

    return NextResponse.json({ success: true, data: response })
  } catch (e) {
    console.error('[ylada/interpret]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao interpretar texto' },
      { status: 500 }
    )
  }
}

function buildDiagnosticSummary(type: string, schema: Record<string, unknown>): string {
  const title = typeof schema.title === 'string' ? schema.title : 'Link'
  if (type === 'diagnostico' || type === 'quiz') {
    const questions = Array.isArray(schema.questions) ? schema.questions : []
    const results = Array.isArray(schema.results) ? schema.results : []
    const labels = results
      .map((r: unknown) => (r && typeof r === 'object' && 'label' in r ? (r as { label: string }).label : null))
      .filter(Boolean)
    const n = questions.length
    const resultText = labels.length ? ` Resultados possíveis: ${labels.join(', ')}.` : ''
    return `Quiz com ${n} pergunta(s). Título: "${title}".${resultText} O visitante responde e recebe um resultado; depois pode clicar no WhatsApp.`
  }
  if (type === 'calculator') {
    const fields = Array.isArray(schema.fields) ? schema.fields : []
    const resultLabel = typeof schema.resultLabel === 'string' ? schema.resultLabel : 'Resultado'
    return `Calculadora com ${fields.length} campo(s). Título: "${title}". ${resultLabel} O visitante preenche, vê o resultado e pode clicar no WhatsApp.`
  }
  return `Ferramenta: "${title}". Conteúdo oficial da plataforma.`
}

/** Fallback: escolhe template por regra a partir da interpretação (Etapa 1). Etapa 3 fará a decisão de verdade. */
function fallbackTemplateFromInterpretacao(interpretacao: InterpretacaoEstrutural | null): { id: string; name: string } {
  const tema = (interpretacao?.tema ?? '').toLowerCase()
  const contexto = (interpretacao?.contexto_detectado ?? []).join(' ').toLowerCase()
  const texto = `${tema} ${contexto}`
  if (/faturamento|potencial de receita|potencial financeiro|capacidade de atendimentos/.test(texto)) {
    return { id: TEMPLATE_IDS.calculadora_perda, name: 'calculadora_perda' }
  }
  return { id: TEMPLATE_IDS.diagnostico_agenda, name: 'diagnostico_agenda' }
}

function parseInterpretResponse(raw: string): InterpretResponse | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const obj = JSON.parse(cleaned) as Record<string, unknown>
    const confidence = typeof obj.confidence === 'number' ? Math.max(0, Math.min(1, obj.confidence)) : 0

    const objetivo = typeof obj.objetivo === 'string' && LINK_OBJECTIVES.includes(obj.objetivo as LinkObjective)
      ? obj.objetivo as LinkObjective
      : 'captar'
    const tema = typeof obj.tema === 'string' ? obj.tema.trim() || 'interesse do profissional' : 'interesse do profissional'
    const tipoPublico = typeof obj.tipo_publico === 'string' ? obj.tipo_publico.trim() || 'pacientes' : 'pacientes'
    const areaProfissional = typeof obj.area_profissional === 'string' ? obj.area_profissional.trim() || 'geral' : 'geral'
    const contextoDetectado = Array.isArray(obj.contexto_detectado)
      ? obj.contexto_detectado.filter((x): x is string => typeof x === 'string').slice(0, 6)
      : []

    const interpretacao: InterpretacaoEstrutural = {
      objetivo,
      tema,
      tipo_publico: tipoPublico,
      area_profissional: areaProfissional,
      contexto_detectado: contextoDetectado,
    }

    const fallback = fallbackTemplateFromInterpretacao(interpretacao)
    return {
      interpretacao,
      profileSuggest: {
        segment: 'ylada',
        category: areaProfissional,
        sub_category: contextoDetectado[0],
      },
      o_que_captar: tema,
      recommendedTemplateId: fallback.id,
      recommendedTemplateName: fallback.name,
      confidence,
    }
  } catch {
    return null
  }
}
