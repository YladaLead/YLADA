'use client'

import { useState } from 'react'

interface OnboardingData {
  objetivo_principal: string
  tempo_disponivel: string
  experiencia_vendas: string
  canal_preferido: string[]
  tem_lista_contatos: string
}

interface NoelOnboardingProps {
  onComplete: (data: OnboardingData) => void
  onClose?: () => void
}

export default function NoelOnboarding({ onComplete, onClose }: NoelOnboardingProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OnboardingData>({
    objetivo_principal: '',
    tempo_disponivel: '',
    experiencia_vendas: '',
    canal_preferido: [],
    tem_lista_contatos: ''
  })

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Validar todos os campos
      if (!data.objetivo_principal || !data.tempo_disponivel || !data.experiencia_vendas || 
          data.canal_preferido.length === 0 || !data.tem_lista_contatos) {
        setError('Por favor, preencha todos os campos antes de finalizar.')
        return
      }

      // Salvar
      setSaving(true)
      setError(null)
      
      try {
        await onComplete(data)
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar. Tente novamente.')
        setSaving(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleCanal = (canal: string) => {
    setData(prev => ({
      ...prev,
      canal_preferido: prev.canal_preferido.includes(canal)
        ? prev.canal_preferido.filter(c => c !== canal)
        : [...prev.canal_preferido, canal]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
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
              🎯 Bem-vindo ao Wellness!
            </h2>
            <p className="text-gray-600">
              Vamos configurar seu perfil para personalizar sua experiência
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s <= step ? 'bg-green-600 w-8' : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Objetivo Principal */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Qual é o seu objetivo principal no wellness?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'vender_mais', label: 'Vender mais', icon: '💰' },
                  { value: 'construir_carteira', label: 'Construir carteira de clientes', icon: '👥' },
                  { value: 'melhorar_rotina', label: 'Melhorar minha rotina', icon: '📅' },
                  { value: 'voltar_ritmo', label: 'Voltar ao ritmo depois de uma pausa', icon: '🔄' },
                  { value: 'aprender_divulgar', label: 'Só aprender a divulgar', icon: '📚' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData(prev => ({ ...prev, objetivo_principal: option.value }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.objetivo_principal === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Tempo Disponível */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quanto tempo por dia você tem disponível?
              </h3>
              <div className="space-y-3">
                {[
                  { value: '15_minutos', label: '15 minutos', icon: '⏱️' },
                  { value: '30_minutos', label: '30 minutos', icon: '⏰' },
                  { value: '1_hora', label: '1 hora', icon: '🕐' },
                  { value: 'mais_1_hora', label: 'Mais de 1 hora', icon: '🕑' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData(prev => ({ ...prev, tempo_disponivel: option.value }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.tempo_disponivel === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Experiência */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Você já vendeu bebidas funcionais antes?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'sim_regularmente', label: 'Sim, regularmente', icon: '✅' },
                  { value: 'ja_vendi_tempo', label: 'Já vendi, mas faz tempo', icon: '⏳' },
                  { value: 'nunca_vendi', label: 'Nunca vendi', icon: '🆕' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData(prev => ({ ...prev, experiencia_vendas: option.value }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.experiencia_vendas === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Canal Preferido */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Como você prefere trabalhar? (pode selecionar mais de um)
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                  { value: 'instagram', label: 'Instagram', icon: '📸' },
                  { value: 'presencial', label: 'Rua / Presencial', icon: '🚶' },
                  { value: 'grupos', label: 'Grupos', icon: '👥' },
                  { value: 'misto', label: 'Misto', icon: '🔄' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleCanal(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.canal_preferido.includes(option.value)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {data.canal_preferido.includes(option.value) && (
                        <span className="ml-auto text-green-600">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Lista de Contatos */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Você já tem lista de contatos para começar hoje?
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'sim', label: 'Sim', icon: '✅' },
                  { value: 'nao', label: 'Não', icon: '❌' },
                  { value: 'parcialmente', label: 'Parcialmente', icon: '⚠️' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData(prev => ({ ...prev, tem_lista_contatos: option.value }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      data.tem_lista_contatos === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
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
              disabled={step === 1 || saving}
              className={`px-6 py-2 rounded-lg font-medium ${
                step === 1 || saving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={
                saving ||
                (step === 1 && !data.objetivo_principal) ||
                (step === 2 && !data.tempo_disponivel) ||
                (step === 3 && !data.experiencia_vendas) ||
                (step === 4 && data.canal_preferido.length === 0) ||
                (step === 5 && !data.tem_lista_contatos)
              }
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                saving ||
                (step === 1 && !data.objetivo_principal) ||
                (step === 2 && !data.tempo_disponivel) ||
                (step === 3 && !data.experiencia_vendas) ||
                (step === 4 && data.canal_preferido.length === 0) ||
                (step === 5 && !data.tem_lista_contatos)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <span>{step === 5 ? 'Finalizar' : 'Próximo'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

