/**
 * Item 3 da Fase 2 (Plano A): o Noel coleta o WhatsApp NA HORA DA AÇÃO, não na
 * entrada. A guarda do `/pt/home` foi liberada (Plano A), então o usuário entra
 * sem WhatsApp; quem precisa do dado (gerar o 1º link/handoff) pede na conversa
 * (§9.3 r49 — captura mínima, o dado acende pela ação, não por formulário).
 *
 * Peças PURAS (sem I/O, sem IA — testáveis em `coleta-contato-na-acao.casos.ts`):
 *   1. `construirBlocoColetaContatoParaPrompt` — instrução pro system prompt do
 *      `/api/ylada/noel` pedir o WhatsApp no momento certo, na voz do Andre.
 *   2. `noelPediuWhatsapp` — leu o histórico: a ÚLTIMA fala do Noel pediu o número?
 *   3. `extrairWhatsappDaMensagem` — número BR válido (10–13 dígitos) numa mensagem.
 *   4. `capturarWhatsappSeNoelPediu` — só devolve número quando o Noel ACABOU de
 *      pedir (lê o histórico; NÃO pesca número solto). É a trava do ticket.
 *
 * ⚠️ Copy do MÉTODO (§9.3 r45 tom tranquilo / r49 acende pela ação). "você", frase
 * curta, ZERO travessão de aparte (GUIA_DE_VOZ). Serve antes de pedir.
 * @see blueprint-plataforma/Ticket_Metodo_Noel_Coleta_Contato_Na_Acao.md
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (r49)
 */

/** Normaliza pra detecção: minúsculas, sem acento. */
function semAcento(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

/**
 * Bloco [COLETA DE CONTATO NA AÇÃO] pro system prompt: o Noel pede o WhatsApp no
 * gatilho natural (gerar/entregar o 1º link/handoff), nunca na entrada, e o perfil
 * (ramo/papel) só quando precisar pra personalizar. String vazia se nada falta
 * (chamador não injeta nada).
 */
export function construirBlocoColetaContatoParaPrompt(
  faltaWhatsapp: boolean,
  faltaPerfil: boolean
): string {
  if (!faltaWhatsapp && !faltaPerfil) return ''
  const linhas: string[] = ['\n[COLETA DE CONTATO NA AÇÃO — OBRIGATÓRIO]']
  if (faltaWhatsapp) {
    linhas.push(
      'O profissional ainda NÃO tem WhatsApp cadastrado. NÃO peça o número na abertura nem transforme isso em formulário. ' +
        'Peça o WhatsApp SÓ no momento em que você vai gerar ou entregar o primeiro link, quiz ou handoff (o link precisa do WhatsApp do dono pra receber quem chegar). ' +
        'Peça em UMA linha natural, na voz simples: por exemplo "Antes de eu te entregar o seu link, me passa seu WhatsApp com DDD? É pra onde vão cair os contatos que chegarem." ' +
        'Se a pessoa já tiver passado o número nesta conversa, NÃO peça de novo. O nome já veio do cadastro, não re-pergunte.'
    )
  }
  if (faltaPerfil) {
    linhas.push(
      'Quando você precisar saber o ramo ou o papel da pessoa pra personalizar (não tudo de uma vez), faça UMA pergunta curta e natural no momento certo, conduzindo, sem interrogatório.'
    )
  }
  return linhas.join('\n')
}

/** Marcadores de que a última fala do Noel pediu o WhatsApp (sem acento). */
const MARCADORES_PEDIDO_WHATSAPP: readonly string[] = [
  'whatsapp',
  'whats',
  'seu zap',
  'seu numero',
  'numero com ddd',
  'numero com o ddd',
  'me passa seu',
  'me manda seu',
  'pra onde te mando',
  'pra onde vao cair',
  'contatos que chegarem',
  'contatos que chegar',
]

/**
 * A última fala do Noel pediu o WhatsApp? Lê o texto do assistant. Só com isso
 * verdadeiro é que `capturarWhatsappSeNoelPediu` aceita um número da mensagem
 * seguinte (evita pescar número solto que a pessoa cite por outro motivo).
 */
export function noelPediuWhatsapp(ultimaFalaDoNoel: string | null | undefined): boolean {
  if (!ultimaFalaDoNoel) return false
  const t = semAcento(ultimaFalaDoNoel)
  return MARCADORES_PEDIDO_WHATSAPP.some((m) => t.includes(m))
}

/** Pega o 1º trecho com cara de telefone (dígitos + separadores comuns). */
function trechoTelefone(texto: string): string | null {
  const match = texto.match(/(\+?\d[\d\s().-]{8,17}\d)/)
  return match ? match[1] : null
}

/**
 * Número de WhatsApp BR válido numa mensagem, em dígitos limpos, ou '' se não houver.
 * Aceita 10–11 dígitos (DDD + número) ou 12–13 com o 55 na frente. Cap em 13 pra não
 * casar com IDs longos.
 */
export function extrairWhatsappDaMensagem(texto: string | null | undefined): string {
  if (!texto) return ''
  const trecho = trechoTelefone(texto)
  if (!trecho) return ''
  const digitos = trecho.replace(/\D/g, '')
  if (digitos.length >= 12 && digitos.length <= 13 && digitos.startsWith('55')) return digitos
  if (digitos.length >= 10 && digitos.length <= 11) return digitos
  return ''
}

export type ColetaEntrada = {
  message: string
  conversationHistory?: { role: string; content: string }[]
}

/** Última fala do assistant no histórico (a do Noel), ou null. */
function ultimaFalaAssistant(history?: { role: string; content: string }[]): string | null {
  if (!Array.isArray(history)) return null
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i]?.role === 'assistant') return history[i]?.content ?? null
  }
  return null
}

/**
 * Devolve o WhatsApp da mensagem atual SÓ quando a última fala do Noel pediu o
 * número (a trava do ticket: lê o histórico, não pesca número solto). '' caso
 * contrário.
 */
export function capturarWhatsappSeNoelPediu(entrada: ColetaEntrada): string {
  if (!noelPediuWhatsapp(ultimaFalaAssistant(entrada.conversationHistory))) return ''
  return extrairWhatsappDaMensagem(entrada.message)
}
