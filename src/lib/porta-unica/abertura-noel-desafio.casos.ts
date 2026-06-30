/**
 * Casos (puro, sem I/O) do toque "b": abertura do Noel + bloco do prompt.
 * Rodar: npx tsx src/lib/porta-unica/abertura-noel-desafio.casos.ts
 */
import assert from 'node:assert'
import { DESAFIO_OPCOES, type DesafioResposta } from './desafio'
import {
  aberturaNoelDoDesafio,
  construirBlocoDesafioParaPrompt,
  construirBlocoGeracaoToolParaPrompt,
  construirBlocoFewShotConducaoParaPrompt,
  normalizarDesafioRecebido,
} from './abertura-noel-desafio'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('toda chave tem abertura não vazia', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const texto = aberturaNoelDoDesafio({ key, texto: null })
    assert.ok(texto.trim().length > 0, `vazia para ${key}`)
  }
})

caso('recepção se apresenta + reconhece o desafio (sem re-perguntar)', () => {
  // âncoras frouxas (o conceito, não a copy exata) — a voz pode ser afinada sem quebrar o teste
  assert.match(aberturaNoelDoDesafio({ key: 'atrair', texto: null }), /gerar mais contatos/i)
  assert.match(aberturaNoelDoDesafio({ key: 'vender', texto: null }), /comprar o que você vende/i)
  assert.match(aberturaNoelDoDesafio({ key: 'equipe', texto: null }), /sua equipe/i)
})

caso('toda recepção diz quem é o Noel e fecha convidando a começar', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const texto = aberturaNoelDoDesafio({ key, texto: 'x' })
    assert.match(texto, /eu sou o Noel/i, `sem apresentação em ${key}`)
    assert.match(texto, /começ/i, `sem convite a começar em ${key}`)
  }
})

caso('outro costura o texto da pessoa', () => {
  const r: DesafioResposta = { key: 'outro', texto: 'minha agenda vive vazia' }
  assert.match(aberturaNoelDoDesafio(r), /minha agenda vive vazia/)
})

caso('outro sem texto cai no acolhimento genérico', () => {
  assert.match(aberturaNoelDoDesafio({ key: 'outro', texto: null }), /incomodando/i)
})

caso('resposta nula/ inválida devolve vazio (chamador não injeta nada)', () => {
  assert.strictEqual(aberturaNoelDoDesafio(null), '')
  assert.strictEqual(construirBlocoDesafioParaPrompt(null), '')
  // chave inválida vinda do body do request
  assert.strictEqual(aberturaNoelDoDesafio({ key: 'xpto' as never, texto: null }), '')
})

caso('bloco do prompt manda conduzir e proíbe re-perguntar', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const bloco = construirBlocoDesafioParaPrompt({ key, texto: key === 'outro' ? 'x' : null })
    assert.match(bloco, /DESAFIO DECLARADO/)
    assert.match(bloco, /NÃO re-pergunte/)
    assert.match(bloco, /diagnóstico do dono/i)
    // reforço: entender nicho/público antes de gerar (não gerar genérico)
    assert.match(bloco, /ANTES de gerar/i)
    assert.match(bloco, /nicho/i)
    assert.match(bloco, /gen[ée]rico/i)
    // não assumir nicho amplo (perguntar o foco) + explicar a lógica antes de gerar
    assert.match(bloco, /amplo/i)
    assert.match(bloco, /carro-chefe|foco/i)
    assert.match(bloco, /l[óo]gica/i)
    // estabelecer o objetivo do tool (os 4 estágios) + dosado, não formulário
    assert.match(bloco, /OBJETIVO/)
    assert.match(bloco, /reativar/i)
    assert.match(bloco, /indica/i)
    assert.match(bloco, /DOSADO|uma coisa por vez|UMA coisa por vez/i)
    // exemplo concreto ("na prática:") trazido do líder
    assert.match(bloco, /na prática/i)
    assert.match(bloco, /exemplo/i)
    // explicação vende o valor: autoridade + diagnóstico + botão pro WhatsApp + ensina depois
    assert.match(bloco, /AUTORIDADE/)
    assert.match(bloco, /DIAGNÓSTICO/)
    assert.match(bloco, /SEU WhatsApp/)
  }
})

caso('bloco de GERAÇÃO traz as regras do líder (copy pro leitor + coerência + coleta OFF)', () => {
  const g = construirBlocoGeracaoToolParaPrompt()
  assert.match(g, /COPY PRO LEITOR/)
  assert.match(g, /NUNCA exp[õo]em o objetivo interno/i)
  assert.match(g, /COER[ÊE]NCIA POR OBJETIVO/)
  assert.match(g, /colher indicações = VIRAL|VIRAL \/ COMPARTILHAR/i)
  assert.match(g, /COLETA DE DADOS: default OFF/i)
  assert.match(g, /NUNCA peça nome, telefone/i)
  // aprovação antes do link final (preview → aprova/ajusta → gera, como o líder)
  assert.match(g, /APROVAÇÃO ANTES DO LINK/i)
  assert.match(g, /Só gere\/entregue o LINK depois que a pessoa aprovar/i)
})

caso('few-shot tem 3 exemplos que modelam o padrão (foco, objetivo, lógica, indicação viral, dúvida primeiro)', () => {
  const fs = construirBlocoFewShotConducaoParaPrompt()
  assert.match(fs, /EXEMPLOS DE CONDUÇÃO/)
  assert.match(fs, /NÃO copie o conteúdo literal/i)
  assert.match(fs, /carro-chefe/i) // pergunta o foco quando o nicho é amplo
  assert.match(fs, /atrair gente nova ou pra reativar/i) // confirma o objetivo
  assert.match(fs, /Na prática/i) // exemplo concreto
  assert.match(fs, /compartilha|passar pra frente/i) // indicação = viral
  assert.match(fs, /Sem formulário pedindo nome/i) // coleta off
  assert.match(fs, /Respondendo a sua/i) // responde a dúvida primeiro
  assert.match(fs, /me passa seu WhatsApp com DDD/i) // WhatsApp na ação
  assert.match(fs, /diagnóstico/i) // vocabulário: diagnóstico, não "quiz"
  assert.match(fs, /autoridade/i) // explica o valor (autoridade)
  assert.match(fs, /Ficou bom assim/i) // modela a aprovação antes do link
  assert.ok(!/\bquiz\b/i.test(fs), 'few-shot não deve usar a palavra "quiz"')
})

caso('normalizarDesafioRecebido limpa o body cru', () => {
  assert.deepStrictEqual(normalizarDesafioRecebido({ key: 'atrair', texto: null }), { key: 'atrair', texto: null })
  assert.deepStrictEqual(normalizarDesafioRecebido({ key: 'outro', texto: 'x' }), { key: 'outro', texto: 'x' })
  assert.strictEqual(normalizarDesafioRecebido({ key: 'invalida', texto: 'x' }), null)
  assert.strictEqual(normalizarDesafioRecebido(null), null)
  assert.strictEqual(normalizarDesafioRecebido('atrair'), null)
  assert.strictEqual(normalizarDesafioRecebido({ texto: 'sem key' }), null)
})

caso('zero travessão de aparte na abertura (voz; o bloco do prompt é scaffolding interno)', () => {
  for (const { key } of DESAFIO_OPCOES) {
    assert.ok(!aberturaNoelDoDesafio({ key, texto: 'x' }).includes('—'), `travessão em ${key}`)
  }
})

console.log(`\n${passou} casos verdes.`)
