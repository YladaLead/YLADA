/**
 * Casos (puro, sem I/O) da camada de mentoria do dia a dia.
 * Rodar: npx tsx src/lib/porta-unica/noel-dia-a-dia.casos.ts
 */
import assert from 'node:assert'
import {
  pedeOrientacaoDiaADia,
  precisaMentoriaDiaADia,
  estaPosAtivacao,
  jaConduziuDiaADia,
  construirBlocoMentoriaDiaADiaParaPrompt,
} from './noel-dia-a-dia'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('pedeOrientacaoDiaADia pega os pedidos do dia a dia', () => {
  for (const m of [
    'o que eu faço hoje?',
    'minha agenda tá vazia',
    'não tenho cliente essa semana',
    'o que eu posto no instagram?',
    'como melhoro minha bio',
    'o que eu falo quando chega no direct?',
    'qual minha meta desse mês',
    'quero mais clientes',
    'chega cheio de curioso que só pergunta preço',
  ]) {
    assert.ok(pedeOrientacaoDiaADia(m), `deveria pedir orientação: ${m}`)
  }
})

caso('pedeOrientacaoDiaADia rejeita conversa que não é orientação', () => {
  for (const m of ['oi', 'obrigado!', 'ficou ótimo', '19 98186-8000']) {
    assert.ok(!pedeOrientacaoDiaADia(m), `não deveria pedir orientação: ${m}`)
  }
})

caso('precisaMentoriaDiaADia SÓ dispara pós-ativação (tem link ativo)', () => {
  // Mesmo pedido de orientação, mas SEM link ativo e SEM histórico (entrada) → não dispara.
  assert.strictEqual(precisaMentoriaDiaADia({ message: 'o que eu faço hoje?', temLinkAtivo: false }), false)
  // Pós-ativação + pedido de orientação → dispara.
  assert.strictEqual(precisaMentoriaDiaADia({ message: 'o que eu faço hoje?', temLinkAtivo: true }), true)
})

caso('estaPosAtivacao pega link entregue no HISTÓRICO (cobre o lab isolado, sem link na conta)', () => {
  const hist = [
    { role: 'user', content: 'vamos' },
    { role: 'assistant', content: 'Pronto! [Acessar diagnóstico](https://ylada.com/l/abc123)' },
    { role: 'user', content: 'e agora, o que eu faço hoje?' },
  ]
  assert.ok(estaPosAtivacao({ temLinkAtivo: false, conversationHistory: hist }))
  assert.ok(!estaPosAtivacao({ temLinkAtivo: false, conversationHistory: [{ role: 'assistant', content: 'oi, tudo bem?' }] }))
  // no lab (sem link na conta) mas com link no histórico + pedido → dispara
  assert.strictEqual(
    precisaMentoriaDiaADia({ message: 'o que eu faço hoje?', temLinkAtivo: false, conversationHistory: hist }),
    true
  )
})

caso('precisaMentoriaDiaADia não dispara em conversa fora do tema mesmo com link ativo', () => {
  assert.strictEqual(precisaMentoriaDiaADia({ message: 'valeu, adorei!', temLinkAtivo: true }), false)
})

caso('jaConduziuDiaADia detecta que o bloco já apareceu (evita repetir a aula)', () => {
  const hist = [
    { role: 'user', content: 'o que faço hoje?' },
    { role: 'assistant', content: 'Vamos pela prioridade: sua agenda vazia pede atração. Me chama no Direct...' },
  ]
  assert.ok(jaConduziuDiaADia(hist))
  assert.ok(!jaConduziuDiaADia([{ role: 'assistant', content: 'Oi, tudo bem?' }]))
})

caso('bloco do dia a dia traz os 7 princípios (prioridade → líder 3 Es)', () => {
  const b = construirBlocoMentoriaDiaADiaParaPrompt()
  assert.match(b, /PRIORIDADE GOVERNA O DIA/)
  assert.match(b, /CANAL CERTO/)
  assert.match(b, /me chama no Direct/i)
  assert.match(b, /META = A[ÇC][ÃA]O NA PRIORIDADE/i)
  assert.match(b, /VI[ÉE]S PRA A[ÇC][ÃA]O/i)
  assert.match(b, /CERTIFICA[ÇC][ÃA]O em 3 etapas/i)
  assert.match(b, /buyer persona/i)
  assert.match(b, /3 Es: Educar, Entusiasmar, Edificar/)
  // sem pressão/escassez (régua)
  assert.match(b, /NUNCA press[ãa]o, escassez falsa/i)
})

caso('bloco não usa travessão de aparte (voz)', () => {
  const b = construirBlocoMentoriaDiaADiaParaPrompt()
  assert.ok(!/ — |—/.test(b.replace(/\[[^\]]*\]/g, '')), 'não deve ter travessão de aparte fora dos rótulos')
})

console.log(`\n${passou} casos verdes.`)
