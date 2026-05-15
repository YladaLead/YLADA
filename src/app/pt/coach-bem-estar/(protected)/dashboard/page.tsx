import { redirect } from 'next/navigation'

/** Dashboard redireciona para home (ponto de entrada principal). */
export default function CoachBemEstarDashboardRedirect() {
  redirect('/pt/coach-bem-estar/home')
}
