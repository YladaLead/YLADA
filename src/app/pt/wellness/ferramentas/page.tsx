'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Ferramenta {
  id: string
  nome: string
  categoria: string
  objetivo: string
  url: string
  status: 'ativa' | 'inativa'
  leads: number
  visualizacoes: number
  conversao: number
  ultimaAtividade: string
  cores: {
    primaria: string
    secundaria: string
  }
  criadaEm: string
}

export default function FerramentasWellness() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([])
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas')
  const [loading, setLoading] = useState(true)

  // Carregar ferramentas do banco de dados
  useEffect(() => {
    carregarFerramentas()
  }, [])

  const carregarFerramentas = async () => {
    try {
      setLoading(true)
      // TODO: Pegar user_id do sistema de autenticação
      const userId = 'user-temp-001' // Temporário

      const response = await fetch(
        `/api/wellness/ferramentas?user_id=${userId}&profession=wellness`
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar ferramentas')
      }

      const data = await response.json()
      
      // Transformar dados da API para o formato da interface
      const ferramentasFormatadas: Ferramenta[] = (data.tools || []).map((tool: any) => ({
        id: tool.id,
        nome: tool.title,
        categoria: tool.template_slug?.startsWith('calc-') ? 'Calculadora' : 
                  tool.template_slug?.startsWith('quiz-') ? 'Quiz' : 'Planilha',
        objetivo: tool.description || '',
        url: tool.user_profiles?.user_slug 
          ? `https://ylada.app/pt/wellness/${tool.user_profiles.user_slug}/${tool.slug}`
          : `https://ylada.app/pt/wellness/ferramenta/${tool.id}`,
        status: tool.status === 'active' ? 'ativa' : 'inativa',
        leads: tool.leads_count || 0,
        visualizacoes: tool.views || 0,
        conversao: tool.views > 0 ? (tool.leads_count || 0) / tool.views * 100 : 0,
        ultimaAtividade: new Date(tool.updated_at).toLocaleDateString('pt-BR'),
        cores: tool.custom_colors || { primaria: '#10B981', secundaria: '#059669' },
        criadaEm: new Date(tool.created_at).toLocaleDateString('pt-BR')
      }))

      setFerramentas(ferramentasFormatadas)
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error)
      // Em caso de erro, manter array vazio
      setFerramentas([])
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalFerramentas: ferramentas.length,
    ferramentasAtivas: ferramentas.filter(f => f.status === 'ativa').length,
    totalLeads: ferramentas.reduce((sum, f) => sum + f.leads, 0),
    taxaConversaoMedia: ferramentas.length > 0 
      ? ferramentas.reduce((sum, f) => sum + f.conversao, 0) / ferramentas.length 
      : 0
  }

  const ferramentasFiltradas = filtroStatus === 'todas'
    ? ferramentas
    : ferramentas.filter(f => f.status === filtroStatus)

  const categorias = [...new Set(ferramentas.map(f => f.categoria))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 sm:h-14 w-auto"
                />
              </Link>
              <div className="h-12 sm:h-16 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Meus Links
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-base sm:text-lg font-medium text-gray-700">
                    Links criados pelos seus templates
                  </p>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/pt/wellness/ferramentas/nova"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-medium"
            >
              + Criar Link
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Links</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFerramentas}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Links Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.ferramentasAtivas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-600">{stats.taxaConversaoMedia.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'todas'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroStatus('ativa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'ativa'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => setFiltroStatus('inativa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'inativa'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Inativas
          </button>
        </div>

        {/* Lista de Ferramentas */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando ferramentas...</p>
          </div>
        ) : ferramentasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <span className="text-6xl mb-4 block">🔧</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum link encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroStatus === 'todas' 
                ? 'Crie seu primeiro link para começar.'
                : `Nenhum link ${filtroStatus === 'ativa' ? 'ativa' : 'inativa'} encontrado.`}
            </p>
            <Link
              href="/pt/wellness/ferramentas/nova"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Criar Link
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ferramentasFiltradas.map((ferramenta) => (
              <div
                key={ferramenta.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: ferramenta.cores.primaria }}
                      >
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{ferramenta.nome}</h3>
                        <p className="text-sm text-gray-600">{ferramenta.categoria} • {ferramenta.objetivo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ferramenta.status === 'ativa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ferramenta.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visualizações</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.visualizacoes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversão</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.conversao.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Última atividade: {ferramenta.ultimaAtividade}
                    </p>
                    <div className="flex space-x-2">
                      <Link
                        href={ferramenta.url}
                        target="_blank"
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Ver Link →
                      </Link>
                      <Link
                        href={`/pt/wellness/ferramentas/${ferramenta.id}/editar`}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

