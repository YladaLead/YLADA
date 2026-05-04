import Link from 'next/link'

export default function ProLideresAcessoPausadoPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acesso pausado</h1>
      <p className="text-base text-gray-600">
        O teu acesso a este espaço Pro Líderes está pausado por agora. Os teus dados e ferramentas associadas à conta mantêm-se;
        quando o acesso for reativado, voltas a entrar no painel normalmente. Se tiveres dúvidas, fala com a tua equipa.
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
