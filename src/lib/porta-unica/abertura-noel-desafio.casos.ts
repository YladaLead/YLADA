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
    // Passo 2: convergência pra ação (parar de interrogar, ir pro rascunho)
    assert.match(bloco, /CONVERG[ÊE]NCIA PRA AÇÃO/i)
    assert.match(bloco, /PARE de perguntar/i)
    // Passo 2: líder = equipar a equipe + os 2 caminhos (self-serve + ambiente exclusivo/contato)
    assert.match(bloco, /EQUIPA cada pessoa do time/i)
    assert.match(bloco, /DOIS caminhos/i)
    assert.match(bloco, /AMBIENTE EXCLUSIVO/i)
    assert.match(bloco, /FALAR COM O NOSSO TIME/i)
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
  // Passo 4: anti-alucinação de URL (quem gera o link é o SISTEMA, nunca a IA)
  assert.match(g, /QUEM GERA O LINK É O SISTEMA/i)
  assert.match(g, /NUNCA.*(inventa|exemplifica).*URL|JAMAIS escreve/i)
  // Passo 2: o grande diferencial (funil de vendas × funil de marketing) + Noel monta o material
  assert.match(g, /FUNIL DE VENDAS/i)
  assert.match(g, /FUNIL DE MARKETING/i)
  assert.match(g, /movimento antes da certeza/i)
  assert.match(g, /criativos/i)
  assert.match(g, /cuido do material/i)
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
  // Passo 2: exemplo do líder (funil de marketing + equipar + os 2 caminhos)
  assert.match(fs, /funil de marketing/i)
  assert.match(fs, /equipa cada vendedor/i)
  assert.match(fs, /ambiente exclusivo/i)
  assert.match(fs, /criativos/i)
  assert.ok(!fs.includes('—'), 'few-shot não deve ter travessão de aparte')
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
