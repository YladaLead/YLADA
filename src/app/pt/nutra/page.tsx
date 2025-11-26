'use client'

import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'

export default function NutraLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <div className="bg-transparent inline-block">
              <Image
                src="/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png"
                alt="YLADA Nutra Logo"
                width={280}
                height={84}
                className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* 🟠 1️⃣ HERO – ABERTURA DE IMPACTO */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                💡 Transforme seus produtos em conexões e vendas todos os dias.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                O YLADA Nutra é o sistema inteligente que ajuda consultores e vendedores de suplementos a gerar leads reais, apresentar produtos de forma profissional e aumentar as vendas — tudo em um único link personalizado.
              </p>
              
              <Link
                href="/pt/nutra/login"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🚀 Criar meu link de vendas agora
              </Link>
            </div>
          </div>
        </section>

        {/* 🧩 2️⃣ SEÇÃO – O PROBLEMA ATUAL */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Você já fala de saúde todos os dias.
                <br />
                Mas ainda sente que seus contatos não se transformam em vendas?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Você compartilha vídeos, fala dos benefícios, envia catálogos, responde mensagens...
                <br />
                Mas no fim:
              </p>
              <div className="text-left max-w-2xl mx-auto space-y-3 mb-6">
                <p className="text-lg text-gray-700">
                  • poucos realmente demonstram interesse,
                </p>
                <p className="text-lg text-gray-700">
                  • muitos dizem <span className="font-semibold">"vou ver depois"</span>,
                </p>
                <p className="text-lg text-gray-700">
                  • e você não consegue acompanhar quem realmente quer comprar.
                </p>
              </div>
              <p className="text-lg text-gray-700 font-medium mt-6">
                O YLADA Nutra foi criado para mudar esse jogo — e transformar suas indicações em resultados reais.
              </p>
            </div>
          </div>
        </section>

        {/* 💡 3️⃣ SEÇÃO – A SOLUÇÃO */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Seu novo sistema de atração e conversão de clientes — 100% digital e duplicável.
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed">
                O YLADA Nutra te entrega um link inteligente com testes interativos e páginas de apresentação que despertam curiosidade nas pessoas certas.
              </p>
              
              <div className="grid sm:grid-cols-1 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💚</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Gere leads qualificados</h3>
                      <p className="text-gray-600">Testes e quizzes que atraem pessoas realmente interessadas.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">📊</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Apresente produtos com base em objetivos</h3>
                      <p className="text-gray-600">Emagrecimento, energia, imunidade, performance — personalize a recomendação.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">🔁</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Acompanhe seus contatos e replique o mesmo sistema com seu time</h3>
                      <p className="text-gray-600">Organize leads e duplique o método com toda sua equipe.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  href="/pt/nutra/login"
                  className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ✨ Criar meu link de vendas inteligente
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ 4️⃣ SEÇÃO – COMO FUNCIONA */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Em 3 passos simples, você transforma suas conversas em vendas.
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">1️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha seus links e ferramentas</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Quiz de Suplementação, Teste de Energia, Avaliação de Bem-Estar e mais.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">2️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personalize com seu nome e foto</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Crie seu link profissional com a sua identidade.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Compartilhe e gere novos contatos</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Envie pelo WhatsApp, stories e grupos — e receba interessados todos os dias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 5️⃣ SEÇÃO – DEPOIMENTOS */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Vendedores e consultores que usam o YLADA Nutra estão vendendo mais — com menos esforço.
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Antes eu mandava fotos e catálogos, agora mando o link e a pessoa já se interessa sozinha."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Fernanda L., Consultora de Suplementos
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "O YLADA me deu uma imagem mais profissional. As pessoas me levam a sério."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Paulo H., Distribuidor Nutracêutico
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Meu time duplicou o método. Todo mundo agora tem seu link e gera seus próprios contatos."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Lívia G., Líder de Equipe Omnilife
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🧠 6️⃣ SEÇÃO – DIFERENCIAIS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Atração Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Testes e links que despertam interesse e curiosidade real.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Apresentação Profissional</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Mostre seus produtos de forma visual e convincente.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">📲</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Distribuição Simplificada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Compartilhe seu link pelo WhatsApp, Instagram, QR Code ou bio.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🔁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema Duplicável</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cada membro da equipe pode ter o próprio link.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Três Idiomas Disponíveis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Português, Espanhol e Inglês — pronto para expandir sua rede.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 📈 7️⃣ SEÇÃO – RESULTADOS CONCRETOS */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                O YLADA Nutra é feito para quem quer vender com propósito e escala.
              </h2>
              
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                Quem usa o sistema relata em média:
              </p>
              
              <div className="grid sm:grid-cols-3 gap-8 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-5xl mb-4">📈</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">2x mais</h3>
                  <p className="text-gray-600">conversas com potenciais clientes</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">70% mais</h3>
                  <p className="text-gray-600">respostas positivas</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-5xl mb-4">🔁</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">Duplicação fácil</h3>
                  <p className="text-gray-600">entre os membros da equipe</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 font-medium mb-6">
                E o melhor: sem precisar impulsionar anúncios ou criar sites.
              </p>
              
              <Link
                href="/pt/nutra/login"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                💚 Quero meu link agora
              </Link>
            </div>
          </div>
        </section>

        {/* 💰 8️⃣ SEÇÃO – PLANO E INVESTIMENTO */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Invista em profissionalismo e resultado.
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
              {/* Plano Mensal */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-orange-500 transition-all">
                <div className="text-4xl mb-4 text-center">💊</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Mensal</h3>
                <p className="text-gray-600 text-center mb-6">Consultores e vendedores de suplementos e nutracêuticos</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-orange-600">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Link personalizado com nome e foto
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Ferramentas de atração (quizzes e testes)
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Organização e visualização de contatos
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Duplicação simples para equipes
                  </li>
                </ul>
                <Link
                  href="/pt/nutra/login"
                  className="block w-full text-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  💚 Assinar mensal
                </Link>
              </div>
              
              {/* Plano Anual */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-orange-500 hover:border-orange-600 transition-all transform scale-105 relative">
                <div className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full text-center mb-4 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
                  MELHOR OFERTA
                </div>
                <div className="text-4xl mb-4 text-center mt-4">💎</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Anual</h3>
                <p className="text-gray-600 text-center mb-6">Consultores e vendedores de suplementos e nutracêuticos</p>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-orange-600 mb-2">12x de R$ 97</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Total: R$ 1.164
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Tudo do plano mensal
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Formação profissional completa
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Cursos e materiais exclusivos
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Planilhas e exercícios práticos
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 mr-2">✓</span>
                    Tudo que a formação proporciona
                  </li>
                </ul>
                <Link
                  href="/pt/nutra/login"
                  className="block w-full text-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  💚 Assinar anual
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/pt/nutra/login"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 Criar meu link de vendas agora
              </Link>
            </div>
          </div>
        </section>

        {/* 💎 9️⃣ SEÇÃO – DIFERENCIAL FUTURO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                E em breve: o YLADA Business.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                A próxima etapa vai permitir que você gerencie equipe, acompanhe resultados e crie campanhas automáticas diretamente no painel YLADA.
                <br />
                <br />
                <span className="font-semibold">Quem entrar agora garante acesso antecipado e benefícios exclusivos no lançamento.</span>
              </p>
              <div className="bg-orange-50 rounded-xl p-8 border border-orange-200">
                <div className="text-6xl mb-4">💎</div>
                <p className="text-gray-700 italic">
                  "O futuro das suas vendas começa hoje."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 10️⃣ SEÇÃO FINAL – CONVITE EMOCIONAL */}
        <section className="bg-gradient-to-br from-orange-600 to-amber-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Comece a vender mais com inteligência e propósito.
              </h2>
              <p className="text-xl text-orange-50 mb-8 leading-relaxed">
                O YLADA Nutra não substitui o seu trabalho — ele potencializa.
                <br />
                <br />
                Mostre o valor dos seus produtos de forma moderna, automatize o primeiro contato e concentre-se no que mais importa: ajudar pessoas a viverem melhor.
              </p>
              <Link
                href="/pt/nutra/login"
                className="inline-flex items-center px-10 py-5 bg-white text-orange-600 text-xl font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                💚 Criar meu link de vendas agora
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-transparent inline-block">
              <Image
                src="/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png"
                alt="YLADA Nutra Logo"
                width={280}
                height={84}
                className="bg-transparent object-contain"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Nutra — Your Leading Advanced Data Assistant
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
