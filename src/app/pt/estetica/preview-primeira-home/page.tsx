import { notFound } from 'next/navigation'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

/**
 * Rota só para desenvolvimento: mesma composição da home após onboarding
 * (banner grande + Noel com CTA colapsado), sem depender de sessionStorage ou de não ter links.
 */
export default function EsteticaPreviewPrimeiraHomePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Preview local: primeira tela da home (banner de ativação completo + Noel antes de expandir o chat).
      </p>
      <NoelHomeContent
        areaCodigo="estetica"
        areaLabel="Estética"
        area="estetica"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
        homeActivationPreview="full"
      />
    </YladaAreaShell>
  )
}
