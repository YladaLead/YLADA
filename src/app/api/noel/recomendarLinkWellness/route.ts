import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'
import { recommendLink, type RecomendacaoContext } from '@/lib/noel-wellness/links-recommender'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl } from '@/lib/url-utils'

/**
 * POST /api/noel/recomendarLinkWellness
 * NOEL Function: Recomenda um Link Wellness baseado em contexto
 */
export async function POST(request: NextRequest) {
  try {
    // Validar autenticação (aceita secret do header Authorization)
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { tipo_lead, necessidade, palavras_chave, objetivo, user_id } = body

    const contexto: RecomendacaoContext = {
      tipoLead: tipo_lead || undefined,
      necessidadeIdentificada: necessidade || undefined,
      palavrasChave: palavras_chave ? palavras_chave.split(',').map((k: string) => k.trim()) : undefined,
      objetivo: objetivo || undefined,
    }

    const link = await recommendLink(contexto)

    if (!link) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum link encontrado para o contexto fornecido',
      })
    }

    // Gerar link personalizado se tiver user_id
    let linkPersonalizado = link.url || null
    
    // 🚨 CRÍTICO: Se for HOM (recrutamento), gerar link personalizado: /pt/wellness/[user-slug]/hom
    const isHOM = link.codigo?.toLowerCase().includes('hom') || 
                  link.nome?.toLowerCase().includes('hom') ||
                  objetivo === 'recrutamento' ||
                  palavras_chave?.some(k => k.toLowerCase().includes('hom') || k.toLowerCase().includes('recrutamento'))
    
    if (user_id) {
      // Buscar user_slug
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_slug')
        .eq('user_id', user_id)
        .maybeSingle()
      
      if (profile?.user_slug) {
        if (isHOM) {
          // Link da HOM: /pt/wellness/[user-slug]/hom
          linkPersonalizado = buildWellnessToolUrl(profile.user_slug, 'hom')
          console.log('✅ [recomendarLinkWellness] Link HOM personalizado gerado:', linkPersonalizado)
        } else if (!linkPersonalizado) {
          // Gerar link personalizado baseado no código do link
          // Se o link for uma ferramenta/template, usar formato: /pt/wellness/[user-slug]/[codigo]
          // Se for um link genérico, usar formato: /pt/wellness/links/[codigo]
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
          linkPersonalizado = `${baseUrl}/pt/wellness/${profile.user_slug}/links/${link.codigo}`
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        codigo: link.codigo,
        nome: link.nome,
        categoria: link.categoria,
        objetivo: link.objetivo,
        script_curto: link.script_curto,
        quando_usar: link.quando_usar,
        publico_alvo: link.publico_alvo,
        link: linkPersonalizado || link.url || null, // Incluir link personalizado
      },
    })
  } catch (error) {
    console.error('[NOEL] Erro ao recomendar Link Wellness:', error)
    return NextResponse.json(
      { error: 'Erro ao recomendar link wellness' },
      { status: 500 }
    )
  }
}

