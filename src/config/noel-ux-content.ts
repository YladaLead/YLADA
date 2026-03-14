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

const ODONTO_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair pacientes odontológicos' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para odontologia?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para clínica odontológica' },
  { label: '🎯 Conseguir mais pacientes', prompt: 'Como conseguir mais pacientes para clareamento ou implante?' },
]

const PSI_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes para terapia' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para psicologia?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo sobre saúde mental' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para atendimento psicológico?' },
]

const FITNESS_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair alunos de treino' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para fitness?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para academia ou personal' },
  { label: '🎯 Conseguir mais alunos', prompt: 'Como conseguir mais alunos para treino ou avaliação?' },
]

const COACH_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes de coaching' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing como coach?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para meu posicionamento' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para sessões de coaching?' },
]

const MED_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair pacientes' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing médico?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para consultório' },
  { label: '🎯 Conseguir mais pacientes', prompt: 'Como conseguir mais pacientes para consulta?' },
]

const NUTRA_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes de suplementos' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para vendas?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para produtos' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para meus produtos?' },
]

const NUTRI_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair pacientes nutricionais' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para nutrição?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo sobre alimentação' },
  { label: '🎯 Conseguir mais pacientes', prompt: 'Como conseguir mais pacientes para consulta nutricional?' },
]

const PSICANALISE_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes para análise' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para psicanálise?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo sobre psicanálise' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para atendimento?' },
]

const PERFUMARIA_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes de perfumaria' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing para perfumaria?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo sobre fragrâncias' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes para perfumaria?' },
]

const SELLER_SUGGESTIONS = [
  { label: '🧪 Criar diagnóstico', prompt: 'Quero criar um diagnóstico para atrair clientes' },
  { label: '📈 Melhorar meu marketing', prompt: 'Como melhorar meu marketing de vendas?' },
  { label: '💡 Ideias de conteúdo', prompt: 'Preciso de ideias de conteúdo para vendas' },
  { label: '🎯 Conseguir mais clientes', prompt: 'Como conseguir mais clientes e aumentar vendas?' },
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
    suggestions: MED_SUGGESTIONS,
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
    suggestions: PSI_SUGGESTIONS,
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
    suggestions: PSICANALISE_SUGGESTIONS,
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
    suggestions: ODONTO_SUGGESTIONS,
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
    suggestions: NUTRA_SUGGESTIONS,
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
    suggestions: NUTRI_SUGGESTIONS,
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
    suggestions: COACH_SUGGESTIONS,
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
    suggestions: SELLER_SUGGESTIONS,
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
    suggestions: PERFUMARIA_SUGGESTIONS,
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
    suggestions: FITNESS_SUGGESTIONS,
    placeholder: 'Pergunte algo ao Noel...',
    placeholderExample: 'Ex: Como atrair mais alunos para academia',
  },
}

export function getNoelUxContent(area: NoelArea): NoelUxContent {
  return NOEL_UX_BY_AREA[area] ?? NOEL_UX_BY_AREA.med
}
