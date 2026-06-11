/**
 * ETAPA 1 — CONVICÇÃO (blueprint C → C → P).
 * Autodiagnóstico do próprio negócio — Sujeito A (o profissional, não o lead).
 *
 * Diferente dos fluxos para o lead (Sujeito B), este diagnóstico não pergunta sobre
 * o negócio em si (isso vive em ylada_noel_profile). Ele lê a CONVICÇÃO: onde a
 * pessoa evita agir, onde lê a própria falha como incapacidade em vez de falta de
 * método, e se acha que o problema é o mercado quando é o sistema de comunicação.
 *
 * Base no livro "Convicção Gera Performance" (Caps 1-5):
 *  - Cap 1: a ilusão do conhecimento (sabe, mas não faz).
 *  - Cap 2: motivação não resolve.
 *  - Cap 3: o gap (acha que é o mercado / acha que não leva jeito).
 *  - Cap 4: a mente mente; o ciclo vicioso evita → não pratica → não aprende → sem resultado → crê menos.
 *  - Cap 5: convicção se constrói por repetição com método.
 *
 * Pontuação INVISÍVEL: cada opção carrega um peso `conv` de 0 (travada) a 2 (construção).
 * A soma dividida pelo máximo dá um pct 0..1 → 3 perfis.
 *
 * @see /Users/air/Desktop/Ylada-Workspace/blueprint-plataforma/Blueprint_Arquitetura_Ylada_CCP.md
 * @see /Users/air/Desktop/Ylada-Workspace/blueprint-plataforma/Etapa1_Conviccao_Spec.md
 */

export type ConviccaoPerfilCode = 'travada' | 'oscilante' | 'construcao'

export interface ConviccaoOpcao {
  /** Texto exibido ao profissional. */
  label: string
  /** Peso invisível de convicção: 0 = travada, 1 = oscilante, 2 = construção. */
  conv: 0 | 1 | 2
}

export interface ConviccaoPergunta {
  id: string
  /** Enunciado, na voz do Andre: simples, curto, "você". */
  texto: string
  opcoes: ConviccaoOpcao[]
}

export interface ConviccaoDevolutiva {
  /** Nome do perfil exibido. */
  titulo: string
  /** Frase-espelho curta e seca (estilo assinatura do livro). */
  fraseEspelho: string
  /** O ciclo que a pessoa está vivendo agora. */
  oCiclo: string
  /** O gap: ela acha que é o mercado; quase sempre é o sistema de comunicação. */
  oGap: string
  /** O primeiro ato de convicção — o próximo passo pequeno e concreto. */
  primeiroAto: string
  /** Semente de contexto para o Noel modo Espelho aprofundar a conversa. */
  noelSeed: string
}

/**
 * As 8 perguntas do autodiagnóstico de convicção.
 * Vocabulário deliberadamente neutro de nicho (serve estética, líder, liberal, B2B).
 */
