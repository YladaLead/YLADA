import { NextRequest, NextResponse } from 'next/server'

import { syncProLideresTeamSubscriptionsFromMercadoPago } from '@/lib/pro-lideres-team-subscription-mp-sync'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Cron: re-sincroniza assinaturas Pro Líderes equipe vencidas/atrasadas com o Mercado Pago.
 * Cobre o intervalo em que o MP já cobrou o cartão mas o webhook ainda não atualizou o Supabase.
 * Vercel Hobby: cron no vercel.json só pode rodar 1×/dia — expressões mais frequentes quebram o deploy.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const isCron = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  if (!isCron) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  try {
    const result = await syncProLideresTeamSubscriptionsFromMercadoPago(supabaseAdmin)
    return NextResponse.json({ ok: true, ...result })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao sincronizar assinaturas Pro Líderes'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
