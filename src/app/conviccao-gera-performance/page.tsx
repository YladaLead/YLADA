import { redirect } from 'next/navigation'

/** Alias impresso como URL longa no livro → redireciona para o slug curto */
export default function ConviccaoAliasPage() {
  redirect('/conviccao')
}
