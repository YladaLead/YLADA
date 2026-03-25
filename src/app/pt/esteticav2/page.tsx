import { redirect } from 'next/navigation'

/** URL antiga: redireciona para o fluxo progressivo canónico. */
export default function EsteticaV2RedirectPage() {
  redirect('/pt/estetica')
}
