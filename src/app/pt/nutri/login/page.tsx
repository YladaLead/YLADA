import { redirect } from 'next/navigation'

/**
 * Nutri: redireciona para YLADA (/pt/login).
 * O sistema agora resolve pelo perfil; todos Nutri e Coach entram pela plataforma YLADA.
 */
export default function NutriLoginPage() {
  redirect('/pt/login')
}

