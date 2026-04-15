import Link from 'next/link'

export default function ProEsteticaCapilarAguardandoPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acesso Pro Estetica Capilar</h1>
      <p className="text-base text-gray-600">
        Sua conta ainda nao tem este espaco ativo. Fale com o time para implantacao ou use uma conta ja associada a
        esta edicao.
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
