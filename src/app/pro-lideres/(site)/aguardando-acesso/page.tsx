import Link from 'next/link'

export default function ProLideresAguardandoAcessoPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acesso Pro Líderes</h1>
      <p className="text-base text-gray-600">
        Esta conta ainda não tem acesso ao Pro Líderes (espaço de líder ou de equipe). Se você foi convidado(a), confira se
        está entrando com o <strong className="text-gray-800">mesmo e-mail</strong> do convite e se já concluiu o cadastro pelo
        link que recebeu. Se você é líder e ainda não tem espaço ativo na YLADA, confirme com quem enviou o seu convite.
      </p>
      <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/pro-lideres/entrar"
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar com outra conta
        </Link>
      </div>
    </div>
  )
}
