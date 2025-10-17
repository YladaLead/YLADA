'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, User, CreditCard, Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/supabase'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectDomain, setProjectDomain] = useState('')
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Detectar projeto pelo subdomínio
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      // Se não é localhost e tem subdomínio válido
      if (!hostname.includes('localhost') && subdomain !== 'www' && subdomain.length > 2) {
        setProjectDomain(subdomain)
      } else {
        // Fallback para desenvolvimento ou domínio principal
        setProjectDomain('herbalead')
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(formData.email, formData.password)
      router.push('/user')
    } catch (err: unknown) {
      const error = err as Error
      console.error('❌ Erro no login:', error)
      setError(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const getProjectName = () => {
    switch (projectDomain) {
      case 'herbalead': return 'Herbalead'
      case 'nutri': return 'Nutri'
      case 'beauty': return 'Beauty'
      default: return 'Herbalead'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Acessar Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Entre na sua área profissional - {getProjectName()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Project Badge */}
          {projectDomain && (
            <div className="mb-6 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                🏢 {getProjectName()}
              </span>
            </div>
          )}

          {/* Login Only */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium">
              🔐 Acesso ao Dashboard
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : 'Acessar Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Não tem uma conta?
            </p>
            
            <Link 
              href="/payment"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Criar Conta - Escolher Plano
            </Link>
            
            <p className="text-xs text-gray-500 mt-3">
              ✓ 7 dias de garantia total<br />
              ✓ Cancele quando quiser<br />
              ✓ Sem taxa de setup
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}