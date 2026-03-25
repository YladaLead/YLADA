/**
 * Textos de divulgação (WhatsApp, Instagram, story) alinhados ao tema do diagnóstico,
 * para motivar quem recebe o link a responder.
 */

export function normalizeTemaParaCopy(temaBruto: string | null | undefined): string {
  if (!temaBruto || typeof temaBruto !== 'string') return ''
  return temaBruto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
}

type BlocoTema = {
  /** 1–2 frases: por que vale a pena responder, no contexto do tema */
  inspirar: string
  /** Legenda curta para card visual (post/story) */
  destaqueCard: string
  /** Hashtags extra além das genéricas (sem # no valor) */
  hashtagsExtra: string
}

const DEFAULT_BLOCO: BlocoTema = {
  inspirar:
    'Suas respostas ajudam a clarear o que faz sentido para você — é rápido, sem complicação e com retorno na hora.',
  destaqueCard: 'Descubra em poucos minutos',
  hashtagsExtra: 'diagnostico saude bemestar',
}

const POR_CHAVE: Record<string, BlocoTema> = {
  emagrecimento: {
    inspirar:
      'Se você quer entender o que pode estar travando seus resultados com o peso, vale responder com calma: em minutos você ganha clareza sobre o próximo passo.',
    destaqueCard: 'Entenda o que pode estar travando',
    hashtagsExtra: 'emagrecimento saude alimentacao',
  },
  metabolismo: {
    inspirar:
      'Cuidar do metabolismo começa por entender como seu corpo reage no dia a dia — responda e veja um panorama personalizado.',
    destaqueCard: 'Seu metabolismo no foco',
    hashtagsExtra: 'metabolismo energia saude',
  },
  energia: {
    inspirar:
      'Se o cansaço ou a falta de disposição fazem parte da sua rotina, essas perguntas ajudam a organizar o que pode estar por trás.',
    destaqueCard: 'Mais clareza sobre sua energia',
    hashtagsExtra: 'energia disposicao bemestar',
  },
  intestino: {
    inspirar:
      'Bem-estar digestivo merece atenção: suas respostas mostram um caminho mais claro, sem julgamento.',
    destaqueCard: 'Cuide do seu bem-estar digestivo',
    hashtagsExtra: 'intestino digestao saude',
  },
  digestao: {
    inspirar:
      'Pequenos sinais do corpo dizem muito. Responda e receba uma leitura organizada do que pode ajudar você.',
    destaqueCard: 'Entenda sua digestão',
    hashtagsExtra: 'digestao saude intestino',
  },
  estresse: {
    inspirar:
      'Se a correria pesa, este diagnóstico ajuda a nomear o que está pesando e o que faz sentido priorizar.',
    destaqueCard: 'Um passo para mais equilíbrio',
    hashtagsExtra: 'estresse bemestar saude mental',
  },
  sono: {
    inspirar:
      'Dormir melhor começa ao entender o que interfere no seu descanso — responda e veja sugestões alinhadas ao seu perfil.',
    destaqueCard: 'Melhore seu sono passo a passo',
    hashtagsExtra: 'sono descanso bemestar',
  },
  ansiedade: {
    inspirar:
      'Você não precisa carregar isso sozinho(a): algumas respostas já ajudam a trazer mais clareza e acolhimento.',
    destaqueCard: 'Mais clareza em poucos minutos',
    hashtagsExtra: 'ansiedade saude mental bemestar',
  },
  pele: {
    inspirar:
      'Sua pele merece um plano que faça sentido para você — responda e veja o que se encaixa melhor na sua rotina.',
    destaqueCard: 'Rotina de pele com sentido',
    hashtagsExtra: 'pele skincare autocuidado',
  },
  treino: {
    inspirar:
      'Se você quer constância ou performance, entender seu ponto de partida é o primeiro passo — responda e avance com foco.',
    destaqueCard: 'Alinhe treino e objetivo',
    hashtagsExtra: 'treino fitness saude',
  },
  saude_bucal: {
    inspirar:
      'Prevenção e autocuidado bucal ficam mais simples quando você sabe por onde começar — responda em instantes.',
    destaqueCard: 'Sorriso e saúde em foco',
    hashtagsExtra: 'saude bucal dentista odonto',
  },
  perfumaria: {
    inspirar:
      'Descubra o que combina com seu estilo e ocasião — é rápido e personalizado para você.',
    destaqueCard: 'Sua fragrância ideal',
    hashtagsExtra: 'perfume fragrancia autocuidado',
  },
  hidratacao: {
    inspirar:
      'Hidratação boa muda disposição e rotina; veja o que faz sentido para o seu dia a dia em poucos minutos.',
    destaqueCard: 'Hidratação sob medida',
    hashtagsExtra: 'hidratacao agua saude',
  },
  alimentacao: {
    inspirar:
      'Alimentação é sobre hábitos reais: suas respostas ajudam a enxergar o que priorizar sem extremismos.',
    destaqueCard: 'Alimentação mais consciente',
    hashtagsExtra: 'alimentacao nutricao saude',
  },
  peso_gordura: {
    inspirar:
      'Se peso ou composição corporal te incomodam, este passo traz clareza sem promessa milagrosa — só direção honesta.',
    destaqueCard: 'Clareza sobre peso e hábitos',
    hashtagsExtra: 'peso saude bemestar',
  },
  inchaco_retencao: {
    inspirar:
      'Inchaço e retenção têm várias causas; responder ajuda a organizar o que observar e o que conversar com seu profissional.',
    destaqueCard: 'Entenda inchaço e retenção',
    hashtagsExtra: 'retencao bemestar saude',
  },
  retencao: {
    inspirar:
      'Se o inchaço incomoda, suas respostas ajudam a mapear possíveis fatores de forma simples.',
    destaqueCard: 'Mapeie causas do inchaço',
    hashtagsExtra: 'retencao saude bemestar',
  },
  rotina_saudavel: {
    inspirar:
      'Montar uma rotina que cola começa por entender onde você está hoje — responda e receba um norte prático.',
    destaqueCard: 'Rotina que cabe na sua vida',
    hashtagsExtra: 'rotina habitos saude',
  },
  vitalidade_geral: {
    inspirar:
      'Vitalidade é soma de pequenos eixos; em minutos você vê um retrato do que pode impulsionar seu bem-estar.',
    destaqueCard: 'Impulsione sua vitalidade',
    hashtagsExtra: 'vitalidade bemestar saude',
  },
  detox: {
    inspirar:
      'Se você busca mais leveza e organização interna, este diagnóstico ajuda a alinhar expectativa e próximo passo.',
    destaqueCard: 'Mais leveza com consciência',
    hashtagsExtra: 'detox bemestar saude',
  },
  performance: {
    inspirar:
      'Performance é treino, recuperação e consistência — veja onde você está e o que priorizar a seguir.',
    destaqueCard: 'Performance com método',
    hashtagsExtra: 'performance treino saude',
  },
}

