import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/perfil-empresarial para /pt/perfil-empresarial */
export default function YladaLegacyPerfilPage() {
  redirect('/pt/perfil-empresarial')
}
