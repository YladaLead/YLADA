/**
 * Pilares universais e temas de bem-estar para o YLADA.
 * 5 pilares = arquitetura interna do motor.
 * Top 12 temas = filtros da biblioteca e sugestões do Noel.
 * Lista completa = catálogo para referência e expansão.
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 */

export type PilarCode = 'energia' | 'metabolismo' | 'digestao' | 'mente' | 'habitos'

/** 5 pilares universais — arquitetura interna do motor de diagnóstico. */
export const YLADA_PILARES: { value: PilarCode; label: string; description: string }[] = [
  { value: 'energia', label: 'Energia', description: 'Energia física, mental, disposição, cansaço, fadiga' },
  { value: 'metabolismo', label: 'Metabolismo', description: 'Ativação metabólica, queima de gordura, termogênese, regulação' },
  { value: 'digestao', label: 'Digestão', description: 'Intestino, microbiota, digestão, absorção, sensibilidade digestiva' },
  { value: 'mente', label: 'Mente', description: 'Estresse, ansiedade, foco, concentração, equilíbrio emocional' },
  { value: 'habitos', label: 'Hábitos', description: 'Rotina, alimentação, sono, atividade física, consistência' },
]

/** Top 12 temas estratégicos — filtros da biblioteca e sugestões do Noel. */
export const TEMAS_ESTRATEGICOS: { value: string; label: string; pilar: PilarCode }[] = [
  { value: 'energia', label: 'Energia', pilar: 'energia' },
  { value: 'intestino', label: 'Intestino', pilar: 'digestao' },
  { value: 'metabolismo', label: 'Metabolismo', pilar: 'metabolismo' },
  { value: 'inchaço_retencao', label: 'Inchaço / retenção', pilar: 'metabolismo' },
  { value: 'alimentacao', label: 'Alimentação', pilar: 'habitos' },
  { value: 'hidratacao', label: 'Hidratação', pilar: 'habitos' },
  { value: 'peso_gordura', label: 'Peso / gordura', pilar: 'metabolismo' },
  { value: 'estresse', label: 'Estresse', pilar: 'mente' },
  { value: 'sono', label: 'Sono', pilar: 'habitos' },
  { value: 'foco_concentracao', label: 'Foco / concentração', pilar: 'mente' },
  { value: 'rotina_saudavel', label: 'Rotina saudável', pilar: 'habitos' },
  { value: 'vitalidade_geral', label: 'Vitalidade geral', pilar: 'energia' },
]

/** Mapeamento tema → pilar (para uso interno). */
export const TEMA_TO_PILAR: Record<string, PilarCode> = Object.fromEntries(
  TEMAS_ESTRATEGICOS.map((t) => [t.value, t.pilar])
) as Record<string, PilarCode>

