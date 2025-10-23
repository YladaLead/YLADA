// Estrutura de dados para os templates YLADA
export interface Template {
  id: string
  name: string
  description: string
  objective: 'attract-contacts' | 'convert-sales' | 'engage-clients' | 'generate-authority'
  category: 'quiz' | 'calculator' | 'checklist' | 'ebook' | 'table' | 'planner' | 'challenge' | 'guide' | 'infographic' | 'recipe' | 'simulator' | 'form' | 'template' | 'post' | 'reel' | 'article' | 'catalog' | 'script' | 'email' | 'calendar'
  profession: 'universal' | 'nutri' | 'sales' | 'coach'
  disclaimer: 'required' | 'recommended' | 'none'
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'advanced'
  scientificBasis: string[]
  ctaText: string
  redirectUrl?: string
  captureData: boolean
  icon: string
  color: string
  status: 'draft' | 'ready' | 'published'
  createdAt: Date
  updatedAt: Date
}

// Lista completa dos 60 templates
export const TEMPLATES_CATALOG: Template[] = [
  // CALCULADORA DE IMC (PRIMEIRA OPÇÃO)
  {
    id: 'calculadora-imc',
    name: 'Calculadora de IMC Inteligente',
    description: 'Calcule seu IMC com interpretação personalizada por sexo e nível de atividade física',
    objective: 'attract-contacts',
    category: 'calculator',
    profession: 'universal',
    disclaimer: 'required',
    estimatedTime: '2-3 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Classificação IMC', 'FDA - Avaliação corporal', 'ANVISA - Padrões brasileiros'],
    ctaText: 'Ver resultado completo',
    captureData: true,
    icon: '📊',
    color: 'blue',
    status: 'ready',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // QUIZES INTERATIVOS (2-6)
  {
    id: 'quiz-metabolismo',
    name: 'Quiz Interativo - Descubra seu Tipo de Metabolismo',
    description: 'Identifique seu tipo metabólico através de perguntas estratégicas',
    objective: 'attract-contacts',
    category: 'quiz',
    profession: 'universal',
    disclaimer: 'required',
    estimatedTime: '3-5 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Metabolismo basal', 'FDA - Avaliação nutricional'],
    ctaText: 'Ver resultado completo',
    captureData: true,
    icon: '🧬',
    color: 'green',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quiz-bem-estar',
    name: 'Quiz de Bem-Estar - Como está sua Rotina?',
    description: 'Avalie sua rotina atual de bem-estar e receba dicas personalizadas',
    objective: 'engage-clients',
    category: 'quiz',
    profession: 'universal',
    disclaimer: 'recommended',
    estimatedTime: '2-3 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Bem-estar geral'],
    ctaText: 'Saiba como melhorar',
    captureData: true,
    icon: '💚',
    color: 'blue',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quiz-perfil-nutricional',
    name: 'Quiz de Perfil Nutricional - Absorção de Nutrientes',
    description: 'Descubra como seu corpo está absorvendo os nutrientes',
    objective: 'attract-contacts',
    category: 'quiz',
    profession: 'nutri',
    disclaimer: 'required',
    estimatedTime: '4-6 minutos',
    difficulty: 'medium',
    scientificBasis: ['ANVISA - Nutrientes essenciais', 'FDA - Absorção nutricional'],
    ctaText: 'Receber análise completa',
    captureData: true,
    icon: '🥗',
    color: 'green',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quiz-detox',
    name: 'Quiz Detox - Seu Corpo Precisa de Detox?',
    description: 'Avalie se seu corpo está sobrecarregado e precisa de detox',
    objective: 'attract-contacts',
    category: 'quiz',
    profession: 'universal',
    disclaimer: 'required',
    estimatedTime: '2-3 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Toxinas ambientais'],
    ctaText: 'Ver plano de detox ideal',
    captureData: true,
    icon: '🌿',
    color: 'green',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quiz-energetico',
    name: 'Quiz Energético - Descubra sua Energia Natural',
    description: 'Identifique seu padrão energético e receba recomendações',
    objective: 'attract-contacts',
    category: 'quiz',
    profession: 'universal',
    disclaimer: 'recommended',
    estimatedTime: '3-4 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Energia e nutrição'],
    ctaText: 'Ver produtos indicados',
    captureData: true,
    icon: '⚡',
    color: 'yellow',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // CALCULADORAS (7-10)
  {
    id: 'calculadora-proteina',
    name: 'Calculadora de Proteína Diária',
    description: 'Calcule quantas proteínas você precisa por dia',
    objective: 'attract-contacts',
    category: 'calculator',
    profession: 'nutri',
    disclaimer: 'required',
    estimatedTime: '2-3 minutos',
    difficulty: 'medium',
    scientificBasis: ['OMS - Necessidades proteicas', 'FDA - RDA proteínas'],
    ctaText: 'Gerar plano de proteína',
    captureData: true,
    icon: '🥩',
    color: 'red',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'calculadora-agua',
    name: 'Calculadora de Hidratação',
    description: 'Descubra quanta água seu corpo precisa por dia',
    objective: 'engage-clients',
    category: 'calculator',
    profession: 'universal',
    disclaimer: 'recommended',
    estimatedTime: '1-2 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Hidratação adequada'],
    ctaText: 'Gerar lembrete diário',
    captureData: true,
    icon: '💧',
    color: 'blue',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'calculadora-calorias',
    name: 'Calculadora de Calorias Diárias',
    description: 'Calcule suas necessidades calóricas baseadas no seu estilo de vida',
    objective: 'attract-contacts',
    category: 'calculator',
    profession: 'nutri',
    disclaimer: 'required',
    estimatedTime: '3-4 minutos',
    difficulty: 'medium',
    scientificBasis: ['OMS - Necessidades calóricas', 'FDA - Metabolismo'],
    ctaText: 'Receber sugestão de plano',
    captureData: true,
    icon: '🔥',
    color: 'orange',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // CHECKLISTS (10-11)
  {
    id: 'checklist-detox',
    name: 'Checklist Detox - 10 Sinais de Sobrecarga',
    description: 'Identifique sinais de que seu corpo precisa de detox',
    objective: 'generate-authority',
    category: 'checklist',
    profession: 'universal',
    disclaimer: 'recommended',
    estimatedTime: '2-3 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Sinais de sobrecarga'],
    ctaText: 'Baixar lista completa',
    captureData: true,
    icon: '✅',
    color: 'green',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'checklist-alimentar',
    name: 'Checklist Alimentar - Hábitos Equilibrados',
    description: 'Avalie se você se alimenta de forma equilibrada',
    objective: 'generate-authority',
    category: 'checklist',
    profession: 'nutri',
    disclaimer: 'recommended',
    estimatedTime: '3-4 minutos',
    difficulty: 'easy',
    scientificBasis: ['OMS - Alimentação equilibrada'],
    ctaText: 'Ver dicas personalizadas',
    captureData: true,
    icon: '🍎',
    color: 'green',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Função para filtrar templates por objetivo
export function getTemplatesByObjective(objective: string): Template[] {
  return TEMPLATES_CATALOG.filter(template => template.objective === objective)
}

// Função para filtrar templates por profissão
export function getTemplatesByProfession(profession: string): Template[] {
  return TEMPLATES_CATALOG.filter(template => 
    template.profession === profession || template.profession === 'universal'
  )
}

// Função para buscar templates
export function searchTemplates(query: string): Template[] {
  return TEMPLATES_CATALOG.filter(template => 
    template.name.toLowerCase().includes(query.toLowerCase()) ||
    template.description.toLowerCase().includes(query.toLowerCase())
  )
}
