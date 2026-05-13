import { redirect } from 'next/navigation'

/** Hub de recrutamento do coach passou para a área própria (/pt/coach-bem-estar). */
export default function CoachRecrutamentoLegacyRedirect() {
  redirect('/pt/coach-bem-estar/recrutamento')
}
