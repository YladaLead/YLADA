'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

export default function FormulariosNutri() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <FormulariosNutriContent />
    </ProtectedRoute>
  )
}

function FormulariosNutriContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formularios, setFormularios] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoTemplates, setCarregandoTemplates] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [mostrarTemplates, setMostrarTemplates] = useState(true)

  useEffect(() => {
    if (!user) return

    const carregarFormularios = async () => {
      try {
        setCarregando(true)
        const params = new URLSearchParams()
        if (filtroTipo !== 'todos') {
          params.append('form_type', filtroTipo)
        }
        // Removendo filtro de is_active temporariamente para ver todos os formulários
        // params.append('is_active', 'true')

        const response = await fetch(`/api/nutri/formularios?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar formulários')
        }

        const data = await response.json()
        console.log('📦 Resposta completa da API:', data)
        
        if (data.success) {
          const formsArray = data.data?.forms || []
          console.log('✅ Formulários carregados:', {
            total: data.data?.total || 0,
            formsCount: formsArray.length,
            forms: formsArray,
            debug: data.debug // Informações de debug se disponível
          })
          
          if (formsArray.length === 0) {
            console.warn('⚠️ Nenhum formulário encontrado. Verifique se o user_id corresponde.')
          }
          
          setFormularios(formsArray)
        } else {
          console.error('❌ Erro na resposta:', data)
          setErro(data.error || 'Erro ao carregar formulários')
        }
      } catch (error: any) {
        console.error('Erro ao carregar formulários:', error)
        setErro(error.message || 'Erro ao carregar formulários')
      } finally {
        setCarregando(false)
      }
    }

    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/nutri/formularios?is_template=true', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setTemplates(data.data?.forms || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar templates:', error)
      } finally {
        setCarregandoTemplates(false)
      }
    }

    carregarFormularios()
    carregarTemplates()
  }, [user, filtroTipo])

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      questionario: 'Questionário',
      anamnese: 'Anamnese',
      avaliacao: 'Avaliação',
      consentimento: 'Consentimento',
      outro: 'Outro'
    }
    return labels[tipo] || tipo
  }

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      questionario: 'bg-blue-100 text-blue-800',
      anamnese: 'bg-green-100 text-green-800',
      avaliacao: 'bg-purple-100 text-purple-800',
      consentimento: 'bg-yellow-100 text-yellow-800',
      outro: 'bg-gray-100 text-gray-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Formulários</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Formulários Personalizados</h1>
              <p className="text-gray-600 mt-1">Crie e gerencie seus formulários de anamnese e avaliação</p>
            </div>
            <Link
              href="/pt/nutri/formularios/novo"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>➕</span>
              Criar Formulário
            </Link>
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <label htmlFor="filtro-tipo" className="text-sm font-medium text-gray-700">
                Tipo:
              </label>
              <select
                id="filtro-tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="questionario">Questionário</option>
                <option value="anamnese">Anamnese</option>
                <option value="avaliacao">Avaliação</option>
                <option value="consentimento">Consentimento</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Seção de Formulários Pré-montados */}
          {mostrarTemplates && templates.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">📋 Formulários Pré-montados</h2>
                  <p className="text-sm text-gray-600 mt-1">Formulários prontos para usar. Clique para editar e personalizar</p>
                </div>
                <button
                  onClick={() => setMostrarTemplates(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Ocultar
                </button>
              </div>
              
              {carregandoTemplates ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => router.push(`/pt/nutri/formularios/novo?template=${template.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Pronto</span>
                      </div>
                      {template.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{template.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                        <span className="px-2 py-1 bg-white rounded">{getTipoLabel(template.form_type)}</span>
                        <span>{template.structure?.fields?.length || 0} campos</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/pt/nutri/formularios/novo?template=${template.id}`)
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Usar este formulário
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!mostrarTemplates && templates.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setMostrarTemplates(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mostrar formulários pré-montados ({templates.length})
              </button>
            </div>
          )}

          {/* Lista de Formulários do Usuário */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Meus Formulários</h2>
            <p className="text-sm text-gray-600 mt-1">Formulários que você criou</p>
          </div>

          {formularios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formularios.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.name}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(form.form_type)}`}>
                        {getTipoLabel(form.form_type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    {form.structure?.fields?.length || 0} {form.structure?.fields?.length === 1 ? 'campo' : 'campos'}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/pt/nutri/formularios/${form.id}`)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => router.push(`/pt/nutri/formularios/${form.id}/respostas`)}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Respostas
                    </button>
                    <button
                      onClick={() => router.push(`/pt/nutri/formularios/${form.id}/enviar`)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum formulário encontrado</h3>
              <p className="text-gray-600 mb-6">
                {filtroTipo !== 'todos'
                  ? 'Tente ajustar os filtros'
                  : 'Comece criando seu primeiro formulário personalizado'}
              </p>
              <Link
                href="/pt/nutri/formularios/novo"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>➕</span>
                Criar Primeiro Formulário
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

