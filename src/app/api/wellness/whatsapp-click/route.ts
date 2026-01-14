/**
 * API para rastrear cliques no botão WhatsApp
 * Envia notificação quando alguém clica no botão de suporte
 * 
 * Endpoint: POST /api/wellness/whatsapp-click
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface WhatsAppClickRequest {
  page?: string
  userAgent?: string
  referrer?: string
  timestamp?: string
}

/**
 * Envia notificação via Telegram (se configurado)
 */
async function sendTelegramNotification(data: {
  page: string
  timestamp: string
}): Promise<boolean> {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (!telegramBotToken || !telegramChatId) {
    console.log('[WhatsApp Click] Telegram não configurado')
    return false
  }

  try {
    const message = `🔔 *Nova Solicitação de Atendimento*

📱 *Página:* ${data.page}
⏰ *Horário:* ${new Date(data.timestamp).toLocaleString('pt-BR')}

Alguém clicou no botão WhatsApp para falar com você!`

    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    )

    if (response.ok) {
      console.log('[WhatsApp Click] ✅ Notificação Telegram enviada')
      return true
    } else {
      const error = await response.json()
      console.error('[WhatsApp Click] Erro ao enviar Telegram:', error)
      return false
    }
  } catch (error: any) {
    console.error('[WhatsApp Click] Erro ao enviar Telegram:', error.message)
    return false
  }
}

/**
 * Salva o clique no banco de dados
 */
async function saveClickToDatabase(data: WhatsAppClickRequest): Promise<boolean> {
  if (!supabaseAdmin) {
    return false
  }

  try {
    const { error } = await supabaseAdmin
      .from('whatsapp_clicks')
      .insert({
        page: data.page || 'unknown',
        user_agent: data.userAgent || null,
        referrer: data.referrer || null,
        clicked_at: new Date().toISOString(),
      })

    if (error) {
      // Se tabela não existir, apenas logar (não crítico)
      console.warn('[WhatsApp Click] Tabela whatsapp_clicks não existe:', error.message)
      return false
    }

    console.log('[WhatsApp Click] ✅ Clique salvo no banco')
    return true
  } catch (error: any) {
    console.error('[WhatsApp Click] Erro ao salvar no banco:', error.message)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppClickRequest = await request.json()
    const timestamp = body.timestamp || new Date().toISOString()

    // 1. Salvar no banco (opcional, para analytics)
    await saveClickToDatabase({
      ...body,
      timestamp,
    })

    // 2. Enviar notificação Telegram
    const telegramSent = await sendTelegramNotification({
      page: body.page || 'Wellness - Página de Vendas',
      timestamp,
    })

    return NextResponse.json({
      success: true,
      notificationSent: telegramSent,
      message: telegramSent
        ? 'Notificação enviada com sucesso'
        : 'Telegram não configurado ou erro ao enviar',
    })
  } catch (error: any) {
    console.error('[WhatsApp Click] Erro ao processar:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar clique',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
