/**
 * Copy da recepção unificada do Noel na home (nome + tratamento Dr./Dra.).
 * Nome: `ylada_noel_profile.area_specific.nome` (onboarding) com fallback em `user_profiles.nome_completo`.
 */

const AUTO_DR_PROFESSIONS = new Set(['medico', 'odonto'])

function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function stripLeadingTitle(nome: string): string {
  return nome.replace(/^\s*(dr\.?|dra\.?|doutor|doutora)\s+/i, '').trim()
}

function hasLeadingProfessionalTitle(nome: string): boolean {
  const n = nome.trim()
  return /^(dra\.?|doutora)\b/i.test(n) || /^(dr(?!a)\.?|doutor)\b/i.test(n)
}

function normalizeGeneroParam(genero: string | null | undefined): 'm' | 'f' | null {
  const g = (genero || '').toLowerCase().trim()
  if (g === 'm' || g === 'masculino' || g === 'homem') return 'm'
  if (g === 'f' || g === 'feminino' || g === 'mulher') return 'f'
  return null
}

function inferWelcomeGenero(vocative: string | null, generoParam: string | null): 'm' | 'f' | 'neutral' {
  const g = normalizeGeneroParam(generoParam)
  if (g === 'm') return 'm'
  if (g === 'f') return 'f'
  if (vocative) {
    const v = vocative.trim()
    if (/^(dra\.?|doutora)\b/i.test(v)) return 'f'
    if (/^(dr(?!a)\.?|doutor)\b/i.test(v)) return 'm'
  }
  return 'neutral'
}

function welcomeSentence(kind: 'm' | 'f' | 'neutral'): string {
  if (kind === 'm') return 'Seja muito bem-vindo.'
  if (kind === 'f') return 'Seja muito bem-vinda.'
  return 'Seja muito bem-vindo(a).'
}

/**
 * Monta como chamamos a pessoa na recepção (inclui Dr./Dra. quando fizer sentido).
 */
export function formatReceptionVocativeName(
  rawNome: string | null | undefined,
  profession: string | null | undefined,
  generoParam: string | null
): string | null {
  const nome = normalizeSpaces(rawNome || '')
  if (nome.length < 2) return null

  if (hasLeadingProfessionalTitle(nome)) {
    return nome
  }

  const prof = (profession || '').toLowerCase().trim()
  if (AUTO_DR_PROFESSIONS.has(prof)) {
    const g = normalizeGeneroParam(generoParam)
    const core = stripLeadingTitle(nome) || nome
    if (g === 'f') return `Dra. ${core}`
    if (g === 'm') return `Dr. ${core}`
  }

  return nome
}

const NOEL_RECEPTION_REST = 'Eu sou Noel, estou aqui para te ajudar a explicar menos e vender mais.'

/**
 * Parágrafo completo da recepção (com ou sem nome).
 */
export function buildNoelUnifiedReceptionMessage(generoParam: string | null, vocative: string | null): string {
  const kind = inferWelcomeGenero(vocative, generoParam)
  const welcome = welcomeSentence(kind)
  if (vocative) {
    const head = welcome.endsWith('.') ? welcome.slice(0, -1) : welcome
    return `${head}, ${vocative}.\n\n${NOEL_RECEPTION_REST}`
  }
  return `${welcome}\n\n${NOEL_RECEPTION_REST}`
}

export function noelUnifiedReceptionWelcome(generoParam: string | null): string {
  return buildNoelUnifiedReceptionMessage(generoParam, null)
}
