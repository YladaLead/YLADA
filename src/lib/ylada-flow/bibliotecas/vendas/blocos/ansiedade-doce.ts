// =====================================================
// BLOCO — Ansiedade por Doce / Fome Emocional (Lote 3 vendas)
// =====================================================
//
// Eixo de leitura PRÓPRIO: "a vontade de doce/beliscar me domina, e vem mais da
// cabeça (ansiedade, cansaço, tédio) do que da fome". É DIFERENTE de Corpo (peso/
// inchaço) e de Energia (queda de energia) — por isso é bloco separado, com 1 fluxo.
//
// Membro: ansiedade-doce (flow_id = fluxos-clientes.id — NÃO renomear).
//
// ⚠️ CUIDADO DE BEM-ESTAR (tema sensível: fome emocional, ansiedade, culpa):
//   - SEM promessa de emagrecer/controlar peso, SEM diagnóstico (não é transtorno alimentar).
//   - NÃO reforçar culpa nem restrição ("corte o açúcar", "force de vontade"). A causa ALIVIA.
//   - Devolutiva acolhedora; CTA = falar com uma PESSOA (quem enviou), não "compre pra parar".
//   - SEM termo de produto/Herbalife, SEM salvaguarda clínica (esfriaria). Linguagem de bem-estar.
//
// Outcomes (eixo DOR: leve/moderado/urgente) → migration 451.
//
// STATUS: adição pura. Risco zero (auto-registra no render nativo via FLUXOS_VENDAS_POR_ID,
// mas só ativa atrás da flag `use_ylada_flow_native` por link).
// =====================================================

import type {
  YladaFlow,
  PerguntaYlada,
  Devolutiva,
  RegraSeparacao2080,
  Handoff,
  GanchoIndicacao,
} from '@/types/ylada-flow'
import { criarFluxoVendas, type VendasBloco, type VendasVariacao } from '../fabrica-vendas'

// --- 5 perguntas afiadas (régua §3: provoca E mede; sem escala 0–10; nunca constrange) ---
// 3 de DOR (inverter:true → pior = arquétipo urgente) + 1 abertura + 1 urgência (prontidão).
const PERGUNTAS_ANSIEDADE: PerguntaYlada[] = [
  {
    id: 'p1',
    texto: 'Com que força bate a vontade de doce ou de beliscar no seu dia?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Quase não resisto, é mais forte que eu',
      'Bate forte em alguns momentos',
      'Sinto, mas controlo na maioria das vezes',
      'Quase nunca sinto',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p2',
    texto: 'Quando vem essa vontade, geralmente é por quê?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Ansiedade, estresse ou tédio',
      'Cansaço, queda de energia',
      'Mais por costume de horário',
      'Fome de verdade',
    ],
    papel: { alimentaLeitura: ['dor', 'contexto'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p3',
    texto: 'Depois que você cede, como costuma se sentir?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Mal comigo, sinto que perdi o controle',
      'Incomodada, mas deixo pra lá',
      'Tranquila, foi só um docinho',
      'Nem penso nisso',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p4',
    texto: 'Quando você pensa em ter mais equilíbrio com isso, o que vem na cabeça?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Que já tentei e sempre recaio',
      'Que dá pra melhorar, mas não sei como',
      'Que tô quase lá, falta pouco',
      'Que tô bem do jeito que tô',
    ],
    papel: { alimentaLeitura: ['perfil'], separa2080: { peso: 2, inverter: false, sinal: 'abertura' } },
  },
  {
    id: 'p5',
    texto: 'Olhando pros próximos dias, como tá sua vontade de cuidar disso?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Nem penso, levo como dá',
      'Sei que devia, mas não parei pra fazer',
      'Se for simples e couber na rotina, quero olhar',
      'Quero um primeiro passo claro, já',
    ],
    papel: { alimentaLeitura: ['momento'], separa2080: { peso: 3, inverter: false, sinal: 'urgencia' } },
  },
]

const SEPARACAO_2080_ANSIEDADE: RegraSeparacao2080 = {
  regraId: 'vendas-prontidao-aula2-v1',
}

