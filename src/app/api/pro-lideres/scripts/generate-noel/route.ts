import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { resolveYladaLinkIdForOwner } from '@/lib/pro-lideres-scripts-api'
import {
  PRO_LIDERES_SCRIPT_PILLARS,
  buildProLideresScriptsNoelAdaptTrainingSystemPrompt,
  buildProLideresScriptsNoelSystemPrompt,
  normalizeScriptPillarId,
  parseNoelScriptDraft,
  type AdaptTrainingAudienceId,
  type AdaptTrainingCompactnessId,
  type NoelScriptDraft,
  type ProLideresScriptPillarId,
} from '@/lib/pro-lideres-scripts-noel'

const ADAPT_AUDIENCES = new Set<AdaptTrainingAudienceId>(['equipe', 'cliente', 'ambos'])
const ADAPT_COMPACT = new Set<AdaptTrainingCompactnessId>(['só_linguagem', 'linguagem_encurtar'])

function parseAdaptTraining(raw: unknown): {
  source_text: string
  audience: AdaptTrainingAudienceId
  compactness: AdaptTrainingCompactnessId
} | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const source_text = typeof o.source_text === 'string' ? o.source_text.trim() : ''
  const audience = typeof o.audience === 'string' ? o.audience.trim() : ''
  const compactness = typeof o.compactness === 'string' ? o.compactness.trim() : ''
  if (!source_text) return null
  if (!ADAPT_AUDIENCES.has(audience as AdaptTrainingAudienceId)) return null
  if (!ADAPT_COMPACT.has(compactness as AdaptTrainingCompactnessId)) return null
  return {
    source_text,
    audience: audience as AdaptTrainingAudienceId,
    compactness: compactness as AdaptTrainingCompactnessId,
  }
}

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

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  let body: {
    purpose?: unknown
    pillar?: unknown
    ylada_link_id?: unknown
    locale?: unknown
    /** Quando true, o propósito veio do fluxo guiado (objetivo, público, tom, canal). */
    guided?: unknown
    /** Modo «Adaptar treino ao tom YLADA»: cola material e converte linguagem. */
    adapt_training?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const adapt = parseAdaptTraining(body.adapt_training)

  const purpose = typeof body.purpose === 'string' ? body.purpose.trim() : ''
  if (!adapt) {
    if (purpose.length < 8) {
      return NextResponse.json(
        { error: 'Descreve o objetivo com pelo menos algumas palavras (mín. 8 caracteres).' },
        { status: 400 }
      )
    }
    if (purpose.length > 4000) {
      return NextResponse.json({ error: 'Objetivo demasiado longo.' }, { status: 400 })
    }
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

  let systemPrompt: string
  let userMessage: string
  const guided = body.guided === true

  if (adapt) {
    if (adapt.source_text.length < 50) {
      return NextResponse.json(
        { error: 'Cola o treino ou texto com pelo menos 50 caracteres para o Noel adaptar.' },
        { status: 400 }
      )
    }
    if (adapt.source_text.length > 14000) {
      return NextResponse.json(
        { error: 'Texto demasiado longo (máx. 14 000 caracteres). Divide em duas partes ou resume antes de colar.' },
        { status: 400 }
      )
    }

    systemPrompt = buildProLideresScriptsNoelAdaptTrainingSystemPrompt({
      operationLabel,
      verticalCode,
      focusNotes: t.focus_notes?.trim() || null,
      replyLanguage,
      audience: adapt.audience,
      compactness: adapt.compactness,
    })

    const audienceLabel =
      adapt.audience === 'equipe'
        ? 'Líder → distribuidor / treino interno (sem mensagem genérica a grupo da equipe)'
        : adapt.audience === 'cliente'
          ? 'Distribuidor → cliente, lead ou público'
          : 'Ambos: usar subtítulo em cada entrada (Líder → distribuidor vs Campo — cliente/lead) quando fizer sentido'

    const compactLabel =
      adapt.compactness === 'só_linguagem'
        ? 'Só linguagem (mantém extensão semelhante; muda tom)'
        : 'Linguagem + encurtar (pode apertar parágrafos sem apagar passos do original)'

    userMessage = `TREINAMENTO OU TEXTO ORIGINAL DO LÍDER (não inventes factos além disto; conserva passos e números que já existam):

"""
${adapt.source_text}
"""

DESTINATÁRIO PEDIDO: ${audienceLabel}
INTENSIDADE: ${compactLabel}

Gera o JSON conforme o system prompt. Só JSON.`
  } else {
    systemPrompt = buildProLideresScriptsNoelSystemPrompt({
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

    userMessage = `Gera o JSON para o pilar "${pillar}" e o propósito acima. Regras absolutas:
- Cada entries[].body é texto que o DISTRIBUIDOR envia a CLIENTE/LEAD/PÚBLICO (copiar/colar), nunca mensagem "Olá equipe" nem ao grupo interno.
- Português do Brasil: **nunca** uses "follow-up" — usa **"acompanhamento"** se precisares desse conceito.
- **Abertura YLADA**: a primeira mensagem deve **educar ou conscientizar** (tema, hábito, micro-valor) **antes** de apresentar marca, espaço ou catálogo de produtos; as seguintes seguem **fio lógico** até permissão, ferramenta/diagnóstico e próximo passo.
- **title** de cada entrada: deve refletir a fase (reflexão → permissão → diagnóstico/ferramenta → link); **não** ponha "Apresentação do Espaço" ou pitch de produto na mensagem 1 salvo o propósito pedir explicitamente.
- Se o fluxo tiver **ferramenta/diagnóstico** e **WhatsApp 1:1**, pode acrescentar **uma última mensagem curta** em **português do Brasil** (ex.: se depois do diagnóstico fizer sentido pra você uma orientação rápida, **na própria página tem** o botão pra me chamar no Zap) — **sem** inventar número ou link de Zap; evite tratamento europeu (ex.: «quiseres», «vires»).
- Se houver link/ferramenta no contexto: **permissão** antes do link; indicação ou "quem mais pode se beneficiar" só com **tom de cooperação** (ajudar quem importa), **saída honrosa** se a pessoa não tiver ninguém em mente; **sem** urgência falsa nem culpa.
${guided ? '- O propósito veio de um **fluxo guiado** (rótulos OBJETIVO / PÚBLICO / TOM / CANAL, etc.): **respeita cada linha** como combinado com o líder.\n' : ''}- Se o material for para a **equipe** reutilizar: onde couber um link pessoal, usa **(teu link de [nome da ferramenta])** em vez de URL inventada.\nSó JSON.`
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: adapt ? 0.4 : 0.45,
      max_tokens: adapt ? 8000 : 3500,
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
      adapt_meta: adapt
        ? { audience: adapt.audience, compactness: adapt.compactness }
        : undefined,
    })
  } catch (e) {
    console.error('[pro-lideres/scripts/generate-noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar rascunho. Tenta de novo.' }, { status: 502 })
  }
}
