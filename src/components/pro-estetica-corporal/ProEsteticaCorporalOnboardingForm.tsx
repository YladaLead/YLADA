'use client'

import {
  CORPORAL_ONBOARDING_MARKET_CONTEXT_LABELS,
  type CorporalOnboardingMarketContext,
} from '@/lib/pro-estetica-corporal-onboarding'

export type CorporalOnboardingFormValues = {
  displayName: string
  teamName: string
  cityRegion: string
  marketContext: CorporalOnboardingMarketContext
  serviceToGrow: string
  mainLeadChannel: string
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
  submitLabel = 'Concluir e preparar o meu espaço',
  disabled = false,
  serviceToGrowPlaceholder = 'Ex.: drenagem linfática, radiofrequência, pacotes de manutenção…',
}: {
  values: CorporalOnboardingFormValues
  onChange: (field: FieldKey, value: string) => void
  onSubmit: (e: React.FormEvent) => void | Promise<void>
  saving?: boolean
  submitLabel?: string
  disabled?: boolean
  /** Opcional (ex.: Pro Estética Capilar — exemplos capilares). */
  serviceToGrowPlaceholder?: string
}) {
  const v = values
  const set = onChange

  return (
    <form className=”grid gap-4” onSubmit={(e) => void onSubmit(e)}>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Como você quer ser chamada no painel?</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Esse nome ajuda o Noel a falar com você de forma pessoal.</span>
        <input
          required
          disabled={disabled}
          value={v.displayName}
          onChange={(e) => set('displayName', e.target.value)}
          placeholder=”Ex.: Ana Silva”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Nome da sua clínica ou marca</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Aparece no contexto da sua operação para o mentor.</span>
        <input
          disabled={disabled}
          value={v.teamName}
          onChange={(e) => set('teamName', e.target.value)}
          placeholder=”Ex.: Estética Bem Estar”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Onde você atua? (cidade ou região)</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Ajuda a calibrar mensagens e referências de mercado.</span>
        <input
          disabled={disabled}
          value={v.cityRegion}
          onChange={(e) => set('cityRegion', e.target.value)}
          placeholder=”Ex.: Campinas, Zona Sul do RJ…”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Como você descreveria o seu mercado?</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Interior, cidade média ou grande metrópole mudam o tom das sugestões.</span>
        <select
          disabled={disabled}
          value={v.marketContext}
          onChange={(e) => set('marketContext', e.target.value as CorporalOnboardingMarketContext)}
          className=”w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        >
          <option value=””>— Prefiro não caracterizar agora —</option>
          {(Object.entries(CORPORAL_ONBOARDING_MARKET_CONTEXT_LABELS) as [Exclude<CorporalOnboardingMarketContext, ''>, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Que linha de serviço você quer mais fazer crescer agora?</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Não é “cadastro de serviços” — é o que mais puxa a sua agenda nos próximos meses.</span>
        <input
          disabled={disabled}
          value={v.serviceToGrow}
          onChange={(e) => set('serviceToGrow', e.target.value)}
          placeholder={serviceToGrowPlaceholder}
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>De onde vem a maior parte dos seus clientes hoje?</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Instagram, indicação, parcerias, passagem na rua…</span>
        <input
          disabled={disabled}
          value={v.mainLeadChannel}
          onChange={(e) => set('mainLeadChannel', e.target.value)}
          placeholder=”Ex.: indicação e Instagram”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>WhatsApp profissional</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Para contato e continuidade no acompanhamento.</span>
        <input
          disabled={disabled}
          value={v.whatsapp}
          onChange={(e) => set('whatsapp', e.target.value)}
          placeholder=”Com DDD, ex.: 11999999999”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Há quanto tempo você trabalha em estética?</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Opcional. Em anos — dá contexto ao mentor sem precisar de currículo.</span>
        <input
          type=”number”
          min={0}
          max={70}
          inputMode=”numeric”
          disabled={disabled}
          value={v.yearsInAesthetics}
          onChange={(e) => set('yearsInAesthetics', e.target.value)}
          placeholder=”Ex.: 5”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Nos próximos 90 dias, o que seria um avanço real pra você?</span>
        <textarea
          disabled={disabled}
          value={v.primaryGoal}
          onChange={(e) => set('primaryGoal', e.target.value)}
          rows={2}
          maxLength={200}
          placeholder=”Ex.: encher a agenda nas manhãs, fechar 10 novas avaliações…”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>O que mais trava ou tira o seu sono agora?</span>
        <textarea
          disabled={disabled}
          value={v.mainChallenge}
          onChange={(e) => set('mainChallenge', e.target.value)}
          rows={2}
          maxLength={300}
          placeholder=”Ex.: agenda oscilando, dificuldade de cobrar mais, falta de tempo para redes…”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <label className=”block”>
        <span className=”mb-1 block text-sm font-medium text-gray-900”>Mais contexto para o Noel (opcional)</span>
        <span className=”mb-1.5 block text-xs text-gray-500”>Qualquer detalhe que você queira que o mentor leve na conversa desde o primeiro chat.</span>
        <textarea
          disabled={disabled}
          value={v.focusNotes}
          onChange={(e) => set('focusNotes', e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder=”Ex.: abri há 6 meses; quero foco em recorrência; prefiro tom mais direto…”
          className=”w-full rounded-lg border border-gray-300 px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100”
        />
      </label>
      <button
        type=”submit”
        disabled={disabled || saving}
        className=”min-h-[44px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60”
      >
        {saving ? 'Enviando…' : submitLabel}
      </button>
    </form>
  )
}

export function emptyCorporalOnboardingFormValues(): CorporalOnboardingFormValues {
  return {
    displayName: '',
    teamName: '',
    cityRegion: '',
    marketContext: '',
    serviceToGrow: '',
    mainLeadChannel: '',
    whatsapp: '',
    yearsInAesthetics: '',
    primaryGoal: '',
    mainChallenge: '',
    focusNotes: '',
  }
}
