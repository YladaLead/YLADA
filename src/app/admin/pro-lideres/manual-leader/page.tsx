'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type OkResponse = {
  ok: true
  created_new_auth_user: boolean
  tenant_existed: boolean
  email: string
  password: string
  login_url: string
  message: string
}

function AdminProLideresManualLeaderContent() {
  const [leaderName, setLeaderName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [segmentCode, setSegmentCode] = useState('h-lider')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OkResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handoutText =
    result != null
      ? `Pro Líderes — acesso\n\nEntrar em: ${result.login_url}\nE-mail: ${result.email}\nSenha: ${result.password}\n\n(Esta senha é a definitiva da conta; o líder pode alterá-la nas definições quando quiser.)`
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
    try {
      const res = await fetch('/api/admin/pro-lideres/manual-leader', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName,
          email,
          password,
          segmentCode,
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
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Cadastro manual — líder Pro Líderes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Cria ou atualiza o utilizador no Supabase Auth, define a senha que indicar, garante o perfil YLADA e o
            espaço <strong>leader_tenants</strong> (dono). Use só em suporte interno; a senha aparece uma vez neste
            ecrã para enviar ao líder.
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
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Segmento (vertical)</span>
            <input
              value={segmentCode}
              onChange={(e) => setSegmentCode(e.target.value)}
              placeholder="h-lider"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </label>
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
          </section>
        )}
      </div>
    </main>
  )
}

export default function AdminProLideresManualLeaderPage() {
  return (
    <AdminProtectedRoute>
      <AdminProLideresManualLeaderContent />
    </AdminProtectedRoute>
  )
}
