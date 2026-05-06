/**
 * Configuração da Biblioteca de ferramentas e links (YLADA).
 * Estrutura: Quizzes | Calculadoras | Links prontos, filtrados por segmento e tema.
 * Temas = Top 12 estratégicos (energia, intestino, metabolismo, etc.).
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 * @see src/config/ylada-pilares-temas.ts
 */

import { TEMAS_ESTRATEGICOS, type PilarCode } from './ylada-pilares-temas'
import { getAllTemasBiblioteca, getTemaLabel as getTemaLabelFromSegmentos, getTemasPorSegmento } from './ylada-segmentos-dores-objetivos'

export type BibliotecaTipo = 'quiz' | 'calculadora' | 'link'

export type BibliotecaSegmentCode =
  | 'nutrition'
  | 'nutrition_vendedor'
  | 'medicine'
  | 'psychology'
  | 'psychoanalysis'
  | 'dentistry'
  | 'aesthetics'
  | 'fitness'
  | 'perfumaria'
  | 'joias'

/** Segmentos para filtro da biblioteca (alinhado com diagnosis-segment). */
export const BIBLIOTECA_SEGMENTOS: { value: BibliotecaSegmentCode; label: string }[] = [
  { value: 'nutrition', label: 'Nutrição' },
  { value: 'nutrition_vendedor', label: 'Vendedores Nutracêuticos e suplementos' },
  { value: 'medicine', label: 'Médicos' },
  { value: 'psychology', label: 'Psicólogos' },
  { value: 'psychoanalysis', label: 'Psicanálise' },
  { value: 'dentistry', label: 'Odontologia' },
  { value: 'aesthetics', label: 'Estética' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'perfumaria', label: 'Perfumaria e fragrâncias' },
  { value: 'joias', label: 'Joias e bijuterias' },
]

/** Top 12 temas estratégicos — filtro universal da biblioteca (não depende de segmento). */
export const BIBLIOTECA_TEMAS = TEMAS_ESTRATEGICOS.map((t) => ({
  value: t.value,
  label: t.label,
}))

/** Lista completa de temas (Top 12 + todos os segmentos). Sempre fixa — profissional vê todas as opções. */
export const BIBLIOTECA_TEMAS_COMPLETOS = getAllTemasBiblioteca(BIBLIOTECA_TEMAS)

/** Retorna temas para filtro da biblioteca. Com segmento: só temas desse segmento. Sem segmento: todos. */
export function getTemasParaBiblioteca(segmentCode?: BibliotecaSegmentCode | ''): { value: string; label: string }[] {
  if (segmentCode) {
    const temas = getTemasPorSegmento(segmentCode)
    if (temas.length > 0) return temas
  }
  return BIBLIOTECA_TEMAS_COMPLETOS
}

/** Retorna label legível de um tema (Top 12 + segmentos). */
export function getTemaLabel(temaValue: string): string {
  return getTemaLabelFromSegmentos(temaValue, BIBLIOTECA_TEMAS)
}

/** @deprecated Use BIBLIOTECA_TEMAS. Mantido para compatibilidade. */
export const BIBLIOTECA_TEMAS_POR_SEGMENTO: Record<BibliotecaSegmentCode, string[]> = {
  nutrition: BIBLIOTECA_TEMAS.map((t) => t.value),
  nutrition_vendedor: BIBLIOTECA_TEMAS.map((t) => t.value),
  medicine: BIBLIOTECA_TEMAS.map((t) => t.value),
  psychology: BIBLIOTECA_TEMAS.map((t) => t.value),
  psychoanalysis: BIBLIOTECA_TEMAS.map((t) => t.value),
  dentistry: BIBLIOTECA_TEMAS.map((t) => t.value),
  aesthetics: BIBLIOTECA_TEMAS.map((t) => t.value),
  fitness: BIBLIOTECA_TEMAS.map((t) => t.value),
  perfumaria: BIBLIOTECA_TEMAS.map((t) => t.value),
  joias: [
    'joias_estilo_pessoal',
    'joias_classica_moderna',
    'joias_pedra_curiosidade',
    'joias_ouro_prata',
    'joias_ocasiao',
    'joias_compra_impulso',
    'joias_mix_colares',
    'joias_brinco_rosto',
    'joias_erros_comuns',
    'joias_ajuste_visual',
    'joias_presente_ideal',
    'joias_minimal_ou_chamativo',
  ],
}

/**
 * Mapeamento profession → segmento da biblioteca (para "(seu perfil)").
 *
 * NOTA: Segmentos da biblioteca usam códigos em inglês (aesthetics, psychology, dentistry, fitness)
 * enquanto as áreas/rotas usam códigos em português (estetica, psi, odonto, fitness).
 * O mapeamento AREA_TO_BIBLIOTECA e PROFESSION_TO_BIBLIOTECA faz essa tradução.
 */
