/**
 * Mapeador de Dores para Busca de Imagens
 * 
 * Identifica a dor principal do roteiro e mapeia para:
 * - Termos de busca no acervo (Envato)
 * - Prompt de geração de imagem (ChatGPT)
 */

export type DorType = 
  | 'agenda-vazia'
  | 'frustracao'
  | 'sem-clientes'
  | 'financeiro'
  | 'sobrecarga'
  | 'solidao'
  | 'estagnacao'
  | 'outro'

export interface DorMapping {
  type: DorType
  name: string
  searchTerms: string[]
  promptTemplate: string
  purpose: 'hook' | 'dor' | 'solucao' | 'cta'
}

/**
 * Mapeamento completo de dores
 */
export const DOR_MAPPINGS: Record<DorType, DorMapping> = {
  'agenda-vazia': {
    type: 'agenda-vazia',
    name: 'Agenda Vazia',
    searchTerms: [
      'empty calendar',
      'blank schedule',
      'no appointments',
      'free calendar',
      'empty diary',
      'no bookings',
      'available schedule',
      'agenda vazia',
      'calendário vazio',
      'sem compromissos'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com AGENDA VAZIA.

Contexto emocional:
- Sensação de frustração e insegurança
- Profissional qualificada, mas com poucos clientes
- Ambiente profissional realista (consultório ou home office)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional (nutricionista / saúde)
- Olhando para celular ou calendário vazio
- Expressão de preocupação leve (não exagerada)
- Iluminação natural, tons neutros e frios

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'frustracao': {
    type: 'frustracao',
    name: 'Frustração Profissional',
    searchTerms: [
      'frustrated nutritionist',
      'stressed professional',
      'overwhelmed businesswoman',
      'worried nutritionist',
      'tired healthcare',
      'frustração',
      'estresse profissional',
      'sobrecarga mental'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com FRUSTRAÇÃO PROFISSIONAL.

Contexto emocional:
- Sensação de cansaço mental e sobrecarga
- Profissional competente, mas sem direção clara
- Ambiente de trabalho (escritório ou consultório)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional (jaleco ou roupa social)
- Mão na testa ou olhando para tela com expressão de cansaço
- Expressão de frustração leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'sem-clientes': {
    type: 'sem-clientes',
    name: 'Sem Clientes',
    searchTerms: [
      'no clients',
      'empty waiting room',
      'lonely professional',
      'no patients',
      'empty clinic',
      'sem clientes',
      'sem pacientes',
      'consultório vazio'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista SEM CLIENTES.

Contexto emocional:
- Sensação de solidão profissional
- Consultório vazio, sem pacientes
- Profissional qualificada esperando por oportunidades

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional (nutricionista)
- Em consultório vazio ou sala de espera sem pessoas
- Expressão de espera/preocupação leve
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'financeiro': {
    type: 'financeiro',
    name: 'Dificuldade Financeira',
    searchTerms: [
      'financial stress',
      'money problems',
      'low income',
      'bills stress',
      'financial worry',
      'dificuldade financeira',
      'problemas financeiros',
      'preocupação financeira'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com DIFICULDADE FINANCEIRA.

Contexto emocional:
- Preocupação com estabilidade financeira
- Profissional competente, mas com renda baixa
- Ambiente profissional (escritório ou home office)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional
- Olhando para calculadora, planilha ou contas
- Expressão de preocupação leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'sobrecarga': {
    type: 'sobrecarga',
    name: 'Falta de Tempo / Sobrecarga',
    searchTerms: [
      'too busy',
      'overwhelmed schedule',
      'time pressure',
      'multiple tasks',
      'juggling work',
      'sobrecarga',
      'falta de tempo',
      'múltiplas tarefas'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com SOBRECARGA DE TRABALHO.

Contexto emocional:
- Sensação de estar sempre correndo
- Múltiplas tarefas, sem organização
- Profissional competente, mas sem controle do tempo

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional
- Mesa cheia de papéis, múltiplas telas ou tarefas
- Expressão de sobrecarga leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'solidao': {
    type: 'solidao',
    name: 'Solidão / Dúvida Profissional',
    searchTerms: [
      'confused professional',
      'doubtful businesswoman',
      'lonely entrepreneur',
      'uncertain professional',
      'solidão profissional',
      'dúvida',
      'incerteza'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com DÚVIDA PROFISSIONAL.

Contexto emocional:
- Sensação de não saber qual o próximo passo
- Profissional competente, mas sem direção clara
- Ambiente profissional (escritório ou home office)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional
- Olhando para tela ou rolando feed com expressão de dúvida
- Expressão de incerteza leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'estagnacao': {
    type: 'estagnacao',
    name: 'Sem Crescimento / Estagnação',
    searchTerms: [
      'stagnant business',
      'no growth',
      'plateau',
      'stuck career',
      'no progress',
      'estagnação',
      'sem crescimento',
      'sem progresso'
    ],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista com ESTAGNAÇÃO PROFISSIONAL.

Contexto emocional:
- Sensação de estar parada, sem evolução
- Profissional competente, mas sem crescimento
- Ambiente profissional (escritório ou home office)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional
- Olhando para gráfico plano ou dashboard sem crescimento
- Expressão de desânimo leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  },
  'outro': {
    type: 'outro',
    name: 'Outra Dor',
    searchTerms: [],
    purpose: 'hook',
    promptTemplate: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na dor de uma nutricionista.

Contexto emocional:
- Profissional qualificada enfrentando desafios
- Ambiente profissional realista (consultório ou home office)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional (nutricionista / saúde)
- Expressão de preocupação leve (não exagerada)
- Iluminação natural, tons neutros

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`
  }
}

/**
 * Identifica a dor principal de um texto/roteiro
 */
export function identifyDor(text: string): DorType {
  const lowerText = text.toLowerCase()
  
  // Ordem de prioridade (mais específico primeiro)
  const checks: Array<{ type: DorType; keywords: string[] }> = [
    {
      type: 'agenda-vazia',
      keywords: ['agenda vazia', 'calendário vazio', 'sem compromissos', 'sem consultas', 'agenda livre', 'sem pacientes agendados', 'empty calendar', 'no appointments']
    },
    {
      type: 'sem-clientes',
      keywords: ['sem clientes', 'sem pacientes', 'consultório vazio', 'sala de espera vazia', 'no clients', 'no patients', 'empty waiting room']
    },
    {
      type: 'financeiro',
      keywords: ['dificuldade financeira', 'problemas financeiros', 'renda baixa', 'pouco dinheiro', 'financial stress', 'money problems', 'low income']
    },
    {
      type: 'sobrecarga',
      keywords: ['sobrecarga', 'falta de tempo', 'múltiplas tarefas', 'muito trabalho', 'too busy', 'overwhelmed', 'time pressure']
    },
    {
      type: 'frustracao',
      keywords: ['frustração', 'frustrada', 'estresse', 'estressada', 'cansada', 'frustrated', 'stressed', 'overwhelmed', 'tired']
    },
    {
      type: 'solidao',
      keywords: ['solidão', 'dúvida', 'incerteza', 'não sei o que fazer', 'confused', 'doubtful', 'uncertain']
    },
    {
      type: 'estagnacao',
      keywords: ['estagnação', 'sem crescimento', 'sem progresso', 'parada', 'stagnant', 'no growth', 'no progress']
    }
  ]

  for (const check of checks) {
    if (check.keywords.some(keyword => lowerText.includes(keyword))) {
      return check.type
    }
  }

  return 'outro'
}

/**
 * Retorna o mapeamento completo de uma dor
 */
export function getDorMapping(dor: DorType): DorMapping {
  return DOR_MAPPINGS[dor]
}

/**
 * Gera termos de busca para o acervo baseado na dor
 */
export function getSearchTermsForDor(dor: DorType): string[] {
  const mapping = getDorMapping(dor)
  return mapping.searchTerms
}

/**
 * Gera o prompt de imagem para ChatGPT baseado na dor
 */
export function getImagePromptForDor(dor: DorType, customDescription?: string): string {
  const mapping = getDorMapping(dor)
  let prompt = mapping.promptTemplate

  // Se tiver descrição customizada, substituir
  if (customDescription) {
    prompt = prompt.replace(
      'focada na dor de uma nutricionista',
      `focada na dor de uma nutricionista: ${customDescription}`
    )
  }

  return prompt
}

