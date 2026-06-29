/**
 * Casos da condução V2 do Noel líder (sem OpenAI).
 * Rodar: npm run test:noel-leader-conducao
 */
import { buildProLideresNoelSystemPrompt } from '@/lib/pro-lideres-noel-prompt'
import {
  isNoelProLideresLeaderConducaoEnabled,
  isProLideresLeaderConversationalQuery,
  leaderConducaoPromptRequiresDosagem,
  leaderConducaoPromptRequiresLinkObjective,
  leaderConducaoPromptRequiresLinkObjetivoOutro,
  leaderConducaoPromptRequiresLinkObjetivoChips,
  leaderConducaoPromptRequiresFluxoPreview,
  leaderFluxoDraftHasTechnicalLabels,
  leaderConducaoPromptRequiresConcreteExample,
  leaderTechniqueResponseHasConcreteExample,
  normalizeLeaderFluxoDraftPreview,
} from '@/lib/pro-lideres-noel-leader-conducao'
import { leaderIndicacoesPreviewTitleIsReaderFacing } from '@/lib/pro-lideres-noel-leader-link-objetivos'

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
  assert('legado: sem preview fluxo', !leaderConducaoPromptRequiresFluxoPreview(prompt))
})

withEnv('true', () => {
  const prompt = buildProLideresNoelSystemPrompt(baseParams)
  assert('V2: sem ORDEM FIXA', !/MODELO DE SAÍDA \(ORDEM FIXA/.test(prompt))
  assert('V2: norte ação → performance', /ação → performance/.test(prompt))
  assert('V2: fecho liderado', /fazer o liderado agir|fazer essa pessoa dar o passo/.test(prompt))
  assert('V2: proíbe grid fixo', /Proibido.*grid fixo/.test(prompt))
  assert('V2: prompt exige exemplo', leaderConducaoPromptRequiresConcreteExample(prompt))
  assert('V2: dosagem ~3 pontos', leaderConducaoPromptRequiresDosagem(prompt))
  assert('V2: mentor de liderança', /mentor de liderança/i.test(prompt))
  assert('V2: sem mentor de campo na identidade V2', !/condutor de líder de campo/.test(prompt.split('MISSÃO PRO LÍDERES')[0] ?? ''))
  assert('V2: link 4 objetivos convicção', leaderConducaoPromptRequiresLinkObjective(prompt))
  assert('V2: link Outro campo livre', leaderConducaoPromptRequiresLinkObjetivoOutro(prompt))
  assert('V2: link botões tocáveis', leaderConducaoPromptRequiresLinkObjetivoChips(prompt))
  assert('V2: fluxo preview lead', leaderConducaoPromptRequiresFluxoPreview(prompt))
  assert('V2: proíbe menu qualificar/educar/engajar', /proibido.*qualificar.*educar.*engajar/i.test(prompt))
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

const rascunhoTecnico = `Montei o fluxo para indicações:

### Título do fluxo
Colhendo Indicações Valiosas

### Texto na primeira tela (gancho)
Descubra como ajudar quem você ama.

### Pergunta 1
Quem você gostaria de indicar?

A) Família
B) Amigos

### CTA WhatsApp
Posso te mandar uma mensagem no WhatsApp?`

const rascunhoPreview = `**É assim que vai aparecer pra quem receber:**

**Nome**
Quem você ama merece esse cuidado?

**Primeira frase**
Responde em 1 minuto e veja o que faz sentido pra você.

---

Você já pensou em indicar alguém especial?

A) Sim
B) Ainda não

---

**Mensagem final**
Posso te mandar uma mensagem no WhatsApp?`

assert('rascunho técnico: detecta rótulos', leaderFluxoDraftHasTechnicalLabels(rascunhoTecnico))
assert('preview bom: sem rótulos técnicos', !leaderFluxoDraftHasTechnicalLabels(rascunhoPreview))
const rascunhoNormalizado = normalizeLeaderFluxoDraftPreview(rascunhoTecnico)
assert('normaliza: remove rótulos técnicos', !leaderFluxoDraftHasTechnicalLabels(rascunhoNormalizado))
assert('normaliza: abre com preview', /é assim que vai aparecer/i.test(rascunhoNormalizado))
assert('normaliza: usa Nome', /\*\*Nome\*\*/.test(rascunhoNormalizado))
assert('normaliza: usa Mensagem final', /\*\*Mensagem final\*\*/.test(rascunhoNormalizado))

const nomeIndicacoesMatch = rascunhoPreview.match(/\*\*Nome\*\*\s*\n([^\n]+)/)
assert(
  'colher indicações: preview título pro leitor',
  nomeIndicacoesMatch ? leaderIndicacoesPreviewTitleIsReaderFacing(nomeIndicacoesMatch[1]) : false
)
const nomeTecnicoMatch = rascunhoTecnico.match(/### Título do fluxo\s*\n([^\n]+)/)
assert(
  'colher indicações: rejeita título interno',
  nomeTecnicoMatch ? !leaderIndicacoesPreviewTitleIsReaderFacing(nomeTecnicoMatch[1]) : false
)

console.log(`\n${ok} ok, ${fail} fail`)
if (fail > 0) process.exit(1)
