/**
 * Casos da condução V2 do Noel líder (sem OpenAI).
 * Rodar: npm run test:noel-leader-conducao
 */
import { buildProLideresNoelSystemPrompt } from '@/lib/pro-lideres-noel-prompt'
import {
  isNoelProLideresLeaderConducaoEnabled,
  isProLideresLeaderConversationalQuery,
  leaderConducaoPromptRequiresConcreteExample,
  leaderTechniqueResponseHasConcreteExample,
} from '@/lib/pro-lideres-noel-leader-conducao'

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

function withEnv(value: string | undefined, fn: () => void) {
  const prev = process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED
  if (value === undefined) delete process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED
  else process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED = value
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED
    else process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED = prev
  }
}

const baseParams = {
  operationLabel: 'Time Teste',
  verticalCode: 'h-lider',
  focusNotes: null,
  role: 'leader' as const,
  replyLanguage: 'Português (Brasil)',
  linksAtivosContext: null,
  painelTarefasDiariasUrl: 'https://www.ylada.com/pro-lideres/painel/tarefas',
}

withEnv(undefined, () => {
  assert('flag default OFF', !isNoelProLideresLeaderConducaoEnabled())
})

withEnv('true', () => {
  assert('flag true ON', isNoelProLideresLeaderConducaoEnabled())
})

withEnv('false', () => {
  const prompt = buildProLideresNoelSystemPrompt(baseParams)
  assert('legado: MODELO DE SAÍDA ORDEM FIXA', /MODELO DE SAÍDA \(ORDEM FIXA/.test(prompt))
  assert('legado: cinco blocos Diagnóstico', /### Diagnóstico/.test(prompt))
  assert('legado: sem MISSÃO FAZER AGIR V2', !/MISSÃO PRO LÍDERES — FAZER AGIR/.test(prompt))
})

withEnv('true', () => {
  const prompt = buildProLideresNoelSystemPrompt(baseParams)
  assert('V2: sem ORDEM FIXA', !/MODELO DE SAÍDA \(ORDEM FIXA/.test(prompt))
  assert('V2: norte ação → performance', /ação → performance/.test(prompt))
  assert('V2: fecho liderado', /fazer essa pessoa dar o passo/.test(prompt))
  assert('V2: proíbe grid fixo', /Proibido.*grid fixo obrigatório/.test(prompt))
  assert('V2: prompt exige exemplo', leaderConducaoPromptRequiresConcreteExample(prompt))
  assert('V2: formato conversacional', /Condução V2/.test(prompt))
})

assert('conversa: quem é você', isProLideresLeaderConversationalQuery('Quem é você, Noel?'))
assert('conversa: o que vc faz', isProLideresLeaderConversationalQuery('o que vc faz aqui?'))
assert('não conversa: cadência equipe', !isProLideresLeaderConversationalQuery('Como fecho cadência com a equipe esta semana?'))

const tecnicaBoa = `Para destravar quem some depois do convite, o foco é um combinado pequeno com prazo.

Na prática: peça 3 nomes até sexta; na call cada um diz quantos fez.

Fecha assim: quem não trouxer os 3 nomes volta no 1:1 na terça — sem bronca, só ajuste.`

const tecnicaRuim = `Cadência medível ajuda a equipe a manter foco. Alinhe expectativas e acompanhe o progresso semanalmente.`

assert('técnica boa: tem exemplo', leaderTechniqueResponseHasConcreteExample(tecnicaBoa))
assert('técnica ruim: sem exemplo', !leaderTechniqueResponseHasConcreteExample(tecnicaRuim))

console.log(`\n${ok} ok, ${fail} fail`)
if (fail > 0) process.exit(1)
