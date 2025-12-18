'use client'

import { useState, useEffect } from 'react'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import PageLayout from '@/components/shared/PageLayout'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import { useAuth } from '@/contexts/AuthContext'

export default function AnotacoesPage() {
  return <AnotacoesContent />
}

function AnotacoesContent() {
  const { user, loading } = useAuth()
  const [anotacoes, setAnotacoes] = useState<any[]>([])
  const [reflexoesJornada, setReflexoesJornada] = useState<any[]>([])
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
  
  // Estados para edição e exclusão
  const [editando, setEditando] = useState<string | null>(null)
  const [anotacaoEditada, setAnotacaoEditada] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'geral',
    tags: ''
  })
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const carregarAnotacoes = async () => {
      try {
        // Carregar anotações manuais do localStorage
        const anotacoesSalvas = localStorage.getItem('ylada_anotacoes')
        let anotacoesManuais: any[] = []
        if (anotacoesSalvas) {
          anotacoesManuais = JSON.parse(anotacoesSalvas)
        }

        // Carregar reflexões da jornada do Supabase
        let reflexoes: any[] = []
        try {
          const responseReflexoes = await fetch('/api/nutri/metodo/jornada/reflexoes', {
            credentials: 'include'
          })
          
          if (responseReflexoes.ok) {
            const data = await responseReflexoes.json()
            console.log('🔍 Reflexões da jornada:', data)
            if (data.success && data.data && data.data.length > 0) {
              reflexoes = data.data.map((r: any) => ({
                id: `jornada-${r.day_number}-${r.item_index}`,
                titulo: r.item_index === -1 
                  ? `Dia ${r.day_number} - Ação Prática` 
                  : `Dia ${r.day_number} - Reflexão ${r.item_index + 1}`,
                conteudo: r.nota,
                categoria: 'jornada',
                tags: `dia ${r.day_number}`,
                created_at: r.updated_at || r.created_at,
                isJornada: true
              }))
            }
          } else {
            console.error('❌ Erro na API de reflexões:', responseReflexoes.status)
          }
        } catch (apiError) {
          console.error('❌ Erro ao buscar reflexões:', apiError)
        }

        setAnotacoes(anotacoesManuais)
        setReflexoesJornada(reflexoes)
        
        // Combinar todas as anotações
        const todasAnotacoes = [...anotacoesManuais, ...reflexoes]
        aplicarFiltros(todasAnotacoes, busca, filtroCategoria)
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
    const todasAnotacoes = [...anotacoes, ...reflexoesJornada]
    aplicarFiltros(todasAnotacoes, busca, filtroCategoria)
  }, [busca, filtroCategoria, anotacoes, reflexoesJornada])

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

  // Iniciar edição de uma anotação
  const handleIniciarEdicao = (anotacao: any) => {
    setEditando(anotacao.id)
    setAnotacaoEditada({
      titulo: anotacao.titulo || '',
      conteudo: anotacao.conteudo || '',
      categoria: anotacao.categoria || 'geral',
      tags: anotacao.tags || ''
    })
  }

  // Salvar edição
  const handleSalvarEdicao = () => {
    if (!editando || !anotacaoEditada.conteudo.trim()) return

    const novasAnotacoes = anotacoes.map(a => {
      if (a.id === editando) {
        return {
          ...a,
          ...anotacaoEditada,
          updated_at: new Date().toISOString()
        }
      }
      return a
    })

    setAnotacoes(novasAnotacoes)
    localStorage.setItem('ylada_anotacoes', JSON.stringify(novasAnotacoes))
    
    setEditando(null)
    setAnotacaoEditada({ titulo: '', conteudo: '', categoria: 'geral', tags: '' })
  }

  // Cancelar edição
  const handleCancelarEdicao = () => {
    setEditando(null)
    setAnotacaoEditada({ titulo: '', conteudo: '', categoria: 'geral', tags: '' })
  }

  // Apagar anotação
  const handleApagar = (id: string) => {
    const novasAnotacoes = anotacoes.filter(a => a.id !== id)
    setAnotacoes(novasAnotacoes)
    localStorage.setItem('ylada_anotacoes', JSON.stringify(novasAnotacoes))
    setConfirmandoExclusao(null)
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
                        <option value="gestao">Gestão</option>
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
                    <option value="gestao">Gestão</option>
                    <option value="ferramentas">Ferramentas</option>
                  </select>
                </div>
              </div>

              {/* Lista de Anotações */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Anotações Salvas ({anotacoesFiltradas.length} de {anotacoes.length + reflexoesJornada.length})
                  {reflexoesJornada.length > 0 && (
                    <span className="text-sm font-normal text-purple-600 ml-2">
                      ({reflexoesJornada.length} da Jornada)
                    </span>
                  )}
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
                      <Card key={anotacao.id} className={anotacao.isJornada ? 'border-l-4 border-purple-500' : ''}>
                        {/* Modal de Edição */}
                        {editando === anotacao.id && !anotacao.isJornada && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-gray-900 mb-3">✏️ Editando Anotação</h4>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={anotacaoEditada.titulo}
                                onChange={(e) => setAnotacaoEditada({ ...anotacaoEditada, titulo: e.target.value })}
                                placeholder="Título (opcional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                              <textarea
                                value={anotacaoEditada.conteudo}
                                onChange={(e) => setAnotacaoEditada({ ...anotacaoEditada, conteudo: e.target.value })}
                                placeholder="Conteúdo da anotação..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                rows={4}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <select
                                  value={anotacaoEditada.categoria}
                                  onChange={(e) => setAnotacaoEditada({ ...anotacaoEditada, categoria: e.target.value })}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                  <option value="geral">Geral</option>
                                  <option value="jornada">Jornada</option>
                                  <option value="pilar">Pilar</option>
                                  <option value="gestao">Gestão</option>
                                  <option value="ferramentas">Ferramentas</option>
                                </select>
                                <input
                                  type="text"
                                  value={anotacaoEditada.tags}
                                  onChange={(e) => setAnotacaoEditada({ ...anotacaoEditada, tags: e.target.value })}
                                  placeholder="Tags (vírgulas)"
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={handleCancelarEdicao}
                                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={handleSalvarEdicao}
                                  disabled={!anotacaoEditada.conteudo.trim()}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                                >
                                  Salvar Alterações
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Confirmação de Exclusão */}
                        {confirmandoExclusao === anotacao.id && !anotacao.isJornada && (
                          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-red-800 font-medium mb-3">
                              ⚠️ Tem certeza que deseja apagar esta anotação?
                            </p>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setConfirmandoExclusao(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleApagar(anotacao.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                              >
                                Sim, Apagar
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {anotacao.isJornada && (
                                <span className="text-purple-600">🎯</span>
                              )}
                              {anotacao.titulo && (
                                <h4 className="font-semibold text-gray-900">{anotacao.titulo}</h4>
                              )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{anotacao.conteudo}</p>
                          </div>
                          
                          {/* Botões de Editar e Apagar (apenas para anotações manuais) */}
                          {!anotacao.isJornada && editando !== anotacao.id && confirmandoExclusao !== anotacao.id && (
                            <div className="flex items-center gap-1 ml-3">
                              <button
                                onClick={() => handleIniciarEdicao(anotacao)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar anotação"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setConfirmandoExclusao(anotacao.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Apagar anotação"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              anotacao.isJornada 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {anotacao.isJornada ? '📚 Jornada' : anotacao.categoria}
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

