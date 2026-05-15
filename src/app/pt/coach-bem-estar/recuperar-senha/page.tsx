'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LOGIN = '/pt/coach-bem-estar/login'

export default function CoachBemEstarRecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!email) {
      setError('Por favor, informe seu email')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Erro ao enviar email de recuperação')
      }
    } catch {
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png"
              alt="YLADA — Coach de bem-estar"
              width={280}
              height={84}
              className="bg-transparent object-contain h-14 sm:h-16 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recuperar senha</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Área <strong>Coach de bem-estar</strong> — informe seu e-mail para receber o link de redefinição.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-2">✓ E-mail enviado</p>
              <p>
                Se <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir a senha.
                Verifique caixa de entrada e spam.
              </p>
            </div>
            <Link
              href={LOGIN}
              className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="seu@email.com"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Enviando…' : 'Enviar link'}
            </button>
            <p className="text-center text-sm text-gray-600">
              <Link href={LOGIN} className="text-blue-600 hover:text-blue-800 font-medium">
                Voltar ao login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
