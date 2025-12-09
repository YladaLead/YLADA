'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import NoelOnboardingCompleto from '@/components/wellness/NoelOnboardingCompleto'
import { useAuth } from '@/contexts/AuthContext'
import { WellnessConsultantProfile } from '@/types/wellness-system'

export default function ContaPerfilPage() {
  const { user } = useAuth()
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
  const [showOnboardingEditor, setShowOnboardingEditor] = useState(false)

  // Carregar perfil ao montar
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar perfil NOEL (já retorna profile_type)
      const noelResponse = await fetch('/api/wellness/noel/onboarding/check')
      const noelData = await noelResponse.json()

      if (noelData.profile) {
        setProfile(noelData.profile)
        // Se tiver perfil estratégico completo, mostrar editor completo
        if (noelData.profile.tipo_trabalho && noelData.profile.foco_trabalho) {
          setShowOnboardingEditor(true)
        }
      }

      // O profile_type pode vir do endpoint de check ou de user_profiles
      if (noelData.profile_type) {
        setProfileType(noelData.profile_type)
      } else if (noelData.profile?.profile_type) {
        setProfileType(noelData.profile.profile_type)
      } else {
        // Fallback: buscar de user_profiles
        const profileResponse = await fetch('/api/wellness/profile')
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
        // Salvar perfil NOEL
        const response = await fetch('/api/wellness/noel/onboarding', {
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
    return (
      <ProtectedRoute perfil="wellness" allowAdmin={true}>
        <RequireSubscription area="wellness">
          <ConditionalWellnessSidebar>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando perfil...</p>
              </div>
            </div>
          </ConditionalWellnessSidebar>
        </RequireSubscription>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
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

              {/* EDITOR COMPLETO DE PERFIL ESTRATÉGICO */}
              {showOnboardingEditor ? (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">📋 Perfil Estratégico Completo</h2>
                    <p className="text-sm text-gray-600">
                      Edite todas as informações do seu perfil estratégico. As metas serão recalculadas automaticamente.
                    </p>
                  </div>
                  
                  <NoelOnboardingCompleto
                    initialData={profile}
                    onComplete={async (data) => {
                      try {
                        setSaving(true)
                        setError(null)
                        setSuccess(false)
                        
                        const response = await fetch('/api/wellness/noel/onboarding', {
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
                      } catch (err: any) {
                        setError(err.message || 'Erro ao salvar perfil')
                        setTimeout(() => setError(null), 8000)
                      } finally {
                        setSaving(false)
                      }
                    }}
                    onClose={() => setShowOnboardingEditor(false)}
                  />
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowOnboardingEditor(false)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      ← Voltar para edição simplificada
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Perfil Estratégico Completo Disponível
                        </p>
                        <p className="text-xs text-blue-700 mb-3">
                          Você pode editar todos os campos estratégicos (tipo de trabalho, foco, ganhos, carga horária, etc.) para recalcular suas metas automaticamente.
                        </p>
                        <button
                          onClick={() => setShowOnboardingEditor(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Editar Perfil Estratégico Completo →
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!showOnboardingEditor && (
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm space-y-8">
                
                {/* PERFIL DO DISTRIBUIDOR */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Perfil do Distribuidor</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Como você trabalha? Isso ajuda o NOEL a personalizar as respostas.
                  </p>
                  <div className="space-y-2">
                    {[
                      { 
                        value: 'beverage_distributor', 
                        label: 'Bebidas Funcionais', 
                        icon: '🥤',
                        desc: 'Vende Energia, Acelera, Turbo Detox, kits R$39,90/49,90'
                      },
                      { 
                        value: 'product_distributor', 
                        label: 'Produtos Fechados', 
                        icon: '📦',
                        desc: 'Vende shake, chá, aloe ou produtos fechados'
                      },
                      { 
                        value: 'wellness_activator', 
                        label: 'Programa + Acompanhamento', 
                        icon: '🏋️',
                        desc: 'Vende programa completo, Portal Fit, transformação 30-60-90 dias'
                      }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setProfileType(option.value as any)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          profileType === option.value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* OBJETIVO PRINCIPAL */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivo Principal</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Qual é seu foco principal no Wellness?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'usar_recomendar', label: 'Usar e Recomendar', icon: '💚' },
                      { value: 'renda_extra', label: 'Renda Extra', icon: '💰' },
                      { value: 'carteira', label: 'Construir Carteira', icon: '👥' },
                      { value: 'plano_presidente', label: 'Plano Presidente', icon: '👑' },
                      { value: 'fechado', label: 'Produtos Fechados', icon: '📦' },
                      { value: 'funcional', label: 'Bebidas Funcionais', icon: '🥤' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setProfile(prev => ({ ...prev, objetivo_principal: option.value as any }))}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          profile.objetivo_principal === option.value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{option.icon}</span>
                          <span className="font-medium text-gray-900 text-sm">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TEMPO DISPONÍVEL (HORÁRIO DE TRABALHO) */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Tempo Disponível por Dia</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Quanto tempo você tem disponível para trabalhar no negócio?
                  </p>
                  <div className="space-y-2">
                    {[
                      { value: '5min', label: '5 minutos', icon: '⏱️' },
                      { value: '15min', label: '15 minutos', icon: '⏰' },
                      { value: '30min', label: '30 minutos', icon: '🕐' },
                      { value: '1h', label: '1 hora', icon: '🕑' },
                      { value: '1h_plus', label: 'Mais de 1 hora', icon: '🕒' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setProfile(prev => ({ ...prev, tempo_disponivel: option.value as any }))}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          profile.tempo_disponivel === option.value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{option.icon}</span>
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* METAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Meta PV */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Meta de PV Mensal</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Seu comprometimento com a meta de PV (100 - 50.000)
                    </p>
                    <input
                      type="number"
                      min="100"
                      max="50000"
                      value={profile.meta_pv || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        meta_pv: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 500"
                    />
                    {profile.meta_pv && (
                      <p className="text-xs text-gray-500 mt-2">
                        Meta atual: {profile.meta_pv.toLocaleString('pt-BR')} PV
                      </p>
                    )}
                  </div>

                  {/* Meta Financeira */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Meta Financeira Mensal</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Seu comprometimento com a meta financeira (R$ 500 - R$ 200.000)
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">R$</span>
                      <input
                        type="number"
                        min="500"
                        max="200000"
                        value={profile.meta_financeira || ''}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          meta_financeira: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: 2000"
                      />
                    </div>
                    {profile.meta_financeira && (
                      <p className="text-xs text-gray-500 mt-2">
                        Meta atual: R$ {profile.meta_financeira.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>

                {/* EXPERIÊNCIA E CANAL (Opcional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experiência Herbalife */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Experiência com Herbalife</h2>
                    <div className="space-y-2">
                      {[
                        { value: 'nenhuma', label: 'Nenhuma', icon: '🆕' },
                        { value: 'ja_vendi', label: 'Já vendi', icon: '✅' },
                        { value: 'supervisor', label: 'Supervisor', icon: '⭐' },
                        { value: 'get_plus', label: 'GET+', icon: '👑' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProfile(prev => ({ ...prev, experiencia_herbalife: option.value as any }))}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            profile.experiencia_herbalife === option.value
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{option.icon}</span>
                            <span className="font-medium text-gray-900">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Canal Principal */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Canal Principal</h2>
                    <div className="space-y-2">
                      {[
                        { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                        { value: 'instagram', label: 'Instagram', icon: '📸' },
                        { value: 'trafego_pago', label: 'Tráfego Pago', icon: '📊' },
                        { value: 'presencial', label: 'Presencial', icon: '🚶' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProfile(prev => ({ ...prev, canal_principal: option.value as any }))}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            profile.canal_principal === option.value
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{option.icon}</span>
                            <span className="font-medium text-gray-900">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SITUAÇÕES PARTICULARES */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Situações Particulares</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Descreva situações pessoais importantes que podem ajudar o NOEL a ser um melhor orientador para você.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>💡 O que descrever:</strong> Mudanças na sua vida (cidade, emprego, rotina), desafios pessoais que afetam o negócio, objetivos específicos, limitações de tempo ou recursos, situações familiares relevantes, ou qualquer contexto que ajude o NOEL a entender melhor sua realidade e oferecer orientações mais personalizadas.
                    </p>
                  </div>
                  <textarea
                    value={profile.situacoes_particulares || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 500) {
                        setProfile(prev => ({ ...prev, situacoes_particulares: value }))
                      }
                    }}
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Ex: Acabei de me mudar para uma nova cidade e estou começando do zero. Tenho disponibilidade apenas à noite após o trabalho..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Seja objetivo e descreva apenas o essencial
                    </p>
                    <p className="text-xs text-gray-500">
                      {(profile.situacoes_particulares || '').length}/500 caracteres
                    </p>
                  </div>
                </div>

                {/* BOTÃO SALVAR */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          <span>Salvar Alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Você pode salvar apenas os campos que desejar alterar
                  </p>
                </div>

              </div>
              )}
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
