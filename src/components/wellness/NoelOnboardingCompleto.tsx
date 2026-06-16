'use client'

import { useEffect, useState } from 'react'
import type { WellnessConsultantProfile } from '@/types/ylada-flow-legacy'

interface NoelOnboardingCompletoProps {
  onComplete: (data: Partial<WellnessConsultantProfile>) => void | Promise<void>
  initialData?: Partial<WellnessConsultantProfile>
  onClose?: () => void
  inline?: boolean // Se true, renderiza inline sem modal
  hideNavigation?: boolean // Se true, esconde indicadores de progresso e botões de navegação
  singlePage?: boolean // Se true, renderiza todas as seções em uma página (rolando)
}

export default function NoelOnboardingCompleto({ 
  onComplete, 
  initialData,
  onClose,
  inline = false,
  hideNavigation = false,
  singlePage = false
}: NoelOnboardingCompletoProps) {
  const [section, setSection] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasHydratedFromInitialData, setHasHydratedFromInitialData] = useState(false)

  // Quando queremos "uma única página rolando", mostramos todas as seções em sequência
  // (mantém compatibilidade: hideNavigation já era usado como "editor inline" no Perfil).
  const isSinglePage = singlePage || hideNavigation
  
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
    anotacoes_bebidas_funcionais: (initialData as any)?.anotacoes_bebidas_funcionais || '',
    // MLM puro: carteira, contatos, equipe, bloqueio
    pessoas_na_carteira: initialData?.pessoas_na_carteira,
    contatos_novos_semana: initialData?.contatos_novos_semana,
    meta_crescimento_equipe: initialData?.meta_crescimento_equipe,
    bloqueio_principal: initialData?.bloqueio_principal,
    // Campos antigos (compatibilidade)
    cidade: initialData?.cidade || '',
    idade: initialData?.idade,
  })

  // ⚠️ Importante: initialData chega async (fetch). O useState acima só roda no mount,
  // então precisamos "hidratar" o form quando initialData atualizar.
  // Regra: preencher apenas campos vazios/undefined para não sobrescrever edição em andamento.
  useEffect(() => {
    if (!initialData) return

    setData(prev => {
      const next: Partial<WellnessConsultantProfile> = { ...prev }

      const fillIfEmpty = <K extends keyof WellnessConsultantProfile>(
        key: K,
        value: WellnessConsultantProfile[K] | undefined
      ) => {
        if (value === undefined || value === null) return
        const current = (next as any)[key]

        // Strings: preencher somente se estiver vazio
        if (typeof value === 'string') {
          if (typeof current !== 'string' || current.trim() === '') {
            ;(next as any)[key] = value
          }
          return
        }

        // Números/booleans/outros: preencher somente se estiver undefined/null
        if (current === undefined || current === null) {
          ;(next as any)[key] = value
        }
      }

      fillIfEmpty('tipo_trabalho', initialData.tipo_trabalho)
      fillIfEmpty('foco_trabalho', initialData.foco_trabalho)
      fillIfEmpty('ganhos_prioritarios', initialData.ganhos_prioritarios)
      fillIfEmpty('nivel_herbalife', initialData.nivel_herbalife)
      fillIfEmpty('carga_horaria_diaria', initialData.carga_horaria_diaria)
      fillIfEmpty('dias_por_semana', initialData.dias_por_semana)
      fillIfEmpty('meta_financeira', initialData.meta_financeira)
      fillIfEmpty('meta_3_meses', initialData.meta_3_meses)
      fillIfEmpty('meta_1_ano', initialData.meta_1_ano)
      fillIfEmpty('observacoes_adicionais', initialData.observacoes_adicionais)
      fillIfEmpty('pessoas_na_carteira', initialData.pessoas_na_carteira)
      fillIfEmpty('contatos_novos_semana', initialData.contatos_novos_semana)
      fillIfEmpty('meta_crescimento_equipe', initialData.meta_crescimento_equipe)
      fillIfEmpty('bloqueio_principal', initialData.bloqueio_principal)
      fillIfEmpty('cidade', initialData.cidade)
      fillIfEmpty('idade', initialData.idade)

      // Campo extra (não tipado no WellnessConsultantProfile)
      const anotacoes = (initialData as any)?.anotacoes_bebidas_funcionais
      if (typeof anotacoes === 'string') {
        const current = (next as any).anotacoes_bebidas_funcionais
        if (typeof current !== 'string' || current.trim() === '') {
          ;(next as any).anotacoes_bebidas_funcionais = anotacoes
        }
      }

      return next
    })

    if (!hasHydratedFromInitialData) {
      setHasHydratedFromInitialData(true)
    }
  }, [initialData, hasHydratedFromInitialData])

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
          {!hideNavigation && !isSinglePage && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Seu perfil de crescimento
              </h2>
              <p className="text-gray-600">
                Responda para o mentor personalizar metas, rotina e próximos passos
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
                {section === 1 && 'Perguntas essenciais (1-4)'}
                {section === 2 && 'Tempo, metas e carteira (5-11)'}
                {section === 3 && 'Metas temporais e observações (12-14)'}
              </div>
            </div>
          )}

          {/* SEÇÃO 1: PERGUNTAS 1-4 */}
          {(isSinglePage || section === 1) && (
            <div className="space-y-6">
              {isSinglePage && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">Seção 1 — Base do seu perfil</p>
                  <p className="text-xs text-gray-600 mt-1">Responda as perguntas essenciais (1–4).</p>
                </div>
              )}
              {/* Pergunta 1: Como trabalha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  1️⃣ Como você trabalha? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Define o foco principal para o mentor te ajudar (vendas, equipe ou ambos)
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'bebidas_funcionais', label: 'Vendas com foco em volume e recorrência', icon: '📈', desc: 'Muitos contatos, carteira ativa, conversas diárias' },
                    { value: 'produtos_fechados', label: 'Vendas com foco em valor por venda', icon: '💰', desc: 'Ticket maior por pedido, menos volume, mais margem' },
                    { value: 'cliente_que_indica', label: 'Foco em equipe e indicação', icon: '👥', desc: 'Desenvolver pessoas que recomendam e crescem com o negócio' }
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
                
                {/* Campo de observações para quem foca em volume/recorrência */}
                {data.tipo_trabalho === 'bebidas_funcionais' && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💬 Observações
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      Informações que o mentor pode usar para te orientar melhor: rotina, desafios, o que funciona bem.
                    </p>
                    <textarea
                      value={(data as any).anotacoes_bebidas_funcionais || ''}
                      onChange={(e) => {
                        const value = e.target.value.substring(0, 1000)
                        setData(prev => ({ ...prev, anotacoes_bebidas_funcionais: value } as any))
                      }}
                      placeholder="Ex: Atendo muitos contatos por dia, minha maior dificuldade é manter a rotina de follow-up..."
                      rows={5}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {((data as any).anotacoes_bebidas_funcionais || '').length}/1000 caracteres
                    </p>
                  </div>
                )}
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
                    { value: 'plano_carreira', label: 'Plano de carreira / crescimento em rede', icon: '👑', desc: 'Alta ambição, construção de equipe' },
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

              {/* Pergunta 4: Nível atual (neutro para MLM) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  4️⃣ Qual é o seu nível atual? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Onde você está hoje no seu negócio em rede
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'novo_distribuidor', label: 'Iniciante', icon: '🆕' },
                    { value: 'supervisor', label: 'Em crescimento', icon: '⭐' },
                    { value: 'equipe_mundial', label: 'Com equipe', icon: '🌍' },
                    { value: 'equipe_expansao_global', label: 'Liderança em expansão', icon: '🚀' },
                    { value: 'equipe_milionarios', label: 'Liderança consolidada', icon: '💎' },
                    { value: 'equipe_presidentes', label: 'Topo de carreira', icon: '👑' }
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
          {(isSinglePage || section === 2) && (
            <div className="space-y-6">
              {isSinglePage && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">Seção 2 — Tempo, metas e carteira</p>
                  <p className="text-xs text-gray-600 mt-1">Obrigatórias: 5–7. Opcionais: 8–11 (carteira, contatos, equipe, bloqueio).</p>
                </div>
              )}
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

              {/* Pergunta 8: Pessoas na carteira */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  8️⃣ Quantas pessoas já estão na sua carteira (clientes/contatos ativos)?
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.pessoas_na_carteira ?? ''}
                  onChange={(e) => setData(prev => ({ ...prev, pessoas_na_carteira: e.target.value === '' ? undefined : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 10"
                />
              </div>

              {/* Pergunta 9: Contatos novos por semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  9️⃣ Quantos contatos novos você fala por semana (em média)?
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.contatos_novos_semana ?? ''}
                  onChange={(e) => setData(prev => ({ ...prev, contatos_novos_semana: e.target.value === '' ? undefined : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 5"
                />
              </div>

              {/* Pergunta 10: Meta de crescimento em equipe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔟 Meta de novos parceiros na equipe (quantos quer conquistar)?
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.meta_crescimento_equipe ?? ''}
                  onChange={(e) => setData(prev => ({ ...prev, meta_crescimento_equipe: e.target.value === '' ? undefined : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 3"
                />
              </div>

              {/* Pergunta 11: Principal bloqueio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  1️⃣1️⃣ Qual seu principal bloqueio hoje?
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  O mentor usa isso para te dar o próximo passo certo
                </p>
                <div className="space-y-2">
                  {[
                    { value: 'medo', label: 'Medo de abordar / rejeição', icon: '😰' },
                    { value: 'organizacao', label: 'Organização / rotina', icon: '📋' },
                    { value: 'constancia', label: 'Constância / disciplina', icon: '🔄' },
                    { value: 'abordagem', label: 'Não sei como abordar', icon: '💬' },
                    { value: 'outro', label: 'Outro', icon: '✏️' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, bloqueio_principal: option.value }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.bloqueio_principal === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.bloqueio_principal === option.value && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 3: PERGUNTAS 12-14 (metas temporais + observações) */}
          {(isSinglePage || section === 3) && (
            <div className="space-y-6">
              {isSinglePage && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">Seção 3 — Metas temporais e observações</p>
                  <p className="text-xs text-gray-600 mt-1">Opcional, mas recomendado.</p>
                </div>
              )}
              {/* Meta 3 meses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Qual sua meta para os próximos 3 meses?
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
                  Qual sua meta para 1 ano?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Plano estratégico (opcional mas recomendado)
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    { value: 'viver_negocio', label: 'Viver do negócio', icon: '🏠' },
                    { value: 'subir_nivel', label: 'Subir de nível na carreira', icon: '📈' },
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

          {!hideNavigation && !isSinglePage && (
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
          )}

          {isSinglePage && (
            <div className="mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Salvar perfil</span>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ao salvar, o NOEL passa a personalizar suas recomendações com base no seu perfil.
              </p>
            </div>
          )}
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
