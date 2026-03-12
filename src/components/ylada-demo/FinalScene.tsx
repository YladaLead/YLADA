'use client'

/**
 * Cena 8: Tela final com slogan e CTA.
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

export default function FinalScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col justify-center items-center p-8 text-center">
      <p className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-4 max-w-xl">
        Menos curiosos.
        <br />
        Mais conversas qualificadas.
        <br />
        Mais clientes certos.
      </p>
      <div className="mb-10">
        <span className="text-2xl font-bold tracking-tight text-gray-900">YLADA</span>
      </div>
      <button
        type="button"
        className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
      >
        Começar agora
      </button>
    </div>
  )
}
