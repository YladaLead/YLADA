import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/recuperar-senha para /pt/recuperar-senha */
export default function YladaLegacyRecuperarSenhaPage() {
  redirect('/pt/recuperar-senha')
}
