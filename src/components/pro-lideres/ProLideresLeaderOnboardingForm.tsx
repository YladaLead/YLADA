'use client'

import { useState } from 'react'

import {
  LEADER_ONBOARDING_BOTTLENECK_OPTIONS,
  LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS,
  LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS,
  LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS,
  LEADER_ONBOARDING_TOOL_OPTIONS,
} from '@/lib/pro-lideres-leader-onboarding-fields'

export type LeaderOnboardingFormValues = {
  displayName: string
  teamName: string
  whatsapp: string
  leaderAge: string
  herbalifeYears: string
  careerBeforeHerbalife: string
  teamTotalPeople: string
  teamLeadersCount: string
  teamDistinctLines: string
  teamActivityLevel: string
  followupFrequency: string
  toolsUsedCsv: string
  primaryGoal: string
  primaryGoalMeasure: string
  mainChallengePreset: string
  mainChallengeOther: string
  teamBottleneck: string
  teamBottleneckOther: string
  focusNotes: string
}

type FieldKey = keyof LeaderOnboardingFormValues

function parseToolsCsv(csv: string): string[] {
  return [...new Set(csv.split(',').map((s) => s.trim()).filter(Boolean))].sort()
}

function toggleToolInCsv(csv: string, key: string): string {
  const cur = parseToolsCsv(csv)
  if (key === 'none_consistent') {
    return cur.includes('none_consistent') ? '' : 'none_consistent'
  }
  const withoutNone = cur.filter((k) => k !== 'none_consistent')
  const set = new Set(withoutNone)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  return [...set].sort().join(',')
}

export function validateProLideresLeaderOnboardingForm(v: LeaderOnboardingFormValues): string | null {
  if (!v.teamActivityLevel.trim()) return 'Selecione o nível de atividade atual da equipe.'
  if (!v.followupFrequency.trim()) return 'Selecione a frequência de acompanhamento atual.'
  const tools = parseToolsCsv(v.toolsUsedCsv)
  if (tools.length === 0) return 'Indique pelo menos uma opção em “Ferramentas que usa hoje”.'
  if (tools.includes('none_consistent') && tools.length > 1) {
    return 'Se marcar “Não uso nenhuma com consistência”, não combine com outras ferramentas.'
  }
  const pg = v.primaryGoal.trim()
  if (pg.length < 3) return 'Descreva o objetivo principal (30 dias).'
  const pm = v.primaryGoalMeasure.trim()
  if (pm.length < 8) return 'Explique como saberá que atingiu o objetivo (critério mensurável).'
  const preset = v.mainChallengePreset.trim()
  if (!preset) return 'Selecione a opção que melhor descreve o maior desafio hoje.'
  if (preset === 'other' && v.mainChallengeOther.trim().length < 2) return 'Descreva o desafio em “Outro”.'
  const bot = v.teamBottleneck.trim()
  if (!bot) return 'Selecione o que mais trava a equipe hoje.'
  if (bot === 'other' && v.teamBottleneckOther.trim().length < 2) return 'Descreva o gargalo em “Outro”.'
  return null
}

