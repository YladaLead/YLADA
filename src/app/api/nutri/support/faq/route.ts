import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Buscar respostas do FAQ
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categoria = searchParams.get('categoria')
    const subcategoria = searchParams.get('subcategoria')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabaseAdmin
      .from('faq_responses')
      .select('*')
      .eq('area', 'nutri')
      .eq('ativo', true)
      .order('ordem_prioridade', { ascending: false })
      .order('visualizacoes', { ascending: false })
      .limit(limit)

    // Filtrar por categoria se fornecido
    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    // Filtrar por subcategoria se fornecido
    if (subcategoria) {
      query = query.eq('subcategoria', subcategoria)
    }

    // Busca por palavras-chave
    if (search && search.trim() !== '') {
      const palavras = search.toLowerCase().split(/\s+/).filter(p => p.length > 2)
      
      if (palavras.length > 0) {
        // Buscar FAQs que contenham essas palavras nas palavras_chave ou tags
        const { data: allFaqs, error: searchError } = await supabaseAdmin
          .from('faq_responses')
          .select('*')
          .eq('area', 'nutri')
          .eq('ativo', true)

        if (searchError) {
          console.error('Erro ao buscar FAQs:', searchError)
        } else if (allFaqs) {
          // Calcular relevância para cada FAQ
          const faqsComRelevancia = allFaqs.map(faq => {
            let relevancia = 0
            
            // Verificar palavras-chave
            const palavrasChave = (faq.palavras_chave || []).map((p: string) => p.toLowerCase())
            palavras.forEach(palavra => {
              if (palavrasChave.some((pk: string) => pk.includes(palavra) || palavra.includes(pk))) {
                relevancia += 3 // Palavra-chave tem peso maior
              }
            })
            
            // Verificar tags
            const tags = (faq.tags || []).map((t: string) => t.toLowerCase())
            palavras.forEach(palavra => {
              if (tags.some((tag: string) => tag.includes(palavra) || palavra.includes(tag))) {
                relevancia += 1
              }
            })
            
            // Verificar na pergunta
            if (faq.pergunta.toLowerCase().includes(search.toLowerCase())) {
              relevancia += 2
            }
            
            return { ...faq, relevancia }
          })
          
          // Filtrar apenas os que têm relevância > 0 e ordenar
          const faqsRelevantes = faqsComRelevancia
            .filter(faq => faq.relevancia > 0)
            .sort((a, b) => {
              // Ordenar por relevância (maior primeiro)
              if (b.relevancia !== a.relevancia) {
                return b.relevancia - a.relevancia
              }
              // Se relevância igual, ordenar por prioridade
              return (b.ordem_prioridade || 0) - (a.ordem_prioridade || 0)
            })
            .slice(0, limit)
          
          // Incrementar visualizações
          if (faqsRelevantes.length > 0) {
            const ids = faqsRelevantes.map(f => f.id)
            // Incrementar visualizações usando RPC ou update individual
            for (const id of ids) {
              await supabaseAdmin.rpc('increment_faq_views', { faq_id: id }).catch(() => {
                // Se RPC não existir, buscar e atualizar manualmente
                supabaseAdmin
                  .from('faq_responses')
                  .select('visualizacoes')
                  .eq('id', id)
                  .single()
                  .then(({ data }) => {
                    if (data) {
                      supabaseAdmin
                        .from('faq_responses')
                        .update({ visualizacoes: (data.visualizacoes || 0) + 1 })
                        .eq('id', id)
                    }
                  })
              })
            }
          }
          
          return NextResponse.json({
            success: true,
            results: faqsRelevantes.map(({ relevancia, ...faq }) => ({
              id: faq.id,
              pergunta: faq.pergunta,
              resposta_completa: faq.resposta_completa,
              resposta_resumida: faq.resposta_resumida,
              categoria: faq.categoria,
              subcategoria: faq.subcategoria,
              video_url: faq.video_url,
              pdf_url: faq.pdf_url,
              thumbnail_url: faq.thumbnail_url,
              relevancia
            }))
          })
        }
      }
    }

    // Se não há busca ou busca não retornou resultados, retornar FAQs gerais
    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar FAQs:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar FAQs' },
        { status: 500 }
      )
    }

    // Incrementar visualizações
    if (data && data.length > 0) {
      for (const faq of data) {
        await supabaseAdmin
          .from('faq_responses')
          .update({ visualizacoes: (faq.visualizacoes || 0) + 1 })
          .eq('id', faq.id)
          .catch(err => console.error('Erro ao incrementar visualizações:', err))
      }
    }

    return NextResponse.json({
      success: true,
      results: (data || []).map(faq => ({
        id: faq.id,
        pergunta: faq.pergunta,
        resposta_completa: faq.resposta_completa,
        resposta_resumida: faq.resposta_resumida,
        categoria: faq.categoria,
        subcategoria: faq.subcategoria,
        video_url: faq.video_url,
        pdf_url: faq.pdf_url,
        thumbnail_url: faq.thumbnail_url,
        relevancia: 0
      }))
    })
  } catch (error: any) {
    console.error('Erro ao buscar FAQ:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar FAQ' },
      { status: 500 }
    )
  }
}

// POST - Criar novo FAQ (apenas admin/support)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      pergunta,
      palavras_chave,
      resposta_completa,
      resposta_resumida,
      categoria,
      subcategoria,
      tags,
      video_url,
      pdf_url,
      thumbnail_url,
      ordem_prioridade
    } = body

    // Validações
    if (!pergunta || !palavras_chave || !resposta_completa || !categoria) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: pergunta, palavras_chave, resposta_completa, categoria' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('faq_responses')
      .insert({
        area: 'nutri',
        pergunta,
        palavras_chave: Array.isArray(palavras_chave) ? palavras_chave : [palavras_chave],
        resposta_completa,
        resposta_resumida: resposta_resumida || null,
        categoria,
        subcategoria: subcategoria || null,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
        video_url: video_url || null,
        pdf_url: pdf_url || null,
        thumbnail_url: thumbnail_url || null,
        ordem_prioridade: ordem_prioridade || 0,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar FAQ:', error)
      return NextResponse.json(
        { error: 'Erro ao criar FAQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      faq: data
    })
  } catch (error: any) {
    console.error('Erro ao criar FAQ:', error)
    return NextResponse.json(
      { error: 'Erro ao criar FAQ' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar FAQ (apenas admin/support)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do FAQ é obrigatório' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('faq_responses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('area', 'nutri')
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar FAQ:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar FAQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      faq: data
    })
  } catch (error: any) {
    console.error('Erro ao atualizar FAQ:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar FAQ' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar FAQ (apenas admin/support)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do FAQ é obrigatório' },
        { status: 400 }
      )
    }

    // Soft delete (marcar como inativo)
    const { data, error } = await supabaseAdmin
      .from('faq_responses')
      .update({ ativo: false })
      .eq('id', id)
      .eq('area', 'nutri')
      .select()
      .single()

    if (error) {
      console.error('Erro ao deletar FAQ:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar FAQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ desativado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao deletar FAQ:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar FAQ' },
      { status: 500 }
    )
  }
}

