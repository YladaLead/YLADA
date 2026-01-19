'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrialPublicPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    nome_completo: '',
    whatsapp: '',
    password: '',
    confirm_password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validações
    if (!formData.email || !formData.email.includes('@')) {
      setError('Email é obrigatório e deve ser válido')
      setLoading(false)
      return
    }

    if (!formData.nome_completo || formData.nome_completo.length < 3) {
      setError('Nome completo é obrigatório (mínimo 3 caracteres)')
      setLoading(false)
      return
    }

    if (!formData.whatsapp || formData.whatsapp.length < 10) {
      setError('WhatsApp é obrigatório (mínimo 10 caracteres)')
      setLoading(false)
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirm_password) {
      setError('Senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/wellness/trial/create-public-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          nome_completo: formData.nome_completo.trim(),
          whatsapp: formData.whatsapp.trim(),
          password: formData.password,
          trial_group: 'geral', // Pode ser 'presidentes' ou 'geral'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirecionar para login ou área Wellness
        if (data.login_url) {
          window.location.href = data.login_url
        } else {
          router.push('/pt/wellness/login?trial=success')
        }
      } else {
        setError(data.error || 'Erro ao criar conta. Tente novamente.')
      }
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.')
      console.error('Erro ao criar conta:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Teste Grátis por 3 Dias!
          </h1>
          <p className="text-gray-600">
            Experimente o YLADA Wellness sem compromisso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              required
              minLength={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp *
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              required
              minLength={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="11999999999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crie sua senha *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirme sua senha *
            </label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Digite a senha novamente"
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
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Começar Trial Grátis'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Ao criar a conta, você concorda com nossos termos de uso.
            Seu trial de 3 dias começa imediatamente após a criação.
          </p>
        </form>
      </div>
    </div>
  )
}
