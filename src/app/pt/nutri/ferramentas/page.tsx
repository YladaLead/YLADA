'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NutriFerramentas() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [statusFiltro, setStatusFiltro] = useState('todas')

  const ferramentas = [
    {
      id: 'quiz-interativo',
      nome: 'Quiz Interativo',
      categoria: 'Quiz',
      descricao: 'Descubra seu tipo de metabolismo através de perguntas inteligentes',
      status: 'ativo',
      leads: 45,
      conversoes: 12,
      taxaConversao: 26.7,
      icon: '🧬',
      cor: 'blue',
      link: '/quiz-interativo',
      ultimaAtualizacao: '2024-01-15'
    },
    {
      id: 'calculadora-imc',
      nome: 'Calculadora de IMC',
      categoria: 'Calculadora',
      descricao: 'Calcule seu IMC com interpretação personalizada',
      status: 'ativo',
      leads: 32,
      conversoes: 8,
      taxaConversao: 25.0,
      icon: '📊',
      cor: 'green',
      link: '/calculadora-imc',
      ultimaAtualizacao: '2024-01-14'
    },
    {
      id: 'post-curiosidades',
      nome: 'Post de Curiosidades',
      categoria: 'Conteúdo',
      descricao: 'Posts educativos sobre nutrição e bem-estar',
      status: 'ativo',
      leads: 28,
      conversoes: 6,
      taxaConversao: 21.4,
      icon: '📱',
      cor: 'purple',
      link: '/post-curiosidades',
      ultimaAtualizacao: '2024-01-13'
    },
    {
      id: 'template-post-dica',
      nome: 'Post com Dica',
      categoria: 'Conteúdo',
      descricao: 'Dicas práticas de nutrição para redes sociais',
      status: 'ativo',
      leads: 22,
      conversoes: 5,
      taxaConversao: 22.7,
      icon: '💡',
      cor: 'yellow',
      link: '/template-post-dica',
      ultimaAtualizacao: '2024-01-12'
    },
    {
      id: 'template-reels-roteirizado',
      nome: 'Reels Roteirizado',
      categoria: 'Conteúdo',
      descricao: 'Reels estruturados para engajamento',
      status: 'ativo',
      leads: 18,
      conversoes: 4,
      taxaConversao: 22.2,
      icon: '🎬',
      cor: 'pink',
      link: '/template-reels-roteirizado',
      ultimaAtualizacao: '2024-01-11'
    },
    {
      id: 'quiz-bem-estar',
      nome: 'Quiz de Bem-Estar',
      categoria: 'Quiz',
      descricao: 'Avalie seu nível de bem-estar geral',
      status: 'rascunho',
      leads: 0,
      conversoes: 0,
      taxaConversao: 0,
      icon: '🌟',
      cor: 'orange',
      link: '#',
      ultimaAtualizacao: '2024-01-10'
    }
  ]

  const categorias = ['todas', 'Quiz', 'Calculadora', 'Conteúdo']
  const status = ['todas', 'ativo', 'rascunho', 'pausado']

  const ferramentasFiltradas = ferramentas.filter(ferramenta => {
    const categoriaMatch = categoriaFiltro === 'todas' || ferramenta.categoria === categoriaFiltro
    const statusMatch = statusFiltro === 'todas' || ferramenta.status === statusFiltro
    return categoriaMatch && statusMatch
  })

  const getCorClasses = (cor: string) => {
    const cores = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return cores[cor as keyof typeof cores] || cores.blue
  }

  const getStatusClasses = (status: string) => {
    const statusClasses = {
      ativo: 'bg-green-100 text-green-800',
      rascunho: 'bg-yellow-100 text-yellow-800',
      pausado: 'bg-red-100 text-red-800'
    }
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.rascunho
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Ferramentas NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Nova Ferramenta
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas as categorias' : categoria}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {status.map(statusItem => (
                  <option key={statusItem} value={statusItem}>
                    {statusItem === 'todas' ? 'Todos os status' : statusItem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Ferramentas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ferramentasFiltradas.map((ferramenta) => (
            <div key={ferramenta.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{ferramenta.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ferramenta.nome}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCorClasses(ferramenta.cor)}`}>
                      {ferramenta.categoria}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(ferramenta.status)}`}>
                  {ferramenta.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{ferramenta.descricao}</p>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{ferramenta.leads}</p>
                  <p className="text-xs text-gray-600">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{ferramenta.conversoes}</p>
                  <p className="text-xs text-gray-600">Conversões</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{ferramenta.taxaConversao}%</p>
                  <p className="text-xs text-gray-600">Taxa</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2">
                {ferramenta.status === 'ativo' ? (
                  <>
                    <Link
                      href={ferramenta.link}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Ver Ferramenta
                    </Link>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Pausar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Ativar
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Editar
                    </button>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Última atualização: {ferramenta.ultimaAtualizacao}
              </p>
            </div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h3 className="font-medium text-gray-900">Nova Ferramenta</h3>
                <p className="text-sm text-gray-600">Criar uma nova ferramenta personalizada</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">Ver analytics detalhados das ferramentas</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl mr-3">🎨</span>
              <div>
                <h3 className="font-medium text-gray-900">Templates</h3>
                <p className="text-sm text-gray-600">Usar templates pré-definidos</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
