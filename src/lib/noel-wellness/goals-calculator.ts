/**
 * NOEL WELLNESS - Calculadora de Metas Automáticas
 * 
 * Calcula metas diárias, semanais e mensais baseado no perfil estratégico
 * usando a matriz completa definida no roteiro oficial.
 */

import type { WellnessConsultantProfile } from '@/types/wellness-system'

export interface MetasCalculadas {
  // Metas de vendas
  bebidas_dia: number
  kits_semana: number
  produtos_fechados_semana: number
  
  // Metas de equipe
  convites_semana: number
  apresentacoes_semana: number
  followups_dia: number
  
  // Metas de acompanhamento
  acompanhamentos_semana: number
  
  // Conversão da meta financeira
  meta_financeira_mensal: number
  equivalente_bebidas_mes: number
  equivalente_kits_mes: number
  equivalente_produtos_mes: number
  equivalente_convites_mes: number
  
  // Plano identificado
  plano_tipo: 'vendas_rapidas' | 'duplicacao' | 'hibrido' | 'presidente'
  plano_nome: string
}

/**
 * Matriz principal de metas por tipo de trabalho e carga horária
 */
const MATRIZ_METAS_POR_TRABALHO = {
  bebidas_funcionais: {
    '1_hora': {
      bebidas_dia: 2,
      kits_semana: 1,
      produtos_fechados_semana: 0,
      convites_semana: 1,
    },
    '1_a_2_horas': {
      bebidas_dia: 3,
      kits_semana: 2,
      produtos_fechados_semana: 1,
      convites_semana: 2,
    },
    '2_a_4_horas': {
      bebidas_dia: 6,
      kits_semana: 3,
      produtos_fechados_semana: 1,
      convites_semana: 4,
    },
    'mais_4_horas': {
      bebidas_dia: 9,
      kits_semana: 5,
      produtos_fechados_semana: 2,
      convites_semana: 6,
    },
  },
  produtos_fechados: {
    '1_hora': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 1,
      convites_semana: 1,
      followups_dia: 3,
    },
    '1_a_2_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 2,
      convites_semana: 2,
      followups_dia: 5,
    },
    '2_a_4_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 4,
      convites_semana: 3,
      followups_dia: 8,
    },
    'mais_4_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 5,
      convites_semana: 5,
      followups_dia: 12,
    },
  },
  cliente_que_indica: {
    '1_hora': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 0,
      convites_semana: 2,
      conversas_dia: 1,
    },
    '1_a_2_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 0,
      convites_semana: 3,
      conversas_dia: 1,
    },
    '2_a_4_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 0,
      convites_semana: 5,
      conversas_dia: 2,
    },
    'mais_4_horas': {
      bebidas_dia: 0,
      kits_semana: 0,
      produtos_fechados_semana: 0,
      convites_semana: 8,
      conversas_dia: 3,
    },
  },
} as const

/**
 * Matriz de metas por meta de ganho mensal (referência)
 */
const MATRIZ_METAS_POR_GANHO: Record<number, {
  bebidas_dia: number
  kits_sem: number
  produtos_sem: number
  convites_sem: number
}> = {
  500: { bebidas_dia: 2, kits_sem: 1, produtos_sem: 0, convites_sem: 1 },
  1000: { bebidas_dia: 3, kits_sem: 2, produtos_sem: 1, convites_sem: 2 },
  2000: { bebidas_dia: 4, kits_sem: 3, produtos_sem: 1, convites_sem: 3 },
  3000: { bebidas_dia: 6, kits_sem: 4, produtos_sem: 2, convites_sem: 5 },
  5000: { bebidas_dia: 8, kits_sem: 5, produtos_sem: 3, convites_sem: 8 },
  7000: { bebidas_dia: 10, kits_sem: 6, produtos_sem: 4, convites_sem: 10 },
} as const

/**
 * Calcula metas automáticas baseado no perfil estratégico
 */
