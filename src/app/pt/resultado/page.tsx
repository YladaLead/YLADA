'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import DiagnosisDisclaimer from '@/components/ylada/DiagnosisDisclaimer'
import {
  DIAGNOSTICOS,
  DIAGNOSTICOS_RELACIONADOS,
  DIAGNOSTICOS_MAPA,
  type DiagnosticoConfig,
  type PerfilResultado,
} from '@/config/ylada-diagnosticos'

const STORAGE_KEY = 'ylada_diagnosticos_feitos'

function ResultadoContent() {
  const searchParams = useSearchParams()
  const diagnosticoSlug = searchParams.get('diagnostico') || 'comunicacao'
  const perfilParam = searchParams.get('perfil') || 'curiosos'
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
  const configFinal = config || DIAGNOSTICOS.comunicacao

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
        {/* 1️⃣ Perfil identificado */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Seu perfil</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {perfilFinal.titulo}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            {perfilFinal.explicacao}
          </p>
        </div>

        {/* 2️⃣ O que isso normalmente gera (identificação) */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Profissionais com esse perfil normalmente enfrentam situações como:
          </h2>
          <ul className="space-y-2 text-gray-700">
            {perfilFinal.consequencias.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3️⃣ Insight (virada mental — bloco destacado) */}
        <div className="bg-blue-50 rounded-xl p-6 sm:p-8 border-l-4 border-blue-600 mb-10">
          <p className="text-lg sm:text-xl text-gray-900 font-semibold mb-3">
            O problema normalmente não é sua competência.
          </p>
          <p className="text-gray-800 leading-relaxed">
            O problema é que a pessoa chega até você sem entender o próprio problema. Isso faz com que a conversa comece sempre do zero.
          </p>
        </div>

        {/* 4️⃣ Mostrar que existe solução */}
        <div className="mb-10">
          <p className="text-gray-700 leading-relaxed mb-4">
            Profissionais mais estratégicos resolvem isso de uma forma simples:
          </p>
          <p className="text-gray-800 font-medium leading-relaxed">
            Eles usam diagnósticos que ajudam o cliente a entender a própria situação antes da conversa. Assim, quando a pessoa chega para falar com você, ela já entende melhor o valor do que você faz.
          </p>
        </div>

        {/* 5️⃣ Mostrar que isso foi um exemplo (YLADA) */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
          <p className="text-gray-800 font-medium mb-4">
            Este foi apenas um exemplo de diagnóstico.
          </p>
          <p className="text-gray-700 mb-4">
            Com o YLADA, profissionais podem criar diagnósticos como este para:
          </p>
          <ul className="space-y-2 text-gray-700 mb-0">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              atrair clientes mais preparados
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              iniciar conversas mais produtivas
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              explicar seu trabalho com mais clareza
            </li>
          </ul>
        </div>

        {/* 6️⃣ CTA principal */}
        <div className="mb-10">
          <Link
            href="/pt/escolha-perfil"
            className="block w-full text-center px-8 py-5 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            Criar meus diagnósticos com YLADA
          </Link>
          <p className="text-center text-sm text-gray-500 mt-3">
            Acesse a plataforma e comece a aplicar esse método no seu negócio.
          </p>
        </div>

        {/* 7️⃣ Diagnósticos relacionados (máquina de crescimento) */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
            Outros diagnósticos que podem ajudar você
          </h2>
          <div className="space-y-3">
            {relacionados.slice(0, 3).map((item) => (
              <Link
                key={item.titulo}
                href={item.href}
                className="block w-full text-center px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all font-medium text-gray-900"
              >
                {item.titulo} →
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

        {/* 9. Compartilhar (secundário, discreto) */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm mb-3">
            Compartilhar resultado
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={compartilharWhatsApp}
              className="text-sm text-blue-600 hover:underline"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={copiarLink}
              className="text-sm text-blue-600 hover:underline"
            >
              {linkCopiado ? 'Link copiado!' : 'Copiar link'}
            </button>
            <button
              type="button"
              onClick={compartilharLinkedIn}
              className="text-sm text-blue-600 hover:underline"
            >
              LinkedIn
            </button>
          </div>
        </div>

        {/* 9b. Disclaimer — orientação e responsabilidade */}
        <DiagnosisDisclaimer variant="informative" className="mt-10" />

        {/* 10. Powered by YLADA — crescimento orgânico (cada diagnóstico vira divulgação) */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <Link
            href="/pt"
            className="inline-block text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Diagnóstico gerado com YLADA
          </Link>
          <p className="text-gray-600 text-sm mt-4 mb-3">
            Você é profissional da área?
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Crie diagnósticos como esse para iniciar conversas com mais contexto.
          </p>
          <Link
            href="/pt/profissionais"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm transition-colors"
          >
            Conhecer o YLADA
          </Link>
        </div>
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
