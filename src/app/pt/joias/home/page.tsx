import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function JoiasHomePage() {
  return (
    <YladaAreaShell areaCodigo="joias" areaLabel="Joias e bijuterias" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="joias"
        areaLabel="Joias e bijuterias"
        area="joias"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
