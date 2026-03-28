import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function PerfumariaHomePage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="perfumaria"
        areaLabel="Perfumaria"
        area="perfumaria"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