const PROFESSION_TO_BIBLIOTECA: Record<string, BibliotecaSegmentCode> = {
  vendedor_suplementos: 'nutrition_vendedor',
  vendedor_cosmeticos: 'aesthetics',
  vendedor_perfumes: 'perfumaria',
  perfumista: 'perfumaria',
  medico: 'medicine',
  cardiologista: 'medicine',
  endocrinologista: 'medicine',
  gastroenterologista: 'medicine',
  psi: 'psychology',
  psicanalise: 'psychoanalysis',
  terapeuta: 'psychology',
  psiquiatra: 'psychology',
  odonto: 'dentistry',
  nutricionista: 'nutrition',
  estetica: 'aesthetics',
  fitness: 'fitness',
  personal_trainer: 'fitness',
  coach_fitness: 'fitness',
  coach: 'fitness',
  vendedor_servicos: 'nutrition_vendedor',
  vendedor_produtos: 'nutrition_vendedor',
  vendedor: 'nutrition_vendedor',
  outro: 'nutrition',
}

/**
 * Mapeamento areaCodigo (rota) → segmento da biblioteca.
 * areaCodigo = código da rota (estetica, psi, odonto, fitness, med, etc.)
 * Biblioteca usa segmentos em inglês (aesthetics, psychology, dentistry, fitness, medicine).
 */
const AREA_TO_BIBLIOTECA: Partial<Record<string, BibliotecaSegmentCode>> = {
  estetica: 'aesthetics',
  med: 'medicine',
  psi: 'psychology',
  psicanalise: 'psychoanalysis',
  odonto: 'dentistry',
  nutra: 'nutrition_vendedor',
  coach: 'fitness',
  perfumaria: 'perfumaria',
  fitness: 'fitness',
  joias: 'joias',
  nutri: 'nutrition',
  seller: 'nutrition_vendedor',
  ylada: 'nutrition',
}

/**
 * user_profiles.perfil (Supabase) → segmento da biblioteca.
 * Usado em /pt/links (areaCodigo ylada), onde a rota não indica o segmento do profissional.
 */
const USER_PERFIL_TO_BIBLIOTECA: Partial<Record<string, BibliotecaSegmentCode>> = {
  nutri: 'nutrition',
  estetica: 'aesthetics',
  med: 'medicine',
  psi: 'psychology',
  psicanalise: 'psychoanalysis',
  odonto: 'dentistry',
  fitness: 'fitness',
  coach: 'fitness',
  nutra: 'nutrition_vendedor',
  perfumaria: 'perfumaria',
  joias: 'joias',
  seller: 'nutrition_vendedor',
  wellness: 'nutrition',
  'coach-bem-estar': 'fitness',
}

/** Deriva segmento da biblioteca a partir de user_profiles.perfil (matriz YLADA). */
export function getBibliotecaSegmentFromUserPerfil(perfil: string | null | undefined): BibliotecaSegmentCode | null {
  const p = (perfil || '').toLowerCase().trim()
  if (!p) return null
  return USER_PERFIL_TO_BIBLIOTECA[p] ?? null
}

/** Deriva segmento da biblioteca a partir da área (rota). */
export function getBibliotecaSegmentFromArea(areaCodigo: string | null | undefined): BibliotecaSegmentCode | null {
  const area = (areaCodigo || '').toLowerCase().trim()
  return area && AREA_TO_BIBLIOTECA[area] ? AREA_TO_BIBLIOTECA[area]! : null
}

/** Deriva segmento da biblioteca a partir do perfil (profession). */
export function getBibliotecaSegmentFromProfile(
  profession: string | null | undefined
): BibliotecaSegmentCode {
  const prof = (profession || '').toLowerCase().trim()
  return PROFESSION_TO_BIBLIOTECA[prof] ?? 'nutrition'
}

/** Temas que recebem selo "Mais usado" (alta conversão / prova social). */
export const TEMAS_MAIS_USADOS = [
  'peso_gordura',
  'emagrecimento',
  'metabolismo',
  'intestino',
  'energia',
  'pele',
  'vitalidade_geral',
  'joias_estilo_pessoal',
  'joias_ouro_prata',
  'joias_presente_ideal',
] as const

export function isTemaMaisUsado(tema: string): boolean {
  return (TEMAS_MAIS_USADOS as readonly string[]).includes(tema)
}

/** Linha da biblioteca `/pt/estetica/links` (query `linha`: `terapia-capilar` / `estetica-corporal`, legado `terapia=` e slugs curtos) — só para personalizar a dica do Noel. */
export type NoelDicaEsteticaLinha = 'todos' | 'capilar' | 'corporal'

