'use client'

/**
 * Cena 4: Pessoa respondendo uma pergunta (nível de energia).
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

const OPTIONS = ['Baixo', 'Médio', 'Alto']

export default function UserAnswerScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Pergunta 2 de 3
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          Como está seu nível de energia hoje?
        </h2>
        <ul className="space-y-3">
          {OPTIONS.map((opt, i) => (
            <li key={i}>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors">
                <input type="radio" name="energia" className="w-4 h-4 text-blue-600" defaultChecked={i === 1} />
                <span className="text-gray-700">{opt}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <button
            type="button"
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
