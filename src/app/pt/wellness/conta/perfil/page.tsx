'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useUser } from '@/hooks/useUser'
import { WellnessConsultantProfile } from '@/types/wellness-system'

export default function ContaPerfilPage() {
  const { user } = useUser()
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
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Preparar dados para salvar
      const dataToSave: any = {
        objetivo_principal: profile.objetivo_principal,
        tempo_disponivel: profile.tempo_disponivel,
        meta_pv: profile.meta_pv,
        meta_financeira: profile.meta_financeira,
        experiencia_herbalife: profile.experiencia_herbalife,
        canal_principal: profile.canal_principal,
        profile_type: profileType, // Incluir profile_type
      }

      // Salvar perfil NOEL
      const response = await fetch('/api/wellness/noel/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar perfil')
      }

      // O profile_type já é salvo automaticamente pelo endpoint de onboarding

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err)
      setError(err.message || 'Erro ao salvar perfil. Tente novamente.')
    } finally {
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
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ✅ Perfil atualizado com sucesso!
                </div>
              )}

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

                {/* BOTÃO SALVAR */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : '💾 Salvar Alterações'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
