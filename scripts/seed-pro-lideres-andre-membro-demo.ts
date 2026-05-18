#!/usr/bin/env npx tsx
/**
 * Abastece a conta membro Andre Faula no tenant da líder (Deise/Daisy Faula)
 * com tokens de links, eventos de utilização e conclusões de tarefas diárias — para demo/aula.
 *
 * Uso:
 *   npx tsx scripts/seed-pro-lideres-andre-membro-demo.ts
 *
 * Variáveis opcionais (.env.local):
 *   PL_DEMO_LEADER_EMAIL=deisefaula@gmail.com
 *   PL_DEMO_MEMBER_EMAIL=faulaandre@gmail.com
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

config({ path: '.env.local' })
config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const LEADER_EMAIL = (process.env.PL_DEMO_LEADER_EMAIL || 'deisefaula@gmail.com').trim().toLowerCase()
const MEMBER_EMAIL = (process.env.PL_DEMO_MEMBER_EMAIL || 'faulaandre@gmail.com').trim().toLowerCase()
const MEMBER_SLUG = 'andre-faula'
const MEMBER_WHATSAPP = '5511999887766'

const CATALOG_TYPES = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

type Utm = { pl_member_user_id: string; pl_tenant_id: string; pl_vertical?: string }

function daysAgo(n: number, hour = 12): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  d.setUTCHours(hour, Math.floor(Math.random() * 50), 0, 0)
  return d.toISOString()
}

async function resolveLeaderTenant() {
  let tenant: {
    id: string
    owner_user_id: string
    slug: string
    display_name: string | null
    team_name: string | null
    vertical_code: string | null
  } | null = null

  const { data: ownerProfile } = await admin
    .from('user_profiles')
    .select('user_id, email, nome_completo')
    .ilike('email', LEADER_EMAIL)
    .limit(5)

  const ownerFromProfile = ownerProfile?.find((p) => p.email?.toLowerCase().trim() === LEADER_EMAIL)
  if (ownerFromProfile?.user_id) {
    const { data: t } = await admin
      .from('leader_tenants')
      .select('id, owner_user_id, slug, display_name, team_name, vertical_code')
      .eq('owner_user_id', ownerFromProfile.user_id)
      .maybeSingle()
    if (t) tenant = t
  }

  if (!tenant) {
    const { data: tenants } = await admin
      .from('leader_tenants')
      .select('id, owner_user_id, slug, display_name, team_name, vertical_code')
      .or(`display_name.ilike.%deise%,display_name.ilike.%daisy%,team_name.ilike.%faula%`)
      .limit(5)
    tenant = tenants?.[0] ?? null
  }

  if (!tenant) {
    throw new Error(
      `Tenant da líder não encontrado (tente PL_DEMO_LEADER_EMAIL, atual: ${LEADER_EMAIL}).`
    )
  }

  return tenant
}

async function resolveMemberUser(tenantId: string) {
  const { data: profiles } = await admin
    .from('user_profiles')
    .select('user_id, email, nome_completo, whatsapp')
    .or(`email.eq.${MEMBER_EMAIL},nome_completo.ilike.%andre faula%`)
    .limit(20)

  const candidates = (profiles ?? []).filter((p) => {
    const em = (p.email || '').toLowerCase().trim()
    const nome = (p.nome_completo || '').toLowerCase()
    return em === MEMBER_EMAIL || (em.includes('andre') && em.includes('faula')) || nome.includes('andre faula')
  })

  for (const c of candidates) {
    const { data: mem } = await admin
      .from('leader_tenant_members')
      .select('user_id, role, team_access_state, pro_lideres_share_slug')
      .eq('leader_tenant_id', tenantId)
      .eq('user_id', c.user_id)
      .maybeSingle()
    if (mem) return { userId: c.user_id as string, mem, profile: c }
  }

  throw new Error(
    `Membro Andre Faula não encontrado neste tenant. Convide/cadastre com ${MEMBER_EMAIL} e reexecute.`
  )
}

async function main() {
  console.log('Pro Líderes — seed demo membro Andre Faula')
  console.log(`  Líder: ${LEADER_EMAIL}`)
  console.log(`  Membro: ${MEMBER_EMAIL}`)

  const tenant = await resolveLeaderTenant()
  const ownerId = tenant.owner_user_id as string
  const tenantId = tenant.id as string
  const vertical = (tenant.vertical_code as string) || 'h-lider'

  console.log(`  Tenant: ${tenant.display_name || tenant.team_name} (${tenant.slug})`)

  const { userId: memberId, mem, profile } = await resolveMemberUser(tenantId)
  console.log(`  Membro: ${profile.nome_completo} <${profile.email}> (${memberId})`)

  await admin
    .from('leader_tenant_members')
    .update({
      pro_lideres_share_slug: MEMBER_SLUG,
      team_access_state: 'active',
    })
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', memberId)

  await admin
    .from('user_profiles')
    .update({
      whatsapp: MEMBER_WHATSAPP,
      nome_completo: profile.nome_completo?.trim() || 'Andre Faula',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', memberId)

  const { data: linkRows } = await admin
    .from('ylada_links')
    .select('id, slug, title, template_id, status')
    .eq('user_id', ownerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const templateIds = [...new Set((linkRows ?? []).map((l) => l.template_id).filter(Boolean) as string[])]
  const typeByTpl = new Map<string, string>()
  if (templateIds.length) {
    const { data: tpls } = await admin.from('ylada_link_templates').select('id, type').in('id', templateIds)
    for (const t of tpls ?? []) typeByTpl.set(t.id as string, String(t.type || ''))
  }

  const catalogLinks = (linkRows ?? []).filter((l) => {
    const ty = l.template_id ? typeByTpl.get(l.template_id as string) : ''
    return ty && CATALOG_TYPES.has(ty)
  })

  if (catalogLinks.length === 0) {
    console.warn('  ⚠ Nenhum link de catálogo ativo — rode seed de ferramentas Pro Líderes no painel do líder.')
  } else {
    console.log(`  Links de catálogo: ${catalogLinks.length}`)
  }

  const linkIds = catalogLinks.map((l) => l.id as string)

  if (linkIds.length) {
    const { data: oldEvents } = await admin
      .from('ylada_link_events')
      .select('id, utm_json')
      .in('link_id', linkIds)
      .limit(50000)

    const oldIds = (oldEvents ?? [])
      .filter((e) => (e.utm_json as Utm | null)?.pl_member_user_id === memberId)
      .map((e) => e.id as string)

    if (oldIds.length) {
      for (let i = 0; i < oldIds.length; i += 100) {
        await admin
          .from('ylada_link_events')
          .delete()
          .in('id', oldIds.slice(i, i + 100))
      }
    }

    await admin
      .from('pro_lideres_member_link_tokens')
      .delete()
      .eq('leader_tenant_id', tenantId)
      .eq('member_user_id', memberId)
      .in('ylada_link_id', linkIds)
  }

  const utmBase: Utm = { pl_member_user_id: memberId, pl_tenant_id: tenantId, pl_vertical: vertical }
  const events: {
    link_id: string
    event_type: string
    utm_json: Utm
    created_at: string
  }[] = []

  const activityProfile = [0.95, 0.85, 0.72, 0.65, 0.55, 0.48, 0.4, 0.35, 0.28, 0.22, 0.15, 0.1]

  for (let idx = 0; idx < catalogLinks.length; idx++) {
    const link = catalogLinks[idx]
    const weight = activityProfile[idx] ?? 0.08
    const views = Math.max(3, Math.floor(12 + weight * 38))
    const starts = Math.max(1, Math.floor(views * (0.55 + Math.random() * 0.2)))
    const completions = Math.max(0, Math.floor(starts * (0.35 + Math.random() * 0.25)))
    const wa = Math.max(1, Math.floor(completions * (0.4 + Math.random() * 0.35)))

    const token = randomBytes(16).toString('hex')
    const { error: tokErr } = await admin.from('pro_lideres_member_link_tokens').insert({
      leader_tenant_id: tenantId,
      member_user_id: memberId,
      ylada_link_id: link.id,
      token,
      share_path_slug: MEMBER_SLUG,
    })
    if (tokErr) console.warn(`  token ${link.slug}:`, tokErr.message)

    const lid = link.id as string
    for (let i = 0; i < views; i++) {
      events.push({
        link_id: lid,
        event_type: 'view',
        utm_json: utmBase,
        created_at: daysAgo(Math.floor(Math.random() * 24) + 1, 9 + (i % 8)),
      })
    }
    for (let i = 0; i < starts; i++) {
      events.push({
        link_id: lid,
        event_type: 'start',
        utm_json: utmBase,
        created_at: daysAgo(Math.floor(Math.random() * 20) + 1, 11),
      })
    }
    for (let i = 0; i < completions; i++) {
      events.push({
        link_id: lid,
        event_type: 'result_view',
        utm_json: utmBase,
        created_at: daysAgo(Math.floor(Math.random() * 18) + 1, 14),
      })
    }
    for (let i = 0; i < wa; i++) {
      events.push({
        link_id: lid,
        event_type: 'cta_click',
        utm_json: utmBase,
        created_at: daysAgo(Math.floor(Math.random() * 16) + 1, 16),
      })
    }
  }

  const BATCH = 200
  for (let i = 0; i < events.length; i += BATCH) {
    const chunk = events.slice(i, i + BATCH)
    const { error } = await admin.from('ylada_link_events').insert(chunk)
    if (error) throw new Error(`ylada_link_events: ${error.message}`)
  }
  console.log(`  Eventos inseridos: ${events.length}`)

  const { data: tasks } = await admin
    .from('pro_lideres_daily_tasks')
    .select('id, title')
    .eq('leader_tenant_id', tenantId)
    .order('sort_order', { ascending: true })
    .limit(8)

  if (tasks?.length) {
    await admin
      .from('pro_lideres_daily_task_completions')
      .delete()
      .eq('leader_tenant_id', tenantId)
      .eq('member_user_id', memberId)

    const completions: {
      leader_tenant_id: string
      task_id: string
      member_user_id: string
      completed_on: string
    }[] = []

    for (let d = 0; d < 14; d++) {
      const date = new Date()
      date.setUTCDate(date.getUTCDate() - d)
      const on = date.toISOString().slice(0, 10)
      const day = date.getUTCDay()
      if (day === 0) continue
      const nTasks = Math.min(tasks.length, 2 + (d % 3))
      for (let t = 0; t < nTasks; t++) {
        completions.push({
          leader_tenant_id: tenantId,
          task_id: tasks[t % tasks.length].id as string,
          member_user_id: memberId,
          completed_on: on,
        })
      }
    }

    const { error: cErr } = await admin.from('pro_lideres_daily_task_completions').insert(completions)
    if (cErr && cErr.code !== '23505') console.warn('  Tarefas:', cErr.message)
    else console.log(`  Conclusões de tarefas: ${completions.length}`)
  } else {
    console.log('  (Sem tarefas diárias no tenant — pule ou crie no painel do líder.)')
  }

  const { data: homCfg } = await admin
    .from('prolider_hom_config')
    .select('id')
    .eq('tenant_id', tenantId)
    .maybeSingle()

  if (!homCfg) {
    await admin.from('prolider_hom_config').upsert({
      tenant_id: tenantId,
      video_url: 'https://youtu.be/jJB4KBAhkeM',
      headline: 'Oportunidade: R$500 extra por semana com bebidas funcionais',
      subheadline: 'Assista à apresentação completa e escolha o próximo passo',
      updated_at: new Date().toISOString(),
    })
    console.log('  HOM config criada para o tenant.')
  }

  console.log('\n✅ Pronto. Entre como Andre Faula e abra:')
  console.log('   • Visão geral / Meus links (métricas por ferramenta)')
  console.log('   • Tarefas diárias (histórico de conclusões)')
  console.log(`   • Link HOM: /pro-lideres/hom/${tenant.slug}/${MEMBER_SLUG}`)
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
