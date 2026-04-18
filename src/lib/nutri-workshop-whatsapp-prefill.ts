/**
 * Texto do wa.me após inscrição na landing Nutri → Empresária.
 * Centralizado para API + cliente e para alinhar gatilho do robô.
 */
export const WA_MSG_NUTRI_EMPRESARIA_SEM_NOME =
  'Oi! Acabei de me inscrever na aula Nutri para Empresaria e quero receber o acesso e os lembretes.'

export function primeiroNomeCompleto(nome: string) {
  const t = nome.trim().split(/\s+/).filter(Boolean)
  return t[0] || ''
}

export function buildWhatsappPrefillNutriEmpresaria(fullName: string) {
  const pn = primeiroNomeCompleto(fullName)
  return pn
    ? `Oi! Sou ${pn}. Acabei de me inscrever na aula Nutri para Empresaria e quero receber o acesso e os lembretes.`
    : WA_MSG_NUTRI_EMPRESARIA_SEM_NOME
}

export const WORKSHOP_SOURCE_NUTRI_EMPRESARIA = 'workshop_nutri_empresaria_landing_page' as const
