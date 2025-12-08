/**
 * POST /api/noel/getQuizInfo
 * 
 * Função para NOEL buscar informações de quizzes
 * Similar ao getFerramentaInfo mas focado em quizzes
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl } from '@/lib/url-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_slug, user_id } = body

    if (!quiz_slug) {
      return NextResponse.json(
        { success: false, error: 'quiz_slug é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar template base do tipo quiz
    const { data: templateBase, error: templateError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('slug', quiz_slug)
      .eq('type', 'quiz')
      .eq('is_active', true)
      .maybeSingle()

    if (templateBase && !templateError) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
      
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
          // Tentar buscar quiz personalizado
          const { data: quizPersonalizado } = await supabaseAdmin
            .from('user_templates')
            .select('*')
            .eq('user_id', user_id)
            .eq('template_slug', quiz_slug)
            .eq('profession', 'wellness')
            .eq('status', 'active')
            .maybeSingle()
          
          if (quizPersonalizado) {
            link = buildWellnessToolUrl(profile.user_slug, quizPersonalizado.slug)
            scriptApresentacao = quizPersonalizado.custom_whatsapp_message || 
                                 quizPersonalizado.description || 
                                 templateBase.whatsapp_message || 
                                 `Tenho um quiz sobre ${templateBase.name} que pode te ajudar a descobrir suas necessidades! Quer fazer?`
          } else {
            link = buildWellnessToolUrl(profile.user_slug, quiz_slug)
            scriptApresentacao = templateBase.whatsapp_message || 
                                 templateBase.description || 
                                 `Tenho um quiz sobre ${templateBase.name} que pode te ajudar a descobrir suas necessidades! Quer fazer?`
          }
        }
      }
      
      if (!link) {
        link = `${baseUrl}/pt/wellness/ferramenta/${templateBase.slug}`
        scriptApresentacao = templateBase.whatsapp_message || 
                             templateBase.description || 
                             `Tenho um quiz sobre ${templateBase.name} que pode te ajudar a descobrir suas necessidades! Quer fazer?`
      }

      return NextResponse.json({
        success: true,
        data: {
          slug: templateBase.slug,
          titulo: templateBase.name,
          descricao: templateBase.description || '',
          tipo: 'quiz',
          link: link,
          script_apresentacao: scriptApresentacao,
          quando_usar: `Use para engajar leads e descobrir necessidades relacionadas a ${templateBase.name.toLowerCase()}. Ideal para iniciar conversas e identificar oportunidades.`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Quiz não encontrado' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('❌ Erro ao buscar quiz:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar quiz' },
      { status: 500 }
    )
  }
}
