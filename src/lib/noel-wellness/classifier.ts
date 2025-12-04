/**
 * NOEL WELLNESS - Classificador de Intenção
 * 
 * Detecta se a pergunta é para:
 * - NOEL MENTOR (estratégico, comportamental, personalizado)
 * - NOEL SUPORTE (técnico do sistema YLADA)
 * - NOEL TÉCNICO (operacional, fluxos, bebidas, campanhas)
 */

export type NoelModule = 'mentor' | 'suporte' | 'tecnico'

export interface ClassificationResult {
  module: NoelModule
  confidence: number
  keywords: string[]
}

// Palavras-chave para cada módulo
const MENTOR_KEYWORDS = [
  // Estratégia e planejamento
  'meta', 'metas', 'objetivo', 'objetivos', 'planejamento', 'plano', 'estratégia',
  'pv', 'volume', 'vendas', 'faturamento', 'receita',
  // Comportamento e motivação
  'motivação', 'motivado', 'desmotivado', 'consistência', 'disciplina',
  'rotina', 'organização', 'foco', 'produtividade',
  // Duplicação e equipe
  'duplicação', 'equipe', 'time', 'recrutar', 'recrutamento', 'liderança',
  'convidar', 'convite', 'patrocinar',
  // Vendas e relacionamento
  'vender', 'vendas', 'cliente', 'clientes', 'prospecção', 'follow-up',
  'atendimento', 'relacionamento',
  // Personalização
  'como começar', 'por onde começar', 'meu perfil', 'minha situação',
  'personalizado', 'para mim',
]

const SUPORTE_KEYWORDS = [
  // Sistema e plataforma
  'sistema', 'plataforma', 'ilada', 'como usar', 'como funciona',
  'ferramenta', 'ferramentas', 'dashboard', 'menu',
  // Ações técnicas
  'criar', 'editar', 'excluir', 'configurar', 'ajustar',
  'cadastrar', 'adicionar', 'remover',
  // Problemas técnicos
  'erro', 'não funciona', 'não consigo', 'problema', 'bug',
  'travou', 'lento', 'não carrega',
  // Navegação
  'onde está', 'onde fica', 'como acesso', 'como encontrar',
  'não encontro', 'não vejo',
]

const TECNICO_KEYWORDS = [
  // Bebidas funcionais
  'shake', 'bebida', 'bebidas', 'herbalife', 'preparo', 'preparar',
  'receita', 'receitas', 'combinação', 'combinações',
  'sabor', 'sabores', 'modo de preparo',
  // Campanhas e produtos
  'campanha', 'campanhas', 'promoção', 'promoções', 'produto', 'produtos',
  'catálogo', 'preço', 'preços',
  // Fluxos operacionais
  'fluxo', 'processo', 'passo a passo', 'como fazer',
  'procedimento', 'operacional',
  // Scripts e comunicação
  'script', 'scripts', 'mensagem', 'mensagens', 'texto', 'o que falar',
  'como falar', 'abordagem',
  // Conteúdo e conhecimento
  'explicação', 'explicar', 'o que é', 'para que serve',
  'benefício', 'benefícios', 'informação',
]

/**
 * Classifica a intenção da pergunta do usuário
 */
