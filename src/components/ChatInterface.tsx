'use client'

import React, { useState, useRef, useEffect } from 'react'
import { UserProfile, AssistantResponse } from '@/lib/openai-assistant-specialized'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: 'positive' | 'negative' | 'neutral'
}

interface ChatInterfaceProps {
  onComplete: (profile: UserProfile) => void
}

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá 👋 Sou a YLADA! Vou criar sua ferramenta de leads em 60 segundos.\n\n**Para começar, me conte:**\n• Qual é sua profissão? (ex: nutricionista, personal trainer, coach...)\n• Qual seu objetivo principal? (atrair clientes, vender produtos, gerar leads...)\n\nPode responder tudo de uma vez! 🚀',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({})
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
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    // Usar IA especializada YLADA Health
    console.log('🤖 Usando YLADA Health Specialized')
    
    try {
      const response = await fetch('/api/ylada-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userProfile,
          threadId: null
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        
        // Se a resposta indica conclusão, chamar onComplete
        if (data.complete && data.profile) {
          setTimeout(() => {
            onComplete(data.profile)
          }, 2000)
        }
        
        setIsTyping(false)
        return
      }
    } catch (error) {
      console.error('Erro ao chamar IA especializada:', error)
    }
    
    // Fallback local se a API falhar
    console.log('🎯 Usando fallback local (API falhou)')
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Fallback inteligente local
    const input = currentInput.toLowerCase()
    
    // Usar informações já detectadas anteriormente + nova entrada
    let detectedProfession = userProfile.profissao || ''
    let detectedObjective = userProfile.objetivo_principal || ''
    
    // Detectar profissões (só se ainda não foi detectada)
    if (!detectedProfession) {
      if (input.includes('nutricionista') || input.includes('nutrição') || input.includes('nutricao')) {
        detectedProfession = 'nutricionista'
      } else if (input.includes('personal trainer') || input.includes('educador físico') || input.includes('personal')) {
        detectedProfession = 'personal trainer'
      } else if (input.includes('fisioterapeuta') || input.includes('fisio')) {
        detectedProfession = 'fisioterapeuta'
      } else if (input.includes('coach') || input.includes('mentor')) {
        detectedProfession = 'coach'
      } else if (input.includes('esteticista') || input.includes('estética')) {
        detectedProfession = 'esteticista'
      }
    }
    
    // Detectar objetivos (só se ainda não foi detectado)
    if (!detectedObjective) {
      if (input.includes('atrair') || input.includes('novos clientes') || input.includes('leads') || 
          input.includes('cliente') || input.includes('agenda vazia') || input.includes('mais cliente') ||
          input.includes('ter mais') || input.includes('conseguir cliente') || input.includes('buscar cliente')) {
        detectedObjective = 'atrair novos clientes'
      } else if (input.includes('vender') || input.includes('produtos') || input.includes('vendas')) {
        detectedObjective = 'vender produtos/serviços'
      } else if (input.includes('engajar') || input.includes('fidelizar') || input.includes('manter')) {
        detectedObjective = 'engajar clientes atuais'
      } else if (input.includes('educar') || input.includes('conhecimento') || input.includes('autoridade')) {
        detectedObjective = 'educar e gerar valor'
      }
    }
    
    // Detectar escolha de ferramenta específica
    let selectedTool = ''
    if (input.includes('quiz') || input.includes('perfil metabólico') || input.includes('perfil nutricional')) {
      selectedTool = 'quiz'
    } else if (input.includes('calculadora') || input.includes('déficit calórico') || input.includes('treino ideal')) {
      selectedTool = 'calculadora'
    } else if (input.includes('diagnóstico') || input.includes('relação com a comida') || input.includes('clareza mental')) {
      selectedTool = 'diagnostico'
    } else if (input.includes('desafio') || input.includes('7 dias') || input.includes('foco total')) {
      selectedTool = 'desafio'
    } else if (input.includes('checklist') || input.includes('30 dias') || input.includes('transformação')) {
      selectedTool = 'checklist'
    } else if (input.includes('ranking') || input.includes('nível de fitness')) {
      selectedTool = 'ranking'
    }
    
    // Atualizar perfil com novas informações detectadas
    if (detectedProfession || detectedObjective) {
      setUserProfile(prev => ({
        ...prev,
        ...(detectedProfession && { profissao: detectedProfession }),
        ...(detectedObjective && { objetivo_principal: detectedObjective })
      }))
    }
    
    let fallbackContent = ''
    
    // Gerar resposta baseada no que foi detectado
    if (detectedProfession && detectedObjective && selectedTool) {
      // Usuário escolheu uma ferramenta específica - criar agora!
      fallbackContent = `Perfeito! Vou criar sua **${selectedTool}** personalizada para ${detectedProfession}!

🚀 **Gerando sua ferramenta...**

${selectedTool === 'quiz' ? '🧩 Criando Quiz personalizado com perguntas inteligentes...' :
  selectedTool === 'calculadora' ? '🧮 Criando Calculadora com fórmulas especializadas...' :
  selectedTool === 'diagnostico' ? '📊 Criando Diagnóstico com análise completa...' :
  selectedTool === 'desafio' ? '🏋️ Criando Desafio com cronograma personalizado...' :
  selectedTool === 'checklist' ? '📋 Criando Checklist com tarefas específicas...' :
  '📈 Criando Ranking com métricas personalizadas...'}

Aguarde alguns segundos... ⏳`

      // Criar ferramenta com a escolha específica
      const newProfile = {
        profissao: detectedProfession,
        objetivo_principal: detectedObjective,
        especializacao: 'geral',
        publico_alvo: 'novos clientes',
        tipo_ferramenta: selectedTool
      }
      
      setUserProfile(newProfile)
      
      // Criar após delay
      setTimeout(() => {
        onComplete(newProfile)
      }, 3000)
      
    } else if (detectedProfession && detectedObjective) {
      // Usuário forneceu profissão e objetivo - mostrar opções
      fallbackContent = `Perfeito! Entendi que você é **${detectedProfession}** e quer **${detectedObjective}**.

🎯 **Aqui estão as melhores ferramentas para você:**

${detectedProfession === 'nutricionista' ? `
🧩 **Quiz "Descubra seu Perfil Metabólico"** - ideal para atrair leads qualificados
🧮 **Calculadora "Seu Déficit Calórico Ideal"** - excelente para engajamento
📊 **Diagnóstico "Avalie sua Relação com a Comida"** - perfeito para conversão
` : detectedProfession === 'personal trainer' ? `
🏋️ **Desafio "7 Dias de Foco Total"** - ideal para engajamento
📈 **Ranking "Seu Nível de Fitness"** - excelente para gamificação
🧮 **Calculadora "Seu Treino Ideal"** - perfeito para personalização
` : detectedProfession === 'coach' ? `
🧠 **Diagnóstico "Mapa da Clareza Mental"** - ideal para autoconhecimento
📋 **Checklist "Transformação em 30 Dias"** - excelente para engajamento
🎯 **Quiz "Seu Perfil de Liderança"** - perfeito para desenvolvimento
` : `
🧩 **Quiz Personalizado** - ideal para ${detectedObjective}
📊 **Diagnóstico Especializado** - excelente para engajamento
🧮 **Calculadora Inteligente** - perfeito para conversão
`}

**Qual dessas ferramentas você gostaria de criar primeiro?** 
Digite o nome da ferramenta ou número da opção! 🚀`

      // Atualizar perfil mas NÃO finalizar automaticamente
      const newProfile = {
        profissao: detectedProfession,
        objetivo_principal: detectedObjective,
        especializacao: 'geral',
        publico_alvo: 'novos clientes',
        tipo_ferramenta: 'quiz'
      }
      
      setUserProfile(newProfile)
      
    } else if (detectedProfession && !detectedObjective) {
      // Só detectou profissão - perguntar objetivo
      fallbackContent = `Ótimo! Vejo que você é **${detectedProfession}**.

Agora me conte: **qual é seu objetivo principal** com essa ferramenta?

• 🎯 **Atrair novos clientes** - pessoas interessadas em seus serviços
• 🤝 **Engajar clientes atuais** - manter relacionamento e fidelidade  
• 🌟 **Gerar indicações** - transformar clientes em promotores
• 🛒 **Vender produtos/serviços** - aumentar vendas e conversão
• 📘 **Educar e gerar valor** - mostrar autoridade e conhecimento

**Qual desses objetivos mais se alinha com o que você quer criar hoje?**`
      
    } else if (detectedObjective && !detectedProfession) {
      // Só detectou objetivo - perguntar profissão
      fallbackContent = `Perfeito! Entendi que você quer **${detectedObjective}**.

Agora me conte: **qual é sua profissão ou área de atuação?**

• 🥗 **Nutricionista** - especialista em alimentação e saúde
• 🏋️ **Personal Trainer** - especialista em exercícios e fitness
• 🩺 **Fisioterapeuta** - especialista em reabilitação e movimento
• 🧠 **Coach** - especialista em desenvolvimento pessoal
• 💆 **Esteticista** - especialista em beleza e bem-estar
• ✨ **Outro** - me conte sua profissão específica

**Qual é sua área de atuação?**`
      
    } else {
      // Não detectou nada específico - pergunta mais direta
      fallbackContent = `Entendi! Para criar a ferramenta perfeita para você, preciso saber:

**1. Qual é sua profissão?** (ex: nutricionista, personal trainer, coach...)
**2. Qual seu objetivo principal?** (atrair clientes, vender produtos, gerar leads...)

Pode responder tudo de uma vez! Assim eu crio algo personalizado para suas necessidades específicas. 🎯`
    }
    
    const fallbackMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: fallbackContent,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, fallbackMessage])
    setIsTyping(false)
  }

  // Função para enviar feedback
  const sendFeedback = async (messageId: string, feedback: 'positive' | 'negative') => {
    try {
      await fetch('/api/ylada-learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: 'feedback',
          userProfile,
          assistantResponse: { messageId },
          userFeedback: feedback
        })
      })

      // Atualizar mensagem com feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback }
          : msg
      ))

      console.log(`📚 Feedback ${feedback} enviado para mensagem ${messageId}`)
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
    }
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
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.type === 'assistant' && !message.feedback && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => sendFeedback(message.id, 'positive')}
                      className="text-xs text-green-600 hover:text-green-800 transition-colors"
                      title="Feedback positivo"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => sendFeedback(message.id, 'negative')}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                      title="Feedback negativo"
                    >
                      👎
                    </button>
                  </div>
                )}
                {message.feedback && (
                  <span className="text-xs text-gray-500">
                    {message.feedback === 'positive' ? '👍' : '👎'} Obrigado!
                  </span>
                )}
              </div>
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
            {isTyping ? 'Pensando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}