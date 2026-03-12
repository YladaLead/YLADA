'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import PoweredByYlada from '@/components/ylada/PoweredByYlada'
import {
  DIAGNOSTICOS,
  DIAGNOSTICOS_RELACIONADOS,
  DIAGNOSTICOS_MAPA,
  type DiagnosticoConfig,
  type PerfilResultado,
} from '@/config/ylada-diagnosticos'

const STORAGE_KEY = 'ylada_diagnosticos_feitos'

/** Contexto por área profissional (0–6) — identificado pela pergunta do quiz. Texto curto por segmento. */
const AREA_CONTEXTO: Record<string, { label: string; paragrafo: string }> = {
  '0': { label: 'médica', paragrafo: 'Na área médica, muitas conversas começam quando o paciente ainda não entende o próprio problema. A conversa começa sem contexto.' },
  '1': { label: 'de psicologia', paragrafo: 'Na psicologia, muitas pessoas procuram ajuda sem compreender o que estão sentindo. A primeira conversa precisa começar organizando pensamentos e emoções.' },
  '2': { label: 'de estética', paragrafo: 'Na estética, muitas clientes chegam buscando procedimentos sem compreender as necessidades da pele ou do corpo.' },
  '3': { label: 'de nutrição', paragrafo: 'Na nutrição, muitas pessoas chegam buscando soluções rápidas sem entender os hábitos que influenciam o resultado.' },
  '4': { label: 'de fitness', paragrafo: 'No fitness, muitas pessoas entram em contato sem clareza sobre objetivos e limitações. A conversa precisa começar alinhando expectativas.' },
  '5': { label: 'de consultoria e vendas', paragrafo: 'Em consultoria e vendas, muitos contatos chegam sem entender bem o próprio momento ou necessidade.' },
  '6': { label: 'profissional', paragrafo: 'Em muitas áreas, as conversas começam quando a pessoa ainda não entende a própria situação. Parte do tempo é usada para explicar o contexto.' },
}

/** segment_code (URL) → índice área 0–6 para usar AREA_CONTEXTO. Permite links por segmento. */
const SEGMENT_TO_AREA: Record<string, string> = {
  med: '0',
  medico: '0',
  psi: '1',
  psicanalise: '1',
  estetica: '2',
  nutri: '3',
  nutricionista: '3',
  fitness: '4',
  coach: '5',
  seller: '5',
  perfumaria: '6',
  outro: '6',
}

