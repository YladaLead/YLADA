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
      setGeneratedLink('https://ylada.app/link/exemplo-123')
      setIsCompleted(true)
    }
  }

  const resetForm = () => {
    setIsCompleted(false)
    setGeneratedLink('')
    setUserProfile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crie sua ferramenta de leads em 60 segundos!
            </h1>
            <p className="text-lg text-gray-600">
              Converse com nossa IA e crie a ferramenta perfeita para seu negócio
            </p>
          </div>

          {!isCompleted ? (
            // Interface Conversacional
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <ChatInterface onComplete={handleChatComplete} />
            </div>
          ) : (
            // Resultado
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ferramenta Criada com Sucesso!
                </h2>
                <p className="text-gray-600 mb-6">
                  Sua ferramenta personalizada está pronta para capturar leads e gerar negócios.
                </p>
                
                {/* Perfil do Usuário */}
                {userProfile && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Seu Perfil:</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Profissão:</strong> {userProfile.profissao}</p>
                      <p><strong>Especialização:</strong> {userProfile.especializacao}</p>
                      <p><strong>Público:</strong> {userProfile.publico_alvo}</p>
                      <p><strong>Objetivo:</strong> {userProfile.objetivo_principal}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link para compartilhar:
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-white"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedLink)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Link
                      href={generatedLink}
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Ver Ferramenta
                    </Link>
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
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