'use client'

import Link from 'next/link'
import Image from 'next/image'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'

export default function CoachLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <Image
              src="/images/logo/coach-horizontal.png"
              alt="Coach by YLADA"
              width={180}
              height={60}
              className="h-10 sm:h-14 lg:h-16 w-auto object-contain bg-transparent"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pt/coach/login"
              className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Entrar
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main>
        {/* 🟢 1️⃣ HERO – ABERTURA DE AUTORIDADE + PROMESSA CLARA */}
        <section className="bg-gradient-to-br from-purple-50 to-purple-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                🧠 Atraia os pacientes certos todos os dias — 
                <br />
                <span className="text-purple-600">sem precisar depender de indicações ou redes sociais.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                O YLADA Nutricionista é o sistema inteligente que transforma suas avaliações e formulários em novos atendimentos.
                <br />
                <br />
                Capte leads qualificados, organize seus contatos e conquiste novos pacientes de forma simples, automatizada e profissional.
              </p>
              
              <Link
                href="/pt/coach/login"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🚀 Criar minha conta e começar agora
              </Link>
            </div>
          </div>
        </section>

        {/* 🧩 2️⃣ SEÇÃO – O PROBLEMA ATUAL */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Você sabe que tem um excelente atendimento.
                <br />
                Mas o problema não é atender — é conseguir chegar até as pessoas certas.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Você posta, responde mensagens, tenta impulsionar no Instagram…
                <br />
                mas ainda assim sente que:
              </p>
              <div className="text-left max-w-2xl mx-auto space-y-3 mb-6">
                <p className="text-lg text-gray-700">
                  • as pessoas pedem <span className="font-semibold">"só o valor"</span>,
                </p>
                <p className="text-lg text-gray-700">
                  • poucas realmente fecham consulta,
                </p>
                <p className="text-lg text-gray-700">
                  • e você perde tempo com curiosos em vez de leads qualificados.
                </p>
              </div>
              <p className="text-lg text-gray-700 font-medium mt-6">
                O YLADA foi criado para resolver exatamente isso.
              </p>
            </div>
          </div>
        </section>

        {/* 💡 3️⃣ SEÇÃO – A SOLUÇÃO */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Transforme suas avaliações em uma máquina de captação de pacientes.
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed">
                O YLADA te oferece um link inteligente com ferramentas automáticas de avaliação nutricional, perfil de saúde, metabolismo, hábitos alimentares e mais — tudo conectado ao seu painel de organização de leads.
              </p>
              
              <div className="grid sm:grid-cols-1 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💚</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Você atrai o público certo</h3>
                      <p className="text-gray-600">Ferramentas que qualificam leads antes mesmo da primeira consulta.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">📊</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Recebe os contatos diretamente no seu painel</h3>
                      <p className="text-gray-600">Todos os leads organizados e prontos para acompanhamento.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">🔁</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">E pode acompanhar o interesse de cada pessoa</h3>
                      <p className="text-gray-600">Veja quem respondeu, quem demonstrou interesse e priorize seus contatos.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  href="/pt/coach/login"
                  className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ✨ Criar meu link inteligente agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ 4️⃣ SEÇÃO – COMO FUNCIONA */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Em 3 passos simples, você profissionaliza sua captação.
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">1️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha as ferramentas que deseja oferecer</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Avaliação Nutricional, IMC, Hábitos Alimentares, Perfil de Bem-Estar e mais.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">2️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personalize seu link com seu nome e logotipo</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Crie sua própria página de captação profissional.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Compartilhe e receba contatos qualificados automaticamente</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Os leads ficam organizados no painel do YLADA, prontos para acompanhamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📈 5️⃣ SEÇÃO – BENEFÍCIOS REAIS */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captação Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Suas avaliações se tornam imãs de leads qualificados, sem anúncios caros.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Organização Automática</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cada lead captado fica salvo no seu painel, com nome, e-mail e respostas.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gestão de Relacionamento</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompanhe quem respondeu, quem clicou e quem demonstrou interesse.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🔁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Acesso Personalizado</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Seu link com sua identidade, logotipo e nome profissional.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Online e Rápido</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Comece a usar em minutos, sem precisar de site ou programação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 6️⃣ SEÇÃO – DEPOIMENTOS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Nutricionistas que usam o YLADA estão se destacando.
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Com o YLADA, parei de depender do Instagram. Em uma semana, tive 17 leads novos de qualidade."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Marina C., Nutricionista Clínica
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "O melhor é que a pessoa chega já interessada na consulta, porque responde tudo antes."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Paula F., Nutricionista Esportiva
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Parece que o sistema trabalha por mim. Ele faz as perguntas certas e me entrega contatos prontos."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Carla M., Nutri Comportamental
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🧮 7️⃣ SEÇÃO – DIFERENCIAL (COMPARATIVO) */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Por que o YLADA é diferente de qualquer outro sistema?
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Outros sistemas</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Criação de formulários manual</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Captação de leads limitada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Sem painel de acompanhamento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Design genérico</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Suporte inconstante</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-purple-50">
                    <h3 className="text-lg font-bold text-purple-600 mb-4 text-center">YLADA Nutricionista</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span>Automatizada e com modelos prontos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span>Focada em nutrição e bem-estar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span>Painel inteligente de acompanhamento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span>Personalizado com sua marca</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span>Suporte ativo e novas ferramentas mensais</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💰 8️⃣ SEÇÃO – PLANO E INVESTIMENTO */}
        <section className="py-16 sm:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Escolha o melhor plano para você
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                {/* PLANO ANUAL - DESTAQUE */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 text-white shadow-2xl border-4 border-purple-500 transform scale-105">
                  <div className="text-4xl mb-4">🔥</div>
                  <h3 className="text-3xl font-bold mb-4">Plano Anual Completo</h3>
                  <p className="text-xl mb-2 font-semibold">O caminho do profissional completo</p>
                  <p className="text-lg mb-6 text-white/90">
                    A forma mais inteligente de crescer rápido, com tudo incluso.
                  </p>
                  
                  <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <p className="text-5xl font-black mb-2">12x de R$ 97</p>
                    <p className="text-xs text-white/70 mt-1">Total: R$ 1.164</p>
                  </div>

                  <ul className="space-y-3 mb-8 text-lg">
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Tudo do plano mensal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Formação profissional completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Cursos e materiais exclusivos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Planilhas e exercícios práticos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-xl">✔</span>
                      <span>Tudo que a formação proporciona</span>
                    </li>
                  </ul>

                  <div className="bg-white/20 rounded-lg p-4 mb-6">
                    <p className="text-sm mb-2">👉 O único plano com formação completa.</p>
                    <p className="text-sm mb-2">👉 Economize 10 meses de mensalidade.</p>
                    <p className="text-sm">👉 Acesso total por 1 ano.</p>
                  </div>

                  <button
                    onClick={async () => {
                      const response = await fetch('/api/coach/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          planType: 'annual',
                          paymentMethod: 'auto'
                        })
                      })
                      const data = await response.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="block w-full bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors shadow-xl text-center"
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
                      <span className="mr-3 text-purple-600">✓</span>
                      <span>Ferramentas de captação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-purple-600">✓</span>
                      <span>Gestão completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-purple-600">✓</span>
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
                      const response = await fetch('/api/coach/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          planType: 'monthly',
                          paymentMethod: 'auto'
                        })
                      })
                      const data = await response.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="block w-full bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                  >
                    Quero começar no mensal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💎 9️⃣ SEÇÃO – UPSALE FUTURO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                E em breve, um novo passo: o YLADA Consultório.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Em 2025, você poderá gerenciar seus atendimentos, agenda, histórico e protocolos direto dentro do sistema.
                <br />
                <br />
                <span className="font-semibold">Mas quem entra agora garante acesso antecipado e condições exclusivas para o lançamento do módulo de gestão.</span>
              </p>
              <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
                <div className="text-6xl mb-4">💎</div>
                <p className="text-gray-700 italic">
                  "O futuro do seu consultório começa hoje."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 10️⃣ SEÇÃO FINAL – CHAMADA EMOCIONAL */}
        <section className="bg-gradient-to-br from-purple-600 to-purple-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                O sucesso do seu consultório começa quando você foca no que faz melhor: cuidar de pessoas.
              </h2>
              <p className="text-xl text-purple-50 mb-8 leading-relaxed">
                Deixe o YLADA cuidar da captação e da organização — e concentre sua energia no que realmente importa.
                <br />
                <br />
                Construa uma rotina mais leve, organizada e previsível.
              </p>
              <Link
                href="/pt/coach/login"
                className="inline-flex items-center px-10 py-5 bg-white text-purple-600 text-xl font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                💚 Criar meu link e começar agora
              </Link>
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
                src="/images/logo/coach-horizontal.png"
                alt="Coach by YLADA"
                width={180}
                height={60}
                className="h-10 w-auto object-contain bg-transparent"
                style={{ backgroundColor: 'transparent' }}
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
    </div>
  )
}