export function calcularMetasAutomaticas(
  profile: Partial<WellnessConsultantProfile>
): MetasCalculadas {
  const tipoTrabalho = profile.tipo_trabalho || 'bebidas_funcionais'
  const cargaHoraria = profile.carga_horaria_diaria || '1_a_2_horas'
  const focoTrabalho = profile.foco_trabalho || 'renda_extra'
  const ganhosPrioritarios = profile.ganhos_prioritarios || 'vendas'
  const nivelHerbalife = profile.nivel_herbalife || 'novo_distribuidor'
  const diasPorSemana = profile.dias_por_semana || '3_a_4_dias'
  const metaFinanceira = profile.meta_financeira || 1000

  // 1. Pegar base da matriz por tipo de trabalho
  const matrizBase = MATRIZ_METAS_POR_TRABALHO[tipoTrabalho]?.[cargaHoraria] || 
                     MATRIZ_METAS_POR_TRABALHO.bebidas_funcionais['1_a_2_horas']

  // 2. Ajustar por foco de trabalho
  let multiplicadorFoco = 1
  if (focoTrabalho === 'plano_carreira') {
    multiplicadorFoco = 1.5 // Aumenta metas em 50%
  } else if (focoTrabalho === 'ambos') {
    multiplicadorFoco = 1.25 // Aumenta em 25%
  }

  // 3. Ajustar por ganhos prioritários
  let ajusteGanhos = {
    bebidas_dia: 1,
    kits_semana: 1,
    produtos_fechados_semana: 1,
    convites_semana: 1,
  }

  if (ganhosPrioritarios === 'vendas') {
    ajusteGanhos.convites_semana = 0.5 // Reduz convites
    ajusteGanhos.bebidas_dia = 1.3 // Aumenta vendas
    ajusteGanhos.kits_semana = 1.3
  } else if (ganhosPrioritarios === 'equipe') {
    ajusteGanhos.bebidas_dia = 0.7 // Reduz vendas
    ajusteGanhos.kits_semana = 0.7
    ajusteGanhos.convites_semana = 1.5 // Aumenta convites
  } else if (ganhosPrioritarios === 'ambos') {
    // Mantém equilibrado
  }

  // 4. Ajustar por dias por semana
  let multiplicadorDias = 1
  if (diasPorSemana === '1_a_2_dias') {
    multiplicadorDias = 0.7
  } else if (diasPorSemana === '5_a_6_dias') {
    multiplicadorDias = 1.3
  } else if (diasPorSemana === 'todos_os_dias') {
    multiplicadorDias = 1.5
  }

  // 5. Calcular metas base
  let bebidasDia = Math.round((matrizBase.bebidas_dia || 0) * multiplicadorFoco * ajusteGanhos.bebidas_dia * multiplicadorDias)
  let kitsSemana = Math.round((matrizBase.kits_semana || 0) * multiplicadorFoco * ajusteGanhos.kits_semana * multiplicadorDias)
  let produtosFechadosSemana = Math.round((matrizBase.produtos_fechados_semana || 0) * multiplicadorFoco * ajusteGanhos.produtos_fechados_semana * multiplicadorDias)
  let convitesSemana = Math.round((matrizBase.convites_semana || 0) * multiplicadorFoco * ajusteGanhos.convites_semana * multiplicadorDias)

  // 6. Ajustar por meta financeira (se disponível)
  const metaFinanceiraArredondada = Math.round(metaFinanceira / 500) * 500 // Arredondar para múltiplos de 500
  const referenciaGanho = MATRIZ_METAS_POR_GANHO[metaFinanceiraArredondada] || MATRIZ_METAS_POR_GANHO[1000]

  // Se a meta financeira sugerir metas maiores, usar a maior
  if (referenciaGanho.bebidas_dia > bebidasDia) {
    bebidasDia = referenciaGanho.bebidas_dia
  }
  if (referenciaGanho.kits_sem > kitsSemana) {
    kitsSemana = referenciaGanho.kits_sem
  }
  if (referenciaGanho.convites_sem > convitesSemana) {
    convitesSemana = referenciaGanho.convites_sem
  }

  // 7. Calcular equivalentes mensais da meta financeira
  // Assumindo valores médios:
  // - Bebida: R$ 15-20 (margem ~R$ 5-8)
  // - Kit: R$ 200-300 (margem ~R$ 50-100)
  // - Produto fechado: R$ 150-300 (margem ~R$ 40-80)
  // - Convite convertido: R$ 200-500/mês (royalties)
  
  const equivalenteBebidasMes = Math.ceil(metaFinanceira / 6) // ~R$ 6 de margem por bebida
  const equivalenteKitsMes = Math.ceil(metaFinanceira / 75) // ~R$ 75 de margem por kit
  const equivalenteProdutosMes = Math.ceil(metaFinanceira / 60) // ~R$ 60 de margem por produto
  const equivalenteConvitesMes = Math.ceil(metaFinanceira / 300) // ~R$ 300/mês por convite convertido

  // 8. Calcular apresentações e acompanhamentos
  const apresentacoesSemana = ganhosPrioritarios === 'equipe' || ganhosPrioritarios === 'ambos' 
    ? Math.max(1, Math.round(convitesSemana * 0.3)) // 30% dos convites viram apresentações
    : 0

  const acompanhamentosSemana = Math.max(2, Math.round((bebidasDia * 7 + kitsSemana) * 0.2)) // 20% dos contatos precisam acompanhamento

  // 9. Identificar tipo de plano
  const plano = identificarTipoPlano({
    focoTrabalho,
    ganhosPrioritarios,
    nivelHerbalife,
    cargaHoraria,
    diasPorSemana,
  })

  return {
    bebidas_dia: bebidasDia,
    kits_semana: kitsSemana,
    produtos_fechados_semana: produtosFechadosSemana,
    convites_semana: convitesSemana,
    apresentacoes_semana: apresentacoesSemana,
    followups_dia: matrizBase.followups_dia || 0,
    acompanhamentos_semana: acompanhamentosSemana,
    meta_financeira_mensal: metaFinanceira,
    equivalente_bebidas_mes: equivalenteBebidasMes,
    equivalente_kits_mes: equivalenteKitsMes,
    equivalente_produtos_mes: equivalenteProdutosMes,
    equivalente_convites_mes: equivalenteConvitesMes,
    plano_tipo: plano.tipo,
    plano_nome: plano.nome,
  }
}

