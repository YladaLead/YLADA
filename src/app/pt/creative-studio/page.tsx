'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function CreativeStudioPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/pt/creative-studio/editor?mode=create&area=nutri&purpose=quick-ad')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        {/* Botão de Atalho CapCut Kit */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/pt/creative-studio/capcut-kit')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>🎬 CapCut Kit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Criador de Anúncios YLADA NUTRI
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Crie anúncios profissionais para Instagram em minutos
          </p>
          <p className="text-sm text-gray-500">
            Focado em vender YLADA NUTRI para nutricionistas com agenda vazia
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Botão Kit CapCut */}
          <button
            onClick={() => router.push('/pt/creative-studio/capcut-kit')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <div className="text-left">
              <div className="font-bold text-lg">🎬 Gerar Kit CapCut Completo</div>
              <div className="text-sm text-green-100">
                Materiais detalhados para editor de vídeo
              </div>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-start gap-3 text-left">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Roteiro Automático</h3>
              <p className="text-sm text-gray-600">IA cria roteiro completo com hook, problema, solução e CTA</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Imagens Inteligentes</h3>
              <p className="text-sm text-gray-600">Busca ou cria imagens automaticamente para cada cena</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Vídeo Pronto</h3>
              <p className="text-sm text-gray-600">Gera vídeo completo automaticamente após aprovações</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold text-lg flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          Criar Anúncio Agora
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-500 mt-6">
          ⚡ Anúncio pronto em menos de 5 minutos
        </p>
      </div>
    </div>
  )
}
