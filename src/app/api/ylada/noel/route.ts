/**
 * NOEL YLADA - API por segmento (ylada, psi, odonto, nutra, coach, seller).
 * POST /api/ylada/noel
 * Body: { message, conversationHistory?, segment?, area?, channel?: 'support' }
 * Injeta no system prompt: contexto + perfil (ylada_noel_profile) + snapshot da trilha.
 * Quando o profissional pede link/quiz/calculadora: interpret + generate e entrega o link na resposta.
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
 * @see docs/ANALISE-LINKS-BRIEF-POR-PERFIL-E-PROXIMOS-PASSOS.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { buildProfileResumo, type YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'
import { getNoelYladaLinks, formatLinksAtivosParaNoel } from '@/lib/noel-ylada-links'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import { getFlowById } from '@/config/ylada-flow-catalog'
import { formatDisplayTitle } from '@/lib/ylada/strategic-intro'
import { getStrategicProfilesForMessage, formatStrategicProfileForPrompt } from '@/lib/noel-wellness/strategic-profile-matcher'
import {
  getProfessionalProfilesForMessage,
  formatProfessionalProfileForPrompt,
} from '@/lib/noel-wellness/professional-profile-matcher'
import {
  getStrategicObjectivesForMessage,
  formatStrategicObjectiveForPrompt,
} from '@/lib/noel-wellness/objective-matcher'
import {
  getFunnelStagesForMessage,
  formatFunnelStageForPrompt,
} from '@/lib/noel-wellness/funnel-stage-matcher'
import { getNoelLibraryContextWithStrategies } from '@/lib/noel-wellness/noel-library-context'
import { saveConversationDiagnosis } from '@/lib/noel-wellness/noel-conversation-diagnosis'
import { getDiagnosisInsightsContext, FALLBACK_DIAGNOSTIC_ID_INSIGHTS } from '@/lib/noel-wellness/diagnosis-insights-context'
import { getIntentInsightsContext } from '@/lib/noel-wellness/intent-insights-context'
import {
  getLinksWithLowConversion,
  formatLinkPerformanceForNoel,
} from '@/lib/noel-wellness/link-performance-context'
import {
  getNoelMemory,
  formatNoelMemoryForPrompt,
  upsertNoelMemory,
  detectActionFromMessage,
} from '@/lib/noel-wellness/noel-memory'
import { addExchange, getRecentMessages } from '@/lib/noel-wellness/noel-conversation-memory'
import {
  getStrategyMap,
  formatStrategyMapForPrompt,
  syncStrategyMapFromMemory,
} from '@/lib/noel-wellness/noel-strategy-map'
import {
  NOEL_STRATEGIC_PROTOCOL,
  NOEL_STRATEGIC_RULE,
  NOEL_DETECTED_PROFILE_INSTRUCTION,
  NOEL_LAYER4_PRIORITY_RULE,
} from '@/lib/noel-wellness/prompt-layers'
import OpenAI from 'openai'
import { hasYladaProPlan } from '@/lib/subscription-helpers'
import { getNoelUsageCount, incrementNoelUsage } from '@/lib/noel-usage-helpers'
import { FREEMIUM_LIMITS, YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE } from '@/config/freemium-limits'
import { completeNinaSupportTurn } from '@/lib/ylada-nina-support'
import { notifyNinaSupportInquiry } from '@/lib/support-notifications'
import {
  appendNinaBotReplyToPlatformTicket,
  createPlatformTicketFromNinaFirstTurn,
} from '@/lib/platform-support-from-nina'

type FormField = { id?: string; label?: string; type?: string; options?: string[] }

/** Monta o bloco completo para o Noel: descrição resumida + conteúdo real do quiz (fonte única = config do link). */
function buildLinkBlock(
  title: string,
  flowId: string,
  url: string,
  config: Record<string, unknown> | null
): { descResumida: string; conteudoReal: string } {
  const form = config?.form as { fields?: FormField[] } | undefined
  const fields = Array.isArray(form?.fields) ? form.fields : []
  const firstWithOptions = fields.find((f) => Array.isArray(f.options) && f.options.length > 0)
  const isCalculadora = flowId === 'calculadora_projecao'
  const flow = getFlowById(flowId)

  let descResumida: string
  let conteudoReal = ''

  if (isCalculadora) {
    descResumida = `Criei a calculadora "${title}". Você vai atrair quem gosta de ver números e cenários possíveis.`
  } else if (firstWithOptions) {
    const themePart = title.includes(' — ') ? title.split(' — ').slice(1).join(' — ').trim() : title
    const quizName = themePart || title
    descResumida = `Criei o quiz "${quizName}". Você vai atrair pessoas que buscam isso.`
    conteudoReal = fields
      .map((f, i) => {
        const options = Array.isArray(f.options) && f.options.length > 0 ? f.options! : []
        const optsBlock = options
          .map((opt, j) => `${String.fromCharCode(65 + j)}) ${opt}`)
          .join('\n')
        return optsBlock ? `${i + 1}. ${f.label ?? ''}\n${optsBlock}` : `${i + 1}. ${f.label ?? ''}`
      })
      .join('\n\n')
  } else {
    const themePart = title.includes(' — ') ? title.split(' — ').slice(1).join(' — ').trim() : title
    const linkName = themePart || title
    descResumida = `Criei o quiz "${linkName}". Você vai atrair pessoas que buscam isso.`
  }

  return { descResumida, conteudoReal }
}

/** Bloco anexado à resposta final — mesma fonte que o link público e a tela de edição (`config`). */
function buildCanonicalQuizMarkdownForResponse(
  title: string,
  url: string,
  flowId: string,
  config: Record<string, unknown> | null
): string {
  const { conteudoReal } = buildLinkBlock(title, flowId, url, config)
  const lines: string[] = []
  lines.push('### Quiz e link (oficial — igual ao link público e à edição)')
  lines.push('')
  if (conteudoReal.trim()) {
    lines.push(conteudoReal.trim())
    lines.push('')
  }
  lines.push(`[Acesse seu quiz](${url})`)
  return lines.join('\n')
}

