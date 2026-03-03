'use client'

import { useState, useEffect, useCallback } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getTemasForProfession, getTemaLabel } from '@/config/ylada-temas'
import { getFerramentasForTema } from '@/config/ylada-temas-ferramentas'
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

type LabStep = 'perfil' | 'tema' | 'cards'

export default function YladaLabPage() {
  const [step, setStep] = useState<LabStep>('perfil')
  const [selectedProfileKey, setSelectedProfileKey] = useState('')
  const [selectedTema, setSelectedTema] = useState('')
  const [strategyData, setStrategyData] = useState<{
    professional_diagnosis: { summary_lines: string[]; focus: string }
    strategic_focus: string
    strategies: Array<{ flow_id: string; type: string; title: string; reason: string; theme: string; cta_suggestion: string }>
    simulated_profile_label?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const profile = selectedProfileKey ? PERFIS_SIMULADOS.find((p) => p.key === selectedProfileKey) : null
  const profileData = profile?.profile
  const temasFromProfile = Array.isArray(profileData?.area_specific?.temas_atuacao) && (profileData!.area_specific!.temas_atuacao as string[]).length > 0
    ? (profileData!.area_specific!.temas_atuacao as string[]).map((v) => ({ value: v, label: getTemaLabel(v) }))
    : getTemasForProfession(profileData?.profession ?? null)

  const handleOkPerfil = useCallback(() => {
    if (!selectedProfileKey) {
      setError('Selecione um perfil.')
      return
    }
    setError(null)
    setSimulateCookie(selectedProfileKey)
    setLoading(true)
    fetch('/api/ylada/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ segment: 'ylada' }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setStrategyData(json.data)
          setStep('tema')
        } else {
          setError(json?.error || 'Erro ao carregar estratégia.')
        }
      })
      .catch(() => setError('Erro de conexão.'))
      .finally(() => setLoading(false))
  }, [selectedProfileKey])

  const handleOkTema = useCallback(() => {
    if (!selectedTema) {
      setError('Selecione um tema.')
      return
    }
    setError(null)
    setStep('cards')
  }, [selectedTema])

  const handleReset = useCallback(() => {
    clearSimulateCookie()
    setStep('perfil')
    setSelectedProfileKey('')
    setSelectedTema('')
    setStrategyData(null)
    setError(null)
  }, [])

  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-xl mx-auto space-y-6">
        <header>
          <h1 className="text-xl font-bold text-gray-900">YLADA Lab</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Teste o fluxo tema → ferramenta. Selecione, confirme OK e veja como o sistema reage.
          </p>
        </header>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Step 1: Perfil */}
        <section className={`rounded-xl border-2 p-4 ${step === 'perfil' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">1. Perfil simulado</h2>
            {step !== 'perfil' && (
              <span className="text-xs text-green-600 font-medium">✓ OK</span>
            )}
          </div>
          <select
            value={selectedProfileKey}
            onChange={(e) => setSelectedProfileKey(e.target.value)}
            disabled={step !== 'perfil'}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option value="">Selecione o perfil</option>
            {PERFIS_SIMULADOS.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
          {step === 'perfil' && (
            <button
              type="button"
              onClick={handleOkPerfil}
              disabled={loading || !selectedProfileKey}
              className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Carregando...' : 'OK'}
            </button>
          )}
        </section>

        {/* Step 2: Tema */}
        {step !== 'perfil' && (
          <section className={`rounded-xl border-2 p-4 ${step === 'tema' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">2. Tema</h2>
              {step === 'cards' && (
                <span className="text-xs text-green-600 font-medium">✓ OK</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {strategyData?.simulated_profile_label && (
                <>Simulando: <strong>{strategyData.simulated_profile_label}</strong></>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {temasFromProfile.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => step === 'tema' && setSelectedTema(t.value)}
                  disabled={step !== 'tema'}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedTema === t.value
                      ? 'bg-blue-600 text-white'
                      : step === 'tema'
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
              {step === 'tema' && (
                <button
                  type="button"
                  onClick={() => setSelectedTema('_outro')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedTema === '_outro' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Outro tema
                </button>
              )}
            </div>
            {step === 'tema' && (
              <button
                type="button"
                onClick={handleOkTema}
                disabled={!selectedTema}
                className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                OK
              </button>
            )}
          </section>
        )}

        {/* Step 3: Ferramentas concretas */}
        {step === 'cards' && strategyData && (
          <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">3. Ferramentas para &quot;{selectedTema === '_outro' ? 'Outro tema' : getTemaLabel(selectedTema)}&quot;</h2>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-4">
              <p className="text-xs font-medium text-slate-600 mb-1">Direção Estratégica</p>
              {strategyData.professional_diagnosis.summary_lines.map((line, i) => (
                <p key={i} className="text-sm text-slate-700">{line}</p>
              ))}
              <p className="text-sm font-medium text-slate-800 mt-1">Foco: {strategyData.strategic_focus}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {getFerramentasForTema(selectedTema).map((f) => (
                <div key={f.id} className="rounded-lg border border-gray-200 p-3 bg-white">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium mb-2 ${f.tipo === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {f.tipo === 'quiz' ? 'Quiz' : 'Calculadora'}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{f.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href="/pt/links"
                className="flex-1 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white text-center hover:bg-slate-900"
              >
                Testar em Links
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reiniciar
              </button>
            </div>
          </section>
        )}

        {step !== 'perfil' && step !== 'cards' && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reiniciar teste
          </button>
        )}
      </div>
    </YladaAreaShell>
  )
}
