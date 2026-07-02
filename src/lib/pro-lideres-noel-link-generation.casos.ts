/**
 * Casos do gatilho de criação de link do Noel do líder.
 * Rodar: npx tsx src/lib/pro-lideres-noel-link-generation.casos.ts
 * Regressão do bug: pergunta de compliance/mentoria que só CITA um tema (emagrecimento,
 * energia…) NÃO pode virar geração de quiz.
 */
import {
  proLideresNoelCreateLinkIntent as criar,
  isVagueCreateRequest as vago,
  isNoelPlBriefGateEnabled,
} from '@/lib/pro-lideres-noel-link-generation'

let ok = 0
let fail = 0
function assert(name: string, cond: boolean) {
  if (cond) {
    ok++
    console.log('✓', name)
  } else {
    fail++
    console.log('✗', name)
  }
}

// NÃO cria link (compliance / mentoria que só cita o tema)
assert(
  'compliance emagrecimento não cria',
  criar('Apareceu alegação forte de saúde/emagrecimento num print do grupo. Qual é o meu passo a passo imediato com a equipe?') === false
)
assert('equipe sem energia não cria', criar('A equipe está sem energia esta semana, como eu reanimo?') === false)
assert('ansiedade do time não cria', criar('Tem gente com ansiedade de bater meta, como eu conduzo?') === false)
assert('bem-estar da equipe não cria', criar('Como cuido do bem-estar da equipe no fim de mês?') === false)

// CRIA link (pedido real, pego pelos verbos/qualificadores)
assert('cria um quiz de emagrecimento cria', criar('Cria um quiz de emagrecimento pra eu atrair contatos') === true)
assert('quiz para emagrecer cria', criar('Quero um quiz para emagrecimento pra mandar no grupo') === true)
assert('gera o link cria', criar('Pode gerar o link desse diagnóstico?') === true)

// Brief-gate: pedido de criar VAGO (sem tema) → precisa de brief
assert('quiz sem tema é vago', vago('Cria um quiz pra eu qualificar quem veio do meu Instagram') === true)
assert('quiz com tema NÃO é vago', vago('Cria um quiz de energia e disposição pra donas de salão') === false)
assert('quiz para tema explícito NÃO é vago', vago('Quero um quiz para emagrecimento') === false)
assert('mentoria (não criar) não é vago', vago('Como eu motivo meu time esta semana?') === false)
assert(
  'sinal "não tenho título / me ajuda a pensar" é vago',
  vago('Preciso de um diagnóstico rápido pra quem foi no evento. Ainda não tenho título nem sei quantas perguntas — me ajuda a pensar e a criar o link') === true
)

// Flag do brief-gate: OFF por padrão
const prev = process.env.NOEL_PL_BRIEF_GATE_ENABLED
delete process.env.NOEL_PL_BRIEF_GATE_ENABLED
assert('brief-gate flag default OFF', !isNoelPlBriefGateEnabled())
process.env.NOEL_PL_BRIEF_GATE_ENABLED = 'true'
assert('brief-gate flag ON com true', isNoelPlBriefGateEnabled())
if (prev === undefined) delete process.env.NOEL_PL_BRIEF_GATE_ENABLED
else process.env.NOEL_PL_BRIEF_GATE_ENABLED = prev

console.log(`\n${ok} ok, ${fail} fail`)
process.exit(fail > 0 ? 1 : 0)
