// =====================================================
// RECOMENDADOR DA BIBLIOTECA — realinhado ao contrato YladaFlow (Chat 7)
// =====================================================
//
// O QUE É: o modo padrão do Noel (Spec §3). Regra de ouro: "Biblioteca > geração"
// (Spec §7.1) — recomendar um fluxo PRONTO é lookup (custo de LLM ~zero); gerar com
// LLM é a EXCEÇÃO. Este módulo é esse lookup: dado nicho/papel/intenção, devolve o(s)
// fluxo(s) curado(s) da biblioteca MIGRADA, sem chamar modelo nem banco.
//
// RECONCILIAÇÃO (não sobrescrever) — três mundos hoje, alinhados aqui:
//  1. `noel-wellness/links-recommender.ts` (LEGADO): lookup por palavra-chave na tabela
//     `wellness_links` do Supabase. Continua funcionando (usado por /api/noel/
//     recomendarLinkWellness). NÃO é removido. Para migrar chamadas pro contrato existe
//     `recomendarPorContextoLegado()` abaixo (traduz TipoLead/ObjetivoLink → critério).
//  2. `/api/ylada/interpret` (GERAÇÃO): LLM que escolhe 1 de 5 arquiteturas genéricas e
//     GERA as perguntas. É a EXCEÇÃO (cara). Arquitetura alvo: o Recomendador roda PRIMEIRO
//     (lookup); só quando NÃO há fluxo curado pro nicho/intenção é que cai no interpret.
//     Quando `recomendarFluxos` devolve [], o chamador faz o fallback de geração de hoje.
//  3. Biblioteca migrada (este módulo indexa): vendas (24) + recrutamento (17) +
//     calculadoras (4) = 45 fluxos curados no contrato. Hoje só ligados ao render nativo
//     atrás de flag; aqui passam a ser também recomendáveis.
//
// PRESERVAR (regra do route.ts): "conteúdo > link, exceto ferramenta explícita e ajuste
// de link". Este módulo é DADO PURO — não decide modo. O roteamento de modo
// (`classifyNoelResponseMode`) NÃO é tocado. O Recomendador só é consultado DENTRO do
// modo_link / recomendação; nunca promove um link sobre um pedido de conteúdo.
//
// CUSTO: determinístico (pontuação em código), zero LLM, zero DB — o tipo "lookup (barato)"
// da tabela §9 da Spec.
//
// STATUS: adição pura. Nada importa este módulo ainda — risco zero. Inerte até ser ligado
// (atrás de flag, como todo o Chat 4+).
// =====================================================

import type {
  YladaFlow,
  Frente,
  Funil,
  TipoFluxo,
  Finalidade,
  Nicho,
} from '@/types/ylada-flow'
import { FLUXOS_VENDAS } from '@/lib/ylada-flow/bibliotecas/vendas'
import { FLUXOS_RECRUTAMENTO } from '@/lib/ylada-flow/bibliotecas/recrutamento'
import { FLUXOS_CALCULADORAS } from '@/lib/ylada-flow/bibliotecas/calculadoras'
import { FLUXO_ESPELHO_CONVICCAO } from '@/lib/ylada-flow/bibliotecas/espelho/conviccao'

// -----------------------------------------------------
// 1. O índice da biblioteca (lead-facing) + o Espelho (Sujeito A, separado).
// -----------------------------------------------------

/** Fluxos voltados ao LEAD (Sujeito B). O Espelho NÃO entra aqui (é Sujeito A). */
export const BIBLIOTECA_YLADA: YladaFlow[] = [
  ...FLUXOS_VENDAS,
  ...FLUXOS_RECRUTAMENTO,
  ...FLUXOS_CALCULADORAS,
]

export const BIBLIOTECA_YLADA_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  BIBLIOTECA_YLADA.map((f) => [f.id, f]),
)

/** O Espelho (autodiagnóstico do dono). Recomendado só sob demanda explícita. */
export { FLUXO_ESPELHO_CONVICCAO } from '@/lib/ylada-flow/bibliotecas/espelho/conviccao'

// -----------------------------------------------------
// 2. Critério e resultado.
// -----------------------------------------------------

