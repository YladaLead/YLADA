import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateLeadSchema } from '@/lib/validation'
import { withRateLimit } from '@/lib/rate-limit'
import { requireApiAuth } from '@/lib/api-auth'
import { z } from 'zod'

// Rate limit mais rígido para captura de leads (anti-spam)
const LEAD_RATE_LIMIT = {
  limit: 5,
  window: 60, // 5 leads por minuto
}

// 🔒 GET - Listar leads do usuário autenticado (PROTEGIDO)
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação (todos os perfis podem ver seus próprios leads)
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user, profile } = authResult

    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('template_id')
    const linkId = searchParams.get('link_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 🔒 Sempre usar user_id do token (seguro)
    const authenticatedUserId = user.id

    let query = supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('user_id', authenticatedUserId) // 🔒 Sempre filtrar por user_id do token
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por template_id se fornecido
    if (templateId) {
      query = query.eq('template_id', templateId)
    }

    // Filtrar por link_id se fornecido (para generated_links)
    if (linkId) {
      query = query.eq('link_id', linkId)
    }

    const { data: leads, error, count } = await query

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar leads' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        leads: leads || [],
        total: count || 0,
        limit,
        offset
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar leads:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// 🌐 POST - Capturar lead (PÚBLICO mas com validações rigorosas)
export async function POST(request: NextRequest) {
  return withRateLimit(request, 'leads-post', async () => {
    try {
      const body = await request.json()

      // Validar dados com Zod
      const validated = CreateLeadSchema.parse(body)

      // 🔒 Buscar o link pelo slug (validar que existe e está ativo)
      const { data: link, error: linkError } = await supabaseAdmin
        .from('generated_links')
        .select('id, title, user_id, status, expires_at')
        .eq('slug', validated.slug)
        .eq('status', 'active')
        .single()

      if (linkError || !link) {
        return NextResponse.json(
          { success: false, error: 'Link não encontrado ou inativo' },
          { status: 404 }
        )
      }

      // 🔒 Validar que o link não está expirado
      if (link.expires_at && new Date(link.expires_at) < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Este link expirou' },
          { status: 410 } // 410 Gone
        )
      }

      // 🔒 Validar que user_id existe e é válido
      if (!link.user_id) {
        console.error('Link sem user_id:', link.id)
        return NextResponse.json(
          { success: false, error: 'Erro ao processar link' },
          { status: 500 }
        )
      }

      // Capturar IP e User Agent de forma segura
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 '127.0.0.1'
      const userAgent = request.headers.get('user-agent') || ''

      // 🔒 Sanitizar e validar dados antes de salvar
      const sanitizedData = {
        name: validated.name.trim().substring(0, 255),
        email: validated.email?.trim().toLowerCase().substring(0, 255),
        phone: validated.phone?.replace(/\D/g, '').substring(0, 20),
        additionalData: validated.additionalData || {},
      }

      // 🔒 Validação adicional: nome não pode estar vazio após sanitização
      if (!sanitizedData.name || sanitizedData.name.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Nome inválido' },
          { status: 400 }
        )
      }

      // 🔒 Validação de email se fornecido
      if (sanitizedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)) {
        return NextResponse.json(
          { success: false, error: 'Email inválido' },
          { status: 400 }
        )
      }

      // 🔒 Limitar tamanho do additionalData (prevenir payloads enormes)
      const additionalDataString = JSON.stringify(sanitizedData.additionalData)
      if (additionalDataString.length > 10000) {
        return NextResponse.json(
          { success: false, error: 'Dados adicionais muito grandes' },
          { status: 400 }
        )
      }

      // 🔒 Inserir lead (user_id sempre vem do link, nunca do body)
      const { data: newLead, error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({
          link_id: link.id,
          user_id: link.user_id, // 🔒 SEMPRE do link, nunca do body
          name: sanitizedData.name,
          email: sanitizedData.email || null,
          phone: sanitizedData.phone || null,
          additional_data: sanitizedData.additionalData,
          ip_address: ip,
          user_agent: userAgent.substring(0, 500), // Limitar tamanho
          source: 'form', // Identificar origem
          created_at: new Date().toISOString()
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

      // 🔒 Atualizar contador de leads do link
      // Nota: Em produção, considere usar RPC para incremento atômico
      const { error: updateError } = await supabaseAdmin
        .from('generated_links')
        .update({ 
          leads_count: (link.leads_count || 0) + 1 
        })
        .eq('id', link.id)

      if (updateError) {
        console.error('Erro ao atualizar contador (não crítico):', updateError)
        // Não falhar a requisição se o contador falhar, o lead já foi salvo
      }

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

