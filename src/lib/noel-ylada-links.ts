/**
 * Links ativos do usuário para o Noel YLADA — contexto para o mentor sugerir/lembrar
 * e para o sistema saber o que já foi criado.
 * @see docs/ANALISE-LINKS-BRIEF-POR-PERFIL-E-PROXIMOS-PASSOS.md
 */

import { supabaseAdmin } from '@/lib/supabase'

export interface NoelYladaLinkItem {
  nome: string
  tipo: 'quiz' | 'calculadora'
  url: string
}

/**
 * Busca os links ativos do usuário (ylada_links com status active).
 * Retorna lista enxuta para injetar no system prompt do Noel.
 */
export async function getNoelYladaLinks(
  userId: string,
  baseUrl: string
): Promise<NoelYladaLinkItem[]> {
  if (!supabaseAdmin) return []

  const { data: links, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, template_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error || !links?.length) return []

  const templateIds = [...new Set(links.map((l) => l.template_id).filter(Boolean))]
  const { data: templates } = templateIds.length
    ? await supabaseAdmin
        .from('ylada_link_templates')
        .select('id, name, type')
        .in('id', templateIds)
    : { data: [] }

  const templateMap = new Map<string, { name: string; type: string }>()
  for (const t of templates ?? []) {
    templateMap.set(t.id, { name: t.name, type: t.type })
  }

  const prefix = baseUrl.replace(/\/$/, '')
  return links.map((row) => {
    const t = row.template_id ? templateMap.get(row.template_id) : null
    const nome = (row.title as string)?.trim() || t?.name || 'Link'
    const type = t?.type === 'calculator' ? 'calculadora' : 'quiz'
    const url = `${prefix}/l/${row.slug}`
    return { nome, tipo: type as 'quiz' | 'calculadora', url }
  })
}

/**
 * Monta o texto de "links ativos" para o system prompt do Noel.
 */
export function formatLinksAtivosParaNoel(links: NoelYladaLinkItem[]): string {
  if (!links.length) return ''
  const linhas = links.map((l) => `- ${l.nome} (${l.tipo}): ${l.url}`)
  return '\n[LINKS ATIVOS DO PROFISSIONAL — já criados por ele]\n' + linhas.join('\n') + '\nUse esses links quando fizer sentido sugerir um que ele já tem. Para criar um link novo, o sistema fará isso por você quando o profissional pedir.'
}
