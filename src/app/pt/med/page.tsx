import { redirect } from 'next/navigation'

/**
 * Área Med removida; matriz central é YLADA.
 * Redireciona para a landing da matriz central.
 */
export default function MedRedirectPage() {
  redirect('/pt')
}
