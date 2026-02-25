/**
 * POST /api/ylada/interpret — texto livre → perfil sugerido + template recomendado + confidence.
 * Body: { text, segment? }
 * Retorna: { profileSuggest, recommendedTemplateId, confidence }
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md (1.6)
 * @see docs/PROGRAMACAO-SENSATA-PROXIMOS-PASSOS.md
 * @see docs/PROCESSO-REVERSO-LINKS-INTELIGENTES.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
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

export interface InterpretResponse {
  profileSuggest: {
    segment?: string
    category?: string
    sub_category?: string
    dor_principal?: string
  }
  recommendedTemplateId: string | null
  recommendedTemplateName?: string
  /** Resumo do que o link entrega (conteúdo oficial do template) — profissional só valida. */
  diagnosticSummary?: string | null
  confidence: number
}

/** Objetivos do link: norte para sugerir quiz vs calculadora e texto. */
export const LINK_OBJECTIVES = ['captar', 'educar', 'reter', 'propagar', 'indicar'] as const
export type LinkObjective = (typeof LINK_OBJECTIVES)[number]

const SYSTEM_PROMPT = `Você é um assistente que analisa o que o PROFISSIONAL quer fazer com um LINK. O link é conteúdo que o profissional compartilha para POSSÍVEIS PACIENTES ou CLIENTES acessarem. O foco é no que a PESSOA QUE ACESSA recebe: conteúdo da especialidade do profissional que atrai, desperta curiosidade e agrega valor (ex.: quiz, calculadora, avaliação). Não é sobre o negócio/agenda do profissional — é sobre o conteúdo que atrai quem vai clicar.

O texto descreve: que tipo de link o profissional quer? Ex: "quiz sobre minha especialidade que atrai pacientes", "conteúdo que desperta curiosidade em quem acessa", "ferramenta que dá um resultado útil para o visitante", "link que agrega valor e no final a pessoa pode falar comigo".

Contexto do perfil (para preencher quando der para inferir do texto):
- segment: um de: ylada, psi, psicanalise, odonto, nutra, coach, seller
- category: mercado/área (ex: estetica, nutricao, odontologia, medicina, automoveis, imoveis)
- sub_category: opcional (ex: cabelo, seminovos, high_ticket)
- dor_principal: uma de: agenda_vazia, nao_converte, sem_indicacao, conteudo_nao_funciona, precificacao_ruim, falta_de_clareza

Templates (conteúdo que o VISITANTE — possível paciente/cliente — acessa):
- diagnostico_agenda (id: a0000001-0001-4000-8000-000000000001): quiz em que o visitante responde perguntas e recebe um resultado; ideal quando o profissional quer um link com tema da especialidade que atrai e engaja possíveis pacientes (conteúdo para quem acessa, não sobre a agenda do profissional).
- calculadora_perda (id: a0000002-0002-4000-8000-000000000002): calculadora em que o visitante preenche dados e vê um resultado/insight (ex.: potencial, impacto); ideal quando o profissional quer uma ferramenta que agrega valor para quem acessa e gera curiosidade, com CTA para contato.

Escolha o template conforme o tipo de CONTEÚDO para o visitante (quiz que atrai, calculadora que engaja), não pela dor do profissional.

Resposta obrigatória no formato exato:
{"profileSuggest":{"segment":"...","category":"...","sub_category":"...","dor_principal":"..."},"recommendedTemplateId":"uuid-do-template-ou-null","recommendedTemplateName":"nome_do_template","confidence":0.0 a 1.0}`

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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.3,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const parsed = parseInterpretResponse(raw)

    if (!parsed) {
      console.warn('[ylada/interpret] Resposta da IA não é JSON válido:', raw.slice(0, 200))
      return NextResponse.json({
        success: true,
        data: {
          profileSuggest: {},
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
    const response = { ...parsed, diagnosticSummary }

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

function parseInterpretResponse(raw: string): InterpretResponse | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const obj = JSON.parse(cleaned) as Record<string, unknown>
    const profileSuggest = (obj.profileSuggest as Record<string, unknown>) ?? {}
    const confidence = typeof obj.confidence === 'number' ? Math.max(0, Math.min(1, obj.confidence)) : 0
    return {
      profileSuggest: {
        segment: typeof profileSuggest.segment === 'string' ? profileSuggest.segment : undefined,
        category: typeof profileSuggest.category === 'string' ? profileSuggest.category : undefined,
        sub_category: typeof profileSuggest.sub_category === 'string' ? profileSuggest.sub_category : undefined,
        dor_principal: typeof profileSuggest.dor_principal === 'string' ? profileSuggest.dor_principal : undefined,
      },
      recommendedTemplateId: typeof obj.recommendedTemplateId === 'string' ? obj.recommendedTemplateId : null,
      recommendedTemplateName: typeof obj.recommendedTemplateName === 'string' ? obj.recommendedTemplateName : undefined,
      confidence,
    }
  } catch {
    return null
  }
}
