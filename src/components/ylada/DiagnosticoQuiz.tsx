'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import {
  DIAGNOSTICOS,
  PERGUNTA_AREA,
  PERGUNTA_TIPO,
  calcularPerfil,
  type DiagnosticoConfig,
} from '@/config/ylada-diagnosticos'

interface DiagnosticoQuizProps {
  slug: string
  /** Override para variantes SEO (ex: agenda-nutricionista) */
  variantOverride?: { tituloCurto: string; descricaoStart: string; bulletsStart?: string[] }
}

export default function DiagnosticoQuiz({ slug, variantOverride }: DiagnosticoQuizProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const config = DIAGNOSTICOS[slug] as DiagnosticoConfig | undefined

  const areaParam = searchParams.get('area')
  const areaFromHome = areaParam !== null ? parseInt(areaParam, 10) : null
  const hasAreaFromHome = areaFromHome !== null && !Number.isNaN(areaFromHome) && areaFromHome >= 0 && areaFromHome <= 6

  const q1Param = searchParams.get('q1')
  const q1FromHome = q1Param !== null ? parseInt(q1Param, 10) : null
  const hasQ1FromHome = slug === 'comunicacao' && q1FromHome !== null && !Number.isNaN(q1FromHome) && q1FromHome >= 0 && q1FromHome <= 2

  const fromHome = searchParams.get('fromHome') === '1'
  const fromArea = searchParams.get('fromArea') // 'perfumaria' | 'odonto' quando area=6, para definir tipo
  const problemaParam = searchParams.get('problema')
  const problemaFromHome = problemaParam !== null ? parseInt(problemaParam, 10) : null
  const hasProblemaFromHome = slug === 'comunicacao' && problemaFromHome !== null && !Number.isNaN(problemaFromHome) && problemaFromHome >= 0 && problemaFromHome <= 2

  const [iniciado, setIniciado] = useState(false)
  const [respostas, setRespostas] = useState<Record<string, number>>({})
  const [etapaAtual, setEtapaAtual] = useState(0)

  useEffect(() => {
    // Fluxo por área (med=0, psi=1, estética=2, nutri=3, fitness=4, seller=5, odonto/perfumaria=6): não pergunta área nem tipo — vai direto às perguntas.
    const areaSkipToContent = hasAreaFromHome && (areaFromHome === 0 || areaFromHome === 1 || areaFromHome === 2 || areaFromHome === 3 || areaFromHome === 4 || areaFromHome === 5 || areaFromHome === 6) && !iniciado
    if (slug === 'comunicacao' && areaSkipToContent) {
      const tipo = areaFromHome === 6 ? (fromArea === 'perfumaria' ? 1 : 0) : 0 // perfumaria = vendedor, odonto = liberal
      setRespostas({
        problema: fromHome && hasProblemaFromHome ? problemaFromHome! : 2,
        area: areaFromHome,
        tipo,
      })
      setEtapaAtual(3) // primeira pergunta de conteúdo (q1)
      setIniciado(true)
    } else if (fromHome && hasProblemaFromHome && !iniciado) {
      setRespostas({ problema: problemaFromHome })
      setEtapaAtual(1)
      setIniciado(true)
    } else if (fromHome && !iniciado) {
      setEtapaAtual(0)
      setIniciado(true)
    } else if (hasQ1FromHome && !fromHome && !iniciado) {
      setRespostas({ problema: 1, area: 6, tipo: 0, q1: q1FromHome })
      setEtapaAtual(4)
      setIniciado(true)
    } else if (hasAreaFromHome && !iniciado) {
      setRespostas({ area: areaFromHome })
      setEtapaAtual(1)
      setIniciado(true)
    }
  }, [slug, hasAreaFromHome, hasQ1FromHome, hasProblemaFromHome, fromHome, fromArea, areaFromHome, q1FromHome, problemaFromHome, iniciado])

  if (!config) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">Diagnóstico não encontrado.</p>
        <Link href="/pt/diagnostico" className="text-blue-600 hover:underline">
          Voltar ao diagnóstico de comunicação
        </Link>
      </div>
    )
  }

  const PERGUNTAS_AQUECIMENTO = [PERGUNTA_AREA, PERGUNTA_TIPO]
  const PERGUNTAS_MAIN = config.perguntas
  // Comunicacao já tem area e tipo dentro de config.perguntas — não duplicar
  const PERGUNTAS = slug === 'comunicacao'
    ? config.perguntas
    : [...PERGUNTAS_AQUECIMENTO, ...PERGUNTAS_MAIN]

  const perguntaAtual = PERGUNTAS[etapaAtual]
  const totalPerguntas = PERGUNTAS.length
  const todasRespondidas = Object.keys(respostas).length === totalPerguntas

  const handleResposta = (valor: number | null) => {
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: valor ?? 0 }))
    if (etapaAtual < totalPerguntas - 1) {
      setEtapaAtual((e) => e + 1)
    }
  }

  const handleVerDiagnostico = () => {
    const perguntasScore = slug === 'comunicacao'
      ? PERGUNTAS_MAIN.filter((p) => !['area', 'tipo'].includes(p.id))
      : PERGUNTAS_MAIN
    const pontuacao = perguntasScore.reduce((acc, p) => acc + (respostas[p.id] ?? 0), 0)
    const perfil = calcularPerfil(config, pontuacao)
    const area = respostas['area'] ?? 0
    const tipo = respostas['tipo'] ?? 0
    const params = new URLSearchParams({ diagnostico: slug, perfil, area: String(area), tipo: String(tipo) })
    router.push(`/pt/resultado?${params.toString()}`)
  }

  const baseHref = slug === 'comunicacao' ? '/pt/diagnostico' : `/pt/diagnostico/${slug}`

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
        {!iniciado ? (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {variantOverride?.tituloCurto ?? config.tituloCurto}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              {variantOverride?.descricaoStart ?? config.descricaoStart}
            </p>
            <ul className="space-y-2 text-gray-700 mb-6 text-left max-w-sm mx-auto">
              {(variantOverride?.bulletsStart ?? config.bulletsStart).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
              <p className="text-sm font-semibold text-gray-900">Você vai descobrir:</p>
              <p className="flex items-start gap-2 text-gray-700">
                <span className="text-green-600 mt-0.5">✔</span>
                qual bloqueio está limitando seus resultados
              </p>
              <p className="flex items-start gap-2 text-gray-700">
                <span className="text-green-600 mt-0.5">✔</span>
                seu perfil neste tema
              </p>
              <p className="flex items-start gap-2 text-gray-700">
                <span className="text-green-600 mt-0.5">✔</span>
                como melhorar seus resultados
              </p>
            </div>
            <p className="text-sm font-medium text-blue-600 mb-6">
              ⏱ Leva menos de 1 minuto
            </p>
            <button
              type="button"
              onClick={() => setIniciado(true)}
              className="inline-flex items-center justify-center w-full max-w-xs mx-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              Começar diagnóstico
            </button>
            <p className="text-sm text-gray-500 mt-6">
              Mais de 500 profissionais já fizeram este diagnóstico.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {config.nome}
              </h1>
              <p className="text-sm text-gray-600">
                Leva menos de 1 minuto.
              </p>
            </div>

            <div
              className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-200"
              data-quiz-pergunta={etapaAtual + 1}
              data-quiz-total={totalPerguntas}
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Pergunta {etapaAtual + 1} de {totalPerguntas}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${((etapaAtual + 1) / totalPerguntas) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6" id="quiz-pergunta-texto">
                {perguntaAtual.texto}
              </h2>

              <div className="space-y-3" role="group" aria-label={`Pergunta ${etapaAtual + 1} de ${totalPerguntas}`}>
                {perguntaAtual.opcoes.map((opcao, idx) => (
                  <button
                    key={opcao.label + String(idx)}
                    type="button"
                    onClick={() => handleResposta(opcao.valor ?? null)}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
                    data-cta="quiz-option"
                    data-question-index={etapaAtual + 1}
                    data-option-index={idx + 1}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>

              {etapaAtual > 0 && (
                <button
                  type="button"
                  onClick={() => setEtapaAtual((e) => e - 1)}
                  className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ← Voltar
                </button>
              )}
            </div>

            {/* Botão no final: sempre visível na última pergunta; habilitado quando todas respondidas. data-cta para automação. */}
            {(todasRespondidas || etapaAtual === totalPerguntas - 1) && (
              <div className="mt-8 text-center" data-quiz-step="result-cta">
                <button
                  type="button"
                  onClick={todasRespondidas ? handleVerDiagnostico : undefined}
                  disabled={!todasRespondidas}
                  className="inline-flex items-center justify-center w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  data-cta="ver-diagnostico"
                  data-enabled={todasRespondidas ? 'true' : 'false'}
                  aria-live="polite"
                >
                  Ver diagnóstico
                </button>
                {!todasRespondidas && etapaAtual === totalPerguntas - 1 && (
                  <p className="text-sm text-gray-500 mt-2" data-hint="last-question">
                    Responda à última pergunta para gerar seu diagnóstico.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">YLADA</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">Método</Link>
        </div>
      </footer>
    </div>
  )
}
