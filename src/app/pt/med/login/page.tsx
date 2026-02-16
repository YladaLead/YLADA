import { redirect } from 'next/navigation'

/**
 * Login da área Med redireciona para a matriz central YLADA.
 */
export default function MedLoginRedirectPage() {
  redirect('/pt/login')
}
