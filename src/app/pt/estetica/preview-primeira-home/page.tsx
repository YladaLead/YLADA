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
  description: 'Preview interno: recepção única do Noel antes de abrir o chat.',
  robots: { index: false, follow: false },
}

export default function EsteticaPreviewPrimeiraHomePage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética" suppressSidebarUntilRevealed>
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Estudo interno — sidebar oculta até “Começar agora”. Recepção com nome do perfil (onboarding ou conta). Se já
        digitou Dr./Dra./Doutor(a) no nome,
        usamos assim. Para médico ou odonto sem título no nome,{' '}
        <Link
          href="/pt/estetica/preview-primeira-home?genero=m"
          className="font-medium text-amber-900 underline underline-offset-2"
        >
          ?genero=m
        </Link>{' '}
        ou{' '}
        <Link
          href="/pt/estetica/preview-primeira-home?genero=f"
          className="font-medium text-amber-900 underline underline-offset-2"
        >
          ?genero=f
        </Link>{' '}
        adiciona Dr./Dra. (quando tivermos gênero no produto, isso virá do cadastro). Home real:{' '}
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
        unifiedReceptionPreview
      />
    </YladaAreaShell>
  )
}
