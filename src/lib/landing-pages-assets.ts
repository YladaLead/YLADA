/**
 * Helper para obter URLs de assets públicos de landing pages
 * Armazenados no bucket 'landing-pages-assets' do Supabase Storage
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = 'landing-pages-assets'

// Criar cliente Supabase apenas para gerar URLs públicas
// Não precisa de autenticação para buckets públicos
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Obter URL pública de um asset de landing page
 * Usa o cliente Supabase para garantir formato correto
 */
export function getLandingPageAssetUrl(fileName: string): string {
  if (!supabase) {
    // Fallback para arquivo local se Supabase não estiver configurado
    const fallbackUrl = `/videos/${fileName}`
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Supabase não configurado, usando fallback local para:', fileName, fallbackUrl)
    }
    return fallbackUrl
  }

  // Usar getPublicUrl do Supabase para garantir formato correto
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)
  
  const url = data.publicUrl
  
  // Log para debug (tanto dev quanto prod para identificar problemas)
  if (typeof window !== 'undefined') {
    console.log(`🔗 URL gerada para ${fileName}:`, url)
  }
  
  return url
}

/**
 * URLs específicas dos vídeos de landing pages
 * Usa função para garantir que URLs sejam geradas no momento certo (client-side)
 */
export const landingPageVideos = {
  get wellnessHero() {
    return getLandingPageAssetUrl('wellness-hero.mp4')
  },
  get wellnessHeroPoster() {
    return getLandingPageAssetUrl('wellness-hero-poster.png')
  },
  get nutriHero() {
    // Servido do deploy (public/videos). Aumente version ao trocar o vídeo para evitar cache.
    const version = 7
    return `/videos/nutri-hero.mp4?v=${version}`
  },
  get nutriHeroPoster() {
    const version = 8
    return `/videos/nutri-hero-poster.jpg?v=${version}`
  },
  /** Vídeo do fluxo completo (gerado a partir do carrossel) — usado na primeira página/landing e nas páginas de áreas (estética, nutri, etc.). */
  get fluxoCompleto() {
    return getLandingPageAssetUrl('wellness-hero.mp4')
  },
  get fluxoCompletoPoster() {
    return getLandingPageAssetUrl('wellness-hero-poster.png')
  },
  /** Vídeo correto YLADA: "Não sei por onde começar" / "É aqui que a coisa acontece" (demonstração). Bucket: ylada-demonstracao-fluxo.mp4 ou env NEXT_PUBLIC_YLADA_VIDEO_FLUXO_URL. */
  get yladaDemonstracaoFluxo() {
    return getLandingPageAssetUrl('ylada-demonstracao-fluxo.mp4')
  },
  get yladaDemonstracaoFluxoPoster() {
    return getLandingPageAssetUrl('ylada-demonstracao-fluxo-poster.png')
  },
  /** Vídeo específico da landing de psicanálise. Defina NEXT_PUBLIC_YLADA_VIDEO_FLUXO_PSICANALISE_URL (YouTube, Vimeo ou MP4); senão usa o mesmo demonstração geral. */
  get yladaDemonstracaoFluxoPsicanalise(): string {
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_YLADA_VIDEO_FLUXO_PSICANALISE_URL) {
      return process.env.NEXT_PUBLIC_YLADA_VIDEO_FLUXO_PSICANALISE_URL
    }
    return getLandingPageAssetUrl('ylada-demonstracao-fluxo.mp4')
  },
  /** Vídeo tutorial "Como escolher seu slug" (Configurações Nutri). Defina NEXT_PUBLIC_NUTRI_SLUG_VIDEO_URL (YouTube, Vimeo ou URL direta do vídeo). */
  get nutriSlugTutorial(): string {
    return (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_NUTRI_SLUG_VIDEO_URL) || ''
  },
}

// Log das URLs para debug (sempre, para identificar problemas em produção)
if (typeof window !== 'undefined') {
  // Usar setTimeout para garantir que logs apareçam após renderização
  setTimeout(() => {
    console.log('🎥 URLs de vídeos de landing pages:', {
      wellnessHero: landingPageVideos.wellnessHero,
      wellnessHeroPoster: landingPageVideos.wellnessHeroPoster,
      supabaseUrl: supabaseUrl || 'NÃO CONFIGURADO',
      bucket: BUCKET_NAME,
    })
  }, 100)
}
