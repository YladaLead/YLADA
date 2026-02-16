import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/leads para /pt/leads */
export default function YladaLegacyLeadsPage() {
  redirect('/pt/leads')
}
