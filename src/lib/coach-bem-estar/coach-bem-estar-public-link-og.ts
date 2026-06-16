/**
 * Open Graph para links públicos `/pt/coach-bem-estar/{user}/{tool}`.
 * Recrutamento: artes em `public/images/og/pro-lideres/` (mesmo banco do Pro Líderes).
 * Vendas / calculadoras: `public/images/og/wellness/` via `og-image-map`.
 */
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { getProLideresPresetOpenGraphImageUrl } from '@/lib/pro-lideres/pro-lideres-preset-og-image'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import {
  getCoachBemEstarRecruitmentFluxos,
  getCoachBemEstarSalesFluxos,
} from '@/lib/coach-bem-estar/coach-bem-estar-fluxos'

export type CoachBemEstarFluxoTipo = 'recrutamento' | 'vendas'

function normalizarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function findCoachBemEstarFluxoByToolSlug(
  toolSlug: string
): { fluxo: FluxoCliente; tipo: CoachBemEstarFluxoTipo } | null {
  const slugNormalizado = normalizarSlug(toolSlug)

  for (const fluxo of getCoachBemEstarRecruitmentFluxos()) {
    if (normalizarSlug(fluxo.nome) === slugNormalizado || fluxo.id === slugNormalizado) {
      return { fluxo, tipo: 'recrutamento' }
    }
  }

  for (const fluxo of getCoachBemEstarSalesFluxos()) {
    if (normalizarSlug(fluxo.nome) === slugNormalizado || fluxo.id === slugNormalizado) {
      return { fluxo, tipo: 'vendas' }
    }
  }

  return null
}

export function extractCoachBemEstarFluxoFromTool(tool: {
  template_slug?: string | null
  content?: { fluxo?: { id: string }; tipo?: string } | null
  fluxo_tipo?: string | null
}): { fluxoId: string; tipo: CoachBemEstarFluxoTipo } | null {
  const fromContent = tool.content?.fluxo?.id
  const tipoRaw = tool.fluxo_tipo || tool.content?.tipo
  if (fromContent && (tipoRaw === 'recrutamento' || tipoRaw === 'vendas')) {
    return { fluxoId: fromContent, tipo: tipoRaw }
  }

  const templateSlug = tool.template_slug ?? ''
  const match = templateSlug.match(/^fluxo-(recrutamento|vendas)-(.+)$/i)
  if (match) {
    return { fluxoId: match[2], tipo: match[1].toLowerCase() as CoachBemEstarFluxoTipo }
  }

  return null
}

export function pareceSlugFluxoRecrutamentoCoach(toolSlug: string): boolean {
  const s = toolSlug.toLowerCase()
  return (
    s.includes('renda') ||
    s.includes('maes') ||
    s.includes('trabalhar') ||
    s.includes('recrut') ||
    s.includes('empreend') ||
    s.includes('negocio') ||
    s.includes('transicao') ||
    s.includes('consumo-renda') ||
    s.includes('digital') ||
    s.includes('comercial') ||
    s.includes('jovens')
  )
}

export function getCoachBemEstarOpenGraphImageUrl(params: {
  baseUrl: string
  toolSlug: string
  templateSlug?: string | null
  fluxoId?: string | null
  fluxoTipo?: CoachBemEstarFluxoTipo | null
}): string {
  const { baseUrl, toolSlug } = params
  const base = baseUrl.replace(/\/$/, '')

  const fromTool =
    params.fluxoId && params.fluxoTipo
      ? { fluxoId: params.fluxoId, tipo: params.fluxoTipo }
      : null
  const fromSlug = findCoachBemEstarFluxoByToolSlug(toolSlug)

  const fluxoId = fromTool?.fluxoId ?? fromSlug?.fluxo.id
  const tipo = fromTool?.tipo ?? fromSlug?.tipo

  if (tipo === 'recrutamento' && fluxoId) {
    return getProLideresPresetOpenGraphImageUrl(fluxoId, base, 'recruitment')
  }

  if (tipo === 'vendas' && fluxoId) {
    const slugCanonico = normalizeTemplateSlug(fluxoId)
    if (
      slugCanonico.includes('retencao') &&
      (slugCanonico.includes('inchaco') || slugCanonico.includes('inchaço'))
    ) {
      return `${base}/images/og/wellness/retencao-liquidos.png`
    }
    return absolutize(getFullOGImageUrl(slugCanonico, base, 'wellness'), base)
  }

  if (pareceSlugFluxoRecrutamentoCoach(toolSlug)) {
    const stem = normalizarSlug(toolSlug)
    return getProLideresPresetOpenGraphImageUrl(stem, base, 'recruitment')
  }

  const normalized = normalizeTemplateSlug(params.templateSlug || toolSlug)
  const wellnessUrl = getFullOGImageUrl(normalized, base, 'wellness')
  if (!wellnessUrl.includes('default.jpg')) {
    return absolutize(wellnessUrl, base)
  }

  return `${base}/images/og/pro-lideres/og-default-saude.jpg`
}

export function getCoachBemEstarOpenGraphText(params: {
  toolSlug: string
  toolTitle?: string | null
  toolDescription?: string | null
  templateSlug?: string | null
  fluxoNome?: string | null
  fluxoObjetivo?: string | null
  fluxoTipo?: CoachBemEstarFluxoTipo | null
}): { title: string; description: string } {
  const match = findCoachBemEstarFluxoByToolSlug(params.toolSlug)

  if (params.fluxoTipo === 'recrutamento' || match?.tipo === 'recrutamento') {
    const nome = params.fluxoNome || match?.fluxo.nome || params.toolTitle || 'Avaliação personalizada'
    const objetivo =
      params.fluxoObjetivo ||
      match?.fluxo.objetivo ||
      params.toolDescription ||
      'Responda em poucos minutos e descubra o próximo passo com quem te enviou o link.'
    return {
      title: nome,
      description: objetivo.length > 200 ? `${objetivo.slice(0, 197)}…` : objetivo,
    }
  }

  const slugCanonico = normalizeTemplateSlug(params.templateSlug || params.toolSlug)
  const ogMessages = getOGMessages(slugCanonico)
  const genericWellness = 'Ferramenta de Bem-Estar - WELLNESS'

  if (ogMessages.title && ogMessages.title !== genericWellness) {
    return {
      title: ogMessages.title.replace(/\s*-\s*WELLNESS\s*/gi, '').trim(),
      description: ogMessages.description,
    }
  }

  return {
    title: params.toolTitle || 'Ferramenta de bem-estar',
    description:
      params.toolDescription ||
      'Acesse ferramentas personalizadas de coaching de bem-estar',
  }
}

function absolutize(url: string, base: string): string {
  if (url.startsWith('http')) return url
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}
