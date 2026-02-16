import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/home para /pt/home */
export default function YladaLegacyHomePage() {
  redirect('/pt/home')
}
