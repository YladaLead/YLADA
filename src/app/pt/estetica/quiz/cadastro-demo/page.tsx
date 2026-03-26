import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ESTETICA_QUIZ_VER_PRATICA_HREF } from '@/config/estetica-quiz-public'

/**
 * URL legada / compartilhada: não exibe mais o cadastro fake;
 * segue direto para o fluxo “ver na prática” (login simulado → demo).
 */
export const metadata: Metadata = {
  title: 'Redirecionando… | YLADA',
  robots: { index: false, follow: false },
}

export default function CadastroDemoRedirectPage() {
  redirect(ESTETICA_QUIZ_VER_PRATICA_HREF)
}
