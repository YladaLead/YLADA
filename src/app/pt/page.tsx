import { redirect } from 'next/navigation'

/** /pt redireciona para o hub de segmentos (cada vertical em /pt/{area}). */
export default function PtHomePage() {
  redirect('/pt/segmentos')
}
