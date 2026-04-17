/**
 * Smoke do prompt Noel Pro Líderes (mesmo system que /api/pro-lideres/noel, sem auth).
 * Uso: npx tsx scripts/pro-lideres-noel-smoke-lab.ts
 * Requer OPENAI_API_KEY (ex.: .env.local na raiz do projeto).
 */

import { config as loadEnv } from 'dotenv'
import OpenAI from 'openai'
import { buildProLideresNoelSystemPrompt } from '../src/lib/pro-lideres-noel-prompt'

loadEnv({ path: '.env.local' })
loadEnv()

const QUESTIONS = [
  'Noel, como eu fecho com a equipe a meta desta semana em convites e acompanhamentos sem virar pressão desorganizada?',
  'A equipe está recebendo objeção de preço e tempo. Como eu oriento o tom sem script gigante aqui no chat?',
  'Um membro quer postar promessa de ganho rápido. Como eu intervenho e o que peço para apagar ou ajustar?',
] as const

function hasSections(text: string): { diagnostico: boolean; fazer: boolean; conduzir: boolean; proximo: boolean } {
  const l = text.toLowerCase()
  return {
    diagnostico: /###\s*diagnóstico/i.test(text),
    fazer: /###\s*o que fazer agora/i.test(text),
    conduzir: /###\s*como conduzir/i.test(text),
    proximo: /###\s*próximo passo/i.test(text),
  }
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Sem OPENAI_API_KEY. Defina no .env.local ou no ambiente.')
    process.exit(1)
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const baseUrl = 'https://www.ylada.com'
  const painelTarefasDiariasUrl = `${baseUrl}/pro-lideres/painel/tarefas`

  const systemPrompt = buildProLideresNoelSystemPrompt({
    operationLabel: 'Demo Lab — Equipe Norte',
    verticalCode: 'h-lider',
    focusNotes: null,
    role: 'leader',
    replyLanguage: 'Português (Brasil)',
    linksAtivosContext: null,
    painelTarefasDiariasUrl,
  })

  const history: OpenAI.Chat.ChatCompletionMessageParam[] = [{ role: 'system', content: systemPrompt }]

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]
    console.log('\n' + '='.repeat(72))
    console.log(`[Pergunta ${i + 1}/${QUESTIONS.length}]`)
    console.log(q)
    console.log('='.repeat(72))

    history.push({ role: 'user', content: q })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: history,
      temperature: 0.65,
      max_tokens: 1800,
    })

    const text = (completion.choices[0]?.message?.content ?? '').trim()
    history.push({ role: 'assistant', content: text })

    const sec = hasSections(text)
    const words = countWords(text)
    console.log(`\n[Métricas] palavras≈${words} | seções: Diagnóstico=${sec.diagnostico} O que fazer=${sec.fazer} Conduzir=${sec.conduzir} Próximo=${sec.proximo}`)
    console.log('\n--- Resposta ---\n')
    console.log(text)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
