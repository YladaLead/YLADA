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

const SYSTEM_PROMPT = `Você é um assistente que analisa o que o PROFISSIONAL quer fazer com um LINK. O link é uma FERRAMENTA que o profissional vai compartilhar com seus possíveis clientes ou pacientes (não é sobre a dor do profissional, é sobre a ferramenta que ele quer usar para engajar o público dele).

O texto descreve: para que o profissional quer usar o link? Ex: "quero um quiz para qualificar quem quer agendar", "quero mostrar quanto a pessoa está deixando de ganhar", "ferramenta para engajar no Instagram".

Contexto do perfil (para preencher quando der para inferir do texto):
- segment: um de: ylada, psi, psicanalise, odonto, nutra, coach, seller
- category: mercado/área (ex: estetica, nutricao, odontologia, automoveis, imoveis)
- sub_category: opcional (ex: cabelo, seminovos, high_ticket)
- dor_principal: uma de: agenda_vazia, nao_converte, sem_indicacao, conteudo_nao_funciona, precificacao_ruim, falta_de_clareza

Templates (ferramentas que o profissional pode usar COM o público dele):
- diagnostico_agenda (id: a0000001-0001-4000-8000-000000000001): quiz que o visitante (possível cliente) responde sobre agenda/atendimentos; ideal quando o profissional quer qualificar quem tem interesse em agendar ou preencher agenda.
- calculadora_perda (id: a0000002-0002-4000-8000-000000000002): calculadora "quanto você está deixando de faturar" que o visitante preenche; ideal quando o profissional quer mostrar valor ou impacto (perda financeira, oportunidade) para engajar o possível cliente.

Escolha o template conforme o USO que o profissional quer dar ao link (ferramenta para engajar clientes/pacientes), não pela dor do profissional.

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
    const contextBlock = profileContext.length
      ? `Contexto do perfil empresarial (use para priorizar o template mais adequado):\n${profileContext.join('\n')}\n\n`
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
