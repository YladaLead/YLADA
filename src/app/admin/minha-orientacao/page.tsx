'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import {
  CHECKLIST_TAREFAS_OTIMIZACAO,
  getChecklistStorageKey,
  orientacaoProximoPasso,
  type InteligenciaApiData,
} from '@/lib/admin-orientacao'

function loadChecked(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(getChecklistStorageKey())
    if (!raw) return {}
    const p = JSON.parse(raw) as unknown
    return typeof p === 'object' && p !== null && !Array.isArray(p) ? (p as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function saveChecked(m: Record<string, boolean>) {
  try {
    localStorage.setItem(getChecklistStorageKey(), JSON.stringify(m))
  } catch {
    // ignore
  }
}

function MinhaOrientacaoContent() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<InteligenciaApiData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setChecked(loadChecked())
    setMounted(true)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/inteligencia-ylada', { credentials: 'include' })
        const json = await res.json()
        if (json.success && json.data) setData(json.data as InteligenciaApiData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveChecked(next)
      return next
    })
  }, [])

  const resetSemana = useCallback(() => {
    setChecked({})
    try {
      localStorage.removeItem(getChecklistStorageKey())
    } catch {
      // ignore
    }
  }, [])

  const guia = data ? orientacaoProximoPasso(data) : null
  const feitas = CHECKLIST_TAREFAS_OTIMIZACAO.filter((t) => checked[t.id]).length
  const total = CHECKLIST_TAREFAS_OTIMIZACAO.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 to-white">
      <header className="border-b border-emerald-100 bg-white/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 mb-3 inline-block">
            ← Painel administrativo
          </Link>
          <p className="text-sm font-medium text-emerald-700 mb-1">Rotina de otimização</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Minha orientação</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl leading-relaxed">
            Checklist do que verificar para ir melhorando o negócio com calma — sem olhar tudo todo dia.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            A lista reinicia a cada <strong>semana</strong> (segunda-feira). Marcadores ficam só no seu navegador.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Progresso */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">
              Progresso desta semana:{' '}
              <span className="text-emerald-700 font-bold">
                {mounted ? feitas : '—'}/{total}
              </span>
            </p>
            <button
              type="button"
              onClick={resetSemana}
              className="text-sm text-slate-600 underline hover:text-slate-900"
            >
              Limpar marcas desta semana
            </button>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-[width] duration-300"
              style={{ width: mounted ? `${Math.round((feitas / total) * 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Sugestão dinâmica */}
        {loading && (
          <p className="text-sm text-slate-500">Carregando sugestão do sistema…</p>
        )}
        {!loading && guia && (
          <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6">
            <h2 className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
              Próximo passo (com base nos dados agora)
            </h2>
            <p className="text-sm text-slate-800 mt-2 leading-relaxed">{guia.texto}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {guia.links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {l.label} →
                </Link>
              ))}
              <Link
                href="/admin/inteligencia-ylada"
                className="inline-flex rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50"
              >
              Ver Inteligência completa
              </Link>
            </div>
          </section>
        )}

        {/* Checklist */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Tarefas para otimizar (marque ao fazer)</h2>
          <ul className="space-y-3">
            {CHECKLIST_TAREFAS_OTIMIZACAO.map((item) => (
              <li
                key={item.id}
                className={`rounded-xl border p-4 flex gap-4 items-start transition-colors ${
                  checked[item.id] ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <label className="flex gap-3 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    <span className="font-semibold text-slate-900">{item.titulo}</span>
                    <span className="block text-sm text-slate-600 mt-1">{item.detalhe}</span>
                    {item.href && (
                      <Link
                        href={item.href}
                        className="inline-block mt-2 text-sm font-medium text-emerald-700 hover:underline"
                      >
                        {item.linkLabel ?? 'Abrir'} →
                      </Link>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-slate-100 border border-slate-200 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900 mb-2">Lembrete</p>
          <ul className="list-disc list-inside space-y-1">
            <li>2× por semana nesta página ou na Inteligência já basta.</li>
            <li>Uma mudança por vez; na semana seguinte você vê se o número mudou.</li>
            <li>
              <Link href="/admin/motor-crescimento" className="text-emerald-800 font-medium underline">
                Motor de crescimento
              </Link>{' '}
              — documentação e ideias de teste quando quiser ir além.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default function MinhaOrientacaoPage() {
  return (
    <AdminProtectedRoute>
      <MinhaOrientacaoContent />
    </AdminProtectedRoute>
  )
}
