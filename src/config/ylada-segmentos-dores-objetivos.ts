/**
 * Dores e Objetivos por Segmento — Biblioteca YLADA.
 * Base para filtros, sugestões do Noel e geração automática de quizzes.
 * @see docs/LINKS-INTELIGENTES-ARQUITETURA-FINAL.md
 */

import type { BibliotecaSegmentCode } from './ylada-biblioteca'

export interface SegmentoDoresObjetivos {
  segment_code: BibliotecaSegmentCode
  label: string
  temas: { value: string; label: string }[]
  dores: string[]
  objetivos: string[]
}

/** Dores e objetivos por segmento — fonte única de verdade. */
export const SEGMENTOS_DORES_OBJETIVOS: SegmentoDoresObjetivos[] = [
  {
    segment_code: 'nutrition',
    label: 'Nutrição',
    temas: [
      { value: 'alimentacao', label: 'Alimentação' },
      { value: 'metabolismo', label: 'Metabolismo' },
      { value: 'intestino', label: 'Intestino' },
      { value: 'peso_gordura', label: 'Peso' },
      { value: 'energia', label: 'Energia' },
      { value: 'inchaço_retencao', label: 'Inchaço' },
      { value: 'rotina_saudavel', label: 'Rotina alimentar' },
    ],
    dores: [
      'Dificuldade de emagrecer',
      'Intestino preso ou irregular',
      'Compulsão alimentar',
      'Inchaço frequente',
      'Falta de energia',
      'Comer fora da rotina',
      'Dificuldade em manter dieta',
      'Comer por ansiedade',
      'Falta de organização alimentar',
    ],
    objetivos: [
      'Emagrecer com saúde',
      'Melhorar digestão',
      'Regular intestino',
      'Reduzir retenção',
      'Melhorar energia diária',
      'Criar rotina alimentar',
      'Controlar fome emocional',
      'Melhorar composição corporal',
    ],
  },
  {
    segment_code: 'aesthetics',
    label: 'Estética',
    temas: [
      { value: 'pele', label: 'Pele' },
      { value: 'autoestima', label: 'Autoestima' },
      { value: 'rotina_cuidados', label: 'Rotina de cuidados' },
      { value: 'rejuvenescimento', label: 'Rejuvenescimento' },
      { value: 'gordura_localizada', label: 'Gordura localizada' },
      { value: 'celulite', label: 'Celulite' },
      { value: 'flacidez', label: 'Flacidez' },
      { value: 'manchas', label: 'Manchas' },
    ],
    dores: [
      'Flacidez facial ou corporal',
      'Celulite',
      'Manchas na pele',
      'Rugas precoces',
      'Gordura localizada',
      'Baixa autoestima com aparência',
      'Pele cansada',
      'Inchaço facial',
      'Olheiras',
    ],
    objetivos: [
      'Melhorar aparência da pele',
      'Reduzir gordura localizada',
      'Rejuvenescer aparência',
      'Melhorar autoestima',
      'Diminuir celulite',
      'Melhorar textura da pele',
      'Melhorar contorno corporal',
    ],
  },
  {
    segment_code: 'fitness',
    label: 'Fitness',
    temas: [
      { value: 'treino', label: 'Treino' },
      { value: 'performance', label: 'Performance' },
      { value: 'recuperacao', label: 'Recuperação' },
      { value: 'resistencia', label: 'Resistência' },
      { value: 'forca', label: 'Força' },
      { value: 'consistencia', label: 'Consistência' },
      { value: 'energia', label: 'Energia' },
    ],
    dores: [
      'Falta de motivação para treinar',
      'Cansaço durante treino',
      'Baixa performance',
      'Dificuldade de ganhar massa',
      'Dificuldade de emagrecer',
      'Falta de disciplina',
      'Lesões frequentes',
      'Falta de energia pré-treino',
    ],
    objetivos: [
      'Melhorar condicionamento',
      'Ganhar massa muscular',
      'Perder gordura',
      'Aumentar energia para treinar',
      'Melhorar recuperação',
      'Manter rotina de treinos',
      'Melhorar performance física',
    ],
  },
  {
    segment_code: 'dentistry',
    label: 'Odontologia',
    temas: [
      { value: 'saude_bucal', label: 'Saúde bucal' },
      { value: 'higiene_oral', label: 'Higiene oral' },
      { value: 'estetica_dental', label: 'Estética dental' },
      { value: 'halitose', label: 'Halitose' },
      { value: 'sensibilidade', label: 'Sensibilidade' },
    ],
    dores: [
      'Mau hálito',
      'Sensibilidade nos dentes',
      'Sangramento na gengiva',
      'Medo de dentista',
      'Dentes amarelados',
      'Dificuldade de manter higiene',
      'Dor ao mastigar',
    ],
    objetivos: [
      'Melhorar saúde bucal',
      'Clarear dentes',
      'Melhorar sorriso',
      'Prevenir cáries',
      'Melhorar higiene oral',
      'Reduzir sensibilidade',
    ],
  },
  {
    segment_code: 'psychology',
    label: 'Psicologia',
    temas: [
      { value: 'emocoes', label: 'Emoções' },
      { value: 'ansiedade', label: 'Ansiedade' },
      { value: 'estresse', label: 'Estresse' },
      { value: 'autoconhecimento', label: 'Autoconhecimento' },
      { value: 'relacionamentos', label: 'Relacionamentos' },
      { value: 'equilibrio_emocional', label: 'Equilíbrio emocional' },
    ],
    dores: [
      'Ansiedade constante',
      'Estresse elevado',
      'Dificuldade de concentração',
      'Problemas de relacionamento',
      'Pensamentos repetitivos',
      'Falta de motivação',
      'Dificuldade de dormir',
      'Baixa autoestima',
    ],
    objetivos: [
      'Reduzir ansiedade',
      'Melhorar equilíbrio emocional',
      'Melhorar foco',
      'Desenvolver autoconhecimento',
      'Melhorar relacionamentos',
      'Ter mais tranquilidade mental',
    ],
  },
  {
    segment_code: 'psychoanalysis',
    label: 'Psicanálise',
    temas: [
      { value: 'autoconhecimento', label: 'Autoconhecimento' },
      { value: 'transferencia', label: 'Vínculo e escuta' },
      { value: 'ansiedade', label: 'Ansiedade' },
      { value: 'sono', label: 'Sono e ritmo' },
      { value: 'relacionamentos', label: 'Relacionamentos' },
      { value: 'equilibrio_emocional', label: 'Equilíbrio emocional' },
    ],
    dores: [
      'Dificuldade de nomear o que sente',
      'Sintomas que se repetem',
      'Relações que esgotam',
      'Busca por escuta contínua',
      'Expectativas sobre o processo',
      'Medo de começar ou abandonar',
    ],
    objetivos: [
      'Dar espaço ao que emerge',
      'Fortalecer escuta e vínculo terapêutico',
      'Clarear demandas do analisando',
      'Qualificar primeiros contatos',
      'Explicar o processo sem simplificar demais',
    ],
  },
  {
    segment_code: 'medicine',
    label: 'Médicos (Bem-estar geral)',
    temas: [
      { value: 'prevencao', label: 'Prevenção' },
      { value: 'qualidade_vida', label: 'Qualidade de vida' },
      { value: 'estilo_vida', label: 'Estilo de vida' },
      { value: 'habitos', label: 'Hábitos' },
      { value: 'vitalidade', label: 'Vitalidade' },
    ],
    dores: [
      'Falta de energia',
      'Sedentarismo',
      'Alimentação desregulada',
      'Sono ruim',
      'Estresse elevado',
      'Ganho de peso',
      'Baixa disposição',
    ],
    objetivos: [
      'Melhorar qualidade de vida',
      'Criar hábitos saudáveis',
      'Melhorar energia',
      'Reduzir estresse',
      'Melhorar sono',
      'Melhorar saúde geral',
    ],
  },
  {
    segment_code: 'perfumaria',
    label: 'Perfumaria e fragrâncias',
    temas: [
      { value: 'preferencias_olfativas', label: 'Preferências olfativas' },
      { value: 'familia_olfativa', label: 'Família olfativa' },
      { value: 'ocasiao_uso', label: 'Ocasião de uso' },
      { value: 'personalidade_fragrancia', label: 'Personalidade e fragrância' },
      { value: 'sensibilidade_pele', label: 'Sensibilidade de pele' },
      { value: 'duracao_perfume', label: 'Duração do perfume' },
      { value: 'perfume_assinatura', label: 'Perfume assinatura' },
    ],
    dores: [
      'Não sabe qual perfume combina comigo',
      'Perfume some rápido no dia',
      'Alergia ou sensibilidade a fragrâncias',
      'Não tenho um perfume assinatura',
      'Dificuldade em escolher perfume de presente',
      'Não sei qual ocasião usar cada fragrância',
      'Confusão entre tantas opções',
    ],
    objetivos: [
      'Encontrar perfume ideal para mim',
      'Perfume de longa duração',
      'Criar coleção de fragrâncias',
      'Perfume para ocasiões especiais',
      'Expressar personalidade através de fragrâncias',
      'Perfume que combine com minha pele',
    ],
  },
  {
    segment_code: 'nutrition_vendedor',
    label: 'Vendedores Nutracêuticos / Suplementos',
    temas: [
      { value: 'energia', label: 'Energia' },
      { value: 'metabolismo', label: 'Metabolismo' },
      { value: 'detox', label: 'Detox' },
      { value: 'performance', label: 'Performance' },
      { value: 'intestino', label: 'Intestino' },
    ],
    dores: [
      'Cansaço constante',
      'Falta de concentração',
      'Inchaço',
      'Digestão ruim',
      'Baixa energia',
      'Retenção de líquidos',
      'Dificuldade de emagrecer',
    ],
    objetivos: [
      'Aumentar energia',
      'Melhorar foco',
      'Melhorar digestão',
      'Desinchar',
      'Melhorar metabolismo',
      'Melhorar disposição',
    ],
  },
]

