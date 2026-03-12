'use client'

/**
 * Cena 7: Conversa iniciada após resultado.
 * Apenas layout visual para vídeo de demonstração YLADA.
 */

const MESSAGES = [
  { from: 'other', text: 'Vi o resultado da avaliação. Podemos conversar sobre isso?', time: '10:05' },
  { from: 'me', text: 'Claro. Vamos entender melhor.', time: '10:07' },
]

export default function ConversationScene() {
  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col bg-[#f8f9fa] rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">Maria</p>
          <p className="text-xs text-gray-500">Respondeu a avaliação • contexto claro</p>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                msg.from === 'me'
                  ? 'bg-[#0ea5e9] text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-snug">{msg.text}</p>
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
