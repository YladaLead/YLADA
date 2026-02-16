'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { TrilhaNeed, TrilhaProgress } from '@/types/trilha'

interface TrilhaNeedsListProps {
  /** Base path para links (ex.: /pt/med/trilha) */
  basePath: string
}

export default function TrilhaNeedsList({ basePath }: TrilhaNeedsListProps) {
  const [needs, setNeeds] = useState<TrilhaNeed[]>([])
  const [progress, setProgress] = useState<TrilhaProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [needsRes, progressRes] = await Promise.all([
          fetch('/api/trilha/needs?steps=1', { credentials: 'include' }),
          fetch('/api/trilha/me/progress', { credentials: 'include' })
        ])
        const needsData = await needsRes.json()
        const progressData = await progressRes.json()
        if (needsData.success && needsData.data?.needs) setNeeds(needsData.data.needs)
        else setNeeds([])
        if (progressData.success && progressData.data?.progress) setProgress(progressData.data.progress)
        else setProgress([])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar')
        setNeeds([])
        setProgress([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const progressByStepId: Record<string, TrilhaProgress> = {}
  progress.forEach((p) => {
    progressByStepId[p.step_id] = p
  })

  const fundamentos = needs.filter((n) => n.type === 'fundamento')
  const necessidades = needs.filter((n) => n.type === 'necessidade')

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-gray-600">Carregando trilha...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-800">{error}</p>
        <p className="text-sm text-red-600 mt-2">Verifique se as tabelas da trilha existem (migrations 202 e 203).</p>
      </div>
    )
  }

  if (!needs.length) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
        <p className="text-amber-800">Nenhuma necessidade cadastrada ainda.</p>
        <p className="text-sm text-amber-700 mt-2">Execute as migrations 202 e 203 no Supabase.</p>
      </div>
    )
  }

  const renderNeedBlock = (list: TrilhaNeed[], title: string) => (
    <div key={title} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="space-y-3">
        {list.map((need) => (
          <div key={need.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">{need.title}</h3>
            {need.description_short && (
              <p className="text-sm text-gray-600 mt-1">{need.description_short}</p>
            )}
            {need.steps && need.steps.length > 0 && (
              <ul className="mt-3 space-y-2">
                {need.steps.map((step) => {
                  const prog = progressByStepId[step.id]
                  const isDone = prog?.status === 'done'
                  const isCurrent = prog?.status === 'in_progress' || prog?.status === 'stuck'
                  return (
                    <li key={step.id}>
                      <Link
                        href={`${basePath}/step/${step.id}`}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isCurrent
                            ? 'bg-blue-50 text-blue-800 font-medium'
                            : isDone
                              ? 'text-gray-600 hover:bg-gray-50'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{isDone ? '✓' : isCurrent ? '→' : '○'}</span>
                        <span>{step.code}</span>
                        <span>{step.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Escolha um passo abaixo. Ao concluir, preencha a reflexão para o Noel usar no seu acompanhamento.
        </p>
      </div>
      {fundamentos.length > 0 && renderNeedBlock(fundamentos, 'Fundamentos (sempre em destaque)')}
      {necessidades.length > 0 && renderNeedBlock(necessidades, 'Necessidades (menu principal)')}
    </div>
  )
}
