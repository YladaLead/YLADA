'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import { useAuth } from '@/hooks/useAuth'
import ChatIA from '@/components/ChatIA'

export default function WellnessDashboard() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <WellnessDashboardContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function WellnessDashboardContent() {
  const { user, userProfile, signOut } = useAuth()
  const router = useRouter()
  
  const [perfil, setPerfil] = useState({
    nome: '',
    bio: ''
  })
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)

  const [stats, setStats] = useState({
    ferramentasAtivas: 0,
    leadsGerados: 0,
    conversoes: 0,
    clientesAtivos: 0
  })

  const [chatAberto, setChatAberto] = useState(false)

  const [ferramentasAtivas, setFerramentasAtivas] = useState<Array<{
    id: string
    nome: string
    categoria: string
    leads: number
    conversoes: number
    status: string
    icon: string
  }>>([])

  const [carregandoDados, setCarregandoDados] = useState(true)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState<string | null>(null)
  const [alterandoStatusId, setAlterandoStatusId] = useState<string | null>(null)

  // Carregar perfil do usuário
  useEffect(() => {
    const carregarPerfil = async () => {
      if (!user) return
      
      try {
        setCarregandoPerfil(true)
        const response = await fetch('/api/wellness/profile', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setPerfil({
              nome: data.profile.nome || userProfile?.nome_completo || user?.email?.split('@')[0] || 'Usuário',
              bio: data.profile.bio || ''
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        setPerfil({
          nome: userProfile?.nome_completo || user?.email?.split('@')[0] || 'Usuário',
          bio: ''
        })
      } finally {
        setCarregandoPerfil(false)
      }
    }

    carregarPerfil()
  }, [user, userProfile])

  // Carregar dados do dashboard
  useEffect(() => {
    const carregarDados = async () => {
      if (!user) return
      
      try {
        setCarregandoDados(true)
        
        // Carregar ferramentas
        const response = await fetch('/api/wellness/ferramentas', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          // A API retorna 'tools' ou 'ferramentas'
          const ferramentas = data.tools || data.ferramentas || []
          
          // IMPORTANTE: Mostrar TODAS as ferramentas, não apenas ativas
          setFerramentasAtivas(ferramentas.map((f: any) => {
            // Determinar categoria baseado no template_slug
            let categoria = 'Geral'
            if (f.template_slug?.startsWith('calc-')) {
              categoria = 'Calculadora'
            } else if (f.template_slug?.startsWith('quiz-')) {
              categoria = 'Quiz'
            } else if (f.template_slug?.startsWith('planilha-') || f.template_slug?.startsWith('template-')) {
              categoria = 'Planilha'
            }
            
            return {
              id: f.id,
              nome: f.title || f.nome, // API retorna 'title'
              categoria: categoria,
              leads: f.leads_count || f.views || 0,
              conversoes: 0, // TODO: calcular conversões
              status: f.status,
              icon: f.emoji || '🔗'
            }
          }))
          
          // Filtrar apenas ativas para estatísticas
          const ativas = ferramentas.filter((f: any) => 
            f.status === 'active' || f.status === 'ativa'
          )
          
          // Calcular estatísticas
          setStats({
            ferramentasAtivas: ativas.length,
            leadsGerados: ferramentas.reduce((acc: number, f: any) => acc + (f.views || 0), 0),
            conversoes: 0, // TODO: calcular conversões
            clientesAtivos: 0 // TODO: calcular clientes ativos
          })
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarDados()
  }, [user])

  // Alternar status de uma ferramenta
  const alternarStatus = async (ferramentaId: string, statusAtual: string) => {
    try {
      setAlterandoStatusId(ferramentaId)
      const novoStatus = statusAtual === 'active' || statusAtual === 'ativa' ? 'inactive' : 'active'
      
      const response = await fetch('/api/wellness/ferramentas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: ferramentaId,
          status: novoStatus
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar status')
      }

      // Atualizar estado local
      setFerramentasAtivas(prev => prev.map(f => 
        f.id === ferramentaId 
          ? { ...f, status: novoStatus }
          : f
      ))
      
      setMensagemSucesso(`Ferramenta ${novoStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`)
      setTimeout(() => setMensagemSucesso(null), 3000)
    } catch (error: any) {
      console.error('Erro ao alterar status:', error)
      setMensagemErro(error.message || 'Erro ao alterar status. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    } finally {
      setAlterandoStatusId(null)
    }
  }

  // Excluir ferramenta
  const excluirFerramenta = async (ferramentaId: string) => {
    try {
      setExcluindoId(ferramentaId)
      
      const response = await fetch(`/api/wellness/ferramentas?id=${ferramentaId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir ferramenta')
      }

      // Remover da lista local
      setFerramentasAtivas(prev => prev.filter(f => f.id !== ferramentaId))
      
      setMensagemSucesso('Ferramenta excluída com sucesso!')
      setTimeout(() => setMensagemSucesso(null), 3000)
      setMostrarConfirmacaoExclusao(null)
    } catch (error: any) {
      console.error('Erro ao excluir ferramenta:', error)
      setMensagemErro(error.message || 'Erro ao excluir ferramenta. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
      setMostrarConfirmacaoExclusao(null)
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar />
      
      {/* Mensagens de Sucesso/Erro */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
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
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
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
                  Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
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
                onClick={() => excluirFerramenta(mostrarConfirmacaoExclusao)}
                disabled={excluindoId !== null}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {excluindoId === mostrarConfirmacaoExclusao ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Info do Usuário */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            {carregandoPerfil ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
              </div>
            ) : (
              <>
                <p className="text-sm sm:text-base font-medium text-gray-700">{perfil.nome || 'Usuário'}</p>
                {perfil.bio && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-teal-100 text-teal-800 mt-1 sm:mt-0 w-fit">
                    {perfil.bio}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ações Rápidas - Otimizado Mobile First */}
        <div className="mb-6 sm:mb-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          {/* Cards de Acesso Rápido - Grid Responsivo */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Link 
              href="/pt/wellness/portals"
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-colors border border-emerald-200"
            >
              <span className="text-2xl sm:text-3xl mb-2">🌿</span>
              <h3 className="font-medium text-gray-900 text-xs sm:text-sm text-center">Portal do Bem-Estar</h3>
              <p className="text-xs text-gray-600 text-center hidden sm:block mt-1">Criar portal</p>
            </Link>
            
            <Link 
              href="/pt/wellness/templates"
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl sm:text-3xl mb-2">🎨</span>
              <h3 className="font-medium text-gray-900 text-xs sm:text-sm text-center">Ver Templates</h3>
              <p className="text-xs text-gray-600 text-center hidden sm:block mt-1">Explorar modelos</p>
            </Link>
            
            <Link 
              href="/pt/wellness/ferramentas"
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl sm:text-3xl mb-2">🔗</span>
              <h3 className="font-medium text-gray-900 text-xs sm:text-sm text-center">Meus Links</h3>
              <p className="text-xs text-gray-600 text-center hidden sm:block mt-1">Links criados</p>
            </Link>

            <Link 
              href="/pt/wellness/quiz-personalizado"
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl sm:text-3xl mb-2">🎯</span>
              <h3 className="font-medium text-gray-900 text-xs sm:text-sm text-center">Quiz</h3>
              <p className="text-xs text-gray-600 text-center hidden sm:block mt-1">Personalizado</p>
            </Link>
            
            <Link 
              href="/pt/wellness/cursos"
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <span className="text-2xl sm:text-3xl mb-2">📚</span>
              <h3 className="font-medium text-gray-900 text-xs sm:text-sm text-center">Cursos</h3>
              <p className="text-xs text-gray-600 text-center hidden sm:block mt-1">Educação</p>
            </Link>
          </div>
        </div>

        {/* Links Ativos - Expandido */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Links Ativos</h2>
            <Link 
              href="/pt/wellness/ferramentas" 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {carregandoDados ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 text-sm">Carregando ferramentas...</p>
              </div>
            ) : ferramentasAtivas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm mb-4">Você ainda não criou nenhuma ferramenta</p>
                <Link 
                  href="/pt/wellness/ferramentas/nova"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Criar Primeira Ferramenta
                </Link>
              </div>
            ) : (
              ferramentasAtivas.map((ferramenta) => {
                const isActive = ferramenta.status === 'active' || ferramenta.status === 'ativa'
                const isAlterandoStatus = alterandoStatusId === ferramenta.id
                const isExcluindo = excluindoId === ferramenta.id
                
                return (
                  <div 
                    key={ferramenta.id} 
                    className="group relative flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-green-200"
                  >
                    {/* Card clicável para editar */}
                    <Link 
                      href={`/pt/wellness/ferramentas/${ferramenta.id}/editar`}
                      className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">{ferramenta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{ferramenta.nome}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{ferramenta.categoria}</p>
                      </div>
                    </Link>
                    
                    {/* Estatísticas */}
                    <div className="text-right flex-shrink-0 ml-3 mr-3">
                      <p className="text-sm font-medium text-gray-900">{ferramenta.leads} leads</p>
                      <p className="text-xs text-gray-600">{ferramenta.conversoes} conversões</p>
                    </div>
                    
                    {/* Botões de Ação */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Toggle Ativo/Inativo */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          alternarStatus(ferramenta.id, ferramenta.status)
                        }}
                        disabled={isAlterandoStatus || isExcluindo}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          isActive ? 'bg-green-600' : 'bg-gray-300'
                        } ${isAlterandoStatus || isExcluindo ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isActive ? 'Desativar ferramenta' : 'Ativar ferramenta'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      
                      {/* Botão Excluir */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setMostrarConfirmacaoExclusao(ferramenta.id)
                        }}
                        disabled={isAlterandoStatus || isExcluindo}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Excluir ferramenta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* Chat IA */}
      <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} />
    </div>
  )
}
