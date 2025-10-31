'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'

export default function CoachLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <YLADALogo size="md" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* 🟢 1️⃣ HERO – PROMESSA PRINCIPAL */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                🌟 Transforme seu propósito de inspirar pessoas em uma jornada digital de resultados.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                O YLADA Coach é o sistema que conecta a sua mensagem a novas pessoas todos os dias — com quizzes, links interativos e captação automática de contatos.
                <br />
                <br />
                Organize sua base, acompanhe o interesse de cada pessoa e leve o seu impacto ainda mais longe.
              </p>
              
              <Link
                href="/pt/coach/login"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🚀 Criar meu link de transformação agora
              </Link>
            </div>
          </div>
        </section>

        {/* 🌱 2️⃣ SEÇÃO – O DESAFIO DO COACH MODERNO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Você ajuda pessoas a mudarem.
                <br />
                Mas e quem ajuda você a alcançar mais pessoas?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Você compartilha reflexões, fala de propósito, cria conteúdo…
                <br />
                Mas percebe que:
              </p>
              <div className="text-left max-w-2xl mx-auto space-y-3 mb-6">
                <p className="text-lg text-gray-700">
                  • nem sempre as pessoas certas chegam até você,
                </p>
                <p className="text-lg text-gray-700">
                  • os contatos se perdem entre mensagens e comentários,
                </p>
                <p className="text-lg text-gray-700">
                  • e o crescimento parece lento, mesmo com tanto valor entregue.
                </p>
              </div>
              <p className="text-lg text-gray-700 font-medium mt-6">
                O YLADA Coach foi criado exatamente para isso — conectar o seu trabalho à tecnologia certa.
              </p>
            </div>
          </div>
        </section>

        {/* 💡 3️⃣ SEÇÃO – O QUE É O YLADA COACH */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                O assistente digital que amplia o alcance do seu propósito.
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed">
                O YLADA é um sistema simples e poderoso que cria para você um link inteligente com quizzes e avaliações de bem-estar prontos para gerar novos contatos e despertar interesse real.
              </p>
              
              <div className="grid sm:grid-cols-1 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💬</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Capte leads automaticamente</h3>
                      <p className="text-gray-600">Sem precisar ficar caçando contatos — eles chegam até você qualificados.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💚</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Mostre seu propósito com profissionalismo</h3>
                      <p className="text-gray-600">Links personalizados que refletem sua essência e atraem pessoas certas.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">🔁</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Acompanhe quem se interessa e mantenha o vínculo ativo</h3>
                      <p className="text-gray-600">Painel que organiza todos os seus contatos e facilita o acompanhamento.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  href="/pt/coach/login"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ✨ Criar meu link agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ 4️⃣ SEÇÃO – COMO FUNCIONA */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Em 3 passos simples, o seu propósito ganha escala.
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">1️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha seu modelo de link</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Avaliação de Bem-Estar, Propósito e Equilíbrio, Desafio 21 Dias, Check-in Diário, entre outros.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">2️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personalize com seu nome e mensagem</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Deixe o link com sua identidade e propósito.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Compartilhe e gere conexões reais</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Envie pelo WhatsApp, Instagram, grupos ou eventos — e veja quem mais quer se transformar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🧘 5️⃣ SEÇÃO – BENEFÍCIOS REAIS */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captação Humanizada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transforme seus conteúdos e desafios em novos contatos qualificados.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Organização Simplificada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receba e visualize seus leads em um painel fácil e intuitivo.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🔁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Duplicável e Escalável</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use o mesmo sistema com sua equipe de coaches ou grupo de apoio.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🌎</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conectado em 3 idiomas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Perfeito para quem atende no Brasil, EUA, Portugal e América Latina.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tecnologia que inspira ação</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tudo pronto para começar — sem precisar de site ou conhecimento técnico.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 6️⃣ SEÇÃO – DEPOIMENTOS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Coaches de bem-estar que já usam o YLADA estão alcançando mais pessoas.
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Com o YLADA, consegui organizar todos os meus interessados em um só lugar e conduzir com muito mais leveza."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Mariana S., Coach de Saúde Integrativa
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Eu tinha propósito, mas faltava estrutura. O YLADA me deu clareza e resultado."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Rafaela G., Coach de Equilíbrio Emocional
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Em uma semana, mais de 40 pessoas responderam meu link. Nunca tinha tido esse alcance antes."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Tiago L., Coach de Bem-Estar e Performance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 📊 7️⃣ SEÇÃO – DIFERENCIAL YLADA COACH */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Mais que tecnologia. Uma plataforma feita para quem tem propósito.
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Outros métodos</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Captação manual, por mensagens e formulários</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Planilhas dispersas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Limitada ao Instagram</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Individual</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>Linguagem genérica</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-blue-50">
                    <h3 className="text-lg font-bold text-blue-600 mb-4 text-center">YLADA Coach</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span>Automática e personalizada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Painel único e visual</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Multiplicável em todos os canais</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Duplicável para grupos e equipes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Focada em propósito e bem-estar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💰 8️⃣ SEÇÃO – PLANO E INVESTIMENTO */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Invista na expansão do seu propósito.
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
              {/* Plano Mensal */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Mensal</h3>
                <p className="text-gray-600 text-center mb-6">Coaches de bem-estar, saúde, propósito e desenvolvimento pessoal</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-600">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Link personalizado com seu nome e propósito
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Ferramentas de captação e quizzes interativos
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Painel de leads e acompanhamento
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Suporte e atualizações mensais
                  </li>
                </ul>
                <Link
                  href="/pt/coach/login"
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💙 Assinar mensal
                </Link>
              </div>
              
              {/* Plano Anual */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-500 hover:border-blue-600 transition-all transform scale-105 relative">
                <div className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full text-center mb-4 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
                  2 MESES GRÁTIS
                </div>
                <div className="text-4xl mb-4 text-center mt-4">💎</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Anual</h3>
                <p className="text-gray-600 text-center mb-6">Coaches de bem-estar, saúde, propósito e desenvolvimento pessoal</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-600">R$ 67</span>
                  <span className="text-gray-600">/mês</span>
                  <div className="text-sm text-gray-500 mt-2">
                    12 meses
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Total de <span className="font-semibold text-gray-700">R$ 804/ano</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="line-through text-gray-400">R$ 1.164</span> você economiza R$ 360
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Tudo do plano mensal
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Pagamento único anual
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">✓</span>
                    Melhor custo-benefício
                  </li>
                </ul>
                <Link
                  href="/pt/coach/login"
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💙 Assinar anual
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/pt/coach/login"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 Criar meu link e começar agora
              </Link>
            </div>
          </div>
        </section>

        {/* 💎 9️⃣ SEÇÃO – FUTURO / UPSALE */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Em breve: o YLADA Journey — o módulo de acompanhamento e mentorias.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                A próxima etapa do YLADA vai permitir que você acompanhe seus coachees, registre sessões e envie planos semanais — tudo dentro do mesmo sistema.
                <br />
                <br />
                <span className="font-semibold">Quem se cadastrar agora garante acesso antecipado e condições especiais no lançamento.</span>
              </p>
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                <div className="text-6xl mb-4">💎</div>
                <p className="text-gray-700 italic">
                  "O futuro do seu impacto começa hoje."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 10️⃣ SEÇÃO FINAL – FECHAMENTO EMOCIONAL */}
        <section className="bg-gradient-to-br from-blue-600 to-cyan-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                O seu propósito transforma vidas. O YLADA te ajuda a alcançar mais delas.
              </h2>
              <p className="text-xl text-blue-50 mb-8 leading-relaxed">
                Com o YLADA Coach, você multiplica o seu impacto sem perder a essência.
                <br />
                <br />
                Deixe a tecnologia cuidar da captação, e foque no que você faz de melhor: guiar pessoas para uma vida mais equilibrada e feliz.
              </p>
              <Link
                href="/pt/coach/login"
                className="inline-flex items-center px-10 py-5 bg-white text-blue-600 text-xl font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                💙 Criar meu link de transformação agora
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
              <YLADALogo size="md" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Coach — Your Lead Advanced Data Assistant
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
