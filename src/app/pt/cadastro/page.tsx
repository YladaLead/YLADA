'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm, { type LoginFormPerfil } from '@/components/auth/LoginForm'

/** Áreas disponíveis para cadastro (sem ylada — matriz não é área pública). */
const AREAS_CADASTRO: { value: string; label: string }[] = [
  { value: 'estetica', label: 'Estética' },
  { value: 'nutri', label: 'Nutricionista' },
  { value: 'coach', label: 'Coach' },
  { value: 'med', label: 'Médicos' },
  { value: 'psi', label: 'Psicologia' },
  { value: 'psicanalise', label: 'Psicanálise' },
  { value: 'odonto', label: 'Odontologia' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'perfumaria', label: 'Perfumaria' },
  { value: 'seller', label: 'Vendedores' },
  { value: 'nutra', label: 'Nutra' },
]

const AREA_VALUES = new Set(AREAS_CADASTRO.map((a) => a.value))

function getAreaFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const area = params.get('area')?.toLowerCase()
  return area && AREA_VALUES.has(area) ? area : null
}

/**
 * Página de cadastro: escolha de área + formulário.
 * Se ?area=estetica (ou nutri, med, etc.) → pula a pergunta e vai direto ao formulário.
 * Após cadastro → /pt/onboarding (série de perguntas) → análise geral → decisões de fluxo.
 */
export default function CadastroPage() {
  const router = useRouter()
  const [areaAtiva, setAreaAtiva] = useState<string | null>(null)
  const [inicializado, setInicializado] = useState(false)
  const [outroTexto, setOutroTexto] = useState('')

  useEffect(() => {
    const area = getAreaFromUrl()
    if (area) setAreaAtiva(area)
    setInicializado(true)
  }, [])

  if (areaAtiva) {
    return (
      <LoginForm
        perfil={areaAtiva as LoginFormPerfil}
        redirectPath="/pt/onboarding"
        initialSignUpMode={true}
      />
    )
  }

  if (!inicializado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
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
                onClick={() => setAreaAtiva(value)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-gray-800 font-medium transition-colors"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <section className="mt-6 pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Outro</p>
          <label htmlFor="cadastro-outro" className="block text-sm font-medium text-gray-900">
            Qual é a sua área?
          </label>
          <input
            id="cadastro-outro"
            type="text"
            value={outroTexto}
            onChange={(e) => setOutroTexto(e.target.value)}
            placeholder="Ex.: vendedor, fono, fisioterapeuta…"
            className="w-full min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            autoComplete="organization-title"
          />
          <button
            type="button"
            onClick={() => {
              const q = new URLSearchParams()
              q.set('area', 'profissional-liberal')
              if (outroTexto.trim()) q.set('profissao', outroTexto.trim())
              router.push(`/pt/solicitar-acesso?${q.toString()}`)
            }}
            className="w-full min-h-[44px] rounded-lg border border-gray-900 bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continuar
          </button>
        </section>
      </div>
    </div>
  )
}
