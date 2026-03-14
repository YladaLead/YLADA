import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function NutriConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri">
      <YladaConfiguracaoContent areaCodigo="nutri" areaLabel="Nutri" />
    </YladaAreaShell>
  )
}
