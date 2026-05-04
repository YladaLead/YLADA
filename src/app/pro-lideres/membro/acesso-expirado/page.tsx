import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

export default async function ProLideresMembroAcessoExpiradoPage() {
  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect('/pro-lideres/entrar')
  }

  const { data: asOwner } = await supabase
    .from('leader_tenants')
    .select('id')
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (asOwner) {
    redirect('/pro-lideres/painel')
  }

  const { data: memberRows, error: memberErr } = await supabase
    .from('leader_tenant_members')
    .select('team_access_state, team_access_expires_at, leader_tenant_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (memberErr) {
    console.error('[pro-lideres/membro/acesso-expirado] membership:', memberErr.message)
  }

  const m = memberRows?.[0]

  if (!m) {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const st = (m.team_access_state as string) ?? 'active'
  if (st === 'pending_activation') {
    redirect('/pro-lideres/membro/ativacao')
  }
  if (st === 'paused') {
    redirect('/pro-lideres/acesso-pausado')
  }

  const exp = m.team_access_expires_at as string | null | undefined
  const expMs = exp ? new Date(exp).getTime() : NaN
  const expired = st === 'active' && exp && !Number.isNaN(expMs) && expMs <= Date.now()

  if (!expired) {
    redirect('/pro-lideres/membro')
  }

  const expLabel = new Date(exp as string).toLocaleDateString('pt-BR', { dateStyle: 'long' })

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image
            src={YLADA_OG_FALLBACK_LOGO_PATH}
            alt="YLADA"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-center text-xl font-bold text-gray-900">Período de acesso terminado</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          O período de acesso associado ao seu plano terminou em <strong className="text-gray-900">{expLabel}</strong>. Fale com a
          sua equipe para renovar ou alinhar um novo período.
        </p>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/pro-lideres/entrar" className="font-semibold text-blue-600 underline hover:text-blue-800">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