// --- Devolutiva acolhedora, compartilhada por prontidão. Eixo DOR (tom) nos outcomes (451). ---
// A causa SEMPRE alivia a culpa; o 1º passo é pequeno e gentil; CTA = falar com uma pessoa.
const DEVOLUTIVA_ANSIEDADE: Devolutiva = {
  porPerfil: {
    pronto: {
      espelho: 'Você cansou de a vontade de doce mandar em você e quer um jeito que funcione de verdade.',
      causa: 'Isso não é falta de força de vontade. Quase sempre a vontade vem do cansaço ou da ansiedade, não da fome.',
      primeiroPasso: 'O primeiro passo é uma conversa curta com quem te enviou pra montar algo simples do seu jeito.',
      ctaWhatsApp: 'Chama quem te mandou e diz: "quero entender essa vontade de doce, por onde eu começo?"',
    },
    curioso: {
      espelho: 'A vontade de doce aperta no meio do dia e fica difícil resistir. Aí depois vem aquele desconforto.',
      causa: 'Não é fraqueza sua. Na maioria das vezes a vontade é a cabeça pedindo alívio, não o corpo pedindo comida.',
      primeiroPasso: 'Dá pra começar pequeno, sem dieta nem corte radical. Entender o gatilho já é meio caminho.',
      ctaWhatsApp: 'Fala com quem te mandou isso e pergunta como começar a equilibrar essa vontade.',
    },
  },
}

const GANCHOS_ANSIEDADE: GanchoIndicacao[] = [
  { etapa: 'follow-up', frase: 'Conhece alguém que também briga com a vontade de doce o tempo todo?' },
  { etapa: 'compartilhar-devolutiva', frase: 'Se fez sentido pra você, manda pra quem você sabe que passa pela mesma coisa.' },
]

const HANDOFF_ANSIEDADE: Handoff = {
  templateId: 'handoff-padrao',
  captacaoDados: false,
  inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
}

/** O bloco Ansiedade por Doce, pronto pra fábrica genérica de vendas. */
export const BLOCO_ANSIEDADE_DOCE: VendasBloco = {
  blocoId: 'ansiedade-doce',
  perguntas: PERGUNTAS_ANSIEDADE,
  separacao2080: SEPARACAO_2080_ANSIEDADE,
  devolutiva: DEVOLUTIVA_ANSIEDADE,
  ganchosIndicacao: GANCHOS_ANSIEDADE,
  handoff: HANDOFF_ANSIEDADE,
  governanca: ['bem-estar'],
  aberturaPadrao: {
    baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
    autoridadeSutil: 'Quem te mandou isso acompanha de perto gente que está encontrando mais equilíbrio.',
    ctaUnico: 'Começar',
    coerenciaOrigemDefault: 'Continua o convite de quem enviou o link (sem julgamento, sem promessa).',
  },
  origemBiblioteca: 'biblioteca-vendas-ansiedade-doce-v1',
}

/** O que varia por fluxo: só identidade + gancho temático. (Bloco de 1 fluxo, por ora.) */
const VARIACOES: VendasVariacao[] = [
  {
    id: 'ansiedade-doce',
    handle: 'ansiedade-doce',
    nome: 'Vontade de Doce',
    objetivo:
      'Quem clica se vê na própria vontade de doce/beliscar e abre conversa com quem enviou o link.',
    gancho:
      'A vontade de doce aperta e fica difícil resistir? Em 5 perguntas, descubra o que está por trás dela, sem julgamento. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'ansiedade-doce', 'fome-emocional'],
  },
]

/** Os fluxos do bloco Ansiedade por Doce, prontos no contrato YladaFlow. */
export const FLUXOS_VENDAS_ANSIEDADE: YladaFlow[] = VARIACOES.map((v) =>
  criarFluxoVendas(v, BLOCO_ANSIEDADE_DOCE),
)

/** Lookup por flow_id. */
export const FLUXOS_VENDAS_ANSIEDADE_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS_ANSIEDADE.map((f) => [f.id, f]),
)
