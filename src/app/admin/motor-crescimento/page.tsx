'use client'

import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { growthEngineDocs, growthEngineDocUrl } from '@/lib/growth-engine-docs'

const GROWTH_ENGINE_TREE_URL =
  'https://github.com/YladaLead/YLADA/tree/main/docs/growth-engine'

function HubContent() {

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-700 mb-1">Documentação • estratégia</p>
              <h1 className="text-2xl font-bold text-gray-900">Motor de crescimento</h1>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                Ambiente completo de estratégia, agentes e checklists (
                <code className="text-xs bg-gray-100 px-1 rounded">docs/growth-engine</code>
                ). Abra cada arquivo no GitHub ou use o checklist interativo no painel.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                ← Dashboard
              </Link>
              <Link
                href="/admin/minhas-acoes"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                ✅ Ir para Minhas ações
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={GROWTH_ENGINE_TREE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
            >
              📂 Pasta no GitHub
            </a>
            <a
              href={growthEngineDocUrl('README.md')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            >
              📋 Abrir README (índice)
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Links externos: repositório{' '}
            <span className="font-mono">YladaLead/YLADA</span> — branch{' '}
            <span className="font-mono">main</span>. Se o branch padrão for outro, ajuste em{' '}
            <code className="bg-gray-100 px-1 rounded">src/lib/growth-engine-docs.ts</code>.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h2>
        <ul className="grid gap-3 sm:grid-cols-1">
          {growthEngineDocs.map((doc) => (
            <li key={doc.file}>
              <a
                href={growthEngineDocUrl(doc.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-indigo-200 hover:shadow transition-all group"
              >
                <div>
                  <span className="font-medium text-gray-900 group-hover:text-indigo-700">
                    {doc.title}
                  </span>
                  <p className="text-sm text-gray-600 mt-0.5">{doc.description}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{doc.file}</p>
                </div>
                <span className="text-sm text-indigo-600 font-medium shrink-0">Abrir ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default function MotorCrescimentoPage() {
  return (
    <AdminProtectedRoute>
      <HubContent />
    </AdminProtectedRoute>
  )
}
