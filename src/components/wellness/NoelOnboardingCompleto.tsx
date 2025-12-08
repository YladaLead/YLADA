'use client'

import { useState } from 'react'
import type { WellnessConsultantProfile } from '@/types/wellness-system'

interface NoelOnboardingCompletoProps {
  onComplete: (data: Partial<WellnessConsultantProfile>) => void
  initialData?: Partial<WellnessConsultantProfile>
  onClose?: () => void
}

export default function NoelOnboardingCompleto({ 
  onComplete, 
  initialData,
  onClose
}: NoelOnboardingCompletoProps) {
  const [section, setSection] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [data, setData] = useState<Partial<WellnessConsultantProfile>>({
    // Dados do Perfil
    idade: initialData?.idade,
    cidade: initialData?.cidade || '',
    tempo_disponivel: initialData?.tempo_disponivel,
    experiencia_herbalife: initialData?.experiencia_herbalife,
    objetivo_principal: initialData?.objetivo_principal,
    canal_principal: initialData?.canal_principal,
    
    // Dados Operacionais
    prepara_bebidas: initialData?.prepara_bebidas,
    trabalha_com: initialData?.trabalha_com,
    estoque_atual: initialData?.estoque_atual || [],
    meta_pv: initialData?.meta_pv,
    meta_financeira: initialData?.meta_financeira,
    
    // Dados Sociais
    contatos_whatsapp: initialData?.contatos_whatsapp,
    seguidores_instagram: initialData?.seguidores_instagram,
    abertura_recrutar: initialData?.abertura_recrutar,
    publico_preferido: initialData?.publico_preferido || [],
    
    // Preferências
    tom: initialData?.tom,
    ritmo: initialData?.ritmo,
    lembretes: initialData?.lembretes !== undefined ? initialData.lembretes : true,
  })

  const totalSections = 5

  const handleNext = async () => {
    // Validar seção atual
    if (!validateSection(section)) {
      return
    }

    if (section < totalSections) {
      setSection(section + 1)
      setError(null)
    } else {
      // Finalizar
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
      case 1: // Perfil
        if (!data.objetivo_principal || !data.tempo_disponivel || !data.experiencia_herbalife) {
          setError('Por favor, preencha todos os campos obrigatórios.')
          return false
        }
        break
      case 2: // Operacional
        if (!data.prepara_bebidas || !data.trabalha_com) {
          setError('Por favor, preencha todos os campos obrigatórios.')
          return false
        }
        break
      case 3: // Social
        // Campos opcionais, mas validar se preenchidos
        break
      case 4: // Preferências
        if (!data.tom || !data.ritmo) {
          setError('Por favor, preencha todos os campos obrigatórios.')
          return false
        }
        break
    }
    return true
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      console.log('💾 Dados que serão salvos:', JSON.stringify(data, null, 2))
      await onComplete(data)
    } catch (err: any) {
      console.error('❌ Erro ao salvar:', err)
      const errorMessage = err.message || 'Erro ao salvar. Tente novamente.'
      setError(errorMessage)
      setSaving(false)
    }
  }

  const togglePublico = (publico: string) => {
    setData(prev => ({
      ...prev,
      publico_preferido: prev.publico_preferido?.includes(publico)
        ? prev.publico_preferido.filter(p => p !== publico)
        : [...(prev.publico_preferido || []), publico]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Botão de Fechar */}
        {onClose && (
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
        
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Configure seu Perfil Completo
            </h2>
            <p className="text-gray-600">
              Vamos personalizar sua experiência com o NOEL
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s <= section ? 'bg-green-600 w-8' : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {section === 1 && 'Perfil do Consultor'}
              {section === 2 && 'Dados Operacionais'}
              {section === 3 && 'Dados Sociais'}
              {section === 4 && 'Preferências'}
              {section === 5 && 'Revisão'}
            </div>
          </div>

          {/* SEÇÃO 1: DADOS DO PERFIL DO CONSULTOR */}
          {section === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                1. Dados do Perfil
              </h3>

              {/* Idade (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (opcional)
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={data.idade || ''}
                  onChange={(e) => setData(prev => ({ ...prev, idade: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 28"
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={data.cidade || ''}
                  onChange={(e) => setData(prev => ({ ...prev, cidade: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: São Paulo"
                />
              </div>

              {/* Objetivo Principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
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
                      onClick={() => setData(prev => ({ ...prev, objetivo_principal: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.objetivo_principal === option.value
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

              {/* Tempo Disponível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo Disponível por Dia <span className="text-red-500">*</span>
                </label>
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
                      onClick={() => setData(prev => ({ ...prev, tempo_disponivel: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.tempo_disponivel === option.value
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

              {/* Experiência Herbalife */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiência com Herbalife <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'nenhuma', label: 'Nenhuma', icon: '🆕' },
                    { value: 'ja_vendi', label: 'Já vendi', icon: '✅' },
                    { value: 'supervisor', label: 'Supervisor', icon: '⭐' },
                    { value: 'get_plus', label: 'GET+', icon: '👑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, experiencia_herbalife: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.experiencia_herbalife === option.value
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal Principal
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                    { value: 'instagram', label: 'Instagram', icon: '📸' },
                    { value: 'trafego_pago', label: 'Tráfego Pago', icon: '📊' },
                    { value: 'presencial', label: 'Presencial', icon: '🚶' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, canal_principal: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.canal_principal === option.value
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
          )}

          {/* SEÇÃO 2: DADOS OPERACIONAIS */}
          {section === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                2. Dados Operacionais
              </h3>

              {/* Prepara Bebidas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você prepara bebidas funcionais? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'sim', label: 'Sim', icon: '✅' },
                    { value: 'nao', label: 'Não', icon: '❌' },
                    { value: 'aprender', label: 'Quero aprender', icon: '📚' },
                    { value: 'nunca', label: 'Nunca', icon: '🚫' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, prepara_bebidas: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.prepara_bebidas === option.value
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

              {/* Trabalha Com */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você trabalha com: <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'funcional', label: 'Bebidas Funcionais', icon: '🥤' },
                    { value: 'fechado', label: 'Produtos Fechados', icon: '📦' },
                    { value: 'ambos', label: 'Ambos', icon: '🔄' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, trabalha_com: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.trabalha_com === option.value
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

              {/* Meta PV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta de PV Mensal (100-50000)
                </label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  step="50"
                  value={data.meta_pv || ''}
                  onChange={(e) => setData(prev => ({ ...prev, meta_pv: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 500"
                />
              </div>

              {/* Meta Financeira */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Financeira Mensal (R$ 500-200.000)
                </label>
                <input
                  type="number"
                  min="500"
                  max="200000"
                  step="100"
                  value={data.meta_financeira || ''}
                  onChange={(e) => setData(prev => ({ ...prev, meta_financeira: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 2000"
                />
              </div>
            </div>
          )}

          {/* SEÇÃO 3: DADOS SOCIAIS */}
          {section === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                3. Dados Sociais
              </h3>

              {/* Contatos WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantos contatos você tem no WhatsApp?
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.contatos_whatsapp || ''}
                  onChange={(e) => setData(prev => ({ ...prev, contatos_whatsapp: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 150"
                />
              </div>

              {/* Seguidores Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantos seguidores você tem no Instagram?
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.seguidores_instagram || ''}
                  onChange={(e) => setData(prev => ({ ...prev, seguidores_instagram: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 500"
                />
              </div>

              {/* Abertura Recrutar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você tem abertura para recrutar?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'sim', label: 'Sim', icon: '✅' },
                    { value: 'nao', label: 'Não', icon: '❌' },
                    { value: 'aprender', label: 'Quero aprender', icon: '📚' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, abertura_recrutar: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.abertura_recrutar === option.value
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

              {/* Público Preferido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Público Preferido (pode selecionar vários)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'saude', label: 'Saúde', icon: '💚' },
                    { value: 'estetica', label: 'Estética', icon: '✨' },
                    { value: 'fitness', label: 'Fitness', icon: '💪' },
                    { value: 'maes', label: 'Mães', icon: '👩' },
                    { value: 'jovens', label: 'Jovens', icon: '👶' },
                    { value: 'cansados', label: 'Cansados', icon: '😴' },
                    { value: 'renda_extra', label: 'Renda Extra', icon: '💰' },
                    { value: 'saudaveis', label: 'Saudáveis', icon: '🌟' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => togglePublico(option.value)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.publico_preferido?.includes(option.value)
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {data.publico_preferido?.includes(option.value) && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 4: PREFERÊNCIAS */}
          {section === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                4. Preferências
              </h3>

              {/* Tom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tom de Comunicação <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'neutro', label: 'Neutro', icon: '😐' },
                    { value: 'extrovertido', label: 'Extrovertido', icon: '😄' },
                    { value: 'tecnico', label: 'Técnico', icon: '🔬' },
                    { value: 'simples', label: 'Simples', icon: '💬' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, tom: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.tom === option.value
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

              {/* Ritmo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ritmo de Trabalho <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'lento', label: 'Lento', icon: '🐢' },
                    { value: 'medio', label: 'Médio', icon: '🚶' },
                    { value: 'rapido', label: 'Rápido', icon: '🏃' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData(prev => ({ ...prev, ritmo: option.value as any }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        data.ritmo === option.value
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

              {/* Lembretes */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.lembretes || false}
                    onChange={(e) => setData(prev => ({ ...prev, lembretes: e.target.checked }))}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Desejo receber lembretes do sistema
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SEÇÃO 5: REVISÃO */}
          {section === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                5. Revisão Final
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <strong className="text-gray-700">Objetivo:</strong>{' '}
                  <span className="text-gray-900">
                    {data.objetivo_principal === 'usar_recomendar' && 'Usar e Recomendar'}
                    {data.objetivo_principal === 'renda_extra' && 'Renda Extra'}
                    {data.objetivo_principal === 'carteira' && 'Construir Carteira'}
                    {data.objetivo_principal === 'plano_presidente' && 'Plano Presidente'}
                    {data.objetivo_principal === 'fechado' && 'Produtos Fechados'}
                    {data.objetivo_principal === 'funcional' && 'Bebidas Funcionais'}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Tempo Disponível:</strong>{' '}
                  <span className="text-gray-900">{data.tempo_disponivel}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Prepara Bebidas:</strong>{' '}
                  <span className="text-gray-900">{data.prepara_bebidas}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Trabalha Com:</strong>{' '}
                  <span className="text-gray-900">{data.trabalha_com}</span>
                </div>
                {data.meta_pv && (
                  <div>
                    <strong className="text-gray-700">Meta PV:</strong>{' '}
                    <span className="text-gray-900">{data.meta_pv}</span>
                  </div>
                )}
                {data.meta_financeira && (
                  <div>
                    <strong className="text-gray-700">Meta Financeira:</strong>{' '}
                    <span className="text-gray-900">R$ {data.meta_financeira.toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <div>
                  <strong className="text-gray-700">Tom:</strong>{' '}
                  <span className="text-gray-900">{data.tom}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Ritmo:</strong>{' '}
                  <span className="text-gray-900">{data.ritmo}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Footer */}
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
    </div>
  )
}


