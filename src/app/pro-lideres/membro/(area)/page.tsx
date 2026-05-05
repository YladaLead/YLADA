import Link from 'next/link'
import { redirect } from 'next/navigation'

import {
  PRO_LIDERES_MEMBER_BASE_PATH,
  proLideresItemHrefWithBase,
} from '@/config/pro-lideres-menu'
import { fetchProLideresCatalogLinkDiagnosticRows } from '@/lib/pro-lideres-catalog-link-diagnostics'
import { ensureLeaderTenantAccess, createProLideresServerClient } from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function ProLideresMembroVisaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user?.id) {
    redirect('/pro-lideres/entrar')
  }

  const admin = getSupabaseAdmin()
  const dailyVisible = gate.tenant.daily_tasks_visible_to_team !== false
  const base = PRO_LIDERES_MEMBER_BASE_PATH

  let linkRows: Awaited<ReturnType<typeof fetchProLideresCatalogLinkDiagnosticRows>>['rows'] = []
  let truncated = false
  let statsDays = 30
  /** Evita confundir "sem tráfego" com falha técnica ao ler métricas. */
  let diagnosticsIssue: 'none' | 'no_admin' | 'fetch_error' = 'none'

  if (!admin) {
    diagnosticsIssue = 'no_admin'
  } else {
    try {
      const pack = await fetchProLideresCatalogLinkDiagnosticRows(admin, {
        tenantId: gate.tenant.id,
        ownerUserId: gate.tenant.owner_user_id,
        memberUserId: user.id,
        days: statsDays,
      })
      linkRows = pack.rows
      truncated = pack.truncated
      statsDays = pack.days
    } catch (e) {
      console.error('[membro visão geral] diagnóstico links', e)
      diagnosticsIssue = 'fetch_error'
    }
  }

  const activeLinks = linkRows.filter((r) => r.views + r.starts + r.completions + r.whatsappClicks > 0)
  const totals = activeLinks.reduce(
    (acc, r) => {
      acc.views += r.views
      acc.starts += r.starts
      acc.completions += r.completions
      acc.whatsapp += r.whatsappClicks
      return acc
    },
    { views: 0, starts: 0, completions: 0, whatsapp: 0 }
  )

  const quick = [
    { href: proLideresItemHrefWithBase(base, 'catalogo'), label: 'Meus links', desc: 'Ferramentas compartilhadas pelo líder' },
    { href: proLideresItemHrefWithBase(base, 'scripts'), label: 'Scripts', desc: 'Roteiros e materiais' },
    ...(dailyVisible
      ? [{ href: proLideresItemHrefWithBase(base, 'tarefas'), label: 'Tarefas diárias', desc: 'Checklist do dia' }]
      : []),
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl font-bold text-gray-900">Resumo da sua atividade</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Acesso rápido às áreas da equipe e indicadores das ferramentas do catálogo atribuídas a você (últimos{' '}
            {statsDays} dias).
          </p>
        </div>
        <Link
          href={proLideresItemHrefWithBase(base, 'catalogo')}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ir para meus links →
        </Link>
      </div>

      <section aria-labelledby="quick-links">
        <h2 id="quick-links" className="sr-only">
          Atalhos
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[4.5rem] flex-col justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow"
              >
                <span className="font-semibold text-gray-900">{item.label}</span>
                <span className="text-xs text-gray-500">{item.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Ferramentas em uso</h2>
            <p className="text-xs text-gray-500">
              Eventos com a sua identificação na equipe (aberturas, inícios, conclusões, WhatsApp).
            </p>
          </div>
          {truncated ? (
            <p className="text-xs text-amber-700">Período com muitos eventos — totais podem estar truncados.</p>
          ) : null}
        </div>

        {activeLinks.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gray-600">
            {diagnosticsIssue === 'no_admin' ? (
              <>
                Não foi possível carregar as métricas neste momento (ambiente incompleto). Os contadores voltam quando a
                configuração do servidor estiver correta — avise o suporte se persistir.
              </>
            ) : diagnosticsIssue === 'fetch_error' ? (
              <>Não foi possível carregar as métricas. Tente atualizar a página em instantes.</>
            ) : (
              <>
                Ainda não há atividade registrada neste período. Acesse as ferramentas em{' '}
                <Link href={proLideresItemHrefWithBase(base, 'catalogo')} className="font-medium text-blue-600">
                  Meus links
                </Link>{' '}
                e use <strong className="font-semibold text-gray-800">Copiar link</strong> (URLs com o teu código de
                equipa contam aberturas e WhatsApp na tua área).
              </>
            )}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 border-b border-gray-100 px-4 py-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Visualizações</p>
                <p className="text-lg font-semibold text-gray-900">{totals.views}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Inícios</p>
                <p className="text-lg font-semibold text-gray-900">{totals.starts}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Conclusões</p>
                <p className="text-lg font-semibold text-gray-900">{totals.completions}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <p className="text-lg font-semibold text-gray-900">{totals.whatsapp}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Ferramenta</th>
                    <th className="px-4 py-2 text-right">Ver</th>
                    <th className="px-4 py-2 text-right">Início</th>
                    <th className="px-4 py-2 text-right">Fim</th>
                    <th className="hidden px-4 py-2 text-right sm:table-cell">WA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeLinks.map((r) => (
                    <tr key={r.linkId} className="text-gray-800">
                      <td className="max-w-[12rem] truncate px-4 py-2 font-medium" title={r.title}>
                        {r.title}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.views}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.starts}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.completions}</td>
                      <td className="hidden px-4 py-2 text-right tabular-nums sm:table-cell">{r.whatsappClicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
