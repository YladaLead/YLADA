/**
 * Reprocessa conversas outbound onde o lead respondeu de verdade
 * mas a Carol não enviou retorno.
 *
 * Uso:
 *   npm run carol:reprocess-sem-resposta           # lista (dry-run)
 *   npm run carol:reprocess-sem-resposta -- --execute
 *   npm run carol:reprocess-sem-resposta -- --execute --limit=5
 */

import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function preview(text: string, max = 72) {
  const one = text.replace(/\s+/g, ' ').trim()
  return one.length <= max ? one : `${one.slice(0, max)}…`
}

async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const { findPendingCarolReply } = await import('../src/lib/carol/conversation-insights')
  const { reprocessPendingCarolReply } = await import('../src/lib/carol/processor')
  type CarolMessageRow = import('../src/lib/carol/conversation-insights').CarolMessageRow
  type PendingCarolReply = import('../src/lib/carol/conversation-insights').PendingCarolReply

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY ausente')
    process.exit(1)
  }

  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.error('❌ WHATSAPP_TOKEN / WHATSAPP_PHONE_ID ausentes')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const args = process.argv.slice(2)
  const execute = args.includes('--execute')
  const limitArg = args.find((a) => a.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50
  const delayArg = args.find((a) => a.startsWith('--delay='))
  const delaySec = delayArg ? parseFloat(delayArg.split('=')[1]) : 18

  console.log(execute ? '🚀 Modo EXECUTE — Carol vai responder\n' : '👁 Dry-run — só listagem\n')

  const { data: conversations, error: convErr } = await supabase
    .from('carol_conversations')
    .select('id, phone, nome, status, paused, updated_at')
    .order('updated_at', { ascending: false })

  if (convErr || !conversations) {
    console.error('❌ Erro ao buscar conversas:', convErr?.message)
    process.exit(1)
  }

  const ids = conversations.map((c) => c.id)
  const { data: allMsgs, error: msgErr } = await supabase
    .from('carol_messages')
    .select('conversation_id, role, content, created_at')
    .in('conversation_id', ids)
    .order('created_at', { ascending: true })

  if (msgErr) {
    console.error('❌ Erro ao buscar mensagens:', msgErr.message)
    process.exit(1)
  }

  const byConv = new Map<string, CarolMessageRow[]>()
  for (const msg of allMsgs || []) {
    const list = byConv.get(msg.conversation_id) || []
    list.push({
      role: msg.role,
      content: msg.content,
      created_at: msg.created_at,
    })
    byConv.set(msg.conversation_id, list)
  }

  const pending: PendingCarolReply[] = []

  for (const conv of conversations) {
    if (conv.paused) continue
    if (conv.status === 'diagnostico_agendado') continue

    const messages = byConv.get(conv.id) || []
    const found = findPendingCarolReply(messages)
    if (!found) continue

    pending.push({
      ...found,
      conversation_id: conv.id,
      phone: conv.phone,
      nome: conv.nome,
    })
  }

  console.log(`📊 Total conversas: ${conversations.length}`)
  console.log(`⏳ Sem resposta da Carol (lead real): ${pending.length}\n`)

  if (pending.length === 0) {
    console.log('✅ Nenhuma conversa pendente.')
    return
  }

  const batch = pending.slice(0, limit)

  batch.forEach((p, i) => {
    console.log(
      `${i + 1}. ${p.nome ?? p.phone} (+${p.phone})\n` +
        `   Lead: "${preview(p.last_user_message)}"\n` +
        `   Em: ${new Date(p.last_user_at).toLocaleString('pt-BR')}\n`
    )
  })

  if (!execute) {
    console.log('—'.repeat(50))
    console.log(
      `Para enviar: npm run carol:reprocess-sem-resposta -- --execute --limit=${limit}`
    )
    return
  }

  console.log('—'.repeat(50))
  let ok = 0
  let fail = 0

  for (let i = 0; i < batch.length; i++) {
    const p = batch[i]
    const conv = conversations.find((c) => c.id === p.conversation_id)!
    console.log(`\n[${i + 1}/${batch.length}] ${p.nome ?? p.phone} (+${p.phone})`)

    try {
      await reprocessPendingCarolReply(conv, p.last_user_message)
      ok++
      console.log('   ✅ Resposta enviada')
    } catch (err) {
      fail++
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`   ❌ ${msg}`)
    }

    if (i < batch.length - 1) {
      console.log(`   ⏱ aguardando ${delaySec}s…`)
      await sleep(delaySec * 1000)
    }
  }

  console.log(`\n🎯 Concluído: ${ok} enviados · ${fail} erros`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
