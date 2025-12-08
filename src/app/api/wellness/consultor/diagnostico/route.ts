/**
 * GET /api/wellness/consultor/diagnostico
 * 
 * Gera diagnóstico do consultor baseado nos dados do onboarding
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Carregar perfil do consultor
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (perfilError && perfilError.code !== 'PGRST116') {
      console.error('❌ Erro ao carregar perfil:', perfilError)
      return NextResponse.json(
        { error: 'Erro ao carregar perfil' },
        { status: 500 }
      )
    }

    if (!perfil || !perfil.onboarding_completo) {
      return NextResponse.json({
        hasDiagnostico: false,
        message: 'Onboarding não completo'
      })
    }

    // Gerar diagnóstico baseado no perfil
    const diagnostico = gerarDiagnosticoDoPerfil(perfil)

    return NextResponse.json({
      hasDiagnostico: true,
      diagnostico,
      perfil: {
        objetivo_principal: perfil.objetivo_principal,
        meta_pv: perfil.meta_pv,
        meta_financeira: perfil.meta_financeira,
        tempo_disponivel: perfil.tempo_disponivel,
        canal_principal: perfil.canal_principal || perfil.canal_preferido?.[0],
        experiencia: perfil.experiencia_herbalife || perfil.experiencia_vendas,
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar diagnóstico', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Gera diagnóstico completo baseado no perfil do onboarding
 */
