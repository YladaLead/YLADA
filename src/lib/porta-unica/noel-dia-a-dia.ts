/**
 * Camada de MENTORIA DO DIA A DIA (pós-ativação) do Noel da matriz.
 *
 * Achado que motiva a camada: hoje o MÉTODO só vive forte no bloco de condução de
 * ENTRADA (gated por desafio, consumido depois do 1º link) e SOME no dia a dia — a
 * pessoa cai nas camadas gerais. Esta camada traz o método de volta pro pós-ativação:
 * quando alguém que JÁ ativou (tem link) pede orientação ("o que faço hoje / o que
 * posto / o que falo / minha meta / liderança"), o Noel conduz pela PRIORIDADE do
 * momento (socrático), não por agenda genérica.
 *
 * Duas peças puras (sem I/O, sem IA — testáveis em `noel-dia-a-dia.casos.ts`):
 *   1. `precisaMentoriaDiaADia` — detecta o MOMENTO (pós-ativação + pedido de orientação).
 *   2. `construirBlocoMentoriaDiaADiaParaPrompt` — o bloco de método pro system prompt.
 *
 * ⚠️ Consumido pelo route SÓ atrás da flag `NEXT_PUBLIC_NOEL_DESAFIO_CONDUCAO_ENABLED`.
 * Flag OFF = byte-idêntico. Lane de método → espelhar no Noel_Completo §9.3/§10.
 * @see blueprint-plataforma/Noel_DiaADia_Metodo_Mentoria.md
 */

type Turno = { role: string; content: string }

/**
 * Gatilhos de pedido de orientação do dia a dia (rotina, canal/postagem, fala/Direct,
 * meta, atração/indicação, agenda cheia de curioso). Radicais amplos de propósito: a
 * gate de pós-ativação (`temLinkAtivo`) é que evita disparar durante a condução de entrada.
 */
const GATILHOS_DIA_A_DIA: readonly RegExp[] = [
  /o que (eu )?(fa[çc]o|fazer|devo fazer)|por onde come[çc]|pr[óo]ximo passo|minha rotina|meu dia a dia/i,
  /agenda\b.{0,10}(vazia|parada|cheia)|sem cliente|n[ãa]o (tenho|fecho|consigo) client/i,
  /o que (eu )?(posto|postar)|conte[úu]do|no instagram|minha bio|(o que|como) divulgo/i,
  /o que (eu )?(falo|falar|mando|respondo|escrevo|digo)|como (eu )?(abordo|conduzo|conduzir|converso|atendo|falo com)|no direct|primeira mensagem|conduzir a conversa/i,
  /minha meta|meta do m[êe]s|bati a meta/i,
  /(quero|gerar|mais|colher).{0,12}indica[çc]|indica[çc][õoã]|virar autoridade|ser autoridade|autoridade no meu nicho/i,
  /quero (mais )?(cliente|contato)|como (consigo|atra[ií]o) (mais )?client/i,
  /cheio de curioso|s[óo] curioso|s[óo] (me )?perguntam pre[çc]o|n[ãa]o qualifica|mandando (promo[çc][ãa]o|pre[çc]o)/i,
]

/** A mensagem pede orientação do dia a dia (o que faço/posto/falo/meta/atração)? */
export function pedeOrientacaoDiaADia(message: string): boolean {
  const m = (message ?? '').trim()
  if (m.length < 3) return false
  return GATILHOS_DIA_A_DIA.some((re) => re.test(m))
}

