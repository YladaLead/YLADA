import { redirect } from 'next/navigation'

/**
 * Home Coach de bem-estar.
 * Redireciona para a plataforma wellness (base compartilhada).
 * Usuários com perfil coach-bem-estar acessam a mesma plataforma que wellness.
 */
export default function CoachBemEstarHomePage() {
  redirect('/pt/wellness/home')
}
