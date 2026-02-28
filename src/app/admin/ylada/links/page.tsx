'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface LinkRow {
  id: string
  user_id: string
  slug: string
  title: string | null
  template_id: string | null
  template_name: string | null
  status: string
  cta_whatsapp: string | null
  created_at: string
  updated_at: string
  url: string
  owner: {
    nome_completo: string
    email: string
    perfil: string
  } | null
}

function AdminYladaLinksContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [links, setLinks] = useState<LinkRow[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [perfilFilter, setPerfilFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const carregar = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (perfilFilter) params.set('perfil', perfilFilter)
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/admin/ylada/links?${params.toString()}`, { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setLinks(json.data ?? [])
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch (e) {
      setError('Erro ao carregar. Tente novamente.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [statusFilter, perfilFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    carregar()
  }

  const formatarData = (s: string) => {
    return new Date(s).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copiarUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Links inteligentes (YLADA)</h1>
              <p className="text-sm text-gray-600 mt-1">
                Lista de todos os links e <strong>quem está emitindo</strong> cada link (dono do link).
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Área (dono)</label>
              <select
                value={perfilFilter}
                onChange={(e) => setPerfilFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todas</option>
                <option value="wellness">Wellness</option>
                <option value="nutri">Nutri</option>
                <option value="coach">Coach</option>
                <option value="nutra">Nutra</option>
                <option value="ylada">Ylada</option>
              </select>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Buscar (slug, título, nome ou email)</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            Carregando...
          </div>
        ) : links.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            Nenhum link encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link / Slug</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quem emite (dono)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {links.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{row.slug}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[180px] truncate" title={row.title ?? ''}>
                        {row.title || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.template_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            row.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : row.status === 'paused'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {row.status === 'active' ? 'Ativo' : row.status === 'paused' ? 'Pausado' : 'Arquivado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {row.owner ? (
                          <div>
                            <div className="font-medium text-gray-900">{row.owner.nome_completo || '—'}</div>
                            <div className="text-gray-500 text-xs">{row.owner.email}</div>
                            <div className="text-gray-400 text-xs">{row.owner.perfil || '—'}</div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[200px]"
                            title={row.url}
                          >
                            Abrir
                          </a>
                          <button
                            type="button"
                            onClick={() => copiarUrl(row.url, row.id)}
                            className="text-gray-500 hover:text-gray-700 text-xs"
                            title="Copiar URL"
                          >
                            {copiedUrl === row.id ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatarData(row.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && links.length > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Total: <strong>{links.length}</strong> link(s).
          </p>
        )}
      </main>
    </div>
  )
}

export default function AdminYladaLinksPage() {
  return (
    <AdminProtectedRoute>
      <AdminYladaLinksContent />
    </AdminProtectedRoute>
  )
}
