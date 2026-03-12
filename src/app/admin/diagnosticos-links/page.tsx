'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { DIAGNOSTICOS } from '@/config/ylada-diagnosticos'
import { listarVariantes, PROFISSOES } from '@/config/ylada-diagnostico-variantes'

const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.com'

function DiagnosticosLinksContent() {
  const [copiado, setCopiado] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'base' | string>('todos') // 'todos' | 'base' | profissao slug

  const variantes = listarVariantes()
  const bases = Object.keys(DIAGNOSTICOS)

  const itensBase = bases.map((slug) => {
    const config = DIAGNOSTICOS[slug]
    const path = slug === 'comunicacao' ? '/pt/diagnostico' : `/pt/diagnostico/${slug}`
    return {
      slug,
      titulo: config?.nome || slug,
      path,
      tipo: 'base' as const,
      profissao: null as string | null,
    }
  })

  const itensVariantes = variantes.map((v) => ({
    slug: v.slugCompleto,
    titulo: v.titulo,
    path: `/pt/diagnostico/${v.slugCompleto}`,
    tipo: 'variante' as const,
    profissao: v.profissao.slug,
  }))

  const todosItens = [...itensBase, ...itensVariantes]

  const itensFiltrados =
    filtro === 'todos'
      ? todosItens
      : filtro === 'base'
        ? itensBase
        : todosItens.filter((i) => i.profissao === filtro)

  const copiar = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(url)
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      alert('Não foi possível copiar. Copie manualmente.')
    }
  }

  const copiarTodos = async () => {
    const itens = filtro === 'todos' ? todosItens : itensFiltrados
    const texto = itens
      .map((d) => `${d.titulo}\n${baseUrl.replace(/\/$/, '')}${d.path}`)
      .join('\n\n')
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado('todos')
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      alert('Não foi possível copiar.')
    }
  }

  const copiarListaUrls = async () => {
    const itens = filtro === 'todos' ? todosItens : itensFiltrados
    const texto = itens.map((d) => `${baseUrl.replace(/\/$/, '')}${d.path}`).join('\n')
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado('urls')
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      alert('Não foi possível copiar.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Marketing – Biblioteca de diagnósticos
          </h1>
          <p className="text-gray-600 mt-1">
            {todosItens.length} páginas indexáveis para SEO. Use em campanhas, anúncios e redes sociais.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFiltro('todos')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({todosItens.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltro('base')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filtro === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Apenas base ({itensBase.length})
            </button>
            {PROFISSOES.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setFiltro(p.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  filtro === p.slug ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copiarTodos}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copiado === 'todos' ? '✓ Copiado!' : 'Copiar todos (título + URL)'}
            </button>
            <button
              type="button"
              onClick={copiarListaUrls}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              {copiado === 'urls' ? '✓ Copiado!' : 'Copiar só URLs'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {itensFiltrados.map((d) => {
            const url = `${baseUrl.replace(/\/$/, '')}${d.path}`
            const isCopiado = copiado === url

            return (
              <div
                key={d.slug}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {d.titulo}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {d.tipo === 'base' ? 'Versão geral' : d.profissao && PROFISSOES.find((p) => p.slug === d.profissao)?.label}
                  </p>
                </div>
                <code className="hidden sm:block flex-1 text-xs text-gray-600 bg-gray-100 px-2 py-1.5 rounded truncate max-w-xs">
                  {d.path}
                </code>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Abrir
                  </a>
                  <button
                    type="button"
                    onClick={() => copiar(url)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isCopiado ? '✓' : 'Copiar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-700">
            <strong>Dica:</strong> Cada URL é uma página indexável para SEO. Use filtros por profissão para campanhas segmentadas (ex: só links para nutricionistas).
          </p>
        </div>
      </main>
    </div>
  )
}

export default function DiagnosticosLinksPage() {
  return (
    <AdminProtectedRoute>
      <DiagnosticosLinksContent />
    </AdminProtectedRoute>
  )
}
