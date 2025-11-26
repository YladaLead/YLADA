'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'
import ChatVendasButton from '../../../components/ChatVendasButton'

export default function NutriLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* SEÇÃO 1 – HERO */}
        <section className="bg-[#0B57FF] text-white py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
                A Plataforma Completa para Nutricionistas que Querem Crescer como Nutri-Empresárias.
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-white/90 leading-relaxed">
                Captação. Gestão. Estratégia. Formação. Tudo em um só lugar.
              </p>
            </div>

            {/* COMPONENTE DO VÍDEO – HERO */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="aspect-video bg-gray-900">
                  {/* Vídeo mantido conforme solicitado */}
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/videos/nutri-hero-poster.jpg"
                  >
                    <source src="/videos/nutri-hero.mp4" type="video/mp4" />
                    <source src="/videos/nutri-hero.webm" type="video/webm" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                </div>
              </div>
              
              {/* Texto abaixo do vídeo */}
              <p className="text-lg mt-6 text-white/80 text-center max-w-3xl mx-auto">
                A sua profissão evoluiu. O mercado mudou. A Nutri moderna não pode depender de indicação, sorte ou tentativa e erro. Ela precisa de estrutura, captação, gestão e estratégia empresarial.
              </p>
              
              {/* CTA */}
              <div className="text-center mt-8">
                <Link
                  href="/pt/nutri/checkout"
                  className="inline-block bg-white text-[#0B57FF] px-10 py-5 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Quero entrar para o YLADA Nutri agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2 – DOR / IDENTIFICAÇÃO */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Alguma dessas situações já aconteceu com você?
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <ul className="space-y-4 text-lg text-[#1A1A1A]">
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Você posta no Instagram, mas os clientes não chegam.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Você trabalha muito e ganha pouco.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Se perde na gestão das suas clientes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Tem dificuldade de transformar seguidores em atendimentos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Sente que está patinando e não consegue crescer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4F4F] mr-3 text-2xl font-bold">✗</span>
                    <span>Sente-se sozinha nesse processo.</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  Você não está sozinha. E não é culpa sua.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  A faculdade te preparou tecnicamente — muito bem, por sinal.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Mas não te ensinou:
                </p>
                <div className="bg-white rounded-xl p-6 shadow-lg text-left max-w-2xl mx-auto">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Captação de clientes</li>
                    <li>• Posicionamento profissional</li>
                    <li>• Gestão da cliente</li>
                    <li>• Estratégia empresarial</li>
                    <li>• Organização real de rotina</li>
                    <li>• Atendimento que encanta e fideliza</li>
                  </ul>
                </div>
                <p className="text-lg text-gray-700 mt-6">
                  E é exatamente essa parte que impede tantas Nutris talentosas de crescer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3 – O CONCEITO */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#1A1A1A]">
                A YLADA Nutri é a Plataforma da Nutri-Empresária.
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <p className="text-lg text-gray-700 mb-6">
                  A <strong>Nutri-Empresária</strong> é a profissional completa, que une o técnico ao empresarial. Ela atua com organização, estratégia, clareza e crescimento.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Ela tem:
                </p>
                <ul className="space-y-3 text-gray-700 mb-8">
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                    <span>Ferramentas inteligentes que captam clientes para ela.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                    <span>Um sistema de gestão que organiza toda a jornada da cliente.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                    <span>Estratégia empresarial — o que a faculdade não ensinou.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                    <span>Acompanhamento, suporte e comunidade.</span>
                  </li>
                </ul>
              </div>

              {/* Manifesto destacado */}
              <div className="bg-[#0B57FF] rounded-xl p-8 text-center text-white shadow-xl">
                <p className="text-2xl sm:text-3xl font-bold">
                  A faculdade forma Nutris. A YLADA forma Nutri‑Empresárias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 4 – O QUE É A YLADA NUTRI? (VISÃO TÉCNICA) */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que é a YLADA Nutri?
              </h2>
              <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
                Tudo o que você precisa para crescer com consistência está aqui:
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">1. Ferramentas inteligentes de captação</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Quizzes profissionais</li>
                    <li>• Portais personalizáveis</li>
                    <li>• Links inteligentes</li>
                    <li>• WhatsApp automático</li>
                    <li>• Leads qualificados 24/7</li>
                  </ul>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">2. Gestão profissional completa</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• CRM para Nutris</li>
                    <li>• Evolução da cliente</li>
                    <li>• Agenda organizada</li>
                    <li>• Histórico e anotações</li>
                    <li>• Tudo num só lugar</li>
                  </ul>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">3. Formação Empresarial Nutri</h3>
                  <p className="text-sm text-gray-700 mb-2">(somente no plano anual)</p>
                  <p className="text-sm text-gray-700">
                    A formação que transforma Nutris Tradicionais em Nutri-Empresárias. Baseada no manifesto: postura, marketing, clareza, estratégia e crescimento.
                  </p>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">4. Comunidade e Networking</h3>
                  <p className="text-sm text-gray-700">
                    Nada de crescer sozinha. A comunidade acelera tudo.
                  </p>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">5. Lives e mentoria semanal</h3>
                  <p className="text-sm text-gray-700">
                    Para não deixar dúvidas, manter o foco e garantir que você evolua.
                  </p>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2572FF]">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">6. Suporte próximo</h3>
                  <p className="text-sm text-gray-700">
                    Humanizado. Rápido. Dedicado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5 – TRANSFORMAÇÃO REAL (ANTES E DEPOIS) */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Transformação Real
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* ANTES */}
                <div className="bg-[#FF4F4F]/10 rounded-xl p-8 border-2 border-[#FF4F4F]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF4F4F]">Antes do YLADA:</h3>
                  <ul className="space-y-4">
                    {[
                      'Desorganização',
                      'Falta de clientes',
                      'Insegurança',
                      'Atendimento confuso',
                      'Falta de estratégia',
                      'Estagnação'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✖</span>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DEPOIS */}
                <div className="bg-[#29CC6A]/10 rounded-xl p-8 border-2 border-[#29CC6A]">
                  <h3 className="text-2xl font-bold mb-6 text-[#29CC6A]">Com o YLADA:</h3>
                  <ul className="space-y-4">
                    {[
                      'Gestão total',
                      'Captação funcionando',
                      'Atendimento profissional',
                      'Clareza e confiança',
                      'Crescimento constante',
                      'Estratégia empresarial aplicada'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#29CC6A] mr-3 text-xl font-bold">✔</span>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6 – PROVA SOCIAL */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Resultados reais de Nutris que já usaram o sistema
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Depoimento 1 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">Cidade, Estado</p>
                      <p className="text-sm text-[#0B57FF]">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "O YLADA transformou completamente minha rotina. Hoje tenho agenda cheia e organização real."
                  </p>
                  <div className="flex text-[#F2C94C] text-xl">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>

                {/* Depoimento 2 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">Cidade, Estado</p>
                      <p className="text-sm text-[#0B57FF]">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "Consegui triplicar meus clientes em 3 meses usando as ferramentas de captação."
                  </p>
                  <div className="flex text-[#F2C94C] text-xl">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>

                {/* Depoimento 3 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">Cidade, Estado</p>
                      <p className="text-sm text-[#0B57FF]">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "A gestão profissional mudou tudo na minha clínica. Agora tenho controle total."
                  </p>
                  <div className="flex text-[#F2C94C] text-xl">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 7 – BENEFÍCIOS (CLAREZA DE VALOR) */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Por que o YLADA acelera resultados?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🎯', title: 'Captação automática', desc: 'leads 24/7' },
                  { icon: '💼', title: 'Atendimento nível profissional', desc: 'organização total' },
                  { icon: '📋', title: 'Organização total da cliente', desc: 'tudo em um lugar' },
                  { icon: '💡', title: 'Clareza e visão empresarial', desc: 'estratégia aplicada' },
                  { icon: '⚡', title: 'Crescimento rápido', desc: 'resultados consistentes' },
                  { icon: '👑', title: 'Nutri-Empresária na prática', desc: 'transformação real' },
                  { icon: '🤝', title: 'Comunidade forte', desc: 'networking e apoio' },
                  { icon: '💬', title: 'Suporte próximo', desc: 'humanizado e rápido' },
                ].map((beneficio, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                    <div className="text-4xl mb-4">{beneficio.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-[#1A1A1A]">{beneficio.title}</h3>
                    <p className="text-gray-600 text-sm">{beneficio.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 8 – A OFERTA (MODELO DE PLANOS) */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Escolha o melhor plano para você
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* PLANO ANUAL - DESTAQUE */}
                <div className="bg-gradient-to-br from-[#0B57FF] to-[#2572FF] rounded-xl p-8 text-white shadow-2xl border-4 border-[#2572FF] transform scale-105">
                  <div className="text-4xl mb-4">🔥</div>
                  <h3 className="text-3xl font-bold mb-4">Plano Anual Completo</h3>
                  <p className="text-xl mb-2 font-semibold">O caminho da Nutri-Empresária</p>
                  <p className="text-lg mb-6 text-white/90">
                    A forma mais inteligente de crescer rápido, com tudo incluso.
                  </p>
                  
                  <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <p className="text-4xl font-black mb-2">R$ 970</p>
                    <p className="text-lg">à vista ou 12x</p>
                  </div>

                  <ul className="space-y-3 mb-8 text-lg">
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Ferramentas de captação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Gestão completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Formação Empresarial Nutri (R$ 970)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Comunidade</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Lives semanais</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Suporte próximo</span>
                    </li>
                  </ul>

                  <div className="bg-white/20 rounded-lg p-4 mb-6">
                    <p className="text-sm mb-2">👉 O único plano que te transforma em Nutri-Empresária.</p>
                    <p className="text-sm mb-2">👉 Economize 10 meses de mensalidade.</p>
                    <p className="text-sm">👉 Acesso total por 1 ano.</p>
                  </div>

                  <button
                    onClick={async () => {
                      const response = await fetch('/api/nutri/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          planType: 'annual',
                          productType: 'platform_annual',
                          paymentMethod: 'auto'
                        })
                      })
                      const data = await response.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="block w-full bg-white text-[#0B57FF] px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors shadow-xl text-center"
                  >
                    Quero aproveitar o plano anual agora
                  </button>
                </div>

                {/* PLANO MENSAL */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
                  <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Plano Mensal</h3>
                  <p className="text-lg mb-2 font-semibold text-gray-700">R$ 97/mês</p>
                  
                  <ul className="space-y-3 mb-8 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Ferramentas de captação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Gestão completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Suporte</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem formação</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem comunidade completa</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem lives</span>
                    </li>
                  </ul>

                  <button
                    onClick={async () => {
                      const response = await fetch('/api/nutri/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          planType: 'monthly',
                          productType: 'platform_monthly',
                          paymentMethod: 'auto'
                        })
                      })
                      const data = await response.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="block w-full bg-[#0B57FF] text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-[#2572FF] transition-colors shadow-lg text-center"
                  >
                    Quero começar no mensal
                  </button>
                </div>

                {/* FORMAÇÃO EMPRESARIAL NUTRI (STANDALONE) */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[#0B57FF]">
                  <div className="text-4xl mb-4 text-center">🎓</div>
                  <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A] text-center">Formação Empresarial Nutri</h3>
                  <p className="text-lg mb-2 font-semibold text-gray-700 text-center">R$ 970</p>
                  <p className="text-sm text-gray-600 text-center mb-6">ou 12x de R$ 97</p>
                  
                  <ul className="space-y-3 mb-8 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Formação Empresarial Nutri completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Acesso vitalício ao conteúdo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-[#0B57FF]">✓</span>
                      <span>Transformação em Nutri-Empresária</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem acesso à plataforma</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem ferramentas de captação</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <span className="mr-3">✗</span>
                      <span>Sem gestão de clientes</span>
                    </li>
                  </ul>

                  <button
                    onClick={async () => {
                      const response = await fetch('/api/nutri/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          planType: 'annual',
                          productType: 'formation_only',
                          paymentMethod: 'auto'
                        })
                      })
                      const data = await response.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="block w-full bg-[#0B57FF] text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-[#2572FF] transition-colors shadow-lg text-center"
                  >
                    Quero apenas a Formação
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 9 – GARANTIA */}
        <section className="py-16 sm:py-24 bg-[#E9F1FF]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-6">🛡️</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#1A1A1A]">
                Garantia incondicional de 7 dias
              </h2>
              <p className="text-xl mb-4 text-gray-700">
                Se você não gostar, devolvemos 100% do valor.
              </p>
              <p className="text-lg text-gray-600">
                Sem risco. Sem burocracia. Sem letras miúdas.
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 10 – FECHO FINAL */}
        <section className="py-16 sm:py-24 bg-[#0B57FF] text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Agora é sua vez de crescer como Nutri-Empresária.
              </h2>
              <p className="text-xl mb-4 text-white/90">
                Nenhuma Nutri cresce sozinha.
              </p>
              <p className="text-lg mb-4 text-white/80">
                Mas quem entra no YLADA tem captação, gestão, formação, suporte e estratégia.
              </p>
              <p className="text-lg mb-8 text-white/80">
                Você está a um clique de mudar completamente a sua carreira.
              </p>
              <Link
                href="/pt/nutri/checkout"
                className="inline-block bg-white text-[#0B57FF] px-10 py-5 rounded-lg text-2xl font-bold hover:bg-gray-100 transition-colors shadow-2xl"
              >
                Quero entrar para o YLADA Nutri agora
              </Link>
            </div>
          </div>
        </section>

        {/* SEÇÃO 11 – PERGUNTAS FREQUENTES */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    pergunta: 'Como funciona a Formação Empresarial Nutri?',
                    resposta: 'A Formação Empresarial Nutri é um curso completo de R$ 970 que ensina marketing, captação, atendimento, vendas, fidelização e organização. Está incluída apenas no plano anual de lançamento.'
                  },
                  {
                    pergunta: 'Posso cancelar a qualquer momento?',
                    resposta: 'Sim! Você pode cancelar a qualquer momento. Além disso, oferecemos garantia incondicional de 7 dias - se não gostar, devolvemos 100% do valor.'
                  },
                  {
                    pergunta: 'O que está incluído no plano anual?',
                    resposta: 'No plano anual (R$ 970/ano) você leva: todas as ferramentas de captação, gestão profissional completa, Formação Empresarial Nutri (R$ 970), suporte, lives semanais e acesso à comunidade.'
                  },
                  {
                    pergunta: 'Como funciona o suporte?',
                    resposta: 'Oferecemos suporte dedicado através do chat na plataforma, além de lives semanais com mentoria e conteúdo exclusivo para membros.'
                  },
                  {
                    pergunta: 'Preciso ter conhecimento técnico para usar?',
                    resposta: 'Não! A plataforma foi desenvolvida para ser intuitiva e fácil de usar. Qualquer nutricionista consegue usar sem conhecimento técnico prévio.'
                  },
                  {
                    pergunta: 'Posso começar com plano mensal e depois migrar para anual?',
                    resposta: 'Sim, você pode começar com qualquer plano mensal e depois migrar para o plano anual quando quiser. No entanto, a Formação Empresarial Nutri está disponível apenas no plano anual.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-[#1A1A1A]">{item.pergunta}</span>
                      <span className="text-[#0B57FF] text-2xl">
                        {faqOpen === index ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.resposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Nutricionista — Your Leading Advanced Data Assistant
            </p>
            <p className="text-gray-500 text-xs text-center mb-2">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs text-center">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-400 text-xs text-center">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>

      {/* Botão de Chat com Atendente */}
      <ChatVendasButton />
    </div>
  )
}
