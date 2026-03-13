/**
 * Contexto de performance dos links para o Noel sugerir melhorias.
 * Quando um diagnóstico tem baixa conversão (respostas suficientes, poucos cliques WhatsApp),
 * o Noel pode sugerir: "Esse diagnóstico poderia converter mais. Quer que eu sugira melhorias?"
 *
 * @see docs/APRESENTACAO-NUTRI-ARGUMENTOS.md (feedback PT)
 */

import { supabaseAdmin } from '@/lib/supabase'

const MIN_RESPONSES = 5
const LOW_CONVERSION_THRESHOLD = 10 // taxa < 10% = baixa conversão

export interface LinkPerformanceItem {
  link_id: string
  title: string
  slug: string
  url: string
  respostas: number
  cliques_whatsapp: number
  taxa: number
}

/**
 * Busca links do usuário com baixa conversão (respostas >= 5, taxa < 10%).
 * Retorna lista para o Noel sugerir melhorias.
 */
export async function getLinksWithLowConversion(
  userId: string,
  baseUrl: string
): Promise<LinkPerformanceItem[]> {
  if (!supabaseAdmin) return []

  const { data: links, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !links?.length) return []

  const linkIds = links.map((l) => l.id)

  // Contagem por link: total diagnósticos e cliques WhatsApp
  const { data: diagRows } = await supabaseAdmin
    .from('ylada_diagnosis_metrics')
    .select('link_id, clicked_whatsapp')
    .in('link_id', linkIds)

  const diagCountMap: Record<string, number> = {}
  const clickCountMap: Record<string, number> = {}
  for (const r of diagRows ?? []) {
    diagCountMap[r.link_id] = (diagCountMap[r.link_id] ?? 0) + 1
    if (r.clicked_whatsapp) {
      clickCountMap[r.link_id] = (clickCountMap[r.link_id] ?? 0) + 1
    }
  }

  const prefix = baseUrl.replace(/\/$/, '')
  const result: LinkPerformanceItem[] = []

  for (const link of links) {
    const respostas = diagCountMap[link.id] ?? 0
    const cliques = clickCountMap[link.id] ?? 0
    const taxa = respostas > 0 ? (cliques / respostas) * 100 : 0

    if (respostas >= MIN_RESPONSES && taxa < LOW_CONVERSION_THRESHOLD) {
      result.push({
        link_id: link.id,
        title: (link.title as string)?.trim() || link.slug,
        slug: link.slug,
        url: `${prefix}/l/${link.slug}`,
        respostas,
        cliques_whatsapp: cliques,
        taxa: Math.round(taxa * 10) / 10,
      })
    }
  }

  return result
}

/**
 * Formata o bloco de performance para o system prompt do Noel.
 */
export function formatLinkPerformanceForNoel(items: LinkPerformanceItem[]): string {
  if (items.length === 0) return ''

  const linhas = items.map(
    (i) =>
      `- "${i.title}": ${i.respostas} respostas, ${i.cliques_whatsapp} cliques WhatsApp, taxa ${i.taxa}%`
  )
  return (
    '\n[DIAGNÓSTICOS COM BAIXA CONVERSÃO — OPPORTUNIDADE DE MELHORIA]\n' +
    'O profissional tem links com muitas respostas mas poucos cliques no WhatsApp:\n\n' +
    linhas.join('\n') +
    '\n\n' +
    'REGRAS: Quando o profissional mencionar "meu diagnóstico", "meu link", "conversão", "resultados" ou similar, ' +
    'e houver pelo menos um link com baixa conversão acima, ofereça proativamente: ' +
    '"Esse diagnóstico poderia converter mais. Quer que eu sugira melhorias?" ' +
    'Sugestões concretas: trocar pergunta 3, adicionar pergunta emocional, melhorar CTA final. ' +
    'Se ele aceitar, use interpret + generate para criar versão melhorada.'
  )
}