/** Mapeamento segment_code → dores e objetivos. */
export const DORES_OBJETIVOS_POR_SEGMENTO: Record<
  BibliotecaSegmentCode,
  { dores: string[]; objetivos: string[]; temas: { value: string; label: string }[] }
> = Object.fromEntries(
  SEGMENTOS_DORES_OBJETIVOS.map((s) => [
    s.segment_code,
    { dores: s.dores, objetivos: s.objetivos, temas: s.temas },
  ])
) as Record<BibliotecaSegmentCode, { dores: string[]; objetivos: string[]; temas: { value: string; label: string }[] }>

/** Retorna temas disponíveis para um segmento. */
export function getTemasPorSegmento(segmentCode: BibliotecaSegmentCode): { value: string; label: string }[] {
  return DORES_OBJETIVOS_POR_SEGMENTO[segmentCode]?.temas ?? []
}

/** Retorna todos os temas de todos os segmentos (sem duplicatas). Para dropdown fixo na biblioteca. */
export function getAllTemasBiblioteca(
  temasTop12: { value: string; label: string }[]
): { value: string; label: string }[] {
  const seen = new Set<string>()
  const merged: { value: string; label: string }[] = []
  for (const t of temasTop12) {
    if (!seen.has(t.value)) {
      seen.add(t.value)
      merged.push(t)
    }
  }
  for (const seg of SEGMENTOS_DORES_OBJETIVOS) {
    for (const t of seg.temas) {
      if (!seen.has(t.value)) {
        seen.add(t.value)
        merged.push(t)
      }
    }
  }
  return merged
}

/** Retorna dores disponíveis para um segmento. */
export function getDoresPorSegmento(segmentCode: BibliotecaSegmentCode): string[] {
  return DORES_OBJETIVOS_POR_SEGMENTO[segmentCode]?.dores ?? []
}

/** Retorna objetivos disponíveis para um segmento. */
export function getObjetivosPorSegmento(segmentCode: BibliotecaSegmentCode): string[] {
  return DORES_OBJETIVOS_POR_SEGMENTO[segmentCode]?.objetivos ?? []
}

/** Retorna label de um tema (busca em todos os segmentos + Top 12). */
export function getTemaLabel(temaValue: string, temasTop12?: { value: string; label: string }[]): string {
  if (temasTop12) {
    const fromTop = temasTop12.find((t) => t.value === temaValue)
    if (fromTop) return fromTop.label
  }
  for (const seg of SEGMENTOS_DORES_OBJETIVOS) {
    const found = seg.temas.find((t) => t.value === temaValue)
    if (found) return found.label
  }
  return temaValue.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
