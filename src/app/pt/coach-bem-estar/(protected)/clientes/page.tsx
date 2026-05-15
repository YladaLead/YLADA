import { redirect } from 'next/navigation'

/**
 * Clientes do Coach de Bem-estar.
 * Compartilha a base de clientes do wellness (mesma assinatura).
 */
export default function CoachBemEstarClientesPage() {
  redirect('/pt/wellness/clientes')
}
