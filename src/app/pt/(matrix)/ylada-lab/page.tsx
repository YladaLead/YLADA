'use client'

import { useState, useMemo, useEffect } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import {
  deriveStrategicProfile,
  getStrategicIntro,
  getAdaptiveDiagnosisIntro,
  getAdvancedCta,
} from '@/lib/ylada'
import type { StrategicProfile } from '@/lib/ylada'
import type { ProfileDataInput } from '@/lib/ylada/strategic-profile'
import {
  LAB_PROFILE_TYPES,
  LAB_DOMINANT_PAINS,
  LAB_URGENCY_LEVELS,
  LAB_SELF_STAGES,
  LAB_PROFILE_QUESTIONS,
  LAB_PAIN_TO_PROFILE_DOR,
  LAB_URGENCY_TO_OBJETIVO,
  LAB_STAGE_TO_FASE,
} from '@/config/ylada-lab'

type LabState = {
  profileType: string
  dominantPain: string
  urgencyLevel: string
  selfStage: string
  answers: Record<string, string>
  overridesEnabled: boolean
  overrides: {
    dominantPain?: string
    urgencyLevel?: string
    maturityStage?: string
  }
}

const INITIAL_STATE: LabState = {
  profileType: '',
  dominantPain: '',
  urgencyLevel: '',
  selfStage: '',
  answers: {},
  overridesEnabled: false,
  overrides: {},
}

function buildSyntheticProfile(state: LabState): ProfileDataInput {
  const pt = state.profileType
  const professionByType: Record<string, { profile_type: string; profession: string }> = {
    profissional_liberal: { profile_type: 'liberal', profession: 'medico' },
    vendedor: { profile_type: 'vendas', profession: 'vendedor_suplementos' },
    wellness: { profile_type: 'vendas', profession: 'wellness' },
    nutricionista: { profile_type: 'liberal', profession: 'nutricionista' },
    clinica: { profile_type: 'liberal', profession: 'clinica' },
    outro: { profile_type: 'liberal', profession: 'outro' },
  }
  const { profile_type, profession } = professionByType[pt] ?? { profile_type: 'liberal', profession: 'outro' }
  const dor = state.dominantPain ? (LAB_PAIN_TO_PROFILE_DOR[state.dominantPain] ?? 'agenda_vazia') : 'agenda_vazia'
  const fase = state.selfStage ? (LAB_STAGE_TO_FASE[state.selfStage] ?? 'em_crescimento') : 'em_crescimento'
  const capacidadeByStage: Record<string, number> = { iniciante: 5, intermediario: 15, avancado: 25 }
  const tempoByStage: Record<string, number> = { iniciante: 1, intermediario: 4, avancado: 8 }
  const capacidade = state.selfStage ? capacidadeByStage[state.selfStage] ?? 15 : 15
  const tempo = state.selfStage ? tempoByStage[state.selfStage] ?? 4 : 4

  return {
    profile_type,
    profession,
    dor_principal: dor,
    fase_negocio: fase,
    capacidade_semana: capacidade,
    tempo_atuacao_anos: tempo,
  }
}

function applyOverrides(
  profile: StrategicProfile,
  state: LabState
): StrategicProfile {
  if (!state.overridesEnabled || !state.overrides) return profile
  return {
    ...profile,
    ...(state.overrides.dominantPain && {
      dominantPain: state.overrides.dominantPain as StrategicProfile['dominantPain'],
    }),
    ...(state.overrides.urgencyLevel && {
      urgencyLevel: state.overrides.urgencyLevel as StrategicProfile['urgencyLevel'],
    }),
    ...(state.overrides.maturityStage && {
      maturityStage: state.overrides.maturityStage as StrategicProfile['maturityStage'],
    }),
  }
}

