'use client'

type DemoEntry = {
  id: string
  title: string
  subtitle: string | null
  body: string
  how_to_use: string | null
}

const DEMO_ENTRIES: DemoEntry[] = [
  {
    id: 'pl-demo-1',
    title: 'Mensagem 1 — permissão',
    subtitle: 'WhatsApp · 1:1',
    body:
      'Oi, [nome]! Tudo bem com você?\n\nVi seu comentário sobre rotina. Posso te mandar um link bem curtinho do Espaço Saudável só para você ver no seu tempo, sem compromisso nenhum?',
    how_to_use: 'Primeiro contato ou retomada depois de um tempo sem falar.',
  },
  {
    id: 'pl-demo-2',
    title: 'Mensagem 2 — depois que ela disser que sim',
    subtitle: 'WhatsApp · 1:1',
    body:
      'Perfeito, [nome]. Aqui está o link: [cole o link]\n\nQuando puder, me diz o que achou. Se fizer sentido, pensa também em alguém da família que possa gostar — às vezes a gente acaba compartilhando com quem ama.',
    how_to_use: 'Só enviar depois de ela aceitar receber o link.',
  },
  {
    id: 'pl-demo-3',
    title: 'Mensagem 3 — acompanhamento leve',
    subtitle: 'WhatsApp · 1:1',
    body:
      'Oi, [nome]! Passando só para saber se conseguiu abrir. Qualquer dúvida, me chama aqui.',
    how_to_use: 'Um ou dois dias depois, se não houver retorno.',
  },
]

function formatDemoBlock(e: DemoEntry): string {
  const lines: string[] = [e.title]
  if (e.subtitle?.trim()) lines.push('', e.subtitle.trim())
  if (e.body?.trim()) lines.push('', e.body.trim())
  if (e.how_to_use?.trim()) lines.push('', 'Como usar:', e.how_to_use.trim())
  return lines.join('\n')
}

function DemoEntryTeam({
  entry,
  copiedId,
  onCopy,
}: {
  entry: DemoEntry
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}) {
  const block = formatDemoBlock(entry)
  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/25 p-4 shadow-sm ring-1 ring-emerald-100/40 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{entry.title}</h3>
          {entry.subtitle?.trim() ? <p className="mt-0.5 text-sm text-gray-600">{entry.subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void onCopy(entry.id, block)}
          className="min-h-[44px] shrink-0 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          {copiedId === entry.id ? '✓ Copiado' : 'Copiar mensagem'}
        </button>
      </div>
      <pre className="mt-3 max-h-[min(20rem,50vh)] overflow-auto whitespace-pre-wrap rounded-xl bg-white p-3 font-sans text-[15px] leading-relaxed text-gray-800 ring-1 ring-gray-100/90 sm:p-4 sm:text-base">
        {entry.body}
      </pre>
      {entry.how_to_use?.trim() ? (
        <div className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2.5 text-sm text-emerald-950">
          <span className="font-semibold">Quando usar: </span>
          {entry.how_to_use}
        </div>
      ) : null}
    </div>
  )
}

function DemoEntryLeader({
  entry,
  copiedId,
  onCopy,
}: {
  entry: DemoEntry
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}) {
  const block = formatDemoBlock(entry)
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{entry.title}</h3>
          {entry.subtitle?.trim() ? <p className="mt-0.5 text-sm text-gray-600">{entry.subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void onCopy(entry.id, block)}
          className="min-h-[44px] shrink-0 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {copiedId === entry.id ? '✓ Copiado' : 'Copiar bloco'}
        </button>
      </div>
      <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-sm text-gray-800 ring-1 ring-gray-100">
        {entry.body}
      </pre>
      {entry.how_to_use?.trim() ? (
        <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2 text-sm text-sky-950">
          <span className="font-semibold">Como usar: </span>
          {entry.how_to_use}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Textos fictícios só para o painel parecer “preenchido” até o líder criar grupos reais.
 * Não grava na base.
 */
export function ProLideresScriptsDemoShowcase({
  mode,
  copiedId,
  onCopyEntry,
}: {
  mode: 'leader' | 'team'
  copiedId: string | null
  onCopyEntry: (id: string, text: string) => void
}) {
  return (
    <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-b from-violet-50/40 to-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-900">
          Exemplo ilustrativo
        </span>
        <span className="text-xs text-violet-900/80">Não é salvo — some quando existirem grupos reais.</span>
      </div>

      {mode === 'team' ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">Assim a equipe vê para copiar no campo</p>
          <details
            open
            className="rounded-2xl border border-emerald-200/80 bg-white shadow-md ring-1 ring-emerald-100/50"
          >
            <summary className="cursor-pointer list-none px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="block text-base font-bold text-gray-900">Espaço saudável — antes do link</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                      Campo
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-gray-600">Sequência em 3 mensagens (exemplo)</span>
                  <span className="mt-1 text-xs text-gray-500">3 texto(s)</span>
                </span>
                <span className="shrink-0 text-xs font-medium text-gray-400">abrir</span>
              </span>
            </summary>
            <div className="border-t border-gray-100 px-4 pb-4 pt-2 sm:px-5">
              <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-emerald-700">
                {DEMO_ENTRIES.map((e) => (
                  <li key={e.id} className="pl-1">
                    <DemoEntryTeam entry={e} copiedId={copiedId} onCopy={onCopyEntry} />
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">Depois que você preencher (lista do líder)</p>
            <details open className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-gray-900">Espaço saudável — antes do link</span>
                    <span className="mt-0.5 block text-sm text-gray-600">Sequência em 3 mensagens (exemplo)</span>
                    <span className="mt-1 text-xs text-gray-500">3 texto(s)</span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">ver</span>
                </span>
              </summary>
              <div className="border-t border-gray-100 px-4 py-2">
                <p className="mb-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-500">
                  Na versão real: reordenar, editar grupo, equipe vê no painel, apagar…
                </p>
              </div>
              <div className="space-y-3 border-t border-gray-50 p-4 sm:p-5 sm:pt-4">
                <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-blue-700">
                  {DEMO_ENTRIES.map((e) => (
                    <li key={e.id} className="pl-1">
                      <DemoEntryLeader entry={e} copiedId={copiedId} onCopy={onCopyEntry} />
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">O que a equipe vê (só copiar)</p>
            <details
              open
              className="rounded-2xl border border-emerald-200/80 bg-white shadow-md ring-1 ring-emerald-100/50"
            >
              <summary className="cursor-pointer list-none px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="block text-base font-bold text-gray-900">Espaço saudável — antes do link</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                        Campo
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-600">Sequência em 3 mensagens (exemplo)</span>
                    <span className="mt-1 text-xs text-gray-500">3 texto(s)</span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-gray-400">abrir</span>
                </span>
              </summary>
              <div className="border-t border-gray-100 px-4 pb-4 pt-2 sm:px-5">
                <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-emerald-700">
                  {DEMO_ENTRIES.map((e) => (
                    <li key={`${e.id}-team`} className="pl-1">
                      <DemoEntryTeam entry={e} copiedId={copiedId} onCopy={onCopyEntry} />
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
