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
 * Áreas do Método YLADA — ordem sugerida para o grid público (home, profissionais, landings).
 * **seller** não aparece nas listagens públicas; interesse fora da lista → WhatsApp (ver componentes).
 */
const YLADA_LANDING_AREAS_BASE: Omit<YladaLandingArea, 'href'>[] = [
  { codigo: 'med', label: 'Médicos', slogan: 'Atrair pacientes que já entendem o valor da consulta', descricao: 'Para médicos e clínicas.' },
  { codigo: 'nutri', label: 'Nutricionistas', slogan: 'Explicar melhor o processo antes da primeira consulta', descricao: 'Para nutricionistas que querem atrair pacientes interessados.' },
  { codigo: 'psi', label: 'Psicólogos', slogan: 'Começar conversas com pacientes mais preparados', descricao: 'Para psicólogos e terapeutas.' },
  {
    codigo: 'psicanalise',
    label: 'Psicanalistas',
    slogan: 'Atrair analisandos mais preparados para o processo',
    descricao: 'Para psicanalistas e profissionais do setting analítico.',
  },
  { codigo: 'odonto', label: 'Odontologia', slogan: 'Mostrar o valor dos tratamentos antes da avaliação', descricao: 'Para dentistas e clínicas odontológicas.' },
  { codigo: 'estetica', label: 'Estética', slogan: 'Atrair clientes interessados em procedimentos', descricao: 'Para profissionais de estética.' },
  { codigo: 'coach', label: 'Coach', slogan: 'Começar conversas com clientes mais preparados', descricao: 'Para coaches (bem-estar, carreira, vida).' },
  { codigo: 'fitness', label: 'Fitness', slogan: 'Atrair alunos que já entendem o valor do treino', descricao: 'Para profissionais de fitness.' },
  { codigo: 'perfumaria', label: 'Perfumaria', slogan: 'Atrair clientes interessados em fragrâncias ideais', descricao: 'Para consultores de fragrância, vendedores especializados e lojas de perfume.' },
  {
    codigo: 'joias',
    label: 'Joias e bijuterias',
    slogan: 'Qualificar antes do preço e encher o WhatsApp de contexto',
    descricao: 'Para quem vende semijoias, bijuterias ou joias — loja, marca, revenda ou equipe.',
  },
]

/** Retorna áreas com href usando locale (ex: getYladaLandingAreas('es')) */
export function getYladaLandingAreas(locale: string): YladaLandingArea[] {
  return YLADA_LANDING_AREAS_BASE.map((a) => ({
    ...a,
    href: `/${locale}/${a.codigo === 'coach' ? 'coach' : a.codigo}`,
  }))
}

/** @deprecated Use getYladaLandingAreas(locale) para suporte multi-idioma */
export const YLADA_LANDING_AREAS: YladaLandingArea[] = getYladaLandingAreas('pt')
