'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import TrilhaPlanoSemana from '@/components/trilha/TrilhaPlanoSemana'
import TrilhaNeedsList from '@/components/trilha/TrilhaNeedsList'

/**
 * Conteúdo da Trilha Empresarial para uma área YLADA.
 * Recebe área e basePath; usa os mesmos componentes em todas as áreas (parametrizado).
 * Cada área tem uma página fina que renderiza <TrilhaAreaView areaCodigo="med" areaLabel="Medicina" />.
 */
interface TrilhaAreaViewProps {
  areaCodigo: string
  areaLabel: string
}

export default function TrilhaAreaView({ areaCodigo, areaLabel }: TrilhaAreaViewProps) {
  const basePath = `/pt/${areaCodigo}/trilha`

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Trilha empresarial</h1>
          <p className="text-gray-600 mb-4">
            Fundamentos e necessidades: escolha uma etapa, preencha a reflexão e o Noel usará suas respostas para orientar você.
          </p>
        </div>
        <TrilhaPlanoSemana />
        <TrilhaNeedsList basePath={basePath} />
      </div>
    </YladaAreaShell>
  )
}
