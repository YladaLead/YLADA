// Service Worker com suporte offline completo
// YLADA PWA - Cache offline para área Wellness

const CACHE_VERSION = 'v2'
const STATIC_CACHE = `ylada-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `ylada-dynamic-${CACHE_VERSION}`
const API_CACHE = `ylada-api-${CACHE_VERSION}`

// Páginas que devem funcionar offline
const STATIC_URLS = [
  '/',
  '/manifest.json',
  '/manifest-wellness.json',
  '/offline.html'
]

// Padrões de URL para cachear dinamicamente
const CACHEABLE_PATTERNS = {
  // Páginas do Wellness que devem funcionar offline
  pages: [
    /\/pt\/wellness\/.*\/home/,
    /\/pt\/wellness\/.*\/scripts/,
    /\/pt\/wellness\/.*\/links/,
    /\/pt\/wellness\/.*\/noel/
  ],
  // Assets estáticos (JS, CSS, imagens, fontes)
  assets: [
    /\/_next\/static\//,
    /\/images\//,
    /\/icons\//,
    /\.woff2?$/,
    /\.ttf$/
  ],
  // APIs que podem ser cacheadas (scripts, conhecimento base)
  apis: [
    /\/api\/wellness\/scripts/,
    /\/api\/wellness\/knowledge/,
    /\/api\/wellness\/fluxos/,
    /\/api\/wellness\/links\/list/
  ]
}

// APIs que NUNCA devem ser cacheadas (precisam de dados em tempo real)
const NEVER_CACHE_APIS = [
  /\/api\/wellness\/noel$/, // Chat com IA precisa ser online
  /\/api\/auth/,
  /\/api\/.*\/subscription/,
  /\/api\/wellness\/consultor/,
  /\/api\/wellness\/plano/
]

// Log inicial
console.log('[SW] Service Worker carregado - versão:', CACHE_VERSION)

// ============================================
// INSTALAÇÃO
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cacheando arquivos estáticos...')
        return cache.addAll(STATIC_URLS).catch((error) => {
          console.warn('[SW] Alguns arquivos não foram cacheados:', error)
          return Promise.resolve()
        })
      })
      .then(() => {
        console.log('[SW] ✅ Instalação concluída')
        return self.skipWaiting()
      })
  )
})

// ============================================
// ATIVAÇÃO
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...')
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Controlar todas as páginas
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] ✅ Ativado e controlando páginas')
      // Notificar clientes
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION })
        })
      })
    })
  )
})

// ============================================
// INTERCEPTAR REQUISIÇÕES (FETCH)
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorar requisições não-GET
  if (request.method !== 'GET') return
  
  // Ignorar extensões do Chrome e outros protocolos
  if (!url.protocol.startsWith('http')) return
  
  // Ignorar requisições para outros domínios (exceto CDNs conhecidos)
  const isOwnDomain = url.origin === self.location.origin
  const isTrustedCDN = url.hostname.includes('googleapis.com') || 
                       url.hostname.includes('gstatic.com') ||
                       url.hostname.includes('cloudflare.com')
  
  if (!isOwnDomain && !isTrustedCDN) return

  // Verificar se é API que NUNCA deve ser cacheada
  if (NEVER_CACHE_APIS.some(pattern => pattern.test(url.pathname))) {
    // Network only - não cachear
    return
  }

  // Determinar estratégia baseada no tipo de recurso
  if (isApiRequest(url.pathname)) {
    // APIs: Network First (tentar rede, fallback para cache)
    event.respondWith(networkFirst(request, API_CACHE))
  } else if (isStaticAsset(url.pathname)) {
    // Assets: Cache First (usar cache, atualizar em background)
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isPageRequest(request, url.pathname)) {
    // Páginas: Stale While Revalidate (cache + atualizar)
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  }
})

// ============================================
// ESTRATÉGIAS DE CACHE
// ============================================

// Network First - Tenta rede, usa cache se falhar
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // Retornar resposta de erro offline para APIs
    return new Response(
      JSON.stringify({ 
        error: 'offline', 
        message: 'Você está offline. Esta função requer conexão com a internet.',
        cached: false
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Cache First - Usa cache, busca na rede se não tiver
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    // Atualizar cache em background
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, response)
        })
      }
    }).catch(() => {})
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Retornar resposta vazia para assets não críticos
    return new Response('', { status: 404 })
  }
}

// Stale While Revalidate - Retorna cache imediato, atualiza em background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)
  
  // Retornar cache se tiver, senão esperar a rede
  if (cached) {
    fetchPromise // Atualizar em background
    return cached
  }
  
  const networkResponse = await fetchPromise
  if (networkResponse) {
    return networkResponse
  }
  
  // Se não tem cache nem rede, mostrar página offline
  return caches.match('/offline.html') || new Response(
    '<html><body><h1>Você está offline</h1><p>Conecte-se à internet para continuar.</p></body></html>',
    { headers: { 'Content-Type': 'text/html' } }
  )
}

// ============================================
// HELPERS
// ============================================

function isApiRequest(pathname) {
  return pathname.startsWith('/api/') && 
         CACHEABLE_PATTERNS.apis.some(pattern => pattern.test(pathname))
}

function isStaticAsset(pathname) {
  return CACHEABLE_PATTERNS.assets.some(pattern => pattern.test(pathname))
}

function isPageRequest(request, pathname) {
  const acceptHeader = request.headers.get('accept') || ''
  return acceptHeader.includes('text/html') ||
         CACHEABLE_PATTERNS.pages.some(pattern => pattern.test(pathname))
}

// ============================================
// MENSAGENS DO CLIENTE
// ============================================
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {}
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CACHE_URLS':
      // Permite cachear URLs específicas sob demanda
      if (payload?.urls) {
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.addAll(payload.urls).catch(console.warn)
        })
      }
      break
      
    case 'CLEAR_CACHE':
      // Limpar todo o cache
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name))
      })
      break
      
    case 'GET_CACHE_STATUS':
      // Retornar status do cache
      Promise.all([
        caches.open(STATIC_CACHE).then(c => c.keys()),
        caches.open(DYNAMIC_CACHE).then(c => c.keys()),
        caches.open(API_CACHE).then(c => c.keys())
      ]).then(([staticKeys, dynamicKeys, apiKeys]) => {
        event.source.postMessage({
          type: 'CACHE_STATUS',
          payload: {
            static: staticKeys.length,
            dynamic: dynamicKeys.length,
            api: apiKeys.length,
            version: CACHE_VERSION
          }
        })
      })
      break
  }
})

// ============================================
// NOTIFICAÇÕES PUSH (mantido do original)
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido')
  
  let data = {
    title: 'YLADA',
    body: 'Você tem uma nova notificação',
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    badge: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png'
  }

  if (event.data) {
    try {
      const payload = event.data.json()
      data = { ...data, ...payload }
    } catch (e) {
      data.body = event.data.text()
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag || 'ylada-notification',
      data: data.data || {},
      vibrate: [200, 100, 200]
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})
