'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ChatIA from '../../../../components/ChatIA'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/hooks/useAuth'

export default function WellnessDashboard() {
  return (
    <ProtectedRoute perfil="wellness">
      <WellnessDashboardContent />
    </ProtectedRoute>
  )
}

function WellnessDashboardContent() {
  const { user, signOut } = useAuth()
  
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

  const [leadsRecentes, setLeadsRecentes] = useState<Array<{
    id: number
    nome: string
    email: string
    telefone: string
    ferramenta: string
    data: string
    status: string
  }>>([])

  const [carregandoDados, setCarregandoDados] = useState(true)

  // Carregar todos os dados do dashboard em uma única chamada (otimizado)
  useEffect(() => {
    const carregarDadosDashboard = async () => {
      if (!user) return
      
      try {
        setCarregandoPerfil(true)
        setCarregandoDados(true)
        
        // Uma única chamada API que retorna perfil + ferramentas + estatísticas
        const response = await fetch('/api/wellness/dashboard', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Atualizar perfil
          if (data.profile) {
            setPerfil({
              nome: data.profile.nome || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '',
              bio: data.profile.bio || ''
            })
          } else {
            // Fallback para dados do usuário logado
            setPerfil({
              nome: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
              bio: ''
            })
          }
          
          // Atualizar ferramentas (já formatadas no backend)
          if (data.ferramentas) {
            setFerramentasAtivas(data.ferramentas)
          }
          
          // Atualizar estatísticas (já calculadas no backend)
          if (data.stats) {
            setStats(data.stats)
          }
        } else {
          // Fallback para dados do usuário logado
          setPerfil({
            nome: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
            bio: ''
          })
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        // Fallback para dados do usuário logado
        setPerfil({
          nome: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          bio: ''
        })
        // Em caso de erro, manter valores padrão
        setStats({
          ferramentasAtivas: 0,
          leadsGerados: 0,
          conversoes: 0,
          clientesAtivos: 0
        })
      } finally {
        setCarregandoPerfil(false)
        setCarregandoDados(false)
      }
    }
    
    if (user) {
      carregarDadosDashboard()
    }
  }, [user])


  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar />
      
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
              ferramentasAtivas.map((ferramenta) => (
                <div key={ferramenta.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{ferramenta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{ferramenta.nome}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{ferramenta.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium text-gray-900">{ferramenta.leads} leads</p>
                    <p className="text-xs text-gray-600">{ferramenta.conversoes} conversões</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área de Cursos */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-green-900 mb-1 flex items-center">
                <span className="text-2xl sm:text-3xl mr-3">📚</span>
                Meus Cursos
              </h2>
              <p className="text-sm text-green-700">Continue aprendendo e desenvolva suas habilidades</p>
            </div>
            <Link 
              href="/pt/wellness/cursos"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base"
            >
              Ver Cursos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Nutrição Básica</h3>
                  <p className="text-xs text-gray-600 mt-1">Fundamentos de alimentação saudável</p>
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Em andamento
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 rounded-lg p-2 flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Bem-Estar Integral</h3>
                  <p className="text-xs text-gray-600 mt-1">Mindset e hábitos saudáveis</p>
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Concluído
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 rounded-lg p-2 flex-shrink-0">
                  <span className="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Transformação Total</h3>
                  <p className="text-xs text-gray-600 mt-1">Mudança de vida completa</p>
                  <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Não iniciado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat com IA */}
      <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} />
      
      {/* Botão Flutuante do Chat */}
      {!chatAberto && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setChatAberto(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-2xl">💬</span>
          </button>
        </div>
      )}
    </div>
  )
}
