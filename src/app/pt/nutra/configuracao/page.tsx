import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function NutraConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra">
      <YladaConfiguracaoContent areaCodigo="nutra" areaLabel="Nutra" />
    </YladaAreaShell>
  )
}
