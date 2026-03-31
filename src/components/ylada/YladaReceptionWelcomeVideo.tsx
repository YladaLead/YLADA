'use client'

/**
 * Vídeo de boas-vindas (resumo ~50s) na primeira home pós-onboarding.
 * Mobile-first: largura total, cantos arredondados, poster antes do play.
 *
 * Assets (colocar em public/videos/):
 * - boas-vindas-ylada.mp4
 * - boas-vindas-ylada-cover.jpg
 */
const VIDEO_SRC = '/videos/boas-vindas-ylada.mp4'
const POSTER_SRC = '/videos/boas-vindas-ylada-cover.jpg'

export default function YladaReceptionWelcomeVideo() {
  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto">
      <p className="sr-only">Vídeo de boas-vindas: resumo de como usar a YLADA</p>
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-sky-200/80 bg-black shadow-md shadow-sky-900/10 aspect-video"
      >
        <video
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="metadata"
          poster={POSTER_SRC}
          aria-label="Boas-vindas YLADA — resumo em vídeo"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          Seu navegador não suporta reprodução de vídeo HTML5.
        </video>
      </div>
    </div>
  )
}
