/**
 * Agente 3 — Otimizador do Noel (modo LAB)
 *
 * Compara ORIGINAL vs OTIMIZADO.
 * Recebe: diagnóstico original + auditoria do Agente 2.
 * Gera versão otimizada (mais clareza, impacto, humanização) sem inventar nada.
 *
 * Uso:
 *   npm run agente:otimizador
 *   (usa ultimo-diag.txt e ultima-auditoria.txt por padrão)
 *
 *   DIAGNOSTICO_FILE=diag.txt AUDITORIA_FILE=audit.txt npm run agente:otimizador
 *
 * Com OPENAI_API_KEY: chama a API e imprime ORIGINAL vs OTIMIZADO.
 * Sem: imprime o prompt para colar no ChatGPT.
 */

import * as fs from 'fs'

const PROMPT_OTIMIZADOR = `Você é um especialista em otimização de diagnósticos gerados por IA.

Você receberá:

1. Um diagnóstico original
2. Uma avaliação feita por um auditor (com notas e observações)

Seu objetivo é MELHORAR o diagnóstico com base na avaliação.

Regras obrigatórias:

- NÃO invente informações novas
- NÃO mude o sentido do diagnóstico
- Apenas melhore:
  - clareza
  - impacto
  - personalização
  - humanização

- Se algo foi criticado pelo auditor, corrija isso
- Deixe o texto mais direto e envolvente

IMPORTANTE:
- Mantenha a mesma estrutura geral
- Não transforme em texto longo demais
- Não explique o que você fez

Saída esperada: apenas o DIAGNÓSTICO OTIMIZADO (texto puro), sem título extra.
`

const DEFAULT_DIAG = 'ultimo-diag.txt'
const DEFAULT_AUDIT = 'ultima-auditoria.txt'

function lerArquivo(envVar: string, defaultPath: string, nome: string): string {
  const path = process.env[envVar] || defaultPath
  if (!fs.existsSync(path)) {
    console.error(`Arquivo não encontrado: ${path}`)
    console.error(`Use ${envVar}=caminho ou crie ${defaultPath}`)
    process.exit(1)
  }
  return fs.readFileSync(path, 'utf-8').trim()
}

async function main() {
  const diagnostico = lerArquivo('DIAGNOSTICO_FILE', DEFAULT_DIAG, 'diagnóstico')
  const auditoria = lerArquivo('AUDITORIA_FILE', DEFAULT_AUDIT, 'auditoria')

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log(PROMPT_OTIMIZADOR)
    console.log('\n--- DIAGNÓSTICO ORIGINAL ---\n')
    console.log(diagnostico)
    console.log('\n--- AVALIAÇÃO ---\n')
    console.log(auditoria)
    console.log('\n---\nSem OPENAI_API_KEY: cole o bloco acima no ChatGPT para obter a versão otimizada.')
    return
  }

  const { default: OpenAI } = await import('openai')
  const openai = new OpenAI({ apiKey })

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.4,
    messages: [
      {
        role: 'user',
        content: `${PROMPT_OTIMIZADOR}

--- DIAGNÓSTICO ORIGINAL ---

${diagnostico}

--- AVALIAÇÃO ---

${auditoria}
`
      }
    ]
  })

  const otimizado = (res.choices[0]?.message?.content || '').trim()

  console.log('\n' + '='.repeat(72))
  console.log('COMPARAÇÃO — NOEL (Agente 3 — Otimizador)')
  console.log('='.repeat(72))

  console.log('\n🔹 ORIGINAL:\n')
  console.log(diagnostico)

  console.log('\n🔹 OTIMIZADO:\n')
  console.log(otimizado)

  console.log('\n' + '='.repeat(72))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
