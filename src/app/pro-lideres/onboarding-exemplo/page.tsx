'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import {
  emptyLeaderOnboardingFormValues,
  ProLideresLeaderOnboardingForm,
  type LeaderOnboardingFormValues,
} from '@/components/pro-lideres/ProLideresLeaderOnboardingForm'

/** Pré-visualização interna: mesmo layout do onboarding real; não grava na base de dados. */
export default function ProLideresLeaderOnboardingExemploPage() {
  const [form, setForm] = useState<LeaderOnboardingFormValues>(() => ({
    ...emptyLeaderOnboardingFormValues(),
    displayName: 'Maria Exemplo',
    teamName: 'Equipe Sul',
    whatsapp: '5511999999999',
    leaderAge: '38',
    herbalifeYears: '4',
    careerBeforeHerbalife: 'Comércio e vendas',
    teamTotalPeople: '18',
    teamLeadersCount: '4',
    teamDistinctLines: '3',
    primaryGoal: 'Duplicar o acompanhamento semanal com cada líder',
    mainChallenge: 'Consistência de follow-up com quem está a começar',
    focusNotes: '',
  }))

  const [demoSent, setDemoSent] = useState(false)

  const onFormChange = (field: keyof LeaderOnboardingFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDemoSent(true)
  }

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-amber-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
          <strong>Pré-visualização (exemplo)</strong> — vês o mesmo ecrã que o líder. Isto{' '}
          <strong>não envia</strong> nem grava dados. Para testar o fluxo real, usa um link criado em{' '}
          <Link href="/admin/pro-lideres/onboarding" className="font-semibold underline">
            Admin → Pro Líderes onboarding
          </Link>
          .
        </div>

        <div className="mb-5 flex justify-center">
          <Image
            src={YLADA_OG_FALLBACK_LOGO_PATH}
            alt="YLADA"
            width={190}
            height={54}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {demoSent ? (
          <div className="space-y-3 text-center">
            <h1 className="text-xl font-bold text-gray-900">(Exemplo) Enviado</h1>
            <p className="text-sm text-gray-600">
              Na versão real, aqui apareceria a confirmação e os dados seriam guardados. Podes voltar a editar abaixo
              para testar o layout.
            </p>
            <button
              type="button"
              onClick={() => setDemoSent(false)}
              className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Voltar ao formulário
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-center text-xl font-bold text-gray-900">Onboarding do líder</h1>
            <p className="text-center text-sm text-gray-600">
              E-mail vinculado: <strong>exemplo@lider.com</strong> <span className="text-gray-400">(fictício)</span>
            </p>
            <p className="text-center text-xs text-gray-500">
              Prazo:{' '}
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}{' '}
              <span className="text-gray-400">(simulado)</span>
            </p>

            <ProLideresLeaderOnboardingForm
              values={form}
              onChange={onFormChange}
              onSubmit={onSubmit}
              submitLabel="Enviar (exemplo — não grava)"
            />
          </div>
        )}
      </div>
    </div>
  )
}
