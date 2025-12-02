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

  return (
    <>
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📅</span>
          <h3 className="font-bold text-gray-900 text-sm">Este Pilar é usado nos Dias:</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {days.map((dayNumber) => {
            const isAccessible = canAccess(dayNumber)
            return (
              <button
                key={dayNumber}
                onClick={() => handleChipClick(dayNumber)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${isAccessible
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                  }
                `}
                title={isAccessible ? `Dia ${dayNumber} da Jornada` : 'Conclua os dias anteriores para acessar'}
              >
                Dia {dayNumber}
              </button>
            )
          })}
        </div>
        <Link
          href="/pt/nutri/metodo/jornada"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
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

