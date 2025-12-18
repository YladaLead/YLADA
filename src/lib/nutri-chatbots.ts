/**
 * Configuração dos Chatbots Nutri
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

export const NUTRI_CHATBOTS: Record<string, ChatbotConfig> = {
  'formacao': {
    id: 'formacao',
    nome: 'Assistente de Formação',
    emoji: '🎓',
    cor: 'blue',
    corHex: '#2563EB',
    descricao: 'Especialista em Formação Empresarial Nutri',
    foco: ['jornada', 'pilares', 'biblioteca', 'formação', 'anotações', 'certificados'],
    mensagemInicial: `Olá! Eu sou a **LYA** 🎓\n\nQue bom ter você aqui! Estou aqui para te ajudar na sua jornada como Nutri-Empresária. 💪\n\nMe pergunte qualquer coisa sobre sua formação ou gestão, e eu te guio passo a passo! 😊`
  },
  'gsal': {
    id: 'gsal',
    nome: 'Suporte GSAL',
    emoji: '📊',
    cor: 'green',
    corHex: '#16A34A',
    descricao: 'Especialista em Gestão GSAL e Ferramentas',
    foco: ['gsal', 'leads', 'clientes', 'kanban', 'ferramentas', 'relatórios'],
    mensagemInicial: `Olá! Eu sou o **Suporte GSAL** 📊\n\n**O que é GSAL?**\nGSAL é o jeito YLADA de organizar sua gestão de clientes:\n• **G**erar oportunidades\n• **S**ervir com valor\n• **A**companhar a evolução\n• **L**ucrar de forma organizada\n\nFico feliz em te ajudar! Vamos juntos organizar sua gestão e fazer suas ferramentas trabalharem por você! 🚀\n\n**Posso te ajudar com:**\n\n🎯 **Leads** — Transformar leads em clientes de forma organizada\n👤 **Clientes** — Gerenciar sua base completa de clientes\n🗂️ **Kanban** — Organizar visualmente o status de cada cliente\n📊 **Acompanhamento** — Acompanhar a evolução de cada cliente\n🔗 **Ferramentas** — Criar e gerenciar suas ferramentas de captação\n📈 **Relatórios** — Analisar métricas e performance\n⚡ **Rotina Mínima** — Acompanhar suas tarefas diárias\n\n**Como funciona?**\nMe pergunte qualquer coisa sobre gestão ou ferramentas e eu te mostro um passo a passo bem detalhado! Por exemplo:\n• "O que é GSAL?"\n• "Como cadastrar um novo cliente?"\n• "Onde está o Kanban?"\n• "Como criar uma ferramenta?"\n• "Como usar a gestão de clientes?"\n\nEstou aqui para facilitar seu dia a dia! O que você precisa? 😊`
  }
}

/**
 * Retorna o chatbot padrão ou um específico
 */
export function getChatbotConfig(chatbotId?: string): ChatbotConfig {
  const id = chatbotId || 'formacao'
  return NUTRI_CHATBOTS[id] || NUTRI_CHATBOTS['formacao']
}

/**
 * Retorna todos os chatbots disponíveis
 */
export function getAllChatbots(): ChatbotConfig[] {
  return Object.values(NUTRI_CHATBOTS)
}

