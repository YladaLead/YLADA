'use client'

import { useState } from 'react'
import ChatVendas from './ChatVendas'

export default function ChatVendasButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        aria-label="Abrir chat com atendente"
      >
        <span className="text-2xl">💬</span>
        <span className="hidden sm:block font-semibold">Fale com a Ana</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </button>

      {/* Componente de Chat */}
      <ChatVendas isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

