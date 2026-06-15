'use client'

import Link from 'next/link'
import { useIsIOSNativeApp } from '@/lib/native-app'
import NativeAppNotice from '@/components/ylada/NativeAppNotice'

interface UpgradePromptProps {
  area: 'nutri' | 'coach' | 'nutra'
  feature?: string
  message?: string
}

export default function UpgradePrompt({
  area,
  feature = 'cursos',
  message,
}: UpgradePromptProps) {
  const featureName =
    feature === 'gestao'
      ? 'Gestão'
      : feature === 'ferramentas'
      ? 'Ferramentas'
      : feature === 'cursos'
      ? 'Cursos'
      : 'Completo'

  const defaultMessage = message || `Você precisa do plano com acesso a ${featureName} para acessar esta área.`

  // App iOS: sem CTA de planos/preços (guideline 3.1.1 Apple).
  const isIOSApp = useIsIOSNativeApp()
  if (isIOSApp) return <NativeAppNotice homeHref={`/pt/${area}/home`} />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Acesso Restrito
        </h2>
        <p className="text-gray-600 mb-6">{defaultMessage}</p>
        <div className="space-y-3">
          <Link
            href={`/pt/${area}/checkout`}
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver Planos e Preços
          </Link>
          <Link
            href={`/pt/${area}/home`}
            className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}

