// =====================================================
// BIBLIOTECA — os 17 fluxos de recrutamento Pró-Líderes (Caminho 2)
// =====================================================
//
// Todos gerados pela fábrica (`fabrica-recrutamento.ts`): mesmas 5 perguntas, mesma
// regra de prontidão, mesma devolutiva afiada. Varia só a ABERTURA (gancho temático)
// e a identidade. Outcomes (eixo DOR) em migrations/444 (ganhos) + 445 (os 16 outros).
//
// Os ids batem com `src/lib/recruitment-fluxo-public-intro.ts` (14 aberturas situacionais
// + 3 quizzes) — NÃO renomear (chave de lookup da devolutiva; ver Fase0 §2.1).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'
import { criarFluxoRecrutamento, type RecrutamentoVariacao } from './fabrica-recrutamento'

const OBJETIVO_PADRAO =
  'Quem clica se vê na própria situação de renda e abre conversa com quem enviou o link.'

/** O que varia por fluxo (Caminho 2): só identidade + gancho temático. */
const VARIACOES: RecrutamentoVariacao[] = [
  // --- 14 aberturas situacionais ---
  {
    id: 'renda-extra-imediata',
    handle: 'renda-extra-imediata',
    nome: 'Renda Extra Imediata',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Precisa de um dinheiro a mais agora? Em 5 perguntas, veja o que está prendendo a sua renda hoje.',
    tags: ['recrutamento', 'pro-lideres', 'renda-extra'],
  },
  {
    id: 'transformar-consumo-renda',
    handle: 'transformar-consumo-renda',
    nome: 'Transformar Consumo em Renda',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Todo mês você gasta com o que usa. Em 5 perguntas, veja o que está prendendo o seu dinheiro.',
    tags: ['recrutamento', 'pro-lideres', 'consumo'],
  },
  {
    id: 'maes-trabalhar-casa',
    handle: 'maes-trabalhar-casa',
    nome: 'Mães que Querem Trabalhar de Casa',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Dá pra ganhar de casa sem largar a família? Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'maes', 'casa'],
  },
  {
    id: 'ja-consome-bem-estar',
    handle: 'ja-consome-bem-estar',
    nome: 'Já Cuida do Bem-Estar',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você já cuida do seu bem-estar. Em 5 perguntas, veja o que está prendendo o seu dinheiro.',
    tags: ['recrutamento', 'pro-lideres', 'bem-estar'],
  },
  {
    id: 'ja-usa-energia-acelera',
    handle: 'ja-usa-energia-acelera',
    nome: 'Já Usa Produtos de Energia',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você já usa o que te dá energia no dia. Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'energia'],
  },
  {
    id: 'perderam-emprego-transicao',
    handle: 'perderam-emprego-transicao',
    nome: 'Em Transição de Carreira',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Recomeçando depois de uma virada? Em 5 perguntas, veja o que está prendendo a sua renda agora.',
    tags: ['recrutamento', 'pro-lideres', 'transicao'],
  },
  {
    id: 'cansadas-trabalho-atual',
    handle: 'cansadas-trabalho-atual',
    nome: 'Cansada do Trabalho Atual',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Cansada do trabalho de hoje? Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'cansaco'],
  },
  {
    id: 'trabalhar-apenas-links',
    handle: 'trabalhar-apenas-links',
    nome: 'Trabalhar Só pelo Celular',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Dá pra trabalhar só pelo celular? Em 5 perguntas, veja o que está prendendo a sua renda hoje.',
    tags: ['recrutamento', 'pro-lideres', 'digital'],
  },
  {
    id: 'ja-tentaram-outros-negocios',
    handle: 'ja-tentaram-outros-negocios',
    nome: 'Já Tentou Outros Negócios',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Já tentou outros negócios e não engatou? Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'recomeco'],
  },
  {
    id: 'querem-trabalhar-digital',
    handle: 'querem-trabalhar-digital',
    nome: 'Quer Trabalhar no Digital',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Quer trabalhar no digital? Em 5 perguntas, veja o que está prendendo a sua renda hoje.',
    tags: ['recrutamento', 'pro-lideres', 'digital'],
  },
  {
    id: 'ja-empreendem',
    handle: 'ja-empreendem',
    nome: 'Já Empreende',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você já empreende. Em 5 perguntas, veja o que ainda prende o seu dinheiro.',
    tags: ['recrutamento', 'pro-lideres', 'empreende'],
  },
  {
    id: 'querem-emagrecer-renda',
    handle: 'querem-emagrecer-renda',
    nome: 'Cuidar do Corpo e Ter Renda',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Quer cuidar do corpo e ainda ter uma renda a mais? Em 5 perguntas, veja o que está prendendo o seu dinheiro.',
    tags: ['recrutamento', 'pro-lideres', 'corpo', 'renda'],
  },
  {
    id: 'boas-venda-comercial',
    handle: 'boas-venda-comercial',
    nome: 'Boa de Venda',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você é boa de venda? Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'vendas'],
  },
  {
    id: 'jovens-empreendedores',
    handle: 'jovens-empreendedores',
    nome: 'Jovens Empreendedores',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Novo e com vontade de construir algo seu? Em 5 perguntas, veja o que está prendendo a sua renda.',
    tags: ['recrutamento', 'pro-lideres', 'jovens'],
  },
  // --- 3 quizzes temáticos ---
  {
    id: 'quiz-recrut-ganhos-prosperidade',
    handle: 'ganhos',
    nome: 'Ganhos e Prosperidade',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você corre o mês todo e, no fim, não sobra o quanto devia. Em 5 perguntas, veja o que está prendendo o seu dinheiro.',
    tags: ['recrutamento', 'pro-lideres', 'ganhos', 'prosperidade', 'renda'],
  },
  {
    id: 'quiz-recrut-proposito-equilibrio',
    handle: 'proposito',
    nome: 'Propósito e Equilíbrio',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Trabalha muito e sente que falta sentido e equilíbrio? Em 5 perguntas, veja o que está prendendo o seu dinheiro e o seu tempo.',
    tags: ['recrutamento', 'pro-lideres', 'proposito', 'equilibrio'],
  },
  {
    id: 'quiz-recrut-potencial-crescimento',
    handle: 'potencial',
    nome: 'Potencial e Crescimento',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Sente que tem mais potencial do que está usando? Em 5 perguntas, veja o que está prendendo o seu crescimento.',
    tags: ['recrutamento', 'pro-lideres', 'potencial', 'crescimento'],
  },
]

/** Os 17 fluxos de recrutamento, prontos no contrato YladaFlow. */
export const FLUXOS_RECRUTAMENTO: YladaFlow[] = VARIACOES.map(criarFluxoRecrutamento)

/** Lookup por flow_id. */
export const FLUXOS_RECRUTAMENTO_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_RECRUTAMENTO.map((f) => [f.id, f]),
)

/** O molde de referência (mesmo objeto que vive no índice). */
export const FLUXO_GANHOS_PROSPERIDADE: YladaFlow =
  FLUXOS_RECRUTAMENTO_POR_ID['quiz-recrut-ganhos-prosperidade']
