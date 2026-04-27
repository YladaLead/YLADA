import Link from 'next/link'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'

const BASE = '/pro-estetica-capilar/painel'

export default async function ProEsteticaCapilarPainelPage() {
  const gate = await ensureEsteticaCapilarTenantAccess()
  if (!gate.ok) return null

  const op = gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || 'a tua operacao'
  const cards = [
    { title: 'Ritmo', desc: 'Ver foco da semana e atalhos para o Noel e scripts.', href: `${BASE}/resultados` },
    { title: 'Captar', desc: 'Primeiro contato e triagem para casos capilares.', href: `${BASE}/captar` },
    { title: 'Retencao', desc: 'Aderencia ao plano e recorrencia de sessoes.', href: `${BASE}/retencao` },
    { title: 'Acompanhar', desc: 'Follow-up entre sessoes e proximo passo.', href: `${BASE}/acompanhar` },
    { title: 'Scripts', desc: 'Roteiros de mensagem e triagem (guardados na tua conta).', href: `${BASE}/scripts` },
    { title: 'Perfil', desc: 'Dados da operacao e notas de foco.', href: `${BASE}/perfil` },
  ] as const

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Visao geral</p>
        <h1 className="text-2xl font-bold text-gray-900">Terapia capilar</h1>
        <p className="mt-1 text-gray-600">
          Espaco de consultoria para <strong className="text-gray-800">{op}</strong>: captar com criterio, reter com
          consistencia e acompanhar para manter previsibilidade comercial.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-900">{card.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
