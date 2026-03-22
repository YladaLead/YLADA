'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type ComRegistroRow = {
  subscriptionId: string
  userId: string
  email: string
  nome: string
  perfil: string | null
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  diasRestantes: number | null
  diasDesdeInicio: number | null
  leads: number
  perfilCadastro: string | null
}

type ImplicitoRow = {
  userId: string
  email: string
  nome: string
  perfil: string | null
  dataCadastro: string | null
  observacao: string
}

function PlanoFreeMatrizContent() {
  const [incluirExpiradas, setIncluirExpiradas] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comRegistro, setComRegistro] = useState<ComRegistroRow[]>([])
  const [implicitos, setImplicitos] = useState<ImplicitoRow[]>([])
  const [notas, setNotas] = useState<{ implicitos?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const q = incluirExpiradas ? '?incluir_expiradas=1' : ''
        const res = await fetch(`/api/admin/reports/plano-free-matriz${q}`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao carregar')
        if (!cancelled) {
          setComRegistro(data.comRegistro || [])
          setImplicitos(data.implicitosPreview || [])
          setNotas(data.notas || null)
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Erro ao carregar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [incluirExpiradas])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/admin/config" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              ← Configurações
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <Link href="/admin/usuarios" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Usuários
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <h1 className="text-lg font-semibold text-gray-900">Plano free matriz (YLADA)</h1>
          </div>
          <Link href="/admin">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA"
              width={120}
              height={42}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <p className="text-sm text-gray-600 max-w-3xl">
          Assinaturas com <code className="text-xs bg-gray-200 px-1 rounded">area = ylada</code> e{' '}
          <code className="text-xs bg-gray-200 px-1 rounded">plan_type = free</code>. Use para acompanhar prazo,
          dias de uso desde o início do período e leads. Quem está só no free implícito aparece na prévia abaixo
          (amostra recente).
        </p>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={incluirExpiradas}
            onChange={(e) => setIncluirExpiradas(e.target.checked)}
            className="rounded border-gray-300"
          />
          Incluir vencidas / inativas na tabela principal
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Carregando…</p>
        ) : (
          <>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Com registro em assinaturas ({comRegistro.length})
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-3 py-2 font-medium">Nome</th>
                      <th className="px-3 py-2 font-medium">E-mail</th>
                      <th className="px-3 py-2 font-medium">Perfil</th>
                      <th className="px-3 py-2 font-medium">Vence</th>
                      <th className="px-3 py-2 font-medium">Dias rest.</th>
                      <th className="px-3 py-2 font-medium">Dias no período</th>
                      <th className="px-3 py-2 font-medium">Leads</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comRegistro.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                          Nenhum registro com os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      comRegistro.map((row) => (
                        <tr key={row.subscriptionId} className="hover:bg-gray-50/80">
                          <td className="px-3 py-2">{row.nome}</td>
                          <td className="px-3 py-2 text-xs break-all">{row.email || '—'}</td>
                          <td className="px-3 py-2">{row.perfil || '—'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.currentPeriodEnd
                              ? new Date(row.currentPeriodEnd).toLocaleDateString('pt-BR')
                              : '—'}
                          </td>
                          <td className="px-3 py-2">{row.diasRestantes ?? '—'}</td>
                          <td className="px-3 py-2">{row.diasDesdeInicio ?? '—'}</td>
                          <td className="px-3 py-2">{row.leads}</td>
                          <td className="px-3 py-2">{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-1">Free implícito (prévia)</h2>
              {notas?.implicitos && <p className="text-xs text-gray-500 mb-3">{notas.implicitos}</p>}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-3 py-2 font-medium">Nome</th>
                      <th className="px-3 py-2 font-medium">E-mail</th>
                      <th className="px-3 py-2 font-medium">Perfil</th>
                      <th className="px-3 py-2 font-medium">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {implicitos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                          Nenhum na amostra ou todos já têm linha ylada.
                        </td>
                      </tr>
                    ) : (
                      implicitos.map((row) => (
                        <tr key={row.userId} className="hover:bg-gray-50/80">
                          <td className="px-3 py-2">{row.nome}</td>
                          <td className="px-3 py-2 text-xs break-all">{row.email || '—'}</td>
                          <td className="px-3 py-2">{row.perfil || '—'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.dataCadastro
                              ? new Date(row.dataCadastro).toLocaleDateString('pt-BR')
                              : '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default function AdminPlanoFreeMatrizPage() {
  return (
    <AdminProtectedRoute>
      <PlanoFreeMatrizContent />
    </AdminProtectedRoute>
  )
}
