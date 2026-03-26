import { redirect } from 'next/navigation'

/**
 * URL legada `/pt/nutri/quiz`: funil matriz (padrão Estética) está em `/pt/nutri`.
 * Quiz de carreira (fases, captura de lead): `/pt/nutri/quiz/legacy`.
 */
export default function NutriQuizRootRedirectPage() {
  redirect('/pt/nutri')
}
