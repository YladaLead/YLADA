import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function PsiHomePage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <NoelHomeContent
        areaCodigo="psi"
        areaLabel="Psicologia"
        area="psi"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair novos clientes."
      />
    </YladaAreaShell>
  )
}
