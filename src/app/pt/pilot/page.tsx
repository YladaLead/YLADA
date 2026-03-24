import { redirect } from 'next/navigation'

/**
 * /pt/pilot redireciona para /pt.
 * O fluxo piloto é agora a página oficial em /pt.
 */
export default function PilotRedirectPage() {
  redirect('/pt')
}
