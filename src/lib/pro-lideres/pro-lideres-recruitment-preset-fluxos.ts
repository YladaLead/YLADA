import type { FluxoCliente } from '@/types/wellness-system'
import { getFluxoRecrutamentoById } from '@/lib/wellness-system/fluxos-recrutamento'
import { proLideresRecruitmentQuizFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-quiz-fluxos'

/**
 * Presets de Recrutamento Pro Líderes:
 * - 3 quizzes de entrada;
 * - fluxos clássicos de recrutamento;
 * - copy atualizada com posicionamento das novas inteligências Noel.
 */
const PRO_LIDERES_RECRUITMENT_CLASSIC_IDS = [
  'renda-extra-imediata',
  'maes-trabalhar-casa',
  'perderam-emprego-transicao',
  'transformar-consumo-renda',
  'jovens-empreendedores',
  'ja-consome-bem-estar',
  'trabalhar-apenas-links',
  'ja-usa-energia-acelera',
  'cansadas-trabalho-atual',
  'ja-tentaram-outros-negocios',
  'querem-trabalhar-digital',
  'ja-empreendem',
  'querem-emagrecer-renda',
  'boas-venda-comercial',
] as const

function upgradeFluxoForNoel(fluxo: FluxoCliente): FluxoCliente {
  const objetivosNoel = `${fluxo.objetivo} Com leitura estratégica das inteligências Noel para priorizar o próximo passo comercial.`
  const descricaoNoel = `${fluxo.diagnostico.descricao} A análise Noel ajuda a transformar esse perfil em plano de ação simples e rápido.`
  const ctaNoel = 'Quero conhecer novas oportunidades'

  return {
    ...fluxo,
    objetivo: objetivosNoel,
    diagnostico: {
      ...fluxo.diagnostico,
      descricao: descricaoNoel,
      beneficios: [...fluxo.diagnostico.beneficios, 'Direcionamento com inteligência Noel para abordagem e fechamento'],
      mensagemPositiva: `${fluxo.diagnostico.mensagemPositiva} Com a inteligência Noel, o próximo passo fica mais claro e personalizado.`,
    },
    cta: ctaNoel,
    tags: Array.from(
      new Set([...fluxo.tags, 'pro-lideres', 'noel', 'inteligencia-noel', 'recrutamento-moderno', 'negocio'])
    ),
  }
}

export function getProLideresRecruitmentPresetFluxos(): FluxoCliente[] {
  const classicFluxos = PRO_LIDERES_RECRUITMENT_CLASSIC_IDS.map((id) => getFluxoRecrutamentoById(id))
    .filter((fluxo): fluxo is FluxoCliente => Boolean(fluxo))
    .map(upgradeFluxoForNoel)

  const quizFluxosNoel = proLideresRecruitmentQuizFluxos.map(upgradeFluxoForNoel)
  return [...quizFluxosNoel, ...classicFluxos]
}
