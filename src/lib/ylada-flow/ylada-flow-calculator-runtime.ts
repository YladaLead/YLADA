/**
 * Runtime da calculadora nativa YladaFlow → copy do CalculatorBlock (sem LLM).
 */
import type { BlocoDevolutiva, FaixaDevolutiva, FaixaEtariaDevolutiva, YladaFlow } from '@/types/ylada-flow'
import { runYladaFlowFormula, type FormulaResult } from '@/lib/ylada-flow/bibliotecas/formulas'

export type YladaFlowCalculatorDevolutivaConfig = {
  formulaId: string
  faixaSegura: { min: number; max: number }
  salvaguarda: string
  casasDecimais: number
  unidadeSaida: string
  sufixoSaida?: string
  porPerfil: {
    pronto: { espelho: string; causa: string; primeiroPasso: string }
    curioso: { espelho: string; causa: string; primeiroPasso: string }
  }
  porFaixa?: FaixaDevolutiva[]
  /** Template humano do prefill WhatsApp (handoff.prefillWhatsApp do molde). */
  prefillWhatsApp?: string
}

type CalculatorFieldLike = { id: string; type?: string }

function pickNumeric(
  values: Record<string, number | undefined>,
  aliases: string[]
): number | undefined {
  for (const key of aliases) {
    const v = values[key]
    if (v === undefined || v === null || Number.isNaN(Number(v))) continue
    return Number(v)
  }
  return undefined
}

/** Mapeia valores do formulário → inputs da fórmula (ids do molde + aliases legados). */
export function calculatorValuesToFormulaInputs(
  formulaId: string,
  values: Record<string, number | undefined>
): Record<string, number> | null {
  switch (formulaId) {
    case 'hidratacao-35ml-kg-v1': {
      const peso = pickNumeric(values, ['p1', 'peso', 'peso_kg'])
      const atividade = pickNumeric(values, ['p2', 'atividade', 'atividade_ml'])
      const clima = pickNumeric(values, ['p3', 'clima', 'clima_ml'])
      if (peso === undefined || atividade === undefined || clima === undefined) return null
      return { peso_kg: peso, atividade_ml: atividade, clima_ml: clima }
    }
    case 'proteina-gkg-v1': {
      const peso = pickNumeric(values, ['peso', 'p3', 'p1', 'peso_kg'])
      const objetivo_idx = pickNumeric(values, ['objetivo', 'p6'])
      if (peso === undefined || objetivo_idx === undefined) return null
      return { peso_kg: peso, objetivo_idx }
    }
    case 'imc-oms-v1': {
      const peso = pickNumeric(values, ['peso', 'p3', 'p1', 'peso_kg'])
      const altura = pickNumeric(values, ['altura', 'p4', 'altura_cm'])
      const sexo_idx = pickNumeric(values, ['sexo', 'p2'])
      if (peso === undefined || altura === undefined) return null
      return {
        peso_kg: peso,
        altura_cm: altura,
        ...(sexo_idx !== undefined ? { sexo_idx } : {}),
      }
    }
    case 'calorias-mifflin-v1': {
      const idade = pickNumeric(values, ['idade', 'p1'])
      const sexo_idx = pickNumeric(values, ['sexo', 'p2'])
      const peso = pickNumeric(values, ['peso', 'p3', 'peso_kg'])
      const altura = pickNumeric(values, ['altura', 'p4', 'altura_cm'])
      const atividade_idx = pickNumeric(values, ['atividade', 'p5'])
      const objetivo_idx = pickNumeric(values, ['objetivo', 'p6'])
      if (
        idade === undefined ||
        sexo_idx === undefined ||
        peso === undefined ||
        altura === undefined ||
        atividade_idx === undefined ||
        objetivo_idx === undefined
      ) {
        return null
      }
      return {
        idade,
        sexo_idx,
        peso_kg: peso,
        altura_cm: altura,
        atividade_idx,
        objetivo_idx,
      }
    }
    default:
      return null
  }
}

export function computeYladaFlowCalculatorResult(
  devolutivaCfg: YladaFlowCalculatorDevolutivaConfig,
  values: Record<string, number | undefined>,
  _fields?: CalculatorFieldLike[]
): FormulaResult | null {
  const inputs = calculatorValuesToFormulaInputs(devolutivaCfg.formulaId, values)
  if (!inputs) return null
  return runYladaFlowFormula(devolutivaCfg.formulaId, inputs, devolutivaCfg.faixaSegura)
}

function matchFaixaDevolutiva(
  porFaixa: FaixaDevolutiva[],
  resultado: FormulaResult
): FaixaDevolutiva | null {
  const meta = resultado.meta ?? {}
  const quandoKey =
    typeof meta.objetivo === 'string'
      ? meta.objetivo
      : typeof meta.classificacao_key === 'string'
        ? meta.classificacao_key
        : ''

  for (const faixa of porFaixa) {
    if (faixa.quando && faixa.quando === quandoKey) return faixa
  }

  for (const faixa of porFaixa) {
    if (faixa.min === undefined && faixa.max === undefined) continue
    const min = faixa.min ?? -Infinity
    const max = faixa.max ?? Infinity
    if (resultado.valor >= min && resultado.valor < max) return faixa
  }

  return porFaixa[0] ?? null
}