/** Dica do Noel para a biblioteca (por segmento). Em `/pt/estetica/links`, passe `esteticaLinha` para alinhar ao filtro capilar/corporal. */
export function getDicaNoelBiblioteca(
  segmentCode: BibliotecaSegmentCode | null,
  esteticaLinha?: NoelDicaEsteticaLinha | null,
): string {
  if (!segmentCode) return ''
  if (segmentCode === 'aesthetics' && esteticaLinha === 'corporal') {
    return 'Noel: em estética corporal, fluxos de contorno, retenção, celulite e “expectativa de sessões” costumam abrir conversa com intenção real — use também os quizzes de ordem de protocolo e agenda.'
  }
  if (segmentCode === 'aesthetics' && esteticaLinha === 'capilar') {
    return 'Noel: em estética capilar, queda, couro cabeludo e hidratação geram resposta rápida; envie o link com uma pergunta curta no WhatsApp ou no story.'
  }
  if (segmentCode === 'aesthetics' && esteticaLinha === 'todos') {
    return 'Noel: use o filtro Linha (estética capilar ou estética corporal) para achar o modelo certo. A sugestão do dia acima já traz um ângulo pronto para postar ou mandar no direct.'
  }
  const dicas: Partial<Record<BibliotecaSegmentCode, string>> = {
    nutrition: 'Comece pelo diagnóstico de Metabolismo ou Emagrecimento. São os que mais geram conversas com clientes.',
    nutrition_vendedor: 'Comece pelo diagnóstico de Metabolismo ou Emagrecimento. São os que mais geram conversas.',
    medicine: 'Comece por Metabolismo, Energia ou Emagrecimento. São os que mais geram demanda de consultas.',
    aesthetics: 'Comece por Idade da pele, Tipo de pele ou Cuidados com a pele. São os que mais geram conversas.',
    fitness: 'Comece por Treino, Energia ou Metabolismo. São os que mais engajam alunos.',
    psychology: 'Comece por Estresse, Sono ou Autoconhecimento. São os que mais geram primeiros contatos.',
    psychoanalysis:
      'Comece por Autoconhecimento, Ansiedade ou Relacionamentos. Ajuste o tom ao setting analítico quando for publicar.',
    dentistry: 'Comece por Saúde bucal ou Clareamento. São os que mais geram agendamentos.',
    perfumaria: 'Comece pelo diagnóstico de perfil olfativo. É o que mais qualifica e converte leads.',
    joias: 'Comece por estilo pessoal, ouro/prata ou “minimalista vs chamativo” — geram identificação rápida e convite a comentar ou chamar no WhatsApp sem começar por preço.',
  }
  return dicas[segmentCode] ?? 'Escolha um diagnóstico para criar seu link em um clique e começar a captar clientes.'
}

/** Uso principal do item: Marketing (atrair) ou CRM (aprofundar) ou ambos. */
export type UsoBiblioteca = 'marketing' | 'crm' | 'ambos'

/** Situação de uso (organização por objetivo do profissional). Alinhado ao Método YLADA: Atrair → Filtrar → Conversar → Manter. */
export type SituacaoBiblioteca = 'gerar_contatos' | 'iniciar_conversa' | 'entender_cliente' | 'reativar'

/** As 4 situações universais: por que o profissional está usando a biblioteca. */
export const BIBLIOTECA_SITUACOES: {
  value: SituacaoBiblioteca
  label: string
  description: string
  /** Quais usos (marketing/crm/ambos) entram nesta situação. */
  usos: UsoBiblioteca[]
}[] = [
  {
    value: 'gerar_contatos',
    label: 'Gerar novos contatos',
    description: 'Diagnósticos para postar e atrair pessoas.',
    usos: ['marketing', 'ambos'],
  },
  {
    value: 'iniciar_conversa',
    label: 'Iniciar conversa com interessados',
    description: 'Para quem já demonstrou interesse.',
    usos: ['marketing', 'ambos'],
  },
  {
    value: 'entender_cliente',
    label: 'Entender melhor meu cliente',
    description: 'Diagnósticos para aprofundar o atendimento.',
    usos: ['crm'],
  },
  {
    value: 'reativar',
    label: 'Reativar clientes',
    description: 'Diagnósticos para retomar contato.',
    usos: ['crm'],
  },
]

/** Opções para filtro por situação (dropdown). */
export const BIBLIOTECA_SITUACOES_OPTIONS: { value: '' | SituacaoBiblioteca; label: string }[] = [
  { value: '', label: 'Todas as situações' },
  ...BIBLIOTECA_SITUACOES.map((s) => ({ value: s.value as '' | SituacaoBiblioteca, label: s.label })),
]

/** Verifica se um item (por uso) entra na situação. */
export function itemCaiNaSituacao(uso: UsoBiblioteca, situacao: SituacaoBiblioteca): boolean {
  const config = BIBLIOTECA_SITUACOES.find((s) => s.value === situacao)
  return config ? config.usos.includes(uso) : false
}

/** Opções para filtro por uso na biblioteca (legado; preferir situações). */
export const BIBLIOTECA_USO_OPTIONS: { value: '' | UsoBiblioteca; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'marketing', label: '📣 Marketing – gerar novos contatos' },
  { value: 'crm', label: '💬 CRM – aprofundar com clientes' },
]

