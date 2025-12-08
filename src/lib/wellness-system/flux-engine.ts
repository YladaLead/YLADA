/**
 * Flux Engine - Motor de Fluxos
 * Detecta gatilhos e seleciona fluxos apropriados
 */

export type TriggerType =
  | 'emocional'
  | 'venda'
  | 'diagnostico'
  | 'recrutamento'
  | 'inatividade'
  | 'treino-diario'
  | 'semana-nova'
  | 'sexta-feira'
  | 'domingo'
  | 'lead-sumiu'
  | 'cliente-desanimado'
  | 'distribuidor-travou'

export type PerfilDistribuidor = 'iniciante' | 'intermediario' | 'lider'

export interface FluxoContext {
  trigger: TriggerType
  perfil?: PerfilDistribuidor
  mensagem?: string
  temperaturaLead?: 'frio' | 'morno' | 'quente'
  diasInativo?: number
}

export interface FluxoRecomendado {
  codigo: string
  titulo: string
  descricao: string
  proximoPasso: string
  script?: string
}

/**
 * Detecta gatilho baseado na mensagem e contexto
 */
export function detectTrigger(
  mensagem: string,
  contexto?: {
    diasInativo?: number
    ultimaAcao?: string
    diaSemana?: number
  }
): TriggerType | null {
  const msg = mensagem.toLowerCase()

  // Gatilhos emocionais
  if (
    msg.includes('desanimado') ||
    msg.includes('cansado') ||
    msg.includes('frustrado') ||
    msg.includes('sem esperança') ||
    msg.includes('não consigo')
  ) {
    return 'emocional'
  }

  // Gatilhos de venda
  if (
    msg.includes('vender') ||
    msg.includes('venda') ||
    msg.includes('cliente') ||
    msg.includes('produto') ||
    msg.includes('kit')
  ) {
    return 'venda'
  }

  // Gatilhos de diagnóstico
  if (
    msg.includes('diagnóstico') ||
    msg.includes('teste') ||
    msg.includes('avaliação') ||
    msg.includes('calcular') ||
    msg.includes('quiz')
  ) {
    return 'diagnostico'
  }

  // Gatilhos de recrutamento
  if (
    msg.includes('recrutar') ||
    msg.includes('equipe') ||
    msg.includes('distribuidor') ||
    msg.includes('renda extra') ||
    msg.includes('negócio')
  ) {
    return 'recrutamento'
  }

  // Gatilhos temporais
  if (contexto) {
    if (contexto.diaSemana === 1) return 'semana-nova' // Segunda-feira
    if (contexto.diaSemana === 5) return 'sexta-feira' // Sexta-feira
    if (contexto.diaSemana === 0) return 'domingo' // Domingo

    if (contexto.diasInativo && contexto.diasInativo >= 2) {
      return 'inatividade'
    }
  }

  // Gatilho de treino diário (sempre disponível)
  return 'treino-diario'
}

/**
 * Seleciona fluxo apropriado baseado no gatilho e perfil
 */
