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

  const { data: memberRows, error: memberErr } = await supabase
    .from('leader_tenant_members')
    .select('team_access_state, leader_tenant_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (memberErr) {
    console.error('[pro-lideres/membro/ativacao] membership:', memberErr.message)
  }

  const m = memberRows?.[0]

  if (!m) {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const st = (m.team_access_state as string) ?? 'active'
  if (st === 'active') {
    redirect('/pro-lideres/membro')
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
    'seu espaço Pro Líderes'

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
        <h1 className="text-center text-xl font-bold text-gray-900">Próximo passo: pagamento</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          Seu cadastro em <strong className="text-gray-900">{spaceLabel}</strong> foi recebido. Para liberar o acesso ao painel,
          conclua o pagamento com a sua equipe (Pix ou cartão/Mercado Pago), conforme as opções abaixo.
        </p>

        {cardUrl || pixUrl ? (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm font-medium text-gray-800">Escolha como pagar</p>
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
                Cartão ou Mercado Pago
              </a>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-700">
            Não encontramos link de pagamento configurado para esta equipe. Fale com quem te convidou para combinar o pagamento;
            depois o acesso é liberado pelo líder.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">Você pode fechar esta página e voltar quando quiser.</p>

        <p className="mt-8 text-center text-xs text-gray-500">
          <Link href="/pro-lideres/entrar" className="font-medium text-blue-600 underline hover:text-blue-800">
            Sair e entrar com outra conta
          </Link>
        </p>
      </div>
    </div>
  )
}
