import { redirect } from 'next/navigation'

/** Redireciona /pt/fluxos (legado) para /pt/links */
export default function FluxosLegacyRedirectPage() {
  redirect('/pt/links')
}
