import { redirect } from 'next/navigation'

// Rota canônica para as lojas — redireciona para os Termos de Uso completos
export default function TermosRedirect() {
  redirect('/pt/termos-de-uso')
}
