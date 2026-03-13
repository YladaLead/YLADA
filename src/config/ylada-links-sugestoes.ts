/**
 * Diagnósticos sugeridos por segmento — para reduzir fricção na criação de links.
 * Aparecem no topo da página Diagnósticos.
 */
import { FLOW_IDS } from './ylada-flow-catalog'

export interface SugestaoDiagnostico {
  title: string
  flow_id: string
  tema: string
}

const SUGESTOES_ESTETICA: SugestaoDiagnostico[] = [
  { title: 'Descubra o que pode estar travando os resultados da sua pele', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'pele' },
  { title: 'Seu tipo de pele pode estar sabotando sua rotina de skincare?', flow_id: FLOW_IDS.diagnostico_risco, tema: 'pele' },
  { title: 'Qual hábito pode estar causando manchas na sua pele?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'pele' },
]

const SUGESTOES_MED: SugestaoDiagnostico[] = [
  { title: 'O que pode estar travando seus resultados de saúde?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'saúde' },
  { title: 'Avalie seus sinais e receba orientação personalizada', flow_id: FLOW_IDS.diagnostico_risco, tema: 'saúde' },
  { title: 'Qual bloqueio pode estar afetando sua qualidade de vida?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'bem-estar' },
]

const SUGESTOES_ODONTO: SugestaoDiagnostico[] = [
  { title: 'O que pode estar travando sua saúde bucal?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'saúde bucal' },
  { title: 'Avalie seus hábitos e receba orientação', flow_id: FLOW_IDS.diagnostico_risco, tema: 'saúde bucal' },
]

const SUGESTOES_PSI: SugestaoDiagnostico[] = [
  { title: 'O que pode estar alimentando sua ansiedade?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'ansiedade' },
  { title: 'Avalie como a ansiedade aparece no seu dia a dia', flow_id: FLOW_IDS.diagnostico_risco, tema: 'ansiedade' },
]

const SUGESTOES_NUTRICAO: SugestaoDiagnostico[] = [
  { title: 'O que pode estar travando seu emagrecimento?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'emagrecimento' },
  { title: 'Qual seu tipo de fome?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'alimentação' },
  { title: 'Avalie sua relação com a alimentação', flow_id: FLOW_IDS.diagnostico_risco, tema: 'alimentação' },
]

const SUGESTOES_COACH: SugestaoDiagnostico[] = [
  { title: 'O que pode estar travando sua produtividade?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'produtividade' },
  { title: 'Qual bloqueio está afetando sua carreira?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'carreira' },
]

const SUGESTOES_DEFAULT: SugestaoDiagnostico[] = [
  { title: 'O que pode estar travando seus resultados?', flow_id: FLOW_IDS.diagnostico_bloqueio, tema: 'seu tema' },
  { title: 'Avalie sua situação e receba orientação', flow_id: FLOW_IDS.diagnostico_risco, tema: 'seu tema' },
]

export function getSugestoesDiagnostico(areaCodigo: string): SugestaoDiagnostico[] {
  const key = String(areaCodigo || '').toLowerCase()
  if (key === 'estetica') return SUGESTOES_ESTETICA
  if (key === 'med') return SUGESTOES_MED
  if (key === 'odonto') return SUGESTOES_ODONTO
  if (key === 'psi' || key === 'psicanalise') return SUGESTOES_PSI
  if (key === 'nutra' || key === 'nutricionista') return SUGESTOES_NUTRICAO
  if (key === 'coach') return SUGESTOES_COACH
  return SUGESTOES_DEFAULT
}

export function getLabelSegmentoSugestoes(areaCodigo: string): string {
  const labels: Record<string, string> = {
    estetica: 'estética',
    med: 'médicos',
    odonto: 'odontologia',
    psi: 'psicologia',
    psicanalise: 'psicanálise',
    nutra: 'nutrição',
    coach: 'coaching',
    seller: 'vendas',
    perfumaria: 'perfumaria',
    fitness: 'fitness',
  }
  return labels[areaCodigo?.toLowerCase() || ''] || 'sua área'
}
