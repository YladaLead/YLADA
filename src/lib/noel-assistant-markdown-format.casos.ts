/**
 * Casos: formatação determinística do markdown do Noel (prévia quiz + âncora de link).
 * Rodar: npx tsx src/lib/noel-assistant-markdown-format.casos.ts
 */
import {
  noelAssistantMarkdownHasPublicLinkAnchor,
  renumberNoelQuizPreviewQuestions,
  separateNoelPublicLinkAnchorLine,
  collapseDuplicateNoelPublicLinkAnchors,
  softenNoelDecorativeHorizontalRules,
  flattenNoelRigidSectionLabels,
  stripNoelBracketPlaceholders,
  stripNoelTemplateInstructionLines,
  cleanupOrphanMarkdownSectionColons,
  reflowNoelColonBulletLines,
  ensureProseParagraphBreaks,
  splitNoelDenseParagraphsForMobile,
  polishNoelAssistantMarkdownForChat,
  noelAssistantMarkdownHasRenderableText,
  shouldRenumberNoelQuizPreviewOnes,
} from './noel-assistant-markdown-format'

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

const PREVIEW_REPETIDA = `Rascunho do diagnóstico:

1. Como você tem dormido ultimamente?
A) Bem
B) Mal

1. Qual horário você costuma deitar?
A) Antes das 22h
B) Depois da meia-noite`

const PREVIEW_CORRIGIDA = renumberNoelQuizPreviewQuestions(PREVIEW_REPETIDA)

assert('detecta vários "1." na prévia', shouldRenumberNoelQuizPreviewOnes(PREVIEW_REPETIDA))
assert('renumera prévia: pergunta 2', PREVIEW_CORRIGIDA.includes('**2. Qual horário'))
assert('renumera prévia: pergunta 1 intacta', PREVIEW_CORRIGIDA.includes('**1. Como você tem dormido'))
assert('não renumera lista 1–2–3 normal', !shouldRenumberNoelQuizPreviewOnes('1. Passo um\n2. Passo dois'))

const CANONICO = `### Quiz e link (oficial)
**1. Pergunta A**
A) x
B) y

**2. Pergunta B**
A) x
B) y`
assert('bloco canônico já numerado: sem toque', renumberNoelQuizPreviewQuestions(CANONICO) === CANONICO)

const LINK_COLADO = 'Pronto! **Calculadora de Sono**,[Acessar diagnóstico](https://ylada.com/l/abc)'
const LINK_SEPARADO = separateNoelPublicLinkAnchorLine(LINK_COLADO)
assert('link: quebra após vírgula', LINK_SEPARADO.includes('\n\n[Acessar diagnóstico]'))
assert('link: detecta âncora pública', noelAssistantMarkdownHasPublicLinkAnchor(LINK_COLADO))

const LINK_SEM_VIRGULA = 'Tema: Calculadora de Sono[Acessar](https://ylada.com/l/x)'
assert(
  'link: quebra sem vírgula',
  separateNoelPublicLinkAnchorLine(LINK_SEM_VIRGULA).includes('Sono\n\n[Acessar')
)

const DUP_LINK =
  'Use este link:\n\n[Quiz: Ganhos](https://ylada.com/l/abc)\n\nMensagem:\n[Quiz: Ganhos](https://ylada.com/l/abc)'
const DEDUPED = collapseDuplicateNoelPublicLinkAnchors(DUP_LINK)
assert('link: dedupe mantém 1ª âncora', (DEDUPED.match(/\[Quiz: Ganhos\]\(/g) ?? []).length === 1)
assert('link: dedupe 2ª vira texto', DEDUPED.includes('Mensagem:\nQuiz: Ganhos'))

const COM_RISCOS = `Intro curta.

---

**Texto para Postagem:**

Corpo aqui.

---

Sugestões finais.`
const SEM_RISCOS = softenNoelDecorativeHorizontalRules(COM_RISCOS)
assert('hr: remove --- entre parágrafos', !SEM_RISCOS.includes('---'))
assert('hr: mantém texto', SEM_RISCOS.includes('Corpo aqui'))

const SO_RISCOS = '---\n\n---'
assert('hr: só riscos não renderiza', !noelAssistantMarkdownHasRenderableText(SO_RISCOS))

const QUIZ_COM_HR = `### Pergunta 1

A) x

---

### Pergunta 2

A) y`
const QUIZ_HR = softenNoelDecorativeHorizontalRules(QUIZ_COM_HR)
assert('hr: mantém antes de Pergunta 2', QUIZ_HR.includes('---\n\n### Pergunta 2'))

const TEMPLATE = `Intro.

**Texto para Postagem:**

Corpo do post aqui.

**Sugestões de Personalização:**

Ajuste o tom.`
const FLAT = flattenNoelRigidSectionLabels(TEMPLATE)
assert('rótulo: remove Texto para Postagem', !FLAT.includes('**Texto para Postagem:**'))
assert('rótulo: mantém corpo', FLAT.includes('Corpo do post aqui'))

const PLACEHOLDER = `🌟 **Você sabia que [insira uma dor comum]?**

👉 Clique [Seu link aqui]`
const NO_PH = polishNoelAssistantMarkdownForChat(PLACEHOLDER)
assert('placeholder: remove insira', !NO_PH.includes('[insira'))
assert('placeholder: remove seu link aqui', !NO_PH.includes('[Seu link aqui]'))

const COLON = `Intro

: Publique conteúdos que identifiquem`
const NO_COLON = cleanupOrphanMarkdownSectionColons(
  flattenNoelRigidSectionLabels(`**Conteúdo Engajador:**\n\n: Publique conteúdos que identifiquem`)
)
assert('colon: remove sobra após rótulo', !NO_COLON.includes(': Publique'))

const ATRAIR = `Para atrair mais clientes utilizando seu link, é fundamental criar uma estratégia que desperte interesse e envolvimento. Vamos lá:

: Publique conteúdos que identifiquem dores comuns.
: Ao compartilhar seu link, inclua uma chamada clara.
: Entenda quem são suas personas.`
const ATRAIR_POLISH = polishNoelAssistantMarkdownForChat(ATRAIR)
assert('atrair: sem : no início da linha', !/^:/m.test(ATRAIR_POLISH))
assert('atrair: parágrafos separados', ATRAIR_POLISH.includes('\n\nAo compartilhar seu link'))

const WALL = `Para atrair mais clientes utilizando seu link, é fundamental criar uma estratégia que desperte interesse. Compartilhe o link em redes sociais com contexto. Peça permissão antes de mandar. Acompanhe quem responde em 24 horas.`
const WALL_SPLIT = splitNoelDenseParagraphsForMobile(WALL)
assert('mobile: quebra parede de texto', WALL_SPLIT.includes('\n\n'))

console.log(`\n=== ${ok} ok, ${fail} falhas ===`)
process.exit(fail > 0 ? 1 : 0)
