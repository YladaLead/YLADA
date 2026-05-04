import Link from 'next/link'

export default function ProEsteticaCapilarAguardandoPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acesso — Terapia capilar</h1>
      <p className="text-base text-gray-600">
        Sua conta ainda não tem este espaço ativo. Confirme o convite ou entre com outra conta já associada a esta edição.
      </p>
      <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/pro-estetica-capilar/entrar"
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar com outra conta
        </Link>
      </div>
    </div>
  )
}
