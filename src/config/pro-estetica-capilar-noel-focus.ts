/**
 * Query `?focus=` no Noel do painel Pro Estética capilar (alinhado às chaves do corporal para rotas futuras).
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
    'Quero ideias para atrair clientes para estetica capilar (queixa, cronograma, retorno). Sugere temas para esta semana e uma legenda pronta com CTA consultivo.',
  responder:
    'No WhatsApp, quando a cliente pergunta preco ou some, quero respostas curtas e naturais no meu tom, para nicho capilar.',
  reativar:
    'Tenho clientes que sumiram ou nao voltaram. Quero mensagens para reativar sem ser insistente, no contexto capilar.',
  destravar:
    'Ajuda-me a responder quem pediu preco e parou de responder — mensagens curtas no meu tom, para tratamento capilar.',
  ret_faltou:
    'Uma cliente faltou ou sumiu depois de marcar. Preciso de uma mensagem curta no WhatsApp para reativar com educacao.',
  ret_confirmar:
    'Quero uma mensagem leve para confirmar a proxima sessao sem parecer automatica nem insistente.',
  ret_pos:
    'Preciso de uma mensagem de pos-atendimento depois da sessao capilar, com proximo passo claro e sem pressao.',
}

const FOCUS_KEYS = new Set<string>(Object.keys(PRO_ESTETICA_CAPILAR_NOEL_FOCUS_MESSAGES))

export function isProEsteticaCapilarNoelFocus(v: string | null): v is ProEsteticaCapilarNoelFocus {
  return Boolean(v && FOCUS_KEYS.has(v))
}
