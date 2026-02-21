/**
 * Noel Oficial — Nutri
 * POST /api/nutri/noel
 *
 * Motor único: identidade + formato fixo; contexto e prioridade vindos do backend.
 * Modelo: 4.1-mini quando disponível, senão gpt-4o-mini.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { buildNoelNutriContext } from '@/lib/noel-nutri/build-context'
import { getNoelNutriSystemPrompt } from '@/lib/noel-nutri/system-prompt'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const MODEL_NOEL = process.env.OPENAI_NOEL_MODEL || 'gpt-4o-mini'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    const body = await request.json().catch(() => ({}))
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = Array.isArray(body.conversationHistory) ? body.conversationHistory : []

    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    const ctx = await buildNoelNutriContext(user.id, message)
    if (!ctx) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta.' },
        { status: 500 }
      )
    }

    const systemContent = getNoelNutriSystemPrompt() + '\n\n' + ctx.contextBlock

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: MODEL_NOEL,
      messages,
      max_tokens: 600,
      temperature: 0.4
    })

    let responseText = completion.choices[0]?.message?.content?.trim() || 'Não consegui gerar uma resposta. Tente de novo.'

    // Pós-processamento 1: quando o backend enviou link pronto, garantir que ele apareça na resposta (modelo às vezes ignora e escreve só o nome)
    const linkSugerido = ctx.contexto.link_sugerido_onde_aplicar
    if (linkSugerido) {
      const displayNameMatch = linkSugerido.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      const displayName = displayNameMatch ? displayNameMatch[1] : null
      const urlDoLink = displayNameMatch ? displayNameMatch[2] : ''
      const ehQuiz = urlDoLink.includes('/quiz/') || urlDoLink.includes('/quiz-')
      if (displayName) {
        if (!responseText.includes(linkSugerido)) {
          const re = (s: string) => new RegExp(escapeRegex(s) + '(?![\\]\\(])', 'gi')
          responseText = responseText
            .replace(re(`Envie o link ${displayName}`), `Envie o link ${linkSugerido}`)
            .replace(re(`Envie o link do ${displayName}`), `Envie o link do ${linkSugerido}`)
            .replace(re(`- Envie o link ${displayName}`), `- Envie o link ${linkSugerido}`)
            .replace(re(`link do seu quiz: ${displayName}`), `link do seu quiz: ${linkSugerido}`)
            .replace(re(`link do ${displayName}`), `link do ${linkSugerido}`)
            .replace(re(`comece com o ${displayName}`), `comece com o ${linkSugerido}`)
            .replace(re(`comece com a ${displayName}`), `comece com a ${linkSugerido}`)
            .replace(re(`use o ${displayName}`), `use o ${linkSugerido}`)
            .replace(re(`use a ${displayName}`), `use a ${linkSugerido}`)
            .replace(re(`enviar o link do ${displayName}`), `enviar o link do ${linkSugerido}`)
            .replace(re(`enviando o link do ${displayName}`), `enviando o link do ${linkSugerido}`)
          // "Aqui está: Quiz" / "aqui: Quiz" / "link: Quiz" no fim de frase
          responseText = responseText
            .replace(new RegExp(`: ${escapeRegex(displayName)}(?=[.!\\s]|$)`, 'g'), `: ${linkSugerido}`)
            .replace(new RegExp(`aqui: ${escapeRegex(displayName)}(?![\\]\\(])`, 'gi'), `aqui: ${linkSugerido}`)
          // Linha que contém só o nome → link clicável
          responseText = responseText.split('\n').map(line => {
            if (line.trim() === displayName) return linkSugerido
            return line
          }).join('\n')
        }
        if (ehQuiz) {
          responseText = responseText
            .replace(/\bEnvie o link DSVS\b/gi, `Envie o link ${linkSugerido}`)
            .replace(/\bEnvie o link do DSVS\b/gi, `Envie o link do ${linkSugerido}`)
            .replace(/\b- Envie o link DSVS\b/gi, `- Envie o link ${linkSugerido}`)
          responseText = responseText.split('\n').map(line => {
            if (line.trim() === 'DSVS') return linkSugerido
            return line
          }).join('\n')
        }
      }
    }

    // Pós-processamento 2: anti-alucinação — quando pediu link inexistente, não sugerir link da lista
    if (ctx.contexto.nao_sugerir_link_especifico && ctx.contexto.links_ativos.length > 0) {
      const nomesDeLinks = ctx.contexto.links_ativos.map(l => l.nome)
      // Linha inteira só com nome do link → substituir
      responseText = responseText.split('\n').map(line => {
        if (nomesDeLinks.includes(line.trim())) return '—'
        return line
      }).join('\n')
      // Frases como "link do seu quiz aqui: Quiz" → remover sugestão de link e reforçar criar/listar
      const substituirSugestaoLink = (nome: string) => {
        responseText = responseText
          .replace(new RegExp(`link do seu quiz aqui: ${escapeRegex(nome)}(?![\\]\\(])`, 'gi'), 'criar em Ferramentas ou listar os disponíveis')
          .replace(new RegExp(`aqui está o link: ${escapeRegex(nome)}(?![\\]\\(])`, 'gi'), 'você pode criar em Ferramentas ou listar os disponíveis')
          .replace(new RegExp(`você pode usar o link do seu quiz aqui: ${escapeRegex(nome)}(?![\\]\\(])`, 'gi'), 'você pode criar um quiz em Ferramentas ou listar os disponíveis')
      }
      nomesDeLinks.forEach(substituirSugestaoLink)
    }

    return NextResponse.json({
      response: responseText,
      modelUsed: completion.model || MODEL_NOEL
    })
  } catch (e: any) {
    console.error('[Noel Nutri] Erro:', e?.message || e)
    return NextResponse.json(
      { error: e?.message || 'Erro ao processar mensagem do Noel.' },
      { status: 500 }
    )
  }
}