/**
 * Identifica o tipo de plano baseado no perfil
 */
function identificarTipoPlano(profile: {
  focoTrabalho: string
  ganhosPrioritarios: string
  nivelHerbalife: string
  cargaHoraria: string
  diasPorSemana: string
}): { tipo: MetasCalculadas['plano_tipo'], nome: string } {
  const { focoTrabalho, ganhosPrioritarios, nivelHerbalife, cargaHoraria, diasPorSemana } = profile

  // PLANO PRESIDENTE
  if (
    focoTrabalho === 'plano_carreira' &&
    (nivelHerbalife === 'equipe_expansao_global' || nivelHerbalife === 'equipe_milionarios' || nivelHerbalife === 'equipe_presidentes') &&
    (cargaHoraria === 'mais_4_horas' || diasPorSemana === 'todos_os_dias')
  ) {
    return { tipo: 'presidente', nome: 'Plano Presidente' }
  }

  // PLANO DE DUPLICAÇÃO
  if (
    ganhosPrioritarios === 'equipe' &&
    focoTrabalho === 'plano_carreira' &&
    (diasPorSemana === '5_a_6_dias' || diasPorSemana === 'todos_os_dias')
  ) {
    return { tipo: 'duplicacao', nome: 'Plano de Duplicação' }
  }

  // PLANO HÍBRIDO
  if (
    ganhosPrioritarios === 'ambos' &&
    focoTrabalho === 'ambos'
  ) {
    return { tipo: 'hibrido', nome: 'Plano Híbrido (Vendas + Equipe)' }
  }

  // PLANO DE VENDAS RÁPIDAS (padrão)
  return { tipo: 'vendas_rapidas', nome: 'Plano de Vendas Rápidas' }
}

/**
 * Formata metas para exibição no NOEL
 */
export function formatarMetasParaNoel(metas: MetasCalculadas): string {
  let texto = `\n📊 SUAS METAS AUTOMÁTICAS:\n\n`
  
  if (metas.bebidas_dia > 0) {
    texto += `🥤 Bebidas por dia: ${metas.bebidas_dia}\n`
  }
  if (metas.kits_semana > 0) {
    texto += `📦 Kits por semana: ${metas.kits_semana}\n`
  }
  if (metas.produtos_fechados_semana > 0) {
    texto += `📦 Produtos fechados por semana: ${metas.produtos_fechados_semana}\n`
  }
  if (metas.convites_semana > 0) {
    texto += `👥 Convites por semana: ${metas.convites_semana}\n`
  }
  if (metas.apresentacoes_semana > 0) {
    texto += `🎯 Apresentações por semana: ${metas.apresentacoes_semana}\n`
  }
  if (metas.followups_dia > 0) {
    texto += `📞 Follow-ups por dia: ${metas.followups_dia}\n`
  }
  if (metas.acompanhamentos_semana > 0) {
    texto += `💬 Acompanhamentos por semana: ${metas.acompanhamentos_semana}\n`
  }

  texto += `\n💰 Meta financeira: R$ ${metas.meta_financeira_mensal.toLocaleString('pt-BR')}/mês\n`
  texto += `📋 Plano: ${metas.plano_nome}\n`

  return texto
}
