import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Capturar dados do request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Criar o lead no Supabase
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        age: body.age || null,
        gender: body.gender || null,
        weight: body.weight || null,
        height: body.height || null,
        activity: body.activity || null,
        calculatorType: body.calculatorType || 'unknown',
        results: body.results || null,
        recommendations: body.recommendations || null,
        quizType: body.quizType || null,
        quizResults: body.quizResults || null,
        source: body.source || 'calculator',
        ipAddress,
        userAgent,
        status: 'new',
        priority: 'medium'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar lead:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar lead no banco de dados' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead capturado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao criar lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Construir filtros
    let query = supabase
      .from('leads')
      .select(`
        *,
        professional:professionals(*),
        notes:lead_notes(*)
      `)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (professionalId) {
      query = query.eq('professionalId', professionalId)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar leads' },
        { status: 500 }
      )
    }

    // Contar total de leads
    let countQuery = supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (professionalId) {
      countQuery = countQuery.eq('professionalId', professionalId)
    }
    if (status) {
      countQuery = countQuery.eq('status', status)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Erro ao contar leads:', countError)
      return NextResponse.json(
        { error: 'Erro ao contar leads' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
