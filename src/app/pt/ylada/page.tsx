import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada para a raiz da matriz /pt */
export default function YladaLegacyRootPage() {
  redirect('/pt')
}
