import type { Metadata } from 'next'
import { getYladaAreaConfig } from '@/config/ylada-areas'
import PtEntradaAreaClient from './PtEntradaAreaClient'

type PageProps = { params: Promise<{ areaCodigo: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { areaCodigo } = await params
  const meta = getYladaAreaConfig(areaCodigo)
  const label = meta?.label ?? areaCodigo
  return {
    title: `Em qual nicho você atua? | ${label} | YLADA`,
    description: `Fluxo YLADA para ${label}: escolha seu nicho e continue.`,
    robots: { index: true, follow: true },
  }
}

export default async function PtEntradaAreaPage({ params }: PageProps) {
  const { areaCodigo } = await params
  return <PtEntradaAreaClient areaCodigo={areaCodigo} />
}
