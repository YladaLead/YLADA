'use client'

import { useState, useRef, useEffect } from 'react'

interface Mensagem {
  id: number
  tipo: 'usuario' | 'assistente'
  texto: string
  timestamp: string
}

interface ChatIAProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatIA({ isOpen, onClose }: ChatIAProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      tipo: 'assistente',
      texto: 'Olá! Sou a assistente IA da YLADA. Posso te ajudar com dúvidas sobre ferramentas, leads, relatórios ou qualquer questão sobre a plataforma. Como posso te ajudar hoje?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [digitando, setDigitando] = useState(false)
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
    setNovaMensagem('')
    setDigitando(true)

    // Simular resposta da IA baseada no contexto
    setTimeout(() => {
      const resposta = gerarRespostaIA(novaMensagem)
      const respostaIA: Mensagem = {
        id: Date.now() + 1,
        tipo: 'assistente',
        texto: resposta,
        timestamp: new Date().toLocaleTimeString()
      }

      setMensagens(prev => [...prev, respostaIA])
      setDigitando(false)
    }, 1500)
  }

  const gerarRespostaIA = (pergunta: string): string => {
    const perguntaLower = pergunta.toLowerCase()

    // Respostas baseadas em palavras-chave
    if (perguntaLower.includes('ferramenta') || perguntaLower.includes('quiz') || perguntaLower.includes('calculadora')) {
      return 'As ferramentas YLADA são criadas para capturar leads qualificados automaticamente. Você pode criar quizzes, calculadoras e conteúdo interativo. Cada ferramenta funciona 24/7 e gera leads com informações específicas sobre os interesses dos usuários. Quer que eu te ajude a criar uma nova ferramenta?'
    }

    if (perguntaLower.includes('lead') || perguntaLower.includes('cliente') || perguntaLower.includes('contato')) {
      return 'Os leads são capturados automaticamente quando usuários interagem com suas ferramentas. Cada lead vem com informações detalhadas: nome, email, telefone, idade, cidade, interesse específico e score de qualificação. Você pode filtrar, segmentar e acompanhar todos os leads no seu dashboard.'
    }

    if (perguntaLower.includes('relatório') || perguntaLower.includes('analytics') || perguntaLower.includes('métrica')) {
      return 'Os relatórios mostram métricas detalhadas: total de leads, taxa de conversão, receita gerada, demografia dos usuários e performance por ferramenta. Você pode filtrar por período e ver insights personalizados para otimizar suas estratégias.'
    }

    if (perguntaLower.includes('como') && perguntaLower.includes('funciona')) {
      return 'A YLADA funciona assim: 1) Você cria ferramentas (quiz, calculadora, conteúdo), 2) Compartilha links personalizados, 3) Usuários interagem e deixam contato, 4) Leads aparecem no seu dashboard, 5) Você acompanha métricas e otimiza. É um sistema completo de captação e gestão de leads!'
    }

    if (perguntaLower.includes('ajuda') || perguntaLower.includes('problema') || perguntaLower.includes('erro')) {
      return 'Posso te ajudar com qualquer dúvida! Para problemas técnicos, você pode acessar nossa central de suporte ou entrar em contato via WhatsApp (11) 99999-9999. Para dúvidas sobre funcionalidades, posso te orientar aqui mesmo no chat.'
    }

    if (perguntaLower.includes('preço') || perguntaLower.includes('valor') || perguntaLower.includes('custo')) {
      return 'Os preços variam conforme o plano escolhido. Temos planos específicos para nutricionistas com diferentes níveis de ferramentas e funcionalidades. Para informações detalhadas sobre preços, recomendo entrar em contato com nossa equipe comercial.'
    }

    // Resposta padrão
    return 'Entendi sua pergunta! A YLADA é uma plataforma completa para nutricionistas capturarem e gerenciarem leads qualificados através de ferramentas interativas. Posso te ajudar com dúvidas específicas sobre ferramentas, leads, relatórios ou qualquer funcionalidade da plataforma. O que você gostaria de saber?'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-80 h-96 flex flex-col">
        {/* Header do Chat */}
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🤖</span>
            <div>
              <h3 className="font-semibold">Assistente IA</h3>
              <p className="text-xs text-blue-100">Online agora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  mensagem.tipo === 'usuario'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{mensagem.texto}</p>
                <p className="text-xs opacity-70 mt-1">{mensagem.timestamp}</p>
              </div>
            </div>
          ))}
          
          {digitando && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={mensagensEndRef} />
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={digitando}
            />
            <button
              onClick={enviarMensagem}
              disabled={digitando || !novaMensagem.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Dica: Pergunte sobre ferramentas, leads, relatórios ou qualquer dúvida!
          </p>
        </div>
      </div>
    </div>
  )
}
