'use client'

import { useState, useCallback } from 'react'
import type { FluxoCliente, PerguntaFluxoCliente } from '@/types/ylada-flow-legacy'
import { getCoachBemEstarIntroObjetivo } from '@/lib/coach-bem-estar/coach-bem-estar-fluxo-copy'

// ─── Sanitizer — remove referências a Herbalife / MLM / Wellness / Noel ─────

/** Substituições diretas — aplicadas em ordem, case-insensitive */
const SUBSTITUICOES: Array<[RegExp, string]> = [
  // Referências ao agente Noel
  [/a análise noel/gi, 'o acompanhamento'],
  [/análise noel/gi, 'acompanhamento personalizado'],
  [/inteligência noel/gi, 'inteligência do coach'],
  [/o noel/gi, 'o coach'],
  [/\bnoel\b/gi, 'o coach'],
  // Referências ao vertical Wellness
  [/no wellness\b/gi, 'neste diagnóstico'],
  [/do wellness\b/gi, 'deste diagnóstico'],
  [/no (quiz|sistema|programa) wellness/gi, 'neste diagnóstico'],
  [/as mesmas leituras do quiz de ganhos no wellness\s*[—–-]?\s*/gi, ''],
  [/\bwellness\b/gi, 'bem-estar'],
  // Referências a Pro Líderes / recrutamento MLM
  [/pro.?líderes/gi, ''],
  [/oportunidade de negócio/gi, 'próximo passo'],
  [/apresentação de negócio/gi, 'conversa com quem te enviou o link'],
  [/direcioná-las para apresentação de negócio/gi, 'orientar no próximo passo'],
  [/direcioná-los para apresentação de negócio/gi, 'orientar no próximo passo'],
  [/priorizar o próximo passo comercial/gi, 'priorizar o próximo passo'],
  [/\s*Com leitura estratégica das inteligências (?:Noel|o coach)[^.]*\.?\s*/gi, ' '],
  [/\s*A análise (?:Noel|do coach) ajuda[^.]*\.?\s*/gi, ' '],
  [/\s*Com a inteligência (?:Noel|do coach)[^.]*\.?\s*/gi, ' '],
  [/\s*Direcionamento com inteligência (?:Noel|do coach)[^.]*\.?\s*/gi, ' '],
  [/quero conhecer novas oportunidades/gi, 'Quero dar o próximo passo'],
  // Produtos Herbalife
  [/herbalife/gi, ''],
  [/bebidas? funcionais?/gi, 'hábitos saudáveis'],
  [/shake herbalife/gi, ''],
  [/\bnrg\b/gi, ''],
  [/kit energia/gi, ''],
  [/kit acelera/gi, ''],
  [/suplemento herbalife/gi, 'suplemento'],
  [/produtos? herbalife/gi, ''],
  [/linha herbalife/gi, ''],
  [/distribuidor[a]? herbalife/gi, ''],
  [/membro herbalife/gi, ''],
]

/** Termos que, se ainda restarem após substituições, descartam o item inteiro */
const TERMOS_RESIDUAIS = ['herbalife', 'nrg energia', 'kit energia', 'kit acelera']

function sanitizarTexto(texto: string): string {
  if (!texto) return texto

  let resultado = texto
  for (const [regex, substituto] of SUBSTITUICOES) {
    resultado = resultado.replace(regex, substituto)
  }

  // Limpa espaços duplos ou início de frase estranha após remoções
  resultado = resultado
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,—–\-–]+/, '')
    .replace(/[\s,—–\-–]+$/, '')
    .trim()

  // Se ficou muito curto ou vazio após limpeza, retorna mensagem neutra
  if (resultado.length < 15) {
    return 'Com o suporte certo, você pode transformar sua saúde e bem-estar de forma sustentável.'
  }

  return resultado
}

