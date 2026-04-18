'use client'

import { useState, useEffect, useMemo } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

interface WorkshopRegistration {
  id: string
  nome: string
  email: string
  telefone: string
  crn?: string | null
  source?: string | null
  workshop_type?: string | null
  inscricao_status?: string | null
  ip_address?: string | null
  user_agent?: string | null
  created_at: string
}

const KNOWN_WORKSHOP_SOURCES = [
  'workshop_nutri_empresaria_landing_page',
  'workshop_agenda_instavel_landing_page',
  'workshop_landing_page',
] as const

const SOURCE_LABEL_GLAUCIA =
  'Nutri → Empresária (Dra. Gláucia · landing /pt/nutri/workshop-nutri-empresaria)'

function formatWorkshopSourceLabel(source?: string | null): string {
  switch (source) {
    case 'workshop_nutri_empresaria_landing_page':
      return SOURCE_LABEL_GLAUCIA
    case 'workshop_agenda_instavel_landing_page':
      return 'Agenda instável'
    case 'workshop_landing_page':
      return 'Workshop (landing geral)'
    case '':
    case undefined:
    case null:
      return '—'
    default:
      return source
  }
}

function escCsv(v: string | null | undefined): string {
  const s = String(v ?? '').replace(/"/g, '""')
  return `"${s}"`
}

function exportCadastrosCsv(rows: WorkshopRegistration[]) {
  const headers = [
    'nome',
    'email',
    'telefone',
    'crn',
    'origem',
    'tipo_workshop',
    'status_inscricao',
    'data_cadastro_iso',
    'data_cadastro_pt',
    'id',
    'ip',
    'user_agent',
  ]
  const lines = [headers.join(';')]
  for (const r of rows) {
    const created = r.created_at ? new Date(r.created_at) : null
    lines.push(
      [
        escCsv(r.nome),
        escCsv(r.email),
        escCsv(r.telefone),
        escCsv(r.crn || ''),
        escCsv(formatWorkshopSourceLabel(r.source)),
        escCsv(r.workshop_type || ''),
        escCsv(r.inscricao_status || ''),
        escCsv(created ? created.toISOString() : ''),
        escCsv(created ? created.toLocaleString('pt-BR') : ''),
        escCsv(r.id),
        escCsv(r.ip_address || ''),
        escCsv(r.user_agent || ''),
      ].join(';')
    )
  }
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cadastros-workshop-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function CadastrosWorkshopPage() {
  return (
    <AdminProtectedRoute>
      <CadastrosWorkshopContent />
    </AdminProtectedRoute>
  )
}

function CadastrosWorkshopContent() {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState<
    '' | (typeof KNOWN_WORKSHOP_SOURCES)[number] | '__other__'
  >('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop', {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        const raw = (data.registrations || []) as WorkshopRegistration[]
        setRegistrations(
          raw.map((r) => ({
            id: r.id,
            nome: r.nome,
            email: r.email,
            telefone: r.telefone,
            crn: r.crn ?? null,
            source: r.source ?? null,
            workshop_type: r.workshop_type ?? null,
            inscricao_status: r.inscricao_status ?? null,
            ip_address: r.ip_address ?? null,
            user_agent: r.user_agent ?? null,
            created_at: r.created_at,
          }))
        )
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations]

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.nome.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          (r.telefone || '').includes(term) ||
          (r.crn || '').toLowerCase().includes(term)
      )
    }

    if (sourceFilter === '__other__') {
      filtered = filtered.filter((r) => {
        const s = r.source || ''
        return s !== '' && !KNOWN_WORKSHOP_SOURCES.includes(s as (typeof KNOWN_WORKSHOP_SOURCES)[number])
      })
    } else if (sourceFilter) {
      filtered = filtered.filter((r) => r.source === sourceFilter)
    }

    return filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [registrations, searchTerm, sourceFilter])

  const countGlaucia = useMemo(
    () => registrations.filter((r) => r.source === 'workshop_nutri_empresaria_landing_page').length,
    [registrations]
  )

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">Cadastros do workshop</h1>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                <strong>Fichas de cadastro</strong> preenchidas nas landings (nome, e-mail, WhatsApp, CRN, tipo,
                status, data, IP, navegador). A <strong>automação no WhatsApp</strong> é feita{' '}
                <strong>fora desta página</strong> — filtre por origem (ex.: Dra. Gláucia) e use{' '}
                <strong>Exportar CSV</strong> para a lista completa.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                disabled={loading || filteredRegistrations.length === 0}
                onClick={() => exportCadastrosCsv(filteredRegistrations)}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold disabled:opacity-50"
              >
                Exportar CSV (lista atual)
              </button>
              <Link
                href="/admin/whatsapp/workshop"
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-semibold"
              >
                Agenda workshop
              </Link>
              <Link
                href="/admin/whatsapp"
                className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-semibold"
              >
                Conversas
              </Link>
              <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                ← Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3 h-full flex flex-col gap-3 min-h-0">
          <div className="flex flex-wrap gap-2 items-center flex-shrink-0 text-sm">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">
              Total inscrições: {registrations.length}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-semibold">
              A mostrar: {filteredRegistrations.length}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-semibold">
              Nutri → Empresária (Gláucia): {countGlaucia}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex-shrink-0">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, e-mail, telefone ou CRN…"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="min-w-[200px] max-w-full flex-1 sm:flex-none">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Origem</label>
                <select
                  value={sourceFilter}
                  onChange={(e) =>
                    setSourceFilter(
                      e.target.value as '' | (typeof KNOWN_WORKSHOP_SOURCES)[number] | '__other__'
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  title="Filtrar por landing de origem"
                >
                  <option value="">Todas as origens</option>
                  <option value="workshop_nutri_empresaria_landing_page">
                    Nutri → Empresária (Dra. Gláucia)
                  </option>
                  <option value="workshop_agenda_instavel_landing_page">Agenda instável</option>
                  <option value="workshop_landing_page">Workshop (landing geral)</option>
                  <option value="__other__">Outras origens</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Carregando…</div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum cadastro com estes filtros.</div>
            ) : (
              <div className="flex-1 min-h-0 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data cadastro
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User-agent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 align-top">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{reg.nome}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 break-all max-w-[200px]">{reg.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{reg.telefone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reg.crn || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-[280px]" title={reg.source || ''}>
                          {formatWorkshopSourceLabel(reg.source)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reg.workshop_type || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reg.inscricao_status || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(reg.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-[120px] break-all">
                          {reg.ip_address || '—'}
                        </td>
                        <td
                          className="px-4 py-3 text-xs text-gray-500 max-w-[220px] break-words"
                          title={reg.user_agent || ''}
                        >
                          {reg.user_agent
                            ? reg.user_agent.length > 80
                              ? `${reg.user_agent.slice(0, 80)}…`
                              : reg.user_agent
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <details className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex-shrink-0 text-sm text-slate-700">
            <summary className="cursor-pointer font-semibold text-slate-900">Notas</summary>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>
                O CSV exporta exatamente a <strong>lista filtrada</strong> (busca + origem), com todos os campos
                acima.
              </li>
              <li>
                Para só a turma da Dra. Gláucia, escolha a origem <strong>Nutri → Empresária (Dra. Gláucia)</strong> e
                exporte.
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  )
}

export default CadastrosWorkshopPage
