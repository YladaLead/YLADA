/**
 * Casos: render nativo quiz bloco Corpo (registry + config + score DOR p1–p3).
 * Rodar: npx tsx src/lib/ylada-flow/resolve-native-pilot-ylada-flow.casos.ts
 */
import { fluxosClientes } from '@/lib/ylada-flow/fluxos-clientes'
import { maybeApplyYladaFlowNativeConfig } from '@/lib/ylada-flow/apply-ylada-flow-native-config'
import {
  hasQuizMoldForFluxoId,
  resolveNativePilotYladaFlow,
} from '@/lib/ylada-flow/resolve-native-pilot-ylada-flow'
import { normalizeVisitorAnswers } from '@/lib/ylada/diagnosis-normalize'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

async function runGateTests() {
  const configSemFlag = { meta: { pro_lideres_fluxo_id: 'barriga-pesada', pro_lideres_kind: 'sales' } }
  const outSemFlag = await maybeApplyYladaFlowNativeConfig({} as never, configSemFlag, {
    user_id: 'u1',
    template_id: null,
  })
  assert(outSemFlag === configSemFlag, 'sem flag não aplica molde quiz')

  const configComFlag = {
    meta: {
      use_ylada_flow_native: true,
      pro_lideres_fluxo_id: 'barriga-pesada',
      pro_lideres_kind: 'sales',
    },
  }
  const outComFlag = await maybeApplyYladaFlowNativeConfig({} as never, configComFlag, {
    user_id: 'u1',
    template_id: null,
  })
  const form = outComFlag.form as { fields?: Array<{ options?: string[] }> }
  assert(Array.isArray(form.fields) && form.fields.length === 5, 'config nativa com 5 fields')
  assert(form.fields![0].options?.length === 4, 'field com 4 opções')
  const meta = outComFlag.meta as Record<string, unknown>
  assert(meta.invert_risk_mcq_score === true, 'invert_risk_mcq_score no meta')
  assert(
    JSON.stringify(meta.risk_mcq_question_ids) === '["p1","p2","p3"]',
    'risk_mcq_question_ids = p1–p3'
  )
}

async function main() {
  assert(hasQuizMoldForFluxoId('barriga-pesada'), 'registry barriga-pesada')
  assert(hasQuizMoldForFluxoId('retencao-inchaço'), 'registry cedilha retencao-inchaço')
  assert(hasQuizMoldForFluxoId('energia-foco'), 'registry energia-foco via FLUXOS_VENDAS_POR_ID')
  assert(!hasQuizMoldForFluxoId('calc-proteina'), 'calculadora fora do quiz registry')

  const legacy = fluxosClientes.find((f) => f.id === 'barriga-pesada')
  assert(!!legacy, 'fluxo legado barriga-pesada existe')

  const flow = resolveNativePilotYladaFlow(legacy!, { ownerId: 'test', tenantId: 'test', kind: 'sales' })
  assert(flow.perguntas.length === 5, '5 perguntas do molde')
  assert(flow.perguntas[0].opcoes?.length === 4, '4 opções (sem escala 0–10)')
  assert(flow.abertura.gancho.includes('Não é só o que você come'), 'abertura nova do molde')

  await runGateTests()

  const fields = [
    { id: 'p1', options: ['a', 'b', 'c', 'd'] },
    { id: 'p2', options: ['a', 'b', 'c', 'd'] },
    { id: 'p3', options: ['a', 'b', 'c', 'd'] },
    { id: 'p4', options: ['a', 'b', 'c', 'd'] },
    { id: 'p5', options: ['a', 'b', 'c', 'd'] },
  ]
  const heavy = normalizeVisitorAnswers(
    { p1: '0', p2: '0', p3: '0', p4: '3', p5: '3' },
    'RISK_DIAGNOSIS',
    {
      themeRaw: 'Barriga Pesada',
      formFields: fields,
      invertRiskMcqScore: true,
      riskMcqQuestionIds: ['p1', 'p2', 'p3'],
    }
  )
  assert(heavy.generic_level === 'alto', 'respostas pesadas → alto/urgente')

  const light = normalizeVisitorAnswers(
    { p1: '3', p2: '3', p3: '3', p4: '0', p5: '0' },
    'RISK_DIAGNOSIS',
    {
      themeRaw: 'Barriga Pesada',
      formFields: fields,
      invertRiskMcqScore: true,
      riskMcqQuestionIds: ['p1', 'p2', 'p3'],
    }
  )
  assert(light.generic_level === 'baixo', 'respostas leves → baixo/leve')

  console.log('\nTodos os casos de resolve-native-pilot quiz passaram.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
