/**
 * Casos — coerência do fluxo por objetivo (§6.1, r84, r87).
 * Rodar: npm run test:noel-leader-fluxo-coerencia
 */
import { buildProLideresNoelSystemPrompt } from '@/lib/pro-lideres-noel-prompt'
import {
  leaderConducaoPromptRequiresFluxoCoerencia,
  leaderConducaoPromptRequiresIndicacoesViral,
  leaderConducaoPromptRequiresR84OptIn,
  leaderFluxoDraftHasIndicacoesLogicMix,
  leaderFluxoDraftUsesMcqForOpenField,
  leaderIndicacoesFluxoDraftIsCoherentViral,
} from '@/lib/pro-lideres-noel-leader-fluxo-coerencia'

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

const baseParams = {
  operationLabel: 'Time Teste',
  verticalCode: 'h-lider',
  focusNotes: null,
  role: 'leader' as const,
  replyLanguage: 'Português (Brasil)',
  linksAtivosContext: null,
  painelTarefasDiariasUrl: 'https://www.ylada.com/pro-lideres/painel/tarefas',
}

const prev = process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED
process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED = 'true'
const prompt = buildProLideresNoelSystemPrompt(baseParams)
if (prev === undefined) delete process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED
else process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED = prev

assert('prompt: coerência por objetivo', leaderConducaoPromptRequiresFluxoCoerencia(prompt))
assert('prompt: indicações viral §6.1', leaderConducaoPromptRequiresIndicacoesViral(prompt))
assert('prompt: r84 opt-in', leaderConducaoPromptRequiresR84OptIn(prompt))

const indicacoesIncoerente = `**É assim que vai aparecer pra quem receber:**

**Nome**
Quem você ama merece esse cuidado?

**Primeira frase**
Compartilhe com quem você ama esse cuidado especial.

---

Quem você gostaria de indicar?

A) Família
B) Amigos

---

Me diga o nome e telefone de quem você quer indicar:

A) Já tenho
B) Prefiro não dizer`

const indicacoesBom = `**É assim que vai aparecer pra quem receber:**

**Nome**
Quem você ama merece esse cuidado?

**Primeira frase**
Em 1 minuto você vê se isso faz sentido pra alguém que você ama.

---

Você conhece alguém que também se preocupa com bem-estar?

A) Sim, na família
B) Sim, nos amigos
C) Ainda não pensei nisso

---

**Mensagem final**
Se fizer sentido, compartilhe este link com quem você ama — leva 1 minuto.`

assert('r87: detecta mistura viral + formulário', leaderFluxoDraftHasIndicacoesLogicMix(indicacoesIncoerente))
assert('r87: detecta MCQ em campo aberto', leaderFluxoDraftUsesMcqForOpenField(indicacoesIncoerente))
assert('r87: fluxo bom é viral coerente', leaderIndicacoesFluxoDraftIsCoherentViral(indicacoesBom))
assert('r87: fluxo ruim não é viral coerente', !leaderIndicacoesFluxoDraftIsCoherentViral(indicacoesIncoerente))

console.log(`\n${ok} ok, ${fail} fail`)
if (fail > 0) process.exit(1)
