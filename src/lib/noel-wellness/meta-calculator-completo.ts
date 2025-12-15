/**
 * NOEL WELLNESS - Calculadora Completa de Metas
 * 
 * Calcula objetivos precisos de vendas, recrutamento e produção da equipe
 * usando valores reais dos produtos do banco de dados
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { WellnessConsultantProfile } from '@/types/wellness-system'

export interface ObjetivosVendas {
  // Bebidas funcionais
  energia_unitario: number
  energia_kit5: number
  acelera_unitario: number
  acelera_kit5: number
  litrao_detox_unitario: number
  litrao_detox_kit5: number
  turbo_detox_unitario: number
  turbo_detox_kit5: number
  hype_drink_unitario: number
  hype_drink_kit5: number
  
  // Produtos fechados (exemplos principais)
  shake_550g: number
  shake_1976g: number
  nrg_100g: number
  herbal_102g: number
  fiber_450ml: number
  cr7_drive: number
}

export interface ObjetivosEquipe {
  // Recrutamento
  convites_necessarios: number
  apresentacoes_necessarias: number
  novos_consultores_necessarios: number
  
  // Produção da equipe
  pv_equipe_necessario: number
  pv_por_consultor_medio: number
  consultores_ativos_necessarios: number
  
  // Royalties estimados
  royalties_estimados_mes: number
}

export interface CalculoMetaCompleto {
  // Metas do usuário
  meta_pv: number
  meta_financeira: number
  pv_atual: number
  pv_necessario: number
  
  // Objetivos de vendas (quantidade de cada produto)
  objetivos_vendas: ObjetivosVendas
  
  // Objetivos de equipe
  objetivos_equipe: ObjetivosEquipe
  
  // Cenários de combinação
  cenarios: {
    apenas_vendas: {
      descricao: string
      produtos_necessarios: Record<string, number>
      pv_total: number
      lucro_estimado: number
    }
    vendas_equipe_50_50: {
      descricao: string
      produtos_necessarios: Record<string, number>
      pv_pessoal: number
      pv_equipe: number
      consultores_necessarios: number
      lucro_estimado: number
    }
    foco_equipe: {
      descricao: string
      consultores_necessarios: number
      pv_equipe_necessario: number
      royalties_estimados: number
    }
  }
  
  // Resumo executivo
  resumo: {
    caminho_mais_rapido: string
    acoes_prioritarias: string[]
    tempo_estimado_meses: number
  }
}

/**
 * Busca produtos do banco de dados
 */
async function buscarProdutos() {
  const { data, error } = await supabaseAdmin
    .from('wellness_produtos')
    .select('id, nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, custo_supervisor, lucro')
    .eq('ativo', true)
  
  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
  
  return data || []
}

/**
 * Calcula margem de lucro de um produto
 */
function calcularMargem(preco: number, custo: number | null, lucro: number | null): number {
  // Se tem lucro direto, usar ele
  if (lucro && lucro > 0) {
    return lucro
  }
  
  // Se tem custo do supervisor, calcular lucro
  if (custo && custo > 0) {
    return preco - custo
  }
  
  // Se não tem custo, estimar margem baseada no tipo
  // Margem média estimada: 50-70% para bebidas, 40-60% para produtos fechados
  return preco * 0.5 // 50% de margem padrão
}

/**
 * Calcula objetivos de vendas para bater meta financeira
 */
