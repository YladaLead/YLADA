'use client'

import { Suspense } from 'react'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'
import NoelNeutralSpecializationNotice from '@/components/ylada/NoelNeutralSpecializationNotice'
import type { NoelArea } from '@/config/noel-ux-content'

interface NoelHomeContentProps {
  areaCodigo: string
  areaLabel: string
  area: NoelArea
  subtitle: string
}

export default function NoelHomeContent({ areaCodigo, areaLabel, area, subtitle }: NoelHomeContentProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl" aria-hidden>🧠</span>
          Noel — Mentor estratégico{areaLabel !== 'YLADA' ? ` para ${areaLabel.toLowerCase()}` : ''}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>
      <NoelNeutralSpecializationNotice mentorArea={area} />
      <Suspense fallback={<div className="flex-1 min-h-[400px] rounded-xl bg-gray-100 animate-pulse" />}>
        <NoelChatWithParams area={area} className="flex-1 min-h-0 flex flex-col" />
      </Suspense>
    </div>
  )
}
