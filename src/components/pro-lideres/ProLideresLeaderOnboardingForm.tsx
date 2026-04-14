'use client'

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
  primaryGoal: string
  mainChallenge: string
  focusNotes: string
}

type FieldKey = keyof LeaderOnboardingFormValues

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

  return (
    <form className="grid gap-3" onSubmit={(e) => void onSubmit(e)}>
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
        <span className="mb-1 block text-sm font-medium text-gray-700">Maior desafio hoje</span>
        <input
          disabled={disabled}
          value={v.mainChallenge}
          onChange={(e) => set('mainChallenge', e.target.value)}
          placeholder="Ex.: consistência de acompanhamento da equipe"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Observações adicionais (opcional)</span>
        <textarea
          disabled={disabled}
          value={v.focusNotes}
          onChange={(e) => set('focusNotes', e.target.value)}
          placeholder="Contexto extra que o seu mentor precisa saber (opcional)."
          className="min-h-[100px] w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>

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
  primaryGoal: '',
  mainChallenge: '',
  focusNotes: '',
})
