'use client'

import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { copyTextToClipboard } from '@/lib/clipboard'
import {
  extractProLideresMemberNoelMensagemPronta,
  getProLideresMemberNoelMessageSections,
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
        const key = sec.label || `intro-${i}`
        return (
          <div key={key}>
            <div className={memberProseClass}>
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {sectionMarkdown(sec.label, sec.body)}
              </ReactMarkdown>
            </div>
            {isMensagem && copyText ? <ProLideresMemberNoelCopyReadyButton text={copyText} /> : null}
          </div>
        )
      })}
    </div>
  )
}
