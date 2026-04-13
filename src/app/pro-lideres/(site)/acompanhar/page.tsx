import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acompanhar · Pro Líderes · YLADA',
  description:
    'Visão pública do que já existe no Pro Líderes: ambiente do líder e da equipe (o painel em si exige login).',
}

const UPDATED = 'Abril 2026'

export default function ProLideresAcompanharPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-12">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-blue-600">Pro Líderes · Sem login</p>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Acompanhar o que já existe</h1>
        <p className="text-gray-600">
          Esta página é <strong className="text-gray-800">pública</strong>: serve para ir vendo a evolução do produto. O{' '}
          <strong className="text-gray-800">painel</strong> (líder e equipe) continua a exigir{' '}
          <Link href="/pro-lideres/entrar" className="font-semibold text-blue-600 underline hover:text-blue-800">
            entrar com conta
          </Link>
          .
        </p>
        <p className="text-xs text-gray-500">Última atualização deste resumo: {UPDATED}.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <section
          className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-sm"
          aria-labelledby="ambiente-lider-heading"
        >
          <h2 id="ambiente-lider-heading" className="text-lg font-bold text-blue-900">
            Ambiente do líder
          </h2>
          <p className="mt-1 text-sm text-blue-900/80">
            Dono do espaço após consultoria. URL:{' '}
            <code className="rounded bg-white/80 px-1 text-xs text-gray-800">/pro-lideres/painel</code> (com sessão).
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-800">
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              Menu completo: visão geral, equipe, Noel, catálogo, scripts
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Links &amp; convites</strong> — gerar link por e-mail, copiar, revogar
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Equipe</strong> — lista líder + membros (com nomes quando há perfil YLADA)
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Perfil / tenant</strong> — editar dados da operação (nome, equipa, contacto, foco)
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              Cabeçalho do painel: <strong className="text-blue-800">Ambiente do líder</strong> + nome da operação
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Catálogo de ferramentas</strong> — links YLADA (
              <code className="rounded bg-white/80 px-1 text-xs">/l/…</code>
              ); o que o líder cria em Meus links entra automaticamente; extras em{' '}
              <code className="rounded bg-white/80 px-1 text-xs">leader_tenant_flow_entries</code> (304)
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600" aria-hidden>
                ◆
              </span>
              Configurações: página reservada (conteúdo em construção)
            </li>
          </ul>
        </section>

        <section
          className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm"
          aria-labelledby="ambiente-equipe-heading"
        >
          <h2 id="ambiente-equipe-heading" className="text-lg font-bold text-emerald-900">
            Ambiente da equipe
          </h2>
          <p className="mt-1 text-sm text-emerald-900/80">
            Quem entra por <strong>convite</strong> com o mesmo e-mail da conta. Mesma URL do painel, menu mais curto.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-800">
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              Entrada por link:{' '}
              <code className="rounded bg-white/80 px-1 text-xs text-gray-800">/pro-lideres/convite/[token]</code>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              Menu: visão geral, equipe, Noel, catálogo, scripts — <strong>sem</strong> convites nem configurações
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Perfil</strong> — vê dados da operação; <strong>só o líder edita</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              Cabeçalho: <strong className="text-emerald-800">Ambiente da equipe</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600" aria-hidden>
                ✓
              </span>
              <strong>Catálogo</strong> — mesma lista que o líder (sem adicionar nem remover links)
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400" aria-hidden>
                …
              </span>
              Noel: mesmo cartão da matriz YLADA + API <code className="rounded bg-white/80 px-1 text-xs">/api/pro-lideres/noel</code> com contexto do tenant; scripts persistidos na área Scripts (a seguir)
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5" aria-labelledby="publico-heading">
        <h2 id="publico-heading" className="text-base font-bold text-gray-900">
          Rotas públicas (sem login)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
          <li>
            <Link href="/pro-lideres" className="font-medium text-blue-600 underline hover:text-blue-800">
              /pro-lideres
            </Link>{' '}
            — apresentação + WhatsApp
          </li>
          <li>
            <Link href="/pro-lideres/entrar" className="font-medium text-blue-600 underline hover:text-blue-800">
              /pro-lideres/entrar
            </Link>{' '}
            — login (sem criar conta aqui)
          </li>
          <li>
            <Link
              href="/pro-lideres/aguardando-acesso"
              className="font-medium text-blue-600 underline hover:text-blue-800"
            >
              /pro-lideres/aguardando-acesso
            </Link>{' '}
            — conta sem tenant ativo
          </li>
          <li>
            <span className="font-mono text-xs text-gray-600">/pro-lideres/convite/…</span> — aceitar convite (login
            no passo final)
          </li>
          <li>
            <span className="font-semibold text-gray-800">/pro-lideres/acompanhar</span> — esta página
          </li>
        </ul>
      </section>

      <p className="text-center text-sm text-gray-500">
        <Link href="/pro-lideres" className="font-medium text-blue-600 hover:text-blue-800">
          ← Voltar ao Pro Líderes
        </Link>
      </p>
    </div>
  )
}
