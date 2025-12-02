'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import PageLayout from '@/components/shared/PageLayout'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import { useAuth } from '@/contexts/AuthContext'

export default function AnotacoesPage() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <AnotacoesContent />
    </ProtectedRoute>
  )
}

function AnotacoesContent() {
  const { user, loading } = useAuth()
  const [anotacoes, setAnotacoes] = useState<any[]>([])
  const [anotacoesFiltradas, setAnotacoesFiltradas] = useState<any[]>([])
  const [novaAnotacao, setNovaAnotacao] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'geral',
    tags: ''
  })
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [carregando, setCarregando] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const carregarAnotacoes = async () => {
      try {
        // TODO: Implementar API para buscar anotações do Supabase
        // Por enquanto, usar localStorage como fallback
        const anotacoesSalvas = localStorage.getItem('ylada_anotacoes')
        if (anotacoesSalvas) {
          const anotacoesParsed = JSON.parse(anotacoesSalvas)
          setAnotacoes(anotacoesParsed)
          aplicarFiltros(anotacoesParsed, busca, filtroCategoria)
        }
      } catch (error) {
        console.error('Erro ao carregar anotações:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarAnotacoes()
  }, [user])

  // Função para aplicar filtros
  const aplicarFiltros = (lista: any[], buscaTexto: string, categoria: string) => {
    let filtradas = [...lista]

    // Filtro por categoria
    if (categoria !== 'todas') {
      filtradas = filtradas.filter(a => a.categoria === categoria)
    }

    // Filtro por busca (título, conteúdo ou tags)
    if (buscaTexto.trim()) {
      const buscaLower = buscaTexto.toLowerCase()
      filtradas = filtradas.filter(a => {
        const tituloMatch = a.titulo?.toLowerCase().includes(buscaLower) || false
        const conteudoMatch = a.conteudo?.toLowerCase().includes(buscaLower) || false
        const tagsMatch = a.tags?.toLowerCase().includes(buscaLower) || false
        return tituloMatch || conteudoMatch || tagsMatch
      })
    }

    // Ordenar por data (mais recentes primeiro)
    filtradas.sort((a, b) => {
      const dateA = new Date(a.created_at || a.updated_at).getTime()
      const dateB = new Date(b.created_at || b.updated_at).getTime()
      return dateB - dateA
    })

    setAnotacoesFiltradas(filtradas)
  }

  // Aplicar filtros quando busca ou categoria mudarem
  useEffect(() => {
    aplicarFiltros(anotacoes, busca, filtroCategoria)
  }, [busca, filtroCategoria, anotacoes])

  const handleSalvar = async () => {
    if (!novaAnotacao.titulo.trim() && !novaAnotacao.conteudo.trim()) {
      return
    }

    try {
      const anotacao = {
        id: Date.now().toString(),
        ...novaAnotacao,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const novasAnotacoes = [anotacao, ...anotacoes]
      setAnotacoes(novasAnotacoes)
      localStorage.setItem('ylada_anotacoes', JSON.stringify(novasAnotacoes))
      aplicarFiltros(novasAnotacoes, busca, filtroCategoria)

      // TODO: Salvar no Supabase quando a API estiver pronta
      // await fetch('/api/nutri/anotacoes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(anotacao)
      // })

      setNovaAnotacao({
        titulo: '',
        conteudo: '',
        categoria: 'geral',
        tags: ''
      })
    } catch (error) {
      console.error('Erro ao salvar anotação:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 lg:ml-56">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Minhas Anotações</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            <Section
              title="📝 Minhas Anotações"
              subtitle="Registre seus insights, aprendizados e reflexões"
            >
              {/* Editor de Nova Anotação */}
              <Card className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Nova Anotação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título (opcional)
                    </label>
                    <input
                      type="text"
                      value={novaAnotacao.titulo}
                      onChange={(e) => setNovaAnotacao({ ...novaAnotacao, titulo: e.target.value })}
                      placeholder="Título da anotação..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conteúdo
                    </label>
                    <textarea
                      value={novaAnotacao.conteudo}
                      onChange={(e) => setNovaAnotacao({ ...novaAnotacao, conteudo: e.target.value })}
                      placeholder="Escreva seus insights e aprendizados aqui..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        value={novaAnotacao.categoria}
                        onChange={(e) => setNovaAnotacao({ ...novaAnotacao, categoria: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="geral">Geral</option>
                        <option value="jornada">Jornada</option>
                        <option value="pilar">Pilar</option>
                        <option value="gsal">GSAL</option>
                        <option value="ferramentas">Ferramentas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={novaAnotacao.tags}
                        onChange={(e) => setNovaAnotacao({ ...novaAnotacao, tags: e.target.value })}
                        placeholder="ex: aprendizado, insight, ação"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSalvar}
                    disabled={!novaAnotacao.conteudo.trim()}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salvar Anotação
                  </button>
                </div>
              </Card>

              {/* Busca e Filtros */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar Anotações
                  </label>
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por título, conteúdo ou tags..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por Categoria
                  </label>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="todas">Todas as Categorias</option>
                    <option value="geral">Geral</option>
                    <option value="jornada">Jornada</option>
                    <option value="pilar">Pilar</option>
                    <option value="gsal">GSAL</option>
                    <option value="ferramentas">Ferramentas</option>
                  </select>
                </div>
              </div>

              {/* Lista de Anotações */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Anotações Salvas ({anotacoesFiltradas.length} de {anotacoes.length})
                </h3>

                {carregando ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">Carregando anotações...</p>
                  </div>
                ) : anotacoesFiltradas.length === 0 ? (
                  <Card>
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        {anotacoes.length === 0 
                          ? 'Nenhuma anotação salva ainda.'
                          : 'Nenhuma anotação encontrada com os filtros aplicados.'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {anotacoes.length === 0 
                          ? 'Comece registrando seus insights acima!'
                          : 'Tente ajustar os filtros de busca.'}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {anotacoesFiltradas.map((anotacao) => (
                      <Card key={anotacao.id}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {anotacao.titulo && (
                              <h4 className="font-semibold text-gray-900 mb-2">{anotacao.titulo}</h4>
                            )}
                            <p className="text-gray-700 whitespace-pre-wrap">{anotacao.conteudo}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {anotacao.categoria}
                            </span>
                            {anotacao.tags && (
                              <div className="flex flex-wrap gap-1">
                                {anotacao.tags.split(',').map((tag: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(anotacao.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

