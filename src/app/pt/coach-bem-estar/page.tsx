import { redirect } from 'next/navigation'

/** Raiz do segmento: porta de entrada pública do app (não misturar com /pt/coach nem /pt/wellness). */
export default function CoachBemEstarLandingPage() {
  redirect('/pt/coach-bem-estar/login')
}
