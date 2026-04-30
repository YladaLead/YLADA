export const ESTETICA_CONSULT_FUNNEL_STAGES = [
  'entrada',
  'reuniao_agendada',
  'reuniao_feita',
  'pendente_pagamento',
  'pendente_cliente',
  'em_andamento',
] as const

export type EsteticaConsultFunnelStage = (typeof ESTETICA_CONSULT_FUNNEL_STAGES)[number]

export const ESTETICA_CONSULT_FUNNEL_COLUMNS: {
  key: EsteticaConsultFunnelStage
  label: string
  description: string
  border: string
  headerBg: string
}[] = [
  {
    key: 'entrada',
    label: 'Entrada',
    description: 'Primeiro contacto ou a posicionar no funil.',
    border: 'border-slate-200',
    headerBg: 'bg-slate-100/80',
  },
  {
    key: 'reuniao_agendada',
    label: 'Reunião agendada',
    description: 'Data marcada; ainda não realizada.',
    border: 'border-sky-200',
    headerBg: 'bg-sky-50/90',
  },
  {
    key: 'reuniao_feita',
    label: 'Reunião feita',
    description: 'Call ou presencial já realizada.',
    border: 'border-violet-200',
    headerBg: 'bg-violet-50/90',
  },
  {
    key: 'pendente_pagamento',
    label: 'Ficou de pagar',
    description: 'Follow-up de fecho / cobrança.',
    border: 'border-amber-200',
    headerBg: 'bg-amber-50/90',
  },
  {
    key: 'pendente_cliente',
    label: 'À espera da clínica',
    description: 'A pensar, enviar algo ou responder.',
    border: 'border-orange-200',
    headerBg: 'bg-orange-50/80',
  },
  {
    key: 'em_andamento',
    label: 'Em andamento',
    description: 'Material longo, remates, integração — fluxo ativo.',
    border: 'border-emerald-200',
    headerBg: 'bg-emerald-50/90',
  },
]

export function isEsteticaConsultFunnelStage(v: string): v is EsteticaConsultFunnelStage {
  return (ESTETICA_CONSULT_FUNNEL_STAGES as readonly string[]).includes(v)
}

export function normalizeEsteticaConsultFunnelStage(
  v: string | null | undefined
): EsteticaConsultFunnelStage {
  if (v && isEsteticaConsultFunnelStage(v.trim())) return v.trim() as EsteticaConsultFunnelStage
  return 'entrada'
}
