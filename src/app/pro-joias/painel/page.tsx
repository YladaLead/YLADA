import Link from 'next/link'

/**
 * Home do painel Pro Joias — visão geral e atalhos rápidos.
 */
export default function ProJoiasPainelPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bem-vinda à sua rede 💍</h1>
        <p className="text-gray-500 text-sm mt-1">O que você quer fazer hoje?</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/pro-joias/painel/scripts"
          className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition-all"
        >
          <span className="text-2xl" aria-hidden>💬</span>
          <div>
            <p className="font-semibold text-gray-900">Scripts prontos</p>
            <p className="text-sm text-gray-500 mt-0.5">Abordagem, venda e recrutamento para sua rede</p>
          </div>
        </Link>

        <Link
          href="/pro-joias/painel/links"
          className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition-all"
        >
          <span className="text-2xl" aria-hidden>🔗</span>
          <div>
            <p className="font-semibold text-gray-900">Criar diagnóstico</p>
            <p className="text-sm text-gray-500 mt-0.5">Qualifique clientes antes do catálogo</p>
          </div>
        </Link>

        <Link
          href="/pro-joias/painel/leads"
          className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition-all"
        >
          <span className="text-2xl" aria-hidden>🎯</span>
          <div>
            <p className="font-semibold text-gray-900">Leads</p>
            <p className="text-sm text-gray-500 mt-0.5">Clientes que responderam seus diagnósticos</p>
          </div>
        </Link>

        <Link
          href="/pro-joias/painel/equipe"
          className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition-all"
        >
          <span className="text-2xl" aria-hidden>👥</span>
          <div>
            <p className="font-semibold text-gray-900">Minha equipe</p>
            <p className="text-sm text-gray-500 mt-0.5">Convide e gerencie suas distribuidoras</p>
          </div>
        </Link>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 mb-1">👋 Primeira vez aqui?</p>
        <p className="text-sm text-amber-800">
          Comece pelos <strong>Scripts</strong> — já temos prontos para recrutamento de distribuidoras,
          venda ao consumidor final e desenvolvimento da equipe.
          Depois crie um <strong>diagnóstico</strong> e compartilhe o link com clientes.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/pro-joias/painel/scripts"
            className="inline-flex text-sm font-semibold text-amber-800 hover:text-amber-900 underline"
          >
            Ver scripts →
          </Link>
          <Link
            href="/pro-joias/painel/links"
            className="inline-flex text-sm font-semibold text-amber-800 hover:text-amber-900 underline"
          >
            Criar diagnóstico →
          </Link>
        </div>
      </div>
    </div>
  )
}
