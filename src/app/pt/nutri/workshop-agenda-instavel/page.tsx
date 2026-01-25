'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { trackNutriWorkshopLead, trackNutriWorkshopView } from '@/lib/facebook-pixel'

function buildWhatsappUrl(opts: { phone: string; message: string }) {
  const numeroLimpo = (opts.phone || '').replace(/[^0-9]/g, '')
  if (!numeroLimpo) return null
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(opts.message)}`
}

export default function WorkshopAgendaInstavelPage() {
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

  const whatsappNumber =
    process.env.NEXT_PUBLIC_NUTRI_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '5519997230912'

  const whatsappUrl = buildWhatsappUrl({
    phone: whatsappNumber,
    message:
      'Acabei de me inscrever na aula prática da YLADA Nutri e gostaria de agendar uma conversa rápida para entender os próximos passos.'
  })

  // Rastrear visualização da página
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
          source: 'workshop_agenda_instavel_landing_page'
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
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

        <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300 rounded-xl p-8 text-center shadow-2xl">
              <div className="text-5xl sm:text-6xl mb-4">✅</div>
              <h3 className="text-2xl sm:text-3xl font-black text-green-800 mb-3">
                Cadastro Confirmado!
              </h3>
              <div className="bg-white rounded-lg p-6 mb-4">
                <p className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                  Você vai receber as informações da próxima aula prática ao vivo:
                </p>
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📱</span>
                    <span className="text-gray-700">Por WhatsApp (número cadastrado)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📧</span>
                    <span className="text-gray-700">Por e-mail (verifique spam)</span>
                  </div>
                </div>
              </div>

              {whatsappUrl && (
                <div className="max-w-md mx-auto">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-black text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Quero agendar no WhatsApp agora
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Link href="/pt/nutri">
                <Image
                  src="/images/logo/nutri-horizontal.png"
                  alt="YLADA Nutri"
                  width={133}
                  height={40}
                  className="h-8 mx-auto mb-4 opacity-90"
                />
              </Link>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Portal Solutions Tech & Innovation LTDA
              </p>
              <p className="text-gray-500 text-xs">
                CNPJ: 63.447.492/0001-88
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
        {/* Hero Section - DOR DIRETA + FORMULÁRIO VISÍVEL */}
        <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Grid: DOR + FORMULÁRIO lado a lado desde o início */}
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Lado Esquerdo: DOR DIRETA */}
                <div className="w-full order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="inline-block bg-amber-400 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      🎓 AULA PRÁTICA AO VIVO
                    </div>
                    <div className="inline-block bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      ✅ 100% GRATUITO
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight text-white drop-shadow-sm">
                    Sua agenda fica cheia num mês e vazia no outro?
                  </h1>

                  <p className="text-lg sm:text-xl text-white mb-6 leading-relaxed font-semibold drop-shadow-sm">
                    Você vai descobrir o que está travando sua agenda e sair com um plano simples de ajustes para começar a gerar procura
                    com mais constância.
                  </p>

                  {/* Bloco de Identificação - AGENDA INSTÁVEL */}
                  <div className="bg-white rounded-xl p-5 sm:p-6 mb-4 border-2 border-blue-200 shadow-xl">
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">
                      Se você se identifica com pelo menos um desses pontos:
                    </h2>
                    <div className="space-y-2.5">
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">
                          “Dependo de indicação e fico no alto e baixo”
                        </span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">
                          “Tenho semanas vazias e não sei o que fazer”
                        </span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">
                          “Até posto, mas não vira consulta”
                        </span>
                      </div>
                      <div className="flex items-start bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                        <span className="text-amber-500 text-lg mr-2.5 font-black flex-shrink-0 mt-0.5">•</span>
                        <span className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">
                          “Trabalho muito, mas a agenda não estabiliza”
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promessa objetiva */}
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-amber-300 shadow-lg">
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-semibold">
                      <strong className="text-amber-500 font-black">Direto ao ponto:</strong> você vai conseguir fazer um autodiagnóstico,
                      entender com clareza o que está te travando e sair com um plano prático de ajustes.
                    </p>
                  </div>
                </div>

                {/* Formulário à Direita - VISÍVEL DESDE O INÍCIO */}
                <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 border-4 border-amber-400 w-full order-1 lg:order-2 lg:sticky lg:top-24">
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
                      Quero estabilizar minha agenda
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">
                      Cadastre-se e receba por WhatsApp:
                    </p>
                    <div className="text-gray-700 font-bold text-sm sm:text-base mb-4 space-y-1">
                      <p>📅 Data e horário da próxima aula</p>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs sm:text-sm font-black">
                        🔒 Exclusivo para nutricionistas
                      </span>
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
                        E-mail <span className="text-red-600">*</span>
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
                      {submitting ? 'Cadastrando...' : 'Quero o plano para estabilizar minha agenda'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Após confirmar o cadastro, você poderá falar no WhatsApp sem perder sua inscrição.
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-emerald-800 text-center font-semibold">
                        🔒 Seus dados estão seguros. Você receberá apenas informações sobre a aula.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promessa de Saída - FOCO EM AGENDA */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl">
                <div className="flex items-start">
                  <span className="text-emerald-500 text-4xl mr-4 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-gray-900 text-xl sm:text-2xl font-black mb-4">
                      Você vai sair da aula com:
                    </p>
                    <ul className="text-gray-800 text-base sm:text-lg space-y-3 font-semibold">
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Diagnóstico</strong> do que está travando sua agenda hoje</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Ajustes práticos</strong> para aplicar nesta semana</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Plano simples</strong> para gerar procura com mais constância</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-3 text-xl">→</span>
                        <span><strong className="font-black text-gray-900">Próximo passo</strong> (sem compromisso) para estabilizar sua agenda</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que vai acontecer na aula */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
                📌 O que vai acontecer na aula prática ao vivo
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                  <p className="text-gray-800 text-base font-semibold leading-relaxed">
                    <span className="text-amber-500 font-black mr-2">1</span>
                    Identificar o ponto exato que está travando sua agenda <span className="text-gray-600">(sem achismo)</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                  <p className="text-gray-800 text-base font-semibold leading-relaxed">
                    <span className="text-amber-500 font-black mr-2">2</span>
                    Ajustar sua oferta e sua mensagem para virar consulta <span className="text-gray-600">(não só curtida)</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                  <p className="text-gray-800 text-base font-semibold leading-relaxed">
                    <span className="text-amber-500 font-black mr-2">3</span>
                    Montar uma rotina mínima de captação + follow-up <span className="text-gray-600">(previsibilidade)</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                  <p className="text-gray-800 text-base font-semibold leading-relaxed">
                    <span className="text-amber-500 font-black mr-2">4</span>
                    Sair com um plano simples para aplicar nesta semana <span className="text-gray-600">(passo a passo)</span>
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm sm:text-base text-gray-600 text-center font-semibold">
                No final, se fizer sentido, você conhece o <strong className="text-gray-900">Método YLADA</strong> (R$197/mês) para estabilizar sua agenda com estrutura e acompanhamento.
              </p>
            </div>
          </div>
        </section>

        {/* Seção: Quem Conduz */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
                Quem vai conduzir a aula
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
                      Profissional com mais de <strong>20 anos ajudando profissionais da área do bem estar</strong> a se organizarem em
                      comunicação, rotina e geração de cliente através de <strong>métodos simples, claros e práticos</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco de Rejeição */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-gray-200">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-6 text-center">
                  Essa aula não é para você se:
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
                    Previsibilidade, rotina e agenda mais estável (sem depender de sorte)
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
                Quer estabilizar sua agenda?
              </h2>
              <p className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-semibold drop-shadow-sm">
                Garanta sua vaga na próxima aula prática ao vivo
              </p>
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-semibold">
                ⚡ Você será avisada por WhatsApp e e-mail com data, horário e link de acesso
              </p>

              <Link
                href="#top"
                className="inline-block bg-amber-400 text-blue-800 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-black hover:bg-amber-300 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Quero o plano para estabilizar minha agenda
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/pt/nutri">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 mx-auto mb-4 opacity-90"
              />
            </Link>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-500 text-xs">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

