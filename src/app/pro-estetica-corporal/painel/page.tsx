import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ensureEsteticaCorporalTenantAccess } from '@/lib/pro-estetica-corporal-server'

const BASE = '/pro-estetica-corporal/painel'

export default async function ProEsteticaCorporalPainelVisaoPage() {
  const gate = await ensureEsteticaCorporalTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const op =
    gate.tenant.display_name?.trim() ||
    gate.tenant.team_name?.trim() ||
    'a tua operação'

  const cards = [
    {
      title: 'Captar',
      desc: 'Qualificar queixa estética, expectativa e protocolo antes da primeira sessão paga',
      href: `${BASE}/captar`,
    },
    {
      title: 'Retenção',
      desc: 'Frequência, pacotes, reagendamento e continuidade do plano de sessões',
      href: `${BASE}/retencao`,
    },
    {
      title: 'Acompanhar',
      desc: 'Entre sessões: follow-up, hábitos e próximo passo comercial',
      href: `${BASE}/acompanhar`,
    },
    {
      title: 'Biblioteca e links',
      desc: 'Modelos e os teus links /l/… para consultoria e WhatsApp',
      href: `${BASE}/biblioteca-links`,
    },
    {
      title: 'Scripts',
      desc: 'Roteiros (WhatsApp, objeções, confirmação de sessão)',
      href: `${BASE}/scripts`,
    },
    {
      title: 'Noel (mentor)',
      desc: 'Textos e posicionamento no contexto de estética corporal',
      href: `${BASE}/noel`,
    },
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl font-bold text-gray-900">O teu espaço</h1>
          <p className="mt-1 text-gray-600">
            Espaço de consultoria para <strong className="text-gray-800">{op}</strong>: captar com qualificação certa,
            reter com protocolo e acompanhar entre sessões — com fluxos, scripts e Noel alinhados à estética corporal.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
