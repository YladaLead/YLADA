'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import JornadaSection from '@/components/formacao/JornadaSection'

/**
 * Trilha empresarial na área Med: mesma formação (identidade, comportamento, filosofia).
 * Exibida aqui para não redirecionar para Nutri. Links das etapas abrem em /pt/med/formacao/jornada/dia/X.
 */
const TRILHA_BASE_PATH = '/pt/med/formacao/jornada'

export default function MedFormacaoPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Trilha empresarial</h1>
        <p className="text-gray-600 mb-4">
          A mesma formação para todas as áreas: reflexão sobre identidade, comportamento e filosofia. O Noel usa suas respostas para orientar você.
        </p>
        <JornadaSection basePath={TRILHA_BASE_PATH} />
      </div>
    </YladaAreaShell>
  )
}
