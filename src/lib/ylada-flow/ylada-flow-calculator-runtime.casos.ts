/**
 * Casos: merge devolutiva porFaixa (porSexo + porIdade).
 * Rodar: npx tsx src/lib/ylada-flow/ylada-flow-calculator-runtime.casos.ts
 */
import { FLUXO_CALCULADORA_IMC } from './bibliotecas/calculadoras/imc'
import {
  buildYladaFlowCalculatorDevolutivaConfig,
  buildYladaFlowCalculatorResultCopy,
  resolveFaixaDevolutivaBloco,
} from './ylada-flow-calculator-runtime'
import { imcOmsV1 } from './bibliotecas/formulas/calculadoras'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const cfg = buildYladaFlowCalculatorDevolutivaConfig(FLUXO_CALCULADORA_IMC)!
const sobrepeso = cfg.porFaixa!.find((f) => f.id === 'sobrepeso')!

// 65 anos · sobrepeso · mulher → copy do molde (porIdade de:60), não "roupa apertando"
{
  const values = { peso: 80, altura: 165, idade: 65, sexo: 0 }
  const resultado = imcOmsV1({ peso_kg: 80, altura_cm: 165, sexo_idx: 0 })
  const bloco = resolveFaixaDevolutivaBloco(sobrepeso, values, resultado)
  assert(
    bloco.espelho.includes('depois dos 60'),
    'porIdade sobrepeso 65a sobrepõe espelho'
  )
  assert(!bloco.causa.includes('força de vontade'), 'porIdade substitui causa genérica')
  const copy = buildYladaFlowCalculatorResultCopy(cfg, values)
  assert(copy !== null, 'buildYladaFlowCalculatorResultCopy retorna copy')
  assert(
    !copy!.insight.includes('roupa apertando'),
    'sem fallback hardcoded PublicLinkView'
  )
  assert(copy!.insight.includes('depois dos 60'), 'insight vem do molde porIdade')
}

// 30 anos · sobrepeso · homem → porSexo M no espelho
{
  const values = { peso: 85, altura: 175, idade: 30, sexo: 1 }
  const resultado = imcOmsV1({ peso_kg: 85, altura_cm: 175, sexo_idx: 1 })
  const bloco = resolveFaixaDevolutivaBloco(sobrepeso, values, resultado)
  assert(bloco.espelho.includes('massa muscular'), 'porSexo M no espelho')
}

console.log('\nTodos os casos de runtime calculadora passaram.')
