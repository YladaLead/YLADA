import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function MatrixConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <YladaConfiguracaoContent areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
