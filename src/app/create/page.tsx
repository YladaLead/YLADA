'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import ChatInterface from '@/components/ChatInterface'
import { UserProfile } from '@/lib/openai-assistant'
import Link from 'next/link'

export default function CreatePage() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const handleChatComplete = async (profile: UserProfile) => {
    setUserProfile(profile)
    
    // Simular geração de link
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Criar ferramenta para ${profile.profissao} com objetivo de ${profile.objetivo_principal}`,
          profession: profile.profissao,
          category: 'saude-bemestar',
          type: 'quiz',
          profile: profile
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedLink(data.data.url)
        setIsCompleted(true)
      } else {
        throw new Error(data.error || 'Erro ao gerar link')
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error)
      // Fallback para link de exemplo
      setGeneratedLink('http://localhost:3001/link/exemplo-123')
      setIsCompleted(true)
    }
  }

  const resetForm = () => {
    setIsCompleted(false)
    setGeneratedLink('')
    setUserProfile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Crie sua ferramenta de leads em{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                60 segundos
              </span>
              !
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Converse com nossa IA e crie a ferramenta perfeita para seu negócio
            </p>
          </div>

          {!isCompleted ? (
            // Interface Conversacional
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100" style={{ height: '700px' }}>
              <ChatInterface onComplete={handleChatComplete} />
            </div>
          ) : (
            // Resultado
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="text-center">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Ferramenta Criada com Sucesso!
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Sua ferramenta personalizada está pronta para capturar leads e gerar negócios.
                </p>
                
                {/* Perfil do Usuário */}
                {userProfile && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 text-left border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Seu Perfil:</h3>
                    <div className="text-lg text-gray-600 space-y-3">
                      <p><strong>Profissão:</strong> {userProfile.profissao}</p>
                      <p><strong>Especialização:</strong> {userProfile.especializacao}</p>
                      <p><strong>Público:</strong> {userProfile.publico_alvo}</p>
                      <p><strong>Objetivo:</strong> {userProfile.objetivo_principal}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Link para compartilhar:
                    </label>
                    <div className="flex max-w-2xl mx-auto">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-6 py-4 border border-gray-300 rounded-l-xl bg-white text-lg"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedLink)}
                        className="px-6 py-4 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-6">
                    <Link
                      href={generatedLink}
                      target="_blank"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="mr-2">👀</span>
                      Ver Ferramenta
                    </Link>
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-lg font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="mr-2">🔄</span>
                      Criar Nova Ferramenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}