import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function MatrixHomePage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="ylada"
        areaLabel="YLADA"
        area="ylada"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
