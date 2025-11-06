// Script para limpar cache - adicionar no início do HTML
// Este script força o navegador a sempre buscar a versão mais recente

if (typeof window !== 'undefined') {
  // Limpar todos os caches
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name)
      })
    })
  }

  // Desregistrar Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }

  // Limpar localStorage e sessionStorage relacionados ao cache
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.includes('cache') || key.includes('next') || key.includes('supabase')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    // Ignorar erros
  }
}

