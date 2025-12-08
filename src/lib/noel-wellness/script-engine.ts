/**
 * NOEL WELLNESS - Uso de Scripts
 * 
 * SEÇÃO 7 — COMO O NOEL USA SCRIPTS
 * 
 * Define como o NOEL seleciona, adapta, personaliza e contextualiza scripts.
 */

export interface ScriptContext {
  personType: 'conhecido_proximo' | 'amigo_familia' | 'indicacao' | 'seguidor_instagram' | 
              'whatsapp_frio' | 'quem_chamou' | 'profissional' | 'cliente_ativo' | 
              'cliente_inativo' | 'potencial_recrutavel'
  objective: 'convite_leve' | 'venda' | 'upsell' | 'reativacao' | 'indicacao' | 
             'recrutamento' | 'lideranca' | 'avanco_carreira'
  operationMode: string
  consultantContext: {
    level?: 'iniciante' | 'intermediario' | 'avancado'
    moment?: 'meta_apertada' | 'inicio_mes' | 'semana_critica' | 'inseguro' | 'ritmo_forte'
  }
}

export interface ScriptSelection {
  script: string
  version: 'curta' | 'media' | 'longa'
  personalization: {
    nomePessoa?: string
    nomeConsultor?: string
    observacoes?: string
    historicoCompra?: string
    estiloConsumo?: string
    grauProximidade?: string
    nivelInteresse?: string
    comportamentoRecente?: string
  }
  adaptation: {
    formalidade: 'formal' | 'informal' | 'natural'
    leveza: 'ultraleve' | 'leve' | 'direto'
    emojis: boolean
    comprimento: 'curto' | 'medio' | 'longo'
    grauProximidade: 'muito_proximo' | 'proximo' | 'distante'
  }
}

/**
 * Princípio central do uso de scripts
 */
export const NOEL_SCRIPT_CENTRAL = 
  'O NOEL sempre entrega a mensagem certa, para a pessoa certa, no momento certo — e no tom certo.'

/**
 * Como o NOEL escolhe o script ideal (4 filtros)
 */
export interface ScriptFilters {
  personType: ScriptContext['personType']
  objective: ScriptContext['objective']
  operationMode: string
  consultantContext: ScriptContext['consultantContext']
}

/**
 * Como o NOEL adapta o script ao tom pessoal do consultor
 */
export function adaptScriptToConsultant(
  script: string,
  consultantStyle: {
    formalidade: 'formal' | 'informal' | 'natural'
    usaEmojis: boolean
    comprimentoPreferido: 'curto' | 'medio' | 'longo'
  }
): string {
  let adapted = script
  
  // Ajustar formalidade
  if (consultantStyle.formalidade === 'formal') {
    adapted = adapted.replace(/oi/gi, 'Olá')
    adapted = adapted.replace(/tô/gi, 'estou')
    adapted = adapted.replace(/pra/gi, 'para')
  } else if (consultantStyle.formalidade === 'informal') {
    adapted = adapted.replace(/Olá/gi, 'Oi')
    adapted = adapted.replace(/estou/gi, 'tô')
    adapted = adapted.replace(/para/gi, 'pra')
  }
  
  // Ajustar emojis
  if (!consultantStyle.usaEmojis) {
    adapted = adapted.replace(/[😊😉🙂💚⚡🔥]/g, '')
  }
  
  // Ajustar comprimento
  if (consultantStyle.comprimentoPreferido === 'curto') {
    const sentences = adapted.split(/[.!?]/).filter(s => s.trim().length > 0)
    if (sentences.length > 2) {
      adapted = sentences.slice(0, 2).join('. ') + '.'
    }
  }
  
  return adapted
}

/**
 * Como o NOEL personaliza o conteúdo do script
 */
export function personalizeScript(
  script: string,
  personalization: ScriptSelection['personalization']
): string {
  let personalized = script
  
  if (personalization.nomePessoa) {
    personalized = personalized.replace(/\[NOME\]/g, personalization.nomePessoa)
    personalized = personalized.replace(/\[Nome\]/g, personalization.nomePessoa)
  }
  
  if (personalization.nomeConsultor) {
    personalized = personalized.replace(/\[CONSULTOR\]/g, personalization.nomeConsultor)
  }
  
  if (personalization.historicoCompra) {
    personalized = personalized.replace(/\[HISTORICO\]/g, personalization.historicoCompra)
  }
  
  if (personalization.observacoes) {
    personalized = personalized.replace(/\[OBSERVACOES\]/g, personalization.observacoes)
  }
  
  return personalized
}

/**
 * Como o NOEL ajusta o tamanho da mensagem
 */
