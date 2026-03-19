/**
 * Áreas do Método YLADA com landing pages públicas.
 * Todas tratadas igualmente — sem ênfase em nenhuma área específica.
 */
export interface YladaLandingArea {
  codigo: string
  label: string
  href: string
  /** Frase curta que fala com a dor do visitante — aumenta identificação e clique */
  slogan: string
  descricao: string
}

/**
 * Áreas do Método YLADA — ordem sugerida para o grid:
 * Linha 1: Saúde (Médicos, Nutricionistas, Psicólogos, Odontologia)
 * Linha 2: Estética e bem-estar + Mercado de vendas (Estética, Fitness, Perfumaria, Vendedores)
 */
const YLADA_LANDING_AREAS_BASE: Omit<YladaLandingArea, 'href'>[] = [
  { codigo: 'med', label: 'Médicos', slogan: 'Atrair pacientes que já entendem o valor da consulta', descricao: 'Para médicos e clínicas.' },
  { codigo: 'nutri', label: 'Nutricionistas', slogan: 'Explicar melhor o processo antes da primeira consulta', descricao: 'Para nutricionistas que querem atrair pacientes interessados.' },
  { codigo: 'psi', label: 'Psicólogos', slogan: 'Começar conversas com pacientes mais preparados', descricao: 'Para psicólogos e psicanalistas.' },
  { codigo: 'odonto', label: 'Odontologia', slogan: 'Mostrar o valor dos tratamentos antes da avaliação', descricao: 'Para dentistas e clínicas odontológicas.' },
  { codigo: 'estetica', label: 'Estética', slogan: 'Atrair clientes interessados em procedimentos', descricao: 'Para profissionais de estética.' },
  { codigo: 'coach', label: 'Coach', slogan: 'Começar conversas com clientes mais preparados', descricao: 'Para coaches (bem-estar, carreira, vida).' },
  { codigo: 'fitness', label: 'Fitness', slogan: 'Atrair alunos que já entendem o valor do treino', descricao: 'Para profissionais de fitness.' },
  { codigo: 'perfumaria', label: 'Perfumaria', slogan: 'Atrair clientes interessados em fragrâncias ideais', descricao: 'Para consultores de fragrância, vendedores especializados e lojas de perfume.' },
  { codigo: 'seller', label: 'Vendedores', slogan: 'Iniciar conversas com clientes mais qualificados', descricao: 'Profissionais que vendem produtos ou serviços consultivos podem usar diagnósticos para gerar conversas mais qualificadas.' },
]

/** Retorna áreas com href usando locale (ex: getYladaLandingAreas('es')) */
export function getYladaLandingAreas(locale: string): YladaLandingArea[] {
  return YLADA_LANDING_AREAS_BASE.map((a) => ({
    ...a,
    href: `/${locale}/${a.codigo === 'seller' ? 'seller' : a.codigo === 'coach' ? 'coach' : a.codigo}`,
  }))
}

/** @deprecated Use getYladaLandingAreas(locale) para suporte multi-idioma */
export const YLADA_LANDING_AREAS: YladaLandingArea[] = getYladaLandingAreas('pt')
