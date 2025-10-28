'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Curso {
  id: string
  titulo: string
  descricao: string
  imagem?: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  categoria: string
  preco: number
  preco_com_desconto?: number
  duracao_horas: number
  total_aulas: number
  total_matriculados: number
  avaliacao_media: number
  status: 'draft' | 'published'
  is_gratuito: boolean
}

export default function NutriCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'meus' | 'disponiveis'>('todos')

  useEffect(() => {
    // Simular carregamento de cursos
    setLoading(false)
    // TODO: Buscar cursos reais do Supabase
    setCursos([
      {
        id: '1',
        titulo: 'Nutrição Clínica Básica',
        descricao: 'Fundamentos da nutrição clínica para iniciantes',
        nivel: 'iniciante',
        categoria: 'Nutrição',
        preco: 299.90,
        preco_com_desconto: 199.90,
        duracao_horas: 40,
        total_aulas: 25,
        total_matriculados: 150,
        avaliacao_media: 4.7,
        status: 'published',
        is_gratuito: false
      },
      {
        id: '2',
        titulo: 'Emagrecimento Saudável',
        descricao: 'Estratégias práticas para emagrecimento sustentável',
        nivel: 'intermediario',
        categoria: 'Emagrecimento',
        preco: 399.90,
        duracao_horas: 60,
        total_aulas: 35,
        total_matriculados: 230,
        avaliacao_media: 4.9,
        status: 'published',
        is_gratuito: false
      },
      {
        id: '3',
        titulo: 'Introdução à Nutrição Funcional',
        descricao: 'Primeiros passos na nutrição funcional',
        nivel: 'iniciante',
        categoria: 'Nutrição Funcional',
        preco: 0,
        duracao_horas: 10,
        total_aulas: 8,
        total_matriculados: 500,
        avaliacao_media: 4.5,
        status: 'published',
        is_gratuito: true
      }
    ])
  }, [])

  const cursosFiltrados = filtro === 'todos' 
    ? cursos 
    : filtro === 'meus' 
    ? cursos.filter(c => c.total_matriculados > 0) // Simulação: verificar se está matriculado
    : cursos.filter(c => c.status === 'published')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Cursos</h1>
            </div>
            <Link
              href="/pt/nutri/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Meus Cursos
          </h2>
          <p className="text-gray-600">
            Expandir conhecimento e oferecer educação contínua aos seus clientes
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'todos'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('meus')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'meus'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
            }`}
          >
            Minha Biblioteca
          </button>
          <button
            onClick={() => setFiltro('disponiveis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'disponiveis'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
            }`}
          >
            Disponíveis
          </button>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Carregando cursos...</p>
            </div>
          ) : cursosFiltrados.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-600">
                Os cursos aparecerão aqui conforme forem adicionados pela administração
              </p>
            </div>
          ) : (
            cursosFiltrados.map((curso) => (
              <div
                key={curso.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Imagem do Curso */}
                <div className="relative w-full h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="absolute top-4 right-4">
                    {curso.is_gratuito ? (
                      <span className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                        GRÁTIS
                      </span>
                    ) : (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        R$ {curso.preco_com_desconto || curso.preco}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                    <span className="text-sm font-medium">{curso.total_aulas} aulas</span>
                    <span className="text-lg">•</span>
                    <span className="text-sm font-medium">{curso.duracao_horas}h</span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 sm:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {curso.categoria}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {curso.avaliacao_media}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {curso.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {curso.descricao}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{curso.total_matriculados}</span> matriculados
                    </div>
                    <Link
                      href={`/pt/nutri/cursos/${curso.id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

