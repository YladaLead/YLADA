/**
 * POST /api/ylada/links/generate — gera instância de link a partir de template ou de flow_id + interpretacao.
 * Body: { template_id } OU { flow_id, interpretacao } (segment?, title?, cta_whatsapp? em ambos).
 * Retorna: { success, data: { id, slug, url, title, config, ... } }
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md (Etapa 6)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import OpenAI from 'openai'
import { generateDiagnosisForLink } from '@/lib/ylada/generate-diagnosis-for-link'
import { getFlowById, VALID_FLOW_IDS } from '@/config/ylada-flow-catalog'
import { getQuizEmagrecimento } from '@/config/ylada-quiz-emagrecimento'
import { getQuizByTema } from '@/config/ylada-quiz-temas'
import { interpretStrategyContext } from '@/lib/ylada/strategic-interpreter'
import { sanitizeThemeForPatient, formatDisplayTitle } from '@/lib/ylada/strategic-intro'
import { deriveStrategicProfile } from '@/lib/ylada/strategic-profile'
import { getDiagnosisSegmentFromProfile } from '@/lib/ylada/diagnosis-segment'
import { inferArchitectureFromTitle, DEFAULT_ARCHITECTURE } from '@/config/ylada-segments'
import { randomBytes } from 'crypto'
import { translateQuestions } from '@/lib/translate-questions'
import { getCountryByCode } from '@/components/CountrySelector'
import { hasYladaProPlan } from '@/lib/subscription-helpers'
import { FREEMIUM_LIMITS, YLADA_FREEMIUM_ACTIVE_LINK_LIMIT_MESSAGE } from '@/config/freemium-limits'
import {
  buildProjectionFormFields,
  projectionQuestionsOverrideAllowed,
} from '@/lib/ylada/projection-form-fields'

function normalizeOptionText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function isGenericLowSignalOptions(options?: string[]): boolean {
  if (!options || options.length === 0) return true
  const normalized = options.map(normalizeOptionText)
  const genericPool = new Set([
    'sim',
    'nao',
    'as vezes',
    'nao tenho certeza',
    'talvez',
    'raramente',
    'frequentemente',
  ])
  const genericHits = normalized.filter((opt) => genericPool.has(opt)).length
  return genericHits >= 3
}

function buildCoherentFallbackOptions(label: string, index: number): string[] {
  const q = normalizeOptionText(label)

  if (index === 0 || /situacao|acontece|parece com voce|hoje/.test(q)) {
    return [
      'Tenho tentado melhorar, mas perco consistencia',
      'Comeco animado(a), mas paro no meio',
      'Faço varias coisas e nao sei o que funciona',
      'Ainda nao consegui organizar um caminho claro',
    ]
  }

  if (/atrapalha|dificulta|desafio|bloqueio/.test(q)) {
    return [
      'Falta de consistencia na rotina',
      'Nao saber o que priorizar primeiro',
      'Expectativa de resultado muito rapido',
      'Comeco, mas nao consigo manter',
    ]
  }

  if (/rotina|constancia|manter|frequencia/.test(q)) {
    return [
      'Tenho rotina definida e sigo bem',
      'Tenho rotina, mas oscilo durante a semana',
      'Nao tenho rotina fixa e improviso',
      'Estou comecando agora e preciso de estrutura',
    ]
  }

  if (/clareza|processo|plano|por onde comecar/.test(q)) {
    return [
      'Tenho clareza do passo a passo',
      'Entendo parte do processo, mas tenho duvidas',
      'Tenho muitas informacoes e pouca direcao',
      'Nao sei por onde comecar no meu caso',
    ]
  }

  if (/meta|objetivo|resultado|expectativa|melhorar/.test(q)) {
    return [
      'Quero destravar e voltar a evoluir com consistencia',
      'Quero um plano realista para manter resultado',
      'Quero entender o que ajustar primeiro',
      'Quero avaliar meu caso antes de decidir o proximo passo',
    ]
  }

  return [
    'Isso me atrapalha bastante hoje',
    'Me atrapalha em alguns momentos',
    'Atrapalha pouco, mas quero melhorar',
    'Nao sei avaliar com clareza ainda',
  ]
}

function generateSlug(): string {
  return randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '') || 'link'
}

/** Tipo de template no banco por arquitetura: calculadora só para PROJECTION_CALCULATOR. */
const TEMPLATE_TYPE_BY_ARCHITECTURE: Record<string, string> = {
  PROJECTION_CALCULATOR: 'calculator',
  RISK_DIAGNOSIS: 'diagnostico',
  BLOCKER_DIAGNOSIS: 'diagnostico',
  PROFILE_TYPE: 'diagnostico',
  READINESS_CHECKLIST: 'diagnostico',
  PERFUME_PROFILE: 'diagnostico',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const flowId = typeof body.flow_id === 'string' ? body.flow_id.trim() : ''
    const interpretacao = body.interpretacao && typeof body.interpretacao === 'object' ? body.interpretacao as Record<string, unknown> : null
    /** Perguntas customizadas do interpret unificado; se ausente, usa question_labels do catálogo. */
    const questionsOverride = Array.isArray(body.questions) ? body.questions as Array<{ id: string; label: string; type?: string }> : null
    const templateIdLegacy = typeof body.template_id === 'string' ? body.template_id.trim() : ''
    /** Template da biblioteca (conteúdo copiado da Nutri); quando presente, usa schema.questions para formFields. */
    const bibliotecaTemplateId = typeof body.biblioteca_template_id === 'string' ? body.biblioteca_template_id.trim() : null

    const segment = typeof body.segment === 'string' ? body.segment.trim() || null : null
    const locale = (body.locale === 'en' || body.locale === 'es') ? body.locale as 'en' | 'es' : null
    const category = typeof body.category === 'string' ? body.category.trim() || null : null
    const subCategory = typeof body.sub_category === 'string' ? body.sub_category.trim() || null : null
    const titleOverride = typeof body.title === 'string' ? body.title.trim() || null : null
    let ctaWhatsapp = typeof body.cta_whatsapp === 'string' ? body.cta_whatsapp.trim() || null : null
    const ctaSuggestion = typeof body.cta_suggestion === 'string' ? body.cta_suggestion.trim() || null : null

    // Bloco 6.1: se cta_whatsapp não informado, buscar do perfil do usuário (com country_code para DDI correto)
    if (!ctaWhatsapp && supabaseAdmin) {
      // Primeiro, tentar buscar de user_profiles
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('whatsapp, country_code')
        .eq('user_id', user.id)
        .maybeSingle()
      let wp = (profile as { whatsapp?: string | null; country_code?: string | null } | null)?.whatsapp
      let countryCode = (profile as { country_code?: string | null } | null)?.country_code || 'BR'
      
      // Se não encontrou em user_profiles, tentar em ylada_noel_profile
      if ((!wp || wp.trim().length < 10) && supabaseAdmin) {
        // Tentar buscar pelo segment do link, se disponível
        let noelProfile = null
        if (segment) {
          const { data: profileBySegment } = await supabaseAdmin
            .from('ylada_noel_profile')
            .select('area_specific')
            .eq('user_id', user.id)
            .eq('segment', segment)
            .maybeSingle()
          noelProfile = profileBySegment
        }
        
        // Se não encontrou pelo segment, buscar qualquer perfil do usuário
        if (!noelProfile) {
          const { data: profileAny } = await supabaseAdmin
            .from('ylada_noel_profile')
            .select('area_specific')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle()
          noelProfile = profileAny
        }
        
        if (noelProfile?.area_specific) {
          const areaSpecific = noelProfile.area_specific as Record<string, unknown>
          const wpNoel = areaSpecific.whatsapp as string | undefined
          const countryCodeNoel = (areaSpecific.country_code as string) || 'BR'
          if (typeof wpNoel === 'string' && wpNoel.trim().length >= 10) {
            wp = wpNoel
            countryCode = countryCodeNoel
            console.log('[ylada/links/generate] WhatsApp encontrado no perfil Noel:', { whatsapp: wp, country_code: countryCode, segment })
          }
        }
      }
      
      // Formatar número com código do país
      if (typeof wp === 'string' && wp.trim().length >= 10) {
        let num = wp.trim().replace(/\D/g, '')
        const country = getCountryByCode(countryCode)
        const phoneCode = country?.phoneCode?.replace(/\D/g, '') || '55'
        if (phoneCode && !num.startsWith(phoneCode)) {
          num = phoneCode + num
        }
        ctaWhatsapp = num
        console.log('[ylada/links/generate] WhatsApp formatado do perfil:', { original: wp, formatado: ctaWhatsapp, country_code: countryCode })
      } else {
        console.warn('[ylada/links/generate] WhatsApp não encontrado no perfil do usuário:', user.id)
      }
    }

    let templateId = templateIdLegacy
    let configJson: Record<string, unknown>

    // Bloco 3 e 4: calculadora ou diagnostico da biblioteca — usa template direto (schema completo)
    if (bibliotecaTemplateId) {
      const { data: bibliotecaTemplate, error: btErr } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('id, name, type, schema_json')
        .eq('id', bibliotecaTemplateId)
        .eq('active', true)
        .maybeSingle()
      if (!btErr && bibliotecaTemplate && (bibliotecaTemplate.type === 'calculator' || bibliotecaTemplate.type === 'diagnostico')) {
        const schema = (bibliotecaTemplate.schema_json as Record<string, unknown>) || {}
        const title = titleOverride ?? (schema.title as string) ?? bibliotecaTemplate.name
        templateId = bibliotecaTemplate.id
        configJson = {
          title,
          ctaText: ctaSuggestion ?? (schema.ctaDefault as string) ?? 'Falar no WhatsApp',
          ...schema,
        }
        // Diagnóstico da biblioteca: adicionar meta + form para fluxo unificado (API de diagnóstico)
        if (bibliotecaTemplate.type === 'diagnostico') {
          const questions = Array.isArray(schema.questions) ? schema.questions as Array<{ id?: string; text?: string; type?: string; options?: string[] }> : []
          const formFields = questions.map((q, i) => ({
            id: q.id ?? `q${i + 1}`,
            label: q.text ?? q.id ?? `Pergunta ${i + 1}`,
            type: (q.type as string) || 'single',
            options: q.options,
          }))
          // Buscar meta do item da biblioteca (architecture, segment_code para PERFUME_PROFILE)
          let itemMeta: Record<string, unknown> = {}
          const { data: bibliotecaItem } = await supabaseAdmin
            .from('ylada_biblioteca_itens')
            .select('meta')
            .eq('template_id', bibliotecaTemplateId)
            .eq('active', true)
            .limit(1)
            .maybeSingle()
          if (bibliotecaItem?.meta && typeof bibliotecaItem.meta === 'object') {
            itemMeta = bibliotecaItem.meta as Record<string, unknown>
          }
          // Fallback: meta vazio → inferir do título (registry de segmentos)
          let architecture = itemMeta.architecture as string | undefined
          let segmentCode = typeof itemMeta.segment_code === 'string' ? itemMeta.segment_code : undefined
          if (!architecture || !segmentCode) {
            const inferred = inferArchitectureFromTitle(title)
            if (!architecture) architecture = inferred.architecture
            if (!segmentCode && inferred.segment_code) segmentCode = inferred.segment_code
          }
          if (!architecture) architecture = DEFAULT_ARCHITECTURE
          configJson = {
            ...configJson,
            meta: {
              version: 1,
              objective: 'captar',
              theme_raw: title,
              theme_display: title,
              architecture,
              area_profissional: 'geral',
              ...(segmentCode && { segment_code: segmentCode }),
            },
            form: {
              fields: formFields,
              submit_label: 'Ver resultado',
            },
            result: configJson.result ?? { headline: 'Seu resultado', summary_bullets: [], cta: { text: configJson.ctaText ?? 'Falar no WhatsApp' } },
          }
        }
      }
    }

    if (!configJson && flowId && VALID_FLOW_IDS.includes(flowId) && interpretacao) {
      // --- Fluxo por flow_id + interpretacao (Etapa 6) ---
      const flow = getFlowById(flowId)
      if (!flow) {
        return NextResponse.json({ success: false, error: 'Fluxo não encontrado no catálogo' }, { status: 400 })
      }
      const themeRaw = typeof interpretacao.tema === 'string' ? interpretacao.tema.trim() : ''
      const objective = typeof interpretacao.objetivo === 'string' ? interpretacao.objetivo : 'captar'

      const templateType = TEMPLATE_TYPE_BY_ARCHITECTURE[flow.architecture] ?? 'diagnostico'
      const { data: templateByType, error: templateByTypeError } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('id, name, type, schema_json')
        .eq('type', templateType)
        .eq('active', true)
        .limit(1)
        .maybeSingle()

      if (templateByTypeError || !templateByType) {
        return NextResponse.json(
          { success: false, error: `Nenhum template ativo do tipo "${templateType}". Execute as migrations 207 e 208.` },
          { status: 404 }
        )
      }
      templateId = templateByType.id

      // Camada 0: decisão de segurança (tema sensível → safety_mode, tema genérico para exibição)
      const area_profissional = typeof interpretacao.area_profissional === 'string' ? interpretacao.area_profissional : undefined
      const strategyDecision = interpretStrategyContext({
        objective,
        theme_raw: themeRaw,
        area_profissional,
      })
      const themeDisplayRaw = strategyDecision.safety_mode && strategyDecision.safe_theme
        ? strategyDecision.safe_theme
        : themeRaw || 'seu tema'
      const themeDisplay = sanitizeThemeForPatient(themeDisplayRaw)

      // Perfil estratégico derivado (para intro + CTA adaptativa); não altera motor
      const profileSegment = segment ?? 'ylada'
      const { data: profileRow } = await supabaseAdmin
        .from('ylada_noel_profile')
        .select('tempo_atuacao_anos, dor_principal, fase_negocio, profile_type, profession, prioridade_atual, capacidade_semana, objetivos_curto_prazo')
        .eq('user_id', user.id)
        .eq('segment', profileSegment)
        .maybeSingle()
      const strategicProfile = deriveStrategicProfile(
        profileRow as Record<string, unknown> | null,
        {
          objetivo: objective,
          tema: themeRaw,
          area_profissional,
        }
      )

      const profession = (profileRow as { profession?: string } | null)?.profession
      const segment_code = getDiagnosisSegmentFromProfile(profession, profileSegment, themeRaw)

      // Não espalhar schema do template: o link é orientado ao visitante/paciente (form + motor),
      // não ao quiz gerencial (questions/results) que pode estar no template.
      const schema = (templateByType.schema_json as Record<string, unknown>) || {}
      const isPatientFlow = flow.architecture === 'RISK_DIAGNOSIS' || flow.architecture === 'BLOCKER_DIAGNOSIS'
      const pageTitle = titleOverride ?? (isPatientFlow ? themeDisplay : `${flow.display_name} — ${themeDisplay}`)

      // Perguntas: priorizar override > template biblioteca > emagrecimento > quiz por tema > flow
      let formFields: Array<{ id: string; label: string; type: string; options?: string[] }>
      const hasOverrideWithOptions =
        questionsOverride &&
        questionsOverride.length > 0 &&
        questionsOverride.some((q) => Array.isArray((q as { options?: string[] }).options) && (q as { options: string[] }).options!.length > 0)

      if (flow.architecture === 'PROJECTION_CALCULATOR') {
        const canonical = buildProjectionFormFields(themeRaw)
        const mergeLabels = projectionQuestionsOverrideAllowed(questionsOverride)
        formFields = canonical.map((c, i) => ({
          id: c.id,
          label:
            mergeLabels && questionsOverride?.[i]?.label?.trim()
              ? questionsOverride[i].label!.trim()
              : c.label,
          type: 'number',
        }))
      } else if (hasOverrideWithOptions) {
        formFields = questionsOverride!.map((q) => ({
          id: (q as { id?: string }).id ?? `q${questionsOverride!.indexOf(q) + 1}`,
          label: q.label,
          type: (q.type as string) || 'single',
          options: Array.isArray((q as { options?: string[] }).options) ? (q as { options: string[] }).options : undefined,
        }))
      } else if (bibliotecaTemplateId) {
        const { data: bibliotecaTemplate } = await supabaseAdmin
          .from('ylada_link_templates')
          .select('schema_json')
          .eq('id', bibliotecaTemplateId)
          .eq('active', true)
          .maybeSingle()
        const schemaQuestions = (bibliotecaTemplate?.schema_json as { questions?: Array<{ id?: string; text?: string; type?: string; options?: string[] }> })?.questions
        if (Array.isArray(schemaQuestions) && schemaQuestions.length > 0) {
          formFields = schemaQuestions.map((q, i) => ({
            id: q.id ?? `q${i + 1}`,
            label: q.text ?? q.id ?? `Pergunta ${i + 1}`,
            type: (q.type as string) || 'single',
            options: q.options,
          }))
        } else {
          const quizFallback = getQuizEmagrecimento(themeRaw, flowId) ?? getQuizByTema(themeRaw, flowId)
          formFields = quizFallback && quizFallback.length > 0
            ? quizFallback.map((q) => ({ id: q.id, label: q.label, type: q.type as string, options: q.options }))
            : flow.question_labels.map((label, i) => ({ id: `q${i + 1}`, label, type: 'text' }))
        }
      } else {
        const quizFallback = getQuizEmagrecimento(themeRaw, flowId) ?? getQuizByTema(themeRaw, flowId)
        const usedOverride = questionsOverride && questionsOverride.length > 0
        formFields = quizFallback && quizFallback.length > 0
          ? quizFallback.map((q) => ({ id: q.id, label: q.label, type: q.type as string, options: q.options }))
          : usedOverride
            ? questionsOverride!.map((q) => ({
                id: q.id,
                label: q.label,
                type: (q.type as string) || 'text',
                options: Array.isArray((q as { options?: string[] }).options) ? (q as { options: string[] }).options : undefined,
              }))
            : flow.question_labels.map((label, i) => ({ id: `q${i + 1}`, label, type: 'text' }))
        if (locale && formFields.length > 0 && !usedOverride) {
          formFields = await translateQuestions(formFields, locale)
        }
      }

      if (flow.architecture === 'RISK_DIAGNOSIS' || flow.architecture === 'BLOCKER_DIAGNOSIS') {
        formFields = formFields.map((field, index) => {
          const options = Array.isArray(field.options) ? field.options.slice(0, 4) : undefined
          const needsFallback = isGenericLowSignalOptions(options) || (options?.length ?? 0) < 4
          if (needsFallback) {
            return {
              ...field,
              type: 'single',
              options: buildCoherentFallbackOptions(field.label, index),
            }
          }
          return {
            ...field,
            type: 'single',
            options,
          }
        })
      }

      configJson = {
        title: pageTitle,
        ctaText: ctaSuggestion ?? flow.cta_default ?? (schema.ctaDefault as string) ?? 'Quero analisar meu caso',
        meta: {
          version: 1,
          objective,
          theme_raw: themeRaw,
          theme_text: themeRaw,
          theme_normalized: themeRaw.toLowerCase().replace(/\s+/g, '_'),
          theme_display: strategyDecision.safety_mode ? strategyDecision.safe_theme : undefined,
          safety_mode: strategyDecision.safety_mode,
          intent: strategyDecision.intent,
          sensitivity_tags: strategyDecision.sensitivity_tags,
          copy_policy: strategyDecision.copy_policy,
          strategic_profile: strategicProfile,
          flow_id: flowId,
          architecture: flow.architecture,
          type: flow.type,
          segment_code,
        },
        page: {
          title: pageTitle,
          subtitle: flow.impact_line,
          brand: { professional_name: '', whatsapp_number: '' },
        },
        form: {
          fields: formFields,
          submit_label: locale === 'en' ? 'See result' : locale === 'es' ? 'Ver resultado' : 'Ver resultado',
        },
        result: {
          headline: flow.result_preview,
          summary_bullets: [],
          cta: { text: flow.cta_default, action: 'whatsapp', value: '' },
        },
        architecture_payload: {},
      }
    } else if (!configJson) {
      // --- Modo legado: template_id obrigatório ---
      if (!templateId) {
        return NextResponse.json({ success: false, error: 'template_id ou (flow_id + interpretacao) é obrigatório' }, { status: 400 })
      }
      const { data: template, error: templateError } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('id, name, type, schema_json')
        .eq('id', templateId)
        .eq('active', true)
        .single()

      if (templateError || !template) {
        return NextResponse.json({ success: false, error: 'Template não encontrado ou inativo' }, { status: 404 })
      }
      const schema = (template.schema_json as Record<string, unknown>) || {}
      configJson = {
        title: titleOverride ?? schema.title ?? template.name,
        ctaText: ctaWhatsapp ?? schema.ctaDefault ?? 'Falar no WhatsApp',
        ...schema,
      }
    }

    // Freemium: usuário Free só pode ter 1 link ativo
    const isPro = await hasYladaProPlan(user.id)
    if (!isPro) {
      const { count } = await supabaseAdmin
        .from('ylada_links')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active')
      if ((count ?? 0) >= FREEMIUM_LIMITS.FREE_LIMIT_ACTIVE_LINKS) {
        return NextResponse.json(
          {
            success: false,
            limit_reached: true,
            limit_type: 'active_links',
            message: YLADA_FREEMIUM_ACTIVE_LINK_LIMIT_MESSAGE,
          },
          { status: 403 }
        )
      }
    }

    let slug = generateSlug()
    const maxRetries = 5
    for (let i = 0; i < maxRetries; i++) {
      const { data: existing } = await supabaseAdmin.from('ylada_links').select('id').eq('slug', slug).maybeSingle()
      if (!existing) break
      slug = generateSlug()
    }

    const titleRaw = (configJson.title as string) ?? 'Link'
    const titleFinal = formatDisplayTitle(titleRaw)
    configJson.title = titleFinal
    const pageConfig = configJson.page as Record<string, unknown> | undefined
    if (pageConfig && typeof pageConfig.title === 'string') {
      pageConfig.title = titleFinal
    }
    const { data: link, error: insertError } = await supabaseAdmin
      .from('ylada_links')
      .insert({
        user_id: user.id,
        template_id: templateId,
        segment,
        category,
        sub_category: subCategory,
        slug,
        title: titleFinal,
        config_json: configJson,
        cta_whatsapp: ctaWhatsapp,
        status: 'active',
      })
      .select('id, slug, title, config_json, cta_whatsapp, status, created_at')
      .single()

    if (insertError) {
      console.error('[ylada/links/generate]', insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    // Gerar diagnóstico via IA para links RISK_DIAGNOSIS / BLOCKER_DIAGNOSIS
    const arch = (link.config_json as Record<string, unknown>)?.meta?.architecture as string | undefined
    if ((arch === 'RISK_DIAGNOSIS' || arch === 'BLOCKER_DIAGNOSIS') && supabaseAdmin && process.env.OPENAI_API_KEY) {
      generateDiagnosisForLink(
        { linkId: link.id, config: link.config_json as Record<string, unknown>, force: false },
        supabaseAdmin,
        new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      ).catch((err) => console.warn('[ylada/links/generate] diagnosis generation:', err))
    }

    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = host ? `${protocol}://${host}` : ''
    const url = baseUrl ? `${baseUrl}/l/${link.slug}` : `/l/${link.slug}`

    return NextResponse.json({
      success: true,
      data: {
        ...link,
        url,
        config: link.config_json,
      },
    })
  } catch (e) {
    console.error('[ylada/links/generate]', e)
    return NextResponse.json({ success: false, error: 'Erro ao gerar link' }, { status: 500 })
  }
}
