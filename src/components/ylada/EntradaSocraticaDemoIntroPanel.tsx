'use client'

/**
 * Texto explicativo antes de abrir o exemplo “visão do cliente” nas landings socráticas legadas.
 */

export interface EntradaSocraticaDemoIntroPanelProps {
  /** Quem “responde” no exemplo, ex.: "seu paciente", "sua cliente". */
  quemRespondeNoExemplo: string
  onAbrirExemplo: () => void
  onVoltar: () => void
  disabled?: boolean
}

export default function EntradaSocraticaDemoIntroPanel({
  quemRespondeNoExemplo,
  onAbrirExemplo,
  onVoltar,
  disabled,
}: EntradaSocraticaDemoIntroPanelProps) {
  return (
    <>
      <h2 id="demo-title" className="text-lg font-semibold text-gray-900">
        Como funciona na prática
      </h2>
      <div className="mt-3 space-y-3 text-sm text-gray-700 leading-relaxed">
        <p>
          Você <strong>cria e compartilha um link seu</strong>, personalizado para a sua área — bio, Instagram,
          WhatsApp ou anúncio.
        </p>
        <p>
          Quem tem interesse <strong>abre esse link e responde às perguntas</strong> antes de te chamar. Assim essa
          pessoa chega com mais contexto na primeira conversa com você.
        </p>
        <p>
          A seguir você vê <strong>só um exemplo</strong> do que {quemRespondeNoExemplo} veria nesse fluxo. Depois do
          cadastro, o <strong>Noel</strong> te ajuda a montar o seu de verdade.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={onAbrirExemplo}
          disabled={disabled}
          className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Abrir exemplo
        </button>
        <button
          type="button"
          onClick={onVoltar}
          className="w-full min-h-[44px] rounded-xl text-gray-600 font-medium hover:bg-gray-50 text-sm"
        >
          ← Voltar
        </button>
      </div>
    </>
  )
}
