// =====================================================
// FÁBRICA — fluxos de recrutamento Pró-Líderes (Caminho 2)
// =====================================================
//
// Os 17 fluxos de recrutamento compartilham as MESMAS 5 perguntas (raio-X financeiro +
// 1 reflexiva), a MESMA regra de prontidão e a MESMA devolutiva afiada. O que muda por
// fluxo é só a ABERTURA (o gancho temático) e a identidade (id/handle/nome/tags).
//
// Esta fábrica concentra tudo que é compartilhado e gera cada YladaFlow a partir do
// pouco que varia. É o princípio "um produto, vários nichos; nicho é config" aplicado
// dentro do recrutamento: 17 fluxos, uma planta.
//
// Fonte da verdade do conteúdo: Chat5_Fase2_Molde_GanhosProsperidade.md (molde) + decisão
// Caminho 2 (devolutiva compartilhada). Gate: Regua_Qualidade_Diagnosticos.md.
// Outcomes (eixo DOR/arquétipo): migrations/444 (ganhos) + 445 (os 16 outros).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type { YladaFlow, PerguntaYlada, Devolutiva, RegraSeparacao2080, Handoff } from '@/types/ylada-flow'

// --- As 5 perguntas afiadas, compartilhadas (molde §4) ---
export const PERGUNTAS_RECRUTAMENTO_PADRAO: PerguntaYlada[] = [
  {
    id: 'p1',
    texto: 'No fim do mês, sobra ou aperta?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Aperta sempre, não chega no fim',
      'Empata, não sobra nada',
      'Sobra um pouco, mas some rápido',
      'Sobra e consigo guardar',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p2',
    texto: 'Seu dinheiro vem de uma fonte só ou de mais de uma?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Só de uma',
      'Uma fixa e uns extras de vez em quando',
      'Tenho um negócio próprio também',
      'Mais de uma firme, e ainda algo rendendo sozinho',
    ],
    papel: { alimentaLeitura: ['dor', 'contexto'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p3',
    texto: 'Se você parar de trabalhar um mês, o dinheiro para junto?',
    tipo: 'multipla_escolha',
    opcoes: ['Para na hora', 'Dura pouco, umas semanas', 'Tenho fôlego de um ou dois meses', 'Continua entrando mesmo parado'],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p4',
    texto: 'Quando você pensa em ganhar mais, o que vem na cabeça?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Que eu já faço o que dá e não muda',
      'Que dava pra mais, mas não sei por onde',
      'Que tô quase no meu limite de tempo',
      'Que tô no caminho que quero',
    ],
    papel: { alimentaLeitura: ['perfil'], separa2080: { peso: 2, inverter: false, sinal: 'abertura' } },
  },
  {
    id: 'p5',
    texto: 'Olhando pras próximas semanas, como tá sua cabeça sobre buscar uma renda a mais?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Nem penso nisso, só no dia a dia',
      'Acho possível, mas ainda não parei pra organizar',
      'Se fizer sentido no meu tempo, quero olhar com calma',
      'Quero um próximo passo claro, mesmo que pequeno, já',
    ],
    papel: { alimentaLeitura: ['momento'], separa2080: { peso: 3, inverter: false, sinal: 'urgencia' } },
  },
]

// --- Prontidão pelos 3 sinais da Aula 2 (molde §5) ---
export const SEPARACAO_2080_RECRUTAMENTO: RegraSeparacao2080 = {
  regraId: 'recrutamento-prontidao-aula2-v1',
}

// --- Devolutiva compartilhada por prontidão (molde §6.1/§6.2). Eixo DOR vive nos outcomes. ---
export const DEVOLUTIVA_RECRUTAMENTO_PADRAO: Devolutiva = {
  porPerfil: {
    // PRONTA (20%) — autoridade / caminho direto
    pronto: {
      espelho: 'Você já sacou que precisa de mais de uma fonte. E quer um próximo passo claro, não mais um "talvez".',
      causa: 'O que falta não é vontade. É um caminho que caiba na sua rotina sem virar mais um peso.',
      primeiroPasso: 'O primeiro passo é uma conversa curta com quem te enviou pra montar isso do seu jeito.',
      ctaWhatsApp: 'Chama quem te mandou e diz: "quero começar, por onde eu vou?"',
    },
    // AINDA NÃO (80%) — servir / educar
    curioso: {
      espelho: 'Você ganha, mas o dinheiro escorrega. No fim do mês some e você nem vê pra onde foi.',
      causa: 'O problema não é falta de esforço. É que quase tudo depende de uma renda só.',
      primeiroPasso: 'Dá pra começar pequeno, sem largar o que você já faz. Um passo só, no seu tempo.',
      ctaWhatsApp: 'Fala com quem te mandou isso e pergunta como dar o primeiro passo.',
    },
  },
}

// --- Handoff padrão (molde §7) ---
export const HANDOFF_RECRUTAMENTO_PADRAO: Handoff = {
  templateId: 'handoff-padrao',
  captacaoDados: false,
  inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
}

/** O que varia por fluxo (Caminho 2): identidade + abertura temática. */
export interface RecrutamentoVariacao {
  id: string
  handle: string
  nome: string
  objetivo: string
  /** o gancho temático da abertura (o resto da abertura é padrão). */
  gancho: string
  /** opcional: continua a promessa da entrada (anúncio/post temático). */
  coerenciaOrigem?: string
  tags: string[]
}

/** Gera um YladaFlow de recrutamento a partir do pouco que varia. */
export function criarFluxoRecrutamento(v: RecrutamentoVariacao): YladaFlow {
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
      funil: 'marketing',
      tipo: 'quiz',
      finalidade: 'recrutamento',
      governanca: ['nenhuma'],
    },
    abertura: {
      gancho: v.gancho,
      baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
      autoridadeSutil: 'Quem te mandou isso acompanha de perto gente que está virando esse jogo.',
      ctaUnico: 'Começar',
      coerenciaOrigem: v.coerenciaOrigem ?? 'Continua o convite de quem enviou o link (sem prometer renda).',
    },
    origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },
    perguntas: PERGUNTAS_RECRUTAMENTO_PADRAO,
    separacao2080: SEPARACAO_2080_RECRUTAMENTO,
    devolutiva: { ...DEVOLUTIVA_RECRUTAMENTO_PADRAO, empacotadaId: v.id },
    ganchosIndicacao: [
      { etapa: 'follow-up', frase: 'Conhece alguém que também corre o mês todo e não vê o dinheiro render?' },
      { etapa: 'compartilhar-devolutiva', frase: 'Se fez sentido pra você, manda pra quem você sabe que tá no mesmo aperto.' },
    ],
    handoff: HANDOFF_RECRUTAMENTO_PADRAO,
    origemBiblioteca: 'biblioteca-recrutamento-pro-lideres-v1',
    tags: v.tags,
  }
}
