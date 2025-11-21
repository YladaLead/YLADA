'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import dynamic from 'next/dynamic'
import QRCode from '@/components/QRCode'

const NutriNavBar = dynamic(() => import('@/components/nutri/NutriNavBar'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
})

interface Quiz {
  id: string
  titulo: string
  descricao: string | null
  emoji: string
  slug: string
  status: string
  views: number
  leads_count: number
  cores: {
    primaria: string
    secundaria: string
    texto: string
    fundo: string
  }
  created_at: string
  updated_at: string
  url: string
  totalRespostas: number
  taxaConversao: string
  short_code?: string | null
}

export default function QuizzesNutriPage() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireSubscription area="nutri">
        <QuizzesNutriContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function QuizzesNutriContent() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'active' | 'inactive' | 'draft'>('todos')
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    carregarQuizzes()
  }, [])

  const carregarQuizzes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/nutri/quizzes', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar quizzes')
      }

      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (error: any) {
      console.error('Erro ao carregar quizzes:', error)
      setMensagemErro('Erro ao carregar quizzes. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const excluirQuiz = async (quizId: string) => {
    try {
      setExcluindoId(quizId)
      
      const response = await fetch(`/api/quiz?quizId=${quizId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir quiz')
      }

      // Remover da lista local
      setQuizzes(prev => prev.filter(q => q.id !== quizId))
      setMensagemSucesso('Quiz excluído com sucesso!')
      setTimeout(() => setMensagemSucesso(null), 3000)
      setMostrarConfirmacaoExclusao(null)
    } catch (error: any) {
      console.error('Erro ao excluir quiz:', error)
      setMensagemErro(error.message || 'Erro ao excluir quiz. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
      setMostrarConfirmacaoExclusao(null)
    } finally {
      setExcluindoId(null)
    }
  }

  const alternarStatus = async (quizId: string, statusAtual: string) => {
    try {
      const novoStatus = statusAtual === 'active' ? 'inactive' : 'active'
      
      const response = await fetch('/api/quiz', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quizId,
          quizData: {
            status: novoStatus
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao alterar status')
      }

      // Atualizar estado local
      setQuizzes(prev => prev.map(q => 
        q.id === quizId 
          ? { ...q, status: novoStatus }
          : q
      ))
      
      setMensagemSucesso(`Quiz ${novoStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`)
      setTimeout(() => setMensagemSucesso(null), 3000)
    } catch (error: any) {
      console.error('Erro ao alterar status:', error)
      setMensagemErro(error.message || 'Erro ao alterar status. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    }
  }

  const quizzesFiltrados = filtroStatus === 'todos'
    ? quizzes
    : quizzes.filter(q => q.status === filtroStatus)

  const stats = {
    total: quizzes.length,
    ativos: quizzes.filter(q => q.status === 'active').length,
    inativos: quizzes.filter(q => q.status === 'inactive').length,
    rascunhos: quizzes.filter(q => q.status === 'draft').length,
    totalRespostas: quizzes.reduce((sum, q) => sum + q.totalRespostas, 0),
    totalViews: quizzes.reduce((sum, q) => sum + q.views, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NutriNavBar showTitle={true} title="Meus Quizzes" />
      
      {/* Mensagens de Sucesso/Erro */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-1">Sucesso!</h3>
              <p className="text-xs text-green-700">{mensagemSucesso}</p>
            </div>
            <button 
              onClick={() => setMensagemSucesso(null)}
              className="text-green-600 hover:text-green-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
              <p className="text-xs text-red-700">{mensagemErro}</p>
            </div>
            <button 
              onClick={() => setMensagemErro(null)}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarConfirmacaoExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <span className="text-red-600 text-4xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmacaoExclusao(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={excluindoId !== null}
              >
                Cancelar
              </button>
              <button
                onClick={() => excluirQuiz(mostrarConfirmacaoExclusao)}
                disabled={excluindoId !== null}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {excluindoId === mostrarConfirmacaoExclusao ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🎯 Meus Quizzes
            </h1>
            <p className="text-gray-600">
              Gerencie todos os seus quizzes personalizados
            </p>
          </div>
          <Link
            href="/pt/nutri/quiz-personalizado"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            + Criar Quiz
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Respostas</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalRespostas}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Visualizações</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStatus('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setFiltroStatus('inactive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'inactive'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Inativos
          </button>
          <button
            onClick={() => setFiltroStatus('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'draft'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
            }`}
          >
            Rascunhos
          </button>
        </div>

        {/* Lista de Quizzes */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando quizzes...</p>
          </div>
        ) : quizzesFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <span className="text-6xl mb-4 block">🎯</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum quiz encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroStatus === 'todos' 
                ? 'Crie seu primeiro quiz personalizado para começar.'
                : `Nenhum quiz ${filtroStatus === 'active' ? 'ativo' : filtroStatus === 'inactive' ? 'inativo' : 'rascunho'} encontrado.`}
            </p>
            <Link
              href="/pt/nutri/quiz-personalizado"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Criar Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzesFiltrados.map((quiz) => {
              const isActive = quiz.status === 'active'
              
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: quiz.cores?.primaria || '#3B82F6' }}
                        >
                          {quiz.emoji || '🎯'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{quiz.titulo}</h3>
                          <p className="text-sm text-gray-600">{quiz.descricao || 'Sem descrição'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-800'
                              : quiz.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {isActive ? 'Ativo' : quiz.status === 'draft' ? 'Rascunho' : 'Inativo'}
                        </span>
                        <button
                          onClick={() => alternarStatus(quiz.id, quiz.status)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                          title={isActive ? 'Desativar quiz' : 'Ativar quiz'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Visualizações</p>
                        <p className="text-xl font-bold text-gray-900">{quiz.views}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Respostas</p>
                        <p className="text-xl font-bold text-blue-600">{quiz.totalRespostas}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Taxa de Conversão</p>
                        <p className="text-xl font-bold text-purple-600">{quiz.taxaConversao}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">
                          Criado em: {new Date(quiz.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">URL:</span>
                          <span className="text-xs text-gray-700 font-mono break-all">{quiz.url}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(quiz.url)
                              alert('URL copiada!')
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            Copiar
                          </button>
                        </div>
                        {quiz.short_code && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">URL Encurtada:</span>
                              <span className="text-xs text-purple-600 font-mono break-all">
                                {typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/{quiz.short_code}
                              </span>
                              <button
                                onClick={() => {
                                  const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/${quiz.short_code}`
                                  navigator.clipboard.writeText(shortUrl)
                                  alert('URL encurtada copiada!')
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copiar
                              </button>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">QR Code:</p>
                              <QRCode 
                                url={`${typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/${quiz.short_code}`}
                                size={120}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 ml-4 text-right sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:text-left">
                        <Link
                          href={quiz.url}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver Quiz →
                        </Link>
                        <Link
                          href={`/pt/nutri/quiz-personalizado?quizId=${quiz.id}`}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setMostrarConfirmacaoExclusao(quiz.id)
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Excluir
                        </button>
                      </div>
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



