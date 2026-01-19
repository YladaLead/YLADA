'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { COUNTRIES, getCountryByCode } from '@/components/CountrySelector'

interface Presidente {
  id: string
  nome_completo: string
}

export default function TrialPublicPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    loginUrl?: string | null
    email?: string
    nome?: string
  } | null>(null)
  const [presidentes, setPresidentes] = useState<Presidente[]>([])
  const [loadingPresidentes, setLoadingPresidentes] = useState(true)
  const [formData, setFormData] = useState({
    nome_presidente: '', // ID do presidente selecionado ou 'outro'
    nome_presidente_outro: '', // Nome digitado quando seleciona "Outro"
    email: '',
    nome_completo: '',
    countryCode: 'BR', // Código do país (padrão Brasil)
    whatsapp: '',
    password: '',
    confirm_password: '',
  })

  const isOutroSelecionado = formData.nome_presidente === 'outro'
  const temPresidente = formData.nome_presidente && formData.nome_presidente !== ''

  // Obter código telefônico do país selecionado
  const selectedCountry = getCountryByCode(formData.countryCode)
  const phoneCode = selectedCountry?.phoneCode || '55'

  const whatsappGroupInviteUrl = (
    process.env.NEXT_PUBLIC_WELLNESS_WHATSAPP_GROUP_INVITE_URL ||
    'https://chat.whatsapp.com/G5qbyl5Ks2E3QebmYDu0mP'
  ).trim()

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
    setSuccess(null)

    // Validações
    if (!formData.nome_presidente) {
      setError('Selecione o presidente')
      setLoading(false)
      return
    }

    // Se selecionou "Outro", validar nome digitado
    if (isOutroSelecionado) {
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

    // Validar WhatsApp (número sem código do país)
    const whatsappNumber = formData.whatsapp.trim().replace(/\D/g, '') // Remove tudo que não é número
    if (!whatsappNumber || whatsappNumber.length < 8) {
      setError('WhatsApp é obrigatório (mínimo 8 dígitos)')
      setLoading(false)
      return
    }

    // Montar número completo com código do país
    const whatsappCompleto = `${phoneCode}${whatsappNumber}`

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
      const requestBody = {
        nome_presidente: temPresidente
          ? (isOutroSelecionado 
              ? formData.nome_presidente_outro.trim() 
              : formData.nome_presidente.trim())
          : null,
        email: formData.email.toLowerCase().trim(),
        nome_completo: formData.nome_completo.trim(),
        whatsapp: whatsappCompleto,
        password: formData.password,
        trial_group: temPresidente ? 'presidentes' : 'geral',
        is_outro: isOutroSelecionado,
      }
      
      console.log('📤 Enviando dados para API:', { ...requestBody, password: '***' })
      
      const response = await fetch('/api/wellness/trial/create-public-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Exibir tela de sucesso com botões (grupo WhatsApp + acesso)
        setSuccess({
          loginUrl: data.login_url || null,
          email: requestBody.email,
          nome: requestBody.nome_completo,
        })
      } else {
        // Mostrar mensagem de erro específica da API
        const errorMessage = data.error || 'Erro ao criar conta. Tente novamente.'
        setError(errorMessage)
        console.error('Erro ao criar conta:', data)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar conta. Verifique sua conexão e tente novamente.'
      setError(errorMessage)
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
            🎉 Teste Grátis por 30 Dias!
          </h1>
          <p className="text-gray-600">
            Experimente Wellness sem compromisso
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">Conta criada com sucesso!</p>
              <p>
                {success.email ? <>Seu acesso foi liberado para <strong>{success.email}</strong>.</> : 'Seu acesso foi liberado.'}
              </p>
            </div>

            {whatsappGroupInviteUrl ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">📣 Entre no Grupo do WhatsApp</p>
                <p className="text-sm text-gray-600 mb-3">
                  Entre no grupo para receber avisos, materiais e próximos passos.
                </p>
                <div className="flex gap-2">
                  <a
                    href={whatsappGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Entrar no Grupo →
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(whatsappGroupInviteUrl)
                      } catch {
                        // fallback silencioso: não bloquear a UI
                      }
                    }}
                    className="px-4 bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                    title="Copiar link do grupo"
                  >
                    📋
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                Link do grupo ainda não configurado.
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (success.loginUrl) {
                  window.location.href = success.loginUrl
                  return
                }
                router.push('/pt/wellness/login')
              }}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Acessar a plataforma agora →
            </button>

            <button
              type="button"
              onClick={() => {
                setSuccess(null)
                setError(null)
              }}
              className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Criar outra conta
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de Presidente (Obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu presidente *
            </label>
            {loadingPresidentes ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                Carregando presidentes...
              </div>
            ) : presidentes.length > 0 ? (
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
                  </div>
                )}
              </>
            ) : (
              <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700">
                Nenhum presidente disponível. Entre em contato com o suporte.
              </div>
            )}
          </div>

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
            <div className="flex items-stretch gap-2">
              {/* Seletor de País - à esquerda (DDD com bandeira + código) */}
              <div className="relative flex-shrink-0" style={{ width: '90px' }}>
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="w-full h-full px-3 py-2 pr-6 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none cursor-pointer text-sm"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} +{country.phoneCode}
                    </option>
                  ))}
                </select>
                {/* Ícone de seta */}
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Campo de Número - à direita */}
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => {
                  // Permite apenas números
                  const value = e.target.value.replace(/\D/g, '')
                  setFormData({ ...formData, whatsapp: value })
                }}
                required
                minLength={8}
                className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={formData.countryCode === 'BR' ? '11999999999' : '999999999'}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Digite o número e selecione o país
            </p>
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
        )}
      </div>
    </div>
  )
}
