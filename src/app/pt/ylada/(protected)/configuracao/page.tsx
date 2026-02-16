import { redirect } from 'next/navigation'

/** Redireciona /pt/ylada/configuracao para /pt/configuracao */
export default function YladaLegacyConfiguracaoPage() {
  redirect('/pt/configuracao')
}
