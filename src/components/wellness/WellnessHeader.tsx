// =====================================================
// YLADA - COMPONENTE HEADER COMPARTILHADO WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'

interface WellnessHeaderProps {
  title?: string
  description?: string
  defaultTitle?: string
  defaultDescription?: string
}

export default function WellnessHeader({
  title,
  description,
  defaultTitle = 'Ferramenta Wellness',
  defaultDescription = ''
}: WellnessHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Removido logo e tagline - não são relevantes para o usuário final */}
          {(title || defaultTitle) && (
            <div className="w-full">
              <h1 className="text-xl font-bold text-gray-900">
                {title || defaultTitle}
              </h1>
              {description && description !== '' && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
              {!description && defaultDescription && defaultDescription !== '' && (
                <p className="text-sm text-gray-600">
                  {defaultDescription}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}





