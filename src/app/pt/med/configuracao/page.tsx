import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function MedConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <YladaConfiguracaoContent areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
