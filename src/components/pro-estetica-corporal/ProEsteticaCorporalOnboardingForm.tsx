'use client'

export type CorporalOnboardingFormValues = {
  displayName: string
  teamName: string
  whatsapp: string
  yearsInAesthetics: string
  primaryGoal: string
  mainChallenge: string
  focusNotes: string
}

type FieldKey = keyof CorporalOnboardingFormValues

export function ProEsteticaCorporalOnboardingForm({
  values,
  onChange,
  onSubmit,
  saving = false,
  submitLabel = 'Enviar respostas',
  disabled = false,
}: {
  values: CorporalOnboardingFormValues
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
        <span className="mb-1 block text-sm font-medium text-gray-700">Nome da clínica / operação</span>
        <input
          disabled={disabled}
          value={v.teamName}
          onChange={(e) => set('teamName', e.target.value)}
          placeholder="Ex.: Estética Bem Estar"
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
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Anos na área de estética (opcional)</span>
        <input
          type="number"
          min={0}
          max={70}
          inputMode="numeric"
          disabled={disabled}
          value={v.yearsInAesthetics}
          onChange={(e) => set('yearsInAesthetics', e.target.value)}
          placeholder="Ex.: 5"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Objetivo nos próximos 90 dias</span>
        <textarea
          disabled={disabled}
          value={v.primaryGoal}
          onChange={(e) => set('primaryGoal', e.target.value)}
          rows={2}
          maxLength={200}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Maior desafio hoje</span>
        <textarea
          disabled={disabled}
          value={v.mainChallenge}
          onChange={(e) => set('mainChallenge', e.target.value)}
          rows={2}
          maxLength={300}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Notas livres (opcional)</span>
        <textarea
          disabled={disabled}
          value={v.focusNotes}
          onChange={(e) => set('focusNotes', e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Contexto extra para a consultoria / implantação"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <button
        type="submit"
        disabled={disabled || saving}
        className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'A enviar...' : submitLabel}
      </button>
    </form>
  )
}

export function emptyCorporalOnboardingFormValues(): CorporalOnboardingFormValues {
  return {
    displayName: '',
    teamName: '',
    whatsapp: '',
    yearsInAesthetics: '',
    primaryGoal: '',
    mainChallenge: '',
    focusNotes: '',
  }
}
