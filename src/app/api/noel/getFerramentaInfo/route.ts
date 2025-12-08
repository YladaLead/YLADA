/**
 * POST /api/noel/getFerramentaInfo
 * 
 * Função para NOEL buscar informações de ferramentas/calculadoras/quizzes
 * Busca por template_slug ou slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl } from '@/lib/url-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ferramenta_slug, user_id } = body

    if (!ferramenta_slug) {
      return NextResponse.json(
        { success: false, error: 'ferramenta_slug é obrigatório' },
        { status: 400 }
      )
    }

    // Primeiro tentar buscar template base
    const { data: templateBase, error: templateError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('slug', ferramenta_slug)
      .eq('is_active', true)
      .maybeSingle()

    if (templateBase && !templateError) {
      // Template base encontrado
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
      
      // Se tiver user_id, tentar buscar ferramenta personalizada
      let link = ''
      let scriptApresentacao = ''
      
      if (user_id) {
        // Buscar user_slug
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', user_id)
          .maybeSingle()
        
        if (profile?.user_slug) {
          // Tentar buscar ferramenta personalizada
          const { data: ferramentaPersonalizada } = await supabaseAdmin
            .from('user_templates')
            .select('*')
            .eq('user_id', user_id)
            .eq('template_slug', ferramenta_slug)
            .eq('profession', 'wellness')
            .eq('status', 'active')
            .maybeSingle()
          
          if (ferramentaPersonalizada) {
            link = buildWellnessToolUrl(profile.user_slug, ferramentaPersonalizada.slug)
            scriptApresentacao = ferramentaPersonalizada.custom_whatsapp_message || 
                                 ferramentaPersonalizada.description || 
                                 templateBase.whatsapp_message || 
                                 `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
          } else {
            // Usar template base com user_slug
            link = buildWellnessToolUrl(profile.user_slug, ferramenta_slug)
            scriptApresentacao = templateBase.whatsapp_message || 
                                 templateBase.description || 
                                 `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
          }
        }
      }
      
      // Se não tiver link ainda, usar template base genérico
      if (!link) {
        link = `${baseUrl}/pt/wellness/ferramenta/${templateBase.slug}`
        scriptApresentacao = templateBase.whatsapp_message || 
                             templateBase.description || 
                             `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
      }

      // Determinar quando usar baseado no tipo
      const quandoUsar = templateBase.type === 'calculadora' 
        ? `Use para pessoas que precisam calcular ${templateBase.name.toLowerCase()}.`
        : templateBase.type === 'quiz'
        ? `Use para engajar leads e descobrir necessidades relacionadas a ${templateBase.name.toLowerCase()}.`
        : `Use quando precisar de uma ferramenta de ${templateBase.name.toLowerCase()}.`

      return NextResponse.json({
        success: true,
        data: {
          slug: templateBase.slug,
          titulo: templateBase.name,
          descricao: templateBase.description || '',
          tipo: templateBase.type,
          link: link,
          script_apresentacao: scriptApresentacao,
          quando_usar: quandoUsar
        }
      })
    }

    // Se não encontrou template base, retornar erro
    return NextResponse.json(
      { success: false, error: 'Ferramenta não encontrada' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('❌ Erro ao buscar ferramenta:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}
