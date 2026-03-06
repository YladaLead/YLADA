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

  let block = `\n[${tituloBloco}]\n${intro}\n\nFONTE ÚNICA (o link usa exatamente isto):\n${conteudoReal || '(calculadora ou link sem opções)'}\n\nREGRAS: NÃO invente perguntas. Use APENAS as perguntas acima (fonte única). NÃO diga "O link será ajustado" nem "Aqui está o link". NÃO use "Raio-X" em nenhum lugar (nem Saúde, nem Estratégia) — use "quiz", "diagnóstico", "seu quiz". Na descrição do link: "Acesse seu quiz" ou "Clique para acessar seu quiz".\n\nLINK ÚNICO: Use APENAS o link abaixo. NÃO inclua link anterior da conversa. O link correto é: ${url}\n\nFORMATO DA RESPOSTA (use ### para cada título de seção):\n\n### AQUI ESTÃO AS PERGUNTAS\nUse o título da seção em LETRAS MAIÚSCULAS: ### AQUI ESTÃO AS PERGUNTAS\nDeixe DUAS linhas em branco entre o título da seção e a primeira pergunta.\n\n1. TÍTULO: Comece com o título do quiz em negrito (use exatamente como fornecido, primeira letra maiúscula): **${title}**\n2. ESTRUTURA: Para cada pergunta:\n   - Linha 1: número + pergunta em **negrito** (ex.: **1. Qual é o seu maior desafio?**)\n   - Linha 2 em branco (quebra)\n   - Linhas seguintes: cada opção (A, B, C, D) em sua própria linha, SEMPRE abaixo da pergunta — NUNCA coloque A) na mesma linha da pergunta\n   - Duas linhas em branco entre cada bloco de pergunta (após o D), antes da próxima\n3. Exemplo correto:\n### AQUI ESTÃO AS PERGUNTAS\n\n\n**${title}**\n\n**1. Qual é o seu maior desafio?**\nA) Opção A\nB) Opção B\nC) Opção C\nD) Opção D\n\n\n**2. Outra pergunta?**\nA) Opção A\nB) Opção B\nC) Opção C\nD) Opção D\n\n### Chamada para Ação\nUse exatamente: ${descResumida}\nNÃO explique mecânica (perguntas, opções, visitante escolhe). Mantenha curto e estimulante.\n\n### Link Inteligente\nLink: [Acesse seu quiz](${url})\n\n### Onde Promover\nInstagram: posts e stories. WhatsApp: compartilhe com contatos. É por aí que seu público está.\n\n### Próximo passo\nNÃO pergunte "Está bom assim ou quer ajustar?" de forma genérica. Em vez disso, direcione: "Quer que eu deixe o CTA mais direto para WhatsApp ou mais educativo? Assim que você decidir, ajusto em segundos." Ou ofereça outra micro decisão concreta. Reforce o objetivo (captar, agenda cheia).`

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
function isIntencaoCriarLink(message: string): boolean {
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
  ]
  return termos.some((t) => m.includes(t))
}

/** Regras de comportamento estratégico: Noel conduz, não apenas explica. */
const NOEL_CONDUTOR_RULES = `
[COMPORTAMENTO ESTRATÉGICO — OBRIGATÓRIO]
Você não é um explicador. Você é um condutor. O objetivo é conversão (agenda cheia, captação, previsibilidade).

1. PERGUNTA ESTRATÉGICA: Antes de entregar solução completa, faça pelo menos 1 pergunta que direcione decisão (quando fizer sentido). Ex.: "Quer que eu deixe esse quiz mais voltado para dor ou para educação?" — NÃO use em perguntas simples (ex.: "qual o melhor horário?").

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
  psi: 'Você é o Noel, mentor da YLADA para a área de Psicologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  psicanalise: 'Você é o Noel, mentor da YLADA para a área de Psicanálise. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  odonto: 'Você é o Noel, mentor da YLADA para a área de Odontologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutra: 'Você é o Noel, mentor da YLADA para a área Nutra (vendedores de suplementos). Oriente sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  coach: 'Você é o Noel, mentor da YLADA para a área de Coach. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { message, conversationHistory = [], segment, area = 'ylada', lastLinkContext } = body as {
      message?: string
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
      segment?: string
      area?: string
      lastLinkContext?: { flow_id: string; interpretacao: Record<string, unknown>; questions: Array<{ id: string; label: string; type?: string; options?: string[] }>; url?: string; title?: string; link_id?: string }
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

    const baseUrl = typeof request.url === 'string' ? new URL(request.url).origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app')
    const linksAtivos = await getNoelYladaLinks(user.id, baseUrl)
    const linksAtivosBlock = formatLinksAtivosParaNoel(linksAtivos)

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
    if (!linkGeradoBlock && isIntencaoCriarLink(message)) {
      const temPerfil = profileRow && (profileRow.profile_type || profileRow.profession)
      if (!temPerfil) {
        linkGeradoBlock = '\n[AVISO: SEM PERFIL]\nO profissional pediu um link/quiz/calculadora mas ainda não preencheu o perfil empresarial (tipo de atuação e área). NÃO gere link. Responda de forma amigável que ele precisa completar o perfil em "Perfil empresarial" primeiro (menu ao lado) para você poder recomendar o link mais adequado ao tipo de atuação dele. Diga que em um minuto ele preenche e aí você consegue criar o link certo.'
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

    const baseSystem = SEGMENT_CONTEXT[validSegment] ||
      'Você é o Noel, mentor da YLADA. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.'
    const parts: string[] = [baseSystem, NOEL_CONDUTOR_RULES, NOEL_PRINCIPIO_20_80, NOEL_METODO_CONDUCAO_VENDA, NOEL_CONTATO_FRIO]

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
    if (profileResumo) {
      parts.push('\n[PERFIL DO PROFISSIONAL]\n' + profileResumo)
    } else {
      parts.push('\nO profissional ainda não preencheu o perfil empresarial. Oriente de forma útil e, se fizer sentido, sugira completar o perfil em "Perfil empresarial" para orientações mais personalizadas.')
    }
    if (snapshotText) {
      parts.push('\n[RESUMO ESTRATÉGICO DA TRILHA — situação atual e próximos passos]\n' + snapshotText)
    }
    if (linksAtivosBlock) parts.push(linksAtivosBlock)
    if (linkGeradoBlock) parts.push(linkGeradoBlock)
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
