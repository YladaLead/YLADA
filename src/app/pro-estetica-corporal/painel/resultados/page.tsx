import { redirect } from 'next/navigation'
import { PRO_ESTETICA_CORPORAL_BASE_PATH } from '@/config/pro-estetica-corporal-menu'

/** Ritmo oculto no menu por simplicidade; URL antiga leva ao início do painel. */
export default function ProEsteticaCorporalResultadosPage() {
  redirect(PRO_ESTETICA_CORPORAL_BASE_PATH)
}
