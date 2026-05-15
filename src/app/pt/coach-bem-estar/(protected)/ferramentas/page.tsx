import { redirect } from 'next/navigation'

/**
 * Ferramentas do Coach de Bem-estar.
 * Redireciona para a biblioteca unificada de links — onde vivem as ferramentas.
 */
export default function CoachBemEstarFerramentasPage() {
  redirect('/pt/coach-bem-estar/links')
}
