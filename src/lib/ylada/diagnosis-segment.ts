/**
 * Mapeamento profession/segment → segment_code para o motor de diagnóstico.
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 */

export type DiagnosisSegmentCode = 'wellness' | 'nutrition' | 'dentistry' | 'aesthetics' | 'fitness'

/** Mapeamento profession → segment_code (quando segment não define). */
const PROFESSION_TO_SEGMENT: Record<string, DiagnosisSegmentCode> = {
  odonto: 'dentistry',
  estetica: 'aesthetics',
  nutricionista: 'nutrition',
  vendedor_suplementos: 'nutrition',
  vendedor_cosmeticos: 'aesthetics',
  medico: 'wellness',
  cardiologista: 'wellness',
  psiquiatra: 'wellness',
  psi: 'wellness',
  psicanalise: 'wellness',
  terapeuta: 'wellness',
  coach: 'wellness',
  personal_trainer: 'fitness',
  coach_fitness: 'fitness',
  endocrinologista: 'nutrition',
  gastroenterologista: 'nutrition',
  vendedor_servicos: 'wellness',
  vendedor_produtos: 'wellness',
  vendedor: 'wellness',
  outro: 'wellness',
}

/** Mapeamento segment (rota/área) → segment_code. */
const SEGMENT_TO_DIAGNOSIS: Record<string, DiagnosisSegmentCode> = {
  odonto: 'dentistry',
  nutra: 'nutrition',
  ylada: 'wellness', // fallback; profession pode refinar
  psi: 'wellness',
  psicanalise: 'wellness',
  coach: 'wellness',
  seller: 'wellness',
}

/** Detecta segment_code por tema (fallback quando profession/segment ausentes). */
function inferFromTheme(themeRaw: string): DiagnosisSegmentCode | null {
  const t = (themeRaw || '').toLowerCase()
  if (/cárie|cáries|bucal|dentário|dental|odontológico|escovação|gengiva|dentista/.test(t)) return 'dentistry'
  if (/pele|skincare|estética|retenção|rejuvenescimento|manchas|flacidez|autocuidado/.test(t)) return 'aesthetics'
  if (/emagrecimento|intestino|metabolismo|alimentação|hidratação|nutrição/.test(t)) return 'nutrition'
  if (/treino|fitness|condicionamento|disposição|atividade física/.test(t)) return 'fitness'
  return null
}

/**
 * Deriva segment_code para o motor de diagnóstico.
 * Ordem: 1) profession, 2) segment, 3) theme_raw (fallback).
 */
export function getDiagnosisSegmentFromProfile(
  profession: string | null | undefined,
  segment: string | null | undefined,
  themeRaw?: string | null
): DiagnosisSegmentCode {
  const prof = (profession || '').toLowerCase().trim()
  const seg = (segment || '').toLowerCase().trim()

  if (prof && PROFESSION_TO_SEGMENT[prof]) return PROFESSION_TO_SEGMENT[prof]
  if (seg && SEGMENT_TO_DIAGNOSIS[seg]) return SEGMENT_TO_DIAGNOSIS[seg]
  if (themeRaw) {
    const fromTheme = inferFromTheme(themeRaw)
    if (fromTheme) return fromTheme
  }
  return 'wellness'
}
