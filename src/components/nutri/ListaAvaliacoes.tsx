'use client'

import { useState, useEffect } from 'react'

interface Assessment {
  id: string
  assessment_type: string
  assessment_name: string | null
  assessment_number: number
  status: string
  is_reevaluation: boolean
  created_at: string
  data: {
    measurement_date?: string
    weight?: number
    bmi?: number
    body_fat_percentage?: number
  }
  interpretation?: string
  recommendations?: string
}

interface ListaAvaliacoesProps {
  clienteId: string
  avaliacoes: Assessment[]
  carregando: boolean
  onReload: () => void
  onSelectAvaliacao: (avaliacaoId: string) => void
  avaliacaoSelecionada: string | null
  onOpenNovaAvaliacao: () => void
  onOpenReavaliacao: (parentId: string) => void
  onOpenComparacao: (avaliacaoId: string) => void
}

export default function ListaAvaliacoes({
  clienteId,
  avaliacoes,
  carregando,
  onReload,
  onSelectAvaliacao,
  avaliacaoSelecionada,
  onOpenNovaAvaliacao,
  onOpenReavaliacao,
  onOpenComparacao
}: ListaAvaliacoesProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroReavaliacao, setFiltroReavaliacao] = useState<string>('todos')
  const [ordenacao, setOrdenacao] = useState<'recente' | 'antiga'>('recente')
  const [busca, setBusca] = useState('')
  const [lyaSuggestion, setLyaSuggestion] = useState<string | null>(null)
  const [loadingLya, setLoadingLya] = useState(false)

  // Filtrar e ordenar avaliações
  const avaliacoesFiltradas = avaliacoes
    .filter(av => {
      // Filtro de tipo
      if (filtroTipo !== 'todos' && av.assessment_type !== filtroTipo) return false
      
      // Filtro de status
      if (filtroStatus !== 'todos' && av.status !== filtroStatus) return false
      
      // Filtro de reavaliação
      if (filtroReavaliacao === 'sim' && !av.is_reevaluation) return false
      if (filtroReavaliacao === 'nao' && av.is_reevaluation) return false
      
      // Busca
      if (busca) {
        const searchLower = busca.toLowerCase()
        const nomeMatch = av.assessment_name?.toLowerCase().includes(searchLower)
        const tipoMatch = av.assessment_type.toLowerCase().includes(searchLower)
        const numeroMatch = av.assessment_number.toString().includes(busca)
        if (!nomeMatch && !tipoMatch && !numeroMatch) return false
      }
      
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return ordenacao === 'recente' ? dateB - dateA : dateA - dateB
    })

  // Pedir sugestão da LYA sobre quando reavaliar
  const pedirSugestaoReavaliacao = async () => {
    if (avaliacoes.length === 0) return
    
    setLoadingLya(true)
    setLyaSuggestion(null)
    
    try {
      const ultimaAvaliacao = avaliacoes.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]
      
      const diasDesdeUltima = Math.floor(
        (new Date().getTime() - new Date(ultimaAvaliacao.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )

      const prompt = `Analisando o histórico de avaliações deste cliente:
- Última avaliação: ${diasDesdeUltima} dias atrás
- Total de avaliações: ${avaliacoes.length}
- Tipo da última: ${ultimaAvaliacao.assessment_type}

Com base nas boas práticas nutricionais, você recomenda fazer uma nova reavaliação agora? Por quê?
Seja breve e objetiva.`

      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      if (response.ok) {
        setLyaSuggestion(data.response || 'Não consegui gerar sugestão no momento.')
      }
    } catch (error) {
      console.error('Erro ao pedir sugestão LYA:', error)
      setLyaSuggestion('Erro ao conectar com a LYA.')
    } finally {
      setLoadingLya(false)
    }
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      antropometrica: 'Antropométrica',
      bioimpedancia: 'Bioimpedância',
      anamnese: 'Anamnese',
      questionario: 'Questionário',
      reavaliacao: 'Reavaliação',
      outro: 'Outro'
    }
    return labels[tipo] || tipo
  }

  const getStatusColor = (status: string) => {
    if (status === 'completo') return 'bg-green-100 text-green-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando avaliações...</p>
        </div>
      </div>
    )
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma avaliação registrada</h3>
          <p className="text-gray-600 mb-6">
            Comece criando a primeira avaliação antropométrica deste cliente.
          </p>
          <button
            onClick={onOpenNovaAvaliacao}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Primeira Avaliação
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Avaliações ({avaliacoesFiltradas.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Histórico completo de avaliações do cliente
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onReload}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
          
          <button
            onClick={onOpenNovaAvaliacao}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* LYA Suggestion sobre reavaliação */}
      {avaliacoes.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">LYA</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Sugestão de Reavaliação</h4>
              <p className="text-sm text-gray-600 mb-3">
                Quer saber se já é hora de fazer uma nova reavaliação?
              </p>
              
              {lyaSuggestion && (
                <div className="bg-white rounded-lg p-3 mb-3 text-sm text-gray-700">
                  {lyaSuggestion}
                </div>
              )}
              
              <button
                type="button"
                onClick={pedirSugestaoReavaliacao}
                disabled={loadingLya}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loadingLya ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Consultando LYA...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Perguntar à LYA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros e busca */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, tipo, número..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os tipos</option>
              <option value="antropometrica">Antropométrica</option>
              <option value="bioimpedancia">Bioimpedância</option>
              <option value="anamnese">Anamnese</option>
              <option value="questionario">Questionário</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="completo">Completo</option>
              <option value="rascunho">Rascunho</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reavaliação</label>
            <select
              value={filtroReavaliacao}
              onChange={(e) => setFiltroReavaliacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas</option>
              <option value="nao">Apenas iniciais</option>
              <option value="sim">Apenas reavaliações</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ordenação</label>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as 'recente' | 'antiga')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="recente">Mais recente</option>
              <option value="antiga">Mais antiga</option>
            </select>
          </div>
        </div>

        {(filtroTipo !== 'todos' || filtroStatus !== 'todos' || filtroReavaliacao !== 'todos' || busca) && (
          <button
            onClick={() => {
              setFiltroTipo('todos')
              setFiltroStatus('todos')
              setFiltroReavaliacao('todos')
              setBusca('')
            }}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Lista de avaliações */}
      {avaliacoesFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">Nenhuma avaliação encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {avaliacoesFiltradas.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                avaliacaoSelecionada === avaliacao.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onSelectAvaliacao(avaliacao.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {avaliacao.is_reevaluation && (
                        <span className="text-purple-600 mr-2">🔄</span>
                      )}
                      {avaliacao.assessment_name || `Avaliação #${avaliacao.assessment_number}`}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(avaliacao.status)}`}>
                      {avaliacao.status === 'completo' ? 'Completo' : 'Rascunho'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {getTipoLabel(avaliacao.assessment_type)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Data</p>
                      <p className="text-sm font-medium text-gray-900">
                        {avaliacao.data?.measurement_date
                          ? new Date(avaliacao.data.measurement_date).toLocaleDateString('pt-BR')
                          : new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    {avaliacao.data?.weight && (
                      <div>
                        <p className="text-xs text-gray-500">Peso</p>
                        <p className="text-sm font-medium text-gray-900">{avaliacao.data.weight} kg</p>
                      </div>
                    )}
                    
                    {avaliacao.data?.bmi && (
                      <div>
                        <p className="text-xs text-gray-500">IMC</p>
                        <p className="text-sm font-medium text-gray-900">{avaliacao.data.bmi}</p>
                      </div>
                    )}
                    
                    {avaliacao.data?.body_fat_percentage && (
                      <div>
                        <p className="text-xs text-gray-500">% Gordura</p>
                        <p className="text-sm font-medium text-gray-900">{avaliacao.data.body_fat_percentage}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!avaliacao.is_reevaluation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenReavaliacao(avaliacao.id)
                      }}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium whitespace-nowrap"
                      title="Criar reavaliação"
                    >
                      🔄 Reavaliar
                    </button>
                  )}
                  
                  {avaliacao.is_reevaluation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenComparacao(avaliacao.id)
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium whitespace-nowrap"
                      title="Ver comparação"
                    >
                      📊 Comparar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


