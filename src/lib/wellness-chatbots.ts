/**
 * Configuração dos Chatbots Wellness
 * Cada chatbot tem sua personalidade e foco, mas todos usam o sistema de orientação
 */

export interface ChatbotConfig {
  id: string
  nome: string
  emoji: string
  cor: string
  corHex: string
  mensagemInicial: string
  descricao: string
  foco: string[]
}

export const WELLNESS_CHATBOTS: Record<string, ChatbotConfig> = {
  'noel': {
    id: 'noel',
    nome: 'Noel',
    emoji: '💬',
    cor: 'blue',
    corHex: '#2563EB',
    descricao: 'Suporte geral',
    foco: ['suporte', 'ajuda', 'dúvidas', 'orientações gerais'],
    mensagemInicial: `Olá! Eu sou o **Noel** 💬\n\nEstou aqui para te ajudar com suporte geral e dúvidas sobre a plataforma.\n\n**Posso te ajudar com:**\n\n📋 **Dúvidas Gerais** — Qualquer questão sobre o sistema\n\n🛠️ **Ferramentas** — Como usar as ferramentas disponíveis\n\n🎨 **Templates** — Explorar e usar templates prontos\n\n🌐 **Portals** — Criar portais de captação\n\n❓ **Quizzes** — Criar e gerenciar quizzes\n\n📊 **Dashboard** — Navegar e usar o dashboard\n\n⚙️ **Configuração** — Ajustar perfil e configurações\n\nComo posso te ajudar hoje?`
  },
  'mentor': {
    id: 'mentor',
    nome: 'Mentor',
    emoji: '🎯',
    cor: 'green',
    corHex: '#16A34A',
    descricao: 'Especialista em estratégias de recrutamento e vendas',
    foco: ['recrutamento', 'vendas', 'scripts', 'fluxos', 'treinamento'],
    mensagemInicial: `Olá! Eu sou o **Mentor** 🎯\n\nSou seu especialista em estratégias de recrutamento e vendas no Wellness System.\n\n**Posso te ajudar com:**\n\n📋 **Recrutamento** — Como identificar e recrutar pessoas para o negócio\n\n💚 **Vendas** — Estratégias para vender bebidas funcionais\n\n📚 **Scripts** — Biblioteca completa de scripts de conversão\n\n🔄 **Fluxos** — Como usar os fluxos de cliente e recrutamento\n\n🎓 **Treinamento** — Guias passo a passo do sistema\n\nVou te guiar passo a passo seguindo o Wellness System. Como posso te ajudar hoje?`
  }
}

/**
 * Retorna o chatbot padrão ou um específico
 */
export function getChatbotConfig(chatbotId?: string): ChatbotConfig {
  const id = chatbotId || 'noel'
  return WELLNESS_CHATBOTS[id] || WELLNESS_CHATBOTS['noel']
}

/**
 * Retorna todos os chatbots disponíveis
 */
export function getAllChatbots(): ChatbotConfig[] {
  return Object.values(WELLNESS_CHATBOTS)
}