/** Lista completa de temas organizada por pilar. */
export const TEMAS_POR_PILAR: Record<PilarCode, string[]> = {
  energia: [
    'energia física',
    'energia mental',
    'cansaço constante',
    'falta de disposição',
    'cansaço após refeições',
    'energia pela manhã',
    'energia à tarde',
    'energia para treinar',
    'energia para trabalhar',
    'queda de energia durante o dia',
    'fadiga mental',
    'sensação de esgotamento',
    'vitalidade',
    'disposição',
  ],
  metabolismo: [
    'metabolismo lento',
    'ativação metabólica',
    'queima de gordura',
    'retenção de líquidos',
    'inchaço corporal',
    'digestão lenta',
    'termogênese',
    'regulação metabólica',
    'resistência metabólica',
    'desintoxicação natural',
    'controle de peso',
    'redução de gordura corporal',
    'emagrecimento saudável',
    'manutenção de peso',
    'controle de apetite',
    'controle de porções',
    'redução de gordura abdominal',
    'definição corporal',
    'equilíbrio massa magra e gordura',
  ],
  digestao: [
    'intestino preso',
    'intestino irregular',
    'saúde intestinal',
    'microbiota intestinal',
    'digestão difícil',
    'estufamento abdominal',
    'gases',
    'sensibilidade digestiva',
    'funcionamento intestinal diário',
    'regularidade intestinal',
  ],
  mente: [
    'estresse',
    'ansiedade',
    'sobrecarga mental',
    'pressão do dia a dia',
    'equilíbrio emocional',
    'controle de pensamentos negativos',
    'estabilidade emocional',
    'clareza mental',
    'tranquilidade mental',
    'concentração',
    'foco',
    'distração frequente',
    'produtividade diária',
    'organização mental',
    'clareza de pensamento',
    'energia mental para trabalhar',
    'capacidade de decisão',
  ],
  habitos: [
    'qualidade da alimentação',
    'frequência das refeições',
    'consumo de alimentos naturais',
    'controle de açúcar',
    'controle de carboidratos',
    'alimentação equilibrada',
    'alimentação consciente',
    'alimentação emocional',
    'compulsão alimentar',
    'organização alimentar',
    'consumo de água',
    'desidratação leve',
    'hidratação ao longo do dia',
    'hidratação durante atividade física',
    'quantidade ideal de água',
    'consumo de líquidos saudáveis',
    'rotina de hidratação',
    'frequência de exercícios',
    'regularidade de treinos',
    'motivação para treinar',
    'sedentarismo',
    'rotina de atividade física',
    'exercícios para saúde',
    'exercícios para emagrecimento',
    'exercícios para energia',
    'recuperação muscular',
    'condicionamento físico',
    'qualidade do sono',
    'dificuldade para dormir',
    'sono leve',
    'sono interrompido',
    'rotina de sono',
    'cansaço ao acordar',
    'recuperação durante o sono',
    'horas de sono adequadas',
    'organização da rotina',
    'falta de rotina saudável',
    'excesso de compromissos',
    'falta de tempo para cuidar da saúde',
    'hábitos diários',
    'disciplina pessoal',
    'consistência nos hábitos',
    'rotina equilibrada',
    'qualidade de vida',
    'sensação geral de bem-estar',
    'equilíbrio corpo e mente',
    'sensação de saúde',
    'motivação para cuidar da saúde',
    'estilo de vida saudável',
    'construção de hábitos saudáveis',
    'mudança de estilo de vida',
    'autocuidado',
    'consciência corporal',
    'vida equilibrada',
    'vida ativa',
    'vida saudável sustentável',
  ],
}

/** Temas adicionais (imunidade, desintoxicação, hormonal, pele, performance, longevidade). */
export const TEMAS_ESPECIAIS: Record<string, string[]> = {
  imunidade: ['imunidade baixa', 'resistência a doenças', 'recuperação após doenças', 'fortalecimento do organismo', 'defesa natural do corpo'],
  desintoxicacao: ['acúmulo de toxinas', 'sensação de peso no corpo', 'limpeza metabólica', 'apoio ao fígado', 'redução de inflamação'],
  hormonal: ['oscilações hormonais', 'TPM', 'menopausa', 'desequilíbrio hormonal', 'energia hormonal', 'bem-estar hormonal'],
  pele: ['saúde da pele', 'brilho da pele', 'oleosidade', 'acne', 'envelhecimento da pele', 'hidratação da pele', 'aparência saudável'],
  performance: ['performance física', 'performance mental', 'resistência física', 'resistência mental', 'alta performance no trabalho', 'alta performance no esporte'],
  longevidade: ['envelhecimento saudável', 'vitalidade ao longo dos anos', 'prevenção de desgaste físico', 'qualidade de vida na maturidade'],
}

/** Retorna o pilar de um tema (Top 12 ou lista completa). */
export function getPilarFromTema(tema: string): PilarCode | null {
  const normalized = (tema || '').toLowerCase().trim()
  if (TEMA_TO_PILAR[normalized]) return TEMA_TO_PILAR[normalized]
  for (const [pilar, temas] of Object.entries(TEMAS_POR_PILAR)) {
    if (temas.some((t) => t.toLowerCase() === normalized || normalized.includes(t.toLowerCase()))) {
      return pilar as PilarCode
    }
  }
  return null
}

/** Retorna temas estratégicos por pilar. */
export function getTemasEstrategicosPorPilar(pilar: PilarCode): typeof TEMAS_ESTRATEGICOS[number][] {
  return TEMAS_ESTRATEGICOS.filter((t) => t.pilar === pilar)
}
