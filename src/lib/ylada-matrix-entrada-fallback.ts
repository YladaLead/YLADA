/**
 * Áreas com landing socrática (Med, Psi): escolha de nicho na matriz em /pt/entrada/{area}
 * sem usar o quiz curto do YladaPublicEntryFlow. Handoff → sessionStorage na landing.
 */

import type { PublicFlowNichoOption } from '@/config/ylada-public-flow-types'
import { MED_DEMO_CLIENTE_NICHOS } from '@/lib/med-demo-cliente-data'
import { PSI_DEMO_CLIENTE_NICHOS } from '@/lib/psi-demo-cliente-data'

export type MatrixEntradaNichoPack = {
  areaCodigo: string
  nichoPickerTitle: string
  subtitle: string
  nichos: PublicFlowNichoOption[]
  isValidNicho: (v: string | null) => v is string
  destinoPathPrefix: string
}

const MED_VALUES = new Set(MED_DEMO_CLIENTE_NICHOS.map((n) => n.value))
const PSI_VALUES = new Set(PSI_DEMO_CLIENTE_NICHOS.map((n) => n.value))

export function getMatrixEntradaNichoPack(areaCodigo: string): MatrixEntradaNichoPack | null {
  if (areaCodigo === 'med') {
    return {
      areaCodigo: 'med',
      nichoPickerTitle: 'Qual é o foco principal do seu atendimento?',
      subtitle:
        'Na sequência você entra na experiência da medicina no YLADA. Quando abrir a demonstração, o foco já vem escolhido.',
      nichos: MED_DEMO_CLIENTE_NICHOS,
      isValidNicho: (v): v is string => !!v && MED_VALUES.has(v),
      destinoPathPrefix: '/pt/med',
    }
  }
  if (areaCodigo === 'psi') {
    return {
      areaCodigo: 'psi',
      nichoPickerTitle: 'Qual é o foco principal do seu atendimento?',
      subtitle:
        'Na sequência você entra na experiência da psicologia no YLADA. Quando abrir a demonstração, o foco já vem escolhido.',
      nichos: PSI_DEMO_CLIENTE_NICHOS,
      isValidNicho: (v): v is string => !!v && PSI_VALUES.has(v),
      destinoPathPrefix: '/pt/psi',
    }
  }
  return null
}

export function supportsMatrixEntradaNicho(areaCodigo: string): boolean {
  return getMatrixEntradaNichoPack(areaCodigo) != null
}
