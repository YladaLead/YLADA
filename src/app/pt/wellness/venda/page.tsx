'use client'

import Link from 'next/link'
import Logo from '../../../../components/Logo'
import LanguageSelector from '../../../../components/LanguageSelector'

export default function WellnessVendaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Logo cor="verde" formato="horizontal" tamanho="medio" className="bg-transparent" />
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* 🟩 1️⃣ HERO – INSPIRAÇÃO E PROPÓSITO */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Slogan */}
              <p className="text-green-700 text-sm font-medium mb-6">
                Tecnologia a serviço do seu propósito.
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-green-600">Transforme o seu espaço de bem-estar</span>
                <br />
                em um gerador de conexões reais.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                O YLADA Wellness é o assistente digital que te ajuda a atrair novas pessoas, acompanhar seus clientes e duplicar o seu trabalho de forma simples, profissional e inspiradora.
              </p>
              
              <Link
                href="/pt/wellness/dashboard"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ✨ Criar meu link de bem-estar
              </Link>
            </div>
          </div>
        </section>

        {/* 🌱 2️⃣ SEÇÃO – O DESAFIO DO DISTRIBUIDOR ATUAL */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Você já inspira pessoas todos os dias. Mas e se a tecnologia pudesse fazer isso junto com você?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Você fala dos produtos, dos desafios, posta nas redes…
                <br />
                <span className="font-semibold text-gray-900">Mas muitos contatos se perdem no meio do caminho.</span>
              </p>
              <p className="text-lg text-gray-700 font-medium mt-6">
                O YLADA foi criado para que você não perca mais nenhuma oportunidade de ajudar alguém a mudar de vida.
              </p>
            </div>
          </div>
        </section>

        {/* 🧠 3️⃣ SEÇÃO – O QUE É O YLADA WELLNESS */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Um assistente digital feito para quem acredita no poder do bem-estar.
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed">
                Com o YLADA, você tem um link inteligente que reúne suas ferramentas, avaliações e formulários — tudo personalizado com o seu nome, sua cidade e seu contato.
              </p>
              
              <div className="grid sm:grid-cols-1 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💚</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Crie avaliações inteligentes</h3>
                      <p className="text-gray-600">IMC, metabolismo, perfil de bem-estar e muito mais.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💬</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Receba automaticamente os contatos interessados</h3>
                      <p className="text-gray-600">Todos os leads organizados no seu painel.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">🔁</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Duplique o mesmo sistema para sua equipe</h3>
                      <p className="text-gray-600">Cada membro com seu próprio link personalizado.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  href="/pt/wellness/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🚀 Quero meu link personalizado
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ 4️⃣ SEÇÃO – COMO FUNCIONA */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Em 3 passos simples, você transforma seu trabalho em uma experiência digital.
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">1️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha suas ferramentas</h3>
                  <p className="text-gray-600 leading-relaxed">
                    IMC, Avaliação de Bem-Estar, Quiz de Metabolismo, Desafio 21 Dias, e muito mais.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">2️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personalize com seu nome e contato</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Crie sua identidade digital em poucos cliques.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Compartilhe o link e acompanhe os resultados</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Veja quem respondeu, entre em contato e acompanhe sua jornada.
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
              Histórias de quem já está usando o YLADA Wellness
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Com meu link, gerei 32 contatos em uma semana. O melhor é que tudo fica organizado."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Cláudia R., Supervisora Wellness
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Meu time inteiro começou a usar o mesmo sistema. Ficou muito mais fácil acompanhar os novos clientes."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Carlos F., Líder de Equipe 7.5K
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "É profissional, moderno e ajuda a mostrar o valor do nosso trabalho."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Juliana M., Distribuidora Wellness
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🧩 6️⃣ SEÇÃO – BENEFÍCIOS VISUAIS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inteligência de Captação</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gere leads automáticos a partir dos seus desafios e avaliações.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comunicação Integrada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompanhe tudo pelo WhatsApp e receba os dados direto no seu painel.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🔁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema Duplicável</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cada novo distribuidor pode usar o mesmo formato com seu nome.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🌎</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Disponível em 3 idiomas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ideal para brasileiros no exterior e equipes internacionais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 💚 7️⃣ SEÇÃO – PLANOS DE ACESSO */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Escolha seu formato de acesso
            </h2>
            
            <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all">
                <div className="text-4xl mb-4 text-center">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Individual</h3>
                <p className="text-gray-600 text-center mb-6">Distribuidores e Espaços de Vida Saudável</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-green-600">R$ 37</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Link personalizado
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Todas as ferramentas
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Dashboard completo
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/dashboard"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Começar agora
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-500 hover:border-green-600 transition-all transform scale-105">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full text-center mb-4 inline-block">
                  MAIS POPULAR
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Líder de Equipe</h3>
                <p className="text-gray-600 text-center mb-6">Supervisores e Líderes com times ativos</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-green-600">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Tudo do Individual
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Gerenciamento de equipe
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Relatórios consolidados
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Suporte prioritário
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/dashboard"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Começar agora
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all">
                <div className="text-4xl mb-4 text-center">💎</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Parceria Regional</h3>
                <p className="text-gray-600 text-center mb-6">Líderes de comunidade com mais de 10 membros</p>
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold text-green-600">Sob consulta</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Tudo do Líder
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    White-label
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    API personalizada
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/dashboard"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Falar com equipe
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/pt/wellness/dashboard"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                💚 Quero meu link agora
              </Link>
            </div>
          </div>
        </section>

        {/* 🌍 8️⃣ SEÇÃO – COMUNIDADE E DUPLICAÇÃO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Duplicar ficou mais fácil quando tudo está conectado.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Cada membro da sua equipe pode ter seu próprio link.
                Você acompanha tudo, organiza seus contatos e constrói uma rede de forma mais humana e profissional.
              </p>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="text-6xl mb-4">🌐</div>
                <p className="text-gray-600 italic">
                  "A tecnologia que une propósito e resultados."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 9️⃣ SEÇÃO – CONVITE FINAL */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                O bem-estar começa com uma boa conexão.
              </h2>
              <p className="text-xl text-green-50 mb-8 leading-relaxed">
                Leve sua missão ainda mais longe.
                <br />
                Com o YLADA Wellness, o seu espaço, seu desafio e sua equipe ficam no mesmo lugar — com tecnologia e propósito.
              </p>
              <Link
                href="/pt/wellness/dashboard"
                className="inline-flex items-center px-10 py-5 bg-white text-green-600 text-xl font-bold rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🌿 Criar meu link de bem-estar agora
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
              <Logo cor="verde" formato="horizontal" tamanho="medio" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-center">
              YLADA Wellness — Your Lead Advanced Data Assistant
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

