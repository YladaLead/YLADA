import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import MetodoYLADAContent from '@/components/ylada/MetodoYLADAContent'

export default function MetodoYLADAPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <MetodoYLADAContent areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
