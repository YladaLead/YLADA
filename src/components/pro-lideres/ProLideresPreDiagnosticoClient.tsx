'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'
import { consultoriaAnswersToDisplayRows } from '@/lib/consultoria-form-display'
import {
  PRO_LIDERES_PRE_DIAGNOSTICO_SHARE_IMAGE_PATH,
  sharePreDiagnosticoWithOptionalImage,
} from '@/lib/pro-lideres-pre-diagnostico-share'

type Overview = {
  materialTitle: string
  materialDescription: string | null
  responderUrl: string
}

type ResponseItem = {
  id: string
  submitted_at: string
  respondent_name: string | null
  respondent_email: string | null
  respondent_whatsapp: string | null
  answers: Record<string, unknown>
}

export function ProLideresPreDiagnosticoClient() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [fields, setFields] = useState<ConsultoriaFormField[]>([])
  const [items, setItems] = useState<ResponseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [csvBusy, setCsvBusy] = useState(false)
  const [waBusy, setWaBusy] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [oRes, rRes] = await Promise.all([
        fetch('/api/pro-lideres/pre-diagnostico', { credentials: 'include' }),
        fetch('/api/pro-lideres/pre-diagnostico/responses', { credentials: 'include' }),
      ])
      const oData = await oRes.json().catch(() => ({}))
      if (!oRes.ok) {
        setError((oData as { error?: string }).error || 'Não foi possível carregar o link.')
        setOverview(null)
        setItems([])
        setFields([])
        return
      }
      setOverview({
        materialTitle: String((oData as { materialTitle?: string }).materialTitle ?? ''),
        materialDescription: (oData as { materialDescription?: string | null }).materialDescription ?? null,
        responderUrl: String((oData as { responderUrl?: string }).responderUrl ?? ''),
      })
      const rData = await rRes.json().catch(() => ({}))
      if (!rRes.ok) {
        setError((rData as { error?: string }).error || 'Não foi possível carregar as respostas.')
        setItems([])
        setFields([])
        return
      }
      setItems(((rData as { items?: ResponseItem[] }).items ?? []) as ResponseItem[])
      setFields(((rData as { fields?: ConsultoriaFormField[] }).fields ?? []) as ConsultoriaFormField[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const shareWhatsApp = async () => {
    if (!overview?.responderUrl) return
    setWaBusy(true)
    setError(null)
    try {
      await sharePreDiagnosticoWithOptionalImage(overview.responderUrl)
    } catch {
      setError('Não foi possível abrir a partilha. Tente outra vez ou copie o link.')
    } finally {
      setWaBusy(false)
    }
  }

  const copyLink = async () => {
    if (!overview?.responderUrl) return
    try {
      await navigator.clipboard.writeText(overview.responderUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Não foi possível copiar. Copie manualmente da caixa abaixo.')
    }
  }

  const downloadCsv = async () => {
    setCsvBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/pre-diagnostico/responses?format=csv', {
        credentials: 'include',
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError((j as { error?: string }).error || 'Erro ao gerar CSV.')
        return
      }
      const blob = await res.blob()
      const dispo = res.headers.get('Content-Disposition')
      const m = dispo?.match(/filename="([^"]+)"/)
      const filename = m?.[1] ?? `pre-diagnostico-${new Date().toISOString().slice(0, 10)}.csv`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setCsvBusy(false)
    }
  }

  if (loading && !overview) {
    return <p className="text-sm text-gray-600">A carregar…</p>
  }

  return (
    <div className="max-w-4xl space-y-8">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      {overview ? (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{overview.materialTitle}</h2>
            {overview.materialDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                {overview.materialDescription}
              </p>
            ) : null}
          </div>
          <p className="text-sm text-gray-700">
            Partilhe o link com quem vai preencher o pré-diagnóstico. As respostas ficam associadas ao seu espaço
            Pro Líderes (nome, e-mail e WhatsApp servem também para cadastro posterior).
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="min-h-[44px] touch-manipulation rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              {copied ? 'Copiado.' : 'Copiar link'}
            </button>
            <button
              type="button"
              disabled={waBusy}
              onClick={() => void shareWhatsApp()}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 touch-manipulation rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              <span aria-hidden>💬</span>
              {waBusy ? 'A abrir…' : 'WhatsApp com imagem'}
            </button>
            <a
              href={PRO_LIDERES_PRE_DIAGNOSTICO_SHARE_IMAGE_PATH}
              download="pre-diagnostico-ylada-pro-lideres.png"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Descarregar imagem
            </a>
            <a
              href={overview.responderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Abrir pré-visualização
            </a>
            <button
              type="button"
              disabled={csvBusy || items.length === 0}
              onClick={() => void downloadCsv()}
              className="min-h-[44px] touch-manipulation rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {csvBusy ? 'A gerar…' : 'Descarregar CSV'}
            </button>
            <span className="text-sm text-gray-500">
              {items.length} resposta{items.length === 1 ? '' : 's'}
            </span>
          </div>
          <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">URL pública</label>
          <input
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800"
            value={overview.responderUrl}
            onFocus={(e) => e.target.select()}
          />
          <p className="text-xs leading-relaxed text-gray-500">
            <strong>WhatsApp com imagem:</strong> em telemóvel abre o menu de partilha com o cartão YLADA e o texto;
            escolha WhatsApp para anexar a imagem. Em computador costuma abrir só o texto e o link da imagem — pode
            usar «Descarregar imagem» e anexar manualmente.
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            <strong>Notificação por e-mail:</strong> quando alguém envia o formulário, é enviado um aviso para o
            e-mail de contacto do espaço (em Configurações, se estiver preenchido) ou, em alternativa, para o e-mail da
            conta dona do Pro Líderes. Requer <code className="rounded bg-gray-100 px-1">RESEND_API_KEY</code>{' '}
            configurada no servidor.
          </p>
        </section>
      ) : null}

      {overview?.responderUrl ? (
        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pré-visualização</h2>
            <p className="mt-1 text-sm text-gray-600">
              Vista igual à da pessoa que abre o link (pode fazer scroll dentro da área abaixo).
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-slate-50">
            <iframe
              title="Pré-visualização do pré-diagnóstico"
              src={overview.responderUrl}
              className="h-[min(72vh,680px)] w-full bg-white"
              loading="lazy"
            />
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Respostas recebidas</h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">Ainda não há envios por este link.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Data</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Nome</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">E-mail</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">WhatsApp</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Detalhe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="whitespace-nowrap px-3 py-2 text-gray-800">
                      {new Date(row.submitted_at).toLocaleString('pt-PT')}
                    </td>
                    <td className="max-w-[10rem] truncate px-3 py-2 text-gray-800">{row.respondent_name ?? '—'}</td>
                    <td className="max-w-[12rem] truncate px-3 py-2 text-gray-800">{row.respondent_email ?? '—'}</td>
                    <td className="max-w-[8rem] truncate px-3 py-2 text-gray-800">{row.respondent_whatsapp ?? '—'}</td>
                    <td className="px-3 py-2">
                      <details className="max-w-md">
                        <summary className="cursor-pointer text-blue-700 hover:underline">Ver respostas</summary>
                        <ul className="mt-2 space-y-1.5 rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
                          {consultoriaAnswersToDisplayRows(fields, row.answers).map((line) => (
                            <li key={line.fieldId}>
                              <span className="font-medium text-gray-700">{line.label}:</span>{' '}
                              <span className="whitespace-pre-wrap">{line.value}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
