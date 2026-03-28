import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function MedHomePage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="med"
        areaLabel="Médicos"
        area="med"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos pacientes."
      />
    </YladaAreaShell>
  )
}
