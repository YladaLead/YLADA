'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function HomePageEN() {
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: '',
    countryCode: 'BR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error submitting form')
      setFormData({ nome: '', profissao: '', pais: '', email: '', telefone: '', countryCode: 'BR' })
      setShowSuccessModal(true)
    } catch (err: unknown) {
      console.error('Submit error:', err)
      alert('Error submitting form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-20 sm:h-24 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/en">
            <YLADALogo size="md" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              We turn conversation into qualified contacts.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              YLADA is an engine of diagnostics, smart links, and artificial intelligence that creates, provokes, and directs strategic conversations — increasing the authority, credibility, and performance of professionals and field teams.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Before the sale. During the conversation. After the contact.
            </p>
            <Link href="#solutions" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
              Explore solutions
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Who we are</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                YLADA was born from the idea that every conversation can deliver results when there is direction, diagnosis, and intelligence behind it.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                We built an intelligent system that helps professionals and field teams attract, qualify, and connect with genuinely interested people, turning interactions into concrete opportunities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                More than technology, YLADA organizes the conversation, guides the routine, strengthens the authority of those in the field, and builds trust in every interaction.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">How it works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Capture and Diagnosis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create links, quizzes, and smart assessments that spark the right conversation, deliver immediate value, and filter the curious from the genuinely interested — before the first contact.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Guided and Intelligent Conversation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lead the dialogue with clarity and strategy. YLADA’s AI guides what to say, when to say it, and how to lead, adjusting the approach to the real context of each interaction.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Field Performance and Authority</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Track decisions, interactions, and results to increase conversion, predictability, and professional credibility, strengthening individual and team confidence in the field.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Market Scale</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use the same engine for generating contacts and conversations across different areas, countries, and business models — without losing personalization or control.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">The YLADA intelligence advantage</h2>
              <p className="text-xl text-gray-800 font-semibold mb-6 leading-relaxed">
                Artificial intelligence that provokes conversation, not blocks relationship.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed text-left">
                YLADA’s AI was not built to replace the professional or lock service into automatic replies. It acts as a strategic copilot, adjusting routine, approach, and next steps to the real context of each interaction.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3 mb-10">
              <p className="text-gray-700 leading-relaxed">Through smart diagnostics and ongoing direction, YLADA:</p>
              <ul className="text-gray-600 space-y-2 list-none">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> provokes the right conversation to start</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> directs focus to genuinely interested people</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> guides what to say, when to say it, and how to lead</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> strengthens the professional’s authority and credibility</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> raises field team performance and confidence</li>
              </ul>
              <p className="text-gray-600 leading-relaxed pt-2">
                The result: fewer curious browsers, higher-quality contacts, and conversations that naturally evolve into relationship and decision.
              </p>
            </div>
            <p className="text-center text-lg font-semibold text-gray-800 max-w-xl mx-auto">
              It’s not about answering messages.<br />It’s about provoking the right conversations.
            </p>
          </div>
        </section>

        <section id="solutions" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Who YLADA is for</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👤</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Professionals who rely on conversation to generate clients</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Nutritionists, consultants, coaches, specialists, and independent professionals.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explore →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👥</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Field and decentralized sales teams</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Teams that need to generate more qualified contacts and increase performance without excessive pressure.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explore →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Relationship-based businesses</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Projects and companies that grow from trust, dialogue, and authority.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/c" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explore →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Organizations that want to scale contact generation</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">With intelligence, data clarity, and well-defined processes.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explore →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">YLADA philosophy</h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  YLADA stands for <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span>.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  We believe technology only makes sense when it improves the conversation, strengthens the relationship, and guides better decisions in the field.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  That’s why we build solutions that turn data into clarity, interactions into opportunities, and conversations into real results — with intelligence, humanity, and purpose.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">Get in touch</h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Want to understand how YLADA can help you or your team generate more qualified contacts, more authority, and more predictability?
              </p>
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name-en" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" id="name-en" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="profession-en" className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    <input type="text" id="profession-en" value={formData.profissao} onChange={(e) => setFormData({ ...formData, profissao: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="country-en" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input type="text" id="country-en" value={formData.pais} onChange={(e) => setFormData({ ...formData, pais: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="email-en" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="email-en" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="phone-en" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <PhoneInputWithCountry value={formData.telefone} onChange={(phone, countryCode) => setFormData({ ...formData, telefone: phone, countryCode })} defaultCountryCode={formData.countryCode} className="w-full" placeholder="11 99999-9999" />
                    <p className="text-xs text-gray-500 mt-1">Select country by flag and enter number only (no area code)</p>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowSuccessModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you for your interest!</h3>
                <p className="text-gray-600 mb-6">We will be in touch soon.</p>
                <button onClick={() => setShowSuccessModal(false)} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">OK</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4"><YLADALogo size="lg" className="bg-transparent" /></div>
            <p className="text-gray-600 text-sm mb-4 text-center">YLADA: Your Leading Advanced Data Assistant</p>
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
            <p className="text-gray-500 text-xs text-center">© {new Date().getFullYear()} YLADA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
