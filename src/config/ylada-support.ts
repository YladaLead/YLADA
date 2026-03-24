/** WhatsApp da Carol (atendimento humano). E.164 sem + (ex.: 5519996049800). */
export function getCarolWhatsAppUrl(prefillMessage?: string | null): string {
  const raw = process.env.NEXT_PUBLIC_CAROL_WHATSAPP_E164 || '5519996049800'
  const digits = raw.replace(/\D/g, '') || '5519996049800'
  const base = `https://wa.me/${digits}`
  const t = prefillMessage?.trim()
  if (!t) return base
  const q = encodeURIComponent(t)
  if (base.length + q.length > 3800) return base
  return `${base}?text=${q}`
}

/** Texto inicial no WhatsApp para o suporte saber quem fala (automação / atendente). */
export function buildYladaSupportWhatsappPrefill(params: {
  email?: string | null
  nomeCompleto?: string | null
  areaLabel: string
  areaCodigo: string
  perfilConta?: string | null
  userId?: string | null
}): string {
  const lines: string[] = ['Olá! Falo pelo app YLADA.', '']

  const nome = params.nomeCompleto?.trim()
  if (nome) lines.push(`Nome: ${nome}`)

  const email = params.email?.trim()
  if (email) lines.push(`E-mail: ${email}`)

  lines.push(`Área no app: ${params.areaLabel}`)
  lines.push(`Segmento: ${params.areaCodigo}`)

  const perfil = params.perfilConta?.trim()
  if (perfil) lines.push(`Tipo de conta: ${perfil}`)

  const uid = params.userId?.trim()
  if (uid) lines.push(`ID usuário: ${uid}`)

  lines.push('')
  lines.push('Preciso de ajuda:')
  return lines.join('\n')
}
