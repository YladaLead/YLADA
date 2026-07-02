/**
 * Casos da camada de princípios da Inteligência de Convicção.
 * Rodar: npx tsx src/lib/pro-lideres-noel-principios-conviccao.casos.ts
 */
import {
  construirBlocoPrincipiosConviccao,
  construirBlocoFormatoCurto,
  FORMATO_LEMBRETE_CURTO,
  isNoelPrincipiosConviccaoEnabled,
} from '@/lib/pro-lideres-noel-principios-conviccao'

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

const bloco = construirBlocoPrincipiosConviccao()

assert('tem o norte da AÇÃO', /NORTE[\s\S]*AGIR/.test(bloco) && bloco.includes('AÇÃO executável'))
assert('operação é variável (não presumir Herbalife)', /OPERAÇÃO É VARIÁVEL/.test(bloco) && /Nunca presuma Herbalife/.test(bloco))
assert('lê a situação real (como ela te vê)', bloco.includes('como ela te vê'))
assert('12 princípios presentes', /^12\./m.test(bloco) && /^1\./m.test(bloco))
assert('servir antes de vender', bloco.includes('Servir antes de vender'))
assert('20/80', bloco.includes('20/80'))
assert('educar + certificar', /EDUCAR \+ CERTIFICAR/.test(bloco) && bloco.includes('quer que eu aprofunde'))
assert('voz: proíbe palestra motivacional', /palestra motivacional/i.test(bloco))
assert('produto nunca abre a conversa', bloco.includes('Produto nunca abre a conversa'))

// Bloco de formato curto (anti-palestra)
const formato = construirBlocoFormatoCurto()
assert('formato: obrigatório e curto', /FORMATO.*OBRIGATÓRIO/.test(formato) && /6 frases/.test(formato))
assert('formato: proíbe "Na prática"/lista longa', /Na prática/.test(formato) && /PROIBIDO/.test(formato))
assert('lembrete curto existe e é curto', /LEMBRETE DE FORMATO/.test(FORMATO_LEMBRETE_CURTO) && FORMATO_LEMBRETE_CURTO.length < 400)

// Flag OFF por padrão
const prev = process.env.NOEL_PL_PRINCIPIOS_CONVICCAO_ENABLED
delete process.env.NOEL_PL_PRINCIPIOS_CONVICCAO_ENABLED
assert('flag default OFF', !isNoelPrincipiosConviccaoEnabled())
process.env.NOEL_PL_PRINCIPIOS_CONVICCAO_ENABLED = 'true'
assert('flag ON com true', isNoelPrincipiosConviccaoEnabled())
if (prev === undefined) delete process.env.NOEL_PL_PRINCIPIOS_CONVICCAO_ENABLED
else process.env.NOEL_PL_PRINCIPIOS_CONVICCAO_ENABLED = prev

console.log(`\n${ok} ok, ${fail} fail`)
process.exit(fail > 0 ? 1 : 0)
