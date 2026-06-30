'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { copyTextToClipboard } from '@/lib/clipboard'
import { isNoelDesafioConducaoEnabled } from '@/lib/porta-unica/porta-unica-flag'
import { NOEL_LAB_CENARIOS, type LabCenario } from '@/lib/porta-unica/noel-lab-cenarios'

/**
 * Laboratório da condução (matriz): roda cenários roteirizados de ponta a ponta contra
 * `/api/ylada/noel` (mesma API, conta logada) e mostra a conversa + o link REAL gerado.
 * Pra testar líder e usuário final em lote no Preview, sem cadastrar conta a cada teste.
 * Atrás da flag `NEXT_PUBLIC_NOEL_DESAFIO_CONDUCAO_ENABLED`. Não fica no menu (página de teste).
 */
type Turno = { role: 'user' | 'assistant'; content: string }
type LinkCtx = { url?: string; title?: string; link_id?: string }
type Estado = 'idle' | 'running' | 'done' | 'error'
type Resultado = { transcript: Turno[]; status: Estado; link?: LinkCtx; error?: string }

const PAUSA_MS = 400

export default function NoelLabPage() {
  const authenticatedFetch = useAuthenticatedFetch()
  const [resultados, setResultados] = useState<Record<string, Resultado>>({})
  const [rodandoTudo, setRodandoTudo] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)

  const flagOn = isNoelDesafioConducaoEnabled()

  const rodarCenario = useCallback(
    async (c: LabCenario) => {
      setResultados((r) => ({ ...r, [c.id]: { transcript: [], status: 'running' } }))
      let historia: Turno[] = []
      let link: LinkCtx | null = null
      try {
        for (const fala of c.turns) {
          const res = await authenticatedFetch('/api/ylada/noel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: fala,
              conversationHistory: historia,
              area: 'ylada',
              desafio: c.desafio,
              locale: 'pt',
              lastLinkContext: link ?? undefined,
            }),
          })
          const data = (await res.json().catch(() => ({}))) as {
            response?: string
            lastLinkContext?: LinkCtx | null
            error?: string
          }
          if (!res.ok) throw new Error(data.error || `Falha (${res.status})`)
          const resposta = (data.response || '').trim()
          historia = [
            ...historia,
            { role: 'user', content: fala },
            { role: 'assistant', content: resposta || '(sem texto)' },
          ]
          if (data.lastLinkContext?.url) link = data.lastLinkContext
          setResultados((r) => ({
            ...r,
            [c.id]: { transcript: historia, status: 'running', link: link ?? undefined },
          }))
          await new Promise((res2) => setTimeout(res2, PAUSA_MS))
        }
        setResultados((r) => ({
          ...r,
          [c.id]: { transcript: historia, status: 'done', link: link ?? undefined },
        }))
      } catch (e) {
        setResultados((r) => ({
          ...r,
          [c.id]: {
            transcript: historia,
            status: 'error',
            link: link ?? undefined,
            error: e instanceof Error ? e.message : 'Erro desconhecido',
          },
        }))
      }
    },
    [authenticatedFetch]
  )

  const rodarTodos = useCallback(async () => {
    setRodandoTudo(true)
    for (const c of NOEL_LAB_CENARIOS) {
      await rodarCenario(c)
    }
    setRodandoTudo(false)
  }, [rodarCenario])

  const copiar = useCallback(async (id: string, url: string) => {
    const ok = await copyTextToClipboard(url)
    if (!ok) return
    setCopiado(id)
    setTimeout(() => setCopiado((p) => (p === id ? null : p)), 2000)
  }, [])

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-medium text-sky-600">Laboratório · Condução (matriz)</p>
        <h1 className="text-2xl font-bold text-gray-900">Testes em lote do Noel</h1>
        <p className="mt-2 text-sm text-gray-600">
          Cada cartão roda uma conversa roteirizada de ponta a ponta contra o Noel real (mesma API da{' '}
          <strong>ylada.com</strong>), na sua conta logada, e mostra a transcrição + o <strong>link real</strong>{' '}
          gerado. Abra o link gerado pra testar o lado do <strong>usuário final</strong> (quem responde o diagnóstico).
        </p>
        <p className="mt-2 text-xs text-amber-800">
          Avisos: passa pelas APIs reais (OpenAI tem custo) e cria links de verdade na sua conta. Em conta{' '}
          <strong>Free</strong> só o 1º link é gerado (limite de 1 link ativo); use conta Pro/admin pra rodar vários.
        </p>
        {!flagOn ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            A flag <span className="font-mono">NEXT_PUBLIC_NOEL_DESAFIO_CONDUCAO_ENABLED</span> está{' '}
            <strong>desligada</strong> neste build. A condução não roda. Ligue a flag no Preview e refaça o deploy.
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={rodandoTudo}
              onClick={() => void rodarTodos()}
              className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-800 disabled:opacity-50"
            >
              {rodandoTudo ? 'Rodando todos…' : `Rodar todos os cenários (${NOEL_LAB_CENARIOS.length})`}
            </button>
            <Link href="/pt/home" className="text-sm font-medium text-sky-700 hover:underline">
              ← Voltar ao Noel
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {NOEL_LAB_CENARIOS.map((c) => {
          const r = resultados[c.id]
          return (
            <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {c.papel === 'lider' ? 'Líder' : 'Liberal'} · desafio: {c.desafio.key}
                  </p>
                  <h2 className="text-base font-semibold text-gray-900">{c.label}</h2>
                </div>
                <button
                  type="button"
                  disabled={!flagOn || r?.status === 'running' || rodandoTudo}
                  onClick={() => void rodarCenario(c)}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {r?.status === 'running' ? 'Rodando…' : r?.status === 'done' ? 'Rodar de novo' : 'Rodar'}
                </button>
              </div>

              {r?.status === 'error' ? (
                <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {r.error}
                </p>
              ) : null}

              {r?.link?.url ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <span className="text-sm font-semibold text-emerald-900">Link gerado:</span>
                  <a
                    href={r.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-emerald-800 underline break-all"
                  >
                    {r.link.title || r.link.url}
                  </a>
                  <button
                    type="button"
                    onClick={() => void copiar(c.id, r.link!.url!)}
                    className="rounded border border-emerald-300 bg-white px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                  >
                    {copiado === c.id ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              ) : r?.status === 'done' ? (
                <p className="mt-2 text-sm text-amber-800">
                  Conversa concluída, mas nenhum link foi gerado (veja a transcrição: pode ter faltado o gatilho de
                  aprovação/WhatsApp, ou o limite Free de 1 link foi atingido).
                </p>
              ) : null}

              {r?.transcript?.length ? (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600">
                    Ver transcrição ({r.transcript.length} mensagens)
                  </summary>
                  <ul className="mt-2 space-y-3">
                    {r.transcript.map((t, i) => (
                      <li
                        key={i}
                        className={`rounded-lg border p-3 ${
                          t.role === 'assistant' ? 'border-sky-200 bg-sky-50/60' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {t.role === 'assistant' ? 'Noel' : 'Profissional (simulado)'}
                        </p>
                        <div className="prose prose-sm mt-1 max-w-none text-gray-900 prose-p:my-1">
                          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{t.content}</ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
