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

// Registrar Service Worker e aguardar estar ativo
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[Push Notifications] Service Worker não suportado')
    return null
  }

  try {
    // Verificar se já tem um service worker registrado
    let registration = await navigator.serviceWorker.getRegistration('/')
    
    // Se não tem, registrar novo
    if (!registration) {
      console.log('[Push Notifications] Registrando novo Service Worker...')
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('[Push Notifications] Service Worker registrado:', registration)
    } else {
      console.log('[Push Notifications] Service Worker já estava registrado:', registration)
    }
    
    // Aguardar o service worker estar ativo
    if (registration.installing) {
      console.log('[Push Notifications] Service Worker está instalando, aguardando...')
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout aguardando Service Worker instalar'))
        }, 10000) // 10 segundos timeout
        
        registration!.installing!.addEventListener('statechange', function() {
          console.log('[Push Notifications] Estado do SW:', this.state)
          if (this.state === 'activated' || this.state === 'installed') {
            clearTimeout(timeout)
            console.log('[Push Notifications] Service Worker instalado/ativado!')
            resolve()
          }
        })
      })
      
      // Aguardar um pouco mais para garantir que está ativo
      await new Promise(resolve => setTimeout(resolve, 500))
    } else if (registration.waiting) {
      console.log('[Push Notifications] Service Worker está esperando, ativando...')
      // Se está waiting, pode precisar de skipWaiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout aguardando Service Worker ativar'))
        }, 5000)
        
        const checkActive = setInterval(() => {
          if (registration!.active) {
            clearInterval(checkActive)
            clearTimeout(timeout)
            console.log('[Push Notifications] Service Worker ativado!')
            resolve()
          }
        }, 100)
      })
    } else if (registration.active) {
      console.log('[Push Notifications] Service Worker já está ativo!')
    } else {
      // Aguardar um pouco e verificar novamente
      console.log('[Push Notifications] Aguardando Service Worker ficar ativo...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!registration.active) {
        throw new Error('Service Worker não conseguiu ser ativado. Tente recarregar a página.')
      }
    }
    
    // Verificar se realmente está ativo antes de retornar
    if (!registration.active) {
      throw new Error('Service Worker não está ativo. Tente recarregar a página.')
    }
    
    console.log('[Push Notifications] ✅ Service Worker pronto para uso!', {
      scope: registration.scope,
      active: !!registration.active,
      installing: !!registration.installing,
      waiting: !!registration.waiting
    })
    return registration
  } catch (error: any) {
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
    // Verificar se o service worker está ativo
    if (!registration.active) {
      throw new Error('Service Worker não está ativo. Aguarde alguns segundos e tente novamente.')
    }
    
    // Verificar se pushManager está disponível
    if (!registration.pushManager) {
      throw new Error('PushManager não está disponível. O Service Worker pode não estar totalmente ativo.')
    }
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    })

    console.log('[Push Notifications] Subscription criada:', subscription)
    return subscription
  } catch (error: any) {
    console.error('[Push Notifications] Erro ao criar subscription:', error)
    
    // Mensagem de erro mais amigável
    if (error.message?.includes('active service worker')) {
      throw new Error('Service Worker não está ativo. Por favor, recarregue a página e tente novamente.')
    }
    
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
