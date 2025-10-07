// Configurações por tipo de negócio
export const BUSINESS_TYPES = {
  fitness: {
    name: 'Fitness & Academia',
    emoji: '🏋️',
    color: 'bg-blue-500',
    description: 'Personal trainers, academias, crossfit',
    tools: ['bmi', 'body-composition', 'protein', 'hydration', 'meal-planner']
  },
  nutrition: {
    name: 'Nutrição & Alimentação',
    emoji: '🥗',
    color: 'bg-green-500',
    description: 'Nutricionistas, coaches nutricionais',
    tools: ['nutrition-assessment', 'meal-planner', 'protein', 'hydration', 'bmi']
  },
  wellness: {
    name: 'Bem-estar & Spa',
    emoji: '🧘',
    color: 'bg-purple-500',
    description: 'Spas, terapias, bem-estar',
    tools: ['wellness-checkup', 'lifestyle-evaluation', 'health-goals']
  },
  business: {
    name: 'Negócios & Coaching',
    emoji: '💼',
    color: 'bg-orange-500',
    description: 'Coaches, consultores, MLM',
    tools: ['inspirar-pessoas', 'perfil-empreendedor', 'onboarding-rapido']
  },
  beauty: {
    name: 'Beleza & Estética',
    emoji: '💄',
    color: 'bg-pink-500',
    description: 'Estética, cosmética, beleza',
    tools: ['perfil-bem-estar', 'bem-estar-diario', 'alimentacao-saudavel']
  },
  health: {
    name: 'Saúde & Medicina',
    emoji: '🏥',
    color: 'bg-red-500',
    description: 'Médicos, fisioterapeutas, saúde',
    tools: ['nutrition-assessment', 'health-goals', 'wellness-checkup']
  },
  lifestyle: {
    name: 'Lifestyle & Desenvolvimento',
    emoji: '🌟',
    color: 'bg-yellow-500',
    description: 'Life coaches, desenvolvimento pessoal',
    tools: ['lifestyle-evaluation', 'health-goals', 'perfil-bem-estar']
  }
} as const

export type BusinessType = keyof typeof BUSINESS_TYPES

// Função para obter configuração do tipo de negócio
export function getBusinessConfig(businessType: string) {
  return BUSINESS_TYPES[businessType as BusinessType] || BUSINESS_TYPES.fitness
}

// Função para gerar URL com subdomínio
export function generateSubdomainUrl(toolName: string, secureId: string, businessType: string = 'fitness') {
  const subdomain = businessType.toLowerCase()
  
  // Em desenvolvimento, usar localhost com porta
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `${window.location.protocol}//${window.location.host}/tools/${toolName}?ref=${secureId}&business_type=${subdomain}`
  }
  
  // Em produção, usar subdomínios
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'ylada.com'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  return `${protocol}://${subdomain}.${domain}/tools/${toolName}?ref=${secureId}`
}
