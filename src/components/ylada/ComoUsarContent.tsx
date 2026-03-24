'use client'

import YladaAreaShell from './YladaAreaShell'

interface ComoUsarContentProps {
  areaCodigo: string
  areaLabel: string
}

/** Seções para materiais futuros: gerar contato, acompanhar cliente, converter conversa. */
const SECOES_PLACEHOLDER = [
  { id: 'gerar-contato', titulo: 'Gerar contato', descricao: 'Materiais sobre como atrair possíveis clientes e iniciar conversas.' },
  { id: 'acompanhar-cliente', titulo: 'Acompanhar cliente', descricao: 'Como manter o relacionamento e qualificar leads.' },
  { id: 'converter-conversa', titulo: 'Converter conversa', descricao: 'Do primeiro contato à decisão de compra ou agendamento.' },
]

export default function ComoUsarContent({ areaCodigo, areaLabel }: ComoUsarContentProps) {
  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Como usar</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Use o YLADA no dia a dia: gerar contato, acompanhar cliente e converter conversa.
          </p>
        </header>

        <div className="space-y-4">
          {SECOES_PLACEHOLDER.map((sec) => (
            <div
              key={sec.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-semibold text-gray-900">{sec.titulo}</h2>
              <p className="text-sm text-gray-600 mt-1">{sec.descricao}</p>
              <p className="text-xs text-gray-400 mt-2">Em breve: material para {areaLabel.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </div>
    </YladaAreaShell>
  )
}
