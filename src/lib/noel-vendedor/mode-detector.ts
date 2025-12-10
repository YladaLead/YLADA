/**
 * Detector de Modo do NOEL Vendedor
 * Baseado na Lousa Oficial - Seção 2
 */

export type NoelVendedorMode = 'vendedor' | 'suporte-leve' | 'comercial-curto'

export interface ModeDetectionContext {
  message: string
  messageLength?: number
  source?: 'page' | 'whatsapp' | 'chat'
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

/**
 * Detecta automaticamente qual modo o NOEL deve usar
 */
export function detectMode(context: ModeDetectionContext): NoelVendedorMode {
  const { message, messageLength, source, conversationHistory } = context
  const lowerMessage = message.toLowerCase()

  // ============================================
  // MODO SUPORTE LEVE
  // Ativado quando o usuário demonstra problemas de acesso
  // ============================================
  const suporteLeveKeywords = [
    'não recebi',
    'não recebeu',
    'não chegou',
    'não consigo entrar',
    'não consegui entrar',
    'não consigo acessar',
    'não consegui acessar',
    'não encontro',
    'não encontrei',
    'minha senha não funciona',
    'senha não funciona',
    'esqueci minha senha',
    'perdi minha senha',
    'paguei e não',
    'comprei e não',
    'onde acesso',
    'como faço login',
    'como acesso',
    'não sei onde entrar',
    'não sei como entrar',
    'link de acesso',
    'email de acesso',
    'e-mail de acesso',
  ]

  const isSuporteLeve = suporteLeveKeywords.some(keyword => lowerMessage.includes(keyword))

  if (isSuporteLeve) {
    return 'suporte-leve'
  }

  // ============================================
  // MODO COMERCIAL CURTO
  // Ativado quando:
  // - Fonte é WhatsApp
  // - Mensagem muito curta (< 50 caracteres)
  // - Usuário pede explicação rápida
  // ============================================
  const comercialCurtoKeywords = [
    'rapidinho',
    'rapido',
    'resumo',
    'resumido',
    'explica rapido',
    'explica rapidinho',
    'me explica rapido',
    'me explica rapidinho',
  ]

  const isComercialCurto =
    source === 'whatsapp' ||
    (messageLength !== undefined && messageLength < 50) ||
    comercialCurtoKeywords.some(keyword => lowerMessage.includes(keyword))

  if (isComercialCurto) {
    return 'comercial-curto'
  }

  // ============================================
  // MODO VENDEDOR (padrão)
  // Ativado em todos os outros casos
  // ============================================
  return 'vendedor'
}

/**
 * Obtém descrição do modo para incluir no prompt
 */
export function getModeDescription(mode: NoelVendedorMode): string {
  switch (mode) {
    case 'vendedor':
      return `
MODO VENDEDOR — Página de Vendas (COMPORTAMENTO PROATIVO)

Você está atuando como VENDEDOR ATIVO na página de vendas.

Seu objetivo:
- DETECTAR oportunidades de venda em cada interação
- EXTRAIR informações do cliente (nome, email, necessidades)
- PROMOVER ativamente scripts, ferramentas e recursos do sistema
- MENCIONAR sempre que após assinatura terá acesso completo
- CONECTAR necessidades do cliente com recursos disponíveis
- CONDUZIR para o fechamento de forma natural mas proativa
- SER MENTOR quando apropriado, sempre promovendo o sistema

COMPORTAMENTO OBRIGATÓRIO:
- Quando cliente pede script → "O sistema tem vários scripts prontos! Após assinar, você terá acesso completo."
- Quando cliente pede ferramenta → "Essa ferramenta está disponível no sistema. Com a assinatura, você terá acesso."
- Quando cliente tem dúvida → Extraia informação + Promova recurso + Ofereça link
- Quando cliente demonstra interesse → Extraia dados + Promova benefícios + Feche com link

NUNCA seja passivo. SEMPRE promova o sistema e seus recursos.
`

    case 'suporte-leve':
      return `
MODO SUPORTE LEVE — Pós-Compra

Você está atuando em modo suporte leve para ajudar com acesso inicial.

Seu objetivo:
- Orientar com mensagens simples e diretas
- Evitar explicações técnicas
- Nunca supôr causas internas do problema
- Pedir informações básicas (nome e e-mail) para encaminhar
- Reforçar calma, acolhimento e solução rápida
- Encaminhar para suporte quando necessário, sem parecer robótico

NUNCA faça:
- Diagnosticar tecnicamente
- Falar sobre "erro no sistema"
- Sugerir problema interno
- Citar termos como servidor, API, banco de dados
- Prometer solução técnica

Sempre comece com:
"Fica tranquilo, isso é bem simples de resolver. Te ajudo agora mesmo."
`

    case 'comercial-curto':
      return `
MODO COMERCIAL CURTO — WhatsApp

Você está atuando em modo comercial curto (WhatsApp ou conversa rápida).

Seu objetivo:
- Responder curto, claro e objetivo
- Focar no benefício direto para a pessoa
- Ajudar a decidir entre plano mensal e anual
- Evitar qualquer detalhamento
- Manter o tom humano, leve e conversacional
- Conduzir para o fechamento de maneira natural
`

    default:
      return ''
  }
}
