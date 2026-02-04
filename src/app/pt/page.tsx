'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function HomePage() {
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: '',
    countryCode: 'BR' // Código do país para o telefone
  })
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-20 sm:h-24 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <YLADALogo size="md" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* (1) Hero Section - Abertura elegante */}
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              Transformamos conversa em contatos qualificados.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              O YLADA é um motor de diagnóstico, links inteligentes e inteligência artificial que cria, provoca e direciona conversas estratégicas — aumentando a autoridade, a credibilidade e a performance de profissionais e times de campo.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Antes da venda. Durante a conversa. Depois do contato.
            </p>
            <Link 
              href="#solucoes"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explorar soluções
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* (2) Seção "Quem somos" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
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
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Como funciona
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Atração e Diagnóstico</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Crie links, quizzes e avaliações inteligentes que provocam curiosidade qualificada, geram valor imediato e filtram curiosos de pessoas realmente interessadas, antes mesmo da conversa começar.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conversa Guiada e Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Utilize comunicação integrada e inteligência artificial para orientar o diálogo, ajustar a abordagem ao contexto e manter o contato ativo com clareza, naturalidade e estratégia.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Performance e Autoridade de Campo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompanhe interações, decisões e resultados em tempo real para melhorar conversão, previsibilidade e posicionamento profissional — individualmente ou em time.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Escala Multimercado</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aplique o mesmo motor de geração de contatos e conversas em diferentes áreas, países e modelos de negócio, sem perder personalização.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (4) Seção "O diferencial da inteligência YLADA" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
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

        {/* (5) Seção "Para quem é o YLADA" */}
        <section id="solucoes" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Para quem é o YLADA
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👤</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Profissionais que dependem de conversa para gerar clientes</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Nutricionistas, consultores, coaches, especialistas e profissionais liberais.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👥</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Times de campo e vendas descentralizadas</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Equipes que precisam gerar contatos mais qualificados e aumentar performance sem pressão excessiva.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Negócios baseados em relacionamento</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Projetos e empresas que crescem a partir de confiança, diálogo e autoridade.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/c" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Organizações que desejam escalar geração de contatos</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Com inteligência, clareza de dados e processos bem definidos.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* (6) Seção "Filosofia YLADA" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">
                Filosofia YLADA
              </h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed">
                  YLADA significa <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span>.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Acreditamos que tecnologia só faz sentido quando melhora a conversa, fortalece o relacionamento e orienta decisões melhores no campo.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Por isso, criamos soluções que transformam dados em clareza, interações em oportunidades e conversas em resultados reais, com inteligência, humanidade e propósito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (7) Seção CTA final — Fale com a gente (com formulário de coleta) */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
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
            <p className="text-gray-500 text-xs text-center">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