/** Papel do PROFISSIONAL (quem pede a recomendação) — enviesa a finalidade. */
export type PapelProfissional = 'liberal' | 'lider' | 'membro'

export interface CriterioRecomendacao {
  /** nicho do profissional (ex.: 'pro-lideres'). 'todos' = neutro; vê tudo. */
  nicho?: Nicho
  papel?: PapelProfissional
  /** texto livre do que ele quer ("um quiz pra falar de energia no instagram"). */
  intencao?: string
  /** palavras-chave já extraídas (tema, dor). */
  palavrasChave?: string[]
  /** filtros opcionais por dimensão. */
  finalidade?: Finalidade
  funil?: Funil
  frente?: Frente
  tipo?: TipoFluxo
  regiao?: string
  /** quantos devolver (default 3). */
  limite?: number
  /** incluir o Espelho (Sujeito A) no pool (default false). */
  incluirEspelho?: boolean
}

export interface RecomendacaoFluxo {
  fluxo: YladaFlow
  score: number
  motivos: string[]
}

// -----------------------------------------------------
// 3. Helpers determinísticos.
// -----------------------------------------------------

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos (diacríticos combinantes)
}

function tokens(s: string): string[] {
  return normalizar(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3)
}

const STOPWORDS = new Set([
  'que', 'com', 'para', 'pra', 'por', 'uma', 'meu', 'minha', 'mais', 'sobre',
  'quero', 'preciso', 'criar', 'gerar', 'link', 'links', 'fluxo', 'fluxos',
  'cliente', 'clientes', 'pessoa', 'pessoas', 'isso', 'esse', 'essa', 'dos', 'das',
])

/** Texto pesquisável do fluxo (nome + objetivo + gancho + tags + nicho). */
function haystack(f: YladaFlow): string {
  return tokens(
    [
      f.nome,
      f.objetivo,
      f.abertura?.gancho ?? '',
      f.tags.join(' '),
      f.dimensoes.nicho,
      f.dimensoes.finalidade,
    ].join(' '),
  ).join(' ')
}

// -----------------------------------------------------
// 4. O Recomendador (lookup determinístico).
// -----------------------------------------------------

/** Finalidade preferida pelo papel do profissional. */
function finalidadePreferidaPorPapel(papel?: PapelProfissional): Finalidade[] {
  switch (papel) {
    case 'lider':
    case 'membro':
      return ['recrutamento'] // construir/ativar rede
    case 'liberal':
      return ['diagnostico-servico', 'vendas'] // servir/vender
    default:
      return []
  }
}

/**
 * Recomenda fluxos da biblioteca curada por nicho/papel/intenção. Determinístico, sem
 * LLM nem DB. Devolve [] quando nada casa — sinal pro chamador cair na geração (interpret).
 */
