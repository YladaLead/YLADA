export type ProEsteticaSegmentCode = 'estetica-corporal' | 'estetica-capilar'

export type ProEsteticaSegmento = {
  code: ProEsteticaSegmentCode
  slug: 'corporal' | 'capilar'
  label: string
  description: string
  status: 'live' | 'coming_soon'
  painelHref: string
}

export const PRO_ESTETICA_SEGMENTOS: ProEsteticaSegmento[] = [
  {
    code: 'estetica-corporal',
    slug: 'corporal',
    label: 'Estetica Corporal',
    description: 'Fluxos para captacao, retencao e acompanhamento de clientes em tratamentos corporais.',
    status: 'live',
    painelHref: '/pro-estetica-corporal/painel',
  },
  {
    code: 'estetica-capilar',
    slug: 'capilar',
    label: 'Estetica Capilar',
    description: 'Trilha segmentada para diagnostico, recorrencia e conversao no nicho capilar.',
    status: 'live',
    painelHref: '/pro-estetica-capilar/painel',
  },
]

export const DEFAULT_PRO_ESTETICA_SEGMENT_CODE: ProEsteticaSegmentCode = 'estetica-corporal'

export function findProEsteticaSegmentByCode(code: string | null | undefined): ProEsteticaSegmento | null {
  if (!code) return null
  return PRO_ESTETICA_SEGMENTOS.find((segmento) => segmento.code === code) ?? null
}
