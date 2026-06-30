/**
 * Casos (puro, sem I/O) da coleta de contato na ação (item 3 Fase 2).
 * Rodar: npx tsx src/lib/porta-unica/coleta-contato-na-acao.casos.ts
 */
import assert from 'node:assert'
import {
  construirBlocoColetaContatoParaPrompt,
  noelPediuWhatsapp,
  extrairWhatsappDaMensagem,
  capturarWhatsappSeNoelPediu,
} from './coleta-contato-na-acao'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('bloco vazio quando nada falta (chamador não injeta nada)', () => {
  assert.strictEqual(construirBlocoColetaContatoParaPrompt(false, false), '')
})

caso('bloco pede WhatsApp na ação, não na entrada, e não re-pergunta o nome', () => {
  const bloco = construirBlocoColetaContatoParaPrompt(true, false)
  assert.match(bloco, /COLETA DE CONTATO NA AÇÃO/)
  assert.match(bloco, /SÓ no momento/)
  assert.match(bloco, /primeiro link, quiz ou handoff/)
  assert.match(bloco, /NÃO peça o número na abertura/)
  assert.match(bloco, /nome já veio do cadastro/)
})

caso('bloco do perfil só aparece quando falta perfil', () => {
  assert.ok(!construirBlocoColetaContatoParaPrompt(true, false).includes('ramo ou o papel'))
  assert.match(construirBlocoColetaContatoParaPrompt(false, true), /ramo ou o papel/)
  assert.match(construirBlocoColetaContatoParaPrompt(true, true), /ramo ou o papel/)
})

caso('a frase que o Noel DIZ não tem travessão de aparte (voz; o "—" do header é scaffolding)', () => {
  // O bloco é instrução interna; o "—" só aparece no rótulo da seção, como nos demais
  // prompt-layers ([MODO EXECUTOR — …]). A frase-exemplo que vai pro usuário é limpa.
  const exemplo = 'Antes de eu te entregar o seu link, me passa seu WhatsApp com DDD?'
  assert.match(construirBlocoColetaContatoParaPrompt(true, false), new RegExp(exemplo))
  assert.ok(!exemplo.includes('—'))
})

caso('noelPediuWhatsapp detecta o pedido (com e sem acento)', () => {
  assert.ok(noelPediuWhatsapp('Me passa seu WhatsApp com DDD?'))
  assert.ok(noelPediuWhatsapp('pra onde te mando os contatos que chegarem?'))
  assert.ok(noelPediuWhatsapp('me passa seu número com o DDD'))
  assert.ok(!noelPediuWhatsapp('Vamos criar seu primeiro diagnóstico?'))
  assert.ok(!noelPediuWhatsapp(null))
})

caso('extrairWhatsappDaMensagem devolve SEMPRE com DDI e rejeita lixo', () => {
  // BR sem DDI → ganha o 55 (senão o wa.me quebra)
  assert.strictEqual(extrairWhatsappDaMensagem('(19) 98186-8000'), '5519981868000')
  assert.strictEqual(extrairWhatsappDaMensagem('meu zap é 19 8186 8000'), '551981868000')
  // BR já com 55 → mantém
  assert.strictEqual(extrairWhatsappDaMensagem('+55 19 98186-8000'), '5519981868000')
  assert.strictEqual(extrairWhatsappDaMensagem('55 19 98186 8000'), '5519981868000')
  // Internacional (com +) → confia no DDI que veio
  assert.strictEqual(extrairWhatsappDaMensagem('+1 415 555 1234'), '14155551234')
  assert.strictEqual(extrairWhatsappDaMensagem('é 1234'), '') // curto demais
  assert.strictEqual(extrairWhatsappDaMensagem('pedido 000123456789012345'), '') // longo demais
  assert.strictEqual(extrairWhatsappDaMensagem(''), '')
})

caso('captura SÓ quando o Noel acabou de pedir (não pesca número solto)', () => {
  const history = [
    { role: 'user', content: 'quero um link' },
    { role: 'assistant', content: 'Antes de eu te entregar o link, me passa seu WhatsApp com DDD?' },
  ]
  assert.strictEqual(
    capturarWhatsappSeNoelPediu({ message: 'é (19) 98186-8000', conversationHistory: history }),
    '5519981868000'
  )
})

caso('NÃO captura quando a última fala do Noel não pediu o número', () => {
  const history = [
    { role: 'assistant', content: 'Esse quiz vai qualificar quem chega. Quer ajustar o CTA?' },
    { role: 'user', content: 'meu cliente gastou 19 98186 8000 reais no mês' },
  ]
  // último assistant não pediu whatsapp → mesmo com número na mensagem, ignora
  assert.strictEqual(
    capturarWhatsappSeNoelPediu({
      message: 'meu cliente gastou 19 98186 8000 reais no mês',
      conversationHistory: history,
    }),
    ''
  )
})

caso('sem histórico não captura', () => {
  assert.strictEqual(capturarWhatsappSeNoelPediu({ message: '19 98186-8000' }), '')
})

console.log(`\n${passou} casos verdes.`)
