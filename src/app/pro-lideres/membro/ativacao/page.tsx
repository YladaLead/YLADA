import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

export default async function ProLideresMembroAtivacaoPage() {
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

  const { data: m } = await supabase
    .from('leader_tenant_members')
    .select('team_access_state, leader_tenant_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!m) {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const st = (m.team_access_state as string) ?? 'active'
  if (st === 'active') {
    redirect('/pro-lideres/painel')
  }
  if (st === 'paused') {
    redirect('/pro-lideres/acesso-pausado')
  }
  if (st !== 'pending_activation') {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const { data: tenant } = await supabase
    .from('leader_tenants')
    .select('display_name, team_name, team_bank_payment_url, team_bank_pix_payment_url')
    .eq('id', m.leader_tenant_id as string)
    .maybeSingle()

  const spaceLabel =
    (tenant?.display_name as string | undefined)?.trim() ||
    (tenant?.team_name as string | undefined)?.trim() ||
    'o teu espaço Pro Líderes'

  const cardUrl =
    typeof tenant?.team_bank_payment_url === 'string' && tenant.team_bank_payment_url.trim()
      ? tenant.team_bank_payment_url.trim()
      : null
  const pixUrl =
    typeof tenant?.team_bank_pix_payment_url === 'string' && tenant.team_bank_pix_payment_url.trim()
      ? tenant.team_bank_pix_payment_url.trim()
      : null

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
        <h1 className="text-center text-xl font-bold text-gray-900">Obrigado!</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          O teu registo em <strong className="text-gray-900">{spaceLabel}</strong> foi recebido com sucesso.
        </p>
        <p className="mt-2 text-center text-sm font-medium text-gray-800">
          Em breve o teu acesso ao painel Pro Líderes será libertado.
        </p>

        {cardUrl || pixUrl ? (
          <div className="mt-6 space-y-3">
            <p className="text-center text-xs text-gray-500">Se ainda precisares de pagar, usa uma destas opções:</p>
            {pixUrl ? (
              <a
                href={pixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Pix
              </a>
            ) : null}
            {cardUrl ? (
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Cartão
              </a>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-700">
            Se precisares de combinar o pagamento, fala com a tua equipa. Em breve voltamos aqui contigo.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">Podes fechar esta página e voltar mais tarde.</p>

        <p className="mt-8 text-center text-xs text-gray-500">
          <Link href="/pro-lideres/entrar" className="font-medium text-blue-600 underline hover:text-blue-800">
            Sair e entrar com outra conta
          </Link>
        </p>
      </div>
    </div>
  )
}
