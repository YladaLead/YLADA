import { redirect } from 'next/navigation'

/** Convites de equipa não fazem parte desta edição — rota antiga redireciona. */
export default function ProEsteticaCorporalLinksRedirectPage() {
  redirect('/pro-estetica-corporal/painel')
}