export const CONVICCAO_PERGUNTAS: ConviccaoPergunta[] = [
  {
    id: 'q1_abordagem',
    texto: 'Quando você pensa em chegar num cliente novo, o que costuma acontecer?',
    opcoes: [
      { label: 'Deixo pra depois quase sempre', conv: 0 },
      { label: 'Faço, mas custa, é com esforço', conv: 1 },
      { label: 'Faço com naturalidade, faz parte do meu dia', conv: 2 },
    ],
  },
  {
    id: 'q2_sabe_nao_faz',
    texto: 'Você sente que já sabe o que precisa fazer pra crescer, mas não faz?',
    opcoes: [
      { label: 'Sim, vivo isso. Sei e não saio do lugar', conv: 0 },
      { label: 'Às vezes. Faço uma parte, outra fica', conv: 1 },
      { label: 'Não. O que eu sei, eu coloco em prática', conv: 2 },
    ],
  },
  {
    id: 'q3_leitura_da_falha',
    texto: 'Quando uma abordagem não dá certo, qual é o seu primeiro pensamento?',
    opcoes: [
      { label: 'Não levo jeito pra isso', conv: 0 },
      { label: 'O mercado está difícil, o cliente não valoriza', conv: 1 },
      { label: 'Faltou ajustar algo no meu jeito de conduzir', conv: 2 },
    ],
  },
  {
    id: 'q4_sistema',
    texto: 'Você tem um caminho definido pra conduzir a conversa com quem chega, ou vai no improviso?',
    opcoes: [
      { label: 'Vou no improviso, cada conversa é uma', conv: 0 },
      { label: 'Mais ou menos, tenho umas frases que repito', conv: 1 },
      { label: 'Sim, sigo um caminho que já sei que funciona', conv: 2 },
    ],
  },
  {
    id: 'q5_repeticao',
    texto: 'Com que frequência você pratica abordagem ou conversa de venda de propósito?',
    opcoes: [
      { label: 'Quase nunca, só quando aparece sozinho', conv: 0 },
      { label: 'De vez em quando, sem constância', conv: 1 },
      { label: 'Toda semana, de propósito, mesmo sem aparecer', conv: 2 },
    ],
  },
  {
    id: 'q6_o_gap',
    texto: 'Na sua visão, o que mais trava seu crescimento hoje?',
    opcoes: [
      { label: 'O mercado, a concorrência, o preço', conv: 0 },
      { label: 'Não sei dizer ao certo', conv: 1 },
      { label: 'Meu jeito de me comunicar e de aparecer', conv: 2 },
    ],
  },
  {
    id: 'q7_movimento_antes',
    texto: 'Você espera se sentir seguro pra agir, ou age antes da segurança chegar?',
    opcoes: [
      { label: 'Espero a segurança, e ela quase nunca chega', conv: 0 },
      { label: 'Depende do dia e do tamanho do passo', conv: 1 },
      { label: 'Ajo antes. A segurança vem depois, com a prática', conv: 2 },
    ],
  },
  {
    id: 'q8_sem_resultado',
    texto: 'Quando o resultado não vem rápido, o que acontece com a sua vontade de continuar?',
    opcoes: [
      { label: 'Paro. Penso que não é pra mim', conv: 0 },
      { label: 'Oscilo bastante, vou e volto', conv: 1 },
      { label: 'Sigo, ajustando o caminho', conv: 2 },
    ],
  },
]

/**
 * Calcula o perfil de convicção a partir das respostas.
 * respostas: { [perguntaId]: label escolhido }
 */
export function calcularConviccaoPerfil(
  respostas: Record<string, string>
): { perfil: ConviccaoPerfilCode; pct: number; score: number; max: number } {
  let score = 0
  let max = 0
  for (const pergunta of CONVICCAO_PERGUNTAS) {
    max += 2
    const escolha = respostas[pergunta.id]
    if (!escolha) continue
    const opcao = pergunta.opcoes.find((o) => o.label === escolha)
    if (opcao) score += opcao.conv
  }
  const pct = max > 0 ? score / max : 0
  let perfil: ConviccaoPerfilCode
  if (pct <= 0.4) perfil = 'travada'
  else if (pct <= 0.7) perfil = 'oscilante'
  else perfil = 'construcao'
  return { perfil, pct, score, max }
}

/**
 * Devolutiva por perfil — na voz do Andre (frase curta, palavra simples, sem travessão de aparte).
 * Honestidade acima do efeito: nada de final feliz inventado; convicção é processo.
 */
