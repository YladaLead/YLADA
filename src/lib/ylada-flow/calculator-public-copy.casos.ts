/**
 * Casos: resumo de inputs + prefill WhatsApp das calculadoras.
 * Rodar: npx tsx src/lib/ylada-flow/calculator-public-copy.casos.ts
 */
import {
  applyCalculatorPrefillWhatsAppTemplate,
  buildCalculatorInputsRecapLine,
  buildCalculatorInputsRecapParts,
  buildCalculatorWhatsAppPrefillHuman,
} from './calculator-public-copy'
import { imcOmsV1, proteinaGkgV1 } from './bibliotecas/formulas/calculadoras'
import { hidratacao35mlKgV1 } from './bibliotecas/formulas'
import { FLUXO_CALCULADORA_IMC } from './bibliotecas/calculadoras/imc'
import { FLUXO_CALCULADORA_PROTEINA } from './bibliotecas/calculadoras/proteina'
import { FLUXO_CALCULADORA_HIDRATACAO } from './bibliotecas/calculadoras/hidratacao'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const proteinaFields = [
  { id: 'peso', label: 'Seu peso (kg)', type: 'number' },
  {
    id: 'objetivo',
    label: 'Qual é o seu objetivo hoje?',
    type: 'select',
    options: [
      { value: 0, label: 'Manter o peso e a massa' },
      { value: 1, label: 'Perder peso preservando músculo' },
      { value: 2, label: 'Ganhar massa muscular' },
    ],
  },
]

// Tela: resumo limpo
{
  const parts = buildCalculatorInputsRecapParts('proteina-gkg-v1', proteinaFields, { peso: 90, objetivo: 1 }, 'pt')
  const line = buildCalculatorInputsRecapLine('Com base no que você informou:', parts, 'pt')
  assert(line === 'Com base no que você informou: 90 kg · perder peso', 'recap proteína na tela')
  assert(!line.includes('::'), 'sem :: duplo no recap')
}

// WhatsApp: template do molde (proteína)
{
  const native = proteinaGkgV1({ peso_kg: 90, objetivo_idx: 1 })
  const template = FLUXO_CALCULADORA_PROTEINA.handoff.prefillWhatsApp!
  const wa = buildCalculatorWhatsAppPrefillHuman({
    title: 'Calculadora de Proteína',
    formulaId: 'proteina-gkg-v1',
    fields: proteinaFields,
    values: { peso: 90, objetivo: 1 },
    resultNum: 162,
    resultSuffix: 'de proteína por dia',
    locale: 'pt',
    decimalPlaces: 0,
    nativeResult: native,
    prefillWhatsApp: template,
  })
  assert(wa.includes('90 kg, objetivo: perder peso'), 'WA molde costura inputs')
  assert(wa.includes('162 g de proteína por dia'), 'WA molde inclui resultado')
  assert(!wa.includes('Seu peso'), 'WA sem dump de label')
  assert(!wa.includes('::'), 'WA sem ::')
  assert(wa.startsWith('Oi! Fiz a calculadora de proteína'), 'WA usa frase do molde')
}

// IMC: recap com idade + molde
{
  const imcFields = [
    { id: 'peso', label: 'Seu peso (kg)', type: 'number' },
    { id: 'altura', label: 'Sua altura (cm)', type: 'number' },
    { id: 'idade', label: 'Sua idade', type: 'number' },
    {
      id: 'sexo',
      label: 'Você é:',
      type: 'select',
      options: [
        { value: 0, label: 'Mulher' },
        { value: 1, label: 'Homem' },
      ],
    },
  ]
  const parts = buildCalculatorInputsRecapParts(
    'imc-oms-v1',
    imcFields,
    { peso: 80, altura: 165, idade: 51, sexo: 0 },
    'pt'
  )
  assert(parts.join(' · ').includes('51 anos'), 'IMC recap inclui idade')
  const native = imcOmsV1({ peso_kg: 80, altura_cm: 165, sexo_idx: 0 })
  const wa = buildCalculatorWhatsAppPrefillHuman({
    title: 'Calculadora de IMC',
    formulaId: 'imc-oms-v1',
    fields: imcFields,
    values: { peso: 80, altura: 165, idade: 51, sexo: 0 },
    resultNum: 29.4,
    locale: 'pt',
    decimalPlaces: 1,
    nativeResult: native,
    prefillWhatsApp: FLUXO_CALCULADORA_IMC.handoff.prefillWhatsApp,
  })
  assert(wa.includes('Sobrepeso'), 'IMC WA inclui classificação do molde')
  assert(wa.includes('80 kg, 165 cm, 51 anos'), 'IMC WA tokens de input')
}

// Água: {p1} e resultado_litros/copos
{
  const hidraFields = [
    { id: 'p1', label: 'Seu peso (kg)', type: 'number' },
    {
      id: 'p2',
      label: 'Atividade',
      type: 'select',
      options: [
        { value: 0, label: 'Quase não me movimento' },
        { value: 1, label: 'Caminhadas leves' },
        { value: 2, label: 'Treino 1 a 3 vezes por semana' },
      ],
    },
    {
      id: 'p3',
      label: 'Clima',
      type: 'select',
      options: [
        { value: 0, label: 'Ameno' },
        { value: 1, label: 'Quente' },
      ],
    },
  ]
  const native = hidratacao35mlKgV1({ peso_kg: 70, atividade_idx: 2, clima_idx: 1 })
  const wa = applyCalculatorPrefillWhatsAppTemplate(
    FLUXO_CALCULADORA_HIDRATACAO.handoff.prefillWhatsApp!,
    hidraFields,
    { p1: 70, p2: 2, p3: 1 },
    { resultNum: native.copos ?? 0, locale: 'pt', nativeResult: native }
  )
  assert(wa.includes('70 kg'), 'água token p1')
  assert(wa.includes('copos'), 'água inclui copos')
  assert(!wa.includes('{'), 'água sem tokens soltos')
}

console.log('\nTodos os casos de calculator-public-copy passaram.')
