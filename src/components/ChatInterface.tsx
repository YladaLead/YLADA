'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onComplete: (profile: any) => void
}

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá 👋 Sou a YLADA, sua assistente para criar ferramentas inteligentes de geração de leads em menos de 60 segundos. Me conte rapidinho: qual é a sua profissão ou área de atuação?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<any>({})
  const [currentStep, setCurrentStep] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular resposta da IA baseada no passo atual
    setTimeout(() => {
      const assistantResponse = generateAssistantResponse(inputValue, currentStep, userProfile)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setUserProfile(prev => ({ ...prev, ...assistantResponse.profile }))
      
      if (assistantResponse.nextStep) {
        setCurrentStep(assistantResponse.nextStep)
      }
      
      if (assistantResponse.complete) {
        setTimeout(() => {
          onComplete(userProfile)
        }, 1000)
      }
      
      setIsTyping(false)
    }, 1500)
  }

  const generateAssistantResponse = (userInput: string, step: number, profile: any) => {
    const input = userInput.toLowerCase()
    
    switch (step) {
      case 1: // Profissão - Baseado no prompt da YLADA
        const profession = userInput
        return {
          message: `Perfeito! E qual é o foco principal do seu trabalho? (Exemplo: emagrecimento, estética facial, educação financeira, marketing digital, produtividade, saúde emocional…)`,
          profile: { profissao: profession },
          nextStep: 2
        }

      case 2: // Especialização
        return {
          message: `Ótimo! E com quem você quer se conectar mais agora?
👩‍💼 Clientes novos
💆 Clientes atuais
💌 Indicações e amigos
💰 Pessoas prontas para comprar
🎓 Alunos ou participantes`,
          profile: { especializacao: userInput },
          nextStep: 3
        }

      case 3: // Público-alvo
        return {
          message: `Entendi! E qual é o objetivo desta ferramenta?
🎯 Atrair novos leads
🤝 Engajar clientes atuais
🌟 Gerar indicações
🛒 Vender produtos / programas
📘 Educar e gerar valor
🔍 Diagnosticar necessidades
💼 Vender consultas, aulas ou mentorias`,
          profile: { publico_alvo: userInput },
          nextStep: 4
        }

      case 4: // Objetivo
        return {
          message: `Excelente! Qual tipo de ferramenta você gostaria de criar?
🧩 Quiz
🧮 Calculadora
🧾 Checklist
📊 Planilha
💌 Link de Indicação
🏆 Ranking
🎟️ Cupom
📚 E-book
🧠 Diagnóstico IA
📅 Agendador
⚡ Simulador
🧭 Teste de Perfil
📘 Guia Educacional`,
          profile: { objetivo_principal: userInput },
          nextStep: 5
        }

      case 5: // Tipo de ferramenta
        return {
          message: `Perfeito! Você prefere algo mais **profissional e técnico** ou mais **leve e divertido**?`,
          profile: { tipo_ferramenta: userInput },
          nextStep: 6
        }

      case 6: // Tom e estilo - Gerar sugestões baseadas no prompt
        const suggestions = generateToolSuggestions({ ...profile, preferencias_ia: { tom: userInput } })
        return {
          message: suggestions,
          profile: { preferencias_ia: { tom: userInput, use_emojis: true } },
          nextStep: 7
        }

      case 7: // Sugestões e finalização
        if (input.includes('gerar') || input.includes('link') || input.includes('criar')) {
          return {
            message: `🎯 Perfeito! Vou gerar sua ferramenta agora!

✅ **${getSuggestedToolName(profile)}**

🔗 Link sendo criado...
🎨 Capa visual sendo gerada...

Sua ferramenta estará pronta em segundos!`,
            profile: { selectedTool: userInput },
            complete: true
          }
        }
        return {
          message: `Quer que eu gere o link e a capa visual da ferramenta sugerida? 🎨`,
          profile: {},
          nextStep: 7
        }

      default:
        return {
          message: 'Como posso te ajudar a criar sua próxima ferramenta de geração de leads?',
          profile: {},
          nextStep: step
        }
    }
  }

  // Gerar sugestões baseadas no perfil - Baseado no prompt da YLADA
  const generateToolSuggestions = (profile: any): string => {
    const { profissao, especializacao, objetivo_principal, tipo_ferramenta } = profile
    
    let suggestions = `🎯 Sugestões para você:\n\n`
    
    // Lógica de sugestões baseada no prompt da YLADA
    if (profissao?.toLowerCase().includes('nutricionista')) {
      suggestions += `✅ **Quiz "Descubra seu Perfil Metabólico"** — ideal para ${objetivo_principal} com ${profile.publico_alvo}.\n`
      suggestions += `✅ **Calculadora "Seu Índice de Energia"** — excelente para gerar leads qualificados.\n`
    } else if (profissao?.toLowerCase().includes('esteticista')) {
      suggestions += `✅ **Simulador "Monte seu Tratamento Ideal"** — ideal para ${objetivo_principal}.\n`
      suggestions += `✅ **Catálogo "Transforme sua Pele em 30 Dias"** — excelente para conversão.\n`
    } else if (profissao?.toLowerCase().includes('personal trainer')) {
      suggestions += `✅ **Desafio "7 Dias de Foco Total"** — ideal para engajamento.\n`
      suggestions += `✅ **Ranking "Seu Nível de Fitness"** — excelente para gamificação.\n`
    } else if (profissao?.toLowerCase().includes('coach')) {
      suggestions += `✅ **Diagnóstico "Mapa da Clareza Mental"** — ideal para ${objetivo_principal}.\n`
      suggestions += `✅ **E-book "Guia de Transformação"** — excelente para gerar valor.\n`
    } else {
      suggestions += `✅ **${tipo_ferramenta} "${getSuggestedToolName(profile)}"** — ideal para ${objetivo_principal}.\n`
      suggestions += `✅ **Checklist "Guia de Sucesso"** — excelente para gerar valor.\n`
    }
    
    suggestions += `\nQuer que eu gere o link e a capa visual da primeira? 🎨`
    
    return suggestions
  }

  // Gerar nome da ferramenta baseado no perfil - Baseado no prompt da YLADA
  const getSuggestedToolName = (profile: any): string => {
    const { profissao, especializacao, tipo_ferramenta } = profile
    
    if (profissao?.toLowerCase().includes('nutricionista')) {
      return 'Descubra seu Perfil Metabólico'
    } else if (profissao?.toLowerCase().includes('esteticista')) {
      return 'Monte seu Tratamento Ideal'
    } else if (profissao?.toLowerCase().includes('personal trainer')) {
      return 'Desafio dos 7 Dias de Foco'
    } else if (profissao?.toLowerCase().includes('coach')) {
      return 'Mapa da Clareza Mental'
    } else {
      return `${tipo_ferramenta} de ${especializacao}`
    }
  }

  const getRecommendedTools = (profession: string, objective: string) => {
    const tools = {
      'capturar-leads': ['❓ Quiz de Perfil de Energia', '🧮 Calculadora de Equilíbrio', '✅ Checklist de Rotina'],
      'gerar-indicacoes': ['🔗 Link de Indicação', '🏆 Ranking de Indicadores', '🎫 Cupom Inteligente'],
      'vender-servicos': ['📅 Agendador Inteligente', '🎮 Simulador de Resultados', '📋 Plano Personalizado'],
      'educar-valor': ['📖 Mini E-book', '📊 Tabela Educacional', '✅ Checklist Prático'],
      'avaliar-habitos': ['🔍 Diagnóstico IA', '📈 Planilha de Autoavaliação', '📊 Tabela de Pontuação']
    }
    
    return tools[objective as keyof typeof tools]?.map(tool => `• ${tool}`).join('\n') || '• Ferramentas personalizadas'
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">Y</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">YLADA Assistant</h3>
          <p className="text-sm text-gray-500">Criando sua ferramenta de leads...</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua resposta..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
