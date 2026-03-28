import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function NutriHomePage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="nutri"
        areaLabel="Nutri"
        area="nutri"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
