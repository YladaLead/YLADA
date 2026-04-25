'use client'

/**
 * Onboarding padrão para todas as áreas YLADA: boas-vindas, nome + telefone, depois redireciona para o próximo passo.
 * Nutri: usa /api/nutri/profile e redireciona para /diagnostico.
 * Demais áreas: usa /api/ylada/profile (area_specific: nome, whatsapp) e redireciona para /home.
 */
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  JOIAS_AREA_SPECIFIC_FUNIL_FOCO,
  JOIAS_AREA_SPECIFIC_JEWELRY_LINE,
  JOIAS_LINHA_QUERY_KEY,
  isValidJoiasLinhaProduto,
} from '@/config/joias-linha-produto'
import { getOnboardingCopyForArea } from '@/config/onboarding-by-area'
import { isJoiasFunilFoco } from '@/lib/joias-demo-cliente-data'
import { YLADA_POS_ONBOARDING_STORAGE_KEY } from '@/lib/ylada-pos-onboarding'

export type OnboardingAreaCodigo =
  | 'ylada'
  | 'med'
  | 'psi'
  | 'odonto'
  | 'nutra'
  | 'nutri'
  | 'coach'
  | 'psicanalise'
  | 'perfumaria'
  | 'seller'
  | 'estetica'
  | 'fitness'
  | 'joias'

const AREA_SEGMENT_YLADA: OnboardingAreaCodigo[] = [
  'ylada',
  'med',
  'psi',
  'odonto',
  'nutra',
  'coach',
  'psicanalise',
  'perfumaria',
  'seller',
  'estetica',
  'fitness',
  'joias',
]

export interface OnboardingPageContentProps {
  areaCodigo: OnboardingAreaCodigo
  areaLabel: string
  /** Se já tiver concluído onboarding (ex.: já tem diagnóstico), redireciona para esta URL. Nutri usa isso. */
  redirectIfDone?: string
  /** URL para onde enviar após salvar (ex.: /pt/nutri/diagnostico ou /pt/estetica/home). */
  redirectAfterSave: string
  /** Texto da prova social (opcional). */
  proofText?: string
  /** Versão minimalista: menos texto, foco no formulário e CTA (filosofia "explique menos, venda mais"). */
  minimal?: boolean
}