function ResultadoContent() {
  const searchParams = useSearchParams()
  const diagnosticoSlug = searchParams.get('diagnostico') || 'comunicacao'
  const perfilParam = searchParams.get('perfil') || 'curiosos'
  const segmentParam = searchParams.get('segment')?.toLowerCase()
  const areaParam = segmentParam && SEGMENT_TO_AREA[segmentParam] !== undefined
    ? SEGMENT_TO_AREA[segmentParam]
    : (searchParams.get('area') ?? '0')
  const areaContexto = AREA_CONTEXTO[areaParam] ?? AREA_CONTEXTO['6']
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [diagnosticosFeitos, setDiagnosticosFeitos] = useState<Record<string, { perfil: string }>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? (JSON.parse(raw) as Record<string, { perfil: string }>) : {}
      setDiagnosticosFeitos(data)
    } catch {
      setDiagnosticosFeitos({})
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !diagnosticoSlug || !perfilParam) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? (JSON.parse(raw) as Record<string, { perfil: string }>) : {}
      const updated = { ...data, [diagnosticoSlug]: { perfil: perfilParam } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setDiagnosticosFeitos(updated)
    } catch {
      // ignore
    }
  }, [diagnosticoSlug, perfilParam])

  const config = DIAGNOSTICOS[diagnosticoSlug] as DiagnosticoConfig | undefined
  const perfil = config?.perfis[perfilParam] as PerfilResultado | undefined
  const perfilFinal = perfil || (DIAGNOSTICOS.comunicacao.perfis[perfilParam] as PerfilResultado) || (DIAGNOSTICOS.comunicacao.perfis.curiosos as PerfilResultado)

  const baseHref = diagnosticoSlug === 'comunicacao' ? '/pt/diagnostico' : `/pt/diagnostico/${diagnosticoSlug}`
  const baseUrl =
    (typeof window !== 'undefined' && !window.location.origin.includes('localhost'))
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.com')
  const urlDiagnostico = `${baseUrl.replace(/\/$/, '')}${baseHref}`
  const textoCompartilhar = `Acabei de descobrir meu perfil: ${perfilFinal.titulo}. ${perfilFinal.pct}% dos profissionais estão neste perfil. Descubra o seu: ${urlDiagnostico}`

  const compartilharWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoCompartilhar)}`
    window.location.href = url
  }

  const compartilharLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlDiagnostico)}`, '_blank')
  }

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(textoCompartilhar)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = textoCompartilhar
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    }
  }

  const relacionados = DIAGNOSTICOS_RELACIONADOS[diagnosticoSlug] || DIAGNOSTICOS_RELACIONADOS.comunicacao

  // Máximo 3 situações para manter foco
  const situacoes = (perfilFinal.consequencias || []).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Método YLADA
          </Link>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">
          Interpretação baseada nas suas respostas e na sua área
        </p>

        {/* 1. Perfil identificado — área dinâmica (vinda do quiz: profissão 0–6) */}
        <div className="mb-8 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Análise para profissionais da área {areaContexto.label}
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {areaContexto.paragrafo}
          </p>
        </div>

        {/* 2. Seu perfil — título + subtítulo */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Seu perfil</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {perfilFinal.titulo}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {perfilFinal.explicacao}
          </p>
        </div>

        {/* 3. Situações (máx 3 bullets) */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Profissionais com esse perfil normalmente enfrentam:
          </h2>
          <ul className="space-y-2 text-gray-700">
            {situacoes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Insight principal */}
        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600 mb-8">
          <p className="text-lg text-gray-900 font-semibold mb-2">
            O problema normalmente não é sua competência.
          </p>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
            O problema é que muitas pessoas chegam até você sem entender o próprio problema. Assim, a conversa começa sem contexto.
          </p>
        </div>

        {/* 5. Explicação prática — máx 3 bullets */}
        <div className="mb-8">
          <p className="text-gray-800 font-medium mb-3">
            Quando o cliente entende melhor a própria situação antes da conversa:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              a conversa fica mais objetiva
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              o valor do seu trabalho fica mais claro
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              a decisão acontece com mais segurança
            </li>
          </ul>
        </div>

        {/* 6. Comparação visual */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-red-50 rounded-xl p-5 border border-red-100">
            <p className="font-semibold text-gray-900 mb-3">Sem diagnóstico</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Curiosidade</p>
              <p className="text-gray-400">↓</p>
              <p>Explicação</p>
              <p className="text-gray-400">↓</p>
              <p>Confusão</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <p className="font-semibold text-gray-900 mb-3">Com diagnóstico</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Diagnóstico</p>
              <p className="text-gray-400">↓</p>
              <p>Contexto</p>
              <p className="text-gray-400">↓</p>
              <p>Conversa produtiva</p>
            </div>
          </div>
        </div>

        {/* 7. CTA final */}
        <div className="bg-blue-50 rounded-xl p-6 sm:p-8 border-l-4 border-blue-600 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span aria-hidden>💡</span>
            Imagine usar diagnósticos como este no seu trabalho
          </h2>
          <p className="text-gray-800 mb-4">
            Com o YLADA você pode:
          </p>
          <ul className="space-y-2 text-gray-800 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              atrair clientes mais preparados
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              evitar conversas com curiosos
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              iniciar conversas com mais clareza
            </li>
          </ul>
          <Link
            href="/pt?source=diagnostico"
            className="block w-full text-center px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
          >
            Quero usar diagnósticos no meu trabalho
          </Link>
          <p className="text-center text-xs text-gray-600 mt-4">
            Leva menos de 5 minutos. Não é necessário conhecimento técnico.
          </p>
        </div>

        {/* 7️⃣ Compartilhar resultado — viral */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
            Compartilhar resultado
          </h2>
          <p className="text-center text-gray-600 text-sm mb-4">
            Ajude outros profissionais a descobrirem o perfil deles.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={compartilharWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
            <button
              type="button"
              onClick={copiarLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-all"
            >
              {linkCopiado ? (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Link copiado!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copiar link
                </>
              )}
            </button>
            <button
              type="button"
              onClick={compartilharLinkedIn}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0A66C2] text-white font-medium rounded-xl hover:bg-[#004182] transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
          </div>
        </div>

        {/* 8️⃣ Diagnósticos relacionados — acesso a outros quizzes */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
            Outros diagnósticos que podem ajudar você
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Continue descobrindo seu perfil profissional.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {relacionados.map((item) => (
              <Link
                key={item.titulo}
                href={item.href}
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all font-medium text-gray-900 group"
              >
                <span className="flex-1">{item.titulo}</span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 8. Seu progresso (mapa de crescimento) */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Seu progresso</h2>
          <p className="text-sm text-gray-600 mb-4">
            Complete o mapa de crescimento profissional. Cada diagnóstico revela uma parte do seu posicionamento.
          </p>
          <div className="space-y-3">
            {DIAGNOSTICOS_MAPA.map(({ slug, label }) => {
              const feito = !!diagnosticosFeitos[slug]
              const href = slug === 'comunicacao' ? '/pt/diagnostico' : `/pt/diagnostico/${slug}`
              const isAtual = slug === diagnosticoSlug
              return (
                <div
                  key={slug}
                  className={`flex items-center justify-between gap-4 py-2 px-3 rounded-lg ${
                    isAtual ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-sm font-medium ${
                        feito ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                      }`}
                      aria-hidden
                    >
                      {feito ? '✓' : '☐'}
                    </span>
                    <span className={`font-medium ${feito ? 'text-gray-900' : 'text-gray-700'}`}>
                      {label}
                    </span>
                    {feito && (
                      <span className="text-xs text-gray-500">diagnosticado</span>
                    )}
                  </div>
                  {feito ? (
                    isAtual ? (
                      <span className="text-sm text-blue-600 font-medium">Você está aqui</span>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Refazer
                      </Link>
                    )
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Fazer diagnóstico →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 9. Powered by YLADA — crescimento orgânico */}
        <PoweredByYlada variant="fullCaptacao" className="mt-10" />
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">YLADA</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">Método</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/precos" className="hover:text-gray-700">Preços</Link>
        </div>
      </footer>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  )
}