/** Texto "Quando usar" por tema (orientação estratégica). meta.quando_usar do item sobrescreve quando existir. */
const QUANDO_USAR_POR_TEMA: Record<string, string> = {
  metabolismo: 'Ideal para postar no Instagram ou enviar para quem diz que não consegue emagrecer.',
  peso_gordura: 'Perfeito para quem quer emagrecer e não sabe por onde começar. Use em posts ou no primeiro contato.',
  emagrecimento: 'Ideal para stories e bio. Gera curiosidade e inicia conversa com quem busca resultado.',
  intestino: 'Perfeito para pessoas que relatam inchaço, constipação ou desconforto digestivo.',
  inchaço_retencao: 'Use com quem reclama de inchaço ou retenção. Bom para stories e follow-up.',
  energia: 'Excelente para iniciar conversa com quem sente cansaço frequente ou pouca disposição.',
  vitalidade_geral: 'Ideal para quem busca mais energia e bem-estar. Funciona bem em posts e no primeiro contato.',
  estresse: 'Perfeito para quem menciona ansiedade, estresse ou sobrecarga. Use para qualificar o lead.',
  sono: 'Use com quem tem dificuldade para dormir ou acorda cansado. Gera engajamento rápido.',
  foco_concentracao: 'Bom para profissionais e estudantes. Use em conteúdo sobre produtividade.',
  pele: 'Ideal para postar no Instagram ou enviar para quem quer cuidar da pele. Gera conversas sobre tratamentos.',
  alimentacao: 'Perfeito para quem quer melhorar a alimentação. Use em posts ou no primeiro contato.',
  habitos: 'Use para aprofundar com quem já é cliente e quer evoluir hábitos.',
  rotina: 'Ideal para acompanhar clientes ativos e qualificar rotina.',
  joias_estilo_pessoal: 'Para a cliente final se reconhecer — ótimo em story, direct e bio do link.',
  joias_classica_moderna: 'Pergunta rápida que gera comentário (“sou clássica!”).',
  joias_pedra_curiosidade: 'Curiosidade e significado (entretenimento; não é orientação de saúde).',
  joias_ouro_prata: 'Formato viral: divide audiência e aumenta compartilhamento.',
  joias_ocasiao: 'Alta intenção: trabalho, festa, date — qualifica antes do catálogo.',
  joias_compra_impulso: 'Faz refletir sem julgar; abre conversa sobre peças-chave e coleção.',
  joias_mix_colares: 'Stack e proporção — posiciona você como referência de combinação.',
  joias_brinco_rosto: 'Convite a DM com dúvida de formato; gera pedido de foto.',
  joias_erros_comuns: 'Educa com leveza; autoridade sem humilhar.',
  joias_ajuste_visual: '“Pequenos ajustes” — sensação de transformação sem promessa milagrosa.',
  joias_presente_ideal: 'Marque amiga/mãe/irmã: altamente compartilhável.',
  joias_minimal_ou_chamativo: 'Reels/trend: resposta rápida e alta conclusão do quiz.',
  saude_bucal: 'Perfeito para stories e bio. Gera agendamentos para avaliação.',
  clareamento: 'Use com quem pergunta sobre clareamento. Alta intenção de compra.',
  treino: 'Ideal para captar alunos. Use em posts sobre resultados e consistência.',
  perfil_olfativo: 'Perfeito para qualificar leads na perfumaria. Use no Instagram ou WhatsApp.',
  autoestima: 'Ideal para quem quer melhorar a autoestima. Use em stories ou no primeiro contato.',
  rotina_cuidados: 'Perfeito para aprofundar com clientes. Use para qualificar rotina de skincare.',
  sensibilidade_pele: 'Use com quem tem pele sensível. Gera conversas sobre tratamentos adequados.',
}

export function getQuandoUsar(tema: string, meta?: { quando_usar?: string } | null): string {
  if (meta?.quando_usar && typeof meta.quando_usar === 'string') return meta.quando_usar
  const key = (tema || '').toLowerCase().trim()
  return QUANDO_USAR_POR_TEMA[key] ?? 'Use em posts, stories ou no primeiro contato para iniciar conversa.'
}

/** Uso principal por tema (marketing = atrair; crm = aprofundar; ambos = serve para os dois). */
const USO_PRINCIPAL_POR_TEMA: Record<string, UsoBiblioteca> = {
  metabolismo: 'marketing',
  peso_gordura: 'marketing',
  emagrecimento: 'marketing',
  intestino: 'marketing',
  inchaço_retencao: 'marketing',
  energia: 'marketing',
  vitalidade_geral: 'marketing',
  estresse: 'marketing',
  sono: 'marketing',
  foco_concentracao: 'marketing',
  pele: 'marketing',
  alimentacao: 'ambos',
  habitos: 'crm',
  rotina: 'crm',
  saude_bucal: 'marketing',
  clareamento: 'marketing',
  treino: 'marketing',
  perfil_olfativo: 'marketing',
  joias_estilo_pessoal: 'marketing',
  joias_classica_moderna: 'marketing',
  joias_pedra_curiosidade: 'marketing',
  joias_ouro_prata: 'marketing',
  joias_ocasiao: 'marketing',
  joias_compra_impulso: 'marketing',
  joias_mix_colares: 'marketing',
  joias_brinco_rosto: 'marketing',
  joias_erros_comuns: 'marketing',
  joias_ajuste_visual: 'marketing',
  joias_presente_ideal: 'marketing',
  joias_minimal_ou_chamativo: 'marketing',
  autoestima: 'marketing',
  rotina_cuidados: 'crm',
  sensibilidade_pele: 'marketing',
}

export function getUsoPrincipal(tema: string, meta?: { uso_principal?: string } | null): UsoBiblioteca {
  if (meta?.uso_principal === 'marketing' || meta?.uso_principal === 'crm' || meta?.uso_principal === 'ambos') {
    return meta.uso_principal
  }
  const key = (tema || '').toLowerCase().trim()
  return USO_PRINCIPAL_POR_TEMA[key] ?? 'marketing'
}

