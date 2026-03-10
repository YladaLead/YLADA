import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function PsicanaliseConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise">
      <YladaConfiguracaoContent areaCodigo="psicanalise" areaLabel="Psicanálise" />
    </YladaAreaShell>
  )
}
