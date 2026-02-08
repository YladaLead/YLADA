'use client'

import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

/**
 * Conclusão da Trilha Empresarial na área Med.
 * Mensagem de parabéns e link para voltar ao Med.
 */
export default function MedFormacaoJornadaConcluidaPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-yellow-300 text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trilha Empresarial concluída!</h1>
          <p className="text-lg text-gray-700 mb-8">
            Parabéns! Você completou todas as etapas da Trilha Empresarial YLADA.
          </p>
          <Link
            href="/pt/med/formacao"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            ← Voltar ao YLADA Medicina
          </Link>
        </div>
      </div>
    </YladaAreaShell>
  )
}
