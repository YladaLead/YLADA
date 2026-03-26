import { redirect } from 'next/navigation'

/** URL legada: fluxo principal de estética está em /pt/estetica */
export default function EsteticaQuizLegacyRedirectPage() {
  redirect('/pt/estetica')
}
