import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/login para /pt/login */
export default function YladaLegacyLoginPage() {
  redirect('/pt/login')
}
