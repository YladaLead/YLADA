/**
 * Casos da camada de divulgação do Noel do membro.
 * Rodar: npx tsx src/lib/pro-lideres-member-divulgacao.casos.ts
 */
import {
  isDivulgacaoIntent as div,
  isNoelPlMemberDivulgacaoEnabled,
  construirBlocoDivulgacaoParaPrompt,
} from '@/lib/pro-lideres-member-divulgacao'

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

// É divulgação
assert('onde/como divulgo o link', div('Acabei de criar o link. Onde e como eu divulgo pra atrair as pessoas certas?') === true)
assert('o que postar no story', div('Não sei o que postar hoje no story. Me dá uma ideia e uma legenda curta.') === true)
assert('status do whats', div('Me dá uma frase pro status do whats pra chamar atenção') === true)
assert('como espalho', div('Como eu espalho isso pra mais gente ver?') === true)

// NÃO é divulgação (é criação / mentoria)
assert('criar diagnóstico não é divulgação', div('Cria um diagnóstico de sono pra eu mandar') === false)
assert('objeção não é divulgação', div('A cliente disse que tá caro, o que faço?') === false)

// Bloco
const bloco = construirBlocoDivulgacaoParaPrompt()
assert('bloco: não gerar quiz', /NÃO gere link nem quiz/i.test(bloco))
assert('bloco: canais + bordão', /Instagram/.test(bloco) && /status do WhatsApp/i.test(bloco) && /cuido do material/.test(bloco))

// Flag OFF por padrão
const prev = process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED
delete process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED
assert('flag default OFF', !isNoelPlMemberDivulgacaoEnabled())
process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED = 'true'
assert('flag ON com true', isNoelPlMemberDivulgacaoEnabled())
if (prev === undefined) delete process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED
else process.env.NOEL_PL_MEMBER_DIVULGACAO_ENABLED = prev

console.log(`\n${ok} ok, ${fail} fail`)
process.exit(fail > 0 ? 1 : 0)
