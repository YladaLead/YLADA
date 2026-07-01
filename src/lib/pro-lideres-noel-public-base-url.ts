import type { NextRequest } from 'next/server'

/**
 * URL pública para links no Noel membro — evita `localhost` no chat em dev.
 * Prioridade: env de produção → origin da request (se não for localhost) → fallback YLADA.
 */
export function resolveProLideresNoelPublicBaseUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '')
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv

  try {
    const origin = new URL(request.url).origin.replace(/\/$/, '')
    if (!/localhost|127\.0\.0\.1/i.test(origin)) return origin
  } catch {
    /* request.url inválida */
  }

  if (fromEnv) return fromEnv
  return 'https://www.ylada.com'
}
