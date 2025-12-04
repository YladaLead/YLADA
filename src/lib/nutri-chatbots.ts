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
    mensagemInicial: `Olá! Eu sou o **Assistente de Formação** 🎓\n\nQue bom ter você aqui! Estou super animado para te ajudar na sua jornada como Nutri-Empresária! 💪\n\n**Posso te ajudar com:**\n\n📘 **Jornada 30 Dias** — Vamos transformar sua rotina passo a passo?\n📚 **Pilares do Método** — Aprenda os fundamentos da Filosofia ILADA\n🎒 **Biblioteca** — Acesse todos os materiais e recursos disponíveis\n📝 **Anotações** — Organize seus aprendizados e insights\n🏆 **Certificados** — Veja suas conquistas e certificações\n\n**Como funciona?**\nÉ simples! Me pergunte qualquer coisa sobre a Formação Empresarial e eu te guio com um passo a passo bem detalhado. Por exemplo:\n• "Como acessar a Jornada 30 Dias?"\n• "Onde estão os Pilares do Método?"\n• "Como criar uma anotação?"\n\nEstou aqui para te ajudar! O que você gostaria de saber? 😊`
  },
  'gsal': {
    id: 'gsal',
    nome: 'Suporte GSAL',
    emoji: '📊',
    cor: 'green',
    corHex: '#16A34A',
    descricao: 'Especialista em Gestão GSAL e Ferramentas',
    foco: ['gsal', 'leads', 'clientes', 'kanban', 'ferramentas', 'relatórios'],
    mensagemInicial: `Olá! Eu sou o **Suporte GSAL** 📊\n\nFico feliz em te ajudar! Vamos juntos organizar sua gestão e fazer suas ferramentas trabalharem por você! 🚀\n\n**Posso te ajudar com:**\n\n🎯 **Leads** — Transformar leads em clientes de forma organizada\n👤 **Clientes** — Gerenciar sua base completa de clientes\n🗂️ **Kanban** — Organizar visualmente o status de cada cliente\n📊 **Acompanhamento** — Acompanhar a evolução de cada cliente\n🔗 **Ferramentas** — Criar e gerenciar suas ferramentas de captação\n📈 **Relatórios** — Analisar métricas e performance\n⚡ **Rotina Mínima** — Acompanhar suas tarefas diárias\n\n**Como funciona?**\nMe pergunte qualquer coisa sobre gestão ou ferramentas e eu te mostro um passo a passo bem detalhado! Por exemplo:\n• "Como cadastrar um novo cliente?"\n• "Onde está o Kanban?"\n• "Como criar uma ferramenta?"\n• "Como ver meus leads?"\n\nEstou aqui para facilitar seu dia a dia! O que você precisa? 😊`
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

