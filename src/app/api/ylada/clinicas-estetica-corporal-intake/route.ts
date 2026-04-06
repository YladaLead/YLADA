/**
 * POST /api/ylada/clinicas-estetica-corporal-intake — formulário B2B (sem auth).
 */
import { NextRequest, NextResponse } from 'next/server'
import { buildClinicasEsteticaDiagnosis } from '@/lib/clinicas-estetica-corporal-diagnosis'
import { formatBrazilPhoneDisplay } from '@/lib/format-brazil-phone'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

const TEAM_STRUCTURE = new Set(['so_1', 'pequena_2_4', 'estruturada_5_10', 'maior_10'])
const MAIN_FOCUS = new Set(['corporal', 'corporal_facial', 'mais_facial', 'outro'])
const PAIN = new Set([
  'preco_nao_fecha',
  'agenda_inconsistente',
  'depende_promocao',
  'whatsapp_sem_fecho',
  'movimento_mais_faturamento',
  'outro',
])
const TERNARY = new Set(['sim', 'talvez', 'nao'])
const TIME_WASTE = new Set(['frequentemente', 'as_vezes', 'raramente'])
const INTEREST = new Set(['sim_ver', 'tenho_interesse', 'talvez_depois', 'so_analisando'])
const TIMELINE = new Set(['ja', '30d', '90d', 'sem_pressa'])

type Body = { answers?: Record<string, unknown> }

function clampStr(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, max)
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function normalizePhone(raw: string): string {
  const d = raw.replace(/\D/g, '')
  return d
}

