'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

type ValidateOk = {
  ok: true
  invitedEmail: string
  spaceName: string
  expiresAt: string
  tabulatorNames: string[]
}

/** Após cadastro/aceite: escolha Pix vs cartão ou abertura do link configurado pelo líder. */
type InvitePaymentFlowState =
  | null
  | { step: 'choose'; cardUrl: string; pixUrl: string }
  | {
      step: 'open_link'
      url: string
      kind: 'card' | 'pix'
      /** Presente quando o utilizador veio do ecrã de escolha (dois links). */
      chooseBack?: { cardUrl: string; pixUrl: string }
    }

function normalizePaymentUrl(raw: unknown): string | null {
  const s = typeof raw === 'string' ? raw.trim() : ''
  return s || null
}

export default function ProLideresConviteTokenPage() {
  const params = useParams()
  const router = useRouter()
  const token = typeof params.token === 'string' ? params.token : ''
  const { user, loading: authLoading, signOut } = useAuth()

  const [validating, setValidating] = useState(true)
  const [valid, setValid] = useState<ValidateOk | null>(null)
  const [invalidReason, setInvalidReason] = useState<string | null>(null)

  const [accepting, setAccepting] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)
  const [acceptOk, setAcceptOk] = useState(false)

  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('BR')
  const [shareSlug, setShareSlug] = useState('')
  const [tabulatorName, setTabulatorName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [invitePaymentFlow, setInvitePaymentFlow] = useState<InvitePaymentFlowState>(null)

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
        const v = data as ValidateOk & { tabulatorNames?: string[] }
        setValid({
          ok: true,
          invitedEmail: v.invitedEmail,
          spaceName: v.spaceName,
          expiresAt: v.expiresAt,
          tabulatorNames: Array.isArray(v.tabulatorNames) ? v.tabulatorNames : [],
        })
      } else {
        const r = (data as { reason?: string }).reason
        const msg =
          r === 'used'
            ? 'Este convite já foi utilizado.'
            : r === 'expired'
              ? 'Este convite expirou.'
              : r === 'revoked'
                ? 'Este convite foi revogado.'
                : r === 'leader_subscription_inactive'
                  ? 'Este espaço está temporariamente indisponível na YLADA por pendência de assinatura. Tente novamente mais tarde.'
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

  const tabulatorOptions = valid?.tabulatorNames ?? []
  const tabulatorsReady = tabulatorOptions.length > 0

  useEffect(() => {
    const opts = valid?.tabulatorNames ?? []
    if (!tabulatorName || opts.length === 0) return
    if (!opts.includes(tabulatorName)) {
      setTabulatorName('')
    }
  }, [tabulatorName, valid?.tabulatorNames])

  const loginHref = `/pro-lideres/entrar?next=${encodeURIComponent(`/pro-lideres/convite/${token}`)}`

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegisterError(null)
    if (!tabulatorsReady || !tabulatorName) {
      setRegisterError('Selecione o nome do tabulador na lista.')
      return
    }
    if (password.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== passwordConfirm) {
      setRegisterError('As senhas não coincidem. Digite a mesma senha nos dois campos.')
      return
    }
    setRegistering(true)
    try {
      const res = await fetch('/api/pro-lideres/invites/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nome_completo: nome.trim(),
          whatsapp: whatsapp.trim(),
          password,
          pro_lideres_share_slug: shareSlug.trim(),
          pro_lideres_tabulator_name: tabulatorName,
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
      if (user) {
        await signOut()
      }
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signErr) {
        setRegisterError('Conta criada. Entre com o e-mail e a senha que você cadastrou.')
        return
      }
      const cardUrl = normalizePaymentUrl((data as { teamBankPaymentUrl?: string | null }).teamBankPaymentUrl)
      const pixUrl = normalizePaymentUrl((data as { teamBankPixPaymentUrl?: string | null }).teamBankPixPaymentUrl)
      if (cardUrl && pixUrl) {
        setInvitePaymentFlow({ step: 'choose', cardUrl, pixUrl })
        return
      }
      if (cardUrl || pixUrl) {
        setInvitePaymentFlow({
          step: 'open_link',
          url: (cardUrl || pixUrl) as string,
          kind: cardUrl ? 'card' : 'pix',
        })
        return
      }
      // Navegação completa evita ficar na área matriz (ex. /pt/estetica) se houver efeitos de sessão/última página.
      if (typeof window !== 'undefined') {
        window.location.assign('/pro-lideres/painel')
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
    setAcceptError(null)
    if (!tabulatorsReady || !tabulatorName) {
      setAcceptError('Selecione o nome do tabulador na lista.')
      return
    }
    setAccepting(true)
    try {
      const body = {
        token,
        nome_completo: nome.trim(),
        whatsapp: whatsapp.trim(),
        pro_lideres_share_slug: shareSlug.trim(),
        pro_lideres_tabulator_name: tabulatorName,
      }

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
      const cardUrl = normalizePaymentUrl((data as { teamBankPaymentUrl?: string | null }).teamBankPaymentUrl)
      const pixUrl = normalizePaymentUrl((data as { teamBankPixPaymentUrl?: string | null }).teamBankPixPaymentUrl)
      if (cardUrl && pixUrl) {
        setAcceptOk(true)
        setInvitePaymentFlow({ step: 'choose', cardUrl, pixUrl })
        return
      }
      if (cardUrl || pixUrl) {
        setAcceptOk(true)
        setInvitePaymentFlow({
          step: 'open_link',
          url: (cardUrl || pixUrl) as string,
          kind: cardUrl ? 'card' : 'pix',
        })
        return
      }
      setAcceptOk(true)
      if (typeof window !== 'undefined') {
        window.location.assign('/pro-lideres/painel')
        return
      }
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
          <p className="text-center text-gray-600">Carregando…</p>
        ) : invalidReason ? (
          <div className="space-y-4 text-center">
            <h1 className="text-lg font-bold text-gray-900">Convite indisponível</h1>
            <p className="text-sm text-gray-600">{invalidReason}</p>
            <Link href="/pro-lideres" className="text-sm font-semibold text-blue-600 underline">
              Voltar ao Pro Líderes
            </Link>
          </div>
        ) : valid && invitePaymentFlow?.step === 'choose' ? (
          <div className="space-y-5 text-center">
            <h1 className="text-xl font-bold text-gray-900">Como prefere pagar?</h1>
            <p className="text-sm leading-relaxed text-gray-700">
              O líder configurou duas formas de cobrança. <strong className="text-gray-900">Assinaturas no Mercado Pago</strong>{' '}
              costumam não aceitar Pix — escolha a opção combinada com a equipe.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  setInvitePaymentFlow({
                    step: 'open_link',
                    url: invitePaymentFlow.pixUrl,
                    kind: 'pix',
                    chooseBack: {
                      cardUrl: invitePaymentFlow.cardUrl,
                      pixUrl: invitePaymentFlow.pixUrl,
                    },
                  })
                }
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Pagar com Pix
              </button>
              <button
                type="button"
                onClick={() =>
                  setInvitePaymentFlow({
                    step: 'open_link',
                    url: invitePaymentFlow.cardUrl,
                    kind: 'card',
                    chooseBack: {
                      cardUrl: invitePaymentFlow.cardUrl,
                      pixUrl: invitePaymentFlow.pixUrl,
                    },
                  })
                }
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Cartão ou Mercado Pago
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Depois de pagar, pode entrar no painel pelo botão na página seguinte.
            </p>
          </div>
        ) : valid && invitePaymentFlow?.step === 'open_link' ? (
          <div className="space-y-5 text-center">
            <h1 className="text-xl font-bold text-gray-900">Tudo certo com o acesso</h1>
            <p className="text-sm leading-relaxed text-gray-700">
              {invitePaymentFlow.kind === 'pix' ? (
                <>
                  Abra o <strong className="text-gray-900">link de pagamento via Pix</strong> que o líder deixou,
                  conclua conforme combinado com a equipe e depois entre no painel.
                </>
              ) : (
                <>
                  Abra o <strong className="text-gray-900">link de pagamento com cartão ou no Mercado Pago</strong>,
                  conclua conforme combinado com a equipe e depois entre no painel.
                </>
              )}
            </p>
            <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-950">
              <p className="font-semibold">
                {invitePaymentFlow.kind === 'pix' ? 'Link (Pix)' : 'Link (cartão / Mercado Pago)'}
              </p>
              <p className="mt-1 break-all font-mono text-xs">{invitePaymentFlow.url}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={invitePaymentFlow.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Abrir link de pagamento
              </a>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.assign('/pro-lideres/painel')
                  }
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Ir para o painel Pro Líderes
              </button>
            </div>
            {invitePaymentFlow.chooseBack ? (
              <button
                type="button"
                onClick={() => {
                  const b = invitePaymentFlow.chooseBack
                  if (!b) return
                  setInvitePaymentFlow({ step: 'choose', cardUrl: b.cardUrl, pixUrl: b.pixUrl })
                }}
                className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
              >
                Escolher outra forma de pagamento
              </button>
            ) : null}
          </div>
        ) : valid ? (
          <div className="space-y-5">
            <p className="text-center text-lg font-semibold text-gray-900">{valid.spaceName}</p>
            <h1 className="text-center text-xl font-bold text-gray-900">Convite para equipe</h1>
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-center text-sm text-blue-900">
              <strong>{valid.invitedEmail}</strong>
            </p>
            <p className="text-center text-xs text-gray-500">
              Prazo: até {new Date(valid.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>

            {!tabulatorsReady && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                O líder ainda não cadastrou tabuladores neste espaço. Quando houver pelo menos um nome em{' '}
                <strong className="text-amber-950">Pro Líderes → Tabuladores</strong>, o convite volta a ficar
                completo.
              </div>
            )}

            {!emailMatches && (
              <div className="space-y-4 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Criar conta</p>
                {user ? (
                  <p className="text-xs text-gray-600">
                    Você está logado(a) com outro e-mail. Ao criar a conta, você usará{' '}
                    <strong className="text-gray-800">{valid.invitedEmail}</strong> e fará login com ele.
                  </p>
                ) : null}
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
                    <span className="mb-1 block text-xs font-medium text-gray-600">Nome do tabulador (obrigatório)</span>
                    <select
                      required={tabulatorsReady}
                      value={tabulatorName}
                      onChange={(e) => setTabulatorName(e.target.value)}
                      disabled={!tabulatorsReady}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 disabled:bg-gray-100"
                    >
                      <option value="">{tabulatorsReady ? 'Selecionar…' : 'Lista vazia — aguarde o líder cadastrar'}</option>
                      {tabulatorOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Endereço nos links (obrigatório)</span>
                    <input
                      required
                      minLength={3}
                      maxLength={40}
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      title="Só letras minúsculas, números e hífens"
                      value={shareSlug}
                      onChange={(e) => setShareSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900"
                      placeholder="ex.: maria-silva"
                      autoComplete="off"
                    />
                    <span className="mt-1 block text-[11px] leading-snug text-gray-500">
                      Seu nome no URL do quiz — como prefere ser chamado(a), ou o nome pelo qual quer ser identificado(a)
                      (único).
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">WhatsApp (obrigatório)</span>
                    <PhoneInputWithCountry
                      className="w-full"
                      value={whatsapp}
                      defaultCountryCode={whatsappCountryCode || 'BR'}
                      onChange={(phone, countryCode) => {
                        setWhatsapp(phone)
                        setWhatsappCountryCode(countryCode || 'BR')
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Senha</span>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-11 text-gray-900"
                        autoComplete="new-password"
                        name="password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500 hover:text-gray-800"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                      </button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Confirmar senha</span>
                    <div className="relative">
                      <input
                        required
                        type={showPasswordConfirm ? 'text' : 'password'}
                        minLength={6}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-11 text-gray-900"
                        autoComplete="new-password"
                        name="password_confirm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500 hover:text-gray-800"
                        aria-label={showPasswordConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                        tabIndex={-1}
                      >
                        {showPasswordConfirm ? (
                          <EyeOff className="h-5 w-5" aria-hidden />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden />
                        )}
                      </button>
                    </div>
                  </label>
                  <button
                    type="submit"
                    disabled={registering || !tabulatorsReady}
                    className="w-full min-h-[48px] rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {registering ? 'Criando conta…' : 'Criar conta e entrar'}
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

            {user && emailMatches && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">Preencha os dados para entrar na equipe.</p>
                <div className="grid gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Nome completo (obrigatório)</span>
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
                    <span className="mb-1 block text-xs font-medium text-gray-600">Nome do tabulador (obrigatório)</span>
                    <select
                      required={tabulatorsReady}
                      value={tabulatorName}
                      onChange={(e) => setTabulatorName(e.target.value)}
                      disabled={!tabulatorsReady}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 disabled:bg-gray-100"
                    >
                      <option value="">{tabulatorsReady ? 'Selecionar…' : 'Lista vazia — aguarde o líder cadastrar'}</option>
                      {tabulatorOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Endereço nos links (obrigatório)</span>
                    <input
                      required
                      minLength={3}
                      maxLength={40}
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      title="Só letras minúsculas, números e hífens"
                      value={shareSlug}
                      onChange={(e) => setShareSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900"
                      placeholder="ex.: maria-silva"
                      autoComplete="off"
                    />
                    <span className="mt-1 block text-[11px] leading-snug text-gray-500">
                      Seu nome no URL do quiz — como prefere ser chamado(a), ou o nome pelo qual quer ser identificado(a)
                      (único).
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">WhatsApp (obrigatório)</span>
                    <PhoneInputWithCountry
                      className="w-full"
                      value={whatsapp}
                      defaultCountryCode={whatsappCountryCode || 'BR'}
                      onChange={(phone, countryCode) => {
                        setWhatsapp(phone)
                        setWhatsappCountryCode(countryCode || 'BR')
                      }}
                    />
                  </label>
                </div>
                {acceptError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {acceptError}
                  </div>
                )}
                {acceptOk ? (
                  <p className="text-center text-sm text-green-700">Redirecionando para o painel…</p>
                ) : (
                  <button
                    type="button"
                    disabled={accepting || !tabulatorsReady}
                    onClick={() => void onAccept()}
                    className="w-full min-h-[48px] rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {accepting ? 'Confirmando…' : 'Aceitar e entrar na equipe'}
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
