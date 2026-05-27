export default function ProJoiasAguardandoAcessoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-4xl mb-4">⏳</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Aguardando acesso</h1>
        <p className="text-gray-600 mb-6">
          Sua conta ainda não está vinculada a uma rede Pro Joias.
          Entre em contato com o líder da sua rede ou com o suporte YLADA.
        </p>
        <a
          href="/pro-joias/entrar"
          className="text-amber-700 text-sm font-medium hover:underline"
        >
          ← Voltar ao login
        </a>
      </div>
    </div>
  )
}
