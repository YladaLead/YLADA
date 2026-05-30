/**
 * Validação e parsing de URLs de vídeo para a landing «oportunidade» Pro Líderes (rede).
 */

const MAX_URL_LEN = 500

export type ParsedOpportunityVideo =
  | { kind: 'youtube'; videoId: string }
  | { kind: 'vimeo'; id: string }
  | { kind: 'mp4'; src: string }

function extractYouTubeId(url: string): string | null {
  const shorts = url.match(/youtube\.com\/shorts\/([^"&?/\s]{11})/i)
  if (shorts?.[1]) return shorts[1]
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )
  return m?.[1] ?? null
}

function extractVimeoId(url: string): string | null {
  const u = url.trim()
  let m = u.match(/player\.vimeo\.com\/video\/(\d+)/i)
  if (m?.[1]) return m[1]
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (m?.[1]) return m[1]
  return null
}

function isHttpsMp4Url(s: string): boolean {
  try {
    const u = new URL(s)
    if (u.protocol !== 'https:') return false
    const path = u.pathname.toLowerCase()
    return path.endsWith('.mp4')
  } catch {
    return false
  }
}

/** Interpreta um URL já normalizado (trim) para embed ou <video>. */
export function parseOpportunityVideoUrl(
  raw: string
): { ok: true; value: ParsedOpportunityVideo } | { ok: false; error: string } {
  const s = raw.trim()
  if (!s) {
    return { ok: false, error: 'Indica um endereço (URL) do vídeo.' }
  }
  if (s.length > MAX_URL_LEN) {
    return { ok: false, error: `O URL é demasiado longo (máximo ${MAX_URL_LEN} caracteres).` }
  }

  // MP4 hospedado no próprio site (sem branding YouTube)
  if (s.startsWith('/') && s.toLowerCase().endsWith('.mp4')) {
    return { ok: true, value: { kind: 'mp4', src: s } }
  }

  let u: URL
  try {
    u = new URL(s)
  } catch {
    return { ok: false, error: 'URL inválido. Usa um link completo começando por https://' }
  }

  if (u.protocol !== 'https:') {
    return { ok: false, error: 'Só são aceites links HTTPS.' }
  }

  const host = u.hostname.toLowerCase()
  const yt = extractYouTubeId(s)
  if (yt) {
    return { ok: true, value: { kind: 'youtube', videoId: yt } }
  }

  const vimeoHosts = ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']
  if (vimeoHosts.includes(host)) {
    const vid = extractVimeoId(s)
    if (vid) return { ok: true, value: { kind: 'vimeo', id: vid } }
    return { ok: false, error: 'Não foi possível ler o ID do vídeo Vimeo. Confirma o link.' }
  }

  if (isHttpsMp4Url(s)) {
    return { ok: true, value: { kind: 'mp4', src: u.toString() } }
  }

  return {
    ok: false,
    error: 'Formato não suportado. Usa um link do YouTube, do Vimeo ou um ficheiro .mp4 em HTTPS.',
  }
}

/** Embed YouTube sem exibir título/canal no topo (recorte via CSS `.pl-reset-embed-youtube`). */
export function buildYouTubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    controls: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

/** Vimeo sem título, autor e avatar no player. */
export function buildVimeoEmbedSrc(id: string): string {
  const params = new URLSearchParams({
    title: '0',
    byline: '0',
    portrait: '0',
  })
  return `https://player.vimeo.com/video/${id}?${params.toString()}`
}

export type OpportunityVideoPatch =
  | { action: 'omit' }
  | { action: 'clear' }
  | { action: 'set'; url: string }
  | { action: 'error'; message: string }

/** Campo opcional no PATCH `/api/pro-lideres/tenant`. */
export function parseOpportunityVideoUrlForPatch(body: Record<string, unknown>): OpportunityVideoPatch {
  if (!Object.prototype.hasOwnProperty.call(body, 'opportunity_video_url')) {
    return { action: 'omit' }
  }
  const raw = body.opportunity_video_url
  if (raw === null || raw === undefined) {
    return { action: 'clear' }
  }
  const s = String(raw).trim()
  if (!s) {
    return { action: 'clear' }
  }
  const parsed = parseOpportunityVideoUrl(s)
  if (!parsed.ok) {
    return { action: 'error', message: parsed.error }
  }
  return { action: 'set', url: s.slice(0, MAX_URL_LEN) }
}
