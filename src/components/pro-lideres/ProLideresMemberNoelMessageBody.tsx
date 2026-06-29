'use client'

import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { copyTextToClipboard } from '@/lib/clipboard'
import {
  extractProLideresMemberNoelMensagemPronta,
  formatLinkParaEnviarBody,
  getProLideresMemberNoelMessageSections,
  parseLinkParaEnviarSection,
} from '@/lib/pro-lideres-member-noel-response'

function sectionMarkdown(label: string, body: string): string {
  if (!label) return body
  return `**${label}**\n\n${body}`
}

export function ProLideresMemberNoelCopyReadyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="touch-manipulation mt-2 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
      aria-label="Copiar mensagem pronta para o WhatsApp"
    >
      {copied ? (
        <>
          <span aria-hidden>✓</span> Copiado
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copiar mensagem
        </>
      )}
    </button>
  )
}

function ProLideresMemberNoelCopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    const ok = await copyTextToClipboard(url)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="touch-manipulation inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-900 hover:bg-sky-100"
      aria-label="Copiar URL do link"
    >
      {copied ? '✓ Copiado' : 'Copiar URL'}
    </button>
  )
}

function ProLideresMemberNoelLinkBlock({ body }: { body: string }) {
  const formatted = formatLinkParaEnviarBody(body)
  const parsed = parseLinkParaEnviarSection(formatted)
  const urlMatch = formatted.match(/https?:\/\/[^\s)\]>]+/i)
  const url = parsed?.url ?? urlMatch?.[0]?.replace(/[.,;]+$/, '') ?? null
  const label = parsed?.label ?? 'Link'
  const reasonStart = url ? formatted.indexOf(url) + url.length : -1
  const reason = reasonStart >= 0 ? formatted.slice(reasonStart).trim().replace(/^[\s,—–-]+/, '') : ''

  if (!url) {
    return (
      <div className={memberProseClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{formatted}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-sky-900">Link para enviar</p>
      <div className="flex flex-col gap-2 rounded-lg border border-sky-100 bg-sky-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-sm leading-relaxed text-gray-900">
          <span className="font-medium">{label}:</span>{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-sky-700 underline">
            {url}
          </a>
        </p>
        <ProLideresMemberNoelCopyUrlButton url={url} />
      </div>
      {reason ? (
        <div className={memberProseClass}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{reason}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  )
}

const memberProseClass =
  'prose prose-sm max-w-none text-gray-900 prose-p:my-2 prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-li:leading-relaxed prose-strong:text-sky-900 [&_p>strong:only-child]:mt-3 [&_p>strong:only-child]:mb-1.5 [&_p>strong:only-child]:block [&_p>strong:only-child]:font-semibold'

/**
 * Corpo da resposta do Noel membro com botão «Copiar mensagem» no bloco Mensagem pronta.
 */
export function ProLideresMemberNoelMessageBody({ markdown }: { markdown: string }) {
  const sections = getProLideresMemberNoelMessageSections(markdown)
  const copyText = extractProLideresMemberNoelMensagemPronta(markdown)

  if (sections.length === 0) {
    return (
      <div className={memberProseClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{markdown}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sections.map((sec, i) => {
        const isMensagem = sec.label.toLowerCase() === 'mensagem pronta'
        const isLink = sec.label.toLowerCase() === 'link para enviar'
        const key = sec.label || `intro-${i}`
        return (
          <div key={key}>
            {isLink ? (
              <ProLideresMemberNoelLinkBlock body={sec.body} />
            ) : (
              <div className={memberProseClass}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {sectionMarkdown(sec.label, sec.body)}
                </ReactMarkdown>
              </div>
            )}
            {isMensagem && copyText ? <ProLideresMemberNoelCopyReadyButton text={copyText} /> : null}
          </div>
        )
      })}
    </div>
  )
}
