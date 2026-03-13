import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function FitnessHomePage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <NoelHomeContent
        areaCodigo="fitness"
        areaLabel="Fitness"
        area="fitness"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