/** Temas para "Sugestão do Noel" (3 diagnósticos recomendados) por segmento. Ordem = prioridade. */
const SUGESTAO_NOEL_TEMAS: Partial<Record<BibliotecaSegmentCode, [string, string, string]>> = {
  nutrition: ['peso_gordura', 'metabolismo', 'vitalidade_geral'],
  nutrition_vendedor: ['metabolismo', 'peso_gordura', 'energia'],
  medicine: ['metabolismo', 'energia', 'peso_gordura'],
  aesthetics: ['pele', 'cabelo', 'unhas', 'sobrancelha', 'maquiagem', 'autoestima', 'rotina_cuidados'],
  fitness: ['treino', 'energia', 'metabolismo'],
  psychology: ['estresse', 'sono', 'vitalidade_geral'],
  psychoanalysis: ['autoconhecimento', 'ansiedade', 'equilibrio_emocional'],
  dentistry: ['saude_bucal', 'clareamento', 'saude_bucal'],
  perfumaria: ['perfil_olfativo', 'perfil_olfativo', 'perfil_olfativo'],
  joias: ['joias_estilo_pessoal', 'joias_ouro_prata', 'joias_presente_ideal'],
}

/** Retorna os 3 temas recomendados para "Comece por aqui" / Sugestão do Noel. */
export function getSugestaoNoelTemas(segmentCode: BibliotecaSegmentCode | null): string[] {
  if (!segmentCode) return ['metabolismo', 'peso_gordura', 'vitalidade_geral']
  const temas = SUGESTAO_NOEL_TEMAS[segmentCode]
  return temas ? [...temas] : ['metabolismo', 'peso_gordura', 'vitalidade_geral']
}

/**
 * Gatilho de criação: "Ideia pronta de diagnóstico".
 * Ideias pré-geradas; o Noel "escolhe" uma por dia (índice por dia) para reduzir esforço do usuário.
 * Cada ideia aponta para um tema existente na biblioteca (mesmo diagnóstico, ângulo/título diferente).
 */
export interface IdeiaRapidaNoel {
  /** Texto de gancho: "Hoje muitas pessoas estão falando sobre..." / pergunta. */
  texto: string
  /** Tema da biblioteca (energia, metabolismo, etc.) — mapeia para um item existente. */
  tema: string
  /** Título sugerido para o link (ângulo da ideia). Se vazio, usa o título do item. */
  titulo_sugerido?: string
}

export const IDEIAS_RAPIDAS_NOEL: IdeiaRapidaNoel[] = [
  {
    texto: 'Hoje muitas pessoas estão falando sobre cansaço e falta de energia. Quer criar um diagnóstico rápido sobre isso?',
    tema: 'energia',
    titulo_sugerido: 'Seu nível de energia está baixo?',
  },
  {
    texto: 'O que pode estar travando seu emagrecimento? É um dos temas que mais gera conversas. Quer usar?',
    tema: 'emagrecimento',
    titulo_sugerido: 'O que pode estar travando seu emagrecimento?',
  },
  {
    texto: 'Sua rotina está sabotando sua saúde? Um diagnóstico rápido ajuda a iniciar essa conversa.',
    tema: 'rotina',
    titulo_sugerido: 'Sua rotina está sabotando sua saúde?',
  },
  {
    texto: 'Metabolismo travado é uma queixa comum. Que tal um diagnóstico que gera engajamento?',
    tema: 'metabolismo',
    titulo_sugerido: 'O que pode estar travando seu metabolismo?',
  },
  {
    texto: 'Intestino e digestão são temas quentes. Um diagnóstico rápido abre a conversa.',
    tema: 'intestino',
    titulo_sugerido: 'Como está sua digestão e seu intestino?',
  },
  {
    texto: 'Estresse e ansiedade estão em alta. Um diagnóstico rápido qualifica o lead.',
    tema: 'estresse',
    titulo_sugerido: 'Como está seu nível de estresse?',
  },
  {
    texto: 'Sono e descanso: todo mundo quer dormir melhor. Quer criar um diagnóstico sobre isso?',
    tema: 'sono',
    titulo_sugerido: 'Sua noite de sono está te ajudando ou atrapalhando?',
  },
  {
    texto: 'Vitalidade e disposição geram muita curiosidade. Diagnóstico rápido, resultado na hora.',
    tema: 'vitalidade_geral',
    titulo_sugerido: 'Como está sua vitalidade e disposição?',
  },
  {
    texto: 'Peso e gordura: um diagnóstico que converte bem. Quer usar essa ideia hoje?',
    tema: 'peso_gordura',
    titulo_sugerido: 'O que pode estar travando seu emagrecimento?',
  },
  {
    texto: 'Hábitos fazem a diferença. Um diagnóstico rápido para quem quer evoluir.',
    tema: 'habitos',
    titulo_sugerido: 'Seus hábitos estão favorecendo sua saúde?',
  },
  {
    texto: 'Pele e cuidados: tema que gera muitas conversas. Criar diagnóstico agora?',
    tema: 'pele',
    titulo_sugerido: 'O que sua pele está precisando?',
  },
  {
    texto: 'Foco e concentração interessam a muitos. Diagnóstico rápido para engajar.',
    tema: 'foco_concentracao',
    titulo_sugerido: 'Sua mente está no ritmo que você precisa?',
  },
  {
    texto: 'Inchaço e retenção são queixas frequentes. Um diagnóstico abre a conversa.',
    tema: 'inchaço_retencao',
    titulo_sugerido: 'O que pode estar causando seu inchaço?',
  },
  {
    texto: 'Treino e resultados: diagnóstico que engaja alunos. Quer usar essa ideia?',
    tema: 'treino',
    titulo_sugerido: 'Seu treino está gerando os resultados que você quer?',
  },
  {
    texto: 'Alimentação é porta de entrada. Diagnóstico rápido para quem quer melhorar.',
    tema: 'alimentacao',
    titulo_sugerido: 'Sua alimentação está alinhada com seu objetivo?',
  },
]

