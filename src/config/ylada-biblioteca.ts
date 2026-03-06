/**
 * Configuração da Biblioteca de ferramentas e links (YLADA).
 * Estrutura: Quizzes | Calculadoras | Links prontos, filtrados por segmento e tema.
 * Temas = Top 12 estratégicos (energia, intestino, metabolismo, etc.).
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 * @see src/config/ylada-pilares-temas.ts
 */

import { TEMAS_ESTRATEGICOS, type PilarCode } from './ylada-pilares-temas'

export type BibliotecaTipo = 'quiz' | 'calculadora' | 'link'

export type BibliotecaSegmentCode =
  | 'nutrition'
  | 'nutrition_vendedor'
  | 'medicine'
  | 'psychology'
  | 'dentistry'
  | 'aesthetics'
  | 'fitness'

/** Segmentos para filtro da biblioteca (alinhado com diagnosis-segment). */
export const BIBLIOTECA_SEGMENTOS: { value: BibliotecaSegmentCode; label: string }[] = [
  { value: 'nutrition', label: 'Nutrição' },
  { value: 'nutrition_vendedor', label: 'Vendedores Nutracêuticos e suplementos' },
  { value: 'medicine', label: 'Médicos' },
  { value: 'psychology', label: 'Psicólogos e psicanalistas' },
  { value: 'dentistry', label: 'Odontologia' },
  { value: 'aesthetics', label: 'Estética' },
  { value: 'fitness', label: 'Fitness' },
]

/** Top 12 temas estratégicos — filtro universal da biblioteca (não depende de segmento). */
export const BIBLIOTECA_TEMAS = TEMAS_ESTRATEGICOS.map((t) => ({
  value: t.value,
  label: t.label,
}))

/** @deprecated Use BIBLIOTECA_TEMAS. Mantido para compatibilidade. */
export const BIBLIOTECA_TEMAS_POR_SEGMENTO: Record<BibliotecaSegmentCode, string[]> = {
  nutrition: BIBLIOTECA_TEMAS.map((t) => t.value),
  nutrition_vendedor: BIBLIOTECA_TEMAS.map((t) => t.value),
  medicine: BIBLIOTECA_TEMAS.map((t) => t.value),
  psychology: BIBLIOTECA_TEMAS.map((t) => t.value),
  dentistry: BIBLIOTECA_TEMAS.map((t) => t.value),
  aesthetics: BIBLIOTECA_TEMAS.map((t) => t.value),
  fitness: BIBLIOTECA_TEMAS.map((t) => t.value),
}

/** Mapeamento profession → segmento da biblioteca (para "(seu perfil)"). */
const PROFESSION_TO_BIBLIOTECA: Record<string, BibliotecaSegmentCode> = {
  vendedor_suplementos: 'nutrition_vendedor',
  vendedor_cosmeticos: 'aesthetics',
  medico: 'medicine',
  cardiologista: 'medicine',
  endocrinologista: 'medicine',
  gastroenterologista: 'medicine',
  psi: 'psychology',
  psicanalise: 'psychology',
  terapeuta: 'psychology',
  psiquiatra: 'psychology',
  odonto: 'dentistry',
  nutricionista: 'nutrition',
  estetica: 'aesthetics',
  personal_trainer: 'fitness',
  coach_fitness: 'fitness',
  coach: 'fitness',
  vendedor_servicos: 'nutrition_vendedor',
  vendedor_produtos: 'nutrition_vendedor',
  vendedor: 'nutrition_vendedor',
  outro: 'nutrition',
}

/** Deriva segmento da biblioteca a partir do perfil (profession). */
export function getBibliotecaSegmentFromProfile(
  profession: string | null | undefined
): BibliotecaSegmentCode {
  const prof = (profession || '').toLowerCase().trim()
  return PROFESSION_TO_BIBLIOTECA[prof] ?? 'nutrition'
}

/** Tipos de ferramenta na biblioteca. */
export const BIBLIOTECA_TIPOS: { value: BibliotecaTipo; label: string; description: string }[] = [
  { value: 'quiz', label: 'Quizzes', description: 'Perguntas que geram diagnóstico personalizado' },
  { value: 'calculadora', label: 'Calculadoras', description: 'Ferramentas que calculam projeção ou resultado' },
  { value: 'link', label: 'Links prontos', description: 'Links completos prontos para usar' },
]

/** Origem do conteúdo do item da biblioteca. */
export type BibliotecaSourceType =
  | 'ylada_template'
  | 'wellness_fluxo'
  | 'wellness_template'
  | 'nutri_quiz'
  | 'custom'

/** Item da biblioteca (espelha ylada_biblioteca_itens). */
export interface BibliotecaItem {
  id: string
  tipo: BibliotecaTipo
  /** Segmentos para os quais o item é relevante (um item pode aparecer em vários). */
  segment_codes: BibliotecaSegmentCode[]
  /** Tema (Top 12: energia, intestino, metabolismo, etc.). */
  tema: string
  titulo: string
  description?: string
  /** Origem do conteúdo. */
  source_type: BibliotecaSourceType
  /** ID do recurso de origem (UUID ou string). */
  source_id?: string | null
  /** Template YLADA com conteúdo (perguntas copiadas da Nutri). Null = usa flow + getQuizByTema. */
  template_id?: string | null
  flow_id?: string | null
  architecture?: string | null
  /** Pilar universal (energia, metabolismo, digestao, mente, habitos). */
  pilar?: PilarCode | null
  meta?: Record<string, unknown>
  sort_order: number
  active: boolean
  created_at?: string
  updated_at?: string
}
