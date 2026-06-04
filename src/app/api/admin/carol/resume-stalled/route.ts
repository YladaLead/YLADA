import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/carol/sender'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Auth simples por token para chamadas programáticas (Cowork skill, scripts) */
function hasAdminToken(request: NextRequest): boolean {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  const adminToken = process.env.CAROL_ADMIN_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  return !!adminToken && token === adminToken
}

const RESUME_SYSTEM_PROMPT = `Você é Carol, assistente de vendas da equipe do Andre Faula.
Uma lead parou de responder. Você precisa enviar UMA mensagem de retomada natural.

REGRAS ABSOLUTAS:
- NUNCA diga "Vi que não me respondeu", "Passando pra saber", "Seu silêncio fala" ou qualquer variação que pareça cobrança ou follow-up óbvio de vendedor.
- NUNCA recomece do zero ("Oi! Me conta seu desafio...") — a conversa já existiu.
- NUNCA mencione diagnóstico, produto ou preço nesta mensagem.
- NUNCA use "Alguma dúvida?", "Posso te ajudar?", "Estou à disposição".
- Máximo 2 linhas. Tom de WhatsApp, como uma amiga que lembrou de algo.
- Continue naturalmente de onde a conversa parou. Se ela tinha mencionado uma dor, retome aquela dor com curiosidade genuína.
- Se a última troca foi superficial (sem dor revelada), faça uma pergunta diferente — nunca a mesma.
- Se a conversa foi sobre agenda, retome com curiosidade sobre o contexto dela, não com a mesma pergunta.
- Varie: às vezes começa com o nome, às vezes não. Às vezes é afirmação + pergunta, às vezes só pergunta curta.
- Não soe como bot. Soe como alguém que estava pensando no caso dela.`

interface StallledConv {
  id: string
  phone: string
  nome: string | null
  status: string
  last_message_at: string
  messages: Array<{ role: string; content: string; created_at: string }>
}

