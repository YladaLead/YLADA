'use client'

/**
 * Tela "Criar diagnóstico em 1 clique" — padrão para todas as áreas (médico, vendedor, estética, etc.).
 * Recebe areaCodigo e areaLabel para links e shell; mesma UX em todas as áreas.
 * Após criar, vai direto para o "momento de ativação": compartilhar para gerar as primeiras respostas.
 */
import { useState } from 'react'
import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { useAuth } from '@/hooks/useAuth'
import { CompartilharDiagnosticoContent } from '@/components/ylada/CompartilharDiagnosticoContent'
import { ActiveLinksProModal } from '@/components/ylada/ActiveLinksProModal'

const META_PRIMEIRAS_RESPOSTAS = 10

function getMensagemWhatsApp(titulo: string, nomeProfissional: string, url: string): string {
  return `Olá! 👋\n\n${titulo}\n\nLeva só 1 minuto. No final você recebe uma análise personalizada.\n\n${url}`
}

/** Sugestões rápidas: valor enviado como tema na API. */
const SUGESTOES_CRIAR = [
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'metabolismo', label: 'Metabolismo' },
  { value: 'energia', label: 'Energia' },
  { value: 'intestino', label: 'Intestino' },
  { value: 'vitalidade_geral', label: 'Hábitos' },
  { value: 'rotina_saudavel', label: 'Rotina' },
] as const

function normalizeTemaETitulo(input: string): { tema: string; title: string } {
  const t = (input || '').trim()
  if (!t) return { tema: 'emagrecimento', title: 'O que pode estar travando seu emagrecimento?' }
  const lower = t.toLowerCase()
  const firstWord = t.split(/\s+/)[0]?.toLowerCase().replace(/\s/g, '') ?? ''
  const temaMap: Record<string, string> = {
    emagrecimento: 'emagrecimento',
    metabolismo: 'metabolismo',
    energia: 'energia',
    intestino: 'intestino',
    habitos: 'vitalidade_geral',
    hábitos: 'vitalidade_geral',
    rotina: 'rotina_saudavel',
    vitalidade: 'vitalidade_geral',
    peso: 'peso_gordura',
    estresse: 'estresse',
    sono: 'sono',
  }
  const tema = temaMap[firstWord] ?? temaMap[lower] ?? (SUGESTOES_CRIAR.some((s) => lower.includes(s.value)) ? SUGESTOES_CRIAR.find((s) => lower.includes(s.value))?.value ?? 'emagrecimento' : 'emagrecimento')
  const title = t.length > 3 ? t : `O que pode estar travando seu ${tema.replace(/_/g, ' ')}?`
  return { tema, title }
}

type Step = 'form' | 'loading' | 'ready' | 'share'
type CreatedLink = { id: string; slug: string; url: string; title: string; questions: { label: string }[] }

export type AreaCodigo = 'ylada' | 'med' | 'psi' | 'odonto' | 'nutra' | 'nutri' | 'coach' | 'psicanalise' | 'perfumaria' | 'seller' | 'estetica' | 'fitness'

