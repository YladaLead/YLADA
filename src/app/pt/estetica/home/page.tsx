import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function EsteticaHomePage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="estetica"
        areaLabel="Estética"
        area="estetica"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
