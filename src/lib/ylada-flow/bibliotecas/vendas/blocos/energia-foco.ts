// =====================================================
// BLOCO — Energia & Foco (Lote 3 vendas)
// =====================================================
//
// Eixo de leitura: "minha energia despenca e o foco vai junto; empurro com café".
// Os fluxos abaixo medem a MESMA coisa → compartilham UM questionário afiado e UMA
// devolutiva afiada; varia só a ABERTURA (gancho temático). Caminho 2 aplicado a vendas.
//
// Absorve os 4 EX-HYPE (energia-foco · pre-treino · rotina-produtiva · constancia) +
// os 13 fluxos de energia do `fluxosClientes`. "Hype" NÃO vira silo: é marca de produto
// (Spec §13) e some. A NEUTRALIZAÇÃO acontece aqui de graça — o contrato YladaFlow não
// carrega `kitRecomendado`/termo Herbalife; o conteúdo nasce neutro.
//
// Membros (flow_id = fluxos-clientes.id / hype preset id — NÃO renomear, é chave de lookup):
//   ex-hype:  energia-foco · pre-treino · rotina-produtiva · constancia
//   energia:  energia-matinal · energia-tarde · troca-cafe · anti-cansaco · rotina-puxada ·
//             foco-concentracao · motoristas · mente-cansada · falta-disposicao-treinar ·
//             trabalho-noturno · rotina-estressante · maes-ocupadas · fim-tarde-sem-energia
//
// Governança (régua §6): finalidade VENDAS, bem-estar. SEM promessa de saúde/cura do cansaço,
//   SEM diagnóstico, SEM termo de produto, SEM salvaguarda clínica. Linguagem de bem-estar.
//
// Outcomes (eixo DOR: leve/moderado/urgente) → migration 449 (compartilhada por flow_id).
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
} from '@/types/ylada-flow'
import { criarFluxoVendas, type VendasBloco, type VendasVariacao } from '../fabrica-vendas'

// --- As 5 perguntas afiadas, compartilhadas (régua §3: provoca E mede; sem escala 0–10) ---
// 3 de DOR (inverter:true → pior = arquétipo urgente) + 1 abertura + 1 urgência (leem prontidão).
const PERGUNTAS_ENERGIA: PerguntaYlada[] = [
  {
    id: 'p1',
    texto: 'Como tá a sua energia ao longo do dia?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Despenca, vivo no cansaço',
      'Cai forte em algum horário',
      'Oscila, mas eu seguro',
      'Firme o dia todo',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p2',
    texto: 'E o seu foco, como anda?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Disperso, custo a engrenar',
      'Cai rápido depois de um tempo',
      'Oscila, mas dou conta',
      'Afiado a maior parte do tempo',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p3',
    texto: 'Pra aguentar o dia, você depende de café ou energético?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Sem isso eu não funciono',
      'Preciso de várias doses',
      'Tomo, mas dá pra viver sem',
      'Quase não preciso',
    ],
    papel: { alimentaLeitura: ['contexto', 'dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p4',
    texto: 'Quando você pensa em ter mais energia e disposição, o que vem na cabeça?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Que já tentei de tudo e nada segura',
      'Que dá pra melhorar, mas não sei como',
      'Que tô quase lá, falta pouco',
      'Que tô bem do jeito que tô',
    ],
    papel: { alimentaLeitura: ['perfil'], separa2080: { peso: 2, inverter: false, sinal: 'abertura' } },
  },
  {
    id: 'p5',
    texto: 'Olhando pros próximos dias, como tá sua vontade de resolver isso?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Nem penso, levo no cansaço mesmo',
      'Sei que devia, mas não parei pra fazer',
      'Se for simples e couber na rotina, quero olhar',
      'Quero um primeiro passo claro, já',
    ],
    papel: { alimentaLeitura: ['momento'], separa2080: { peso: 3, inverter: false, sinal: 'urgencia' } },
  },
]

const SEPARACAO_2080_ENERGIA: RegraSeparacao2080 = {
  regraId: 'vendas-prontidao-aula2-v1',
}

