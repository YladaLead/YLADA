'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Presidente {
  id: string
  nome_completo: string
}

export default function TrialPresidentesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [presidentes, setPresidentes] = useState<Presidente[]>([])
  const [loadingPresidentes, setLoadingPresidentes] = useState(true)
  const [formData, setFormData] = useState({
    nome_presidente: '', // ID do presidente selecionado ou 'outro'
    nome_presidente_outro: '', // Nome digitado quando seleciona "Outro"
    email: '',
    nome_completo: '',
    whatsapp: '',
    password: '',
    confirm_password: '',
  })

  const isOutroSelecionado = formData.nome_presidente === 'outro'

  // Carregar lista de presidentes
  useEffect(() => {
    const carregarPresidentes = async () => {
      try {
        const response = await fetch('/api/wellness/trial/presidentes-list')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setPresidentes(data.presidentes || [])
          }
        }
      } catch (err) {
        console.error('Erro ao carregar presidentes:', err)
      } finally {
        setLoadingPresidentes(false)
      }
    }

    carregarPresidentes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validações
    if (!formData.nome_presidente) {
      setError('Selecione o presidente')
      setLoading(false)
      return
    }

    // Se selecionou "Outro", validar nome digitado
    if (formData.nome_presidente === 'outro') {
      if (!formData.nome_presidente_outro || formData.nome_presidente_outro.trim().length < 3) {
        setError('Digite o nome do presidente (mínimo 3 caracteres)')
        setLoading(false)
        return
      }
    }

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
          nome_presidente: isOutroSelecionado 
            ? formData.nome_presidente_outro.trim() // Nome digitado quando "Outro"
            : formData.nome_presidente.trim(), // ID do presidente selecionado
          email: formData.email.toLowerCase().trim(),
          nome_completo: formData.nome_completo.trim(),
          whatsapp: formData.whatsapp.trim(),
          password: formData.password,
          trial_group: 'presidentes', // Ambiente específico para presidentes
          is_outro: isOutroSelecionado, // Flag para indicar que é "Outro"
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirecionar para login ou área Wellness
        if (data.login_url) {
          window.location.href = data.login_url
        } else {
          // Redirecionar para login sem parâmetro trial para evitar redirecionamento automático
          router.push('/pt/wellness/login')
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
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trial Exclusivo para Presidentes
          </h1>
          <p className="text-gray-600">
            Ambiente exclusivo para Presidentes da Herbalife
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecione seu presidente *
            </label>
            {loadingPresidentes ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                Carregando presidentes...
              </div>
            ) : presidentes.length === 0 ? (
              <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700">
                Nenhum presidente disponível. Entre em contato com o suporte.
              </div>
            ) : (
              <>
                <select
                  value={formData.nome_presidente}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    nome_presidente: e.target.value,
                    nome_presidente_outro: '' // Limpar campo "outro" ao mudar seleção
                  })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione seu presidente</option>
                  {presidentes.map((presidente) => (
                    <option key={presidente.id} value={presidente.id}>
                      {presidente.nome_completo}
                    </option>
                  ))}
                  <option value="outro">Outro</option>
                </select>
                
                {isOutroSelecionado && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Digite o nome do seu presidente *
                    </label>
                    <input
                      type="text"
                      value={formData.nome_presidente_outro}
                      onChange={(e) => setFormData({ ...formData, nome_presidente_outro: e.target.value })}
                      required={isOutroSelecionado}
                      minLength={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Nome do seu presidente"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Digite o nome completo do seu presidente
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome Completo *
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
