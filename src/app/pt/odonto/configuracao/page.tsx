import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function OdontoConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <YladaConfiguracaoContent areaCodigo="odonto" areaLabel="Odontologia" />
    </YladaAreaShell>
  )
}
