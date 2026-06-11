'use client'

/**
 * ETAPA 1 — CONVICÇÃO. Página do autodiagnóstico do próprio negócio + Noel Espelho.
 * Recebe a área por query (?area=estetica). É o primeiro passo após o onboarding.
 * @see src/components/ylada/ConviccaoAutodiagnosticoContent.tsx
 */
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ConviccaoAutodiagnosticoContent from '@/components/ylada/ConviccaoAutodiagnosticoContent'
import { getYladaAreaConfig } from '@/config/ylada-areas'

function DiagnosticoConviccaoInner() {
  const params = useSearchParams()
  const area = (params.get('area') || 'ylada').trim().toLowerCase()
  const cfg = getYladaAreaConfig(area)
  return (
    <ConviccaoAutodiagnosticoContent areaCodigo={cfg?.codigo ?? 'ylada'} areaLabel={cfg?.label} />
  )
}

export default function DiagnosticoConviccaoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
        </div>
      }
    >
      <DiagnosticoConviccaoInner />
    </Suspense>
  )
}
