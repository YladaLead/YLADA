import { redirect } from 'next/navigation'

/**
 * Coach bem-estar unificado com Coach.
 * Redirecionamento permanente: única porta de entrada é /pt/coach.
 * A diferenciação (bem-estar, carreira, vida) ocorre no perfil/onboarding da área Coach.
 */
export default function CoachBemEstarLandingPage() {
  redirect('/pt/coach')
}