// --- Devolutiva compartilhada por prontidão. Eixo DOR (tom) vive nos outcomes (SQL 449). ---
const DEVOLUTIVA_ENERGIA: Devolutiva = {
  porPerfil: {
    pronto: {
      espelho: 'Você já cansou de viver no modo "aguentar o dia" e quer disposição de verdade, não mais um café.',
      causa: 'O que falta não é força de vontade. É um jeito simples de sustentar a energia que caiba na sua rotina.',
      primeiroPasso: 'O primeiro passo é uma conversa curta com quem te enviou pra montar isso do seu jeito.',
      ctaWhatsApp: 'Chama quem te mandou e diz: "quero ter mais energia, por onde eu começo?"',
    },
    curioso: {
      espelho: 'Sua energia despenca no meio do dia e o foco vai junto. Você empurra com café e força de vontade.',
      causa: 'Não é frescura nem preguiça. É que o seu corpo tá sem uma base que segure a energia o dia todo.',
      primeiroPasso: 'Dá pra começar pequeno, sem mudar tudo de uma vez. Um ajuste só, no seu ritmo.',
      ctaWhatsApp: 'Fala com quem te mandou isso e pergunta como ter mais energia no dia a dia.',
    },
  },
}

const GANCHOS_ENERGIA: GanchoIndicacao[] = [
  { etapa: 'follow-up', frase: 'Conhece alguém que também vive arrastado, sem energia pro dia?' },
  { etapa: 'compartilhar-devolutiva', frase: 'Se fez sentido pra você, manda pra quem você sabe que anda no modo cansaço.' },
]

const HANDOFF_ENERGIA: Handoff = {
  templateId: 'handoff-padrao',
  captacaoDados: false,
  inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
}

/** O bloco Energia & Foco, pronto pra fábrica genérica de vendas. */
export const BLOCO_ENERGIA_FOCO: VendasBloco = {
  blocoId: 'energia-foco',
  perguntas: PERGUNTAS_ENERGIA,
  separacao2080: SEPARACAO_2080_ENERGIA,
  devolutiva: DEVOLUTIVA_ENERGIA,
  ganchosIndicacao: GANCHOS_ENERGIA,
  handoff: HANDOFF_ENERGIA,
  governanca: ['bem-estar'],
  aberturaPadrao: {
    baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
    autoridadeSutil: 'Quem te mandou isso acompanha de perto gente que está recuperando a energia.',
    ctaUnico: 'Começar',
    coerenciaOrigemDefault: 'Continua o convite de quem enviou o link (sem prometer milagre).',
  },
  origemBiblioteca: 'biblioteca-vendas-energia-foco-v1',
}

const OBJETIVO_PADRAO =
  'Quem clica se vê na própria queda de energia e abre conversa com quem enviou o link.'

