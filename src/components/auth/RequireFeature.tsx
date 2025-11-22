'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { hasFeatureAccess, hasAnyFeature, type Feature, type Area } from '@/lib/feature-helpers'
import Link from 'next/link'

interface RequireFeatureProps {
  children: React.ReactNode
  area: Area
  feature: Feature | Feature[] // Pode ser uma feature ou array de features
  redirectTo?: string
  showUpgradePrompt?: boolean // Se true, mostra prompt de upgrade em vez de redirecionar
}

/**
 * Componente que verifica se usuário tem acesso a uma feature específica
 * Se não tiver, mostra página de upgrade ou redireciona
 * 
 * Uso:
 * <RequireFeature area="nutri" feature="cursos">
 *   <CursosPage />
 * </RequireFeature>
 * 
 * <RequireFeature area="nutri" feature={['gestao', 'ferramentas']}>
 *   <FerramentasPage />
 * </RequireFeature>
 */
export default function RequireFeature({
  children,
  area,
  feature,
  redirectTo,
  showUpgradePrompt = true,
}: RequireFeatureProps) {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [canBypass, setCanBypass] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading || !user) {
        return
      }

      // Admin e suporte podem bypassar
      if (userProfile?.is_admin || userProfile?.is_support) {
        setCanBypass(true)
        setHasAccess(true)
        setChecking(false)
        return
      }

      try {
        setChecking(true)

        // Verificar acesso
        let access = false
        if (Array.isArray(feature)) {
          // Verificar se tem qualquer uma das features
          access = await hasAnyFeature(user.id, area, feature)
        } else {
          // Verificar feature específica
          access = await hasFeatureAccess(user.id, area, feature)
        }

        setHasAccess(access)
      } catch (error) {
        console.error('Erro ao verificar feature:', error)
        setHasAccess(false)
      } finally {
        setChecking(false)
      }
    }

    checkAccess()
  }, [user, userProfile, authLoading, area, feature])

  // Loading
  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Sem usuário autenticado
  if (!user) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta área.</p>
          <Link
            href={`/pt/${area}/login`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  // Tem acesso ou pode bypassar
  if (hasAccess || canBypass) {
    return <>{children}</>
  }

  // Não tem acesso - mostrar upgrade prompt ou redirecionar
  if (showUpgradePrompt) {
    const featureName = Array.isArray(feature) 
      ? feature.join(' ou ')
      : feature === 'gestao' ? 'Gestão'
      : feature === 'ferramentas' ? 'Ferramentas'
      : feature === 'cursos' ? 'Cursos'
      : 'Completo'

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa do plano com acesso a <strong>{featureName}</strong> para acessar esta área.
          </p>
          <div className="space-y-3">
            <Link
              href={`/pt/${area}/checkout`}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Planos e Preços
            </Link>
            <button
              onClick={() => router.back()}
              className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Redirecionar se não mostrar prompt
  if (redirectTo) {
    router.push(redirectTo)
    return null
  }

  // Fallback: redirecionar para checkout
  router.push(`/pt/${area}/checkout`)
  return null
}

