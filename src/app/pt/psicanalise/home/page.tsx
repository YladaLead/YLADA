import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function PsicanaliseHomePage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise" suppressSidebarUntilRevealed>
      <NoelHomeContent
        areaCodigo="psicanalise"
        areaLabel="Psicanálise"
        area="psicanalise"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
