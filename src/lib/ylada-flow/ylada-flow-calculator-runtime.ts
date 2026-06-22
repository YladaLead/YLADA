/**
 * Runtime da calculadora nativa YladaFlow → copy do CalculatorBlock (sem render novo).
 */
import type { YladaFlow } from '@/types/ylada-flow'
import { runYladaFlowFormula } from '@/lib/ylada-flow/bibliotecas/formulas'

export type YladaFlowCalculatorDevolutivaConfig = {
  formulaId: string
  faixaSegura: { min: number; max: number }
  salvaguarda: string
  porPerfil: {
    pronto: { espelho: string; causa: string; primeiroPasso: string }
    curioso: { espelho: string; causa: string; primeiroPasso: string }
  }
}

export function applyDevolutivaTokens(template: string, ml: number, copos: number): string {
  return template
    .replace(/\{resultado_ml\}/g, String(ml))
    .replace(/\{resultado_copos\}/g, String(copos))
}

function calculatorValuesToFormulaInputs(
  values: Record<string, number | undefined>
): Record<string, number> | null {
  const peso = values.p1 ?? values.peso
  if (peso === undefined || peso === null || Number.isNaN(Number(peso))) return null

  const atividadeRaw = values.p2 ?? values.atividade
  const climaRaw = values.p3 ?? values.clima
  if (atividadeRaw === undefined || climaRaw === undefined) return null

  return {
    peso_kg: Number(peso),
    atividade_ml: Number(atividadeRaw),
    clima_ml: Number(climaRaw),
  }
}

export function computeYladaFlowCalculatorResult(
  devolutivaCfg: YladaFlowCalculatorDevolutivaConfig,
  values: Record<string, number | undefined>
) {
  const inputs = calculatorValuesToFormulaInputs(values)
  if (!inputs) return null
  return runYladaFlowFormula(devolutivaCfg.formulaId, inputs, devolutivaCfg.faixaSegura)
}

export function buildYladaFlowCalculatorResultCopy(
  devolutivaCfg: YladaFlowCalculatorDevolutivaConfig,
  values: Record<string, number | undefined>,
  perfil: 'pronto' | 'curioso' = 'pronto'
): { insight: string; tip: string; expanded: string[] } | null {
  const resultado = computeYladaFlowCalculatorResult(devolutivaCfg, values)
  if (!resultado) return null

  const ml = resultado.valor
  const copos = resultado.copos ?? Math.round(ml / 250)
  const bloco = devolutivaCfg.porPerfil[perfil]
  const tokenize = (s: string) => applyDevolutivaTokens(s, ml, copos)

  return {
    insight: [tokenize(bloco.espelho), tokenize(bloco.causa)].filter(Boolean).join('\n\n'),
    tip: devolutivaCfg.salvaguarda,
    expanded: bloco.primeiroPasso.trim() ? [tokenize(bloco.primeiroPasso)] : [],
  }
}

export function buildYladaFlowCalculatorDevolutivaConfig(
  flow: YladaFlow
): YladaFlowCalculatorDevolutivaConfig | null {
  const calc = flow.calculadora
  if (!calc || flow.dimensoes.tipo !== 'calculadora') return null

  return {
    formulaId: calc.formulaId,
    faixaSegura: calc.faixaSegura,
    salvaguarda: calc.salvaguarda,
    porPerfil: {
      pronto: {
        espelho: flow.devolutiva.porPerfil.pronto.espelho,
        causa: flow.devolutiva.porPerfil.pronto.causa,
        primeiroPasso: flow.devolutiva.porPerfil.pronto.primeiroPasso,
      },
      curioso: {
        espelho: flow.devolutiva.porPerfil.curioso.espelho,
        causa: flow.devolutiva.porPerfil.curioso.causa,
        primeiroPasso: flow.devolutiva.porPerfil.curioso.primeiroPasso,
      },
    },
  }
}
