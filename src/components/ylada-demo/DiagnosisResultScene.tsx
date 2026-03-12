'use client'

/**
 * Cena 6: Resultado da avaliação em card central.
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

const SIGNS = ['energia baixa', 'estresse frequente', 'rotina irregular']

export default function DiagnosisResultScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Resultado da avaliação
        </h2>
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Perfil identificado
          </p>
          <p className="text-lg font-semibold text-gray-900">
            Sobrecarga física moderada
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Sinais detectados
          </p>
          <ul className="space-y-2">
            {SIGNS.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Falar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
