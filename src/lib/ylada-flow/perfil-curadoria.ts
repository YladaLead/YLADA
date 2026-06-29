/**
 * Curadoria dos diagnósticos da página de entrada `/[perfil]` (porta 3).
 * Regra (decidida 29/06): o dono MARCA e ORDENA os fluxos em destaque;
 * se ele não marcar nenhum, cai num fallback automático (mais recentes, poucos).
 * Lógica pura (sem DB/LLM) → testável em `perfil-curadoria.casos.ts`.
 * @see blueprint-plataforma/Perfil_Nu_Porta3_Build.md
 */

/** Quantos fluxos a página mostra quando o dono não marcou nenhum em destaque. */
export const LIMITE_FALLBACK_FLUXOS = 6

export type CuradoriaMeta = {
  /** `config_json.meta.perfil_destaque === true` → entra na vitrine curada. */
  destaque: boolean
  /** `config_json.meta.perfil_ordem` → ordem crescente entre os marcados. */
  ordem: number | null
}

export type FluxoCandidato = {
  slug: string
  titulo: string
  subtitulo: string | null
  destaque: boolean
  ordem: number | null
  /** ISO de `created_at`; desempata e ordena o fallback. */
  criadoEm: string
}

export type FluxoCurado = {
  slug: string
  titulo: string
  subtitulo: string | null
}

/** Lê os marcadores de curadoria de `config_json.meta` (tolerante a forma). */
export function extrairMetaCuradoria(configJson: unknown): CuradoriaMeta {
  const meta = lerMeta(configJson)
  const destaque = meta.perfil_destaque === true
  const ordem = typeof meta.perfil_ordem === 'number' && Number.isFinite(meta.perfil_ordem)
    ? meta.perfil_ordem
    : null
  return { destaque, ordem }
}

function lerMeta(configJson: unknown): { perfil_destaque?: unknown; perfil_ordem?: number } {
  if (!configJson || typeof configJson !== 'object') return {}
  const meta = (configJson as { meta?: unknown }).meta
  if (!meta || typeof meta !== 'object') return {}
  return meta as { perfil_destaque?: unknown; perfil_ordem?: number }
}

/** Mais recente primeiro (ISO desc); usado no fallback e como desempate. */
function maisRecentePrimeiro(a: FluxoCandidato, b: FluxoCandidato): number {
  return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
}

/** Entre os marcados: ordem crescente; sem ordem vai pro fim; empate por recência. */
function porOrdemDeDestaque(a: FluxoCandidato, b: FluxoCandidato): number {
  const oa = a.ordem ?? Number.POSITIVE_INFINITY
  const ob = b.ordem ?? Number.POSITIVE_INFINITY
  if (oa !== ob) return oa - ob
  return maisRecentePrimeiro(a, b)
}

function paraCurado({ slug, titulo, subtitulo }: FluxoCandidato): FluxoCurado {
  return { slug, titulo, subtitulo }
}

/**
 * Curadoria final: marcados (ordenados) quando existirem; senão os N mais recentes.
 * Nunca devolve a lista crua inteira — a página é vitrine, não despejo.
 */
export function curarFluxos(
  candidatos: FluxoCandidato[],
  limiteFallback: number = LIMITE_FALLBACK_FLUXOS
): FluxoCurado[] {
  const marcados = candidatos.filter((c) => c.destaque)
  if (marcados.length > 0) {
    return [...marcados].sort(porOrdemDeDestaque).map(paraCurado)
  }
  return [...candidatos].sort(maisRecentePrimeiro).slice(0, limiteFallback).map(paraCurado)
}
