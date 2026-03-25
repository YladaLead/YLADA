/**
 * Entrada pública por segmento:
 * - Marketing PT (raiz): / e /pt redirecionam para /pt/segmentos (escolher segmento). Fluxos progressivos em /pt/{area}.
 * - Rotas *v2 redirecionam para /pt/{area} (landing minimal descontinuada).
 * - /pt/{area} → fluxo progressivo (estética, nutri, odonto, nutra, psi, med, psicanalise, perfumaria, coach, fitness); cadastro ?area=
 * - /pt/{area}/como-funciona → landing longa (quiz, seções)
 */

export const AREA_LONG_LANDING_SLUG = 'como-funciona' as const

export function areaLongLandingPathPt(areaId: string): string {
  return `/pt/${areaId}/${AREA_LONG_LANDING_SLUG}`
}

/** True quando a rota é a landing longa institucional (auth redirect, loading). */
export function isPtAreaComoFuncionaPage(pathname: string | null | undefined, areaId: string): boolean {
  if (!pathname) return false
  const esc = areaId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^/pt/${esc}/${AREA_LONG_LANDING_SLUG}/?(\\?|$)`).test(pathname)
}

export interface AreaMinimalLandingProps {
  segmentBadge: string
  headline: string
  subline: string
  primaryHref: string
  primaryLabel: string
  proofLine?: string
}

/** Copy da entrada minimal por id de área (grade em /pt). */
export const AREA_MINIMAL_LANDING_PROPS: Record<string, AreaMinimalLandingProps> = {
  nutri: {
    segmentBadge: 'Nutrição',
    headline: 'Explique menos no primeiro contato. Venda mais o valor do acompanhamento.',
    subline: 'O mesmo fluxo YLADA focado em nutricionistas: curiosos filtrados, conversas mais objetivas.',
    primaryHref: '/pt/cadastro?area=nutri',
    primaryLabel: 'Começar grátis',
  },
  psi: {
    segmentBadge: 'Psicologia',
    headline: 'Conversas que não evoluem? Qualifique quem chega no WhatsApp.',
    subline:
      'Diagnósticos ajudam a pessoa a refletir antes da primeira mensagem. Você fala com quem já tem mais contexto.',
    primaryHref: '/pt/cadastro?area=psi',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  psicanalise: {
    segmentBadge: 'Psicanálise',
    headline: 'Menos explicação no primeiro contato. Analisandos mais preparados.',
    subline:
      'Cadastro com perfil Psicanálise na plataforma; a landing mostra o foco no setting analítico.',
    primaryHref: '/pt/cadastro?area=psicanalise',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  odonto: {
    segmentBadge: 'Odontologia',
    headline: 'Explique menos no WhatsApp. Traga pacientes mais alinhados à avaliação.',
    subline: 'Diagnósticos mostram valor antes da cadeira. Menos curiosos, mais intenção.',
    primaryHref: '/pt/cadastro?area=odonto',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  med: {
    segmentBadge: 'Medicina',
    headline: 'Explique menos na triagem. Convide mais quem valoriza a consulta.',
    subline: 'Diagnósticos e links inteligentes para médicos: pacientes chegam mais preparados no WhatsApp.',
    primaryHref: '/pt/cadastro?area=med',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  coach: {
    segmentBadge: 'Coach',
    headline: 'Conversas que não viram sessão? Atraia clientes mais preparados.',
    subline:
      'Diagnósticos filtram curiosos e deixam o cliente chegar com clareza. Bem-estar, carreira ou vida.',
    primaryHref: '/pt/cadastro?area=coach',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  estetica: {
    segmentBadge: 'Estética',
    headline: 'Explique menos no primeiro contato. Encha sua agenda.',
    subline:
      'Diagnósticos que filtram curiosos e atraem clientes prontos para agendar. Cabelo, pele, unhas, maquiagem.',
    primaryHref: '/pt/cadastro?area=estetica',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  fitness: {
    segmentBadge: 'Fitness',
    headline: 'Menos “só uma dúvida”. Mais alunos com intenção de treinar com você.',
    subline: 'Diagnósticos qualificam objetivos e rotina antes do primeiro contato no WhatsApp.',
    primaryHref: '/pt/cadastro?area=fitness',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  nutra: {
    segmentBadge: 'Nutra',
    headline: 'Muita conversa, pouca venda? Qualifique antes do WhatsApp.',
    subline:
      'Diagnósticos para quem vende suplementos. Cliente chega mais decidido a comprar, você indica com segurança.',
    primaryHref: '/pt/cadastro?area=nutra',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
  perfumaria: {
    segmentBadge: 'Perfumaria',
    headline: 'Indicações que não viram compra? Traga quem já refletiu sobre fragrância.',
    subline: 'Diagnósticos ajudam o cliente a entender preferências antes da conversa com você.',
    primaryHref: '/pt/cadastro?area=perfumaria',
    primaryLabel: 'Começar grátis',
    proofLine: '+3.000 profissionais já testaram o YLADA',
  },
}
