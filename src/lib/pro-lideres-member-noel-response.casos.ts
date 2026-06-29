/**
 * Casos do pós-processador do Noel membro (sem OpenAI).
 * Rodar: npx tsx src/lib/pro-lideres-member-noel-response.casos.ts
 */
import { classifyProLideresMemberNoelMessage, isMemberNoelConversationalQuery } from '@/lib/pro-lideres-member-noel-router'
import {
  dedupeMemberNoelSections,
  ensureNaPraticaSection,
  formatLinkParaEnviarBody,
  formatNaPraticaSectionsInText,
  isGenericReadyMessage,
  normalizeProLideresMemberNoelResponse,
  extractProLideresMemberNoelMensagemPronta,
  parseAllLinksParaEnviarSection,
  parseLinkParaEnviarSection,
  polishProLideresMemberNoelForDisplay,
  userExplicitlyWantsReadyMessage,
} from '@/lib/pro-lideres-member-noel-response'

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

const listaQ = 'Quem priorizo na minha lista hoje? Estou perdida entre quente, morno e frio.'
const listaRoute = classifyProLideresMemberNoelMessage(listaQ)
const listaRaw = `Faz sentido essa dúvida 😊

**Na prática**

- Priorize 3 quentes.
- Depois 3 mornos.
- Mantenha a mensagem leve.

**Próximo passo**

Me conta quantas responderam. 💪

**Mensagem pronta**

${'Oi, [nome]! Posso te ajudar com calma — me conta o que está pesando mais pra você? 😊'}

**Link para enviar**

Veja **Meus links** no seu painel YLADA e use o que o líder liberou para este momento.

**Próximo passo**

Me conta como foi — um passo de cada vez. 💪`

const listaOut = normalizeProLideresMemberNoelResponse(listaRaw, listaRoute, listaQ)
assert('lista: sem mensagem pronta', !/\*\*Mensagem pronta\*\*/i.test(listaOut))
assert('lista: sem link genérico', !/veja \*\*meus links\*\*/i.test(listaOut))
assert('lista: um só próximo passo', (listaOut.match(/\*\*Próximo passo\*\*/gi) ?? []).length === 1)

const objQ = 'A cliente disse que está caro e vai pensar. Me orienta e me dá mensagem pronta.'
const objRoute = classifyProLideresMemberNoelMessage(objQ)
const objRaw = `Entendo a trava.

**Na prática**

- Valide sem pressionar.

**Mensagem pronta**

Entendo, [nome]. O que pesou mais pra você?

**Próximo passo**

Aguarde a resposta dela.

**Mensagem pronta**

Oi, [nome]! Posso te ajudar com calma — me conta o que está pesando mais pra você? 😊`

const objOut = normalizeProLideresMemberNoelResponse(objRaw, objRoute, objQ)
assert('objeção: uma mensagem pronta', (objOut.match(/\*\*Mensagem pronta\*\*/gi) ?? []).length === 1)
assert('objeção: sem fallback genérico', !isGenericReadyMessage(objOut))

assert(
  'userExplicitlyWantsReadyMessage: objeção com pedido',
  userExplicitlyWantsReadyMessage(objQ)
)
assert(
  'userExplicitlyWantsReadyMessage: lista sem pedido',
  !userExplicitlyWantsReadyMessage(listaQ)
)

const deduped = dedupeMemberNoelSections(objRaw)
assert('dedupe remove genérico duplicado', (deduped.match(/\*\*Mensagem pronta\*\*/gi) ?? []).length === 1)

const plainDupRaw = `Intro 😊

Na prática

Na prática

- Item 1.

Próximo passo

Escolha contatos e me conta quem respondeu. 💪

Próximo passo

Me conta quantas pessoas você abordou — ajustamos a lista no próximo dia. 💪

Link para enviar

Veja **Meus links** no seu painel YLADA e use o que o líder liberou para este momento.

Link para enviar

Calculadora — https://ylada.com/l/demo`
const plainOut = normalizeProLideresMemberNoelResponse(plainDupRaw, listaRoute, listaQ)
assert('plain headings: um Na prática', (plainOut.match(/\*\*Na prática\*\*/gi) ?? []).length === 1)
assert('plain headings: um Próximo passo', (plainOut.match(/\*\*Próximo passo\*\*/gi) ?? []).length === 1)
assert('plain headings: sem link genérico com URL real', !/veja \*\*meus links\*\*/i.test(plainOut))

const sumiuRoute = classifyProLideresMemberNoelMessage(
  'Uma pessoa sumiu depois que mandei o link. Como me comunico?'
)
assert('sumiu: sem link obrigatório', !sumiuRoute.includeLink)

