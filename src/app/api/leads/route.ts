import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateLeadSchema } from '@/lib/validation'
import { withRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

// Rate limit mais rígido para captura de leads (anti-spam)
const LEAD_RATE_LIMIT = {
  limit: 5,
  window: 60, // 5 leads por minuto
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'leads-post', async () => {
    try {
      const body = await request.json()

      // Validar dados com Zod
      const validated = CreateLeadSchema.parse(body)

      // Buscar o link pelo slug
      const { data: link, error: linkError } = await supabaseAdmin
        .from('generated_links')
        .select('id, title, user_id')
        .eq('slug', validated.slug)
        .eq('status', 'active')
        .single()

      if (linkError || !link) {
        return NextResponse.json(
          { success: false, error: 'Link não encontrado ou inativo' },
          { status: 404 }
        )
      }

      // Capturar IP e User Agent de forma segura
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 '127.0.0.1'
      const userAgent = request.headers.get('user-agent') || ''

      // Sanitizar dados antes de salvar
      const sanitizedData = {
        name: validated.name.trim().substring(0, 255),
        email: validated.email?.trim().substring(0, 255),
        phone: validated.phone?.replace(/\D/g, '').substring(0, 20),
        additionalData: validated.additionalData || {},
      }

      // Inserir lead
      const { data: newLead, error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({
          link_id: link.id,
          user_id: link.user_id,
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          additional_data: sanitizedData.additionalData,
          ip_address: ip,
          user_agent: userAgent,
        })
        .select()
        .single()

      if (leadError) {
        console.error('Erro ao salvar lead:', leadError)
        return NextResponse.json(
          { success: false, error: 'Erro ao salvar lead' },
          { status: 500 }
        )
      }

      // Atualizar contador de leads do link (com proteção contra race condition)
      await supabaseAdmin
        .from('generated_links')
        .update({ 
          leads_count: link.leads_count + 1 
        })
        .eq('id', link.id)

      return NextResponse.json({
        success: true,
        data: {
          leadId: newLead.id,
          message: 'Lead capturado com sucesso!'
        }
      })

    } catch (error: any) {
      console.error('Erro ao capturar lead:', error)

      // Retornar erro de validação específico
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Dados inválidos',
            details: error.errors 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, LEAD_RATE_LIMIT)
}

