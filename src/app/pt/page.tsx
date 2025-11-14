'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: ''
  })
  const [submitting, setSubmitting] = useState(false)

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

      alert('Obrigado pelo interesse! Entraremos em contato em breve.')
      setFormData({ nome: '', profissao: '', pais: '', email: '', telefone: '' })
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
            <YLADALogo size="sm" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* (1) Hero Section - Abertura elegante */}
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              <span className="whitespace-nowrap">Conectando pessoas ao</span>{' '}
              <span className="whitespace-nowrap">bem-estar, através de</span>{' '}
              <span className="whitespace-nowrap">inteligência digital.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              O Ylada ajuda profissionais da saúde, bem-estar e performance a criar experiências inteligentes, gerar conexões reais e transformar atendimentos em relacionamentos.
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
                O YLADA nasceu da ideia de que cada profissional pode ter seu próprio sistema inteligente de relacionamento.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Criamos ferramentas, automações e inteligência orientada por dados para que nutricionistas, coaches, consultores e distribuidores se conectem com clientes e equipes de forma simples, humana e personalizada.
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
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inteligência de Leads</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Crie ferramentas e quizzes inteligentes que atraem pessoas interessadas.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comunicação Integrada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Automatize o relacionamento e mantenha o contato ativo.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Acompanhamento e Resultados</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Veja em tempo real quem está interagindo com seus links e avaliações.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expansão Global</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Suporte em 3 idiomas: português, espanhol e inglês.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (4) Seção "Para quem é o Ylada" */}
        <section id="solucoes" className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Para quem é o Ylada
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🥗</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Nutricionistas</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que desejam gerar avaliações inteligentes e captar pacientes certos.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">💊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Consultores Nutracêuticos</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que querem mostrar produtos com base em diagnósticos e resultados.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Coaches de Bem-Estar</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que buscam inspirar pessoas com ferramentas e desafios interativos.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/pt/coach" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🧘</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Distribuidores de Bem-Estar</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que desejam expandir sua rede de forma organizada e digital.
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

        {/* (5) Seção "Filosofia Ylada" */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">
                Filosofia Ylada
              </h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed">
                  YLADA significa <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span> — a filosofia que une inteligência, experiência humana e propósito.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Acreditamos que tecnologia só faz sentido quando aproxima pessoas.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Por isso, criamos ferramentas que transformam atendimento em relacionamento, dados em clareza e conexões em resultados reais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (6) Seção "Entre em contato" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                Entre em contato
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Quer conhecer mais sobre o Ylada?
                Preencha o formulário e entraremos em contato quando novas funcionalidades forem lançadas.
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
                    <input
                      type="tel"
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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
      </main>

      {/* (7) Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="md" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-center">
              YLADA — Your Leading Advanced Data Assistant
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm text-gray-500">
              <Link href="#" className="hover:text-gray-700">Sobre</Link>
              <span>•</span>
              <Link href="#" className="hover:text-gray-700">Termos</Link>
              <span>•</span>
              <Link href="#" className="hover:text-gray-700">Política</Link>
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
