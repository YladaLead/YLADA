'use client'

import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'

/** Áreas disponíveis para cadastro (sem ylada — matriz não é área pública). */
const AREAS_CADASTRO: { value: string; label: string }[] = [
  { value: 'estetica', label: 'Estética' },
  { value: 'nutri', label: 'Nutricionista' },
  { value: 'coach', label: 'Coach' },
  { value: 'med', label: 'Médicos' },
  { value: 'psi', label: 'Psicologia' },
  { value: 'odonto', label: 'Odontologia' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'perfumaria', label: 'Perfumaria' },
  { value: 'seller', label: 'Vendedores' },
  { value: 'nutra', label: 'Nutra' },
]

/**
 * Página de cadastro: obriga escolha de área (Estética, Nutri, Coach, etc.).
 * A área ylada (matriz) não é oferecida — objetivo é servir profissionais por área.
 */
export default function CadastroPage() {
  const [areaEscolhida, setAreaEscolhida] = useState<string | null>(null)

  if (areaEscolhida) {
    return (
      <LoginForm
        perfil={areaEscolhida as any}
        redirectPath="/pt/onboarding"
        initialSignUpMode={true}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Criar conta</h1>
        <p className="text-sm text-gray-600 mb-6">Escolha sua área de atuação para continuar.</p>
        <ul className="space-y-2">
          {AREAS_CADASTRO.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => setAreaEscolhida(value)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-gray-800 font-medium transition-colors"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-500">
          Você usará o painel e as ferramentas da YLADA para a área escolhida.
        </p>
      </div>
    </div>
  )
}
