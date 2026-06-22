/**
 * Fórmulas determinísticas — IMC, calorias (Mifflin), proteína (g/kg).
 * Fonte: blueprint-plataforma/Chat5_Calculadoras_Revisao_Formulas.md
 */
import type { FormulaResult } from './index'

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export const CALORIAS_ATIVIDADE_FATORES = [1.2, 1.375, 1.55, 1.725, 1.9] as const
export const PROTEINA_OBJETIVO_FATOR = [1.4, 1.8, 2.0] as const
export const PROTEINA_OBJETIVO_KEYS = ['manter', 'perder', 'ganhar'] as const
export const CALORIAS_OBJETIVO_KEYS = ['perder', 'manter', 'ganhar'] as const
const PROTEINA_TETO_G_KG = 2.2

export type ImcOmsBandId = 'abaixo' | 'normal' | 'sobrepeso' | 'obesidade'

export function imcOmsBand(imc: number): ImcOmsBandId {
  if (imc < 18.5) return 'abaixo'
  if (imc < 25) return 'normal'
  if (imc < 30) return 'sobrepeso'
  return 'obesidade'
}

export function imcOmsClassificacaoLabel(band: ImcOmsBandId): string {
  switch (band) {
    case 'abaixo':
      return 'Abaixo do peso'
    case 'normal':
      return 'Peso normal'
    case 'sobrepeso':
      return 'Sobrepeso'
    default:
      return 'Obesidade'
  }
}

/** imc-oms-v1: peso_kg / (altura_cm/100)² — sexo não entra na conta (só na leitura). */
export function imcOmsV1(
  inputs: { peso_kg: number; altura_cm: number; sexo_idx?: number },
  faixaSegura: { min: number; max: number } = { min: 10, max: 60 }
): FormulaResult {
  const alturaM = inputs.altura_cm / 100
  const raw = inputs.peso_kg / (alturaM * alturaM)
  const imc = clamp(Math.round(raw * 10) / 10, faixaSegura.min, faixaSegura.max)
  const band = imcOmsBand(imc)
  const sexo = inputs.sexo_idx === 0 ? 'F' : inputs.sexo_idx === 1 ? 'M' : undefined

  return {
    valor: imc,
    unidade: 'kg/m²',
    meta: {
      imc,
      classificacao: imcOmsClassificacaoLabel(band),
      classificacao_key: band,
      ...(sexo ? { sexo } : {}),
    },
  }
}

/** proteina-gkg-v1: gramas = peso × fator objetivo, teto 2,2 g/kg. */
export function proteinaGkgV1(
  inputs: { peso_kg: number; objetivo_idx: number },
  faixaSegura: { min: number; max: number } = { min: 30, max: 300 }
): FormulaResult {
  const idx = Math.max(0, Math.min(2, Math.round(inputs.objetivo_idx)))
  const fator = PROTEINA_OBJETIVO_FATOR[idx] ?? 1.4
  const teto = inputs.peso_kg * PROTEINA_TETO_G_KG
  const gramas = clamp(Math.round(Math.min(inputs.peso_kg * fator, teto)), faixaSegura.min, faixaSegura.max)
  const objetivo = PROTEINA_OBJETIVO_KEYS[idx] ?? 'manter'

  return {
    valor: gramas,
    unidade: 'g/dia',
    sufixo: 'de proteína por dia',
    meta: { gramas, objetivo },
  }
}

function mifflinTmb(peso: number, altura: number, idade: number, sexoIdx: number): number {
  const base = 10 * peso + 6.25 * altura - 5 * idade
  return sexoIdx === 0 ? base - 161 : base + 5
}

/** calorias-mifflin-v1: TMB × atividade; objetivo ajusta GET. */
export function caloriasMifflinV1(
  inputs: {
    idade: number
    sexo_idx: number
    peso_kg: number
    altura_cm: number
    atividade_idx: number
    objetivo_idx: number
  },
  faixaSegura: { min: number; max: number } = { min: 1000, max: 5000 }
): FormulaResult {
  const atividadeIdx = Math.max(0, Math.min(4, Math.round(inputs.atividade_idx)))
  const objetivoIdx = Math.max(0, Math.min(2, Math.round(inputs.objetivo_idx)))
  const fator = CALORIAS_ATIVIDADE_FATORES[atividadeIdx] ?? 1.2
  const get = mifflinTmb(inputs.peso_kg, inputs.altura_cm, inputs.idade, inputs.sexo_idx) * fator

  let kcal: number
  const objetivo = CALORIAS_OBJETIVO_KEYS[objetivoIdx] ?? 'manter'
  if (objetivo === 'perder') {
    const piso = inputs.sexo_idx === 0 ? 1200 : 1500
    kcal = Math.max(piso, get - 500)
  } else if (objetivo === 'ganhar') {
    kcal = get + 400
  } else {
    kcal = get
  }

  const valor = clamp(Math.round(kcal), faixaSegura.min, faixaSegura.max)
  return {
    valor,
    unidade: 'kcal/dia',
    meta: { kcal: valor, objetivo },
  }
}
