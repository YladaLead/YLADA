/**
 * Texto único do wa.me após inscrição na landing Nutri → Empresária.
 * Sem nome da pessoa (a automação exige a mesma frase inteira).
 * Sem ponto / ! / ? no fim — igual ao que a campanha aceita em "frase que inicia o robô".
 */
export const WA_PREFILL_NUTRI_EMPRESARIA =
  'Acabei de me inscrever na aula Nutri para Empresaria e quero receber o acesso e os lembretes'

/** Alias para colar no gatilho da automação (é o mesmo texto da mensagem). */
export const WA_TRIGGER_NUTRI_EMPRESARIA = WA_PREFILL_NUTRI_EMPRESARIA

export function primeiroNomeCompleto(nome: string) {
  const t = nome.trim().split(/\s+/).filter(Boolean)
  return t[0] || ''
}

/** O nome é ignorado de propósito — a mensagem tem de ser idêntica para todas. */
export function buildWhatsappPrefillNutriEmpresaria(_fullName: string) {
  return WA_PREFILL_NUTRI_EMPRESARIA
}

export const WORKSHOP_SOURCE_NUTRI_EMPRESARIA = 'workshop_nutri_empresaria_landing_page' as const
