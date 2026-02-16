/**
 * Monta o resumo em texto do perfil YLADA para injetar no system prompt do Noel.
 * @see docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md §4
 */

const SEGMENT_LABELS: Record<string, string> = {
  ylada: 'YLADA',
  med: 'Medicina',
  psi: 'Psicologia',
  psicanalise: 'Psicanálise',
  odonto: 'Odontologia',
  nutra: 'Nutra',
  coach: 'Coach',
  seller: 'Vendedor',
}

export interface YladaNoelProfileRow {
  segment: string
  profile_type?: string | null
  profession?: string | null
  category?: string | null
  sub_category?: string | null
  tempo_atuacao_anos?: number | null
  dor_principal?: string | null
  prioridade_atual?: string | null
  fase_negocio?: string | null
  metas_principais?: string | null
  objetivos_curto_prazo?: string | null
  modelo_atuacao?: unknown
  capacidade_semana?: number | null
  ticket_medio?: number | string | null
  modelo_pagamento?: string | null
  canais_principais?: unknown
  rotina_atual_resumo?: string | null
  frequencia_postagem?: string | null
  observacoes?: string | null
  area_specific?: Record<string, unknown> | null
}

function joinNonEmpty(parts: (string | undefined | null)[], sep = '. '): string {
  return parts.filter((p): p is string => p != null && String(p).trim() !== '').join(sep)
}

function formatModeloAtuacao(arr: unknown): string {
  if (!Array.isArray(arr) || arr.length === 0) return ''
  const labels: Record<string, string> = {
    consultorio: 'consultório',
    online: 'online',
    domicilio: 'domicílio',
    delivery: 'delivery',
    clinica: 'clínica',
  }
  return arr.map((c) => labels[String(c)] ?? c).join(', ')
}

function formatCanais(arr: unknown): string {
  if (!Array.isArray(arr) || arr.length === 0) return ''
  const labels: Record<string, string> = {
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    indicacao: 'indicação',
    trafego_pago: 'tráfego pago',
  }
  return arr.map((c) => labels[String(c)] ?? c).join(', ')
}

/**
 * Gera o texto de resumo do perfil para o Noel (diagnóstico + contexto + área).
 */
export function buildProfileResumo(profile: YladaNoelProfileRow | null): string {
  if (!profile) return ''

  const segmentLabel = SEGMENT_LABELS[profile.segment] ?? profile.segment
  const lines: string[] = []

  lines.push(`Segment: ${segmentLabel}.`)
  if (profile.profile_type) lines.push(`Tipo: ${profile.profile_type}.`)
  if (profile.profession) lines.push(`Profissão: ${profile.profession}.`)
  if (profile.category) lines.push(`Category: ${profile.category}.`)
  if (profile.sub_category) lines.push(`Sub_category: ${profile.sub_category}.`)

  if (profile.fase_negocio) {
    lines.push(`Fase: ${profile.fase_negocio}.`)
  }
  if (profile.dor_principal) {
    lines.push(`Dor principal: ${profile.dor_principal}.`)
  }
  if (profile.prioridade_atual) {
    lines.push(`Prioridade atual: ${profile.prioridade_atual}.`)
  }

  const modeloStr = formatModeloAtuacao(profile.modelo_atuacao)
  if (modeloStr) lines.push(`Modelo: ${modeloStr}.`)
  if (profile.capacidade_semana != null) {
    lines.push(`Capacidade: ${profile.capacidade_semana}/semana.`)
  }
  if (profile.ticket_medio != null && profile.ticket_medio !== '') {
    const ticket = typeof profile.ticket_medio === 'number' ? profile.ticket_medio : Number(profile.ticket_medio)
    if (!Number.isNaN(ticket)) lines.push(`Ticket médio: R$ ${ticket}.`)
  }
  if (profile.metas_principais) lines.push(`Meta: ${profile.metas_principais}.`)
  if (profile.objetivos_curto_prazo) lines.push(`Objetivos: ${profile.objetivos_curto_prazo}.`)

  const canaisStr = formatCanais(profile.canais_principais)
  if (canaisStr) lines.push(`Canais: ${canaisStr}.`)
  if (profile.rotina_atual_resumo) lines.push(`Rotina atual: ${profile.rotina_atual_resumo}.`)
  if (profile.frequencia_postagem) lines.push(`Frequência postagem: ${profile.frequencia_postagem}.`)

  const areaSpec = profile.area_specific && typeof profile.area_specific === 'object' ? profile.area_specific as Record<string, unknown> : {}
  const areaParts: string[] = []
  if (Array.isArray(areaSpec.especialidades) && areaSpec.especialidades.length > 0) {
    areaParts.push(`Especialidades: ${(areaSpec.especialidades as string[]).join(', ')}.`)
  }
  if (areaSpec.especialidade_outra && String(areaSpec.especialidade_outra).trim()) {
    areaParts.push(`Outra especialidade: ${areaSpec.especialidade_outra}.`)
  }
  if (Array.isArray(areaSpec.abordagens) && areaSpec.abordagens.length > 0) {
    areaParts.push(`Abordagens: ${(areaSpec.abordagens as string[]).join(', ')}.`)
  }
  if (Array.isArray(areaSpec.faixa_etaria) && areaSpec.faixa_etaria.length > 0) {
    areaParts.push(`Faixa etária: ${(areaSpec.faixa_etaria as string[]).join(', ')}.`)
  }
  if (areaSpec.oferta) areaParts.push(`Oferta: ${areaSpec.oferta}.`)
  if (areaSpec.categoria) areaParts.push(`Categoria: ${areaSpec.categoria}.`)
  if (areaParts.length > 0) lines.push(areaParts.join(' '))

  if (profile.observacoes) lines.push(`Observações: ${profile.observacoes}.`)

  return lines.join(' ')
}
