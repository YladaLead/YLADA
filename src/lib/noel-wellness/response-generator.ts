/**
 * NOEL WELLNESS - Gerador de Respostas
 * 
 * Algoritmo principal: combina diagnóstico + plano + progresso + scripts
 * Só usa IA como fallback
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { 
  Consultor, 
  Diagnostico, 
  Plano, 
  Progresso, 
  BaseConhecimento,
  EstagioNegocio,
  TempoDisponivelDiario
} from '@/types/wellness-noel'

export interface NoelContext {
  consultor: Consultor
  diagnostico: Diagnostico | null
  planoAtivo: Plano | null
  progressoHoje: Progresso | null
  scriptsRelevantes: BaseConhecimento[]
}

export interface ResponseStrategy {
  useReadyResponse: boolean
  usePersonalizedAdjustment: boolean
  useIA: boolean
  readyResponse?: string
  adjustmentContext?: string
}

/**
 * Carrega contexto completo do consultor
 */
export async function loadNoelContext(consultorId: string): Promise<NoelContext | null> {
  try {
    // 1. Carregar consultor
    const { data: consultor, error: consultorError } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .select('*')
      .eq('id', consultorId)
      .single()

    if (consultorError || !consultor) {
      console.error('❌ Erro ao carregar consultor:', consultorError)
      return null
    }

    // 2. Carregar diagnóstico (mais recente)
    const { data: diagnostico } = await supabaseAdmin
      .from('ylada_wellness_diagnosticos')
      .select('*')
      .eq('consultor_id', consultorId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 3. Carregar plano ativo
    const { data: planoAtivo } = await supabaseAdmin
      .from('ylada_wellness_planos')
      .select('*')
      .eq('consultor_id', consultorId)
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 4. Carregar progresso de hoje
    const hoje = new Date().toISOString().split('T')[0]
    const { data: progressoHoje } = await supabaseAdmin
      .from('ylada_wellness_progresso')
      .select('*')
      .eq('consultor_id', consultorId)
      .eq('data', hoje)
      .maybeSingle()

    // 5. Buscar scripts relevantes
    const scriptsRelevantes = await buscarScriptsRelevantes(
      consultor.estagio_negocio,
      consultor.tempo_disponivel_diario,
      consultor.deseja_recrutar || false
    )

    return {
      consultor,
      diagnostico: diagnostico || null,
      planoAtivo: planoAtivo || null,
      progressoHoje: progressoHoje || null,
      scriptsRelevantes,
    }
  } catch (error) {
    console.error('❌ Erro ao carregar contexto NOEL:', error)
    return null
  }
}

/**
 * Busca scripts relevantes baseado no perfil
 */
async function buscarScriptsRelevantes(
  estagio: EstagioNegocio,
  tempoDisponivel?: TempoDisponivelDiario,
  desejaRecrutar: boolean = false
): Promise<BaseConhecimento[]> {
  try {
    let query = supabaseAdmin
      .from('ylada_wellness_base_conhecimento')
      .select('*')
      .eq('ativo', true)
      .contains('estagio_negocio', [estagio])

    if (tempoDisponivel) {
      query = query.contains('tempo_disponivel', [tempoDisponivel])
    }

    const { data, error } = await query
      .order('prioridade', { ascending: false })
      .limit(10)

    if (error || !data) {
      return []
    }

    // Filtrar por deseja_recrutar se aplicável
    if (!desejaRecrutar) {
      return data.filter(s => s.categoria !== 'script_recrutamento')
    }

    return data
  } catch (error) {
    console.error('❌ Erro ao buscar scripts:', error)
    return []
  }
}

/**
 * Decide estratégia de resposta
 */
export function decideResponseStrategy(
  context: NoelContext,
  mensagem: string
): ResponseStrategy {
  const lowerMessage = mensagem.toLowerCase()

  // 1. Tentar resposta pronta da base de conhecimento
  const scriptMatch = context.scriptsRelevantes.find(script => {
    const tituloLower = script.titulo.toLowerCase()
    const conteudoLower = script.conteudo.toLowerCase()
    return lowerMessage.includes(tituloLower.split(':')[0]) ||
           conteudoLower.includes(lowerMessage.substring(0, 20))
  })

  if (scriptMatch) {
    return {
      useReadyResponse: true,
      usePersonalizedAdjustment: true,
      useIA: false,
      readyResponse: scriptMatch.conteudo,
      adjustmentContext: buildAdjustmentContext(context),
    }
  }

  // 2. Tentar ajuste personalizado baseado em contexto
  if (context.diagnostico || context.planoAtivo || context.progressoHoje) {
    return {
      useReadyResponse: false,
      usePersonalizedAdjustment: true,
      useIA: false,
      adjustmentContext: buildAdjustmentContext(context),
    }
  }

  // 3. Fallback: usar IA
  return {
    useReadyResponse: false,
    usePersonalizedAdjustment: false,
    useIA: true,
  }
}

/**
 * Constrói contexto para ajuste personalizado
 */
function buildAdjustmentContext(context: NoelContext): string {
  const parts: string[] = []

  // Contexto do consultor
  parts.push(`Consultor: ${context.consultor.nome}`)
  parts.push(`Estágio: ${context.consultor.estagio_negocio}`)
  if (context.consultor.tempo_disponivel_diario) {
    parts.push(`Tempo disponível: ${context.consultor.tempo_disponivel_diario}`)
  }

  // Contexto do diagnóstico
  if (context.diagnostico) {
    if (context.diagnostico.perfil_identificado) {
      parts.push(`Perfil: ${context.diagnostico.perfil_identificado}`)
    }
    if (context.diagnostico.maior_dificuldade) {
      parts.push(`Maior dificuldade: ${context.diagnostico.maior_dificuldade}`)
    }
    if (context.diagnostico.objetivo_principal) {
      parts.push(`Objetivo: ${context.diagnostico.objetivo_principal}`)
    }
  }

  // Contexto do plano
  if (context.planoAtivo) {
    const plano = context.planoAtivo.plano_json as any
    const hoje = new Date()
    const dataInicio = new Date(context.planoAtivo.data_inicio)
    const diasDecorridos = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const diaAtual = diasDecorridos + 1

    if (plano.dias && plano.dias[diaAtual - 1]) {
      const diaPlano = plano.dias[diaAtual - 1]
      parts.push(`Dia ${diaAtual} do plano: ${diaPlano.foco || ''}`)
      if (diaPlano.microtarefas) {
        parts.push(`Microtarefas do dia: ${diaPlano.microtarefas.join(', ')}`)
      }
    }
  }

  // Contexto do progresso
  if (context.progressoHoje) {
    const progresso = context.progressoHoje
    if (progresso.ritual_2_executado || progresso.ritual_5_executado || progresso.ritual_10_executado) {
      parts.push('Ritual 2-5-10: Em andamento')
    }
    if (progresso.microtarefas_completadas > 0) {
      parts.push(`Microtarefas: ${progresso.microtarefas_completadas}/${progresso.microtarefas_total} completas`)
    }
  }

  return parts.join('\n')
}

/**
 * Gera resposta personalizada ajustada
 */
export function generatePersonalizedResponse(
  baseResponse: string,
  context: NoelContext
): string {
  let response = baseResponse

  // Ajustar para estágio
  const ajustesEstagio: Record<EstagioNegocio, string> = {
    iniciante: 'Como você está começando, vou te guiar passo a passo.',
    ativo: 'Você já está no caminho certo! Vamos acelerar seus resultados.',
    produtivo: 'Excelente! Você está produzindo bem. Vamos otimizar ainda mais.',
    multiplicador: 'Parabéns! Você está multiplicando. Vamos expandir sua liderança.',
    lider: 'Você é um líder! Vamos fortalecer sua equipe e resultados.',
  }

  // Ajustar para tempo disponível
  const ajustesTempo: Record<TempoDisponivelDiario, string> = {
    '15-30 min': 'Com seu tempo limitado, vamos focar no essencial.',
    '30-60 min': 'Você tem um bom tempo disponível. Vamos aproveitar bem!',
    '1-2h': 'Excelente! Com esse tempo você pode fazer muito.',
    '2-3h': 'Perfeito! Você tem tempo suficiente para ações estratégicas.',
    '3-5h': 'Ótimo! Com esse tempo você pode acelerar muito seu crescimento.',
    '5h+': 'Excelente disponibilidade! Você pode fazer grandes coisas.',
  }

  // Adicionar ajustes ao início da resposta
  const ajustes: string[] = []

  if (context.consultor.estagio_negocio && ajustesEstagio[context.consultor.estagio_negocio]) {
    ajustes.push(ajustesEstagio[context.consultor.estagio_negocio])
  }

  if (context.consultor.tempo_disponivel_diario && ajustesTempo[context.consultor.tempo_disponivel_diario]) {
    ajustes.push(ajustesTempo[context.consultor.tempo_disponivel_diario])
  }

  if (ajustes.length > 0) {
    response = `${ajustes.join(' ')}\n\n${response}`
  }

  // Adicionar contexto do progresso se relevante
  if (context.progressoHoje) {
    const progresso = context.progressoHoje
    if (!progresso.ritual_2_executado && new Date().getHours() < 12) {
      response += '\n\n💡 Lembrete: Não esqueça do Ritual 2 (manhã)!'
    }
    if (!progresso.ritual_5_executado && new Date().getHours() >= 12 && new Date().getHours() < 18) {
      response += '\n\n💡 Lembrete: Hora do Ritual 5 (tarde)!'
    }
    if (!progresso.ritual_10_executado && new Date().getHours() >= 18) {
      response += '\n\n💡 Lembrete: Ritual 10 (noite) - Revise seu dia!'
    }
  }

  return response
}

/**
 * Detecta tópico e intenção da mensagem
 */
export function detectTopicAndIntent(mensagem: string): {
  topico?: string
  intencao?: string
} {
  const lower = mensagem.toLowerCase()

  // Tópicos
  const topicos: Record<string, string> = {
    'pv|volume|pontos': 'pv',
    'vender|vendas|venda': 'vendas',
    'recrutar|recrutamento|equipe': 'recrutamento',
    'shake|bebida|herbalife': 'produtos',
    'script|mensagem|texto': 'scripts',
    'ritual|2-5-10': 'ritual',
    'plano|planejamento': 'plano',
    'meta|objetivo': 'metas',
    'dificuldade|problema|desafio': 'desafios',
  }

  // Intenções
  const intencoes: Record<string, string> = {
    'como|como fazer|como fazer': 'instrução',
    'o que|qual|quais': 'informação',
    'preciso|quero|gostaria': 'solicitação',
    'não consigo|dificuldade|problema': 'ajuda',
    'obrigado|valeu|agradeço': 'agradecimento',
  }

  let topico: string | undefined
  let intencao: string | undefined

  for (const [pattern, topic] of Object.entries(topicos)) {
    if (new RegExp(pattern, 'i').test(lower)) {
      topico = topic
      break
    }
  }

  for (const [pattern, intent] of Object.entries(intencoes)) {
    if (new RegExp(pattern, 'i').test(lower)) {
      intencao = intent
      break
    }
  }

  return { topico, intencao }
}