export function classifyIntention(query: string): ClassificationResult {
  const lowerQuery = query.toLowerCase().trim()
  
  // Contar ocorrências de palavras-chave
  const mentorScore = countKeywords(lowerQuery, MENTOR_KEYWORDS)
  const suporteScore = countKeywords(lowerQuery, SUPORTE_KEYWORDS)
  const tecnicoScore = countKeywords(lowerQuery, TECNICO_KEYWORDS)
  
  // Detectar palavras específicas que definem o módulo
  const hasMentorIndicators = /(meta|objetivo|planejamento|pv|duplicação|equipe|motivação|rotina)/i.test(query)
  const hasSuporteIndicators = /(sistema|plataforma|ferramenta|erro|não funciona|onde está|como acesso)/i.test(query)
  const hasTecnicoIndicators = /(shake|bebida|herbalife|preparo|campanha|script|fluxo)/i.test(query)
  
  // Ajustar scores com indicadores fortes
  const finalMentorScore = mentorScore + (hasMentorIndicators ? 2 : 0)
  const finalSuporteScore = suporteScore + (hasSuporteIndicators ? 2 : 0)
  const finalTecnicoScore = tecnicoScore + (hasTecnicoIndicators ? 2 : 0)
  
  // Determinar módulo vencedor
  let module: NoelModule = 'tecnico' // padrão
  let maxScore = finalTecnicoScore
  let keywords: string[] = []
  
  if (finalMentorScore > maxScore) {
    module = 'mentor'
    maxScore = finalMentorScore
    keywords = MENTOR_KEYWORDS.filter(kw => lowerQuery.includes(kw.toLowerCase()))
  }
  
  if (finalSuporteScore > maxScore) {
    module = 'suporte'
    maxScore = finalSuporteScore
    keywords = SUPORTE_KEYWORDS.filter(kw => lowerQuery.includes(kw.toLowerCase()))
  }
  
  if (finalTecnicoScore >= maxScore && module !== 'mentor' && module !== 'suporte') {
    module = 'tecnico'
    keywords = TECNICO_KEYWORDS.filter(kw => lowerQuery.includes(kw.toLowerCase()))
  }
  
  // Calcular confiança (0-1)
  const totalScore = finalMentorScore + finalSuporteScore + finalTecnicoScore
  const confidence = totalScore > 0 
    ? Math.min(1, maxScore / Math.max(1, totalScore * 0.5))
    : 0.5 // confiança baixa se não houver palavras-chave
  
  return {
    module,
    confidence: Math.round(confidence * 100) / 100,
    keywords: keywords.slice(0, 5), // máximo 5 keywords
  }
}

/**
 * Conta quantas palavras-chave aparecem na query
 */
function countKeywords(query: string, keywords: string[]): number {
  let count = 0
  for (const keyword of keywords) {
    if (query.includes(keyword.toLowerCase())) {
      count++
    }
  }
  return count
}

/**
 * Detecta se a query é uma pergunta de diagnóstico/planejamento (Mentor)
 */
export function isMentorQuery(query: string): boolean {
  const mentorPatterns = [
    /como (começar|iniciar|planejar|organizar)/i,
    /qual (minha|meu) (meta|objetivo|estratégia)/i,
    /(preciso|quero) (aumentar|melhorar|conseguir)/i,
    /(não|nunca) (consigo|consegui|sei)/i,
    /(me ajuda|me orienta|me guia)/i,
  ]
  
  return mentorPatterns.some(pattern => pattern.test(query))
}

/**
 * Detecta se a query é sobre o sistema (Suporte)
 */
export function isSuporteQuery(query: string): boolean {
  const suportePatterns = [
    /(como|onde) (usar|acessar|encontrar|fazer) (no|na|o|a) (sistema|plataforma|ilada)/i,
    /(não|não consigo) (funciona|carrega|abre|encontro)/i,
    /(erro|bug|problema|travou)/i,
    /(ferramenta|dashboard|menu) (não|como|onde)/i,
  ]
  
  return suportePatterns.some(pattern => pattern.test(query))
}

/**
 * Detecta se a query é sobre conteúdo técnico (Técnico)
 */
export function isTecnicoQuery(query: string): boolean {
  const tecnicoPatterns = [
    /(shake|bebida|herbalife) (como|qual|preparo)/i,
    /(campanha|promoção|produto) (o que|qual|como)/i,
    /(script|mensagem|texto) (para|de|como)/i,
    /(fluxo|processo|passo a passo)/i,
    /(o que é|para que serve|explicação)/i,
  ]
  
  return tecnicoPatterns.some(pattern => pattern.test(query))
}

