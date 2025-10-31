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
}

export default function WellnessHeader({
  title,
  description,
  defaultTitle = 'Ferramenta Wellness',
  defaultDescription = 'Sua ferramenta personalizada'
}: WellnessHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              alt="YLADA"
              width={196}
              height={59}
              className="h-10 bg-transparent object-contain"
              style={{ backgroundColor: 'transparent' }}
            />
            <div className="h-10 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {title || defaultTitle}
              </h1>
              <p className="text-sm text-gray-600">
                {description || defaultDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}





