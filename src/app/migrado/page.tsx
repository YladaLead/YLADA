'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function MigradoPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Verificar se o email está na lista de usuários migrados
      const response = await fetch('/api/migrado/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao verificar email')
        return
      }

      if (!data.isMigrado) {
        setError('Este email não está na lista de usuários migrados. Verifique se digitou corretamente ou entre em contato conosco.')
        return
      }

      // Gerar token de acesso temporário
      const tokenResponse = await fetch('/api/migrado/gerar-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          area: data.area
        })
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        setError(tokenData.error || 'Erro ao gerar token de acesso')
        return
      }

      // Redirecionar para página de acesso com token
      router.push(`/pt/${data.area}/acesso?token=${tokenData.token}&redirect=/pt/${data.area}/bem-vindo?migrado=true`)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <Image
                src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                alt="YLADA"
                width={200}
                height={70}
                className="h-16 mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Acesso para Usuários Migrados
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Digite seu email para acessar e completar seu cadastro
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleAccess} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Acessar e Completar Cadastro'}
            </button>
          </form>

          {/* Informações */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Se você foi migrado do sistema anterior, digite seu email acima para acessar.
              <br />
              Você será redirecionado para completar seu cadastro.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

