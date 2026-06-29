/**
 * Casos: sanitização determinística da saída do Noel (travessão).
 * Rodar: npx tsx src/lib/noel-output-sanitize.casos.ts
 */
import { replaceNoelEmDashInText, sanitizeNoelAssistantOutput } from './noel-output-sanitize'

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

assert('espaço-travessão-espaço vira vírgula', replaceNoelEmDashInText('Faz sentido — lista grande') === 'Faz sentido, lista grande')
assert('travessão colada vira vírgula', replaceNoelEmDashInText('antes—depois') === 'antes, depois')
assert('sem travessão intacto', replaceNoelEmDashInText('Olá mundo') === 'Olá mundo')
assert(
  'sanitize remove todas as travessões',
  !/[—–]/.test(sanitizeNoelAssistantOutput('A — B — C e também—colado'))
)
assert('sanitize preserva URL', sanitizeNoelAssistantOutput('Link: https://ylada.com/l/demo').includes('https://ylada.com/l/demo'))

console.log(`\n=== ${ok} ok, ${fail} falhas ===`)
process.exit(fail > 0 ? 1 : 0)
