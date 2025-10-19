'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'

interface UserProfile {
  id: string
  nome: string
  profession: string  // Mudou de 'profissao' para 'profession'
  specialization: string  // Mudou de 'especializacao' para 'specialization'
  target_audience: string  // Mudou de 'publico_alvo' para 'target_audience'
  main_objective: string  // Mudou de 'objetivo_principal' para 'main_objective'
}

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ToolSuggestion {
  id: string
  nome: string
  tipo: string
  titulo: string
  descricao: string
  taxa_conversao: number
  leads_gerados: number
}

export default function SmartChatPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedTools, setSuggestedTools] = useState<ToolSuggestion[]>([])

  // Mock data - será substituído por dados reais do Supabase
  useEffect(() => {
    // Simular carregamento do perfil do usuário
    setUserProfile({
      id: '1',
      nome: 'Maria Silva',
      profession: 'nutricionista',  // Mudou de 'profissao' para 'profession'
      specialization: 'emagrecimento',  // Mudou de 'especializacao' para 'specialization'
      target_audience: 'iniciantes',  // Mudou de 'publico_alvo' para 'target_audience'
      main_objective: 'atrair novos clientes'  // Mudou de 'objetivo_principal' para 'main_objective'
    })

    // Mensagem inicial personalizada
    const initialMessage: ChatMessage = {
      id: '1',
      content: `Olá ${userProfile?.nome || 'Maria'}! 👋 

Vejo que você é **${userProfile?.profession || 'nutricionista'}** especializada em **${userProfile?.specialization || 'emagrecimento'}** e quer **${userProfile?.main_objective || 'atrair novos clientes'}**.

🎯 **Que tipo de ferramenta você gostaria de criar hoje?**

• 🧩 **Quiz** - para identificar necessidades específicas
• 🧮 **Calculadora** - para métricas personalizadas  
• 📊 **Diagnóstico** - para avaliação completa
• 📋 **Checklist** - para guias passo a passo
• 🏋️ **Desafio** - para engajamento gamificado

**Ou me conte sua ideia específica!** 🚀`,
      isUser: false,
      timestamp: new Date()
    }

    setMessages([initialMessage])
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simular resposta inteligente baseada no perfil
    setTimeout(() => {
      const response = generateIntelligentResponse(input, userProfile)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (response.tools) {
        setSuggestedTools(response.tools)
      }
      
      setIsTyping(false)
    }, 1500)
  }

  const generateIntelligentResponse = (userInput: string, profile: UserProfile | null) => {
    const input = userInput.toLowerCase()

    // Detectar tipo de ferramenta desejada
    if (input.includes('quiz') || input.includes('pergunta')) {
      return {
        message: `Perfeito! Um **Quiz** é ideal para ${profile?.profession}s que querem ${profile?.main_objective}!

🎯 **Sugestões de Quiz para ${profile?.specialization}:**

1️⃣ **"Descubra seu Perfil Metabólico"** - identifica tipo metabólico para estratégias personalizadas
2️⃣ **"Avalie seus Hábitos Alimentares"** - mapeia padrões e oportunidades de melhoria  
3️⃣ **"Teste seu Conhecimento Nutricional"** - engaja e educa seu público

**Qual desses temas mais se alinha com sua estratégia?**

Ou me conte: **que pergunta específica você quer fazer para seus clientes?** 🤔`,
        tools: [
          {
            id: '1',
            nome: 'Quiz Perfil Metabólico',
            tipo: 'quiz',
            titulo: 'Descubra seu Perfil Metabólico',
            descricao: 'Identifica o tipo metabólico para personalizar estratégias de emagrecimento',
            taxa_conversao: 35.2,
            leads_gerados: 156
          }
        ]
      }
    }

    if (input.includes('calculadora') || input.includes('calcular')) {
      return {
        message: `Excelente escolha! **Calculadoras** são muito eficazes para ${profile?.profession}s!

🧮 **Calculadoras que convertem bem para ${profile?.specialization}:**

1️⃣ **"Seu Déficit Calórico Ideal"** - calcula déficit perfeito para perda de peso
2️⃣ **"IMC e Peso Ideal"** - avalia composição corporal atual
3️⃣ **"Calorias por Atividade"** - mostra gasto energético por exercício
4️⃣ **"Macronutrientes Diários"** - distribui proteínas, carboidratos e gorduras

**Qual métrica seus clientes mais querem descobrir?**

💡 **Dica:** Calculadoras têm alta conversão porque entregam valor imediato!`,
        tools: [
          {
            id: '2',
            nome: 'Calculadora Déficit Calórico',
            tipo: 'calculadora',
            titulo: 'Seu Déficit Calórico Ideal',
            descricao: 'Calcula o déficit calórico perfeito para perda de peso sustentável',
            taxa_conversao: 42.8,
            leads_gerados: 89
          }
        ]
      }
    }

    if (input.includes('diagnóstico') || input.includes('avaliação')) {
      return {
        message: `Ótima estratégia! **Diagnósticos** são perfeitos para ${profile?.main_objective}!

📊 **Diagnósticos que geram leads qualificados:**

1️⃣ **"Avalie sua Relação com a Comida"** - identifica padrões alimentares e gatilhos
2️⃣ **"Diagnóstico de Metabolismo"** - avalia eficiência metabólica atual
3️⃣ **"Análise de Hábitos Saudáveis"** - mapeia pontos fortes e oportunidades
4️⃣ **"Avaliação de Necessidades Nutricionais"** - identifica deficiências específicas

**Que aspecto você quer que seus clientes avaliem primeiro?**

🎯 **Diagnósticos são ótimos porque:** identificam necessidades específicas e justificam a necessidade do seu serviço!`,
        tools: [
          {
            id: '3',
            nome: 'Diagnóstico Relação com Comida',
            tipo: 'diagnostico',
            titulo: 'Avalie sua Relação com a Comida',
            descricao: 'Identifica padrões alimentares e gatilhos emocionais',
            taxa_conversao: 28.5,
            leads_gerados: 67
          }
        ]
      }
    }

    // Resposta genérica inteligente
    return {
      message: `Entendi! Baseado no seu perfil de **${profile?.profession}** especializada em **${profile?.specialization}**, vou sugerir as melhores opções:

🎯 **Ferramentas mais eficazes para ${profile?.main_objective}:**

1️⃣ **🧩 Quiz "Perfil Metabólico"** - 35% conversão, 156 leads gerados
2️⃣ **🧮 Calculadora "Déficit Calórico"** - 43% conversão, 89 leads gerados  
3️⃣ **📊 Diagnóstico "Relação com Comida"** - 29% conversão, 67 leads gerados

**Qual dessas ferramentas você gostaria de criar?**

Ou me conte: **que problema específico seus clientes têm que você quer resolver?** 

💡 **Com seu perfil, qualquer uma dessas ferramentas vai gerar leads qualificados!**`,
      tools: [
        {
          id: '1',
          nome: 'Quiz Perfil Metabólico',
          tipo: 'quiz',
          titulo: 'Descubra seu Perfil Metabólico',
          descricao: 'Identifica o tipo metabólico para personalizar estratégias de emagrecimento',
          taxa_conversao: 35.2,
          leads_gerados: 156
        },
        {
          id: '2',
          nome: 'Calculadora Déficit Calórico',
          tipo: 'calculadora',
          titulo: 'Seu Déficit Calórico Ideal',
          descricao: 'Calcula o déficit calórico perfeito para perda de peso sustentável',
          taxa_conversao: 42.8,
          leads_gerados: 89
        },
        {
          id: '3',
          nome: 'Diagnóstico Relação com Comida',
          tipo: 'diagnostico',
          titulo: 'Avalie sua Relação com a Comida',
          descricao: 'Identifica padrões alimentares e gatilhos emocionais',
          taxa_conversao: 28.5,
          leads_gerados: 67
        }
      ]
    }
  }

  const handleCreateTool = (tool: ToolSuggestion) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content: `Perfeito! Vou criar sua **${tool.titulo}** agora!

🚀 **Gerando ferramenta personalizada...**

${tool.tipo === 'quiz' ? '🧩 Criando Quiz com perguntas inteligentes...' :
  tool.tipo === 'calculadora' ? '🧮 Criando Calculadora com fórmulas especializadas...' :
  '📊 Criando Diagnóstico com análise completa...'}

⏳ **Aguarde alguns segundos...**

Sua ferramenta estará pronta em breve! 🎯`,
      isUser: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setSuggestedTools([])

    // Simular criação da ferramenta
    setTimeout(() => {
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `🎉 **Ferramenta criada com sucesso!**

✅ **${tool.titulo}** está pronta!
🔗 **Link:** https://ylada.com/l/${tool.nome.toLowerCase().replace(/\s+/g, '-')}
📊 **Taxa de conversão esperada:** ${tool.taxa_conversao}%
👥 **Leads estimados:** ${tool.leads_gerados} por mês

**Próximos passos:**
1. 📱 Compartilhe no Instagram
2. 💬 Envie pelo WhatsApp
3. 📧 Use em newsletters
4. 🌐 Adicione no seu site

**Quer criar outra ferramenta ou precisa de ajuda com a divulgação?** 🚀`,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, successMessage])
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <YLADALogo />
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              👋 Olá, {userProfile?.nome}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {userProfile?.profession}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-sm h-96 overflow-y-auto p-6 mb-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '0.1s'}}></div>
                      <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Tools */}
          {suggestedTools.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Ferramentas Sugeridas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedTools.map((tool) => (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <span className="text-blue-600 text-lg">
                          {tool.tipo === 'quiz' ? '🧩' : 
                           tool.tipo === 'calculadora' ? '🧮' : '📊'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{tool.titulo}</h4>
                        <p className="text-sm text-gray-600">{tool.tipo}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tool.descricao}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-green-600 font-medium">
                        {tool.taxa_conversao}% conversão
                      </span>
                      <span className="text-gray-500">
                        {tool.leads_gerados} leads
                      </span>
                    </div>
                    <button
                      onClick={() => handleCreateTool(tool)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Criar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
