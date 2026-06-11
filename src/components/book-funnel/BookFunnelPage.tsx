'use client'

import { useState, useRef, useEffect } from 'react'
import { BookFunnelConfig } from '@/lib/book-funnels/types'
import YLADALogo from '@/components/YLADALogo'

interface BookFunnelPageProps {
  config: BookFunnelConfig
}

type Step = 'hero' | `q${number}` | 'result' | 'confirmation'

function formatWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('55')) return digits
  return `55${digits}`
}

export default function BookFunnelPage({ config }: BookFunnelPageProps) {
  const { hero, questions, profileMap, defaultProfileId, profiles, form, confirmation } = config

  const [step, setStep] = useState<Step>('hero')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [desafio, setDesafio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const currentQuestionIndex =
    step === 'hero' || step === 'result' || step === 'confirmation'
      ? -1
      : parseInt((step as string).replace('q', '')) - 1

  const totalQuestions = questions.length
  const progress =
    step === 'hero'
      ? 0
      : step === 'result' || step === 'confirmation'
      ? 100
      : Math.round((currentQuestionIndex / totalQuestions) * 100)

  function selectAnswer(questionId: string, optionId: string) {
    const newAnswers = { ...answers, [questionId]: optionId }
    setAnswers(newAnswers)

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < questions.length) {
        setStep(`q${nextIndex + 1}`)
      } else {
        setStep('result')
      }
    }, 220)
  }

  function getProfile() {
    const key = questions.map((q) => answers[q.id] ?? '').join('-')
    const profileId = profileMap[key] ?? defaultProfileId
    return profiles.find((p) => p.id === profileId) ?? profiles[0]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const digits = whatsapp.replace(/\D/g, '')
    if (!nome.trim() || digits.length < 10) {
      setError('Preencha nome e WhatsApp com DDD.')
      return
    }

    setSubmitting(true)
    try {
      const profile = getProfile()
      const res = await fetch('/api/book-funnel/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: config.slug,
          nome: nome.trim(),
          whatsapp: formatWhatsApp(digits),
          perfil: profile.id,
          respostas: answers,
          desafio: desafio.trim(),
        }),
      })

      if (!res.ok) throw new Error('Erro ao salvar')
      setStep('confirmation')
    } catch {
      setError('Algo deu errado. Tente de novo.')
    } finally {
      setSubmitting(false)
    }
  }

  const profile = step === 'result' || step === 'confirmation' ? getProfile() : null

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo */}
      <header className="flex justify-center pt-8 pb-4">
        <YLADALogo size="sm" variant="horizontal" />
      </header>

      {/* Barra de progresso */}
      {step !== 'hero' && step !== 'confirmation' && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* HERO */}
          {step === 'hero' && (
            <div className="text-center space-y-6">
              <div className="inline-block bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-xs text-blue-700 font-medium tracking-wide uppercase">
                Leitor do livro
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {hero.bookTitle}
                </h1>
                <p className="text-sm text-gray-400 italic">{hero.bookSubtitle}</p>
              </div>
              <div className="w-10 h-px bg-gray-300 mx-auto" />
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-3 leading-snug">
                  {hero.headline}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {hero.subheadline}
                </p>
              </div>
              <button
                onClick={() => setStep('q1')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors"
              >
                {hero.ctaLabel}
              </button>
              <p className="text-xs text-gray-400">Leva menos de 1 minuto.</p>
            </div>
          )}

          {/* PERGUNTAS */}
          {step !== 'hero' && step !== 'result' && step !== 'confirmation' && (() => {
            const q = questions[currentQuestionIndex]
            if (!q) return null
            return (
              <div className="space-y-6">
                <div className="text-xs text-gray-400 font-medium">
                  {currentQuestionIndex + 1} de {totalQuestions}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 leading-snug">
                  {q.text}
                </h2>
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectAnswer(q.id, opt.id)}
                        className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => setStep(`q${currentQuestionIndex}`)}
                    className="text-xs text-gray-400 underline"
                  >
                    ← Voltar
                  </button>
                )}
              </div>
            )
          })()}

          {/* RESULTADO + FORMULÁRIO */}
          {step === 'result' && profile && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-3">
                  Seu diagnóstico
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4 italic">{profile.subtitle}</p>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.body}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  {form.intro}
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder={form.namePlaceholder}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={form.whatsappPlaceholder}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    required
                  />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {form.challengeLabel}
                    </label>
                    <textarea
                      placeholder={form.challengePlaceholder}
                      value={desafio}
                      onChange={(e) => setDesafio(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl text-sm transition-colors"
                  >
                    {submitting ? 'Enviando...' : form.submitLabel}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Sem spam. Só uma conversa.
                </p>
              </div>
            </div>
          )}

          {/* CONFIRMAÇÃO */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {confirmation.headline}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                  {confirmation.body}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-400 text-left">
                <p className="font-medium text-gray-600 mb-1">Andre Faula</p>
                <p>Fundador do Ylada · 30 anos de campo</p>
                <p>ylada.com</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-300">
        © {new Date().getFullYear()} Ylada · Portal Solutions Tech & Innovation Ltda
      </footer>
    </div>
  )
}