const LABELS: Record<string, Record<string, string>> = {
  team_structure: {
    so_1: 'Só eu',
    pequena_2_4: 'Pequena equipe (2 a 4 pessoas)',
    estruturada_5_10: 'Equipe estruturada (5 a 10)',
    maior_10: 'Estrutura maior (+10)',
  },
  main_focus: {
    corporal: 'Estética corporal',
    corporal_facial: 'Corporal e facial',
    mais_facial: 'Mais facial',
    outro: 'Outro',
  },
  pain: {
    preco_nao_fecha: 'Muitas pessoas perguntam preço e não fecham',
    agenda_inconsistente: 'Agenda inconsistente (dias cheios e dias vazios)',
    depende_promocao: 'Preciso fazer promoções pra atrair clientes',
    whatsapp_sem_fecho: 'Perco tempo no WhatsApp com quem não fecha',
    movimento_mais_faturamento: 'Tenho movimento, mas poderia faturar mais',
    outro: 'Outro',
  },
  ternary: { sim: 'Sim', talvez: 'Talvez', nao: 'Não' },
  time_waste: {
    frequentemente: 'Sim, frequentemente',
    as_vezes: 'Às vezes',
    raramente: 'Raramente',
  },
  interest_attract: {
    sim_ver: 'Sim, quero ver isso',
    tenho_interesse: 'Tenho interesse',
    talvez_depois: 'Talvez depois',
    so_analisando: 'Só estou analisando',
  },
  timeline: {
    ja: 'O quanto antes',
    '30d': 'Nos próximos 30 dias',
    '90d': 'Até 90 dias',
    sem_pressa: 'Sem pressa',
  },
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const raw = (await request.json().catch(() => ({}))) as Body
    const src = raw.answers && typeof raw.answers === 'object' ? raw.answers : {}
    const out: Record<string, string> = {}

    const clinic = clampStr(src.clinic_name, 200)
    if (clinic.length < 2) {
      return NextResponse.json({ success: false, error: 'Informe o nome da clínica ou marca' }, { status: 400 })
    }
    out.clinic_name = clinic

    const contact = clampStr(src.contact_name, 120)
    if (contact.length < 2) {
      return NextResponse.json({ success: false, error: 'Informe seu nome' }, { status: 400 })
    }
    out.contact_name = contact

    const phoneRaw = clampStr(src.phone, 40)
    const phoneDigits = normalizePhone(phoneRaw)
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Informe um WhatsApp válido (com DDD)' },
        { status: 400 }
      )
    }
    out.phone = phoneRaw

    const email = clampStr(src.email, 255)
    if (email.length > 0) {
      if (!isEmail(email)) {
        return NextResponse.json({ success: false, error: 'E-mail inválido' }, { status: 400 })
      }
      out.email = email.toLowerCase()
    }

    const team = clampStr(src.team_structure, 30)
    if (!TEAM_STRUCTURE.has(team)) {
      return NextResponse.json({ success: false, error: 'Resposta inválida (estrutura)' }, { status: 400 })
    }
    out.team_structure = team

    const focus = clampStr(src.main_focus, 30)
    if (!MAIN_FOCUS.has(focus)) {
      return NextResponse.json({ success: false, error: 'Resposta inválida (foco)' }, { status: 400 })
    }
    out.main_focus = focus

    const pain = clampStr(src.pain, 40)
    if (!PAIN.has(pain)) {
      return NextResponse.json({ success: false, error: 'Resposta inválida (travamento)' }, { status: 400 })
    }
    out.pain = pain

    for (const [key, set] of [
      ['lead_prep_pricing', TERNARY],
      ['margin_qualification', TERNARY],
      ['time_waste', TIME_WASTE],
      ['interest_attract', INTEREST],
      ['timeline', TIMELINE],
    ] as const) {
      const v = clampStr(src[key], 30)
      if (!set.has(v)) {
        return NextResponse.json({ success: false, error: `Resposta inválida (${key})` }, { status: 400 })
      }
      out[key] = v
    }

    out.city = clampStr(src.city, 120)
    out.services_detail = clampStr(src.services_detail, 500)
    out.notes = clampStr(src.notes, 4000)
    out.survey_version = 'clinicas_estetica_v3'

    const consent = src.consent === true || src.consent === 'true' || src.consent === 'yes'
    if (!consent) {
      return NextResponse.json(
        { success: false, error: 'É necessário autorizar o contato para análise comercial' },
        { status: 400 }
      )
    }
    out.consent = 'yes'

    const diagnosis = buildClinicasEsteticaDiagnosis(out)

    const { data, error } = await supabaseAdmin
      .from('ylada_clinicas_estetica_corporal_intake')
      .insert({ answers: { ...out, diagnosis_paragraphs: diagnosis } })
      .select('id')
      .single()

    if (error) {
      console.error('[clinicas-estetica-corporal-intake]', error)
      const msg = String(error.message || '')
      const code = String((error as { code?: string }).code || '')
      const hint = String((error as { hint?: string }).hint || '')
      const blob = `${msg} ${code} ${hint}`
      const missingTable = /relation|does not exist|schema cache|42P01/i.test(blob)
      const rlsOrDenied =
        /row-level security|violates row-level|permission denied|42501|PGRST301|not allowed/i.test(blob)
      const networkFetchFailed =
        /fetch failed|ECONNREFUSED|ENOTFOUND|getaddrinfo|ECONNRESET|certificate|SSL|UNABLE_TO_VERIFY_LEAF_SIGNATURE|TypeError:\s*fetch failed/i.test(
          msg
        )
      let errorText = 'Não foi possível salvar'
      if (networkFetchFailed) {
        errorText =
          'Não foi possível salvar: este computador não conseguiu conectar ao Supabase (rede, URL ou firewall). Confira NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local (mesmo projeto), internet/VPN e reinicie o next dev após alterar o .env.'
      } else if (missingTable) {
        errorText =
          'Não foi possível salvar: a tabela não existe neste projeto Supabase (rode o SQL da migration 300).'
      } else if (rlsOrDenied) {
        errorText =
          'Não foi possível salvar: permissão no banco. Use SUPABASE_SERVICE_ROLE_KEY no servidor.'
      }
      if (process.env.NODE_ENV === 'development' && msg.trim()) {
        errorText = `${errorText} [técnico: ${msg}]`
      }
      return NextResponse.json({ success: false, error: errorText }, { status: 500 })
    }

    if (isResendConfigured() && resend) {
      const notificationEmail =
        process.env.CLINICAS_ESTETICA_CORPORAL_NOTIFY_EMAIL ||
        process.env.CONTACT_NOTIFICATION_EMAIL ||
        FROM_EMAIL

      const teamL = LABELS.team_structure[out.team_structure] || out.team_structure
      const focusL = LABELS.main_focus[out.main_focus] || out.main_focus
      const painL = LABELS.pain[out.pain] || out.pain
      const leadL = LABELS.ternary[out.lead_prep_pricing] || out.lead_prep_pricing
      const marginL = LABELS.ternary[out.margin_qualification] || out.margin_qualification
      const twL = LABELS.time_waste[out.time_waste] || out.time_waste
      const intL = LABELS.interest_attract[out.interest_attract] || out.interest_attract
      const tlL = LABELS.timeline[out.timeline] || out.timeline

      const diagnosisHtml = diagnosis.map((p) => `<p style="margin:0 0 12px 0;line-height:1.5;">${escapeHtml(p)}</p>`).join('')
      const phoneFmt = formatBrazilPhoneDisplay(out.phone)

      const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 640px; margin: 0 auto; background: #fff; padding: 28px; border-radius: 8px;">
    <h1 style="color: #2563eb;">Nova resposta — estética corporal (intake)</h1>
    <p style="font-size:18px;font-weight:700;color:#15803d;margin:12px 0;">WhatsApp: ${escapeHtml(phoneFmt)}</p>
    <p style="color:#374151;font-size:14px;">ID: <code>${data?.id ?? ''}</code></p>
    <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:16px 0;">
      <p><strong>Clínica:</strong> ${escapeHtml(out.clinic_name)}</p>
      ${out.city ? `<p><strong>Cidade:</strong> ${escapeHtml(out.city)}</p>` : ''}
      <p><strong>Estrutura:</strong> ${escapeHtml(teamL)}</p>
      <p><strong>Foco:</strong> ${escapeHtml(focusL)}</p>
      <p><strong>Travamento:</strong> ${escapeHtml(painL)}</p>
      <p><strong>Cobrar mais se chegassem preparados:</strong> ${escapeHtml(leadL)}</p>
      <p><strong>Margem com clientes qualificados:</strong> ${escapeHtml(marginL)}</p>
      <p><strong>Tempo com quem não fecha:</strong> ${escapeHtml(twL)}</p>
      <p><strong>Interesse em entender captação:</strong> ${escapeHtml(intL)}</p>
      <p><strong>Momento:</strong> ${escapeHtml(tlL)}</p>
    </div>
    <div style="background:#f9fafb;padding:16px;border-radius:8px;">
      <p><strong>Contato:</strong> ${escapeHtml(out.contact_name)}</p>
      <p><strong>WhatsApp (formatado):</strong> ${escapeHtml(phoneFmt)}</p>
      <p><strong>WhatsApp (como veio):</strong> ${escapeHtml(out.phone)}</p>
      ${out.email ? `<p><strong>E-mail:</strong> ${escapeHtml(out.email)}</p>` : ''}
      ${
        out.services_detail
          ? `<p><strong>Procedimentos / diferenciais:</strong> ${escapeHtml(out.services_detail)}</p>`
          : ''
      }
      ${out.notes ? `<p><strong>Obs.:</strong><br/>${escapeHtml(out.notes).replace(/\n/g, '<br/>')}</p>` : ''}
    </div>
    <h2 style="color:#111827;font-size:16px;margin-top:24px;">Pré-diagnóstico automático (enviado à clínica)</h2>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-top:8px;">
      ${diagnosisHtml}
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:20px;">
      ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
    </p>
  </div>
</body></html>`

      try {
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: notificationEmail,
          ...(out.email ? { replyTo: out.email } : {}),
          subject: `Intake · ${phoneFmt} · ${out.clinic_name}`,
          html,
        })
      } catch (e) {
        console.error('[clinicas-estetica-corporal-intake] email', e)
      }
    }

    return NextResponse.json({ success: true, id: data?.id, diagnosis })
  } catch (e) {
    console.error('[clinicas-estetica-corporal-intake]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar' }, { status: 500 })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
