'use client'

import { pilaresConfig } from '@/types/pilares'
import PilarSecao from '@/components/formacao/PilarSecao'

interface PilarContentInlineProps {
  pilarId: string
  dayNumber: number
}

/**
 * Componente que renderiza o conteúdo do Pilar inline na página do Dia
 * Elimina a necessidade de navegar para outra página
 */
export default function PilarContentInline({ pilarId, dayNumber }: PilarContentInlineProps) {
  const pilar = pilaresConfig.find(p => p.id === pilarId)

  if (!pilar) {
    return (
      <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          Pilar não encontrado. Por favor, tente novamente.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      {/* Header do Pilar */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500 shadow-md">
        <h2 className="font-bold text-gray-900 mb-2 text-xl">💪 Conteúdo do Pilar {pilar.numero}</h2>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">{pilar.nome}</h3>
        {pilar.subtitulo && (
          <p className="text-gray-700 text-sm italic mb-4">{pilar.subtitulo}</p>
        )}
        {pilar.descricao_introducao && (
          <p className="text-gray-700 leading-relaxed">{pilar.descricao_introducao}</p>
        )}
      </div>

      {/* Seções do Pilar */}
      {pilar.secoes && pilar.secoes.length > 0 ? (
        <div className="space-y-6">
          {pilar.secoes
            .sort((a, b) => a.order_index - b.order_index)
            .map((secao) => (
              <PilarSecao key={secao.id} secao={secao} pilarId={pilarId} />
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-center italic">
            Conteúdo deste pilar será adicionado em breve.
          </p>
        </div>
      )}

      {/* Link opcional para ver Pilar completo (no rodapé) */}
      <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Quer ver este Pilar completo com todos os detalhes?
        </p>
        <a
          href={`/pt/nutri/metodo/pilares/${pilarId}?fromDay=${dayNumber}`}
          className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 ease-out hover:opacity-90"
        >
          Ver Pilar Completo →
        </a>
      </div>
    </div>
  )
}
