import { redirect } from 'next/navigation'

/**
 * Nutri: redireciona para YLADA (/pt/cadastro).
 * O sistema agora resolve pelo perfil; todos Nutri e Coach entram pela plataforma YLADA.
 */
export default function NutriCadastroPage() {
  redirect('/pt/cadastro')
}
