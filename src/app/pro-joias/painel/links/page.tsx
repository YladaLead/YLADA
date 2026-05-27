import Link from 'next/link'

export default function ProJoiasLinksPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Links e diagnósticos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Crie diagnósticos socráticos para qualificar clientes antes do catálogo.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-3xl mb-3">🔗</p>
        <p className="font-semibold text-gray-900 mb-2">Diagnósticos para joias</p>
        <p className="text-sm text-gray-600 mb-4">
          Crie um link que faz perguntas sobre estilo, ocasião e preferência da cliente
          antes de mostrar o catálogo. Ela chega pronta para comprar.
        </p>
        <Link
          href="/pt/joias/links"
          className="inline-flex items-center justify-center rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 transition-colors"
        >
          Criar meu diagnóstico →
        </Link>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 mb-1">💡 Como funciona</p>
        <p className="text-sm text-amber-800">
          Compartilhe o link no WhatsApp, Instagram ou stories. A cliente responde 5 perguntas
          rápidas sobre estilo e chega na conversa sabendo o que quer — menos "só olhando",
          mais "quero esse".
        </p>
      </div>
    </div>
  )
}
