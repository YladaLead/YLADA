import type { Metadata } from 'next'
import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

/**
 * Tela fixa para estudos internos: avaliar copy e decisões da primeira home pós-onboarding
 * (banner completo + Noel com chat colapsado), sem depender de sessionStorage ou de não ter links.
 */
export const metadata: Metadata = {
  title: 'Estudo — primeira home pós-onboarding (Estética)',
  description: 'Referência interna para avaliação de UX e decisões de produto.',
  robots: { index: false, follow: false },
}

export default function EsteticaPreviewPrimeiraHomePage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Estudo interno — avaliação e decisões: referência da primeira home após o cadastro (banner de ativação +
        Noel com o chat ainda fechado). Para comparar com o ambiente real:{' '}
        <Link href="/pt/estetica/home" className="font-medium text-amber-900 underline underline-offset-2">
          /pt/estetica/home
        </Link>
        .
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
