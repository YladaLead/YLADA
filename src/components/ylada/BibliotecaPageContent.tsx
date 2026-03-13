'use client'

import { useState, useEffect } from 'react'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  BIBLIOTECA_TIPOS,
  BIBLIOTECA_SEGMENTOS,
  getTemasParaBiblioteca,
  getTemaLabel,
  getBibliotecaSegmentFromProfile,
  getBibliotecaSegmentFromArea,
  type BibliotecaTipo,
  type BibliotecaSegmentCode,
} from '@/config/ylada-biblioteca'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'

function getSimulateCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${SIMULATE_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

interface BibliotecaItemRow {
  id: string
  tipo: string
  segment_codes: string[]
  tema: string
  pilar: string | null
  titulo: string
  description: string | null
  dor_principal: string | null
  objetivo_principal: string | null
  template_id: string | null
  flow_id: string | null
  architecture: string | null
  meta: Record<string, unknown> | null
  sort_order: number
}

interface BibliotecaPageContentProps {
  areaCodigo: string
  areaLabel: string
}

export default function BibliotecaPageContent({ areaCodigo, areaLabel }: BibliotecaPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`

  const [tipoAtivo, setTipoAtivo] = useState<BibliotecaTipo>('quiz')
  const [segmentoFiltro, setSegmentoFiltro] = useState<BibliotecaSegmentCode | ''>('')
  const [temaFiltro, setTemaFiltro] = useState<string>('')
  const [segmentoSugerido, setSegmentoSugerido] = useState<BibliotecaSegmentCode | null>(null)
  const [items, setItems] = useState<BibliotecaItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [linkCriado, setLinkCriado] = useState<{ url: string; slug: string; titulo: string } | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const key = getSimulateCookie()
    if (key) {
      const perfil = getPerfilSimuladoByKey(key)
      if (perfil?.profession) {
        const seg = getBibliotecaSegmentFromProfile(perfil.profession)
        setSegmentoSugerido(seg)
        setSegmentoFiltro(seg)
      }
    } else {
      // Sem cookie de simulação: usar segmento da área (ex: /pt/estetica/biblioteca → aesthetics)
      const segFromArea = getBibliotecaSegmentFromArea(areaCodigo)
      if (segFromArea) {
        setSegmentoSugerido(segFromArea)
        setSegmentoFiltro(segFromArea)
      }
    }
  }, [areaCodigo])

  useEffect(() => {
    if (segmentoFiltro && temaFiltro) {
      const temasDoSegmento = getTemasParaBiblioteca(segmentoFiltro)
      const temaExiste = temasDoSegmento.some((t) => t.value === temaFiltro)
      if (!temaExiste) setTemaFiltro('')
    }
  }, [segmentoFiltro])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (tipoAtivo) params.set('tipo', tipoAtivo)
    if (segmentoFiltro) params.set('segmento', segmentoFiltro)
    if (temaFiltro) params.set('tema', temaFiltro)
    fetch(`/api/ylada/biblioteca?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) setItems(data.items)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [tipoAtivo, segmentoFiltro, temaFiltro])

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Biblioteca</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Quizzes, calculadoras e links prontos para usar. Escolha um item e crie seu link em um clique.
          </p>
        </header>

        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {BIBLIOTECA_TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipoAtivo(t.value)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tipoAtivo === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Segmento</label>
            <select
              value={segmentoFiltro}
              onChange={(e) => setSegmentoFiltro(e.target.value as BibliotecaSegmentCode | '')}
              className="block w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {BIBLIOTECA_SEGMENTOS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                  {segmentoSugerido === s.value ? ' (seu perfil)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</label>
            <select
              value={temaFiltro}
              onChange={(e) => setTemaFiltro(e.target.value)}
              className="block w-56 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {getTemasParaBiblioteca(segmentoFiltro || undefined).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-sm text-gray-500">Carregando...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                        {getTemaLabel(item.tema)}
                      </span>
                      {item.dor_principal && (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          {item.dor_principal}
                        </span>
                      )}
                      {item.objetivo_principal && (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                          {item.objetivo_principal}
                        </span>
                      )}
                      {item.pilar && !item.dor_principal && (
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {item.pilar}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!!creatingId}
                    onClick={async () => {
                      setCreatingId(item.id)
                      try {
                        const res = await fetch('/api/ylada/links/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({
                            flow_id: item.flow_id ?? 'diagnostico_risco',
                            biblioteca_template_id: item.template_id || undefined,
                            interpretacao: { tema: item.tema, objetivo: 'captar' },
                            title: item.titulo,
                          }),
                        })
                        const data = await res.json()
                        if (data?.success && data?.data?.id) {
                          if (item.tipo === 'calculadora' && data?.data?.url) {
                            const base = typeof window !== 'undefined' ? window.location.origin : ''
                            const url = data.data.url || `${base}/l/${data.data.slug}`
                            setLinkCriado({ url, slug: data.data.slug, titulo: item.titulo })
                          } else {
                            window.location.href = `${linksPath}/editar/${data.data.id}`
                          }
                        } else if (data?.success && data?.data?.url) {
                          window.location.href = `${linksPath}?created=1`
                        } else {
                          window.location.href = `${linksPath}?tema=${encodeURIComponent(item.tema)}&flow_id=${item.flow_id ?? 'diagnostico_risco'}`
                        }
                      } catch {
                        window.location.href = `${linksPath}?tema=${encodeURIComponent(item.tema)}&flow_id=${item.flow_id ?? 'diagnostico_risco'}`
                      } finally {
                        setCreatingId(null)
                      }
                    }}
                    className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors disabled:opacity-50"
                  >
                    {creatingId === item.id ? 'Criando...' : 'Usar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum item encontrado</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Tente ajustar os filtros ou use o Noel para criar um link do zero.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Filtros: {tipoAtivo} | {segmentoFiltro || 'todos'} | {temaFiltro ? getTemaLabel(temaFiltro) : 'todos'}
            </p>
          </div>
        )}

        {linkCriado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Link criado!</h3>
              <p className="text-sm text-gray-600">{linkCriado.titulo}</p>
              <div className="flex flex-col gap-3">
                <a
                  href={linkCriado.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-colors"
                >
                  <span>👁</span> Ver preview
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(linkCriado!.url)
                    setCopiado(true)
                    setTimeout(() => setCopiado(false), 2000)
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  {copiado ? '✓ Copiado!' : '📋 Copiar URL'}
                </button>
                <a
                  href={linksPath}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Ir para meus links
                </a>
              </div>
              <button
                type="button"
                onClick={() => setLinkCriado(null)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </YladaAreaShell>
  )
}
