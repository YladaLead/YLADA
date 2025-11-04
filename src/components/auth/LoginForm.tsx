'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'

const supabase = createClient()

interface LoginFormProps {
  perfil: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
  redirectPath: string
  logoColor?: 'azul-claro' | 'verde' | 'laranja' | 'roxo'
  logoPath?: string
}

export default function LoginForm({ 
  perfil, 
  redirectPath,
  logoColor = 'azul-claro',
  logoPath
}: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')

  const perfilLabels = {
    nutri: 'Nutricionista',
    wellness: 'Consultor Wellness',
    coach: 'Coach',
    nutra: 'Consultor Nutra',
    admin: 'Administrador'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Criar novo usuário
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              perfil,
              full_name: name
            }
          }
        })

        if (signUpError) throw signUpError

        if (data.user) {
          // Verificar se precisa confirmar email
          if (!data.session) {
            setError('Verifique seu email para confirmar a conta antes de fazer login.')
            setIsSignUp(false)
          } else {
            router.push(redirectPath)
          }
        }
      } else {
        // Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) throw signInError

        if (data.session) {
          router.push(redirectPath)
          router.refresh()
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const logoSrc = logoPath || (perfil === 'wellness' 
    ? '/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png'
    : '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src={logoSrc}
              alt="YLADA Logo"
              width={280}
              height={84}
              className="bg-transparent object-contain h-16 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Criar conta' : 'Bem-vindo'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? `Cadastre-se como ${perfilLabels[perfil]}`
              : `Entre na sua conta de ${perfilLabels[perfil]}`
            }
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              perfil === 'wellness'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
          >
            {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        {/* Toggle entre Login e Sign Up */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isSignUp 
              ? 'Já tem uma conta? Fazer login' 
              : 'Não tem uma conta? Criar conta'}
          </button>
        </div>
      </div>
    </div>
  )
}

