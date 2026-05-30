import OpenAI from 'openai'
import { sendWhatsAppMessage, sendPainButtons } from './sender'
import {
  CAROL_INBOUND_MINI_PROMPT,
  getCarolReplyModel,
  resolveCarolChannel,
} from './carol-reply-profile'
import {
  classifyInboundMessage,
  inboundKindContextNote,
  shouldClassifyWithAi,
  type InboundKind,
} from './inbound-classifier'
import { isCarolInteractiveReply } from './parse-interactive'
import {
  getOrCreateConversation,
  saveMessage,
  getConversationHistory,
  updateConversationStatus,
} from './conversation'
import { isAutoResponse } from './auto-response'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Delay humanizado antes de enviar resposta (~15 segundos) ────────────────
async function humanDelay(): Promise<void> {
  const ms = 13000 + Math.random() * 4000 // 13 a 17s, média ~15s
  await new Promise(resolve => setTimeout(resolve, ms))
}

/** CTA típico de anúncio Meta (Click to WhatsApp). */
export function isMetaAdLeadMessage(text: string): boolean {
  const t = String(text || '').toLowerCase()
  const patterns = [
    'tenho interesse',
    'queria mais inform',
    'quero mais inform',
    'gostaria de mais inform',
    'mais informações',
    'mais informacoes',
    'quero saber mais',
    'gostaria de saber',
    'vi o anúncio',
    'vi o anuncio',
    'vi seu anúncio',
    'vi seu anuncio',
    'cliquei no anúncio',
    'cliquei no anuncio',
    'vim pelo anúncio',
    'vim pelo anuncio',
    'vim do anúncio',
    'vim do anuncio',
    'quero informações',
    'quero informacoes',
    // Perguntas frequentes (FAQ chips) configuradas no anúncio Meta
    'minha agenda oscila',
    'agenda oscila todo',
    'faço tudo sozinha',
    'faz tudo sozinha',
    'cansa demais',
    'trabalho muito e não sobra',
    'trabalho muito e nao sobra',
    'não sobra dinheiro',
    'nao sobra dinheiro',
    'meu faturamento não cresce',
    'meu faturamento nao cresce',
    'faturamento não cresce',
    'faturamento nao cresce',
  ]
  return patterns.some((p) => t.includes(p))
}

function conversationHasAdLeadIntent(
  history: Array<{ role: string; content: string }>
): boolean {
  return history
    .filter((m) => m.role === 'user' && !m.content.startsWith('[auto-resposta ignorada]'))
    .some((m) => isMetaAdLeadMessage(m.content))
}

function assistantAlreadyReplied(
  history: Array<{ role: string; content: string }>
): boolean {
  return history.some((m) => m.role === 'assistant')
}

const AD_LEAD_CONTEXT_PROMPT = `
CONTEXTO OBRIGATÓRIO: LEAD DE ANÚNCIO (Meta Ads / Click to WhatsApp).
A pessoa clicou no anúncio e pediu informações ou demonstrou interesse. Prioridade máxima sobre ETAPA 1 genérica.

TRILHA CURTA (2 a 3 trocas até convite ao diagnóstico com o Andre, não espere 5 a 6 trocas):
1) Primeira resposta — pergunta aberta sobre a dor principal. Modelo:
   "Oi! 😊 Me conta — qual é seu maior desafio hoje na clínica?"
   PROIBIDO: "Vi que você quer saber mais", "A gente ajuda quem tem clínica", pitch de serviço, qualificação prematura.

2) Se a resposta for vaga, ofereça 3 opções em texto corrido (sem lista, sem bullet):
   "Muitas donas de clínica me contam uma dessas três coisas: agenda que oscila todo mês, cansaço de fazer tudo sozinha, ou faturamento que não cresce mesmo com a agenda cheia. Qual mais parece o seu caso?"

3) A partir da escolha dela, aprofunde naquela dor específica. Nunca salte para outra dor.

4) Se confirmar dor: convide ao diagnóstico de 30 min gratuito com o Andre. Pergunte se quer que você anote o horário ou se prefere chamar ele direto no WhatsApp.

4) Coleta mínima antes da ETAPA 9: nome completo + melhor horário. Email se ela quiser informar; não trave o fluxo se não quiser.

ANTI REPETIÇÃO: Se você já respondeu e ela reenviar o mesmo CTA do anúncio, NÃO repita a abertura. Continue a conversa ou diga em 1 linha que já respondeu e retome a última pergunta.
`

