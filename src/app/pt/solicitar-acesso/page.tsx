'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { useTranslations } from '@/hooks/useTranslations'

const VALID_AREAS = ['profissional-liberal', 'vendedores-geral', 'psi', 'psicanalise', 'odonto', 'coach']

function SolicitarAcessoContent() {
  const { t } = useTranslations('pt')
  const inst = t.institutional
  const searchParams = useSearchParams()
  const areaParam = searchParams.get('area') || ''

  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const pre = searchParams.get('profissao')
    if (pre && pre.trim()) {
      setFormData((prev) => (prev.profissao ? prev : { ...prev, profissao: pre.trim() }))
    }
  }, [searchParams])
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const areaInteresse = VALID_AREAS.includes(areaParam) ? areaParam : 'profissional-liberal'
  const areaLabel = inst?.areas.list[areaInteresse as keyof typeof inst.areas.list]?.title || areaInteresse

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inst) return
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/area-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          area_interesse: areaInteresse,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar')
      setFormData({ nome: '', profissao: '', pais: '', email: '' })
      setShowSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.')
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

  const ar = inst.areaRequest

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt#areas" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar às áreas
          </Link>
        </div>
      </header>

      <main className="w-full max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            Em breve
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {ar.title}: {areaLabel}
          </h1>
          <p className="text-gray-600">{ar.subtitle}</p>
        </div>

        {showSuccess ? (
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{ar.successTitle}</h2>
            <p className="text-gray-600 mb-6">{ar.successMessage}</p>
            <Link
              href="/pt#areas"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              {ar.successButton}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 sm:p-8 shadow-sm border border-gray-200">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              {[
                { id: 'nome', label: ar.labelName, value: formData.nome, key: 'nome' as const },
                { id: 'profissao', label: ar.labelProfession, value: formData.profissao, key: 'profissao' as const },
                { id: 'pais', label: ar.labelCountry, value: formData.pais, key: 'pais' as const },
                { id: 'email', label: ar.labelEmail, value: formData.email, key: 'email' as const },
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
                    required={key === 'nome' || key === 'email'}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? ar.submitting : ar.submit}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default function SolicitarAcessoScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <SolicitarAcessoContent />
    </Suspense>
  )
}
