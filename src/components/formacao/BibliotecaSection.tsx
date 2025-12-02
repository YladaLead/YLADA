'use client'

import { useState } from 'react'
import type { BibliotecaItem } from '@/types/formacao'

interface BibliotecaSectionProps {
  biblioteca: BibliotecaItem[]
}

const categorias = [
  'Todas',
  'Anexo A — Scripts de Atendimento',
  'Anexo B — Checklists Profissionais',
  'Anexo C — Templates Nutri-Empresária',
  'Anexo D — PDFs Educativos',
  'Anexo E — Materiais de Apoio'
] as const

// Mapeamento de categorias antigas para novas
const mapeamentoCategorias: Record<string, string> = {
  'Scripts de Atendimento': 'Anexo A — Scripts de Atendimento',
  'Checklists': 'Anexo B — Checklists Profissionais',
  'Templates': 'Anexo C — Templates Nutri-Empresária',
  'PDFs educativos': 'Anexo D — PDFs Educativos',
  'Materiais de apoio': 'Anexo E — Materiais de Apoio'
}

export default function BibliotecaSection({ biblioteca }: BibliotecaSectionProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas')
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set())

  // Normalizar categorias antigas para novas
  const bibliotecaNormalizada = biblioteca.map(item => ({
    ...item,
    category: mapeamentoCategorias[item.category] || item.category
  }))

  // Contar por categoria (deve ser calculado primeiro)
  const contadoresPorCategoria = categorias.reduce((acc, cat) => {
    if (cat === 'Todas') {
      acc[cat] = bibliotecaNormalizada.length
    } else {
      acc[cat] = bibliotecaNormalizada.filter(item => item.category === cat).length
    }
    return acc
  }, {} as Record<string, number>)

  // Ordenar alfabeticamente
  const bibliotecaOrdenada = [...bibliotecaNormalizada].sort((a, b) => a.title.localeCompare(b.title))
  
  const bibliotecaFiltrada = categoriaSelecionada === 'Todas'
    ? bibliotecaOrdenada
    : bibliotecaOrdenada.filter(item => item.category === categoriaSelecionada)

  const toggleFavorito = async (id: string) => {
    const novoFavoritos = new Set(favoritos)
    if (novoFavoritos.has(id)) {
      novoFavoritos.delete(id)
    } else {
      novoFavoritos.add(id)
    }
    setFavoritos(novoFavoritos)

    // Salvar no backend
    try {
      await fetch(`/api/nutri/formacao/biblioteca/${id}/favoritar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_favorited: novoFavoritos.has(id) })
      })
    } catch (error) {
      console.error('Erro ao favoritar:', error)
    }
  }

  const downloadArquivo = (item: BibliotecaItem) => {
    window.open(item.file_url, '_blank')
  }

  if (biblioteca.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <p className="text-gray-600">Nenhum anexo disponível no momento.</p>
        <p className="text-sm text-gray-500 mt-2">Os anexos oficiais do livro estarão disponíveis em breve!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Introdução às Ferramentas */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-400">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🛠️ Ferramentas YLADA</h2>
        <p className="text-gray-700">
          Scripts, checklists, templates, PDFs e materiais prontos para captação, atendimento e gestão. Tudo aplicável e imediato.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Use as ferramentas por conta própria ou siga a Jornada de 30 Dias, que indica qual ferramenta usar em cada momento.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                categoriaSelecionada === categoria
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoria} {contadoresPorCategoria[categoria] > 0 && `(${contadoresPorCategoria[categoria]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bibliotecaFiltrada.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">
                {item.file_type === 'pdf' && '📄'}
                {item.file_type === 'template' && '🎨'}
                {item.file_type === 'script' && '📝'}
                {item.file_type === 'planilha' && '📊'}
                {item.file_type === 'mensagem' && '💬'}
                {!['pdf', 'template', 'script', 'planilha', 'mensagem'].includes(item.file_type) && '📎'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  <button
                    onClick={() => toggleFavorito(item.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {(favoritos.has(item.id) || item.is_favorited) ? '⭐' : '☆'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <button
                    onClick={() => downloadArquivo(item)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Baixar →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