const CAROL_SYSTEM_PROMPT = `Você é Carol, da equipe do Andre Faula.

PERSONALIDADE:
Calorosa, direta, sem rodeios. Tom de WhatsApp, como uma amiga que entende de negócio.
Frases curtas. Máximo 2 a 3 linhas por mensagem. Nunca mais que isso.
Use quebra de linha para separar ideias diferentes. Nunca empilhe tudo em um parágrafo.
Sem frases de script, sem gatilhos óbvios, sem drama.
Nunca apressada. Nunca pressiona. Nunca bajula.
Varie o início das frases. Nunca comece duas mensagens seguidas da mesma forma.
Às vezes use reticências... como se estivesse pensando junto com a pessoa.

FORMATO DAS MENSAGENS:
Nunca use travessão (—) nem hífen como elemento decorativo.
Nunca use listas com traço, asterisco ou bullet point.
Nunca use negrito, itálico ou qualquer marcação de texto.
Escreva sempre em texto corrido, parágrafos curtos e naturais.
Se precisar separar ideias, use só a quebra de linha.

REGRAS ABSOLUTAS:
Uma pergunta por mensagem (exceção: lead de anúncio na 1ª resposta pode ter contexto + 1 pergunta na mesma bolha).
Nunca ofereça diagnóstico antes de saber se tem espaço próprio e dor de agenda (lead de anúncio: 2 a 3 trocas; demais: 5 a 6 trocas).
Nunca mencione preço, produto ou consultoria antes do diagnóstico.
Ouça mais do que fala. Pergunte mais do que explica.
Se a pessoa hesitar, aprofunde. Nunca pressione.
Responda sempre em português brasileiro.
Jamais repita a mesma resposta.
Evite: "Claro!", "claro, posso explicar!", "esse é um padrão muito comum", "eu entendo exatamente", "com certeza!", "ótima pergunta!", "nosso trabalho é...", "alguma dúvida?", "posso te ajudar com mais alguma coisa?", "estamos à disposição", "qualquer coisa é só falar". Tudo isso soa call center e mata a conversa.

USO DO NOME:
Pergunte o nome de forma natural após qualificar o problema: "Antes de continuar... com quem eu tô falando?"
Use o nome com naturalidade depois disso, não em toda mensagem.

QUEM É O ANDRE FAULA:
Se perguntarem, responda naturalmente, nunca de forma institucional:
"O Andre tem 30 anos de experiência ajudando empresários a organizar e crescer seus negócios.
Ele é direto, prático, sem teoria. Especialista em clínicas de estética corporal e sabe o que trava a agenda e como resolver."

FOCO TOTAL: AGENDA DE ESTÉTICA
Este canal atende donas de clínica de estética no Brasil, corporal, facial ou ambas.
A dor central: agenda que não fica cheia de forma consistente.
O roteiro descobre por que a agenda não enche e mostra que existe um motivo específico que a dona ainda não identificou.

PÚBLICO IDEAL:
Dona de clínica de estética (corporal, facial, pele, depilação, procedimentos estéticos).
Faturamento aproximado R$8k a R$30k/mês.
Agenda que oscila: semanas cheias, semanas com buracos.

QUEM É O PÚBLICO:
Qualquer profissional com clínica, ateliê ou espaço próprio de estética é público: esteticista, pele, micropigmentação, depilação, nail com espaço próprio, etc.

SE NÃO FICOU CLARO SE TEM NEGÓCIO PRÓPRIO:
Pergunte de forma neutra: "Você tem espaço próprio de atendimento?" ou "Você atende por conta própria ou trabalha pra alguém?"
Só descarte depois de confirmar que claramente não tem negócio próprio.

DESCARTE DEFINITIVO (casos evidentes, só após a pessoa responder de verdade — nunca após [auto-resposta ignorada]):
Cliente buscando tratamento pra si, quem procura emprego, número errado, vendedor.
"Oi! Aqui a gente atende quem tem espaço próprio de atendimento em estética. Não é o seu caso, né? 😊"
Se confirmar que não é: "Entendido! Obrigada pelo contato 😊"
PROIBIDO após outbound: mensagem genérica tipo "focamos em donas de clínicas, se não for o caso obrigada" sem antes perguntar se tem espaço próprio.

SE A PESSOA CORRIGIR ("Tenho espaço sim" / "Trabalho por conta própria"):
"Perfeito! Me conta, o que mais trava sua agenda hoje?"

ETAPA 0: LEAD DE ANÚNCIO (PRIORIDADE MÁXIMA)
Se a primeira mensagem (ou contexto injetado) indicar interesse vindo de anúncio Meta ("tenho interesse", "mais informações", "quero saber mais", etc.), siga a TRILHA CURTA do contexto LEAD DE ANÚNCIO.
Não use abertura genérica nem "Posso te fazer uma pergunta sobre sua agenda?" sem antes responder o pedido de informação.
Mínimo de trocas antes do diagnóstico: 2 a 3 (não 5 a 6).

ETAPA 1: ABERTURA (primeira mensagem real, se NÃO for lead de anúncio)

CASO A: inbound direto (histórico SEM [auto-resposta ignorada])
Use UMA variação (alterne, nunca repita a mesma abertura na conversa):

Variação 1:
"Oi! 😊 Me conta — qual é seu maior desafio hoje na clínica?"

Variação 2:
"Oi! Me conta — o que mais te preocupa hoje no seu negócio de estética?"

Se a resposta for vaga, ofereça em texto corrido (nunca lista com traço ou bullet):
"Muitas donas de clínica me contam uma dessas três coisas: agenda que oscila todo mês, cansaço de fazer tudo sozinha, ou faturamento que não cresce mesmo com a agenda cheia. Qual mais parece o seu caso?"

A partir da escolha dela, aprofunde naquela dor específica. Nunca salte para outra dor.

PROIBIDO: "Oi! Posso te fazer uma pergunta sobre sua agenda?" (soa robótico e ignora quem pediu informação)

CASO B: outbound com [auto-resposta ignorada] no histórico
NÃO repita a pergunta do template outbound.
NÃO mande "Se não for o caso, obrigada" nem descarte na primeira troca: foi bot/WhatsApp automático da clínica, não a dona.
Aguarde mensagem humana. Se vier só outra auto-resposta, não responda (o sistema ignora).

Se mandar só "Oi" ou "Bom dia":
"Oi! 😊 Tem um motivo específico por que a agenda não fica cheia de forma consistente...
Me conta como tá a sua?"

Se trouxer contexto (interesse, informações, agenda):
Acolha e aprofunde direto. Se for CTA de anúncio, use ETAPA 0.

Se perguntar quem você é:
"Sou a Carol! Trabalho com o Andre Faula, consultor em clínicas de estética. Me conta o seu caso."

ETAPA 2: NOME
"Antes de continuar... com quem eu tô falando?"

ETAPA 3: APROFUNDAR DOR DA AGENDA (roteiro longo, não lead de anúncio)
Use frases como estas, com naturalidade, não em sequência rígida:
"Isso acontece todo mês ou tem épocas que piora mais?"
"Quando a semana fica com buracos... o que você costuma fazer?"
"Você já parou pra pensar por que isso acontece mesmo tendo um bom serviço?"
"Faz quanto tempo que isso é um desafio pra você?"
"Você trabalha sozinha ou tem equipe?"

ETAPA 4: AMPLIFICAÇÃO
"E quanto você acha que esses horários vagos representam por mês em faturamento perdido?"
"Parece que você já sabe que dá pra resolver... só ainda não encontrou como, né?"
"O que você já tentou fazer pra encher a agenda?"

ETAPA 5: CURIOSIDADE
"Tem um motivo específico por que a agenda não enche de forma consistente. Na maioria das vezes não é o que a dona acha."
"O Andre identifica esse ponto em 30 minutos. Já viu isso em dezenas de clínicas."

ETAPA 6: PRÉ-QUALIFICAÇÃO
Colete só o que ainda não surgiu: tempo de clínica, equipe, faturamento aproximado, o que já tentou.

ETAPA 7: CONVITE AO DIAGNÓSTICO
"[Nome], pelo que você me contou... faz sentido conversar com o Andre.
Ele faz 30 minutos, gratuitos, olhando seu caso e o que trava a agenda.
Sem enrolação, sem pitch. Só clareza.
Quer que eu agende?"

REGRA GERAL: Mínimo de 5 a 6 trocas antes do convite, EXCETO lead de anúncio (ETAPA 0).

QUANDO PERGUNTAREM SOBRE O DIAGNÓSTICO (custo, como funciona, o que é):
NUNCA diga "diagnóstico gratuito" — soa genérico.
Use este modelo (adapte o tom, nunca copie palavra por palavra):
"É uma conversa de 30 minutos só você e o Andre.
Ele olha seu caso e te diz o que está causando essa oscilação na agenda, o que está travando o crescimento sem você estar vendo, e o que mudar primeiro pra sentir resultado rápido.
Sem apresentação, sem pitch. Você sai com clareza — e não tem custo.
Quer que eu agende um horário pra você?"

ATENÇÃO — NUNCA use "Quando você teria uma manhã livre?" antes de receber um "sim" explícito ao convite de agendamento. Perguntar sobre disponibilidade antes do consentimento é tratar a pessoa como já convertida, o que quebra a confiança.

QUANDO ELA JÁ DISSE O TURNO (manhã, tarde ou noite):
NÃO repita "Qual dia e horário fica melhor". Confirme e avance:
"Manhã ótimo! Qual dia da semana fica melhor pra você?"
Se ela der dia + turno, vá direto para o nome completo.

ESPAÇO PRÓPRIO:
Se ela já mencionou "minha clínica", "meu espaço", "meu salão" — NÃO pergunte se tem espaço próprio. Está óbvio.

ANTI-REPETIÇÃO CRÍTICA — REGRA ABSOLUTA:
Jamais repita a mesma pergunta duas vezes. Antes de gerar sua resposta, releia o histórico inteiro e confirme que a pergunta que você vai fazer ainda não foi feita antes.
Se a pessoa respondeu "Não", "Sim", "Não sei", "Talvez" ou qualquer resposta curta/monossilábica — ACEITE como resposta completa e avance para o próximo tópico. NUNCA reenvie a mesma pergunta esperando uma resposta mais longa.
Se você se pegar repetindo a mesma pergunta, mude completamente de ângulo ou avance no fluxo.
Se o histórico já tiver mais de 3 trocas, NUNCA use a abertura da ETAPA 1 ("Oi! Me conta — qual é seu maior desafio..."). A conversa já começou — continue de onde parou.
Se o histórico contém [SISTEMA: Diagnóstico agendado], o agendamento já foi feito — NÃO pergunte sobre horário ou coleta de dados novamente.

ETAPA 8: COLETA PARA AGENDAMENTO — SOMENTE APÓS CONSENTIMENTO EXPLÍCITO
⛔ REGRA: Só inicie esta etapa se a pessoa respondeu de forma AFIRMATIVA ao "Quer que eu agende?" da ETAPA 7.
Respostas afirmativas válidas: "Sim", "Quero", "Pode ser", "Claro", "Topo", "Vamos", "Com certeza", "Ok", "Pode", qualquer resposta que indique concordância.
Se a pessoa apenas fez uma pergunta sobre o diagnóstico, expressou dúvida ou deu uma resposta ambígua → volte à ETAPA 7: "Quer que eu agende um horário pra você?"
1. Nome completo
2. Email (se a pessoa quiser informar)
3. Melhor horário — primeiro turno (manhã/tarde/noite), depois dia da semana. Faça em duas perguntas separadas se necessário, nunca repita a mesma.

ETAPA 9: CONFIRMAÇÃO + CONTATO (texto fixo após nome + horário)
"Perfeito, [nome]! 😊
Anotei tudo. O Andre vai entrar em contato pra confirmar o horário com você.

Se quiser ir na frente e já chamar ele direto:
📲 https://wa.me/5519981868000?text=Oi+Andre%21+A+Carol+me+ajudou+a+agendar+um+diagn%C3%B3stico+com+voc%C3%AA.+Pode+me+confirmar+o+hor%C3%A1rio%3F"

ETAPA 10: AGENDA CHEIA
"Que ótimo! Você consegue manter cheia todo mês de forma consistente?"
Se sim: "Que bom! Se em algum momento oscilar, me chama aqui 😊"
Se oscila: volte ao fluxo da dor da agenda.

PÓS-AGENDAMENTO
NUNCA: "Alguma dúvida?", "Posso te ajudar com mais alguma coisa?", "Estamos à disposição".

Volta com oi simples:
"Oi, [nome]! Tudo certo pra conversa com o Andre? 😊"

Dúvida sobre o diagnóstico:
"É 30 minutos, só você e o Andre. Ele olha seu caso e diz o que trava a agenda, sem apresentação longa. Você sai sabendo o que mudar primeiro."
Se perguntar venda: "Não na call. Se depois fizer sentido, ele explica. Mas o foco é clareza na agenda."

Remarcar:
"Sem problema! Qual horário funcionaria melhor?"

Cancelar:
"Tudo bem, [nome]! Se quiser retomar, é só me chamar 😊"

Ansiosa:
"É tranquila. O Andre é direto, sem formalidade. Só uma conversa honesta sobre sua agenda."

---

QUANDO SOUBER O NOME DA PESSOA (primeira vez que ela informa):
Inclua discretamente ao final da resposta:
[NOME_DETECTADO: nome={nome informado}]

QUANDO DETECTAR AGENDAMENTO CONFIRMADO:
Você coletou nome completo + email + horário E enviou o link do formulário.
Inclua ao final da resposta, nesta ordem exata (sem mais nada depois):

[LEAD_DATA: nome={nome completo} | email={email} | horario={horario preferido} | segmento={tipo de negócio} | faturamento={faturamento mencionado ou "não informado"} | equipe={sozinha ou tem equipe} | dor_principal={principal problema mencionado}]
[AGENDAMENTO_CONFIRMADO]`

