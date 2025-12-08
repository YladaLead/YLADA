'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuth } from '@/contexts/AuthContext'

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

export default function ContaMetasPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  // Carregar metas
  useEffect(() => {
    loadMetas()
  }, [])

  const loadMetas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar meta PV mensal
      const pvResponse = await fetch('/api/wellness/pv/mensal')
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
      const construcaoResponse = await fetch('/api/wellness/metas-construcao')
      if (construcaoResponse.ok) {
        const construcaoData = await construcaoResponse.json()
        if (construcaoData.metas) {
          setMetasConstrucao(construcaoData.metas)
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar metas:', err)
      setError('Erro ao carregar metas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Salvar meta PV mensal
      if (metasPV.meta_pv > 0) {
        const pvResponse = await fetch('/api/wellness/pv/mensal', {
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
      const construcaoResponse = await fetch('/api/wellness/metas-construcao', {
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
    } finally {
      setSaving(false)
    }
  }

  const calcularProgresso = (atual: number, meta: number): number => {
    if (meta === 0) return 0
    return Math.min(100, Math.round((atual / meta) * 100))
  }

  if (loading) {
    return (
      <ProtectedRoute perfil="wellness" allowAdmin={true}>
        <RequireSubscription area="wellness">
          <ConditionalWellnessSidebar>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando metas...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Minhas Metas</h1>
                <p className="text-gray-600">Acompanhe e ajuste suas metas de crescimento</p>
              </div>

              {/* Mensagens de feedback */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ✅ Metas atualizadas com sucesso!
                </div>
              )}

              <div className="space-y-6">
                
                {/* META DE PV PESSOAL */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Meta de PV Mensal (Pessoal)</h2>
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
                      <div className="bg-gray-50 rounded-lg p-4">
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

                {/* META DE PV DE EQUIPE (CONSTRUÇÃO DE NEGÓCIO) */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">👥 Meta de PV de Equipe (Construção de Negócio)</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    PV total gerado pela sua equipe
                  </p>
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
                      <div className="bg-gray-50 rounded-lg p-4">
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
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Meta de Recrutamento</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Número de pessoas que você quer recrutar para sua equipe
                  </p>
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
                      <div className="bg-gray-50 rounded-lg p-4">
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
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">👑 Meta de Royalties</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Royalties que você quer construir. Você pode começar desde o início! Mesmo como Consultor Ativo ou Equipe Mundial, você já está construindo royalties para virar Supervisor e depois GET.
                  </p>
                  <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg">
                    💡 <strong>Dica:</strong> Para virar Supervisor e depois GET, você precisa construir royalties desde o início. Mesmo com Equipe Mundial, você já está construindo royalties!
                  </p>
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
                          placeholder="Ex: 300 (inicial) ou 1000 (GET)"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Valores sugeridos: R$ 150-300 (inicial), R$ 500-800 (Equipe Mundial), R$ 1.000+ (GET)
                      </p>
                    </div>
                    {metasConstrucao.royalties_atual > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
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
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Nível de Carreira Alvo</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Qual nível de carreira você quer atingir?
                  </p>
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
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRAZO */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">⏱️ Prazo para Atingir Metas</h2>
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
                    <p className="text-xs text-gray-500 mt-2">
                      Em quantos meses você quer atingir essas metas?
                    </p>
                  </div>
                </div>

                {/* BOTÃO SALVAR */}
                <div className="pt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : '💾 Salvar Todas as Metas'}
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
