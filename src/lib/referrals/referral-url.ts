/**
 * URL do loop (Spec_Loop_KFactor §5.1/§5.2). Helpers puros, sem I/O — fáceis de
 * testar e reusáveis no selo (cliente), na página /criar e no cadastro.
 */

/** Rota da página dedicada do Caminho B ("crie o seu"). Pública, sem prefixo de idioma. */
export const REFERRAL_LANDING_PATH = '/criar'

/** Nome do parâmetro de indicação na URL. Nunca carrega dado pessoal (LGPD): só o código. */
export const REFERRAL_PARAM = 'ref'

/** Nome do parâmetro de origem: de onde a pessoa veio (muda só a headline). */
export const REFERRAL_SOURCE_PARAM = 'source'

export type ReferralSource = 'diagnostico' | 'conteudo'

const VALID_SOURCES: readonly ReferralSource[] = ['diagnostico', 'conteudo']

function isReferralSource(value: string | null | undefined): value is ReferralSource {
  return !!value && (VALID_SOURCES as readonly string[]).includes(value)
}

/**
 * Monta o destino do selo: a página dedicada carregando ?ref e ?source.
 * Sem `code`, devolve só a página com a origem (fallback compatível, sem ref).
 * @example buildReferralLandingUrl({ code: 'a3f9k2', source: 'diagnostico' })
 *          // '/criar?ref=a3f9k2&source=diagnostico'
 */
export function buildReferralLandingUrl(input: {
  code?: string | null
  source?: ReferralSource
}): string {
  const params = new URLSearchParams()
  if (input.code) params.set(REFERRAL_PARAM, input.code)
  params.set(REFERRAL_SOURCE_PARAM, input.source ?? 'diagnostico')
  return `${REFERRAL_LANDING_PATH}?${params.toString()}`
}

/**
 * Encaminha o ref/source preservados para o cadastro existente. Não recria cadastro.
 * @example buildSignupUrlWithReferral({ code: 'a3f9k2', area: 'estetica' })
 *          // '/pt/cadastro?area=estetica&ref=a3f9k2'
 */
export function buildSignupUrlWithReferral(input: {
  code?: string | null
  area?: string | null
}): string {
  const params = new URLSearchParams()
  if (input.area) params.set('area', input.area)
  if (input.code) params.set(REFERRAL_PARAM, input.code)
  const query = params.toString()
  return query ? `/pt/cadastro?${query}` : '/pt/cadastro'
}

// ─── Porta única / fluxo de entrada ─────────────────────────────────────────

export type PortaEntradaDestino = 'pt' | 'descubra'

/** Parâmetro de URL que indica qual passo inicial mostrar na PortaUnica. */
export const PORTA_START_PARAM = 'start'

/** Valor que faz a PortaUnica começar direto no desafio picker (pula o hero). */
export const PORTA_START_DESAFIO = 'desafio'

/**
 * Entrada do fluxo da porta (hero + desafio → devolutiva → cadastro).
 * Preserva ?ref do loop. Porta 1 absorve em `/pt`; senão a rota dedicada `/descubra`.
 * @example buildPortaEntradaUrlWithReferral({ code: 'a3f9k2', destino: 'descubra', source: 'diagnostico' })
 *          // '/descubra?ref=a3f9k2&source=diagnostico'
 */
export function buildPortaEntradaUrlWithReferral(input: {
  code?: string | null
  destino: PortaEntradaDestino
  source?: ReferralSource
  /** Porta 2 (`/criar`): pula o hero e abre no picker do desafio. */
  start?: typeof PORTA_START_DESAFIO
}): string {
  const params = new URLSearchParams()
  if (input.code) params.set(REFERRAL_PARAM, input.code)
  params.set(REFERRAL_SOURCE_PARAM, input.source ?? 'diagnostico')
  if (input.start === PORTA_START_DESAFIO) params.set(PORTA_START_PARAM, PORTA_START_DESAFIO)
  const base = input.destino === 'pt' ? '/pt' : '/descubra'
  const query = params.toString()
  return query ? `${base}?${query}` : base
}

/** Lê ref/source de uma querystring (ex.: window.location.search). Tolerante a lixo. */
export function parseReferralParams(search: string): {
  ref: string | null
  source: ReferralSource
} {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const raw = params.get(REFERRAL_PARAM)?.trim() ?? null
  const sourceRaw = params.get(REFERRAL_SOURCE_PARAM)?.trim()
  return {
    ref: raw && raw.length > 0 ? raw : null,
    source: isReferralSource(sourceRaw) ? sourceRaw : 'diagnostico',
  }
}