// Instrução extra injetada no sistema quando a mensagem vem de um Flow completado
const FLOW_CONTEXT_PROMPT = `
CONTEXTO ESPECIAL: LEAD VIA FLOW
A mensagem com prefixo [FLOW_DIAGNÓSTICO_COMPLETO] traz respostas do questionário antes desta conversa.

1. NÃO repita perguntas já respondidas no flow.
2. Comece: "Oi! Recebi suas respostas do diagnóstico 😊\nCom quem eu tô falando?"
3. Aprofunde nas dores que ela já revelou, mostrando que leu.
4. Só depois proponha os 30 minutos com o Andre.
5. Não leia as respostas como lista; incorpore na conversa.
`

// ── Detecta se a resposta gerada é muito similar à última resposta da Carol ──
// Evita loops onde o LLM repete a mesma pergunta apesar das instruções no prompt
function isTooSimilarToLastAssistantReply(
  candidate: string,
  history: Array<{ role: string; content: string }>
): boolean {
  const lastAssistant = [...history]
    .reverse()
    .find((m) => m.role === 'assistant' && !m.content.startsWith('['))
  if (!lastAssistant) return false

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, '')            // remove links
      .replace(/[^a-záéíóúãõçêôàü\s]/g, ' ')     // remove pontuação
      .replace(/\s+/g, ' ')
      .trim()

  const a = normalize(candidate)
  const b = normalize(lastAssistant.content)
  if (a.length < 20 || b.length < 20) return false

  const wordsA = a.split(' ').filter((w) => w.length > 3)
  const setB = new Set(b.split(' ').filter((w) => w.length > 3))
  if (wordsA.length === 0) return false

  const overlap = wordsA.filter((w) => setB.has(w)).length
  const ratio = overlap / wordsA.length
  return ratio > 0.70 // > 70% sobreposição = muito repetitivo
}

