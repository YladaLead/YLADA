'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { trackNutriDiscoveryView } from '@/lib/facebook-pixel'

export default function NutriDescobrirPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  // Rastrear visualização da página de descoberta
  useEffect(() => {
    trackNutriDiscoveryView()
  }, [])

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Vi o YLADA Nutri e gostaria de entender melhor como funciona.')
    window.open(`https://wa.me/5519997230912?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Simples */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 flex items-center">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/pt">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={186}
              height={56}
              className="h-11 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      <main>
        {/* HERO - Tom Leve e Exploratório */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-12 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg sm:text-xl text-gray-600 mb-4 font-medium">
                Pare de se sentir sozinha tentando descobrir como fazer seu negócio funcionar.
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                O que é o YLADA Nutri?
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
                Uma forma diferente de pensar sua carreira como nutricionista.
                <br />
                <span className="text-gray-600 text-lg">
                  Sem promessas vazias. Sem pressão. Só clareza.
                </span>
              </p>

              {/* Vídeo Hero - Impacto Imediato */}
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                  <video
                    src="/videos/discovery/dashboard-agenda-cheia.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                    style={{ display: 'block' }}
                  >
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3 italic">
                  Veja como sua rotina pode ficar organizada
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE É - Explicação Clara */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Não é um curso. Não é só uma ferramenta.
              </h2>
              
              <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="font-semibold text-gray-900 mb-2">Respire fundo. Você não está quebrada.</p>
                  <p className="mb-2">
                    O problema não é você. O problema é que ninguém te ensinou a parte empresarial.
                  </p>
                  <p>
                    O YLADA Nutri ajuda você a organizar o que já sabe fazer, mas de forma que funcione de verdade.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
                    <p className="font-semibold text-gray-900 mb-2">
                      Não é falta de competência. É falta de direção.
                    </p>
                    <p className="text-gray-700">
                      Você sabe nutrição. Isso você já domina. O que falta é clareza sobre como transformar 
                      esse conhecimento em um negócio que funcione de verdade.
                    </p>
                  </div>

                  <p>
                    Se você é nutricionista e já se sentiu perdida sobre <strong>como fazer sua carreira crescer</strong>, 
                    o YLADA pode fazer sentido pra você.
                  </p>
                  
                  <p>
                    Não é sobre aprender nutrição (isso você já sabe). É sobre <strong>transformar seu conhecimento 
                    em um negócio que funciona</strong> — sem depender só de indicação ou sorte.
                  </p>
                  
                  <p className="font-semibold text-gray-900">
                    E agora você tem a chance de aprender. Não precisa mais tentar sozinha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É - Identificação */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                Você já se sentiu assim?
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg font-semibold text-blue-600 text-center mb-6">
                  Você já acordou de manhã pensando: "Será que hoje alguém vai me procurar?"
                </p>
                
                <p className="text-lg font-semibold text-blue-600 text-center mb-6">
                  Você já se sentiu uma fraude quando alguém perguntou quanto você cobra e você não soube responder?
                </p>
                
                <p className="text-lg font-semibold text-blue-600 text-center mb-8">
                  Você já chorou de frustração depois de mais um mês sem conseguir organizar seu negócio?
                </p>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
                Pode fazer sentido pra você se:
              </h3>
              
              <div className="space-y-4 mb-12">
                {[
                  'Você olha pra sua agenda e vê mais dias vazios do que preenchidos',
                  'Você trabalha muito, mas não sente que está crescendo',
                  'Você se sente sozinha nas decisões empresariais',
                  'Você já tentou organizar tudo, mas sempre volta ao mesmo lugar',
                  'Você quer clareza sobre como construir uma carreira que funcione'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                    <span className="text-blue-600 text-xl mt-0.5">•</span>
                    <p className="text-gray-700 flex-1">{item}</p>
                  </div>
                ))}
              </div>

              {/* CTA Intermediário - Melhorado */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Quer parar de se sentir perdida e começar a crescer?
                </h3>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Descubra como transformar sua carreira de nutricionista em um negócio que funciona de verdade. Sem precisar descobrir tudo sozinha.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleWhatsApp}
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Fale conosco no WhatsApp
                  </button>
                  <Link
                    href="/pt/nutri#como-funciona"
                    className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Ver mais detalhes
                  </Link>
                </div>
                <p className="text-sm text-blue-200 mt-4">
                  Sem pressão. Sem compromisso. Só clareza sobre o seu próximo passo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA - Mais Mistério, Menos Explicação */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Como funciona?
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center mb-8">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  É um sistema que te guia.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  A LYA, uma mentora por IA, está lá quando você precisa. 
                  Ela explica o que fazer, quando fazer, e por que fazer.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Você tem acesso a ferramentas prontas, formação que transforma, 
                  e um método que te ajuda a pensar como Nutri-Empresária.
                </p>
                <p className="text-base text-gray-500 italic">
                  Mas o melhor jeito de entender é explorando. 
                  Não prometemos resultados mágicos. Prometemos clareza e método.
                </p>
              </div>

              {/* Imagem de Contexto - Mostrando a Plataforma em Ação */}
              <div className="mt-8 max-w-3xl mx-auto">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/discovery/nutricionista-plataforma.png"
                    alt="Plataforma YLADA Nutri em ação"
                    width={1400}
                    height={788}
                    className="w-full h-auto"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-3 italic">
                  Interface intuitiva e organizada para sua rotina profissional
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - Dúvidas Comuns */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Dúvidas comuns
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    pergunta: 'Faz sentido pra quem está começando?',
                    resposta: 'Sim. O YLADA ajuda você a começar certo, sem precisar descobrir tudo sozinha. Se você já tem experiência, ajuda a organizar e crescer de forma consistente.'
                  },
                  {
                    pergunta: 'E se eu não entender como usar?',
                    resposta: 'A LYA está lá pra isso. Ela te guia, explica, e ajuda a focar no que é prioritário pro seu momento. Você não precisa descobrir sozinha.'
                  },
                  {
                    pergunta: 'Vai funcionar pra mim?',
                    resposta: 'Depende de você. Não prometemos resultados mágicos. Prometemos clareza e método. Se você aplicar com consistência, os resultados aparecem. Temos garantia de 7 dias se não fizer sentido.'
                  },
                  {
                    pergunta: 'Preciso usar tudo de uma vez?',
                    resposta: 'Não. O YLADA não é sobre usar tudo. É sobre usar o que você precisa, quando precisa. A LYA te ajuda a focar no que é prioritário.'
                  },
                  {
                    pergunta: 'E se não funcionar?',
                    resposta: 'Temos garantia de 7 dias. Se você acessar, explorar, e perceber que não faz sentido pro seu momento, devolvemos 100% do investimento. Sem perguntas, sem burocracia. Teste sem medo.'
                  },
                  {
                    pergunta: 'E se eu não conseguir usar tudo? Vou ter desperdiçado meu dinheiro?',
                    resposta: 'Você não precisa usar tudo. O YLADA não é sobre usar todas as ferramentas. É sobre usar as ferramentas certas, no momento certo. A LYA te ajuda a focar no que é prioritário para o seu momento atual. E com a garantia de 7 dias, você pode testar sem risco.'
                  },
                  {
                    pergunta: 'E se eu não tiver tempo para isso?',
                    resposta: 'O YLADA foi feito para economizar seu tempo, não para consumir. A ideia é você trabalhar menos e ganhar mais. A LYA te guia para focar no que realmente importa, sem perder tempo com o que não faz diferença agora. O método foi pensado para nutricionistas que já têm uma rotina corrida.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{item.pergunta}</span>
                      <span className="text-blue-600 text-2xl flex-shrink-0">
                        {faqOpen === index ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{item.resposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final - Melhorado */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Você não precisa continuar tentando sozinha.
              </h2>
              
              <p className="text-xl text-blue-100 mb-4 leading-relaxed">
                Cada dia que você adia é mais um dia longe da carreira que você quer ter.
              </p>
              
              <p className="text-lg text-blue-200 mb-4">
                Você não precisa mais acordar ansiosa. Você não precisa mais se sentir sozinha. Você não precisa mais tentar descobrir sozinha.
              </p>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Veja como funciona, entenda o método, e descubra se o YLADA é o caminho certo para você.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <button
                  onClick={handleWhatsApp}
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  💬 Fale conosco no WhatsApp
                </button>
                
                <Link
                  href="/pt/nutri#como-funciona"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  Ver mais detalhes
                </Link>
              </div>

              <p className="text-sm text-blue-200">
                Sem pressão. Sem compromisso. Só clareza sobre o seu próximo passo.
              </p>
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
            <p className="text-gray-500 text-xs text-center">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