function calcularObjetivosVendasFinanceira(
  produtos: any[],
  metaFinanceira: number
): ObjetivosVendas {
  const objetivos: Partial<ObjetivosVendas> = {}
  
  // Buscar produtos específicos
  const energiaUnitario = produtos.find(p => p.nome === 'Energia - Unitário')
  const energiaKit5 = produtos.find(p => p.nome === 'Energia - Kit 5 dias')
  const aceleraUnitario = produtos.find(p => p.nome === 'Acelera - Unitário')
  const aceleraKit5 = produtos.find(p => p.nome === 'Acelera - Kit 5 dias')
  const litraoUnitario = produtos.find(p => p.nome === 'Litrão Detox - Unitário')
  const litraoKit5 = produtos.find(p => p.nome === 'Litrão Detox - Kit 5 dias')
  const turboUnitario = produtos.find(p => p.nome === 'Turbo Detox - Unitário')
  const turboKit5 = produtos.find(p => p.nome === 'Turbo Detox - Kit 5 dias')
  const hypeUnitario = produtos.find(p => p.nome === 'Hype Drink - Unitário')
  const hypeKit5 = produtos.find(p => p.nome === 'Hype Drink - Kit 5 dias')
  
  const shake550g = produtos.find(p => p.nome === 'Shake - 550g')
  const shake1976g = produtos.find(p => p.nome === 'Shake - 1976g')
  const nrg100g = produtos.find(p => p.nome === 'N-R-G - 100g')
  const herbal102g = produtos.find(p => p.nome === 'Herbal Concentrate - 102g')
  const fiber450ml = produtos.find(p => p.nome === 'Fiber Concentrate - 450ml')
  const cr7 = produtos.find(p => p.nome?.includes('CR7'))
  
  // Calcular quantidade necessária baseada na margem
  if (energiaUnitario) {
    const margem = calcularMargem(
      energiaUnitario.preco_unitario || energiaUnitario.preco, 
      energiaUnitario.custo_producao,
      energiaUnitario.lucro
    )
    objetivos.energia_unitario = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (energiaKit5) {
    const precoUnit = energiaKit5.preco / 5
    const margem = calcularMargem(precoUnit, energiaKit5.custo_producao, energiaKit5.lucro)
    objetivos.energia_kit5 = margem > 0 ? Math.ceil(metaFinanceira / (margem * 5)) : 0
  }
  
  if (aceleraUnitario) {
    const margem = calcularMargem(aceleraUnitario.preco_unitario || aceleraUnitario.preco, aceleraUnitario.custo_producao, aceleraUnitario.lucro)
    objetivos.acelera_unitario = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (aceleraKit5) {
    const precoUnit = aceleraKit5.preco / 5
    const margem = calcularMargem(precoUnit, aceleraKit5.custo_producao, aceleraKit5.lucro)
    objetivos.acelera_kit5 = margem > 0 ? Math.ceil(metaFinanceira / (margem * 5)) : 0
  }
  
  if (litraoUnitario) {
    const margem = calcularMargem(litraoUnitario.preco_unitario || litraoUnitario.preco, litraoUnitario.custo_producao, litraoUnitario.lucro)
    objetivos.litrao_detox_unitario = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (litraoKit5) {
    const precoUnit = litraoKit5.preco / 5
    const margem = calcularMargem(precoUnit, litraoKit5.custo_producao, litraoKit5.lucro)
    objetivos.litrao_detox_kit5 = margem > 0 ? Math.ceil(metaFinanceira / (margem * 5)) : 0
  }
  
  if (turboUnitario) {
    const margem = calcularMargem(turboUnitario.preco_unitario || turboUnitario.preco, turboUnitario.custo_producao, turboUnitario.lucro)
    objetivos.turbo_detox_unitario = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (turboKit5) {
    const precoUnit = turboKit5.preco / 5
    const margem = calcularMargem(precoUnit, turboKit5.custo_producao, turboKit5.lucro)
    objetivos.turbo_detox_kit5 = margem > 0 ? Math.ceil(metaFinanceira / (margem * 5)) : 0
  }
  
  if (hypeUnitario) {
    const margem = calcularMargem(hypeUnitario.preco_unitario || hypeUnitario.preco, hypeUnitario.custo_producao, hypeUnitario.lucro)
    objetivos.hype_drink_unitario = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (hypeKit5) {
    const precoUnit = hypeKit5.preco / 5
    const margem = calcularMargem(precoUnit, hypeKit5.custo_producao, hypeKit5.lucro)
    objetivos.hype_drink_kit5 = margem > 0 ? Math.ceil(metaFinanceira / (margem * 5)) : 0
  }
  
  // Produtos fechados - usar lucro direto se disponível, senão calcular
  if (shake550g) {
    const margem = calcularMargem(shake550g.preco, shake550g.custo_supervisor, shake550g.lucro)
    objetivos.shake_550g = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (shake1976g) {
    const margem = calcularMargem(shake1976g.preco, shake1976g.custo_supervisor, shake1976g.lucro)
    objetivos.shake_1976g = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (nrg100g) {
    const margem = calcularMargem(nrg100g.preco, nrg100g.custo_supervisor, nrg100g.lucro)
    objetivos.nrg_100g = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (herbal102g) {
    const margem = calcularMargem(herbal102g.preco, herbal102g.custo_supervisor, herbal102g.lucro)
    objetivos.herbal_102g = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (fiber450ml) {
    const margem = calcularMargem(fiber450ml.preco, fiber450ml.custo_supervisor, fiber450ml.lucro)
    objetivos.fiber_450ml = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  if (cr7) {
    const margem = calcularMargem(cr7.preco, cr7.custo_supervisor, cr7.lucro)
    objetivos.cr7_drive = margem > 0 ? Math.ceil(metaFinanceira / margem) : 0
  }
  
  return objetivos as ObjetivosVendas
}

/**
 * Calcula objetivos de vendas para bater meta de PV
 */
function calcularObjetivosVendasPV(
  produtos: any[],
  pvNecessario: number
): ObjetivosVendas {
  const objetivos: Partial<ObjetivosVendas> = {}
  
  // Buscar produtos específicos
  const energiaUnitario = produtos.find(p => p.nome === 'Energia - Unitário')
  const energiaKit5 = produtos.find(p => p.nome === 'Energia - Kit 5 dias')
  const aceleraUnitario = produtos.find(p => p.nome === 'Acelera - Unitário')
  const aceleraKit5 = produtos.find(p => p.nome === 'Acelera - Kit 5 dias')
  const litraoUnitario = produtos.find(p => p.nome === 'Litrão Detox - Unitário')
  const litraoKit5 = produtos.find(p => p.nome === 'Litrão Detox - Kit 5 dias')
  const turboUnitario = produtos.find(p => p.nome === 'Turbo Detox - Unitário')
  const turboKit5 = produtos.find(p => p.nome === 'Turbo Detox - Kit 5 dias')
  const hypeUnitario = produtos.find(p => p.nome === 'Hype Drink - Unitário')
  const hypeKit5 = produtos.find(p => p.nome === 'Hype Drink - Kit 5 dias')
  
  const shake550g = produtos.find(p => p.nome === 'Shake - 550g')
  const shake1976g = produtos.find(p => p.nome === 'Shake - 1976g')
  const nrg100g = produtos.find(p => p.nome === 'N-R-G - 100g')
  const herbal102g = produtos.find(p => p.nome === 'Herbal Concentrate - 102g')
  const fiber450ml = produtos.find(p => p.nome === 'Fiber Concentrate - 450ml')
  const cr7 = produtos.find(p => p.nome?.includes('CR7'))
  
  // Calcular quantidade necessária baseada no PV
  if (energiaUnitario && energiaUnitario.pv > 0) {
    objetivos.energia_unitario = Math.ceil(pvNecessario / energiaUnitario.pv)
  }
  
  if (energiaKit5 && energiaKit5.pv > 0) {
    objetivos.energia_kit5 = Math.ceil(pvNecessario / energiaKit5.pv)
  }
  
  if (aceleraUnitario && aceleraUnitario.pv > 0) {
    objetivos.acelera_unitario = Math.ceil(pvNecessario / aceleraUnitario.pv)
  }
  
  if (aceleraKit5 && aceleraKit5.pv > 0) {
    objetivos.acelera_kit5 = Math.ceil(pvNecessario / aceleraKit5.pv)
  }
  
  if (litraoUnitario && litraoUnitario.pv > 0) {
    objetivos.litrao_detox_unitario = Math.ceil(pvNecessario / litraoUnitario.pv)
  }
  
  if (litraoKit5 && litraoKit5.pv > 0) {
    objetivos.litrao_detox_kit5 = Math.ceil(pvNecessario / litraoKit5.pv)
  }
  
  if (turboUnitario && turboUnitario.pv > 0) {
    objetivos.turbo_detox_unitario = Math.ceil(pvNecessario / turboUnitario.pv)
  }
  
  if (turboKit5 && turboKit5.pv > 0) {
    objetivos.turbo_detox_kit5 = Math.ceil(pvNecessario / turboKit5.pv)
  }
  
  if (hypeUnitario && hypeUnitario.pv > 0) {
    objetivos.hype_drink_unitario = Math.ceil(pvNecessario / hypeUnitario.pv)
  }
  
  if (hypeKit5 && hypeKit5.pv > 0) {
    objetivos.hype_drink_kit5 = Math.ceil(pvNecessario / hypeKit5.pv)
  }
  
  // Produtos fechados
  if (shake550g && shake550g.pv > 0) {
    objetivos.shake_550g = Math.ceil(pvNecessario / shake550g.pv)
  }
  
  if (shake1976g && shake1976g.pv > 0) {
    objetivos.shake_1976g = Math.ceil(pvNecessario / shake1976g.pv)
  }
  
  if (nrg100g && nrg100g.pv > 0) {
    objetivos.nrg_100g = Math.ceil(pvNecessario / nrg100g.pv)
  }
  
  if (herbal102g && herbal102g.pv > 0) {
    objetivos.herbal_102g = Math.ceil(pvNecessario / herbal102g.pv)
  }
  
  if (fiber450ml && fiber450ml.pv > 0) {
    objetivos.fiber_450ml = Math.ceil(pvNecessario / fiber450ml.pv)
  }
  
  if (cr7 && cr7.pv > 0) {
    objetivos.cr7_drive = Math.ceil(pvNecessario / cr7.pv)
  }
  
  return objetivos as ObjetivosVendas
}

/**
 * Calcula objetivos de equipe
 */
function calcularObjetivosEquipe(
  pvNecessario: number,
  metaFinanceira: number,
  profile: Partial<WellnessConsultantProfile>
): ObjetivosEquipe {
  // PV médio por consultor ativo (estimativa conservadora)
  const pvMedioPorConsultor = 500 // Consultor ativo faz ~500 PV/mês
  
  // PV necessário da equipe (se meta de PV for alta, parte vem da equipe)
  const pvPessoalEstimado = Math.min(pvNecessario, 1000) // Máximo 1000 PV pessoal
  const pvEquipeNecessario = Math.max(0, pvNecessario - pvPessoalEstimado)
  
  // Consultores necessários
  const consultoresNecessarios = Math.ceil(pvEquipeNecessario / pvMedioPorConsultor)
  
  // Taxa de conversão: 10 convites = 1 apresentação = 0.3 consultor
  const taxaConversao = 0.03 // 3% dos convites viram consultores
  const convitesNecessarios = Math.ceil(consultoresNecessarios / taxaConversao)
  const apresentacoesNecessarias = Math.ceil(convitesNecessarios * 0.1) // 10% dos convites viram apresentações
  
  // Royalties estimados (R$ 50-200 por consultor ativo, dependendo do PV)
  const royaltiesPorConsultor = 100 // R$ 100/mês por consultor ativo (média)
  const royaltiesEstimados = consultoresNecessarios * royaltiesPorConsultor
  
  return {
    convites_necessarios: convitesNecessarios,
    apresentacoes_necessarias: apresentacoesNecessarias,
    novos_consultores_necessarios: consultoresNecessarios,
    pv_equipe_necessario: pvEquipeNecessario,
    pv_por_consultor_medio: pvMedioPorConsultor,
    consultores_ativos_necessarios: consultoresNecessarios,
    royalties_estimados_mes: royaltiesEstimados
  }
}

/**
 * Calcula cenários de combinação
 */
function calcularCenarios(
  produtos: any[],
  metaPV: number,
  metaFinanceira: number,
  objetivosVendasPV: ObjetivosVendas,
  objetivosVendasFinanceira: ObjetivosVendas
) {
  // Cenário 1: Apenas vendas
  const produtosNecessariosVendas: Record<string, number> = {}
  
  // Usar mix: 50% Energia Kit 5, 30% Turbo Detox Kit 5, 20% produtos fechados
  if (objetivosVendasPV.energia_kit5 > 0) {
    produtosNecessariosVendas['Energia - Kit 5 dias'] = Math.ceil(objetivosVendasPV.energia_kit5 * 0.5)
  }
  if (objetivosVendasPV.turbo_detox_kit5 > 0) {
    produtosNecessariosVendas['Turbo Detox - Kit 5 dias'] = Math.ceil(objetivosVendasPV.turbo_detox_kit5 * 0.3)
  }
  if (objetivosVendasPV.shake_550g > 0) {
    produtosNecessariosVendas['Shake - 550g'] = Math.ceil(objetivosVendasPV.shake_550g * 0.2)
  }
  
  // Calcular PV e lucro do cenário
  const energiaKit5 = produtos.find(p => p.nome === 'Energia - Kit 5 dias')
  const turboKit5 = produtos.find(p => p.nome === 'Turbo Detox - Kit 5 dias')
  const shake550g = produtos.find(p => p.nome === 'Shake - 550g')
  
  let pvTotal = 0
  let lucroEstimado = 0
  
  if (energiaKit5 && produtosNecessariosVendas['Energia - Kit 5 dias']) {
    pvTotal += energiaKit5.pv * produtosNecessariosVendas['Energia - Kit 5 dias']
    const margem = calcularMargem(energiaKit5.preco / 5, energiaKit5.custo_producao, energiaKit5.lucro)
    lucroEstimado += margem * 5 * produtosNecessariosVendas['Energia - Kit 5 dias']
  }
  
  if (turboKit5 && produtosNecessariosVendas['Turbo Detox - Kit 5 dias']) {
    pvTotal += turboKit5.pv * produtosNecessariosVendas['Turbo Detox - Kit 5 dias']
    const margem = calcularMargem(turboKit5.preco / 5, turboKit5.custo_producao, turboKit5.lucro)
    lucroEstimado += margem * 5 * produtosNecessariosVendas['Turbo Detox - Kit 5 dias']
  }
  
  if (shake550g && produtosNecessariosVendas['Shake - 550g']) {
    pvTotal += shake550g.pv * produtosNecessariosVendas['Shake - 550g']
    const margem = calcularMargem(shake550g.preco, shake550g.custo_supervisor, shake550g.lucro)
    lucroEstimado += margem * produtosNecessariosVendas['Shake - 550g']
  }
  
  // Cenário 2: Vendas + Equipe 50/50
  const pvPessoal = metaPV * 0.5
  const pvEquipe = metaPV * 0.5
  const consultoresNecessarios = Math.ceil(pvEquipe / 500)
  
  // Cenário 3: Foco em equipe
  const consultoresFocoEquipe = Math.ceil(metaPV / 500)
  const royaltiesFocoEquipe = consultoresFocoEquipe * 100
  
  return {
    apenas_vendas: {
      descricao: 'Foco total em vendas pessoais',
      produtos_necessarios: produtosNecessariosVendas,
      pv_total: pvTotal,
      lucro_estimado: lucroEstimado
    },
    vendas_equipe_50_50: {
      descricao: '50% vendas pessoais + 50% produção da equipe',
      produtos_necessarios: {
        'Energia - Kit 5 dias': Math.ceil(objetivosVendasPV.energia_kit5 * 0.25),
        'Turbo Detox - Kit 5 dias': Math.ceil(objetivosVendasPV.turbo_detox_kit5 * 0.15)
      },
      pv_pessoal: pvPessoal,
      pv_equipe: pvEquipe,
      consultores_necessarios: consultoresNecessarios,
      lucro_estimado: lucroEstimado * 0.5 + (consultoresNecessarios * 100)
    },
    foco_equipe: {
      descricao: 'Foco em construção de equipe e royalties',
      consultores_necessarios: consultoresFocoEquipe,
      pv_equipe_necessario: metaPV,
      royalties_estimados: royaltiesFocoEquipe
    }
  }
}

/**
 * Função principal: Calcula objetivos completos para bater as metas
 */
export async function calcularObjetivosCompletos(
  profile: Partial<WellnessConsultantProfile>,
  pvAtual: number = 0
): Promise<CalculoMetaCompleto> {
  const metaPV = profile.meta_pv || 500
  const metaFinanceira = profile.meta_financeira || 2000
  const pvNecessario = Math.max(0, metaPV - pvAtual)
  
  // Buscar produtos do banco
  const produtos = await buscarProdutos()
  
  // Calcular objetivos de vendas (por meta financeira e por PV)
  const objetivosVendasFinanceira = calcularObjetivosVendasFinanceira(produtos, metaFinanceira)
  const objetivosVendasPV = calcularObjetivosVendasPV(produtos, pvNecessario)
  
  // Usar o maior entre os dois (o que exigir mais)
  const objetivosVendas: ObjetivosVendas = {
    energia_unitario: Math.max(objetivosVendasFinanceira.energia_unitario, objetivosVendasPV.energia_unitario),
    energia_kit5: Math.max(objetivosVendasFinanceira.energia_kit5, objetivosVendasPV.energia_kit5),
    acelera_unitario: Math.max(objetivosVendasFinanceira.acelera_unitario, objetivosVendasPV.acelera_unitario),
    acelera_kit5: Math.max(objetivosVendasFinanceira.acelera_kit5, objetivosVendasPV.acelera_kit5),
    litrao_detox_unitario: Math.max(objetivosVendasFinanceira.litrao_detox_unitario, objetivosVendasPV.litrao_detox_unitario),
    litrao_detox_kit5: Math.max(objetivosVendasFinanceira.litrao_detox_kit5, objetivosVendasPV.litrao_detox_kit5),
    turbo_detox_unitario: Math.max(objetivosVendasFinanceira.turbo_detox_unitario, objetivosVendasPV.turbo_detox_unitario),
    turbo_detox_kit5: Math.max(objetivosVendasFinanceira.turbo_detox_kit5, objetivosVendasPV.turbo_detox_kit5),
    hype_drink_unitario: Math.max(objetivosVendasFinanceira.hype_drink_unitario, objetivosVendasPV.hype_drink_unitario),
    hype_drink_kit5: Math.max(objetivosVendasFinanceira.hype_drink_kit5, objetivosVendasPV.hype_drink_kit5),
    shake_550g: Math.max(objetivosVendasFinanceira.shake_550g, objetivosVendasPV.shake_550g),
    shake_1976g: Math.max(objetivosVendasFinanceira.shake_1976g, objetivosVendasPV.shake_1976g),
    nrg_100g: Math.max(objetivosVendasFinanceira.nrg_100g, objetivosVendasPV.nrg_100g),
    herbal_102g: Math.max(objetivosVendasFinanceira.herbal_102g, objetivosVendasPV.herbal_102g),
    fiber_450ml: Math.max(objetivosVendasFinanceira.fiber_450ml, objetivosVendasPV.fiber_450ml),
    cr7_drive: Math.max(objetivosVendasFinanceira.cr7_drive, objetivosVendasPV.cr7_drive)
  }
  
  // Calcular objetivos de equipe
  const objetivosEquipe = calcularObjetivosEquipe(pvNecessario, metaFinanceira, profile)
  
  // Calcular cenários
  const cenarios = calcularCenarios(produtos, metaPV, metaFinanceira, objetivosVendasPV, objetivosVendasFinanceira)
  
  // Determinar caminho mais rápido
  let caminhoMaisRapido = 'vendas_pessoais'
  let tempoEstimado = 1
  
  if (objetivosEquipe.consultores_ativos_necessarios > 0 && profile.ganhos_prioritarios === 'equipe') {
    caminhoMaisRapido = 'construcao_equipe'
    tempoEstimado = 3 // 3 meses para construir equipe
  } else if (objetivosVendas.energia_kit5 > 20) {
    caminhoMaisRapido = 'vendas_intensivas'
    tempoEstimado = 2
  }
  
  // Ações prioritárias
  const acoesPrioritarias: string[] = []
  
  if (objetivosVendas.energia_kit5 > 0) {
    acoesPrioritarias.push(`Vender ${objetivosVendas.energia_kit5} kits de Energia (5 dias) por mês`)
  }
  
  if (objetivosVendas.turbo_detox_kit5 > 0) {
    acoesPrioritarias.push(`Vender ${objetivosVendas.turbo_detox_kit5} kits de Turbo Detox (5 dias) por mês`)
  }
  
  if (objetivosEquipe.convites_necessarios > 0) {
    acoesPrioritarias.push(`Fazer ${objetivosEquipe.convites_necessarios} convites por mês para recrutamento`)
  }
  
  if (objetivosEquipe.apresentacoes_necessarias > 0) {
    acoesPrioritarias.push(`Realizar ${objetivosEquipe.apresentacoes_necessarias} apresentações por mês`)
  }
  
  return {
    meta_pv: metaPV,
    meta_financeira: metaFinanceira,
    pv_atual: pvAtual,
    pv_necessario: pvNecessario,
    objetivos_vendas: objetivosVendas,
    objetivos_equipe: objetivosEquipe,
    cenarios,
    resumo: {
      caminho_mais_rapido: caminhoMaisRapido,
      acoes_prioritarias: acoesPrioritarias,
      tempo_estimado_meses: tempoEstimado
    }
  }
}

/**
 * Formata o cálculo completo para exibição no NOEL
 */
export function formatarCalculoParaNoel(calculo: CalculoMetaCompleto, tipoTrabalho?: string): string {
  let texto = `\n🎯 SEUS OBJETIVOS PARA BATER AS METAS:\n\n`
  
  texto += `📊 METAS:\n`
  texto += `• Meta de PV: ${calculo.meta_pv.toLocaleString('pt-BR')} PV\n`
  texto += `• Meta financeira: R$ ${calculo.meta_financeira.toLocaleString('pt-BR')}\n`
  texto += `• PV atual: ${calculo.pv_atual.toLocaleString('pt-BR')} PV\n`
  texto += `• PV necessário: ${calculo.pv_necessario.toLocaleString('pt-BR')} PV\n\n`
  
  // Ajustar objetivos de vendas baseado no tipo de trabalho
  texto += `🛒 OBJETIVOS DE VENDAS (quantidade mensal):\n`
  
  if (tipoTrabalho === 'bebidas_funcionais') {
    // Prioridade: Kits Energia e Acelera
    if (calculo.objetivos_vendas.energia_kit5 > 0) {
      texto += `• Energia - Kit 5 dias: ${calculo.objetivos_vendas.energia_kit5} kits (prioridade inicial)\n`
    }
    if (calculo.objetivos_vendas.acelera_kit5 > 0) {
      texto += `• Acelera - Kit 5 dias: ${calculo.objetivos_vendas.acelera_kit5} kits (prioridade inicial)\n`
    }
    // Depois: outras bebidas
    if (calculo.objetivos_vendas.turbo_detox_kit5 > 0) {
      texto += `• Turbo Detox - Kit 5 dias: ${calculo.objetivos_vendas.turbo_detox_kit5} kits (pincelar depois)\n`
    }
    if (calculo.objetivos_vendas.hype_drink_kit5 > 0) {
      texto += `• Hype Drink - Kit 5 dias: ${calculo.objetivos_vendas.hype_drink_kit5} kits (pincelar depois)\n`
    }
    if (calculo.objetivos_vendas.litrao_detox_kit5 > 0) {
      texto += `• Litrão Detox - Kit 5 dias: ${calculo.objetivos_vendas.litrao_detox_kit5} kits (pincelar depois)\n`
    }
  } else if (tipoTrabalho === 'produtos_fechados') {
    // Prioridade: produtos fechados
    if (calculo.objetivos_vendas.shake_550g > 0) {
      texto += `• Shake 550g: ${calculo.objetivos_vendas.shake_550g} unidades\n`
    }
    if (calculo.objetivos_vendas.nrg_100g > 0) {
      texto += `• N-R-G 100g: ${calculo.objetivos_vendas.nrg_100g} unidades\n`
    }
    if (calculo.objetivos_vendas.herbal_102g > 0) {
      texto += `• Herbal Concentrate 102g: ${calculo.objetivos_vendas.herbal_102g} unidades\n`
    }
    if (calculo.objetivos_vendas.fiber_450ml > 0) {
      texto += `• Fiber Concentrate 450ml: ${calculo.objetivos_vendas.fiber_450ml} unidades\n`
    }
    if (calculo.objetivos_vendas.cr7_drive > 0) {
      texto += `• CR7 Drive: ${calculo.objetivos_vendas.cr7_drive} unidades\n`
    }
  } else {
    // Mostrar todos os produtos relevantes
    if (calculo.objetivos_vendas.energia_kit5 > 0) {
      texto += `• Energia - Kit 5 dias: ${calculo.objetivos_vendas.energia_kit5} kits\n`
    }
    if (calculo.objetivos_vendas.turbo_detox_kit5 > 0) {
      texto += `• Turbo Detox - Kit 5 dias: ${calculo.objetivos_vendas.turbo_detox_kit5} kits\n`
    }
    if (calculo.objetivos_vendas.shake_550g > 0) {
      texto += `• Shake 550g: ${calculo.objetivos_vendas.shake_550g} unidades\n`
    }
  }
  texto += `\n`
  
  // Objetivos de equipe (só mostrar se relevante)
  if (calculo.objetivos_equipe.convites_necessarios > 0 || calculo.objetivos_equipe.novos_consultores_necessarios > 0) {
    texto += `👥 OBJETIVOS DE EQUIPE:\n`
    if (calculo.objetivos_equipe.convites_necessarios > 0) {
      texto += `• Convites necessários: ${calculo.objetivos_equipe.convites_necessarios} por mês\n`
    }
    if (calculo.objetivos_equipe.apresentacoes_necessarias > 0) {
      texto += `• Apresentações necessárias: ${calculo.objetivos_equipe.apresentacoes_necessarias} por mês\n`
    }
    if (calculo.objetivos_equipe.novos_consultores_necessarios > 0) {
      texto += `• Novos consultores necessários: ${calculo.objetivos_equipe.novos_consultores_necessarios}\n`
    }
    if (calculo.objetivos_equipe.pv_equipe_necessario > 0) {
      texto += `• PV da equipe necessário: ${calculo.objetivos_equipe.pv_equipe_necessario.toLocaleString('pt-BR')} PV\n`
    }
    if (calculo.objetivos_equipe.royalties_estimados_mes > 0) {
      texto += `• Royalties estimados: R$ ${calculo.objetivos_equipe.royalties_estimados_mes.toLocaleString('pt-BR')}/mês\n`
    }
    texto += `\n`
  }
  
  texto += `⚡ AÇÕES PRIORITÁRIAS:\n`
  if (calculo.resumo.acoes_prioritarias.length > 0) {
    calculo.resumo.acoes_prioritarias.forEach((acao, index) => {
      texto += `${index + 1}. ${acao}\n`
    })
  } else {
    texto += `1. Focar em vendas diárias consistentes\n`
    texto += `2. Manter rotina de contatos\n`
    texto += `3. Acompanhar progresso semanalmente\n`
  }
  texto += `\n`
  
  texto += `⏱️ Tempo estimado: ${calculo.resumo.tempo_estimado_meses} ${calculo.resumo.tempo_estimado_meses === 1 ? 'mês' : 'meses'}\n`
  
  return texto
}
