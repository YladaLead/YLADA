'use client'

/**
 * Criação de link estética em 3 passos: modelo → nome (opcional) → pronto.
 * Caminho secundário discreto: home + Noel (“algo do seu jeito”).
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { ESTETICA_MODELOS_LINK_RAPIDO } from '@/config/estetica-novo-link-modelos'
import { useAuth } from '@/hooks/useAuth'
import { getMensagemWhatsAppDiagnostico } from '@/lib/ylada-compartilhar-diagnostico-copy'
import { ActiveLinksProModal } from '@/components/ylada/ActiveLinksProModal'
import { markHomeActivationComplete } from '@/lib/ylada-pos-onboarding'

type Step = 'pick' | 'adjust' | 'loading' | 'ready'

type CreatedLink = {
  id: string
  slug: string
  url: string
  title: string
  tema: string
}

export default function EsteticaNovoLinkRapidoContent() {
  const areaCodigo = 'estetica' as const
  const areaLabel = 'Estética'
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`
  const homePath = `${prefix}/home`
  const { userProfile } = useAuth()

  const [step, setStep] = useState<Step>('pick')
  const [modeloId, setModeloId] = useState<string | null>(null)
  const [tituloLink, setTituloLink] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreatedLink | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [activeLinksModalMessage, setActiveLinksModalMessage] = useState<string | null>(null)

  const modeloSel = modeloId ? ESTETICA_MODELOS_LINK_RAPIDO.find((m) => m.id === modeloId) : null

  useEffect(() => {
    if (step === 'ready' && created) {
      markHomeActivationComplete()
    }
  }, [step, created])

  const msgNoelPersonal =
    'Quero criar um link totalmente personalizado para minha estética. Por onde começo?'
  const hrefNoelPersonal = `${homePath}?msg=${encodeURIComponent(msgNoelPersonal)}`

  const escolherModelo = (m: (typeof ESTETICA_MODELOS_LINK_RAPIDO)[number]) => {
    setModeloId(m.id)
    setTituloLink(m.defaultTitle)
    setError(null)
    setStep('adjust')
  }

  const voltarPick = () => {
    setStep('pick')
    setModeloId(null)
    setTituloLink('')
    setError(null)
  }

  const criarLink = async () => {
    if (!modeloSel) return
    const title = tituloLink.trim() || modeloSel.defaultTitle
    const tema = modeloSel.tema
    setError(null)
    setCreating(true)
    setStep('loading')
    setLoadingStep(0)

    const steps = ['preparando seu link', 'ajustando perguntas', 'quase pronto']
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
          interpretacao: {
            tema,
            objetivo: 'captar',
            area_profissional: 'estetica',
          },
          title: title.length > 3 ? title : undefined,
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
          setError(limitMsg ?? data?.error ?? 'Não foi possível criar o link.')
        }
        setStep('adjust')
        setCreating(false)
        return
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = data.data.url ?? `${baseUrl}/l/${data.data.slug}`
      const createdTitle = data.data.title ?? title

      setCreated({
        id: data.data.id,
        slug: data.data.slug,
        url,
        title: createdTitle,
        tema,
      })
      setStep('ready')
    } catch {
      clearInterval(timer)
      setError('Erro ao criar. Tente novamente.')
      setStep('adjust')
    } finally {
      setCreating(false)
    }
  }

  const recomendado = ESTETICA_MODELOS_LINK_RAPIDO.filter((m) => m.recomendado)
  const demais = ESTETICA_MODELOS_LINK_RAPIDO.filter((m) => !m.recomendado)

  const secundarioNoel = (
    <div className="pt-4 border-t border-gray-100 mt-4">
      <p className="text-center text-sm text-gray-600 mb-2">Quer algo do seu jeito?</p>
      <Link
        href={hrefNoelPersonal}
        className="block w-full text-center text-sm font-medium text-sky-700 hover:text-sky-900 py-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition-colors"
      >
        Criar com Noel
      </Link>
    </div>
  )

  if (step === 'pick') {
    return (
      <>
        <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
          <div className="max-w-lg mx-auto space-y-5 pb-4">
            <Link href={linksPath} className="text-sm text-sky-600 hover:underline inline-flex items-center gap-1">
              ← Voltar aos links
            </Link>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Escolha um modelo para começar
              </h1>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Um toque e você já segue — ajusta o nome na próxima tela se quiser.
              </p>
            </div>

            {recomendado.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-4 shadow-sm"
              >
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
                  Recomendado pra você
                </p>
                <p className="text-lg font-bold text-gray-900 mb-3">{m.label}</p>
                <button
                  type="button"
                  onClick={() => escolherModelo(m)}
                  className="w-full min-h-[52px] rounded-xl bg-amber-600 text-white text-base font-bold hover:bg-amber-700 transition-colors shadow-md"
                >
                  Usar agora
                </button>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demais.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => escolherModelo(m)}
                  className="rounded-2xl border-2 border-gray-200 bg-white p-4 text-left hover:border-sky-300 hover:bg-sky-50/40 transition-all min-h-[100px] flex flex-col justify-between shadow-sm"
                >
                  <span className="font-semibold text-gray-900 text-base">{m.label}</span>
                  <span className="mt-3 inline-flex items-center text-sm font-bold text-sky-700">Usar esse →</span>
                </button>
              ))}
            </div>

            {secundarioNoel}
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

  if (step === 'adjust' && modeloSel) {
    return (
      <>
        <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
          <div className="max-w-lg mx-auto space-y-5">
            <button
              type="button"
              onClick={voltarPick}
              className="text-sm text-sky-600 hover:underline"
            >
              ← Outro modelo
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ajuste rápido (opcional)</h1>
              <p className="text-sm text-gray-600 mt-2">
                Modelo: <span className="font-medium text-gray-800">{modeloSel.label}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <label htmlFor="titulo-link-estetica" className="block text-sm font-medium text-gray-800">
                Nome do link
              </label>
              <input
                id="titulo-link-estetica"
                type="text"
                value={tituloLink}
                onChange={(e) => setTituloLink(e.target.value)}
                placeholder="Ex: Descubra o que sua pele precisa"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              {error && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
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
                onClick={() => criarLink()}
                disabled={creating}
                className="w-full min-h-[52px] rounded-xl bg-sky-600 px-6 py-4 text-base font-bold text-white hover:bg-sky-700 disabled:opacity-60"
              >
                Continuar
              </button>
            </div>

            {secundarioNoel}
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
    const steps = ['preparando seu link', 'ajustando perguntas', 'quase pronto']
    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[40vh] space-y-6">
          <p className="text-lg font-semibold text-gray-900">Só um instante…</p>
          <ul className="space-y-2 text-sm text-gray-600 w-full max-w-xs">
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

  if (step === 'ready' && created) {
    const nomeProfissional = userProfile?.nome_completo ?? 'Profissional'
    const msgWhats = getMensagemWhatsAppDiagnostico(created.title, nomeProfissional, created.url, created.tema)
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msgWhats)}`

    const copiarLink = () => {
      navigator.clipboard.writeText(created.url)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    }

    return (
      <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
        <div className="max-w-lg mx-auto space-y-6">
          <div className="rounded-2xl border-2 border-emerald-100 bg-white p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Seu link está pronto</h2>
              <p className="text-base font-medium text-gray-800 mt-2">{created.title}</p>
            </div>

            <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-center">
              Agora é só compartilhar
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={copiarLink}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-sky-300 bg-sky-50 px-5 py-4 text-base font-bold text-sky-900 hover:bg-sky-100"
              >
                {linkCopiado ? '✓ Link copiado!' : 'Copiar link'}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-base font-bold text-white hover:bg-emerald-700"
              >
                Compartilhar no WhatsApp
              </a>
              <a
                href={created.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm font-medium text-gray-600 hover:text-gray-900 py-2 underline underline-offset-2"
              >
                Ver como sua cliente vê
              </a>
            </div>

            <div className="flex flex-wrap gap-3 text-sm pt-2 border-t border-gray-100">
              <Link href={`${linksPath}/editar/${created.id}`} className="text-sky-600 hover:underline">
                Ajustar depois
              </Link>
              <a href={`${linksPath}/novo`} className="text-gray-600 hover:underline">
                Outro modelo
              </a>
              <Link href={linksPath} className="text-gray-600 hover:underline">
                Meus links
              </Link>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400 italic px-2">
            Se ela precisar pensar demais, não termina. Quanto antes compartilhar, antes funciona.
          </p>
        </div>
      </YladaAreaShell>
    )
  }

  return null
}
