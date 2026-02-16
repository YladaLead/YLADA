import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/fluxos para /pt/links */
export default function YladaLegacyFluxosPage() {
  redirect('/pt/links')
}
