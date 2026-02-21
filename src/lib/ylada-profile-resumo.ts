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
  flow_id?: string | null
  flow_version?: number | null
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

/** Sinais estruturados para o Noel e para UI (próximo passo sugerido). */
export interface YladaProfileSignals {
  foco?: 'agenda' | 'funil' | 'ticket' | 'autoridade'
  ticket_medio?: number
  canal_principal?: string
  gargalo?: string
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
    google: 'Google',
    convenio: 'convênio',
    parcerias_medicas: 'parcerias médicas',
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
  if (profile.flow_id) lines.push(`Flow: ${profile.flow_id} v${profile.flow_version ?? 1}.`)
  if (profile.category) lines.push(`Category: ${profile.category}.`)
  if (profile.sub_category) lines.push(`Sub_category: ${profile.sub_category}.`)

  if (profile.fase_negocio) {
    lines.push(`Fase: ${profile.fase_negocio}.`)
  }
  if (profile.dor_principal) {
    lines.push(`Dor principal: ${profile.dor_principal}.`)
    if (profile.dor_principal === 'outra') {
      const outraDor = profile.area_specific && typeof profile.area_specific === 'object' && (profile.area_specific as Record<string, unknown>).dor_principal_outra
      if (outraDor && String(outraDor).trim()) {
        lines.push(`Dor principal (outra): ${outraDor}.`)
      }
    }
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
  if (Array.isArray(areaSpec.publico_principal) && areaSpec.publico_principal.length > 0) {
    areaParts.push(`Público principal: ${(areaSpec.publico_principal as string[]).join(', ')}.`)
  }
  if (areaSpec.foco_principal) areaParts.push(`Foco principal: ${areaSpec.foco_principal}.`)
  if (Array.isArray(areaSpec.desperdicio_principal) && areaSpec.desperdicio_principal.length > 0) {
    areaParts.push(`Desperdício principal: ${(areaSpec.desperdicio_principal as string[]).join(', ')}.`)
  }
  if (areaSpec.modelo_receita) areaParts.push(`Modelo de receita: ${areaSpec.modelo_receita}.`)
  if (areaSpec.equipe_operacional) areaParts.push(`Equipe operacional: ${areaSpec.equipe_operacional}.`)
  if (areaSpec.area_estetica) areaParts.push(`Área estética: ${areaSpec.area_estetica}.`)
  if (areaSpec.estetica_tipo_atuacao) areaParts.push(`Tipo atuação (estética): ${areaSpec.estetica_tipo_atuacao}.`)
  if (areaSpec.odonto_voce_atende) areaParts.push(`Atende (odonto): ${areaSpec.odonto_voce_atende}.`)
  if (Array.isArray(areaSpec.publico_psi) && areaSpec.publico_psi.length > 0) {
    areaParts.push(`Público (psi): ${(areaSpec.publico_psi as string[]).join(', ')}.`)
  }
  if (areaSpec.modalidade_atendimento) areaParts.push(`Modalidade atendimento: ${areaSpec.modalidade_atendimento}.`)
  if (areaSpec.area_nutri) areaParts.push(`Área nutri: ${areaSpec.area_nutri}.`)
  if (areaSpec.modelo_entrega_coach) areaParts.push(`Modelo entrega (coach): ${areaSpec.modelo_entrega_coach}.`)
  if (Array.isArray(areaSpec.abordagens) && areaSpec.abordagens.length > 0) {
    areaParts.push(`Abordagens: ${(areaSpec.abordagens as string[]).join(', ')}.`)
  }
  if (Array.isArray(areaSpec.faixa_etaria) && areaSpec.faixa_etaria.length > 0) {
    areaParts.push(`Faixa etária: ${(areaSpec.faixa_etaria as string[]).join(', ')}.`)
  }
  if (areaSpec.oferta) areaParts.push(`Oferta: ${areaSpec.oferta}.`)
  if (areaSpec.categoria) areaParts.push(`Categoria: ${areaSpec.categoria}.`)
  if (profile.profession === 'outro' && areaSpec.atuacao_outra && String(areaSpec.atuacao_outra).trim()) {
    areaParts.push(`Atuação (outro): ${areaSpec.atuacao_outra}.`)
  }
  if (areaParts.length > 0) lines.push(areaParts.join(' '))

  if (profile.observacoes) lines.push(`Observações: ${profile.observacoes}.`)

  const signals = buildProfileSignals(profile)
  const signalParts: string[] = []
  if (signals.foco) signalParts.push(`Foco: ${signals.foco}.`)
  if (signals.canal_principal) signalParts.push(`Canal principal: ${signals.canal_principal}.`)
  if (signals.gargalo) signalParts.push(`Gargalo: ${signals.gargalo}.`)
  if (signalParts.length > 0) lines.push('[Sinais] ' + signalParts.join(' '))

  return lines.join(' ')
}

/**
 * Gera sinais estruturados a partir do perfil (foco, ticket, canal, gargalo).
 * Útil para o Noel padronizar decisões e para UI de "próximo passo sugerido".
 */
export function buildProfileSignals(profile: YladaNoelProfileRow | null): YladaProfileSignals {
  if (!profile) return {}
  const signals: YladaProfileSignals = {}
  const rawTicket = profile.ticket_medio != null && profile.ticket_medio !== ''
    ? (typeof profile.ticket_medio === 'number' ? profile.ticket_medio : Number(profile.ticket_medio))
    : NaN
  if (!Number.isNaN(rawTicket)) signals.ticket_medio = rawTicket

  const canais = profile.canais_principais
  if (Array.isArray(canais) && canais.length > 0) {
    const first = String(canais[0])
    const labels: Record<string, string> = {
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      indicacao: 'indicação',
      trafego_pago: 'tráfego pago',
      google: 'Google',
      convenio: 'convênio',
      parcerias_medicas: 'parcerias médicas',
    }
    signals.canal_principal = labels[first] ?? first
  }

  if (profile.profile_type === 'vendas') {
    if (profile.dor_principal === 'sem_leads' || profile.dor_principal === 'nao_converte') signals.foco = 'funil'
    else if (profile.dor_principal === 'ticket_baixo') signals.foco = 'ticket'
    else signals.foco = 'funil'
  } else {
    if (profile.dor_principal === 'agenda_vazia' || profile.dor_principal === 'agenda_instavel') signals.foco = 'agenda'
    else if (profile.dor_principal === 'nao_postar' || profile.dor_principal === 'sem_indicacao') signals.foco = 'autoridade'
    else if (profile.dor_principal) signals.foco = 'agenda'
  }

  if (profile.dor_principal) signals.gargalo = profile.dor_principal

  return signals
}
