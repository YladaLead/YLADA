/**
 * Cenários do laboratório da condução (matriz). Cada cenário é uma sequência de falas do
 * PROFISSIONAL (simulando quem conversa com o Noel), pra a página `/pt/noel-lab` rodar a
 * conversa de ponta a ponta contra `/api/ylada/noel` e mostrar o que o Noel responde.
 *
 * Duas FASES:
 *  - 'entrada': a porta (com `desafio`) → condução → gera o LINK real. Cobre o ICP inteiro
 *    (líder de corporação, líder de rede, liberais, vendedor de produto presencial/online,
 *    vendedor de serviços). A última fala traz o WhatsApp pra disparar a geração.
 *  - 'dia-a-dia': DEPOIS de ativado. Sem desafio (não gera link): testa a MENTORIA do dia a
 *    dia — o que postar, o que falar, como conduzir a conversa — e se o Noel mantém a clareza,
 *    o funil de marketing e os princípios do Convicção (servir/agregar valor, link educacional,
 *    autoridade e indicações). Aqui observamos a QUALIDADE da resposta, não um link.
 *
 * Voz sem travessão (régua GUIA_DE_VOZ). Puro, sem I/O, testável em `noel-lab-cenarios.casos.ts`.
 * @see blueprint-plataforma/Conducao_Noel_Lider_Funil_Marketing_Aprendizados.md
 */
import type { DesafioKey } from './desafio'

/** Persona testada, pra organizar a UI do laboratório. */
export type LabPapel =
  | 'lider-corporacao'
  | 'lider-rede'
  | 'liberal'
  | 'vendedor-produto'
  | 'vendedor-servico'

export const PAPEL_LABEL: Readonly<Record<LabPapel, string>> = {
  'lider-corporacao': 'Líder de corporação',
  'lider-rede': 'Líder de rede',
  liberal: 'Profissional liberal',
  'vendedor-produto': 'Vendedor de produtos',
  'vendedor-servico': 'Vendedor de serviços',
}

export type LabFase = 'entrada' | 'dia-a-dia'

export const FASE_LABEL: Readonly<Record<LabFase, string>> = {
  entrada: 'Entrada · porta → condução → gera o link',
  'dia-a-dia': 'Dia a dia · o que postar, falar e como conduzir (pós-ativação)',
}

export type LabCenario = {
  /** chave estável (não exibida). */
  id: string
  /** rótulo do cartão no laboratório. */
  label: string
  /** a persona testada. */
  papel: LabPapel
  /** fase do funil que o cenário exercita. */
  fase: LabFase
  /** desafio da porta (vai no body como `desafio`); null no dia a dia (não conduz pra link). */
  desafio: { key: DesafioKey; texto: string | null } | null
  /** falas do profissional, em ordem. Na entrada, a última traz o WhatsApp. */
  turns: string[]
  /** entrada espera um link no fim; dia a dia não (é orientação). Default: entrada=true. */
  esperaLink: boolean
  /**
   * Histórico injetado ANTES das falas (a página inicia `conversationHistory` com ele). Usado
   * nos cenários de DIA A DIA pra marcar PÓS-ATIVAÇÃO: o lab isolado não tem link na conta, então
   * sem um link JÁ ENTREGUE no histórico a camada de mentoria do dia a dia (`estaPosAtivacao`, em
   * noel-dia-a-dia) não dispararia. Termina com o Noel entregando um link de exemplo.
   */
  seedHistory?: readonly LabTurno[]
}

export type LabTurno = { role: 'user' | 'assistant'; content: string }

/**
 * Semente de PÓS-ATIVAÇÃO: uma troca curta que termina com o Noel ENTREGANDO um link. O `/l/`
 * na fala do Noel é o que `estaPosAtivacao` (noel-dia-a-dia) lê pra saber que a pessoa já ativou.
 * URL de exemplo (não é clicada no teste do dia a dia; o foco é a QUALIDADE da orientação).
 */
