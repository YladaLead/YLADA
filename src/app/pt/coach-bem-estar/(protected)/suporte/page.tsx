'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NinaSupportContent from '@/components/ylada/NinaSupportContent'

export default function CoachBemEstarSuportePage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <NinaSupportContent
          areaCodigo="coach-bem-estar"
          areaLabel="Coach de bem-estar"
          supportUi="matrix"
        />
      </div>
    </YladaAreaShell>
  )
}
