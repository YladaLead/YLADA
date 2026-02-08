'use client'

import Link from 'next/link'
import { useState } from 'react'
import BlockedDayModal from './BlockedDayModal'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import type { JornadaProgress } from '@/utils/jornada-access'

interface DayCardProps {
  day: {
    day_number: number
    title: string
    is_completed: boolean
    is_locked?: boolean
  }
  progress: JornadaProgress | null
  currentDay: number | null
  onDayClick?: (dayNumber: number) => void
  /** Quando definido (ex.: /pt/med/formacao/jornada), link da etapa usa este path. */
  basePath?: string
}

const DEFAULT_JORNADA_PATH = '/pt/nutri/metodo/jornada'

export default function DayCard({
  day,
  progress,
  currentDay,
  onDayClick,
  basePath = DEFAULT_JORNADA_PATH
}: DayCardProps) {
  const jornadaBase = basePath || DEFAULT_JORNADA_PATH
  const etapaHref = `${jornadaBase}/dia/${day.day_number}`
  const [showModal, setShowModal] = useState(false)
  const { canAccessDay, isDayLocked, userEmail } = useJornadaProgress()

  // Se is_locked for explicitamente false, não bloquear
  const isLocked = day.is_locked === false ? false : (isDayLocked(day.day_number) || day.is_locked)
  const isCurrent = day.day_number === currentDay
  const canAccess = day.is_locked === false ? true : (canAccessDay(day.day_number) && !day.is_locked)

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault()
      setShowModal(true)
    } else if (onDayClick) {
      onDayClick(day.day_number)
    }
  }

  return (
    <>
      <Link
        href={canAccess ? etapaHref : '#'}
        onClick={handleClick}
        className={`
          relative p-4 rounded-lg border-2 transition-all
          ${day.is_completed
            ? 'bg-green-50 border-green-300 hover:border-green-400'
            : isLocked
            ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
            : isCurrent
            ? 'bg-blue-50 border-blue-400 hover:border-blue-500 shadow-md'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
          }
        `}
        title={isLocked ? 'Conclua primeiro a etapa anterior' : undefined}
      >
        {day.is_completed && (
          <div className="absolute top-2 right-2">
            <span className="text-green-600 text-xl">✓</span>
          </div>
        )}
        {isLocked && (
          <div className="absolute top-2 right-2">
            <span className="text-gray-400 text-lg">🔒</span>
          </div>
        )}
        {isCurrent && !day.is_completed && (
          <div className="absolute top-2 right-2">
            <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded-full">
              AGORA
            </span>
          </div>
        )}
        <div className="text-center">
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Etapa</div>
          <div className={`text-2xl font-bold mb-1 ${
            day.is_completed ? 'text-green-700' :
            isLocked ? 'text-gray-400' :
            isCurrent ? 'text-blue-700' :
            'text-gray-700'
          }`}>
            {day.day_number}
          </div>
          <div className={`text-xs font-medium line-clamp-2 ${
            day.is_completed ? 'text-green-600' :
            isLocked ? 'text-gray-400' :
            isCurrent ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {day.title}
          </div>
        </div>
      </Link>

      <BlockedDayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        blockedDay={day.day_number}
        currentDay={currentDay}
        basePath={jornadaBase}
      />
    </>
  )
}

