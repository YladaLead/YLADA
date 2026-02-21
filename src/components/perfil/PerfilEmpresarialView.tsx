'use client'

import { useState, useEffect, useCallback } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import {
  emptyFormData,
  profileToFormData,
  formDataToPayload,
  getDorPrincipalOptions,
  getOptionsForProfileField,
  PROFILE_FIELD_LABELS,
  FASE_NEGOCIO_OPTIONS,
  MODELO_PAGAMENTO_OPTIONS,
  MODELO_ATUACAO_OPTIONS,
  CANAIS_OPTIONS,
  ESPECIALIDADES_MED,
  type YladaProfileFormData,
} from '@/types/ylada-profile'
import {
  PROFILE_TYPE_LABELS,
  PROFESSION_FIELD_LABEL_BY_TYPE,
  getProfessionsForSegment,
  getProfileFlow,
  getFieldPersistTarget,
  getStepCopyForProfession,
  getFieldLabelForProfession,
  getFieldPlaceholderForProfession,
  PROFESSION_HEADER,
  PROFESSION_IDENTITY,
  type ProfileType,
  type ProfessionCode,
  type ProfileFlowConfig,
  type ProfileFieldDef,
  PROFILE_TYPE_BY_PROFESSION,
} from '@/config/ylada-profile-flows'

interface PerfilEmpresarialViewProps {
  areaCodigo: string
  areaLabel: string
}

/** Retorna o valor atual do campo no form (coluna ou area_specific). */
function getFieldValue(form: YladaProfileFormData, field: ProfileFieldDef): string | number | string[] | '' {
  const { source, path } = getFieldPersistTarget(field)
  if (source === 'column') {
    const v = form[path as keyof YladaProfileFormData]
    if (Array.isArray(v)) return v
    if (typeof v === 'number' && v === '') return ''
    return (v as string | number | '') ?? ''
  }
  const v = form.area_specific[path]
  if (Array.isArray(v)) return v
  return (v as string | undefined) ?? ''
}

