import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/trilha/step/[stepId] para /pt/trilha/step/[stepId] */
export default async function YladaLegacyTrilhaStepPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params
  redirect(`/pt/trilha/step/${stepId}`)
}
