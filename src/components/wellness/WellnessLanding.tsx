// =====================================================
// YLADA - COMPONENTE LANDING COMPARTILHADO WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'

interface WellnessLandingProps {
  config?: ToolConfig
  defaultEmoji?: string
  defaultTitle?: string
  title?: string // Título customizado (prioridade sobre defaultTitle)
  defaultDescription?: string | React.ReactNode
  description?: string | React.ReactNode // Descrição customizada (prioridade sobre defaultDescription)
  benefits?: string[] // "Por que usar esta ferramenta"
  benefitsTitle?: string // Título customizado para a seção de benefícios
  discover?: string[] // "O que você vai descobrir"
  onStart: () => void
  buttonText?: string
  ctaText?: string // Texto do botão CTA
}

export default function WellnessLanding({
  config,
  defaultEmoji = '📊',
  defaultTitle = 'Ferramenta Wellness',
  title, // Título customizado (prioridade)
  defaultDescription,
  description, // Descrição customizada (prioridade)
  benefits = [], // "Por que usar esta ferramenta"
  benefitsTitle, // Título customizado para a seção de benefícios
  discover = [], // "O que você vai descobrir"
  onStart,
  buttonText = '▶️ Começar Agora - É Grátis',
  ctaText // Texto do botão CTA (prioridade sobre buttonText)
}: WellnessLandingProps) {
  const emoji = config?.emoji || defaultEmoji
  const finalTitle = title || config?.title || defaultTitle
  const finalDescription = description || config?.description || defaultDescription
  const finalButtonText = ctaText || buttonText

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{finalTitle}</h2>
        {typeof finalDescription === 'string' ? (
          <p className="text-xl text-gray-600 mb-6">{finalDescription}</p>
        ) : (
          <div className="text-gray-600 mb-6">{finalDescription}</div>
        )}
      </div>

      {/* Seção: O que você vai descobrir */}
      {discover.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 O que você vai descobrir:</h3>
          <ul className="text-left space-y-3 text-gray-700">
            {discover.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Seção: Por que usar esta ferramenta */}
      {benefits.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 {benefitsTitle || 'Por que usar esta ferramenta?'}</h3>
          <ul className="text-left space-y-3 text-gray-700">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] hover:shadow-xl shadow-lg"
        style={{
          backgroundColor: config?.custom_colors?.principal || '#0284c7',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        {finalButtonText}
      </button>
    </div>
  )
}























