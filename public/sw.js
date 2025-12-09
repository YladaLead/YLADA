// Service Worker para receber notificações push
// Este arquivo é servido estaticamente do diretório public

const CACHE_NAME = 'ylada-pwa-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
]

// Log inicial para debug
console.log('[Service Worker] Script carregado!', self.registration?.scope || 'Não registrado ainda')

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...')
  // Forçar ativação imediata
  self.skipWaiting()
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto')
        return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
          console.warn('[Service Worker] Alguns arquivos não foram cacheados:', error)
          // Não falhar a instalação se cache falhar
        })
      })
      .then(() => {
        console.log('[Service Worker] Instalação concluída, ativando imediatamente...')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[Service Worker] Erro ao instalar:', error)
        // Mesmo com erro, tentar ativar
        return self.skipWaiting()
      })
  )
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...')
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Controlar todas as páginas imediatamente
      self.clients.claim().then(() => {
        console.log('[Service Worker] ✅ Service Worker ativado e controlando todas as páginas!')
        // Notificar todas as páginas que o SW está ativo
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              message: 'Service Worker está ativo e pronto!'
            })
          })
        })
      })
    ])
  )
})

// Receber notificações push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Notificação push recebida:', event)
  
  let notificationData = {
    title: 'YLADA',
    body: 'Você tem uma nova notificação',
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    badge: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    tag: 'ylada-notification',
    requireInteraction: false,
    data: {}
  }

  // Se a notificação veio com dados, usar eles
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || notificationData.tag,
        requireInteraction: data.requireInteraction || false,
        data: data.data || {},
        actions: data.actions || []
      }
    } catch (e) {
      // Se não for JSON, tentar como texto
      notificationData.body = event.data.text() || notificationData.body
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: notificationData.actions,
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    })
  )
})

// Quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificação clicada:', event)
  
  event.notification.close()

  const notificationData = event.notification.data || {}
  const urlToOpen = notificationData.url || '/'

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Se já tem uma janela aberta, focar nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // Se não tem, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Interceptar requisições para cache (opcional, para PWA offline)
self.addEventListener('fetch', (event) => {
  // Por enquanto, não fazer cache de requisições dinâmicas
  // Apenas deixar passar normalmente
  return
})
