import { redirect } from 'next/navigation'

/** Pro Estética é foco no profissional solo — rota antiga redireciona. */
export default function ProEsteticaCorporalEquipeRedirectPage() {
  redirect('/pro-estetica-corporal/painel')
}
