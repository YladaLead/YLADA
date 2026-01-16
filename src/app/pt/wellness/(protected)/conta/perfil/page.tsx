'use client'

import { useState, useEffect } from 'react'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import NoelOnboardingCompleto from '@/components/wellness/NoelOnboardingCompleto'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { WellnessConsultantProfile } from '@/types/wellness-system'

interface MetasConstrucao {
  id?: string
  meta_pv_equipe: number
  pv_equipe_atual: number
  meta_recrutamento: number
  recrutamento_atual: number
  meta_royalties: number
  royalties_atual: number
  nivel_carreira_alvo: string
  prazo_meses: number
}

interface MetasPV {
  meta_pv: number
  pv_total: number
  mes_ano: string
}

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

  // Estados para Metas (unificadas com Perfil)
  const [metasPV, setMetasPV] = useState<MetasPV>({
    meta_pv: 0,
    pv_total: 0,
    mes_ano: new Date().toISOString().slice(0, 7)
  })

  const [metasConstrucao, setMetasConstrucao] = useState<MetasConstrucao>({
    meta_pv_equipe: 0,
    pv_equipe_atual: 0,
    meta_recrutamento: 0,
    recrutamento_atual: 0,
    meta_royalties: 0,
    royalties_atual: 0,
    nivel_carreira_alvo: 'consultor_ativo',
    prazo_meses: 12
  })

  const [savingMetas, setSavingMetas] = useState(false)

  // Carregar perfil e metas ao montar
  useEffect(() => {
    loadProfile()
    loadMetas()
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

  // Carregar metas
  const loadMetas = async () => {
    try {
      // Buscar meta PV mensal
      const pvResponse = await authenticatedFetch('/api/wellness/pv/mensal')
      if (pvResponse.ok) {
        const pvData = await pvResponse.json()
        if (pvData.pv_mensal) {
          setMetasPV({
            meta_pv: pvData.pv_mensal.meta_pv || 0,
            pv_total: pvData.pv_mensal.pv_total || 0,
            mes_ano: pvData.pv_mensal.mes_ano || new Date().toISOString().slice(0, 7)
          })
        }
      }

      // Buscar metas de construção
      const construcaoResponse = await authenticatedFetch('/api/wellness/metas-construcao')
      if (construcaoResponse.ok) {
        const construcaoData = await construcaoResponse.json()
        if (construcaoData.metas) {
          setMetasConstrucao(construcaoData.metas)
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar metas:', err)
      // Não mostrar erro aqui para não poluir a interface
    }
  }

  // Salvar metas
  const handleSaveMetas = async () => {
    try {
      setSavingMetas(true)
      setError(null)
      setSuccess(false)

      // Salvar meta PV mensal
      if (metasPV.meta_pv > 0) {
        const pvResponse = await authenticatedFetch('/api/wellness/pv/mensal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mes_ano: metasPV.mes_ano,
            meta_pv: metasPV.meta_pv
          })
        })

        if (!pvResponse.ok) {
          throw new Error('Erro ao salvar meta de PV')
        }
      }

      // Salvar metas de construção
      const construcaoResponse = await authenticatedFetch('/api/wellness/metas-construcao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta_pv_equipe: metasConstrucao.meta_pv_equipe,
          meta_recrutamento: metasConstrucao.meta_recrutamento,
          meta_royalties: metasConstrucao.meta_royalties,
          nivel_carreira_alvo: metasConstrucao.nivel_carreira_alvo,
          prazo_meses: metasConstrucao.prazo_meses
        })
      })

      if (!construcaoResponse.ok) {
        throw new Error('Erro ao salvar metas de construção')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Erro ao salvar metas:', err)
      setError(err.message || 'Erro ao salvar metas. Tente novamente.')
      setTimeout(() => setError(null), 8000)
    } finally {
      setSavingMetas(false)
    }
  }

  const calcularProgresso = (atual: number, meta: number): number => {
    if (meta === 0) return 0
    return Math.min(100, Math.round((atual / meta) * 100))
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Meu Perfil e Metas</h1>
                <p className="text-gray-600">
                  Edite suas informações e metas para personalizar as recomendações do NOEL. 
                  O NOEL usa seu perfil como base de referência para te orientar e te ajudar a bater seus objetivos.
                </p>
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
                  hideNavigation={true}
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

              {/* SEÇÃO DE METAS - UNIFICADA COM PERFIL */}
              <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">🎯 Minhas Metas</h2>
                  <p className="text-sm text-gray-600">
                    Defina suas metas para que o NOEL possa te orientar e te ajudar a alcançá-las. 
                    O NOEL usa essas informações para te estimular e te dar direcionamentos personalizados.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* META DE PV PESSOAL */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Meta de PV Mensal (Pessoal)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta de PV Mensal
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="50000"
                          value={metasPV.meta_pv || ''}
                          onChange={(e) => setMetasPV(prev => ({ 
                            ...prev, 
                            meta_pv: e.target.value ? parseInt(e.target.value) : 0 
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: 500"
                        />
                      </div>
                      {metasPV.pv_total > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progresso do Mês</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {calcularProgresso(metasPV.pv_total, metasPV.meta_pv)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${calcularProgresso(metasPV.pv_total, metasPV.meta_pv)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {metasPV.pv_total.toLocaleString('pt-BR')} PV de {metasPV.meta_pv.toLocaleString('pt-BR')} PV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* META DE PV DE EQUIPE */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Meta de PV de Equipe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta de PV de Equipe
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="500000"
                          value={metasConstrucao.meta_pv_equipe || ''}
                          onChange={(e) => setMetasConstrucao(prev => ({ 
                            ...prev, 
                            meta_pv_equipe: e.target.value ? parseFloat(e.target.value) : 0 
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: 2000"
                        />
                      </div>
                      {metasConstrucao.pv_equipe_atual > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">PV de Equipe Atual</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {calcularProgresso(metasConstrucao.pv_equipe_atual, metasConstrucao.meta_pv_equipe)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${calcularProgresso(metasConstrucao.pv_equipe_atual, metasConstrucao.meta_pv_equipe)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {metasConstrucao.pv_equipe_atual.toLocaleString('pt-BR')} PV de {metasConstrucao.meta_pv_equipe.toLocaleString('pt-BR')} PV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* META DE RECRUTAMENTO */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Meta de Recrutamento</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta de Pessoas a Recrutar
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={metasConstrucao.meta_recrutamento || ''}
                          onChange={(e) => setMetasConstrucao(prev => ({ 
                            ...prev, 
                            meta_recrutamento: e.target.value ? parseInt(e.target.value) : 0 
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: 5"
                        />
                      </div>
                      {metasConstrucao.recrutamento_atual > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Pessoas Recrutadas</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {calcularProgresso(metasConstrucao.recrutamento_atual, metasConstrucao.meta_recrutamento)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${calcularProgresso(metasConstrucao.recrutamento_atual, metasConstrucao.meta_recrutamento)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {metasConstrucao.recrutamento_atual} de {metasConstrucao.meta_recrutamento} pessoas
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* META DE ROYALTIES */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👑 Meta de Royalties</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta de Royalties (R$)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">R$</span>
                          <input
                            type="number"
                            min="100"
                            max="50000"
                            step="50"
                            value={metasConstrucao.meta_royalties || ''}
                            onChange={(e) => setMetasConstrucao(prev => ({ 
                              ...prev, 
                              meta_royalties: e.target.value ? parseFloat(e.target.value) : 0 
                            }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: 300"
                          />
                        </div>
                      </div>
                      {metasConstrucao.royalties_atual > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Royalties Atuais</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {calcularProgresso(metasConstrucao.royalties_atual, metasConstrucao.meta_royalties)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-600 h-2 rounded-full transition-all"
                              style={{ width: `${calcularProgresso(metasConstrucao.royalties_atual, metasConstrucao.meta_royalties)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            R$ {metasConstrucao.royalties_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {metasConstrucao.meta_royalties.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NÍVEL DE CARREIRA ALVO */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Nível de Carreira Alvo</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'consultor_ativo', label: 'Consultor Ativo', desc: '250-500 PV mensais' },
                        { value: 'consultor_1000pv', label: 'Consultor 1000 PV', desc: '1000 PV pessoais' },
                        { value: 'equipe_mundial', label: 'Equipe Mundial', desc: '2500 PV por 4 meses' },
                        { value: 'get', label: 'GET', desc: '16.000 PV de equipe (~R$ 1.000 royalties)' },
                        { value: 'milionario', label: 'Milionário', desc: '64.000 PV de equipe (~R$ 4.000 royalties)' },
                        { value: 'presidente', label: 'Presidente', desc: '160.000 PV de equipe (~R$ 10.000 royalties)' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setMetasConstrucao(prev => ({ ...prev, nivel_carreira_alvo: option.value }))}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            metasConstrucao.nivel_carreira_alvo === option.value
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRAZO */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Prazo para Atingir Metas</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prazo (em meses)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={metasConstrucao.prazo_meses || 12}
                        onChange={(e) => setMetasConstrucao(prev => ({ 
                          ...prev, 
                          prazo_meses: e.target.value ? parseInt(e.target.value) : 12 
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: 12"
                      />
                    </div>
                  </div>

                  {/* BOTÃO SALVAR METAS */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveMetas}
                      disabled={savingMetas}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingMetas ? 'Salvando...' : '💾 Salvar Todas as Metas'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
    </ConditionalWellnessSidebar>
  )
}
