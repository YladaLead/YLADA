import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function PerfumariaConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <YladaConfiguracaoContent areaCodigo="perfumaria" areaLabel="Perfumaria" />
    </YladaAreaShell>
  )
}