/** Um link/diagnóstico JÁ foi entregue nesta conversa (marca de pós-ativação no histórico). */
function historicoTemLinkEntregue(historico: readonly Turno[]): boolean {
  return historico.some(
    (t) =>
      t.role === 'assistant' &&
      /\/l\/|link \(oficial|diagn[óo]stico e link|acessar diagn[óo]stico|acesse seu quiz/i.test(
        t.content ?? ''
      )
  )
}

/**
 * A pessoa está PÓS-ATIVAÇÃO? Ou tem link ativo na conta (produção) OU já recebeu um link
 * nesta conversa (cobre o `/pt/noel-lab` isolado, onde a conta não tem links). É esse sinal
 * que separa o dia a dia da condução de entrada (lá ela ainda não tem link).
 */
export function estaPosAtivacao(args: {
  temLinkAtivo: boolean
  conversationHistory?: readonly Turno[]
}): boolean {
  if (args.temLinkAtivo) return true
  const historico = Array.isArray(args.conversationHistory) ? args.conversationHistory : []
  return historicoTemLinkEntregue(historico)
}

/**
 * É o momento da mentoria do dia a dia? Só PÓS-ATIVAÇÃO (a pessoa já tem link — o método
 * some justamente aqui) E quando ela pede orientação. Na condução de entrada ela ainda
 * não tem link → não dispara (o bloco de entrada é que conduz lá).
 */
export function precisaMentoriaDiaADia(args: {
  message: string
  temLinkAtivo: boolean
  conversationHistory?: readonly Turno[]
}): boolean {
  return estaPosAtivacao(args) && pedeOrientacaoDiaADia(args.message)
}

/** Última fala do Noel em minúsculas (pra não repetir o bloco turno após turno). Vazio se não houver. */
function ultimaFalaDoNoel(historico: readonly Turno[]): string {
  for (let i = historico.length - 1; i >= 0; i -= 1) {
    if (historico[i]?.role === 'assistant') return (historico[i].content ?? '').toLowerCase()
  }
  return ''
}

/**
 * O bloco de mentoria já apareceu na conversa recente? Heurística leve pra o Noel não
 * ficar repetindo a "aula" da prioridade a cada turno (o método é pra guiar, não recitar).
 */
export function jaConduziuDiaADia(conversationHistory?: readonly Turno[]): boolean {
  const historico = Array.isArray(conversationHistory) ? conversationHistory : []
  const fala = ultimaFalaDoNoel(historico)
  return /prioridade|agenda vazia|me chama no direct|buyer persona/i.test(fala)
}

/**
 * Bloco de método do DIA A DIA pro system prompt. Princípios de condução (socrático),
 * NÃO tabela rígida: o Noel lê a PRIORIDADE do momento e joga força na ação que gera
 * resultado, perguntando e guiando. Traduz os 7 princípios do doc. Sem travessão de
 * aparte (GUIA_DE_VOZ); os rótulos [] são scaffolding interno pro modelo.
 */
export function construirBlocoMentoriaDiaADiaParaPrompt(): string {
  return (
    '\n[MENTORIA DO DIA A DIA — a pessoa já ativou e pede orientação]\n' +
    'Conduza socrático: PERGUNTE onde ela está e GUIE pela prioridade do momento; nunca despeje uma agenda genérica nem cobre de cima. Explique SEMPRE o porquê de priorizar, não só mande fazer.\n' +
    '1) A PRIORIDADE GOVERNA O DIA. Leia o momento e jogue força máxima na ação principal: agenda vazia = ATRAÇÃO / gerar contato (é o gargalo mais comum); quer indicação = ESPALHAR o link; agenda cheia de curioso que não fecha = QUALIFICAR (o link educa e filtra antes). Combata o erro nº1: organizar demais e agir de menos. O que é gestão que não resolve o problema de agora, não faz agora; coloque MAIS ação e MAIS tempo no que traz o resultado.\n' +
    '2) CANAL CERTO PRIMEIRO. Descubra o canal da pessoa e incentive um adequado (em geral Instagram pra gerar contato). Trabalhe o que o canal precisa: bio boa (o que ela resolve, pra quem, um caminho de contato), aparência/postura do perfil, e leia que público engaja. Oriente O QUE POSTAR em chave EDUCACIONAL (funil de marketing, servir antes de vender). TODO conteúdo provoca o link: gatilho + CTA no espírito "quer saber mais sobre essa dor/esse benefício? me chama no Direct que eu te mando o link". Dê exemplo concreto ("na prática: um post que trabalha a dor, aponta pra pessoa, com motivo + CTA pro Direct").\n' +
    '3) META = AÇÃO NA PRIORIDADE, não número solto (ex.: agenda vazia = tirar X contatos). Ancore no PORQUÊ/DOR da pessoa (o motivo pelo qual ela se move) e guarde esse porquê pra sustentar a meta. Acompanhe PERGUNTANDO ("como foi a semana, conseguiu tirar contato?"), escute, e se travou pergunte o que atrapalhou e ajude a destravar, sem bronca.\n' +
    '4) VIÉS PRA AÇÃO (anti-procrastinação): faça a tarefa agora; se não dá a inteira, uma ação PEQUENA que gere movimento hoje. Use gatilhos éticos que dão CONFORTO/SEGURANÇA pra agir (identificação, curiosidade, o porquê/dor, "dá pra começar pequeno"), NUNCA pressão, escassez falsa, promessa de resultado ou medo. Reforce os valores: servir antes de vender; agir constrói convicção; autoridade é consequência de educar; foco na ação que gera resultado.\n' +
    '5) CERTIFICAÇÃO em 3 etapas quando a pessoa chama no Direct (entra nos scripts/copy que você cria): (a) está pronta ou é só curiosa? (b) já tentou algo antes? (c) está pronta se você apresentar algo? Isso separa os 20% prontos dos 80% que ainda precisam ser educados. Ofereça só pros 20%; siga educando os 80%.\n' +
    '6) AMBIENTE PRA ALIMENTAR OS 80%: os que ainda não estão prontos não se nutrem um a um pra sempre. Ajude a montar um ambiente próprio (grupo VIP OU o próprio Instagram feito interessante) que educa e mantém esse grupo, sempre mirando quem de fato vai comprar (o buyer persona), não agradar todo mundo. A disciplina mora na CONSTÂNCIA da postagem (cadência/formato você adapta ao que a pessoa mantém).\n' +
    '7) SE A PESSOA LIDERA: o foco do líder é certificar o que faz o LIDERADO AGIR (não motivar por motivar). Agenda de monitoramento da ação (por que o liderado não age, se ele se sente seguro, certificar que estão bem e confiantes; o trabalho mora em quem travou). No treino, os 3 Es: Educar, Entusiasmar, Edificar. Ensine o líder a transmitir a filosofia Ylada (servir antes, convicção, ação) e mostre COMO passar adiante. Link/diagnóstico com a equipe segue o artefato por objetivo "equipe" (self-serve/loop OU ambiente exclusivo de rede → Contatar).'
  )
}