function gerarDiagnosticoDoPerfil(perfil: any): {
  perfil_identificado: string
  pontos_fortes: string[]
  pontos_melhoria: string[]
  recomendacoes: string[]
  orientacoes_personalizadas: string[]
  proximos_passos: string[]
} {
  const pontosFortes: string[] = []
  const pontosMelhoria: string[] = []
  const recomendacoes: string[] = []
  const orientacoes: string[] = []
  const proximosPassos: string[] = []
  let perfilIdentificado = 'Consultor Wellness'

  // Analisar objetivo principal
  if (perfil.objetivo_principal) {
    if (perfil.objetivo_principal.includes('vender') || perfil.objetivo_principal.includes('vendas')) {
      perfilIdentificado = 'Consultor Focado em Vendas'
      pontosFortes.push('Foco claro em resultados de vendas')
      recomendacoes.push('Usar scripts de vendas diariamente')
      recomendacoes.push('Fazer follow-up sistemático com clientes')
      orientacoes.push('Priorize gerar vendas antes de recrutar')
      orientacoes.push('Foque em kits R$39,90 para começar')
    } else if (perfil.objetivo_principal.includes('equipe') || perfil.objetivo_principal.includes('recrutar')) {
      perfilIdentificado = 'Consultor Focado em Liderança'
      pontosFortes.push('Visão de crescimento e duplicação')
      recomendacoes.push('Desenvolver habilidades de recrutamento')
      recomendacoes.push('Criar sistema de treinamento para equipe')
      orientacoes.push('Construa sua base de vendas antes de recrutar')
      orientacoes.push('Use fluxos de diagnóstico para identificar recrutas')
    } else if (perfil.objetivo_principal.includes('rotina')) {
      perfilIdentificado = 'Consultor em Desenvolvimento'
      pontosFortes.push('Comprometimento com consistência')
      recomendacoes.push('Implementar Ritual 2-5-10 diário')
      recomendacoes.push('Criar rotina de ações diárias')
      orientacoes.push('Pequenos passos diários valem mais que grandes ações esporádicas')
      orientacoes.push('Foque em constância, não em intensidade')
    } else {
      perfilIdentificado = 'Consultor em Desenvolvimento'
    }
  }

  // Analisar experiência
  if (perfil.experiencia_herbalife || perfil.experiencia_vendas) {
    const experiencia = perfil.experiencia_herbalife || perfil.experiencia_vendas
    if (experiencia?.includes('anos') || experiencia?.includes('3+') || experiencia?.includes('experiente')) {
      pontosFortes.push('Experiência consolidada no negócio')
      recomendacoes.push('Acelerar resultados com estratégias avançadas')
      orientacoes.push('Você tem experiência, pode acelerar seu crescimento')
      proximosPassos.push('Foque em otimizar processos e aumentar ticket médio')
    } else if (experiencia?.includes('ano') || experiencia?.includes('intermediário')) {
      pontosFortes.push('Boa experiência prática')
      recomendacoes.push('Aprofundar conhecimentos técnicos')
      orientacoes.push('Continue construindo sua base de clientes')
      proximosPassos.push('Aumente frequência de contatos e follow-ups')
    } else {
      pontosMelhoria.push('Construir experiência prática')
      recomendacoes.push('Começar com ações simples e consistentes')
      orientacoes.push('Comece devagar, mas seja consistente')
      orientacoes.push('Não precisa ser perfeito, só precisa começar')
      proximosPassos.push('Foque em 1 ação diária: enviar links para 3 pessoas')
    }
  } else {
    pontosMelhoria.push('Construir experiência prática')
    recomendacoes.push('Começar com ações simples e consistentes')
  }

  // Analisar tempo disponível
  if (perfil.tempo_disponivel) {
    if (perfil.tempo_disponivel === '15_minutos' || perfil.tempo_disponivel === 'pouco') {
      orientacoes.push('Com pouco tempo, foque em ações rápidas: enviar links e responder mensagens')
      proximosPassos.push('Use 15 min/dia: 5 min lista, 10 min envios')
    } else if (perfil.tempo_disponivel === '1_hora' || perfil.tempo_disponivel === 'muito') {
      orientacoes.push('Com mais tempo, você pode fazer follow-ups e criar conteúdo')
      proximosPassos.push('Use 30 min/dia: 10 min lista, 15 min envios, 5 min follow-up')
    } else {
      orientacoes.push('Use 20 min/dia de forma consistente')
      proximosPassos.push('Rotina ideal: 5 min lista, 10 min envios, 5 min follow-up')
    }
  }

  // Analisar canal preferido
  if (perfil.canal_principal || perfil.canal_preferido?.[0]) {
    const canal = perfil.canal_principal || perfil.canal_preferido[0]
    if (canal === 'instagram' || canal?.includes('instagram')) {
      recomendacoes.push('Criar conteúdo visual no Instagram')
      orientacoes.push('Use stories para mostrar produtos em uso')
      proximosPassos.push('Faça 1 story por dia mostrando um produto')
    } else {
      recomendacoes.push('Otimizar uso do WhatsApp para vendas')
      orientacoes.push('Use links diretos para facilitar compras')
      proximosPassos.push('Envie links de produtos para 3 pessoas por dia')
    }
  }

  // Analisar metas
  if (perfil.meta_pv) {
    const vendasNecessarias = Math.ceil(perfil.meta_pv / 100)
    orientacoes.push(`Para atingir ${perfil.meta_pv} PV, você precisa de aproximadamente ${vendasNecessarias} vendas este mês`)
    proximosPassos.push(`Meta: ${vendasNecessarias} vendas este mês (${perfil.meta_pv} PV)`)
  }

  if (perfil.meta_financeira) {
    orientacoes.push(`Sua meta financeira é R$ ${perfil.meta_financeira.toLocaleString('pt-BR')}`)
    proximosPassos.push(`Cada venda te aproxima da meta de R$ ${perfil.meta_financeira.toLocaleString('pt-BR')}`)
  }

  // Analisar contatos
  if (perfil.contatos_whatsapp) {
    if (perfil.contatos_whatsapp >= 50) {
      pontosFortes.push(`Boa base de contatos (${perfil.contatos_whatsapp} no WhatsApp)`)
      orientacoes.push('Você tem uma boa base de contatos para começar')
      proximosPassos.push(`Use seus ${perfil.contatos_whatsapp} contatos: envie para 5-10 por dia`)
    } else if (perfil.contatos_whatsapp >= 20) {
      pontosFortes.push(`Base inicial de contatos (${perfil.contatos_whatsapp})`)
      orientacoes.push('Construa sua lista gradualmente')
      proximosPassos.push(`Adicione 2-3 contatos novos por dia`)
    } else {
      pontosMelhoria.push('Construir base de contatos')
      recomendacoes.push('Expandir rede de contatos gradualmente')
      orientacoes.push('Comece com pessoas próximas: família, amigos, colegas')
      proximosPassos.push('Liste 10 pessoas próximas hoje')
    }
  }

  // Se não tem pontos fortes, adicionar padrão
  if (pontosFortes.length === 0) {
    pontosFortes.push('Comprometimento com o negócio')
  }

  // Se não tem pontos de melhoria, adicionar padrão
  if (pontosMelhoria.length === 0) {
    pontosMelhoria.push('Desenvolvimento contínuo')
  }

  // Se não tem recomendações, adicionar padrão
  if (recomendacoes.length === 0) {
    recomendacoes.push('Manter consistência e foco')
  }

  return {
    perfil_identificado: perfilIdentificado,
    pontos_fortes: pontosFortes,
    pontos_melhoria: pontosMelhoria,
    recomendacoes: recomendacoes,
    orientacoes_personalizadas: orientacoes,
    proximos_passos: proximosPassos,
  }
}


