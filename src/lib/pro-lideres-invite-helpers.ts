import { randomBytes } from 'crypto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeInviteEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidInviteEmail(email: string): boolean {
  const n = normalizeInviteEmail(email)
  return n.length > 3 && n.length < 320 && EMAIL_RE.test(n)
}

export function generateProLideresInviteToken(): string {
  return randomBytes(24).toString('base64url')
}

export function proLideresInvitePath(token: string): string {
  return `/pro-lideres/convite/${encodeURIComponent(token)}`
}

export function buildProLideresInviteUrl(origin: string, token: string): string {
  const base = origin.replace(/\/$/, '')
  return `${base}${proLideresInvitePath(token)}`
}

export function inviteExpiresAtDefault(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d
}