/** Ideias rápidas para biblioteca em /pt/joias/links (sem nutrição/emagrecimento). */
const IDEIAS_RAPIDAS_JOIAS: IdeiaRapidaNoel[] = [
  {
    texto:
      'Noel: em bijuterias, o que mais viraliza é a CLIENTE se reconhecendo — um quiz de estilo no link puxa comentário e direct.',
    tema: 'joias_estilo_pessoal',
    titulo_sugerido: 'Qual estilo de bijuteria combina com sua personalidade?',
  },
  {
    texto: '“Ouro ou prata” continua sendo um dos ganchos mais compartilhados; use no story com CTA para o link.',
    tema: 'joias_ouro_prata',
    titulo_sugerido: 'Ouro ou prata: o que mais valoriza sua pele?',
  },
  {
    texto: 'Presente errado dói; um quiz “para ela” gera marcação de amigas e conversa qualificada.',
    tema: 'joias_presente_ideal',
    titulo_sugerido: 'Qual bijuteria seria o presente ideal para ela?',
  },
  {
    texto: 'Minimalista vs chamativo é pergunta binária perfeita para reels — termina rápido e vira lead.',
    tema: 'joias_minimal_ou_chamativo',
    titulo_sugerido: 'Minimalista ou chamativo: o que combina mais com você?',
  },
  {
    texto: 'Pedras com curiosidade (sem promessa de saúde) geram identificação; bom para bio e primeiro toque.',
    tema: 'joias_pedra_curiosidade',
    titulo_sugerido: 'Qual pedra combina com sua energia no momento?',
  },
  {
    texto: 'Ocasião (trabalho x festa) qualifica intenção antes de você mandar catálogo — menos “só me manda preço”.',
    tema: 'joias_ocasiao',
    titulo_sugerido: 'Qual acessório combina com seu próximo evento?',
  },
]

