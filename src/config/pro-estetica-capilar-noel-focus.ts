/**
 * Query `?focus=` no Noel do painel Pro Estética capilar (chaves alinhadas ao corporal).
 * Textos em **português do Brasil** (mensagem inicial enviada ao modelo).
 */
export type ProEsteticaCapilarNoelFocus =
  | 'atrair'
  | 'responder'
  | 'reativar'
  | 'destravar'
  | 'ret_faltou'
  | 'ret_confirmar'
  | 'ret_pos'

export const PRO_ESTETICA_CAPILAR_NOEL_FOCUS_PARAM = 'focus'

export const PRO_ESTETICA_CAPILAR_NOEL_FOCUS_MESSAGES: Record<ProEsteticaCapilarNoelFocus, string> = {
  atrair:
    'Quero ideias para atrair clientes para estética capilar (queixa, cronograma, retorno). Sugira temas para esta semana e uma legenda pronta com CTA consultivo.',
  responder:
    'No WhatsApp, quando a cliente pergunta preço ou some, quero respostas curtas e naturais no meu tom, para o nicho capilar.',
  reativar:
    'Tenho clientes que sumiram ou não voltaram. Quero mensagens para reativar sem ser insistente, no contexto de terapia capilar.',
  destravar:
    'Me ajude a responder quem pediu preço e parou de responder — mensagens curtas no meu tom, para tratamento capilar.',
  ret_faltou:
    'Uma cliente faltou ou sumiu depois de marcar. Preciso de uma mensagem curta no WhatsApp para reativar com educação.',
  ret_confirmar:
    'Quero uma mensagem leve para confirmar a próxima sessão sem parecer automática nem insistente.',
  ret_pos:
    'Preciso de uma mensagem de pós-atendimento depois da sessão capilar, com próximo passo claro e sem pressão.',
}

const FOCUS_KEYS = new Set<string>(Object.keys(PRO_ESTETICA_CAPILAR_NOEL_FOCUS_MESSAGES))

export function isProEsteticaCapilarNoelFocus(v: string | null): v is ProEsteticaCapilarNoelFocus {
  return Boolean(v && FOCUS_KEYS.has(v))
}
