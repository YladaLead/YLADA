// =====================================================
// YLADA - COMPONENTE LANDING COMPARTILHADO WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'

interface WellnessLandingProps {
  config?: ToolConfig
  defaultEmoji?: string
  defaultTitle?: string
  defaultDescription?: string | React.ReactNode
  benefits?: string[]
  onStart: () => void
  buttonText?: string
}

export default function WellnessLanding({
  config,
  defaultEmoji = '📊',
  defaultTitle = 'Ferramenta Wellness',
  defaultDescription,
  benefits = [],
  onStart,
  buttonText = '▶️ Começar Agora - É Grátis'
}: WellnessLandingProps) {
  const emoji = config?.emoji || defaultEmoji
  const title = config?.title || defaultTitle
  const description = config?.description || defaultDescription

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {typeof description === 'string' ? (
          <p className="text-xl text-gray-600 mb-6">{description}</p>
        ) : (
          <div className="text-gray-600 mb-6">{description}</div>
        )}
      </div>

      {benefits.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 Por que usar esta ferramenta?</h3>
          <ul className="text-left space-y-3 text-gray-700">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
        style={{
          background: config?.custom_colors
            ? `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
            : 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)'
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}