export const CONVICCAO_DEVOLUTIVAS: Record<ConviccaoPerfilCode, ConviccaoDevolutiva> = {
  travada: {
    titulo: 'Convicção Travada',
    fraseEspelho: 'Você sabe o que fazer. / E mesmo assim não faz.',
    oCiclo:
      'Tem um ciclo rodando aí, e ele se alimenta sozinho. Você evita a conversa. Por evitar, não pratica. Sem praticar, não melhora. Sem melhorar, o resultado não vem. E sem resultado, você acredita ainda menos que dá certo. Aí evita de novo. Não é preguiça e não é falta de informação. É a convicção que ainda não foi construída.',
    oGap:
      'É comum olhar pra fora e pensar que o problema é o mercado, o preço, a concorrência. Na grande maioria das vezes não é. O que falta não é cliente lá fora. É um jeito de conduzir a conversa que caiba em você. O gap não está no mercado. Está no sistema de comunicação que ninguém te deu.',
    primeiroAto:
      'O primeiro passo não é grande. É uma conversa só, conduzida com um caminho na mão, em vez do improviso. O movimento vem antes da certeza, nunca depois. É por aí que a convicção começa a virar.',
    noelSeed:
      'O profissional está com a convicção travada: sabe o que fazer mas evita agir, lê a própria falha como incapacidade e tende a culpar o mercado. Conduza pelo espelho: ajude-o a enxergar o ciclo (evita → não pratica → não melhora → sem resultado → crê menos) sem julgar, e leve a UM primeiro ato pequeno e concreto de conversa com método. Movimento antes da certeza.',
  },
  oscilante: {
    titulo: 'Convicção Oscilante',
    fraseEspelho: 'Você começa. / E quando não vê resultado, recua.',
    oCiclo:
      'Você age, isso é verdade. Mas vai e volta. Faz uma semana, para na outra. Quando o resultado demora, a vontade some, e o que você tinha começado esfria. O problema não é falta de ação. É falta de constância. E sem constância a prática não vira jeito, não vira segurança.',
    oGap:
      'Às vezes parece que o que falta é mais um empurrão, mais motivação. Não é. Motivação acaba rápido. O que segura quando a vontade cai é ter um caminho definido pra repetir, mesmo nos dias em que nada aparece. Não é mais ânimo que falta. É um sistema de comunicação que você siga no automático.',
    primeiroAto:
      'O próximo passo é escolher um movimento simples e repetir por alguns dias seguidos, sem esperar resultado pra continuar. A repetição com método é o que transforma o que oscila em algo firme.',
    noelSeed:
      'O profissional tem convicção oscilante: age mas sem constância, recua quando o resultado demora, e tende a buscar motivação. Conduza pelo espelho: mostre que o que falta não é ânimo e sim constância com método. Leve a um movimento simples e repetível por alguns dias, sem condicionar a continuidade ao resultado imediato.',
  },
  construcao: {
    titulo: 'Convicção em Construção',
    fraseEspelho: 'Você já age com método. / Agora é transformar isso em sistema.',
    oCiclo:
      'Você já saiu do lugar onde a maioria trava. Age, pratica, e quando algo não dá certo, olha pro próprio jeito antes de culpar o mercado. Isso é raro e é o caminho certo. O que falta agora não é começar. É deixar o que funciona organizado, pra repetir sem depender da sua memória ou do seu dia.',
    oGap:
      'No seu caso o gap não é de convicção, é de escala. O que você faz bem ainda mora muito na sua cabeça e na sua energia. Quando isso vira um sistema de comunicação claro, você consegue repetir com firmeza e, mais pra frente, até passar pra outras pessoas sem perder a qualidade.',
    primeiroAto:
      'O próximo passo é registrar o caminho que já te dá resultado e transformar em algo repetível. É aqui que o Ylada entra: organizar o que você já faz pra você fazer mais, com menos esforço.',
    noelSeed:
      'O profissional tem convicção em construção: já age com método e assume a própria responsabilidade. O foco não é destravar e sim escalar. Conduza pelo espelho reconhecendo o que ele já faz bem e leve a registrar/sistematizar o caminho que funciona, para repetir e depois delegar sem perder qualidade.',
  },
}

export function getConviccaoDevolutiva(perfil: ConviccaoPerfilCode): ConviccaoDevolutiva {
  return CONVICCAO_DEVOLUTIVAS[perfil]
}