export default function YladaLabPage() {
  const [state, setState] = useState<LabState>(INITIAL_STATE)
  const [result, setResult] = useState<{
    strategicProfile: StrategicProfile
    intro: { title: string; subtitle: string; micro: string }
    diagnosisOpening: string
    cta: string
  } | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  useEffect(() => {
    if (generateError) setGenerateError(null)
  }, [state.profileType, state.dominantPain, state.urgencyLevel, state.selfStage])

  const questions = useMemo(
    () => (state.profileType ? LAB_PROFILE_QUESTIONS[state.profileType] ?? LAB_PROFILE_QUESTIONS.outro : []),
    [state.profileType]
  )

  const canGenerate = Boolean(
    String(state.profileType ?? '').trim() &&
    String(state.dominantPain ?? '').trim() &&
    String(state.urgencyLevel ?? '').trim() &&
    String(state.selfStage ?? '').trim()
  )

  const handleGenerate = () => {
    if (!canGenerate) {
      setGenerateError('Selecione perfil base, principal dor, urgência e estágio.')
      return
    }
    setGenerateError(null)
    const syntheticProfile = buildSyntheticProfile(state)
    const objetivo = state.urgencyLevel ? LAB_URGENCY_TO_OBJETIVO[state.urgencyLevel] ?? 'captar' : 'captar'
    const areaProf = state.profileType === 'vendedor' || state.profileType === 'wellness' ? 'vendas' : 'profissional_liberal'
    const derived = deriveStrategicProfile(syntheticProfile, {
      objetivo,
      tema: 'lab',
      area_profissional: areaProf,
    })
    const finalProfile = applyOverrides(derived, state)

    const intro = getStrategicIntro({
      strategySlot: 'single',
      objective: objetivo,
      area_profissional: areaProf,
      strategic_profile: finalProfile,
    })
    const diagnosisOpening = getAdaptiveDiagnosisIntro(finalProfile, undefined)
    const cta = getAdvancedCta(finalProfile, 'Fale comigo no WhatsApp')

    setResult({
      strategicProfile: finalProfile,
      intro,
      diagnosisOpening,
      cta,
    })
  }

  const setAnswer = (id: string, value: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }))
  }

  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            YLADA Lab
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Sandbox estratégico. Escolha perfil, refinadores e perguntas; gere o diagnóstico sem salvar. Sem banco.
          </p>
        </header>

        {/* Bloco 1 — Escolha de Perfil */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            1. Escolha de perfil base
          </h2>
          <select
            value={state.profileType}
            onChange={(e) => setState((s) => ({ ...s, profileType: e.target.value, answers: {} }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecione o perfil</option>
            {LAB_PROFILE_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </section>

        {/* Bloco 2 — Refinadores estratégicos */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            2. Refinadores estratégicos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal dor hoje</label>
              <select
                value={state.dominantPain}
                onChange={(e) => setState((s) => ({ ...s, dominantPain: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {LAB_DOMINANT_PAINS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgência</label>
              <select
                value={state.urgencyLevel}
                onChange={(e) => setState((s) => ({ ...s, urgencyLevel: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {LAB_URGENCY_LEVELS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Você se considera</label>
              <select
                value={state.selfStage}
                onChange={(e) => setState((s) => ({ ...s, selfStage: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {LAB_SELF_STAGES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggle Overrides */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.overridesEnabled}
                onChange={(e) => setState((s) => ({ ...s, overridesEnabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Forçar valores estratégicos (modo teste)
              </span>
            </label>
            {state.overridesEnabled && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Forçar dominantPain</label>
                  <select
                    value={state.overrides?.dominantPain ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        overrides: { ...s.overrides, dominantPain: e.target.value || undefined },
                      }))
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    <option value="">—</option>
                    <option value="agenda">agenda</option>
                    <option value="posicionamento">posicionamento</option>
                    <option value="conversao">conversao</option>
                    <option value="autoridade">autoridade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Forçar urgencyLevel</label>
                  <select
                    value={state.overrides?.urgencyLevel ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        overrides: { ...s.overrides, urgencyLevel: e.target.value || undefined },
                      }))
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    <option value="">—</option>
                    <option value="alta">alta</option>
                    <option value="media">media</option>
                    <option value="baixa">baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Forçar maturityStage</label>
                  <select
                    value={state.overrides?.maturityStage ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        overrides: { ...s.overrides, maturityStage: e.target.value || undefined },
                      }))
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    <option value="">—</option>
                    <option value="iniciante">iniciante</option>
                    <option value="instavel">instavel</option>
                    <option value="crescendo">crescendo</option>
                    <option value="consolidado">consolidado</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Botão para avançar — sempre clicável; ao clicar sem preencher, mostra o que falta */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Gerar Diagnóstico
            </button>
            {generateError && (
              <p className="mt-2 text-sm text-amber-700 text-center" role="alert">
                {generateError}
              </p>
            )}
            {!canGenerate && !generateError && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Preencha perfil e os 3 refinadores para ver o resultado.
              </p>
            )}
          </div>
        </section>

        {/* Bloco 3 — Perguntas estratégicas adaptadas */}
        {questions.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              3. Perguntas estratégicas adaptadas
            </h2>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm text-gray-700 mb-1">{q.text}</label>
                  <input
                    type="text"
                    value={state.answers[q.id] ?? ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder="Sua resposta (simulação)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Gerar Diagnóstico
              </button>
            </div>
          </section>
        )}

        {/* Bloco 4 — Resultado estratégico */}
        {result && (
          <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              4. Resultado estratégico
            </h2>
            <div className="space-y-4 text-gray-900">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Strategic Intro</h3>
                <p className="font-medium">{result.intro.title}</p>
                <p className="text-sm text-gray-700">{result.intro.subtitle}</p>
                <p className="text-xs text-gray-500">{result.intro.micro}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnóstico (abertura)</h3>
                <p className="text-sm">{result.diagnosisOpening}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">First Move / CTA</h3>
                <p className="text-sm font-medium">{result.cta}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showJson}
                  onChange={(e) => setShowJson(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mostrar JSON estratégico</span>
              </label>
              {showJson && (
                <pre className="mt-2 rounded-lg bg-gray-900 p-4 text-xs text-gray-100 overflow-auto">
                  {JSON.stringify(result.strategicProfile, null, 2)}
                </pre>
              )}
            </div>
          </section>
        )}
      </div>
    </YladaAreaShell>
  )
}