/** Ideias por área da estética (vinculadas ao perfil area_estetica). */
const IDEIAS_RAPIDAS_ESTETICA: Record<string, IdeiaRapidaNoel[]> = {
  facial: [
    {
      texto: 'Noel: em estética facial, “o que sua pele precisa” abre conversa sem prometer milagre — bom para story ou direct.',
      tema: 'pele',
      titulo_sugerido: 'O que sua pele está precisando?',
    },
    {
      texto: 'Noel: rotina de skincare mal montada gera fricção na venda de procedimento; um quiz educa antes do orçamento.',
      tema: 'rotina_cuidados',
      titulo_sugerido: 'Sua rotina de skincare funciona?',
    },
    {
      texto: 'Noel: rejuvenescimento é tema sensível; prefira pergunta leve e encaminhamento para avaliação presencial.',
      tema: 'rejuvenescimento',
      titulo_sugerido: 'Sua pele reflete sua idade?',
    },
  ],
  corporal: [
    {
      texto: 'Noel: celulite é um dos ganchos que mais geram conversa em estética corporal — vale um quiz curto no link.',
      tema: 'celulite',
      titulo_sugerido: 'O que pode estar causando sua celulite?',
    },
    {
      texto: 'Noel: quando o foco é corpo, “pele” entra como textura e firmeza; use para falar de protocolo sem prometer milagre.',
      tema: 'pele',
      titulo_sugerido: 'Descubra o que pode estar travando os benefícios da sua pele',
    },
    {
      texto: 'Noel: flacidez costuma aparecer na conversa antes do espelho “confirmar”; qualifique com diagnóstico leve.',
      tema: 'flacidez',
      titulo_sugerido: 'Você tem sinais de flacidez que ainda não percebeu?',
    },
    {
      texto: 'Noel: inchaço e retenção desanimam na balança; um fluxo educativo alinha expectativa antes da drenagem ou tecnologia.',
      tema: 'inchaço_retencao',
      titulo_sugerido: 'Seu corpo está acumulando retenção de líquido?',
    },
    {
      texto: 'Noel: antes de protocolo fechado, ajude a cliente a nomear o que trava — hábito e prioridade entram no mesmo pacote.',
      tema: 'habitos',
      titulo_sugerido: 'O que mais te impede de investir no seu corpo agora?',
    },
    {
      texto: 'Noel: “mapa de zonas” organiza prioridade e ajuda você a sugerir pacote com critério.',
      tema: 'peso_gordura',
      titulo_sugerido: 'Quais zonas do seu corpo mais te incomodam hoje?',
    },
    {
      texto: 'Noel: entre drenagem, modeladora e tecnologia, quem responde um quiz chega menos perdida na primeira avaliação.',
      tema: 'inchaço_retencao',
      titulo_sugerido: 'Seu corpo pede drenagem, modeladora ou tecnologia primeiro?',
    },
    {
      texto: 'Noel: objetivo e região mudam o equipamento; este ângulo evita “me indica tudo” no WhatsApp.',
      tema: 'peso_gordura',
      titulo_sugerido: 'Qual tecnologia corporal faz mais sentido para o seu objetivo agora?',
    },
    {
      texto: 'Noel: alinhar prazo com frequência evita frustração — ótimo gancho antes de fechar pacote.',
      tema: 'peso_gordura',
      titulo_sugerido: 'Quantas sessões cabem no seu prazo e na sua rotina?',
    },
    {
      texto: 'Noel: quem empilha tudo na mesma semana perde ritmo; falar em camadas educa e qualifica.',
      tema: 'habitos',
      titulo_sugerido: 'Seu protocolo corporal precisa de quantas camadas?',
    },
    {
      texto: 'Noel: intervalo e combinação no mesmo dia são dúvidas reais; um quiz vira ponte para você explicar o cronograma.',
      tema: 'habitos',
      titulo_sugerido: 'Sua agenda de sessões está ajudando ou atrapalhando o resultado?',
    },
  ],
  capilar: [
    {
      texto: 'Noel: em estética capilar, quem responde um quiz curto já chega no salão com contexto — ótimo para qualificar antes da cadeira.',
      tema: 'cabelo',
      titulo_sugerido: 'Seu cabelo está recebendo os cuidados certos?',
    },
    {
      texto: 'Queda e couro cabeludo são temas quentes; um diagnóstico leve no link costuma gerar mais resposta que post genérico.',
      tema: 'cabelo',
      titulo_sugerido: 'O que pode estar afetando a saúde do seu cabelo?',
    },
    {
      texto: 'Hidratação e porosidade confundem muita gente; um fluxo simples educa e abre conversa sobre protocolo.',
      tema: 'cabelo',
      titulo_sugerido: 'Seu cabelo está realmente hidratado?',
    },
  ],
  unhas: [
    { texto: 'Suas unhas estão fortes e saudáveis?', tema: 'unhas', titulo_sugerido: 'Suas unhas estão fortes?' },
    { texto: 'O que suas unhas dizem sobre sua saúde?', tema: 'unhas', titulo_sugerido: 'O que suas unhas revelam?' },
    { texto: 'Suas cutículas estão saudáveis?', tema: 'unhas', titulo_sugerido: 'Como estão suas cutículas?' },
  ],
  sobrancelha: [
    { texto: 'Qual formato de sobrancelha combina com você?', tema: 'sobrancelha', titulo_sugerido: 'Qual formato combina com você?' },
    { texto: 'Sua sobrancelha valoriza seu rosto?', tema: 'sobrancelha', titulo_sugerido: 'Sua sobrancelha valoriza seu rosto?' },
    { texto: 'Você sabe como preencher suas sobrancelhas?', tema: 'sobrancelha', titulo_sugerido: 'Como preencher sua sobrancelha?' },
  ],
  maquiagem: [
    { texto: 'Qual maquiagem valoriza seu tipo de pele?', tema: 'maquiagem', titulo_sugerido: 'Qual maquiagem valoriza sua pele?' },
    { texto: 'Sua base combina com seu tom de pele?', tema: 'maquiagem', titulo_sugerido: 'Sua base está certa?' },
    { texto: 'Você sabe qual look combina com você?', tema: 'maquiagem', titulo_sugerido: 'Qual look combina com você?' },
  ],
  harmonizacao: [
    { texto: 'Sua pele está protegida contra o envelhecimento?', tema: 'rejuvenescimento', titulo_sugerido: 'Sua pele está protegida?' },
    { texto: 'O que sua pele está precisando?', tema: 'pele', titulo_sugerido: 'O que sua pele está precisando?' },
  ],
  depilacao_laser: [
    { texto: 'Sua pele está preparada para depilação a laser?', tema: 'pele', titulo_sugerido: 'Sua pele está preparada?' },
    { texto: 'O que sua pele está precisando?', tema: 'pele', titulo_sugerido: 'O que sua pele está precisando?' },
  ],
  integrativa: [
    { texto: 'O que sua pele está precisando?', tema: 'pele', titulo_sugerido: 'O que sua pele está precisando?' },
    { texto: 'Sua aparência está alinhada com como você quer se sentir?', tema: 'autoestima', titulo_sugerido: 'Sua aparência reflete o que você sente?' },
  ],
  outro: [
    { texto: 'O que sua pele está precisando?', tema: 'pele', titulo_sugerido: 'O que sua pele está precisando?' },
    { texto: 'Sua aparência está alinhada com como você quer se sentir?', tema: 'autoestima', titulo_sugerido: 'Sua aparência reflete o que você sente?' },
  ],
}

/** Ideias rápidas só corpo (Pro Estética Corporal / biblioteca com subscope). */
export const IDEIAS_RAPIDAS_ESTETICA_CORPORAIS: IdeiaRapidaNoel[] = IDEIAS_RAPIDAS_ESTETICA.corporal

export const IDEIAS_RAPIDAS_ESTETICA_CAPILAR: IdeiaRapidaNoel[] = IDEIAS_RAPIDAS_ESTETICA.capilar

