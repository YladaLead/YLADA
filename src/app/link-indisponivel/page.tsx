export default function LinkIndisponivelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Link indisponível</h1>
        <p className="text-gray-600 mb-6">
          Este link está indisponível no momento. Entre em contato com a pessoa que enviou
          para receber uma nova forma de acesso.
        </p>
        <p className="text-sm text-gray-400">
          Caso você seja o criador do link, faça login no painel para verificar sua assinatura.
        </p>
      </div>
    </div>
  )
}

