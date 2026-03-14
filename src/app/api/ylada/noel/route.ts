/**
 * NOEL YLADA - API por segmento (ylada, psi, odonto, nutra, coach, seller).
 * POST /api/ylada/noel
 * Body: { message, conversationHistory?, segment?, area? }
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

  let block = `\n[${tituloBloco}]\n${intro}\n\nOBRIGATÓRIO: O profissional precisa VER o quiz (perguntas, opções) e o link real na conversa. Inclua SEMPRE o quiz completo e o link. Use tom natural e conversacional — evite rótulos técnicos.\n\nFONTE ÚNICA (o link usa exatamente isto):\n${conteudoReal || '(calculadora ou link sem opções)'}\n\nREGRAS: NÃO invente perguntas. Use APENAS as perguntas acima. NÃO use "Raio-X" — use "quiz", "diagnóstico". O link correto é: ${url}\n\nFORMATO DA RESPOSTA (exemplo ideal — natural, menos técnico):\n\nÓtima ideia. Vamos criar um diagnóstico para [tema que o profissional pediu].\n\nPreparei um diagnóstico curto com [N] perguntas para identificar quem realmente está considerando [objetivo/tema].\n\n[Mostre as perguntas com opções A, B, C, D — use a fonte única acima]\n\nAqui está o link: [Acesse seu quiz](${url})\n\nSe quiser, posso ajustar as perguntas para seu público.\n\nIMPORTANTE: Inclua o quiz completo (perguntas + opções) antes do link. O link deve ser em markdown: [Acesse seu quiz](${url}).

Após entregar o link, em UMA frase breve, explique o valor estratégico: "Esse diagnóstico ajuda a identificar pessoas que já tentaram resolver o problema e estão abertas a uma nova estratégia." Ou variação adequada ao tema. Isso reforça seu papel de mentor.`

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

Quando o profissional pedir criar quiz, diagnóstico ou link (ex.: "quero um link para captar pacientes", "cria um diagnóstico", "gerar link"):
1. EXECUÇÃO PRIMEIRO: Se o sistema entregou um bloco [LINK GERADO AGORA] ou [LINK AJUSTADO E GERADO], você DEVE mostrar o quiz completo e o link clicável na resposta. Não pergunte "posso criar um quiz para você?" nem "gostaria de definir algumas perguntas primeiro?" — quando o sistema gerou, entregue. A sensação desejada: pediu → já ficou pronto.
2. NUNCA diga que não pode criar links. Quem cria é o sistema; você só exibe o link quando ele vem no bloco. Se não veio link nesta resposta, oriente a preencher o perfil ou a pedir de novo com o tema claro.
3. RESULTADO EXECUTÁVEL: Inclua sempre o link clicável e as perguntas do quiz (conforme o bloco). Depois ofereça ajustes: "Se quiser, posso ajustar perguntas, mudar o foco ou criar outro diagnóstico."
4. CONVERSA = EDITOR: Se o usuário pedir ajuste (ex.: "troca a pergunta 2", "foca em sintomas"), o sistema pode gerar novo link; você entrega o link atualizado e confirma o que mudou. A conversa vira editor natural — não configurar sistema, e sim criar algo conversando.
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

const SEGMENT_CONTEXT: Record<string, string> = {
  ylada: 'Você é o Noel, mentor da YLADA (motor de conversas). Oriente qualquer profissional ou vendedor sobre rotina, links inteligentes, trilha empresarial e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  med: 'Você é o Noel, mentor da YLADA para médicos. Oriente sobre rotina, links inteligentes, captação de pacientes e formação empresarial. Tom direto e prático.',
  psi: 'Você é o Noel, mentor da YLADA para a área de Psicologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  psicanalise: 'Você é o Noel, mentor da YLADA para a área de Psicanálise. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  odonto: 'Você é o Noel, mentor da YLADA para a área de Odontologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutra: 'Você é o Noel, mentor da YLADA para a área Nutra (vendedores de suplementos). Oriente sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  coach: 'Você é o Noel, mentor da YLADA para a área de Coach. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  perfumaria: 'Você é o Noel, mentor da YLADA para a área de Perfumaria. Oriente vendedores de fragrâncias sobre rotina, links inteligentes, quizzes de perfil olfativo e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  seller: 'Você é o Noel, mentor da YLADA para vendedores. Oriente sobre rotina, links inteligentes, funil de vendas e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  estetica: 'Você é o Noel, mentor da YLADA para a área de Estética. Oriente o profissional sobre rotina, links inteligentes, captação de clientes e formação empresarial. Tom direto e prático.',
  fitness: 'Você é o Noel, mentor da YLADA para a área de Fitness. Oriente personal trainers e coaches sobre rotina, links inteligentes, captação de clientes e formação empresarial. Tom direto e prático.',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller', 'perfumaria', 'estetica', 'fitness', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { message, conversationHistory = [], segment, area = 'ylada', lastLinkContext, locale } = body as {
      message?: string
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
      segment?: string
      area?: string
      lastLinkContext?: { flow_id: string; interpretacao: Record<string, unknown>; questions: Array<{ id: string; label: string; type?: string; options?: string[] }>; url?: string; title?: string; link_id?: string }
      locale?: 'pt' | 'en' | 'es'
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 })
    }

    const segmentKey = (segment ?? area) as string
    const validSegment = YLADA_SEGMENT_CODES.includes(segmentKey as any) ? segmentKey : 'ylada'

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
      profileResumo = buildProfileResumo(profileRow)
      const snap = snapshotRes.data as { snapshot_text?: string | null } | null
      snapshotText = snap?.snapshot_text?.trim() ?? ''
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
            }),
          })
          const genJson = await genRes.json().catch(() => ({}))
          if (genJson?.success && genJson?.data?.url) {
            const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
            const title = formatDisplayTitle(titleRaw)
            lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
            const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
            linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'ajustado')
          }
        }
      } catch (e) {
        console.warn('[/api/ylada/noel] ajuste interpret/generate:', e)
      }
    }

    // Se o profissional pediu link/quiz/calculadora: verificar perfil; se tiver, interpret + generate
    if (!linkGeradoBlock && isIntencaoCriarLink(message, conversationHistory)) {
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
              }),
            })
            const genJson = await genRes.json().catch(() => ({}))
            if (genJson?.success && genJson?.data?.url) {
              const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
              const title = formatDisplayTitle(titleRaw)
              lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
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
    if (!linkGeradoBlock && primeiraConversaOuVaga && profileRow && (profileRow.profile_type || profileRow.profession)) {
      try {
        const cookie = request.headers.get('cookie') || ''
        const defaultText = getDefaultInterpretTextPrimeiraConversa(validSegment)
        const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', cookie },
          body: JSON.stringify({
            text: defaultText,
            segment: validSegment,
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
            }),
          })
          const genJson = await genRes.json().catch(() => ({}))
          if (genJson?.success && genJson?.data?.url) {
            const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
            const title = formatDisplayTitle(titleRaw)
            lastLinkContextOut = { flow_id: flowId, interpretacao, questions, url: genJson.data.url, title, link_id: genJson.data.id }
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
      if (messageMentionsDiagnosis) diagnosisInsightsText = await getDiagnosisInsightsContext(FALLBACK_DIAGNOSTIC_ID_INSIGHTS)
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
      NOEL_CONDUTOR_RULES,
      NOEL_PRINCIPIO_20_80,
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
          '\nUse o mapa para orientar o próximo passo. Ex.: "Você já está em Atração e Diagnóstico. Agora vamos focar em Conversa — use o diagnóstico para iniciar conversas."'
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
    if (detectedStrategicProfileText || detectedProfessionalProfileText || detectedObjectiveText || detectedFunnelStageText || noelMemoryText || strategyMapText || noelLibraryContext.trim() || diagnosisInsightsText) {
      parts.push('\n' + NOEL_LAYER4_PRIORITY_RULE)
    }
    if (linksAtivosBlock) parts.push(linksAtivosBlock)
    if (linkPerformanceBlock) parts.push(linkPerformanceBlock)
    if (linkGeradoBlock) parts.push(linkGeradoBlock)
    if (linkGeradoBlock) {
      parts.push(
        '\n[INCENTIVO MÚLTIPLOS DIAGNÓSTICOS]\nApós entregar o link, pode incentivar experimentação: "Muitos profissionais também testam variações de diagnóstico para ver qual gera mais interesse. Posso criar outra versão focada em: sintomas, hábitos, objetivos ou resultados desejados." Isso incentiva criação de múltiplos diagnósticos e compartilhamento.'
      )
    }
    if (primeiraConversaOuVaga && linkGeradoBlock) {
      parts.push(
        '\n[PRIMEIRA CONVERSA GUIADA — COM LINK]\nO profissional está começando. Use o formato natural do bloco acima: intro breve, quiz completo, link real, convite para ajustar. Ex.: "Ótima ideia. Preparei um diagnóstico com X perguntas. Aqui está o link: [link]. Se quiser, posso ajustar as perguntas." Objetivo: o usuário sentir "já tenho algo para usar" em segundos.'
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

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...conversationHistory.slice(-12).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message.trim() },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    const responseText =
      completion.choices[0]?.message?.content?.trim() ||
      'Desculpe, não consegui processar. Tente novamente.'

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
