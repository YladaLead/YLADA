'use client'

import React from 'react'

/**
 * Renderiza a resposta do Noel com:
 * - Blocos visuais (FOCO, AÇÃO, ONDE, MÉTRICA)
 * - Links clicáveis: markdown [texto](url) e URLs soltas (https://...)
 */
export default function NoelRespostaView({ texto, className = '' }: { texto: string; className?: string }) {
  if (!texto?.trim()) return null

  // Converte string em nós React com links clicáveis (markdown [t](url) e URLs puras)
  function linkify(str: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let remaining = str

    // Primeiro: links markdown [texto](url)
    const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let lastEnd = 0
    let m
    while ((m = mdRegex.exec(str)) !== null) {
      if (m.index > lastEnd) parts.push(str.slice(lastEnd, m.index))
      parts.push(
        <a
          key={`md-${m.index}`}
          href={m[2]}
          target={m[2].startsWith('http') ? '_blank' : undefined}
          rel={m[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
        >
          {m[1]}
        </a>
      )
      lastEnd = m.index + m[0].length
    }
    if (lastEnd > 0) {
      remaining = str.slice(lastEnd)
    }

    // Depois: URLs soltas (https?://...)
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urlParts: React.ReactNode[] = []
    lastEnd = 0
    while ((m = urlRegex.exec(remaining)) !== null) {
      if (m.index > lastEnd) urlParts.push(remaining.slice(lastEnd, m.index))
      urlParts.push(
        <a
          key={`url-${m.index}`}
          href={m[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
        >
          {m[1]}
        </a>
      )
      lastEnd = m.index + m[0].length
    }
    if (urlParts.length > 0) {
      if (lastEnd < remaining.length) urlParts.push(remaining.slice(lastEnd))
      return [...parts, ...urlParts]
    }
    if (parts.length > 0) return parts
    return [remaining]
  }

  const linhas = texto.split('\n')
  const blocos: Array<{ tipo: 'titulo' | 'sec' | 'texto'; label?: string; conteudo: string }> = []
  let buffer = ''

  const flushBuffer = (label?: string) => {
    if (buffer.trim()) {
      blocos.push({ tipo: label ? 'sec' : 'texto', label, conteudo: buffer.trim() })
      buffer = ''
    }
  }

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i]
    const trim = linha.trim()
    if (/^ANÁLISE DO NOEL/i.test(trim)) {
      flushBuffer()
      blocos.push({ tipo: 'titulo', conteudo: trim })
      continue
    }
    const secMatch = trim.match(/^(\d)\)\s*(.*)$/)
    if (secMatch) {
      flushBuffer()
      const num = secMatch[1]
      const resto = (secMatch[2] || '').trim() || ''
      blocos.push({ tipo: 'sec', label: resto ? `${num}) ${resto}` : `${num})`, conteudo: '' })
      continue
    }
    if (trim === '') {
      flushBuffer()
      continue
    }
    const ultimo = blocos[blocos.length - 1]
    if (ultimo?.tipo === 'sec') {
      ultimo.conteudo += (ultimo.conteudo ? '\n' : '') + trim
    } else {
      buffer += (buffer ? '\n' : '') + linha
    }
  }
  flushBuffer()

  return (
    <div className={`noel-resposta text-sm text-gray-800 space-y-4 ${className}`}>
      {blocos.map((b, i) => {
        if (b.tipo === 'titulo') {
          return (
            <p key={i} className="font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1">
              {b.conteudo}
            </p>
          )
        }
        if (b.tipo === 'sec' && b.label) {
          return (
            <div key={i} className="space-y-1">
              <p className="font-semibold text-gray-700">{b.label}</p>
              <p className="leading-relaxed whitespace-pre-wrap">
                {linkify(b.conteudo)}
              </p>
            </div>
          )
        }
        return (
          <p key={i} className="leading-relaxed whitespace-pre-wrap">
            {linkify(b.conteudo)}
          </p>
        )
      })}
    </div>
  )
}
