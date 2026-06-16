/**
 * NOEL Personalization Engine
 * 
 * Este módulo contém funções para personalizar o comportamento do NOEL
 * baseado no perfil completo do consultor.
 */

import type { WellnessConsultantProfile } from '@/types/wellness-system'

// =====================================================
// TIPOS
// =====================================================

export interface RotinaDiaria {
  tempo_total: number // minutos
  acoes: Array<{
    tipo: 'conexao' | 'followup' | 'venda' | 'recrutamento' | 'estudo'
    descricao: string
    tempo_estimado: number
    prioridade: 'alta' | 'media' | 'baixa'
  }>
}

export interface PlanoPersonalizado {
  dias: number // 7, 14 ou 30
  objetivo: string
  acoes_diarias: RotinaDiaria[]
  metas_intermediarias: Array<{
    dia: number
    meta: string
    pv_necessario?: number
  }>
}

export interface SugestaoKit {
  kit_id: string
  kit_nome: string
  motivo: string
  pv_estimado: number
  prioridade: 'alta' | 'media' | 'baixa'
}

export interface CaminhoMeta {
  meta_pv: number
  meta_financeira: number
  clientes_necessarios: number
  pv_medio_por_cliente: number
  tempo_estimado_meses: number
  acoes_sugeridas: string[]
}

export type FluxoRecomendado = 'funcional' | 'fechado' | 'hibrido'

// =====================================================
// FUNÇÕES DE PERSONALIZAÇÃO
// =====================================================

/**
 * Determina a rotina diária baseada no tempo disponível
 */
export function determinarRotinaDiaria(
  profile: Partial<WellnessConsultantProfile>
): RotinaDiaria {
  const tempoDisponivel = profile.tempo_disponivel || '30min'
  
  // Converter tempo para minutos
  const tempoMinutos: Record<string, number> = {
    '5min': 5,
    '15min': 15,
    '30min': 30,
    '1h': 60,
    '1h_plus': 90,
    // Compatibilidade
    '15_minutos': 15,
    '30_minutos': 30,
    '1_hora': 60,
    'mais_1_hora': 90,
  }
  
  const tempoTotal = tempoMinutos[tempoDisponivel] || 30
  
  const acoes: RotinaDiaria['acoes'] = []
  
  // Ações baseadas no tempo disponível
  if (tempoTotal >= 5) {
    acoes.push({
      tipo: 'conexao',
      descricao: 'Enviar 1-2 mensagens de conexão',
      tempo_estimado: 5,
      prioridade: 'alta'
    })
  }
  
  if (tempoTotal >= 15) {
    acoes.push({
      tipo: 'followup',
      descricao: 'Fazer 1-2 follow-ups',
      tempo_estimado: 10,
      prioridade: 'alta'
    })
  }
  
  if (tempoTotal >= 30) {
    acoes.push({
      tipo: 'venda',
      descricao: 'Oferecer produto a 1 cliente',
      tempo_estimado: 15,
      prioridade: 'media'
    })
  }
  
  if (tempoTotal >= 60) {
    acoes.push({
      tipo: 'recrutamento',
      descricao: 'Conversar com 1 prospect',
      tempo_estimado: 20,
      prioridade: 'baixa'
    })
    acoes.push({
      tipo: 'estudo',
      descricao: 'Estudar scripts e estratégias',
      tempo_estimado: 20,
      prioridade: 'baixa'
    })
  }
  
  return {
    tempo_total: tempoTotal,
    acoes
  }
}

/**
 * Ajusta scripts ao tom e ritmo do consultor
 */
export function ajustarScriptParaPerfil(
  scriptOriginal: string,
  profile: Partial<WellnessConsultantProfile>
): string {
  let script = scriptOriginal
  
  // Ajustar tom
  if (profile.tom === 'extrovertido') {
    // Adicionar emojis e energia
    script = script.replace(/\./g, '! 😊')
  } else if (profile.tom === 'tecnico') {
    // Remover emojis e adicionar termos técnicos
    script = script.replace(/[😊😄💚💰👥📅🔄📚]/g, '')
  } else if (profile.tom === 'simples') {
    // Simplificar linguagem
    script = script.replace(/precisamente|exatamente|certamente/gi, '')
  }
  
  // Ajustar ritmo
  if (profile.ritmo === 'lento') {
    // Adicionar pausas e explicações
    script = script.replace(/\n/g, '\n\n')
  } else if (profile.ritmo === 'rapido') {
    // Remover explicações extras
    script = script.replace(/\n\n+/g, '\n')
  }
  
  return script
}

/**
 * Calcula caminho para meta de PV e financeira
 */
