'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'
import Image from 'next/image'

const supabase = createClient()

function AdminConfigContent() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    // Validações
    if (!currentPassword) {
      setError('Por favor, informe sua senha atual')
      setLoading(false)
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (currentPassword === newPassword) {
      setError('A nova senha deve ser diferente da senha atual')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      setSuccess(true)
      setError(null)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Esconder mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err)
      setError(err.message || 'Erro ao alterar senha')
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
                  width={200}
                  height={70}
                  className="h-14 sm:h-16 w-auto"
                />
              </Link>
              <div className="h-14 sm:h-16 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Configurações
                </h1>
                <p className="text-sm text-gray-600">Gerenciar sua conta administrativa</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Segurança */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🔒 Segurança</h2>
          
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="font-semibold">Senha alterada com sucesso!</p>
                  <p className="text-sm">Sua senha foi atualizada. Use a nova senha no próximo login.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Erro ao alterar senha</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Atualizando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Atualizar Senha</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function AdminConfigPage() {
  return (
    <AdminProtectedRoute>
      <AdminConfigContent />
    </AdminProtectedRoute>
  )
}

