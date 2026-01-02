'use client'

import Link from 'next/link'
import { Video, Sparkles, ArrowRight, Scissors } from 'lucide-react'

export default function CreativeStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎬 Creative Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie vídeos de vendas e materiais de anúncios profissionais
          </p>
        </div>

        {/* Opções Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Editar Vídeos */}
          <Link
            href="/pt/creative-studio/editor?mode=edit"
            className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all group border-2 border-transparent hover:border-green-500 cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Editar Vídeos
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Faça upload do seu vídeo e o assistente fará análise automática com sugestões de otimização
            </p>
            <div className="flex items-center text-green-600 font-semibold text-lg">
              Começar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ✓ Análise automática<br />
                ✓ Sugestões de otimização<br />
                ✓ Editor completo
              </p>
            </div>
          </Link>

          {/* Criar Posts do Zero */}
          <Link
            href="/pt/creative-studio/editor?mode=create"
            className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all group border-2 border-transparent hover:border-purple-500 cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Criar Posts do Zero
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Construa vídeos de vendas, anúncios e posts do zero com ajuda do assistente de IA
            </p>
            <div className="flex items-center text-purple-600 font-semibold text-lg">
              Começar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ✓ Roteiros gerados por IA<br />
                ✓ Templates prontos<br />
                ✓ Vídeos de vendas e anúncios
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