export function calcularCaminhoParaMeta(
  profile: Partial<WellnessConsultantProfile>,
  pv_atual?: number
): CaminhoMeta {
  const metaPV = profile.meta_pv || 500
  const metaFinanceira = profile.meta_financeira || 2000
  const pvAtual = pv_atual || 0
  
  // PV médio por cliente (estimativa)
  const pvMedioPorCliente = profile.trabalha_com === 'fechado' ? 75 : 
                           profile.trabalha_com === 'funcional' ? 50 : 60
  
  // Clientes necessários
  const pvNecessario = metaPV - pvAtual
  const clientesNecessarios = Math.ceil(pvNecessario / pvMedioPorCliente)
  
  // Tempo estimado (baseado em 2-3 clientes novos por mês)
  const tempoEstimadoMeses = Math.ceil(clientesNecessarios / 2.5)
  
  // Ações sugeridas
  const acoesSugeridas: string[] = []
  
  if (pvNecessario > 0) {
    acoesSugeridas.push(`Focar em ${clientesNecessarios} clientes novos`)
    acoesSugeridas.push(`Manter ${Math.ceil(metaPV / pvMedioPorCliente)} clientes ativos`)
    
    if (profile.abertura_recrutar === 'sim') {
      acoesSugeridas.push('Recrutar 1-2 distribuidores para acelerar')
    }
    
    if (profile.trabalha_com === 'ambos') {
      acoesSugeridas.push('Balancear vendas de funcional e fechado')
    }
  }
  
  return {
    meta_pv: metaPV,
    meta_financeira: metaFinanceira,
    clientes_necessarios: clientesNecessarios,
    pv_medio_por_cliente: pvMedioPorCliente,
    tempo_estimado_meses: tempoEstimadoMeses,
    acoes_sugeridas: acoesSugeridas
  }
}

/**
 * Sugere kits conforme objetivo e perfil
 */
export function sugerirKits(
  profile: Partial<WellnessConsultantProfile>
): SugestaoKit[] {
  const sugestoes: SugestaoKit[] = []
  
  // Baseado no objetivo
  if (profile.objetivo_principal === 'usar_recomendar' || 
      profile.objetivo_principal === 'funcional') {
    sugestoes.push({
      kit_id: 'kit-energia-5dias',
      kit_nome: 'Kit Energia 5 Dias',
      motivo: 'Ideal para começar leve e testar',
      pv_estimado: 45,
      prioridade: 'alta'
    })
  }
  
  if (profile.objetivo_principal === 'renda_extra' || 
      profile.objetivo_principal === 'carteira') {
    sugestoes.push({
      kit_id: 'kit-turbo-7dias',
      kit_nome: 'Kit Turbo 7 Dias',
      motivo: 'Maior ticket e resultado mais rápido',
      pv_estimado: 75,
      prioridade: 'alta'
    })
  }
  
  if (profile.objetivo_principal === 'fechado') {
    sugestoes.push({
      kit_id: 'shake-fiber',
      kit_nome: 'Shake + Fiber',
      motivo: 'Produtos fechados com maior margem',
      pv_estimado: 100,
      prioridade: 'alta'
    })
  }
  
  // Baseado no público preferido
  if (profile.publico_preferido?.includes('fitness')) {
    sugestoes.push({
      kit_id: 'kit-treino',
      kit_nome: 'Kit Treino',
      motivo: 'Alinhado com seu público fitness',
      pv_estimado: 80,
      prioridade: 'media'
    })
  }
  
  if (profile.publico_preferido?.includes('maes')) {
    sugestoes.push({
      kit_id: 'kit-energia-leve',
      kit_nome: 'Kit Energia Leve',
      motivo: 'Perfeito para mães com rotina corrida',
      pv_estimado: 50,
      prioridade: 'media'
    })
  }
  
  return sugestoes
}

/**
 * Identifica momento ideal de upsell
 */
export function identificarMomentoUpsell(
  cliente: {
    dias_ativo: number
    pv_total: number
    ultima_compra_dias: number
  },
  profile: Partial<WellnessConsultantProfile>
): {
  momento_ideal: boolean
  motivo: string
  produto_sugerido?: string
} {
  // Cliente novo (primeiros 7 dias) - oferecer upgrade
  if (cliente.dias_ativo <= 7 && cliente.pv_total < 50) {
    return {
      momento_ideal: true,
      motivo: 'Cliente novo pode se beneficiar de upgrade',
      produto_sugerido: profile.trabalha_com === 'funcional' ? 'Kit Turbo' : 'Shake + Fiber'
    }
  }
  
  // Cliente recorrente (14-30 dias) - oferecer rotina mensal
  if (cliente.dias_ativo >= 14 && cliente.dias_ativo <= 30 && cliente.ultima_compra_dias <= 7) {
    return {
      momento_ideal: true,
      motivo: 'Cliente ativo pode se beneficiar de rotina mensal',
      produto_sugerido: 'Rotina 50-75 PV'
    }
  }
  
  // Cliente que parou - reativação
  if (cliente.ultima_compra_dias > 30) {
    return {
      momento_ideal: true,
      motivo: 'Cliente inativo há mais de 30 dias - momento de reativar',
      produto_sugerido: 'Kit Leve para Recomeçar'
    }
  }
  
  return {
    momento_ideal: false,
    motivo: 'Aguardar mais tempo antes de oferecer upgrade'
  }
}

