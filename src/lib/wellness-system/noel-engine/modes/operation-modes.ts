// =====================================================
// NOEL - MODOS DE OPERAÇÃO
// 10 modos distintos de funcionamento do NOEL
// =====================================================

import type { NoelOperationMode } from '@/types/wellness-system'

/**
 * Definição dos 10 modos de operação do NOEL
 */
export const operationModes: Record<NoelOperationMode, {
  descricao: string
  quando_usar: string[]
  foco: string
  tom: string
  acoes_tipicas: string[]
}> = {
  venda: {
    descricao: 'Foco em gerar vendas de kits, produtos ou rotinas',
    quando_usar: [
      'Distribuidor quer vender',
      'Cliente demonstrou interesse',
      'Momento de fechamento',
      'Follow-up de lead'
    ],
    foco: 'Conversão em venda',
    tom: 'Leve, consultivo, sem pressão',
    acoes_tipicas: [
      'Sugerir script de proposta',
      'Oferecer kit apropriado',
      'Fazer diagnóstico de necessidade',
      'Fechar com leveza'
    ]
  },

  upsell: {
    descricao: 'Aumentar valor da venda ou frequência de compra',
    quando_usar: [
      'Cliente já comprou kit',
      'Cliente está satisfeito',
      'Momento de sugerir Turbo ou Hype',
      'Transição para rotina mensal'
    ],
    foco: 'Aumentar PV ou recorrência',
    tom: 'Sugestivo, educativo, sem forçar',
    acoes_tipicas: [
      'Sugerir produto complementar',
      'Educar sobre benefícios',
      'Oferecer rotina mensal',
      'Mostrar opções (50/75/100 PV)'
    ]
  },

  reativacao: {
    descricao: 'Recuperar clientes inativos ou que sumiram',
    quando_usar: [
      'Cliente não compra há tempo',
      'Cliente sumiu após primeira compra',
      'Lead que não fechou',
      'Ex-distribuidor'
    ],
    foco: 'Reconexão e retomada',
    tom: 'Acolhedor, sem culpa, leve',
    acoes_tipicas: [
      'Reativar com mensagem leve',
      'Oferecer opção simples',
      'Reconectar emocionalmente',
      'Reduzir atrito'
    ]
  },

  recrutamento: {
    descricao: 'Atrair e converter novos distribuidores',
    quando_usar: [
      'Pessoa demonstrou interesse no negócio',
      'Cliente quer renda extra',
      'Momento de apresentar oportunidade',
      'Após HOM'
    ],
    foco: 'Conversão em distribuidor',
    tom: 'Inspirador, leve, focado em benefícios (NUNCA PV)',
    acoes_tipicas: [
      'Plantar semente de curiosidade',
      'Fazer pré-diagnóstico',
      'Convidar para HOM',
      'Fechar com leveza'
    ]
  },

  acompanhamento: {
    descricao: 'Manter relacionamento e garantir continuidade',
    quando_usar: [
      'Cliente ativo precisa de check-in',
      'Acompanhamento de 7/14/30 dias',
      'Manter cliente engajado',
      'Garantir recorrência'
    ],
    foco: 'Relacionamento e continuidade',
    tom: 'Cuidadoso, presente, sem ser invasivo',
    acoes_tipicas: [
      'Fazer check-in leve',
      'Validar resultados',
      'Sugerir próxima etapa',
      'Manter vínculo'
    ]
  },

  treinamento: {
    descricao: 'Ensinar e capacitar o distribuidor',
    quando_usar: [
      'Distribuidor pede ajuda',
      'Distribuidor cometeu erro',
      'Distribuidor quer aprender',
      'Momento de educar'
    ],
    foco: 'Capacitação e aprendizado',
    tom: 'Didático, acolhedor, encorajador',
    acoes_tipicas: [
      'Explicar conceito',
      'Corrigir suavemente',
      'Oferecer exemplo',
      'Validar aprendizado'
    ]
  },

  suporte: {
    descricao: 'Resolver problemas e dar suporte emocional',
    quando_usar: [
      'Distribuidor está desanimado',
      'Distribuidor tem dúvida',
      'Distribuidor precisa de ajuda',
      'Situação de dificuldade'
    ],
    foco: 'Apoio e resolução',
    tom: 'Empático, acolhedor, motivador',
    acoes_tipicas: [
      'Validar sentimento',
      'Oferecer microação',
      'Reduzir pressão',
      'Motivar com leveza'
    ]
  },

  diagnostico: {
    descricao: 'Entender necessidade do cliente ou prospect',
    quando_usar: [
      'Primeira conversa com cliente',
      'Cliente não sabe o que precisa',
      'Momento de entender objetivo',
      'Antes de sugerir produto'
    ],
    foco: 'Compreensão de necessidade',
    tom: 'Consultivo, curioso, sem julgamento',
    acoes_tipicas: [
      'Fazer perguntas estratégicas',
      'Entender objetivo principal',
      'Identificar dor',
      'Personalizar oferta'
    ]
  },

  personalizacao: {
    descricao: 'Adaptar scripts e abordagens ao perfil específico',
    quando_usar: [
      'Cliente com perfil específico',
      'Necessidade de adaptação',
      'Contexto único',
      'Personalização necessária'
    ],
    foco: 'Adaptação e customização',
    tom: 'Flexível, atento, criativo',
    acoes_tipicas: [
      'Adaptar script ao contexto',
      'Personalizar mensagem',
      'Ajustar tom',
      'Criar versão única'
    ]
  },

  emergencia: {
    descricao: 'Situações que precisam de atenção imediata',
    quando_usar: [
      'Cliente muito insatisfeito',
      'Situação crítica',
      'Problema urgente',
      'Precisa de intervenção rápida'
    ],
    foco: 'Resolução imediata',
    tom: 'Direto, eficiente, cuidadoso',
    acoes_tipicas: [
      'Priorizar resolução',
      'Oferecer solução rápida',
      'Validar problema',
      'Garantir satisfação'
    ]
  }
}

/**
 * Retorna informações sobre um modo específico
 */
export function getModeInfo(mode: NoelOperationMode) {
  return operationModes[mode]
}

/**
 * Lista todos os modos disponíveis
 */
export function getAllModes(): NoelOperationMode[] {
  return Object.keys(operationModes) as NoelOperationMode[]
}





