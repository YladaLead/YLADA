import { ProEsteticaJornadaIntro } from '@/components/pro-estetica-corporal/ProEsteticaJornadaIntro'
import { PRO_ESTETICA_CAPILAR_RETENCAO } from '@/config/pro-estetica-capilar-jornada'

export default function ProEsteticaCapilarRetencaoPage() {
  return <ProEsteticaJornadaIntro {...PRO_ESTETICA_CAPILAR_RETENCAO} basePath="/pro-estetica-capilar/painel" />
}
