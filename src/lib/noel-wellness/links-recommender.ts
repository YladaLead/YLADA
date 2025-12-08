/**
 * Links Recommender - Sistema de Recomendação de Links Wellness
 * Recomenda links baseado em contexto, perfil e necessidade
 */

import { supabaseAdmin } from '@/lib/supabase'

export type TipoLead = 'frio' | 'morno' | 'quente'
export type ObjetivoLink = 'captacao' | 'diagnostico' | 'engajamento' | 'recrutamento'
export type CategoriaLink =
  | 'saude-bem-estar'
  | 'diagnostico-profundo'
  | 'transformacao-desafios'
  | 'oportunidade-negocio'

export interface LinkWellness {
  id: string
  codigo: string
  nome: string
  categoria: CategoriaLink
  objetivo: ObjetivoLink
  publico_alvo?: string
  quando_usar?: string
  script_curto?: string
  url_template?: string
}

export interface RecomendacaoContext {
  tipoLead?: TipoLead
  necessidadeIdentificada?: string
  palavrasChave?: string[]
  objetivo?: ObjetivoLink
  categoria?: CategoriaLink
}

/**
 * Mapeia palavras-chave para links apropriados
 */
const palavrasChaveMap: Record<string, string[]> = {
  'cansado': ['calculadora-agua', 'quiz-energetico', 'diagnostico-eletrolitos'],
  'sem energia': ['quiz-energetico', 'diagnostico-eletrolitos'],
  'quer emagrecer': ['avaliacao-perfil-metabolico', 'pronto-emagrecer-saude', 'calculadora-calorias'],
  'intestino': ['diagnostico-sintomas-intestinais', 'avaliacao-intolerancias'],
  'renda extra': ['renda-extra-imediata', 'maes-trabalhar-casa', 'trabalhar-apenas-links'],
  'trabalhar de casa': ['maes-trabalhar-casa', 'querem-trabalhar-digital-online'],
  'negócio': ['renda-extra-imediata', 'ja-consome-produtos-bem-estar', 'transformar-consumo-renda'],
  'ansiedade': ['avaliacao-fome-emocional', 'quiz-tipo-fome'],
  'metabolismo': ['avaliacao-perfil-metabolico', 'risco-sindrome-metabolica'],
}

/**
 * Recomenda link baseado em contexto
 */
export async function recommendLink(
  contexto: RecomendacaoContext
): Promise<LinkWellness | null> {

  try {
    let query = supabaseAdmin
      .from('wellness_links')
      .select('*')
      .eq('ativo', true)

    // Filtrar por objetivo se fornecido
    if (contexto.objetivo) {
      query = query.eq('objetivo', contexto.objetivo)
    }

    // Filtrar por categoria se fornecida
    if (contexto.categoria) {
      query = query.eq('categoria', contexto.categoria)
    }

    // Lógica baseada em tipo de lead
    if (contexto.tipoLead === 'frio') {
      query = query.in('categoria', ['saude-bem-estar'])
      query = query.eq('objetivo', 'captacao')
    } else if (contexto.tipoLead === 'morno') {
      query = query.in('categoria', ['diagnostico-profundo'])
      query = query.eq('objetivo', 'diagnostico')
    } else if (contexto.tipoLead === 'quente') {
      query = query.in('categoria', ['transformacao-desafios', 'oportunidade-negocio'])
    }

    // Buscar links
    const { data, error } = await query.order('ordem', { ascending: true }).limit(10)

    if (error) {
      console.error('[Links Recommender] Erro ao buscar links:', error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    // Se houver palavras-chave, priorizar links relacionados
    if (contexto.palavrasChave && contexto.palavrasChave.length > 0) {
      const linksPrioritarios: string[] = []
      
      contexto.palavrasChave.forEach((palavra) => {
        const palavraLower = palavra.toLowerCase()
        Object.keys(palavrasChaveMap).forEach((chave) => {
          if (palavraLower.includes(chave)) {
            linksPrioritarios.push(...palavrasChaveMap[chave])
          }
        })
      })

      if (linksPrioritarios.length > 0) {
        const linkPrioritario = data.find((link) =>
          linksPrioritarios.includes(link.codigo)
        )
        if (linkPrioritario) {
          return linkPrioritario
        }
      }
    }

    // Retornar primeiro link da lista
    return data[0]
  } catch (error) {
    console.error('[Links Recommender] Erro:', error)
    return null
  }
}

/**
 * Explica por que um link foi recomendado
 */
export function explainWhy(link: LinkWellness, contexto: RecomendacaoContext): string {
  let explicacao = `Recomendo o link "${link.nome}" porque `

  if (contexto.tipoLead === 'frio') {
    explicacao += 'é um link leve, perfeito para iniciar conversas sem pressionar.'
  } else if (contexto.tipoLead === 'morno') {
    explicacao += 'vai te ajudar a aprofundar o diagnóstico e entender melhor a necessidade.'
  } else if (contexto.tipoLead === 'quente') {
    explicacao += 'é ideal para leads que já demonstraram interesse e estão prontos para ação.'
  }

  if (link.quando_usar) {
    explicacao += ` ${link.quando_usar}`
  }

  return explicacao
}

/**
 * Gera script personalizado para enviar o link
 */
export function generateScript(link: LinkWellness, nomeLead?: string): string {
  if (link.script_curto) {
    return link.script_curto.replace('[nome]', nomeLead || 'você')
  }

  // Script genérico se não houver script curto
  return `Oi ${nomeLead || 'você'}! Tenho um ${link.nome.toLowerCase()} que pode te ajudar. Quer testar?`
}

/**
 * Gera follow-up baseado no link preenchido
 */
export function generateFollowUp(
  linkPreenchido: LinkWellness,
  resultados?: any
): string {
  let followUp = `Oi! Você conseguiu fazer o ${linkPreenchido.nome.toLowerCase()}? `

  if (resultados) {
    followUp += `Vi que seu resultado foi [resultado]. Isso mostra que você precisa de [interpretação]. `
  }

  followUp += 'Quer que eu te ajude com o próximo passo?'

  return followUp
}

/**
 * Recomenda sequência de links (jornada)
 */
export async function recommendLinkSequence(
  contexto: RecomendacaoContext,
  quantidade: number = 3
): Promise<LinkWellness[]> {
  const sequencia: LinkWellness[] = []

  // Passo 1: Link leve (captação)
  const link1 = await recommendLink({
    ...contexto,
    objetivo: 'captacao',
    categoria: 'saude-bem-estar',
  })
  if (link1) sequencia.push(link1)

  // Passo 2: Link de diagnóstico
  if (quantidade >= 2) {
    const link2 = await recommendLink({
      ...contexto,
      objetivo: 'diagnostico',
      categoria: 'diagnostico-profundo',
    })
    if (link2) sequencia.push(link2)
  }

  // Passo 3: Link de conversão (desafio ou negócio)
  if (quantidade >= 3) {
    const link3 = await recommendLink({
      ...contexto,
      objetivo: contexto.objetivo === 'recrutamento' ? 'recrutamento' : 'engajamento',
      categoria:
        contexto.objetivo === 'recrutamento'
          ? 'oportunidade-negocio'
          : 'transformacao-desafios',
    })
    if (link3) sequencia.push(link3)
  }

  return sequencia
}
