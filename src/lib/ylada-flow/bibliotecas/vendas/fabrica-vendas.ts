// =====================================================
// FÁBRICA GENÉRICA — fluxos de VENDAS Pró-Líderes (Lote 3)
// =====================================================
//
// Mesmo princípio do recrutamento (Caminho 2), agora generalizado: um BLOCO de
// vendas = uma LEITURA (as perguntas que medem a mesma coisa) → uma DEVOLUTIVA
// afiada compartilhada. O que varia por fluxo é só a ABERTURA (gancho temático) e a
// identidade (id/handle/nome/tags).
//
// Diferença pro recrutamento: lá havia UM bloco só, então as peças compartilhadas
// moravam na própria fábrica. Em vendas há VÁRIOS blocos (Corpo & Metabolismo,
// Energia & Foco, ...), então as peças compartilhadas vivem em cada arquivo de
// bloco (`./blocos/*.ts`) e esta fábrica é só o GERADOR + os contratos. É o que
// permite o bloco Energia & Foco reusar tudo isto depois sem refazer nada.
//
// IMPORTANTE: "hype" deixa de ser um bloco. É marca de produto (Spec §13), some.
// Os 4 ex-hype (energia-foco/pre-treino/rotina-produtiva/constancia) entram no
// bloco Energia & Foco quando ele for construído, neutralizados ali.
//
// Fonte da verdade do conteúdo: cada bloco (régua: Regua_Qualidade_Diagnosticos.md).
// Outcomes (eixo DOR/arquétipo) vivem no SQL por flow_id (migrations).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type {
  YladaFlow,
  PerguntaYlada,
  Devolutiva,
  RegraSeparacao2080,
  Handoff,
  GanchoIndicacao,
  Governanca,
} from '@/types/ylada-flow'

/** Tudo que um BLOCO de vendas compartilha: uma leitura → uma devolutiva afiada. */
export interface VendasBloco {
  /** id do bloco na biblioteca (ex.: 'corpo-metabolismo'). */
  blocoId: string
  /** o questionário único do bloco (afiado pela régua; papel declarado obrigatório). */
  perguntas: PerguntaYlada[]
  /** regra de prontidão (mesma da biblioteca 20/80; o eixo DOR fica nos outcomes). */
  separacao2080: RegraSeparacao2080
  /** devolutiva compartilhada por prontidão (pronto/curioso). O TOM por DOR vive no SQL. */
  devolutiva: Devolutiva
  ganchosIndicacao: GanchoIndicacao[]
  handoff: Handoff
  /** governança do bloco (ex.: ['bem-estar'] — corpo é health-adjacent, sem claim clínico). */
  governanca: Governanca[]
  /** peças padrão da abertura; só o gancho varia por fluxo. */
  aberturaPadrao: {
    baixaFriccao: string
    autoridadeSutil?: string
    ctaUnico: string
    coerenciaOrigemDefault: string
  }
  origemBiblioteca?: string
}

/** O que varia por fluxo dentro do bloco: identidade + gancho temático da abertura. */
export interface VendasVariacao {
  id: string
  handle: string
  nome: string
  objetivo: string
  /** o gancho temático da abertura (o resto da abertura é padrão do bloco). */
  gancho: string
  /** opcional: continua a promessa da entrada (anúncio/post temático). */
  coerenciaOrigem?: string
  tags: string[]
}

/** Gera um YladaFlow de vendas a partir do pouco que varia + as peças do bloco. */
export function criarFluxoVendas(v: VendasVariacao, bloco: VendasBloco): YladaFlow {
  return {
    id: v.id,
    handle: v.handle,
    nome: v.nome,
    objetivo: v.objetivo,
    tenantId: '<rede da líder>',
    ownerId: '<líder/membro>',
    idiomaPadrao: 'pt',
    dimensoes: {
      frente: 'rede',
      nicho: 'pro-lideres',
      regiao: 'BR',
      // quiz que serve primeiro (diagnostica → conversa), por isso funil 'marketing'.
      // A FINALIDADE é vendas (leva a um produto); funil e finalidade são eixos independentes.
      funil: 'marketing',
      tipo: 'quiz',
      finalidade: 'vendas',
      governanca: bloco.governanca,
    },
    abertura: {
      gancho: v.gancho,
      baixaFriccao: bloco.aberturaPadrao.baixaFriccao,
      autoridadeSutil: bloco.aberturaPadrao.autoridadeSutil,
      ctaUnico: bloco.aberturaPadrao.ctaUnico,
      coerenciaOrigem: v.coerenciaOrigem ?? bloco.aberturaPadrao.coerenciaOrigemDefault,
    },
    origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },
    perguntas: bloco.perguntas,
    separacao2080: bloco.separacao2080,
    devolutiva: { ...bloco.devolutiva, empacotadaId: v.id },
    ganchosIndicacao: bloco.ganchosIndicacao,
    handoff: bloco.handoff,
    origemBiblioteca: bloco.origemBiblioteca,
    tags: v.tags,
  }
}
