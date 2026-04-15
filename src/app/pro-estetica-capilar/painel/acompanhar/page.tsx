import { ProEsteticaJornadaIntro } from '@/components/pro-estetica-corporal/ProEsteticaJornadaIntro'
import { PRO_ESTETICA_CAPILAR_ACOMPANHAR } from '@/config/pro-estetica-capilar-jornada'

export default function ProEsteticaCapilarAcompanharPage() {
  return <ProEsteticaJornadaIntro {...PRO_ESTETICA_CAPILAR_ACOMPANHAR} basePath="/pro-estetica-capilar/painel" />
}
