import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { resolveYladaLinkIdForOwner } from '@/lib/pro-lideres-scripts-api'
import {
  PRO_LIDERES_SCRIPT_PILLARS,
  buildProLideresScriptsNoelRefineSystemPrompt,
  normalizeScriptPillarId,
  parseNoelScriptDraft,
  type AdaptTrainingAudienceId,
  type AdaptTrainingCompactnessId,
  type NoelScriptDraft,
  type ProLideresScriptPillarId,
} from '@/lib/pro-lideres-scripts-noel'

const ADAPT_AUDIENCES = new Set<AdaptTrainingAudienceId>(['equipe', 'cliente', 'ambos'])
const ADAPT_COMPACT = new Set<AdaptTrainingCompactnessId>(['só_linguagem', 'linguagem_encurtar'])

function parseAdaptRefine(raw: unknown): {
  audience: AdaptTrainingAudienceId
  compactness: AdaptTrainingCompactnessId
} | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const audience = typeof o.audience === 'string' ? o.audience.trim() : ''
  const compactness = typeof o.compactness === 'string' ? o.compactness.trim() : ''
  if (!ADAPT_AUDIENCES.has(audience as AdaptTrainingAudienceId)) return null
  if (!ADAPT_COMPACT.has(compactness as AdaptTrainingCompactnessId)) return null
  return {
    audience: audience as AdaptTrainingAudienceId,
    compactness: compactness as AdaptTrainingCompactnessId,
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function pillarLabel(id: ProLideresScriptPillarId): string {
  return PRO_LIDERES_SCRIPT_PILLARS.find((p) => p.id === id)?.label ?? id
}

function parseDraftInput(raw: unknown): NoelScriptDraft | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const section_title = typeof o.section_title === 'string' ? o.section_title.trim() : ''
  if (!section_title) return null
  const entries = o.entries
  if (!Array.isArray(entries) || entries.length < 1) return null
  return raw as NoelScriptDraft
}

/**
 * POST /api/pro-lideres/scripts/refine-noel
 * Ajusta um rascunho JSON com base num pedido em linguagem natural (só líder).
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI não configurado' }, { status: 503 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json(
      { error: 'Apenas o líder do espaço pode refinar scripts com o Noel.' },
      { status: 403 }
    )
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  let body: {
    draft?: unknown
    instruction?: unknown
    pillar?: unknown
    purpose?: unknown
    ylada_link_id?: unknown
    locale?: unknown
    adapt_training_refine?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const draftIn = parseDraftInput(body.draft)
  if (!draftIn) {
    return NextResponse.json({ error: 'Rascunho inválido ou incompleto.' }, { status: 400 })
  }

  const instruction = typeof body.instruction === 'string' ? body.instruction.trim() : ''
  if (instruction.length < 3) {
    return NextResponse.json({ error: 'Escreve o que queres alterar (mínimo 3 caracteres).' }, { status: 400 })
  }
  if (instruction.length > 2000) {
    return NextResponse.json({ error: 'Pedido demasiado longo.' }, { status: 400 })
  }

  const pillar = normalizeScriptPillarId(body.pillar)
  const purpose =
    typeof body.purpose === 'string' && body.purpose.trim().length >= 8
      ? body.purpose.trim().slice(0, 4000)
      : 'Refinar o rascunho conforme o pedido do líder.'

  const ylada = await resolveYladaLinkIdForOwner(supabaseAdmin, body.ylada_link_id, ctx.tenant.owner_user_id)
  if (!ylada.ok) {
    return NextResponse.json({ error: ylada.error }, { status: 400 })
  }

  let toolLabel: string | null = null
  let toolWhenToUse: string | null = null
  if (ylada.id) {
    const { data: link } = await supabaseAdmin
      .from('ylada_links')
      .select('title, segment, category')
      .eq('id', ylada.id)
      .eq('user_id', ctx.tenant.owner_user_id)
      .maybeSingle()
    if (link) {
      toolLabel = (link.title as string)?.trim() || null
      const parts = [link.segment, link.category].filter(Boolean).map(String)
      toolWhenToUse = parts.length ? parts.join(' · ') : null
    }
  }

  const locale = typeof body.locale === 'string' ? body.locale : 'pt'
  const replyLanguage = locale === 'en' ? 'English' : 'Portuguese (Brazil)'

  const t = ctx.tenant
  const operationLabel =
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
  const verticalCode = (t.vertical_code ?? 'h-lider').trim() || 'h-lider'

  const adaptRefine = parseAdaptRefine(body.adapt_training_refine)

  const systemPrompt = buildProLideresScriptsNoelRefineSystemPrompt({
    operationLabel,
    verticalCode,
    focusNotes: t.focus_notes?.trim() || null,
    pillar,
    pillarLabel: pillarLabel(pillar),
    purpose,
    toolLabel,
    toolWhenToUse,
    replyLanguage,
    adaptRefine: adaptRefine ?? null,
  })

  const destinatarioRegra = adaptRefine
    ? 'mantém o **destinatário** de cada entrada (líder→distribuidor vs campo) coerente com títulos/subtítulos; não inventes passos novos nos `body`.'
    : 'mantém destinatário dos `body` como cliente/lead/público;'

  const userMessage = `RASCUNHO ATUAL (JSON — devolve o objeto completo atualizado):
${JSON.stringify(draftIn)}

PEDIDO DO LÍDER PARA ALTERAR:
${instruction}

Regras: ${destinatarioRegra} português do Brasil; sem "follow-up" (usa acompanhamento); preserva **abertura com educação/conscientização** e **continuidade lógica** entre mensagens (filosofia YLADA), salvo o pedido do líder pedir explicitamente o contrário. Só JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })
    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) {
      return NextResponse.json({ error: 'Resposta vazia do modelo' }, { status: 502 })
    }

    let draft: NoelScriptDraft
    try {
      draft = parseNoelScriptDraft(raw)
    } catch (e) {
      console.error('[pro-lideres/scripts/refine-noel parse]', e, raw.slice(0, 500))
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Não foi possível interpretar a resposta do Noel.' },
        { status: 502 }
      )
    }

    const withBodies = draft.entries.filter((e) => e.body.trim().length >= 8)
    if (withBodies.length < 1) {
      return NextResponse.json(
        {
          error:
            'O Noel devolveu textos demasiado curtos após o ajuste. Reformula o pedido ou gera de novo.',
        },
        { status: 502 }
      )
    }
    draft = { ...draft, entries: withBodies }

    return NextResponse.json({
      draft,
      ylada_link_id: ylada.id,
      pillar,
    })
  } catch (e) {
    console.error('[pro-lideres/scripts/refine-noel]', e)
    return NextResponse.json({ error: 'Falha ao refinar. Tenta de novo.' }, { status: 502 })
  }
}
