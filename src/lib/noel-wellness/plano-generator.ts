/**
 * NOEL WELLNESS - Gerador de Planos Personalizados
 * 
 * Gera planos de 7, 14, 30 e 90 dias baseado em:
 * - Objetivo financeiro
 * - Tempo disponível
 * - Estilo de trabalho
 * - Desejo de recrutar
 */

import type { 
  Consultor, 
  TipoPlano, 
  PlanoEstrutura, 
  PlanoDia,
  EstagioNegocio,
  TempoDisponivelDiario
} from '@/types/wellness-noel'

/**
 * Gera plano completo
 */
export function generatePlano(
  consultor: Consultor,
  tipoPlano: TipoPlano
): PlanoEstrutura {
  const dias = tipoPlano === '7d' ? 7 : tipoPlano === '14d' ? 14 : tipoPlano === '30d' ? 30 : 90

  const plano: PlanoEstrutura = {
    tipo: tipoPlano,
    objetivo: definirObjetivo(consultor, tipoPlano),
    dias: [],
    ajustes_automaticos: {
      baseado_em: ['progresso_diario', 'execucao_microtarefas', 'resultados_pv'],
      regras: [
        'Se progresso < 50%, reduzir complexidade',
        'Se progresso > 80%, aumentar desafio',
        'Ajustar microtarefas conforme tempo disponível',
      ],
    },
  }

  // Gerar dias do plano
  for (let dia = 1; dia <= dias; dia++) {
    plano.dias.push(gerarDiaPlano(dia, consultor, tipoPlano))
  }

  return plano
}

/**
 * Define objetivo do plano
 */
function definirObjetivo(consultor: Consultor, tipoPlano: TipoPlano): string {
  const objetivos: Record<TipoPlano, string> = {
    '7d': 'Fase de ação guiada - Primeiros passos estruturados',
    '14d': 'Fase de ação guiada - Construção de rotina',
    '30d': 'Fase de consistência e volume - Aceleração de resultados',
    '90d': 'Fase de liderança - Desenvolvimento completo',
  }

  let objetivo = objetivos[tipoPlano]

  if (consultor.objetivo_financeiro) {
    objetivo += ` | Meta financeira: R$ ${consultor.objetivo_financeiro}`
  }

  if (consultor.objetivo_pv) {
    objetivo += ` | Meta PV: ${consultor.objetivo_pv}`
  }

  return objetivo
}

/**
 * Gera estrutura de um dia do plano
 */
function gerarDiaPlano(
  dia: number,
  consultor: Consultor,
  tipoPlano: TipoPlano
): PlanoDia {
  const microtarefas = gerarMicrotarefas(dia, consultor, tipoPlano)
  const foco = definirFocoDia(dia, tipoPlano, consultor.estagio_negocio)
  const metaDia = definirMetaDia(dia, tipoPlano, consultor)
  const fraseMotivacional = gerarFraseMotivacional(dia, tipoPlano)

  return {
    dia,
    microtarefas,
    foco,
    meta_dia: metaDia,
    frase_motivacional: fraseMotivacional,
  }
}

/**
 * Gera microtarefas do dia
 */
