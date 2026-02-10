/**
 * POST /api/admin/whatsapp/automation/process-all
 * Desligado quando isCarolAutomationDisabled (PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md).
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { isWhatsAppAutoWelcomeEnabled } from '@/config/whatsapp-automation'
import { supabaseAdmin } from '@/lib/supabase'
import { scheduleWelcomeMessages } from '@/lib/whatsapp-automation/welcome'
import { processScheduledMessages } from '@/lib/whatsapp-automation/worker'
import { sendRemarketingToNonParticipant, sendRegistrationLinkAfterClass, sendPreClassNotifications } from '@/lib/whatsapp-carol-ai'

export async function POST(request: NextRequest) {
  // Permitir chamada pelo cron (Vercel Cron envia Authorization: Bearer CRON_SECRET)
  const authHeader = request.headers.get('authorization')
  const isCron = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  if (!isCron) {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
  }
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 200 })
  }
  try {
    const results: any = {
      welcome: { scheduled: 0, skipped: 0, errors: 0 },
      process: { processed: 0, sent: 0, failed: 0, cancelled: 0, errors: 0 },
      pre_class: { sent: 0, errors: 0 },
      followup: { processed: 0, sent: 0, errors: 0 },
      reprocess_participou: { processed: 0, sent: 0, errors: 0 },
      reprocess_nao_participou: { processed: 0, sent: 0, errors: 0 },
    }

    // 1. Agendar boas-vindas para leads novos (PROATIVO) — por padrão DESLIGADO.
    // Objetivo: deixar a Carol apenas responder quando a pessoa chama; disparos de boas-vindas serão manuais.
    if (isWhatsAppAutoWelcomeEnabled()) {
      console.log('[Process All] 1️⃣ Agendando boas-vindas...')
      const welcomeResult = await scheduleWelcomeMessages()
      results.welcome = welcomeResult
    } else {
      console.log('[Process All] 1️⃣ Boas-vindas automáticas desativadas (WHATSAPP_AUTO_WELCOME!=true).')
      results.welcome = { scheduled: 0, skipped: 0, errors: 0 }
    }

    // 2. Processar mensagens pendentes
    console.log('[Process All] 2️⃣ Processando mensagens pendentes...')
    const processResult = await processScheduledMessages(50)
    results.process = processResult

    // 3. Enviar lembretes de aula (2h, 12h, 10min antes) para quem tem sessão agendada
    console.log('[Process All] 3️⃣ Enviando lembretes de aula (2h, 12h, 10min)...')
    try {
      const preClassResult = await sendPreClassNotifications()
      results.pre_class = { sent: preClassResult.sent, errors: preClassResult.errors }
    } catch (preClassErr: any) {
      console.error('[Process All] Erro ao enviar lembretes de aula:', preClassErr)
      results.pre_class = { sent: 0, errors: 1 }
    }

    // 4. Detectar quem não agendou e enviar follow-up
    console.log('[Process All] 4️⃣ Detectando quem não agendou...')
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, created_at')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (conversations) {
      const naoAgendaram = conversations.filter((conv) => {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        // Tem boas-vindas mas não agendou
        const recebeuBoasVindas = tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop')
        const agendou = tags.includes('agendou_aula') || context.workshop_session_id
        const participou = tags.includes('participou_aula')
        const naoParticipou = tags.includes('nao_participou_aula')
        
        // Se recebeu boas-vindas mas não agendou e não participou/não participou
        return recebeuBoasVindas && !agendou && !participou && !naoParticipou
      })

      // Verificar tempo desde criação (só enviar follow-up se passou pelo menos 24h)
      const agora = new Date()
      for (const conv of naoAgendaram) {
        const convDate = new Date(conv.created_at)
        const horasDesdeCriacao = (agora.getTime() - convDate.getTime()) / (1000 * 60 * 60)
        
        // Só enviar follow-up se passou pelo menos 24h
        if (horasDesdeCriacao >= 24) {
          try {
            results.followup.processed++
            // Usar função de follow-up existente ou enviar mensagem simples
            // Por enquanto, vamos pular (pode adicionar depois)
          } catch (error: any) {
            results.followup.errors++
            console.error(`[Process All] Erro ao enviar follow-up para ${conv.phone}:`, error)
          }
        }
      }
    }

    // 5. Reprocessar quem tem tag "participou_aula" mas não recebeu link
    console.log('[Process All] 5️⃣ Reprocessando quem participou...')
    if (conversations) {
      const participantes = conversations.filter((conv) => {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        return tags.includes('participou_aula') && context.registration_link_sent !== true
      })

      for (const conv of participantes) {
        try {
          results.reprocess_participou.processed++
          const result = await sendRegistrationLinkAfterClass(conv.id)
          if (result.success) {
            results.reprocess_participou.sent++
          } else {
            results.reprocess_participou.errors++
          }
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error: any) {
          results.reprocess_participou.errors++
          console.error(`[Process All] Erro ao reprocessar participou ${conv.phone}:`, error)
        }
      }
    }

    // 6. Reprocessar quem tem tag "nao_participou_aula" mas não recebeu remarketing
    console.log('[Process All] 6️⃣ Reprocessando quem não participou...')
    if (conversations) {
      const naoParticipantes = conversations.filter((conv) => {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        return tags.includes('nao_participou_aula') && !tags.includes('participou_aula')
      })

      for (const conv of naoParticipantes) {
        try {
          results.reprocess_nao_participou.processed++
          const result = await sendRemarketingToNonParticipant(conv.id)
          if (result.success) {
            results.reprocess_nao_participou.sent++
          } else {
            results.reprocess_nao_participou.errors++
          }
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error: any) {
          results.reprocess_nao_participou.errors++
          console.error(`[Process All] Erro ao reprocessar não participou ${conv.phone}:`, error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[Process All] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar tudo', details: error.message },
      { status: 500 }
    )
  }
}