const storyRaw = `Ficar sem ideia é comum.

Poste um story com sua garrafa d'água.

Legenda curta

"Beba água hoje 💧"

Próximo passo

Poste hoje.`
const storyRoute = classifyProLideresMemberNoelMessage('Não sei o que postar no story hoje.')
const storyOut = normalizeProLideresMemberNoelResponse(storyRaw, storyRoute, 'story')
assert('story: ganha Na prática', /\*\*Na prática\*\*/i.test(storyOut))

const quizRoute = classifyProLideresMemberNoelMessage('Cria um quiz novo para eu mandar agora.')
assert('quiz: sem link no router', !quizRoute.includeLink)
const quizOut = normalizeProLideresMemberNoelResponse(
  'Não crio quiz.\n\nAbra Meus links.\n\nPróximo passo\n\nMe diga o tema.',
  quizRoute,
  'Cria um quiz novo'
)
assert('quiz: sem link genérico', !/veja \*\*meus links\*\*/i.test(quizOut))

const ensured = ensureNaPraticaSection(`Oi 😊\n\n- Faça 1 contato.\n\n**Próximo passo**\n\nMe conta.`)
assert('ensureNaPratica: cria bloco', /\*\*Na prática\*\*/i.test(ensured))

const brokenBold = `**Na prática**

Priorize
3 a 5 quentes
: são os que já demonstraram interesse.
Depois, escolha
4 a 5 mornos
: pessoas que você conhece.`
const fixedLista = formatNaPraticaSectionsInText(brokenBold)
assert('lista: bullets com -', /^- Priorize 3 a 5 quentes:/m.test(fixedLista))
assert('lista: sem linha só com :', !/^:\s/m.test(fixedLista))

const storyFix = polishProLideresMemberNoelForDisplay(
  `**Na prática**\n\n- Poste algo.\n\n**Próximo passo**\n\nSem resposta em 48h, siga para o próximo nome da lista.`,
  'Não sei o que postar no story hoje.'
)
assert('story: próximo passo não é de lista', !/48h.*lista/i.test(storyFix))

const msg = `**Mensagem pronta**\n\nEntendo, [nome]. O que pesou mais?`
assert(
  'extract mensagem pronta',
  extractProLideresMemberNoelMensagemPronta(msg) === 'Entendo, [nome]. O que pesou mais?'
)

const convQ = 'Quem é você?'
const convRoute = classifyProLideresMemberNoelMessage(convQ)
assert('conversacional: modo', convRoute.mode === 'conversacional')
assert('conversacional: sem link', !convRoute.includeLink)
const convRaw = `Sou o Noel na YLADA 😊

**Na prática**

- Faça algo.

**Próximo passo**

Me conta.`
const convOut = normalizeProLideresMemberNoelResponse(convRaw, convRoute, convQ)
assert('conversacional: sem blocos forçados', !/\*\*(Na prática|Próximo passo|Mensagem pronta|Link para enviar)\*\*/i.test(convOut))
assert('conversacional: query helper', isMemberNoelConversationalQuery(convQ))

const dashRaw = `Faz sentido — lista grande.

**Próximo passo**

Me conta — um passo de cada vez.`
const dashOut = normalizeProLideresMemberNoelResponse(dashRaw, listaRoute, listaQ)
assert('travessão removida na saída', !/[—–]/.test(dashOut))

const linkBody = 'Calculadora de água — https://ylada.com/l/demo — educativo'
const linkParsed = parseLinkParaEnviarSection(linkBody)
assert('link parse: url', linkParsed?.url === 'https://ylada.com/l/demo')
assert('link format: sem travessão', !/[—–]/.test(formatLinkParaEnviarBody(linkBody)))
assert('link format: nome:url', formatLinkParaEnviarBody(linkBody).startsWith('Calculadora de água: https://'))

const multiLinkBody = `Água: https://ylada.com/l/agua
Oportunidade: https://ylada.com/l/opp

Use conforme o perfil.`
const multiLinks = parseAllLinksParaEnviarSection(multiLinkBody)
assert('multi link: dois URLs', multiLinks.length === 2)
assert('multi link: primeiro', multiLinks[0]?.url === 'https://ylada.com/l/agua')
assert('multi link: segundo', multiLinks[1]?.url === 'https://ylada.com/l/opp')
assert('multi link: labels', multiLinks[0]?.label === 'Água' && multiLinks[1]?.label === 'Oportunidade')

console.log(`\n=== ${ok} ok, ${fail} falhas ===`)
process.exit(fail > 0 ? 1 : 0)