export function createScriptVersions(baseScript: string): {
  curta: string
  media: string
  longa: string
} {
  const sentences = baseScript.split(/[.!?]/).filter(s => s.trim().length > 0)
  
  return {
    curta: sentences.slice(0, 1).join('. ') + '.',
    media: sentences.slice(0, 2).join('. ') + '.',
    longa: baseScript
  }
}

/**
 * Como o NOEL usa scripts para destravar o consultor
 */
export function createCourageScript(context: {
  personType: ScriptContext['personType']
  objective: ScriptContext['objective']
}): {
  ultraleve: string
  meioTermo: string
  direto: string
} {
  const baseScripts = {
    ultraleve: 'Oi! Tudo bem? Posso te perguntar uma coisa? 😊',
    meioTermo: 'Oi! Estou testando algo novo e queria te mostrar. Topa?',
    direto: 'Oi! Tenho algo que pode te interessar. Posso te mostrar?'
  }
  
  return baseScripts
}

/**
 * Como o NOEL usa scripts para follow-up inteligente
 */
export function createFollowUpSequence(initialMessage: string): {
  followUp1: string
  followUp2: string
  followUp3: string
  followUp4: string
} {
  return {
    followUp1: 'Oi! Conseguiu ver minha mensagem anterior? 😊',
    followUp2: 'Oi! Só passando pra saber se ficou alguma dúvida sobre o que te mostrei.',
    followUp3: 'Oi! Tudo bem? Queria saber se você ainda tem interesse em conhecer.',
    followUp4: 'Oi! Notei que não te vi essa semana. Quer que eu te mostre algo novo?'
  }
}

/**
 * Como o NOEL usa scripts para recrutamento
 */
export function createRecruitmentScript(profile: {
  type: 'renda_extra' | 'maes_casa' | 'insatisfeito_trabalho' | 'consumidor_produto' | 
        'jovem_independencia' | 'empreendedor_frustrado' | 'profissional_beleza'
}): string {
  const scripts: Record<string, string> = {
    renda_extra: 'Oi! Vi que você está buscando renda extra. Tenho algo leve que pode te interessar. Quer que eu te explique em 2 min?',
    maes_casa: 'Oi! Sei que você quer trabalhar de casa. Tenho um projeto que pode combinar com você. Quer conhecer?',
    insatisfeito_trabalho: 'Oi! Vi que você está pensando em mudar. Tenho algo que pode te interessar. Posso te mostrar?',
    consumidor_produto: 'Oi! Como você já usa produtos saudáveis, queria te mostrar uma oportunidade de transformar seu consumo em renda. Topa conhecer?',
    jovem_independencia: 'Oi! Tenho um projeto digital simples que pode te interessar. Quer que eu te explique?',
    empreendedor_frustrado: 'Oi! Tenho um modelo diferente, simples e com suporte completo. Quer conhecer?',
    profissional_beleza: 'Oi! Como você já trabalha com bem-estar, queria te mostrar uma oportunidade complementar. Topa?'
  }
  
  return scripts[profile.type] || scripts.renda_extra
}

/**
 * Como o NOEL cria scripts novos
 */
export function createNewScript(context: ScriptContext): {
  script: string
  structure: string[]
} {
  const structure = [
    'Abertura leve',
    'Contexto curto',
    'Proposta simples',
    'Pergunta de continuidade',
    'Fechamento natural'
  ]
  
  // Gerar script baseado no contexto
  let script = ''
  
  if (context.objective === 'convite_leve') {
    script = 'Oi! Tudo bem? 😊\n\nEstou participando de um projeto de bem-estar e queria te mostrar algo rápido. Topa?'
  } else if (context.objective === 'venda') {
    script = 'Oi! Tenho um kit de 5 bebidas funcionais que pode te interessar. Quer conhecer?'
  } else if (context.objective === 'upsell') {
    script = 'Oi! Vi que você gostou das bebidas. Tenho uma versão Turbo que acelera os resultados. Quer testar?'
  } else if (context.objective === 'reativacao') {
    script = 'Oi! Como você tá? Notei que não te vi essa semana. Quer que eu monte algo simples pra você retomar?'
  }
  
  return {
    script,
    structure
  }
}

/**
 * Valida se um script segue a estrutura do NOEL
 */
export function validateScriptStructure(script: string): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Verificar se tem abertura
  if (!script.toLowerCase().includes('oi') && !script.toLowerCase().includes('olá')) {
    issues.push('Falta abertura leve')
  }
  
  // Verificar se não é muito longo
  const words = script.split(/\s+/).length
  if (words > 50) {
    issues.push('Script muito longo (máximo recomendado: 50 palavras)')
  }
  
  // Verificar se não é agressivo
  const aggressiveWords = ['urgente', 'agora', 'última chance', 'não perca']
  if (aggressiveWords.some(word => script.toLowerCase().includes(word))) {
    issues.push('Tom agressivo detectado')
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}





