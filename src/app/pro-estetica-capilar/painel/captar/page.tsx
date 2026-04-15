import { ProEsteticaJornadaIntro } from '@/components/pro-estetica-corporal/ProEsteticaJornadaIntro'
import { PRO_ESTETICA_CAPILAR_CAPTAR } from '@/config/pro-estetica-capilar-jornada'

export default function ProEsteticaCapilarCaptarPage() {
  return <ProEsteticaJornadaIntro {...PRO_ESTETICA_CAPILAR_CAPTAR} basePath="/pro-estetica-capilar/painel" />
}
