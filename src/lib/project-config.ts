// Configuração de projetos multi-tenancy
export interface Project {
  id: string
  name: string
  domain: string
  full_domain: string
  description?: string
  business_type: string
  is_active: boolean
  settings: Record<string, unknown>
}

// Configurações por tipo de projeto
export const PROJECT_TYPES = {
  fitness: {
    name: 'Fitness & Academia',
    emoji: '🏋️',
    color: 'bg-blue-500',
    description: 'Academias, personal trainers, crossfit',
    defaultTools: ['bmi', 'body-composition', 'protein', 'hydration']
  },
  nutrition: {
    name: 'Nutrição & Alimentação',
    emoji: '🥗',
    color: 'bg-green-500',
    description: 'Nutricionistas, coaches nutricionais',
    defaultTools: ['nutrition-assessment', 'meal-planner', 'protein', 'hydration']
  },
  wellness: {
    name: 'Bem-estar & Spa',
    emoji: '🧘',
    color: 'bg-purple-500',
    description: 'Spas, terapias, bem-estar',
    defaultTools: ['wellness-checkup', 'lifestyle-evaluation', 'health-goals']
  },
  business: {
    name: 'Negócios & Coaching',
    emoji: '💼',
    color: 'bg-orange-500',
    description: 'Coaches, consultores, MLM',
    defaultTools: ['inspirar-pessoas', 'perfil-empreendedor', 'onboarding-rapido']
  },
  beauty: {
    name: 'Beleza & Estética',
    emoji: '💄',
    color: 'bg-pink-500',
    description: 'Estética, cosmética, beleza',
    defaultTools: ['perfil-bem-estar', 'bem-estar-diario', 'alimentacao-saudavel']
  },
  health: {
    name: 'Saúde & Medicina',
    emoji: '🏥',
    color: 'bg-red-500',
    description: 'Médicos, fisioterapeutas, saúde',
    defaultTools: ['nutrition-assessment', 'health-goals', 'wellness-checkup']
  },
  lifestyle: {
    name: 'Lifestyle & Desenvolvimento',
    emoji: '🌟',
    color: 'bg-yellow-500',
    description: 'Life coaches, desenvolvimento pessoal',
    defaultTools: ['lifestyle-evaluation', 'health-goals', 'perfil-bem-estar']
  }
} as const

export type ProjectType = keyof typeof PROJECT_TYPES

// Função para obter configuração do tipo de projeto
export function getProjectConfig(projectType: string) {
  return PROJECT_TYPES[projectType as ProjectType] || PROJECT_TYPES.fitness
}

// Função para gerar URL com domínio do projeto
export function generateProjectUrl(toolName: string, secureId: string, projectDomain: string) {
  // Em desenvolvimento, usar localhost com parâmetro de projeto
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `${window.location.protocol}//${window.location.host}/tools/${toolName}?ref=${secureId}&project=${projectDomain}`
  }
  
  // Em produção, usar domínio do projeto
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'ylada.com'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  return `${protocol}://${projectDomain}.${baseDomain}/tools/${toolName}?ref=${secureId}`
}

// Função para validar domínio do projeto
export function validateProjectDomain(domain: string): boolean {
  // Apenas letras, números e hífens
  const regex = /^[a-z0-9-]+$/
  return regex.test(domain) && domain.length >= 3 && domain.length <= 30
}

// Função para gerar sugestão de domínio baseado no nome
export function generateDomainSuggestion(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàâãä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 30)
}