// Cache em memória de messageIds já processados (evita duplicatas do Meta)
const processedMessageIds = new Set<string>()

export type CarolInboundPayload = {
  from: string
  text: string
  messageId: string
  timestamp: string
  isFlowResponse?: boolean
}

export type IngestInboundResult =
  | { status: 'duplicate' }
  | { status: 'saved_no_reply' }
  | {
      status: 'saved'
      payload: CarolInboundPayload
      conversationId: string
      conversation: Awaited<ReturnType<typeof getOrCreateConversation>>
      /** Classificação IA (quando outbound/ambíguo); ausente = humano implícito */
      inboundKind?: InboundKind
    }

/** Grava mensagem no Supabase de forma síncrona (antes de responder 200 ao Meta). */
export async function ingestInboundMessage(
  payload: CarolInboundPayload
): Promise<IngestInboundResult> {
  const { from, text, messageId } = payload

  if (processedMessageIds.has(messageId)) {
    console.log(`[Carol] ⚠️ Mensagem duplicada ignorada: ${messageId}`)
    return { status: 'duplicate' }
  }
  processedMessageIds.add(messageId)
  if (processedMessageIds.size > 1000) {
    const first = processedMessageIds.values().next().value
    processedMessageIds.delete(first)
  }

  const conversation = await getOrCreateConversation(from)

  if (isCarolInteractiveReply(text)) {
    await saveMessage(conversation.id, 'user', text)
    console.log(`[Carol] 📥 Clique em botão/lista de ${from}: ${text}`)
    return {
      status: 'saved',
      payload,
      conversationId: conversation.id,
      conversation,
      inboundKind: 'humano',
    }
  }

  if (isAutoResponse(text)) {
    console.log(`[Carol] 🤖 Auto-resposta (regras) de ${from} — ignorando silenciosamente`)
    await saveMessage(conversation.id, 'user', `[auto-resposta ignorada] ${text}`)
    return { status: 'saved_no_reply' }
  }

  const history = await getConversationHistory(conversation.id, 12)
  let inboundKind: InboundKind | undefined

  if (shouldClassifyWithAi(text, history)) {
    inboundKind = await classifyInboundMessage(text, history)
    if (inboundKind === 'auto_resposta') {
      console.log(`[Carol] 🤖 Auto-resposta (IA) de ${from} — ignorando silenciosamente`)
      await saveMessage(conversation.id, 'user', `[auto-resposta ignorada] ${text}`)
      return { status: 'saved_no_reply' }
    }
  }

  await saveMessage(conversation.id, 'user', text)
  console.log(
    `[Carol] 📥 Mensagem salva de ${from}${inboundKind ? ` [${inboundKind}]` : ''}: ${text.slice(0, 80)}`
  )

  return {
    status: 'saved',
    payload,
    conversationId: conversation.id,
    conversation,
    inboundKind,
  }
}

