import { redirect } from 'next/navigation'

/**
 * Coach bem-estar unificado com Coach.
 * Redireciona para a única porta de entrada Coach (/pt/coach).
 */
export default function EsCoachBemEstarLandingPage() {
  redirect('/pt/coach')
}
