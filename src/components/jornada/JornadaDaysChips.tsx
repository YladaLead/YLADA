'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import BlockedDayModal from './BlockedDayModal'

interface JornadaDaysChipsProps {
  days: number[]
  pilarId: number
}

export default function JornadaDaysChips({ days, pilarId }: JornadaDaysChipsProps) {
  const { progress, canAccessDay: canAccess } = useJornadaProgress()
  const [showModal, setShowModal] = useState(false)
  const [blockedDay, setBlockedDay] = useState<number | null>(null)

  const handleChipClick = (dayNumber: number) => {
    if (canAccess(dayNumber)) {
      // Se o dia está liberado, não fazer nada (apenas mostrar que é clicável)
      // O usuário pode ir para a jornada manualmente
    } else {
      // Se o dia está bloqueado, mostrar modal explicativo
      setBlockedDay(dayNumber)
      setShowModal(true)
    }
  }

  const isCurrentDay = (dayNumber: number) => progress?.current_day === dayNumber

  return (
    <>
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📅</span>
          <h3 className="font-semibold text-gray-900 text-sm">Este Pilar é usado nos Dias:</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-3 overflow-x-auto pb-2">
          {days.map((dayNumber) => {
            const isAccessible = canAccess(dayNumber)
            const isCurrent = isCurrentDay(dayNumber)
            
            return (
              <button
                key={dayNumber}
                onClick={() => handleChipClick(dayNumber)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-out
                  ${isCurrent
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md'
                    : isAccessible
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer hover:shadow-md'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60 hover:opacity-70'
                  }
                `}
                title={
                  isCurrent 
                    ? `Dia ${dayNumber} - Dia Atual` 
                    : isAccessible 
                    ? `Dia ${dayNumber} da Jornada` 
                    : 'Conclua os dias anteriores para acessar'
                }
              >
                {isCurrent && <span className="mr-1">AGORA</span>}
                {isAccessible && !isCurrent && <span className="mr-1">✓</span>}
                {!isAccessible && <span className="mr-1">🔒</span>}
                Dia {dayNumber}
              </button>
            )
          })}
        </div>
        <Link
          href="/pt/nutri/metodo/jornada"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 ease-out hover:opacity-90"
        >
          Ver Jornada →
        </Link>
      </div>

      {blockedDay && (
        <BlockedDayModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setBlockedDay(null)
          }}
          blockedDay={blockedDay}
          currentDay={progress?.current_day || 1}
        />
      )}
    </>
  )
}

