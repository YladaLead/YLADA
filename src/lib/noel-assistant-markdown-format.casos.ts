/**
 * Casos: formatação determinística do markdown do Noel (prévia quiz + âncora de link).
 * Rodar: npx tsx src/lib/noel-assistant-markdown-format.casos.ts
 */
import {
  noelAssistantMarkdownHasPublicLinkAnchor,
  renumberNoelQuizPreviewQuestions,
  separateNoelPublicLinkAnchorLine,
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

console.log(`\n=== ${ok} ok, ${fail} falhas ===`)
process.exit(fail > 0 ? 1 : 0)
