import LoginForm from '@/components/auth/LoginForm'

/**
 * Login Pro Estética Corporal — `?next=/pro-estetica-corporal/...` após sessão.
 */
export default async function ProEsteticaCorporalEntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const sp = await searchParams
  const raw = sp.next
  const redirectPath =
    typeof raw === 'string' && raw.startsWith('/pro-estetica-corporal')
      ? raw
      : '/pro-estetica-corporal/painel'

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm
          perfil="ylada"
          redirectPath={redirectPath}
          disableSignUp
          proEsteticaCorporalLogin
        />
      </div>
    </div>
  )
}
