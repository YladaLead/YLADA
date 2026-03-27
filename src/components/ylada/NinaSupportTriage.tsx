'use client'

import type { NinaSupportQuickChip } from '@/config/ylada-nina-support-ux'

export interface NinaSupportTriageProps {
  chips: NinaSupportQuickChip[]
  onChipClick: (message: string) => void
  chipsDisabled?: boolean
}

export default function NinaSupportTriage({
  chips,
  onChipClick,
  chipsDisabled = false,
}: NinaSupportTriageProps) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">Perguntas rápidas</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            disabled={chipsDisabled}
            onClick={() => onChipClick(c.message)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-800 hover:border-violet-200 hover:bg-violet-50/60 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
