import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildEsteticaLeadClientPayloadFromPreAnswers,
  isDiagnosticoEmailConfirmationTemplate,
  isOpenEntryPreDiagnosticoTemplate,
} from '@/lib/estetica-consultoria-form-templates'
import {
  resolveEsteticaPreNotifyEmail,
  sendEsteticaPreDiagnosticoFilledNotifyEmail,
} from '@/lib/estetica-consultoria-pre-notify-email'
import { getConsultoriaFormFields, validateConsultoriaFormAnswers } from '@/lib/pro-lideres-consultoria'

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

  const { data: link, error: linkErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .select(
      'id, material_id, estetica_consult_client_id, expires_at, recipient_email, recipient_confirmed_at'
    )
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
    .from('ylada_estetica_consultancy_materials')
    .select('id, material_kind, content, is_published, template_key')
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

  const tpl = (mat as { template_key?: string | null }).template_key
  const rec = String((link as { recipient_email?: string | null }).recipient_email ?? '').trim()
  const confirmed = Boolean((link as { recipient_confirmed_at?: string | null }).recipient_confirmed_at)
  if (isDiagnosticoEmailConfirmationTemplate(tpl) && rec.length > 0 && !confirmed) {
    return NextResponse.json(
      { error: 'Confirme o e-mail (link no inbox) antes de enviar o diagnóstico.' },
      { status: 403 }
    )
  }

  const check = validateConsultoriaFormAnswers(fields, answers)
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 })
  }

  const rawClientId = (link as { estetica_consult_client_id?: string | null }).estetica_consult_client_id
  let esteticaConsultClientId =
    rawClientId == null || rawClientId === '' ? null : String(rawClientId).trim()

  if (!esteticaConsultClientId) {
    if (!tpl || !isOpenEntryPreDiagnosticoTemplate(tpl)) {
      return NextResponse.json(
        { error: 'Este formulário exige uma clínica associada ao link. Use o link público de pré-diagnóstico ou peça um link válido.' },
        { status: 400 }
      )
    }
    const payload = buildEsteticaLeadClientPayloadFromPreAnswers(tpl, answers, respondentEmail)
    const { data: newCli, error: cliErr } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .insert({
        business_name: payload.business_name,
        contact_name: payload.contact_name,
        phone: payload.phone,
        contact_email: payload.contact_email,
        segment: payload.segment,
        created_by_user_id: null,
      })
      .select('id')
      .single()

    if (cliErr || !newCli?.id) {
      return NextResponse.json(
        { error: cliErr?.message ?? 'Não foi possível criar a ficha a partir do pré-diagnóstico.' },
        { status: 500 }
      )
    }
    esteticaConsultClientId = newCli.id as string
  }

  const { error: insErr } = await supabaseAdmin.from('ylada_estetica_consultancy_form_responses').insert({
    material_id: mat.id,
    share_link_id: link.id,
    estetica_consult_client_id: esteticaConsultClientId,
    respondent_name: respondentName,
    respondent_email: respondentEmail,
    answers,
  })

  if (insErr) {
    return NextResponse.json({ error: 'Não foi possível guardar a resposta.' }, { status: 500 })
  }

  if (tpl && isOpenEntryPreDiagnosticoTemplate(tpl)) {
    const to = resolveEsteticaPreNotifyEmail()
    if (to) {
      const prePayload = buildEsteticaLeadClientPayloadFromPreAnswers(tpl, answers, respondentEmail)
      const adminPanelUrl = `${request.nextUrl.origin}/admin/estetica-consultoria`
      void sendEsteticaPreDiagnosticoFilledNotifyEmail({
        toEmail: to,
        businessName: prePayload.business_name,
        segment: prePayload.segment,
        adminPanelUrl,
      }).then((r) => {
        if (!r.ok) console.warn('[estetica-pre-notify]', r.error)
      })
    }
  }

  return NextResponse.json({ ok: true })
}
