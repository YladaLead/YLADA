'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import type { BibliotecaItem } from '@/types/formacao'

export default function BibliotecaPage() {
  const [biblioteca, setBiblioteca] = useState<BibliotecaItem[]>([])
  const [bibliotecaFiltrada, setBibliotecaFiltrada] = useState<BibliotecaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pesquisa, setPesquisa] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas')

  // Mapeamento de PDFs internos
  const pdfsInternos: Record<string, string> = {
    'guia completo do método ylada': '/pt/nutri/metodo/biblioteca/pdf-1-guia-completo',
    'identidade & postura profissional': '/pt/nutri/metodo/biblioteca/pdf-2-identidade-postura',
    'rotina & produtividade ylada': '/pt/nutri/metodo/biblioteca/pdf-3-rotina-produtividade',
    'captação inteligente ylada': '/pt/nutri/metodo/biblioteca/pdf-4-captacao-inteligente',
    'fidelização & experiência da cliente': '/pt/nutri/metodo/biblioteca/pdf-5-fidelizacao-experiencia',
    'gestão & organização de clientes': '/pt/nutri/metodo/biblioteca/pdf-6-gestao-gsal',
    'ferramentas ylada – uso prático': '/pt/nutri/metodo/biblioteca/pdf-7-ferramentas-uso-pratico',
    'guia de divulgação das ferramentas': '/pt/nutri/metodo/biblioteca/pdf-8-guia-divulgacao',
    'manual técnico das ferramentas ylada': '/pt/nutri/metodo/biblioteca/pdf-9-manual-tecnico'
  }

  useEffect(() => {
    const carregarBiblioteca = async () => {
      try {
        const res = await fetch('/api/nutri/formacao/biblioteca', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          setBiblioteca(data.data || [])
          setBibliotecaFiltrada(data.data || [])
        }
      } catch (error) {
        console.error('Erro ao carregar biblioteca:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarBiblioteca()
  }, [])

  // Filtrar biblioteca
  useEffect(() => {
    let filtrada = [...biblioteca]

    // Filtro por categoria
    if (categoriaFiltro !== 'Todas') {
      filtrada = filtrada.filter(item => item.category === categoriaFiltro)
    }

    // Filtro por pesquisa
    if (pesquisa.trim()) {
      const pesquisaLower = pesquisa.toLowerCase()
      filtrada = filtrada.filter(item =>
        item.title.toLowerCase().includes(pesquisaLower) ||
        item.description?.toLowerCase().includes(pesquisaLower) ||
        item.category.toLowerCase().includes(pesquisaLower)
      )
    }

    setBibliotecaFiltrada(filtrada)
  }, [biblioteca, categoriaFiltro, pesquisa])

  // Obter categorias únicas
  const categorias = ['Todas', ...Array.from(new Set(biblioteca.map(item => item.category)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link 
            href="/pt/nutri/metodo" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Materiais de Apoio</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Materiais de Apoio
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            PDFs, scripts, checklists e templates para consultar quando precisar.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span><strong>Esses materiais são apoio, não obrigação.</strong> A LIA te orienta sobre o que faz sentido para o seu momento. Use quando sentir necessidade.</span>
            </p>
          </div>

          {/* Pesquisa e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Campo de Pesquisa */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Pesquisar por nome, descrição ou categoria..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-out"
              />
            </div>

            {/* Filtro por Categoria */}
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-out"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          {!loading && (
            <p className="text-sm text-gray-600 mb-4">
              {bibliotecaFiltrada.length} {bibliotecaFiltrada.length === 1 ? 'material encontrado' : 'materiais encontrados'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : bibliotecaFiltrada.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-600">
              {pesquisa || categoriaFiltro !== 'Todas' 
                ? 'Nenhum material encontrado com os filtros aplicados.' 
                : 'Nenhum material disponível no momento.'}
            </p>
            {(pesquisa || categoriaFiltro !== 'Todas') && (
              <button
                onClick={() => {
                  setPesquisa('')
                  setCategoriaFiltro('Todas')
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bibliotecaFiltrada.map((item) => {
              // Verificar se é PDF interno
              const tituloLower = item.title.toLowerCase()
              const isPDFInterno = Object.keys(pdfsInternos).some(key => tituloLower.includes(key))
              const linkHref = isPDFInterno 
                ? pdfsInternos[Object.keys(pdfsInternos).find(key => tituloLower.includes(key)) || ''] || item.file_url
                : item.file_url

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-out hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl flex-shrink-0">
                      {item.file_type === 'pdf' && '📄'}
                      {item.file_type === 'template' && '🎨'}
                      {item.file_type === 'script' && '📝'}
                      {item.file_type === 'planilha' && '📊'}
                      {item.file_type === 'mensagem' && '💬'}
                      {!['pdf', 'template', 'script', 'planilha', 'mensagem'].includes(item.file_type) && '📎'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                        {isPDFInterno ? (
                          <Link
                            href={linkHref}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                          >
                            Ler agora →
                          </Link>
                        ) : (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                          >
                            Baixar PDF →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

