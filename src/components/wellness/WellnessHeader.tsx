// =====================================================
// YLADA - COMPONENTE HEADER COMPARTILHADO WELLNESS
// =====================================================

import Image from 'next/image'
import { ToolConfig } from '@/types/wellness'

interface WellnessHeaderProps {
  title?: string
  description?: string
  defaultTitle?: string
  defaultDescription?: string
  showLogoOnly?: boolean
}

export default function WellnessHeader({
  title,
  description,
  defaultTitle,
  defaultDescription = '',
  showLogoOnly = false
}: WellnessHeaderProps) {
  // Se showLogoOnly for true OU não houver title/description, mostra apenas o logo
  const shouldShowLogoOnly = showLogoOnly || (!title && !defaultTitle)
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {shouldShowLogoOnly ? (
            <div className="bg-transparent inline-block">
              <Image
                src="/images/logo/wellness-horizontal.png"
                alt="WELLNESS - Your Leading Data System"
                width={572}
                height={150}
                className="bg-transparent object-contain h-10 sm:h-12 w-auto"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
          ) : (
            (title || defaultTitle) && (
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
            )
          )}
        </div>
      </div>
    </header>
  )
}