function resolveSexoLetter(
  values: Record<string, number | undefined>,
  resultado: FormulaResult
): 'M' | 'F' | undefined {
  const fromMeta = resultado.meta?.sexo
  if (fromMeta === 'M' || fromMeta === 'F') return fromMeta
  const idx = pickNumeric(values, ['sexo', 'p2'])
  if (idx === 0) return 'F'
  if (idx === 1) return 'M'
  return undefined
}

function pickIdadeAnos(values: Record<string, number | undefined>): number | undefined {
  const raw = pickNumeric(values, ['idade', 'p1'])
  if (raw === undefined) return undefined
  const idade = Math.round(raw)
  return idade >= 0 && idade <= 120 ? idade : undefined
}

function matchesFaixaEtaria(idade: number, faixa: FaixaEtariaDevolutiva): boolean {
  const de = faixa.de ?? -Infinity
  const ate = faixa.ate ?? Infinity
  return idade >= de && idade < ate
}

function mergeBlocoPorSexo(
  bloco: BlocoDevolutiva,
  faixa: FaixaDevolutiva,
  values: Record<string, number | undefined>,
  resultado: FormulaResult
): BlocoDevolutiva {
  const sexo = resolveSexoLetter(values, resultado)
  if (sexo !== 'M' && sexo !== 'F') return bloco
  const overlay = faixa.porSexo?.[sexo]
  if (!overlay) return bloco
  return { ...bloco, ...overlay }
}

/** Merge: bloco → porSexo → porIdade (regras em ordem; mais específico por último). */
function mergeBlocoPorIdade(
  bloco: BlocoDevolutiva,
  faixa: FaixaDevolutiva,
  idade?: number
): BlocoDevolutiva {
  if (idade === undefined || !faixa.porIdade?.length) return bloco
  let merged = bloco
  for (const faixaIdade of faixa.porIdade) {
    if (matchesFaixaEtaria(idade, faixaIdade)) {
      merged = { ...merged, ...faixaIdade.bloco }
    }
  }
  return merged
}

export function resolveFaixaDevolutivaBloco(
  faixa: FaixaDevolutiva,
  values: Record<string, number | undefined>,
  resultado: FormulaResult
): BlocoDevolutiva {
  const idade = pickIdadeAnos(values)
  let bloco: BlocoDevolutiva = { ...faixa.bloco }
  bloco = mergeBlocoPorSexo(bloco, faixa, values, resultado)
  bloco = mergeBlocoPorIdade(bloco, faixa, idade)
  return bloco
}

export function applyDevolutivaTokens(template: string, resultado: FormulaResult): string {
  const meta = resultado.meta ?? {}
  const ml = typeof meta.ml === 'number' ? meta.ml : resultado.valor
  const copos =
    resultado.copos ??
    (typeof meta.copos === 'number' ? meta.copos : Math.round(ml / 250))
  const gramas = typeof meta.gramas === 'number' ? meta.gramas : resultado.valor
  const kcal = typeof meta.kcal === 'number' ? meta.kcal : resultado.valor
  const imc = typeof meta.imc === 'number' ? meta.imc : resultado.valor
  const classificacao = typeof meta.classificacao === 'string' ? meta.classificacao : ''
  const litros = (ml / 1000).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return template
    .replace(/\{resultado_ml\}/g, String(ml))
    .replace(/\{resultado_litros\}/g, litros)
    .replace(/\{resultado_copos\}/g, String(copos))
    .replace(/\{gramas\}/g, String(gramas))
    .replace(/\{kcal\}/g, String(kcal))
    .replace(/\{imc\}/g, String(imc))
    .replace(/\{classificacao\}/g, classificacao)
}

export function buildYladaFlowCalculatorResultCopy(
  devolutivaCfg: YladaFlowCalculatorDevolutivaConfig,
  values: Record<string, number | undefined>,
  perfil: 'pronto' | 'curioso' = 'pronto',
  fields?: CalculatorFieldLike[]
): { insight: string; tip: string; expanded: string[] } | null {
  const resultado = computeYladaFlowCalculatorResult(devolutivaCfg, values, fields)
  if (!resultado) return null

  const porFaixa = devolutivaCfg.porFaixa
  let bloco: BlocoDevolutiva

  if (porFaixa?.length) {
    const faixa = matchFaixaDevolutiva(porFaixa, resultado)
    if (!faixa) return null
    bloco = resolveFaixaDevolutivaBloco(faixa, values, resultado)
  } else {
    const fallback = devolutivaCfg.porPerfil[perfil]
    bloco = {
      espelho: fallback.espelho,
      causa: fallback.causa,
      primeiroPasso: fallback.primeiroPasso,
      ctaWhatsApp: '',
    }
  }

  const tokenize = (s: string) => applyDevolutivaTokens(s, resultado)

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
    casasDecimais: calc.casasDecimais,
    unidadeSaida: calc.unidadeSaida,
    sufixoSaida: calc.sufixoSaida,
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
    porFaixa: flow.devolutiva.porFaixa,
    prefillWhatsApp: flow.handoff?.prefillWhatsApp,
  }
}
