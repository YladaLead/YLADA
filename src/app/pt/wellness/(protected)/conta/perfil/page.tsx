'use client'

import { useState, useEffect } from 'react'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import NoelOnboardingCompleto from '@/components/wellness/NoelOnboardingCompleto'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { WellnessConsultantProfile } from '@/types/wellness-system'

export default function ContaPerfilPage() {
  const { user } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [profile, setProfile] = useState<Partial<WellnessConsultantProfile>>({
    objetivo_principal: '',
    tempo_disponivel: undefined,
    meta_pv: undefined,
    meta_financeira: undefined,
  })

  const [profileType, setProfileType] = useState<'beverage_distributor' | 'product_distributor' | 'wellness_activator' | null>(null)
  const [showOnboardingEditor, setShowOnboardingEditor] = useState(true) // Sempre mostrar o editor completo por padrão

  // Carregar perfil ao montar
  useEffect(() => {
    loadProfile()
  }, [authenticatedFetch])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar perfil NOEL (já retorna profile_type) - usando authenticatedFetch
      const noelResponse = await authenticatedFetch('/api/wellness/noel/onboarding/check')
      const noelData = await noelResponse.json()

      if (noelData.profile) {
        setProfile(noelData.profile)
        // Sempre mostrar editor completo (mesmo formulário do onboarding inicial)
        setShowOnboardingEditor(true)
      }

      // O profile_type pode vir do endpoint de check ou de user_profiles
      if (noelData.profile_type) {
        setProfileType(noelData.profile_type)
      } else if (noelData.profile?.profile_type) {
        setProfileType(noelData.profile.profile_type)
      } else {
        // Fallback: buscar de user_profiles - usando authenticatedFetch
        const profileResponse = await authenticatedFetch('/api/wellness/profile')
        const profileData = await profileResponse.json()
        
        if (profileData.profile_type) {
          setProfileType(profileData.profile_type)
        }
      }

    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err)
      setError('Erro ao carregar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Proteção: evitar múltiplos salvamentos simultâneos
    if (saving) {
      console.warn('⚠️ Salvamento já em andamento, ignorando novo clique')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Preparar dados para salvar - apenas enviar campos que têm valor
      const dataToSave: any = {}

      // Campos obrigatórios (se existirem)
      if (profile.objetivo_principal) {
        dataToSave.objetivo_principal = profile.objetivo_principal
      }
      if (profile.tempo_disponivel) {
        dataToSave.tempo_disponivel = profile.tempo_disponivel
      }

      // Campos opcionais (apenas se tiverem valor)
      if (profile.meta_pv !== undefined && profile.meta_pv !== null && profile.meta_pv !== '') {
        dataToSave.meta_pv = profile.meta_pv
      }
      if (profile.meta_financeira !== undefined && profile.meta_financeira !== null && profile.meta_financeira !== '') {
        dataToSave.meta_financeira = profile.meta_financeira
      }
      if (profile.experiencia_herbalife) {
        dataToSave.experiencia_herbalife = profile.experiencia_herbalife
      }
      if (profile.canal_principal) {
        dataToSave.canal_principal = profile.canal_principal
      }
      if (profile.situacoes_particulares !== undefined && profile.situacoes_particulares !== null) {
        dataToSave.situacoes_particulares = profile.situacoes_particulares.trim()
      }
      
      // Novos campos estratégicos
      if (profile.tipo_trabalho) {
        dataToSave.tipo_trabalho = profile.tipo_trabalho
      }
      if (profile.foco_trabalho) {
        dataToSave.foco_trabalho = profile.foco_trabalho
      }
      if (profile.ganhos_prioritarios) {
        dataToSave.ganhos_prioritarios = profile.ganhos_prioritarios
      }
      if (profile.nivel_herbalife) {
        dataToSave.nivel_herbalife = profile.nivel_herbalife
      }
      if (profile.carga_horaria_diaria) {
        dataToSave.carga_horaria_diaria = profile.carga_horaria_diaria
      }
      if (profile.dias_por_semana) {
        dataToSave.dias_por_semana = profile.dias_por_semana
      }
      if (profile.meta_3_meses) {
        dataToSave.meta_3_meses = profile.meta_3_meses
      }
      if (profile.meta_1_ano) {
        dataToSave.meta_1_ano = profile.meta_1_ano
      }
      if (profile.observacoes_adicionais) {
        dataToSave.observacoes_adicionais = profile.observacoes_adicionais
      }
      
      if (profileType) {
        dataToSave.profile_type = profileType
      }

      console.log('💾 Salvando perfil com dados:', dataToSave)

      // Criar AbortController para timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout

      try {
        // Salvar perfil NOEL - usando authenticatedFetch
        const response = await authenticatedFetch('/api/wellness/noel/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const responseData = await response.json()

        if (!response.ok) {
          console.error('❌ Erro ao salvar perfil:', {
            status: response.status,
            error: responseData
          })
          
          // Mensagem de erro mais amigável
          let errorMessage = responseData.error || 'Erro ao salvar perfil'
          
          if (responseData.message) {
            errorMessage = responseData.message
          } else if (responseData.required) {
            errorMessage = `Por favor, preencha: ${responseData.required.join(', ')}`
          }
          
          throw new Error(errorMessage)
        }

        console.log('✅ Perfil salvo com sucesso:', responseData)

        // O profile_type já é salvo automaticamente pelo endpoint de onboarding

        setSuccess(true)
        
        // NÃO recarregar perfil imediatamente - pode causar loop
        // Apenas atualizar os dados locais se necessário
        if (responseData.profile) {
          setProfile(prev => ({ ...prev, ...responseData.profile }))
        }
        if (responseData.profile_type) {
          setProfileType(responseData.profile_type)
        }
        
        // Mostrar mensagem de sucesso por mais tempo
        setTimeout(() => setSuccess(false), 5000)

      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError') {
          throw new Error('O salvamento demorou muito. Verifique sua conexão e tente novamente.')
        }
        throw fetchError
      }

    } catch (err: any) {
      console.error('❌ Erro ao salvar perfil:', err)
      
      // Mensagem de erro mais detalhada
      let errorMessage = err.message || 'Erro ao salvar perfil. Tente novamente.'
      
      // Se for erro de rede, dar mensagem específica
      if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('AbortError')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
      }
      
      setError(errorMessage)
      
      // Esconder erro após 8 segundos
      setTimeout(() => setError(null), 8000)
    } finally {
      // SEMPRE garantir que setSaving(false) seja chamado
      setSaving(false)
    }
  }

  if (loading) {
    // Layout server-side já valida autenticação, perfil e assinatura
    return (
      <ConditionalWellnessSidebar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </ConditionalWellnessSidebar>
    )
  }

  return (
    <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Meu Perfil NOEL</h1>
                <p className="text-gray-600">Edite suas informações para personalizar as recomendações do NOEL</p>
              </div>

              {/* Mensagens de feedback */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="font-medium">Erro ao salvar</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <p className="font-medium">Perfil atualizado com sucesso!</p>
                </div>
              )}

              {/* EDITOR COMPLETO DE PERFIL ESTRATÉGICO - MESMO FORMULÁRIO DO ONBOARDING INICIAL */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">📋 Perfil Estratégico do Distribuidor</h2>
                  <p className="text-sm text-gray-600">
                    Edite suas informações para personalizar as recomendações do NOEL. Este é o mesmo formulário do onboarding inicial.
                  </p>
                </div>
                
                <NoelOnboardingCompleto
                  inline={true}
                  initialData={profile}
                  onComplete={async (data) => {
                    try {
                      setSaving(true)
                      setError(null)
                      setSuccess(false)
                      
                      // Usar authenticatedFetch para garantir token de autenticação
                      const response = await authenticatedFetch('/api/wellness/noel/onboarding', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                      })
                      
                      const responseData = await response.json()
                      
                      if (!response.ok) {
                        throw new Error(responseData.error || 'Erro ao salvar perfil')
                      }
                      
                      setProfile(data)
                      setSuccess(true)
                      setTimeout(() => setSuccess(false), 5000)
                      
                      // Recarregar perfil para garantir sincronização
                      await loadProfile()
                    } catch (err: any) {
                      setError(err.message || 'Erro ao salvar perfil')
                      setTimeout(() => setError(null), 8000)
                    } finally {
                      setSaving(false)
                    }
                  }}
                  // Não passar onClose para não mostrar botão de fechar (é a página de perfil)
                />
              </div>

            </div>
          </div>
    </ConditionalWellnessSidebar>
  )
}
