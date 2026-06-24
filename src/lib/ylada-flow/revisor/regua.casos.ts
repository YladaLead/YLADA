/**
 * Casos: a Régua virada código (revisor base).
 * Rodar: npx tsx src/lib/ylada-flow/revisor/regua.casos.ts
 */
import type { YladaFlow } from '@/types/ylada-flow'
import { avaliarFluxo } from './regua'
import { FLUXOS_VENDAS } from '@/lib/ylada-flow/bibliotecas/vendas'
import { FLUXOS_RECRUTAMENTO } from '@/lib/ylada-flow/bibliotecas/recrutamento'
import { FLUXO_ESPELHO_CONVICCAO } from '@/lib/ylada-flow/bibliotecas/espelho/conviccao'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const VEREDITOS = new Set(['passa', 'morno', 'reprova'])
const parte = (l: ReturnType<typeof avaliarFluxo>, nome: string) =>
  l.porParte.find((p) => p.parte === nome)!

// 1) Todo fluxo real da biblioteca produz um laudo bem-formado.
{
  const todos = [...FLUXOS_VENDAS, ...FLUXOS_RECRUTAMENTO]
  for (const f of todos) {
    const l = avaliarFluxo(f)
    assert(VEREDITOS.has(l.veredito), `${f.id}: veredito válido (${l.veredito})`)
    assert(l.porParte.length === 5, `${f.id}: 5 partes avaliadas`)
  }
}

// 2) Fluxos migrados (afiados pela régua) não REPROVAM na estrutura.
//    Foram construídos com papel declarado + devolutiva completa → perguntas/devolutiva
//    nunca em 'reprova' (podem ficar 'morno' por tom/CTA, e tudo bem).
{
  const amostra = [FLUXOS_VENDAS[0], FLUXOS_RECRUTAMENTO[0]].filter(Boolean) as YladaFlow[]
  for (const f of amostra) {
    const l = avaliarFluxo(f)
    assert(parte(l, 'perguntas').veredito !== 'reprova', `${f.id}: perguntas não reprovam (têm papel)`)
    assert(parte(l, 'devolutiva').veredito !== 'reprova', `${f.id}: devolutiva não reprova (5 campos)`)
  }
}

// 3) A régua PEGA pergunta sem papel (regra dura §3.1 → reprova).
{
  const f = JSON.parse(JSON.stringify(FLUXOS_VENDAS[0])) as YladaFlow
  f.perguntas[0].papel = {} // tira o papel da 1ª pergunta
  const l = avaliarFluxo(f)
  assert(parte(l, 'perguntas').veredito === 'reprova', 'pergunta sem papel → perguntas REPROVA')
  assert(l.veredito === 'reprova' && l.migravel === false, 'fluxo inteiro reprova e não é migrável')
}

// 4) A régua PEGA devolutiva quebrada (faltando um dos campos → reprova).
{
  const f = JSON.parse(JSON.stringify(FLUXOS_VENDAS[0])) as YladaFlow
  const algumPerfil = Object.keys(f.devolutiva.porPerfil)[0]
  f.devolutiva.porPerfil[algumPerfil].espelho = ''
  const l = avaliarFluxo(f)
  assert(parte(l, 'devolutiva').veredito === 'reprova', 'devolutiva sem espelho → REPROVA')
}

// 5) A régua PEGA promessa de renda em recrutamento (anti-vício §5 → reprova).
{
  const f = JSON.parse(JSON.stringify(FLUXOS_RECRUTAMENTO[0])) as YladaFlow
  const algumPerfil = Object.keys(f.devolutiva.porPerfil)[0]
  f.devolutiva.porPerfil[algumPerfil].causa = 'Você vai ganhar R$ 5.000 por mês, renda garantida.'
  const l = avaliarFluxo(f)
  assert(parte(l, 'linguagem').veredito === 'reprova', 'promessa de renda → linguagem REPROVA')
}

// 6) O Espelho (Sujeito A) NÃO tem parte de salvaguarda (exceção declarada).
{
  const l = avaliarFluxo(FLUXO_ESPELHO_CONVICCAO)
  assert(
    l.porParte.every((p) => p.parte !== 'salvaguarda'),
    'Espelho: sem parte de salvaguarda (não é fluxo de lead)'
  )
  assert(l.porParte.length === 4, 'Espelho: 4 partes (sem salvaguarda)')
}

console.log('\n✅ Régua (revisor base) — casos verdes.')
