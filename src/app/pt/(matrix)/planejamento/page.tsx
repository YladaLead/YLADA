'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'

const FASES = [
  { id: 1, titulo: 'Fluxo mínimo: Noel usa flow_id + interpretacao', status: 'concluído', desc: 'Noel chama generate com flow_id, interpretacao, questions — não template_id.' },
  { id: 2, titulo: 'Fluxo mínimo: Mapeamento form → motor', status: 'concluído', desc: 'q1, q2... mapeados para symptoms, barriers, etc. no diagnosis API.' },
  { id: 3, titulo: 'Fluxo mínimo: Quiz Pronto para Emagrecer alinhado', status: 'concluído', desc: 'Perguntas compatíveis com mapeamento RISK_DIAGNOSIS.' },
  { id: 4, titulo: 'Fluxo mínimo: Noel sugere antes do link', status: 'concluído', desc: 'Noel descreve o que criou antes de entregar o link.' },
  { id: 5, titulo: 'Fluxo mínimo: Teste E2E', status: 'pendente', desc: 'Teste manual documentado e passando.' },
  { id: 6, titulo: 'Fluxo mínimo: WhatsApp no CTA', status: 'pendente', desc: 'CTA abre WhatsApp com número do perfil ou config.' },
  { id: 7, titulo: 'Sidebar + Planejamento', status: 'concluído', desc: 'Sidebar organizada em blocos; área de planejamento criada.' },
  { id: 8, titulo: 'Área de testes + Lab + Entrada + Leads', status: 'pendente', desc: 'Infraestrutura complementar (após fluxo mínimo).' },
] as const

export default function PlanejamentoPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Planejamento YLADA
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Histórico do que foi planejado, decisões e próximos passos. Execução par a par — cada par aguarda OK antes do próximo.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Fases de execução
          </h2>
          <ul className="space-y-3">
            {FASES.map((fase) => (
              <li
                key={fase.id}
                className={`rounded-xl border p-4 ${
                  fase.status === 'concluído'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {fase.id}. {fase.titulo}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{fase.desc}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      fase.status === 'concluído'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {fase.status === 'concluído' ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Documentos</h2>
          <p className="text-sm text-gray-600">
            <strong>Fluxo mínimo:</strong> <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">docs/FLUXO-MINIMO-YLADA.md</code> — 6 blocos, tarefas, critérios de sucesso.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Plano geral:</strong> <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">docs/PLANO-EXECUCAO-YLADA.md</code> — prioridades e infraestrutura.
          </p>
        </section>
      </div>
    </YladaAreaShell>
  )
}
