import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function EsteticaConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <YladaConfiguracaoContent areaCodigo="estetica" areaLabel="Estética" />
    </YladaAreaShell>
  )
}
