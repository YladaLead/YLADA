'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Trash2, User, AlertTriangle } from 'lucide-react'

interface Professional {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

interface AuthUser {
  id: string
  email: string
  created_at: string
  deleted_at: string | null
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([])
  const [orphans, setOrphans] = useState<Professional[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const searchUsers = async () => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setMessage('')
    
    try {
      // Buscar na tabela professionals
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      
      if (profError) throw profError
      
      setProfessionals(profData || [])
      
      // Buscar na tabela auth.users (limitado - só emails)
      const { data: authData, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, created_at, deleted_at')
        .ilike('email', `%${searchTerm}%`)
      
      if (authError) {
        console.warn('Não foi possível buscar auth.users:', authError)
        setAuthUsers([])
      } else {
        setAuthUsers(authData || [])
      }
      
      // Identificar órfãos
      const orphanProfessionals = (profData || []).filter(prof => 
        !authData?.some(auth => auth.email === prof.email)
      )
      setOrphans(orphanProfessionals)
      
      if (orphanProfessionals.length > 0) {
        setMessage(`⚠️ Encontrados ${orphanProfessionals.length} registros órfãos!`)
      } else {
        setMessage('✅ Nenhum registro órfão encontrado.')
      }
      
    } catch (error) {
      console.error('Erro na busca:', error)
      setMessage(`❌ Erro: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteOrphan = async (professionalId: string, professionalName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o registro órfão de "${professionalName}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', professionalId)

      if (error) throw error

      setMessage(`✅ Registro órfão de "${professionalName}" deletado com sucesso!`)
      
      // Recarregar dados
      await searchUsers()
      
    } catch (error) {
      console.error('Erro ao deletar:', error)
      setMessage(`❌ Erro ao deletar: ${(error as Error).message}`)
    }
  }

  const deleteAllOrphans = async () => {
    if (orphans.length === 0) return
    
    if (!confirm(`Tem certeza que deseja deletar TODOS os ${orphans.length} registros órfãos?`)) {
      return
    }

    try {
      for (const orphan of orphans) {
        const { error } = await supabase
          .from('professionals')
          .delete()
          .eq('id', orphan.id)

        if (error) throw error
      }

      setMessage(`✅ Todos os ${orphans.length} registros órfãos foram deletados!`)
      
      // Recarregar dados
      await searchUsers()
      
    } catch (error) {
      console.error('Erro ao deletar órfãos:', error)
      setMessage(`❌ Erro ao deletar órfãos: ${(error as Error).message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Gerenciamento de Usuários - Problema da Jessica
          </h1>
          
          {/* Busca */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome ou email da Jessica..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                />
              </div>
              <button
                onClick={searchUsers}
                disabled={loading || !searchTerm.trim()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Buscando...' : 'Buscar'}</span>
              </button>
            </div>
          </div>

          {/* Mensagem */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
              message.includes('⚠️') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Resultados */}
          {professionals.length > 0 && (
            <div className="space-y-6">
              {/* Registros Órfãos */}
              {orphans.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-red-800 flex items-center space-x-2">
                      <AlertTriangle className="w-6 h-6" />
                      <span>Registros Órfãos ({orphans.length})</span>
                    </h2>
                    <button
                      onClick={deleteAllOrphans}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Deletar Todos</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {orphans.map((orphan) => (
                      <div key={orphan.id} className="bg-white p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <User className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-medium text-gray-900">{orphan.name}</p>
                              <p className="text-sm text-gray-600">{orphan.email}</p>
                              <p className="text-sm text-gray-500">{orphan.phone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteOrphan(orphan.id, orphan.name)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Deletar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Todos os Registros */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Todos os Registros Encontrados ({professionals.length})</span>
                </h2>
                
                <div className="space-y-3">
                  {professionals.map((professional) => {
                    const isOrphan = orphans.some(o => o.id === professional.id)
                    const hasAuthUser = authUsers.some(a => a.email === professional.email)
                    
                    return (
                      <div key={professional.id} className={`p-4 rounded-lg border ${
                        isOrphan ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              isOrphan ? 'bg-red-500' : hasAuthUser ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{professional.name}</p>
                              <p className="text-sm text-gray-600">{professional.email}</p>
                              <p className="text-sm text-gray-500">{professional.phone}</p>
                              <p className="text-xs text-gray-400">
                                Criado: {new Date(professional.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isOrphan ? 'bg-red-100 text-red-800' : 
                              hasAuthUser ? 'bg-green-100 text-green-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {isOrphan ? 'ÓRFÃO' : hasAuthUser ? 'OK' : 'VERIFICAR'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Instruções:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li>Digite &quot;jessica&quot; ou o email da Jessica no campo de busca</li>
              <li>Clique em &quot;Buscar&quot; para encontrar registros</li>
              <li>Se aparecerem registros órfãos (vermelhos), delete-os</li>
              <li>Peça para a Jessica tentar se cadastrar novamente</li>
              <li>Se ainda não funcionar, ela pode usar um email ligeiramente diferente</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
