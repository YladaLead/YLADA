'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

const PROXIMA_AULA = 'Quarta-feira, 11 de fevereiro às 19h30'
const VALOR = 37

export default function AgendaCheiaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    countryCode: 'BR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canceled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('canceled') === 'true'
    if (canceled) setError('Pagamento cancelado. Você pode tentar novamente quando quiser.')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!formData.nome?.trim() || !formData.email?.trim() || !formData.telefone?.trim()) {
      setError('Preencha nome, e-mail e WhatsApp.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/nutri/aula-paga/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          telefone: formData.telefone.replace(/\D/g, ''),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao gerar pagamento. Tente novamente.')
        setSubmitting(false)
        return
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }
      setError('Resposta inválida. Tente novamente.')
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      <main id="top">
        <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                <div className="w-full">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="inline-block bg-amber-400 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      🎓 AULA AO VIVO
                    </div>
                    <div className="inline-block bg-white text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      R$ {VALOR}
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight text-white drop-shadow-sm">
                    Como ter novos pacientes chegando todos os dias e parar de ter agenda ociosa
                  </h1>

                  <p className="text-lg text-white/95 mb-4 leading-relaxed font-semibold drop-shadow-sm">
                    É sobre ter <strong className="font-black">conversas previsíveis com as pessoas certas</strong>. Valor gera conversa. Conversa gera agenda.
                  </p>

                  <div className="bg-white rounded-xl p-5 mb-4 border-2 border-blue-200 shadow-xl">
                    <h2 className="text-base font-black text-gray-900 mb-3">
                      Nesta aula você leva:
                    </h2>
                    <ul className="space-y-2 text-gray-800 text-sm sm:text-base font-medium">
                      <li>• Entenda como se posicionar pra que as pessoas se interessem pelo seu conteúdo</li>
                      <li>• Entenda os tipos de públicos e qual é o seu potencial</li>
                      <li>• Entenda níveis de comunicação e como se comportar na rotina</li>
                    </ul>
                  </div>

                  <p className="text-white font-bold">
                    📅 {PROXIMA_AULA}
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 border-4 border-amber-400 w-full lg:sticky lg:top-24">
                  <div className="text-center mb-5">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                      Inscrever-se na aula
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {PROXIMA_AULA} · R$ {VALOR}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp (com DDD) <span className="text-red-600">*</span>
                      </label>
                      <PhoneInputWithCountry
                        value={formData.telefone}
                        onChange={(phone, countryCode) => {
                          setFormData({ ...formData, telefone: phone, countryCode: countryCode || 'BR' })
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg font-black text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {submitting ? 'Redirecionando ao pagamento...' : `Inscrever-me na aula – R$ ${VALOR}`}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                      Pagamento seguro. Link da aula por e-mail e WhatsApp.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <Image
                  src="/images/andre-faula.jpg"
                  alt="Andre Faula"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Andre Faula</h3>
                <p className="text-gray-600 text-sm">
                  Método para gerar contatos, organizar rotina e preencher agenda. Parar de improvisar e adotar um método profissional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/pt/nutri">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 mx-auto mb-4 opacity-90"
              />
            </Link>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-500 text-xs">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
