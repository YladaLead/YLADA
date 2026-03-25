'use client'

import { useState, useRef } from 'react'
import {
  getDestaqueCardCompartilhar,
  getMensagemWhatsAppDiagnostico,
  getTextoPostInstagramDiagnostico,
  getTextoStoryDiagnostico,
} from '@/lib/ylada-compartilhar-diagnostico-copy'

export interface CompartilharDiagnosticoProps {
  titulo: string
  url: string
  nomeProfissional: string
  /** Número de pessoas que já fizeram o diagnóstico (opcional). */
  contador?: number
  /** Tema do link (ex. `meta.theme_raw`) para alinhar convites ao assunto. */
  tema?: string | null
}

export function CompartilharDiagnosticoContent({
  titulo,
  url,
  nomeProfissional,
  contador,
  tema,
}: CompartilharDiagnosticoProps) {
  const [copiadoQual, setCopiadoQual] = useState<'post' | 'story' | 'whatsapp' | null>(null)
  const [baixando, setBaixando] = useState<'post' | 'story' | null>(null)
  const postRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  const baixarImagem = async (tipo: 'post' | 'story', nomeArquivo: string) => {
    const el = tipo === 'post' ? postRef.current : storyRef.current
    if (!el) return
    setBaixando(tipo)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = nomeArquivo
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // fallback: usuário pode capturar a tela
    } finally {
      setBaixando(null)
    }
  }

  const copiar = (tipo: 'post' | 'story' | 'whatsapp', texto: string) => {
    navigator.clipboard.writeText(texto)
    setCopiadoQual(tipo)
    setTimeout(() => setCopiadoQual(null), 2000)
  }

  const textoPost = getTextoPostInstagramDiagnostico(titulo, nomeProfissional, url, tema)
  const textoStory = getTextoStoryDiagnostico(nomeProfissional, url, titulo, tema)
  const msgWhats = getMensagemWhatsAppDiagnostico(titulo, nomeProfissional, url, tema)
  const destaqueCard = getDestaqueCardCompartilhar(tema)

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Compartilhar como conteúdo
      </h4>

      {/* Post para Instagram */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Post para Instagram</p>
        <div
          ref={postRef}
          className="mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-sky-100"
          style={{ width: 280, aspectRatio: '1' }}
        >
          <div className="h-full flex flex-col p-4 justify-between text-center">
            <div>
              <p className="font-semibold text-gray-900 text-sm line-clamp-2">{titulo}</p>
              <p className="text-xs text-gray-600 mt-1">{nomeProfissional}</p>
            </div>
            <div className="rounded-lg bg-white/80 py-2 px-3">
              <p className="text-xs font-medium text-indigo-700 line-clamp-2">{destaqueCard}</p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">Responder o diagnóstico →</p>
            </div>
            {contador != null && contador > 0 && (
              <p className="text-[10px] text-gray-500">{contador} pessoas já fizeram</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={() => copiar('post', textoPost)}
            className="text-xs py-2 px-3 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200"
          >
            {copiadoQual === 'post' ? '✓ Copiado!' : 'Copiar texto do post'}
          </button>
          <button
            type="button"
            onClick={() => baixarImagem('post', 'post-instagram-diagnostico.png')}
            disabled={baixando === 'post'}
            className="text-xs py-2 px-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {baixando === 'post' ? 'Gerando...' : 'Baixar imagem'}
          </button>
        </div>
      </div>

      {/* Story */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Story</p>
        <div
          ref={storyRef}
          className="mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-violet-100"
          style={{ width: 160, aspectRatio: '9/16' }}
        >
          <div className="h-full flex flex-col p-3 justify-between text-center">
            <p className="font-semibold text-gray-900 text-xs line-clamp-2">{titulo}</p>
            <div className="rounded-lg bg-white/80 py-2 px-2">
              <p className="text-[10px] font-medium text-violet-700 line-clamp-3">{destaqueCard}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Link na bio 👇</p>
            </div>
            {contador != null && contador > 0 && (
              <p className="text-[9px] text-gray-500">{contador} já fizeram</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copiar('story', textoStory)}
            className="text-xs py-2 px-3 rounded-lg bg-violet-100 text-violet-700 font-medium hover:bg-violet-200"
          >
            {copiadoQual === 'story' ? '✓ Copiado!' : 'Copiar texto do story'}
          </button>
          <button
            type="button"
            onClick={() => baixarImagem('story', 'story-diagnostico.png')}
            disabled={baixando === 'story'}
            className="text-xs py-2 px-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-60"
          >
            {baixando === 'story' ? 'Gerando...' : 'Baixar imagem'}
          </button>
        </div>
      </div>

      {/* Mensagem para WhatsApp */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Mensagem para WhatsApp</p>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {msgWhats}
        </div>
        <button
          type="button"
          onClick={() => copiar('whatsapp', msgWhats)}
          className="text-xs py-2 px-3 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200"
        >
          {copiadoQual === 'whatsapp' ? '✓ Copiado!' : 'Copiar mensagem'}
        </button>
      </div>
    </div>
  )
}
