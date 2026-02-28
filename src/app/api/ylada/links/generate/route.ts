/**
 * POST /api/ylada/links/generate — gera instância de link a partir de template ou de flow_id + interpretacao.
 * Body: { template_id } OU { flow_id, interpretacao } (segment?, title?, cta_whatsapp? em ambos).
 * Retorna: { success, data: { id, slug, url, title, config, ... } }
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md (Etapa 6)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getFlowById, VALID_FLOW_IDS } from '@/config/ylada-flow-catalog'
import { interpretStrategyContext } from '@/lib/ylada/strategic-interpreter'
import { deriveStrategicProfile } from '@/lib/ylada/strategic-profile'
import { randomBytes } from 'crypto'

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
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const flowId = typeof body.flow_id === 'string' ? body.flow_id.trim() : ''
    const interpretacao = body.interpretacao && typeof body.interpretacao === 'object' ? body.interpretacao as Record<string, unknown> : null
    const templateIdLegacy = typeof body.template_id === 'string' ? body.template_id.trim() : ''

    const segment = typeof body.segment === 'string' ? body.segment.trim() || null : null
    const category = typeof body.category === 'string' ? body.category.trim() || null : null
    const subCategory = typeof body.sub_category === 'string' ? body.sub_category.trim() || null : null
    const titleOverride = typeof body.title === 'string' ? body.title.trim() || null : null
    const ctaWhatsapp = typeof body.cta_whatsapp === 'string' ? body.cta_whatsapp.trim() || null : null

    let templateId = templateIdLegacy
    let configJson: Record<string, unknown>

    if (flowId && VALID_FLOW_IDS.includes(flowId) && interpretacao) {
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
      const themeDisplay = strategyDecision.safety_mode && strategyDecision.safe_theme
        ? strategyDecision.safe_theme
        : themeRaw || 'seu tema'

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

      // Não espalhar schema do template: o link é orientado ao visitante/paciente (form + motor),
      // não ao quiz gerencial (questions/results) que pode estar no template.
      const schema = (templateByType.schema_json as Record<string, unknown>) || {}
      const pageTitle = titleOverride ?? `${flow.display_name} — ${themeDisplay}`
      configJson = {
        title: pageTitle,
        ctaText: ctaWhatsapp ?? (schema.ctaDefault as string) ?? flow.cta_default,
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
        },
        page: {
          title: pageTitle,
          subtitle: flow.impact_line,
          brand: { professional_name: '', whatsapp_number: '' },
        },
        form: {
          fields: flow.question_labels.map((label, i) => ({ id: `q${i + 1}`, label, type: 'text' })),
          submit_label: 'Ver resultado',
        },
        result: {
          headline: flow.result_preview,
          summary_bullets: [],
          cta: { text: flow.cta_default, action: 'whatsapp', value: '' },
        },
        architecture_payload: {},
      }
    } else {
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

    let slug = generateSlug()
    const maxRetries = 5
    for (let i = 0; i < maxRetries; i++) {
      const { data: existing } = await supabaseAdmin.from('ylada_links').select('id').eq('slug', slug).maybeSingle()
      if (!existing) break
      slug = generateSlug()
    }

    const titleFinal = (configJson.title as string) ?? 'Link'
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