/**
 * Seleciona o melhor fluxo (funcional/fechado/híbrido)
 */
export function selecionarFluxo(
  profile: Partial<WellnessConsultantProfile>
): FluxoRecomendado {
  // Se já definiu trabalha_com, usar isso
  if (profile.trabalha_com === 'funcional') return 'funcional'
  if (profile.trabalha_com === 'fechado') return 'fechado'
  if (profile.trabalha_com === 'ambos') return 'hibrido'
  
  // Baseado no objetivo
  if (profile.objetivo_principal === 'funcional') return 'funcional'
  if (profile.objetivo_principal === 'fechado') return 'fechado'
  
  // Baseado em prepara_bebidas
  if (profile.prepara_bebidas === 'sim' || profile.prepara_bebidas === 'aprender') {
    return 'funcional'
  }
  
  if (profile.prepara_bebidas === 'nao' || profile.prepara_bebidas === 'nunca') {
    return 'fechado'
  }
  
  // Padrão: híbrido
  return 'hibrido'
}

/**
 * Gera plano personalizado (7/14/30 dias)
 */
export function gerarPlanoPersonalizado(
  profile: Partial<WellnessConsultantProfile>,
  dias: 7 | 14 | 30 = 30
): PlanoPersonalizado {
  const rotinaDiaria = determinarRotinaDiaria(profile)
  const caminhoMeta = calcularCaminhoParaMeta(profile)
  const fluxo = selecionarFluxo(profile)
  
  const acoesDiarias: RotinaDiaria[] = []
  const metasIntermediarias: PlanoPersonalizado['metas_intermediarias'] = []
  
  // Gerar rotinas para cada dia
  for (let dia = 1; dia <= dias; dia++) {
    acoesDiarias.push(rotinaDiaria)
    
    // Metas intermediárias
    if (dia === 7) {
      metasIntermediarias.push({
        dia: 7,
        meta: 'Primeira semana: estabelecer rotina',
        pv_necessario: Math.ceil(caminhoMeta.meta_pv * 0.1)
      })
    }
    if (dia === 14) {
      metasIntermediarias.push({
        dia: 14,
        meta: 'Segunda semana: acelerar vendas',
        pv_necessario: Math.ceil(caminhoMeta.meta_pv * 0.3)
      })
    }
    if (dia === 30) {
      metasIntermediarias.push({
        dia: 30,
        meta: 'Primeiro mês: alcançar meta inicial',
        pv_necessario: caminhoMeta.meta_pv
      })
    }
  }
  
  return {
    dias,
    objetivo: `Plano ${dias} dias - ${fluxo}`,
    acoes_diarias: acoesDiarias,
    metas_intermediarias
  }
}

/**
 * Treina consultor dentro do Plano Presidente automaticamente
 */
export function treinarPlanoPresidente(
  profile: Partial<WellnessConsultantProfile>,
  pv_atual: number
): {
  nivel_atual: string
  proximo_nivel: string
  requisitos_proximo: string[]
  acoes_sugeridas: string[]
} {
  // Determinar nível atual
  let nivelAtual = 'Consultor'
  let proximoNivel = 'Supervisor'
  let requisitos: string[] = []
  let acoes: string[] = []
  
  if (pv_atual >= 2500) {
    nivelAtual = 'Ativo 2500PV'
    proximoNivel = 'GET'
    requisitos = ['Manter 2500PV por 3 meses', 'Ter equipe ativa']
    acoes = ['Focar em recrutamento', 'Desenvolver líderes na equipe']
  } else if (pv_atual >= 1000) {
    nivelAtual = 'Supervisor'
    proximoNivel = 'Ativo 2500PV'
    requisitos = ['Alcançar 2500PV', 'Manter consistência']
    acoes = ['Aumentar carteira de clientes', 'Focar em produtos fechados']
  } else if (pv_atual >= 500) {
    nivelAtual = 'Consultor Avançado'
    proximoNivel = 'Supervisor'
    requisitos = ['Alcançar 1000PV', 'Recrutar primeiro distribuidor']
    acoes = ['Expandir vendas', 'Começar a recrutar']
  } else {
    nivelAtual = 'Consultor'
    proximoNivel = 'Consultor Avançado'
    requisitos = ['Alcançar 500PV', 'Estabelecer rotina']
    acoes = ['Focar em vendas consistentes', 'Construir carteira']
  }
  
  return {
    nivel_atual: nivelAtual,
    proximo_nivel: proximoNivel,
    requisitos_proximo: requisitos,
    acoes_sugeridas: acoes
  }
}





