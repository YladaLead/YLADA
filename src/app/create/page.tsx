'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function CreatePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          category: 'energia', // Será dinâmico depois
          type: 'quiz' // Será dinâmico depois
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedLink(data.data.url)
      } else {
        throw new Error(data.error || 'Erro ao gerar link')
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error)
      alert('Erro ao gerar link. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
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
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Digite o que você quer criar
            </h1>
            <p className="text-lg text-gray-600">
              Seja específico sobre o tipo de ferramenta e público-alvo
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva sua ferramenta
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Quero um quiz de energia e foco para meus clientes de Herbalife"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Energia & Foco</option>
                    <option>Estética & Beleza</option>
                    <option>Fitness & Saúde</option>
                    <option>Negócios & Vendas</option>
                    <option>Outro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Ferramenta
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Quiz</option>
                    <option>Tabela de Metas</option>
                    <option>Landing Page</option>
                    <option>Simulador</option>
                    <option>Desafio</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando seu link...
                  </span>
                ) : (
                  'Gerar Link em 60 Segundos'
                )}
              </button>
            </div>
          </div>

          {/* Generated Link */}
          {generatedLink && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                ✅ Seu link foi criado com sucesso!
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Link para compartilhar:
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 px-4 py-3 border border-green-300 rounded-l-lg bg-white"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                      className="px-4 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Link
                    href={generatedLink}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ver Link
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Meu Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exemplos de prompts que funcionam bem:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600">
                  "Quiz de energia matinal para distribuidores Herbalife"
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600">
                  "Tabela de metas semanais para coaches de fitness"
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600">
                  "Desafio de 7 dias para clientes de estética"
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600">
                  "Simulador de ROI para afiliados de marketing"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
