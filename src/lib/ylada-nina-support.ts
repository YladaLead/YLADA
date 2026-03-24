import OpenAI from 'openai'
import { buildNinaSupportSystemPrompt } from '@/lib/ylada-nina-support-prompt'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function completeNinaSupportTurn(opts: {
  message: string
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  segment: string
  localeInstruction: string
  profileResumo: string
  linksAtivosBlock: string
  appOrigin?: string
}): Promise<string> {
  const system = buildNinaSupportSystemPrompt({
    segment: opts.segment,
    localeInstruction: opts.localeInstruction,
    profileResumo: opts.profileResumo,
    linksAtivosBlock: opts.linksAtivosBlock,
    appOrigin: opts.appOrigin,
  })

  const history = (opts.conversationHistory || []).slice(-12).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: system },
    ...history,
    { role: 'user', content: opts.message.trim() },
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 1000,
    temperature: 0.35,
  })

  return (
    completion.choices[0]?.message?.content?.trim() ||
    'Desculpe, não consegui responder agora. Tente de novo em instantes.'
  )
}
