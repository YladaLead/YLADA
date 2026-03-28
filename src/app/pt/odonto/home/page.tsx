import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function OdontoHomePage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="odonto"
        areaLabel="Odontologia"
        area="odonto"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos pacientes."
      />
    </YladaAreaShell>
  )
}
