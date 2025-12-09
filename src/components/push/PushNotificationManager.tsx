'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  createPushSubscription,
  saveSubscriptionToServer,
  getExistingSubscription
} from '@/lib/push-notifications'

interface PushNotificationManagerProps {
  vapidPublicKey: string
  autoRegister?: boolean // Se deve registrar automaticamente quando montar
}

export default function PushNotificationManager({
  vapidPublicKey,
  autoRegister = false
}: PushNotificationManagerProps) {
  const { user } = useAuth()
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar suporte e permissão ao montar
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkSupport = async () => {
      const isSupported = isPushNotificationSupported()
      setSupported(isSupported)
      
      if (isSupported) {
        const currentPermission = getNotificationPermission()
        setPermission(currentPermission)
        
        // Verificar se já tem service worker registrado
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration('/')
            if (registration) {
              console.log('[Push] Service Worker já registrado:', {
                active: !!registration.active,
                scope: registration.scope
              })
              
              // Se já tem subscription, marcar como registrado
              if (registration.active) {
                const existingSub = await getExistingSubscription(registration)
                if (existingSub) {
                  setRegistered(true)
                }
              }
            }
          } catch (error) {
            console.warn('[Push] Erro ao verificar Service Worker:', error)
          }
        }
      }
    }

    checkSupport()
  }, [])

  // Registrar automaticamente se solicitado
  useEffect(() => {
    if (autoRegister && supported && user && permission === 'default') {
      handleEnableNotifications()
    }
  }, [autoRegister, supported, user, permission])

  const handleEnableNotifications = async () => {
    if (!user) {
      setError('Você precisa estar logado para ativar notificações')
      return
    }

    if (!supported) {
      setError('Seu navegador não suporta notificações push')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Solicitar permissão
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)

      if (newPermission !== 'granted') {
        setError('Permissão de notificações negada. Por favor, habilite nas configurações do navegador.')
        setLoading(false)
        return
      }

      // 2. Registrar Service Worker e aguardar estar ativo
      console.log('[Push] Registrando Service Worker...')
      const registration = await registerServiceWorker()
      if (!registration) {
        throw new Error('Não foi possível registrar o Service Worker. Verifique se está usando HTTPS ou localhost.')
      }

      // Aguardar um pouco extra para garantir que está totalmente ativo
      if (registration.active) {
        console.log('[Push] Service Worker está ativo!')
      } else {
        console.log('[Push] Aguardando Service Worker ficar ativo...')
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // 3. Verificar se já tem subscription
      let subscription = await getExistingSubscription(registration)

      // 4. Se não tem, criar nova
      if (!subscription) {
        console.log('[Push] Criando nova subscription...')
        subscription = await createPushSubscription(registration, vapidPublicKey)
      } else {
        console.log('[Push] Subscription já existe!')
      }

      if (!subscription) {
        throw new Error('Não foi possível criar subscription. Tente recarregar a página.')
      }

      // 5. Salvar no servidor
      console.log('[Push] Salvando subscription no servidor...')
      await saveSubscriptionToServer(subscription, user.id)

      setRegistered(true)
      console.log('✅ Notificações push ativadas com sucesso')
    } catch (err: any) {
      console.error('❌ Erro ao ativar notificações:', err)
      
      // Mensagens de erro mais específicas
      let errorMessage = err.message || 'Erro ao ativar notificações. Tente novamente.'
      
      if (err.message?.includes('active service worker') || err.message?.includes('Service Worker não está ativo')) {
        errorMessage = 'Service Worker não está ativo. Por favor, recarregue a página e tente novamente.'
      } else if (err.message?.includes('HTTPS') || err.message?.includes('localhost')) {
        errorMessage = 'Notificações push requerem HTTPS ou localhost. Verifique a conexão.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Se não suporta, não renderizar nada
  if (!supported) {
    return null
  }

  // Se já tem permissão e está registrado, mostrar status
  if (permission === 'granted' && registered) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        <span>🔔</span>
        <span>Notificações ativadas</span>
      </div>
    )
  }

  // Se permissão foi negada
  if (permission === 'denied') {
    return (
      <div className="text-sm text-gray-500">
        <p>Notificações bloqueadas. Habilite nas configurações do navegador.</p>
      </div>
    )
  }

  // Botão para ativar
  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="font-medium mb-1">⚠️ Erro ao ativar notificações</p>
          <p className="mb-2">{error}</p>
          {error.includes('recarregue a página') && (
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Recarregar Página
            </button>
          )}
        </div>
      )}
      
      <button
        onClick={handleEnableNotifications}
        disabled={loading || !user}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Ativando...</span>
          </>
        ) : (
          <>
            <span>🔔</span>
            <span>Ativar Notificações</span>
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500">
        Receba notificações mesmo com o app fechado
      </p>
    </div>
  )
}
