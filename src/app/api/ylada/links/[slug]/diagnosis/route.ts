/**
 * POST /api/ylada/links/[slug]/diagnosis — gera diagnóstico e grava métricas.
 * Público (sem auth). Sem rate limit por IP nesta fase (validação comportamental).
 * Body: { visitor_answers: Record<string, unknown>, locale?: 'pt' | 'en' | 'es' }
 * Retorna: { diagnosis: DiagnosisDecisionOutput, metrics_id: string }
 * Quando locale é 'en' ou 'es', o diagnóstico é traduzido antes de retornar.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { generateDiagnosis, getDiagnosisDecision } from '@/lib/ylada'
import type { DiagnosisInput, DiagnosisArchitecture, LinkObjective, AreaProfissional } from '@/lib/ylada'
import { getArchetypeCode, fillArchetypeSlots } from '@/lib/ylada/diagnosis-archetypes'
import { normalizeVisitorAnswers, type FormFieldForNormalize } from '@/lib/ylada/diagnosis-normalize'
import type { StrategicProfile } from '@/lib/ylada/strategic-profile'
import { getAdaptiveDiagnosisIntro, getAdvancedCta } from '@/lib/ylada/adaptive-diagnosis'
import { sanitizeThemeForPatient } from '@/lib/ylada/strategic-intro'
import { inferArchitectureFromTitle } from '@/config/ylada-segments'
import { translateDiagnosis } from '@/lib/translate-diagnosis'
import { hasYladaProPlan } from '@/lib/subscription-helpers'
import { FREEMIUM_LIMITS, FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK } from '@/config/freemium-limits'
import { isYladaLinkHiddenFromPublicDueToFreemium } from '@/lib/ylada-freemium-public-link'
import { storeDiagnosisAnswers } from '@/lib/ylada/diagnosis-answers-store'

const ARCHITECTURES: DiagnosisArchitecture[] = [
  'RISK_DIAGNOSIS',
  'BLOCKER_DIAGNOSIS',
  'PROJECTION_CALCULATOR',
  'PROFILE_TYPE',
  'READINESS_CHECKLIST',
  'PERFUME_PROFILE',
]
const OBJECTIVES: LinkObjective[] = ['captar', 'educar', 'reter', 'propagar', 'indicar']
const AREAS: AreaProfissional[] = ['saude', 'profissional_liberal', 'vendas', 'wellness', 'geral']

/** x-forwarded-for pode vir com vários IPs (proxy); usar sempre o primeiro. */
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return null
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

/** Hash determinístico das respostas para cache (chaves ordenadas). */
function hashAnswers(answers: Record<string, unknown>): string {
  const keys = Object.keys(answers).filter((k) => !k.startsWith('_')).sort()
  const obj: Record<string, unknown> = {}
  for (const k of keys) obj[k] = answers[k]
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 32)
}

/** Extrai formFields do config (form.fields ou questions) para mapear índice→texto. */
function extractFormFieldsFromConfig(config: Record<string, unknown>): FormFieldForNormalize[] | undefined {
  const form = config.form as Record<string, unknown> | undefined
  const fields = form?.fields as Array<{ id?: string; options?: string[] }> | undefined
  if (Array.isArray(fields) && fields.length > 0) {
    return fields.map((f, i) => ({
      id: (f.id as string) ?? `q${i + 1}`,
      options: Array.isArray(f.options) ? f.options : undefined,
    }))
  }
  const questions = config.questions as Array<{ id?: string; options?: string[] }> | undefined
  if (Array.isArray(questions) && questions.length > 0) {
    return questions.map((q, i) => ({
      id: (q.id as string) ?? `q${i + 1}`,
      options: Array.isArray(q.options) ? q.options : undefined,
    }))
  }
  return undefined
}

/** Labels 4D para resumo WhatsApp (situação → tentativa → causa → objetivo). */
const RESUMO_4D_LABELS = ['dificuldade principal', 'já tentei', 'causa provável', 'objetivo']

