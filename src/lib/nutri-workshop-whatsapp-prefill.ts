/**
 * Texto do wa.me após inscrição na landing Nutri → Empresária.
 * O trecho fixo vem no início (sem "Oi! Sou Fulana" antes) para o gatilho da automação bater sempre.
 *
 * Na ferramenta de campanha: colar em "frase que inicia o robô" o TRIGGER recomendado
 * (sem ponto / ! / ? no fim, se o sistema pedir).
 */
export const WA_TRIGGER_NUTRI_EMPRESARIA =
  'Acabei de me inscrever na aula Nutri para Empresaria e quero receber o acesso e os lembretes'

/** Mensagem completa quando não há primeiro nome útil */
export const WA_MSG_NUTRI_EMPRESARIA_SEM_NOME = `${WA_TRIGGER_NUTRI_EMPRESARIA}.`

export function primeiroNomeCompleto(nome: string) {
  const t = nome.trim().split(/\s+/).filter(Boolean)
  return t[0] || ''
}

export function buildWhatsappPrefillNutriEmpresaria(fullName: string) {
  const pn = primeiroNomeCompleto(fullName)
  return pn ? `${WA_TRIGGER_NUTRI_EMPRESARIA}. Sou ${pn}.` : WA_MSG_NUTRI_EMPRESARIA_SEM_NOME
}

export const WORKSHOP_SOURCE_NUTRI_EMPRESARIA = 'workshop_nutri_empresaria_landing_page' as const
