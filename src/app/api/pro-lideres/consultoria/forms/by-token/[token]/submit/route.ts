import { NextRequest, NextResponse } from 'next/server'
import {
  resolveProLideresLeaderNotifyTarget,
  sendProLideresPreDiagnosticoFilledNotifyEmail,
} from '@/lib/pro-lideres-pre-diagnostico-notify-email'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
import {
  consultoriaAnswersToWhatsappLine,
  consultoriaWhatsappLineHasMinDigits,
} from '@/lib/pro-lideres-pre-diagnostico-whatsapp'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getConsultoriaFormFields,
  getConsultoriaFormUIHints,
  validateConsultoriaFormAnswers,
} from '@/lib/pro-lideres-consultoria'

type Ctx = { params: Promise<{ token: string }> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest, context: Ctx) {
  const { token: raw } = await context.params
  const token = decodeURIComponent(raw || '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Token em falta' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 503 })
  }

  let body: {
    answers?: Record<string, unknown>
    respondent_name?: string | null
    respondent_email?: string | null
    respondent_whatsapp?: string | null
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const answers =
    body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
      ? (body.answers as Record<string, unknown>)
      : {}

  const respondentName =
    body.respondent_name == null ? null : String(body.respondent_name).trim().slice(0, 200) || null
  const respondentEmailRaw =
    body.respondent_email == null ? '' : String(body.respondent_email).trim().toLowerCase()
  const respondentEmail =
    respondentEmailRaw && EMAIL_RE.test(respondentEmailRaw) ? respondentEmailRaw.slice(0, 320) : null
  const respondentWhatsappRaw =
    body.respondent_whatsapp == null ? '' : String(body.respondent_whatsapp).trim()
  const respondentWhatsapp = respondentWhatsappRaw ? respondentWhatsappRaw.slice(0, 48) : null

  const { data: link, error: linkErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('id, material_id, leader_tenant_id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (linkErr || !link) {
    return NextResponse.json({ error: 'Link inválido.' }, { status: 404 })
  }

  if (link.expires_at) {
    const exp = new Date(link.expires_at).getTime()
    if (Number.isFinite(exp) && exp < Date.now()) {
      return NextResponse.json({ error: 'Este link expirou.' }, { status: 410 })
    }
  }

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind, content, is_published')
    .eq('id', link.material_id)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario' || !mat.is_published) {
    return NextResponse.json({ error: 'Formulário não disponível.' }, { status: 404 })
  }

  const content = (mat.content && typeof mat.content === 'object' ? mat.content : {}) as Record<
    string,
    unknown
  >
  const fields = getConsultoriaFormFields(content)
  if (!fields.length) {
    return NextResponse.json({ error: 'Formulário sem campos configurados.' }, { status: 400 })
  }

  const ui = getConsultoriaFormUIHints(content)
  const hasWaPair =
    fields.some((f) => f.id === 'whatsapp_ddi') && fields.some((f) => f.id === 'whatsapp')
  const computedWhatsapp = hasWaPair ? consultoriaAnswersToWhatsappLine(answers) : null

  if (ui?.contactBlockMode === 'required_name_email') {
    const nm = respondentName ?? ''
    if (!nm.trim()) {
      return NextResponse.json({ error: 'O nome completo é obrigatório.' }, { status: 400 })
    }
    if (!respondentEmail) {
      return NextResponse.json({ error: 'Indique um e-mail válido.' }, { status: 400 })
    }
    if (!consultoriaWhatsappLineHasMinDigits(computedWhatsapp)) {
      return NextResponse.json(
        { error: 'Preencha o WhatsApp: país (DDI) e número com DDD.' },
        { status: 400 }
      )
    }
  }
  if (ui?.contactBlockMode === 'required_with_whatsapp') {
    const nm = respondentName ?? ''
    if (!nm.trim()) {
      return NextResponse.json({ error: 'O nome completo é obrigatório.' }, { status: 400 })
    }
    if (!respondentEmail) {
      return NextResponse.json({ error: 'Indique um e-mail válido.' }, { status: 400 })
    }
    if (!hasWaPair && (!respondentWhatsapp || respondentWhatsapp.replace(/\D/g, '').length < 8)) {
      return NextResponse.json({ error: 'Indique um WhatsApp válido (com DDI ou DDD).' }, { status: 400 })
    }
    if (hasWaPair && !consultoriaWhatsappLineHasMinDigits(computedWhatsapp)) {
      return NextResponse.json(
        { error: 'Preencha o WhatsApp: país (DDI) e número com DDD.' },
        { status: 400 }
      )
    }
  }

  const check = validateConsultoriaFormAnswers(fields, answers)
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 })
  }

  const respondentWhatsappInsert =
    hasWaPair && computedWhatsapp ? computedWhatsapp : respondentWhatsapp

  const { error: insErr } = await supabaseAdmin.from('pro_lideres_consultancy_form_responses').insert({
    material_id: mat.id,
    share_link_id: link.id,
    leader_tenant_id: link.leader_tenant_id,
    respondent_name: respondentName,
    respondent_email: respondentEmail,
    respondent_whatsapp: respondentWhatsappInsert,
    answers,
  })

  if (insErr) {
    return NextResponse.json({ error: 'Não foi possível guardar a resposta.' }, { status: 500 })
  }

  if (mat.id === PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID && link.leader_tenant_id && supabaseAdmin) {
    const origin = request.nextUrl.origin
    const painelUrl = `${origin.replace(/\/$/, '')}/pro-lideres/painel/pre-diagnostico`
    void (async () => {
      const target = await resolveProLideresLeaderNotifyTarget(supabaseAdmin, link.leader_tenant_id as string)
      if (!target) {
        console.warn('[pro-lideres-pre-diagnostico-notify] sem e-mail do líder para tenant', link.leader_tenant_id)
        return
      }
      const r = await sendProLideresPreDiagnosticoFilledNotifyEmail({
        toEmail: target.toEmail,
        leaderDisplayName: target.displayName,
        respondentName,
        respondentEmail,
        respondentWhatsapp: respondentWhatsappInsert,
        painelPreDiagnosticoUrl: painelUrl,
      })
      if (!r.ok) console.warn('[pro-lideres-pre-diagnostico-notify]', r.error)
    })()
  }

  return NextResponse.json({ ok: true })
}
