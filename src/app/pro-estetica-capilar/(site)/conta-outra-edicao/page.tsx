import Link from 'next/link'

export default function ProEsteticaCapilarContaOutraEdicaoPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Esta conta esta em outra edicao YLADA Pro</h1>
      <p className="text-gray-700">
        Seu e-mail ja esta ligado a outro espaco YLADA Pro. Use um e-mail dedicado para o Pro Estetica Capilar ou
        fale conosco para reorganizar o acesso.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/pro-estetica/painel"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          Ir para Pro Estetica
        </Link>
        <Link
          href="/pro-estetica-capilar/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar com outro e-mail
        </Link>
      </div>
    </div>
  )
}
