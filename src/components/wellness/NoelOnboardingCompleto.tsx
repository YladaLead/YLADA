'use client'

import { useState } from 'react'
import type { WellnessConsultantProfile } from '@/types/wellness-system'

interface NoelOnboardingCompletoProps {
  onComplete: (data: Partial<WellnessConsultantProfile>) => void
  initialData?: Partial<WellnessConsultantProfile>
  onClose?: () => void
  inline?: boolean // Se true, renderiza inline sem modal
}

export default function NoelOnboardingCompleto({ 
  onComplete, 
  initialData,
  onClose,
  inline = false
}: NoelOnboardingCompletoProps) {
  const [section, setSection] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [data, setData] = useState<Partial<WellnessConsultantProfile>>({
    // Novos campos estratégicos
    tipo_trabalho: initialData?.tipo_trabalho,
    foco_trabalho: initialData?.foco_trabalho,
    ganhos_prioritarios: initialData?.ganhos_prioritarios,
    nivel_herbalife: initialData?.nivel_herbalife,
    carga_horaria_diaria: initialData?.carga_horaria_diaria,
    dias_por_semana: initialData?.dias_por_semana,
    meta_financeira: initialData?.meta_financeira,
    meta_3_meses: initialData?.meta_3_meses,
    meta_1_ano: initialData?.meta_1_ano,
    observacoes_adicionais: initialData?.observacoes_adicionais,
    
    // Campos antigos (compatibilidade)
    cidade: initialData?.cidade || '',
    idade: initialData?.idade,
  })

  const totalSections = 3

  const handleNext = async () => {
    if (!validateSection(section)) {
      return
    }

    if (section < totalSections) {
      setSection(section + 1)
      setError(null)
    } else {
      await handleSave()
    }
  }

  const handleBack = () => {
    if (section > 1) {
      setSection(section - 1)
      setError(null)
    }
  }

  const validateSection = (sec: number): boolean => {
    switch (sec) {
      case 1: // Perguntas 1-4 (OBRIGATÓRIAS)
        if (!data.tipo_trabalho || !data.foco_trabalho || !data.ganhos_prioritarios || !data.nivel_herbalife) {
          setError('Por favor, responda todas as perguntas obrigatórias da seção 1.')
          return false
        }
        break
      case 2: // Perguntas 5-7 (OBRIGATÓRIAS)
        if (!data.carga_horaria_diaria || !data.dias_por_semana || !data.meta_financeira) {
          setError('Por favor, responda todas as perguntas obrigatórias da seção 2.')
          return false
        }
        break
      case 3: // Perguntas 8-9 (opcionais mas recomendadas)
        // Metas temporais são opcionais, mas recomendadas
        break
    }
    return true
  }

  const handleSave = async () => {
    if (saving) {
      console.warn('⚠️ Salvamento já em andamento')
      return
    }

    setSaving(true)
    setError(null)
    
    try {
      console.log('💾 Dados que serão salvos:', JSON.stringify(data, null, 2))
      
      // Validar campos obrigatórios antes de salvar
      if (!data.tipo_trabalho || !data.foco_trabalho || !data.ganhos_prioritarios || !data.nivel_herbalife || !data.carga_horaria_diaria || !data.dias_por_semana || !data.meta_financeira) {
        setError('Por favor, preencha todos os campos obrigatórios (seções 1 e 2).')
        setSection(1) // Voltar para primeira seção
        return
      }
      
      await onComplete(data)
      console.log('✅ Perfil salvo com sucesso')
      
      if (onClose) {
        setTimeout(() => {
          onClose()
        }, 500)
      }
    } catch (err: any) {
      console.error('❌ Erro ao salvar:', err)
      setError(err.message || 'Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const content = (
    <div className={inline ? 'w-full' : 'bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative'}>
      {onClose && !inline && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Fechar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className={inline ? 'space-y-6' : 'p-8'}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Perfil Estratégico do Distribuidor
            </h2>
            <p className="text-gray-600">
              Configure seu perfil para o NOEL personalizar sua experiência
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s <= section ? 'bg-green-600 w-8' : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {section === 1 && 'Perguntas Essenciais (1-4)'}
              {section === 2 && 'Tempo e Metas (5-7)'}
              {section === 3 && 'Metas Temporais (8-9)'}
            </div>
          </div>

          {/* SEÇÃO 1: PERGUNTAS 1-4 */}
          {section === 1 && (
            <div className="space-y-6">
              {/* Pergunta 1: Como pretende trabalhar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  1️⃣ Como você pretende trabalhar? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Define o fluxo principal que o NOEL vai ativar
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'bebidas_funcionais', label: 'Servindo bebidas funcionais', icon: '🥤', desc: 'Trabalho local/presencial, alta conversão rápida' },
                    { value: 'produtos_fechados', label: 'Vendendo produtos fechados', icon: '📦', desc: 'Foco em valor maior por venda, menos volume' },
                    { value: 'cliente_que_indica', label: 'Cliente que indica', icon: '👥', desc: 'Cliente afiliado que recomenda e ganha' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, tipo_trabalho: option.value as any }))}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        data.tipo_trabalho === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                        {data.tipo_trabalho === option.value && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pergunta 2: Foco de trabalho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  2️⃣ Qual é o seu foco de trabalho? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Pode escolher um ou os dois
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'renda_extra', label: 'Renda extra', icon: '💰', desc: 'Metas mais simples, sem pressão' },
                    { value: 'plano_carreira', label: 'Plano de carreira Herbalife', icon: '👑', desc: 'Alta ambição, estrutura pesada' },
                    { value: 'ambos', label: 'Os dois', icon: '🚀', desc: 'Resultado rápido + crescimento futuro' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, foco_trabalho: option.value as any }))}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        data.foco_trabalho === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                        {data.foco_trabalho === option.value && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pergunta 3: Ganhos prioritários */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  3️⃣ Quais ganhos você quer priorizar? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Também pode ser um ou ambos
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'vendas', label: 'Ganhos com vendas', icon: '💵', desc: 'Metas de kits, bebidas e produtos' },
                    { value: 'equipe', label: 'Ganhos em comissões de equipe', icon: '👥', desc: 'Royalties/desenvolvimento, duplicação' },
                    { value: 'ambos', label: 'Os dois', icon: '🎯', desc: 'Modelo híbrido, 50% vendas / 50% equipe' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, ganhos_prioritarios: option.value as any }))}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        data.ganhos_prioritarios === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                        {data.ganhos_prioritarios === option.value && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pergunta 4: Nível Herbalife */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  4️⃣ Qual é o seu nível atual na Herbalife? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Hierarquia oficial Herbalife
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'novo_distribuidor', label: 'Novo Distribuidor', icon: '🆕' },
                    { value: 'supervisor', label: 'Supervisor', icon: '⭐' },
                    { value: 'equipe_mundial', label: 'Equipe Mundial', icon: '🌍' },
                    { value: 'equipe_expansao_global', label: 'Equipe de Expansão Global (GET)', icon: '🚀' },
                    { value: 'equipe_milionarios', label: 'Equipe de Milionários', icon: '💎' },
                    { value: 'equipe_presidentes', label: 'Equipe de Presidentes', icon: '👑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, nivel_herbalife: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.nivel_herbalife === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.nivel_herbalife === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 2: PERGUNTAS 5-7 */}
          {section === 2 && (
            <div className="space-y-6">
              {/* Pergunta 5: Carga horária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  5️⃣ Qual sua carga horária de dedicação diária? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  O NOEL usa isso para estruturar rotinas e adequar metas realistas
                </p>
                <div className="space-y-2">
                  {[
                    { value: '1_hora', label: '1 hora por dia', icon: '⏰' },
                    { value: '1_a_2_horas', label: '1 a 2 horas por dia', icon: '⏱️' },
                    { value: '2_a_4_horas', label: '2 a 4 horas por dia', icon: '🕐' },
                    { value: 'mais_4_horas', label: 'Mais de 4 horas por dia', icon: '🕑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, carga_horaria_diaria: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.carga_horaria_diaria === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.carga_horaria_diaria === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pergunta 6: Dias por semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  6️⃣ Quantos dias por semana você consegue trabalhar? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Determina volume semanal, cadência de vendas e convites
                </p>
                <div className="space-y-2">
                  {[
                    { value: '1_a_2_dias', label: '1–2 dias por semana', icon: '📅' },
                    { value: '3_a_4_dias', label: '3–4 dias por semana', icon: '📆' },
                    { value: '5_a_6_dias', label: '5–6 dias por semana', icon: '🗓️' },
                    { value: 'todos_dias', label: 'Todos os dias', icon: '🔥' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, dias_por_semana: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.dias_por_semana === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.dias_por_semana === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pergunta 7: Meta financeira mensal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  7️⃣ Quanto você quer ganhar por mês? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Fundamental para cálculo automático de metas
                </p>
                <div className="space-y-2">
                  {[
                    { value: 500, label: 'Até R$ 500/mês', icon: '💵' },
                    { value: 1500, label: 'R$ 500 a R$ 1.500/mês', icon: '💰' },
                    { value: 3000, label: 'R$ 1.500 a R$ 3.000/mês', icon: '💸' },
                    { value: 7000, label: 'R$ 3.000 a R$ 7.000/mês', icon: '💳' },
                    { value: 15000, label: 'R$ 7.000 a R$ 15.000/mês', icon: '🏆' },
                    { value: 20000, label: 'Mais de R$ 15.000/mês', icon: '👑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, meta_financeira: option.value }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.meta_financeira === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.meta_financeira === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ou especifique outro valor:
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={data.meta_financeira && ![500, 1500, 3000, 7000, 15000, 20000].includes(data.meta_financeira) ? data.meta_financeira : ''}
                    onChange={(e) => setData(prev => ({ ...prev, meta_financeira: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 2500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 3: PERGUNTAS 8-9 */}
          {section === 3 && (
            <div className="space-y-6">
              {/* Pergunta 8: Meta 3 meses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  8️⃣ Qual sua meta para os próximos 3 meses?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Plano tático imediato (opcional mas recomendado)
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    { value: 'ganhar_vendas', label: 'Ganhar X em vendas', icon: '💵' },
                    { value: 'montar_equipe', label: 'Montar uma equipe de X pessoas', icon: '👥' },
                    { value: 'subir_supervisor', label: 'Subir para Supervisor', icon: '⭐' },
                    { value: 'subir_mundial', label: 'Subir para Equipe Mundial', icon: '🌍' },
                    { value: 'estabelecer_rotina', label: 'Estabelecer rotina diária e duplicável', icon: '🔄' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, meta_3_meses: option.value }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.meta_3_meses === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.meta_3_meses === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <textarea
                  value={data.meta_3_meses && !['ganhar_vendas', 'montar_equipe', 'subir_supervisor', 'subir_mundial', 'estabelecer_rotina'].includes(data.meta_3_meses) ? data.meta_3_meses : ''}
                  onChange={(e) => setData(prev => ({ ...prev, meta_3_meses: e.target.value }))}
                  placeholder="Ou escreva sua meta personalizada..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Pergunta 9: Meta 1 ano */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  9️⃣ Qual sua meta para 1 ano?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Plano estratégico — ligado ao Plano Presidente (opcional mas recomendado)
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    { value: 'viver_negocio', label: 'Viver do negócio Herbalife', icon: '🏠' },
                    { value: 'subir_nivel', label: 'Subir para Supervisor / Mundial / GET / Milionários / Presidentes', icon: '📈' },
                    { value: 'crescer_equipe', label: 'Crescer a equipe para X pessoas', icon: '👥' },
                    { value: 'atingir_renda', label: 'Atingir renda mensal de X', icon: '💰' },
                    { value: 'base_duplicacao', label: 'Construir uma base sólida de duplicação', icon: '🔄' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, meta_1_ano: option.value }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.meta_1_ano === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.meta_1_ano === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <textarea
                  value={data.meta_1_ano && !['viver_negocio', 'subir_nivel', 'crescer_equipe', 'atingir_renda', 'base_duplicacao'].includes(data.meta_1_ano) ? data.meta_1_ano : ''}
                  onChange={(e) => setData(prev => ({ ...prev, meta_1_ano: e.target.value }))}
                  placeholder="Ou escreva sua meta personalizada..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Campo de Observações Adicionais */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  💬 Observações Adicionais (opcional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Alguma informação importante que o NOEL deve saber sobre você?
                </p>
                <textarea
                  value={data.observacoes_adicionais || ''}
                  onChange={(e) => {
                    const value = e.target.value.substring(0, 500)
                    setData(prev => ({ ...prev, observacoes_adicionais: value }))
                  }}
                  placeholder="Ex: Trabalho apenas à noite, tenho limitações físicas, prefiro abordagem mais suave..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(data.observacoes_adicionais || '').length}/500 caracteres
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={section === 1 || saving}
              className={`px-6 py-2 rounded-lg font-medium ${
                section === 1 || saving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <span>{section === totalSections ? 'Finalizar' : 'Próximo'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
  )

  if (inline) {
    return content
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  )
}
