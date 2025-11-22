import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET: Buscar resposta para uma pergunta
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pergunta = searchParams.get('pergunta')
    const area = searchParams.get('area') || null

    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta é obrigatória' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Buscar resposta usando a função do banco
    const { data, error } = await supabase.rpc('buscar_resposta_chat', {
      p_pergunta: pergunta,
      p_area: area
    })

    if (error) {
      console.error('Erro ao buscar resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar resposta', details: error.message },
        { status: 500 }
      )
    }

    // Retornar a resposta mais relevante (primeira da lista)
    if (data && data.length > 0 && data[0].relevancia > 0.1) {
      return NextResponse.json({
        encontrada: true,
        resposta: data[0].resposta,
        id: data[0].id,
        relevancia: data[0].relevancia,
        alternativas: data.slice(1, 3).map((item: any) => ({
          resposta: item.resposta,
          relevancia: item.relevancia
        }))
      })
    }

    return NextResponse.json({
      encontrada: false,
      resposta: null
    })
  } catch (error: any) {
    console.error('Erro na API chat/qa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Criar/atualizar resposta (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('perfil')
      .eq('user_id', user.id)
      .single()

    if (profile?.perfil !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { pergunta, resposta, area, tags, prioridade, id } = body

    if (!pergunta || !resposta) {
      return NextResponse.json(
        { error: 'Pergunta e resposta são obrigatórias' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    if (id) {
      // Atualizar existente
      const { data, error } = await supabaseAdmin
        .from('chat_qa')
        .update({
          pergunta,
          resposta,
          area: area || null,
          tags: tags || [],
          prioridade: prioridade || 0,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Erro ao atualizar', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    } else {
      // Criar novo
      const { data, error } = await supabaseAdmin
        .from('chat_qa')
        .insert({
          pergunta,
          resposta,
          area: area || null,
          tags: tags || [],
          prioridade: prioridade || 0,
          criado_por: user.id
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Erro ao criar', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    }
  } catch (error: any) {
    console.error('Erro na API chat/qa POST:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

