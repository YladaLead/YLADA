'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import {
  GROWTH_CHECKLIST_STORAGE_VERSION,
  growthOperatorChecklist,
  allGrowthTaskIds,
} from '@/lib/growth-operator-checklist'

type StoredState = {
  version: number
  checked: Record<string, boolean>
  updatedAt: string
}

function storageKey(userId: string) {
  return `ylada-growth-operator-checklist-v${GROWTH_CHECKLIST_STORAGE_VERSION}-${userId}`
}

function loadState(userId: string): Record<string, boolean> {
  if (typeof window === 'undefined' || !userId) return {}
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredState
    if (parsed.version !== GROWTH_CHECKLIST_STORAGE_VERSION || !parsed.checked) return {}
    return parsed.checked
  } catch {
    return {}
  }
}

function saveState(userId: string, checked: Record<string, boolean>) {
  if (typeof window === 'undefined' || !userId) return
  const payload: StoredState = {
    version: GROWTH_CHECKLIST_STORAGE_VERSION,
    checked,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey(userId), JSON.stringify(payload))
}

function MinhasAcoesContent() {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? ''
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!userId) return
    setChecked(loadState(userId))
    setHydrated(true)
  }, [userId])

  const totalTasks = allGrowthTaskIds().length
  const doneCount = useMemo(
    () => allGrowthTaskIds().filter((id) => checked[id]).length,
    [checked]
  )
  const pct = totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100)

  const toggle = useCallback(
    (taskId: string, value: boolean) => {
      setChecked((prev) => {
        const next = { ...prev, [taskId]: value }
        saveState(userId, next)
        return next
      })
    },
    [userId]
  )

  const resetAll = useCallback(() => {
    if (!userId) return
    if (!window.confirm('Zerar todo o progresso deste checklist neste navegador?')) return
    const empty: Record<string, boolean> = {}
    setChecked(empty)
    saveState(userId, empty)
  }, [userId])

  if (authLoading || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-600 text-sm">Carregando…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">Growth • operador</p>
              <h1 className="text-2xl font-bold text-gray-900">Minhas ações</h1>
              <p className="text-sm text-gray-600 mt-1">
                Checklist do passo a passo de captação e validação. O progresso fica salvo neste
                navegador, vinculado à sua conta admin.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                href="/admin/motor-crescimento"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                📚 Motor de crescimento
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                ← Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
              <span>
                {doneCount}/{totalTasks} ({pct}%)
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Zerar progresso
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">
              Documentação: <code className="bg-gray-100 px-1 rounded">docs/growth-engine/</code>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {!hydrated ? (
          <p className="text-sm text-gray-500">Carregando checklist…</p>
        ) : (
          growthOperatorChecklist.map((section) => {
            const sectionTotal = section.tasks.length
            const sectionDone = section.tasks.filter((t) => checked[t.id]).length
            return (
              <section
                key={section.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                      {section.description ? (
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md">
                      {sectionDone}/{sectionTotal}
                    </span>
                  </div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {section.tasks.map((task) => (
                    <li key={task.id} className="px-4 sm:px-5 py-3 flex gap-3 items-start">
                      <input
                        type="checkbox"
                        id={task.id}
                        checked={!!checked[task.id]}
                        onChange={(e) => toggle(task.id, e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor={task.id} className="flex-1 cursor-pointer select-none">
                        <span className="text-sm text-gray-900 leading-relaxed">{task.label}</span>
                        {task.docHint ? (
                          <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                            {task.docHint}
                          </p>
                        ) : null}
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })
        )}
      </main>
    </div>
  )
}

export default function MinhasAcoesPage() {
  return (
    <AdminProtectedRoute>
      <MinhasAcoesContent />
    </AdminProtectedRoute>
  )
}
