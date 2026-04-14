import Link from 'next/link'

/**
 * Conta já associada a outra vertical (ex.: Pro Líderes) — um utilizador = um tenant por ora.
 */
export default function ProEsteticaCorporalContaOutraEdicaoPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Esta conta está noutra edição YLADA Pro</h1>
      <p className="text-gray-700">
        O teu e-mail já está ligado a um espaço de <strong className="text-gray-900">outra linha</strong> (por exemplo
        Pro Líderes). Por agora, cada conta tem <strong className="text-gray-900">um</strong> tenant — usa um e-mail
        dedicado para <strong className="text-gray-900">Pro Estética Corporal</strong> ou fala connosco para
        reorganizar o acesso.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/pro-lideres/painel"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          Ir ao Pro Líderes
        </Link>
        <Link
          href="/pro-estetica-corporal/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar com outro e-mail
        </Link>
      </div>
    </div>
  )
}