export function selectFluxo(
  trigger: TriggerType,
  perfil?: PerfilDistribuidor
): FluxoRecomendado | null {
  const fluxos: Record<TriggerType, FluxoRecomendado> = {
    emocional: {
      codigo: 'fluxo-retencao-cliente',
      titulo: 'Fluxo de Reconexão Emocional',
      descricao: 'Reconectar e motivar distribuidor desanimado',
      proximoPasso: 'Enviar mensagem de reconexão e oferecer treino motivacional',
      script: 'Oi [nome]! Senti sua falta. Está tudo bem? Se precisar de algo, estou aqui. Que tal um treino rápido de 1 minuto para te ajudar?',
    },
    venda: {
      codigo: 'fluxo-venda-energia',
      titulo: 'Fluxo de Venda',
      descricao: 'Fluxo completo para fechar venda',
      proximoPasso: 'Identificar necessidade e apresentar produto ideal',
      script: 'Vamos identificar qual produto é ideal para você. Que tal fazer um diagnóstico rápido?',
    },
    diagnostico: {
      codigo: 'fluxo-diagnostico',
      titulo: 'Fluxo de Diagnóstico',
      descricao: 'Usar Links Wellness de diagnóstico para identificar necessidades',
      proximoPasso: 'Sugerir link de diagnóstico apropriado',
      script: 'Tenho um diagnóstico que pode te ajudar a identificar sua necessidade. Quer fazer?',
    },
    recrutamento: {
      codigo: 'fluxo-recrutamento-inicial',
      titulo: 'Fluxo de Recrutamento',
      descricao: 'Fluxo para recrutar novos distribuidores',
      proximoPasso: 'Contar história pessoal e oferecer apresentação',
      script: 'Que tal transformar seu consumo em renda? Tenho uma oportunidade que pode te interessar.',
    },
    inatividade: {
      codigo: 'fluxo-retencao-cliente',
      titulo: 'Fluxo de Retenção',
      descricao: 'Reativar distribuidor inativo',
      proximoPasso: 'Enviar mensagem de reconexão leve',
      script: 'Oi [nome]! Faz um tempo que não conversamos. Como você está? Tudo bem?',
    },
    'treino-diario': {
      codigo: 'treino-diario',
      titulo: 'Treino do Dia',
      descricao: 'Treino micro de 1, 3 ou 5 minutos',
      proximoPasso: 'Sugerir treino apropriado para o momento',
      script: 'Tenho um treino rápido que pode te ajudar hoje. Quer ver?',
    },
    'semana-nova': {
      codigo: 'fluxo-planejamento-semanal',
      titulo: 'Planejamento Semanal',
      descricao: 'Planejar semana de ações',
      proximoPasso: 'Definir metas e ações da semana',
      script: 'Que tal planejarmos sua semana? Vamos definir suas ações e metas.',
    },
    'sexta-feira': {
      codigo: 'fluxo-fechamento-semana',
      titulo: 'Fechamento da Semana',
      descricao: 'Revisar semana e fechar pendências',
      proximoPasso: 'Revisar ações da semana e fechar vendas pendentes',
      script: 'Vamos revisar sua semana e fechar o que está pendente. Como foi?',
    },
    domingo: {
      codigo: 'fluxo-reset-emocional',
      titulo: 'Reset Emocional',
      descricao: 'Reset emocional para semana nova',
      proximoPasso: 'Fazer reset emocional e preparar para semana',
      script: 'Domingo é dia de reset. Como você está se sentindo? Vamos preparar uma semana incrível?',
    },
    'lead-sumiu': {
      codigo: 'fluxo-reaquecimento',
      titulo: 'Reaquecimento de Lead',
      descricao: 'Reaquecer lead que sumiu',
      proximoPasso: 'Enviar mensagem de reconexão sutil',
      script: 'Oi [nome]! Faz um tempo que não conversamos. Como você está?',
    },
    'cliente-desanimado': {
      codigo: 'fluxo-retencao-cliente',
      titulo: 'Retenção de Cliente',
      descricao: 'Reter cliente desanimado',
      proximoPasso: 'Oferecer ajuda e novo link wellness',
      script: 'Oi [nome]! Senti que você pode estar precisando de algo. Estou aqui para ajudar. Que tal um novo diagnóstico?',
    },
    'distribuidor-travou': {
      codigo: 'fluxo-reconectar-acao-minima',
      titulo: 'Reconexão com Ação Mínima',
      descricao: 'Ajudar distribuidor travado com ação mínima',
      proximoPasso: 'Sugerir ação mínima para destravar',
      script: 'Entendo que você travou. Que tal fazermos 1 ação mínima agora? Pode ser 1 mensagem, 1 link. Isso destrava tudo.',
    },
  }

  return fluxos[trigger] || null
}

/**
 * Obtém próximo passo do fluxo
 */
export function getNextStep(
  codigoFluxo: string,
  passoAtual: number
): {
  proximoPasso: number
  titulo: string
  descricao: string
} | null {
  // Esta função seria implementada buscando do banco de dados
  // Por enquanto, retorna estrutura básica
  return {
    proximoPasso: passoAtual + 1,
    titulo: 'Próximo Passo',
    descricao: 'Continue seguindo o fluxo',
  }
}

/**
 * Obtém script do fluxo
 */
export function getScript(
  codigoFluxo: string,
  passo: number,
  tipoCliente?: 'frio' | 'morno' | 'quente'
): string | null {
  // Esta função seria implementada buscando do banco de dados
  // Por enquanto, retorna script genérico
  return 'Script do fluxo será buscado do banco de dados'
}

/**
 * Função principal: Processa contexto e retorna recomendação
 */
export function processFluxoContext(contexto: FluxoContext): FluxoRecomendado | null {
  const trigger = contexto.trigger || detectTrigger(contexto.mensagem || '', contexto)
  
  if (!trigger) {
    return null
  }

  return selectFluxo(trigger, contexto.perfil)
}
