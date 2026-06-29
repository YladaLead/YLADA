import {
  formatLinkObjetivosBulletFallback,
  leaderAssistantOffersLinkObjetivoChoices,
  leaderIndicacoesPreviewTitleIsReaderFacing,
  leaderLinkObjetivoAssistantDisplayText,
  PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS,
} from './pro-lideres-noel-leader-link-objetivos'

let ok = 0
let fail = 0

function assert(label: string, cond: boolean): void {
  if (cond) {
    ok++
    return
  }
  fail++
  console.error(`FAIL: ${label}`)
}

assert('opções: 4 presets + Outro', PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS.length === 5)
assert('opções: indicações no menu', PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS.some((o) => o.id === 'indicacoes'))
assert('fallback: bullets com negrito', formatLinkObjetivosBulletFallback().includes('• **Colher indicações**'))

const menuAssistant = `Pra montar o link certo, me diz: **O que você quer que esse link faça?**

**1) Trazer gente nova (gerar contatos)** — atrair quem ainda não conhece.

**2) Cuidar de quem já é cliente** — acompanhar.

**3) Reativar quem parou ou esfriou** — voltar a falar.

**4) Colher indicações (multiplicar)** — passar pra quem ama.`

assert('detecta: pergunta objetivo', leaderAssistantOffersLinkObjetivoChoices(menuAssistant))
assert('display: remove lista numerada', !/\*\*1\) Trazer/.test(leaderLinkObjetivoAssistantDisplayText(menuAssistant)))
assert(
  'display: mantém pergunta',
  /o que você quer que esse link faça/i.test(leaderLinkObjetivoAssistantDisplayText(menuAssistant))
)

assert('indicações: título pro leitor', leaderIndicacoesPreviewTitleIsReaderFacing('Quem você ama merece esse cuidado?'))
assert('indicações: rejeita título interno', !leaderIndicacoesPreviewTitleIsReaderFacing('Colhendo Indicações Valiosas'))
assert('indicações: rejeita objetivo cru', !leaderIndicacoesPreviewTitleIsReaderFacing('Colher indicações'))

console.log(`\n${ok} ok, ${fail} fail`)
if (fail > 0) process.exit(1)
