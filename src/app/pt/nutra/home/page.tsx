import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function NutraHomePage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="nutra"
        areaLabel="Nutra"
        area="nutra"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