/** Retorna a "ideia do dia" para o gatilho de criação (índice estável por dia, sem IA). */
export function getIdeiaRapidaDoDia(options?: {
  segmentCode?: BibliotecaSegmentCode | null
  areaEspecifica?: Record<string, unknown> | null
}): IdeiaRapidaNoel {
  const dayIndex = Math.floor(Date.now() / 86400000)

  if (options?.segmentCode === 'joias') {
    const idx = dayIndex % IDEIAS_RAPIDAS_JOIAS.length
    return IDEIAS_RAPIDAS_JOIAS[idx]!
  }

  if (options?.segmentCode === 'aesthetics' && options?.areaEspecifica) {
    const areaEstetica = (options.areaEspecifica.area_estetica as string)?.toLowerCase()?.trim()
    const ideias = areaEstetica && IDEIAS_RAPIDAS_ESTETICA[areaEstetica]
      ? IDEIAS_RAPIDAS_ESTETICA[areaEstetica]
      : IDEIAS_RAPIDAS_ESTETICA.facial
    const idx = dayIndex % ideias.length
    return ideias[idx]!
  }

  const idx = dayIndex % IDEIAS_RAPIDAS_NOEL.length
  return IDEIAS_RAPIDAS_NOEL[idx]!
}

/**
 * Títulos adaptados por segmento (diagnóstico base → variação por profissão).
 * Mesma estrutura de perguntas, contexto diferente. Quando existir, o card mostra este título em vez do titulo base.
 */
const TITULOS_ADAPTADOS: Partial<Record<string, Partial<Record<BibliotecaSegmentCode, string>>>> = {
  metabolismo: {
    nutrition: 'Descubra o que pode estar travando seu emagrecimento',
    nutrition_vendedor: 'Descubra o que pode estar travando os resultados dos seus clientes',
    medicine: 'Descubra o que pode estar travando a evolução do seu paciente',
    aesthetics: 'Descubra o que pode estar travando os resultados da sua pele',
    fitness: 'Descubra o que pode estar travando sua evolução física',
    psychology: 'Descubra o que pode estar travando seu bem-estar emocional',
    psychoanalysis: 'Descubra o que pode estar pedindo escuta no seu momento de vida',
    dentistry: 'Descubra o que pode estar travando a saúde da sua boca',
    perfumaria: 'Descubra o que pode estar travando sua escolha de fragrância',
  },
  peso_gordura: {
    nutrition: 'O que pode estar travando seu emagrecimento?',
    fitness: 'O que pode estar travando sua evolução no treino?',
  },
  energia: {
    nutrition: 'Como está sua disposição e vitalidade?',
    aesthetics: 'Sua pele está com a energia que deveria?',
    fitness: 'Sua energia está acompanhando seu treino?',
    psychology: 'Como está seu nível de energia e bem-estar?',
    psychoanalysis: 'O que mais pede atenção no que você sente hoje?',
  },
  vitalidade_geral: {
    nutrition: 'Como está sua vitalidade e disposição?',
    aesthetics: 'Sua pele reflete sua vitalidade?',
    fitness: 'Sua vitalidade está no nível que você quer?',
  },
  pele: {
    aesthetics: 'Descubra o que pode estar travando os benefícios da sua pele',
  },
  rotina_cuidados: {
    aesthetics: 'Sua rotina de skincare está favorecendo ou prejudicando sua pele?',
  },
  autoestima: {
    aesthetics: 'Sua aparência está alinhada com como você quer se sentir?',
  },
}

/** Retorna o título do diagnóstico adaptado ao segmento, quando existir. Senão retorna null (use o titulo do item). */
export function getTituloAdaptado(tema: string, segmentCode: BibliotecaSegmentCode | null): string | null {
  if (!segmentCode || !tema) return null
  const key = (tema || '').toLowerCase().trim()
  const porSegmento = TITULOS_ADAPTADOS[key]
  if (!porSegmento) return null
  return porSegmento[segmentCode] ?? null
}

/** Tipos de ferramenta na biblioteca. */
export const BIBLIOTECA_TIPOS: { value: BibliotecaTipo; label: string; description: string }[] = [
  { value: 'quiz', label: 'Quizzes', description: 'Perguntas que geram diagnóstico personalizado' },
  { value: 'calculadora', label: 'Calculadoras', description: 'Ferramentas que calculam projeção ou resultado' },
  { value: 'link', label: 'Links prontos', description: 'Links completos prontos para usar' },
]

/** Origem do conteúdo do item da biblioteca. */
export type BibliotecaSourceType =
  | 'ylada_template'
  | 'wellness_fluxo'
  | 'wellness_template'
  | 'nutri_quiz'
  | 'custom'

/** Item da biblioteca (espelha ylada_biblioteca_itens). */
export interface BibliotecaItem {
  id: string
  tipo: BibliotecaTipo
  /** Segmentos para os quais o item é relevante (um item pode aparecer em vários). */
  segment_codes: BibliotecaSegmentCode[]
  /** Tema (Top 12 ou específico do segmento: energia, intestino, pele, etc.). */
  tema: string
  titulo: string
  description?: string
  /** Dor principal que o item aborda (ex: Dificuldade de emagrecer). */
  dor_principal?: string | null
  /** Objetivo principal que o item ajuda a alcançar (ex: Emagrecer com saúde). */
  objetivo_principal?: string | null
  /** Origem do conteúdo. */
  source_type: BibliotecaSourceType
  /** ID do recurso de origem (UUID ou string). */
  source_id?: string | null
  /** Template YLADA com conteúdo (perguntas copiadas da Nutri). Null = usa flow + getQuizByTema. */
  template_id?: string | null
  flow_id?: string | null
  architecture?: string | null
  /** Pilar universal (energia, metabolismo, digestao, mente, habitos). */
  pilar?: PilarCode | null
  meta?: Record<string, unknown>
  sort_order: number
  active: boolean
  created_at?: string
  updated_at?: string
}
