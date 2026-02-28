'use client'

import { useState, useEffect } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { PERFIS_SIMULADOS, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'

const COOKIE_MAX_AGE = 60 * 60 * 24 // 24h

function setSimulateCookie(key: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${SIMULATE_COOKIE_NAME}=${encodeURIComponent(key)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearSimulateCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${SIMULATE_COOKIE_NAME}=; path=/; max-age=0`
}

function getSimulateCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${SIMULATE_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export default function PerfisSimuladosPage() {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  useEffect(() => {
    setActiveKey(getSimulateCookie())
  }, [])

  const handleActivate = (key: string) => {
    setSimulateCookie(key)
    setActiveKey(key)
  }

  const handleDeactivate = () => {
    clearSimulateCookie()
    setActiveKey(null)
  }

  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Perfis para testes
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ative um perfil simulado para testar o Noel, os Links e as sugestões sem preencher o formulário. O perfil escolhido será usado em toda a área (Noel, Links, interpret) até você desativar.
          </p>
        </header>

        {activeKey && (
          <div
            className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm"
            role="alert"
          >
            <p className="text-sm text-amber-800 font-medium">
              Simulação ativa: {PERFIS_SIMULADOS.find((p) => p.key === activeKey)?.label ?? activeKey}
            </p>
            <button
              type="button"
              onClick={handleDeactivate}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
            >
              Desativar simulação
            </button>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Escolha um perfil
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PERFIS_SIMULADOS.map((perfil) => {
              const isActive = activeKey === perfil.key
              return (
                <article
                  key={perfil.key}
                  className={`rounded-xl border-2 p-5 transition-colors ${
                    isActive
                      ? 'border-emerald-400 bg-emerald-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {perfil.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-snug">
                    {perfil.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-4 font-mono">
                    {perfil.profile.profile_type} · {perfil.profile.profession} · dor: {perfil.profile.dor_principal}
                  </p>
                  <button
                    type="button"
                    onClick={() => (isActive ? handleDeactivate() : handleActivate(perfil.key))}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isActive ? 'Desativar' : 'Usar este perfil nos testes'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          Vá em <strong className="text-gray-700">Noel</strong> ou <strong className="text-gray-700">Links inteligentes</strong> para testar o comportamento com o perfil ativo. Ao desativar, volta a valer seu perfil real (se tiver).
        </p>
      </div>
    </YladaAreaShell>
  )
}
