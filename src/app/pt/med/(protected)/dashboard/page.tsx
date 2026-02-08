import { redirect } from 'next/navigation'

/**
 * Dashboard removido do menu — métricas ficam em Fluxos.
 * Redireciona para a tela inicial (Noel).
 */
export default function MedDashboardPage() {
  redirect('/pt/med/home')
}
