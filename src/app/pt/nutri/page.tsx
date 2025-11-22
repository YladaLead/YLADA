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
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                A Plataforma Definitiva para Nutricionistas que Querem Ter Mais Clientes, Gestão Profissional e Sucesso Empresarial.
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-blue-100 leading-relaxed">
                Em um único lugar: Ferramentas de Captação, Gestão Profissional, Comunidade, Mentoria Semanal e a Formação Empresarial Nutri (R$970).
              </p>
              <p className="text-lg mb-8 text-blue-50">
                Tudo que você precisa para crescer com consistência e segurança.
              </p>
              <Link
                href="/pt/nutri/checkout"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition-colors shadow-xl"
              >
                Quero Entrar para o YLADA Nutri Agora
              </Link>
            </div>

            {/* COMPONENTE DO VÍDEO – HERO */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="aspect-video bg-gray-900">
                  {/* OPÇÃO 1: Vídeo Local - Descomente e ajuste o caminho */}
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

                  {/* OPÇÃO 2: YouTube Embed - Descomente e substitua VIDEO_ID pelo ID do vídeo do YouTube */}
                  {/* 
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID&controls=1&modestbranding=1&rel=0"
                    title="Vídeo Principal YLADA Nutri"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  */}

                  {/* OPÇÃO 3: Vimeo Embed - Descomente e substitua VIDEO_ID pelo ID do vídeo do Vimeo */}
                  {/* 
                  <iframe
                    className="w-full h-full"
                    src="https://player.vimeo.com/video/VIDEO_ID?autoplay=1&muted=1&loop=1&controls=1&title=0&byline=0&portrait=0"
                    title="Vídeo Principal YLADA Nutri"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2 – PROBLEMAS / DOR / IDENTIFICAÇÃO */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                Alguma dessas situações já aconteceu com você?
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Você posta no Instagram, mas os clientes não chegam.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Você trabalha muito e ganha pouco.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Você se perde na gestão das suas clientes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Tem dificuldade de transformar seguidores em atendimentos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Sente que está patinando e não consegue crescer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 text-2xl">✗</span>
                    <span>Se sente sozinha nesse processo.</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 mb-4">
                  Você não está sozinha.
                </p>
                <p className="text-xl text-gray-700 mb-4">
                  E não é culpa sua.
                </p>
                <p className="text-lg text-gray-600">
                  O mercado mudou – e agora as Nutris que crescem são as que têm estrutura, gestão, captação e estratégia empresarial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3 – A SOLUÇÃO */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                O YLADA Nutri é a Plataforma Completa para Nutricionistas.
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Ferramentas inteligentes de captação</h3>
                  <p className="text-gray-700">quizzes, portais, links, WhatsApp</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Gestão profissional</h3>
                  <p className="text-gray-700">CRM, agenda, evolução, anotações, organização completa</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Formação Empresarial Nutri (R$970)</h3>
                  <p className="text-gray-700">somente para plano anual</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Comunidade</h3>
                  <p className="text-gray-700">Conecte-se com outras nutricionistas</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">💬</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Suporte</h3>
                  <p className="text-gray-700">Atendimento dedicado</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-4">📺</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Lives semanais</h3>
                  <p className="text-gray-700">Mentoria e conteúdo exclusivo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 4 – DEPOIMENTOS */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                Resultados de Nutris que já usaram o sistema
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Depoimento 1 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "Depoimento real será inserido aqui. Exemplo: O YLADA transformou completamente minha forma de trabalhar..."
                  </p>
                  <div className="mt-4 flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>

                {/* Depoimento 2 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "Depoimento real será inserido aqui. Exemplo: Consegui triplicar meus clientes em 3 meses..."
                  </p>
                  <div className="mt-4 flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>

                {/* Depoimento 3 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Nome da Nutri</h4>
                      <p className="text-sm text-gray-600">@instagram</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "Depoimento real será inserido aqui. Exemplo: A gestão profissional mudou tudo na minha clínica..."
                  </p>
                  <div className="mt-4 flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5 – PLANOS E PREÇOS */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                Escolha o melhor plano para você
              </h2>

              {/* PLANOS MENSAIS */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">PLANOS MENSAIS – SEM CURSO</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Nome</th>
                        <th className="px-6 py-4 text-left">O que inclui</th>
                        <th className="px-6 py-4 text-right">Preço</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold">Ferramentas de Captação</td>
                        <td className="px-6 py-4 text-gray-700">quizzes, portais, links</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">R$ 59,90/mês</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold">Gestão Profissional</td>
                        <td className="px-6 py-4 text-gray-700">CRM, agenda, evolução</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">R$ 59,90/mês</td>
                      </tr>
                      <tr className="hover:bg-gray-50 bg-blue-50">
                        <td className="px-6 py-4 font-semibold">Ferramentas + Gestão</td>
                        <td className="px-6 py-4 text-gray-700">tudo acima</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">R$ 97/mês</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CURSO */}
              <div className="mb-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-300">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Formação Empresarial Nutri (R$ 970)</h3>
                <p className="text-lg text-gray-700 mb-6">
                  A formação completa para transformar Nutricionistas em Nutris Empresárias.
                </p>
                <p className="text-base text-gray-600 mb-6">
                  Visão empresarial real: marketing, captação, atendimento, vendas, fidelização, organização e crescimento.
                </p>
                <div className="bg-white rounded-lg p-6 inline-block">
                  <p className="text-2xl font-bold text-blue-600 mb-2">R$ 970 à vista</p>
                  <p className="text-gray-600">ou 12x via Mercado Pago</p>
                </div>
              </div>

              {/* PROMOÇÃO DE LANÇAMENTO */}
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl p-8 text-white shadow-2xl">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-3xl font-bold mb-4">Promoção Exclusiva de Lançamento</h3>
                <p className="text-xl mb-6 font-semibold">
                  Paga R$ 970 (à vista ou 12x)
                </p>
                <p className="text-lg mb-6">
                  E leva tudo por 1 ano:
                </p>
                <ul className="space-y-3 mb-8 text-lg">
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Ferramentas</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Gestão</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Formação Empresarial Nutri (R$ 970)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Suporte</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Lives semanais</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✔</span>
                    <span>Comunidade</span>
                  </li>
                </ul>
                <Link
                  href="/pt/nutri/checkout"
                  className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Quero aproveitar o lançamento agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6 – BENEFÍCIOS */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                Benefícios
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🎯', title: 'Captação automática', desc: 'Leads qualificados 24/7' },
                  { icon: '💼', title: 'Atendimento mais profissional', desc: 'Organização total' },
                  { icon: '📋', title: 'Organização total da cliente', desc: 'Tudo em um lugar' },
                  { icon: '💡', title: 'Clareza do negócio', desc: 'Visão empresarial' },
                  { icon: '⚡', title: 'Acelerador de resultados', desc: 'Crescimento rápido' },
                  { icon: '👑', title: 'Nutri Empresária na prática', desc: 'Transformação real' },
                  { icon: '🤝', title: 'Comunidade forte', desc: 'Networking e apoio' },
                  { icon: '💬', title: 'Suporte próximo', desc: 'Ajuda quando precisar' },
                ].map((beneficio, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-4">{beneficio.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{beneficio.title}</h3>
                    <p className="text-gray-600 text-sm">{beneficio.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 7 – COMPARAÇÃO ANTES X DEPOIS */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
                Antes vs Depois
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* ANTES */}
                <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
                  <h3 className="text-2xl font-bold mb-6 text-red-800">Antes do YLADA:</h3>
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
                        <span className="text-red-500 mr-3 text-xl">✖</span>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DEPOIS */}
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <h3 className="text-2xl font-bold mb-6 text-green-800">Com o YLADA:</h3>
                  <ul className="space-y-4">
                    {[
                      'Gestão total',
                      'Captação funcionando',
                      'Atendimento profissional',
                      'Confiança',
                      'Clareza',
                      'Crescimento constante'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-3 text-xl">✔</span>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 8 – GARANTIA */}
        <section className="py-16 sm:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-6">🛡️</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Garantia Incondicional de 7 Dias
              </h2>
              <p className="text-xl mb-4">
                Se não gostar, devolvemos 100% do valor.
              </p>
              <p className="text-lg text-blue-100">
                Sem burocracia. Sem risco. Sem letras miúdas.
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 9 – CTA FINAL */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Agora é sua vez de crescer como Nutri Empresária.
              </h2>
              <p className="text-xl mb-4 text-blue-100">
                Nenhuma Nutri cresce sozinha.
              </p>
              <p className="text-lg mb-8 text-blue-50">
                Mas quem entra no YLADA tem captação, gestão, curso, suporte e estratégia.
              </p>
              <p className="text-lg mb-8 text-blue-50">
                Você está a um clique de mudar completamente o seu negócio.
              </p>
              <Link
                href="/pt/nutri/checkout"
                className="inline-block bg-white text-blue-600 px-10 py-5 rounded-lg text-2xl font-bold hover:bg-blue-50 transition-colors shadow-2xl"
              >
                Quero entrar para o YLADA Nutri agora
              </Link>
            </div>
          </div>
        </section>

        {/* SEÇÃO 10 – FAQ */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
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
                    pergunta: 'O que está incluído no plano de lançamento?',
                    resposta: 'No plano de lançamento (R$ 970/ano) você leva: todas as ferramentas de captação, gestão profissional completa, Formação Empresarial Nutri (R$ 970), suporte, lives semanais e acesso à comunidade.'
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
                    resposta: 'Sim, você pode começar com qualquer plano mensal e depois migrar para o plano anual quando quiser. No entanto, a Formação Empresarial Nutri está disponível apenas no plano anual de lançamento.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{item.pergunta}</span>
                      <span className="text-blue-600 text-2xl">
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