function gerarMicrotarefas(
  dia: number,
  consultor: Consultor,
  tipoPlano: TipoPlano
): string[] {
  const microtarefas: string[] = []

  // Microtarefas baseadas no tempo disponível
  const tempo = consultor.tempo_disponivel_diario || '30-60 min'
  
  if (tempo === '15-30 min') {
    microtarefas.push('Ritual 2: 2 contatos')
    if (dia % 2 === 0) {
      microtarefas.push('Enviar 1 mensagem de follow-up')
    }
  } else if (tempo === '30-60 min') {
    microtarefas.push('Ritual 2: 2 contatos')
    microtarefas.push('Ritual 5: 5 ações de vendas')
    if (dia % 3 === 0) {
      microtarefas.push('Apresentar produto para 1 pessoa')
    }
  } else if (tempo === '1-2h') {
    microtarefas.push('Ritual 2: 2 contatos')
    microtarefas.push('Ritual 5: 5 ações de vendas')
    microtarefas.push('Apresentar produto para 1 pessoa')
    if (consultor.deseja_recrutar && dia % 5 === 0) {
      microtarefas.push('Conversar sobre oportunidade com 1 pessoa')
    }
  } else {
    microtarefas.push('Ritual 2: 2 contatos')
    microtarefas.push('Ritual 5: 5 ações de vendas')
    microtarefas.push('Apresentar produto para 2 pessoas')
    microtarefas.push('Fazer follow-up com 3 clientes')
    if (consultor.deseja_recrutar) {
      microtarefas.push('Identificar 1 potencial recruta')
    }
  }

  // Microtarefas baseadas no estágio
  if (consultor.estagio_negocio === 'iniciante' && dia <= 7) {
    microtarefas.push('Estudar 1 script de vendas')
  }

  if (consultor.estagio_negocio === 'ativo' || consultor.estagio_negocio === 'produtivo') {
    if (dia % 7 === 0) {
      microtarefas.push('Revisar metas da semana')
    }
  }

  if (consultor.estagio_negocio === 'multiplicador' || consultor.estagio_negocio === 'lider') {
    if (dia % 3 === 0) {
      microtarefas.push('Acompanhar equipe')
    }
  }

  // Ritual 10 sempre
  microtarefas.push('Ritual 10: Revisar dia e planejar amanhã')

  return microtarefas
}

/**
 * Define foco do dia
 */
function definirFocoDia(
  dia: number,
  tipoPlano: TipoPlano,
  estagio: EstagioNegocio
): string {
  // Primeira semana: fundamentos
  if (dia <= 7) {
    return 'Fundamentos: Construir base sólida'
  }

  // Segunda semana: ação
  if (dia <= 14 && tipoPlano !== '7d') {
    return 'Ação: Acelerar resultados'
  }

  // Terceira e quarta semana: consistência
  if (dia <= 30 && tipoPlano !== '7d' && tipoPlano !== '14d') {
    return 'Consistência: Manter ritmo e volume'
  }

  // Após 30 dias: liderança (se aplicável)
  if (dia > 30 && (estagio === 'multiplicador' || estagio === 'lider')) {
    return 'Liderança: Desenvolver equipe'
  }

  return 'Crescimento: Evoluir continuamente'
}

/**
 * Define meta do dia
 */
function definirMetaDia(
  dia: number,
  tipoPlano: TipoPlano,
  consultor: Consultor
): string {
  const metas: string[] = []

  // Meta baseada em PV objetivo
  if (consultor.objetivo_pv) {
    const pvDiario = Math.ceil(consultor.objetivo_pv / (tipoPlano === '7d' ? 7 : tipoPlano === '14d' ? 14 : tipoPlano === '30d' ? 30 : 90))
    metas.push(`PV: ${pvDiario}`)
  }

  // Meta baseada em tempo
  const tempo = consultor.tempo_disponivel_diario || '30-60 min'
  if (tempo === '15-30 min') {
    metas.push('2 contatos')
  } else if (tempo === '30-60 min') {
    metas.push('5 ações')
  } else {
    metas.push('10+ ações')
  }

  return metas.join(' | ')
}

/**
 * Gera frase motivacional do dia
 */
function gerarFraseMotivacional(dia: number, tipoPlano: TipoPlano): string {
  const frases: string[] = [
    'Cada dia é uma nova oportunidade de crescimento! 💪',
    'Pequenas ações diárias geram grandes resultados! 🌟',
    'Você está no caminho certo! Continue! 🚀',
    'Consistência é a chave do sucesso! 🔑',
    'Acredite no seu potencial! Você consegue! ✨',
    'Cada passo te aproxima do seu objetivo! 🎯',
    'Você é capaz de muito mais do que imagina! 💫',
    'O sucesso é construído dia após dia! 📈',
  ]

  // Rotacionar frases
  const indice = (dia - 1) % frases.length
  return frases[indice]
}

