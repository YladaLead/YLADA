/**
 * Agente 2 — Auditor do Noel
 *
 * Avalia a qualidade do diagnóstico capturado pelo Agente 1.
 * Critérios: Clareza, Personalização, Coerência, Impacto, Humanização.
 *
 * Uso:
 *   npm run agente:auditor
 *   (colar o diagnóstico quando pedido, ou passar por arquivo)
 *
 *   DIAGNOSTICO_FILE=ultimo-diag.txt npm run agente:auditor
 *   cat ultimo-diag.txt | npm run agente:auditor
 *
 * Com OPENAI_API_KEY: chama a API e imprime a tabela.
 * Sem: imprime o prompt para colar no ChatGPT.
 */

import * as fs from 'fs'
import * as readline from 'readline'

const PROMPT_AUDITOR = `Você é um auditor especialista em avaliação de diagnósticos gerados por IA.

Você receberá um diagnóstico criado por uma IA chamada Noel, usado em um SaaS chamado YLADA.

Seu objetivo é avaliar a qualidade desse diagnóstico como se fosse um profissional real lendo.

Avalie os seguintes critérios:

1. Clareza
O texto é fácil de entender? Está direto ou confuso?

2. Personalização
Parece feito para a pessoa ou genérico?

3. Coerência
O diagnóstico faz sentido como um todo?

4. Impacto
Gera reflexão? Faz a pessoa pensar "isso é pra mim"?

5. Humanização
Parece escrito por alguém humano ou por um robô?

Dê uma nota de 0 a 10 para cada critério.

Regras importantes:
- Seja direto
- Seja honesto (não tente "agradar")
- Se algo estiver ruim, explique o porquê
- Não reescreva o diagnóstico, apenas avalie

Formato obrigatório de resposta:

CRITÉRIO        | NOTA | OBSERVAÇÃO
Clareza         | X    | ...
Personalização  | X    | ...
Coerência       | X    | ...
Impacto         | X    | ...
Humanização     | X    | ...

No final da avaliação, gere também:

NOTA FINAL: X/10

CLASSIFICAÇÃO (escolha uma):
- Excelente (8–10)
- Médio (6–7)
- Fraco (<6)

RESUMO GERAL (1–2 linhas):
Explique rapidamente se esse diagnóstico está pronto para uso comercial ou não.

Agora avalie o seguinte diagnóstico:

`

async function lerDiagnostico(): Promise<string> {
  const file = process.env.DIAGNOSTICO_FILE || process.argv[2]
  if (file && fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf-8').trim()
  }
  if (process.stdin.isTTY) {
    console.log('Cole o diagnóstico (bloco DIAGNÓSTICO CAPTURADO) e termine com Ctrl+D (Mac/Linux) ou Ctrl+Z (Windows):\n')
    const rl = readline.createInterface({ input: process.stdin })
    const lines: string[] = []
    for await (const line of rl) lines.push(line)
    return lines.join('\n').trim()
  }
  const chunks: string[] = []
  for await (const chunk of process.stdin) chunks.push(chunk.toString())
  return chunks.join('').trim()
}

async function auditarComAPI(diagnostico: string): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log(PROMPT_AUDITOR + diagnostico)
    console.log('\n---\nSem OPENAI_API_KEY: cole o bloco acima no ChatGPT para avaliar.')
    return
  }
  const { default: OpenAI } = await import('openai')
  const openai = new OpenAI({ apiKey })
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: PROMPT_AUDITOR + '\n' + diagnostico },
    ],
    temperature: 0.3,
  })
  const text = res.choices[0]?.message?.content?.trim()
  if (text) {
    console.log('\n' + '='.repeat(72))
    console.log('AUDITORIA DO NOEL — Agente 2')
    console.log('='.repeat(72))
    console.log(text)
    console.log('='.repeat(72))
  } else {
    console.error('Resposta vazia da API.')
  }
}

async function main() {
  const diagnostico = await lerDiagnostico()
  if (!diagnostico) {
    console.error('Nenhum diagnóstico informado. Use DIAGNOSTICO_FILE=caminho ou pipe/stdin.')
    process.exit(1)
  }
  await auditarComAPI(diagnostico)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
