/**
 * Biblioteca de fluxos do vertical Coach de bem-estar.
 *
 * Espelha os mesmos fluxos do Pro Líderes, removendo apenas os dois que
 * têm referências explícitas a produtos Herbalife:
 *   - 'ja-usa-energia-acelera'   (produto de energia MLM)
 *   - 'ja-consome-bem-estar'     (produto de bem-estar MLM)
 *
 * Os links gerados apontam para /pt/coach-bem-estar/{userSlug}/{toolSlug}
 * em vez de /pt/wellness/ — mesmo conteúdo, branding independente.
 */
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import { getFluxoRecrutamentoById } from '@/lib/ylada-flow/fluxos-recrutamento'
import { getProLideresSalesPresetFluxos } from '@/lib/pro-lideres/pro-lideres-sales-preset-fluxos'
import { proLideresRecruitmentQuizFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-quiz-fluxos'
import { PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS } from '@/lib/pro-lideres/pro-lideres-recruitment-unified-perguntas'
import { getCoachBemEstarIntroObjetivo } from '@/lib/coach-bem-estar/coach-bem-estar-fluxo-copy'

/** IDs de recrutamento com linguagem Herbalife — excluídos do Coach de bem-estar. */
const RECRUTAMENTO_IDS_EXCLUIDOS = new Set([
  'ja-usa-energia-acelera',
  'ja-consome-bem-estar',
])

/** IDs clássicos de recrutamento (mesma lista do Pro Líderes, menos Herbalife). */
const COACH_BEM_ESTAR_RECRUITMENT_CLASSIC_IDS = [
  'renda-extra-imediata',
  'transformar-consumo-renda',
  'maes-trabalhar-casa',
  'perderam-emprego-transicao',
  'cansadas-trabalho-atual',
  'trabalhar-apenas-links',
  'ja-tentaram-outros-negocios',
  'querem-trabalhar-digital',
  'ja-empreendem',
  'querem-emagrecer-renda',
  'boas-venda-comercial',
  'jovens-empreendedores',
] as const

function upgradeFluxoForCoachBemEstar(fluxo: FluxoCliente): FluxoCliente {
  return {
    ...fluxo,
    perguntas: PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS,
    objetivo: getCoachBemEstarIntroObjetivo(fluxo),
    cta: 'Quero conversar com quem me enviou o link',
    diagnostico: {
      ...fluxo.diagnostico,
      descricao: fluxo.diagnostico.descricao,
      beneficios: fluxo.diagnostico.beneficios.filter(
        (b) => !/noel|pro.?líderes|fechamento|bebidas funcionais/i.test(b)
      ),
    },
    tags: Array.from(new Set([...fluxo.tags, 'coach-bem-estar', 'recrutamento'])),
  }
}

/**
 * Fluxos de VENDAS para o Coach de bem-estar.
 * Inclui todos os 21 fluxos de clientes (energia, digestão, mente, rotina)
 * + calculadoras básicas (água, calorias, proteína).
 */
export function getCoachBemEstarSalesFluxos(): FluxoCliente[] {
  return getProLideresSalesPresetFluxos()
}

/**
 * Fluxos de RECRUTAMENTO para o Coach de bem-estar.
 * 15 fluxos (17 do Pro Líderes - 2 Herbalife).
 * Quizzes de entrada: Ganhos · Potencial · Propósito.
 * Perfis clássicos: renda extra, mães em casa, perderam emprego, etc.
 */
export function getCoachBemEstarRecruitmentFluxos(): FluxoCliente[] {
  const classicFluxos = COACH_BEM_ESTAR_RECRUITMENT_CLASSIC_IDS.map((id) => getFluxoRecrutamentoById(id))
    .filter((fluxo): fluxo is FluxoCliente => Boolean(fluxo))
    .filter((f) => !RECRUTAMENTO_IDS_EXCLUIDOS.has(f.id))
    .map(upgradeFluxoForCoachBemEstar)

  const quizFluxos = proLideresRecruitmentQuizFluxos.map(upgradeFluxoForCoachBemEstar)
  return [...quizFluxos, ...classicFluxos]
}
