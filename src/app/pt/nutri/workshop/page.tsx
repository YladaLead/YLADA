'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { trackNutriWorkshopView, trackNutriWorkshopLead } from '@/lib/facebook-pixel'

export default function WorkshopPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    crn: '',
    countryCode: 'BR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Rastrear visualização da página de workshop
  useEffect(() => {
    trackNutriWorkshopView()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/nutri/workshop/inscricao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          crn: formData.crn || null,
          source: 'workshop_landing_page'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar inscrição')
      }

      // Sucesso
      setShowSuccess(true)
      setFormData({ nome: '', email: '', telefone: '', crn: '', countryCode: 'BR' })
      
      // Disparar evento do Pixel (Lead)
      trackNutriWorkshopLead()

      // Scroll suave para mensagem de sucesso
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      console.error('Erro ao enviar inscrição:', error)
      setError(error.message || 'Erro ao enviar inscrição. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section com Formulário */}
        <section className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Mensagem de Sucesso */}
              {showSuccess && (
                <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Inscrição Confirmada!
                  </h3>
                  <p className="text-lg text-green-700 mb-4">
                    Você receberá um email com o link do workshop e todas as informações necessárias.
                  </p>
                  <p className="text-sm text-green-600">
                    Verifique sua caixa de entrada e spam. O link será enviado também por WhatsApp.
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Conteúdo à Esquerda */}
                <div>
                  <div className="inline-block bg-yellow-400 text-[#2563EB] px-4 py-2 rounded-full text-sm font-bold mb-4">
                    🎓 WORKSHOP COM GARANTIA
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                    Como Resolver os 4 Maiores Problemas da Nutricionista
                  </h1>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <p className="font-bold text-lg">Data e horário serão informados</p>
                        <p className="text-white/90">Você receberá o link por email e WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">⏱️</span>
                      <div>
                        <p className="font-bold text-lg">60-90 minutos</p>
                        <p className="text-white/90">Conteúdo prático e direto ao ponto</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">🛡️</span>
                      <div>
                        <p className="font-bold text-lg">Garantia de 7 dias</p>
                        <p className="text-white/90">Cancele em até 7 dias e receba 100% do seu dinheiro de volta</p>
                      </div>
                    </div>
                  </div>

                  {/* Seção Destacada: O que você vai aprender */}
                  <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 mb-8 border-2 border-yellow-300/30">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🎯</span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        O que você vai aprender:
                      </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-start">
                          <span className="text-green-300 text-2xl mr-3 font-bold">✓</span>
                          <span className="text-white font-bold text-lg">Como não perder leads por falta de tempo</span>
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-start">
                          <span className="text-green-300 text-2xl mr-3 font-bold">✓</span>
                          <span className="text-white font-bold text-lg">Como captar mais pacientes de forma consistente</span>
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-start">
                          <span className="text-green-300 text-2xl mr-3 font-bold">✓</span>
                          <span className="text-white font-bold text-lg">Como economizar tempo criando materiais</span>
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-start">
                          <span className="text-green-300 text-2xl mr-3 font-bold">✓</span>
                          <span className="text-white font-bold text-lg">Como organizar seu negócio para crescer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulário à Direita */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Garanta sua vaga gratuita
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Preencha seus dados e receba o link do workshop
                  </p>

                  {error && (
                    <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp (com DDD) <span className="text-red-600">*</span>
                      </label>
                      <PhoneInputWithCountry
                        value={formData.telefone}
                        onChange={(phone, countryCode) => {
                          setFormData({ ...formData, telefone: phone, countryCode: countryCode || 'BR' })
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CRN (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.crn}
                        onChange={(e) => setFormData({ ...formData, crn: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        placeholder="Ex: CRN-3 12345"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#2563EB] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {submitting ? 'Enviando...' : 'Garantir Minha Vaga Gratuita'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Ao se inscrever, você concorda em receber informações sobre o workshop e a plataforma YLADA.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Vídeo */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[#1A1A1A]">
                Assista ao vídeo de apresentação
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Conheça mais sobre o workshop e o que você vai aprender
              </p>
              
              {/* Container do Vídeo - Responsivo */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl overflow-hidden shadow-xl">
                  {/* 
                    SUBSTITUA O IFRAME ABAIXO PELO SEU VÍDEO
                    Opções:
                    1. YouTube: https://www.youtube.com/embed/VIDEO_ID
                    2. Vimeo: https://player.vimeo.com/video/VIDEO_ID
                    3. Loom: https://www.loom.com/embed/VIDEO_ID
                    4. Outro: Cole o código embed do seu vídeo
                  */}
                  <iframe
                    className="w-full h-full"
                    src=""
                    title="Vídeo de apresentação do workshop"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Placeholder quando não houver vídeo */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🎥</div>
                      <p className="text-xl font-bold mb-2">Vídeo em breve</p>
                      <p className="text-white/80">
                        Cole o código embed do seu vídeo aqui
                      </p>
                      <p className="text-sm text-white/60 mt-4">
                        (YouTube, Vimeo, Loom, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Benefícios Detalhados - DESTACADA */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-yellow-400 text-[#2563EB] px-6 py-2 rounded-full text-sm font-bold mb-4">
                  🎯 CONTEÚDO DO WORKSHOP
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
                  O que você vai aprender
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Conteúdo prático e direto ao ponto para transformar seu negócio
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="text-5xl mr-4">⏰</div>
                    <h3 className="text-2xl font-black text-white">
                      Como não perder leads
                    </h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Aprenda a automatizar respostas e nunca mais perder um cliente por demora. Veja como a YLADA responde 24h por dia, mesmo enquanto você dorme.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="text-5xl mr-4">📈</div>
                    <h3 className="text-2xl font-black text-white">
                      Como captar mais pacientes
                    </h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Descubra ferramentas de captação que funcionam: quizzes automáticos, calculadoras personalizadas e sistemas que geram leads qualificados.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="text-5xl mr-4">⚡</div>
                    <h3 className="text-2xl font-black text-white">
                      Como economizar tempo
                    </h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Veja como usar 29 templates prontos para criar materiais profissionais em minutos, não horas. Foque no que realmente importa: seus pacientes.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="text-5xl mr-4">📊</div>
                    <h3 className="text-2xl font-black text-white">
                      Como organizar seu negócio
                    </h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Conheça o dashboard completo que organiza leads, clientes, consultas e métricas em um só lugar. Tenha clareza total do seu negócio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Caso de Sucesso */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Resultados reais de quem usa a YLADA
              </h2>
              
              <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Caso: Dra. Ana
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl font-black mb-2">291</div>
                    <p className="text-white/90">Leads qualificados em 30 dias</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl font-black mb-2">85</div>
                    <p className="text-white/90">Clientes convertidos</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl font-black mb-2">R$ 127.500</div>
                    <p className="text-white/90">Faturamento extra</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl font-black mb-2">-33%</div>
                    <p className="text-white/90">Menos horas trabalhadas</p>
                  </div>
                </div>
                
                <p className="text-center text-lg text-white/90 italic">
                  "A YLADA transformou completamente meu negócio. Agora trabalho menos e ganho mais, com processos que funcionam sozinhos."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Não perca essa oportunidade!
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Workshop com garantia de 7 dias. Aprenda a resolver os maiores problemas da nutricionista e transforme seu negócio.
              </p>
              
              <Link
                href="#top"
                className="inline-block bg-white text-[#2563EB] px-8 sm:px-12 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Garantir Minha Vaga Agora
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/pt/nutri">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 mx-auto mb-4 opacity-80"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

