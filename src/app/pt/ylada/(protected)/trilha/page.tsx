import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/trilha para /pt/trilha */
export default function YladaLegacyTrilhaPage() {
  redirect('/pt/trilha')
}
