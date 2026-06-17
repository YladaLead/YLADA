import OpenAI from 'openai'
import { sendWhatsAppMessage, sendPainButtons } from './sender'
import {
  CAROL_INBOUND_MINI_PROMPT,
  CAROL_OUTBOUND_MINI_PROMPT,
  getCarolMaxTokens,
  getCarolReplyModel,
  resolveCarolChannel,
} from './carol-reply-profile'
import {
  buildOutboundPromptContext,
  getOutboundLeadContext,
  shouldSendOutboundPainButtons,
} from './outbound-context'
import {
  detectPainFromText,
  getDeterministicPainReply,
  isPainButtonMessage,
} from './pain-detection'
import { compactHistoryForPrompt } from './prompt-history'
import {
  classifyInboundMessage,
  inboundKindContextNote,
  shouldClassifyWithAi,
  type InboundKind,
} from './inbound-classifier'
import {
  applySchedulingLoopGuard,
  extractButtonReply,
  getPainButtonsIntro,
  hasSentPainButtons,
  historyHasButtonClick,
  messageHasButtonReply,
  POST_BUTTON_CLICK_PROMPT,
} from './ad-lead-flow'
import { buildLeadNameContextNote, usableFirstName } from './lead-name'
import { isCarolInteractiveReply } from './parse-interactive'
import {
  getOrCreateConversation,
  saveMessage,
  getConversationHistory,
  updateConversationStatus,
  syncLeadProfileName,
} from './conversation'
import { isAutoResponse } from './auto-response'
import {
  conversationHasAdLeadIntent,
  isMetaAdLeadMessage,
} from './meta-ad-lead'
import {
  getCarolAndreNotifyPhone,
  notifyConversationAdvanceOnInbound,
  notifyDiagnosticoAgendado,
  notifyNomeCapturado,
} from './andre-notifications'
import { carolHasConversationalReply } from './outbound-context'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Delay humanizado (1ª msg mais lenta; continuação outbound mais rápida) ───
async function humanDelay(opts?: { firstInConversation?: boolean }): Promise<void> {
  const ms = opts?.firstInConversation
    ? 13000 + Math.random() * 4000
    : 5000 + Math.random() * 4000
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export { isMetaAdLeadMessage } from './meta-ad-lead'

const AD_LEAD_CONTEXT_PROMPT = `
CONTEXTO OBRIGATÓRIO: LEAD DE ANÚNCIO (Meta Ads / Click to WhatsApp).
A pessoa clicou no anúncio e pediu informações ou demonstrou interesse. Prioridade máxima sobre ETAPA 1 genérica.

TRILHA CURTA (2 a 3 trocas até convite ao diagnóstico com o Andre, não espere 5 a 6 trocas):
0) Se o sistema já enviou os 3 botões de dor, a lead clicou — use o bloco PÓS-CLIQUE (máx. 2 perguntas → convite).

1) Se ainda NÃO houve botões: o sistema envia botões primeiro (não descreva os botões no texto).

2) Se a resposta for vaga SEM botões, ofereça 3 opções em texto corrido (sem lista, sem bullet):
   "Muitas donas de clínica me contam uma dessas três coisas: agenda que oscila todo mês, cansaço de fazer tudo sozinha, ou faturamento que não cresce mesmo com a agenda cheia. Qual mais parece o seu caso?"

3) A partir da escolha dela, aprofunde naquela dor pelo lado da EXPERIÊNCIA dela — não pelo cálculo financeiro.
   Faça no máximo 1-2 perguntas que convidem ela a falar mais: o que ela sente, o que já tentou, o que gostaria que fosse diferente.
   PROIBIDO: "quanto isso representa em faturamento perdido?" — soa como interrogatório.
   O objetivo é ela se sentir OUVIDA, não avaliada.

4) Quando ela tiver nomeado a dor com as próprias palavras, convide ao diagnóstico de forma natural:
   "Pelo que você me contou, faz sentido o Andre olhar seu caso. São 30 minutos — sem apresentação, só clareza. Quer que eu agende?"

5) Coleta mínima após SIM: nome completo + melhor horário (turno primeiro, depois dia). Email só se ela quiser oferecer; não peça.

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

FLUXO OUTBOUND — LEAD QUE VEIO DO TEMPLATE FRIO (PRIORIDADE sobre as ETAPAS 1-9)
Quando a conversa começou com um template outbound de prospecção (há [auto-resposta ignorada] no histórico OU o contexto indica lead frio que a Carol abordou primeiro), NÃO use as ETAPAS 1-9 genéricas — nada de "qual é seu maior desafio". Siga ESTE roteiro, na voz do Andre, sempre adaptando (nunca copie literal). É valor ANTES de pergunta; o "como" é o enigma que leva pros 30 min. ⚠️ O agendamento é MANUAL: a Carol NÃO coleta horário/nome nem usa as ETAPAS 7-9 — ela conecta e o Andre marca.

1) Quando ela responder com interesse ("quero", "onde?", "como assim?"): entregue valor em 2 mensagens curtas, com o enigma:
"Deixa eu te mostrar uma coisa, vê se faz sentido pra você: de cada 10 clientes que se interessam, só umas 2 já chegam decididas a marcar. As outras 8 querem também, só não é a hora. E é nessas 8 que quase toda clínica perde dinheiro sem ver."
"Quando você para de perder essas 8, nem precisa todas, só uma parte já faz a agenda encher e parar de oscilar. Tem um jeito de fazer isso, e quase nenhuma clínica faz. Quer saber como?"

2) Se ela morde ("quero", "como?"): dê o princípio de graça, guarde o pulo do gato:
"Te explico! A base é parar de esperar a cliente decidir sozinha e passar a manter ela por perto até chegar a hora dela. O pulo do gato é COMO fazer isso sem virar aquela clínica chata que fica mandando mensagem — e isso muda conforme como tá a sua agenda hoje."

3) CONVITE (ponte pro Andre, especialista + autor):
"O Andre é especialista justamente nisso, escreveu até um livro sobre o assunto, o Inteligência de Convicção. Ele faz uma conversa de 30 minutos só sobre a sua agenda e te mostra onde tá escapando e o que mexer primeiro. Sem custo. Quer que eu peça pra ele te chamar? Acho que você vai adorar."

4) Se ela disser SIM: HANDOFF MANUAL (a Carol NÃO agenda):
"Que bom! Vou te conectar agora com o Andre. Ele mesmo vai falar com você por aqui pra ver o melhor horário, tá?"
Não pergunte dia/horário/nome aqui — quem marca é o Andre.

DESVIOS no outbound (a qualquer momento):
- "quem é você?": "Sou a Carol. Trabalho com o Andre Faula, autor do livro Inteligência de Convicção, que ajuda negócios a destravar o que não anda. Ele estuda há anos por que a agenda de estética oscila. Queria te mostrar onde costuma escapar agendamento aí, sem te vender nada. Pode ser?"
- "não tenho tempo": "Imagino, você deve viver corrida. É coisa de 1 minuto e você lê quando puder. Te mando o ponto principal por aqui, sem compromisso?"
- "minha agenda já está cheia": "Que ótimo, isso já é raro! Então pra você muda de figura: deixa de ser encher e passa a ser não depender de agenda lotada pra lucrar, e segurar quem já vem sem dar desconto. Quer que eu te mostre como isso costuma escapar mesmo em clínica cheia?"
- "não / sem interesse": "Sem problema, obrigada pela atenção! Se um dia a agenda oscilar e você quiser entender o porquê, é só me chamar."

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

Se mandar só "Oi" ou "Bom dia": use o FLUXO OUTBOUND acima (valor + enigma), não a pergunta genérica. Ex.:
"Oi! 😊 Deixa eu te mostrar rapidinho o que costuma fazer a agenda de estética oscilar sem a dona perceber. Posso?"
(quando ela topar, siga pro passo 1 do FLUXO OUTBOUND.)

Se trouxer contexto (interesse, informações, agenda):
Vá direto pro FLUXO OUTBOUND (entregue o valor do passo 1). Se for CTA de anúncio, use ETAPA 0.

Se perguntar quem você é:
"Sou a Carol! Trabalho com o Andre Faula, consultor em clínicas de estética. Me conta o seu caso."

ETAPA 2: NOME
"Antes de continuar... com quem eu tô falando?"

ETAPA 3: APROFUNDAR — SIGA O FIO DO QUE ELA DISSE
Não faça uma lista de perguntas em sequência. Escolha uma direção com base no que ela acabou de dizer e aprofunde nela com genuína curiosidade.

O objetivo é entender o CENÁRIO DELA — não coletar dados. Deixa ela falar. Quanto mais ela fala, mais ela descobre sozinha que quer ajuda.

Exemplos de como aprofundar cada dor (adapte sempre ao que ela disse antes — nunca copie literalmente):

Se a dor é AGENDA QUE OSCILA:
"Quando a semana fecha assim com buracos... o que você costuma fazer com esse tempo?"
"Tem alguma época do mês que piora mais?"
"Você atende sozinha ou tem alguém te ajudando?"

Se a dor é BURNOUT / FAZ TUDO SOZINHA:
"Quanto tempo você tá nesse ritmo sozinha?"
"O que você mais deixa de fazer por causa disso?"
"Você já tentou delegar alguma coisa — como foi?"

Se a dor é FATURAMENTO NÃO CRESCE:
"Sua agenda costuma estar cheia quando isso acontece, ou oscila também?"
"Quando o mês fecha assim... o que você acha que faltou?"
"Você tem uma ideia do que está travando, ou ainda tá tentando entender?"

REGRA: uma pergunta por vez. Espera ela responder antes de seguir. Se a resposta foi curta, aprofunde naquela mesma direção antes de mudar de assunto.

ETAPA 4: REFLEXÃO (não amplificação financeira)
Aqui você ajuda ela a CONECTAR o problema com o impacto — mas pelo lado da experiência dela, não pelo cálculo de faturamento.

PROIBIDO: "quanto isso representa em faturamento perdido?" — soa como interrogatório de vendedor.

Use perguntas que convidam à reflexão:
"Quando você pensa no que poderia ser diferente... o que você mais gostaria de mudar?"
"Você já chegou perto de resolver isso alguma vez? O que aconteceu?"
"O que mais cansa você nessa situação — é o financeiro, o emocional, ou os dois?"

Deixa ela nomear a dor no próprio idioma dela. Não force o número.

ETAPA 5: CURIOSIDADE — ABRINDO O ESPAÇO
Aqui você planta a semente de que existe uma causa que ela ainda não identificou — sem soar condescendente.

"Geralmente tem um ponto específico que está travando... e quase sempre não é o que a dona imagina de início."
"O Andre já viu esse padrão em dezenas de clínicas. Em 30 minutos ele consegue mapear o que está causando isso."

Tom: intrigante, não superior. Você está oferecendo clareza, não julgando.

ETAPA 6: PRÉ-QUALIFICAÇÃO LEVE
Colete só o que ainda não surgiu naturalmente na conversa: há quanto tempo tem a clínica, trabalha sozinha ou tem equipe, o que já tentou fazer.
NÃO pergunte sobre faturamento diretamente — se ela mencionar, ótimo. Se não, não force.

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
  /** Nome do perfil WhatsApp (contacts[].profile.name no webhook Meta) */
  profileName?: string
}

/**
 * Auto-resposta (bot da clínica) detectada: manda a "cutucada 1x" na PRIMEIRA vez
 * (deixa uma mensagem pra quando a responsável ver) e fica em silêncio nas seguintes.
 * Combinado em Jornada_Carol_Opcao2.md.
 */
async function handleAutoResponseDetected(
  conversationId: string,
  from: string,
  text: string
): Promise<{ status: 'saved_no_reply' }> {
  const hist = await getConversationHistory(conversationId, 20)
  const jaCutucou = hist.some((m) => m.content.includes('[SISTEMA: cutucada_bot]'))
  const jaTeveAuto = hist.some(
    (m) => m.role === 'user' && m.content.startsWith('[auto-resposta ignorada]')
  )
  await saveMessage(conversationId, 'user', `[auto-resposta ignorada] ${text}`)
  if (!jaCutucou && !jaTeveAuto) {
    const cutucada =
      'Oi! Acho que caí no atendimento automático 😊 Quando a responsável puder ver: tem agendamento escapando da agenda de estética sem ninguém perceber, e eu queria te mostrar onde. Deixo aqui?'
    try {
      await sendWhatsAppMessage(from, cutucada)
      await saveMessage(conversationId, 'assistant', cutucada)
      await saveMessage(conversationId, 'assistant', '[SISTEMA: cutucada_bot]')
      console.log(`[Carol] 🤖 Auto-resposta de ${from} — cutucada 1x enviada`)
    } catch (e) {
      console.error('[Carol] Falha ao enviar cutucada:', e)
    }
  } else {
    console.log(`[Carol] 🤖 Auto-resposta de ${from} — silêncio (cutucada já feita)`)
  }
  return { status: 'saved_no_reply' }
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

  let conversation = await getOrCreateConversation(from)

  if (payload.profileName?.trim()) {
    await syncLeadProfileName(conversation.id, conversation.nome, payload.profileName)
    if (!usableFirstName(conversation.nome) && usableFirstName(payload.profileName)) {
      conversation = { ...conversation, nome: payload.profileName.trim() }
    }
  }

  // Clique em botão — nunca tratar como auto-resposta da clínica (mesmo se vier misturado)
  if (messageHasButtonReply(text)) {
    const buttonText =
      extractButtonReply(text) || (isCarolInteractiveReply(text) ? text.trim() : null)
    if (buttonText) {
      const rest = text.replace(buttonText, '').trim()
      if (rest && isAutoResponse(rest)) {
        await saveMessage(conversation.id, 'user', `[auto-resposta ignorada] ${rest}`)
      }
      await saveMessage(conversation.id, 'user', buttonText)
      console.log(`[Carol] 📥 Clique em botão de ${from}: ${buttonText}`)
      return {
        status: 'saved',
        payload: { ...payload, text: buttonText },
        conversationId: conversation.id,
        conversation,
        inboundKind: 'humano',
      }
    }
  }

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
    return await handleAutoResponseDetected(conversation.id, from, text)
  }

  const history = await getConversationHistory(conversation.id, 12)
  let inboundKind: InboundKind | undefined

  if (shouldClassifyWithAi(text, history)) {
    inboundKind = await classifyInboundMessage(text, history)
    if (inboundKind === 'auto_resposta') {
      return await handleAutoResponseDetected(conversation.id, from, text)
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
    const ANDRE_NUMBER = getCarolAndreNotifyPhone()

    // ── PAUSA: Se Andre assumiu a conversa, Carol não responde ──────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paused = (conversation as any).paused === true

    // Busca histórico (já inclui a mensagem que acabou de salvar) — limite maior para evitar perda de contexto
    const history = await getConversationHistory(conversation.id, 40)

    await notifyConversationAdvanceOnInbound({
      conversationId: conversation.id,
      phone: from,
      nome: conversation.nome,
      text,
      history,
      isFlowResponse,
      paused,
    })

    if (paused) {
      console.log(`[Carol] ⏸️ Conversa pausada para ${from} — Andre está respondendo manualmente`)
      return
    }

    const userMsgCount = history.filter((m) => m.role === 'user').length
    if (userMsgCount === 1) {
      console.log(`[Carol] 🆕 Novo lead: ${from}`)
    }

    const channel = resolveCarolChannel({ history, isFlowResponse })
    const outboundLead = getOutboundLeadContext(history, conversation.nome)
    const temAutoResposta = history.some(
      (m) => m.role === 'user' && m.content.startsWith('[auto-resposta ignorada]')
    )
    const outboundContextNote =
      channel === 'outbound'
        ? buildOutboundPromptContext({
            nomeNegocio: outboundLead.nomeNegocio,
            cidade: outboundLead.cidade,
            temAutoRespostaBot: temAutoResposta,
          })
        : temAutoResposta
          ? `\n\nCONTEXTO: conversa outbound. Enviamos template antes; o bot da clínica respondeu ([auto-resposta ignorada]). Use ETAPA 1 CASO B na primeira mensagem real, ou ETAPA 0 se for CTA de anúncio.\n`
          : ''

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

    // Lead de anúncio Meta que chegou pelo canal inbound (Click-to-WhatsApp).
    // Esses leads são os mais qualificados (pagaram pra clicar) — merecem o
    // prompt completo e o modelo melhor, não o mini.
    const isInboundAdLead = isAdLead && channel === 'inbound'

    // ── BOTÕES INTERATIVOS: primeiro contato de lead de anúncio genérico ─────
    // Se a mensagem é o CTA padrão do Meta ("Tenho interesse", "mais informações")
    // e Carol ainda não respondeu nesta conversa → envia botões das 3 dores.
    // Não usa OpenAI: resposta é determinística e engajamento com botões é 3x maior.
    const shouldSendPainButtons =
      !isFlowResponse &&
      isAdLead &&
      isMetaAdLeadMessage(text) &&
      !messageHasButtonReply(text) &&
      !hasSentPainButtons(history)

    if (shouldSendPainButtons) {
      const intro = getPainButtonsIntro(text)
      console.log(`[Carol] 🎯 Lead de anúncio — enviando botões de dor para ${from}`)
      await humanDelay({ firstInConversation: true })
      await sendPainButtons(from, {
        intro,
        nomeNegocio: outboundLead.nomeNegocio,
      })
      await saveMessage(conversation.id, 'assistant', '[botões enviados: Agenda oscila | Faço tudo sozinha | Lucro não cresce]')

      // 🔔 NOTIFICAÇÃO 1: nova lead de anúncio engajou (primeiro contato real)
      const nomeLabel = conversation.nome ? ` · ${conversation.nome}` : ''
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `👋 *Nova lead do anúncio!*\n📱 +${from}${nomeLabel}\n\nCarol enviou os botões de dor. Aguardando escolha dela.\n_Painel: ylada.com/admin/whatsapp/carol/conversas_`
      )
      return
    }

    // ── OUTBOUND: 1ª resposta humana → botões de dor (igual anúncio Meta) ───
    if (shouldSendOutboundPainButtons(text, history)) {
      console.log(`[Carol] 🎯 Outbound — 1ª resposta humana, botões de dor para ${from}`)
      await humanDelay({ firstInConversation: true })
      await sendPainButtons(from, { nomeNegocio: outboundLead.nomeNegocio })
      await saveMessage(conversation.id, 'assistant', '[botões enviados: Agenda oscila | Faço tudo sozinha | Lucro não cresce]')
      return
    }

    // ── Clique no botão de dor → resposta determinística (sem OpenAI) ─────────
    const painFromButton = isPainButtonMessage(text) ? detectPainFromText(text) : null
    if (painFromButton) {
      const replyBtn = getDeterministicPainReply(
        painFromButton.hipotese,
        outboundLead.nomeNegocio
      )
      await updateConversationStatus(conversation.id, 'em_andamento', {
        hipotese: painFromButton.hipotese,
      })
      await saveMessage(conversation.id, 'assistant', replyBtn)
      await humanDelay({ firstInConversation: false })
      await sendWhatsAppMessage(from, replyBtn)
      console.log(
        `[Carol] 🎯 Botão dor (${painFromButton.label}) — resposta determinística para ${from}`
      )
      return
    }

    const painInText = detectPainFromText(text)
    if (painInText && channel === 'outbound' && !(conversation as { hipotese?: string }).hipotese) {
      await updateConversationStatus(conversation.id, 'em_andamento', {
        hipotese: painInText.hipotese,
      })
    }
    // ─────────────────────────────────────────────────────────────────────────

    // ── NOTIFICAÇÕES DE ENGAJAMENTO ───────────────────────────────────────────
    const nomeDisplay = conversation.nome ?? `+${from}`

    // 🔔 NOTIFICAÇÃO 2: lead clicou num botão de dor (primeira escolha)
    const isFirstButtonClick =
      messageHasButtonReply(text) &&
      !history
        .slice(0, -1) // exclui a mensagem atual
        .some((m) => m.role === 'user' && m.content.includes('[botão:'))

    if (isFirstButtonClick) {
      const dorEscolhida = text
        .replace(/\[botão:\s*/i, '')
        .replace(/\]/g, '')
        .trim()
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `🎯 *${nomeDisplay} escolheu a dor!*\n"${dorEscolhida}"\n📱 +${from}\n\nCarol está aprofundando agora.\n_Painel: ylada.com/admin/whatsapp/carol/conversas_`
      )
    }

    // 🔔 NOTIFICAÇÃO 3: conversa ativa — lead respondeu pela 3ª vez (sem botão, qualquer canal)
    const isActiveConversationMilestone =
      userMsgCount === 3 &&
      !messageHasButtonReply(text) &&
      !isFirstButtonClick

    if (isActiveConversationMilestone) {
      const preview = text.slice(0, 120)
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `💬 *Conversa ativa: ${nomeDisplay}*\n📱 +${from}\n\n"${preview}"\n\n_Painel: ylada.com/admin/whatsapp/carol/conversas_`
      )
    }

    // 🔔 NOTIFICAÇÃO 4: lead outbound respondeu pela primeira vez (real, não bot)
    const isFirstOutboundResponse =
      channel === 'outbound' &&
      userMsgCount === 1 &&
      inboundKind !== 'auto_resposta'

    if (isFirstOutboundResponse) {
      const preview = text.slice(0, 120)
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `📲 *Lead do scraper respondeu!*\n📱 +${from}\n\n"${preview}"\n\n_Painel: ylada.com/admin/whatsapp/carol/conversas_`
      )
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Ad leads sempre recebem as instruções detalhadas do fluxo — inbound ou outbound
    const adLeadNote = isAdLead ? AD_LEAD_CONTEXT_PROMPT : ''
    const classifierNote = inboundKindContextNote(inboundKind)

    const duplicateCtaNote =
      isAdLead &&
      hasSentPainButtons(history) &&
      isMetaAdLeadMessage(text) &&
      !messageHasButtonReply(text)
        ? `\nA pessoa reenviou o mesmo CTA do anúncio. NÃO repita a abertura nem reenvie botões. Continue a conversa ou retome a última pergunta em 1 linha.\n`
        : ''

    const postButtonNote =
      hasSentPainButtons(history) &&
      (messageHasButtonReply(text) || historyHasButtonClick(history))
        ? POST_BUTTON_CLICK_PROMPT
        : ''

    // Leads de anúncio inbound → prompt completo (gpt-4o garante qualidade)
    // Inbound puro (direto, sem ad) → prompt mini ainda funciona para triagem
    // Outbound / flow → prompt completo já era
    const basePrompt =
      channel === 'outbound'
        ? CAROL_OUTBOUND_MINI_PROMPT
        : channel === 'inbound' && !isInboundAdLead
          ? CAROL_INBOUND_MINI_PROMPT
          : CAROL_SYSTEM_PROMPT

    const replyModel = isInboundAdLead
      ? (process.env.CAROL_OUTBOUND_MODEL?.trim() || 'gpt-4o')
      : getCarolReplyModel(channel)
    const maxTokens = getCarolMaxTokens(channel)
    const isFirstCarolReply = !carolHasConversationalReply(history)

    // Nota do Andre — contexto manual para esta conversa
    const notaAndreContext = (conversation as any).nota_andre
      ? `\n\n⚠️ CONTEXTO DO ANDRE (leia antes de responder):\n"${(conversation as any).nota_andre}"\nUse esse contexto para personalizar sua resposta. Não mencione que recebeu essa nota.\n`
      : ''

    const nomeContextNote = buildLeadNameContextNote({
      storedNome: (conversation as any).nome ?? conversation.nome,
      profileName: payload.profileName,
    })

    const systemContent =
      basePrompt +
      (isFlowResponse
        ? FLOW_CONTEXT_PROMPT
        : adLeadNote +
          postButtonNote +
          outboundContextNote +
          classifierNote +
          duplicateCtaNote) +
      nomeContextNote +
      notaAndreContext +
      statusContextNote

    const promptHistory = compactHistoryForPrompt(history)

    console.log(`[Carol] Canal=${channel} modelo=${replyModel} de ${from}`)

    const response = await openai.chat.completions.create({
      model: replyModel,
      messages: [
        { role: 'system', content: systemContent },
        ...promptHistory,
      ],
      temperature: channel === 'outbound' ? 0.65 : 0.7,
      max_tokens: maxTokens,
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
          ...promptHistory,
        ],
        temperature: 0.9,
        max_tokens: maxTokens,
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
    let replyLimpo = reply
      .replace(/\[NOME_DETECTADO:[^\]]*\]/g, '')
      .replace(/\[LEAD_DATA:.*?\]/s, '')
      .replace('[AGENDAMENTO_CONFIRMADO]', '')
      .trim()

    replyLimpo = applySchedulingLoopGuard(replyLimpo, history)

    // Salva resposta da Carol
    await saveMessage(conversation.id, 'assistant', replyLimpo)

    await humanDelay({ firstInConversation: isFirstCarolReply })

    // Envia resposta para o usuário
    await sendWhatsAppMessage(from, replyLimpo)

    if (
      postButtonNote &&
      convStatus === 'novo' &&
      replyLimpo.length > 0
    ) {
      await updateConversationStatus(conversation.id, 'em_andamento')
    }

    if (nomeDetectado && !conversation.nome) {
      console.log(`[Carol] 👤 Nome capturado: ${nomeDetectado} (${from})`)
      const historyAfterReply = await getConversationHistory(conversation.id, 40)
      await notifyNomeCapturado({
        conversationId: conversation.id,
        phone: from,
        nome: nomeDetectado,
        history: historyAfterReply,
      })
    }

    if (isAgendamento) {
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

      const historyAfterReply = await getConversationHistory(conversation.id, 40)
      await notifyDiagnosticoAgendado({
        conversationId: conversation.id,
        phone: from,
        leadNome,
        leadEmail,
        leadHorario,
        leadSegmento,
        leadFaturamento,
        leadEquipe,
        leadDor,
        history: historyAfterReply,
      })
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
