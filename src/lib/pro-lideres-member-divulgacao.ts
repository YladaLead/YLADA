/**
 * Comportamento de DIVULGAÇÃO do Noel do membro (campo).
 * Quando o membro pergunta "onde divulgo / o que postar / como espalho", o Noel oferece
 * canais + copy pronta, em vez de gerar um quiz. Bordão: "você cuida das pessoas, eu cuido do material."
 * Atrás da flag NOEL_PL_MEMBER_DIVULGACAO_ENABLED. Só vale no ramo membro da matriz (gated na rota).
 */

export function isNoelPlMemberDivulgacaoEnabled(): boolean {
  return (
    process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED === 'true' ||
    process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED === '1'
  )
}

/**
 * Pedido de DIVULGAR / postar / espalhar (não de criar link/quiz).
 * Ex.: "onde eu divulgo o link", "o que posto hoje", "me dá uma legenda pro story".
 */
export function isDivulgacaoIntent(message: string): boolean {
  const m = message.toLowerCase()
  return /onde (eu )?divulg|como (eu )?divulg|(como|onde) (eu )?espalh|onde (eu )?post|o que (eu )?post|o que (eu )?public|ideia de post|legenda|status do (whats|zap)|stories?|no story|onde (eu )?mando esse|onde compartilh|como compartilh|divulgar (o|esse|meu|um) link/i.test(
    m
  )
}

/** Bloco injetado no prompt quando o pedido é de divulgação (não gerar quiz). */
export function construirBlocoDivulgacaoParaPrompt(): string {
  return `[DIVULGAÇÃO — VOCÊ CUIDA DO MATERIAL, ELA CUIDA DAS PESSOAS]
A pessoa quer DIVULGAR/postar, NÃO criar um novo quiz. NÃO gere link nem quiz nesta resposta.
Ofereça, em prosa curta, ONDE e COMO espalhar, já com a COPY PRONTA (pra copiar e colar):
- Instagram (post/story): 1 gancho de dor curto + CTA que leva pro link ou pra DM.
- Status do WhatsApp: 1 frase curiosa e curta que gera clique pelo mistério.
- Reativação: mensagem pessoal e calorosa pra cliente que sumiu, sem cara de venda.
Pergunte em qual canal ela quer começar e entregue a copy pronta daquele canal. Produto nunca na frente.
Bordão: "você cuida das pessoas, eu cuido do material."`
}
