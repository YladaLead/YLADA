'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { manualLeaderHandoutTitleForVerticalCode } from '@/lib/manual-leader-entrar-path'

/** Códigos suportados no cadastro manual; um por conta — escolhe o produto que a pessoa está a contratar. */
const VERTICAL_PRESETS = [
  { value: 'h-lider', label: 'Pró Líderes (equipe / Herbalife)' },
  { value: 'estetica-corporal', label: 'Pro Estética corporal' },
  { value: 'estetica-capilar', label: 'Pro Terapia capilar' },
] as const

const VERTICAL_PRESET_VALUES = new Set<string>(VERTICAL_PRESETS.map((p) => p.value))

type OkResponse = {
  ok: true
  created_new_auth_user: boolean
  tenant_existed: boolean
  email: string
  password: string
  login_url: string
  message: string
  tenant_id?: string
  vertical_code?: string
}

function AdminProLideresManualLeaderContent() {
  const searchParams = useSearchParams()
  const [leaderName, setLeaderName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [segmentCode, setSegmentCode] = useState('h-lider')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OkResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const qEmail = searchParams.get('email')?.trim()
    const qName = searchParams.get('leaderName')?.trim()
    let qSegment = searchParams.get('segment')?.trim().toLowerCase() ?? ''
    if (qSegment === 'estetica_corporal' || qSegment === 'estética-corporal') qSegment = 'estetica-corporal'
    if (qSegment === 'estetica_capilar') qSegment = 'estetica-capilar'
    if (qEmail) setEmail(qEmail)
    if (qName) setLeaderName(qName)
    if (qSegment) setSegmentCode(qSegment)
  }, [searchParams])

  const verticalSelectValue = VERTICAL_PRESET_VALUES.has(segmentCode) ? segmentCode : '__custom__'

  const handoutTitleForResult =
    result?.vertical_code != null
      ? manualLeaderHandoutTitleForVerticalCode(result.vertical_code)
      : manualLeaderHandoutTitleForVerticalCode(segmentCode)
  const handoutText =
    result != null
      ? `${handoutTitleForResult} — acesso\n\nEntrar em: ${result.login_url}\nE-mail: ${result.email}\nSenha: ${result.password}\n\n(Esta senha é a definitiva da conta; o líder pode alterá-la nas definições quando quiser.)`
      : ''

  const copyHandout = useCallback(async () => {
    if (!handoutText) return
    try {
      await navigator.clipboard.writeText(handoutText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Não foi possível copiar. Selecione o texto manualmente.')
    }
  }, [handoutText])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)
    const segmentPayload = segmentCode.trim()
    if (!VERTICAL_PRESET_VALUES.has(segmentPayload) && !segmentPayload) {
      setError('Escolhe um produto na lista ou preenche o código em «Outro».')
      setSubmitting(false)
      return
    }
    try {
      const res = await fetch('/api/admin/pro-lideres/manual-leader', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName,
          email,
          password,
          segmentCode: segmentPayload,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao processar.')
        return
      }
      if ((data as OkResponse).ok) {
        setResult(data as OkResponse)
        setPassword('')
        setShowPassword(false)
      } else {
        setError('Resposta inesperada.')
      }
    } catch {
      setError('Erro de rede.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="font-medium text-blue-600 hover:underline">
              Admin
            </Link>
            {' · '}
            <Link href="/admin/pro-lideres/onboarding" className="font-medium text-blue-600 hover:underline">
              Pro Líderes onboarding
            </Link>
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Cadastro manual — dono (Pro Líderes / Estética Pro)</h1>
          <p className="mt-2 text-sm text-gray-600">
            Cria ou atualiza o utilizador no Supabase Auth, define a senha que indicar, garante o perfil YLADA e o
            espaço <strong>leader_tenants</strong> (dono). O link de entrada muda conforme o segmento (
            <code className="text-xs">h-lider</code>, <code className="text-xs">estetica-corporal</code>,{' '}
            <code className="text-xs">estetica-capilar</code>). Use só em suporte interno; a senha aparece uma vez neste
            ecrã.
          </p>
        </div>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Aviso de segurança:</strong> evite reutilizar senhas pessoais alheias. A senha que definir é a
          definitiva da conta; o líder pode trocá-la nas definições se quiser. Não guarde capturas desta página em
          canais inseguros.
        </section>

        <form className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5" onSubmit={(e) => void onSubmit(e)}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Nome do líder (exibição)</span>
            <input
              required
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Ex.: Maria Silva"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">E-mail (login)</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lider@exemplo.com"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </label>
          <div className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Senha de acesso (mín. 8 caracteres)</span>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha definitiva da conta"
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
              </button>
            </div>
          </div>
          <fieldset className="block space-y-2 rounded-lg border border-gray-200 bg-gray-50/80 p-3">
            <legend className="mb-1 px-1 text-sm font-medium text-gray-900">Produto (vertical)</legend>
            <p className="text-xs text-gray-600">
              Um cadastro = <strong className="font-medium text-gray-800">um</strong> produto. Para outro produto (outro
              e-mail na vossa regra), faz outro cadastro.
            </p>
            <div className="space-y-2 pt-1">
              {VERTICAL_PRESETS.map((p) => (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                    segmentCode === p.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="vertical-product"
                    className="mt-1"
                    checked={segmentCode === p.value}
                    onChange={() => setSegmentCode(p.value)}
                  />
                  <span>
                    <span className="font-medium text-gray-900">{p.label}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-gray-500">{p.value}</span>
                  </span>
                </label>
              ))}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                  verticalSelectValue === '__custom__'
                    ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="vertical-product"
                  className="mt-1"
                  checked={verticalSelectValue === '__custom__'}
                  onChange={() => {
                    if (VERTICAL_PRESET_VALUES.has(segmentCode)) setSegmentCode('')
                  }}
                />
                <span className="flex-1">
                  <span className="font-medium text-gray-900">Outro (código manual)</span>
                  {verticalSelectValue === '__custom__' ? (
                    <input
                      value={segmentCode}
                      onChange={(e) => setSegmentCode(e.target.value)}
                      placeholder="ex.: h-lider"
                      className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 font-mono text-sm"
                      aria-label="Código vertical manual"
                    />
                  ) : null}
                </span>
              </label>
            </div>
          </fieldset>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="min-h-[44px] w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'A processar…' : 'Criar / atualizar e liberar acesso'}
          </button>
        </form>

        {result && (
          <section className="space-y-3 rounded-xl border border-green-200 bg-green-50 p-4 sm:p-5 text-sm text-green-950">
            <p className="font-semibold text-green-900">Concluído</p>
            <p>{result.message}</p>
            <p className="text-xs text-green-800">
              Utilizador Auth: {result.created_new_auth_user ? 'criado agora' : 'já existia (senha atualizada)'} ·
              Tenant: {result.tenant_existed ? 'já existia (dados atualizados)' : 'criado agora'}
            </p>
            <div className="rounded-lg border border-green-300 bg-white p-3 font-mono text-xs text-gray-800 whitespace-pre-wrap">
              {handoutText}
            </div>
            <button
              type="button"
              onClick={() => void copyHandout()}
              className="rounded-lg border border-green-600 bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              {copied ? 'Copiado!' : 'Copiar texto para enviar ao líder'}
            </button>
            <p className="text-xs text-green-800">
              Link directo:{' '}
              <a href={result.login_url} className="break-all font-medium underline" target="_blank" rel="noreferrer">
                {result.login_url}
              </a>
            </p>
            {result.tenant_id ? (
              <p className="text-xs text-green-900">
                <strong>Leader tenant ID</strong> (para colar na ficha de consultoria):{' '}
                <code className="break-all rounded bg-white/80 px-1">{result.tenant_id}</code>
              </p>
            ) : null}
          </section>
        )}
      </div>
    </main>
  )
}

export default function AdminProLideresManualLeaderPage() {
  return (
    <AdminProtectedRoute>
      <Suspense
        fallback={
          <main className="min-h-screen bg-gray-50 p-6">
            <p className="text-sm text-gray-600">A carregar…</p>
          </main>
        }
      >
        <AdminProLideresManualLeaderContent />
      </Suspense>
    </AdminProtectedRoute>
  )
}
