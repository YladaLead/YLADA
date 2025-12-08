/**
 * Utilitários para gerenciar notificações push
 */

// Verificar se o navegador suporta notificações push
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Verificar se já tem permissão
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

// Solicitar permissão de notificações
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error('Notificações push não são suportadas neste navegador')
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    throw new Error('Permissão de notificações foi negada. Por favor, habilite nas configurações do navegador.')
  }

  const permission = await Notification.requestPermission()
  return permission
}

// Registrar Service Worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[Push Notifications] Service Worker não suportado')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
    
    console.log('[Push Notifications] Service Worker registrado:', registration)
    return registration
  } catch (error) {
    console.error('[Push Notifications] Erro ao registrar Service Worker:', error)
    throw error
  }
}

// Converter VAPID public key para formato Uint8Array
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Criar subscription para push notifications
export async function createPushSubscription(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    })

    console.log('[Push Notifications] Subscription criada:', subscription)
    return subscription
  } catch (error) {
    console.error('[Push Notifications] Erro ao criar subscription:', error)
    throw error
  }
}

// Converter subscription para objeto JSON
export function subscriptionToJSON(subscription: PushSubscription): {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
} {
  const keys = subscription.getKey ? {
    p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
    auth: arrayBufferToBase64(subscription.getKey('auth'))
  } : { p256dh: '', auth: '' }

  return {
    endpoint: subscription.endpoint,
    keys
  }
}

// Converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return ''
  
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// Salvar subscription no servidor
export async function saveSubscriptionToServer(
  subscription: PushSubscription,
  userId: string
): Promise<void> {
  const subscriptionData = subscriptionToJSON(subscription)

  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      subscription: subscriptionData,
      user_id: userId
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao salvar subscription')
  }

  console.log('[Push Notifications] Subscription salva no servidor')
}

// Verificar se já tem subscription ativa
export async function getExistingSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.getSubscription()
    return subscription
  } catch (error) {
    console.error('[Push Notifications] Erro ao buscar subscription:', error)
    return null
  }
}

// Cancelar subscription
export async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      console.log('[Push Notifications] Subscription cancelada')
      return true
    }
    return false
  } catch (error) {
    console.error('[Push Notifications] Erro ao cancelar subscription:', error)
    throw error
  }
}
