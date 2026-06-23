// =====================================================
// BLOCO ESPECIAL — Avaliação do Perfil Metabólico (Lote 3 vendas)
// =====================================================
//
// É o ÚLTIMO fluxo do Lote 3, e é uma AVALIAÇÃO ESPECIAL — não cabe no molde
// comum de prontidão dos outros blocos (corpo/energia/ansiedade). A diferença:
//
//   • Os outros blocos têm 3 perguntas de DOR + 2 de PRONTIDÃO (abertura/urgência),
//     e a leitura final separa "pronta" × "ainda não".
//   • AQUI as 5 perguntas medem a MESMA coisa — o ritmo do corpo (energia, fome,
//     peso, sono/estresse) — e a leitura é por FAIXA DE SCORE → um PERFIL
//     (mais favorável / moderado / pedindo apoio), não por prontidão.
//
// Por isso as 5 perguntas são todas de DOR (sinal:'problema', inverter:true) →
// o score nativo soma 0–15 → as FAIXAS 8 e 12 (avaliacao-perfil-metabolico-risk-bands.ts,
// já no ar) viram os arquétipos leve / moderado / urgente. O diagnóstico já trata
// essa faixa especial pelo flow_id (route §isMetabolicProfileQuiz), tanto no render
// legado quanto no nativo.
//
// ⚠️ flow_id = 'avaliacao-perfil-metabolico' (chave de lookup — NÃO renomear).
//
// ✅ OUTCOMES JÁ MIGRADOS: a devolutiva por arquétipo (leve/moderado/urgente) já vive
//    em `ylada_flow_diagnosis_outcomes` pela **migration 436** (alinhada ao template
//    Wellness, faixas 8/12). Esta migração NÃO cria SQL novo — reusa o 436. É o que
//    a torna mais leve que os outros blocos do Lote 3.
//
// Governança (régua §6): finalidade VENDAS, health-adjacent (metabolismo).
//   → SEM promessa de saúde, SEM "emagrece/desincha/acelera o metabolismo", SEM
//     diagnóstico, SEM salvaguarda clínica (esfriaria um fluxo de vendas). Bem-estar.
//
// Reaproveita `criarFluxoVendas` só pelo GERADOR (identidade + abertura + montagem do
// contrato); a "prontidão" da fábrica fica inerte aqui porque nenhuma pergunta carrega
// os sinais 'urgencia'/'abertura' — o handoff cai sempre em "ainda não" (servir), que é
// o certo para uma avaliação sem pergunta de prontidão. O TOM real vem do 436 (faixa).
//
// STATUS: adição pura. Auto-registra no render nativo via FLUXOS_VENDAS_POR_ID,
// mas só ativa atrás da flag `meta.use_ylada_flow_native` por link. Risco zero.
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

