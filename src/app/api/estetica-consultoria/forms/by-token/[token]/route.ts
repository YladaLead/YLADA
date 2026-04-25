import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildEsteticaDiagnosticoPublicPrefill,
  getDiagnosticoTemplateDescription,
  isDiagnosticoEmailConfirmationTemplate,
  isEsteticaConsultoriaPrefillTemplate,
} from '@/lib/estetica-consultoria-form-templates'
import { maskRecipientEmail } from '@/lib/estetica-consultoria-confirmation-email'
import { getConsultoriaFormFields } from '@/lib/pro-lideres-consultoria'

type Ctx = { params: Promise<{ token: string }> }

type ShareLinkRow = {
  id: string
  material_id: string
  expires_at: string | null
  estetica_consult_client_id: string | null
  recipient_email?: string | null
  recipient_confirmed_at?: string | null
  email_confirm_token?: string | null
  email_confirm_expires_at?: string | null
}

export async function GET(request: NextRequest, context: Ctx) {
  const { token: raw } = await context.params
  const token = decodeURIComponent(raw || '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Token em falta' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 503 })
  }

  const confirmParam = request.nextUrl.searchParams.get('confirm')?.trim() ?? ''

  const { data: linkRaw, error: linkErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .select(
      'id, material_id, expires_at, estetica_consult_client_id, recipient_email, recipient_confirmed_at, email_confirm_token, email_confirm_expires_at'
    )
    .eq('token', token)
    .maybeSingle()

  if (linkErr || !linkRaw) {
    return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 404 })
  }

  let link = linkRaw as ShareLinkRow

  if (link.expires_at) {
    const exp = new Date(link.expires_at).getTime()
    if (Number.isFinite(exp) && exp < Date.now()) {
      return NextResponse.json({ error: 'Este link expirou.' }, { status: 410 })
    }
  }

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('id, title, description, material_kind, content, is_published, template_key')
    .eq('id', link.material_id)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Formulário não disponível.' }, { status: 404 })
  }

  if (!mat.is_published) {
    return NextResponse.json({ error: 'Este formulário ainda não está publicado.' }, { status: 403 })
  }

  const templateKey = (mat as { template_key?: string | null }).template_key
  const isDiagnosticoFixoEmail = isDiagnosticoEmailConfirmationTemplate(templateKey)
  const recipientEmail = (link.recipient_email ?? '').trim()

  if (confirmParam && isDiagnosticoFixoEmail && recipientEmail) {
    if (!link.recipient_confirmed_at) {
      const expMs = link.email_confirm_expires_at ? new Date(link.email_confirm_expires_at).getTime() : 0
      const tokenOk =
        link.email_confirm_token &&
        link.email_confirm_token === confirmParam &&
        Number.isFinite(expMs) &&
        expMs > Date.now()
      if (!tokenOk) {
        return NextResponse.json(
          { error: 'Link de confirmação inválido ou expirado. Pedir um novo e-mail no mesmo link do formulário.' },
          { status: 400 }
        )
      }
      const { error: upErr } = await supabaseAdmin
        .from('ylada_estetica_consultancy_share_links')
        .update({
          recipient_confirmed_at: new Date().toISOString(),
          email_confirm_token: null,
          email_confirm_expires_at: null,
        })
        .eq('id', link.id)
      if (upErr) {
        return NextResponse.json({ error: 'Não foi possível confirmar o e-mail.' }, { status: 500 })
      }
      const { data: refreshed } = await supabaseAdmin
        .from('ylada_estetica_consultancy_share_links')
        .select(
          'id, material_id, expires_at, estetica_consult_client_id, recipient_email, recipient_confirmed_at, email_confirm_token, email_confirm_expires_at'
        )
        .eq('id', link.id)
        .maybeSingle()
      if (refreshed) {
        link = refreshed as ShareLinkRow
      }
    }
  }

  const content = (mat.content && typeof mat.content === 'object' ? mat.content : {}) as Record<
    string,
    unknown
  >
  const fields = getConsultoriaFormFields(content)

  const descOverride = getDiagnosticoTemplateDescription(templateKey)
  const description = descOverride ?? mat.description

  const emailGate = isDiagnosticoFixoEmail && recipientEmail.length > 0 && !link.recipient_confirmed_at

  if (emailGate) {
    return NextResponse.json({
      title: mat.title,
      description,
      needsEmailConfirmation: true,
      recipientMasked: maskRecipientEmail(recipientEmail),
      fields: [],
      shareLinkId: link.id,
    })
  }

  let prefill: ReturnType<typeof buildEsteticaDiagnosticoPublicPrefill> | null = null
  const clientId = link.estetica_consult_client_id
  if (clientId && (isDiagnosticoFixoEmail || isEsteticaConsultoriaPrefillTemplate(templateKey))) {
    const { data: cli } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .select('business_name, contact_name, phone, contact_email')
      .eq('id', clientId)
      .maybeSingle()
    if (cli && typeof cli.business_name === 'string') {
      prefill = buildEsteticaDiagnosticoPublicPrefill({
        business_name: cli.business_name,
        contact_name: (cli as { contact_name?: string | null }).contact_name ?? null,
        phone: (cli as { phone?: string | null }).phone ?? null,
        contact_email: (cli as { contact_email?: string | null }).contact_email ?? null,
      })
    }
  }

  return NextResponse.json({
    title: mat.title,
    description,
    fields,
    shareLinkId: link.id,
    ...(prefill ? { prefill } : {}),
  })
}