/** Monta o bloco de instruções para o Noel — fonte única: config do link. */
function buildNoelLinkBlock(
  title: string,
  url: string,
  descResumida: string,
  conteudoReal: string,
  modo: 'novo' | 'ajustado'
): string {
  const tituloBloco = modo === 'novo' ? 'LINK GERADO AGORA PARA ESTE PEDIDO' : 'LINK AJUSTADO E GERADO'
  const intro = modo === 'novo'
    ? 'O sistema acabou de criar um link para o profissional.'
    : 'O sistema criou um novo link com as alterações pedidas.'

  let block = `\n[${tituloBloco}]\n${intro}\n\n⚠️ CRÍTICO: O texto "[${tituloBloco}]" é APENAS uma marcação interna para o sistema. NUNCA inclua isso na resposta ao profissional.\n\n🚨 NOVO FLUXO (OBRIGATÓRIO): O sistema ANEXARÁ automaticamente ao final da sua mensagem um bloco **### Quiz e link (oficial)** com as perguntas exatas e o link — a mesma fonte do link público e da tela "Editar perguntas".\n\nSUA RESPOSTA AO PROFISSIONAL DEVE SER SÓ:\n- Introdução breve e natural (3–6 frases): parabenize, diga o tema, que o quiz está pronto e que abaixo (no bloco oficial) estão as perguntas iguais ao que o cliente verá.\n- Opcional: **título** em uma linha (ex.: **Diagnóstico rápido — [tema]**).\n- Uma frase de valor (ex.: qualificar leads, conversa no WhatsApp).\n- NÃO liste perguntas nem opções A/B no texto — isso gera divergência com o link real.\n- NÃO inclua link markdown [texto](url) na sua resposta — o bloco oficial já trará o único link correto.\n- NÃO escreva "Copiar link" nem "Clique aqui para acessar" soltos.\n\nREFERÊNCIA INTERNA (não copie na resposta — só para você saber o tema):\n${conteudoReal || '(calculadora ou fluxo sem lista de opções)'}\n\nLink que será anexado pelo sistema: ${url}\n\nDICA: Convide a pessoa a rolar até **Quiz e link (oficial)** para testar e copiar o link.`

  if (modo === 'ajustado') {
    block += '\nSe for ajuste: pode dizer brevemente "Pronto" ou "Concluído" antes do link.'
  }

  return block
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Detecta se a mensagem indica pedido de ajuste no link anterior (perguntas, conteúdo). */
function isIntencaoAjustarLink(message: string): boolean {
  const m = message.toLowerCase().trim()
  const termos = [
    'não gostei', 'nao gostei', 'troca', 'trocar', 'acrescenta', 'acrescentar', 'adiciona', 'adicionar',
    'muda', 'mudar', 'ajusta', 'ajustar', 'altera', 'alterar', 'modifica', 'modificar',
    'essa pergunta', 'a pergunta', 'as perguntas', 'inclui', 'incluir', 'coloca', 'colocar',
    'tira', 'remover', 'tirar', 'substitui', 'substituir', 'em vez de', 'no lugar de',
    'quinta pergunta', 'quarta pergunta', 'mais uma pergunta', 'outra pergunta', 'uma pergunta a mais',
  ]
  return termos.some((t) => m.includes(t))
}

/** Detecta se a mensagem indica pedido de link / quiz / calculadora / ferramenta para engajar. */
function isIntencaoCriarLink(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
): boolean {
  const m = message.toLowerCase().trim()
  const termos = [
    'quero um link', 'quero uma calculadora', 'quero um quiz', 'quero uma ferramenta',
    'preciso de um link', 'preciso de uma calculadora', 'preciso de um quiz', 'preciso de uma ferramenta',
    'criar um link', 'criar uma calculadora', 'criar um quiz', 'gerar um link', 'gerar um quiz',
    'ferramenta para', 'link para', 'quiz para', 'calculadora para',
    'atrair pacientes', 'atrair clientes', 'conteúdo para o paciente', 'tema da minha especialidade',
    'qualificar quem quer agendar', 'quanto está deixando de faturar', 'mostrar valor',
    'para engajar', 'para captar', 'para meus clientes', 'para meus pacientes',
    'despertar curiosidade', 'link que atrai',
    // Frases mais naturais (Bloco 1)
    'quero captar', 'captar pacientes', 'captar clientes', 'quero atrair',
    'emagrecimento', 'para emagrecimento', 'pacientes para emagrecer',
    'intestino', 'energia', 'ansiedade', 'bem-estar', 'suplementação',
    'me ajuda a criar', 'me dá um', 'me faz um', 'cria um', 'cria uma',
    // Pedido explícito de link / fluxo gerado (Bloco 2)
    'criar esse fluxo', 'esse fluxo para mim', 'cria esse fluxo', 'criar o fluxo',
    'meu link', 'e meu link', 'quero o link', 'gera o link', 'gerar o link', 'cria o link',
    'me dá o link', 'me entrega o link', 'cadê o link', 'onde está o link', 'entregar o link',
    'criar o link', 'link desse', 'link desse diagnóstico', 'link desse quiz', 'link do diagnóstico',
    'pode criar esse', 'pode gerar o link', 'gera esse link',
    // Medicamentos e temas específicos (GLP-1, emagrecimento medicamentoso)
    'tizerpatide', 'tirzepatida', 'ozempic', 'wegovy', 'mounjaro', 'zepbound', 'semaglutida', 'liraglutida',
  ]
  if (termos.some((t) => m.includes(t))) return true

  // Confirmação "sim" + tema: última mensagem do assistant perguntou se quer criar link
  const lastAssistant = conversationHistory
    ?.filter((h) => h.role === 'assistant')
    .pop()
    ?.content?.toLowerCase()
    ?? ''
  const perguntouCriar =
    lastAssistant.includes('quer que eu crie') ||
    lastAssistant.includes('quero criar') ||
    lastAssistant.includes('criar um link') ||
    lastAssistant.includes('criar um diagnóstico') ||
    lastAssistant.includes('qual tema')
  const pareceConfirmacao = /^sim[\s,]|^sim\s/i.test(m) || (m.startsWith('sim') && m.length > 4)
  if (perguntouCriar && pareceConfirmacao) {
    const rest = m.replace(/^sim[\s,]+/i, '').trim()
    if (rest.length >= 3) return true
  }
  return false
}

/**
 * Em pedidos de relacionamento com cliente já atendida, não deve gerar link automaticamente
 * (a menos que o profissional peça link/quiz/diagnóstico de forma explícita).
 */
function shouldBlockAutoLinkForClientFollowUp(message: string): boolean {
  const m = message.toLowerCase().trim()
  const falaDeCarteira = /(?:minha|uma|para uma|para minha)?\s*(cliente|paciente)|retorno|follow[- ]?up|pós[- ]?proced|reagendar|sumiu|já fez|ja fez|carteira/.test(m)
  const pediuScript = /script|mensagem|whatsapp|texto para enviar/.test(m)
  const negouCaptacao = /sem falar em atrair|sem captar|não captar|nao captar|não prospectar|nao prospectar/.test(m)
  const pediuLinkExplito = /quero (o )?link|me dá o link|me de o link|gera (o )?link|cria (o )?link|quiz|diagnóstico|diagnostico|calculadora/.test(m)
  return falaDeCarteira && (pediuScript || negouCaptacao) && !pediuLinkExplito
}

/** Primeira conversa: no máximo 1 troca anterior e mensagem vaga (oi, como funciona, quero captar, etc.). */
function isPrimeiraConversaOuVaga(
  message: string,
  conversationHistory: { role: string; content: string }[]
): boolean {
  const hist = Array.isArray(conversationHistory) ? conversationHistory : []
  const userMessages = hist.filter((e) => e.role === 'user').length
  const isPrimeiraOuPoucasTrocas = userMessages <= 1
  const msg = message.toLowerCase().trim()
  const vagas = [
    'oi', 'olá', 'ola', 'o que eu faço', 'o que faço aqui', 'como funciona', 'por onde começo',
    'quero começar', 'me ajuda', 'o que é isso', 'como é que funciona', 'quero captar clientes',
    'quero captar pacientes', 'quero atrair', 'começar a captar', 'não sei por onde começar',
  ]
  const pareceVaga = vagas.some((v) => msg.includes(v)) || (msg.length <= 35 && !msg.includes('diagnóstico') && !msg.includes('quiz') && !msg.includes('intestino') && !msg.includes('emagrecimento'))
  return isPrimeiraOuPoucasTrocas && pareceVaga
}

/** Texto default para interpret na primeira conversa (gerar diagnóstico base por segmento). */
function getDefaultInterpretTextPrimeiraConversa(segment: string): string {
  if (segment === 'med') return 'quero um diagnóstico para captar pacientes'
  return 'quero um diagnóstico para captar clientes'
}

/** Modo Executor: gerar primeiro, ajustar depois. A conversa é o editor. Nunca travar em perguntas. */
const NOEL_MODO_EXECUTOR_LINK = `
[MODO EXECUTOR — LINK/QUIZ/DIAGNÓSTICO — OBRIGATÓRIO]
Regra de ouro: GERAR PRIMEIRO, PERGUNTAR DEPOIS. Nunca travar o usuário em perguntas antes de gerar.

Quando o profissional pedir criar quiz, diagnóstico, calculadora ou link (ex.: "quero um link para captar pacientes", "cria um diagnóstico", "gerar link", "link de diagnóstico para Instagram", "quiz para WhatsApp", "quero uma calculadora", "cria uma calculadora"):
1. EXECUÇÃO PRIMEIRO: Se o sistema entregou um bloco [LINK GERADO AGORA] ou [LINK AJUSTADO E GERADO], você DEVE mostrar o quiz/calculadora completo e o link clicável na resposta. Não pergunte "posso criar um quiz para você?" nem "gostaria de definir algumas perguntas primeiro?" nem "preciso de um tema específico" nem "qual tipo de cálculo você gostaria" — quando o sistema gerou, entregue. A sensação desejada: pediu → já ficou pronto.
2. NUNCA pergunte tema ANTES de gerar. Se o profissional pediu link/quiz/calculadora/diagnóstico, o sistema já inferiu um tema ou usou um padrão. Para calculadoras, o sistema já escolhe um tipo padrão (ex.: projeção de resultados). Só pergunte tema se o sistema REALMENTE não conseguiu gerar (e isso é raro). Quando o sistema gerou, mostre o resultado.
3. NUNCA diga que não pode criar links. Quem cria é o sistema; você só exibe o link quando ele vem no bloco. Se não veio link nesta resposta, oriente a preencher o perfil ou a pedir de novo com o tema claro.
4. RESULTADO EXECUTÁVEL: Inclua sempre o link clicável em markdown [Texto](URL) e as perguntas do quiz (conforme o bloco). Depois ofereça ajustes: "Se quiser, posso ajustar perguntas, mudar o foco ou criar outro diagnóstico."
5. CONVERSA = EDITOR: Se o usuário pedir ajuste (ex.: "troca a pergunta 2", "foca em sintomas"), o sistema pode gerar novo link; você entrega o link atualizado e confirma o que mudou. A conversa vira editor natural — não configurar sistema, e sim criar algo conversando.
`

/** Leitura no chat: título, perguntas em negrito, espaço entre blocos (o front renderiza markdown). */
const NOEL_FORMATO_DIAGNOSTICO_CHAT = `
[FORMATO NO CHAT — DIAGNÓSTICO / QUIZ / SEQUÊNCIA DE PERGUNTAS — OBRIGATÓRIO]
Sempre que você mostrar um diagnóstico curto, um quiz, uma calculadora com perguntas ou qualquer fluxo com várias perguntas + opções (A, B, C…), use este layout para o profissional ler bem na conversa:

1. **Título do fluxo** — Uma linha em negrito com o nome do diagnóstico (ex.: **Diagnóstico rápido — [tema]** ou **Quiz — [tema]**). Coloque após 1–2 frases de introdução, antes das perguntas.
2. **Enunciado de cada pergunta** — Todo o texto da pergunta (incluindo o número **1.**, **2.**, …) em **negrito** markdown. As opções A), B), C) vêm nas linhas seguintes, em texto normal.
3. **Espaço** — Entre o fim das opções de uma pergunta e o **negrito** da pergunta seguinte, deixe **uma linha em branco** (parágrafo separado). Não empilhe perguntas no mesmo bloco sem esse espaço.
4. Sem parede de texto: nunca juntar várias perguntas e alternativas num único parágrafo contínuo.

Isso vale para diagnóstico entregue **com link** e para sequência de perguntas **só no chat** (sem link). O chat renderiza markdown: **negrito** aparece mais forte para o usuário.
`

/** Regras de comportamento estratégico: Noel conduz, não apenas explica. */
const NOEL_CONDUTOR_RULES = `
[COMPORTAMENTO ESTRATÉGICO — OBRIGATÓRIO]
Você não é um explicador. Você é um condutor. O objetivo é conversão (agenda cheia, captação, previsibilidade).

1. PERGUNTA ESTRATÉGICA: Antes de entregar solução completa, faça pelo menos 1 pergunta que direcione decisão (quando fizer sentido). Ex.: "Quer que eu deixe esse quiz mais voltado para dor ou para educação?" — NÃO use em perguntas simples (ex.: "qual o melhor horário?"). EXCEÇÃO: quando o profissional pediu link/quiz/diagnóstico, priorize ENTREGAR o link gerado pelo sistema; depois ofereça ajustes.

2. MICRO DECISÃO: Sempre termine com um próximo passo claro. Nunca encerre em "está bom assim?" genérico. Ofereça escolha concreta: "Quer ajustar o CTA para WhatsApp ou deixar mais educativo?" ou "Prefere que eu sugira um segundo link ou focamos em promover este primeiro?"

3. REFORÇO DO OBJETIVO: Lembre o objetivo do profissional (agenda cheia, captar pacientes, previsibilidade) quando entregar links ou estratégias. Ex.: "Esse quiz vai qualificar quem está pronto para agendar. Quer que eu deixe o CTA mais direto ou mais educativo?"
`

/** Princípio 20/80 de conversão — detectar na conversa e orientar com o script certo. */
const NOEL_PRINCIPIO_20_80 = `
[PRINCÍPIO 20/80 — OBRIGATÓRIO EM ESTRATÉGIAS DE COMUNICAÇÃO]
O profissional precisa DETECTAR NA CONVERSA que está rolando se a pessoa é já interessada ou apenas curiosa. Você (Noel) ajuda nessa detecção e entrega o tipo certo de orientação/script.

GRUPO 20% — Pessoa JÁ INTERESSADA (detectada na conversa)
- Sinais: demonstra interesse em resolver, pergunta sobre processo, preço, como funciona, quer saber mais.
- Missão: o profissional deve ter CLAREZA e LEVAR AUTORIDADE.
- O que você faz: dê uma nota de que ele precisa assumir autoridade e entregue um SCRIPT DE AUTORIDADE — mensagem/envio que demonstra método, organização, experiência. Ex.: explicar o que normalmente acontece, mostrar um diagnóstico, apresentar o próximo passo com segurança.
- Objetivo: fazer a pessoa pensar "Essa pessoa entende do assunto."

GRUPO 80% — Pessoa CURIOSA (detectada na conversa)
- Sinais: reagiu a um post, perguntou algo superficial, ainda não está buscando solução ativamente.
- Missão: propagação — falar de indicação, família, rede de pessoas.
- O que você faz: entregue um SCRIPT DE PROPAGAÇÃO — mensagem leve, convite para quiz/link, foco em "conhece alguém que...", "compartilha com quem pode se interessar", indicação, família.
- Objetivo: fazer a pessoa pensar "Nunca tinha pensado nisso" e espalhar.

REGRAS DE RESPOSTA: Sempre que o profissional trouxer uma conversa ou situação de contato:
1) Ajude a DETECTAR se a pessoa parece 20% (interessada) ou 80% (curiosa) com base no que ele descreveu.
2) Explique rapidamente por quê.
3) Entregue o script certo: AUTORIDADE (20%) ou PROPAGAÇÃO (80%).

LEMBRETE: 80% do crescimento vem da propagação (links, indicações, família). 20% das conversões vêm da autoridade na hora certa.
`

/** Scripts para o profissional enviar ao lead: 2ª vs 3ª pessoa + micro-colheita de contexto. */
const NOEL_SCRIPTS_INDICACOES_E_MICROCONTEXTO = `
[SCRIPTS, INDICAÇÕES E PESSOA GRAMATICAL — AO ENTREGAR TEXTO PARA O PROFISSIONAL ENVIAR]

1) COMPROMISSO DIRETO (marcar consulta, responder quiz, próximo passo claro para quem recebe a mensagem)
   - Use SEGUNDA PESSOA ("você", "te", "sua") na mensagem que o lead/cliente vai ler.

2) INDICAÇÃO, PROPAGAÇÃO, REDE ("quem mais se beneficiaria", compartilhar com conhecidos)
   - Prefira TERCEIRA PESSOA ou abertura de rede, com tom natural: "Quem você conhece que gostaria de…", "Sabe de alguém que…", "Se conhecer alguém que… vale encaminhar", "Compartilha com quem…".
   - Objetivo: menos pressão no "eu" de quem recebe e mais espaço para indicação.

3) Pode COMBINAR no mesmo script: trecho em segunda pessoa (valor direto) + fechamento em terceira pessoa (indicação), quando fizer sentido.

4) MICRO-COLHEITA (sem interrogatório)
   - Se faltar contexto para calibrar o script (temperatura do lead, primeiro contato vs retorno, canal), inclua NO MÁXIMO UMA pergunta curta ao profissional junto da orientação.
   - Se ele já descreveu a situação, infira; só confirme em uma frase curta se ajudar ("Pelo que você descreveu, parece lead morno — é isso?").
`

/** Antes de mandar link/quiz: curiosidade + permissão — evita “atacar” o contato com ferramenta. */
const NOEL_PERMISSAO_E_CURIOSIDADE_ANTES_DO_LINK = `
[LINK / FERRAMENTA / QUIZ — CURIOSIDADE E PERMISSÃO ANTES]
Quando o profissional pedir script para enviar link, diagnóstico, quiz ou ferramenta, ou perguntar “o que mandar”, o padrão é **não** sugerir só jogar o link na frente sem contexto (isso parece spam e baixa resposta).

ORDEM OBRIGATÓRIA — sugira ao profissional **pelo menos duas mensagens** (ou uma mensagem em dois blocos claros), nesta ordem:
1) **Uma pergunta de curiosidade ou contexto** — adaptada ao nicho (ex.: estética/pele: o que mais incomoda hoje; saúde: rotina ou sintoma; negócio: maior dificuldade). Objetivo: despertar curiosidade e mostrar que você entende do assunto, sem interrogatório longo.
2) **Script pedindo permissão explícita** antes de enviar o link — ex.: “Se fizer sentido, te mando um link que [benefício em uma linha]. Posso te enviar?” ou “Quer que eu te mande um diagnóstico rápido que ajuda com [X]? Só mando se você topar.”
3) **Só então** a mensagem com o link — quando a pessoa alinhar, responder bem à pergunta, ou quando o profissional disser que o contato já pediu.

Exceções (pode ir direto ao texto com link na sugestão):
- O contato **já pediu** o link, o quiz ou “manda aí”.
- Follow-up de quem já respondeu diagnóstico — use também [PRIMEIRA MENSAGEM APÓS DIAGNÓSTICO]; ainda pode acrescentar linha de permissão se soar natural.

Regra de ouro: **pergunta curta + pedido de permissão** antes de ferramenta solta. Treine o profissional nesse hábito.
`

/**
 * Evita que o Noel assuma sempre "captação / diagnóstico para atrair clientes" quando o profissional
 * quer mensagem para cliente ou paciente que já atende (B2C / relacionamento).
 */
const NOEL_CLIENTE_ATENDIDO_VS_CAPTACAO = `
[CLIENTE ATENDIDO VS CAPTAÇÃO — OBRIGATÓRIO]
O profissional pode estar em dois momentos. NÃO assuma sempre o segundo.

1) **RELACIONAMENTO COM QUEM JÁ É CLIENTE/PACIENTE** (carteira, retorno, pós-procedimento, acompanhamento, reagendar, follow-up, mensagem para "uma cliente", "minha paciente", "na estética para uma cliente" no sentido de atendida)
   - Entregue script de **conversa direta com essa pessoa**: acolhimento, próximo passo do serviço, autoridade no tema, continuidade.
   - **NÃO** use como padrão o roteiro de "atrair mais clientes para o negócio", "diagnóstico para a pessoa descobrir como atrair clientes" ou convite genérico de link de captação — isso frustra quem quer falar com clientela existente.
   - Link/diagnóstico de prospecção só se o profissional pedir explícito para **pessoas novas** ou para **divulgar**.

2) **CAPTAÇÃO / NOVOS CONTATOS / CRESCER CARTEIRA** (atrair leads, preencher agenda com gente nova, divulgar quiz, "quero mais clientes")
   - Aí sim: diagnóstico, link para compartilhar, scripts de convite e qualificação.

3) **SE ESTIVER AMBÍGUO** (ex.: só disse "estética" e "script" sem dizer se é para quem já veio ou para prospectar)
   - Uma pergunta curta: "É mensagem para **uma cliente que já te procura** ou para **atrair pessoas novas**?" — depois entregue o script certo.

Regra: "cliente" na boca do profissional muitas vezes é **quem ele já atende**. Só inverta para captação quando o texto pedir crescimento, novos contatos, divulgação ou estiver claro que é prospecção.
`

/** Método de condução de conversa de venda — 4 etapas obrigatórias. */
const NOEL_METODO_CONDUCAO_VENDA = `
[MÉTODO DE CONDUÇÃO DE VENDA — OBRIGATÓRIO EM CONVERSAS COM LEADS/CLIENTES]
Regra central: Venda não começa oferecendo solução. Venda começa entendendo o problema.

ORDEM OBRIGATÓRIA: 1) Descobrir (investigativo) → 2) Repetir a dor → 3) Três sims → 4) Dar valor para o que vai propor.

ETAPA 1 — DIAGNÓSTICO INVESTIGATIVO
Ser INVESTIGATIVO: várias perguntas, não uma só. Sequência que descubra a dor, o desejo, a dificuldade.

Perguntas que o Noel deve incentivar (várias, em sequência):
- "O que mais tem te incomodado nessa situação?"
- "Qual tem sido a maior dificuldade nisso?"
- "O que você gostaria que fosse diferente?"
- "Como tá a rotina? Dá pra fechar as contas tranquilo ou às vezes aperta?"
- "O que mais te incomoda — a renda, o tempo, ou os dois?"

Regra: NUNCA começar oferecendo solução. Primeiro descobrir o problema com perguntas investigativas.

ETAPA 2 — REPETIR A DOR (só DEPOIS que descobriu)
Depois que a pessoa falou e o profissional descobriu a dor, repetir o diagnóstico.

Exemplo: "Então pelo que você me disse, o que mais está te incomodando é [dor da pessoa], correto?"

Objetivo: reforçar o problema, gerar sensação de compreensão, aumentar a disposição de resolver. A repetição vem DEPOIS da descoberta.

ETAPA 3 — PERGUNTAS DE CONFIRMAÇÃO (3 SIMS)
Depois de repetir o diagnóstico, perguntas que levem a respostas positivas.

Exemplos:
- "Você gostaria de resolver isso?"
- "Isso faria diferença para você?"
- "Se existisse uma forma de melhorar isso, você gostaria de conhecer?"

Objetivo: gerar pelo menos três confirmações positivas.

ETAPA 4 — DAR VALOR PARA O QUE VAI PROPOR
Somente depois dos 3 sims, conduzir para apresentação ou reunião — e DAR VALOR ao que está propondo.

Exemplo: "Com base no que você me falou, acredito que posso te ajudar com isso. O ideal seria te mostrar como funciona. Podemos marcar um horário rápido para eu te explicar?"

Objetivo: mostrar valor na apresentação, no convite, na reunião. Não pressionar — fazer a pessoa ver por que vale a pena.

PAPEL DO NOEL: Ao orientar sobre conversas com leads ou clientes, sempre verificar:
1) Se o diagnóstico INVESTIGATIVO foi feito (várias perguntas, não uma só)
2) Se a dor foi REPETIDA (depois de descobrir)
3) Se houve perguntas de confirmação (3 sims)
4) Se a conversa foi conduzida para apresentação/reunião COM VALOR

Incentivar sempre essa estrutura. Se o profissional pulou uma etapa, orientar a voltar.

SUGESTÃO DE SCRIPTS: O Noel deve sugerir scripts concretos embasados nesse método — frases prontas para diagnóstico investigativo, repetição da dor, perguntas de confirmação e convite com valor, adaptados ao contexto que o profissional descrever.
`

/** Primeira mensagem após diagnóstico — dobra a qualidade da conversa. */
const NOEL_PRIMEIRA_MENSAGEM_APOS_DIAGNOSTICO = `
[PRIMEIRA MENSAGEM APÓS DIAGNÓSTICO — QUANDO O CLIENTE/LEAD JÁ RESPONDEU UM QUIZ]
Quando alguém responde um diagnóstico e o profissional vai iniciar a conversa no WhatsApp, NUNCA começar com mensagem genérica ("Vi que você respondeu meu diagnóstico. Como posso te ajudar?"). Isso gera pouca resposta.

FÓRMULA OBRIGATÓRIA: Reconhecimento → Empatia → Pergunta simples

1. Reconhecimento: "Vi que no diagnóstico você mencionou que [resposta específica da pessoa]"
2. Empatia: "Isso é algo que muitas pessoas [passam/ enfrentam] [contexto, ex.: depois dos 40]"
3. Pergunta simples: "Posso te perguntar uma coisa rápida? [pergunta que aprofunda o problema]"

Exemplo (emagrecimento): "Vi que no diagnóstico você comentou que sente que seu metabolismo está mais lento e já tentou dieta antes. Isso é muito comum depois dos 40. Posso te perguntar uma coisa rápida? Você sente que a maior dificuldade hoje é manter a dieta ou sentir muita fome?"

Exemplo (estética): "Vi que no diagnóstico você mencionou que manchas na pele te incomodam e já tentou cosméticos. Isso é algo que muitas pessoas enfrentam. Posso te perguntar: o que mais te incomoda hoje — as manchas em si ou o que pode estar causando?"

O Noel deve sugerir essa estrutura quando o profissional perguntar como falar com lead, como iniciar conversa, primeira mensagem para cliente, ou quando mencionar que alguém respondeu o diagnóstico.
`

/** Contato frio — Uber, fila, desconhecidos. Nunca começar com link de apresentação. */
const NOEL_CONTATO_FRIO = `
[CONTATO FRIO — OBRIGATÓRIO EM RECRUTAMENTO/OPORTUNIDADE COM DESCONHECIDOS]

DETECÇÃO: Quando o profissional mencionar Uber, fila, evento, pessoa que não conhece, desconhecido, recrutar alguém — SEMPRE tratar como CONTATO FRIO.

NUNCA assumir que a pessoa já consome os produtos ou conhece o negócio. No Uber, na fila, com desconhecidos: a pessoa NÃO sabe quem você é, NÃO sabe que você usa produtos, NÃO sabe do negócio.

Quando o profissional pedir "script para mandar link de recrutamento" ou "como mandar link" em contexto de contato frio: NÃO dar o link da HOM/apresentação. Dar PRIMEIRO o script de DIAGNÓSTICO. O link vem DEPOIS, só quando houver interesse.

REGRA: NUNCA começar mandando link de apresentação ou recrutamento.

A pessoa não sabe quem você é, não sabe que você usa os produtos, não sabe do negócio. Link de apresentação é para DEPOIS.

ORDEM CORRETA:

1. PRIMEIRO — SER INVESTIGATIVO E DIAGNOSTICAR
- Fazer VÁRIAS perguntas que investiguem a situação: renda, rotina, o que incomoda, o que gostaria que fosse diferente.
- Ser investigativo: não uma pergunta só — uma sequência que descubra a dor, o desejo, a dificuldade.
- Exemplos de perguntas: "Você curte o que faz ou tá pensando em algo extra?", "Como tá a renda? Dá pra fechar as contas tranquilo?", "O que mais te incomoda no dia a dia?", "Já pensou em ter uma renda extra no seu tempo?", "O que você gostaria que fosse diferente?"
- Oferecer quiz/calculadora como ferramenta de diagnóstico — algo que ajude a pessoa a se enxergar.
- Objetivo: descobrir a dor ou o desejo ANTES de falar de oportunidade.

2. DEPOIS — QUANDO HOUVER INTERESSE
- Só quando a pessoa demonstrar curiosidade ou interesse (respondeu, refletiu, mostrou a dor), aí sim oferecer o link de apresentação ou reunião.

SCRIPTS PARA CONTATO FRIO: O Noel deve sugerir script INVESTIGATIVO — várias perguntas de diagnóstico, não apenas uma. Sequência que conduza a pessoa a falar da situação dela. Só em segundo momento link de quiz (se fizer sentido) e, por último, link de apresentação.

Exemplo de fluxo correto: "Oi! Tudo bem? [pausa] Você trabalha muito com Uber? [aguardar] Como tá a rotina, dá pra fechar as contas tranquilo ou às vezes aperta? [aguardar] O que mais te incomoda — a renda, o tempo, ou os dois? [aguardar] Já pensou em ter algo extra no seu tempo ou tá ok assim? [aguardar] Se quiser, tenho um quiz rápido que mostra onde a gente costuma travar. Leva 2 min. [link do quiz] — Só depois de interesse: link da apresentação."
`

/** Regras de uso dos links ativos (quando a lista [LINKS ATIVOS DO PROFISSIONAL] estiver presente). Base: docs/ANALISE-NOEL-TESTE-INTERNO-19-03-2026.md */
const NOEL_REGRAS_USO_LINKS_ATIVOS = `
[REGRAS DE USO DOS LINKS ATIVOS — OBRIGATÓRIO QUANDO HOUVER LISTA ACIMA]

1. LINK DO ÚLTIMO DIAGNÓSTICO / LINK PARA COMPARTILHAR
Quando o profissional pedir "link do último diagnóstico", "link do último que criei", "link para compartilhar", "me dá o link", "preciso de um link para compartilhar" ou similar: use a lista [LINKS ATIVOS DO PROFISSIONAL]. O primeiro link da lista é o mais recente (último criado). Entregue esse link em destaque: nome + URL clicável em markdown, ex.: [Nome do diagnóstico](URL). Adicione uma frase curta de uso, ex.: "Pode compartilhar esse link no WhatsApp ou nas redes." NUNCA diga que não tem acesso — você tem os links na lista. Se a lista estiver vazia (não foi injetada), diga que ainda não há diagnóstico criado e oriente a criar um em "Links" ou pedindo aqui com o tema. Se o profissional acabou de criar um link nesta conversa (bloco [LINK GERADO AGORA]), use esse link recém-criado em vez de buscar na lista.

2. PRÓXIMO PASSO / CONVERSA
Quando o profissional perguntar "qual meu próximo passo?", "o que fazer agora?" ou falar de "conversa" e existir lista de links ativos: além de orientar o passo, inclua pelo menos um link real da lista (ex.: "Use este diagnóstico para iniciar conversas: [Nome](URL)."). O primeiro da lista é o mais recente.

3. MELHOR DIAGNÓSTICO PARA CONVERSAR / COMEÇAR
Quando perguntarem "qual o melhor diagnóstico para começar a conversar?", "qual diagnóstico usar?" ou similar: intenção é obter link/opção. Se houver links ativos, liste 1–2 com nome + URL e diga quando usar cada um. Se não houver, aí sim pode pedir tema/nicho e sugerir criar um. Não responda só com teoria nem só pedindo clarificação — entregue links quando existirem.

4. ORGANIZAR SEMANA / ROTINA / ATRAIR LEADS
Quando perguntarem "como organizar minha semana?", "rotina para atrair leads" ou similar: responda CURTO (3–5 tópicos objetivos, não calendário longo dia a dia). Inclua uma "próxima ação em 24h" clara. Se fizer sentido, ofereça 1 link da lista para compartilhar hoje. Priorize formato: diagnóstico rápido + ajuste + ação imediata.
`

const SEGMENT_CONTEXT: Record<string, string> = {
  ylada: 'Você é o Noel, mentor da YLADA (motor de conversas). Oriente qualquer profissional ou vendedor sobre rotina, links inteligentes, trilha empresarial e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  med: 'Você é o Noel, mentor da YLADA para médicos. Oriente sobre rotina, links inteligentes, captação de pacientes e formação empresarial. Tom direto e prático.',
  psi: 'Você é o Noel, mentor da YLADA para a área de Psicologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  psicanalise: 'Você é o Noel, mentor da YLADA para a área de Psicanálise. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  odonto: 'Você é o Noel, mentor da YLADA para a área de Odontologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutra: 'Você é o Noel, mentor da YLADA para a área Nutra (vendedores de suplementos). Oriente sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutri:
    'Você é o Noel, mentor da YLADA para nutricionistas — mesmo produto e modelo de IA dos demais segmentos da matriz, com foco neste público. ' +
    'Oriente sobre rotina, links inteligentes, captação de pacientes para consulta nutricional, Trilha Empresarial / jornada, pilares do método, GSAL, ferramentas e formação empresarial. ' +
    'Quando falarem de dia/semana da jornada, reflexões ou anotações, trate como continuidade da trilha (sem substituir conteúdo clínico — análises de paciente são responsabilidade da profissional). ' +
    'Tom direto e prático, em conversa (evite formato de relatório longo).',
  coach: 'Você é o Noel, mentor da YLADA para a área de Coach. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  perfumaria: 'Você é o Noel, mentor da YLADA para a área de Perfumaria. Oriente vendedores de fragrâncias sobre rotina, links inteligentes, quizzes de perfil olfativo e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  seller: 'Você é o Noel, mentor da YLADA para vendedores. Oriente sobre rotina, links inteligentes, funil de vendas e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  estetica:
    'Você é o Noel, mentor da YLADA para a área de Estética. Oriente sobre rotina, links inteligentes, relacionamento com clientes que já atende (retorno, pós-procedimento) e captação quando for o caso, além de formação empresarial. Não assuma que todo pedido de script é só para atrair clientes novos. Tom direto e prático.',
  fitness: 'Você é o Noel, mentor da YLADA para a área de Fitness. Oriente personal trainers e coaches sobre rotina, links inteligentes, captação de clientes e formação empresarial. Tom direto e prático.',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [
      'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
      'perfumaria', 'estetica', 'fitness', 'nutri', 'admin', 'wellness', 'coach-bem-estar',
    ])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const {
      message,
      conversationHistory = [],
      segment,
      area = 'ylada',
      lastLinkContext,
      locale,
      channel,
      supportUi,
    } = body as {
      message?: string
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
      segment?: string
      area?: string
      lastLinkContext?: { flow_id: string; interpretacao: Record<string, unknown>; questions: Array<{ id: string; label: string; type?: string; options?: string[] }>; url?: string; title?: string; link_id?: string }
      locale?: 'pt' | 'en' | 'es'
      channel?: string
      supportUi?: 'matrix' | 'wellness'
    }

    const isSupportChannel = channel === 'support'

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 })
    }

    // Freemium: verificar limite de análises avançadas antes de chamar IA (mentor; Nina não consome cota)
    const isPro = await hasYladaProPlan(user.id)
    if (!isSupportChannel && !isPro) {
      const used = await getNoelUsageCount(user.id)
      if (used >= FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH) {
        return NextResponse.json(
          {
            error: 'limit_reached',
            limit_type: 'noel_advanced',
            message: YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE,
            upgrade_url: '/pt/precos',
          },
          { status: 403 }
        )
      }
    }

    const segmentKey = (segment ?? area) as string
    let validSegment: string = YLADA_SEGMENT_CODES.includes(segmentKey as any) ? segmentKey : 'ylada'

    // Buscar perfil e snapshot da trilha para personalizar o Noel (etapa 2.4)
    let profileResumo = ''
    let snapshotText = ''
    let profileRow: YladaNoelProfileRow | null = null
    const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim()
    if (simulateKey) {
      const fixture = getPerfilSimuladoByKey(simulateKey)
      if (fixture && fixture.segment === validSegment) {
        profileRow = fixture
        profileResumo = buildProfileResumo(fixture)
      }
    }
    if (!profileRow && supabaseAdmin) {
      const [profileRes, snapshotRes] = await Promise.all([
        supabaseAdmin
          .from('ylada_noel_profile')
          .select('*')
          .eq('user_id', user.id)
          .eq('segment', validSegment)
          .maybeSingle(),
        supabaseAdmin
          .from('user_strategy_snapshot')
          .select('snapshot_text')
          .eq('user_id', user.id)
          .maybeSingle(),
      ])
      profileRow = profileRes.data as YladaNoelProfileRow | null
      // Fallback: buscar perfil pelo segmento do user_profiles (ex.: front envia area 'ylada' mas perfil está em 'estetica'; ou perfil só existe em um segment)
      if (!profileRow) {
        const { data: up } = await supabaseAdmin
          .from('user_profiles')
          .select('perfil')
          .eq('user_id', user.id)
          .maybeSingle()
        const perfilSegment = (up?.perfil as string)?.trim()
        if (perfilSegment && YLADA_SEGMENT_CODES.includes(perfilSegment as (typeof YLADA_SEGMENT_CODES)[number])) {
          const { data: fallbackRow } = await supabaseAdmin
            .from('ylada_noel_profile')
            .select('*')
            .eq('user_id', user.id)
            .eq('segment', perfilSegment)
            .maybeSingle()
          if (fallbackRow) {
            profileRow = fallbackRow as YladaNoelProfileRow
            validSegment = perfilSegment
          }
        }
      }
      profileResumo = buildProfileResumo(profileRow)
      const snap = snapshotRes.data as { snapshot_text?: string | null } | null
      snapshotText = snap?.snapshot_text?.trim() ?? ''
    }

    // Nina — suporte ao produto (sem cota freemium, sem exigência de perfil completo)
    if (isSupportChannel) {
      const baseUrl =
        typeof request.url === 'string' ? new URL(request.url).origin : process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
      const linksAtivos = await getNoelYladaLinks(user.id, baseUrl)
      const linksAtivosBlock = formatLinksAtivosParaNoel(linksAtivos)
      const localeInstruction =
        locale === 'en'
          ? '\n[IDIOMA]\nResponda SEMPRE em inglês.'
          : locale === 'es'
            ? '\n[IDIOMA]\nResponda SEMPRE em espanhol.'
            : ''

      const history = Array.isArray(conversationHistory) ? conversationHistory : []
      const isFirstUserTurnInThread = !history.some((m) => m.role === 'user')
      let platformTicketId: string | null = null
      if (isFirstUserTurnInThread) {
        const meta = user.user_metadata as Record<string, unknown> | undefined
        const displayName =
          (typeof meta?.full_name === 'string' && meta.full_name.trim()) ||
          (typeof meta?.name === 'string' && meta.name.trim()) ||
          null
        const su = supportUi === 'wellness' ? 'wellness' : 'matrix'
        const ticketRes = await createPlatformTicketFromNinaFirstTurn({
          user,
          primeiraMensagem: message.trim(),
          segmentLabel: validSegment,
          supportUi: su,
        })
        if (ticketRes.ok) {
          platformTicketId = ticketRes.ticketId
        } else {
          void notifyNinaSupportInquiry({
            userId: user.id,
            userEmail: user.email ?? null,
            displayName,
            message: message.trim(),
            segment: validSegment,
            supportUi: su,
          }).catch((err) => console.error('[/api/ylada/noel] Nina support e-mail notify:', err))
        }
      }

      const responseText = await completeNinaSupportTurn({
        message: message.trim(),
        conversationHistory,
        segment: validSegment,
        localeInstruction,
        profileResumo,
        linksAtivosBlock: linksAtivosBlock || '',
        appOrigin: baseUrl,
        supportUi: supportUi === 'wellness' ? 'wellness' : 'matrix',
      })

      if (platformTicketId) {
        void appendNinaBotReplyToPlatformTicket(platformTicketId, responseText).catch((err) =>
          console.error('[/api/ylada/noel] Nina → support_messages:', err)
        )
      }

      return NextResponse.json({
        response: responseText,
        segment: validSegment,
        area: validSegment,
        lastLinkContext: null,
      })
    }

    // Exigir perfil empresarial completo para usar o Noel (qualidade das respostas)
    if (!simulateKey) {
      // Normalizar area_specific (Supabase JSONB pode vir como objeto ou string)
      let as: Record<string, unknown> = {}
      const raw = profileRow?.area_specific
      if (raw != null) {
        if (typeof raw === 'string') {
          try {
            as = (JSON.parse(raw) as Record<string, unknown>) || {}
          } catch {
            as = {}
          }
        } else if (typeof raw === 'object' && !Array.isArray(raw)) {
          as = raw as Record<string, unknown>
        }
      }
      const temNome = as?.nome != null && String(as.nome).trim().length >= 2
      const temWhatsapp = as?.whatsapp != null && String(as.whatsapp).replace(/\D/g, '').length >= 10
      const temPerfilEmpresarial = profileRow?.profile_type && profileRow?.profession
      if (!temNome || !temWhatsapp || !temPerfilEmpresarial) {
        const msg = (message ?? '').toLowerCase().trim()
        let profileRequiredMessage: string
        if (/próximo passo|o que fazer|o que faço agora/i.test(msg)) {
          profileRequiredMessage = 'Seu próximo passo é completar seu perfil empresarial (nome, telefone e tipo de atuação). Assim o Noel consegue te dar orientações personalizadas.'
        } else if (/criar (fluxo|diagnóstico|quiz|link)|como criar|gerar (link|quiz)|quero (um )?link|quero (um )?diagnóstico/i.test(msg)) {
          profileRequiredMessage = 'Para criar diagnósticos e links, complete antes seu perfil empresarial (nome, telefone e tipo de atuação).'
        } else if (/link do último|último diagnóstico|link (para )?compartilhar|me dá o link|me dá a link/i.test(msg)) {
          profileRequiredMessage = 'Para ver e compartilhar seus links, complete seu perfil empresarial (nome, telefone e tipo de atuação) primeiro.'
        } else if (/script|whatsapp|enviar no whatsapp/i.test(msg)) {
          profileRequiredMessage = 'Para receber scripts personalizados, complete seu perfil empresarial (nome, telefone e tipo de atuação) e use o Noel com orientações à sua área.'
        } else if (/organizar (a )?semana|rotina|atrair (mais )?leads/i.test(msg)) {
          profileRequiredMessage = 'Para organizar sua semana e atrair mais leads com orientações personalizadas, complete seu perfil empresarial (nome, telefone e tipo de atuação).'
        } else if (/recomenda|recomendação|começar|sou da área|o que você me recomenda/i.test(msg)) {
          profileRequiredMessage = 'Para recomendações alinhadas à sua área, complete seu perfil empresarial (nome, telefone e tipo de atuação) e volte aqui.'
        } else {
          profileRequiredMessage = 'Complete seu perfil empresarial (nome, telefone e tipo de atuação) para usar o Noel e receber orientações personalizadas.'
        }
        return NextResponse.json(
          {
            error: 'profile_required',
            message: profileRequiredMessage,
            profile_url: '/pt/perfil-empresarial',
          },
          { status: 403 }
        )
      }
    }

    // Memória estratégica + Mapa Estratégico do Noel (jornada entre conversas)
    let noelMemoryText = ''
    let strategyMapText = ''
    let noelMemory: Awaited<ReturnType<typeof getNoelMemory>> = null
    if (supabaseAdmin) {
      try {
        noelMemory = await getNoelMemory(user.id, validSegment)
        noelMemoryText = formatNoelMemoryForPrompt(noelMemory)
        const strategyMap = await getStrategyMap(user.id, validSegment, noelMemory)
        strategyMapText = formatStrategyMapForPrompt(strategyMap)
      } catch (e) {
        console.warn('[/api/ylada/noel] memória/mapa:', e)
      }
    }

    const baseUrl = typeof request.url === 'string' ? new URL(request.url).origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app')
    const linksAtivos = await getNoelYladaLinks(user.id, baseUrl)
    const linksAtivosBlock = formatLinksAtivosParaNoel(linksAtivos)

    // Links com baixa conversão: Noel pode sugerir melhorias proativamente
    const linksLowConversion = await getLinksWithLowConversion(user.id, baseUrl)
    const linkPerformanceBlock = formatLinkPerformanceForNoel(linksLowConversion)

    // Se o profissional pediu ajuste no link anterior: interpret com contexto + generate novo link
    let linkGeradoBlock = ''
    let lastLinkContextOut: typeof lastLinkContext = undefined
    let canonicalAppendix: {
      title: string
      url: string
      flowId: string
      config: Record<string, unknown> | null
    } | null = null

    if (lastLinkContext?.flow_id && lastLinkContext?.interpretacao && isIntencaoAjustarLink(message)) {
      try {
        const cookie = request.headers.get('cookie') || ''
        const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', cookie },
          body: JSON.stringify({
            text: message.trim(),
            segment: validSegment,
            profile_type: profileRow?.profile_type ?? undefined,
            profession: profileRow?.profession ?? undefined,
            previousLinkContext: {
              flow_id: lastLinkContext.flow_id,
              theme: lastLinkContext.interpretacao?.tema ?? '',
              questions: lastLinkContext.questions ?? [],
            },
            ...(locale && { locale }),
          }),
        })
        const interpretJson = await interpretRes.json().catch(() => ({}))
        const data = interpretJson?.data
        const flowId = data?.flow_id
        const interpretacao = data?.interpretacao
        const questions = Array.isArray(data?.questions) ? data.questions : lastLinkContext.questions
        const confidence = typeof data?.confidence === 'number' ? data.confidence : 0.8

        if (flowId && interpretacao && confidence >= 0.5) {
          const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify({
              flow_id: flowId,
              interpretacao,
              questions: questions.length > 0 ? questions : undefined,
              segment: validSegment,
              ...(locale && { locale }),
            }),
          })
          const genJson = await genRes.json().catch(() => ({}))
          if (genJson?.success && genJson?.data?.url) {
            const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
            const title = formatDisplayTitle(titleRaw)
            lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
            canonicalAppendix = {
              title,
              url: genJson.data.url,
              flowId,
              config: (genJson.data.config as Record<string, unknown> | undefined) ?? null,
            }
            const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
            linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'ajustado')
          }
        }
      } catch (e) {
        console.warn('[/api/ylada/noel] ajuste interpret/generate:', e)
      }
    }

    const blockAutoLinkForClientFollowUp = shouldBlockAutoLinkForClientFollowUp(message)

    // Se o profissional pediu link/quiz/calculadora: verificar perfil; se tiver, interpret + generate
    if (!linkGeradoBlock && !blockAutoLinkForClientFollowUp && isIntencaoCriarLink(message, conversationHistory)) {
      const temPerfil = profileRow && (profileRow.profile_type || profileRow.profession)
      if (!temPerfil) {
        linkGeradoBlock = '\n[AVISO: SEM PERFIL]\nO perfil do profissional está incompleto (falta tipo de atuação e/ou área). NÃO gere link. Explique de forma amigável: (1) que o perfil está incompleto e ele precisa preencher em "Perfil empresarial" (menu ao lado); (2) que você sempre se baseia no perfil dele para recomendar o link mais adequado — por isso é essencial que ele complete o perfil primeiro. Depois que preencher, ele pode pedir o link de novo que aí você entrega.'
      } else {
        try {
          const cookie = request.headers.get('cookie') || ''
          const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify({
              text: message.trim(),
              segment: validSegment,
              profile_type: profileRow?.profile_type ?? undefined,
              profession: profileRow?.profession ?? undefined,
              ...(locale && { locale }),
            }),
          })
          const interpretJson = await interpretRes.json().catch(() => ({}))
          const data = interpretJson?.data
          const flowId = data?.flow_id
          const interpretacao = data?.interpretacao
          const questions = Array.isArray(data?.questions) ? data.questions : []
          const confidence = typeof data?.confidence === 'number' ? data.confidence : 0

          if (flowId && interpretacao && confidence >= 0.5) {
            const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', cookie },
              body: JSON.stringify({
                flow_id: flowId,
                interpretacao,
                questions: questions.length > 0 ? questions : undefined,
                segment: validSegment,
                ...(locale && { locale }),
              }),
            })
            const genJson = await genRes.json().catch(() => ({}))
            if (genJson?.success && genJson?.data?.url) {
              const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
              const title = formatDisplayTitle(titleRaw)
              lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
              canonicalAppendix = {
                title,
                url: genJson.data.url,
                flowId,
                config: (genJson.data.config as Record<string, unknown> | undefined) ?? null,
              }
              const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
              linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'novo')
            }
          }
        } catch (e) {
          console.warn('[/api/ylada/noel] interpret/generate:', e)
        }
      }
    }

    // Primeira conversa guiada: mensagem vaga + perfil existe → gerar diagnóstico base automaticamente (demonstrar valor)
    const primeiraConversaOuVaga = isPrimeiraConversaOuVaga(message, conversationHistory)
    if (!linkGeradoBlock && !blockAutoLinkForClientFollowUp && primeiraConversaOuVaga && profileRow && (profileRow.profile_type || profileRow.profession)) {
      try {
        const cookie = request.headers.get('cookie') || ''
        const defaultText = getDefaultInterpretTextPrimeiraConversa(validSegment)
        const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', cookie },
          body: JSON.stringify({
            text: defaultText,
            segment: validSegment,
            ...(locale && { locale }),
            profile_type: profileRow?.profile_type ?? undefined,
            profession: profileRow?.profession ?? undefined,
          }),
        })
        const interpretJson = await interpretRes.json().catch(() => ({}))
        const data = interpretJson?.data
        const flowId = data?.flow_id
        const interpretacao = data?.interpretacao
        const questions = Array.isArray(data?.questions) ? data.questions : []
        const confidence = typeof data?.confidence === 'number' ? data.confidence : 0
        if (flowId && interpretacao && confidence >= 0.5) {
          const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify({
              flow_id: flowId,
              interpretacao,
              questions: questions.length > 0 ? questions : undefined,
              segment: validSegment,
              ...(locale && { locale }),
            }),
          })
          const genJson = await genRes.json().catch(() => ({}))
          if (genJson?.success && genJson?.data?.url) {
            const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
            const title = formatDisplayTitle(titleRaw)
            lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
            canonicalAppendix = {
              title,
              url: genJson.data.url,
              flowId,
              config: (genJson.data.config as Record<string, unknown> | undefined) ?? null,
            }
            const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
            linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'novo')
          }
        }
      } catch (e) {
        console.warn('[/api/ylada/noel] primeira conversa interpret/generate:', e)
      }
    }

    // Biblioteca do Noel: situação → perfil → objetivo → estratégias + conversas + insights
    // Fluxo: Mensagem → SITUAÇÃO → PERFIL → OBJETIVO → biblioteca → segmento
    let detectedStrategicProfileText = ''
    let detectedProfessionalProfileText = ''
    let detectedObjectiveText = ''
    let detectedFunnelStageText = ''
    let noelLibraryContext = ''
    let noelStrategies: Awaited<ReturnType<typeof getNoelLibraryContextWithStrategies>>['strategies'] = []
    let diagnosisInsightsText: string | null = null
    let intentInsightsText: string | null = null
    let situationCodes: string[] = []
    let professionalProfileCodes: string[] = []
    let objectiveCodes: string[] = []
    let funnelStageCodes: string[] = []
    try {
      const detectedProfiles = getStrategicProfilesForMessage(message)
      situationCodes = detectedProfiles.map((p) => p.profile_code)
      const professionalProfiles = getProfessionalProfilesForMessage(message, situationCodes)
      professionalProfileCodes = professionalProfiles.map((p) => p.profile_code)
      const objectives = getStrategicObjectivesForMessage(message)
      objectiveCodes = objectives.map((o) => o.objective_code)
      const funnelStages = getFunnelStagesForMessage(message)
      funnelStageCodes = funnelStages.map((s) => s.stage_code)

      if (detectedProfiles.length) detectedStrategicProfileText = formatStrategicProfileForPrompt(detectedProfiles)
      if (professionalProfiles.length) detectedProfessionalProfileText = formatProfessionalProfileForPrompt(professionalProfiles)
      if (objectives.length) detectedObjectiveText = formatStrategicObjectiveForPrompt(objectives)
      if (funnelStages.length) detectedFunnelStageText = formatFunnelStageForPrompt(funnelStages)

      const libResult = await getNoelLibraryContextWithStrategies(message, {
        situationCodes: situationCodes.length ? situationCodes : undefined,
        professionalProfileCodes: professionalProfileCodes.length ? professionalProfileCodes : undefined,
        objectiveCodes: objectiveCodes.length ? objectiveCodes : undefined,
        funnelStageCodes: funnelStageCodes.length ? funnelStageCodes : undefined,
      })
      noelLibraryContext = libResult.context
      noelStrategies = libResult.strategies
      const messageMentionsDiagnosis = /diagnóstico|diagnostico|meu resultado|resultado do diagnóstico|diagnóstico deu|deu curiosos|deu clientes|em desenvolvimento/i.test(message)
      if (messageMentionsDiagnosis) {
        diagnosisInsightsText = await getDiagnosisInsightsContext(FALLBACK_DIAGNOSTIC_ID_INSIGHTS)
        intentInsightsText = await getIntentInsightsContext()
      }
    } catch (e) {
      console.warn('[/api/ylada/noel] biblioteca Noel (perfis/estratégias/insights):', e)
    }

    const baseSystem = SEGMENT_CONTEXT[validSegment] ||
      'Você é o Noel, mentor da YLADA. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.'
    const localeInstruction = locale === 'en'
      ? '\n[IDIOMA]\nResponda SEMPRE em inglês. Todas as suas mensagens devem ser em inglês.'
      : locale === 'es'
        ? '\n[IDIOMA]\nResponda SEMPRE em espanhol. Todas as suas mensagens devem ser em espanhol.'
        : ''
    const parts: string[] = [
      baseSystem + localeInstruction,
      NOEL_MODO_EXECUTOR_LINK,
      NOEL_FORMATO_DIAGNOSTICO_CHAT,
      NOEL_CLIENTE_ATENDIDO_VS_CAPTACAO,
      NOEL_CONDUTOR_RULES,
      NOEL_PRINCIPIO_20_80,
      NOEL_SCRIPTS_INDICACOES_E_MICROCONTEXTO,
      NOEL_PERMISSAO_E_CURIOSIDADE_ANTES_DO_LINK,
      NOEL_METODO_CONDUCAO_VENDA,
      NOEL_PRIMEIRA_MENSAGEM_APOS_DIAGNOSTICO,
      NOEL_CONTATO_FRIO,
    ]

    // Detecção de contato frio: Uber, recrutar, link de recrutamento — injeta alerta para forçar diagnóstico primeiro
    const m = message.toLowerCase().trim()
    const isContatoFrio =
      m.includes('uber') ||
      (m.includes('recrutar') && (m.includes('link') || m.includes('conversa') || m.includes('conduzir'))) ||
      (m.includes('link de recrutamento') || m.includes('link de apresentação'))
    if (isContatoFrio) {
      parts.push(
        '\n[ALERTA — CONTATO FRIO DETECTADO]\nA mensagem do profissional indica Uber, recrutamento com desconhecido ou pedido de link de recrutamento. NÃO dar link da HOM/apresentação. Entregar APENAS script de DIAGNÓSTICO investigativo (várias perguntas). Explicar que o link vem DEPOIS, quando a pessoa demonstrar interesse. A pessoa NÃO conhece o negócio, NÃO consome produtos.'
      )
    }
    const falaDeComunicacao = /\bcomunica[cç][ãa]o\b|diagn[oó]stico\s+(de\s+)?comunica|para\s+minha\s+comunica/i.test(message)
    if (falaDeComunicacao) {
      parts.push(
        '\n[FOCO EM COMUNICAÇÃO]\nO profissional mencionou COMUNICAÇÃO ou diagnóstico para comunicação. Mantenha o tema em: como o profissional se comunica com clientes/leads, qualificação (curiosos vs clientes preparados), marketing e conversas. NÃO mude para emagrecimento, saúde, produto ou outro tema a menos que ele peça explicitamente. Se ele pedir um diagnóstico, sugira perguntas sobre comunicação/abordagem/qualificação, não sobre peso ou hábitos alimentares.'
      )
    }
    const pareceScriptParaClienteAtendido =
      /para (uma |minha )?(cliente|paciente)\b|com (uma |minha )?(cliente|paciente)\b|minha cliente\b|minha paciente\b|(cliente|paciente) que já\b|quem já veio|retorno|follow[- ]?up|pós[- ]?proced|reagendar|mensagem para (o |a )?(cliente|paciente)/i.test(
        message
      )
    if (pareceScriptParaClienteAtendido) {
      parts.push(
        '\n[CONTEXTO — MENSAGEM PARA QUEM JÁ ATENDE]\nA mensagem do profissional indica foco em **cliente/paciente da carteira ou retorno**, não em prospecção. Priorize script de WhatsApp para **relacionamento e continuidade do serviço** (estética, saúde, etc.). Não use como padrão roteiro de "atrair mais clientes para o negócio" ou diagnóstico de captação.'
      )
    }
    if (profileResumo) {
      parts.push('\n[PERFIL DO PROFISSIONAL]\n' + profileResumo)
      parts.push(
        '\n[USE O PERFIL]\nBaseie sempre sua resposta no perfil acima. Use a linguagem e o contexto da profissão/segmento: médico → pacientes, consultório, agenda; nutri/estética/fitness → clientes; psicologia/psicanálise → pacientes ou clientes conforme o perfil; vendedor/perfumaria → clientes, leads. Sugestões de diagnóstico, captação e comunicação devem ser direcionadas ao tipo de atuação dele.'
      )
    } else {
      parts.push('\nO profissional ainda não preencheu o perfil empresarial. Oriente de forma útil e, se fizer sentido, sugira completar o perfil em "Perfil empresarial" para orientações mais personalizadas.')
    }
    if (snapshotText) {
      parts.push('\n[RESUMO ESTRATÉGICO DA TRILHA — situação atual e próximos passos]\n' + snapshotText)
    }
    if (noelMemoryText) {
      parts.push(
        '\n[MEMÓRIA ESTRATÉGICA — o que você já sabe da jornada deste profissional]\n' +
          noelMemoryText +
          '\nUse essa memória para dar continuidade. Ex.: "Você já criou o diagnóstico… Agora o próximo passo é…" Responda como mentor que acompanha a evolução.'
      )
    }
    if (strategyMapText) {
      parts.push(
        '\n[MAPA ESTRATÉGICO — progresso nas etapas]\n' +
          strategyMapText +
          '\nUse o mapa para orientar o próximo passo. Ex.: "Você já está em Captação e Diagnóstico. Agora vamos focar em Conversa — use o diagnóstico para iniciar conversas."'
      )
    }
    if (detectedStrategicProfileText) {
      parts.push('\n[PERFIL ESTRATÉGICO IDENTIFICADO — SITUAÇÃO]\n' + detectedStrategicProfileText + '\n' + NOEL_DETECTED_PROFILE_INSTRUCTION)
    }
    if (detectedProfessionalProfileText) {
      parts.push(
        '\n[PERFIL DO PROFISSIONAL IDENTIFICADO]\n' +
          detectedProfessionalProfileText +
          '\nUse esse perfil para orientar o próximo movimento e priorizar estratégias. O foco é direcionar ação, não só responder perguntas.'
      )
    }
    if (detectedObjectiveText) {
      parts.push(
        '\n[OBJETIVO ESTRATÉGICO IDENTIFICADO]\n' +
          detectedObjectiveText +
          '\nResponda com FOCO nesse objetivo. Priorize estratégias e próximo movimento alinhados ao que o profissional quer alcançar.'
      )
    }
    if (detectedFunnelStageText) {
      parts.push(
        '\n[ESTÁGIO DO FUNIL IDENTIFICADO]\n' +
          detectedFunnelStageText +
          '\nUse esse estágio para escolher a estratégia certa. Ex.: curiosidade → diagnóstico antes de preço; decisão → explicar valor e tratamento.'
      )
    }
    if (noelLibraryContext.trim()) {
      parts.push('\n' + NOEL_STRATEGIC_PROTOCOL + noelLibraryContext + '\n' + NOEL_STRATEGIC_RULE)
      parts.push(
        '\n[FLUXO MENTOR — OBRIGATÓRIO]\nQuando houver estratégias na biblioteca, conduza como uma conversa natural. NÃO use rótulos como "Diagnóstico:", "Explicação:", "Próximo movimento:", "Exemplo:". Integre o conteúdo fluindo: (1) o diagnóstico ("Isso acontece quando..."); (2) o porquê; (3) a ação concreta; (4) exemplo se houver. Deixe UMA linha em branco entre cada ideia (entre diagnóstico e explicação, etc.). O Noel conversa, não recita tópicos.'
      )
    }
    if (diagnosisInsightsText) {
      parts.push('\n' + diagnosisInsightsText + '\nUse esses insights para enriquecer sua resposta. Mantenha o foco em comunicação e qualificação (curiosos vs clientes).')
    }
    if (intentInsightsText) {
      parts.push('\n' + intentInsightsText + '\nUse esses dados de intenção reais da plataforma para sugerir perguntas que geram mais respostas e diagnósticos que convertem mais.')
    }
    if (detectedStrategicProfileText || detectedProfessionalProfileText || detectedObjectiveText || detectedFunnelStageText || noelMemoryText || strategyMapText || noelLibraryContext.trim() || diagnosisInsightsText || intentInsightsText) {
      parts.push('\n' + NOEL_LAYER4_PRIORITY_RULE)
    }
    if (linksAtivosBlock) {
      parts.push(linksAtivosBlock)
      parts.push(NOEL_REGRAS_USO_LINKS_ATIVOS)
    }
    if (linkPerformanceBlock) parts.push(linkPerformanceBlock)
    if (linkGeradoBlock) parts.push(linkGeradoBlock)
    if (linkGeradoBlock && lastLinkContextOut?.url) {
      const url = lastLinkContextOut.url
      parts.push(
        '\n[INCENTIVO MÚLTIPLOS DIAGNÓSTICOS]\nApós entregar o link, pode incentivar experimentação: "Muitos profissionais também testam variações de diagnóstico para ver qual gera mais interesse. Posso criar outra versão focada em: sintomas, hábitos, objetivos ou resultados desejados." Isso incentiva criação de múltiplos diagnósticos e compartilhamento.'
      )
      parts.push(
        `\n🚨 ALINHAMENTO COM O BLOCO OFICIAL:\nO sistema anexará ao final **### Quiz e link (oficial — igual ao link público e à edição)** com as perguntas exatas e [Acesse seu quiz](${url}). Sua mensagem deve ser só introdução (sem listar perguntas, sem outro link markdown).`
      )
    }
    if (primeiraConversaOuVaga && linkGeradoBlock) {
      parts.push(
        '\n[PRIMEIRA CONVERSA GUIADA — COM LINK]\nO profissional está começando. Mensagem curta: boas-vindas, tema, que o bloco oficial abaixo traz o quiz idêntico ao link. Objetivo: "já tenho algo para usar" em segundos.'
      )
    }
    if (primeiraConversaOuVaga && !linkGeradoBlock) {
      parts.push(
        '\n[PRIMEIRA CONVERSA OU MENSAGEM VAGA — SEM LINK]\nO profissional está começando ou não sabe por onde começar. NÃO apenas explique o sistema — mostre o caminho prático. Se o perfil estiver incompleto: diga para preencher em "Perfil empresarial" (menu ao lado) e que em um minuto você cria um diagnóstico para ele testar. Se o perfil já existir: diga que pode criar um diagnóstico agora e sugira que ele peça com o tema, ex.: "Quero um diagnóstico para captar clientes" (ou "captar pacientes" se for médico), e aí você gera o link. Objetivo: demonstrar valor, não só explicar.'
      )
    }
    if (isIntencaoCriarLink(message, conversationHistory) && !linkGeradoBlock) {
      parts.push(
        '\n[PEDIDO DE LINK SEM GERAÇÃO]\nO profissional pediu link/quiz/fluxo mas o sistema não gerou o link nesta resposta. NUNCA invente um link ou diga "Clique aqui para acessar o diagnóstico" sem um URL real. O link só existe quando o sistema fornece. Oriente: "Para eu gerar o link, pode pedir com o tema explícito, por exemplo: Quero um link para emagrecimento ou Cria um quiz para tizerpatide." Na próxima mensagem com tema claro o sistema gerará o link e o quiz completo na conversa.'
      )
    }
    const systemContent = parts.join('')

    // Memória de conversa: quando frontend não envia histórico, carregar do DB (janela 8 msgs)
    let historyToUse = conversationHistory
    if (!historyToUse || historyToUse.length === 0) {
      const dbHistory = await getRecentMessages(user.id, 8)
      historyToUse = dbHistory
    }

    // Preparar histórico: se houver linkGeradoBlock, adicionar instrução para ignorar formato de links no histórico
    const historyWithWarning = linkGeradoBlock && historyToUse.length > 0
      ? [
          ...historyToUse.slice(-12).map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.role === 'assistant' && m.content.includes('Copiar link')
              ? m.content + '\n\n[NOTA: O formato de link acima estava incorreto. Sempre use markdown [Texto](URL) nas suas respostas.]'
              : m.content,
          })),
        ]
      : historyToUse.slice(-12).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...historyWithWarning,
      { role: 'user', content: message.trim() },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    let responseText =
      completion.choices[0]?.message?.content?.trim() ||
      'Desculpe, não consegui processar. Tente novamente.'

    // Pós-processamento: remover marcações internas que não devem aparecer na resposta
    // Remover com variações (com/sem espaços, quebras de linha, etc.)
    responseText = responseText.replace(/\[LINK GERADO AGORA[^\]]*\]/gi, '')
    responseText = responseText.replace(/\[LINK AJUSTADO[^\]]*\]/gi, '')
    responseText = responseText.replace(/\[LINK GERADO AGORA PARA ESTE PEDIDO\]/gi, '')
    responseText = responseText.replace(/\[LINK AJUSTADO E GERADO\]/gi, '')
    // Remover linhas inteiras que contêm apenas a marcação (com espaços/quebras)
    responseText = responseText.replace(/^\s*\[LINK GERADO AGORA[^\]]*\]\s*$/gim, '')
    responseText = responseText.replace(/^\s*\[LINK AJUSTADO[^\]]*\]\s*$/gim, '')
    // Limpar linhas vazias duplicadas após remoção
    responseText = responseText.replace(/\n{3,}/g, '\n\n')
    
    // DEBUG: Log após remoção de marcações internas (antes do pós-processamento de links)
    if (linkGeradoBlock && lastLinkContextOut?.url && responseText.includes('Copiar link')) {
      const debugTitle = lastLinkContextOut.title || 'Acesse seu quiz'
      const debugUrl = lastLinkContextOut.url
      const expectedMarkdown = '[' + debugTitle + '](' + debugUrl + ')'
      if (!responseText.includes(expectedMarkdown)) {
        console.log('[DEBUG] Link não está em markdown ANTES do pós-processamento. Resposta:', responseText.substring(0, 500))
      }
    }

    // Pós-processamento: garantir que links sejam markdown quando linkGeradoBlock existe
    try {
      if (linkGeradoBlock && lastLinkContextOut?.url) {
        const url = lastLinkContextOut.url
        const title = lastLinkContextOut.title || 'Acesse seu quiz'
        
        // DEBUG: Log temporário para verificar o que está sendo retornado
        if (responseText.includes('Copiar link') && !responseText.includes(`[${title}](${url})`)) {
          console.log('[DEBUG] Link não está em markdown. Resposta antes do pós-processamento:', responseText.substring(0, 500))
        }
        
        // Verificar se já tem markdown com a URL correta
        let hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
        
        // Se não tem markdown, procurar e substituir padrões incorretos
        if (!hasMarkdownLink) {
          // PRIORIDADE 1: Padrão "Título: Clique aqui para acessar...Copiar link"
          // Exemplos: "Emagrecimento e saúde intestinal: Clique aqui para acessar o diagnósticoCopiar link"
          const titleWithClickPattern = new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^:]+|Diagnóstico de [^:]+):\\s*Clique aqui para acessar[^\\[\\n]*Copiar link`, 'gi')
          if (titleWithClickPattern.test(responseText)) {
            titleWithClickPattern.lastIndex = 0
            responseText = responseText.replace(titleWithClickPattern, `[${title}](${url})`)
            hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
          }
          
          // PRIORIDADE 2: Padrão mais simples - título colado diretamente com "Copiar link" (sem espaço)
          // Exemplos: "Emagrecimento e saúde intestinalCopiar link", "Calculadora de Projeção de ResultadosCopiar link"
          if (!hasMarkdownLink) {
            const directTitlePattern = new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de Projeção de Resultados|Diagnóstico de Emagrecimento e Saúde Intestinal)(?![^\\[]*\\]\\()Copiar link`, 'gi')
            if (directTitlePattern.test(responseText)) {
              directTitlePattern.lastIndex = 0
              responseText = responseText.replace(directTitlePattern, `[${title}](${url})`)
              hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
            }
          }
          
          // PRIORIDADE 2: Padrão genérico: qualquer texto seguido de "Copiar link" (sem espaço antes)
          if (!hasMarkdownLink) {
          const genericPattern = /([^\n\[\]]+?)(?![^\[]*\]\()Copiar link/gi
          if (genericPattern.test(responseText)) {
            // Resetar o regex (test() avança o lastIndex)
            genericPattern.lastIndex = 0
            const genericMatches = responseText.match(genericPattern)
            if (genericMatches) {
              const relevantMatch = genericMatches.find(m => 
                /calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal|projeção|resultados/i.test(m)
              )
              if (relevantMatch) {
                responseText = responseText.replace(genericPattern, (match, p1) => {
                  // Só substituir se contiver palavras-chave relacionadas
                  if (/calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal|projeção|resultados/i.test(p1)) {
                    return `[${title}](${url})`
                  }
                  return match
                })
                hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
              }
            }
          }
          }
          
          // Padrões específicos (caso o genérico não tenha pegado)
          if (!hasMarkdownLink) {
          const replacements = [
            // "TítuloCopiar link" (padrão mais comum agora - PRIORIDADE MÁXIMA) - sem parênteses, sem dois pontos
            {
              pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+|Diagnóstico sobre [^\\n\\[\\]]+|Calculadora de Projeção de [^\\n\\[\\]]+)(?![^\\[]*\\]\\()Copiar link`, 'gi'),
              replacement: `[${title}](${url})`
            },
          // "Título (quiz)Copiar link" ou "Título (calculadora)Copiar link" (padrão com parênteses)
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+|Diagnóstico sobre [^\\n\\[\\]]+)\\s*\\([^)]+\\)Copiar link`, 'gi'),
            replacement: `[${title}](${url})`
          },
          // "Título (quiz)Copiar link" - padrão mais simples (sem título específico)
          {
            pattern: /([^\n\[\]]+?)\s*\([^)]+\)Copiar link/gi,
            replacement: (match, p1) => {
              // Só substituir se contiver palavras-chave relacionadas
              if (/calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal/i.test(p1)) {
                return `[${title}](${url})`
              }
              return match
            }
          },
          // "Título: Clique aqui para acessar...Copiar link" (padrão mais comum agora - PRIORIDADE ALTA)
          // Captura: "Título: Clique aqui para acessar o diagnósticoCopiar link" ou "Título: Clique aqui para acessar a calculadoraCopiar link"
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Avaliação de [^:]+|Calculadora de [^:]+|Diagnóstico de [^:]+|Diagnóstico sobre [^:]+):\\s*Clique aqui para acessar[^\\[\\n]*Copiar link`, 'gi'),
            replacement: `[${title}](${url})`
          },
          // "Título\nTítuloCopiar link" (título repetido em duas linhas, segunda com "Copiar link")
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+|Diagnóstico sobre [^\\n\\[\\]]+)\\s*\\n\\s*(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+)Copiar link`, 'gi'),
            replacement: `$1\n\n[${title}](${url})`
          },
          // "Título\nLink do diagnósticoCopiar link" ou "Título\nLink do diagnóstico Copiar link"
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*\\n\\s*Link do (?:diagnóstico|quiz|link)[^\\[]*Copiar link`, 'gi'),
            replacement: `$1\n\n[${title}](${url})`
          },
          // "Título: Clique aqui para acessar...Copiar link" (padrão mais comum agora - variação)
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Avaliação de [^:]+|Calculadora de [^:]+|Diagnóstico de [^:]+|Diagnóstico sobre [^:]+):\\s*Clique aqui para acessar[^\\[\\n]*Copiar link`, 'gi'),
            replacement: `[${title}](${url})`
          },
          // "Clique aqui para acessar...Copiar link" (standalone, sem título antes)
          {
            pattern: /Clique aqui para acessar[^\\[\\n]*Copiar link/gi,
            replacement: `[${title}](${url})`
          },
          // "Link do diagnósticoCopiar link" (standalone)
          {
            pattern: /Link do (?:diagnóstico|quiz|link)[^\\[]*Copiar link/gi,
            replacement: `[${title}](${url})`
          },
          // "Título: Copiar link" (sem URL visível)
          {
            pattern: new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}):\\s*Copiar link`, 'gi'),
            replacement: `[${title}](${url})`
          },
            ]
            
            for (const { pattern, replacement } of replacements) {
            const testResult = pattern.test(responseText)
            if (testResult) {
              // Se replacement é função, usar replace com callback; senão, usar string direta
              if (typeof replacement === 'function') {
                responseText = responseText.replace(pattern, replacement)
              } else {
                responseText = responseText.replace(pattern, replacement)
              }
              hasMarkdownLink = true
              break
            }
            }
          }
          
          // Fallback mais agressivo: procurar qualquer texto seguido de "Copiar link" que não seja markdown
          if (!hasMarkdownLink) {
          const fallbackPattern = /([^\n\[\]]+?)(?![^\[]*\]\()Copiar link/gi
          const matches = responseText.match(fallbackPattern)
          if (matches) {
            // Verificar se algum match contém palavras-chave relacionadas
            const relevantMatch = matches.find(m => 
              /calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal/i.test(m)
            )
            if (relevantMatch) {
              responseText = responseText.replace(fallbackPattern, (match, p1) => {
                if (/calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal/i.test(p1)) {
                  return `[${title}](${url})`
                }
                return match
              })
              hasMarkdownLink = true
            }
            }
          }
          
          // Fallback final: se ainda não tem markdown, fazer busca ULTRA agressiva
          if (!hasMarkdownLink) {
          // Procurar qualquer ocorrência de "Copiar link" e substituir o texto anterior
          const ultraGenericPattern = /([^\n\[\]]{5,}?)(?![^\[]*\]\()Copiar link/gi
          if (ultraGenericPattern.test(responseText)) {
            // Resetar lastIndex
            ultraGenericPattern.lastIndex = 0
            // Substituir TODAS as ocorrências que contêm palavras-chave
            responseText = responseText.replace(ultraGenericPattern, (match, p1) => {
              const trimmed = p1.trim()
              // Verificar se contém palavras-chave E não é muito curto (evitar falsos positivos)
              if (trimmed.length >= 5 && /calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal|projeção|resultados|nutrição/i.test(trimmed)) {
                return `[${title}](${url})`
              }
              return match
            })
            // Verificar se agora tem markdown
            hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
            }
          }
          
          // Último recurso: se ainda não tem markdown mas há "Copiar link" na resposta, substituir diretamente
          if (!hasMarkdownLink && responseText.includes('Copiar link') && !responseText.includes(`[${title}](${url})`)) {
          // Procurar a linha que contém "Copiar link" e substituir tudo antes dele
          const lines = responseText.split('\n')
          const newLines = lines.map(line => {
            if (line.includes('Copiar link') && !line.includes('[') && !line.includes('](')) {
              // Encontrar onde está "Copiar link" e substituir tudo antes (incluindo se estiver colado)
              const copyIndex = line.indexOf('Copiar link')
              const beforeCopy = line.substring(0, copyIndex).trim()
              // Verificar se contém palavras-chave relacionadas
              if (beforeCopy.length >= 5 && /calculadora|diagnóstico|quiz|link|emagrecimento|saúde|intestinal|projeção|resultados|nutrição/i.test(beforeCopy)) {
                return `[${title}](${url})`
              }
              // Se não encontrou palavras-chave mas o título está na linha, substituir também
              if (beforeCopy.length >= 5 && (beforeCopy.includes(title) || title.includes(beforeCopy) || beforeCopy.toLowerCase().includes('calculadora') || beforeCopy.toLowerCase().includes('diagnóstico'))) {
                return `[${title}](${url})`
              }
            }
            return line
          })
            responseText = newLines.join('\n')
            hasMarkdownLink = new RegExp(`\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`).test(responseText)
          }
          
          // Se ainda não tem markdown mas o título está na resposta, adicionar após o título
          if (!hasMarkdownLink) {
          // Padrão específico: título em uma linha, mesmo título + "Copiar link" na próxima
          const titleRepeatPattern = new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+|Diagnóstico sobre [^\\n\\[\\]]+)\\s*\\n\\s*\\1Copiar link`, 'gi')
          if (titleRepeatPattern.test(responseText)) {
            responseText = responseText.replace(
              titleRepeatPattern,
              `$1\n\n[${title}](${url})`
            )
            hasMarkdownLink = true
            }
          }
          
          if (!hasMarkdownLink && responseText.includes(title)) {
          // Primeiro, tentar remover "Copiar link" que está colado no título (SEM ESPAÇO)
          // Padrão: "TítuloCopiar link" (sem espaço entre título e "Copiar link")
          const titleWithCopyPattern = new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Emagrecimento e saúde intestinal|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+|Diagnóstico sobre [^\\n\\[\\]]+)(?![^\\[]*\\]\\()Copiar link`, 'gi')
          if (titleWithCopyPattern.test(responseText)) {
            responseText = responseText.replace(
              titleWithCopyPattern,
              `[${title}](${url})`
            )
            hasMarkdownLink = true
          } else {
            // Procurar linha com o título e adicionar link na próxima linha
            const titleLinePattern = new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+)\\s*\\n`, 'i')
            if (titleLinePattern.test(responseText)) {
              responseText = responseText.replace(
                titleLinePattern,
                `$1\n\n[${title}](${url})\n`
              )
            } else {
              // Adicionar após primeira menção do título
              responseText = responseText.replace(
                new RegExp(`(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Calculadora de [^\\n\\[\\]]+|Diagnóstico de [^\\n\\[\\]]+)`, 'i'),
                `$1\n\n[${title}](${url})`
              )
            }
            }
          }
          
          // DEBUG: Log após pós-processamento de links (já estamos dentro do if acima)
          // ÚLTIMO RECURSO: Se ainda tem "Copiar link" e não tem markdown, substituir FORÇADAMENTE
          if (responseText.includes('Copiar link') && !responseText.includes(`[${title}](${url})`)) {
            // Substituir QUALQUER ocorrência de "Copiar link" por markdown quando há link gerado
            // Isso é um fallback de segurança para garantir que sempre teremos markdown
            const lines = responseText.split('\n')
            let foundAndReplaced = false
            const newLines = lines.map((line, idx) => {
              if (line.includes('Copiar link') && !line.includes('[') && !line.includes('](')) {
                // Procurar por padrões comuns: "TítuloCopiar link", "Título: ... Copiar link", etc.
                const beforeCopy = line.substring(0, line.indexOf('Copiar link')).trim()
                if (beforeCopy.length >= 3) {
                  // Se a linha anterior contém o título ou palavras-chave, usar o título do contexto
                  const prevLine = idx > 0 ? lines[idx - 1].trim() : ''
                  const nextLine = idx < lines.length - 1 ? lines[idx + 1].trim() : ''
                  const context = `${prevLine} ${beforeCopy} ${nextLine}`.toLowerCase()
                  
                  if (context.includes(title.toLowerCase()) || 
                      context.includes('calculadora') || 
                      context.includes('diagnóstico') || 
                      context.includes('quiz') ||
                      context.includes('link') ||
                      beforeCopy.toLowerCase().includes('calculadora') ||
                      beforeCopy.toLowerCase().includes('diagnóstico') ||
                      beforeCopy.toLowerCase().includes('emagrecimento')) {
                    foundAndReplaced = true
                    return `[${title}](${url})`
                  }
                }
              }
              return line
            })
            
            if (foundAndReplaced) {
              responseText = newLines.join('\n')
              console.log('[DEBUG] ✅ Link convertido para markdown via fallback final!')
            } else {
              console.log('[DEBUG] ⚠️ Link ainda não está em markdown APÓS pós-processamento. Resposta:', responseText.substring(0, 500))
              console.log('[DEBUG] URL esperada:', url)
              console.log('[DEBUG] Título esperado:', title)
            }
          } else if (responseText.includes(`[${title}](${url})`)) {
            console.log('[DEBUG] ✅ Link convertido para markdown com sucesso!')
          }
        }
      }
    } catch (postProcessError) {
      console.warn('[/api/ylada/noel] Erro no pós-processamento de links:', postProcessError)
      // Continuar mesmo se o pós-processamento falhar
    }

    if (canonicalAppendix && lastLinkContextOut?.url) {
      const marker = '### Quiz e link (oficial'
      if (!responseText.includes(marker)) {
        const footer = buildCanonicalQuizMarkdownForResponse(
          canonicalAppendix.title,
          canonicalAppendix.url,
          canonicalAppendix.flowId,
          canonicalAppendix.config
        )
        responseText = `${responseText.trim()}\n\n---\n\n${footer}`
      }
    }

    // Freemium: incrementar uso após resposta bem-sucedida
    if (!isPro) {
      incrementNoelUsage(user.id).catch((e) => console.warn('[/api/ylada/noel] incrementNoelUsage:', e))
    }

    // Evento comportamental para analytics/valuation: noel_analysis_used
    if (supabaseAdmin && responseText && responseText.length > 10) {
      supabaseAdmin
        .from('ylada_behavioral_events')
        .insert({
          event_type: 'noel_analysis_used',
          user_id: user.id,
          payload: { segment: validSegment, has_link_generated: !!linkGeradoBlock },
        })
        .then(({ error: e }) => {
          if (e) console.warn('[/api/ylada/noel] behavioral event noel_analysis_used:', e.message)
        })
    }

    // Atualizar memória estratégica e mapa
    try {
      const actionFromMessage = detectActionFromMessage(message)
      const actionFromLink = linkGeradoBlock ? 'link_gerado' : undefined
      await upsertNoelMemory(user.id, validSegment, {
        professional_profile: professionalProfileCodes[0] || undefined,
        main_goal: objectiveCodes[0] || undefined,
        main_problem: situationCodes[0] || undefined,
        funnel_stage: funnelStageCodes[0] || undefined,
        action_to_add: actionFromMessage || actionFromLink,
      })
      const updatedMemory = await getNoelMemory(user.id, validSegment)
      await syncStrategyMapFromMemory(user.id, validSegment, updatedMemory)
    } catch (memErr) {
      console.warn('[/api/ylada/noel] upsertNoelMemory/syncStrategyMap:', memErr)
    }

    // Memória de conversa: persistir troca (janela deslizante 8 msgs)
    addExchange(user.id, message.trim(), responseText).catch((e) =>
      console.warn('[/api/ylada/noel] addExchange:', e)
    )

    // Persistir diagnóstico da conversa (bloqueio + estratégia + exemplo) para histórico
    if (noelStrategies.length > 0 || situationCodes.length > 0 || professionalProfileCodes.length > 0) {
      saveConversationDiagnosis({
        userId: user.id,
        segment: validSegment,
        userMessage: message.trim(),
        assistantResponse: responseText,
        situationCodes,
        professionalProfileCodes,
        objectiveCodes,
        funnelStageCodes,
        strategies: noelStrategies,
      }).catch((e) => console.warn('[/api/ylada/noel] saveConversationDiagnosis:', e))
    }

    return NextResponse.json({
      response: responseText,
      segment: validSegment,
      area: validSegment,
      lastLinkContext: lastLinkContextOut ?? null,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/noel]', error)
    const message = error instanceof Error ? error.message : 'Erro ao processar mensagem.'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}
