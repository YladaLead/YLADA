'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    country: '',
    email: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! We will contact you soon.')
    setFormData({ name: '', profession: '', country: '', email: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-20 sm:h-24 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/en">
            <YLADALogo size="sm" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* (1) Hero Section - Elegant opening */}
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              <span className="whitespace-nowrap">Connecting people to</span>{' '}
              <span className="whitespace-nowrap">wellness, through</span>{' '}
              <span className="whitespace-nowrap">digital intelligence.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ylada helps health, wellness, and performance professionals create intelligent experiences, generate real connections, and transform services into relationships.
            </p>
            <Link 
              href="#solutions"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explore solutions
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* (2) Section "Who we are" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Who we are
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ylada was born from the idea that every professional can have their own intelligent relationship system.
                We bring together tools and automations so that nutritionists, coaches, consultants, and distributors can connect with clients and teams in a simple, fast, and personalized way.
              </p>
            </div>
          </div>
        </section>

        {/* (3) Section "How it works" */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              How it works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Intelligence</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create intelligent tools and quizzes that attract interested people.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Integrated Communication</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Automate relationships and keep contact active.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tracking and Results</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See in real-time who is interacting with your links and assessments.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Expansion</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Support in 3 languages: English, Spanish, and Portuguese.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (4) Section "Who is Ylada for" */}
        <section id="solutions" className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Who is Ylada for
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🥗</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Nutritionists</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Who want to generate intelligent assessments and capture the right patients.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/en/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explore →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">💊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Nutraceutical Consultants</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Who want to show products based on diagnostics and results.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/en/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explore →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Wellness Coaches</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Who seek to inspire people with interactive tools and challenges.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/en/coach" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explore →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🧘</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Wellness Distributors</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Who want to expand their network in an organized and digital way.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/en/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* (5) Section "Ylada Philosophy" */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">
                Ylada Philosophy
              </h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed">
                  YLADA stands for <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span> — your advanced assistant to <span className="whitespace-nowrap">generate meaningful connections.</span>
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Our mission is to bring together technology and human purpose.
                  Every Ylada tool is designed to support the professional who believes in the power of <span className="whitespace-nowrap">shared wellness.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (6) Section "Contact us" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                Contact us
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Want to learn more about Ylada?
                Fill out the form and we'll contact you when new features are launched.
              </p>
              
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
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
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Submit
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
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">Privacy Policy</Link>
              <span>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700">Terms of Use</Link>
              <span>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700">Cookies</Link>
              <span>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700">Refund</Link>
              <span>•</span>
              <span className="text-gray-400">Languages: EN / ES / PT</span>
            </div>
            <p className="text-gray-500 text-xs text-center">
              © {new Date().getFullYear()} YLADA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
