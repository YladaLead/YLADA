import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import MetodoYLADAContent from '@/components/ylada/MetodoYLADAContent'

export default function MedMetodoPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <MetodoYLADAContent areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
