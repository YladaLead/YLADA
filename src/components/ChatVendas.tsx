'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Mensagem {
  id: number
  tipo: 'usuario' | 'assistente'
  texto: string
  timestamp: string
}

interface ChatVendasProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatVendas({ isOpen, onClose }: ChatVendasProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      tipo: 'assistente',
      texto: 'Olá! 👋 Sou a Ana, atendente da YLADA Nutri. 😊\n\nEstou aqui para te ajudar a entender como nossa plataforma pode transformar seu negócio como nutricionista.\n\n**O que você gostaria de saber?**\n\n• 📊 Como funciona a plataforma\n• 💰 Planos e preços\n• 🎯 Ferramentas de captação\n• 📈 Gestão profissional\n• 🎓 Formação Empresarial Nutri\n• ✅ Garantia e suporte\n\nPergunte-me qualquer coisa! Estou aqui para te ajudar a crescer! 🚀',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [digitando, setDigitando] = useState(false)
  const [sessionId] = useState(() => `vendas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const mensagensEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return

    const mensagemUsuario: Mensagem = {
      id: Date.now(),
      tipo: 'usuario',
      texto: novaMensagem,
      timestamp: new Date().toLocaleTimeString()
    }

    setMensagens(prev => [...prev, mensagemUsuario])
    const mensagemEnviada = novaMensagem
    setNovaMensagem('')
    setDigitando(true)

    try {
      const response = await fetch('/api/chat/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: mensagemEnviada,
          sessionId
        })
      })

      if (response.ok) {
        const data = await response.json()
        const respostaIA: Mensagem = {
          id: Date.now() + 1,
          tipo: 'assistente',
          texto: data.message || 'Desculpe, não consegui processar sua mensagem. Pode repetir?',
          timestamp: new Date().toLocaleTimeString()
        }

        setMensagens(prev => [...prev, respostaIA])
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const respostaErro: Mensagem = {
        id: Date.now() + 1,
        tipo: 'assistente',
        texto: 'Desculpe, estou com uma pequena dificuldade técnica. 😅\n\nMas posso te ajudar! Você pode:\n\n• 📞 Entrar em contato direto\n• 💰 Ver nossos planos e preços\n• 🎯 Conhecer as ferramentas\n\nOu tente fazer sua pergunta novamente!',
        timestamp: new Date().toLocaleTimeString()
      }
      setMensagens(prev => [...prev, respostaErro])
    } finally {
      setDigitando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }

  // Formatar texto com markdown simples
  const formatarTexto = (texto: string) => {
    // Quebrar em linhas
    const linhas = texto.split('\n')
    
    return linhas.map((linha, index) => {
      // Negrito
      const negrito = linha.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Lista
      const lista = negrito.replace(/^•\s(.+)$/gm, '<li>$1</li>')
      
      if (lista.includes('<li>')) {
        return <ul key={index} className="list-disc list-inside ml-2 space-y-1" dangerouslySetInnerHTML={{ __html: lista }} />
      }
      
      if (linha.trim() === '') {
        return <br key={index} />
      }
      
      return <p key={index} dangerouslySetInnerHTML={{ __html: negrito }} />
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 sm:w-96 h-[600px] flex flex-col">
        {/* Header do Chat */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <h3 className="font-semibold">Ana - YLADA Nutri</h3>
              <p className="text-xs opacity-90">Atendente Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity text-xl font-bold"
            aria-label="Fechar chat"
          >
            ×
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  mensagem.tipo === 'usuario'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {formatarTexto(mensagem.texto)}
                </div>
                <p className="text-xs opacity-70 mt-1">{mensagem.timestamp}</p>
              </div>
            </div>
          ))}
          
          {digitando && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 p-3 rounded-lg border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={mensagensEndRef} />
        </div>

        {/* CTA Fixo */}
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <Link
            href="/pt/nutri/checkout"
            className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            🛒 Ver Planos e Preços
          </Link>
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={digitando}
            />
            <button
              onClick={enviarMensagem}
              disabled={digitando || !novaMensagem.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