const PALAVRAS_CHAVE: { palavras: string[]; chave: keyof typeof POR_CHAVE }[] = [
  { palavras: ['emagrec', 'peso', 'magre'], chave: 'emagrecimento' },
  { palavras: ['metabol'], chave: 'metabolismo' },
  { palavras: ['energ', 'dispos', 'cansac'], chave: 'energia' },
  { palavras: ['intestin', 'digest'], chave: 'intestino' },
  { palavras: ['estresse', 'stress'], chave: 'estresse' },
  { palavras: ['sono', 'dormir', 'insônia', 'insonia'], chave: 'sono' },
  { palavras: ['ansiedad'], chave: 'ansiedade' },
  { palavras: ['pele', 'skincare', 'cutis'], chave: 'pele' },
  { palavras: ['treino', 'academia', 'fitness'], chave: 'treino' },
  { palavras: ['dente', 'dental', 'odonto', 'bucal', 'sorriso'], chave: 'saude_bucal' },
  { palavras: ['perfume', 'fragranc'], chave: 'perfumaria' },
  { palavras: ['hidrata'], chave: 'hidratacao' },
  { palavras: ['aliment', 'nutri', 'comida'], chave: 'alimentacao' },
  { palavras: ['incha', 'reten'], chave: 'inchaco_retencao' },
  { palavras: ['rotina'], chave: 'rotina_saudavel' },
  { palavras: ['vital'], chave: 'vitalidade_geral' },
  { palavras: ['detox'], chave: 'detox' },
]

function blocoParaTema(temaBruto: string | null | undefined): BlocoTema {
  const n = normalizeTemaParaCopy(temaBruto)
  if (n && POR_CHAVE[n]) return POR_CHAVE[n]
  const lower = (temaBruto || '').toLowerCase()
  for (const { palavras, chave } of PALAVRAS_CHAVE) {
    if (palavras.some((p) => lower.includes(p))) return POR_CHAVE[chave]
  }
  return DEFAULT_BLOCO
}

export function getDestaqueCardCompartilhar(temaBruto: string | null | undefined): string {
  return blocoParaTema(temaBruto).destaqueCard
}

/** Mensagem sugerida para WhatsApp (convite completo). */
export function getMensagemWhatsAppDiagnostico(
  titulo: string,
  nomeProfissional: string,
  url: string,
  temaBruto?: string | null
): string {
  const { inspirar } = blocoParaTema(temaBruto)
  return `Olá! 👋

${titulo}

${inspirar}

Em poucos minutos você recebe uma análise personalizada com ${nomeProfissional}.

${url}`
}

/** Texto para post no Instagram. */
export function getTextoPostInstagramDiagnostico(
  titulo: string,
  nomeProfissional: string,
  url: string,
  temaBruto?: string | null
): string {
  const { inspirar, hashtagsExtra } = blocoParaTema(temaBruto)
  const tags = hashtagsExtra.split(/\s+/).filter(Boolean).map((t) => `#${t.replace(/^#/, '')}`)
  return `${titulo}

${inspirar}

Responda e receba uma análise com ${nomeProfissional}.

🔗 Link na bio ou primeiro comentário.

${tags.join(' ')}`
}

/** Texto curto para story. */
export function getTextoStoryDiagnostico(
  nomeProfissional: string,
  _url: string,
  titulo: string,
  temaBruto?: string | null
): string {
  const { destaqueCard } = blocoParaTema(temaBruto)
  return `${destaqueCard}

${titulo}

Com ${nomeProfissional} — poucos minutos e uma leitura personalizada.

👇 Link na bio`
}
