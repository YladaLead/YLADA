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
      content: 'Olá! Sou a YLADA, sua assistente para criar ferramentas de geração de leads em 60 segundos. Vou te ajudar a criar a ferramenta perfeita para seu negócio. Para começar, me conte: qual é sua profissão?',
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
      case 1: // Profissão
        const profession = input.includes('nutricionista') ? 'nutricionista' :
                          input.includes('personal') ? 'personal-trainer' :
                          input.includes('fisioterapeuta') ? 'fisioterapeuta' :
                          input.includes('coach') ? 'coach-bemestar' :
                          input.includes('vendedor') ? 'vendedor-saude' : 'outro'
        
        return {
          message: `Perfeito! Entendi que você é ${profession === 'nutricionista' ? 'nutricionista' : 
                   profession === 'personal-trainer' ? 'personal trainer' :
                   profession === 'fisioterapeuta' ? 'fisioterapeuta' :
                   profession === 'coach-bemestar' ? 'coach de bem-estar' :
                   profession === 'vendedor-saude' ? 'vendedor de produtos de saúde' : 'profissional da área'}. 

Agora me conte: qual é sua especialização ou área de foco principal?`,
          profile: { profession },
          nextStep: 2
        }

      case 2: // Especialização
        return {
          message: `Excelente! Agora preciso entender melhor seu público-alvo. Quem são as pessoas que você quer atrair? (ex: mulheres 25-45 anos, atletas, pessoas com problemas de peso, etc.)`,
          profile: { specialization: userInput },
          nextStep: 3
        }

      case 3: // Público-alvo
        return {
          message: `Ótimo! Agora vou te ajudar a definir seu objetivo principal. Qual dessas opções melhor descreve o que você quer alcançar hoje?

🎯 **Capturar Leads** - Gerar novos contatos interessados
👥 **Gerar Indicações** - Transformar clientes em promotores
💼 **Vender Serviços** - Converter leads em clientes pagos
📚 **Educar e Gerar Valor** - Estabelecer autoridade na área
📊 **Avaliar Necessidades** - Diagnosticar problemas dos leads

Qual dessas opções mais se alinha com seu objetivo?`,
          profile: { targetAudience: userInput },
          nextStep: 4
        }

      case 4: // Objetivo
        const objective = input.includes('capturar') ? 'capturar-leads' :
                        input.includes('indic') ? 'gerar-indicacoes' :
                        input.includes('vender') ? 'vender-servicos' :
                        input.includes('educar') ? 'educar-valor' :
                        input.includes('avaliar') ? 'avaliar-habitos' : 'capturar-leads'

        return {
          message: `Perfeito! Baseado no seu perfil, vou sugerir as melhores ferramentas para você:

**Seu Perfil:**
• Profissão: ${profile.profession}
• Especialização: ${profile.specialization}
• Público: ${profile.targetAudience}
• Objetivo: ${objective}

**Ferramentas Recomendadas:**
${getRecommendedTools(profile.profession, objective)}

Qual dessas ferramentas mais te interessa? Ou prefere que eu crie algo personalizado?`,
          profile: { objective },
          nextStep: 5
        }

      case 5: // Escolha da ferramenta
        return {
          message: `Excelente escolha! Vou criar sua ferramenta personalizada agora mesmo. 

Em alguns segundos você terá um link único e otimizado para seu negócio! 🚀`,
          profile: { selectedTool: userInput },
          complete: true
        }

      default:
        return {
          message: 'Desculpe, não entendi. Pode repetir?',
          profile: {},
          nextStep: step
        }
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