/** Converte índice de opção (0-3) em texto da opção. */
function optionIndexToText(idx: unknown, options: string[] | undefined): string | null {
  if (!Array.isArray(options) || options.length === 0) return null
  const i = typeof idx === 'number' ? idx : parseInt(String(idx ?? ''), 10)
  if (Number.isNaN(i) || i < 0 || i >= options.length) return null
  return options[i]?.trim() || null
}

/** Monta resumo estruturado para WhatsApp a partir das respostas (Ficha Inteligente do Lead). */
function buildWhatsAppResumoFromAnswers(
  visitor_answers: Record<string, unknown>,
  formFields: FormFieldForNormalize[] | undefined,
  mainBlocker?: string
): string | null {
  if (!formFields || formFields.length === 0) return null
  const bullets: string[] = []
  for (let i = 0; i < Math.min(formFields.length, 4); i++) {
    const f = formFields[i]
    const val = visitor_answers[f.id]
    const text = optionIndexToText(val, f.options)
    if (text) {
      const label = RESUMO_4D_LABELS[i] ?? `pergunta ${i + 1}`
      bullets.push(`• ${label}: ${text}`)
    }
  }
  if (bullets.length === 0 && mainBlocker) {
    bullets.push(`• problema principal: ${mainBlocker}`)
  }
  if (bullets.length === 0) return null
  return `Olá! Resumo rápido do meu caso:\n\n${bullets.join('\n')}\n\nPodemos conversar sobre isso?`
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { slug } = await context.params
    if (!slug?.trim()) {
      return NextResponse.json({ success: false, error: 'slug é obrigatório' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const locale = (body.locale === 'en' || body.locale === 'es') ? body.locale as 'en' | 'es' : null
    let visitor_answers: Record<string, unknown> = body.visitor_answers && typeof body.visitor_answers === 'object'
      ? { ...body.visitor_answers }
      : {}

    // Normalizar campos que o motor espera como array (form pode enviar texto separado por vírgula)
    if (typeof visitor_answers.symptoms === 'string') {
      visitor_answers.symptoms = visitor_answers.symptoms.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (typeof visitor_answers.sintomas === 'string') {
      visitor_answers.sintomas = visitor_answers.sintomas.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    for (const key of ['history_flags', 'historico', 'history']) {
      if (typeof visitor_answers[key] === 'string') {
        visitor_answers[key] = (visitor_answers[key] as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      }
    }
    if (typeof visitor_answers.barriers === 'string') {
      visitor_answers.barriers = visitor_answers.barriers.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (typeof visitor_answers.barreiras === 'string') {
      visitor_answers.barreiras = visitor_answers.barreiras.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    const { data: link, error: linkError } = await supabaseAdmin
      .from('ylada_links')
      .select('id, user_id, config_json')
      .eq('slug', slug.trim())
      .eq('status', 'active')
      .maybeSingle()

    if (linkError || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado ou inativo' }, { status: 404 })
    }

    const ownerId = link.user_id as string | undefined
    if (
      ownerId &&
      (await isYladaLinkHiddenFromPublicDueToFreemium(ownerId, link.id as string, 'active'))
    ) {
      return NextResponse.json(
        {
          success: false,
          limit_reached: true,
          limit_type: FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK,
          message:
            'No plano gratuito só um diagnóstico ativo fica disponível para visitantes. Os demais ficam pausados na experiência pública até a profissional reativar o Plano Pro.',
        },
        { status: 403 }
      )
    }

    // Freemium: verificar limite de contatos WhatsApp mensais antes de processar (bloquear antes do custo de IA)
    if (ownerId) {
      const isPro = await hasYladaProPlan(ownerId)
      if (!isPro) {
        const now = new Date()
        const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
        const { data: ownerLinks } = await supabaseAdmin
          .from('ylada_links')
          .select('id')
          .eq('user_id', ownerId)
        const linkIds = (ownerLinks ?? []).map((l) => l.id)
        if (linkIds.length > 0) {
          const { count } = await supabaseAdmin
            .from('ylada_diagnosis_metrics')
            .select('*', { count: 'exact', head: true })
            .in('link_id', linkIds)
            .eq('clicked_whatsapp', true)
            .gte('created_at', firstDayOfMonth)
          const used = count ?? 0
          if (used >= FREEMIUM_LIMITS.FREE_LIMIT_WHATSAPP_CLICKS_PER_MONTH) {
            return NextResponse.json(
              {
                success: false,
                limit_reached: true,
                limit_type: 'whatsapp_clicks_monthly',
                message:
                  'Este diagnóstico atingiu o limite de 10 contatos no WhatsApp deste mês. No plano Pro o profissional tem diagnósticos ativos ilimitados e contatos ilimitados no WhatsApp por mês (e Noel completo). Para continuar recebendo contatos aqui, é preciso ativar o plano profissional.',
              },
              { status: 403 }
            )
          }
        }
      }
    }

    const config = (link.config_json as Record<string, unknown>) ?? {}
    let metaRaw = config.meta as Record<string, unknown> | undefined

    // VALIDAÇÃO: Verificar se todas as perguntas obrigatórias foram respondidas
    // IMPORTANTE: Validar apenas os campos que foram enviados (visitor_answers)
    // Não validar campos que não foram enviados (podem não estar visíveis no quiz)
    const formConfig = config.form as Record<string, unknown> | undefined
    const fields = (formConfig?.fields as Array<{ id?: string; label?: string; obrigatoria?: boolean; options?: string[] }> | undefined) ?? []
    
    // Filtrar apenas campos que têm opções (quiz) OU que foram enviados nas respostas
    // Campos sem opções que não foram enviados não devem ser validados (podem estar ocultos)
    const camposEnviados = Object.keys(visitor_answers)
    const camposParaValidar = fields.filter((f) => {
      // Se tem opções, é campo de quiz - validar se foi enviado
      if (f.options && f.options.length > 0) {
        return camposEnviados.includes(f.id || '')
      }
      // Se não tem opções mas foi enviado, validar
      return camposEnviados.includes(f.id || '')
    })
    
    const camposObrigatorios = camposParaValidar.filter((f) => f.id && (!f.hasOwnProperty('obrigatoria') || f.obrigatoria !== false))
    
    const camposNaoRespondidos = camposObrigatorios.filter((f) => {
      const valor = visitor_answers[f.id!]
      return valor === undefined || valor === null || valor === '' || (typeof valor === 'string' && valor.trim() === '')
    })

    if (camposNaoRespondidos.length > 0) {
      const camposNomes = camposNaoRespondidos.map((f) => f.label || f.id).join(', ')
      return NextResponse.json(
        {
          success: false,
          error: `Por favor, responda todas as perguntas obrigatórias: ${camposNomes}`,
          missing_fields: camposNaoRespondidos.map((f) => ({ id: f.id, label: f.label })),
        },
        { status: 400 }
      )
    }

    // Suporte a links da biblioteca (questions + results sem meta): inferir meta via registry
    if (!metaRaw && Array.isArray(config.questions) && Array.isArray(config.results)) {
      const title = (config.title as string) || 'seu perfil'
      const inferred = inferArchitectureFromTitle(title)
      metaRaw = {
        architecture: inferred.architecture,
        theme_raw: title,
        theme_display: title,
        objective: 'captar',
        area_profissional: 'wellness',
        ...(inferred.segment_code && { segment_code: inferred.segment_code }),
      }
    }
    if (!metaRaw) {
      return NextResponse.json({ success: false, error: 'Config do link sem meta' }, { status: 400 })
    }

    let architecture = metaRaw.architecture as string | undefined
    // Fallback: links criados com meta vazio (248) usaram RISK_DIAGNOSIS — corrigir via registry
    if (architecture === 'RISK_DIAGNOSIS') {
      const title = (config.title as string) || (metaRaw.theme_raw as string) || ''
      const inferred = inferArchitectureFromTitle(title)
      if (inferred.architecture === 'PERFUME_PROFILE') {
        architecture = 'PERFUME_PROFILE'
        metaRaw = { ...metaRaw, architecture: 'PERFUME_PROFILE', segment_code: inferred.segment_code ?? 'perfumaria' }
      }
    }
    if (!architecture || !ARCHITECTURES.includes(architecture as DiagnosisArchitecture)) {
      return NextResponse.json({ success: false, error: 'Arquitetura de diagnóstico não suportada' }, { status: 400 })
    }

    const formFields = extractFormFieldsFromConfig(config)

    // Cache: v5 — whatsapp_prefill com perfume_usage (PERFUME_PROFILE)
    const answers_hash = hashAnswers(visitor_answers)
    const TEMPLATE_VERSION = 5
    const { data: cached } = await supabaseAdmin
      .from('ylada_diagnosis_cache')
      .select('diagnosis_json')
      .eq('link_id', link.id)
      .eq('answers_hash', answers_hash)
      .eq('template_version', TEMPLATE_VERSION)
      .maybeSingle()

    if (cached?.diagnosis_json) {
      const cachedDiag = cached.diagnosis_json as Record<string, unknown>
      const ip = getClientIp(request)
      const ip_hash = ip ? hashIp(ip) : null
      const user_agent = request.headers.get('user-agent')?.slice(0, 500) ?? null
      const cachedPerfumeUsage = architecture === 'PERFUME_PROFILE'
        ? (cachedDiag.perfume_usage as string | undefined)
        : undefined
      const { data: metricsRow, error: metricsErr } = await supabaseAdmin
        .from('ylada_diagnosis_metrics')
        .insert({
          link_id: link.id,
          flow_id: typeof metaRaw.flow_id === 'string' ? metaRaw.flow_id : null,
          architecture,
          level: null,
          main_blocker: (cachedDiag.main_blocker as string) ?? '',
          fallback_used: false,
          theme: typeof metaRaw.theme_raw === 'string' ? metaRaw.theme_raw : null,
          objective: typeof metaRaw.objective === 'string' ? metaRaw.objective : 'captar',
          cta_variant: cachedDiag.cta_text ?? null,
          intro_variant: null,
          user_agent,
          ip_hash,
          ...(cachedPerfumeUsage && { perfume_usage: cachedPerfumeUsage }),
        })
        .select('id')
        .single()
      if (!metricsErr && metricsRow) {
        storeDiagnosisAnswers({
          metricsId: metricsRow.id,
          linkId: link.id,
          userId: link.user_id as string,
          visitorAnswers: visitor_answers,
          segment: typeof metaRaw.segment_code === 'string' ? metaRaw.segment_code : undefined,
          architecture,
          theme: typeof metaRaw.theme_raw === 'string' ? metaRaw.theme_raw : undefined,
          objective: typeof metaRaw.objective === 'string' ? metaRaw.objective : 'captar',
          formFields,
        }).catch((e) => console.warn('[ylada/links/[slug]/diagnosis] storeDiagnosisAnswers:', e))
        let finalCached = cachedDiag
        if (locale === 'en' || locale === 'es') {
          finalCached = await translateDiagnosis(cachedDiag, locale)
        }
        return NextResponse.json({
          diagnosis: finalCached,
          metrics_id: metricsRow.id,
        })
      }
    }

    const themeRaw = typeof metaRaw.theme_raw === 'string'
      ? metaRaw.theme_raw
      : (metaRaw.theme as Record<string, unknown>)?.raw as string | undefined
      ?? 'seu objetivo'

    // Camada 0: em safety_mode usar tema genérico (theme_display) nos textos, nunca nome de medicamento
    const safetyMode = metaRaw.safety_mode === true
    const themeDisplay = typeof metaRaw.theme_display === 'string' ? metaRaw.theme_display : null
    const themeBase = safetyMode && themeDisplay ? themeDisplay : themeRaw
    const themeForSlots = sanitizeThemeForPatient(themeBase)

    const objective = OBJECTIVES.includes((metaRaw.objective as LinkObjective) ?? '')
      ? (metaRaw.objective as LinkObjective)
      : 'captar'

    const area_profissional = AREAS.includes((metaRaw.area_profissional as AreaProfissional) ?? '')
      ? (metaRaw.area_profissional as AreaProfissional)
      : 'geral'

    const flow_id = typeof metaRaw.flow_id === 'string' ? metaRaw.flow_id : null
    const objectiveMeta = typeof metaRaw.objective === 'string' ? metaRaw.objective : null

    // Bloco 2: normalizar q1,q2... para chaves esperadas pelo motor
    const normalizedAnswers = normalizeVisitorAnswers(
      visitor_answers,
      architecture as DiagnosisArchitecture,
      { themeRaw: themeRaw ?? '', formFields }
    )

    const segment_code = typeof metaRaw.segment_code === 'string' ? metaRaw.segment_code : undefined
    const input: DiagnosisInput = {
      meta: {
        objective,
        theme: { raw: themeForSlots },
        area_profissional,
        architecture: architecture as DiagnosisArchitecture,
        ...(segment_code && { segment_code }),
      },
      professional: {},
      visitor_answers: normalizedAnswers,
    }

    let diagnosis: Awaited<ReturnType<typeof generateDiagnosis>>['diagnosis']
    let fallbackUsed: boolean
    let level: Awaited<ReturnType<typeof generateDiagnosis>>['level']

    const arch = architecture as DiagnosisArchitecture
    if (arch === 'RISK_DIAGNOSIS' || arch === 'BLOCKER_DIAGNOSIS') {
      const decision = getDiagnosisDecision(input)
      const archetypeCode = getArchetypeCode(decision.level, decision.blocker_type)
      const themeDisplay = themeForSlots || 'seu perfil'

      // 1) Prioridade: conteúdo memorizado por link (gerado por IA quando profissional editou)
      const { data: linkContent } = await supabaseAdmin
        .from('ylada_link_diagnosis_content')
        .select('content_json')
        .eq('link_id', link.id)
        .eq('architecture', arch)
        .eq('archetype_code', archetypeCode)
        .maybeSingle()

      if (linkContent?.content_json) {
        diagnosis = fillArchetypeSlots(linkContent.content_json as Record<string, unknown>, {
          THEME: themeDisplay,
          NAME: '',
        })
        fallbackUsed = false
        level = decision.level
      } else {
        // 2) Fallback: archetypes globais da biblioteca
        const segmentForArchetype = segment_code ?? 'geral'
        const { data: archetype } = await supabaseAdmin
          .from('ylada_diagnosis_archetypes')
          .select('content_json')
          .eq('archetype_code', archetypeCode)
          .eq('segment_code', segmentForArchetype)
          .maybeSingle()

        if (archetype?.content_json) {
          diagnosis = fillArchetypeSlots(archetype.content_json as Record<string, unknown>, {
            THEME: themeDisplay,
            NAME: '',
          })
          fallbackUsed = false
          level = decision.level
        } else {
          const result = generateDiagnosis(input)
          diagnosis = result.diagnosis
          fallbackUsed = result.fallbackUsed
          level = result.level
        }
      }
    } else if (arch === 'PERFUME_PROFILE') {
      const result = generateDiagnosis(input)
      let diag = result.diagnosis
      const perfumeProfileCode = result.perfume_profile_code
      const perfumeUsage = result.perfume_usage
      const segmentForArchetype = segment_code ?? 'perfumaria'

      if (perfumeProfileCode) {
        const { data: archetype } = await supabaseAdmin
          .from('ylada_diagnosis_archetypes')
          .select('content_json')
          .eq('archetype_code', perfumeProfileCode)
          .eq('segment_code', segmentForArchetype)
          .maybeSingle()

        if (archetype?.content_json) {
          const profileLabel = perfumeProfileCode.replace(/_/g, ' ')
          diag = fillArchetypeSlots(archetype.content_json as Record<string, unknown>, {
            THEME: themeForSlots || 'fragrância',
            NAME: '',
            PROFILE: profileLabel,
          })
          fallbackUsed = false
        }
      }
      diagnosis = diag
      level = result.level
      if (perfumeUsage) {
        ;(diagnosis as Record<string, unknown>).perfume_usage = perfumeUsage
      }
    } else {
      const result = generateDiagnosis(input)
      diagnosis = result.diagnosis
      fallbackUsed = result.fallbackUsed
      level = result.level
    }

    // Camada 0: disclaimer quando safety_mode (não parecer orientação médica)
    const copyPolicy = metaRaw.copy_policy && typeof metaRaw.copy_policy === 'object' ? metaRaw.copy_policy as { append_disclaimer?: boolean } : undefined
    const appendDisclaimer = safetyMode && copyPolicy?.append_disclaimer

    // Tom adaptativo: só para links B2B (agenda, captação). Links para pacientes (emagrecimento, intestino) não usam texto de "agenda"
    const themeForAdaptive = typeof metaRaw.theme_raw === 'string' ? metaRaw.theme_raw : ''
    const isProfessionalTheme = /agenda|captação|posicionamento|conversão|indicados/.test(themeForAdaptive.toLowerCase())
    const strategicProfile = isProfessionalTheme && metaRaw.strategic_profile && typeof metaRaw.strategic_profile === 'object'
      ? (metaRaw.strategic_profile as StrategicProfile)
      : null
    const introVariant = strategicProfile ? getAdaptiveDiagnosisIntro(strategicProfile, level) : null
    const baseSummary = introVariant
      ? `${introVariant}\n\n${diagnosis.profile_summary}`
      : diagnosis.profile_summary
    const profileSummary = appendDisclaimer
      ? `${baseSummary}\n\nIsto não é orientação médica. A avaliação individual é feita em consulta.`
      : baseSummary

    const ctaText = strategicProfile ? getAdvancedCta(strategicProfile, diagnosis.cta_text) : diagnosis.cta_text
    const ip = getClientIp(request)
    const ip_hash = ip ? hashIp(ip) : null
    const user_agent = request.headers.get('user-agent')?.slice(0, 500) ?? null
    const perfumeUsageForMetrics = architecture === 'PERFUME_PROFILE'
      ? ((diagnosis as Record<string, unknown>).perfume_usage as string | undefined)
      : undefined

    const { data: row, error: insertError } = await supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .insert({
        link_id: link.id,
        flow_id: flow_id,
        architecture,
        level: level ?? null,
        main_blocker: diagnosis.main_blocker,
        fallback_used: fallbackUsed,
        theme: themeRaw,
        objective: objectiveMeta ?? objective,
        cta_variant: ctaText,
        intro_variant: introVariant ?? null,
        user_agent: user_agent,
        ip_hash: ip_hash,
        ...(perfumeUsageForMetrics && { perfume_usage: perfumeUsageForMetrics }),
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[ylada/links/[slug]/diagnosis] insert metrics', insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    storeDiagnosisAnswers({
      metricsId: row.id,
      linkId: link.id,
      userId: link.user_id as string,
      visitorAnswers: visitor_answers,
      segment: segment_code,
      architecture,
      theme: themeRaw ?? undefined,
      objective: objectiveMeta ?? objective,
      formFields,
    }).catch((e) => console.warn('[ylada/links/[slug]/diagnosis] storeDiagnosisAnswers:', e))

    // Mensagem WhatsApp: Ficha Inteligente do Lead — resumo estruturado para o profissional receber contexto no WhatsApp
    let whatsappPrefill = diagnosis.whatsapp_prefill
    const resumoFromAnswers = buildWhatsAppResumoFromAnswers(
      visitor_answers,
      formFields,
      diagnosis.main_blocker
    )
    if (resumoFromAnswers && architecture !== 'PERFUME_PROFILE') {
      whatsappPrefill = resumoFromAnswers
    } else if (architecture !== 'PERFUME_PROFILE') {
      const msgContainsResult =
        diagnosis.main_blocker &&
        whatsappPrefill?.toLowerCase().includes((diagnosis.main_blocker || '').toLowerCase().slice(0, 15))
      const isGeneric = whatsappPrefill && diagnosis.main_blocker && !msgContainsResult
      if (isGeneric && diagnosis.main_blocker) {
        const theme = themeForSlots?.trim() || 'a análise'
        whatsappPrefill = `Oi, fiz a análise de ${theme} e o resultado apontou ${diagnosis.main_blocker}. Gostaria de conversar sobre o próximo passo.`
      }
    }
    // PERFUME_PROFILE: enriquecer whatsapp_prefill com perfume_usage para o vendedor qualificar o lead
    const perfumeUsage = (diagnosis as Record<string, unknown>).perfume_usage as string | undefined
    if (architecture === 'PERFUME_PROFILE' && perfumeUsage && whatsappPrefill) {
      const usageLabel = perfumeUsage.replace(/_/g, ' ')
      whatsappPrefill = `${whatsappPrefill}\n\nUso principal: ${usageLabel}`
    }

    // Memorização: gravar diagnóstico no cache para reutilização futura
    const diagnosisPayload = {
      profile_title: diagnosis.profile_title,
      profile_summary: profileSummary,
      main_blocker: diagnosis.main_blocker,
      causa_provavel: diagnosis.causa_provavel,
      preocupacoes: diagnosis.preocupacoes,
      espelho_comportamental: diagnosis.espelho_comportamental,
      consequence: diagnosis.consequence,
      growth_potential: diagnosis.growth_potential,
      cta_text: ctaText,
      whatsapp_prefill: whatsappPrefill,
      ...(diagnosis.frase_identificacao && { frase_identificacao: diagnosis.frase_identificacao }),
      ...(diagnosis.dica_rapida && { dica_rapida: diagnosis.dica_rapida }),
      ...(diagnosis.specific_actions?.length && { specific_actions: diagnosis.specific_actions }),
      ...((diagnosis as Record<string, unknown>).perfume_usage && {
        perfume_usage: (diagnosis as Record<string, unknown>).perfume_usage,
      }),
    }
    await supabaseAdmin
      .from('ylada_diagnosis_cache')
      .upsert(
        { link_id: link.id, answers_hash, diagnosis_json: diagnosisPayload, template_version: TEMPLATE_VERSION },
        { onConflict: 'link_id,answers_hash' }
      )
      .then(() => {})
      .catch((err) => console.warn('[ylada/links/[slug]/diagnosis] cache insert', err))

    let finalDiagnosis = diagnosisPayload
    if (locale === 'en' || locale === 'es') {
      finalDiagnosis = await translateDiagnosis(diagnosisPayload, locale)
    }

    return NextResponse.json({
      diagnosis: finalDiagnosis,
      metrics_id: row.id,
    })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    console.error('[ylada/links/[slug]/diagnosis]', err.message, err.stack)
    const isDev = process.env.NODE_ENV === 'development'
    const detail = isDev ? err.message : undefined
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar diagnóstico', ...(detail && { detail }) },
      { status: 500 }
    )
  }
}
