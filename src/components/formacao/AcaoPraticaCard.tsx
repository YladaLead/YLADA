'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface AcaoPraticaCardProps {
  title: string
  description?: string
  actionType: 'pilar' | 'exercicio' | 'ferramenta'
  actionLink: string
  actionId?: string
  dayNumber?: number // Número do dia da jornada (para navegação bidirecional)
}

export default function AcaoPraticaCard({
  title,
  description,
  actionType,
  actionLink,
  actionId,
  dayNumber
}: AcaoPraticaCardProps) {
  const params = useParams()
  
  // Se estiver na página de um dia da jornada e a ação for um Pilar, adicionar parâmetro fromDay
  const finalActionLink = actionType === 'pilar' && dayNumber && params.numero
    ? `${actionLink}?fromDay=${dayNumber}`
    : actionLink

  const getActionLabel = () => {
    switch (actionType) {
      case 'pilar':
        return 'Acessar Pilar Relacionado'
      case 'exercicio':
        return 'Acessar Exercício'
      case 'ferramenta':
        return 'Acessar Ferramenta'
      default:
        return 'Acessar'
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500 shadow-md">
      <h2 className="font-bold text-gray-900 mb-2 text-xl">💪 Ação Prática do Dia</h2>
      <h3 className="font-semibold text-gray-800 mb-3 text-lg">{title}</h3>
      
      {/* Frase padrão */}
      <p className="text-sm text-purple-700 font-medium mb-4 italic">
        "Faça esta ação primeiro. É o passo essencial do dia."
      </p>
      
      {description && (
        <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
      )}
      
      <Link
        href={finalActionLink}
        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {getActionLabel()} →
      </Link>
    </div>
  )
}

