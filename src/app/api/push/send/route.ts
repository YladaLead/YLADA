import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// Importar web-push dinamicamente (pode não estar instalado ainda)
let webpush: any = null
try {
  webpush = require('web-push')
} catch (e) {
  console.warn('[Push Notifications] web-push não instalado. Execute: npm install web-push')
}

/**
 * POST /api/push/send
 * Envia notificação push para usuários
 * Apenas admin pode enviar
 */
export async function POST(request: NextRequest) {
  try {
    // Apenas admin pode enviar notificações
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const {
      user_ids, // Array de user_ids ou 'all' para todos
      title,
      body: messageBody,
      url,
      icon,
      tag
    } = body

    // Validar campos obrigatórios
    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Título e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se web-push está instalado
    if (!webpush) {
      return NextResponse.json(
        { error: 'Biblioteca web-push não instalada. Execute: npm install web-push' },
        { status: 500 }
      )
    }

    // Validar VAPID keys
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@ylada.com'

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: 'VAPID keys não configuradas. Configure NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY' },
        { status: 500 }
      )
    }

    // Configurar web-push
    webpush.setVapidDetails(
      vapidSubject,
      vapidPublicKey,
      vapidPrivateKey
    )

    // Buscar subscriptions
    let subscriptionsQuery = supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('ativo', true)

    if (user_ids && user_ids !== 'all' && Array.isArray(user_ids)) {
      subscriptionsQuery = subscriptionsQuery.in('user_id', user_ids)
    }

    const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery

    if (subscriptionsError) {
      console.error('❌ Erro ao buscar subscriptions:', subscriptionsError)
      return NextResponse.json(
        { error: 'Erro ao buscar subscriptions', details: subscriptionsError.message },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
        message: 'Nenhuma subscription ativa encontrada'
      })
    }

    // Preparar payload da notificação
    const payload = JSON.stringify({
      title,
      body: messageBody,
      icon: icon || '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      badge: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      tag: tag || 'ylada-notification',
      data: {
        url: url || '/'
      }
    })

    // Enviar para cada subscription
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          }

          await webpush.sendNotification(pushSubscription, payload)
          
          return { success: true, subscription_id: subscription.id }
        } catch (error: any) {
          console.error(`❌ Erro ao enviar para subscription ${subscription.id}:`, error)
          
          // Se subscription inválida, marcar como inativa
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseAdmin
              .from('push_subscriptions')
              .update({ ativo: false })
              .eq('id', subscription.id)
          }
          
          return { success: false, subscription_id: subscription.id, error: error.message }
        }
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - sent

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscriptions.length,
      message: `Notificações enviadas: ${sent} sucesso, ${failed} falhas`
    })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/push/send:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
