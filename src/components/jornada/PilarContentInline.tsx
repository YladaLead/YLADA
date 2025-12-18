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
 * Filtra seções baseado no dia para evitar confusão (ex: não mostrar "Dia 15" no Dia 3)
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

  /**
   * Filtra seções do Pilar baseado no dia da jornada
   * Evita mostrar conteúdo que menciona dias futuros quando ainda estamos em dias anteriores
   */
  const getFilteredSections = () => {
    if (!pilar.secoes) return []
    
    const sortedSections = [...pilar.secoes].sort((a, b) => a.order_index - b.order_index)
    
    // Se for Pilar 2 (Rotina Mínima) e estivermos no Dia 3, filtrar seções que mencionam Dias 15/16
    if (pilarId === '2' && dayNumber === 3) {
      return sortedSections.filter(secao => {
        // Excluir seções que mencionam Dias 15 ou 16 no título ou conteúdo
        const titulo = secao.titulo?.toLowerCase() || ''
        const conteudo = secao.conteudo?.toLowerCase() || ''
        return !titulo.includes('dia 15') && 
               !titulo.includes('dia 16') && 
               !conteudo.includes('dia 15') && 
               !conteudo.includes('dia 16') &&
               !titulo.includes('parte 1') &&
               !titulo.includes('parte 2')
      })
    }
    
    // Para outros casos, mostrar todas as seções
    return sortedSections
  }

  const filteredSections = getFilteredSections()

  return (
    <div className="mb-6">
      {/* Header do Pilar */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500 shadow-md">
        <h2 className="font-bold text-gray-900 mb-2 text-xl">💪 {pilar.nome}</h2>
        {pilar.subtitulo && (
          <p className="text-gray-700 text-sm italic mb-4">{pilar.subtitulo}</p>
        )}
        {pilar.descricao_introducao && (
          <p className="text-gray-700 leading-relaxed">{pilar.descricao_introducao}</p>
        )}
      </div>

      {/* Seções do Pilar (filtradas baseado no dia) */}
      {filteredSections.length > 0 ? (
        <div className="space-y-6">
          {filteredSections.map((secao) => (
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

    </div>
  )
}
