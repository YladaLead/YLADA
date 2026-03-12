'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { UseCasesSection } from '@/components/ylada/UseCasesSection'
import { HeroBeforeAfter } from '@/components/ylada/HeroBeforeAfter'
import { PricingBlockCompact } from '@/components/ylada/PricingBlockCompact'
import { useRouter } from 'next/navigation'

/**
 * Landing YLADA para Perfumaria — template oficial.
 */
export default function PerfumariaLandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return
    if (user) {
      router.replace('/pt/perfumaria/home')
    }
  }, [mounted, loading, user, router])

  if (loading || (mounted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-14 sm:h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/pt" className="flex items-center gap-2">
              <span className="font-bold text-gray-900">YLADA</span>
              <span className="text-gray-500 text-sm">· Perfumaria</span>
            </Link>
            <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-3">
              Parte da plataforma YLADA
            </span>
          </div>
          <Link
            href="/pt/perfumaria/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main>
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                YLADA para Perfumaria
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-4">
                Atrair clientes interessados em fragrâncias ideais.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                O cliente responde uma avaliação rápida antes do contato. Assim você entende preferências, ocasiões e o perfil olfativo antes mesmo da primeira conversa.
              </p>
              <div className="flex flex-col items-center gap-1 mb-8 text-sm text-gray-600">
                <span>Cliente responde avaliação</span>
                <span className="text-gray-400">↓</span>
                <span>Sistema gera diagnóstico</span>
                <span className="text-gray-400">↓</span>
                <span>A conversa começa com contexto</span>
              </div>
              <Link
                href="/pt/precos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Começar agora
                <span className="ml-2" aria-hidden>→</span>
              </Link>
              <p className="text-gray-500 text-sm mt-3">Acesso liberado após o pagamento</p>
            </div>
          </div>
        </section>

        <HeroBeforeAfter area="perfumaria" />

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Consultores de fragrância enfrentam três dificuldades comuns no marketing online
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Clientes pedindo indicação sem conhecer o perfil olfativo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Conversas que começam e não evoluem para compra</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Dificuldade de qualificar o interesse antes do contato</span>
                </li>
              </ul>
              <p className="text-center text-gray-600 mt-8 font-medium">
                Isso consome tempo, gera conversas improdutivas e reduz a conversão em vendas.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                O YLADA ajuda você a atrair clientes interessados em fragrâncias ideais
              </h2>
              <p className="text-lg text-gray-700 mb-6 text-center">
                O cliente responde uma avaliação rápida antes do contato. Assim você entende preferências, ocasiões e pode sugerir fragrâncias antes mesmo da conversa.
              </p>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 text-center">
                  Atrair clientes interessados em fragrâncias ideais.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                Como funciona
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Escolha uma avaliação', desc: 'Quizzes e diagnósticos de perfil olfativo.' },
                  { step: '2', title: 'Compartilhe o link', desc: 'Use em redes sociais, WhatsApp ou site.' },
                  { step: '3', title: 'O cliente responde', desc: 'O sistema identifica preferências e ocasiões.' },
                  { step: '4', title: 'Conversa com contexto', desc: 'Você sugere fragrâncias com base no perfil.' },
                ].map((item) => (
                  <div key={item.step} className="text-center p-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-3">
                      {item.step}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
                Veja como um diagnóstico pode iniciar uma conversa real
              </h2>
              <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">
                Veja como uma avaliação simples pode gerar uma conversa mais qualificada com o cliente.
              </p>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-600">Avaliação respondida</p>
                  <p className="text-xs text-gray-400 font-mono">ylada.app/avaliacao/perfume</p>
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 max-w-sm">
                    <p className="text-xs text-gray-500 mb-2">Avaliação: &quot;Qual fragrância combina com seu perfil?&quot;</p>
                    <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <p className="font-semibold text-gray-900 mb-2">Resultado do diagnóstico</p>
                      <p className="font-medium text-gray-800 mb-2">Perfil identificado: Preferência por notas florais</p>
                      <p className="text-sm text-gray-600 mb-3">Possíveis sinais:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• gosta de fragrâncias suaves</li>
                        <li>• ocasião: dia a dia</li>
                        <li>• interesse em descobrir novas fragrâncias</li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 italic">
                      Esse resultado sugere fragrâncias que podem combinar com o perfil.
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Isso gera curiosidade e abre espaço para iniciar uma conversa.
                    </p>
                  </div>
                  <div className="bg-[#dcf8c6] rounded-xl p-4 max-w-sm ml-4 border border-gray-200">
                    <p className="text-sm text-gray-800">
                      &quot;Adorei o resultado! Quais fragrâncias vocês recomendam?&quot;
                    </p>
                    <p className="text-xs text-gray-500 mt-1">💬 Mensagem que o cliente envia depois</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-600">Veja como a conversa começa</p>
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <p className="text-gray-500 text-sm mb-2">Área para vídeo</p>
                      <p className="text-gray-400 text-xs max-w-[200px] mx-auto">
                        Vídeo curto mostrando: criar avaliação → enviar link → cliente responde → perfil olfativo aparece → conversa começa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-center mt-8 max-w-2xl mx-auto">
                Quando o cliente responde uma avaliação, ele começa a refletir sobre suas preferências. Isso gera interesse e abertura para descobrir fragrâncias ideais.
              </p>
              <div className="text-center mt-8">
                <Link
                  href="/pt/precos"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  Começar agora
                </Link>
                <p className="text-gray-500 text-sm mt-2">Acesso liberado após o pagamento</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Avaliações usadas em perfumaria
              </h2>
              <p className="text-gray-700 mb-6 text-center">
                Consultores usam avaliações como:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                {[
                  'Qual fragrância combina com seu perfil?',
                  'Qual tipo de perfume você prefere?',
                  'Qual ocasião você busca para sua fragrância?',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-center text-sm">
                Essas avaliações ajudam a atrair clientes interessados em fragrâncias ideais.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Quando a conversa começa com contexto, tudo muda
              </h2>
              <ul className="space-y-4">
                {[
                  'Menos curiosos',
                  'Conversas mais qualificadas',
                  'Clientes que entendem o valor da consultoria',
                  'Menos tempo explicando no WhatsApp',
                  'Mais autoridade profissional',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <UseCasesSection area="perfumaria" />

        <section className="py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-700 font-medium">
                Profissionais usam o YLADA para iniciar conversas como:
              </p>
              <blockquote className="mt-3 text-gray-800 italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
                &quot;Vi que você respondeu a avaliação de perfil olfativo. Tenho algumas fragrâncias que podem combinar. Quer conhecer?&quot;
              </blockquote>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-gray-700 font-medium mb-4">
                Usado por profissionais que querem:
              </p>
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-gray-700">
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> atrair clientes mais preparados</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> iniciar conversas mais qualificadas</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> reduzir curiosos</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> ganhar mais clareza no primeiro contato</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Não é apenas um quiz. É uma conversa que começa antes do contato.
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O cliente responde algumas perguntas.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                O YLADA interpreta as respostas e gera um diagnóstico inicial.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Isso ajuda o profissional a iniciar conversas mais claras com pessoas que já refletiram sobre sua própria situação.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <p className="text-center text-gray-600 mb-2">
                Acesso completo à plataforma.
              </p>
              <p className="text-center text-gray-600 mb-4">
                Crie quantos diagnósticos quiser.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Comece a usar o YLADA
              </h2>
              <PricingBlockCompact ctaHref="/pt/precos" />
              <p className="text-center text-gray-500 text-sm mt-3">
                Após o pagamento você já pode acessar a plataforma.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 bg-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Comece a usar o YLADA hoje
              </h2>
              <p className="text-blue-100 mb-6">
                Crie seu primeiro diagnóstico em minutos.
              </p>
              <Link
                href="/pt/precos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Começar agora
                <span className="ml-2" aria-hidden>→</span>
              </Link>
              <p className="text-blue-100 text-sm mt-3">Acesso liberado após o pagamento</p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Dúvidas frequentes
              </h2>
              <div className="space-y-2">
                {[
                  { q: 'Preciso pagar para acessar?', a: 'Sim. Após o pagamento você recebe acesso imediato à plataforma e já pode começar a criar suas avaliações e links.' },
                  { q: 'Preciso saber marketing?', a: 'Não. O YLADA já possui avaliações prontas. Você pode escolher uma avaliação e começar a usar em minutos.' },
                  { q: 'Como o cliente recebe a avaliação?', a: 'Você pode compartilhar o link por WhatsApp, redes sociais ou no seu site.' },
                  { q: 'O diagnóstico substitui atendimento?', a: 'Não. A avaliação é apenas um primeiro filtro. Ela ajuda o cliente a refletir e iniciar uma conversa mais qualificada.' },
                  { q: 'Posso cancelar quando quiser?', a: 'Sim. Você pode cancelar a assinatura a qualquer momento.' },
                  { q: 'Preciso saber tecnologia para usar?', a: 'Não. O YLADA foi pensado para ser simples. Em poucos minutos você consegue criar sua primeira avaliação e compartilhar o link.' },
                  { q: 'Onde posso usar os links?', a: 'Você pode compartilhar em Instagram, WhatsApp, redes sociais, site ou qualquer canal de comunicação com seus clientes.' },
                  { q: 'O cliente precisa instalar algo?', a: 'Não. O cliente apenas responde a avaliação pelo link enviado.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.q}
                      <span className="text-gray-400 text-lg shrink-0 ml-2">
                        {faqOpen === i ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === i && (
                      <div className="px-4 pb-3 pt-0">
                        <p className="text-gray-600 text-sm">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
              <div className="text-center sm:text-left">
                <span className="font-bold text-gray-900 text-lg">YLADA</span>
                <p className="text-gray-600 text-sm mt-1">Plataforma de diagnósticos para iniciar conversas com contexto.</p>
              </div>
              <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900">Método YLADA</Link>
                <Link href="/pt/profissionais" className="text-gray-600 hover:text-gray-900">Profissionais</Link>
                <Link href="/pt/precos" className="text-gray-600 hover:text-gray-900">Planos</Link>
                <Link href="/pt/politica-de-privacidade" className="text-gray-600 hover:text-gray-900">Privacidade</Link>
                <Link href="/pt/termos-de-uso" className="text-gray-600 hover:text-gray-900">Termos</Link>
              </nav>
            </div>
            <p className="text-center sm:text-left text-gray-500 text-xs">
              © {new Date().getFullYear()} YLADA
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
