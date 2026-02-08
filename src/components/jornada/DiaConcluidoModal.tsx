'use client'

import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/shared/PrimaryButton'

interface DiaConcluidoModalProps {
  isOpen: boolean
  onClose: () => void
  dayNumber: number
  nextDay: number | null
  /** Base path da trilha (ex.: /pt/med/formacao/jornada). Se não passado, usa Nutri. */
  basePath?: string
}

const DEFAULT_JORNADA_PATH = '/pt/nutri/metodo/jornada'

export default function DiaConcluidoModal({
  isOpen,
  onClose,
  dayNumber,
  nextDay,
  basePath = DEFAULT_JORNADA_PATH
}: DiaConcluidoModalProps) {
  const router = useRouter()
  const base = basePath || DEFAULT_JORNADA_PATH

  if (!isOpen) return null

  const handleContinuar = () => {
    onClose()
    if (nextDay) {
      router.push(`${base}/dia/${nextDay}`)
    } else {
      router.push(`${base}/concluida`)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-in' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 border-2 border-purple-200"
          style={{ animation: 'slideInScale 0.4s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ícone de celebração */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 shadow-lg">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Parabéns!
          </h2>

          {/* Mensagem */}
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-2">
              Você concluiu a <strong className="text-purple-600">Etapa {dayNumber}</strong>!
            </p>
            <p className="text-gray-600 leading-relaxed">
              {nextDay 
                ? `Continue avançando. Você está construindo algo diferente.`
                : `Você completou toda a trilha! Uma conquista incrível.`
              }
            </p>
          </div>

          {/* Decoração */}
          <div className="flex justify-center gap-2 mb-6">
            <span className="text-2xl">✨</span>
            <span className="text-2xl">💪</span>
            <span className="text-2xl">🚀</span>
          </div>

          {/* Botão */}
          <PrimaryButton
            onClick={handleContinuar}
            fullWidth
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {nextDay ? `Continuar para a Etapa ${nextDay}` : 'Ver Conclusão'}
          </PrimaryButton>
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

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
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
