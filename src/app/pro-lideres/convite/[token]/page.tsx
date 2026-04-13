'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

type ValidateOk = {
  ok: true
  invitedEmail: string
  spaceName: string
  expiresAt: string
}

export default function ProLideresConviteTokenPage() {
  const params = useParams()
  const router = useRouter()
  const token = typeof params.token === 'string' ? params.token : ''
  const { user, loading: authLoading } = useAuth()

  const [validating, setValidating] = useState(true)
  const [valid, setValid] = useState<ValidateOk | null>(null)
  const [invalidReason, setInvalidReason] = useState<string | null>(null)

  const [accepting, setAccepting] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)
  const [acceptOk, setAcceptOk] = useState(false)

  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  const validate = useCallback(async () => {
    if (!token) {
      setInvalidReason('Link inválido.')
      setValidating(false)
      return
    }
    setValidating(true)
    setInvalidReason(null)
    try {
      const res = await fetch(`/api/pro-lideres/invites/validate?token=${encodeURIComponent(token)}`)
      const data = await res.json().catch(() => ({}))
      if (data.ok) {
        setValid(data as ValidateOk)
      } else {
        const r = (data as { reason?: string }).reason
        const msg =
          r === 'used'
            ? 'Este convite já foi utilizado.'
            : r === 'expired'
              ? 'Este convite expirou.'
              : r === 'revoked'
                ? 'Este convite foi revogado.'
                : 'Este convite não é válido.'
        setInvalidReason(msg)
      }
    } catch {
      setInvalidReason('Não foi possível validar o convite.')
    } finally {
      setValidating(false)
    }
  }, [token])

  useEffect(() => {
    void validate()
  }, [validate])

  const loginHref = `/pro-lideres/entrar?next=${encodeURIComponent(`/pro-lideres/convite/${token}`)}`

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegistering(true)
    setRegisterError(null)
    try {
      const res = await fetch('/api/pro-lideres/invites/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nome_completo: nome.trim(),
          whatsapp: whatsapp.trim(),
          password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setRegisterError((data as { error?: string }).error || 'Não foi possível criar a conta.')
        return
      }
      const email = (data as { email?: string }).email ?? valid?.invitedEmail
      if (!email) {
        setRegisterError('Conta criada, mas falhou o login automático. Entre manualmente.')
        return
      }
      const supabase = createClient()
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signErr) {
        setRegisterError('Conta criada. Entre com o e-mail e a senha que definiu.')
        return
      }
      router.push('/pro-lideres/painel')
      router.refresh()
    } catch {
      setRegisterError('Erro de rede.')
    } finally {
      setRegistering(false)
    }
  }

  async function onAccept() {
    setAccepting(true)
    setAcceptError(null)
    try {
      const body: { token: string; nome_completo?: string; whatsapp?: string } = { token }
      const n = nome.trim()
      const w = whatsapp.trim()
      if (n.length >= 2) body.nome_completo = n
      if (w.length >= 8) body.whatsapp = w

      const res = await fetch('/api/pro-lideres/invites/accept', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAcceptError((data as { error?: string }).error || 'Não foi possível aceitar.')
        return
      }
      setAcceptOk(true)
      router.push('/pro-lideres/painel')
      router.refresh()
    } catch {
      setAcceptError('Erro de rede.')
    } finally {
      setAccepting(false)
    }
  }

  const sessionEmail = user?.email?.toLowerCase().trim() ?? ''
  const invitedNorm = valid?.invitedEmail?.toLowerCase().trim() ?? ''
  const emailMatches = sessionEmail && invitedNorm && sessionEmail === invitedNorm

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image
            src={YLADA_OG_FALLBACK_LOGO_PATH}
            alt="YLADA"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>

        {validating || authLoading ? (
          <p className="text-center text-gray-600">A carregar…</p>
        ) : invalidReason ? (
          <div className="space-y-4 text-center">
            <h1 className="text-lg font-bold text-gray-900">Convite indisponível</h1>
            <p className="text-sm text-gray-600">{invalidReason}</p>
            <Link href="/pro-lideres" className="text-sm font-semibold text-blue-600 underline">
              Voltar ao Pro Líderes
            </Link>
          </div>
        ) : valid ? (
          <div className="space-y-5">
            <h1 className="text-center text-xl font-bold text-gray-900">Convite para a equipe</h1>
            <p className="text-center text-sm text-gray-600">
              Espaço: <strong className="text-gray-900">{valid.spaceName}</strong>
            </p>
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-center text-sm text-blue-900">
              Convite para <strong>{valid.invitedEmail}</strong>
            </p>
            <p className="text-xs text-gray-500">
              Prazo: até {new Date(valid.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>

            {!user && (
              <div className="space-y-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Criar conta e entrar na equipe</p>
                <p className="text-xs text-gray-600">
                  Use o mesmo e-mail do convite (já indicado acima). Depois do registo entraremos automaticamente no painel.
                </p>
                {registerError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {registerError}
                  </div>
                )}
                <form onSubmit={(e) => void onRegister(e)} className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Nome completo</span>
                    <input
                      required
                      minLength={2}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">WhatsApp</span>
                    <input
                      required
                      minLength={8}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
                      placeholder="Com DDI, ex. 5511999998888"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Senha</span>
                    <input
                      required
                      type="password"
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
                      autoComplete="new-password"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full min-h-[48px] rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {registering ? 'A criar conta…' : 'Criar conta e entrar'}
                  </button>
                </form>
                <p className="text-center text-xs text-gray-500">
                  Já tem conta YLADA?{' '}
                  <Link href={loginHref} className="font-semibold text-blue-600 underline">
                    Entrar para aceitar
                  </Link>
                </p>
              </div>
            )}

            {user && !emailMatches && (
              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p>
                  Está autenticado como <strong>{user.email}</strong>. Para aceitar, use a conta{' '}
                  <strong>{valid.invitedEmail}</strong>.
                </p>
                <Link href={loginHref} className="block text-center font-semibold text-blue-700 underline">
                  Entrar com outra conta
                </Link>
              </div>
            )}

            {user && emailMatches && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Confirme ou complete os dados da sua ficha (opcional) e aceite o convite.
                </p>
                <div className="grid gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Nome completo (opcional)</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">WhatsApp (opcional)</span>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
                      autoComplete="tel"
                    />
                  </label>
                </div>
                {acceptError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {acceptError}
                  </div>
                )}
                {acceptOk ? (
                  <p className="text-center text-sm text-green-700">A redirecionar para o painel…</p>
                ) : (
                  <button
                    type="button"
                    disabled={accepting}
                    onClick={() => void onAccept()}
                    className="w-full min-h-[48px] rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {accepting ? 'A confirmar…' : 'Aceitar e entrar na equipe'}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
