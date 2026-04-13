import LoginForm from '@/components/auth/LoginForm'

/**
 * Login Pro Líderes — página só com o formulário (sem header do site nem cartão extra).
 * `?next=/pro-lideres/...` redireciona após login (ex.: página de convite).
 */
export default async function ProLideresEntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const sp = await searchParams
  const raw = sp.next
  const redirectPath =
    typeof raw === 'string' && raw.startsWith('/pro-lideres') ? raw : '/pro-lideres/painel'

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm
          perfil="ylada"
          redirectPath={redirectPath}
          disableSignUp
          proLideresLogin
        />
      </div>
    </div>
  )
}