export function recomendarFluxos(criterio: CriterioRecomendacao): RecomendacaoFluxo[] {
  const limite = criterio.limite ?? 3
  const pool = criterio.incluirEspelho || criterio.finalidade === 'autodiagnostico-conviccao'
    ? [...BIBLIOTECA_YLADA, FLUXO_ESPELHO_CONVICCAO]
    : BIBLIOTECA_YLADA

  const termos = [
    ...(criterio.palavrasChave ?? []),
    ...(criterio.intencao ? tokens(criterio.intencao) : []),
  ]
    .flatMap((t) => tokens(String(t)))
    .filter((t) => !STOPWORDS.has(t))
  const termosUnicos = Array.from(new Set(termos))

  const finalidadesPapel = finalidadePreferidaPorPapel(criterio.papel)

  const resultados: RecomendacaoFluxo[] = []

  for (const f of pool) {
    const motivos: string[] = []
    let score = 0
    const d = f.dimensoes

    // --- Nicho (filtro forte) ---
    if (criterio.nicho) {
      const nichoCrit = normalizar(criterio.nicho)
      const nichoFluxo = normalizar(d.nicho)
      if (nichoFluxo === nichoCrit) {
        score += 5
        motivos.push(`nicho ${d.nicho}`)
      } else if (nichoFluxo === 'todos' || nichoCrit === 'todos') {
        score += 2
        motivos.push('nicho neutro')
      } else {
        // nicho explícito e diferente → fora (a biblioteca migrada é mononicho hoje).
        continue
      }
    }

    // --- Finalidade ---
    if (criterio.finalidade) {
      if (d.finalidade === criterio.finalidade) {
        score += 4
        motivos.push(`finalidade ${d.finalidade}`)
      } else {
        continue // finalidade pedida explicitamente e não bate → fora
      }
    } else if (finalidadesPapel.includes(d.finalidade)) {
      score += 2
      motivos.push(`alinha ao papel ${criterio.papel}`)
    }

    // --- Outras dimensões (suaves) ---
    if (criterio.funil && d.funil === criterio.funil) {
      score += 2
      motivos.push(`funil ${d.funil}`)
    }
    if (criterio.frente && d.frente === criterio.frente) {
      score += 2
      motivos.push(`frente ${d.frente}`)
    }
    if (criterio.tipo && d.tipo === criterio.tipo) {
      score += 2
      motivos.push(`tipo ${d.tipo}`)
    }

    // --- Intenção / palavras-chave (lookup textual) ---
    if (termosUnicos.length > 0) {
      const hay = haystack(f)
      const tagsNorm = f.tags.map(normalizar)
      let hits = 0
      for (const t of termosUnicos) {
        if (tagsNorm.includes(t)) {
          score += 2 // tag bate forte
          hits++
        } else if (hay.includes(t)) {
          score += 1
          hits++
        }
      }
      if (hits > 0) motivos.push(`tema: ${termosUnicos.slice(0, 4).join(', ')}`)
    }

    if (score > 0) resultados.push({ fluxo: f, score, motivos })
  }

  // ordena por score desc, estável (mantém ordem da biblioteca no empate).
  return resultados
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r.score - a.r.score || a.i - b.i)
    .map(({ r }) => r)
    .slice(0, limite)
}

/** A melhor recomendação, ou null (→ chamador cai na geração). */
export function recomendarMelhorFluxo(criterio: CriterioRecomendacao): RecomendacaoFluxo | null {
  return recomendarFluxos({ ...criterio, limite: 1 })[0] ?? null
}

/** Explicação curta de por que um fluxo foi recomendado (para o Noel verbalizar). */
export function explicarRecomendacao(rec: RecomendacaoFluxo): string {
  const base = `Sugiro "${rec.fluxo.nome}"`
  return rec.motivos.length > 0 ? `${base} — ${rec.motivos.join('; ')}.` : `${base}.`
}

// -----------------------------------------------------
// 5. Ponte de compatibilidade com o recomendador LEGADO (não sobrescrever).
//    Traduz o vocabulário antigo (TipoLead/ObjetivoLink de links-recommender.ts) pro
//    critério do contrato, pra chamadas existentes migrarem sem reescrever a chamada.
// -----------------------------------------------------

export type TipoLeadLegado = 'frio' | 'morno' | 'quente'
export type ObjetivoLinkLegado = 'captacao' | 'diagnostico' | 'engajamento' | 'recrutamento'

export interface ContextoLegado {
  tipoLead?: TipoLeadLegado
  objetivo?: ObjetivoLinkLegado
  palavrasChave?: string[]
  nicho?: Nicho
  papel?: PapelProfissional
  limite?: number
}

function finalidadeDoObjetivoLegado(o?: ObjetivoLinkLegado): Finalidade | undefined {
  switch (o) {
    case 'recrutamento':
      return 'recrutamento'
    case 'diagnostico':
      return 'diagnostico-servico'
    // 'captacao' e 'engajamento' não fixam finalidade (servem por marketing).
    default:
      return undefined
  }
}

export function recomendarPorContextoLegado(ctx: ContextoLegado): RecomendacaoFluxo[] {
  const funil: Funil | undefined =
    ctx.tipoLead === 'quente' ? 'vendas' : ctx.tipoLead ? 'marketing' : undefined
  return recomendarFluxos({
    nicho: ctx.nicho,
    papel: ctx.papel,
    finalidade: finalidadeDoObjetivoLegado(ctx.objetivo),
    funil,
    palavrasChave: ctx.palavrasChave,
    limite: ctx.limite,
  })
}