export function ProLideresLeaderOnboardingForm({
  values,
  onChange,
  onSubmit,
  saving = false,
  submitLabel = 'Enviar respostas',
  disabled = false,
}: {
  values: LeaderOnboardingFormValues
  onChange: (field: FieldKey, value: string) => void
  onSubmit: (e: React.FormEvent) => void | Promise<void>
  saving?: boolean
  submitLabel?: string
  disabled?: boolean
}) {
  const v = values
  const set = onChange
  const toolsSelected = parseToolsCsv(v.toolsUsedCsv)
  const [clientError, setClientError] = useState<string | null>(null)

  function submitWrapped(e: React.FormEvent) {
    e.preventDefault()
    const err = validateProLideresLeaderOnboardingForm(v)
    if (err) {
      setClientError(err)
      return
    }
    setClientError(null)
    void onSubmit(e)
  }

  return (
    <form className="grid gap-3" onSubmit={submitWrapped}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Nome para exibição</span>
        <input
          required
          disabled={disabled}
          value={v.displayName}
          onChange={(e) => set('displayName', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Nome da operação/equipe</span>
        <input
          disabled={disabled}
          value={v.teamName}
          onChange={(e) => set('teamName', e.target.value)}
          placeholder="Ex.: Equipe Sul"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">WhatsApp</span>
        <input
          disabled={disabled}
          value={v.whatsapp}
          onChange={(e) => set('whatsapp', e.target.value)}
          placeholder="Com DDI, ex.: 5511999999999"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>

      <details className="rounded-xl border border-gray-200 bg-gray-50/90 open:bg-gray-50">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden>☰</span>
            Perfil e estrutura da equipe
            <span className="font-normal text-gray-500">(expandir)</span>
          </span>
        </summary>
        <div className="grid gap-3 border-t border-gray-200 px-4 pb-4 pt-2 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-gray-700">Idade (anos)</span>
            <input
              type="number"
              min={16}
              max={110}
              inputMode="numeric"
              disabled={disabled}
              value={v.leaderAge}
              onChange={(e) => set('leaderAge', e.target.value)}
              placeholder="Ex.: 42"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-gray-700">Anos na Herbalife</span>
            <input
              type="number"
              min={0}
              max={70}
              inputMode="numeric"
              disabled={disabled}
              value={v.herbalifeYears}
              onChange={(e) => set('herbalifeYears', e.target.value)}
              placeholder="Só anos, ex.: 0 a 5"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Antes da Herbalife, o que fazia?</span>
            <input
              disabled={disabled}
              value={v.careerBeforeHerbalife}
              onChange={(e) => set('careerBeforeHerbalife', e.target.value)}
              placeholder="Ex.: comércio, saúde, educação, outro negócio…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-gray-700">Total de pessoas na equipe</span>
            <input
              type="number"
              min={0}
              max={500000}
              inputMode="numeric"
              disabled={disabled}
              value={v.teamTotalPeople}
              onChange={(e) => set('teamTotalPeople', e.target.value)}
              placeholder="Ex.: 12"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1 block text-sm font-medium text-gray-700">Líderes na equipe</span>
            <input
              type="number"
              min={0}
              max={100000}
              inputMode="numeric"
              disabled={disabled}
              value={v.teamLeadersCount}
              onChange={(e) => set('teamLeadersCount', e.target.value)}
              placeholder="Ex.: 3"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Linhas distintas (estrutura)</span>
            <input
              type="number"
              min={0}
              max={50000}
              inputMode="numeric"
              disabled={disabled}
              value={v.teamDistinctLines}
              onChange={(e) => set('teamDistinctLines', e.target.value)}
              placeholder="Quantas linhas de frente diferentes acompanha"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
        </div>
      </details>

      <fieldset disabled={disabled} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-gray-900">Nível de atividade atual da equipe</legend>
        <div className="mt-2 grid gap-2">
          {LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="teamActivityLevel"
                value={o.id}
                checked={v.teamActivityLevel === o.id}
                onChange={() => set('teamActivityLevel', o.id)}
                className="mt-1"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-gray-900">Frequência de acompanhamento atual</legend>
        <div className="mt-2 grid gap-2">
          {LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="followupFrequency"
                value={o.id}
                checked={v.followupFrequency === o.id}
                onChange={() => set('followupFrequency', o.id)}
                className="mt-1"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-gray-900">Ferramentas que usa hoje</legend>
        <p className="mt-1 text-xs text-gray-500">Pode marcar várias; a última opção é exclusiva.</p>
        <div className="mt-2 grid gap-2">
          {LEADER_ONBOARDING_TOOL_OPTIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={toolsSelected.includes(o.id)}
                onChange={() => set('toolsUsedCsv', toggleToolInCsv(v.toolsUsedCsv, o.id))}
                className="mt-1"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Objetivo principal (30 dias)</span>
        <input
          disabled={disabled}
          value={v.primaryGoal}
          onChange={(e) => set('primaryGoal', e.target.value)}
          placeholder="Ex.: aumentar recrutas ativos na equipe"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Como você saberá que atingiu esse objetivo?
        </span>
        <input
          disabled={disabled}
          value={v.primaryGoalMeasure}
          onChange={(e) => set('primaryGoalMeasure', e.target.value)}
          placeholder="Ex.: de 1 para 2 contactos por líder por semana"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>

      <fieldset disabled={disabled} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-gray-900">Maior desafio hoje</legend>
        <div className="mt-2 grid gap-2">
          {LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="mainChallengePreset"
                value={o.id}
                checked={v.mainChallengePreset === o.id}
                onChange={() => set('mainChallengePreset', o.id)}
                className="mt-1"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {v.mainChallengePreset === 'other' && (
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Descreva o desafio</span>
            <input
              disabled={disabled}
              value={v.mainChallengeOther}
              onChange={(e) => set('mainChallengeOther', e.target.value)}
              placeholder="Texto livre"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
        )}
      </fieldset>

      <fieldset disabled={disabled} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-gray-900">O que mais trava sua equipe hoje?</legend>
        <div className="mt-2 grid gap-2">
          {LEADER_ONBOARDING_BOTTLENECK_OPTIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="teamBottleneck"
                value={o.id}
                checked={v.teamBottleneck === o.id}
                onChange={() => set('teamBottleneck', o.id)}
                className="mt-1"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {v.teamBottleneck === 'other' && (
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Descreva o gargalo</span>
            <input
              disabled={disabled}
              value={v.teamBottleneckOther}
              onChange={(e) => set('teamBottleneckOther', e.target.value)}
              placeholder="Texto livre"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </label>
        )}
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Existe algo importante que, se resolvido, faria sua equipe crescer rápido? (opcional)
        </span>
        <textarea
          disabled={disabled}
          value={v.focusNotes}
          onChange={(e) => set('focusNotes', e.target.value)}
          placeholder="Contexto extra para o mentor (opcional)."
          className="min-h-[100px] w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>

      {clientError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {clientError}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || disabled}
        className="mt-2 min-h-[46px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'Enviando...' : submitLabel}
      </button>
    </form>
  )
}

export const emptyLeaderOnboardingFormValues = (): LeaderOnboardingFormValues => ({
  displayName: '',
  teamName: '',
  whatsapp: '',
  leaderAge: '',
  herbalifeYears: '',
  careerBeforeHerbalife: '',
  teamTotalPeople: '',
  teamLeadersCount: '',
  teamDistinctLines: '',
  teamActivityLevel: '',
  followupFrequency: '',
  toolsUsedCsv: '',
  primaryGoal: '',
  primaryGoalMeasure: '',
  mainChallengePreset: '',
  mainChallengeOther: '',
  teamBottleneck: '',
  teamBottleneckOther: '',
  focusNotes: '',
})
