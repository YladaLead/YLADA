'use client'

/**
 * ETAPA 1 — CONVICÇÃO. Autodiagnóstico do próprio negócio (Sujeito A) + Noel modo Espelho.
 *
 * Fluxo: intro → quiz (1 pergunta por vez) → devolutiva (perfil + ciclo + gap + 1º ato)
 *        → conversa embutida com o Noel modo Espelho → seguir para a plataforma.
 *
 * É a porta de entrada e o primeiro ato de convicção (blueprint C → C → P, Etapa 1).
 * @see src/lib/conviccao/conviccao-autodiagnostico.ts
 * @see src/app/api/ylada/conviccao/route.ts
 */
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  CONVICCAO_PERGUNTAS,
  type ConviccaoDevolutiva,
} from '@/lib/conviccao/conviccao-autodiagnostico'

interface Props {
  areaCodigo: string
  areaLabel?: string
}

type Etapa = 'intro' | 'quiz' | 'resultado'
type ChatMsg = { role: 'user' | 'assistant'; content: string }

export default function ConviccaoAutodiagnosticoContent({ areaCodigo, areaLabel }: Props) {
  const { session } = useAuth()
  const router = useRouter()
  const authHeader = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}

  const [etapa, setEtapa] = useState<Etapa>('intro')
  const [indice, setIndice] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [devolutiva, setDevolutiva] = useState<ConviccaoDevolutiva | null>(null)

  // Chat Espelho
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const total = CONVICCAO_PERGUNTAS.length
  const perguntaAtual = CONVICCAO_PERGUNTAS[indice]
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const homeHref = `${prefix}/home`

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, chatLoading])

  const responder = async (label: string) => {
    if (!perguntaAtual) return
    const novas = { ...respostas, [perguntaAtual.id]: label }
    setRespostas(novas)

    if (indice + 1 >= total) {
      await concluir(novas)
    } else {
      setIndice((i) => i + 1)
    }
  }

  const concluir = async (todasRespostas: Record<string, string>) => {
    setSalvando(true)
    setErro(null)
    try {
      const res = await fetch('/api/ylada/conviccao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: 'include',
        body: JSON.stringify({ segment: areaCodigo, respostas: todasRespostas }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.devolutiva) {
        setErro(data?.error || 'Não foi possível concluir. Tente de novo.')
        setSalvando(false)
        return
      }
      const dev = data.devolutiva as ConviccaoDevolutiva
      setDevolutiva(dev)
      // Semente da conversa com o Noel: a primeira fala do espelho sai da devolutiva.
      setChat([
        {
          role: 'assistant',
          content: `Li o seu diagnóstico aqui. Deixa eu te fazer uma pergunta, então: o que mais te trava hoje na hora de chegar num cliente novo?`,
        },
      ])
      setEtapa('resultado')
    } catch {
      setErro('Algo deu errado. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const enviarChat = async () => {
    const texto = chatInput.trim()
    if (!texto || chatLoading) return
    const novoHistorico = [...chat, { role: 'user' as const, content: texto }]
    setChat(novoHistorico)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/ylada/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: 'include',
        body: JSON.stringify({
          message: texto,
          conversationHistory: novoHistorico.slice(0, -1),
          segment: areaCodigo,
          area: areaCodigo,
          mode: 'espelho',
        }),
      })
      const data = await res.json().catch(() => ({}))
      const reply =
        (typeof data?.response === 'string' && data.response) ||
        (typeof data?.message === 'string' && data.message) ||
        'Tudo bem. Vamos com calma. Me conta um pouco mais sobre isso.'
      setChat((c) => [...c, { role: 'assistant', content: reply }])
    } catch {
      setChat((c) => [
        ...c,
        { role: 'assistant', content: 'Tive um problema agora. Tenta de novo em um instante.' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (etapa === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 mb-4">
            Diagnóstico do seu negócio
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
            Antes de qualquer ferramenta, vamos olhar o seu negócio no espelho.
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            A maioria das pessoas não cresce por falta de informação. Cresce, ou trava, pela convicção
            de agir. São {total} perguntas rápidas e honestas. Não tem resposta certa nem errada.
          </p>
          <p className="text-xs font-medium text-sky-600 mb-8">
            {total} perguntas · leva 2 minutos · o Noel conversa com você no fim
          </p>
          <button
            type="button"
            onClick={() => setEtapa('quiz')}
            className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
          >
            Começar
          </button>
          {areaLabel && (
            <p className="text-center text-[11px] text-gray-400 mt-4">YLADA · {areaLabel}</p>
          )}
        </div>
      </div>
    )
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (etapa === 'quiz' && perguntaAtual) {
    const progresso = ((indice + 1) / total) * 100
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
              <button
                type="button"
                onClick={() => (indice > 0 ? setIndice((i) => i - 1) : setEtapa('intro'))}
                className="text-sky-600 hover:text-sky-700 hover:underline w-14 text-left"
              >
                ← Voltar
              </button>
              <span className="flex-1 text-center">
                Pergunta {indice + 1} de {total}
              </span>
              <div className="w-14" />
            </div>
            <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 leading-snug">
            {perguntaAtual.texto}
          </h2>

          {salvando ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Lendo suas respostas…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {perguntaAtual.opcoes.map((opcao, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => void responder(opcao.label)}
                  className="w-full text-left py-4 px-4 rounded-xl border-2 border-gray-100 hover:border-sky-300 hover:bg-sky-50 text-gray-700 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opcao.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {erro && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Resultado + chat Espelho ─────────────────────────────────────────────────
  if (etapa === 'resultado' && devolutiva) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Devolutiva */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 mb-4">
              Seu diagnóstico
            </span>
            <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100/80 shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-2xl" />
              <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                  Perfil de convicção
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
                  {devolutiva.titulo}
                </p>
                <p className="text-sm italic text-gray-500 whitespace-pre-line leading-relaxed">
                  {devolutiva.fraseEspelho.replace(' / ', '\n')}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/90 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                O ciclo que você está vivendo
              </p>
              <p className="text-sm leading-relaxed text-gray-800">{devolutiva.oCiclo}</p>
            </div>

            <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 mb-2">
                O que realmente te trava
              </p>
              <p className="text-sm leading-relaxed text-gray-800">{devolutiva.oGap}</p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                Seu primeiro passo
              </p>
              <p className="text-sm leading-relaxed text-gray-800">{devolutiva.primeiroAto}</p>
            </div>
          </div>

          {/* Chat Espelho */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 p-4 sm:p-5">
            <p className="text-sm font-semibold text-gray-900 mb-1">Converse com o Noel</p>
            <p className="text-xs text-gray-500 mb-3">
              Ele vai te ajudar a transformar esse primeiro passo em ação. Sem pressa.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 mb-3">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-sky-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">•</span>
                      <span className="animate-bounce [animation-delay:0.15s]">•</span>
                      <span className="animate-bounce [animation-delay:0.3s]">•</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void enviarChat()
                  }
                }}
                placeholder="Escreva sua resposta…"
                className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void enviarChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="shrink-0 h-11 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>

          {/* Seguir */}
          <button
            type="button"
            onClick={() => router.push(homeHref)}
            className="w-full py-3.5 px-4 bg-white border-2 border-sky-200 hover:border-sky-300 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
          >
            Seguir para a plataforma →
          </button>
          <p className="text-center text-[11px] text-gray-400 pb-4">
            Você pode refazer este diagnóstico quando quiser, nas configurações.
          </p>
        </div>
      </div>
    )
  }

  return null
}