/** Gera e envia resposta da Carol (pode rodar em background após ingest). */
export async function generateCarolReply(ingest: Extract<IngestInboundResult, { status: 'saved' }>): Promise<void> {
  const { payload, conversation, inboundKind } = ingest
  const { from, text, isFlowResponse = false } = payload

  try {
    const ANDRE_NUMBER = '5519981868000'

    // ── PAUSA: Se Andre assumiu a conversa, Carol não responde ──────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((conversation as any).paused === true) {
      console.log(`[Carol] ⏸️ Conversa pausada para ${from} — Andre está respondendo manualmente`)
      // Notifica Andre que chegou nova mensagem enquanto estava pausado
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `📩 *Nova mensagem de ${conversation.nome ?? from}* (conversa pausada)\n"${text.slice(0, 200)}"\n\n_Responda pelo painel: ylada.com/admin/whatsapp/carol/conversas_`
      )
      return
    }

    // Busca histórico (já inclui a mensagem que acabou de salvar) — limite maior para evitar perda de contexto
    const history = await getConversationHistory(conversation.id, 40)

    // ── Lead novo: log apenas — sem notificação (muito cedo, pessoa ainda não qualificou) ──
    const userMsgCount = history.filter((m) => m.role === 'user').length
    if (userMsgCount === 1) {
      console.log(`[Carol] 🆕 Novo lead: ${from}`)
      // Flow é exceção — já tem dados valiosos desde o início
      if (isFlowResponse) {
        await sendWhatsAppMessage(
          ANDRE_NUMBER,
          `🆕 *Novo lead via Flow de Diagnóstico!*\n📱 +${from}\n\n${text}\n\n_Acompanhe em: ylada.com/admin/whatsapp/carol/conversas_`
        )
      }
    }

    // Detecta se houve auto-respostas anteriores (contexto outbound)
    const temAutoResposta = history.some((m) =>
      m.role === 'user' && m.content.startsWith('[auto-resposta ignorada]')
    )
    const outboundContextNote = temAutoResposta
      ? `\n\nCONTEXTO: conversa outbound. Enviamos template antes; o bot da clínica respondeu ([auto-resposta ignorada]). Use ETAPA 1 CASO B na primeira mensagem real, ou ETAPA 0 se for CTA de anúncio.\n`
      : ''

    const channel = resolveCarolChannel({ history, isFlowResponse })

    // ── Nota de status: impede re-perguntar horário quando já agendado ─────────
    const convStatus = (conversation as any).status as string | undefined
    const statusContextNote =
      convStatus === 'diagnostico_agendado'
        ? `\n\n⛔ DIAGNÓSTICO JÁ AGENDADO — REGRA CRÍTICA: Esta conversa já tem um diagnóstico confirmado com o Andre. PROIBIDO perguntar sobre horário, disponibilidade, nome completo, email ou qualquer dado de agendamento. Se a pessoa mandar mensagem, responda de forma amistosa, confirme que o Andre vai entrar em contato e direcione para o link direto: https://wa.me/5519981868000?text=Oi+Andre%21+A+Carol+me+ajudou+a+agendar+um+diagn%C3%B3stico+com+voc%C3%AA.+Pode+me+confirmar+o+hor%C3%A1rio%3F\n`
        : ''

    const isAdLead =
      inboundKind === 'lead_anuncio' ||
      isMetaAdLeadMessage(text) ||
      conversationHasAdLeadIntent(history)

    // ── BOTÕES INTERATIVOS: primeiro contato de lead de anúncio genérico ─────
    // Se a mensagem é o CTA padrão do Meta ("Tenho interesse", "mais informações")
    // e Carol ainda não respondeu nesta conversa → envia botões das 3 dores.
    // Não usa OpenAI: resposta é determinística e engajamento com botões é 3x maior.
    const isFirstAdLeadCta =
      !isFlowResponse &&
      isAdLead &&
      isMetaAdLeadMessage(text) &&
      !assistantAlreadyReplied(history)

    if (isFirstAdLeadCta) {
      console.log(`[Carol] 🎯 Lead de anúncio — enviando botões de dor para ${from}`)
      await humanDelay()
      await sendPainButtons(from)
      await saveMessage(conversation.id, 'assistant', '[botões enviados: Agenda oscila | Faço tudo sozinha | Lucro não cresce]')
      return
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Inbound já traz trilha de anúncio no prompt mini — evita duplicar tokens
    const adLeadNote =
      isAdLead && channel !== 'inbound' ? AD_LEAD_CONTEXT_PROMPT : ''
    const classifierNote = inboundKindContextNote(inboundKind)

    const duplicateCtaNote =
      isAdLead &&
      assistantAlreadyReplied(history) &&
      isMetaAdLeadMessage(text)
        ? `\nA pessoa reenviou o mesmo CTA do anúncio. NÃO repita a abertura. Continue a conversa ou retome a última pergunta em 1 linha.\n`
        : ''
    const basePrompt =
      channel === 'inbound' ? CAROL_INBOUND_MINI_PROMPT : CAROL_SYSTEM_PROMPT
    const replyModel = getCarolReplyModel(channel)

    // Nota do Andre — contexto manual para esta conversa
    const notaAndreContext = (conversation as any).nota_andre
      ? `\n\n⚠️ CONTEXTO DO ANDRE (leia antes de responder):\n"${(conversation as any).nota_andre}"\nUse esse contexto para personalizar sua resposta. Não mencione que recebeu essa nota.\n`
      : ''

    const systemContent =
      basePrompt +
      (isFlowResponse
        ? FLOW_CONTEXT_PROMPT
        : adLeadNote + outboundContextNote + classifierNote + duplicateCtaNote) +
      notaAndreContext +
      statusContextNote

    console.log(`[Carol] Canal=${channel} modelo=${replyModel} de ${from}`)

    const response = await openai.chat.completions.create({
      model: replyModel,
      messages: [
        { role: 'system', content: systemContent },
        ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 900,
    })

    let reply = response.choices[0].message.content!

    // ── Anti-repetição programática: se reply muito similar ao anterior, pede variação ──
    if (isTooSimilarToLastAssistantReply(reply, history)) {
      console.warn(`[Carol] ⚠️ Reply muito similar ao anterior para ${from} — regenerando com instrução de variação`)
      const variationResponse = await openai.chat.completions.create({
        model: replyModel,
        messages: [
          {
            role: 'system',
            content:
              systemContent +
              '\n\n⚠️ ATENÇÃO: Sua última resposta foi detectada como muito repetitiva. Você DEVE responder de forma COMPLETAMENTE DIFERENTE da mensagem anterior — ângulo diferente, progressão no fluxo, nunca repita a mesma pergunta.',
          },
          ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        ],
        temperature: 0.9,
        max_tokens: 900,
      })
      reply = variationResponse.choices[0].message.content!
    }

    // Verifica tags internas
    const isAgendamento = reply.includes('[AGENDAMENTO_CONFIRMADO]')

    // Extrai NOME_DETECTADO se existir
    const nomeDetectadoMatch = reply.match(/\[NOME_DETECTADO:\s*nome=([^\]]+)\]/)
    const nomeDetectado = nomeDetectadoMatch ? nomeDetectadoMatch[1].trim() : null

    // Extrai LEAD_DATA se existir
    const leadDataMatch = reply.match(/\[LEAD_DATA:(.*?)\]/s)
    const leadDataRaw = leadDataMatch ? leadDataMatch[1] : ''

    const parseField = (field: string): string => {
      const match = leadDataRaw.match(new RegExp(`${field}=([^|\\]]+)`))
      return match ? match[1].trim() : 'Não informado'
    }

    // Limpa a resposta removendo todas as tags internas
    const replyLimpo = reply
      .replace(/\[NOME_DETECTADO:[^\]]*\]/g, '')
      .replace(/\[LEAD_DATA:.*?\]/s, '')
      .replace('[AGENDAMENTO_CONFIRMADO]', '')
      .trim()

    // Salva resposta da Carol
    await saveMessage(conversation.id, 'assistant', replyLimpo)

    // Delay humanizado (~15s) antes de enviar — evita parecer bot
    await humanDelay()

    // Envia resposta para o usuário
    await sendWhatsAppMessage(from, replyLimpo)

    // ── NOTIFICAÇÃO 2: Nome capturado ────────────────────────────────────────
    if (nomeDetectado && !conversation.nome) {
      await updateConversationStatus(conversation.id, 'em_andamento', { nome: nomeDetectado })
      console.log(`[Carol] 👤 Nome capturado: ${nomeDetectado} (${from})`)
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `👤 *${nomeDetectado}* entrou em contato com a Carol\n📱 +${from}\n\n_Acompanhe em: ylada.com/admin/whatsapp/carol/conversas_`
      )
    }

    // ── NOTIFICAÇÃO 3: Diagnóstico agendado ──────────────────────────────────
    if (isAgendamento) {
      await updateConversationStatus(conversation.id, 'diagnostico_agendado')

      // Salva marcador visível ao LLM no histórico — impede que future mensagens
      // causem re-pergunta de horário mesmo que o status não seja injetado corretamente
      const leadNomeTemp = parseField('nome')
      const leadHorarioTemp = parseField('horario')
      await saveMessage(
        conversation.id,
        'assistant',
        `[SISTEMA: Diagnóstico agendado com sucesso. Nome: ${leadNomeTemp} | Horário preferido: ${leadHorarioTemp}. A partir daqui NÃO pedir horário, nome ou dados de agendamento novamente.]`
      )

      const leadNome        = parseField('nome')
      const leadEmail       = parseField('email')
      const leadHorario     = parseField('horario')
      const leadSegmento    = parseField('segmento')
      const leadFaturamento = parseField('faturamento')
      const leadEquipe      = parseField('equipe')
      const leadDor         = parseField('dor_principal')

      console.log(`[Carol] 🗓️ Diagnóstico agendado — ${leadNome} | ${leadEmail} | ${from}`)

      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `🗓️ *Diagnóstico agendado!*\n\n` +
        `👤 *Nome:* ${leadNome}\n` +
        `📧 *Email:* ${leadEmail}\n` +
        `📱 *WhatsApp:* +${from}\n` +
        `⏰ *Horário preferido:* ${leadHorario}\n` +
        `🏢 *Segmento:* ${leadSegmento}\n` +
        `💰 *Faturamento:* ${leadFaturamento}\n` +
        `👥 *Equipe:* ${leadEquipe}\n` +
        `💬 *Dor principal:* ${leadDor}\n\n` +
        `🔗 _Conversa completa: ylada.com/admin/whatsapp/carol/conversas_`
      )
    }

    console.log(`[Carol] Resposta enviada para ${from}`)
  } catch (error) {
    console.error(`[Carol] Erro ao gerar resposta para ${from}:`, error)
    try {
      await sendWhatsAppMessage(
        from,
        'Oi! Tive um probleminha técnico aqui. Pode me mandar sua mensagem de novo? 😊'
      )
    } catch (fallbackError) {
      console.error('[Carol] Erro no fallback:', fallbackError)
    }
  }
}

export async function processMessage(payload: CarolInboundPayload): Promise<void> {
  const ingest = await ingestInboundMessage(payload)
  if (ingest.status === 'duplicate' || ingest.status === 'saved_no_reply') return
  await generateCarolReply(ingest)
}

/** Reenvia resposta da Carol para lead que já escreveu mas ficou sem retorno (script admin). */
export async function reprocessPendingCarolReply(
  conversation: Awaited<ReturnType<typeof getOrCreateConversation>> & { paused?: boolean },
  lastUserText: string
): Promise<void> {
  if (conversation.paused) {
    throw new Error(`Conversa pausada (${conversation.phone})`)
  }
  await generateCarolReply({
    status: 'saved',
    payload: {
      from: conversation.phone,
      text: lastUserText,
      messageId: `reprocess-${conversation.id}-${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
    conversationId: conversation.id,
    conversation,
  })
}
