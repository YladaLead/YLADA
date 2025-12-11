import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Rota de debug para verificar ferramenta específica
 * Uso: /api/debug/verificar-ferramenta?user_slug=edsondaluz&tool_slug=perfil-intestino
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug') || 'edsondaluz'
    const toolSlug = searchParams.get('tool_slug') || 'perfil-intestino'

    const resultados: any = {
      user_slug: userSlug,
      tool_slug: toolSlug,
      verificacoes: {}
    }

    // PASSO 1: Verificar se o usuário existe
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_slug, email, nome_completo')
      .eq('user_slug', userSlug)
      .maybeSingle()

    resultados.verificacoes.usuario = {
      encontrado: !!userProfile,
      dados: userProfile,
      erro: userError?.message
    }

    if (!userProfile) {
      return NextResponse.json(resultados, { status: 200 })
    }

    // PASSO 2: Verificar ferramenta exata
    const { data: ferramentaExata, error: ferramentaExataError } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('slug', toolSlug)
      .eq('profession', 'wellness')
      .maybeSingle()

    resultados.verificacoes.ferramenta_exata = {
      encontrada: !!ferramentaExata,
      dados: ferramentaExata ? {
        id: ferramentaExata.id,
        title: ferramentaExata.title,
        slug: ferramentaExata.slug,
        template_slug: ferramentaExata.template_slug,
        status: ferramentaExata.status,
        tem_content: !!ferramentaExata.content,
        content_keys: ferramentaExata.content ? Object.keys(ferramentaExata.content) : []
      } : null,
      erro: ferramentaExataError?.message
    }

    // PASSO 3: Verificar variações do slug
    const { data: ferramentasVariacoes, error: variacoesError } = await supabaseAdmin
      .from('user_templates')
      .select('id, title, slug, template_slug, status')
      .eq('user_id', userProfile.user_id)
      .eq('profession', 'wellness')
      .or(`slug.ilike.%${toolSlug}%,title.ilike.%${toolSlug}%,template_slug.ilike.%${toolSlug}%`)

    resultados.verificacoes.variacoes = {
      encontradas: ferramentasVariacoes?.length || 0,
      ferramentas: ferramentasVariacoes || [],
      erro: variacoesError?.message
    }

    // PASSO 4: Listar TODAS as ferramentas wellness do usuário
    const { data: todasFerramentas, error: todasError } = await supabaseAdmin
      .from('user_templates')
      .select('id, title, slug, template_slug, status')
      .eq('user_id', userProfile.user_id)
      .eq('profession', 'wellness')
      .order('created_at', { ascending: false })
      .limit(50)

    resultados.verificacoes.todas_ferramentas = {
      total: todasFerramentas?.length || 0,
      ferramentas: todasFerramentas || [],
      erro: todasError?.message
    }

    // PASSO 5: Verificar template base
    const { data: templateBase, error: templateBaseError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, slug, is_active, profession')
      .eq('slug', toolSlug)
      .eq('is_active', true)
      .or('profession.is.null,profession.eq.wellness')
      .maybeSingle()

    resultados.verificacoes.template_base = {
      encontrado: !!templateBase,
      dados: templateBase,
      erro: templateBaseError?.message
    }

    // RESUMO
    resultados.resumo = {
      usuario_existe: !!userProfile,
      ferramenta_exata_existe: !!ferramentaExata,
      ferramenta_ativa: ferramentaExata?.status === 'active',
      ferramenta_tem_content: !!ferramentaExata?.content,
      variacoes_encontradas: ferramentasVariacoes?.length || 0,
      template_base_existe: !!templateBase,
      diagnostico: !userProfile 
        ? '❌ Usuário não encontrado'
        : !ferramentaExata
        ? '❌ Ferramenta não encontrada com slug exato'
        : ferramentaExata.status !== 'active'
        ? `❌ Ferramenta existe mas está com status: ${ferramentaExata.status}`
        : !ferramentaExata.content
        ? '⚠️ Ferramenta existe e está ativa, mas não tem content configurado'
        : '✅ Ferramenta encontrada, ativa e com content'
    }

    return NextResponse.json(resultados, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { 
        erro: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}
