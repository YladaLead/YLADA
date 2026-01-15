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

      // Verificar se a resposta tem conteúdo antes de fazer parse
      const text = await response.text()
      let data: any = {}
      
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Erro ao fazer parse da resposta:', parseError)
          throw new Error('Resposta inválida do servidor')
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `Erro ao enviar inscrição (${response.status})`)
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
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao enviar inscrição. Por favor, tente novamente.'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Erro de comunicação com o servidor. Verifique sua conexão e tente novamente.'
      } else if (error instanceof TypeError) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
      }
      
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm h-16 sm:h-20 flex items-center">
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
        {/* Hero Section - DOR DIRETA + FORMULÁRIO VISÍVEL */}
        <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Mensagem de Sucesso */}
              {showSuccess && (
                <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300 rounded-xl p-8 text-center shadow-2xl">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-black text-green-800 mb-3">
                    Cadastro Confirmado!
                  </h3>
                  <div className="bg-white rounded-lg p-6 mb-4">
                    <p className="text-lg font-bold text-gray-800 mb-3">
                      Você será avisada quando o próximo workshop for agendado:
                    </p>
                    <div className="space-y-2 text-left max-w-md mx-auto">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📱</span>
                        <span className="text-gray-700">Por WhatsApp (número cadastrado)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📧</span>
                        <span className="text-gray-700">Por email (verifique spam)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-green-700 font-semibold">
                    Fique de olho! Você receberá a data e o link de acesso em breve.
                  </p>
                </div>
              )}

              {/* Grid: DOR + FORMULÁRIO lado a lado desde o início */}
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Lado Esquerdo: DOR DIRETA */}
                <div className="w-full">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="inline-block bg-amber-400 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      🎓 WORKSHOP AO VIVO
                    </div>
                    <div className="inline-block bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      ✅ 100% GRATUITO
                    </div>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight text-white drop-shadow-sm">
                    Você é nutricionista, mas se sente perdida sobre o que fazer para o negócio funcionar?
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-white mb-6 leading-relaxed font-semibold drop-shadow-sm">
                    Esse workshop ao vivo é para quem está cansada de tentar de tudo e quer, antes de qualquer coisa, <strong className="font-black">parar de se sentir perdida</strong> e ver um caminho claro.
                  </p>
                  
                  {/* Bloco de Identificação - DOres Emocionais (DIRETO) */}
                  <div className="bg-white rounded-xl p-5 sm:p-6 mb-4 border-2 border-blue-200 shadow-xl">
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">
                      Se você se identifica com pelo menos um desses pontos:
                    </h2>
                    <div className="space-y-2.5">
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Não sei se estou fazendo certo" <span className="text-gray-600 text-xs font-semibold">(confusão)</span></span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Tenho medo de não conseguir viver disso" <span className="text-gray-600 text-xs font-semibold">(medo)</span></span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Trabalho muito e ganho pouco" <span className="text-gray-600 text-xs font-semibold">(frustração)</span></span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Tenho medo de cobrar" <span className="text-gray-600 text-xs font-semibold">(insegurança)</span></span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Estou cansada e desanimada" <span className="text-gray-600 text-xs font-semibold">(cansaço)</span></span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">"Outras crescem e eu não" <span className="text-gray-600 text-xs font-semibold">(comparação)</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Reposicionamento CURTO */}
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-amber-300 shadow-lg">
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-semibold">
                      <strong className="text-amber-500 font-black">⚠️</strong> Esse não é mais um curso que te deixa sozinha. É um encontro para você <strong className="font-black text-gray-900">parar de se sentir perdida</strong> e ver um caminho claro.
                    </p>
                  </div>
                </div>

                {/* Formulário à Direita - VISÍVEL DESDE O INÍCIO */}
                <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 border-4 border-amber-400 w-full lg:sticky lg:top-24">
                  <div className="text-center mb-5">
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      <div className="inline-block bg-amber-400 text-blue-800 px-3 sm:px-4 py-1 rounded-full text-xs font-bold shadow-md">
                        ⚡ VAGAS LIMITADAS
                      </div>
                      <div className="inline-block bg-emerald-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs font-bold shadow-md">
                        ✅ 100% GRATUITO
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-3">
                      Quero parar de me sentir perdida
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">
                      Cadastre-se agora e receba por WhatsApp:
                    </p>
                    <div className="text-gray-700 font-bold text-sm sm:text-base mb-4 space-y-1">
                      <p>📅 Data e horário do próximo workshop</p>
                      <p>🔗 Link de acesso exclusivo</p>
                      <p>⏰ Lembrete 1h antes do evento</p>
                    </div>
                  </div>

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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="Ex: CRN-3 12345"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg font-black text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {submitting ? 'Cadastrando...' : 'Quero parar de me sentir perdida'}
                    </button>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-emerald-800 text-center font-semibold">
                        🔒 Seus dados estão seguros. Você receberá apenas informações sobre o workshop.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promessa de Satisfação - FOCO EM SENTIMENTOS */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl">
                <div className="flex items-start">
                  <span className="text-emerald-500 text-4xl mr-4 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-gray-900 text-xl sm:text-2xl font-black mb-4">
                      Você vai sair do workshop com:
                    </p>
                    <ul className="text-gray-800 text-base sm:text-lg space-y-3 font-semibold">
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Clareza</strong> <span className="text-gray-600">(não mais confusão)</span></span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Segurança</strong> <span className="text-gray-600">(não mais medo)</span></span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Direção</strong> <span className="text-gray-600">(não mais perdida)</span></span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Confiança</strong> <span className="text-gray-600">(não mais insegurança)</span></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que vai acontecer no workshop */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
                🧭 O que vai acontecer no workshop
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200 shadow-md">
                  <div className="text-amber-500 text-3xl font-black mb-2">1</div>
                  <p className="text-gray-700 text-base font-medium leading-relaxed">Entender por que esforço não está virando resultado</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200 shadow-md">
                  <div className="text-amber-500 text-3xl font-black mb-2">2</div>
                  <p className="text-gray-700 text-base font-medium leading-relaxed">Identificar o erro mais comum na comunicação da nutricionista</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200 shadow-md">
                  <div className="text-amber-500 text-3xl font-black mb-2">3</div>
                  <p className="text-gray-700 text-base font-medium leading-relaxed">Ver como criar previsibilidade sem depender de indicação</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200 shadow-md">
                  <div className="text-amber-500 text-3xl font-black mb-2">4</div>
                  <p className="text-gray-700 text-base font-medium leading-relaxed">Sair com um mapa simples de próximos passos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Quem Conduz (SEM EGO) */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
                Quem vai conduzir o workshop
              </h2>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-gray-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                  {/* Foto */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 overflow-hidden border-4 border-white shadow-xl relative">
                      <Image
                        src="/images/andre-faula.jpg"
                        alt="Andre Faula"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                        priority
                        unoptimized={process.env.NODE_ENV === 'development'}
                      />
                    </div>
                  </div>
                  
                  {/* Nome e Descrição */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                      Andre Faula
                    </h3>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                      Profissional com mais de <strong>20 anos ajudando profissionais da área do bem estar</strong> a se organizarem em comunicação, rotina e geração de cliente através de <strong>métodos simples, claros e práticos</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco de Rejeição (ESSENCIAL PARA CONVERSÃO) */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-gray-200">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-6 text-center">
                  Esse workshop não é para você se:
                </h2>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-start">
                    <span className="text-red-500 text-xl sm:text-2xl mr-3 font-bold flex-shrink-0">❌</span>
                    <span className="text-gray-700 text-base sm:text-lg leading-relaxed">Você procura fórmula mágica</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 text-xl sm:text-2xl mr-3 font-bold flex-shrink-0">❌</span>
                    <span className="text-gray-700 text-base sm:text-lg leading-relaxed">Você não quer falar com pessoas</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 text-xl sm:text-2xl mr-3 font-bold flex-shrink-0">❌</span>
                    <span className="text-gray-700 text-base sm:text-lg leading-relaxed">Você não está disposta a testar algo diferente</span>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 sm:p-6">
                  <p className="text-base sm:text-lg font-bold text-emerald-800 text-center mb-2">
                    ✅ Mas é para você se quer:
                  </p>
                  <p className="text-gray-700 text-center text-base sm:text-lg">
                    Clareza, direção e controle do seu negócio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-5 text-white drop-shadow-sm">
                Quer parar de se sentir perdida?
              </h2>
              <p className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-semibold drop-shadow-sm">
                Garanta sua vaga no próximo workshop ao vivo
              </p>
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-semibold">
                ⚡ Você será avisada por WhatsApp e e-mail quando a próxima turma abrir
              </p>
              
              <Link
                href="#top"
                className="inline-block bg-amber-400 text-blue-800 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-black hover:bg-amber-300 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Quero parar de me sentir perdida
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

