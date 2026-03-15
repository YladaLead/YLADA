import { redirect } from 'next/navigation'

/**
 * Coach: redireciona para YLADA (/pt/login).
 * O sistema agora resolve pelo perfil; todos Nutri e Coach entram pela plataforma YLADA.
 */
export default function CoachLoginPage() {
  redirect('/pt/login')
}

