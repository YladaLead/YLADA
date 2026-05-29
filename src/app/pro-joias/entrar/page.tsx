import LoginForm from '@/components/auth/LoginForm'

/**
 * Login YLADA Pro Joias. Após sessão redireciona ao painel.
 */
export default async function ProJoiasEntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const sp = await searchParams
  const raw = sp.next
  const redirectPath =
    typeof raw === 'string' && raw.startsWith('/pro-joias')
      ? raw
      : '/pro-joias/painel'

  return (
    <div className="flex min-h-[100svh] min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl mb-1">💍</p>
          <h1 className="text-xl font-bold text-gray-900">YLADA Pro Joias</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua rede de distribuidoras</p>
        </div>
        <LoginForm
          perfil="ylada"
          redirectPath={redirectPath}
          disableSignUp
        />
      </div>
    </div>
  )
}
