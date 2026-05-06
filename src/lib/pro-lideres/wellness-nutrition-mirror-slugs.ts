/**
 * Slugs já cobertos por presets TS (fluxos clientes/recrutamento) ou HYPE —
 * não gerar de novo a partir de `templates_nutrition`.
 */
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { WELLNESS_CALCULADORAS_BASICAS_PRESET_SLUGS } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'
import { WELLNESS_HYPE_MEUS_LINKS } from '@/lib/wellness/wellness-hype-meus-links'

/** Mesmo algoritmo que `gerarSlugFluxo` em Meus Links Wellness (URLs de fluxo TS). */
export function gerarSlugFluxoWellnessNome(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const TEMPLATES_DESCARTADOS = new Set(['quiz-interativo', 'quiz-interativo-nutri'])

/**
 * Mesmos slugs dos 3 quizzes no Meus Links Wellness; no Pro Líderes já existem
 * os presets `quiz-recrut-*` — não duplicar a partir de `templates_nutrition`.
 */
const WELLNESS_QUIZ_RECRUTAMENTO_SLUGS_SEM_ESPELHO_BD = new Set([
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
])

/** HOM fica só no Wellness por enquanto — não espelhar em Pro Líderes. */
const SLUGS_PRO_LIDERES_EXCLUIDOS_EXPLICITO = new Set(['hom'])

export function buildWellnessNutritionMirrorExcludedSlugs(): Set<string> {
  const s = new Set<string>()
  for (const x of TEMPLATES_DESCARTADOS) s.add(x)
  WELLNESS_QUIZ_RECRUTAMENTO_SLUGS_SEM_ESPELHO_BD.forEach((x) => s.add(x))
  SLUGS_PRO_LIDERES_EXCLUIDOS_EXPLICITO.forEach((x) => s.add(x))

  for (const f of fluxosClientes) {
    s.add(f.id.toLowerCase())
    s.add(gerarSlugFluxoWellnessNome(f.nome))
  }
  for (const f of fluxosRecrutamento) {
    s.add(f.id.toLowerCase())
    s.add(gerarSlugFluxoWellnessNome(f.nome))
  }
  for (const h of WELLNESS_HYPE_MEUS_LINKS) {
    s.add(h.slug.toLowerCase())
  }
  for (const slug of WELLNESS_CALCULADORAS_BASICAS_PRESET_SLUGS) {
    s.add(slug.toLowerCase())
  }
  return s
}
