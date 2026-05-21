'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * DeleteAccountSection — Seção de exclusão de conta (obrigatória Apple App Store)
 *
 * Uso: adicionar na página de perfil de CADA vertical.
 * O prop `redirectTo` define para onde redirecionar após a exclusão
 * (normalmente a tela de login da vertical).
 */
interface DeleteAccountSectionProps {
  redirectTo?: string
}

export function DeleteAccountSection({ redirectTo = '/entrar' }: DeleteAccountSectionProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState<'idle' | 'confirm' | 'deleting' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleDelete() {
    setStep('deleting')
    setError('')

    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir conta.')
      }

      // Sign out local session
      await supabase.auth.signOut()
      setStep('done')

      // Redirecionar após 2s
      setTimeout(() => router.push(redirectTo), 2000)
    } catch (err: any) {
      setError(err.message || 'Erro inesperado. Tente novamente.')
      setStep('error')
    }
  }

  if (step === 'done') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-center space-y-2">
        <p className="text-sm font-semibold text-gray-700">Conta excluída</p>
        <p className="text-xs text-gray-500">Seus dados foram removidos. Redirecionando…</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-red-100 bg-white p-5 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-red-700">Excluir minha conta</h3>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          Esta ação é permanente e irreversível. Todos os seus dados, histórico e configurações
          serão removidos definitivamente.
        </p>
      </div>

      {step === 'idle' && (
        <button
          onClick={() => setStep('confirm')}
          className="text-xs font-semibold text-red-600 underline hover:text-red-800 transition-colors"
        >
          Solicitar exclusão da conta
        </button>
      )}

      {step === 'confirm' && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-800">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Sim, excluir minha conta
            </button>
            <button
              onClick={() => setStep('idle')}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {step === 'deleting' && (
        <p className="text-xs text-gray-500">Excluindo sua conta…</p>
      )}

      {step === 'error' && (
        <div className="space-y-2">
          <p className="text-xs text-red-500">{error}</p>
          <button
            onClick={() => setStep('idle')}
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
