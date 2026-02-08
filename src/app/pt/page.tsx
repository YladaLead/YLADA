'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { useTranslations } from '@/hooks/useTranslations'
import { INSTITUTIONAL_AREAS } from '@/config/institutional-areas'

export default function HomePage() {
  const { t } = useTranslations('pt')
  const inst = t.institutional
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: '',
    countryCode: 'BR',
  })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inst) return
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar formulário')
      setFormData({ nome: '', profissao: '', pais: '', email: '', telefone: '', countryCode: 'BR' })
      setShowSuccessModal(true)
    } catch (error: unknown) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar formulário. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!inst) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header — mobile-first: compacto, toque fácil */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm min-h-14 sm:min-h-[4.5rem] flex items-center safe-area-inset-top">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0 touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* (1) Hero — mobile-first: título e CTA em destaque */}
        <section className="py-10 sm:py-14 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {inst.hero.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed">
              {inst.hero.subtitle}
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-2xl mx-auto">
              {inst.hero.subtitle2}
            </p>
            <a
              href="#areas"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md touch-manipulation"
            >
              {inst.hero.cta}
              <span className="ml-2" aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* (2) Quem somos */}
        <section className="bg-gray-50 py-10 sm:py-14 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {inst.whoWeAre.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{inst.whoWeAre.p1}</p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mt-4">{inst.whoWeAre.p2}</p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mt-4">{inst.whoWeAre.p3}</p>
          </div>
        </section>

        {/* (3) Como funciona — grid 1 col mobile, 2 tablet, 4 desktop */}
        <section className="py-10 sm:py-14 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            {inst.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { emoji: '🎯', ...inst.howItWorks.item1 },
              { emoji: '💬', ...inst.howItWorks.item2 },
              { emoji: '📊', ...inst.howItWorks.item3 },
              { emoji: '🌍', ...inst.howItWorks.item4 },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4" aria-hidden>{item.emoji}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* (4) Diferencial IA */}
        <section className="bg-gray-50 py-10 sm:py-14 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {inst.differential.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-4 sm:mb-6 leading-relaxed">
              {inst.differential.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-left">
              {inst.differential.intro}
            </p>
          </div>
          <ul className="max-w-2xl mx-auto space-y-2 sm:space-y-3 mb-8 sm:mb-10 list-none">
            {inst.differential.list.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
            <p className="text-gray-600 leading-relaxed pt-2">{inst.differential.outro}</p>
          </ul>
          <p className="text-center text-base sm:text-lg font-semibold text-gray-800 max-w-xl mx-auto">
            {inst.differential.tagline}
          </p>
        </section>

        {/* (5) Escolha sua área — mobile-first: 1 col, depois 2, 4 */}
        <section id="areas" className="py-10 sm:py-14 lg:py-20 scroll-mt-16">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
            {inst.areas.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            {inst.areas.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {INSTITUTIONAL_AREAS.map((area) => {
              const label = inst.areas.list[area.translationKey]
              if (!label) return null
              const isReady = area.status === 'ready'
              return (
                <Link
                  key={area.id}
                  href={area.path}
                  className="block bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                        {label.title}
                      </h3>
                      <span
                        className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
                          isReady
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isReady ? inst.badges.ready : inst.badges.comingSoon}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed flex-grow">{label.description}</p>
                    <span className="text-blue-600 text-sm font-medium mt-3 inline-flex items-center">
                      {isReady ? 'Explorar' : 'Ver'}{' '}
                      <span className="ml-1" aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* (6) Filosofia */}
        <section className="bg-gray-50 py-10 sm:py-14 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {inst.philosophy.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {inst.philosophy.p1}
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {inst.philosophy.p2}
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {inst.philosophy.p3}
            </p>
          </div>
        </section>

        {/* (7) Contato */}
        <section className="py-10 sm:py-14 lg:py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
              {inst.contact.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 text-center mb-6 sm:mb-8">
              {inst.contact.subtitle}
            </p>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 sm:p-8 shadow-sm border border-gray-200">
              <div className="space-y-4">
                {[
                  { id: 'nome', label: inst.contact.labelName, value: formData.nome, key: 'nome' as const },
                  { id: 'profissao', label: inst.contact.labelProfession, value: formData.profissao, key: 'profissao' as const },
                  { id: 'pais', label: inst.contact.labelCountry, value: formData.pais, key: 'pais' as const },
                  { id: 'email', label: inst.contact.labelEmail, value: formData.email, key: 'email' as const },
                ].map(({ id, label, value, key }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                      {label}
                    </label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      id={id}
                      value={value}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {inst.contact.labelPhone}
                  </label>
                  <PhoneInputWithCountry
                    value={formData.telefone}
                    onChange={(phone, countryCode) =>
                      setFormData((prev) => ({ ...prev, telefone: phone, countryCode }))
                    }
                    defaultCountryCode={formData.countryCode}
                    className="w-full"
                    placeholder="11 99999-9999"
                  />
                  <p className="text-xs text-gray-500 mt-1">{inst.contact.phoneHint}</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {submitting ? inst.contact.submitting : inst.contact.submit}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Modal sucesso */}
        {showSuccessModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 id="success-title" className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {inst.contact.successTitle}
                </h3>
                <p className="text-gray-600 mb-6">{inst.contact.successMessage}</p>
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full min-h-[44px] bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 touch-manipulation"
                >
                  {inst.contact.successButton}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10 sm:mt-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <YLADALogo size="lg" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-4">{inst.footer.tagline}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700 touch-manipulation">
                {inst.footer.privacy}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700 touch-manipulation">
                {inst.footer.terms}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700 touch-manipulation">
                {inst.footer.cookies}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700 touch-manipulation">
                {inst.footer.refund}
              </Link>
              <span className="text-gray-400">{inst.footer.languages}</span>
            </div>
            <p className="text-gray-500 text-xs">
              {inst.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
