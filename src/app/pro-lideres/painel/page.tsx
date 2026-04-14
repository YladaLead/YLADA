import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresPainelVisaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const isLeader = gate.role === 'leader' && !teamViewPreview
  const op =
    gate.tenant.display_name?.trim() ||
    gate.tenant.team_name?.trim() ||
    'este espaço'

  const leaderCards = [
    {
      title: 'Noel',
      desc: 'Mentor no contexto do Pro Líderes',
      href: '/pro-lideres/painel/noel',
    },
    {
      title: 'Catálogo de ferramentas',
      desc: 'Links YLADA (/l/…) partilhados no painel',
      href: '/pro-lideres/painel/catalogo',
    },
    {
      title: 'Scripts',
      desc: 'Roteiros de conversa (com Noel) para a equipe',
      href: '/pro-lideres/painel/scripts',
    },
    {
      title: 'Tarefas diárias',
      desc: 'Pontos por tarefa e acompanhamento da equipe',
      href: '/pro-lideres/painel/tarefas',
    },
    {
      title: 'Análise da equipe',
      desc: 'Quem faz parte do espaço e rastreio por membro',
      href: '/pro-lideres/painel/equipe',
    },
    {
      title: 'Convidar equipe',
      desc: 'Gerar links para a equipe entrar com o e-mail certo',
      href: '/pro-lideres/painel/links',
    },
    {
      title: 'Configurações',
      desc: 'Definições do espaço Pro Líderes',
      href: '/pro-lideres/painel/configuracao',
    },
  ] as const

  const teamCards = [
    {
      title: 'Catálogo de ferramentas',
      desc: 'Links YLADA (/l/…) partilhados pelo líder',
      href: '/pro-lideres/painel/catalogo',
    },
    {
      title: 'Scripts',
      desc: 'Roteiros e mensagens partilhados pelo líder para executares no campo',
      href: '/pro-lideres/painel/scripts',
    },
    {
      title: 'Tarefas diárias',
      desc: 'Marca o que cumpriste e acumula pontos',
      href: '/pro-lideres/painel/tarefas',
    },
  ] as const

  const cards = isLeader ? leaderCards : teamCards

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLeader ? 'Painel do líder' : 'O seu espaço na equipe'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isLeader ? (
              <>
                Ambiente de gestão de <strong className="text-gray-800">{op}</strong>. Convites e configurações são só
                tuas; a equipe vê um menu mais simples.
              </>
            ) : (
              <>
                Você está no <strong className="text-emerald-800">ambiente da equipe</strong> de{' '}
                <strong className="text-gray-800">{op}</strong>. O líder gere convites, equipe e definições; aqui acede
                só ao <strong>catálogo</strong> e aos <strong>scripts</strong> para executar no campo — sem Noel nem
                gestão de equipe.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
