'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProLideresMemberMandatoryGap } from '@/lib/pro-lideres-member-mandatory-profile'

export function DadosObrigatoriosClient({
  spaceLabel,
  initialGap,
}: {
  spaceLabel: string
  initialGap: ProLideresMemberMandatoryGap
}) {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/equipe/member-mandatory-profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pro_lideres_share_slug: slug.trim(),
          whatsapp: whatsapp.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      router.replace('/pro-lideres/painel')
      router.refresh()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-10">
      <div>
        <p className="text-sm font-medium text-blue-600">Pro Líderes · Equipe</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Dados para divulgar</h1>
        <p className="mt-2 text-sm text-gray-600">
          Espaço: <strong className="text-gray-900">{spaceLabel}</strong>
        </p>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-4 text-sm leading-relaxed text-sky-950">
        <p className="font-semibold text-sky-950">Porque isto é obrigatório</p>
        <p className="mt-2">
          O teu <strong>slug</strong> é o teu pedaço do link público: fica no fim do endereço, tipo{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-gray-800">…/l/quiz-do-lider/o-teu-slug</code>.
          Assim quem responde ao quiz cai no <strong>teu WhatsApp</strong>, não misturado com o de outra pessoa.
        </p>
        <p className="mt-2">
          Usa <strong>só letras minúsculas, números e hífens</strong> (3 a 40 caracteres), algo que a tua rede
          reconheça — por exemplo o teu nome.
        </p>
        <p className="mt-2">
          O <strong>WhatsApp</strong> tem de ter <strong>DDI + número completo</strong> (no Brasil costuma ser 55 e
          onze dígitos depois do DDI).
        </p>
      </div>

      {(initialGap.missingShareSlug || initialGap.missingWhatsapp) && (
        <p className="text-xs text-amber-900">
          {!initialGap.missingShareSlug && initialGap.missingWhatsapp
            ? 'Falta completar o WhatsApp.'
            : initialGap.missingShareSlug && !initialGap.missingWhatsapp
              ? 'Falta definir o slug.'
              : 'Falta definir o slug e o WhatsApp.'}
        </p>
      )}

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
        ) : null}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-800">O teu slug de divulgação</span>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex.: maria-silva"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-800">WhatsApp (com DDI)</span>
          <input
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="ex.: 5511999998888"
            autoComplete="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-[48px] rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'A guardar…' : 'Guardar e entrar no painel'}
        </button>
      </form>
    </div>
  )
}
