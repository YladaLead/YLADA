import Link from 'next/link'

export default function ProEsteticaCorporalAcessoExpiradoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-white p-8 shadow-sm text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Acesso ao plano caducado</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          O período de acesso ao <strong>YLADA Pro Estética Corporal</strong> associado à tua conta terminou. Para
          continuar a usar o painel, renova connosco.
        </p>
        <p className="text-sm text-gray-600">
          Responde ao último e-mail da equipa ou contacta pelo canal habitual (WhatsApp / e-mail).
        </p>
        <Link
          href="/pro-estetica-corporal/entrar"
          className="inline-block text-sm font-semibold text-rose-700 underline hover:text-rose-900"
        >
          Voltar ao início de sessão
        </Link>
      </div>
    </div>
  )
}
