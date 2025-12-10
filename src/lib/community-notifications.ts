import { supabaseAdmin } from '@/lib/supabase'

// Importar web-push dinamicamente
let webpush: any = null
try {
  webpush = require('web-push')
} catch (e) {
  console.warn('[Community Notifications] web-push não instalado')
}

interface CommentNotificationData {
  postId: string
  postTitle: string
  commentId: string
  commentAuthorId: string
  commentAuthorName: string
  postAuthorId: string
  commentContent: string
}

/**
 * Criar notificação quando alguém comenta em um post
 */
export async function notifyPostAuthorOnComment(
  data: CommentNotificationData
): Promise<{ success: boolean; notificationId?: string }> {
  try {
    // Não notificar se o autor do comentário é o próprio autor do post
    if (data.commentAuthorId === data.postAuthorId) {
      return { success: true }
    }

    // Buscar nome do autor do post
    const { data: postAuthor } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, email')
      .eq('user_id', data.postAuthorId)
      .single()

    const authorName = postAuthor?.nome_completo || postAuthor?.email || 'Alguém'

    // Criar notificação no banco
    const { data: notification, error: notifError } = await supabaseAdmin
      .from('community_notifications')
      .insert({
        user_id: data.postAuthorId,
        tipo: 'comentario',
        post_id: data.postId,
        comment_id: data.commentId,
        actor_id: data.commentAuthorId,
        titulo: `${data.commentAuthorName} comentou no seu post`,
        mensagem: data.commentContent.substring(0, 100) + (data.commentContent.length > 100 ? '...' : ''),
        link: `/pt/wellness/comunidade/${data.postId}`
      })
      .select()
      .single()

    if (notifError) {
      console.error('❌ Erro ao criar notificação:', notifError)
      return { success: false }
    }

    // Enviar push notification
    await sendPushNotification(data.postAuthorId, {
      title: `${data.commentAuthorName} comentou no seu post`,
      body: data.commentContent.substring(0, 100) + (data.commentContent.length > 100 ? '...' : ''),
      url: `/pt/wellness/comunidade/${data.postId}`,
      tag: `community-comment-${data.postId}`
    })

    return { success: true, notificationId: notification.id }
  } catch (error) {
    console.error('❌ Erro ao notificar autor do post:', error)
    return { success: false }
  }
}

/**
 * Enviar push notification para um usuário
 */
async function sendPushNotification(
  userId: string,
  data: {
    title: string
    body: string
    url: string
    tag?: string
  }
): Promise<void> {
  try {
    if (!webpush) {
      return // web-push não instalado, apenas criar notificação no banco
    }

    // Validar VAPID keys
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@ylada.com'

    if (!vapidPublicKey || !vapidPrivateKey) {
      return // VAPID keys não configuradas
    }

    // Configurar web-push
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

    // Buscar subscriptions do usuário
    const { data: subscriptions } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)

    if (!subscriptions || subscriptions.length === 0) {
      return // Usuário não tem subscriptions
    }

    // Preparar payload
    const payload = JSON.stringify({
      title: data.title,
      body: data.body,
      icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      badge: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      tag: data.tag || 'community-notification',
      data: {
        url: data.url
      }
    })

    // Enviar para cada subscription
    await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            },
            payload
          )
        } catch (error: any) {
          // Se subscription inválida, marcar como inativa
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseAdmin
              .from('push_subscriptions')
              .update({ ativo: false })
              .eq('id', sub.id)
          }
        }
      })
    )
  } catch (error) {
    console.error('❌ Erro ao enviar push notification:', error)
    // Não falhar se push não funcionar
  }
}
