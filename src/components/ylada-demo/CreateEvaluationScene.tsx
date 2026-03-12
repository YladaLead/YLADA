'use client'

/**
 * Cena 2: Profissional criando uma avaliação.
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

const OPTIONS = [
  'Quero entender melhor minha situação',
  'Estou buscando uma solução',
  'Tenho uma dúvida específica',
]

export default function CreateEvaluationScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Nova avaliação
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Qual situação melhor descreve sua necessidade hoje?
        </h2>
        <ul className="space-y-3">
          {OPTIONS.map((opt, i) => (
            <li key={i}>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors">
                <input type="radio" name="situacao" className="w-4 h-4 text-blue-600" defaultChecked={i === 0} />
                <span className="text-gray-700">{opt}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Salvar pergunta
          </button>
        </div>
      </div>
    </div>
  )
}