export async function POST(request: NextRequest) {
  // Auth: token simples (Cowork/scripts) ou sessão admin
  if (!hasAdminToken(request)) {
    // Fallback: tentar auth de sessão
    const { requireApiAuth } = await import('@/lib/api-auth')
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth
  }

  const db = getSupabaseAdmin()
  if (!db) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  // Parâmetros opcionais
  let body: { stall_hours?: number; dry_run?: boolean; limit?: number } = {}
  try { body = await request.json() } catch { /* sem body = defaults */ }

  const stallHours = Math.max(1, Math.min(body.stall_hours ?? 4, 48))
  const dryRun = body.dry_run ?? false
  const limit = Math.min(body.limit ?? 15, 30)

  const stallCutoff = new Date(Date.now() - stallHours * 60 * 60 * 1000).toISOString()

  // 1. Busca conversas candidatas: ativas, não pausadas, não agendadas
  const { data: conversations, error: convError } = await db
    .from('carol_conversations')
    .select('id, phone, nome, status, updated_at, paused')
    .not('status', 'in', '("diagnostico_agendado","proposta")')
    .or('paused.is.null,paused.eq.false')
    .lt('updated_at', stallCutoff)
    .order('updated_at', { ascending: false })
    .limit(limit * 3) // busca mais pra filtrar depois

  if (convError) {
    return NextResponse.json({ error: convError.message }, { status: 500 })
  }

  if (!conversations?.length) {
    return NextResponse.json({ resumed: 0, skipped: 0, detail: [] })
  }

  // 2. Para cada conversa, busca as últimas mensagens e filtra
  const candidates: StallledConv[] = []

  for (const conv of conversations) {
    const { data: msgs } = await db
      .from('carol_messages')
      .select('role, content, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(12)

    if (!msgs?.length) continue

    const realMessages = msgs.filter(
      (m) =>
        !m.content.startsWith('[auto-resposta ignorada]') &&
        !m.content.startsWith('[TEMPLATE OUTBOUND') &&
        !m.content.startsWith('[SISTEMA:') &&
        !m.content.startsWith('[botões enviados') &&
        !m.content.startsWith('[LEAD_DATA') &&
        !m.content.startsWith('[AGENDAMENTO')
    )

    if (!realMessages.length) continue

    // Só retoma se Carol fez a última pergunta (aguarda resposta da lead)
    const lastReal = realMessages[0]
    if (lastReal.role !== 'assistant') continue

    // Precisa ter ao menos 1 mensagem real do usuário (conversa começou)
    const hasUserMsg = realMessages.some((m) => m.role === 'user')
    if (!hasUserMsg) continue

    // Última mensagem precisa ser anterior ao cutoff
    if (lastReal.created_at >= stallCutoff) continue

    candidates.push({
      id: conv.id,
      phone: conv.phone,
      nome: conv.nome,
      status: conv.status,
      last_message_at: lastReal.created_at,
      messages: msgs.reverse(), // cronológico para o prompt
    })

    if (candidates.length >= limit) break
  }

  if (!candidates.length) {
    return NextResponse.json({ resumed: 0, skipped: conversations.length, detail: [] })
  }

  // 3. Gera e envia mensagem de retomada para cada candidata
  const results: Array<{
    phone: string
    nome: string | null
    status: 'sent' | 'skipped' | 'error'
    message?: string
    reason?: string
  }> = []

  for (const conv of candidates) {
    try {
      const historyForPrompt = conv.messages
        .filter(
          (m) =>
            !m.content.startsWith('[auto-resposta ignorada]') &&
            !m.content.startsWith('[TEMPLATE OUTBOUND') &&
            !m.content.startsWith('[SISTEMA:') &&
            !m.content.startsWith('[botões enviados') &&
            !m.content.startsWith('[LEAD_DATA') &&
            !m.content.startsWith('[AGENDAMENTO')
        )
        .slice(-10)

      const nomeInfo = conv.nome ? `\nNome da lead: ${conv.nome}` : ''

      const response = await openai.chat.completions.create({
        model: process.env.CAROL_OUTBOUND_MODEL?.trim() || 'gpt-4o',
        temperature: 0.85,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: RESUME_SYSTEM_PROMPT + nomeInfo,
          },
          ...historyForPrompt.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          {
            role: 'user',
            content:
              '[INSTRUÇÃO INTERNA — não exibir] A lead parou de responder. Gere a mensagem de retomada seguindo as regras do sistema. Responda APENAS com o texto da mensagem, sem explicações.',
          },
        ],
      })

      const resumeMsg = response.choices[0].message.content?.trim() || ''

      if (!resumeMsg) {
        results.push({ phone: conv.phone, nome: conv.nome, status: 'skipped', reason: 'GPT retornou vazio' })
        continue
      }

      if (!dryRun) {
        await sendWhatsAppMessage(conv.phone, resumeMsg)

        // Salva como mensagem assistente no histórico
        await db.from('carol_messages').insert({
          conversation_id: conv.id,
          role: 'assistant',
          content: resumeMsg,
          created_at: new Date().toISOString(),
        })

        // Atualiza updated_at da conversa para não ser retomada de novo imediatamente
        await db
          .from('carol_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conv.id)
      }

      results.push({ phone: conv.phone, nome: conv.nome, status: 'sent', message: resumeMsg })

      // Delay entre envios para não parecer disparo em massa
      if (!dryRun) await new Promise((r) => setTimeout(r, 4000 + Math.random() * 3000))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ phone: conv.phone, nome: conv.nome, status: 'error', reason: msg })
    }
  }

  const sent = results.filter((r) => r.status === 'sent').length
  const skipped = results.filter((r) => r.status === 'skipped' || r.status === 'error').length

  return NextResponse.json({
    resumed: sent,
    skipped,
    dry_run: dryRun,
    stall_hours: stallHours,
    detail: results,
  })
}
