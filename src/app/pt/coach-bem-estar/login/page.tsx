import { redirect } from 'next/navigation'

/**
 * Login Coach bem-estar unificado com Coach.
 * Redireciona para /pt/coach/login.
 */
export default function CoachBemEstarLoginPage() {
  redirect('/pt/coach/login')
}
