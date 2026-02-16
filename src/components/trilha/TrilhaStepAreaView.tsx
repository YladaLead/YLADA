'use client'

import { useParams } from 'next/navigation'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import TrilhaStepView from '@/components/trilha/TrilhaStepView'

/**
 * Página de um step da trilha, parametrizada por área.
 * Cada área tem uma página fina: <TrilhaStepAreaView areaCodigo="med" areaLabel="Medicina" />.
 */
interface TrilhaStepAreaViewProps {
  areaCodigo: string
  areaLabel: string
}

export default function TrilhaStepAreaView({ areaCodigo, areaLabel }: TrilhaStepAreaViewProps) {
  const params = useParams()
  const stepId = params.stepId as string
  const basePath = `/pt/${areaCodigo}/trilha`

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Trilha empresarial</h1>
        <TrilhaStepView stepId={stepId} basePath={basePath} />
      </div>
    </YladaAreaShell>
  )
}
