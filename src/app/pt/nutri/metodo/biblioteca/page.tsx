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

  // Mapeamento de PDFs internos (os 6 PDFs essenciais)
  const pdfsInternos: Record<string, string> = {
    'manual técnico da plataforma': '/pt/nutri/metodo/biblioteca/pdf-01-manual-tecnico-plataforma',
    'checklist oficial do dia 1': '/pt/nutri/metodo/biblioteca/pdf-02-checklist-dia-1',
    'checklist de consolidação': '/pt/nutri/metodo/biblioteca/pdf-03-checklist-dia-7',
    'primeira semana': '/pt/nutri/metodo/biblioteca/pdf-03-checklist-dia-7',
    'rotina mínima': '/pt/nutri/metodo/biblioteca/pdf-04-rotina-minima',
    'scripts essenciais': '/pt/nutri/metodo/biblioteca/pdf-05-scripts-essenciais',
    'guia prático de gestão gsal': '/pt/nutri/metodo/biblioteca/pdf-06-guia-gsal',
    'guia gsal': '/pt/nutri/metodo/biblioteca/pdf-06-guia-gsal'
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

  // Filtrar biblioteca por pesquisa
  useEffect(() => {
    let filtrada = [...biblioteca]

    if (pesquisa.trim()) {
      const pesquisaLower = pesquisa.toLowerCase()
      filtrada = filtrada.filter(item =>
        item.title.toLowerCase().includes(pesquisaLower) ||
        item.description?.toLowerCase().includes(pesquisaLower)
      )
    }

    setBibliotecaFiltrada(filtrada)
  }, [biblioteca, pesquisa])

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
          <p className="text-gray-600 mb-6">
            PDFs, scripts, checklists e templates para consultar quando precisar.
          </p>

          {/* Pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Pesquisar por nome ou descrição..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-out"
            />
          </div>

          {/* Contador de resultados */}
          {!loading && (
            <p className="text-sm text-gray-600">
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
              {pesquisa 
                ? 'Nenhum material encontrado com a pesquisa aplicada.' 
                : 'Nenhum material disponível no momento.'}
            </p>
            {pesquisa && (
              <button
                onClick={() => setPesquisa('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out"
              >
                Limpar pesquisa
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-out hover:border-blue-200"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl flex-shrink-0">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base mb-2 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={linkHref}
                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md font-medium text-sm text-center"
                      >
                        📖 Ler conteúdo
                      </Link>
                      <button
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium text-sm"
                        title="PDF em preparação"
                      >
                        📄 Baixar PDF (em breve)
                      </button>
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

