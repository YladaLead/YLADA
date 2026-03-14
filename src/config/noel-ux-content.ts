/**
 * Conteúdo UX do Noel por área (mensagem inicial, sugestões, placeholder).
 * Usado em NoelChat para orientar o usuário e aumentar engajamento.
 */

export type NoelArea = 'ylada' | 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'nutri' | 'coach' | 'seller' | 'perfumaria' | 'estetica' | 'fitness'

export interface NoelUxContent {
  welcomeMessage: string
  suggestions: { label: string; prompt: string }[]
  placeholder: string
  placeholderExample: string
}

const DEFAULT_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como posso melhorar meus diagnósticos?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para meu marketing' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes?' },
]

const ESTETICA_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes de estética' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para estética?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para redes sociais' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para limpeza de pele?' },
]

const NOEL_UX_BY_AREA: Record<NoelArea, NoelUxContent> = {
  ylada: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero gerar mais clientes',
  },
  estetica: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: ESTETICA_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero gerar mais clientes para limpeza de pele',
  },
  med: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem pacientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero atrair mais pacientes para consulta',
  },
  psi: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes para terapia',
  },
  psicanalise: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes',
  },
  odonto: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos para atrair pacientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Quero atrair mais pacientes para clareamento',
  },
  nutra: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como vender mais produtos',
  },
  nutri: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem pacientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais pacientes para consulta',
  },
  coach: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como conseguir mais leads',
  },
  seller: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como aumentar minhas vendas',
  },
  perfumaria: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais clientes para perfumaria',
  },
  fitness: {
    welcomeMessage: `Olá! Eu sou o Noel.

Posso te ajudar a:

• Criar diagnósticos que atraem clientes
• Melhorar seus diagnósticos
• Gerar ideias de conteúdo
• Organizar sua estratégia de crescimento

O que você gostaria de fazer agora?`,
    suggestions: DEFAULT_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais alunos para academia',
  },
}

export function getNoelUxContent(area: NoelArea): NoelUxContent {
  return NOEL_UX_BY_AREA[area] ?? NOEL_UX_BY_AREA.med
}
