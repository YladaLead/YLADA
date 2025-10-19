import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-fixed'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Obter estatísticas gerais
    const { data: stats, error: statsError } = await supabaseAdmin
      .rpc('get_assistant_usage_stats', { days })

    if (statsError) throw statsError

    // Obter métricas por dia
    const { data: dailyMetrics, error: dailyError } = await supabaseAdmin
      .rpc('get_daily_assistant_metrics', { days })

    if (dailyError) throw dailyError

    // Obter top intents
    const { data: topIntents, error: intentsError } = await supabaseAdmin
      .rpc('get_top_intents', { days, limit_count: limit })

    if (intentsError) throw intentsError

    // Obter dados brutos para gráficos
    const { data: rawMetrics, error: rawError } = await supabaseAdmin
      .from('assistant_metrics')
      .select('assistant_used, latency_ms, intent, escalated, created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (rawError) throw rawError

    return NextResponse.json({
      success: true,
      data: {
        stats: stats[0] || {
          total_requests: 0,
          chat_percentage: 0,
          creator_percentage: 0,
          expert_percentage: 0,
          average_latency: 0,
          escalation_rate: 0,
          average_cost_per_request: 0
        },
        dailyMetrics: dailyMetrics || [],
        topIntents: topIntents || [],
        rawMetrics: rawMetrics || [],
        summary: {
          totalRequests: stats[0]?.total_requests || 0,
          costSavings: calculateCostSavings(stats[0]),
          efficiency: calculateEfficiency(stats[0]),
          recommendations: generateRecommendations(stats[0])
        }
      }
    })

  } catch (error) {
    console.error('Erro ao obter métricas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao obter métricas dos assistentes' },
      { status: 500 }
    )
  }
}

// Calcular economia de custos
function calculateCostSavings(stats: any) {
  if (!stats || stats.total_requests === 0) return { percentage: 0, amount: 0 }

  // Custo se usássemos apenas GPT-4 (sistema antigo)
  const oldCost = stats.total_requests * 30.00 / 1000000
  
  // Custo atual com sistema híbrido
  const currentCost = stats.average_cost_per_request * stats.total_requests
  
  const savings = oldCost - currentCost
  const percentage = (savings / oldCost) * 100

  return {
    percentage: Math.round(percentage),
    amount: Math.round(savings * 100) / 100
  }
}

// Calcular eficiência do sistema
function calculateEfficiency(stats: any) {
  if (!stats || stats.total_requests === 0) return { score: 0, status: 'unknown' }

  // Score baseado em distribuição ideal (80/15/5) e baixa escalação
  const idealChat = 80
  const idealCreator = 15
  const idealExpert = 5
  
  const chatScore = Math.max(0, 100 - Math.abs(stats.chat_percentage - idealChat))
  const creatorScore = Math.max(0, 100 - Math.abs(stats.creator_percentage - idealCreator))
  const expertScore = Math.max(0, 100 - Math.abs(stats.expert_percentage - idealExpert))
  const escalationScore = Math.max(0, 100 - stats.escalation_rate * 2) // Penalizar escalação alta
  
  const efficiencyScore = (chatScore + creatorScore + expertScore + escalationScore) / 4
  
  let status = 'excellent'
  if (efficiencyScore < 60) status = 'poor'
  else if (efficiencyScore < 80) status = 'good'
  else if (efficiencyScore < 90) status = 'very_good'

  return {
    score: Math.round(efficiencyScore),
    status
  }
}

// Gerar recomendações baseadas nas métricas
function generateRecommendations(stats: any) {
  const recommendations = []

  if (!stats || stats.total_requests === 0) {
    return ['Sistema ainda não possui dados suficientes para análise']
  }

  // Recomendação sobre distribuição
  if (stats.chat_percentage < 70) {
    recommendations.push('Considere otimizar o roteamento para usar mais o Chat (GPT-4o mini) para conversas simples')
  }
  
  if (stats.expert_percentage > 10) {
    recommendations.push('Taxa de uso do Expert (GPT-4) está alta. Revise critérios de escalação')
  }

  // Recomendação sobre escalação
  if (stats.escalation_rate > 15) {
    recommendations.push('Taxa de escalação alta. Melhore a detecção de intenção para reduzir fallbacks')
  }

  // Recomendação sobre latência
  if (stats.average_latency > 5000) {
    recommendations.push('Latência média alta. Considere otimizar prompts ou implementar mais cache')
  }

  // Recomendação sobre custos
  if (stats.average_cost_per_request > 0.01) {
    recommendations.push('Custo por request alto. Revise distribuição entre assistentes')
  }

  if (recommendations.length === 0) {
    recommendations.push('Sistema funcionando de forma otimizada! Continue monitorando.')
  }

  return recommendations
}