// --- As 5 perguntas: todas medem o RITMO do corpo (régua §3: provoca E mede) ---
// ⚠️ ORDEM DAS OPÇÕES É CHAVE DE SCORE: índice 0 = sinal mais "pesado/lento" (RISK maior),
//    índice 3 = mais leve/equilibrado. inverter:true → pior = arquétipo urgente.
//    NÃO embaralhar a ordem: as faixas 8/12 (risk-bands) dependem de 5 × 0–3 = 0–15.
// Versão afiada pela régua das perguntas canônicas do Wellness
// (avaliacao-perfil-metabolico-quiz-questions.ts): frase curta, palavra de gente,
// sem travessão de aparte, sem "consultorês". Semântica e ordem preservadas.
const PERGUNTAS_METABOLICO: PerguntaYlada[] = [
  {
    id: 'p1',
    texto: 'O seu corpo parece gastar energia com facilidade ou acumula fácil?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Acumula fácil, custa ver mudança no espelho ou na roupa',
      'Mais devagar, demoro pra ver resultado e qualquer deslize pesa',
      'Mais ou menos, nem rápido nem travado',
      'Rápido, se como pouco já sinto falta de energia',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p2',
    texto: 'Como está a sua energia ao longo do dia?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Bem irregular, custo a acordar e à tarde apago',
      'Cai bastante, vou bem e depois bate o cansaço',
      'Oscila, mas na maior parte do dia eu me viro',
      'Mais estável, recupero com uma comida ou um descanso',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p3',
    texto: 'E a sua fome, como ela se comporta no dia a dia?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Muito forte e fora de hora, doce e pão chamam toda hora',
      'Dá uns picos de fome ou de vontade, nem sempre fome de verdade',
      'Mais previsível, vem nas refeições',
      'Leve, me sacio com pouco',
    ],
    papel: { alimentaLeitura: ['dor', 'contexto'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p4',
    texto: 'Com que frequência você se sente pesada, inchada ou com a digestão lenta?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Quase sempre, vivo com o corpo travado',
      'Depois de certas refeições ou em alguns dias do mês',
      'De vez em quando, depende do que como ou de como durmo',
      'Quase nunca',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p5',
    texto: 'Como andam o seu sono, o seu estresse e a regularidade da rotina?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Bem bagunçados, durmo mal e o estresse vive alto',
      'Um dos dois pesa: ou o sono frágil ou o estresse que desorganiza tudo',
      'Razoáveis, tem dia ruim mas não é o normal',
      'Mais estáveis, consigo manter rotina e descanso',
    ],
    papel: { alimentaLeitura: ['dor', 'contexto'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
]

// Sem pergunta de prontidão: a regra não separa pronta × ainda-não (a leitura é por faixa).
// regraId documenta isso; o eixo real (faixa/arquétipo) vive no 436 + risk-bands.
const SEPARACAO_2080_METABOLICO: RegraSeparacao2080 = {
  regraId: 'vendas-perfil-metabolico-por-faixa-v1',
}

// --- Devolutiva (FALLBACK do contrato). A devolutiva VIVA por perfil/faixa = migration 436. ---
// Aqui não há eixo de prontidão real (nenhuma pergunta de urgência/abertura), então o handoff
// cai em "curioso" (servir), que é o certo para uma avaliação. Régua §4: espelho → causa →
// 1º passo → CTA. SEM promessa de saúde, sem termo de produto, sem diagnóstico.
const DEVOLUTIVA_METABOLICO: Devolutiva = {
  porPerfil: {
    pronto: {
      espelho: 'Você quer entender de verdade como o seu corpo está funcionando hoje, e o que dá pra fazer com isso.',
      causa: 'O ritmo do corpo não é só genética. Sono, estresse e horário das refeições mexem com ele todo dia.',
      primeiroPasso: 'O primeiro passo é uma conversa curta com quem te enviou pra ler esse resultado junto e escolher um ajuste só.',
      ctaWhatsApp: 'Chama quem te mandou e diz: "fiz a avaliação do meu perfil metabólico, por onde eu começo?"',
    },
    curioso: {
      espelho: 'Energia que cai, fome fora de hora, corpo pesado: tudo isso conta como o seu corpo vem funcionando.',
      causa: 'Não é frescura nem falta de força de vontade. O ritmo do corpo responde ao sono, ao estresse e à rotina.',
      primeiroPasso: 'Dá pra começar pequeno, com um ajuste só, sem dieta radical nem virar a vida de cabeça pra baixo.',
      ctaWhatsApp: 'Fala com quem te mandou isso e pergunta como dar o primeiro passo a partir do seu perfil.',
    },
  },
}

const GANCHOS_METABOLICO: GanchoIndicacao[] = [
  { etapa: 'follow-up', frase: 'Conhece alguém que vive cansada, com fome fora de hora ou o corpo pesado?' },
  { etapa: 'compartilhar-devolutiva', frase: 'Se fez sentido pra você, manda pra quem você sabe que anda no mesmo ritmo.' },
]

const HANDOFF_METABOLICO: Handoff = {
  templateId: 'handoff-padrao',
  captacaoDados: false,
  inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
}

/** O bloco especial Avaliação do Perfil Metabólico. */
export const BLOCO_PERFIL_METABOLICO: VendasBloco = {
  blocoId: 'perfil-metabolico',
  perguntas: PERGUNTAS_METABOLICO,
  separacao2080: SEPARACAO_2080_METABOLICO,
  devolutiva: DEVOLUTIVA_METABOLICO,
  ganchosIndicacao: GANCHOS_METABOLICO,
  handoff: HANDOFF_METABOLICO,
  governanca: ['bem-estar'],
  aberturaPadrao: {
    baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
    autoridadeSutil: 'Quem te mandou isso acompanha de perto gente cuidando do próprio ritmo.',
    ctaUnico: 'Começar',
    coerenciaOrigemDefault: 'Continua o convite de quem enviou o link (sem promessa de emagrecer).',
  },
  origemBiblioteca: 'biblioteca-vendas-perfil-metabolico-v1',
}

/** Bloco de 1 fluxo (a avaliação é única). */
const VARIACOES: VendasVariacao[] = [
  {
    id: 'avaliacao-perfil-metabolico',
    handle: 'avaliacao-perfil-metabolico',
    nome: 'Avaliação do Perfil Metabólico',
    objetivo:
      'Quem clica entende como o próprio corpo está funcionando hoje e abre conversa com quem enviou o link.',
    gancho:
      'Energia que cai, fome fora de hora, corpo pesado: tudo isso fala do seu metabolismo. Em 5 perguntas, descubra como o seu corpo vem funcionando hoje. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'metabolismo', 'avaliacao', 'perfil-metabolico'],
  },
]

/** O fluxo do bloco Avaliação do Perfil Metabólico, pronto no contrato YladaFlow. */
export const FLUXOS_VENDAS_METABOLICO: YladaFlow[] = VARIACOES.map((v) =>
  criarFluxoVendas(v, BLOCO_PERFIL_METABOLICO),
)

/** Lookup por flow_id. */
export const FLUXOS_VENDAS_METABOLICO_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS_METABOLICO.map((f) => [f.id, f]),
)
