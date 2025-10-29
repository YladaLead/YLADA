'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Curso {
  id: string
  titulo: string
  descricao: string
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

export default function WellnessCursosPage() {
  const [filtro, setFiltro] = useState<'todos' | 'disponiveis'>('todos')

  const cursos: Curso[] = [
    {
      id: '1',
      titulo: 'Bem-Estar Integral com Suplementação',
      descricao: 'Aprenda como integrar suplementos naturais no seu dia a dia para melhorar energia e saúde',
      nivel: 'iniciante',
      categoria: 'Bem-Estar',
      preco: 497,
      duracao_horas: 30,
      total_aulas: 20,
      total_matriculados: 120,
      avaliacao_media: 4.8,
      status: 'published',
      is_gratuito: false
    },
    {
      id: '2',
      titulo: 'Emagrecimento e Vitalidade',
      descricao: 'Estratégias práticas para perder peso com saúde usando nutrição completa',
      nivel: 'intermediario',
      categoria: 'Emagrecimento',
      preco: 597,
      duracao_horas: 45,
      total_aulas: 28,
      total_matriculados: 85,
      avaliacao_media: 4.9,
      status: 'published',
      is_gratuito: false
    },
    {
      id: '3',
      titulo: 'Introdução à Nutrição Saudável',
      descricao: 'Fundamentos básicos de alimentação equilibrada e suplementação inteligente',
      nivel: 'iniciante',
      categoria: 'Educação',
      preco: 0,
      duracao_horas: 12,
      total_aulas: 8,
      total_matriculados: 350,
      avaliacao_media: 4.6,
      status: 'published',
      is_gratuito: true
    },
    {
      id: '4',
      titulo: 'Transformação Total - 90 Dias',
      descricao: 'Jornada completa de transformação física e mental com suporte exclusivo',
      nivel: 'avancado',
      categoria: 'Transformação',
      preco: 997,
      preco_com_desconto: 797,
      duracao_horas: 90,
      total_aulas: 60,
      total_matriculados: 45,
      avaliacao_media: 5.0,
      status: 'published',
      is_gratuito: false
    }
  ]

  const cursosFiltrados = filtro === 'todos' ? cursos : cursos.filter(c => c.status === 'published')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Área de Cursos</h1>
                <p className="text-sm text-gray-600">Eduque seus clientes e multiplique resultados</p>
              </div>
            </div>
            <Link
              href="/pt/wellness/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">📚 Meus Cursos</h2>
              <p className="text-green-100 text-lg">
                Cursos que você adquiriu para se tornar um especialista em bem-estar e nutrição
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'todos' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('disponiveis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'disponiveis' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disponíveis
          </button>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso) => (
            <div key={curso.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Imagem do Curso */}
              <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded mb-2 capitalize">
                      {curso.nivel}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{curso.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-3">{curso.descricao}</p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span>⏱️ {curso.duracao_horas}h</span>
                  <span>📖 {curso.total_aulas} aulas</span>
                  <span>👥 {curso.total_matriculados}</span>
                </div>

                {/* Avaliação */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(curso.avaliacao_media) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{curso.avaliacao_media}</span>
                </div>

                {/* Preço e Ação */}
                <div className="flex items-center justify-between">
                  <div>
                    {curso.is_gratuito ? (
                      <span className="text-2xl font-bold text-green-600">Grátis</span>
                    ) : curso.preco_com_desconto ? (
                      <div>
                        <span className="text-sm text-gray-400 line-through">R$ {curso.preco.toFixed(2)}</span>
                        <span className="text-2xl font-bold text-green-600 ml-2">R$ {curso.preco_com_desconto.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">R$ {curso.preco.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all">
                    Ver Curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