export function NovoLinkPageContent({
  areaCodigo,
  areaLabel,
}: {
  areaCodigo: AreaCodigo
  areaLabel: string
}) {
  const linksPath = `${getYladaAreaPathPrefix(areaCodigo)}/links`
  const { userProfile } = useAuth()

  const [step, setStep] = useState<Step>('form')
  const [temaInput, setTemaInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreatedLink | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [activeLinksModalMessage, setActiveLinksModalMessage] = useState<string | null>(null)

  const handleCriar = async (inputOverride?: string) => {
    const text = (inputOverride ?? temaInput).trim()
    if (!text) {
      setError('Digite um tema ou escolha uma sugestão.')
      return
    }
    setError(null)
    setCreating(true)
    setStep('loading')
    setLoadingStep(0)

    const { tema, title } = normalizeTemaETitulo(text)
    const steps = ['identificando objetivo', 'criando perguntas', 'preparando diagnóstico']
    const stepInterval = 900
    const timer = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, steps.length))
    }, stepInterval)

    try {
      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          flow_id: 'diagnostico_risco',
          interpretacao: { tema, objetivo: 'captar' },
          title: title.length > 5 ? title : undefined,
        }),
      })
      const data = await res.json()
      clearInterval(timer)
      setLoadingStep(steps.length)

      if (!data?.success || !data?.data?.id) {
        const limitMsg =
          data?.limit_reached && typeof data?.message === 'string' && data.message.trim()
            ? data.message.trim()
            : null
        if (data?.limit_reached && data?.limit_type === 'active_links' && limitMsg) {
          setActiveLinksModalMessage(limitMsg)
          setError(null)
        } else {
          setError(limitMsg ?? data?.error ?? 'Não foi possível criar o diagnóstico.')
        }
        setStep('form')
        setCreating(false)
        return
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = data.data.url ?? `${baseUrl}/l/${data.data.slug}`
      const createdTitle = data.data.title ?? title

      let questions: { label: string }[] = []
      try {
        const linkRes = await fetch(`/api/ylada/links/by-id/${data.data.id}`, { credentials: 'include' })
        const linkJson = await linkRes.json()
        if (linkJson?.success && linkJson?.data?.config_json?.form?.fields) {
          questions = (linkJson.data.config_json.form.fields as Array<{ label?: string }>).map((f) => ({ label: f.label ?? '' }))
        }
      } catch {
        // ignore
      }

      setCreated({ id: data.data.id, slug: data.data.slug, url, title: createdTitle, questions })
      setStep('share')
    } catch {
      clearInterval(timer)
      setError('Erro ao criar. Tente novamente.')
      setStep('form')
    } finally {
      setCreating(false)
    }
  }

  const handleGerarOutro = () => {
    setCreated(null)
    setTemaInput('')
    setStep('form')
  }

  if (step === 'form') {
    return (
      <>
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-lg mx-auto space-y-6">
          <Link href={linksPath} className="text-sm text-sky-600 hover:underline flex items-center gap-1">
            ← Voltar aos diagnósticos
          </Link>
          <div className="rounded-2xl border-2 border-sky-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <span aria-hidden>🧠</span> Noel
            </p>
            <p className="text-sm text-gray-700 mb-4">
              Vamos criar um diagnóstico rápido para gerar conversas com seus clientes. Sobre qual tema você quer falar?
            </p>
            <input
              type="text"
              value={temaInput}
              onChange={(e) => setTemaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
              placeholder="Ex: emagrecimento depois dos 40"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              autoFocus
            />
            {error && (
              <div
                className={`mt-3 rounded-lg border p-3 text-sm ${
                  /plano gratuito|plano profissional|limite/i.test(error)
                    ? 'border-amber-200 bg-amber-50 text-amber-950'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{error}</p>
                {/plano profissional|limite|plano gratuito/i.test(error) && (
                  <Link
                    href="/pt/precos"
                    className="mt-3 inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Ver planos Pro
                  </Link>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleCriar()}
              disabled={creating}
              className="mt-4 w-full rounded-xl bg-sky-600 px-6 py-4 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              Criar diagnóstico
            </button>
            <p className="mt-4 text-xs text-gray-500 mb-2">Sugestões populares:</p>
            <div className="flex flex-wrap gap-2">
              {SUGESTOES_CRIAR.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleCriar(s.label)}
                  disabled={creating}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-sky-50 hover:border-sky-200"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </YladaAreaShell>
      <ActiveLinksProModal
        open={activeLinksModalMessage !== null}
        onClose={() => setActiveLinksModalMessage(null)}
        message={activeLinksModalMessage ?? ''}
      />
      </>
    )
  }

  if (step === 'loading') {
    const steps = ['identificando objetivo', 'criando perguntas', 'preparando diagnóstico']
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[40vh] space-y-6">
          <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span aria-hidden>🧠</span> Noel analisando...
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {steps.map((label, i) => (
              <li key={label} className={i < loadingStep ? 'text-sky-600 font-medium' : ''}>
                {i < loadingStep ? '✓' : '○'} {label}
              </li>
            ))}
          </ul>
        </div>
      </YladaAreaShell>
    )
  }

  if (step === 'share' && created) {
    const nomeProfissional = userProfile?.nome_completo ?? 'Profissional'
    const msgWhats = getMensagemWhatsApp(created.title, nomeProfissional, created.url)
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msgWhats)}`

    const copiarLink = () => {
      navigator.clipboard.writeText(created.url)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    }

    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-lg mx-auto space-y-6">
          <div className="rounded-2xl border-2 border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 Seu diagnóstico está pronto</h2>
            <p className="text-base font-medium text-gray-800 mb-2">{created.title}</p>
            <p className="text-sm text-gray-600 mb-4">🔗 Link criado</p>

            <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 mb-5">
              <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <span aria-hidden>🧠</span> Noel
              </p>
              <p className="text-sm text-gray-700 mb-1">
                Agora vamos gerar suas primeiras respostas.
              </p>
              <p className="text-sm text-gray-600">
                Cada resposta pode virar uma nova conversa com possível cliente.
              </p>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-4">
              🎯 Primeira meta: {META_PRIMEIRAS_RESPOSTAS} respostas
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Compartilhe seu diagnóstico para receber suas primeiras respostas.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white hover:bg-emerald-700"
              >
                📲 Compartilhar no WhatsApp
              </a>
              <button
                type="button"
                onClick={copiarLink}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-sky-300 bg-sky-50 px-5 py-4 text-base font-semibold text-sky-800 hover:bg-sky-100"
              >
                {linkCopiado ? '✓ Link copiado!' : '🔗 Copiar link'}
              </button>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Outras formas de compartilhar
                </p>
                <CompartilharDiagnosticoContent
                  titulo={created.title}
                  url={created.url}
                  nomeProfissional={nomeProfissional}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`${linksPath}/editar/${created.id}`} className="text-sky-600 hover:underline">
                Editar diagnóstico
              </Link>
              <button type="button" onClick={handleGerarOutro} className="text-gray-600 hover:underline">
                Criar outro
              </button>
              <Link href={linksPath} className="text-gray-600 hover:underline">
                Ver meus links
              </Link>
            </div>
          </div>
        </div>
      </YladaAreaShell>
    )
  }

  return null
}
