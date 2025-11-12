import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withRateLimit } from '@/lib/rate-limit'

// POST - Rastrear conversão (quando usuário clica no botão CTA)
// PÚBLICO mas com validações rigorosas
export async function POST(request: NextRequest) {
  return withRateLimit(request, 'conversions-post', async () => {
    try {
      const body = await request.json()
      const { template_id, lead_id, slug } = body

      // Validar que temos pelo menos template_id ou slug
      if (!template_id && !slug) {
        return NextResponse.json(
          { success: false, error: 'template_id ou slug é obrigatório' },
          { status: 400 }
        )
      }

      let templateId = template_id

      // Se não tem template_id, buscar pelo slug
      if (!templateId && slug) {
        const { data: link, error: linkError } = await supabaseAdmin
          .from('user_templates')
          .select('id')
          .eq('slug', slug)
          .single()

        if (linkError || !link) {
          return NextResponse.json(
            { success: false, error: 'Template não encontrado' },
            { status: 404 }
          )
        }

        templateId = link.id
      }

      // Buscar o template para validar
      const { data: template, error: templateError } = await supabaseAdmin
        .from('user_templates')
        .select('id, conversions_count')
        .eq('id', templateId)
        .single()

      if (templateError || !template) {
        return NextResponse.json(
          { success: false, error: 'Template não encontrado' },
          { status: 404 }
        )
      }

      // Incrementar contador de conversões
      const newConversionsCount = (template.conversions_count || 0) + 1

      const { error: updateError } = await supabaseAdmin
        .from('user_templates')
        .update({ 
          conversions_count: newConversionsCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId)

      if (updateError) {
        console.error('Erro ao atualizar conversões:', updateError)
        return NextResponse.json(
          { success: false, error: 'Erro ao registrar conversão' },
          { status: 500 }
        )
      }

      // Se temos lead_id, também podemos marcar o lead como convertido (opcional)
      if (lead_id) {
        // Atualizar lead com status de convertido (se a coluna existir)
        await supabaseAdmin
          .from('leads')
          .update({ 
            converted: true,
            converted_at: new Date().toISOString()
          })
          .eq('id', lead_id)
          // Ignorar erro se a coluna não existir ainda
          .then(() => {}, () => {})
      }

      return NextResponse.json({
        success: true,
        conversions_count: newConversionsCount
      })
    } catch (error: any) {
      console.error('Erro ao registrar conversão:', error)
      return NextResponse.json(
        { success: false, error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, {
    limit: 10, // 10 conversões por minuto por IP
    window: 60
  })
}

