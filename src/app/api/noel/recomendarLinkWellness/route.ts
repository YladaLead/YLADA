import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'
import { recommendLink, type RecomendacaoContext } from '@/lib/noel-wellness/links-recommender'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl } from '@/lib/url-utils'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

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

    const palavrasChaveArray: string[] | undefined =
      typeof palavras_chave === 'string'
        ? palavras_chave
            .split(',')
            .map((k: string) => k.trim())
            .filter(Boolean)
        : Array.isArray(palavras_chave)
          ? palavras_chave.map((k: any) => String(k).trim()).filter(Boolean)
          : undefined

    const contexto: RecomendacaoContext = {
      tipoLead: tipo_lead || undefined,
      necessidadeIdentificada: necessidade || undefined,
      palavrasChave: palavrasChaveArray,
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
                  palavrasChaveArray?.some((k) => k.toLowerCase().includes('hom') || k.toLowerCase().includes('recrutamento'))
    
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
          // Gerar link personalizado baseado no código do link.
          // IMPORTANTE: a rota pública é /pt/wellness/[user-slug]/[tool-slug]
          // e o "tool-slug" correto costuma estar em user_templates.slug (ex: "agua"),
          // enquanto wellness_links.codigo tende a ser o slug do template (ex: "calculadora-agua").
          const codigoOriginal = String(link.codigo || '').trim()
          const codigoNormalizado = normalizeTemplateSlug(codigoOriginal, 'wellness')

          let toolSlugParaLink = codigoOriginal || codigoNormalizado

          try {
            const orParts = Array.from(
              new Set(
                [
                  codigoOriginal && `template_slug.eq.${codigoOriginal}`,
                  codigoNormalizado && `template_slug.eq.${codigoNormalizado}`,
                  codigoOriginal && `slug.eq.${codigoOriginal}`,
                  codigoNormalizado && `slug.eq.${codigoNormalizado}`,
                ].filter(Boolean) as string[]
              )
            )

            if (orParts.length > 0) {
              const { data: ferramentas } = await supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, created_at, title')
                .eq('user_id', user_id)
                .eq('profession', 'wellness')
                .eq('status', 'active')
                .or(orParts.join(','))

              if (ferramentas && ferramentas.length > 0) {
                const escolherMelhorFerramenta = (items: any[]) => {
                  return items
                    .filter((f) => f?.slug)
                    .sort((a, b) => {
                      // 1) slug mais curto (ex: "agua" melhor que "calculadora-de-agua")
                      const lengthDiff = String(a.slug).length - String(b.slug).length
                      if (lengthDiff !== 0) return lengthDiff

                      // 2) template_slug que bate exatamente com o normalizado/original
                      const aMatches =
                        a.template_slug === codigoNormalizado || a.template_slug === codigoOriginal
                      const bMatches =
                        b.template_slug === codigoNormalizado || b.template_slug === codigoOriginal
                      if (aMatches && !bMatches) return -1
                      if (!aMatches && bMatches) return 1

                      // 3) mais recente
                      return (
                        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                      )
                    })[0]
                }

                const melhor = escolherMelhorFerramenta(ferramentas)
                if (melhor?.slug) {
                  toolSlugParaLink = melhor.slug
                }
              }
            }
          } catch (err) {
            console.warn('⚠️ [recomendarLinkWellness] Falha ao buscar tool slug do usuário:', err)
          }

          linkPersonalizado = buildWellnessToolUrl(profile.user_slug, toolSlugParaLink)
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

