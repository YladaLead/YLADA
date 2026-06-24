/**
 * Helpers de cliente do loop. Persistem o ?ref num cookie de curta duração pra
 * sobreviver à escolha de área e à confirmação de e-mail, e falam com as rotas
 * de referral. Tudo tolerante a falha — o loop nunca pode travar auth/navegação.
 */
'use client'

import { isValidReferralCode } from './referral-code'
import type { ReferralSource } from './referral-url'

const REF_COOKIE = 'ylada_ref'
const SOURCE_COOKIE = 'ylada_ref_source'
const TTL_MINUTES = 90

function setCookie(name: string, value: string, minutes: number): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + minutes * 60_000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const hit = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

/** Guarda o código (e origem) por 90 min. Ignora código inválido. */
export function persistReferral(ref: string | null, source: ReferralSource): void {
  if (!isValidReferralCode(ref)) return
  setCookie(REF_COOKIE, ref as string, TTL_MINUTES)
  setCookie(SOURCE_COOKIE, source, TTL_MINUTES)
}

export function readPersistedReferral(): { ref: string | null; source: ReferralSource } {
  const ref = readCookie(REF_COOKIE)
  const source = readCookie(SOURCE_COOKIE)
  return {
    ref: isValidReferralCode(ref) ? ref : null,
    source: source === 'conteudo' ? 'conteudo' : 'diagnostico',
  }
}

function clearPersistedReferral(): void {
  deleteCookie(REF_COOKIE)
  deleteCookie(SOURCE_COOKIE)
}

/** Selo: troca slug (+pl_m) pelo código curto do indicador. */
export async function fetchReferralCodeForSeal(
  slug: string,
  plToken: string | null,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({ slug })
    if (plToken) params.set('pl_m', plToken)
    const res = await fetch(`/api/ylada/referrals/code?${params.toString()}`)
    if (!res.ok) return null
    const json = (await res.json()) as { code?: string | null }
    return json.code ?? null
  } catch {
    return null
  }
}

/** Página /criar: registra a chegada com ref (anônimo). */
export async function trackReferralLanding(ref: string | null, source: ReferralSource): Promise<void> {
  try {
    await fetch('/api/ylada/referrals/landing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref, source }),
    })
  } catch {
    /* silencioso */
  }
}

/**
 * Cadastro/login: se há um ref pendente no cookie, atribui a indicação e limpa.
 * Idempotente no servidor — chamar mais de uma vez não duplica.
 */
export async function captureReferralIfPending(): Promise<void> {
  const { ref, source } = readPersistedReferral()
  if (!ref) return
  try {
    const res = await fetch('/api/ylada/referrals/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ref, source }),
    })
    if (res.ok) clearPersistedReferral()
  } catch {
    /* mantém o cookie pra tentar de novo no próximo auth */
  }
}
