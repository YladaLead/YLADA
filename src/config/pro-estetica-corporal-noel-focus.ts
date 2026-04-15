/**
 * Query `?focus=` no Noel do painel Pro Estética corporal.
 * Início: 3 dores · Retenção: 3 execuções (mensagens prontas com contexto).
 */
export type ProEsteticaCorporalNoelFocus =
  | 'atrair'
  | 'responder'
  | 'reativar'
  /** Tela Ritmo: gargalo típico após preço — destravar com Noel. */
  | 'destravar'
  | 'ret_faltou'
  | 'ret_confirmar'
  | 'ret_pos'

export const PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM = 'focus'

export const PRO_ESTETICA_CORPORAL_NOEL_FOCUS_MESSAGES: Record<ProEsteticaCorporalNoelFocus, string> = {
  atrair:
    'Quero ideias do que postar para atrair clientes para minha clínica de estética. Sugere temas para esta semana e uma legenda pronta com CTA.',
  responder:
    'Não sei sempre o que responder no WhatsApp quando a cliente pergunta preço ou demora para decidir. Quero mensagens curtas e naturais para conduzir.',
  reativar:
    'Tenho clientes que sumiram ou não voltaram. Quero mensagens para reativar sem ser insistente.',
  destravar:
    'Vamos destravar isso agora. Ajuda-me a responder quem pediu preço e parou de responder — quero mensagens curtas e certeiras no meu tom.',
  ret_faltou:
    'Uma cliente faltou à sessão ou sumiu depois de marcar. Preciso de uma mensagem curta no WhatsApp para reativar com educação, sem soar cobrando.',
  ret_confirmar:
    'Quero uma mensagem leve para confirmar a próxima sessão da cliente sem parecer insistente nem automática.',
  ret_pos:
    'Preciso de uma mensagem de pós-atendimento para enviar depois da sessão, mantendo a cliente engajada e o próximo passo claro.',
}

const FOCUS_KEYS = new Set<string>(Object.keys(PRO_ESTETICA_CORPORAL_NOEL_FOCUS_MESSAGES))

export function isProEsteticaCorporalNoelFocus(v: string | null): v is ProEsteticaCorporalNoelFocus {
  return Boolean(v && FOCUS_KEYS.has(v))
}
