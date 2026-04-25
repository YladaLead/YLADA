'use client'

import Image from 'next/image'
import Link from 'next/link'
import YladaHubHeader from '@/components/landing/YladaHubHeader'
import ManifestoYLADA from '@/components/landing/ManifestoYLADA'
import DemoCarouselYLADA from '@/components/landing/DemoCarouselYLADA'
import FluxoTrilhaPlataforma from '@/components/landing/FluxoTrilhaPlataforma'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'
import {
  getYladaPublicAreaAnalysisWhatsAppUrl,
  getYladaPublicAreaSupportLinkLabel,
} from '@/lib/ylada-public-area-support'

export default function MetodoYLADALandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <YladaHubHeader ctaLabel="Onde aplicar" ctaHref="#aplicacoes" showLanguageSelector={false} />

      <main>
        {/* 1️⃣ HERO — Primeira dobra */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Filosofia YLADA
              </h1>
              <p className="text-xl sm:text-2xl text-gray-800 font-semibold mb-4">
                Boas conversas começam com boas perguntas.
              </p>
              <p className="text-lg sm:text-xl text-gray-700 font-medium mb-4">
                Transforme curiosidade em conversas com clientes através de diagnósticos inteligentes.
              </p>
              <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto">
                Hoje o marketing tenta convencer.<br />
                A filosofia YLADA cria conversas com quem já quer entender o que você faz.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                A nova lógica de comunicação que transforma marketing em conversas com pessoas realmente interessadas.
              </p>
              <p className="text-base font-semibold text-gray-800 mb-10">
                Antes da conversa vem o diagnóstico. YLADA foi criado para criar consciência do cliente antes da conversa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pt/diagnostico"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Criar diagnóstico
                </Link>
                <Link
                  href="#como-funciona-na-pratica"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Ver como funciona na prática
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ManifestoYLADA showDiagram showTitle variant="card" />

        {/* Carrossel: como funciona na prática (valor → WhatsApp) */}
        <DemoCarouselYLADA />

        {/* Trilha na plataforma: entra → board → Noel manda o link */}
        <FluxoTrilhaPlataforma />

        {/* 2️⃣ A nova lógica de atrair clientes */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                A nova lógica de atrair clientes
              </h2>
              <p className="text-lg text-gray-600 mb-6 text-center leading-relaxed">
                O problema do marketing tradicional
              </p>
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
                A filosofia YLADA usa diagnósticos para ajudar as pessoas a entender melhor a própria situação antes da conversa.
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

        {/* Por que diagnósticos funcionam — três mecanismos */}
        <section className="py-14 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
                Por que diagnósticos funcionam tão bem
              </h2>
              <p className="text-gray-700 text-center mb-4 leading-relaxed">
                Diagnósticos ativam três mecanismos psicológicos naturais: auto-diagnóstico, compromisso interno e identidade.
              </p>
              <p className="text-gray-800 font-medium text-center mb-8">
                Formulários coletam respostas. Diagnósticos criam consciência.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block" aria-hidden>🧠</span>
                  <p className="font-bold text-gray-900 text-sm mb-2">Auto-diagnóstico</p>
                  <p className="text-gray-600 text-xs">A pessoa descobre o problema sozinha. Mais clareza e abertura para a conversa.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block" aria-hidden>🎯</span>
                  <p className="font-bold text-gray-900 text-sm mb-2">Compromisso interno</p>
                  <p className="text-gray-600 text-xs">Quem reconhece um problema tende a querer resolver. A conversa começa com mais interesse.</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                  <span className="text-2xl mb-2 block" aria-hidden>👤</span>
                  <p className="font-bold text-gray-900 text-sm mb-2">Identidade</p>
                  <p className="text-gray-600 text-xs">O perfil revelado gera curiosidade e engajamento. As pessoas gostam de entender como estão.</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 text-center mb-4">
                Quando o cliente entende o problema, a conversa muda.
              </p>
              <div className="flex flex-col items-center gap-2 py-4 px-6 bg-white rounded-xl border border-gray-100 max-w-xs mx-auto">
                <span className="text-sm font-semibold text-gray-800">Perguntas</span>
                <span className="text-gray-400">↓</span>
                <span className="text-sm font-semibold text-gray-800">Reflexão</span>
                <span className="text-gray-400">↓</span>
                <span className="text-sm font-semibold text-gray-800">Diagnóstico / Perfil</span>
                <span className="text-gray-400">↓</span>
                <span className="text-sm font-semibold text-gray-800">Clareza</span>
                <span className="text-gray-400">↓</span>
                <span className="text-sm font-bold text-gray-900">Cliente</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ O funcionamento da filosofia YLADA */}
        <section id="como-funciona" className="py-16 sm:py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
                O funcionamento da filosofia YLADA
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                A filosofia é aplicada através do Método YLADA. O fluxo central:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-6 mb-12">
                <div className="text-center p-5 rounded-xl bg-blue-50 border-2 border-blue-100 min-w-[160px]">
                  <p className="font-bold text-blue-700 text-lg">Diagnóstico</p>
                  <p className="text-sm text-gray-600 mt-1">gera curiosidade</p>
                </div>
                <span className="text-2xl text-gray-400">↓</span>
                <div className="text-center p-5 rounded-xl bg-indigo-50 border-2 border-indigo-100 min-w-[160px]">
                  <p className="font-bold text-indigo-700 text-lg">Conversa</p>
                  <p className="text-sm text-gray-600 mt-1">com interessados</p>
                </div>
                <span className="text-2xl text-gray-400">↓</span>
                <div className="text-center p-5 rounded-xl bg-green-50 border-2 border-green-100 min-w-[160px]">
                  <p className="font-bold text-green-700 text-lg">Cliente</p>
                  <p className="text-sm text-gray-600 mt-1">conversão natural</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Como o YLADA funciona na prática
              </h3>
              <div className="space-y-6 max-w-2xl mx-auto">
                {[
                  { step: 1, titulo: 'Você cria um diagnóstico', desc: 'Ex.: "Descubra o que pode estar travando os resultados da sua pele." O sistema gera um link inteligente.' },
                  { step: 2, titulo: 'Você compartilha o link', desc: 'Instagram, Stories, bio, WhatsApp, grupos ou anúncios. As pessoas clicam por curiosidade.' },
                  { step: 3, titulo: 'A pessoa responde o diagnóstico', desc: 'Ela responde perguntas rápidas, se envolve e reflete sobre o problema. O interesse aumenta.' },
                  { step: 4, titulo: 'O sistema gera o diagnóstico', desc: 'Ela recebe algo como: "Pelas suas respostas, seu principal desafio pode estar na regularidade." Identificação imediata.' },
                  { step: 5, titulo: 'A conversa começa naturalmente', desc: 'Aparece o botão "Quero entender melhor" ou "Falar com a especialista". Agora a conversa é com alguém interessado.' },
                  { step: 6, titulo: 'A venda se torna natural', desc: 'Em vez de convencer curiosos, você conversa com quem já percebeu que tem um problema.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">{item.step}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.titulo}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* O funil de diagnóstico YLADA */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                O funil de diagnóstico YLADA
              </h2>
              <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
                Não é o funil tradicional de marketing. É um funil que prepara a conversa antes dela acontecer.
              </p>
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/ylada/funil-tradicional-vs-funil-diagnostico-ylada.png"
                  alt="Comparação: Funil tradicional de marketing (Atenção, Interesse, Desejo, Ação) versus Funil de diagnóstico YLADA (Curiosidade, Perguntas, Clareza, Conversa, Cliente)"
                  width={800}
                  height={500}
                  className="w-full max-w-2xl h-auto rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
              <p className="text-center text-gray-600 text-sm max-w-xl mx-auto">
                CRM organiza conversas depois que elas acontecem. YLADA prepara a conversa antes dela acontecer.
              </p>
            </div>
          </div>
        </section>

        {/* Tráfego pago vs Diagnóstico YLADA */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Tráfego pago vs Diagnóstico YLADA
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="font-semibold text-gray-800 mb-2">Tráfego pago</p>
                  <p className="text-gray-600 text-sm">💰 Paga para aparecer</p>
                  <p className="text-gray-600 text-sm mt-1">Pessoas frias, precisa repetir sempre</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="font-semibold text-gray-800 mb-2">Diagnóstico YLADA</p>
                  <p className="text-gray-600 text-sm">🧠 Pessoas querem descobrir o resultado</p>
                  <p className="text-gray-600 text-sm mt-1">Curiosidade natural, interessados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Os três motores do YLADA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
                Os três motores do YLADA
              </h2>
              <p className="text-lg text-gray-600 mb-10 text-center">
                Captação → Conversa → Relacionamento → Cliente
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="rounded-xl p-6 border-2 border-blue-100 bg-blue-50/50">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Motor de Captação</h3>
                  <p className="text-gray-700 text-sm mb-2">Diagnósticos despertam curiosidade e atraem pessoas interessadas.</p>
                  <p className="text-xs text-gray-500">Curiosidade → Diagnóstico → Pessoa interessada</p>
                </div>
                <div className="rounded-xl p-6 border-2 border-indigo-100 bg-indigo-50/50">
                  <h3 className="text-lg font-bold text-indigo-800 mb-2">Motor de Conversa</h3>
                  <p className="text-gray-700 text-sm mb-2">Resultados personalizados iniciam conversas naturais.</p>
                  <p className="text-xs text-gray-500">Diagnóstico → Conversa começa</p>
                </div>
                <div className="rounded-xl p-6 border-2 border-green-100 bg-green-50/50">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Motor de Relacionamento</h3>
                  <p className="text-gray-700 text-sm mb-2">Histórico e acompanhamento transformam contatos em clientes.</p>
                  <p className="text-xs text-gray-500">Conversa → Cliente → Indicação</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exemplo de diagnóstico + áreas */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Exemplo de diagnóstico (estética)
              </h2>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                <p className="text-gray-600 text-sm mb-4">Pergunta 1 — Você sente que sua pele perdeu viço?</p>
                <p className="text-gray-600 text-sm mb-4">Pergunta 2 — Você faz algum tratamento atualmente?</p>
                <p className="text-gray-600 text-sm mb-4">Pergunta 3 — Qual desses problemas mais te incomoda?</p>
                <p className="text-gray-800 font-medium pt-2 border-t border-gray-100">
                  Resultado: Seu perfil indica que sua pele pode estar com baixa renovação celular.
                </p>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Exemplos de diagnósticos que você pode criar
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Estética', 'Nutrição', 'Psicologia', 'Vendas', 'Fitness'].map((area) => (
                  <span key={area} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Papel da tecnologia YLADA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
                O papel da tecnologia YLADA
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                O Noel é o mentor da filosofia YLADA e ajuda você a aplicá-la no dia a dia. A plataforma permite aplicar isso de forma automática e escalável através de:
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
                Ou seja: você aplica a filosofia através do Método YLADA com o apoio da tecnologia.
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
              <p className="text-center mt-10">
                <a
                  href={getYladaPublicAreaAnalysisWhatsAppUrl('pt')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-emerald-800 hover:text-emerald-950 underline-offset-2 hover:underline"
                >
                  {getYladaPublicAreaSupportLinkLabel('pt')}
                </a>
              </p>
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
                Profissionais que aplicam a filosofia YLADA percebem rapidamente:
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

        <p className="text-center text-xl font-bold text-gray-900 py-8">
          O YLADA transforma curiosidade em conversas com clientes.
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
                Se você quer trabalhar com mais leveza, construir autoridade, atrair pessoas realmente interessadas e ter conversas muito mais produtivas — então você precisa conhecer a filosofia YLADA.
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
            Filosofia YLADA
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
