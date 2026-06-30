/**
 * Casos (puro, sem I/O) do Passo 4: gatilho de geração + texto enriquecido do interpret.
 * Rodar: npx tsx src/lib/porta-unica/conducao-geracao.casos.ts
 */
import assert from 'node:assert'
import type { DesafioResposta } from './desafio'
import {
  deveGerarNaConducao,
  mensagemEhAprovacao,
  construirTextoInterpretConducao,
} from './conducao-geracao'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

const noelPediuWhats = {
  role: 'assistant',
  content: 'Show. Antes de eu gerar o link, me passa seu WhatsApp com DDD?',
}
const noelMostrouRascunho = {
  role: 'assistant',
  content: '**1. O que mais te incomoda na pele?**\nA) manchas\nB) flacidez\nC) rugas\nD) oleosidade\n\nFicou bom assim, ou quer ajustar alguma pergunta?',
}

caso('NÃO gera sem histórico (ainda conduzindo)', () => {
  assert.strictEqual(deveGerarNaConducao({ message: 'pode gerar', conversationHistory: [] }), false)
})

caso('NÃO gera quando o Noel só perguntou o nicho (cedo demais)', () => {
  const hist = [{ role: 'assistant', content: 'Pra eu acertar, me conta: o que você faz?' }]
  assert.strictEqual(deveGerarNaConducao({ message: 'tenho clínica de estética', conversationHistory: hist }), false)
})

caso('GERA quando o Noel pediu WhatsApp e a pessoa mandou o número', () => {
  assert.strictEqual(
    deveGerarNaConducao({ message: '19 98186-8000', conversationHistory: [noelPediuWhats] }),
    true
  )
})

caso('NÃO gera se o Noel pediu WhatsApp mas a pessoa não mandou número', () => {
  assert.strictEqual(
    deveGerarNaConducao({ message: 'ué, pra que meu whatsapp?', conversationHistory: [noelPediuWhats] }),
    false
  )
})

caso('GERA quando o Noel mostrou o rascunho e a pessoa aprovou (whats já no perfil)', () => {
  assert.strictEqual(
    deveGerarNaConducao({ message: 'ficou ótimo', conversationHistory: [noelMostrouRascunho] }),
    true
  )
  assert.strictEqual(
    deveGerarNaConducao({ message: 'pode gerar', conversationHistory: [noelMostrouRascunho] }),
    true
  )
})

caso('mensagemEhAprovacao reconhece os "ok/gera" e rejeita pergunta/recusa', () => {
  for (const ok of ['sim', 'perfeito', 'ficou ótimo', 'pode gerar', 'gera', 'manda', 'show', 'adorei']) {
    assert.ok(mensagemEhAprovacao(ok), `deveria aprovar: ${ok}`)
  }
  for (const nao of ['como funciona?', 'não gostei', 'troca a pergunta 2', 'tenho clínica de estética']) {
    assert.ok(!mensagemEhAprovacao(nao), `não deveria aprovar: ${nao}`)
  }
})

caso('texto do interpret costura nicho/foco + objetivo (como nota interna)', () => {
  const desafio: DesafioResposta = { key: 'atrair', texto: null }
  const hist = [
    { role: 'assistant', content: 'o que você faz?' },
    { role: 'user', content: 'tenho clínica de estética' },
    { role: 'assistant', content: 'qual o carro-chefe?' },
    { role: 'user', content: 'facial, foco em rejuvenescimento' },
    { role: 'assistant', content: 'me passa seu WhatsApp com DDD?' },
    { role: 'user', content: '19 98186-8000' },
  ]
  const texto = construirTextoInterpretConducao({ desafio, conversationHistory: hist })
  assert.match(texto, /atrair mais clientes/i) // objetivo presente (na nota interna)
  assert.match(texto, /cl[íi]nica de est[ée]tica/i)
  assert.match(texto, /rejuvenescimento/i)
  // o número de WhatsApp e o starter não entram no texto (ruído)
  assert.ok(!/98186/.test(texto), 'número de WhatsApp vazou pro texto do interpret')
})

caso('texto SEMPRE vira pro ponto de vista do CLIENTE (não do negócio do dono)', () => {
  const texto = construirTextoInterpretConducao({
    desafio: { key: 'vender', texto: null },
    conversationHistory: [{ role: 'user', content: 'vendo semijoias pelo instagram' }],
  })
  assert.match(texto, /COMPARTILHAR/i)
  assert.match(texto, /ponto de vista do CLIENTE/i)
  assert.match(texto, /NUNCA sobre o meu neg[óo]cio/i)
  assert.match(texto, /N[ÃA]O deve aparecer nas perguntas/i) // objetivo do dono fica como nota interna
})

caso('equipe vira pro ponto de vista do MEMBRO, não do líder', () => {
  const texto = construirTextoInterpretConducao({
    desafio: { key: 'equipe', texto: null },
    conversationHistory: [{ role: 'user', content: 'tenho um time de revendedores' }],
  })
  assert.match(texto, /equipe|membro|vendedor/i)
  assert.match(texto, /ponto de vista de QUEM RESPONDE/i)
  assert.match(texto, /NUNCA do ponto de vista do l[íi]der/i)
})

caso('texto do interpret usa o texto livre no desafio "outro" (como objetivo interno)', () => {
  const desafio: DesafioResposta = { key: 'outro', texto: 'minha agenda vive vazia' }
  const texto = construirTextoInterpretConducao({ desafio, conversationHistory: [] })
  assert.match(texto, /minha agenda vive vazia/)
})

caso('texto sem respostas ainda traz a moldura de compartilhar + objetivo', () => {
  const desafio: DesafioResposta = { key: 'vender', texto: null }
  const texto = construirTextoInterpretConducao({ desafio, conversationHistory: [{ role: 'user', content: 'oi' }] })
  assert.match(texto, /COMPARTILHAR/i)
  assert.match(texto, /vender mais/i) // objetivo na nota interna
  assert.ok(!/Meu nicho/i.test(texto), 'sem respostas substantivas, não inventa "Meu nicho"')
})

console.log(`\n${passou} casos verdes.`)
