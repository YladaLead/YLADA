'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import YladaHubHeader from '@/components/landing/YladaHubHeader'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: '',
    countryCode: 'BR' // Código do país para o telefone
  })

  // Capturar access_token do hash do Supabase e processar sessão
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      
      // Se tiver access_token no hash, é um callback do Supabase
      if (hash && hash.includes('access_token=')) {
        console.log('🔐 Access token detectado no hash, processando sessão...')
        
        // Processar sessão do Supabase e redirecionar
        const processSession = async () => {
          try {
            const { createClient } = await import('@/lib/supabase-client')
            const supabase = createClient()
            
            // O Supabase client deve processar o hash automaticamente
            // Aguardar um pouco para a sessão ser processada
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Verificar se a sessão foi criada
            const { data: { session } } = await supabase.auth.getSession()
            
            if (session) {
              console.log('✅ Sessão criada, redirecionando para home')
              // Redirecionar para home (recuperação de acesso)
              window.location.href = '/pt/wellness/home'
            } else {
              console.warn('⚠️ Sessão não criada, redirecionando para login')
              window.location.href = '/pt/wellness/login'
            }
          } catch (error) {
            console.error('❌ Erro ao processar sessão:', error)
            window.location.href = '/pt/wellness/login'
          }
        }
        
        processSession()
      }
    }
  }, [router])

  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar formulário')
      }

      setFormData({ nome: '', profissao: '', pais: '', email: '', telefone: '', countryCode: 'BR' })
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar formulário. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <YladaHubHeader ctaLabel="Explorar soluções" ctaHref="#onde-aplicar" />

      <main>
        {/* (1) Hero — Hub central */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              YLADA
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-4">
              A forma leve e inteligente de atrair clientes realmente interessados.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              O YLADA é uma plataforma baseada no Método YLADA que ajuda profissionais a atrair clientes interessados antes da conversa — gerando valor, construindo autoridade e filtrando curiosos.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Antes da venda. Durante a conversa. Depois do contato.
            </p>
            <Link 
              href="#onde-aplicar"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Onde aplicar o Método YLADA
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* (1b) Onde você quer aplicar o Método YLADA? */}
        <section id="onde-aplicar" className="bg-gray-50 py-12 sm:py-16 lg:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
              Onde você quer aplicar o Método YLADA?
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Escolha sua área e veja como o método funciona na prática.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {YLADA_LANDING_AREAS.map((area) => (
                <Link
                  key={area.codigo}
                  href={area.href}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 text-center"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{area.label}</h3>
                  <p className="text-gray-600 text-sm mb-4">{area.descricao}</p>
                  <span className="text-blue-600 text-sm font-medium">Explorar →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* (2) Seção "Quem somos" */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Quem somos
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                O YLADA nasceu da ideia de que toda conversa pode gerar resultado quando existe direção, diagnóstico e inteligência por trás.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Criamos um sistema inteligente que ajuda profissionais e times de campo a atrair, qualificar e se conectar com pessoas realmente interessadas, transformando interações em oportunidades concretas.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Mais do que tecnologia, o YLADA organiza a conversa, orienta a rotina, fortalece a autoridade de quem está no campo e aumenta a confiança em cada interação.
              </p>
            </div>
          </div>
        </section>

        {/* (3) Seção "Como funciona" */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Como funciona
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captação e Diagnóstico</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Crie links, quizzes e avaliações inteligentes que provocam a conversa certa, entregam valor imediato e filtram curiosos de pessoas realmente interessadas — antes mesmo do primeiro contato.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conversa Guiada e Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Conduza o diálogo com clareza e estratégia. A inteligência artificial do YLADA orienta o que falar, quando falar e como conduzir, ajustando a abordagem ao contexto real de cada interação.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Performance e Autoridade de Campo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompanhe decisões, interações e resultados para aumentar conversão, previsibilidade e credibilidade profissional, fortalecendo a confiança individual e do time no campo.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Escala Multimercado</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use o mesmo motor de geração de contatos e conversas em diferentes áreas, países e modelos de negócio — sem perder personalização nem controle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (4) Seção "O diferencial da inteligência YLADA" */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                O diferencial da inteligência YLADA
              </h2>
              <p className="text-xl text-gray-800 font-semibold mb-6 leading-relaxed">
                Inteligência artificial que provoca conversa, não bloqueia relacionamento.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed text-left">
                A inteligência artificial do YLADA não foi criada para substituir o profissional nem engessar o atendimento com respostas automáticas. Ela atua como um copiloto estratégico, ajustando rotina, abordagem e próximos passos de acordo com o contexto real de cada interação.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3 mb-10">
              <p className="text-gray-700 leading-relaxed">Por meio de diagnósticos inteligentes e direcionamento contínuo, o YLADA:</p>
              <ul className="text-gray-600 space-y-2 list-none">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> provoca o início da conversa certa</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> direciona o foco para pessoas realmente interessadas</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> orienta o que falar, quando falar e como conduzir</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> fortalece a autoridade e a credibilidade do profissional</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> eleva o desempenho e a confiança do time de campo</li>
              </ul>
              <p className="text-gray-600 leading-relaxed pt-2">
                O resultado é menos curiosos, mais qualidade de contato e conversas que evoluem naturalmente para relacionamento e decisão.
              </p>
            </div>
            <p className="text-center text-lg font-semibold text-gray-800 max-w-xl mx-auto">
              Não é sobre responder mensagens.<br />É sobre provocar conversas certas.
            </p>
          </div>
        </section>

        {/* (5) Seção "Para quem é o YLADA" — mesmas áreas, igual peso */}
        <section id="solucoes" className="py-12 sm:py-16 lg:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Para quem é o YLADA
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {YLADA_LANDING_AREAS.map((area) => (
                <Link
                  key={area.codigo}
                  href={area.href}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{area.label}</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {area.descricao}
                  </p>
                  <div className="mt-4 text-center">
                    <span className="text-blue-600 text-sm font-medium">Explorar →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* (6) Seção "Filosofia YLADA" */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">
                Filosofia YLADA
              </h2>
              <p className="mb-6">
                <Link href="/pt/metodo-ylada" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                  Conheça o Método YLADA →
                </Link>
              </p>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  YLADA significa <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span>.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Acreditamos que tecnologia só faz sentido quando melhora a conversa, fortalece o relacionamento e orienta decisões melhores no campo.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Por isso, criamos soluções que transformam dados em clareza, interações em oportunidades e conversas em resultados reais, com inteligência, humanidade e propósito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (7) Seção CTA final: Fale com a gente */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                Fale com a gente
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Quer entender como o YLADA pode ajudar você ou seu time a gerar contatos mais qualificados, mais autoridade e mais previsibilidade?
              </p>
              
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profissao" className="block text-sm font-medium text-gray-700 mb-2">
                      Profissão
                    </label>
                    <input
                      type="text"
                      id="profissao"
                      value={formData.profissao}
                      onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      id="pais"
                      value={formData.pais}
                      onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <PhoneInputWithCountry
                      value={formData.telefone}
                      onChange={(phone, countryCode) => {
                        setFormData({ ...formData, telefone: phone, countryCode })
                      }}
                      defaultCountryCode={formData.countryCode}
                      className="w-full"
                      placeholder="11 99999-9999"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selecione o país pela bandeira e digite apenas o número (sem DDD/área)
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Modal de Sucesso */}
        {showSuccessModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Ícone de sucesso */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Mensagem */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Obrigado pelo interesse!
                </h3>
                <p className="text-gray-600 mb-6">
                  Entraremos em contato em breve.
                </p>
                
                {/* Botão */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* (7) Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-center">
              YLADA: Your Leading Advanced Data Assistant
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm text-gray-500">
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">Política de Privacidade</Link>
              <span>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700">Termos de Uso</Link>
              <span>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700">Cookies</Link>
              <span>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700">Reembolso</Link>
              <span>•</span>
              <span className="text-gray-400">Idiomas: PT / ES / EN</span>
            </div>
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
