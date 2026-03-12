'use client'

/**
 * Cena 1: Mensagens de pessoas curiosas (estilo WhatsApp).
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

const DEMO_MESSAGES = [
  { id: 1, from: 'other', text: 'Oi, vi seu perfil. Você atende?', time: '09:12' },
  { id: 2, from: 'other', text: 'Quanto custa?', time: '09:14' },
  { id: 3, from: 'other', text: 'Você atende online?', time: '09:18' },
  {
    id: 4,
    from: 'me',
    text: 'Olá! Posso te enviar uma avaliação rápida\npara entendermos melhor sua necessidade?',
    time: '09:22',
  },
  { id: 5, from: 'other', text: 'Pode ser. Me manda o link', time: '09:23' },
]

export default function MessagesProblemScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col bg-[#f8f9fa] rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Texto inicial: gatilho para quem assiste */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 text-center">
        <p className="text-sm text-gray-500">
          Muitas perguntas.
          <br />
          Pouco contexto.
        </p>
      </div>
      {/* Header tipo app */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">Conversas</p>
          <p className="text-xs text-gray-500">Várias pessoas escrevendo...</p>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {DEMO_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                msg.from === 'me'
                  ? 'bg-[#0ea5e9] text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
              }`}
            >
              <p className={`text-sm leading-snug ${msg.from === 'me' && msg.text.includes('\n') ? 'whitespace-pre-line' : ''}`}>{msg.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.from === 'me' ? 'text-sky-100' : 'text-gray-400'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
