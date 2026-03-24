'use client'

import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import NinaSupportContent from '@/components/ylada/NinaSupportContent'

/**
 * Suporte com Nina — mesma lógica da matriz YLADA (API + WhatsApp com contexto).
 */
export default function WellnessSuportePage() {
  return (
    <ConditionalWellnessSidebar>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <NinaSupportContent
          areaCodigo="ylada"
          areaLabel="Wellness"
          supportUi="wellness"
        />
      </div>
    </ConditionalWellnessSidebar>
  )
}
