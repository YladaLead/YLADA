'use client'

import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'

export default function WellnessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="bg-transparent inline-block">
            <Image
              src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              alt="YLADA Logo"
              width={280}
              height={84}
              className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
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
                <span className="text-green-600">Transforme o seu trabalho de bem-estar</span>
                <br />
                em uma ponte de conexões reais.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                O YLADA Wellness é o assistente digital que te ajuda a gerar novos contatos, despertar interesse em pessoas certas e fortalecer suas conexões — de forma leve, simples e inspiradora.
              </p>
              
              <Link
                href="/pt/wellness/checkout"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ✨ Começar agora - Escolher plano
              </Link>
            </div>
          </div>
        </section>

        {/* 🌱 2️⃣ SEÇÃO – O DESAFIO DO DISTRIBUIDOR MODERNO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Você já inspira pessoas todos os dias. Mas e se a tecnologia pudesse te ajudar a alcançar ainda mais?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Você fala dos produtos, dos desafios, compartilha resultados…
                <br />
                <span className="font-semibold text-gray-900">Mas muitas vezes o alcance não se transforma em novas conexões.</span>
              </p>
              <p className="text-lg text-gray-700 font-medium mt-6">
                O YLADA Wellness foi criado para te ajudar a atrair novos contatos — sem complicação, sem formulários e sem armazenar dados.
                <br />
                <span className="text-base font-normal mt-2 block">Apenas inspiração e tecnologia a favor do seu propósito.</span>
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
                O YLADA oferece ferramentas digitais prontas para você gerar novas conexões e mostrar o seu trabalho de forma mais moderna e profissional.
              </p>
              
              <div className="grid sm:grid-cols-1 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💚</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Crie links com quizzes e desafios que despertam curiosidade</h3>
                      <p className="text-gray-600">IMC, Quiz de Bem-Estar, Desafio 21 Dias e outras opções prontas.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">💬</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Compartilhe de forma simples no WhatsApp e redes sociais</h3>
                      <p className="text-gray-600">Use em status, grupos e eventos para gerar interesse genuíno.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">🔁</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Duplicável para toda a sua equipe</h3>
                      <p className="text-gray-600">Cada membro pode ter seu próprio link e divulgar do mesmo jeito.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  href="/pt/wellness/checkout"
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🚀 Escolher meu plano
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personalize com seu nome e cidade</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Crie seu link com sua identidade e comece a divulgar.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Compartilhe e gere novas conexões</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use nas redes, status, grupos e eventos — e veja o interesse crescer.
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
                  "Com meu link, consegui alcançar pessoas novas que nunca tinham ouvido falar do meu espaço. É simples e bonito."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Cláudia R., Supervisora Wellness
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Agora o meu time inteiro divulga de forma igual. Ficou padronizado e profissional."
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  — Carlos F., Líder de Equipe 7.5K
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Adorei poder mostrar meu propósito de um jeito mais digital, sem precisar explicar tudo."
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
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inteligência de Atração</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use links criativos e ferramentas prontas para gerar interesse genuíno.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comunicação Natural</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Envie seu link por WhatsApp, status, Instagram ou QR Code.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center">
                <div className="text-5xl mb-4">🔁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema Duplicável</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cada membro pode criar o próprio link e divulgar do mesmo jeito.
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

        {/* 💚 7️⃣ SEÇÃO – FORMATO DE ACESSO */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Escolha seu formato de acesso
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
              {/* Plano Mensal */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Mensal</h3>
                <p className="text-gray-600 text-center mb-6">Distribuidores, Supervisores e Líderes de Equipe</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-green-600">R$ 59,90</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Acesso a todas as ferramentas de atração
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Link personalizado com nome e cidade
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Atualizações automáticas
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=monthly"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  💚 Assinar mensal
                </Link>
              </div>
              
              {/* Plano Anual */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-500 hover:border-green-600 transition-all transform scale-105 relative">
                <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full text-center mb-4 inline-block absolute -top-3 left-1/2 transform -translate-x-1/2">
                  ECONOMIA DE 21%
                </div>
                <div className="text-4xl mb-4 text-center mt-4">💚</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Anual</h3>
                <p className="text-gray-600 text-center mb-6">Distribuidores, Supervisores e Líderes de Equipe</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-green-600">R$ 47,50</span>
                  <span className="text-gray-600">/mês</span>
                  <div className="text-sm text-gray-500 mt-2">
                    12 meses
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Total de <span className="font-semibold text-gray-700">R$ 570/ano</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="line-through text-gray-400">R$ 720</span> você economiza R$ 150
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Tudo do plano mensal
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Pagamento único anual
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Melhor custo-benefício
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=annual"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  💚 Assinar anual
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🔄 8️⃣ SEÇÃO – DUPLICAÇÃO E PROPÓSITO */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Duplicar ficou mais fácil quando tudo está conectado à sua missão.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Cada membro da sua equipe pode ter seu próprio link e divulgar do mesmo jeito que você.
                <br />
                Mais organização, mais impacto, e o mesmo propósito: ajudar mais pessoas a se cuidarem.
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

        {/* 🌟 9️⃣ SEÇÃO FINAL – CONVITE HUMANO */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                O bem-estar começa com uma boa conexão.
              </h2>
              <p className="text-xl text-green-50 mb-6 leading-relaxed">
                Mostre o valor do que você faz e conquiste novas pessoas todos os dias.
              </p>
              <p className="text-lg text-green-50 mb-8 leading-relaxed">
                Com o YLADA Wellness, você transforma sua presença digital em resultados reais — atraindo com propósito, inspirando com autenticidade e crescendo com consistência.
              </p>
              <Link
                href="/pt/wellness/checkout"
                className="inline-flex items-center px-10 py-5 bg-white text-green-600 text-xl font-bold rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🌿 Escolher plano e começar agora
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
                src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                alt="YLADA Logo"
                width={280}
                height={84}
                className="bg-transparent object-contain"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Wellness — Your Lead Advanced Data Assistant
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
