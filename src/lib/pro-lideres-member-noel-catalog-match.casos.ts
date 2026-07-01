/**
 * Casos: match de catálogo Noel membro.
 * Rodar: npm run test:noel-membro-catalog-match
 */
import {
  matchProLideresMemberNoelCatalog,
  parseProLideresMemberNoelCatalogLines,
} from '@/lib/pro-lideres-member-noel-catalog-match'

const excerpt = [
  '- **Mães que Querem Trabalhar de Casa** — https://ylada.com/l/a',
  '- **Oportunidade — Conheça o Projeto** — https://ylada.com/l/b',
  '- **Calculadora IMC** — https://ylada.com/l/c',
].join('\n')

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

assert('parse 3 linhas', parseProLideresMemberNoelCatalogLines(excerpt).length === 3)

const projeto = matchProLideresMemberNoelCatalog(
  'Qual link eu mando pra alguém que quer conhecer melhor o projeto?',
  excerpt
)
assert('projeto: top é oportunidade', projeto[0]?.label.includes('Oportunidade') === true)
assert(
  'projeto: não chuta mães casa',
  projeto[0]?.label !== 'Mães que Querem Trabalhar de Casa'
)

const lista = matchProLideresMemberNoelCatalog('Tenho 8 nomes na lista', excerpt)
assert('lista sem link: vazio', lista.length === 0)

console.log(`\n${ok} ok, ${fail} fail`)
process.exit(fail > 0 ? 1 : 0)
