'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

interface Mensagem {
  id: number
  tipo: 'usuario' | 'assistente'
  texto: string
  timestamp: string
}

interface ChatIAProps {
  isOpen: boolean
  onClose: () => void
  area?: 'coach' | 'nutri' | 'wellness'
}

export default function ChatIA({ isOpen, onClose, area = 'nutri' }: ChatIAProps) {
  // 🚀 OTIMIZAÇÃO: useMemo para config (não muda entre renders)
  const configArea = useMemo(() => ({
    coach: {
      nome: 'Coach de Bem-Estar',
      nomeCurto: 'Coach',
      cor: 'purple',
      corHex: '#9333EA',
      corHexHover: '#7E22CE',
      mensagemInicial: 'Olá! Sou a assistente IA da YLADA Coach. Posso te ajudar com dúvidas sobre:\n\n📋 Gestão de Clientes (cadastro, Kanban, status)\n📊 Evolução Física e Avaliações\n📅 Agenda e Consultas\n📝 Formulários Personalizados\n🔄 Conversão de Leads\n📈 Relatórios de Gestão\n🎯 Ferramentas de Captação\n📧 Autorizações por Email\n\nComo posso te ajudar hoje?'
    },
    nutri: {
      nome: 'Nutricionista',
      nomeCurto: 'Nutri',
      cor: 'blue',
      corHex: '#2563EB',
      corHexHover: '#1D4ED8',
      mensagemInicial: 'Olá! Sou a assistente IA da YLADA Nutri. Posso te ajudar com dúvidas sobre:\n\n📋 Gestão de Clientes (cadastro, Kanban, status)\n📊 Evolução Física e Avaliações\n📅 Agenda e Consultas\n📝 Formulários Personalizados\n🔄 Conversão de Leads\n📈 Relatórios de Gestão\n🎯 Ferramentas de Captação\n\nComo posso te ajudar hoje?'
    },
    wellness: {
      nome: 'Especialista Wellness',
      nomeCurto: 'Wellness',
      cor: 'green',
      corHex: '#16A34A',
      corHexHover: '#15803D',
      mensagemInicial: 'Olá! Sou a assistente IA da YLADA Wellness. Posso te ajudar com dúvidas sobre:\n\n📋 Gestão de Clientes (cadastro, Kanban, status)\n📊 Evolução Física e Avaliações\n📅 Agenda e Consultas\n📝 Formulários Personalizados\n🔄 Conversão de Leads\n📈 Relatórios de Gestão\n🎯 Ferramentas de Captação\n\nComo posso te ajudar hoje?'
    }
  }), [])

  const config = configArea[area]

  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      tipo: 'assistente',
      texto: config.mensagemInicial,
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

    try {
      // 1. Primeiro, buscar resposta no banco de dados
      const response = await fetch(
        `/api/chat/qa?pergunta=${encodeURIComponent(novaMensagem)}&area=${area}`,
        {
          credentials: 'include'
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.encontrada && data.resposta) {
          // Resposta encontrada no banco!
          const respostaIA: Mensagem = {
            id: Date.now() + 1,
            tipo: 'assistente',
            texto: data.resposta,
            timestamp: new Date().toLocaleTimeString()
          }

          setMensagens(prev => [...prev, respostaIA])
          setDigitando(false)

          // Incrementar estatísticas de uso (em background, não esperar)
          if (data.id) {
            fetch(`/api/chat/qa/${data.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ajudou: true }),
              credentials: 'include'
            }).catch(() => {}) // Ignorar erros
          }

          return
        }
      }

      // 2. Se não encontrou no banco, usar respostas pré-definidas (fallback)
      const resposta = gerarRespostaIA(novaMensagem, area)
      const respostaIA: Mensagem = {
        id: Date.now() + 1,
        tipo: 'assistente',
        texto: resposta,
        timestamp: new Date().toLocaleTimeString()
      }

      setMensagens(prev => [...prev, respostaIA])
      setDigitando(false)
    } catch (error) {
      console.error('Erro ao buscar resposta:', error)
      // Em caso de erro, usar fallback
      const resposta = gerarRespostaIA(novaMensagem, area)
      const respostaIA: Mensagem = {
        id: Date.now() + 1,
        tipo: 'assistente',
        texto: resposta,
        timestamp: new Date().toLocaleTimeString()
      }

      setMensagens(prev => [...prev, respostaIA])
      setDigitando(false)
    }
  }

  const gerarRespostaIA = (pergunta: string, areaAtual: 'coach' | 'nutri' | 'wellness' = 'nutri'): string => {
    const configAtual = configArea[areaAtual]
    const perguntaLower = pergunta.toLowerCase()

    // ============================================
    // GESTÃO DE CLIENTES
    // ============================================
    if (perguntaLower.includes('cadastrar') && perguntaLower.includes('cliente') || 
        perguntaLower.includes('novo cliente') || perguntaLower.includes('criar cliente')) {
      return 'Para cadastrar um novo cliente, você tem duas opções:\n\n1️⃣ **Pelo menu:** Vá em "Gestão" → "Meus Clientes" → Botão "Novo Cliente"\n2️⃣ **Pela agenda:** Ao agendar uma consulta, clique em "Novo Cliente" no modal\n\nNo cadastro, preencha nome, email, telefone (com bandeira do país), data de nascimento, objetivo e status inicial. Você pode cadastrar rapidamente pela agenda e completar depois!'
    }

    if (perguntaLower.includes('kanban') || perguntaLower.includes('status') && perguntaLower.includes('cliente')) {
      return 'O Kanban mostra seus clientes organizados por status em colunas:\n\n• **Contato** - Entrou agora, precisa de acolhimento\n• **Pré-Consulta** - Já falou, falta agendar\n• **Ativa** - Em atendimento\n• **Pausa** - Deu um tempo\n• **Finalizada** - Concluiu o ciclo\n\n**Como mudar:** Arraste o card do cliente para a coluna desejada. O sistema salva automaticamente!\n\nAcesse: Menu "Gestão" → "Kanban de Clientes"'
    }

    if (perguntaLower.includes('evolução física') || perguntaLower.includes('peso') && perguntaLower.includes('medida')) {
      return 'Para registrar evolução física:\n\n1. Abra o perfil da cliente\n2. Vá na aba "Evolução Física"\n3. Clique em "Nova Medição"\n4. Preencha peso, altura (IMC calcula automaticamente), circunferências, dobras cutâneas e composição corporal\n5. Salve\n\n**Dica:** O sistema gera gráficos automáticos mostrando a evolução ao longo do tempo!'
    }

    if (perguntaLower.includes('agendar') || perguntaLower.includes('consulta') || perguntaLower.includes('agenda')) {
      return 'Para agendar uma consulta:\n\n**Opção 1:** Botão "Nova Consulta" no topo da agenda\n**Opção 2:** Clique diretamente na data/horário desejado no calendário (mais rápido!)\n\nNo modal, selecione o cliente (ou crie um novo), defina título, data, horário, tipo e descrição.\n\n**Dica:** Se clicar no calendário, a data e horário já vêm preenchidos!'
    }

    if (perguntaLower.includes('avaliação') && (perguntaLower.includes('criar') || perguntaLower.includes('fazer'))) {
      return 'Para criar uma avaliação:\n\n1. Abra o perfil da cliente\n2. Vá na aba "Avaliação Física"\n3. Clique em "Nova Avaliação"\n4. Escolha o tipo (antropométrica, bioimpedância, anamnese, etc.)\n5. Preencha os dados\n6. Você pode salvar como rascunho e completar depois\n\n**Reavaliações:** Use "Nova Reavaliação" para comparar com avaliação anterior automaticamente!'
    }

    if (perguntaLower.includes('formulário') && (perguntaLower.includes('criar') || perguntaLower.includes('fazer'))) {
      return 'Para criar um formulário personalizado:\n\n1. Vá em "Formulários" no menu\n2. Clique em "Criar Formulário"\n3. Adicione campos (Texto, Seleção, Número, Data, etc.)\n4. Configure cada campo\n5. Veja o preview em tempo real\n6. Salve\n\n**Tipos disponíveis:** Texto, Seleção, Múltipla escolha, Caixas, Número, Data, Hora, Email, Telefone, Sim/Não, Escala, Upload de arquivo.'
    }

    if (perguntaLower.includes('formulário') && (perguntaLower.includes('enviar') || perguntaLower.includes('compartilhar'))) {
      return 'Para enviar um formulário:\n\n1. Vá em "Formulários"\n2. Clique no botão "Enviar" no formulário desejado\n3. Escolha o cliente (opcional)\n4. Escolha o método:\n   • **Link público** - Copiar e compartilhar\n   • **Email** - Enviar diretamente\n   • **WhatsApp** - Gerar link do WhatsApp\n   • **QR Code** - Para impressão\n\n**Dica:** Você pode enviar o mesmo formulário para vários clientes!'
    }

    if (perguntaLower.includes('resposta') && perguntaLower.includes('formulário') || 
        perguntaLower.includes('ver') && perguntaLower.includes('formulário')) {
      return 'Para ver respostas de um formulário:\n\n1. Vá em "Formulários"\n2. Clique no botão "Respostas" no formulário desejado\n3. Você verá:\n   • Lista de todas as respostas\n   • Filtros por cliente e período\n   • Estatísticas (total, com cliente, sem cliente)\n   • Botão para exportar em CSV\n\n**Visualizar individual:** Clique em "Ver Detalhes" em qualquer resposta para ver completa.'
    }

    if (perguntaLower.includes('converter') && perguntaLower.includes('lead') || 
        perguntaLower.includes('lead') && perguntaLower.includes('cliente')) {
      return 'Para converter um lead em cliente:\n\n1. Vá em "Captação" → "Leads"\n2. Clique no botão "Converter em Cliente"\n3. No modal:\n   • Escolha status inicial (ou deixe automático)\n   • Opção de criar avaliação inicial\n   • Clique em "Converter"\n\n**O que acontece:**\n• Dados do lead são preenchidos automaticamente\n• Status é determinado pela origem (quiz → Contato, checklist → Pré-Consulta)\n• Cliente aparece no Kanban na coluna correta\n\n**Dica:** O sistema detecta automaticamente a origem e coloca na coluna certa!'
    }

    if (perguntaLower.includes('alerta') || perguntaLower.includes('lead') && perguntaLower.includes('parado')) {
      return 'O sistema alerta automaticamente quando um lead não foi convertido há 3+ dias (configurável).\n\n**Onde ver:**\n• Banner laranja no topo da página de Leads\n• Badge laranja na tabela mostrando quantos dias parado\n\n**O que fazer:**\n• Clique no botão "Converter" no alerta\n• Ou converta manualmente na página de Leads\n\n**Configurar:** No banner, use o seletor "Alertar após" para escolher quantos dias (1, 2, 3, 5, 7).'
    }

    if (perguntaLower.includes('relatório') || perguntaLower.includes('relatórios')) {
      return 'Para ver relatórios de gestão:\n\n1. Vá em "Gestão" → "Relatórios de Gestão"\n2. Escolha o tipo:\n   • **Evolução Física** - Resumo de medições\n   • **Adesão ao Programa** - Taxa de adesão\n   • **Consultas** - Total, por status e tipo\n   • **Avaliações** - Total e comparações\n3. Filtre por período (data início e fim)\n\n**Dica:** Todos os relatórios podem ser filtrados por período para análises específicas!'
    }

    // ============================================
    // CAPTAÇÃO E FERRAMENTAS
    // ============================================
    if (perguntaLower.includes('ferramenta') || perguntaLower.includes('quiz') || perguntaLower.includes('calculadora')) {
      return 'As ferramentas YLADA são criadas para capturar leads qualificados automaticamente. Você pode criar quizzes, calculadoras e conteúdo interativo. Cada ferramenta funciona 24/7 e gera leads com informações específicas sobre os interesses dos usuários. Quer que eu te ajude a criar uma nova ferramenta?'
    }

    if (perguntaLower.includes('lead') && !perguntaLower.includes('converter')) {
      return 'Os leads são capturados automaticamente quando usuários interagem com suas ferramentas. Cada lead vem com informações detalhadas: nome, email, telefone, idade, cidade, interesse específico e score de qualificação. Você pode filtrar, segmentar e acompanhar todos os leads no seu dashboard. Para converter em cliente, use o botão "Converter em Cliente" na página de Leads.'
    }

    if (perguntaLower.includes('como') && perguntaLower.includes('funciona')) {
      return 'A YLADA funciona assim:\n\n1️⃣ **Captação:** Você cria ferramentas (quiz, calculadora, conteúdo) e compartilha links\n2️⃣ **Leads:** Usuários interagem e deixam contato automaticamente\n3️⃣ **Conversão:** Converta leads em clientes com um clique\n4️⃣ **Gestão:** Gerencie todo o ciclo (agenda, evolução, avaliações, programas)\n5️⃣ **Acompanhamento:** Use relatórios e métricas para otimizar\n\nÉ um sistema completo de captação e gestão!'
    }

    if (perguntaLower.includes('ajuda') || perguntaLower.includes('problema') || perguntaLower.includes('erro')) {
      return 'Posso te ajudar com qualquer dúvida sobre o sistema! Para problemas técnicos, você pode:\n\n• Usar este chat para dúvidas sobre funcionalidades\n• Recarregar a página se algo não estiver funcionando\n• Limpar o cache do navegador\n• Tentar em outro navegador\n\nSe o problema persistir, entre em contato com suporte técnico informando o que você estava fazendo e o erro que apareceu.'
    }

    if (perguntaLower.includes('preço') || perguntaLower.includes('valor') || perguntaLower.includes('custo')) {
      return `Os preços variam conforme o plano escolhido. Temos planos específicos para ${configAtual.nome.toLowerCase()}s com diferentes níveis de ferramentas e funcionalidades. Para informações detalhadas sobre preços, recomendo entrar em contato com nossa equipe comercial.`
    }

    // ============================================
    // AUTORIZAÇÕES POR EMAIL (apenas Coach)
    // ============================================
    if (areaAtual === 'coach') {
      if (perguntaLower.includes('autorizar') && perguntaLower.includes('email') ||
          perguntaLower.includes('autorização') && perguntaLower.includes('email')) {
        return 'Para autorizar um email para acesso gratuito:\n\n1. Acesse o painel administrativo: `/admin/email-authorizations`\n2. Preencha o email, selecione a área (Coach) e a validade em dias (ex: 365 para 1 ano).\n3. Clique em "Criar Autorização".\n\nQuando a pessoa se cadastrar com esse email, a assinatura será ativada automaticamente!'
      }

      if (perguntaLower.includes('como funciona') && perguntaLower.includes('autorização')) {
        return 'O sistema de autorizações funciona assim:\n\n1. Você (admin) autoriza um email no painel `/admin/email-authorizations`.\n2. A pessoa recebe um link para se cadastrar (ela escolhe a senha).\n3. Ao se cadastrar com o email autorizado, a assinatura é ativada automaticamente por 1 ano.\n\nÉ simples, seguro e não exige que a pessoa já tenha conta!'
      }

      if (perguntaLower.includes('link para cadastro') || perguntaLower.includes('acesso autorizado')) {
        return 'O link para a pessoa autorizada se cadastrar é: `https://www.ylada.com/pt/c/login`\n\nEla deve clicar em "Cadastrar", usar o email autorizado e escolher a própria senha. A assinatura será ativada automaticamente após a confirmação do email.'
      }

      if (perguntaLower.includes('ver autorizações') || perguntaLower.includes('lista autorizações')) {
        return 'Você pode ver e gerenciar todas as autorizações de email no painel administrativo: `/admin/email-authorizations`\n\nLá você pode filtrar por área e status (pendente, ativada, cancelada) e cancelar autorizações pendentes.'
      }
    }

    // Resposta padrão adaptada por área
    const respostaPadrao = areaAtual === 'coach' 
      ? 'Olá! Posso te ajudar com dúvidas sobre:\n\n📋 **Gestão de Clientes** - Cadastro, Kanban, status\n📊 **Evolução Física** - Registro de medidas e gráficos\n📅 **Agenda** - Agendamento e visualizações\n🏥 **Avaliações** - Criação e reavaliações\n📝 **Formulários** - Criação, envio e respostas\n🔄 **Conversão de Leads** - Transformar leads em clientes\n📈 **Relatórios** - Análises e métricas\n📧 **Autorizações por Email** - Autorizar emails antes do cadastro\n\n**O que você gostaria de saber?** 😊'
      : 'Olá! Posso te ajudar com dúvidas sobre:\n\n📋 **Gestão de Clientes** - Cadastro, Kanban, status\n📊 **Evolução Física** - Registro de medidas e gráficos\n📅 **Agenda** - Agendamento e visualizações\n🏥 **Avaliações** - Criação e reavaliações\n📝 **Formulários** - Criação, envio e respostas\n🔄 **Conversão de Leads** - Transformar leads em clientes\n📈 **Relatórios** - Análises e métricas\n\n**O que você gostaria de saber?** 😊'
    
    return respostaPadrao
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
        <div 
          className={`text-white p-4 rounded-t-xl flex items-center justify-between`}
          style={{ backgroundColor: config.corHex }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🤖</span>
            <div>
              <h3 className="font-semibold">Assistente IA {config.nomeCurto}</h3>
              <p className="text-xs opacity-90">Online agora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity"
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
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                style={mensagem.tipo === 'usuario' ? { backgroundColor: config.corHex } : {}}
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
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                '--tw-ring-color': config.corHex
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = config.corHex
                e.currentTarget.style.boxShadow = `0 0 0 2px ${config.corHex}40`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB'
                e.currentTarget.style.boxShadow = 'none'
              }}
              disabled={digitando}
            />
            <button
              onClick={enviarMensagem}
              disabled={digitando || !novaMensagem.trim()}
              className="text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: config.corHex,
                ...(digitando || !novaMensagem.trim() ? {} : { ':hover': { backgroundColor: config.corHexHover } })
              }}
              onMouseEnter={(e) => {
                if (!digitando && novaMensagem.trim()) {
                  e.currentTarget.style.backgroundColor = config.corHexHover
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = config.corHex
              }}
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