function sanitizarLista(lista: string[]): string[] {
  return lista
    .map(sanitizarTexto)
    .filter((item) => {
      const lower = item.toLowerCase()
      return !TERMOS_RESIDUAIS.some((t) => lower.includes(t)) && item.length >= 10
    })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildWhatsAppUrl(numero: string, mensagem: string, countryCode = 'BR'): string {
  if (!numero) return ''
  const digits = numero.replace(/\D/g, '')
  // Se já tem código do país (mais de 11 dígitos), usa direto; senão adiciona Brasil 55
  const full = digits.length > 11 ? digits : `55${digits}`
  const encoded = encodeURIComponent(mensagem || 'Olá! Quero saber mais.')
  return `https://wa.me/${full}?text=${encoded}`
}

function buildShareText(fluxoNome: string): string {
  return `Fiz um diagnóstico gratuito e valeu muito. Você também deveria fazer: "${fluxoNome}". É rápido, sem cadastro 👇\n`
}

// ─── Scoring de arquétipo ─────────────────────────────────────────────────────

type ArchetypeCode = 'leve' | 'moderado' | 'urgente'

/**
 * Calcula o arquétipo de risco com base nas respostas do usuário.
 * Lógica:
 *  - multipla_escolha: índice da opção escolhida / (qtd_opcoes - 1) → score 0..1
 *  - sim_nao: "Sim" = 1 (sinal de risco), "Não" = 0
 *  - escala: (valor - min) / (max - min) → score 0..1
 *  - texto/numero: ignorado
 * Média ponderada → 0-33%=leve, 34-66%=moderado, 67-100%=urgente
 */
function calcularArchetipo(
  perguntas: PerguntaFluxoCliente[],
  respostas: Record<string, string>,
): ArchetypeCode {
  let totalScore = 0
  let totalMax = 0

  for (const pergunta of perguntas) {
    const resposta = respostas[pergunta.id]
    if (!resposta) continue

    if (pergunta.tipo === 'multipla_escolha' && Array.isArray(pergunta.opcoes) && pergunta.opcoes.length > 1) {
      const idx = pergunta.opcoes.indexOf(resposta)
      const max = pergunta.opcoes.length - 1
      if (idx >= 0) {
        totalScore += idx
        totalMax += max
      }
    } else if (pergunta.tipo === 'sim_nao') {
      totalScore += resposta === 'Sim' ? 1 : 0
      totalMax += 1
    } else if (pergunta.tipo === 'escala') {
      const val = parseInt(resposta, 10)
      const min = (pergunta as { escalaMin?: number }).escalaMin ?? 0
      const max = (pergunta as { escalaMax?: number }).escalaMax ?? 10
      if (!isNaN(val) && max > min) {
        totalScore += val - min
        totalMax += max - min
      }
    }
    // tipo texto/numero: ignorado no scoring
  }

  if (totalMax === 0) return 'moderado'

  const pct = totalScore / totalMax
  if (pct <= 0.33) return 'leve'
  if (pct <= 0.66) return 'moderado'
  return 'urgente'
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface PackagedContent {
  profile_title?: string
  frase_identificacao?: string
  profile_summary?: string
  main_blocker?: string
  consequence?: string
  growth_potential?: string
  dica_rapida?: string
  cta_text?: string
  whatsapp_prefill?: string
  [key: string]: unknown
}

interface FluxoDiagnosticoCoachProps {
  fluxo: FluxoCliente
  whatsappNumber: string
  countryCode?: string
  /** Vendas = saúde/bem-estar; recrutamento = perfil e conversa com quem enviou o link */
  fluxoCategoria?: 'vendas' | 'recrutamento'
}

type Etapa = 'intro' | 'quiz' | 'resultado'

// ─── Badges de arquétipo ──────────────────────────────────────────────────────

const ARCHETYPE_CONFIG: Record<
  ArchetypeCode,
  { label: string; color: string; bg: string; border: string; bar: string }
> = {
  leve: {
    label: 'Atenção Suave',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bar: 'from-emerald-400 to-emerald-600',
  },
  moderado: {
    label: 'Atenção Moderada',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    bar: 'from-amber-400 to-amber-600',
  },
  urgente: {
    label: 'Atenção Urgente',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'from-red-400 to-red-600',
  },
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FluxoDiagnosticoCoach({
  fluxo,
  whatsappNumber,
  countryCode = 'BR',
  fluxoCategoria = 'vendas',
}: FluxoDiagnosticoCoachProps) {
  const [etapa, setEtapa] = useState<Etapa>('intro')
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [inputAtual, setInputAtual] = useState('')
  const [mostrarAnaliseCompleta, setMostrarAnaliseCompleta] = useState(false)

  // Resultado personalizado
  const [archetypeCode, setArchetypeCode] = useState<ArchetypeCode | null>(null)
  const [packedContent, setPackedContent] = useState<PackagedContent | null>(null)
  const [loadingResult, setLoadingResult] = useState(false)

  const perguntas = fluxo.perguntas || []
  const total = perguntas.length
  const perguntaAtual: PerguntaFluxoCliente | undefined = perguntas[indiceAtual]

  // Conteúdo sanitizado (sem Herbalife / Wellness / Noel / MLM)
  const nomeFluxo = sanitizarTexto(fluxo.nome)
  const objetivoFluxo =
    fluxoCategoria === 'recrutamento'
      ? getCoachBemEstarIntroObjetivo(fluxo)
      : sanitizarTexto(fluxo.objetivo || '')
  const ctaFluxo = sanitizarTexto(fluxo.cta || '')

  const diag = {
    ...fluxo.diagnostico,
    titulo: sanitizarTexto(fluxo.diagnostico.titulo),
    descricao: sanitizarTexto(fluxo.diagnostico.descricao),
    mensagemPositiva: sanitizarTexto(fluxo.diagnostico.mensagemPositiva),
    sintomas: sanitizarLista(fluxo.diagnostico.sintomas),
    beneficios: sanitizarLista(fluxo.diagnostico.beneficios),
  }

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    ctaFluxo || `Olá! Fiz o diagnóstico "${nomeFluxo}" e quero saber mais.`,
    countryCode,
  )

  // ── Navegação ───────────────────────────────────────────────────────────────

  const avancar = useCallback(
    async (valor: string) => {
      if (!perguntaAtual) return
      const novasRespostas = { ...respostas, [perguntaAtual.id]: valor }
      setRespostas(novasRespostas)
      setInputAtual('')

      if (indiceAtual + 1 >= total) {
        // Última pergunta — calcular arquétipo e buscar conteúdo empacotado
        const archetype = calcularArchetipo(perguntas, novasRespostas)
        setArchetypeCode(archetype)
        setLoadingResult(true)
        setEtapa('resultado') // Mostra tela de resultado com spinner enquanto carrega

        if (fluxo.id) {
          try {
            const res = await fetch(
              `/api/wellness/coach/packaged-diagnosis?flow_id=${encodeURIComponent(fluxo.id)}&archetype_code=${archetype}`,
            )
            if (res.ok) {
              const json = (await res.json()) as { content?: PackagedContent | null }
              if (json.content && typeof json.content === 'object') {
                setPackedContent(json.content)
              }
            }
          } catch {
            // Silencioso — fallback para resultado estático
          }
        }

        setLoadingResult(false)
      } else {
        setIndiceAtual((i) => i + 1)
      }
    },
    [perguntaAtual, respostas, indiceAtual, total, perguntas, fluxo.id],
  )

  const voltarPergunta = () => {
    if (indiceAtual > 0) setIndiceAtual((i) => i - 1)
    else setEtapa('intro')
  }

  const comecar = () => {
    setIndiceAtual(0)
    setRespostas({})
    setInputAtual('')
    setMostrarAnaliseCompleta(false)
    setArchetypeCode(null)
    setPackedContent(null)
    setLoadingResult(false)
    setEtapa('quiz')
  }

  const compartilhar = async () => {
    const texto = buildShareText(nomeFluxo)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: texto, url: window.location.href })
        return
      } catch {
        // fallback
      }
    }
    // fallback WhatsApp
    const url = `https://wa.me/?text=${encodeURIComponent(texto + window.location.href)}`
    window.open(url, '_blank')
  }

  // ── Tela de Intro ───────────────────────────────────────────────────────────

  if (etapa === 'intro') {
    const badgeLabel =
      fluxoCategoria === 'recrutamento' ? 'Avaliação rápida' : 'Diagnóstico de bem-estar'
    const metaLinha =
      fluxoCategoria === 'recrutamento'
        ? total > 0
          ? `${total} pergunta${total !== 1 ? 's' : ''} · Sem cadastro · Resultado na hora`
          : 'Sem cadastro · Resultado na hora'
        : total > 0
          ? `${total} pergunta${total !== 1 ? 's' : ''} · Sem cadastro · Resultado imediato`
          : 'Sem cadastro · Resultado imediato'

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {badgeLabel}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {nomeFluxo}
          </h1>

          {/* Subtítulo */}
          {objetivoFluxo && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{objetivoFluxo}</p>
          )}

          {/* Tempo estimado */}
          <p className="text-xs font-medium text-sky-600 mb-8 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {metaLinha}
          </p>

          {/* Botão Começar */}
          <button
            type="button"
            onClick={comecar}
            className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
          >
            Começar
          </button>
        </div>
      </div>
    )
  }

  // ── Tela de Perguntas ───────────────────────────────────────────────────────

  if (etapa === 'quiz' && perguntaAtual) {
    const progresso = total > 0 ? ((indiceAtual + 1) / total) * 100 : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8 animate-in fade-in duration-300">
          {/* Header com progresso */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
              <button
                type="button"
                onClick={voltarPergunta}
                className="text-sky-600 hover:text-sky-700 hover:underline w-14 text-left"
              >
                ← Voltar
              </button>
              <span className="flex-1 text-center">
                Pergunta {indiceAtual + 1} de {total}
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

          {/* Pergunta */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 leading-snug">
            {perguntaAtual.texto}
          </h2>

          {/* Opções — Sim/Não */}
          {perguntaAtual.tipo === 'sim_nao' && (
            <div className="space-y-3">
              {['Sim', 'Não'].map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => void avancar(opcao)}
                  className="w-full text-left py-4 px-4 rounded-xl border-2 border-gray-100 hover:border-sky-300 hover:bg-sky-50 text-gray-700 font-medium transition-all duration-200"
                >
                  {opcao}
                </button>
              ))}
            </div>
          )}

          {/* Opções — Múltipla escolha */}
          {perguntaAtual.tipo === 'multipla_escolha' && (
            <div className="space-y-3">
              {perguntaAtual.opcoes.map((opcao, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => void avancar(opcao)}
                  className="w-full text-left py-4 px-4 rounded-xl border-2 border-gray-100 hover:border-sky-300 hover:bg-sky-50 text-gray-700 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opcao}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Opções — Escala */}
          {perguntaAtual.tipo === 'escala' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {Array.from(
                  { length: (perguntaAtual as { escalaMax?: number; escalaMin?: number }).escalaMax! - (perguntaAtual as { escalaMin?: number }).escalaMin! + 1 },
                  (_, i) => (perguntaAtual as { escalaMin?: number }).escalaMin! + i,
                ).map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => void avancar(String(valor))}
                    className="w-12 h-12 rounded-xl border-2 border-gray-100 hover:border-sky-400 hover:bg-sky-50 text-gray-700 font-semibold transition-all duration-200"
                  >
                    {valor}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Mínimo</span>
                <span>Máximo</span>
              </div>
            </div>
          )}

          {/* Texto / Número */}
          {(perguntaAtual.tipo === 'texto' || perguntaAtual.tipo === 'numero') && (
            <div className="space-y-4">
              {perguntaAtual.tipo === 'texto' ? (
                (perguntaAtual.linhas ?? 1) >= 2 ? (
                  <textarea
                    rows={perguntaAtual.linhas ?? 3}
                    value={inputAtual}
                    onChange={(e) => setInputAtual(e.target.value)}
                    placeholder={perguntaAtual.placeholder ?? 'Sua resposta...'}
                    maxLength={perguntaAtual.maxLength}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-sky-400 focus:outline-none resize-none transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={inputAtual}
                    onChange={(e) => setInputAtual(e.target.value)}
                    placeholder={perguntaAtual.placeholder ?? 'Sua resposta...'}
                    maxLength={perguntaAtual.maxLength}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-sky-400 focus:outline-none transition-colors"
                  />
                )
              ) : (
                <input
                  type="number"
                  value={inputAtual}
                  onChange={(e) => setInputAtual(e.target.value)}
                  placeholder={perguntaAtual.placeholder ?? '0'}
                  min={(perguntaAtual as { min?: number }).min}
                  max={(perguntaAtual as { max?: number }).max}
                  step={(perguntaAtual as { step?: number }).step ?? 1}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-sky-400 focus:outline-none transition-colors"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (!inputAtual.trim() && !('opcional' in perguntaAtual && perguntaAtual.opcional)) return
                  void avancar(inputAtual.trim())
                }}
                disabled={!inputAtual.trim() && !('opcional' in perguntaAtual && perguntaAtual.opcional)}
                className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
              >
                Continuar
              </button>
              {'opcional' in perguntaAtual && perguntaAtual.opcional && (
                <button
                  type="button"
                  onClick={() => void avancar('')}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Pular esta pergunta
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Tela de Resultado ───────────────────────────────────────────────────────

  if (etapa === 'resultado') {
    // Loading enquanto busca diagnóstico personalizado
    if (loadingResult) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-4" />
            <p className="text-sm text-gray-500 font-medium">Analisando suas respostas…</p>
          </div>
        </div>
      )
    }

    // ── Resultado personalizado (diagnóstico empacotado) ──────────────────────
    if (packedContent && archetypeCode) {
      const arch = ARCHETYPE_CONFIG[archetypeCode]
      const profileTitle = (packedContent.profile_title as string | undefined) ?? diag.titulo
      const fraseId = packedContent.frase_identificacao as string | undefined
      const summary = packedContent.profile_summary as string | undefined
      const blocker = packedContent.main_blocker as string | undefined
      const consequence = packedContent.consequence as string | undefined
      const growth = packedContent.growth_potential as string | undefined
      const dica = packedContent.dica_rapida as string | undefined
      const ctaPacked = packedContent.cta_text as string | undefined
      const whatsappPrefill = packedContent.whatsapp_prefill as string | undefined

      const whatsappUrlPacked = buildWhatsAppUrl(
        whatsappNumber,
        whatsappPrefill || ctaPacked || ctaFluxo || `Olá! Fiz o diagnóstico "${nomeFluxo}" e quero saber mais.`,
        countryCode,
      )

      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
            {/* Badge resultado + arquétipo */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                Seu resultado
              </span>
              <span
                className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border ${arch.color} ${arch.bg} ${arch.border}`}
              >
                {arch.label}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-1">{nomeFluxo}</p>

            {/* Frase de identificação */}
            {fraseId && (
              <p className="text-sm italic text-gray-500 mb-4 leading-relaxed">
                &ldquo;{fraseId}&rdquo;
              </p>
            )}

            {/* Card principal — título do perfil */}
            <div className={`relative mb-5 overflow-hidden rounded-2xl border shadow-sm ${arch.bg} ${arch.border}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${arch.bar} rounded-l-2xl`} />
              <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${arch.color}`}>
                  Diagnóstico
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{profileTitle}</p>
              </div>
            </div>

            {/* Resumo do perfil */}
            {summary && (
              <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/90 p-4">
                <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
              </div>
            )}

            {/* Bloqueio principal + consequência */}
            {(blocker || consequence) && (
              <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 mb-2">
                  O que está acontecendo
                </p>
                {blocker && (
                  <p className="text-sm text-gray-800 leading-relaxed mb-1">{blocker}</p>
                )}
                {consequence && (
                  <p className="text-sm text-gray-600 leading-relaxed">{consequence}</p>
                )}
              </div>
            )}

            {/* Toggle Ver análise completa */}
            <button
              type="button"
              onClick={() => setMostrarAnaliseCompleta((v) => !v)}
              className="w-full text-sm font-medium text-sky-600 hover:text-sky-700 border border-sky-100 hover:border-sky-200 bg-sky-50/60 hover:bg-sky-50 rounded-xl py-3 px-4 transition-colors mb-4"
            >
              {mostrarAnaliseCompleta ? '↑ Ocultar análise completa' : '↓ Ver análise completa'}
            </button>

            {/* Seção expandida */}
            {mostrarAnaliseCompleta && (
              <>
                {/* Potencial de crescimento */}
                {growth && (
                  <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-2">
                      O que é possível transformar
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{growth}</p>
                  </div>
                )}

                {/* Dica rápida */}
                {dica && (
                  <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                      Dica rápida
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{dica}</p>
                  </div>
                )}

                {/* Próximo passo */}
                <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                    Próximo passo
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este diagnóstico é um ponto de partida. Com o acompanhamento certo, você pode ir muito
                    além do que imagina. Fale com um especialista para aprofundar os resultados.
                  </p>
                </div>
              </>
            )}

            {/* CTA WhatsApp */}
            {whatsappUrlPacked && (
              <div className="space-y-3">
                <a
                  href={whatsappUrlPacked}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full py-4 px-5 bg-[#25D366] hover:bg-[#20BA5A] rounded-xl shadow-lg shadow-green-500/25 transition-colors"
                >
                  <svg className="w-6 h-6 shrink-0" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-white font-semibold text-base leading-tight">Falar com especialista</p>
                    {(ctaPacked || ctaFluxo) && <p className="text-white/80 text-xs mt-0.5 leading-snug">{ctaPacked || ctaFluxo}</p>}
                  </div>
                </a>

                {/* Botão compartilhar */}
                <button
                  type="button"
                  onClick={() => void compartilhar()}
                  className="w-full py-3 px-4 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Indicar para alguém
                </button>
              </div>
            )}

            {/* Refazer */}
            <button
              type="button"
              onClick={comecar}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              ↺ Refazer diagnóstico
            </button>

            {/* Rodapé */}
            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Diagnóstico gerado pelo{' '}
                <span className="font-semibold text-sky-500">Ylada</span>
              </p>
            </div>
          </div>
        </div>
      )
    }

    // ── Resultado estático (fallback — sem conteúdo empacotado no banco) ───────
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          {/* Badge resultado */}
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              Seu resultado
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-1">{nomeFluxo}</p>

          {/* Card principal — diagnóstico */}
          <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100/80 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-2xl" />
            <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                Diagnóstico
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{diag.titulo}</p>
            </div>
          </div>

          {/* Descrição */}
          {diag.descricao && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/90 p-4">
              <p className="text-sm leading-relaxed text-gray-800">{diag.descricao}</p>
            </div>
          )}

          {/* Sintomas — preview de 3 itens quando colapsado */}
          {diag.sintomas.length > 0 && (
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Sinais identificados
              </p>
              <ul className="space-y-2">
                {(mostrarAnaliseCompleta ? diag.sintomas : diag.sintomas.slice(0, 3)).map(
                  (sintoma, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      {sintoma}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* Toggle Ver análise completa */}
          <button
            type="button"
            onClick={() => setMostrarAnaliseCompleta((v) => !v)}
            className="w-full text-sm font-medium text-sky-600 hover:text-sky-700 border border-sky-100 hover:border-sky-200 bg-sky-50/60 hover:bg-sky-50 rounded-xl py-3 px-4 transition-colors mb-4"
          >
            {mostrarAnaliseCompleta ? '↑ Ocultar análise completa' : '↓ Ver análise completa'}
          </button>

          {/* Seção expandida */}
          {mostrarAnaliseCompleta && (
            <>
              {/* Benefícios */}
              {diag.beneficios.length > 0 && (
                <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-3">
                    O que é possível transformar
                  </p>
                  <ul className="space-y-2">
                    {diag.beneficios.map((beneficio, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 text-violet-500 flex-shrink-0">→</span>
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mensagem positiva */}
              {diag.mensagemPositiva && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                    Boa notícia
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{diag.mensagemPositiva}</p>
                </div>
              )}

              {/* Aviso */}
              <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                  Próximo passo
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Este diagnóstico é um ponto de partida. Com o acompanhamento certo, você pode ir muito
                  além do que imagina. Fale com um especialista para aprofundar os resultados.
                </p>
              </div>
            </>
          )}

          {/* CTA WhatsApp */}
          {whatsappUrl && (
            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {ctaFluxo || 'Falar com especialista'}
              </a>

              {/* Botão compartilhar */}
              <button
                type="button"
                onClick={() => void compartilhar()}
                className="w-full py-3 px-4 border-2 border-sky-200 hover:border-sky-300 text-sky-700 hover:bg-sky-50 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Compartilhar resultado
              </button>
            </div>
          )}

          {/* Refazer */}
          <button
            type="button"
            onClick={comecar}
            className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            ↺ Refazer diagnóstico
          </button>

          {/* Rodapé */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400">
              Diagnóstico gerado pelo{' '}
              <span className="font-semibold text-sky-500">Ylada</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fallback — não deve ocorrer
  return null
}
