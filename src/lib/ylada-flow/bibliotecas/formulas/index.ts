/**
 * Base de fórmulas determinísticas do YladaFlow (sem LLM).
 */
export type FormulaResult = {
  valor: number
  unidade: string
  sufixo?: string
  copos?: number
}

export const HIDRATACAO_ATIVIDADE_ML = [0, 250, 500, 750, 1000] as const
export const HIDRATACAO_CLIMA_ML = [0, 300, 600] as const

export type Hidratacao35mlKgV1Inputs =
  | { peso_kg: number; atividade_idx: number; clima_idx: number }
  | { peso_kg: number; atividade_ml: number; clima_ml: number }

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function hidratacao35mlKgV1(
  inputs: Hidratacao35mlKgV1Inputs,
  faixaSegura: { min: number; max: number } = { min: 1500, max: 5000 }
): FormulaResult {
  const base = inputs.peso_kg * 35
  const atividade =
    'atividade_idx' in inputs
      ? (HIDRATACAO_ATIVIDADE_ML[inputs.atividade_idx] ?? 0)
      : inputs.atividade_ml
  const clima =
    'clima_idx' in inputs ? (HIDRATACAO_CLIMA_ML[inputs.clima_idx] ?? 0) : inputs.clima_ml
  const valor = clamp(Math.round(base + atividade + clima), faixaSegura.min, faixaSegura.max)
  const copos = Math.round(valor / 250)

  return {
    valor,
    unidade: 'ml',
    sufixo: 'copos de 250 ml',
    copos,
  }
}

export type YladaFlowFormulaFn = (
  inputs: Record<string, number>,
  faixaSegura?: { min: number; max: number }
) => FormulaResult

export const YLADA_FLOW_FORMULAS: Record<string, YladaFlowFormulaFn> = {
  'hidratacao-35ml-kg-v1': (inputs, faixaSegura) => {
    if (inputs.atividade_idx !== undefined && inputs.clima_idx !== undefined) {
      return hidratacao35mlKgV1(
        {
          peso_kg: inputs.peso_kg,
          atividade_idx: inputs.atividade_idx,
          clima_idx: inputs.clima_idx,
        },
        faixaSegura
      )
    }
    return hidratacao35mlKgV1(
      {
        peso_kg: inputs.peso_kg,
        atividade_ml: inputs.atividade_ml ?? 0,
        clima_ml: inputs.clima_ml ?? 0,
      },
      faixaSegura
    )
  },
}

export function runYladaFlowFormula(
  formulaId: string,
  inputs: Record<string, number>,
  faixaSegura?: { min: number; max: number }
): FormulaResult | null {
  const fn = YLADA_FLOW_FORMULAS[formulaId]
  if (!fn) return null
  return fn(inputs, faixaSegura)
}

/** Expressão consumida por `evaluateCalculatorFormula` no PublicLinkView (resultado = copos). */
export function buildHidratacaoCalculatorFormulaExpression(faixaSegura: {
  min: number
  max: number
}): string {
  const { min, max } = faixaSegura
  return `Math.round(Math.min(${max}, Math.max(${min}, Math.round(p1 * 35 + p2 + p3))) / 250)`
}
