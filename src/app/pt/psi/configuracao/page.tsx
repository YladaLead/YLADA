import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function PsiConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <YladaConfiguracaoContent areaCodigo="psi" areaLabel="Psicologia" />
    </YladaAreaShell>
  )
}
