'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'

export default function LinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [linkData, setLinkData] = useState<any>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    // Aguardar params e extrair slug
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

  useEffect(() => {
    if (!slug) return

    // Buscar dados do link
    const fetchLinkData = async () => {
      try {
        const response = await fetch(`/api/link/${slug}`)
        const data = await response.json()

        if (data.success) {
          setLinkData(data.data)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do link:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinkData()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          additionalData: {}
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
      } else {
        alert('Erro ao enviar dados. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar lead:', error)
      alert('Erro ao enviar dados. Tente novamente.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Link não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            Este link pode ter expirado ou não existe mais.
          </p>
          <div className="text-sm text-gray-500">
            Powered by <span className="font-semibold">YLADA</span>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Obrigado!
          </h1>
          <p className="text-gray-600 mb-6">
            Seus dados foram enviados com sucesso. 
            Em breve você receberá mais informações.
          </p>
          <div className="text-sm text-gray-500">
            Powered by <span className="font-semibold">YLADA</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <YLADALogo />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Quiz Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {linkData.title}
              </h1>
              <p className="text-lg text-gray-600">
                {linkData.description}
              </p>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
              {linkData.content.questions?.map((question: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label key={optionIndex} className="flex items-center">
                        <input 
                          type="radio" 
                          name={`q${index + 1}`} 
                          value={option} 
                          className="mr-3" 
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Receba seus resultados personalizados
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Preencha seus dados para receber dicas personalizadas de energia e foco
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="mr-3"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  Concordo em receber informações sobre produtos e dicas de energia e foco
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Receber Meus Resultados
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Powered by <span className="font-semibold">YLADA</span> • 
              Seus dados estão seguros e protegidos
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}