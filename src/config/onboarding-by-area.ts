/**
 * Copy do onboarding por área.
 * Garante que cada área tenha linguagem e exemplos adequados ao seu público.
 * @see src/components/ylada/OnboardingPageContent.tsx
 */

import type { OnboardingAreaCodigo } from '@/components/ylada/OnboardingPageContent'

export interface OnboardingAreaCopy {
  /** Título principal (ex.: "Bem-vindo(a) à YLADA Estética") */
  welcomeTitle: (areaLabel: string) => string
  /** Subtítulo de valor (ex.: "Aqui você não precisa fazer seu marketing sozinho(a).") */
  valueSubtitle: string
  /** Termo para quem o profissional atende: clientes, pacientes, alunos */
  publicoTerm: string
  /** Lista de benefícios (3 itens) */
  benefits: [string, string, string]
  /** Placeholder do campo nome (ex.: "Ex.: Dra. Ana Souza") */
  nomePlaceholder: string
  /** Texto antes do CTA (ex.: "Agora vamos gerar seu Diagnóstico Estratégico.") */
  ctaIntro: string
  /** Prova social padrão (fallback se a página não passar proofText) */
  proofText: string
}

const DEFAULT_COPY: OnboardingAreaCopy = {
  welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
  valueSubtitle: 'Aqui você não precisa fazer seu marketing sozinho(a).',
  publicoTerm: 'clientes',
  benefits: [
    'atrair clientes realmente interessados',
    'entender melhor quem chega até você',
    'transformar conversas em atendimentos',
  ],
  nomePlaceholder: 'Ex.: Seu nome completo',
  ctaIntro: 'Agora vamos gerar seu Diagnóstico Estratégico.',
  proofText: 'Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional.',
}

const ONBOARDING_BY_AREA: Partial<Record<OnboardingAreaCodigo, Partial<OnboardingAreaCopy>>> = {
  med: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing médico sozinho(a).',
    publicoTerm: 'pacientes',
    benefits: [
      'atrair pacientes realmente interessados',
      'entender melhor quem chega até sua consulta',
      'transformar contatos em agendamentos',
    ],
    nomePlaceholder: 'Ex.: Dra. Ana Souza',
    proofText: 'Mais de 1.200 médicos já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  odonto: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing odontológico sozinho(a).',
    publicoTerm: 'pacientes',
    benefits: [
      'atrair pacientes realmente interessados',
      'entender melhor quem chega até seu consultório',
      'transformar contatos em agendamentos',
    ],
    nomePlaceholder: 'Ex.: Dr. João Silva',
    proofText: 'Mais de 1.200 dentistas já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  psi: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados em terapia',
      'entender melhor quem chega até você',
      'transformar conversas em primeiras sessões',
    ],
    nomePlaceholder: 'Ex.: Maria Santos',
    proofText: 'Mais de 1.200 psicólogos já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  psicanalise: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados em análise',
      'entender melhor quem chega até você',
      'transformar conversas em primeiras sessões',
    ],
    nomePlaceholder: 'Ex.: Dr. Carlos Mendes',
    proofText: 'Mais de 1.200 psicanalistas já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  estetica: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de estética sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados nos seus procedimentos',
      'entender melhor quem chega até você',
      'transformar conversas em agendamentos',
    ],
    nomePlaceholder: 'Ex.: Ana Paula Costa',
    proofText: 'Mais de 1.200 profissionais de estética já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  fitness: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de fitness sozinho(a).',
    publicoTerm: 'alunos',
    benefits: [
      'atrair alunos realmente interessados em treino',
      'entender melhor quem chega até você',
      'transformar conversas em avaliações e matrículas',
    ],
    nomePlaceholder: 'Ex.: Pedro Oliveira',
    proofText: 'Mais de 1.200 profissionais de fitness já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  coach: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de coaching sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados em coaching',
      'entender melhor quem chega até você',
      'transformar conversas em sessões',
    ],
    nomePlaceholder: 'Ex.: Fernanda Lima',
    proofText: 'Mais de 1.200 coaches já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  nutra: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de vendas sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados nos seus produtos',
      'entender melhor quem chega até você',
      'transformar conversas em vendas',
    ],
    nomePlaceholder: 'Ex.: Ricardo Almeida',
    proofText: 'Mais de 1.200 consultores já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  nutri: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing nutricional sozinho(a).',
    publicoTerm: 'pacientes',
    benefits: [
      'atrair pacientes realmente interessados em nutrição',
      'entender melhor quem chega até sua consulta',
      'transformar conversas em agendamentos',
    ],
    nomePlaceholder: 'Ex.: Dra. Juliana Martins',
    proofText: 'Mais de 1.200 nutricionistas já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  seller: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de vendas sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados',
      'entender melhor quem chega até você',
      'transformar conversas em vendas',
    ],
    nomePlaceholder: 'Ex.: Carla Souza',
    proofText: 'Mais de 1.200 vendedores já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  perfumaria: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing de perfumaria sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados em fragrâncias',
      'entender melhor quem chega até você',
      'transformar conversas em vendas',
    ],
    nomePlaceholder: 'Ex.: Marina Costa',
    proofText: 'Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
  ylada: {
    welcomeTitle: (areaLabel) => `Bem-vindo(a) à YLADA ${areaLabel}`,
    valueSubtitle: 'Aqui você não precisa fazer seu marketing sozinho(a).',
    publicoTerm: 'clientes',
    benefits: [
      'atrair clientes realmente interessados',
      'entender melhor quem chega até você',
      'transformar conversas em atendimentos',
    ],
    nomePlaceholder: 'Ex.: Seu nome completo',
    proofText: 'Mais de 1.200 profissionais já usaram este diagnóstico para entender melhor seu momento profissional.',
  },
}

export interface ResolvedOnboardingCopy {
  welcomeTitle: string
  valueSubtitle: string
  publicoTerm: string
  benefits: [string, string, string]
  nomePlaceholder: string
  ctaIntro: string
  proofText: string
}

export function getOnboardingCopyForArea(
  areaCodigo: OnboardingAreaCodigo,
  areaLabel: string
): ResolvedOnboardingCopy {
  const overrides = ONBOARDING_BY_AREA[areaCodigo]
  const base = { ...DEFAULT_COPY }
  const merged: OnboardingAreaCopy = {
    welcomeTitle: overrides?.welcomeTitle ?? base.welcomeTitle,
    valueSubtitle: overrides?.valueSubtitle ?? base.valueSubtitle,
    publicoTerm: overrides?.publicoTerm ?? base.publicoTerm,
    benefits: overrides?.benefits ?? base.benefits,
    nomePlaceholder: overrides?.nomePlaceholder ?? base.nomePlaceholder,
    ctaIntro: overrides?.ctaIntro ?? base.ctaIntro,
    proofText: overrides?.proofText ?? base.proofText,
  }
  const rawTitle =
    typeof merged.welcomeTitle === 'function' ? merged.welcomeTitle(areaLabel) : merged.welcomeTitle
  // Evita "Bem-vindo(a) à YLADA YLADA" quando areaLabel já é "YLADA" (perfil matriz)
  const welcomeTitle =
    rawTitle === 'Bem-vindo(a) à YLADA YLADA' ? 'Bem-vindo(a) à YLADA' : rawTitle

  return {
    ...merged,
    welcomeTitle,
  }
}
