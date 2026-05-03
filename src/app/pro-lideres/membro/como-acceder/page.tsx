import { ProLideresMembroComoAccederClient } from './ComoAccederClient'

export default async function ProLideresMembroComoAccederPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>
}) {
  const sp = await searchParams
  const rawEmail = typeof sp.email === 'string' ? sp.email.trim() : ''
  const rawNext = typeof sp.next === 'string' ? sp.next.trim() : ''
  const nextPath = rawNext.startsWith('/pro-lideres') ? rawNext : '/pro-lideres/membro/ativacao'

  if (!rawEmail || !rawEmail.includes('@')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-center text-sm text-gray-600">
          Link incompleto. Abre o convite a partir do e-mail que recebeste ou{' '}
          <a href="/pro-lideres/entrar" className="font-semibold text-blue-600 underline">
            vai ao início de sessão
          </a>
          .
        </p>
      </div>
    )
  }

  return <ProLideresMembroComoAccederClient email={rawEmail} nextPath={nextPath} />
}
