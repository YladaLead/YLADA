import { ProEsteticaJornadaIntro } from '@/components/pro-estetica-corporal/ProEsteticaJornadaIntro'
import { PRO_ESTETICA_CORPORAL_ACOMPANHAR } from '@/config/pro-estetica-corporal-jornada'

/**
 * Acompanhar a jornada do cliente (pós-venda / entre sessões).
 * Rota distinta de /pro-estetica-corporal/acompanhar (roadmap público).
 */
export default function ProEsteticaPainelAcompanharPage() {
  return <ProEsteticaJornadaIntro {...PRO_ESTETICA_CORPORAL_ACOMPANHAR} />
}