export function OnboardingPageContent({
  areaCodigo,
  areaLabel,
  redirectIfDone,
  redirectAfterSave,
  proofText,
  minimal = false,
}: OnboardingPageContentProps) {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  /** Header Authorization quando há sessão — evita 401 quando cookies não são enviados (ex.: acesso direto por link). */
  const authHeader = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [telefone, setTelefone] = useState('')
  const [countryCode, setCountryCode] = useState('BR')
  const [salvando, setSalvando] = useState(false)
  const [preparando, setPreparando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const isNutri = areaCodigo === 'nutri'
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const copy = getOnboardingCopyForArea(areaCodigo, areaLabel)
  const displayProofText = proofText ?? copy.proofText

  const loadProfile = async () => {
    if (!user) return
    const fallbackName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || ''
    try {
      if (isNutri) {
        const res = await fetch('/api/nutri/profile', { credentials: 'include', headers: { ...authHeader } })
        if (res.ok) {
          const data = await res.json()
          const p = data.profile
          setNomeCompleto(p?.nome || fallbackName)
          if (p?.whatsapp) setTelefone(p.whatsapp)
          if (p?.countryCode) setCountryCode(p.countryCode || 'BR')
        } else {
          setNomeCompleto(fallbackName)
        }
      } else if (AREA_SEGMENT_YLADA.includes(areaCodigo)) {
        const res = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(areaCodigo)}`, { credentials: 'include', headers: { ...authHeader } })
        if (res.ok) {
          const data = await res.json()
          const p = data?.data?.profile
          const as = (p?.area_specific || {}) as Record<string, unknown>
          setNomeCompleto(as?.nome ? String(as.nome) : fallbackName)
          if (as?.whatsapp) setTelefone(String(as.whatsapp))
          if (as?.countryCode) setCountryCode(String(as.countryCode || 'BR'))
        } else {
          setNomeCompleto(fallbackName)
        }
      } else {
        setNomeCompleto(fallbackName)
      }
    } catch {
      setNomeCompleto(fallbackName)
    }
  }

  useEffect(() => {
    if (!user) return
    loadProfile()
  }, [user])

  useEffect(() => {
    if (loading || !user) {
      setChecking(false)
      return
    }
    if (!redirectIfDone) {
      setChecking(false)
      return
    }
    const check = async () => {
      if (isNutri) {
        try {
          const response = await fetch('/api/nutri/diagnostico', { credentials: 'include', headers: { ...authHeader } })
          if (response.ok) {
            const data = await response.json()
            if (data.hasDiagnostico) {
              router.replace(redirectIfDone)
              return
            }
          }
        } catch {
          // ignore
        }
      } else if (AREA_SEGMENT_YLADA.includes(areaCodigo)) {
        try {
          const res = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(areaCodigo)}`, { credentials: 'include', headers: { ...authHeader } })
          if (res.ok) {
            const data = await res.json()
            const p = data?.data?.profile
            const as = (p?.area_specific || {}) as Record<string, unknown>
            const temNome = as?.nome && String(as.nome).trim().length >= 2
            const temWhatsapp = as?.whatsapp && String(as.whatsapp).replace(/\D/g, '').length >= 10
            const temPerfilEmpresarial = p?.profile_type && p?.profession
            if (temNome && temWhatsapp && temPerfilEmpresarial) {
              router.replace(redirectIfDone)
              return
            }
            if (temNome && temWhatsapp) {
              router.replace('/pt/perfil-empresarial')
              return
            }
          }
        } catch {
          // ignore
        }
      }
      setChecking(false)
    }
    check()
  }, [user, loading, router, redirectIfDone, isNutri, areaCodigo])

  const telefoneLimpo = telefone.replace(/\D/g, '')
  const nomePreenchido = nomeCompleto.trim().length >= 2
  const telefonePreenchido = telefoneLimpo.length >= 10
  const podeContinuar = nomePreenchido && telefonePreenchido && !salvando

  const handleComecar = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!podeContinuar) return
    setErro(null)
    setSalvando(true)
    try {
      if (isNutri) {
        const response = await fetch('/api/nutri/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          credentials: 'include',
          body: JSON.stringify({
            nome: nomeCompleto.trim(),
            whatsapp: telefoneLimpo,
            countryCode,
          }),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          setErro(data.error || 'Não foi possível salvar. Tente de novo.')
          setSalvando(false)
          return
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('nutri_veio_do_onboarding', 'true')
          sessionStorage.setItem('nutri_veio_do_onboarding_timestamp', Date.now().toString())
        }
      } else {
        const resGet = await fetch(`/api/ylada/profile?segment=${encodeURIComponent(areaCodigo)}`, { credentials: 'include', headers: { ...authHeader } })
        let existingAreaSpecific: Record<string, unknown> = {}
        if (resGet.ok) {
          const dataGet = await resGet.json()
          const p = dataGet?.data?.profile
          if (p?.area_specific && typeof p.area_specific === 'object') {
            existingAreaSpecific = { ...(p.area_specific as Record<string, unknown>) }
          }
        }
        const joiasFunilExtras: Record<string, unknown> = {}
        if (areaCodigo === 'joias' && typeof window !== 'undefined') {
          try {
            const sp = new URLSearchParams(window.location.search)
            const linha = sp.get(JOIAS_LINHA_QUERY_KEY)
            const foco = sp.get('nicho')
            if (linha && isValidJoiasLinhaProduto(linha)) {
              joiasFunilExtras[JOIAS_AREA_SPECIFIC_JEWELRY_LINE] = linha
            }
            if (foco && isJoiasFunilFoco(foco)) {
              joiasFunilExtras[JOIAS_AREA_SPECIFIC_FUNIL_FOCO] = foco
            }
          } catch {
            /* URL inválida */
          }
        }
        const response = await fetch('/api/ylada/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          credentials: 'include',
          body: JSON.stringify({
            segment: areaCodigo,
            area_specific: {
              ...existingAreaSpecific,
              ...joiasFunilExtras,
              nome: nomeCompleto.trim(),
              whatsapp: telefoneLimpo,
              countryCode,
            },
          }),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          setErro(data.error || 'Não foi possível salvar. Tente de novo.')
          setSalvando(false)
          return
        }
      }

      setSalvando(false)
      setPreparando(true)
      if (typeof window !== 'undefined' && AREA_SEGMENT_YLADA.includes(areaCodigo) && !isNutri) {
        try {
          sessionStorage.setItem(YLADA_POS_ONBOARDING_STORAGE_KEY, '1')
        } catch {
          /* storage indisponível */
        }
      }
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = redirectAfterSave
        } else {
          router.push(redirectAfterSave)
        }
      }, 1000)
    } catch {
      setErro('Algo deu errado. Tente novamente.')
      setSalvando(false)
    }
  }

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (preparando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-sky-600 mb-3">🧠 NOEL</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Noel está preparando suas perguntas…</p>
        </div>
      </div>
    )
  }

  /** Logo padrão YLADA (Ida) em todas as áreas. */
  const logoSrc = '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Image
            src={logoSrc}
            alt={`YLADA ${areaLabel}`}
            width={200}
            height={60}
            className="h-12 w-auto mx-auto mb-6"
            priority
          />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-100">
          <div className={minimal ? 'text-center mb-8' : 'text-center mb-8'}>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {copy.welcomeTitle}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {copy.valueSubtitle}
            </p>
            {!minimal && (
              <>
                <p className="text-gray-600 leading-relaxed mb-2">
                  A YLADA foi criada para ajudar profissionais a:
                </p>
                <ul className="text-gray-600 text-left list-disc list-inside max-w-md mx-auto space-y-1 mb-4">
                  <li>{copy.benefits[0]}</li>
                  <li>{copy.benefits[1]}</li>
                  <li>{copy.benefits[2]}</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Em poucos minutos vamos gerar um <strong className="text-gray-800">Diagnóstico Estratégico</strong> para entender melhor o seu momento.
                </p>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 my-8" />

          <div className="mb-8">
            {!minimal && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Por que o perfil é importante?</strong> É através dele que definimos suas áreas de atuação, os fluxos da biblioteca e as orientações personalizadas do Noel. Sem essas informações, não conseguimos entregar o melhor para você — por isso pedimos que preencha no primeiro acesso.
                </p>
              </div>
            )}
            {!minimal && (
              <>
                <p className="text-center text-gray-700 text-lg leading-relaxed mb-2">
                  Antes de começar, precisamos de duas informações rápidas.
                </p>
                <p className="text-center text-gray-600 text-sm mb-6">
                  Assim podemos personalizar seu diagnóstico e preparar sua conta na plataforma.
                </p>
              </>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="onboarding-nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="onboarding-nome"
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder={copy.nomePlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="onboarding-telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <PhoneInputWithCountry
                  value={telefone}
                  onChange={(phone, code) => {
                    setTelefone(phone)
                    setCountryCode(code || 'BR')
                  }}
                  defaultCountryCode={countryCode}
                  className="w-full rounded-xl focus-within:ring-2 focus-within:ring-blue-500"
                  placeholder="11 99999-9999"
                />
                {!minimal && (
                  <p className="text-xs text-gray-500 mt-1">
                    Usamos esse número apenas para facilitar sua comunicação dentro da plataforma.
                  </p>
                )}
              </div>
            </div>

            {erro && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}
          </div>

          <div className="text-center">
            {!minimal && (
              <>
                <p className="text-sm font-semibold text-sky-600 mb-2">🧠 NOEL</p>
                <p className="text-gray-700 mb-2">{copy.ctaIntro}</p>
                <p className="text-gray-600 font-medium mb-4">
                  {nomeCompleto.trim()
                    ? `Seu diagnóstico será personalizado para você, ${nomeCompleto.trim().split(/\s+/)[0] || nomeCompleto.trim()}.`
                    : 'Seu diagnóstico será personalizado para você.'}
                </p>
                <p className="text-sm text-blue-600 font-medium mb-3">💡 São apenas 5 perguntas rápidas.</p>
              </>
            )}

            <button
              type="button"
              onClick={handleComecar}
              disabled={!podeContinuar}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
            >
              {salvando ? 'Salvando...' : '👉 Gerar meu Diagnóstico Estratégico'}
            </button>

            <p className="text-sm text-gray-500 mt-3">Leva menos de 2 minutos.</p>

            {!minimal && displayProofText && (
              <p className="text-xs text-gray-400 mt-4">{displayProofText}</p>
            )}
          </div>
        </div>

        {!minimal && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Você pode editar essas informações a qualquer momento em Configurações
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
