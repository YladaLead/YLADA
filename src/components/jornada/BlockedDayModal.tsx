'use client'

import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/shared/PrimaryButton'
import SecondaryButton from '@/components/shared/SecondaryButton'

interface BlockedDayModalProps {
  isOpen: boolean
  onClose: () => void
  blockedDay: number
  currentDay: number | null
  /** Base path da trilha (ex.: /pt/med/formacao/jornada). Se não passado, usa Nutri. */
  basePath?: string
}

const DEFAULT_JORNADA_PATH = '/pt/nutri/metodo/jornada'

export default function BlockedDayModal({
  isOpen,
  onClose,
  blockedDay,
  currentDay,
  basePath = DEFAULT_JORNADA_PATH
}: BlockedDayModalProps) {
  const router = useRouter()
  const base = basePath || DEFAULT_JORNADA_PATH

  if (!isOpen) return null

  const handleContinue = () => {
    onClose()
    if (currentDay) {
      router.push(`${base}/dia/${currentDay}`)
    } else {
      router.push(`${base}/dia/1`)
    }
  }

  const handleViewJourney = () => {
    onClose()
    const listPath = base.replace(/\/dia\/\d+$/, '').replace(/\/jornada$/, '') || base
    router.push(listPath)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-250"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.25s ease-in' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all duration-250"
          style={{ animation: 'slideIn 0.25s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Etapa ainda não disponível
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Para desbloquear esta etapa, conclua primeiro a <strong>Etapa {currentDay || 1}</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              A Trilha Empresarial segue uma sequência que garante a sua transformação profissional.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Continue de onde parou para avançar.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton
              onClick={handleContinue}
              fullWidth
              className="flex-1"
            >
              🔵 Continuar de onde parei
            </PrimaryButton>
            <SecondaryButton
              onClick={handleViewJourney}
              fullWidth
              className="flex-1"
            >
              ⚪ Ver Trilha Completa
            </SecondaryButton>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  )
}

