import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { resolveYladaLinkIdForOwner } from '@/lib/pro-lideres-scripts-api'
import {
  PRO_LIDERES_SCRIPT_PILLARS,
  buildProLideresScriptsNoelSystemPrompt,
  normalizeScriptPillarId,
  parseNoelScriptDraft,
  type NoelScriptDraft,
  type ProLideresScriptPillarId,
} from '@/lib/pro-lideres-scripts-noel'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function pillarLabel(id: ProLideresScriptPillarId): string {
  return PRO_LIDERES_SCRIPT_PILLARS.find((p) => p.id === id)?.label ?? id
}

/**
 * POST /api/pro-lideres/scripts/generate-noel
 * Gera rascunho JSON de uma situação + sequência de scripts (só dono do tenant / líder do espaço).
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
      { error: 'Apenas o líder do espaço pode gerar scripts com o Noel.' },
      { status: 403 }
    )
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: {
    purpose?: unknown
    pillar?: unknown
    ylada_link_id?: unknown
    locale?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const purpose = typeof body.purpose === 'string' ? body.purpose.trim() : ''
  if (purpose.length < 8) {
    return NextResponse.json(
      { error: 'Descreve o objetivo com pelo menos algumas palavras (mín. 8 caracteres).' },
      { status: 400 }
    )
  }
  if (purpose.length > 4000) {
    return NextResponse.json({ error: 'Objetivo demasiado longo.' }, { status: 400 })
  }

  const pillar = normalizeScriptPillarId(body.pillar)
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

  const systemPrompt = buildProLideresScriptsNoelSystemPrompt({
    operationLabel,
    verticalCode,
    focusNotes: t.focus_notes?.trim() || null,
    pillar,
    pillarLabel: pillarLabel(pillar),
    purpose,
    toolLabel,
    toolWhenToUse,
    replyLanguage,
  })

  const userMessage = `Gera o JSON para o pilar "${pillar}" e o propósito acima. Regras absolutas:
- Cada entries[].body é texto que o DISTRIBUIDOR envia a CLIENTE/LEAD/PÚBLICO (copiar/colar), nunca mensagem "Olá equipe" nem ao grupo interno.
- Português do Brasil: **nunca** uses "follow-up" — usa **"acompanhamento"** se precisares desse conceito.
- Se houver link/ferramenta no contexto: inclui **pedido de permissão** antes do link; **coleta de indicação** (quem mais pode se beneficiar) de forma natural; ângulo **família / quem ama** para preparar **compartilhar o link** com gatilhos mentais sutis e éticos.
Só JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.55,
      max_tokens: 3500,
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
      console.error('[pro-lideres/scripts/generate-noel parse]', e, raw.slice(0, 500))
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
            'O Noel devolveu textos demasiado curtos ou vazios. Tenta de novo com mais detalhe no objetivo, ou reformula.',
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
    console.error('[pro-lideres/scripts/generate-noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar rascunho. Tenta de novo.' }, { status: 502 })
  }
}