export default function PerfilEmpresarialView({ areaCodigo, areaLabel }: PerfilEmpresarialViewProps) {
  const segment = areaCodigo
  const [form, setForm] = useState<YladaProfileFormData>(() => emptyFormData(segment))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  /** Step do wizard: 0 = Área de atuação, 1..n = steps do flow. */
  const [stepIndex, setStepIndex] = useState(0)

  const flow: ProfileFlowConfig | null =
    form.profile_type && form.profession
      ? getProfileFlow(form.profile_type as ProfileType, form.profession as ProfessionCode)
      : null

  const showWizard = flow !== null
  const totalWizardSteps = flow ? 1 + flow.steps.length : 1
  const onlyIntro = !form.profile_type || !form.profession

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' })
      const json = await res.json()
      if (json?.success && json?.data) {
        const next = profileToFormData(segment, json.data.profile as Record<string, unknown> | null)
        setForm(next)
        const hasTypeAndProfession = next.profile_type && next.profession
        const nextFlow = hasTypeAndProfession
          ? getProfileFlow(next.profile_type as ProfileType, next.profession as ProfessionCode)
          : null
        setStepIndex(nextFlow ? 1 : 0)
      } else {
        setForm(emptyFormData(segment))
        setStepIndex(0)
      }
    } catch {
      setForm(emptyFormData(segment))
      setMessage({ type: 'error', text: 'Não foi possível carregar o perfil.' })
      setStepIndex(0)
    } finally {
      setLoading(false)
    }
  }, [segment])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const update = (updates: Partial<YladaProfileFormData>) => setForm((prev) => ({ ...prev, ...updates }))
  const updateAreaSpec = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, area_specific: { ...prev.area_specific, [key]: value } }))

  const setFieldValue = useCallback(
    (field: ProfileFieldDef, value: string | number | string[]) => {
      const { source, path } = getFieldPersistTarget(field)
      if (source === 'column') {
        if (path === 'modelo_atuacao' || path === 'canais_principais') {
          setForm((prev) => ({ ...prev, [path]: value as string[] }))
        } else if (path === 'tempo_atuacao_anos' || path === 'capacidade_semana') {
          setForm((prev) => ({ ...prev, [path]: value === '' ? '' : (value as number) }))
        } else if (path === 'ticket_medio') {
          setForm((prev) => ({ ...prev, [path]: value === '' ? '' : (value as number) }))
        } else {
          setForm((prev) => ({ ...prev, [path]: value }))
        }
      } else {
        updateAreaSpec(path, value)
      }
    },
    [updateAreaSpec]
  )

  const toggleArrayField = useCallback(
    (field: ProfileFieldDef, optionValue: string) => {
      const current = getFieldValue(form, field)
      const arr = Array.isArray(current) ? current : []
      const next = arr.includes(optionValue) ? arr.filter((x) => x !== optionValue) : [...arr, optionValue]
      setFieldValue(field, next)
    },
    [form, setFieldValue]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      let toSave = form
      if (form.profile_type && flow) {
        toSave = { ...form, flow_id: flow.flow_id, flow_version: flow.flow_version }
      }
      const payload = formDataToPayload(toSave)
      const res = await fetch('/api/ylada/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json?.success) {
        setMessage({ type: 'success', text: 'Perfil salvo. O Noel usará essas informações para personalizar as orientações.' })
      } else {
        setMessage({ type: 'error', text: json?.error || 'Erro ao salvar.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const professionsForSegment = getProfessionsForSegment(segment)
  const professionsFilteredByType =
    form.profile_type
      ? professionsForSegment.filter(
          (p) =>
            PROFILE_TYPE_BY_PROFESSION[p.value] === form.profile_type ||
            (form.profile_type === 'vendas' && p.value === 'outro')
        )
      : professionsForSegment
  /** "Outro" sempre por último na lista. */
  const professionsSorted = [...professionsFilteredByType].sort((a, b) =>
    a.value === 'outro' ? 1 : b.value === 'outro' ? -1 : 0
  )
  const professionFieldLabel =
    form.profile_type ? PROFESSION_FIELD_LABEL_BY_TYPE[form.profile_type as ProfileType] : 'Sua atuação na área'

  if (loading) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </YladaAreaShell>
    )
  }

  // —— Só intro: sem tipo/profissão ——
  if (onlyIntro) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Perfil empresarial</h1>
            <p className="text-gray-600 mb-4">
              Para personalizar as perguntas e as orientações do Noel, comece pela sua área de atuação.
            </p>
          </div>
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              {message.text}
            </div>
          )}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Área de atuação</h2>
            <p className="text-xs text-gray-500 mb-4">Isso ajuda o Noel a adaptar as perguntas e as estratégias ao seu tipo de negócio.</p>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-600">Você atua como</span>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.profile_type}
                  onChange={(e) => update({ profile_type: e.target.value, profession: '' })}
                >
                  <option value="">Selecione</option>
                  {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">{professionFieldLabel}</span>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.profession}
                  onChange={(e) => update({ profession: e.target.value })}
                  disabled={!form.profile_type}
                >
                  <option value="">Selecione</option>
                  {professionsSorted.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              {form.profession === 'outro' && (
                <label className="block">
                  <span className="text-sm text-gray-600">Descreva sua atuação</span>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder={
                      form.profile_type === 'vendas'
                        ? 'Ex.: outro tipo de produto ou serviço que você vende...'
                        : 'Ex.: outra área de atendimento ou especialidade...'
                    }
                    value={(form.area_specific?.atuacao_outra as string) ?? ''}
                    onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                  />
                </label>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStepIndex(1)}
                disabled={!form.profile_type || !form.profession}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Avançar
              </button>
            </div>
          </section>
        </div>
      </YladaAreaShell>
    )
  }

  // —— Wizard: tem tipo + profissão e flow ——
  if (showWizard && flow) {
    const currentStep = stepIndex === 0 ? null : flow.steps[stepIndex - 1]
    const isLastStep = stepIndex === flow.steps.length
    const profession = form.profession as ProfessionCode | undefined
    const headerCopy = profession && PROFESSION_HEADER[profession]
    const identityCopy = profession && PROFESSION_IDENTITY[profession]
    const nextStep = !isLastStep ? flow.steps[stepIndex] : null
    const nextStepCopy = nextStep
      ? getStepCopyForProfession(nextStep.id, profession, { title: nextStep.title, description: nextStep.description })
      : null
    const currentStepCopy =
      currentStep && stepIndex > 0
        ? getStepCopyForProfession(currentStep.id, profession, { title: currentStep.title, description: currentStep.description })
        : null

    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {headerCopy?.title ?? 'Perfil empresarial'}
              </h1>
              {headerCopy?.subtitle && (
                <p className="text-gray-600 text-sm mb-1">{headerCopy.subtitle}</p>
              )}
              <p className="text-gray-500 text-sm">
                Etapa {stepIndex + 1} de {totalWizardSteps}
                {currentStepCopy?.stepHeaderPart ? ` — ${currentStepCopy.stepHeaderPart}` : ''}
              </p>
              {identityCopy && stepIndex > 0 && (
                <p className="text-xs text-indigo-700 mt-2">
                  Você é: <strong>{identityCopy.youAre}</strong>
                  {' · '}
                  Objetivo: {identityCopy.objective}
                </p>
              )}
            </div>
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStepIndex(0)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Alterar área de atuação
              </button>
            )}
          </div>
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {stepIndex === 0 ? (
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">Área de atuação</h2>
                <p className="text-xs text-gray-500 mb-4">Isso ajuda o Noel a adaptar as perguntas e as estratégias ao seu tipo de negócio.</p>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-gray-600">Você atua como</span>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={form.profile_type}
                      onChange={(e) => update({ profile_type: e.target.value, profession: '' })}
                    >
                      {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">{professionFieldLabel}</span>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={form.profession}
                      onChange={(e) => update({ profession: e.target.value })}
                    >
                      {professionsSorted.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  {form.profession === 'outro' && (
                    <label className="block">
                      <span className="text-sm text-gray-600">Descreva sua atuação</span>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder={
                          form.profile_type === 'vendas'
                            ? 'Ex.: outro tipo de produto ou serviço que você vende...'
                            : 'Ex.: outra área de atendimento ou especialidade...'
                        }
                        value={(form.area_specific?.atuacao_outra as string) ?? ''}
                        onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                      />
                    </label>
                  )}
                </div>
              </section>
            ) : (
              currentStep && (() => {
                const stepCopy = getStepCopyForProfession(
                  currentStep.id,
                  profession,
                  { title: currentStep.title, description: currentStep.description }
                )
                return (
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">{stepCopy.title}</h2>
                  {stepCopy.description && (
                    <p className="text-xs text-gray-500 mb-2">{stepCopy.description}</p>
                  )}
                  {stepCopy.microcopy && (
                    <p className="text-xs text-indigo-600 mb-4">{stepCopy.microcopy}</p>
                  )}
                  <div className="space-y-4">
                    {currentStep.fields.map((field) => {
                      const label = getFieldLabelForProfession(
                        field.key,
                        profession,
                        PROFILE_FIELD_LABELS[field.key] ?? field.key
                      )
                      const placeholder = getFieldPlaceholderForProfession(field.key, profession)
                      const value = getFieldValue(form, field)
                      const options = field.options ?? getOptionsForProfileField(field.key, form.profile_type || null, form.profession || null)

                      if (field.type === 'multiselect') {
                        const arr = Array.isArray(value) ? value : []
                        return (
                          <div key={field.key}>
                            <span className="text-sm text-gray-600 block mb-2">{label}</span>
                            <div className="flex flex-wrap gap-2">
                              {options.map((o) => (
                                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={arr.includes(o.value)}
                                    onChange={() => toggleArrayField(field, o.value)}
                                  />
                                  {o.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      if (field.type === 'select') {
                        const isDorPrincipal = field.key === 'dor_principal'
                        const showOutraDor = isDorPrincipal && (typeof value === 'string' && value === 'outra')
                        return (
                          <div key={field.key}>
                            <label className="block">
                              <span className="text-sm text-gray-600">{label}</span>
                              <select
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                value={typeof value === 'string' ? value : ''}
                                onChange={(e) => setFieldValue(field, e.target.value)}
                              >
                                <option value="">Selecione</option>
                                {options.map((o) => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                            </label>
                            {showOutraDor && (
                              <label className="block mt-3">
                                <span className="text-sm text-gray-600">Descreva o que está travando</span>
                                <input
                                  type="text"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                  placeholder="Ex.: dificuldade com gestão do consultório, falta de tempo para divulgação..."
                                  value={(form.area_specific?.dor_principal_outra as string) ?? ''}
                                  onChange={(e) => updateAreaSpec('dor_principal_outra', e.target.value)}
                                />
                              </label>
                            )}
                          </div>
                        )
                      }
                      if (field.type === 'number') {
                        return (
                          <label key={field.key} className="block">
                            <span className="text-sm text-gray-600">{label}</span>
                            <input
                              type="number"
                              min={0}
                              step={field.key === 'ticket_medio' ? 0.01 : 1}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              placeholder={placeholder}
                              value={value === '' || value == null ? '' : value}
                              onChange={(e) => setFieldValue(field, e.target.value === '' ? '' : (field.key === 'ticket_medio' ? parseFloat(e.target.value) : parseInt(e.target.value, 10)) || 0)}
                            />
                          </label>
                        )
                      }
                      if (field.type === 'textarea') {
                        return (
                          <label key={field.key} className="block">
                            <span className="text-sm text-gray-600">{label}</span>
                            <textarea
                              rows={field.key === 'observacoes' ? 3 : 2}
                              maxLength={field.key === 'observacoes' ? 1500 : undefined}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              placeholder={placeholder}
                              value={typeof value === 'string' ? value : ''}
                              onChange={(e) => setFieldValue(field, e.target.value)}
                            />
                            {field.key === 'observacoes' && (
                              <span className="text-xs text-gray-400">{(typeof value === 'string' ? value : '').length}/1500</span>
                            )}
                          </label>
                        )
                      }
                      return (
                        <label key={field.key} className="block">
                          <span className="text-sm text-gray-600">{label}</span>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder={placeholder}
                            value={typeof value === 'string' ? value : value === '' ? '' : String(value)}
                            onChange={(e) => setFieldValue(field, e.target.value)}
                          />
                        </label>
                      )
                    })}
                  </div>
                  {stepCopy.reinforcement && (
                    <p className="text-xs text-indigo-600 mt-4">{stepCopy.reinforcement}</p>
                  )}
                </section>
                )
              })()
            )}

            <div className="flex justify-between">
              <div>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setStepIndex((i) => i - 1)}
                    className="px-4 py-2 text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={() => setStepIndex((i) => i + 1)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
                    {nextStepCopy
                      ? (nextStepCopy.title.length > 28
                          ? 'Avançar para próxima etapa'
                          : `Avançar para ${nextStepCopy.title}`)
                      : 'Avançar'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar perfil'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </YladaAreaShell>
    )
  }

  // —— Fallback: formulário completo (tem tipo/profissão mas sem flow, ou compatibilidade) ——
  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Perfil empresarial</h1>
          <p className="text-gray-600 mb-4">
            Suas características, metas, objetivos e contexto. O Noel usa essas informações para personalizar as orientações.
          </p>
        </div>
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.text}
          </div>
        )}
        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
          Essa combinação de área ainda não tem um fluxo específico. Use o formulário completo abaixo.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Contexto</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Você atua como</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profile_type}
                onChange={(e) => update({ profile_type: e.target.value })}
              >
                <option value="">Selecione</option>
                {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">{professionFieldLabel}</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profession}
                onChange={(e) => update({ profession: e.target.value })}
              >
                <option value="">Selecione</option>
                {professionsSorted.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            {form.profession === 'outro' && (
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Descreva sua atuação</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder={
                    form.profile_type === 'vendas'
                      ? 'Ex.: outro tipo de produto ou serviço que você vende...'
                      : 'Ex.: outra área de atendimento ou especialidade...'
                  }
                  value={(form.area_specific?.atuacao_outra as string) ?? ''}
                  onChange={(e) => updateAreaSpec('atuacao_outra', e.target.value)}
                />
              </label>
            )}
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Categoria (mercado)</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: estética, automóveis, nutrição"
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Subcategoria</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.sub_category}
                onChange={(e) => update({ sub_category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Anos de atuação</span>
              <input
                type="number"
                min={0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.tempo_atuacao_anos === '' ? '' : form.tempo_atuacao_anos}
                onChange={(e) => update({ tempo_atuacao_anos: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0 })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Diagnóstico</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Dor principal</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.dor_principal}
                onChange={(e) => update({ dor_principal: e.target.value })}
              >
                <option value="">Selecione</option>
                {getDorPrincipalOptions(form.profile_type || null).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            {form.dor_principal === 'outra' && (
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Descreva o que está travando</span>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex.: dificuldade com gestão do consultório, falta de tempo para divulgação..."
                  value={(form.area_specific?.dor_principal_outra as string) ?? ''}
                  onChange={(e) => updateAreaSpec('dor_principal_outra', e.target.value)}
                />
              </label>
            )}
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Prioridade atual</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: preencher agenda nos próximos 30 dias"
                value={form.prioridade_atual}
                onChange={(e) => update({ prioridade_atual: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Fase do negócio</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.fase_negocio}
                onChange={(e) => update({ fase_negocio: e.target.value })}
              >
                <option value="">Selecione</option>
                {FASE_NEGOCIO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Metas e objetivos</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Metas principais</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.metas_principais}
                onChange={(e) => update({ metas_principais: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Objetivos curto/médio prazo</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.objetivos_curto_prazo}
                onChange={(e) => update({ objetivos_curto_prazo: e.target.value })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Modelo de atuação</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {MODELO_ATUACAO_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.modelo_atuacao.includes(o.value)}
                    onChange={() => {
                      const next = form.modelo_atuacao.includes(o.value)
                        ? form.modelo_atuacao.filter((x) => x !== o.value)
                        : [...form.modelo_atuacao, o.value]
                      update({ modelo_atuacao: next })
                    }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <label>
                <span className="text-sm text-gray-600">Capacidade/semana</span>
                <input
                  type="number"
                  min={0}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.capacidade_semana === '' ? '' : form.capacidade_semana}
                  onChange={(e) => update({ capacidade_semana: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0 })}
                />
              </label>
              <label>
                <span className="text-sm text-gray-600">Ticket médio (R$)</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.ticket_medio === '' ? '' : form.ticket_medio}
                  onChange={(e) => update({ ticket_medio: e.target.value === '' ? '' : parseFloat(e.target.value) || 0 })}
                />
              </label>
            </div>
            <label className="block mt-2">
              <span className="text-sm text-gray-600">Modelo de pagamento</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.modelo_pagamento}
                onChange={(e) => update({ modelo_pagamento: e.target.value })}
              >
                <option value="">Selecione</option>
                {MODELO_PAGAMENTO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Canais e rotina</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {CANAIS_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.canais_principais.includes(o.value)}
                    onChange={() => {
                      const next = form.canais_principais.includes(o.value)
                        ? form.canais_principais.filter((x) => x !== o.value)
                        : [...form.canais_principais, o.value]
                      update({ canais_principais: next })
                    }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Resumo da rotina atual</span>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.rotina_atual_resumo}
                onChange={(e) => update({ rotina_atual_resumo: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Frequência de postagem</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.frequencia_postagem}
                onChange={(e) => update({ frequencia_postagem: e.target.value })}
              />
            </label>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <label>
              <span className="text-sm font-semibold text-gray-700">Observações para o Noel</span>
              <textarea
                rows={3}
                maxLength={1500}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.observacoes}
                onChange={(e) => update({ observacoes: e.target.value })}
              />
              <span className="text-xs text-gray-400">{form.observacoes.length}/1500</span>
            </label>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </div>
        </form>
      </div>
    </YladaAreaShell>
  )
}
