'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

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

export default function FerramentasNutri() {
  // Dados simulados - depois virão do banco de dados
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([
    {
      id: 'quiz-interativo-001',
      nome: 'Quiz Interativo',
      categoria: 'Atrair Leads',
      objetivo: 'Atrair leads frios',
      url: 'https://ylada.app/pt/nutri/quiz-interativo-001',
      status: 'ativa',
      leads: 15,
      visualizacoes: 120,
      conversao: 12.5,
      ultimaAtividade: '2024-01-15',
      cores: { primaria: '#3B82F6', secundaria: '#1E40AF' },
      criadaEm: '2024-01-10'
    },
    {
      id: 'calculadora-imc-002',
      nome: 'Calculadora de IMC',
      categoria: 'Avaliação',
      objetivo: 'Avaliação corporal',
      url: 'https://ylada.app/pt/nutri/calculadora-imc-002',
      status: 'ativa',
      leads: 8,
      visualizacoes: 85,
      conversao: 9.4,
      ultimaAtividade: '2024-01-14',
      cores: { primaria: '#10B981', secundaria: '#059669' },
      criadaEm: '2024-01-08'
    },
    {
      id: 'checklist-detox-003',
      nome: 'Checklist Detox',
      categoria: 'Educação',
      objetivo: 'Educação rápida',
      url: 'https://ylada.app/pt/nutri/checklist-detox-003',
      status: 'inativa',
      leads: 3,
      visualizacoes: 45,
      conversao: 6.7,
      ultimaAtividade: '2024-01-12',
      cores: { primaria: '#8B5CF6', secundaria: '#7C3AED' },
      criadaEm: '2024-01-05'
    }
  ])

  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')

  const [stats, setStats] = useState({
    totalFerramentas: 0,
    ferramentasAtivas: 0,
    totalLeads: 0,
    taxaConversaoMedia: 0
  })

  // Carregar ferramentas reais do Supabase (fallback para mock acima)
  useEffect(() => {
    const carregarFerramentas = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          return
        }

        // TODO: substituir pelo ID do usuário autenticado
        const userId = '550e8400-e29b-41d4-a716-446655440000'

        // Buscar ferramentas do usuário a partir de user_templates
        const { data, error } = await supabase
          .from('user_templates')
          .select('id, slug, title, description, views, leads_count, status, created_at, content')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('Supabase indisponível em ferramentas:', error.message)
          return
        }

        if (!data || data.length === 0) {
          return
        }

        const mapeadas: Ferramenta[] = data.map((t) => ({
          id: t.id,
          nome: t.title,
          categoria: 'Personalizada',
          objetivo: t.description || 'Ferramenta personalizada',
          url: `/link/${t.slug}`,
          status: (t.status as 'ativa' | 'inativa') || 'ativa',
          leads: t.leads_count ?? 0,
          visualizacoes: t.views ?? 0,
          conversao: t.views ? Number(((t.leads_count || 0) / t.views) * 100) : 0,
          ultimaAtividade: new Date(t.created_at).toISOString().slice(0, 10),
          cores: { primaria: '#3B82F6', secundaria: '#1E40AF' },
          criadaEm: new Date(t.created_at).toISOString().slice(0, 10),
        }))

        setFerramentas(mapeadas)
      } catch (e) {
        console.warn('Falha ao carregar ferramentas do Supabase, usando mock.', e)
      }
    }

    carregarFerramentas()
  }, [])

  const categorias = [...new Set(ferramentas.map(f => f.categoria))]

  const ferramentasFiltradas = ferramentas.filter(ferramenta => {
    const statusMatch = filtroStatus === 'todas' || ferramenta.status === filtroStatus
    const categoriaMatch = filtroCategoria === 'todas' || ferramenta.categoria === filtroCategoria
    return statusMatch && categoriaMatch
  })

  useEffect(() => {
    setStats({
      totalFerramentas: ferramentas.length,
      ferramentasAtivas: ferramentas.filter(f => f.status === 'ativa').length,
      totalLeads: ferramentas.reduce((acc, f) => acc + f.leads, 0),
      taxaConversaoMedia: ferramentas.reduce((acc, f) => acc + f.conversao, 0) / ferramentas.length
    })
  }, [ferramentas])

  const copiarLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  const toggleStatus = (id: string) => {
    setFerramentas(prev => prev.map(f => 
      f.id === id 
        ? { ...f, status: f.status === 'ativa' ? 'inativa' : 'ativa' as 'ativa' | 'inativa' }
        : f
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Minhas Ferramentas
                </h1>
                <p className="text-sm text-gray-600">Gerencie suas ferramentas de captação de leads</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Voltar ao Dashboard
              </Link>
              <Link 
                href="/pt/nutri/ferramentas/nova"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nova Ferramenta
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🛠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Ferramentas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFerramentas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ferramentas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ferramentasAtivas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.taxaConversaoMedia.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as 'todas' | 'ativa' | 'inativa')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todas">Todas</option>
                <option value="ativa">Ativas</option>
                <option value="inativa">Inativas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria:</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todas">Todas</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            
            <div className="ml-auto">
              <p className="text-sm text-gray-600">
                Mostrando {ferramentasFiltradas.length} de {ferramentas.length} ferramentas
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Ferramentas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ferramentas</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {ferramentasFiltradas.map((ferramenta) => (
              <div key={ferramenta.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: ferramenta.cores.primaria + '20' }}
                    >
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{ferramenta.nome}</h3>
                      <p className="text-sm text-gray-600">{ferramenta.categoria} • {ferramenta.objetivo}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Criada em: {ferramenta.criadaEm} • Última atividade: {ferramenta.ultimaAtividade}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{ferramenta.leads}</p>
                      <p className="text-xs text-gray-500">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{ferramenta.visualizacoes}</p>
                      <p className="text-xs text-gray-500">Visualizações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{ferramenta.conversao}%</p>
                      <p className="text-xs text-gray-500">Conversão</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(ferramenta.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          ferramenta.status === 'ativa' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {ferramenta.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => copiarLink(ferramenta.url)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Copiar Link
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* URL da Ferramenta */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500">URL:</span>
                    <code className="text-xs text-gray-700 bg-white px-2 py-1 rounded border">
                      {ferramenta.url}
                    </code>
                    <button 
                      onClick={() => copiarLink(ferramenta.url)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {ferramentasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🛠️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma ferramenta encontrada</h3>
            <p className="text-gray-600 mb-6">
              {ferramentas.length === 0 
                ? 'Crie sua primeira ferramenta para começar a capturar leads'
                : 'Tente ajustar os filtros para ver mais ferramentas'
              }
            </p>
            <Link 
              href="/pt/nutri/ferramentas/nova"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Nova Ferramenta
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}