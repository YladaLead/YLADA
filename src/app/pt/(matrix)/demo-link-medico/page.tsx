'use client'

/**
 * Demo: o que o médico vê quando escolhe emagrecimento + Calculadora de Projeção em 100 dias.
 * Simula a entrega do link criado.
 */
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

const DEMO_URL = '/l/abc123' // slug fictício
const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://exemplo.com'

export default function DemoLinkMedicoPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-xl mx-auto space-y-6">
        <header>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Demo — visão do médico</p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">Link criado</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Você escolheu <strong>Emagrecimento</strong> e <strong>Calculadora de Projeção em 100 dias</strong>. Aqui está o que você recebe.
          </p>
        </header>

        {/* O que o médico vê: link pronto */}
        <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Seu link está pronto</h2>
          <p className="text-sm text-gray-600 mb-3">
            Copie e compartilhe com pacientes ou possíveis pacientes. Quando eles acessam, preenchem a calculadora e recebem uma projeção realista.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 truncate">
              {BASE}{DEMO_URL}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(`${BASE}${DEMO_URL}`)}
              className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Copiar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Título: <strong>Calculadora de Projeção em 100 dias — Emagrecimento</strong>
          </p>
        </section>

        {/* Preview: o que o paciente vê */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Prévia: o que seu paciente vê</h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Calculadora de Projeção em 100 dias — Emagrecimento</h3>
              <p className="text-sm text-gray-600 mt-0.5">Projeção realista gera engajamento e sensação de controle.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Peso atual (kg)</label>
                <input type="number" placeholder="Ex.: 85" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta de peso (kg)</label>
                <input type="number" placeholder="Ex.: 72" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Prazo (dias) — ex.: 100</label>
                <input type="number" placeholder="100" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nível de consistência (1–10)</label>
                <input type="number" placeholder="Ex.: 7" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" readOnly />
              </div>
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-green-600 py-3 text-sm font-medium text-white opacity-90"
            >
              Ver resultado
            </button>
            <p className="text-xs text-gray-500 text-center">
              Após preencher → projeção min/max + botão &quot;Quero calibrar minha meta&quot; → WhatsApp
            </p>
          </div>
        </section>

        {/* Resumo do fluxo */}
        <section className="rounded-xl border border-gray-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Resumo do fluxo</h2>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Você escolheu <strong>Emagrecimento</strong></li>
            <li>Escolheu <strong>Calculadora de Projeção em 100 dias</strong></li>
            <li>O link foi criado com as 4 perguntas acima</li>
            <li>O paciente preenche → recebe projeção realista (min/max) em tempo real</li>
            <li>Clique no botão → abre WhatsApp com mensagem pré-preenchida para você</li>
          </ol>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Configure o número do WhatsApp no link para o botão funcionar.
          </p>
        </section>

        <a href="/pt/links" className="inline-block text-sm text-blue-600 hover:underline">
          ← Voltar para Links
        </a>
      </div>
    </YladaAreaShell>
  )
}