/** O que varia por fluxo: só identidade + gancho temático. */
const VARIACOES: VendasVariacao[] = [
  // --- 4 ex-hype (neutralizados aqui) ---
  {
    id: 'energia-foco',
    handle: 'energia-foco',
    nome: 'Energia & Foco',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'A energia some e o foco vai junto bem na hora que você mais precisa. Em 5 perguntas, descubra o que derruba o seu dia, e por onde começar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'foco'],
  },
  {
    id: 'pre-treino',
    handle: 'pre-treino',
    nome: 'Pré-Treino',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Chega no treino já sem gás? Em 5 perguntas, descubra o que rouba a sua energia antes da hora, e o que muda isso. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'treino'],
  },
  {
    id: 'rotina-produtiva',
    handle: 'rotina-produtiva',
    nome: 'Rotina Produtiva',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Dia cheio e mesmo assim a sensação de não ter rendido? Em 5 perguntas, descubra onde a sua energia escapa. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'produtividade'],
  },
  {
    id: 'constancia',
    handle: 'constancia',
    nome: 'Constância',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você começa animada e some na primeira semana? Em 5 perguntas, descubra o que derruba a sua constância, e como sustentar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'constancia'],
  },
  // --- 13 fluxos de energia do fluxosClientes ---
  {
    id: 'energia-matinal',
    handle: 'energia-matinal',
    nome: 'Energia Matinal',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Acorda e o corpo não engata? Em 5 perguntas, descubra o que trava as suas manhãs, e o primeiro passo pra virar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'manha'],
  },
  {
    id: 'energia-tarde',
    handle: 'energia-tarde',
    nome: 'Energia da Tarde',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Aquele apagão depois do almoço? Em 5 perguntas, descubra por que a sua energia despenca à tarde. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'tarde'],
  },
  {
    id: 'troca-cafe',
    handle: 'troca-cafe',
    nome: 'Dependência de Café',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Não funciona sem café? Em 5 perguntas, descubra o que está por trás da sua dependência de cafeína, e o que dá pra fazer. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'cafe'],
  },
  {
    id: 'anti-cansaco',
    handle: 'anti-cansaco',
    nome: 'Cansaço Constante',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Cansada o tempo todo, mesmo dormindo? Em 5 perguntas, descubra o que está drenando a sua energia. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'cansaco'],
  },
  {
    id: 'rotina-puxada',
    handle: 'rotina-puxada',
    nome: 'Rotina Puxada',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Rotina puxada e o corpo cobrando a conta? Em 5 perguntas, descubra o que te deixa no limite, e por onde aliviar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'rotina'],
  },
  {
    id: 'foco-concentracao',
    handle: 'foco-concentracao',
    nome: 'Foco e Concentração',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'A cabeça dispersa bem na hora de focar? Em 5 perguntas, descubra o que derruba a sua concentração. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'foco'],
  },
  {
    id: 'motoristas',
    handle: 'motoristas',
    nome: 'Energia na Estrada',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Horas ao volante e a atenção caindo? Em 5 perguntas, descubra o que rouba a sua energia na estrada, e como manter o foco. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'motoristas'],
  },
  {
    id: 'mente-cansada',
    handle: 'mente-cansada',
    nome: 'Mente Cansada',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'A cabeça pesada, como se nunca desligasse? Em 5 perguntas, descubra o que está cansando a sua mente. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'mente'],
  },
  {
    id: 'falta-disposicao-treinar',
    handle: 'falta-disposicao-treinar',
    nome: 'Sem Disposição pra Treinar',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Sabe que precisa se mexer, mas não vem disposição? Em 5 perguntas, descubra o que trava a sua energia pra treinar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'treino'],
  },
  {
    id: 'trabalho-noturno',
    handle: 'trabalho-noturno',
    nome: 'Trabalho Noturno',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Trabalha de noite e o corpo nunca acerta o ritmo? Em 5 perguntas, descubra o que mais pesa na sua energia. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'noturno'],
  },
  {
    id: 'rotina-estressante',
    handle: 'rotina-estressante',
    nome: 'Rotina Estressante',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Vivendo no limite, no piloto automático? Em 5 perguntas, descubra o que o estresse está fazendo com a sua energia. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'estresse'],
  },
  {
    id: 'maes-ocupadas',
    handle: 'maes-ocupadas',
    nome: 'Mães no Limite',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Dá conta de tudo e no fim não sobra energia pra você? Em 5 perguntas, descubra o que te deixa no zero. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'maes'],
  },
  {
    id: 'fim-tarde-sem-energia',
    handle: 'fim-tarde-sem-energia',
    nome: 'Fim de Tarde sem Energia',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Chega o fim da tarde e você já era? Em 5 perguntas, descubra por que a sua energia acaba antes do dia. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'energia', 'fim-de-tarde'],
  },
]

/** Os 17 fluxos do bloco Energia & Foco, prontos no contrato YladaFlow. */
export const FLUXOS_VENDAS_ENERGIA: YladaFlow[] = VARIACOES.map((v) =>
  criarFluxoVendas(v, BLOCO_ENERGIA_FOCO),
)

/** Lookup por flow_id. */
export const FLUXOS_VENDAS_ENERGIA_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS_ENERGIA.map((f) => [f.id, f]),
)
