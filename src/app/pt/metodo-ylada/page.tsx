'use client'

import Link from 'next/link'
import YladaHubHeader from '@/components/landing/YladaHubHeader'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

export default function MetodoYLADALandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <YladaHubHeader ctaLabel="Onde aplicar" ctaHref="#aplicacoes" showLanguageSelector={false} />

      <main>
        {/* 1️⃣ HERO — Primeira dobra */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              {/* Pergunta provocativa */}
              <p className="text-lg sm:text-xl text-blue-600 font-medium mb-4">
                E se o seu marketing pudesse atrair apenas clientes realmente interessados?
              </p>
              {/* Linha de contexto */}
              <p className="text-sm sm:text-base text-gray-500 uppercase tracking-wider mb-6">
                Para profissionais que querem atrair clientes sem desgaste
              </p>
              {/* Título principal */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Método YLADA
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-medium mb-4">
                A forma leve e inteligente de atrair clientes realmente interessados.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Um método que usa diagnósticos para fazer o cliente entender o próprio problema antes da conversa.
              </p>
              {/* Subtítulo de ruptura */}
              <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-6 leading-relaxed">
                Pare de tentar convencer curiosos.<br />
                Comece a conversar com quem já quer entender o que você faz.
              </p>
              {/* Explicação curta */}
              <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                O Método YLADA ensina como gerar valor, construir autoridade e filtrar curiosos automaticamente.
                Assim, você passa a conversar apenas com pessoas realmente interessadas.
              </p>
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#aplicacoes"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Onde aplicar o método
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Entender o método
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Problema do marketing tradicional */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                O problema do marketing tradicional
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Hoje muitos profissionais aprendem que para ter clientes precisam:
              </p>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Postar conteúdo constantemente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Aprender técnicas de persuasão</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Convencer pessoas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Explicar várias vezes o que fazem</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                Isso cria um problema enorme: você começa a conversar com pessoas que estão apenas curiosas, não realmente interessadas. E isso gera desgaste.
              </p>
              <p className="text-lg text-gray-900 font-semibold mt-6">
                O problema não é sua capacidade de explicar. O problema é quem chega para conversar com você.
              </p>
            </div>
          </div>
        </section>

        {/* 2b Investimento sem posicionamento */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Investimento sem posicionamento raramente gera resultado
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Profissionais investem constantemente em:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center gap-2"><span className="text-gray-400">•</span> formação</li>
                <li className="flex items-center gap-2"><span className="text-gray-400">•</span> marketing</li>
                <li className="flex items-center gap-2"><span className="text-gray-400">•</span> ferramentas</li>
              </ul>
              <p className="text-lg text-gray-800 font-medium leading-relaxed">
                Mas quando o cliente chega sem entender o próprio problema, o valor do profissional não fica claro. Os diagnósticos mudam isso.
              </p>
            </div>
          </div>
        </section>

        {/* 3️⃣ A nova mentalidade */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                A grande virada de mentalidade
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Existe uma forma muito mais inteligente de trabalhar. Uma forma onde:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">Você <strong>gera valor antes da conversa</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">Você <strong>constrói autoridade naturalmente</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">Você <strong>atrai pessoas realmente interessadas</strong></span>
                </li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                <p className="text-lg text-gray-800 font-medium leading-relaxed">
                  Quando a pessoa chega para conversar com você: ela já tem interesse, ela já percebe sua autoridade, ela já quer entender mais.
                </p>
                <p className="text-xl text-gray-900 font-bold mt-4">
                  Sua função deixa de ser convencer. Sua função passa a ser explicar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3b Bloco: papel do diagnóstico */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Toda boa conversa começa com boas perguntas.
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                O Método YLADA usa diagnósticos para ajudar as pessoas a entender melhor a própria situação antes da conversa.
              </p>
              <p className="text-gray-700 mb-4">Quando alguém responde um diagnóstico:</p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>ela reflete sobre o próprio problema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>ela entende melhor sua situação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>a conversa começa com muito mais contexto</span>
                </li>
              </ul>
              <p className="text-lg text-gray-800 font-medium leading-relaxed">
                Isso faz com que curiosos se afastem e interessados se aproximem naturalmente.
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ Os 4 passos do método */}
        <section id="como-funciona" className="py-16 sm:py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
                Como o Método YLADA funciona
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                O método funciona em quatro etapas simples.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { num: '1', titulo: 'Posicionamento', desc: 'Você constrói uma identidade profissional baseada em autoridade e clareza.', cor: 'from-blue-600 to-indigo-600' },
                  { num: '2', titulo: 'Atração', desc: 'Você gera valor que desperta curiosidade e interesse.', cor: 'from-indigo-600 to-purple-600' },
                  { num: '3', titulo: 'Diagnóstico', desc: 'A pessoa responde perguntas que ajudam a entender sua situação. Isso gera clareza e separa naturalmente curiosos de interessados.', cor: 'from-purple-600 to-pink-600' },
                  { num: '4', titulo: 'Conversa', desc: 'Quando a pessoa chega, ela já está interessada. Você apenas explica.', cor: 'from-pink-600 to-rose-600' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.cor} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                      {step.num}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.titulo}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Papel da tecnologia YLADA */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                O papel da tecnologia YLADA
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A plataforma YLADA ajuda você a aplicar esse método de forma automática e escalável através de:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Noel</strong> — inteligência estratégica que orienta suas decisões</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Diagnósticos inteligentes</strong> — ferramentas que geram valor antes da conversa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Diagnósticos personalizados</strong> — que filtram e qualificam leads</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Essas ferramentas ajudam você a gerar valor automaticamente, atrair pessoas interessadas, filtrar curiosos e preparar conversas muito melhores.
              </p>
              <p className="text-lg text-gray-900 font-semibold leading-relaxed">
                Ou seja: você não aplica o método manualmente. A tecnologia YLADA ajuda você a aplicar isso automaticamente.
              </p>
            </div>
          </div>
        </section>

        {/* 5b Áreas onde o YLADA pode ser aplicado */}
        <section id="aplicacoes" className="py-16 sm:py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
                Áreas onde o YLADA pode ser aplicado
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {YLADA_LANDING_AREAS.map((area) => (
                  <Link
                    key={area.codigo}
                    href={area.href}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{area.label}</h3>
                    <p className="text-gray-600 text-sm mb-4">{area.slogan}</p>
                    <span className="text-blue-600 text-sm font-medium">Conhecer →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5c O que acontece depois do diagnóstico + CTA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-gray-700 font-medium mb-6">
                Mais de 80% dos profissionais descobrem no diagnóstico que o problema não é competência — é posicionamento.
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                O que acontece depois do diagnóstico
              </h2>
              <p className="text-gray-600 text-center mb-10">
                Em poucos minutos você recebe um resultado claro e entende qual é o próximo passo.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">1</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Você descobre seu perfil</h3>
                    <p className="text-gray-600 text-sm">O diagnóstico identifica como sua comunicação profissional está funcionando hoje.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">2</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Você entende o que está travando seus resultados</h3>
                    <p className="text-gray-600 text-sm mb-2">O resultado mostra o que normalmente acontece com profissionais no mesmo perfil.</p>
                    <ul className="text-gray-500 text-sm space-y-1">
                      <li>• atraem muitos curiosos</li>
                      <li>• explicam demais o que fazem</li>
                      <li>• têm conversas que não avançam</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">3</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Você vê como melhorar</h3>
                    <p className="text-gray-600 text-sm">O diagnóstico mostra o caminho que profissionais usam para atrair clientes mais preparados.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">4</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Você pode aplicar isso no seu negócio</h3>
                    <p className="text-gray-600 text-sm">Se fizer sentido para você, o YLADA permite criar seus próprios diagnósticos e aplicar esse método com seus clientes.</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Link
                  href="/pt/diagnostico"
                  className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Fazer diagnóstico agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6️⃣ Benefícios */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                O grande benefício: trabalhar com mais leveza
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed text-center">
                Profissionais que aplicam o Método YLADA percebem rapidamente:
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {[
                  'Aumento de autoridade',
                  'Mais autoconfiança',
                  'Marketing mais leve',
                  'Conversas mais produtivas',
                ].map((beneficio) => (
                  <div key={beneficio} className="flex items-center gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
                    <span className="text-green-600 text-xl">✓</span>
                    <span className="font-medium text-gray-800">{beneficio}</span>
                  </div>
                ))}
              </div>
              <p className="text-xl text-gray-900 font-semibold text-center">
                Eles deixam de tentar convencer. Eles passam a orientar pessoas interessadas.
              </p>
            </div>
          </div>
        </section>

        {/* Princípio do método */}
        <p className="text-center text-xl font-bold text-gray-900 py-8">
          Diagnóstico antes da proposta.
        </p>

        {/* 7️⃣ Frase de resumo + CTA final */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-white">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Pare de tentar convencer curiosos.<br />
                Comece a atrair interessados.
              </p>
              <p className="text-lg sm:text-xl text-blue-100 mb-10">
                Se você quer trabalhar com mais leveza, construir autoridade, atrair pessoas realmente interessadas e ter conversas muito mais produtivas — então você precisa conhecer o Método YLADA.
              </p>
              <Link
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 font-bold text-xl rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
              >
                Descobrir meu perfil
              </Link>
              <p className="text-sm text-blue-200 mt-6">
                Uma nova forma de iniciar conversas com clientes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center text-sm">
          <Link href="/pt" className="hover:text-white transition-colors">
            YLADA
          </Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-white transition-colors">
            Método YLADA
          </Link>
          <span className="mx-2">•</span>
          <Link href="/pt#onde-aplicar" className="hover:text-white transition-colors">
            Áreas
          </Link>
        </div>
      </footer>
    </div>
  )
}
