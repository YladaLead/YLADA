import { redirect } from 'next/navigation'
import { ensureProJoiasTenantAccess } from '@/lib/pro-joias-server'

/**
 * Landing pública do Pro Joias.
 * Quem já tem sessão + tenant vai direto ao painel.
 */
export default async function ProJoiasHomePage() {
  const gate = await ensureProJoiasTenantAccess()

  if (gate.ok && !gate.previewWithoutLogin) {
    redirect('/pro-joias/painel')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="mb-2 text-4xl">💍</p>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">YLADA Pro Joias</h1>
        <p className="mb-8 text-lg text-gray-600">
          Plataforma de gestão para redes de joias, semijoias e bijuterias.
          Scripts prontos, equipe organizada, diagnósticos para seus clientes.
        </p>
        <a
          href="/pro-joias/entrar"
          className="inline-flex items-center justify-center rounded-xl bg-amber-700 px-8 py-4 text-base font-semibold text-white hover:bg-amber-800 transition-colors"
        >
          Acessar minha rede →
        </a>
        <p className="mt-4 text-sm text-gray-400">
          Rede de distribuidoras? <a href="/pro-joias/entrar" className="text-amber-700 hover:underline">Entrar</a>
        </p>
      </div>
    </div>
  )
}
