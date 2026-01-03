'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SimpleAdCreator } from '@/components/creative-studio/SimpleAdCreator'

export default function CreativeStudioEditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const area = searchParams.get('area') || 'nutri'
  const purpose = searchParams.get('purpose') || 'quick-ad'
  const objective = searchParams.get('objective') || ''

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Fixo */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/pt/creative-studio')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            🎬 Criador de Anúncios YLADA NUTRI
          </h1>
        </div>
      </div>

      {/* Conteúdo - Layout Fixo: Esquerda Compacta + Direita Chat */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4">
        <SimpleAdCreator />
      </div>
    </div>
  )
}
