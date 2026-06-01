/**
 * Coach de bem-estar — helpers de copy pública (delegam ao módulo compartilhado).
 */
import type { FluxoCliente } from '@/types/wellness-system'
import {
  getRecruitmentFluxoPublicIntro,
  isCoachFacingRecruitmentObjetivo,
} from '@/lib/recruitment-fluxo-public-intro'

export { RECRUITMENT_FLUXO_PUBLIC_INTRO as COACH_BEM_ESTAR_INTRO_OBJETIVO } from '@/lib/recruitment-fluxo-public-intro'

export function isCoachFacingObjetivo(text: string): boolean {
  return isCoachFacingRecruitmentObjetivo(text)
}

export function getCoachBemEstarIntroObjetivo(fluxo: FluxoCliente): string {
  return getRecruitmentFluxoPublicIntro(fluxo.id, {
    nome: fluxo.nome,
    fallbackObjetivo: fluxo.objetivo,
  })
}

export function getCoachBemEstarFluxoCategoria(
  fluxo: FluxoCliente
): 'recrutamento' | 'vendas' {
  if (fluxo.tags?.includes('recrutamento') || fluxo.id.startsWith('quiz-recrut-')) {
    return 'recrutamento'
  }
  if (
    fluxo.id.startsWith('calc-') ||
    fluxo.tags?.some((t) => ['vendas', 'clientes', 'calculadora'].includes(t))
  ) {
    return 'vendas'
  }
  const vendasIds = new Set([
    'energia-matinal',
    'energia-tarde',
    'troca-cafe',
    'anti-cansaco',
    'rotina-puxada',
    'foco-concentracao',
    'motoristas',
    'avaliacao-perfil-metabolico',
    'barriga-pesada',
    'retencao-inchaço',
    'desconforto-pos-refeicao',
    'inchaço-manha',
    'ansiedade-doce',
    'mente-cansada',
    'falta-disposicao-treinar',
    'trabalho-noturno',
    'rotina-estressante',
    'maes-ocupadas',
    'fim-tarde-sem-energia',
    'sedentarismo',
    'calc-hidratacao',
    'calc-proteina',
    'calc-calorias',
    'calc-imc',
  ])
  return vendasIds.has(fluxo.id) ? 'vendas' : 'recrutamento'
}
