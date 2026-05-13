import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function CoachBemEstarHomePage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="coach-bem-estar"
        areaLabel="Coach de bem-estar"
        area="coach-bem-estar"
        subtitle="Organize rotina, links e conversas no WhatsApp — o mesmo mentor YLADA que médicos e psicólogos usam, no seu contexto de bem-estar."
      />
    </YladaAreaShell>
  )
}