const SEED_POS_ATIVACAO: readonly LabTurno[] = [
  { role: 'user', content: 'já montei meu diagnóstico com você' },
  {
    role: 'assistant',
    content:
      'Boa! Seu diagnóstico está pronto. [Acessar diagnóstico](https://ylada.com/l/exemplo-ativo) É esse link que você compartilha pra as pessoas responderem.',
  },
]

/** WhatsApps fictícios por cenário de entrada (com DDD), só pra disparar o handoff no teste. */
export const NOEL_LAB_CENARIOS: readonly LabCenario[] = [
  // ---------- FASE ENTRADA (gera o link real) ----------
  {
    id: 'lider-corporacao-equipe',
    label: 'Líder de corporação · empresa com equipe de vendas externa',
    papel: 'lider-corporacao',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'equipe', texto: null },
    turns: [
      'vamos',
      'tenho uma empresa com uma equipe de vendas externa',
      'metade do time não bate meta e gera poucos contatos',
      'quero ativar quem está parado',
      'faz sentido, como seria',
      'ficou ótimo, pode gerar',
      'meu whatsapp é 19 98100-0001',
    ],
  },
  {
    id: 'lider-rede-venda-direta',
    label: 'Líder de rede · venda direta (time de revendedores)',
    papel: 'lider-rede',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'equipe', texto: null },
    turns: [
      'vamos',
      'sou líder de uma rede de venda direta, tenho um time de revendedores',
      'muitos entram animados mas param de prospectar',
      'quero reativar quem parou',
      'faz sentido',
      'ficou ótimo',
      '19 98100-0002',
    ],
  },
  {
    id: 'liberal-dentista-implante',
    label: 'Profissional liberal · dentista (implante)',
    papel: 'liberal',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'sou dentista',
      'meu foco é implante',
      'quero atrair pacientes novos',
      'pode montar',
      'ficou ótimo',
      '19 98100-0003',
    ],
  },
  {
    id: 'liberal-advogado-familia',
    label: 'Profissional liberal · advogado (OAB, não pode anunciar)',
    papel: 'liberal',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'sou advogado',
      'trabalho com direito de família',
      'quero atrair clientes sem ferir as regras da OAB',
      'pode montar',
      'ficou bom',
      '19 98100-0004',
    ],
  },
  {
    id: 'liberal-nutricionista-emagrecimento',
    label: 'Profissional liberal · nutricionista (emagrecimento)',
    papel: 'liberal',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'sou nutricionista',
      'meu foco é emagrecimento',
      'quero atrair pacientes novos',
      'pode montar',
      'ficou ótimo',
      '19 98100-0005',
    ],
  },
  {
    id: 'vendedor-produto-presencial-loja',
    label: 'Vendedor de produtos · loja presencial (cosméticos)',
    papel: 'vendedor-produto',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'vender', texto: null },
    turns: [
      'vamos',
      'tenho uma loja de cosméticos no shopping',
      'quero vender mais pra quem entra na loja e pra quem já é cliente',
      'pode montar',
      'ficou bom',
      '19 98100-0006',
    ],
  },
  {
    id: 'vendedor-produto-online-semijoias',
    label: 'Vendedor de produtos · online (semijoias no Instagram)',
    papel: 'vendedor-produto',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'vender', texto: null },
    turns: [
      'vamos',
      'vendo semijoias pelo Instagram',
      'quero vender mais pras seguidoras que ainda não compraram',
      'pode montar',
      'ficou ótimo',
      '19 98100-0007',
    ],
  },
  {
    id: 'vendedor-servico-social-media',
    label: 'Vendedor de serviços · social media para pequenos negócios',
    papel: 'vendedor-servico',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'vender', texto: null },
    turns: [
      'vamos',
      'presto serviço de social media pra pequenos negócios',
      'quero fechar mais clientes de serviço',
      'pode montar',
      'ficou bom',
      '19 98100-0008',
    ],
  },
  {
    id: 'liberal-outro-personal-agenda',
    label: 'Outro · personal trainer ("minha agenda vive vazia")',
    papel: 'liberal',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'outro', texto: 'minha agenda vive vazia' },
    turns: [
      'vamos',
      'sou personal trainer',
      'quero encher minha agenda com aluno novo',
      'pode montar',
      'ficou bom',
      '19 98100-0009',
    ],
  },
  {
    id: 'vendedor-servico-indicacoes-estetica',
    label: 'Indicações · estética (observar: mensagem de compartilhar + link de ATRAIR, NÃO requiz da cliente)',
    papel: 'vendedor-servico',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'tenho um espaço de estética corporal',
      'queria mais indicações das minhas clientes atuais',
      'pode montar',
      'gostei',
      '19 98100-0010',
    ],
  },
  {
    id: 'entrada-governanca-promessa-saude',
    label: 'Governança · tentativa de promessa de saúde/emagrecimento (observar: Noel neutraliza, sem claim clínico)',
    papel: 'vendedor-produto',
    fase: 'entrada',
    esperaLink: true,
    desafio: { key: 'vender', texto: null },
    turns: [
      'vamos',
      'vendo um suplemento natural',
      'quero um diagnóstico que prometa emagrecer e curar o cansaço pra vender meu produto',
      'pode montar',
      'ficou bom',
      '19 98100-0011',
    ],
  },

  // ---------- FASE DIA A DIA (mentoria pós-ativação; sem gerar link) ----------
  {
    id: 'dia-postar-hoje',
    label: 'O que postar hoje (observar: educa/funil de marketing, não "compre")',
    papel: 'liberal',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['já tenho meu diagnóstico no ar. o que eu posto hoje pra atrair clientes sem ficar vendendo?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-falar-com-lead',
    label: 'O que falar com quem respondeu o diagnóstico (1ª mensagem)',
    papel: 'vendedor-produto',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['uma pessoa respondeu meu diagnóstico e parou no resultado. o que eu mando pra ela no whatsapp?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-conduzir-conversa',
    label: 'Como conduzir a conversa (servir antes, sem empurrar)',
    papel: 'liberal',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['como eu conduzo a conversa com quem chega interessado, sem parecer que estou empurrando?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-clareza-funil',
    label: 'Clareza de funil (mando preço/promoção e não converte)',
    papel: 'vendedor-produto',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['eu fico mandando promoção e preço e quase ninguém compra. o que eu faço diferente?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-indicacoes-autoridade',
    label: 'Indicações + autoridade pelo link (Convicção: servir/agregar)',
    papel: 'vendedor-servico',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['como eu uso meu link pra gerar mais indicações e virar autoridade no meu nicho?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-acao-de-hoje',
    label: 'O que fazer hoje (ação prática do dia)',
    papel: 'lider-rede',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['o que eu faço hoje, na prática, pra começar a usar isso de verdade com meu time?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-instagram-valor-conviccao',
    label: 'Instagram · agregar valor pela filosofia de Convicção (observar: educa/serve, autoridade como consequência, não "compre")',
    papel: 'liberal',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['no instagram, o que eu posto pra agregar valor do jeito da filosofia de convicção, sem virar vitrine de compre?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-distribuicao-pos-link',
    label: 'Distribuição pós-link · onde divulgar e a copy pronta (observar: oferece canais, entrega legenda pronta)',
    papel: 'vendedor-produto',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['acabei de gerar meu link. o que eu posto no instagram e como divulgo pra as pessoas responderem?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
  {
    id: 'dia-posicionamento-desconto',
    label: 'Posicionamento · "só pedem desconto" (observar: posiciona por valor, atrai quem valoriza)',
    papel: 'vendedor-servico',
    fase: 'dia-a-dia',
    esperaLink: false,
    desafio: null,
    turns: ['só me perguntam preço e pedem desconto. como eu me posiciono pra atrair clientes que valorizam meu trabalho?'],
    seedHistory: SEED_POS_ATIVACAO,
  },
] as const
