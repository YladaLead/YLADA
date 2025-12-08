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

    const checkSupport = () => {
      const isSupported = isPushNotificationSupported()
      setSupported(isSupported)
      
      if (isSupported) {
        const currentPermission = getNotificationPermission()
        setPermission(currentPermission)
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

      // 2. Registrar Service Worker
      const registration = await registerServiceWorker()
      if (!registration) {
        throw new Error('Não foi possível registrar o Service Worker')
      }

      // 3. Verificar se já tem subscription
      let subscription = await getExistingSubscription(registration)

      // 4. Se não tem, criar nova
      if (!subscription) {
        subscription = await createPushSubscription(registration, vapidPublicKey)
      }

      if (!subscription) {
        throw new Error('Não foi possível criar subscription')
      }

      // 5. Salvar no servidor
      await saveSubscriptionToServer(subscription, user.id)

      setRegistered(true)
      console.log('✅ Notificações push ativadas com sucesso')
    } catch (err: any) {
      console.error('❌ Erro ao ativar notificações:', err)
      setError(err.message || 'Erro ao ativar notificações. Tente novamente.')
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
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={handleEnableNotifications}
        disabled={loading || !user}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? 'Ativando...' : '🔔 Ativar Notificações'}
      </button>
      
      <p className="text-xs text-gray-500">
        Receba notificações mesmo com o app fechado
      </p>
    </div>
  )
}
