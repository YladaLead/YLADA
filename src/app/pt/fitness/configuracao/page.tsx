import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function FitnessConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <YladaConfiguracaoContent areaCodigo="fitness" areaLabel="Fitness" />
    </YladaAreaShell>
  )
}
