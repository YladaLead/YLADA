'use client'

import { useState, useEffect, useCallback } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import {
  emptyFormData,
  profileToFormData,
  formDataToPayload,
  DOR_PRINCIPAL_OPTIONS,
  FASE_NEGOCIO_OPTIONS,
  MODELO_PAGAMENTO_OPTIONS,
  MODELO_ATUACAO_OPTIONS,
  CANAIS_OPTIONS,
  ESPECIALIDADES_MED,
  type YladaProfileFormData,
} from '@/types/ylada-profile'
import { PROFILE_TYPE_LABELS, getProfessionsForSegment, type ProfileType } from '@/config/ylada-profile-flows'

interface PerfilEmpresarialViewProps {
  areaCodigo: string
  areaLabel: string
}

export default function PerfilEmpresarialView({ areaCodigo, areaLabel }: PerfilEmpresarialViewProps) {
  const segment = areaCodigo
  const [form, setForm] = useState<YladaProfileFormData>(() => emptyFormData(segment))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(segment)}`, { credentials: 'include' })
      const json = await res.json()
      if (json?.success && json?.data) {
        setForm(profileToFormData(segment, json.data.profile as Record<string, unknown> | null))
      } else {
        setForm(emptyFormData(segment))
      }
    } catch {
      setForm(emptyFormData(segment))
      setMessage({ type: 'error', text: 'Não foi possível carregar o perfil.' })
    } finally {
      setLoading(false)
    }
  }, [segment])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const payload = formDataToPayload(form)
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

  const update = (updates: Partial<YladaProfileFormData>) => setForm((prev) => ({ ...prev, ...updates }))
  const updateAreaSpec = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, area_specific: { ...prev.area_specific, [key]: value } }))

  const toggleArray = (key: 'modelo_atuacao' | 'canais_principais', value: string) => {
    setForm((prev) => {
      const arr = prev[key]
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
      return { ...prev, [key]: next }
    })
  }

  const toggleEspecialidades = (value: string) => {
    setForm((prev) => {
      const arr = (prev.area_specific?.especialidades as string[] | undefined) || []
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
      return { ...prev, area_specific: { ...prev.area_specific, especialidades: next } }
    })
  }

  const especialidades = (form.area_specific?.especialidades as string[] | undefined) || []
  const especialidadeOutra = (form.area_specific?.especialidade_outra as string) || ''

  if (loading) {
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </YladaAreaShell>
    )
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contexto */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Contexto</h2>
            <p className="text-xs text-gray-500 mb-3">
              Definir tipo e profissão ajuda o Noel a dar orientações mais relevantes (fluxo e próximos passos por perfil).
            </p>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Tipo de perfil</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profile_type}
                onChange={(e) => update({ profile_type: e.target.value })}
              >
                <option value="">Selecione (opcional)</option>
                {(Object.entries(PROFILE_TYPE_LABELS) as [ProfileType, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Profissão / tópico</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.profession}
                onChange={(e) => update({ profession: e.target.value })}
              >
                <option value="">Selecione (opcional)</option>
                {getProfessionsForSegment(segment).map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Categoria (mercado)</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: estética, automóveis, nutrição, odontologia"
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Subcategoria (opcional)</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: cabelo, seminovos, high ticket"
                value={form.sub_category}
                onChange={(e) => update({ sub_category: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Anos de atuação na área</span>
              <input
                type="number"
                min={0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.tempo_atuacao_anos === '' ? '' : form.tempo_atuacao_anos}
                onChange={(e) => update({ tempo_atuacao_anos: e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0 })}
              />
            </label>
          </section>

          {/* Motor do Noel */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Diagnóstico (o que está travando agora)</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Dor principal</span>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={form.dor_principal}
                onChange={(e) => update({ dor_principal: e.target.value })}
              >
                <option value="">Selecione</option>
                {DOR_PRINCIPAL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Prioridade atual (o que você quer destravar primeiro)</span>
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

          {/* Metas e objetivos */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Metas e objetivos</h2>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Metas principais</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: aumentar consultas, montar consultório"
                value={form.metas_principais}
                onChange={(e) => update({ metas_principais: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Objetivos curto/médio prazo</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: 40 consultas/mês em 6 meses"
                value={form.objetivos_curto_prazo}
                onChange={(e) => update({ objetivos_curto_prazo: e.target.value })}
              />
            </label>
          </section>

          {/* Modelo de atuação */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Modelo de atuação</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {MODELO_ATUACAO_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.modelo_atuacao.includes(o.value)}
                    onChange={() => toggleArray('modelo_atuacao', o.value)}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <label>
                <span className="text-sm text-gray-600">Capacidade/semana (atendimentos ou fechamentos)</span>
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

          {/* Canais e rotina */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Canais e rotina</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {CANAIS_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.canais_principais.includes(o.value)}
                    onChange={() => toggleArray('canais_principais', o.value)}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <label className="block mb-2">
              <span className="text-sm text-gray-600">Resumo da rotina atual (poucas linhas)</span>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Como está sua semana hoje? O Noel usa isso para sugerir o próximo passo."
                value={form.rotina_atual_resumo}
                onChange={(e) => update({ rotina_atual_resumo: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Frequência de postagem</span>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: 2x/semana, diário"
                value={form.frequencia_postagem}
                onChange={(e) => update({ frequencia_postagem: e.target.value })}
              />
            </label>
          </section>

          {/* Área Med: especialidades */}
          {segment === 'med' && (
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Especialidades (Medicina)</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {ESPECIALIDADES_MED.map((o) => (
                  <label key={o.value} className="inline-flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={especialidades.includes(o.value)}
                      onChange={() => toggleEspecialidades(o.value)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
              {especialidades.includes('outra') && (
                <label className="block mt-2">
                  <span className="text-sm text-gray-600">Outra especialidade</span>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={especialidadeOutra}
                    onChange={(e) => updateAreaSpec('especialidade_outra', e.target.value)}
                  />
                </label>
              )}
            </section>
          )}

          {/* Observações */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <label>
              <span className="text-sm font-semibold text-gray-700">Observações para o Noel</span>
              <textarea
                rows={3}
                maxLength={1500}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Algo mais que o Noel deve saber para orientar você."
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
