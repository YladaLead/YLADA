'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
// TODO: Reativar após migração completa
// import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
// import { useAuth } from '@/hooks/useAuth'

export default function WellnessDashboard() {
  // TODO: Reativar login após migração completa
  // return (
  //   <ProtectedRoute perfil="wellness">
  //     <WellnessDashboardContent />
  //   </ProtectedRoute>
  // )
  return <WellnessDashboardContent />
}

function WellnessDashboardContent() {
  // TODO: Reativar useAuth após migração
  // const { user, signOut } = useAuth()
  const user = null // Temporário durante migração
  
  const [perfil, setPerfil] = useState({
    nome: 'Usuário Teste', // Temporário durante migração
    bio: ''
  })
  const [carregandoPerfil, setCarregandoPerfil] = useState(false) // Não carregar durante migração

  const [stats, setStats] = useState({
    ferramentasAtivas: 0,
    leadsGerados: 0,
    conversoes: 0,
    clientesAtivos: 0
  })

  // TODO: Reativar chat após migração
  // const [chatAberto, setChatAberto] = useState(false)

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

  // TODO: Reativar carregamento de dados após migração
  // Carregar dados do dashboard (desabilitado durante migração)
  useEffect(() => {
    // Simular dados vazios durante migração
    setCarregandoDados(false)
    setStats({
      ferramentasAtivas: 0,
      leadsGerados: 0,
      conversoes: 0,
      clientesAtivos: 0
    })
  }, [])


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

      </div>

      {/* TODO: Reativar chat após migração */}
      {/* <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} /> */}
    </div>
  )
}
