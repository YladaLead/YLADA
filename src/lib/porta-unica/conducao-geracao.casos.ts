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
  corrigirFlowDaConducao,
  extrairPerguntasDoRascunho,
  perguntasDoUltimoRascunho,
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

caso('corrigirFlowDaConducao troca checklist por diagnóstico (sem nota), mantém os outros', () => {
  assert.strictEqual(corrigirFlowDaConducao('checklist_prontidao'), 'diagnostico_bloqueio')
  assert.strictEqual(corrigirFlowDaConducao('diagnostico_risco'), 'diagnostico_risco')
  assert.strictEqual(corrigirFlowDaConducao('calculadora_projecao'), 'calculadora_projecao')
})

caso('parser lê rascunho com opções INLINE (A/B/C na mesma linha)', () => {
  const rascunho = [
    'Diagnóstico — Você precisa de um implante?',
    '1. O que mais te incomoda quando se olha no espelho? A) Falta de dentes B) Dentes tortos C) Dificuldade em mastigar D) Outros',
    '2. Você já considerou um implante antes? A) Sim, estou pensando B) Não, nunca pensei C) Já pensei, mas desisti',
    '3. Qual sua maior preocupação? A) Custo B) Procedimento C) Tempo de recuperação D) Outros',
    'Ficou bom assim, ou quer ajustar?',
  ].join('\n')
  const p = extrairPerguntasDoRascunho(rascunho)
  assert.ok(p && p.length === 3, 'devia achar 3 perguntas')
  assert.match(p![0].label, /se olha no espelho/i)
  assert.ok(!/A\)/.test(p![0].label), 'label não deve conter "A)"')
  assert.strictEqual(p![0].options.length, 4)
  assert.ok(p![1].options.length === 4, 'pergunta de 3 opções é preenchida pra 4')
})

caso('parser lê rascunho com opções em BULLETS abaixo', () => {
  const rascunho = [
    '   1. O que mais te impede de prospectar?',
    '      * A) Falta de tempo',
    '      * B) Dificuldade em abordar',
    '      * C) Desmotivação',
    '      * D) Outro',
    '   2. Como você se sente ao vender?',
    '      * A) Confiante',
    '      * B) Inseguro',
    '      * C) Desmotivado',
    '   3. Qual sua maior motivação pra voltar?',
    '      * A) Metas financeiras',
    '      * B) Reconhecimento',
    '      * C) Crescimento',
  ].join('\n')
  const p = extrairPerguntasDoRascunho(rascunho)
  assert.ok(p && p.length === 3, 'devia achar 3 perguntas (bullets)')
  assert.match(p![0].label, /impede de prospectar/i)
  assert.strictEqual(p![0].options[0], 'Falta de tempo')
})

caso('parser devolve null pra texto que NÃO é quiz (script/mensagem) → fallback', () => {
  const script = 'Oi [Nome]! Estou feliz com seus resultados. Se conhece alguém que se beneficiaria, compartilhe!'
  assert.strictEqual(extrairPerguntasDoRascunho(script), null)
})

caso('parser devolve null com menos de 3 perguntas MCQ', () => {
  const rascunho = '1. Pergunta única? A) sim B) não C) talvez'
  assert.strictEqual(extrairPerguntasDoRascunho(rascunho), null)
})

caso('parser NÃO deixa traço/bullet sobrando na opção nem ** no título', () => {
  const rascunho = [
    '**1. O que você gostaria que fosse diferente?**',
    '   - A) Solução rápida e pacífica',
    '   - B) Compreensão mútua entre os envolvidos',
    '   - C) Acompanhamento jurídico constante',
    '2. Qual sua maior preocupação? A) Divórcio B) Guarda dos filhos C) Pensão',
    '3. Já buscou orientação? A) Sim B) Não C) Talvez',
  ].join('\n')
  const p = extrairPerguntasDoRascunho(rascunho)
  assert.ok(p && p.length === 3, 'devia achar 3 perguntas')
  assert.ok(!p![0].label.includes('*'), 'label não pode ter asterisco')
  for (const q of p!) {
    for (const opt of q.options) {
      assert.ok(!/[*]/.test(opt), `opção com asterisco: "${opt}"`)
      assert.ok(!/[-–—]\s*$/.test(opt), `opção com traço no fim: "${opt}"`)
    }
  }
  assert.strictEqual(p![0].options[0], 'Solução rápida e pacífica') // sem " -" no fim
})

caso('perguntasDoUltimoRascunho pega o rascunho mais recente do assistente', () => {
  const hist = [
    { role: 'user', content: 'vamos' },
    { role: 'assistant', content: 'Me conta: o que você faz?' },
    { role: 'user', content: 'sou dentista' },
    {
      role: 'assistant',
      content: [
        '1. O que mais te incomoda? A) Falta de dentes B) Dor C) Mastigação D) Outros',
        '2. Já pensou em implante? A) Sim B) Não C) Talvez',
        '3. Maior preocupação? A) Custo B) Dor C) Tempo D) Outros',
      ].join('\n'),
    },
    { role: 'user', content: 'ficou ótimo' },
  ]
  const p = perguntasDoUltimoRascunho(hist)
  assert.ok(p && p.length === 3, 'devia extrair as 3 do último rascunho')
})

console.log(`\n${passou} casos verdes.`)
