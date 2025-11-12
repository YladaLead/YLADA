'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

const supabase = createClient()

function AdminSubscriptionsContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Formulário para criar plano gratuito
  const [freePlanForm, setFreePlanForm] = useState({
    user_id: '',
    area: 'wellness' as 'wellness' | 'nutri' | 'coach' | 'nutra',
    expires_in_days: 365
  })

  // Formulário para migrar assinatura
  const [migrateForm, setMigrateForm] = useState({
    user_id: '',
    email: '',
    name: '',
    area: 'wellness' as 'wellness' | 'nutri' | 'coach' | 'nutra',
    plan_type: 'monthly' as 'monthly' | 'annual' | 'free',
    expires_at: '',
    migrated_from: ''
  })

  // Formulário para importação em massa
  const [importData, setImportData] = useState('')
  const [importResults, setImportResults] = useState<any>(null)


  const handleCreateFreePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch('/api/admin/subscriptions/free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(freePlanForm)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar plano gratuito')
        return
      }

      setSuccess(`Plano gratuito criado com sucesso! Válido por ${freePlanForm.expires_in_days} dias.`)
      setFreePlanForm({
        user_id: '',
        area: 'wellness',
        expires_in_days: 365
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao criar plano gratuito')
    } finally {
      setLoading(false)
    }
  }

  const handleMigrateSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validar que pelo menos email ou user_id foi fornecido
    if (!migrateForm.email && !migrateForm.user_id) {
      setError('Preencha o email OU o User ID')
      setLoading(false)
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Preparar body (remover campos vazios)
      const body: any = {
        area: migrateForm.area,
        plan_type: migrateForm.plan_type,
        expires_at: migrateForm.expires_at,
        migrated_from: migrateForm.migrated_from
      }

      if (migrateForm.email) {
        body.email = migrateForm.email
        if (migrateForm.name) {
          body.name = migrateForm.name
        }
      } else {
        body.user_id = migrateForm.user_id
      }

      const response = await fetch('/api/admin/subscriptions/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao migrar assinatura')
        return
      }

      setSuccess('Assinatura migrada com sucesso! Usuário receberá notificações antes do vencimento.')
      setMigrateForm({
        user_id: '',
        email: '',
        name: '',
        area: 'wellness',
        plan_type: 'monthly',
        expires_at: '',
        migrated_from: ''
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao migrar assinatura')
    } finally {
      setLoading(false)
    }
  }

  const handleImportSubscriptions = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setImportResults(null)

    try {
      let subscriptions
      try {
        subscriptions = JSON.parse(importData)
      } catch {
        setError('JSON inválido. Verifique a formatação.')
        return
      }

      if (!Array.isArray(subscriptions)) {
        setError('Dados devem ser um array de assinaturas')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch('/api/admin/subscriptions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ subscriptions })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao importar assinaturas')
        return
      }

      setImportResults(data.results)
      setSuccess(`Importação concluída! ${data.summary.success} sucesso, ${data.summary.errors} erros.`)
      setImportData('')
    } catch (err: any) {
      setError(err.message || 'Erro ao importar assinaturas')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotifications = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch('/api/admin/subscriptions/send-renewal-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ days_ahead: 30 })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar notificações')
        return
      }

      setSuccess(`Notificações enviadas! ${data.results.sent} emails enviados, ${data.results.failed} falharam.`)
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar notificações')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Assinaturas</h1>
                <p className="text-sm text-gray-600">Planos gratuitos, migrações e notificações</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Resultados da importação */}
        {importResults && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Resultados da Importação:</h3>
            <p className="text-sm mb-2">
              <strong>Sucesso:</strong> {importResults.success.length} | 
              <strong> Erros:</strong> {importResults.errors.length}
            </p>
            {importResults.errors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">Ver erros</summary>
                <ul className="mt-2 text-sm space-y-1">
                  {importResults.errors.map((err: any, idx: number) => (
                    <li key={idx} className="text-red-600">
                      {err.email}: {err.error}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Criar Plano Gratuito */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">🎁 Criar Plano Gratuito</h2>
            <form onSubmit={handleCreateFreePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID (UUID)
                </label>
                <input
                  type="text"
                  value={freePlanForm.user_id}
                  onChange={(e) => setFreePlanForm({ ...freePlanForm, user_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="uuid-do-usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  value={freePlanForm.area}
                  onChange={(e) => setFreePlanForm({ ...freePlanForm, area: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="wellness">Wellness</option>
                  <option value="nutri">Nutri</option>
                  <option value="coach">Coach</option>
                  <option value="nutra">Nutra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válido por (dias)
                </label>
                <input
                  type="number"
                  value={freePlanForm.expires_in_days}
                  onChange={(e) => setFreePlanForm({ ...freePlanForm, expires_in_days: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Plano Gratuito'}
              </button>
            </form>
          </div>

          {/* Migrar Assinatura */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">🔄 Migrar Assinatura Individual</h2>
            <p className="text-xs text-gray-500 mb-4">
              Use <strong>email</strong> para criar usuário automaticamente, ou <strong>User ID</strong> se o usuário já existir.
            </p>
            <form onSubmit={handleMigrateSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (recomendado) ou User ID (UUID)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={migrateForm.email}
                    onChange={(e) => {
                      setMigrateForm({ ...migrateForm, email: e.target.value, user_id: '' })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@exemplo.com"
                  />
                  <input
                    type="text"
                    value={migrateForm.user_id}
                    onChange={(e) => {
                      setMigrateForm({ ...migrateForm, user_id: e.target.value, email: '' })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="UUID (se já existir)"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {migrateForm.email ? '✅ Usando email (usuário será criado se não existir)' : migrateForm.user_id ? '✅ Usando User ID' : '⚠️ Preencha email OU User ID'}
                </p>
              </div>
              {migrateForm.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo (opcional, usado se criar novo usuário)
                  </label>
                  <input
                    type="text"
                    value={migrateForm.name}
                    onChange={(e) => setMigrateForm({ ...migrateForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do usuário"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área
                  </label>
                  <select
                    value={migrateForm.area}
                    onChange={(e) => setMigrateForm({ ...migrateForm, area: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="wellness">Wellness</option>
                    <option value="nutri">Nutri</option>
                    <option value="coach">Coach</option>
                    <option value="nutra">Nutra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={migrateForm.plan_type}
                    onChange={(e) => setMigrateForm({ ...migrateForm, plan_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="annual">Anual</option>
                    <option value="free">Gratuito</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento (ISO)
                </label>
                <input
                  type="datetime-local"
                  value={migrateForm.expires_at}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    setMigrateForm({ ...migrateForm, expires_at: date.toISOString() })
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Migrado de (nome do app)
                </label>
                <input
                  type="text"
                  value={migrateForm.migrated_from}
                  onChange={(e) => setMigrateForm({ ...migrateForm, migrated_from: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="App Anterior"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Migrando...' : 'Migrar Assinatura'}
              </button>
            </form>
          </div>
        </div>

        {/* Importação em Massa */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📦 Importação em Massa</h2>
          
          {/* Botão para carregar JSON pré-configurado */}
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <button
              type="button"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  
                  const response = await fetch('/api/admin/subscriptions/migration-data', {
                    credentials: 'include'
                  })

                  if (!response.ok) {
                    throw new Error('Erro ao carregar JSON')
                  }

                  const data = await response.json()

                  if (data.success && data.data) {
                    setImportData(JSON.stringify(data.data, null, 2))
                    setSuccess(`✅ JSON carregado com sucesso! ${data.count} usuários prontos para importação.`)
                    setError(null)
                  } else {
                    throw new Error('Formato de dados inválido')
                  }
                } catch (err: any) {
                  console.error('Erro ao carregar JSON:', err)
                  setError('Erro ao carregar JSON: ' + err.message)
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : '📥 Carregar JSON de Migração (34 usuários)'}
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Clique para carregar automaticamente o JSON com os 34 usuários preparados para importação (25 mensais, 1 anual, 8 gratuitos).
            </p>
          </div>

          <form onSubmit={handleImportSubscriptions} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JSON de Assinaturas
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                required
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder={`[\n  {\n    "email": "usuario@example.com",\n    "name": "Nome Completo",\n    "area": "wellness",\n    "plan_type": "monthly",\n    "expires_at": "2025-12-31T23:59:59Z",\n    "migrated_from": "herbalead"\n  }\n]`}
              />
              {importData && (
                <p className="mt-1 text-xs text-gray-500">
                  {(() => {
                    try {
                      const parsed = JSON.parse(importData)
                      return Array.isArray(parsed) ? `${parsed.length} usuário(s) no JSON` : 'JSON inválido (deve ser um array)'
                    } catch {
                      return 'JSON inválido'
                    }
                  })()}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Formato: Array JSON com email, name, area, plan_type (monthly/annual/free), expires_at (ISO), migrated_from
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !importData.trim()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importando...' : 'Importar Assinaturas'}
            </button>
          </form>
        </div>

        {/* Enviar Notificações de Renovação */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📧 Enviar Notificações de Renovação</h2>
          <p className="text-sm text-gray-600 mb-4">
            Envia emails para assinaturas migradas que estão próximas do vencimento (7, 3 e 1 dia antes).
          </p>
          <button
            onClick={handleSendNotifications}
            disabled={loading}
            className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Notificações Agora'}
          </button>
        </div>

        {/* Link de Acesso para Migrados */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔗 Acesso para Usuários Migrados</h2>
          <p className="text-sm text-gray-600 mb-4">
            Compartilhe este link com os usuários migrados. Eles precisarão apenas digitar o email para acessar e completar o cadastro.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Link de Acesso:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : 'https://www.ylada.com'}/migrado`}
                className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => {
                  const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.ylada.com'}/migrado`
                  navigator.clipboard.writeText(link)
                  setSuccess('Link copiado para a área de transferência!')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Copiar
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Envie este link pelo WhatsApp. O usuário digita apenas o email e já acessa para completar o cadastro.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AdminSubscriptionsPage() {
  return (
    <AdminProtectedRoute>
      <AdminSubscriptionsContent />
    </AdminProtectedRoute>
  )
}

