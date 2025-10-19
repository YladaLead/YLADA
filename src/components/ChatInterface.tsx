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

  // Gerar sugestões específicas baseadas no perfil completo
  const generateSpecificSuggestions = (profession: string, specialization: string, objective: string): string => {
    if (profession === 'nutricionista') {
      if (specialization === 'emagrecimento') {
        return `
1️⃣ **Quiz "Descubra seu Perfil Metabólico"** - identifica tipo metabólico para emagrecimento personalizado
2️⃣ **Calculadora "Seu Déficit Calórico Ideal"** - calcula déficit perfeito para perda de peso sustentável
3️⃣ **Diagnóstico "Avalie sua Relação com a Comida"** - identifica padrões alimentares e gatilhos
4️⃣ **Checklist "Plano de Emagrecimento em 30 Dias"** - guia passo a passo para mudança de hábitos
5️⃣ **Simulador "Seu Peso Ideal"** - projeta resultados baseados no estilo de vida atual`
      } else if (specialization === 'nutrição esportiva') {
        return `
1️⃣ **Quiz "Seu Perfil de Performance"** - identifica necessidades nutricionais para esporte
2️⃣ **Calculadora "Suas Necessidades Proteicas"** - calcula proteína ideal para objetivos
3️⃣ **Diagnóstico "Recuperação e Hidratação"** - avalia estratégias de recuperação
4️⃣ **Planner "Nutrição Pré/Pós Treino"** - planeja refeições para performance
5️⃣ **Ranking "Seu Nível de Hidratação"** - avalia e melhora hidratação esportiva`
      } else if (specialization === 'comportamento alimentar') {
        return `
1️⃣ **Quiz "Seu Perfil Comportamental"** - identifica padrões e gatilhos alimentares
2️⃣ **Diagnóstico "Relação com a Comida"** - avalia saúde emocional e alimentar
3️⃣ **Checklist "Mindful Eating"** - guia para comer com consciência
4️⃣ **Simulador "Seus Gatilhos Alimentares"** - identifica situações de risco
5️⃣ **Planner "Refeições Conscientes"** - planeja refeições com foco no bem-estar`
      }
    } else if (profession === 'personal trainer') {
      if (specialization === 'musculação') {
        return `
1️⃣ **Quiz "Seu Perfil de Força"** - identifica nível e objetivos de musculação
2️⃣ **Calculadora "Volume de Treino Ideal"** - calcula séries e repetições personalizadas
3️⃣ **Diagnóstico "Recuperação Muscular"** - avalia tempo de descanso ideal
4️⃣ **Planner "Periodização"** - planeja ciclos de treino para hipertrofia
5️⃣ **Ranking "Seu Progresso"** - acompanha evolução de força e massa`
      } else if (specialization === 'funcional e mobilidade') {
        return `
1️⃣ **Quiz "Seu Nível de Mobilidade"** - identifica limitações e potencial
2️⃣ **Diagnóstico "Movimento Funcional"** - avalia padrões de movimento
3️⃣ **Checklist "Rotina de Mobilidade"** - guia para melhorar flexibilidade
4️⃣ **Desafio "7 Dias de Movimento"** - desafio para incorporar movimento
5️⃣ **Planner "Treino Funcional"** - planeja exercícios funcionais`
      }
    } else if (profession === 'coach') {
      if (specialization === 'life coaching') {
        return `
1️⃣ **Quiz "Seu Perfil de Desenvolvimento"** - identifica áreas de crescimento
2️⃣ **Diagnóstico "Mapa da Clareza Mental"** - avalia clareza de objetivos
3️⃣ **Checklist "Transformação em 30 Dias"** - guia para mudanças pessoais
4️⃣ **Planner "Metas Inteligentes"** - planeja objetivos alcançáveis
5️⃣ **Simulador "Seu Futuro Ideal"** - projeta vida desejada`
      } else if (specialization === 'executive coaching') {
        return `
1️⃣ **Quiz "Seu Perfil de Liderança"** - identifica estilo de liderança
2️⃣ **Diagnóstico "Competências Executivas"** - avalia habilidades de gestão
3️⃣ **Checklist "Liderança Eficaz"** - guia para melhorar liderança
4️⃣ **Planner "Desenvolvimento Executivo"** - planeja crescimento profissional
5️⃣ **Ranking "Performance de Equipe"** - avalia e melhora performance`
      }
    }
    
    // Fallback genérico
    return `
1️⃣ **Quiz Personalizado** - identifica necessidades específicas
2️⃣ **Calculadora Inteligente** - calcula métricas importantes
3️⃣ **Diagnóstico Completo** - avalia situação atual
4️⃣ **Checklist de Ação** - guia passo a passo
5️⃣ **Planner Personalizado** - planeja estratégias específicas`
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
        
        // NÃO chamar onComplete automaticamente - aguardar escolha do usuário
        // if (data.complete && data.profile) {
        //   setTimeout(() => {
        //     onComplete(data.profile)
        //   }, 2000)
        // }
        
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
    
    // Detectar especialização
    let detectedSpecialization = userProfile.especializacao || ''
    if (!detectedSpecialization) {
      if (input.includes('emagrecimento') || input.includes('perda de peso') || input.includes('emagrecer')) {
        detectedSpecialization = 'emagrecimento'
      } else if (input.includes('esportiva') || input.includes('atleta') || input.includes('performance')) {
        detectedSpecialization = 'nutrição esportiva'
      } else if (input.includes('materno') || input.includes('gestação') || input.includes('infantil')) {
        detectedSpecialization = 'materno-infantil'
      } else if (input.includes('comportamento') || input.includes('relação') || input.includes('comida')) {
        detectedSpecialization = 'comportamento alimentar'
      } else if (input.includes('clínica') || input.includes('doença') || input.includes('condição')) {
        detectedSpecialization = 'nutrição clínica'
      } else if (input.includes('musculação') || input.includes('hipertrofia') || input.includes('força')) {
        detectedSpecialization = 'musculação'
      } else if (input.includes('cardio') || input.includes('condicionamento') || input.includes('resistência')) {
        detectedSpecialization = 'cardio e condicionamento'
      } else if (input.includes('reabilitação') || input.includes('lesão') || input.includes('recuperação')) {
        detectedSpecialization = 'reabilitação'
      } else if (input.includes('funcional') || input.includes('mobilidade') || input.includes('movimento')) {
        detectedSpecialization = 'funcional e mobilidade'
      } else if (input.includes('life coaching') || input.includes('desenvolvimento pessoal')) {
        detectedSpecialization = 'life coaching'
      } else if (input.includes('executive') || input.includes('liderança') || input.includes('carreira')) {
        detectedSpecialization = 'executive coaching'
      } else if (input.includes('financeiro') || input.includes('dinheiro') || input.includes('investimento')) {
        detectedSpecialization = 'coaching financeiro'
      } else if (input.includes('mindfulness') || input.includes('bem-estar mental')) {
        detectedSpecialization = 'mindfulness'
      }
    }
    
    // Detectar público-alvo
    let detectedAudience = userProfile.publico_alvo || ''
    if (!detectedAudience) {
      if (input.includes('iniciante') || input.includes('começando') || input.includes('novato')) {
        detectedAudience = 'iniciantes'
      } else if (input.includes('intermediário') || input.includes('experiência') || input.includes('médio')) {
        detectedAudience = 'intermediários'
      } else if (input.includes('avançado') || input.includes('otimização') || input.includes('expert')) {
        detectedAudience = 'avançados'
      } else if (input.includes('todos') || input.includes('misto') || input.includes('geral')) {
        detectedAudience = 'todos os níveis'
      }
    }
    
    // Detectar escolha de ferramenta específica
    let selectedTool = ''
    if (input.includes('quiz') || input.includes('perfil metabólico') || input.includes('perfil nutricional') || 
        input.includes('1') || input.includes('primeira') || input.includes('primeiro')) {
      selectedTool = 'quiz'
    } else if (input.includes('calculadora') || input.includes('déficit calórico') || input.includes('treino ideal') ||
               input.includes('2') || input.includes('segunda') || input.includes('segundo')) {
      selectedTool = 'calculadora'
    } else if (input.includes('diagnóstico') || input.includes('relação com a comida') || input.includes('clareza mental') ||
               input.includes('3') || input.includes('terceira') || input.includes('terceiro')) {
      selectedTool = 'diagnostico'
    } else if (input.includes('desafio') || input.includes('7 dias') || input.includes('foco total')) {
      selectedTool = 'desafio'
    } else if (input.includes('checklist') || input.includes('30 dias') || input.includes('transformação')) {
      selectedTool = 'checklist'
    } else if (input.includes('ranking') || input.includes('nível de fitness')) {
      selectedTool = 'ranking'
    }
    
    // Detectar confirmação do usuário
    let userConfirmation = ''
    if (input.includes('sim') || input.includes('confirmo') || input.includes('criar') || input.includes('vamos')) {
      userConfirmation = 'sim'
    } else if (input.includes('não') || input.includes('nao') || input.includes('cancelar')) {
      userConfirmation = 'não'
    }
    
    // Detectar escolha de CTA
    let selectedCTA = ''
    if (input.includes('formulário') || input.includes('formulario') || input.includes('contato') || input.includes('1')) {
      selectedCTA = 'formulario'
    } else if (input.includes('whatsapp') || input.includes('zap') || input.includes('2')) {
      selectedCTA = 'whatsapp'
    } else if (input.includes('agendamento') || input.includes('agenda') || input.includes('3')) {
      selectedCTA = 'agendamento'
    } else if (input.includes('site') || input.includes('página') || input.includes('pagina') || input.includes('4')) {
      selectedCTA = 'site'
    } else if (input.includes('email') || input.includes('5')) {
      selectedCTA = 'email'
    }
    
    // Atualizar perfil com novas informações detectadas
    if (detectedProfession || detectedObjective || detectedSpecialization || detectedAudience) {
      setUserProfile(prev => ({
        ...prev,
        ...(detectedProfession && { profissao: detectedProfession }),
        ...(detectedObjective && { objetivo_principal: detectedObjective }),
        ...(detectedSpecialization && { especializacao: detectedSpecialization }),
        ...(detectedAudience && { publico_alvo: detectedAudience })
      }))
    }
    
    let fallbackContent = ''
    
    // Gerar resposta baseada no que foi detectado
    if (detectedProfession && detectedObjective && selectedTool && userConfirmation === 'sim' && selectedCTA) {
      // Usuário confirmou e escolheu CTA - criar ferramenta agora!
      fallbackContent = `Perfeito! Vou criar sua **${selectedTool}** personalizada para ${detectedProfession}!

🚀 **Gerando sua ferramenta...**

${selectedTool === 'quiz' ? '🧩 Criando Quiz personalizado com perguntas inteligentes...' :
  selectedTool === 'calculadora' ? '🧮 Criando Calculadora com fórmulas especializadas...' :
  selectedTool === 'diagnostico' ? '📊 Criando Diagnóstico com análise completa...' :
  selectedTool === 'desafio' ? '🏋️ Criando Desafio com cronograma personalizado...' :
  selectedTool === 'checklist' ? '📋 Criando Checklist com tarefas específicas...' :
  '📈 Criando Ranking com métricas personalizadas...'}

${selectedCTA === 'formulario' ? '📝 Adicionando formulário de contato...' :
  selectedCTA === 'whatsapp' ? '💬 Configurando botão do WhatsApp...' :
  selectedCTA === 'agendamento' ? '📅 Integrando sistema de agendamento...' :
  selectedCTA === 'site' ? '🌐 Configurando redirecionamento para site...' :
  '📧 Configurando captura de email...'}

Aguarde alguns segundos... ⏳`

      // Criar ferramenta com a escolha específica
      const newProfile = {
        profissao: detectedProfession,
        objetivo_principal: detectedObjective,
        especializacao: detectedSpecialization || 'geral',
        publico_alvo: detectedAudience || 'novos clientes',
        tipo_ferramenta: selectedTool,
        cta_tipo: selectedCTA
      }
      
      setUserProfile(newProfile)
      
      // Criar após delay apenas quando usuário confirma e escolhe CTA
      setTimeout(() => {
        onComplete(newProfile)
      }, 3000)
      
    } else if (detectedProfession && detectedObjective && selectedTool && userConfirmation === 'sim') {
      // Usuário confirmou - agora escolher CTA
      fallbackContent = `Ótimo! Agora preciso saber: **o que você quer que aconteça quando alguém completar sua ferramenta?**

🎯 **Escolha seu Call-to-Action (CTA):**

1️⃣ **📝 Formulário de Contato** - coleta dados e permite contato direto
2️⃣ **💬 WhatsApp** - redireciona para conversa no WhatsApp
3️⃣ **📅 Agendamento** - permite agendar consulta/sessão
4️⃣ **🌐 Site/Página** - redireciona para seu site ou landing page
5️⃣ **📧 Captura de Email** - coleta email para newsletter/lista

**Qual dessas opções você prefere?**

Digite o **número** (1, 2, 3, 4, 5) ou o **nome** da opção.

💡 **Dica:** Formulário e WhatsApp são os mais eficazes para conversão!`
      
    } else if (detectedProfession && detectedObjective && selectedTool) {
      // Usuário escolheu uma ferramenta específica - confirmar antes de criar
      fallbackContent = `Perfeito! Você escolheu criar um **${selectedTool}** para ${detectedProfession}!

🎯 **Confirmação Final:**

**Ferramenta:** ${selectedTool}
**Profissão:** ${detectedProfession}
**Objetivo:** ${detectedObjective}
${detectedSpecialization ? `**Especialização:** ${detectedSpecialization}` : ''}
${detectedAudience ? `**Público:** ${detectedAudience}` : ''}

**Você confirma que quer criar esta ferramenta?**

Digite **"sim"** para criar ou **"não"** para escolher outra opção.

🚀 **Em 60 segundos você terá sua ferramenta pronta!**`

      // NÃO criar automaticamente - aguardar confirmação
      const newProfile = {
        profissao: detectedProfession,
        objetivo_principal: detectedObjective,
        especializacao: detectedSpecialization || 'geral',
        publico_alvo: detectedAudience || 'novos clientes',
        tipo_ferramenta: selectedTool
      }
      
      setUserProfile(newProfile)
      
    } else if (detectedProfession && detectedObjective && detectedSpecialization) {
      // Temos informações completas - gerar sugestões específicas
      fallbackContent = `Excelente! Agora tenho o perfil completo:

👩‍⚕️ **Profissão:** ${detectedProfession}
🎯 **Objetivo:** ${detectedObjective}
🔬 **Especialização:** ${detectedSpecialization}
${detectedAudience ? `👥 **Público:** ${detectedAudience}` : ''}

🎯 **Aqui estão as ferramentas PERFEITAS para você:**

${this.generateSpecificSuggestions(detectedProfession, detectedSpecialization, detectedObjective)}

**Qual dessas ferramentas você gostaria de criar primeiro?**

Você pode:
• Digitar o **nome** da ferramenta
• Digitar o **número** da opção (1, 2, 3, 4, 5)
• Digitar **"primeira"**, **"segunda"**, etc.
• Ou me conte **sua própria ideia**! 💡

Escolha uma e eu criarei para você! 🚀`
      
    } else if (detectedProfession && detectedObjective) {
      // Usuário forneceu profissão e objetivo - fazer perguntas consultivas
      fallbackContent = `Perfeito! Entendi que você é **${detectedProfession}** e quer **${detectedObjective}**.

🎯 **Para criar a ferramenta PERFEITA para você, preciso entender melhor:**

**1. Qual é sua especialização?**
${detectedProfession === 'nutricionista' ? `
• 🥗 **Emagrecimento** - perda de peso e composição corporal
• 🏃 **Nutrição Esportiva** - performance e recuperação
• 👶 **Nutrição Materno-Infantil** - gestação e primeira infância
• 🧠 **Comportamento Alimentar** - relação com a comida
• 🏥 **Nutrição Clínica** - doenças e condições específicas
` : detectedProfession === 'personal trainer' ? `
• 💪 **Musculação** - hipertrofia e força
• 🏃 **Cardio e Condicionamento** - resistência e saúde
• 👩‍🦽 **Reabilitação** - recuperação de lesões
• 🧘 **Funcional e Mobilidade** - movimento e equilíbrio
• 🏆 **Performance Esportiva** - atletas e competições
` : detectedProfession === 'coach' ? `
• 🧠 **Life Coaching** - desenvolvimento pessoal
• 💼 **Executive Coaching** - liderança e carreira
• 💰 **Financeiro** - educação financeira
• 🏃 **Performance** - metas e produtividade
• 🧘 **Mindfulness** - bem-estar mental
` : `
• 🎯 **Especialização específica** - me conte sua área
• 💡 **Sua ideia** - o que você tem em mente?
`}

**2. Qual seu público principal?**
• 👥 **Iniciantes** - pessoas começando na área
• 🎯 **Intermediários** - já têm alguma experiência
• 🏆 **Avançados** - buscam otimização
• 🌟 **Todos os níveis** - público misto

**3. Como você prefere se comunicar?**
• 📱 **Digital** - redes sociais, WhatsApp
• 🏢 **Presencial** - consultório, clínica
• 📚 **Educativo** - workshops, cursos
• 🛒 **Vendas** - produtos, serviços

**Me conte sobre sua especialização e público para eu sugerir as melhores ferramentas!** 🚀`

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
      // Só detectou objetivo - mas pode já ter profissão no perfil
      if (userProfile.profissao) {
        // Já tem profissão no perfil - ir direto para perguntas consultivas
        fallbackContent = `Perfeito! Entendi que você é **${userProfile.profissao}** e quer **${detectedObjective}**.

🎯 **Para criar a ferramenta PERFEITA para você, preciso entender melhor:**

**1. Qual é sua especialização?**
${userProfile.profissao === 'nutricionista' ? `
• 🥗 **Emagrecimento** - perda de peso e composição corporal
• 🏃 **Nutrição Esportiva** - performance e recuperação
• 👶 **Nutrição Materno-Infantil** - gestação e primeira infância
• 🧠 **Comportamento Alimentar** - relação com a comida
• 🏥 **Nutrição Clínica** - doenças e condições específicas
` : userProfile.profissao === 'personal trainer' ? `
• 💪 **Musculação** - hipertrofia e força
• 🏃 **Cardio e Condicionamento** - resistência e saúde
• 👩‍🦽 **Reabilitação** - recuperação de lesões
• 🧘 **Funcional e Mobilidade** - movimento e equilíbrio
• 🏆 **Performance Esportiva** - atletas e competições
` : `
• 🎯 **Especialização específica** - me conte sua área
• 💡 **Sua ideia** - o que você tem em mente?
`}

**2. Qual seu público principal?**
• 👥 **Iniciantes** - pessoas começando na área
• 🎯 **Intermediários** - já têm alguma experiência
• 🏆 **Avançados** - buscam otimização
• 🌟 **Todos os níveis** - público misto

**Me conte sobre sua especialização e público para eu sugerir as melhores ferramentas!** 🚀`
      } else {
        // Não tem profissão - perguntar profissão
        fallbackContent = `Perfeito! Entendi que você quer **${detectedObjective}**.

Agora me conte: **qual é sua profissão ou área de atuação?**

• 🥗 **Nutricionista** - especialista em alimentação e saúde
• 🏋️ **Personal Trainer** - especialista em exercícios e fitness
• 🩺 **Fisioterapeuta** - especialista em reabilitação e movimento
• 🧠 **Coach** - especialista em desenvolvimento pessoal
• 💆 **Esteticista** - especialista em beleza e bem-estar
• ✨ **Outro** - me conte sua profissão específica

**Qual é sua área de atuação?**`
      }
      
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