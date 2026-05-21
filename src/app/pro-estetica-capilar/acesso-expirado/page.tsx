import Link from 'next/link'

export default function ProEsteticaCapilarAcessoExpiradoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border border-sky-200 bg-white p-8 shadow-sm text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Acesso ao plano expirado</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          O período de acesso ao <strong>YLADA Pro — Estética capilar</strong> associado à sua conta encerrou. Para
          continuar usando o painel, entre em contato conosco.
        </p>
        <p className="text-sm text-gray-600">
          Você pode renovar pelo WhatsApp ou pelo canal habitual de atendimento.
        </p>
        <a
          href="https://ylada.com/renovar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Renovar em ylada.com
        </a>
        <Link
          href="/pro-estetica-capilar/entrar"
          className="inline-block text-sm font-semibold text-sky-700 underline hover:text-sky-900"
        >
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}
