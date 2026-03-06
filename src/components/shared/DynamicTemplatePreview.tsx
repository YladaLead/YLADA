'use client'

import { useMemo, useState } from 'react'
// Importar diagnósticos Wellness diretamente dos arquivos
import * as wellnessDiagnostics from '@/lib/diagnostics'
import {
  diagnosticosNutri,
  getDiagnostico as getDiagnosticoNutri,
  type DiagnosticoCompleto,
  type DiagnosticosPorFerramenta
} from '@/lib/diagnosticos-nutri'
import { diagnosticosCoach, getDiagnostico as getDiagnosticoCoach } from '@/lib/diagnosticos-coach'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

interface Template {
  id: string
  nome?: string
  name?: string
  slug?: string
  type?: string
  content?: any
}

interface DynamicTemplatePreviewProps {
  template: Template
  profession: 'wellness' | 'nutri' | 'coach'
  onClose?: () => void
  isPreview?: boolean // true = preview para dono (com explicações), false = link copiado para cliente (sem explicações)
}

interface DiagnosticEntry {
  resultadoId: string
  diagnostico: DiagnosticoCompleto
}

// Estilos CSS para animação suave
const pulseSubtleStyle = `
  @keyframes pulse-subtle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.95;
      transform: scale(1.01);
    }
  }
`

// Injetar estilos CSS para animação
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = pulseSubtleStyle
  if (!document.head.querySelector('style[data-pulse-subtle]')) {
    styleSheet.setAttribute('data-pulse-subtle', 'true')
    document.head.appendChild(styleSheet)
  }
}

const normalizeSlug = (value: string | undefined | null): string => {
  if (!value) return ''
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const buildSlugCandidates = (template: Template): string[] => {
  const rawValues = [
    template.slug,
    template.id,
    template.nome,
    template.name
  ]

  const candidates = new Set<string>()
  rawValues.forEach((value) => {
    const normalized = normalizeSlug(value)
    if (!normalized) return
    candidates.add(normalized)
    
    // Remover prefixos comuns
    if (normalized.startsWith('template-')) {
      candidates.add(normalized.replace(/^template-/, ''))
    }
    if (normalized.startsWith('quiz-')) {
      candidates.add(normalized.replace(/^quiz-/, ''))
    }
    if (normalized.startsWith('calc-')) {
      candidates.add(normalized.replace(/^calc-/, ''))
    }
    if (normalized.startsWith('calculadora-')) {
      candidates.add(normalized.replace(/^calculadora-/, ''))
    }
    
    // Remover sufixos comuns (-nutri, -coach, etc)
    candidates.add(normalized.replace(/-nutri$/, ''))
    candidates.add(normalized.replace(/-coach$/, ''))
    candidates.add(normalized.replace(/-wellness$/, ''))
    
    // Normalizar preposições
    candidates.add(normalized.replace(/-de-/g, '-'))
    candidates.add(normalized.replace(/-da-/g, '-'))
    candidates.add(normalized.replace(/-do-/g, '-'))
    candidates.add(normalized.replace(/-e-/g, '-'))
    
    // Variações específicas para quizzes de recrutamento
    if (normalized.includes('ganhos') && normalized.includes('prosperidade')) {
      candidates.add('quiz-ganhos')
      candidates.add('quiz-ganhos-prosperidade')
      candidates.add('ganhos-prosperidade')
      candidates.add('ganhos-e-prosperidade')
    }
    if (normalized.includes('ganhos') && !normalized.includes('prosperidade')) {
      candidates.add('quiz-ganhos')
      candidates.add('quiz-ganhos-prosperidade')
      candidates.add('ganhos-prosperidade')
    }
    if (normalized.includes('potencial') && normalized.includes('crescimento')) {
      candidates.add('quiz-potencial')
      candidates.add('quiz-potencial-crescimento')
      candidates.add('potencial-crescimento')
      candidates.add('potencial-e-crescimento')
    }
    if (normalized.includes('proposito') && normalized.includes('equilibrio')) {
      candidates.add('quiz-proposito')
      candidates.add('quiz-proposito-equilibrio')
      candidates.add('proposito-equilibrio')
      candidates.add('proposito-e-equilibrio')
    }
    
    // Variações para fome emocional
    if (normalized.includes('fome') && (normalized.includes('emocional') || normalized.includes('tipo'))) {
      candidates.add('tipo-fome')
      candidates.add('quiz-fome-emocional')
      candidates.add('fome-emocional')
      candidates.add('hunger-type')
    }
  })

  return Array.from(candidates).filter(Boolean)
}

const slugMatches = (candidate: string, key: string) => {
  if (!candidate || !key) return false
  
  // Match exato
  if (candidate === key) return true
  
  // Match parcial (um contém o outro)
  if (candidate.includes(key) || key.includes(candidate)) return true
  
  // Match por palavras-chave comuns
  const candidateWords = candidate.split('-').filter(w => w.length > 2)
  const keyWords = key.split('-').filter(w => w.length > 2)
  
  // Se tiverem pelo menos 2 palavras em comum, considera match
  const commonWords = candidateWords.filter(w => keyWords.includes(w))
  if (commonWords.length >= 2) return true
  
  // Match para casos especiais (ex: "ganhos-prosperidade" vs "quiz-ganhos")
  if (candidate.includes('ganhos') && key.includes('ganhos')) return true
  if (candidate.includes('potencial') && key.includes('potencial')) return true
  if (candidate.includes('proposito') && key.includes('proposito')) return true
  if (candidate.includes('fome') && key.includes('fome')) return true
  
  return false
}

const wellnessDiagnosticsMap: Record<string, DiagnosticosPorFerramenta> = {
  'quiz-interativo': wellnessDiagnostics.quizInterativoDiagnosticos,
  'quiz-bem-estar': wellnessDiagnostics.quizBemEstarDiagnosticos,
  'quiz-perfil-nutricional': wellnessDiagnostics.quizPerfilNutricionalDiagnosticos,
  'quiz-detox': wellnessDiagnostics.quizDetoxDiagnosticos,
  'quiz-energetico': wellnessDiagnostics.quizEnergeticoDiagnosticos,
  'avaliacao-emocional': wellnessDiagnostics.avaliacaoEmocionalDiagnosticos,
  'avaliacao-intolerancia': wellnessDiagnostics.intoleranciaDiagnosticos,
  'intolerancia': wellnessDiagnostics.intoleranciaDiagnosticos,
  'perfil-metabolico': wellnessDiagnostics.perfilMetabolicoDiagnosticos,
  'avaliacao-inicial': wellnessDiagnostics.avaliacaoInicialDiagnosticos,
  'template-avaliacao-inicial': wellnessDiagnostics.avaliacaoInicialDiagnosticos,
  'diagnostico-eletrolitos': wellnessDiagnostics.eletrolitosDiagnosticos,
  'diagnostico-sintomas-intestinais': wellnessDiagnostics.sintomasIntestinaisDiagnosticos,
  'pronto-emagrecer': wellnessDiagnostics.prontoEmagrecerDiagnosticos,
  'tipo-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
  'quiz-fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'hunger-type': wellnessDiagnostics.tipoFomeDiagnosticos,
  'avaliacao-fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'quiz-tipo-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
  'tipo-de-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
  'alimentacao-saudavel': wellnessDiagnostics.alimentacaoSaudavelDiagnosticos,
  'quiz-alimentacao-saudavel': wellnessDiagnostics.alimentacaoSaudavelDiagnosticos,
  'sindrome-metabolica': wellnessDiagnostics.sindromeMetabolicaDiagnosticos,
  'retencao-liquidos': wellnessDiagnostics.retencaoLiquidosDiagnosticos,
  'conhece-seu-corpo': wellnessDiagnostics.conheceSeuCorpoDiagnosticos,
  'nutrido-vs-alimentado': wellnessDiagnostics.nutridoVsAlimentadoDiagnosticos,
  'alimentacao-rotina': wellnessDiagnostics.alimentacaoRotinaDiagnosticos,
  'avaliacao-perfil-metabolico': wellnessDiagnostics.perfilMetabolicoDiagnosticos,
  'avaliacao-sono-energia': wellnessDiagnostics.quizEnergeticoDiagnosticos, // Usar diagnóstico similar
  'disciplinado-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'quiz-disciplina-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'ganhos-prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'quiz-ganhos': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'quiz-ganhos-prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'ganhos e prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'ganhos-e-prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'quiz-ganhos-e-prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'potencial-crescimento': wellnessDiagnostics.potencialCrescimentoDiagnosticos,
  'quiz-potencial': wellnessDiagnostics.potencialCrescimentoDiagnosticos,
  'quiz-potencial-crescimento': wellnessDiagnostics.potencialCrescimentoDiagnosticos,
  'proposito-equilibrio': wellnessDiagnostics.propositoEquilibrioDiagnosticos,
  'quiz-proposito': wellnessDiagnostics.propositoEquilibrioDiagnosticos,
  'quiz-proposito-equilibrio': wellnessDiagnostics.propositoEquilibrioDiagnosticos,
  'calculadora-imc': wellnessDiagnostics.calculadoraImcDiagnosticos,
  'calc-imc': wellnessDiagnostics.calculadoraImcDiagnosticos,
  'imc': wellnessDiagnostics.calculadoraImcDiagnosticos,
  'calculadora-proteina': wellnessDiagnostics.calculadoraProteinaDiagnosticos,
  'calc-proteina': wellnessDiagnostics.calculadoraProteinaDiagnosticos,
  'proteina': wellnessDiagnostics.calculadoraProteinaDiagnosticos,
  'calculadora-agua': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'calculadora-hidratacao': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'calc-hidratacao': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'calc-agua': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'hidratacao': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'agua': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'calculadora-calorias': wellnessDiagnostics.calculadoraCaloriasDiagnosticos,
  'calc-calorias': wellnessDiagnostics.calculadoraCaloriasDiagnosticos,
  'calorias': wellnessDiagnostics.calculadoraCaloriasDiagnosticos,
  'checklist-alimentar': wellnessDiagnostics.checklistAlimentarDiagnosticos,
  'checklist-detox': wellnessDiagnostics.checklistDetoxDiagnosticos,
  'mini-ebook': wellnessDiagnostics.miniEbookDiagnosticos,
  'guia-nutraceutico': wellnessDiagnostics.guiaNutraceuticoDiagnosticos,
  'guia-proteico': wellnessDiagnostics.guiaProteicoDiagnosticos,
  'guia-hidratacao': wellnessDiagnostics.guiaHidratacaoDiagnosticos,
  'desafio-7-dias': wellnessDiagnostics.desafio7DiasDiagnosticos,
  'desafio-21-dias': wellnessDiagnostics.desafio21DiasDiagnosticos,
  'wellness-profile': wellnessDiagnostics.quizBemEstarDiagnosticos,
  'descubra-seu-perfil-de-bem-estar': wellnessDiagnostics.quizBemEstarDiagnosticos,
  'descoberta-perfil-bem-estar': wellnessDiagnostics.quizBemEstarDiagnosticos,
  'template-diagnostico-parasitose': wellnessDiagnostics.diagnosticoParasitoseDiagnosticos,
  'diagnostico-parasitose': wellnessDiagnostics.diagnosticoParasitoseDiagnosticos,
  'parasitose': wellnessDiagnostics.diagnosticoParasitoseDiagnosticos,
  'avaliacao-emagrecimento-consciente': wellnessDiagnostics.avaliacaoEmagrecimentoConscienteDiagnosticos,
  'quiz-emagrecimento-consciente': wellnessDiagnostics.avaliacaoEmagrecimentoConscienteDiagnosticos,
  'inibidores-apetite': wellnessDiagnostics.avaliacaoEmagrecimentoConscienteDiagnosticos
}

const diagnosticsMapsByProfession: Record<'nutri' | 'wellness' | 'coach', Record<string, DiagnosticosPorFerramenta>> = {
  nutri: diagnosticosNutri,
  wellness: wellnessDiagnosticsMap,
  coach: diagnosticosCoach
}

const resultColorPalette = [
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-600', text: 'text-blue-900' },
  { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-600', text: 'text-green-900' },
  { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-600', text: 'text-yellow-900' },
  { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-600', text: 'text-purple-900' },
  { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-600', text: 'text-rose-900' }
]

const formatResultadoLabel = (resultadoId: string) => {
  // Mapeamento de chaves conhecidas para títulos com acentuação correta
  const titleMap: Record<string, string> = {
    // Calculadora de Água
    'baixaHidratacao': 'Baixa Hidratação',
    'hidratacaoModerada': 'Hidratação Moderada',
    'altaHidratacao': 'Alta Hidratação',
    // Calculadora de Calorias
    'caloriasBaixas': 'Calorias Baixas',
    'caloriasModeradas': 'Calorias Moderadas',
    'caloriasAltas': 'Calorias Altas',
    'deficitCalorico': 'Déficit Calórico',
    'manutencaoCalorica': 'Manutenção Calórica',
    'superavitCalorico': 'Superávit Calórico',
    // Calculadora de Proteína
    'proteinaBaixa': 'Proteína Baixa',
    'proteinaModerada': 'Proteína Moderada',
    'proteinaAlta': 'Proteína Alta',
    // Avaliação de Intolerância
    'intoleranciaBaixa': 'Intolerância Baixa',
    'intoleranciaModerada': 'Intolerância Moderada',
    'intoleranciaAlta': 'Intolerância Alta',
    // Perfil Metabólico
    'metabolicoLento': 'Metabólico Lento',
    'metabolicoModerado': 'Metabólico Moderado',
    'metabolicoRapido': 'Metabólico Rápido',
    // Avaliação Inicial
    'avaliacaoBasica': 'Avaliação Básica',
    'avaliacaoModerada': 'Avaliação Moderada',
    'avaliacaoAvancada': 'Avaliação Avançada',
    // Desafio 21 Dias
    'desafioBasico': 'Desafio Básico',
    'desafioModerado': 'Desafio Moderado',
    'desafioAvancado': 'Desafio Avançado',
    'prontoParaTransformacao': 'Pronto Para Transformação',
    'altaMotivacaoParaMudanca': 'Alta Motivação Para Mudança',
    // Eletrólitos
    'eletrolitosBaixos': 'Eletrólitos Baixos',
    'eletrolitosModerados': 'Eletrólitos Moderados',
    'eletrolitosAltos': 'Eletrólitos Altos',
    'equilibrioAdequado': 'Equilíbrio Adequado',
    'equilibrioEletroliticoAdequado': 'Equilíbrio Eletrolítico Adequado',
    // Pronto para Emagrecer
    'prontoBasico': 'Pronto Básico',
    'prontoModerado': 'Pronto Moderado',
    'prontoAvancado': 'Pronto Avançado',
    'precisaMaisInformacoesEmagrecer': 'Precisa Mais Informações Emagrecer',
    // Tipo de Fome
    'fomeFisica': 'Fome Física',
    'fomeEmocional': 'Fome Emocional',
    'fomeMista': 'Fome Mista',
    // Perfil de Intestino
    'intestinoSaudavel': 'Intestino Saudável',
    'intestinoModerado': 'Intestino Moderado',
    'intestinoComprometido': 'Intestino Comprometido',
    'intestinoSensivel': 'Intestino Sensível',
    // Quiz Perfil Nutricional
    'perfilNutricionalBaixo': 'Perfil Nutricional Baixo',
    'perfilNutricionalModerado': 'Perfil Nutricional Moderado',
    'perfilNutricionalAlto': 'Perfil Nutricional Alto',
    // Bem-Estar
    'bemEstarBaixo': 'Bem-Estar Baixo',
    'bemEstarModerado': 'Bem-Estar Moderado',
    'bemEstarAlto': 'Bem-Estar Alto',
    // Emagrecimento Consciente (inibidores de apetite)
    'deficitNutricionalOculto': 'Déficit Nutricional Oculto',
    'riscoEfeitoRebote': 'Risco de Efeito Rebote',
    'conscienciaParcial': 'Emagrecimento com Consciência (Parcial)',
    // Parasitose
    'parasitoseBasica': 'Parasitose Básica',
    'parasitoseModerada': 'Parasitose Moderada',
    'parasitoseAvancada': 'Parasitose Avançada',
    // Quiz Detox
    'baixaToxicidade': 'Baixa Toxicidade',
    'toxicidadeModerada': 'Toxicidade Moderada',
    'altaToxicidade': 'Alta Toxicidade',
  }

  // Se existe mapeamento, retorna o título formatado
  if (titleMap[resultadoId]) {
    return titleMap[resultadoId]
  }

  // Fallback: formatação genérica (mantém comportamento original)
  return resultadoId
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
    // Tenta adicionar acentuação comum
    .replace(/Hidratacao/gi, 'Hidratação')
    .replace(/Hidratacao/gi, 'Hidratação')
    .replace(/Avaliacao/gi, 'Avaliação')
    .replace(/Recuperacao/gi, 'Recuperação')
    .replace(/Desidratacao/gi, 'Desidratação')
    .replace(/Proteina/gi, 'Proteína')
    .replace(/Calorica/gi, 'Calórica')
    .replace(/Calorico/gi, 'Calórico')
    .replace(/Metabolico/gi, 'Metabólico')
    .replace(/Eletrolitico/gi, 'Eletrolítico')
    .replace(/Equilibrio/gi, 'Equilíbrio')
    .replace(/Manutencao/gi, 'Manutenção')
    .replace(/Superavit/gi, 'Superávit')
    .replace(/Deficit/gi, 'Déficit')
    .replace(/Transformacao/gi, 'Transformação')
    .replace(/Motivacao/gi, 'Motivação')
    .replace(/Mudanca/gi, 'Mudança')
    .replace(/Informacoes/gi, 'Informações')
    .replace(/Sensivel/gi, 'Sensível')
    .replace(/Intolerancia/gi, 'Intolerância')
    .replace(/Absorcao/gi, 'Absorção')
    .replace(/Desequilibrio/gi, 'Desequilíbrio')
    .replace(/Nutricao/gi, 'Nutrição')
    .replace(/Nutricional/gi, 'Nutricional')
    .replace(/Nutricionista/gi, 'Nutricionista')
    .replace(/Avancada/gi, 'Avançada')
    .replace(/Avancado/gi, 'Avançado')
    .replace(/Basica/gi, 'Básica')
    .replace(/Basico/gi, 'Básico')
    .replace(/Saudavel/gi, 'Saudável')
    .replace(/Rapido/gi, 'Rápido')
}

type CalculadoraMockRespostas = Record<string, string | number>

const normalizeForMatch = (text: string) =>
  (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const pickOptionValue = (option: any) => {
  if (typeof option === 'object' && option !== null) {
    return option.value ?? option.label ?? ''
  }
  return option
}

const friendlyLabelPresets: Array<{ keywords: string[]; labels: string[] }> = [
  {
    keywords: ['atividade', 'nivel'],
    labels: ['Sedentário', 'Moderado', 'Intenso', 'Atleta']
  },
  {
    keywords: ['clima', 'condicoes', 'condicao'],
    labels: ['Clima ameno', 'Clima quente', 'Clima frio', 'Ambiente controlado']
  },
  {
    keywords: ['objetivo'],
    labels: ['Manter peso', 'Perder peso', 'Ganhar massa', 'Recomposição']
  },
  {
    keywords: ['sexo', 'gênero'],
    labels: ['Feminino', 'Masculino']
  }
]

const hasFriendlyPreset = (field: any) => {
  const labelLower = normalizeForMatch(field?.label || '')
  return friendlyLabelPresets.find((preset) =>
    preset.keywords.some((keyword) => labelLower.includes(keyword))
  )
}

const getFriendlySelectFallback = (field: any, optionIndex: number): string | null => {
  const preset = hasFriendlyPreset(field)
  if (!preset) return null
  const safeIndex = optionIndex >= 0 ? optionIndex : 0
  return preset.labels[safeIndex] ?? preset.labels[0] ?? null
}

const pickOptionLabel = (field: any, value: any) => {
  if (!field?.options) return value
  const optionIndex = field.options.findIndex((opt: any) => pickOptionValue(opt) === value)
  const match = field.options[optionIndex] ?? field.options.find((opt: any) => pickOptionValue(opt) === value)

  const normalizeLabel = (raw: any) => {
    if (!raw) return raw
    if (typeof raw === 'string' && /exemplo/i.test(raw)) {
      return getFriendlySelectFallback(field, optionIndex) || raw
    }
    if (typeof raw === 'string') return raw
    if (raw?.label && /exemplo/i.test(raw.label)) {
      return getFriendlySelectFallback(field, optionIndex) || raw.value || value
    }
    return raw?.label ?? raw?.value ?? value
  }

  if (!match) return value
  if (typeof match === 'object' && match !== null) {
    return normalizeLabel(match)
  }
  return normalizeLabel(match)
}

const inferNumeroExemplo = (field: any, slug: string) => {
  const text = normalizeForMatch(`${field?.id || ''} ${field?.label || ''}`)
  const unidade = normalizeForMatch(field?.unit || '')

  if (text.includes('peso')) {
    return 68
  }
  if (text.includes('altura') || text.includes('estatura')) {
    if (unidade.includes('cm') || text.includes('cm')) return 168
    return 1.68
  }
  if (text.includes('idade') || text.includes('anos')) {
    return 32
  }
  if (text.includes('ingest') || text.includes('água') || text.includes('agua')) {
    return 2300
  }
  if (text.includes('caloria') || text.includes('kcal')) {
    return 2050
  }
  if (text.includes('protei') || slug.includes('proteina')) {
    return 110
  }

  if (typeof field?.default_value === 'number') {
    return field.default_value
  }
  if (typeof field?.min === 'number' && typeof field?.max === 'number') {
    return Math.round((field.min + field.max) / 2)
  }
  if (typeof field?.min === 'number') {
    return field.min
  }

  return 1
}

const buildCalculatorMockResponses = (slug: string, campos: any[] = []): CalculadoraMockRespostas => {
  return (campos || []).reduce((acc, field, index) => {
    const key = field?.id || field?.name || `field-${index}`

    if (field?.type === 'select' && Array.isArray(field.options) && field.options.length > 0) {
      const selecionada = pickOptionValue(field.options[1] ?? field.options[0])
      acc[key] = selecionada || ''
      return acc
    }

    if (field?.type === 'number') {
      acc[key] = inferNumeroExemplo(field, slug)
      return acc
    }

    acc[key] =
      field?.example ||
      field?.placeholder ||
      (typeof field?.default_value !== 'undefined' ? field.default_value : `Exemplo ${index + 1}`)
    return acc
  }, {} as CalculadoraMockRespostas)
}

type CalculadoraResultadoSimulado = {
  destaque: string
  descricao: string
  detalhe: string
}

const getSimulatedCalculatorResult = (
  slug: string,
  respostas: CalculadoraMockRespostas,
  profession: 'nutri' | 'wellness' | 'coach' = 'nutri'
): CalculadoraResultadoSimulado => {
  const normalized = slug.replace(/-nutri$/, '')
  const peso = respostas?.peso ?? respostas?.weight ?? 68

  // Texto baseado na profissão
  const textoDiagnostico = profession === 'coach' 
    ? 'Os diagnósticos Coach detalham' 
    : profession === 'wellness' 
    ? 'Os diagnósticos Wellness detalham' 
    : 'Os diagnósticos Nutri detalham'

  if (normalized.includes('calculadora-agua') || normalized.includes('calculadora-hidratacao')) {
    return {
      destaque: '💧 Necessidade estimada: 2,3 L/dia',
      descricao: `Considerando ${peso} kg, rotina ativa moderada e clima ameno, a hidratação ideal fica em torno de 2,3 litros por dia.`,
      detalhe: 'O diagnóstico final orienta como distribuir a ingestão ao longo do dia e quais sinais acompanhar.'
    }
  }

  if (normalized.includes('calculadora-caloria')) {
    return {
      destaque: '🔥 Meta calórica: 2.050 kcal/dia',
      descricao: 'Simulação baseada em objetivo de recomposição corporal com treino 4x/semana.',
      detalhe: 'O diagnóstico mostra macronutrientes sugeridos e próximos passos para acelerar os resultados.'
    }
  }

  if (normalized.includes('calculadora-imc')) {
    return {
      destaque: '📊 IMC estimado: 24,1 (Faixa saudável)',
      descricao: 'Peso adequado para o biotipo informado. O resultado explica a categoria e cuidados prioritários.',
      detalhe: `${textoDiagnostico} como manter o peso ideal e ajustar hábitos caso o IMC mude.`
    }
  }

  if (normalized.includes('calculadora-proteina')) {
    return {
      destaque: '🥩 Necessidade proteica: 110 g/dia',
      descricao: 'Distribuição sugerida em 4 refeições principais para favorecer ganho de massa magra.',
      detalhe: 'O diagnóstico orienta combinações de alimentos, horários ideais e suplementações indicadas.'
    }
  }

  return {
    destaque: 'Resultado simulado disponível',
    descricao: 'Mostramos exatamente como o cliente verá o cálculo final e como conectamos com o diagnóstico.',
    detalhe: 'Use este preview para demonstrar a experiência completa antes de criar o link definitivo.'
  }
}

const findDiagnosticsSource = (
  candidates: string[],
  profession: 'nutri' | 'wellness' | 'coach'
): { slug: string; map: Record<string, DiagnosticosPorFerramenta> } | null => {
  const primaryMap = diagnosticsMapsByProfession[profession]
  // Coach não deve usar fallback - tem diagnósticos próprios e independentes
  const fallbackMap = profession === 'nutri' ? diagnosticsMapsByProfession.wellness : undefined
  const mapsToCheck = [primaryMap, fallbackMap].filter(Boolean) as Array<Record<string, DiagnosticosPorFerramenta>>

  for (const candidate of candidates) {
    for (const map of mapsToCheck) {
      if (candidate && map[candidate]) {
        return { slug: candidate, map }
      }
    }
  }

  for (const candidate of candidates) {
    for (const map of mapsToCheck) {
      const matchKey = Object.keys(map).find((key) => slugMatches(candidate, key))
      if (matchKey) {
        return { slug: matchKey, map }
      }
    }
  }

  return null
}

const buildEntriesFromMap = (
  slug: string,
  map: Record<string, DiagnosticosPorFerramenta>,
  profession: 'nutri' | 'wellness' | 'coach'
): DiagnosticEntry[] => {
  const entry = map[slug]
  if (!entry) return []
  const availableResults =
    entry[profession] || entry.coach || entry.nutri || entry.wellness

  if (!availableResults) return []

  // Para wellness, usar os diagnósticos diretamente do map
  if (profession === 'wellness') {
    return Object.keys(availableResults)
      .map((resultadoId) => {
        const diagnostico = availableResults[resultadoId]
        if (!diagnostico) return null
        return { resultadoId, diagnostico }
      })
      .filter(Boolean) as DiagnosticEntry[]
  }

  // Para coach e nutri, usar a função getDiagnostico
  const getDiagnostico = profession === 'coach' ? getDiagnosticoCoach : getDiagnosticoNutri

  return Object.keys(availableResults)
    .map((resultadoId) => {
      const diagnostico = getDiagnostico(slug, profession, resultadoId)
      if (!diagnostico) return null
      return { resultadoId, diagnostico }
    })
    .filter(Boolean) as DiagnosticEntry[]
}

const getDiagnosticsInfoForTemplate = (
  template: Template,
  profession: 'nutri' | 'wellness' | 'coach'
) => {
  const candidates = buildSlugCandidates(template)
  const source = findDiagnosticsSource(candidates, profession)

  if (!source) {
    return {
      slug: candidates[0] || null,
      entries: [] as DiagnosticEntry[]
    }
  }

  return {
    slug: source.slug,
    entries: buildEntriesFromMap(source.slug, source.map, profession)
  }
}

export default function DynamicTemplatePreview({ 
  template, 
  profession,
  onClose,
  isPreview = true // Por padrão é preview (para dono)
}: DynamicTemplatePreviewProps) {
  // Se for preview (dono): Etapa 0 = Apresentação, Etapa 1+ = Perguntas
  // Se for cliente: Começa direto na Etapa 1 (primeira pergunta)
  const [etapaAtual, setEtapaAtual] = useState(isPreview ? 0 : 1)
  const [respostas, setRespostas] = useState<Record<number, any>>({})
  const [formData, setFormData] = useState<Record<string, any>>({})

  const content = template.content || {}
  const templateType = content.template_type || template.type || 'quiz'
  const nome = template.nome || template.name || 'Template'
  const descricao = (template as any).description || (template as any).descricao || ''
  const diagnosticsInfo = getDiagnosticsInfoForTemplate(template, profession)
  
  // Obter configuração de CTA do template
  const ctaConfig = (template as any).cta_config || content.cta_config || {
    mensagem: '💬 Quer saber mais?',
    botao: 'Saiba Mais',
    tipo: 'whatsapp'
  }
  const fallbackDiagnosticsSlug =
    diagnosticsInfo.slug ||
    normalizeSlug(template.slug || template.id || template.nome || template.name || '')

  // Calcular diagnóstico baseado nas respostas do cliente
  const calcularDiagnosticoCliente = (totalPerguntas: number) => {
    if (isPreview || !questionsArray || questionsArray.length === 0) return null
    
    // Contar respostas por tipo (lógica simples: maioria das respostas determina o diagnóstico)
    // Para perfil-intestino: respostas 'a' ou 'b' = equilibrado, 'c' ou 'd' = sensível, 'e' = disbiose
    const respostasArray = Object.values(respostas).filter(r => r !== null && r !== undefined)
    if (respostasArray.length < totalPerguntas) return null
    
    // Lógica específica para quiz-detox: sistema de pontuação
    // Cada resposta: a=1, b=2, c=3, d=4, e=5 pontos
    // Ranges: 5-10 = baixaToxicidade, 11-20 = toxicidadeModerada, 21-25 = altaToxicidade
    if (fallbackDiagnosticsSlug.includes('quiz-detox') || (fallbackDiagnosticsSlug.includes('detox') && fallbackDiagnosticsSlug.includes('quiz'))) {
      const pontosPorResposta: Record<string, number> = {
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
        'e': 5
      }
      
      let scoreTotal = 0
      respostasArray.forEach((resposta: any) => {
        scoreTotal += pontosPorResposta[resposta] || 0
      })
      
      // Determinar diagnóstico baseado no score
      if (scoreTotal >= 5 && scoreTotal <= 10) {
        return 'baixaToxicidade'
      } else if (scoreTotal >= 11 && scoreTotal <= 20) {
        return 'toxicidadeModerada'
      } else if (scoreTotal >= 21 && scoreTotal <= 25) {
        return 'altaToxicidade'
      } else {
        // Fallback: usar o primeiro diagnóstico disponível se score estiver fora do range esperado
        return diagnosticsInfo.entries[0]?.resultadoId || 'baixaToxicidade'
      }
    }
    
    // Lógica específica para perfil-intestino
    if (fallbackDiagnosticsSlug.includes('perfil-intestino')) {
      const respostasBaixas = respostasArray.filter((r: any) => r === 'a' || r === 'b').length
      const respostasMedias = respostasArray.filter((r: any) => r === 'c').length
      const respostasAltas = respostasArray.filter((r: any) => r === 'd' || r === 'e').length
      
      // Determinar diagnóstico baseado na maioria
      if (respostasBaixas >= respostasMedias && respostasBaixas >= respostasAltas) {
        return 'intestinoEquilibrado'
      } else if (respostasAltas > respostasMedias) {
        return 'disbioseIntestinal'
      } else {
        return 'intestinoSensivel'
      }
    }

    // Lógica específica: Avaliação de Emagrecimento Consciente (inibidores de apetite)
    // Perguntas (ordem esperada):
    // 1=metodo, 2=tempo_uso, 3=velocidade, 4=padrao_alimentar, 5=sinais (multi_select), 6=energia, 7=percepcao_nutricao, 8=consciencia, 9=intencao
    if (
      fallbackDiagnosticsSlug.includes('avaliacao-emagrecimento-consciente') ||
      fallbackDiagnosticsSlug.includes('quiz-emagrecimento-consciente') ||
      fallbackDiagnosticsSlug.includes('inibidores-apetite')
    ) {
      const tempoUso = String(respostas[2] ?? '')
      const velocidade = String(respostas[3] ?? '')
      const padraoAlimentar = String(respostas[4] ?? '')
      const sinaisRaw = respostas[5]
      const energia = String(respostas[6] ?? '')
      const percepcaoNutricao = String(respostas[7] ?? '')

      const sinais = Array.isArray(sinaisRaw)
        ? (sinaisRaw as any[]).map(String)
        : typeof sinaisRaw === 'string'
          ? [String(sinaisRaw)]
          : []

      const scoreSinais =
        sinais.includes('nenhum') ? 0 : sinais.filter((s) => s && s !== 'nenhum').length

      const tempoUsoMaiorOuIgual1Mes = tempoUso === '1a3m' || tempoUso === 'gt_3m'

      const isDeficitNutricionalOculto =
        scoreSinais >= 2 ||
        padraoAlimentar === 'pula-refeicao' ||
        percepcaoNutricao === 'nao' ||
        tempoUsoMaiorOuIgual1Mes

      if (isDeficitNutricionalOculto) return 'deficitNutricionalOculto'

      const isRiscoRebote =
        (velocidade === 'muito-rapido' || velocidade === 'oscilante') &&
        (energia === 'pior' || energia === 'oscila')

      if (isRiscoRebote) return 'riscoEfeitoRebote'

      return 'conscienciaParcial'
    }
    
    // Lógica genérica: usar primeiro diagnóstico disponível
    return diagnosticsInfo.entries[0]?.resultadoId || null
  }

  const renderDiagnosticsCards = () => {
    if (!diagnosticsInfo.entries.length) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold">
            ⚠️ Diagnósticos não encontrados para este template ainda.
          </p>
          {fallbackDiagnosticsSlug && (
            <p className="text-sm text-yellow-700 mt-2">
              Slug analisado: <strong>{fallbackDiagnosticsSlug}</strong>
            </p>
          )}
        </div>
      )
    }

    // Se for cliente (isPreview=false), mostrar apenas o diagnóstico correspondente às respostas
    if (!isPreview && questionsArray) {
      const diagnosticoId = calcularDiagnosticoCliente(questionsArray.length)
      if (!diagnosticoId) {
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Complete todas as perguntas para ver seu diagnóstico.
            </p>
          </div>
        )
      }
      
      const entry = diagnosticsInfo.entries.find(e => e.resultadoId === diagnosticoId) || diagnosticsInfo.entries[0]
      const colors = resultColorPalette[0]
      
      return (
        <div
          key={`${fallbackDiagnosticsSlug || entry.resultadoId}-${entry.resultadoId}`}
          className={`rounded-lg p-6 border-2 ${colors.border} ${colors.bg}`}
        >
          <div className="mb-4">
            <h5 className={`text-lg font-bold ${colors.text}`}>
              {formatResultadoLabel(entry.resultadoId)}
            </h5>
          </div>
          {/* ✅ NÃO mostrar description/objetivo do template para cliente - apenas diagnóstico */}
          <div className="bg-white rounded-lg p-4 space-y-2">
            <p className="font-semibold text-gray-900">{entry.diagnostico.diagnostico}</p>
            <p className="text-gray-700">{entry.diagnostico.causaRaiz}</p>
            <p className="text-gray-700">{entry.diagnostico.acaoImediata}</p>
            {entry.diagnostico.proximoPasso && (
              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">
                {entry.diagnostico.proximoPasso}
              </p>
            )}
          </div>
        </div>
      )
    }

    // Se for preview (dono), mostrar todos os diagnósticos possíveis
    return diagnosticsInfo.entries.map((entry, index) => {
      const colors = resultColorPalette[index % resultColorPalette.length]
      return (
        <div
          key={`${fallbackDiagnosticsSlug || entry.resultadoId}-${entry.resultadoId}`}
          className={`rounded-lg p-6 border-2 ${colors.border} ${colors.bg}`}
        >
          <p className="text-xs uppercase font-semibold text-gray-500 mb-2">
            O que sua cliente verá no resultado real:
          </p>
          <div className="mb-4">
            <h5 className={`text-lg font-bold ${colors.text}`}>
              {formatResultadoLabel(entry.resultadoId)}
            </h5>
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <p className="font-semibold text-gray-900">{entry.diagnostico.diagnostico}</p>
            <p className="text-gray-700">{entry.diagnostico.causaRaiz}</p>
            <p className="text-gray-700">{entry.diagnostico.acaoImediata}</p>
            {/* Campos removidos para área Nutri: plano7Dias, suplementacao, alimentacao */}
            {profession !== 'nutri' && (
              <>
                {entry.diagnostico.plano7Dias && (
                  <p className="text-gray-700">{entry.diagnostico.plano7Dias}</p>
                )}
                {entry.diagnostico.suplementacao && (
                  <p className="text-gray-700">{entry.diagnostico.suplementacao}</p>
                )}
                {entry.diagnostico.alimentacao && (
                  <p className="text-gray-700">{entry.diagnostico.alimentacao}</p>
                )}
              </>
            )}
            {entry.diagnostico.proximoPasso && (
              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">
                {entry.diagnostico.proximoPasso}
              </p>
            )}
          </div>
        </div>
      )
    })
  }

  // Renderizar CTA após diagnósticos
  const renderCTA = () => {
    const mensagem = ctaConfig.mensagem || '💬 Quer saber mais?'
    const botaoTexto = ctaConfig.botao || 'Saiba Mais'
    
    // Calcular diagnóstico e obter texto formatado para incluir na mensagem do WhatsApp
    let resultadoTexto: string | undefined = undefined
    if (!isPreview && questionsArray && questionsArray.length > 0) {
      const diagnosticoId = calcularDiagnosticoCliente(questionsArray.length)
      if (diagnosticoId) {
        const entry = diagnosticsInfo.entries.find(e => e.resultadoId === diagnosticoId)
        if (entry) {
          // Formatar resultado como texto para incluir no WhatsApp
          const resultadoLabel = formatResultadoLabel(diagnosticoId)
          resultadoTexto = `${resultadoLabel}: ${entry.diagnostico.diagnostico}`
        }
      }
    }
    
    return (
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
        {/* Mensagem explicativa - APENAS NO PREVIEW (para o dono) */}
        {isPreview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>📋 O que acontece na ferramenta real:</strong>
              <br />
              A pessoa que preencher verá o diagnóstico abaixo correspondente às respostas dela.
              <br />
              Em seguida, virá a seguinte mensagem:
            </p>
          </div>
        )}
        
        {/* CTA - SEMPRE VISÍVEL (tanto no preview quanto no link copiado) */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <p className="text-gray-700 font-medium mb-4 text-center text-lg">
            {mensagem}
          </p>
          <div className="flex justify-center">
            {isPreview ? (
              // No preview, botão desabilitado (simulado)
              <button
                className="inline-flex items-center px-8 py-4 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-semibold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                  animation: 'pulse-subtle 2s ease-in-out infinite'
                }}
                disabled
              >
                <span className="mr-2">✨</span>
                {botaoTexto}
                <span className="ml-2">→</span>
              </button>
            ) : (
              // No link copiado, usar WellnessCTAButton real com diagnóstico incluído
              <WellnessCTAButton
                config={{
                  cta_type: 'whatsapp',
                  whatsapp_number: (template as any).whatsapp_number,
                  country_code: (template as any).country_code,
                  cta_button_text: botaoTexto,
                  custom_whatsapp_message: mensagem,
                  template_slug: template.slug
                }}
                resultadoTexto={resultadoTexto}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Debug: Log do content para verificar estrutura
  console.log('[DynamicPreview] Template:', {
    id: template.id,
    nome,
    slug: template.slug,
    type: template.type,
    templateType,
    hasContent: !!template.content,
    contentKeys: template.content ? Object.keys(template.content) : [],
    contentPreview: template.content ? JSON.stringify(template.content).substring(0, 200) : 'null',
    etapaAtual,
    profession
  })

  // Função para obter conteúdo de introdução (compartilhada entre QUIZ e GUIA)
  const getIntroContent = () => {
    const slug = (template.slug || template.id || '').toLowerCase()
    if (slug.includes('quiz-interativo') || slug.includes('interativo')) {
      return {
        titulo: '🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos',
        descricao: 'Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos, e descubra o melhor caminho para ter mais resultados.',
        mensagem: '🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.',
        beneficios: [
          'Seu tipo de metabolismo específico',
          'Como seu corpo reage à alimentação e suplementos',
          'Estratégias personalizadas para otimizar sua energia',
          'O melhor caminho para ter mais resultados'
        ]
      }
    }
    if (slug.includes('quiz-bem-estar') || slug.includes('bem-estar')) {
      return {
        titulo: '🧘‍♀️ Qual é seu perfil predominante?',
        descricao: 'Estético, Equilibrado ou Saúde/Performance: descubra em 1 minuto.',
        mensagem: '🚀 Uma avaliação que pode transformar sua relação com o bem-estar.',
        beneficios: [
          'Seu perfil predominante (Estético, Equilibrado ou Saúde/Performance)',
          'Áreas de bem-estar para otimizar',
          'Como criar rotina de autocuidado',
          'Estratégias para atingir bem-estar integral'
        ]
      }
    }
    if (slug.includes('quiz-perfil-nutricional') || slug.includes('perfil-nutricional') || slug.includes('perfil nutricional')) {
      return {
        titulo: '🥗 Descubra seu Perfil de Absorção Nutricional',
        descricao: 'Identifique como seu corpo absorve nutrientes e receba orientações personalizadas para otimizar sua nutrição.',
        mensagem: '🚀 Uma avaliação que pode transformar sua relação com a alimentação.',
        beneficios: [
          'Como seu corpo absorve nutrientes',
          'Deficiências nutricionais que podem estar afetando sua saúde',
          'Oportunidades de otimização na alimentação',
          'Recomendações personalizadas para melhorar sua nutrição'
        ]
      }
    }
    if (slug.includes('quiz-detox') || (slug.includes('detox') && slug.includes('quiz'))) {
      return {
        titulo: '🧽 Seu Corpo Está Pedindo Detox?',
        descricao: 'Identifique sinais de sobrecarga tóxica e receba orientações personalizadas para um processo de desintoxicação seguro e eficaz.',
        mensagem: '🚀 Uma avaliação que pode transformar sua saúde e energia.',
        beneficios: [
          'Sinais de sobrecarga tóxica no seu corpo',
          'Nível de toxicidade (baixa, moderada ou alta)',
          'Estratégias personalizadas para desintoxicação',
          'Produtos e suplementos que podem ajudar'
        ]
      }
    }
    if (slug.includes('quiz-energetico') || slug.includes('quiz-energético') || slug.includes('energetico') || slug.includes('energético')) {
      return {
        titulo: '⚡ Como Está Sua Energia?',
        descricao: 'Identifique seu nível de energia e receba orientações personalizadas para aumentar sua vitalidade e disposição.',
        mensagem: '🚀 Uma avaliação que pode transformar sua energia diária.',
        beneficios: [
          'Seu nível atual de energia',
          'Fatores que podem estar afetando sua energia',
          'Estratégias para aumentar vitalidade',
          'Produtos e suplementos que podem ajudar'
        ]
      }
    }
    if (slug.includes('guia-hidratacao') || slug.includes('guia hidratacao') || slug.includes('guia-hidratacao') || (slug.includes('guia') && slug.includes('hidratacao'))) {
      return {
        titulo: '💧 Guia Completo de Hidratação',
        descricao: 'Aprenda tudo sobre hidratação e como manter seu corpo sempre hidratado.',
        mensagem: '🚀 Um guia completo para otimizar sua hidratação.',
        beneficios: [
          'Como calcular sua necessidade de água',
          'Sinais de desidratação',
          'Estratégias para manter-se hidratado',
          'Produtos que podem ajudar na hidratação'
        ]
      }
    }
    // Fallback padrão
    return {
      titulo: nome,
      descricao: descricao || 'Descubra informações personalizadas sobre seu perfil.',
      mensagem: '🚀 Uma avaliação personalizada para você.',
      beneficios: [
        'Informações personalizadas',
        'Recomendações específicas',
        'Estratégias de otimização',
        'Produtos adequados ao seu perfil'
      ]
    }
  }

  // Renderizar QUIZ
  // Verificar se questions é array (formato completo) ou número (formato básico)
  const questionsArray = Array.isArray(content.questions) 
    ? content.questions 
    : (content.items && Array.isArray(content.items) ? content.items : null)
  
  if (templateType === 'quiz' && questionsArray && questionsArray.length > 0) {
    const perguntas = questionsArray
    const totalPerguntas = perguntas.length
    const totalEtapas = totalPerguntas + 1 // 0=landing (apenas preview), 1-N=perguntas, N+1=resultados

    // Cores para perguntas (ciclo de 5 cores igual Quiz Bem-Estar)
    const cores = [
      { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-300', textLight: 'text-purple-600' },
      { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300', textLight: 'text-blue-600' },
      { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-300', textLight: 'text-teal-600' },
      { bg: 'bg-pink-50', text: 'text-pink-900', border: 'border-pink-300', textLight: 'text-pink-600' },
      { bg: 'bg-indigo-50', text: 'text-indigo-900', border: 'border-indigo-300', textLight: 'text-indigo-600' }
    ]
    const getCor = (index: number) => cores[index % cores.length]

    // Labels para navegação
    const labels = ['Início', ...Array.from({ length: totalPerguntas }, (_, i) => String(i + 1)), 'Resultados']

    const temRespostaNaEtapa = (etapa: number) => {
      const v = respostas[etapa]
      if (Array.isArray(v)) return v.length > 0
      return Boolean(v)
    }

    const handleNext = () => {
      setEtapaAtual(Math.min(totalEtapas, etapaAtual + 1))
    }

    const handlePrevious = () => {
      setEtapaAtual(Math.max(0, etapaAtual - 1))
    }

    // Título do preview baseado no slug/nome (igual Quiz Bem-Estar)
    const getPreviewTitle = () => {
      const slug = (template.slug || template.id || '').toLowerCase()
      if (slug.includes('quiz-interativo') || slug.includes('interativo')) {
        return '🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"'
      }
      if (slug.includes('quiz-bem-estar') || slug.includes('bem-estar')) {
        return '🧘‍♀️ Preview do Quiz Bem-Estar - "Descubra seu Perfil de Bem-Estar"'
      }
      if (slug.includes('quiz-perfil-nutricional') || slug.includes('perfil-nutricional') || slug.includes('perfil nutricional')) {
        return '🥗 Preview do Quiz Perfil Nutricional - "Identifique seu Perfil de Absorção"'
      }
      if (slug.includes('quiz-detox') || (slug.includes('detox') && slug.includes('quiz'))) {
        return '🧽 Preview do Quiz Detox - "Descubra se seu Corpo Precisa de Detox"'
      }
      if (slug.includes('quiz-energetico') || slug.includes('quiz-energético') || slug.includes('energetico') || slug.includes('energético')) {
        return '⚡ Preview do Quiz Energético - "Descubra seu Nível de Energia"'
      }
      if (slug.includes('quiz-emocional') || slug.includes('avaliacao-emocional') || slug.includes('avaliação-emocional') || (slug.includes('emocional') && slug.includes('avaliacao'))) {
        return '💖 Preview da Avaliação Emocional - "Avaliação de Forma Emocional"'
      }
      if (slug.includes('quiz-intolerancia') || slug.includes('quiz-intolerância') || slug.includes('intolerancia') || slug.includes('intolerância')) {
        return '🔍 Preview da Avaliação de Intolerância - "Avaliação de Intolerância Alimentar"'
      }
      if (slug.includes('quiz-perfil-metabolico') || slug.includes('quiz-perfil-metabólico') || slug.includes('perfil-metabolico') || slug.includes('perfil-metabólico') || (slug.includes('metabolico') && slug.includes('perfil')) || (slug.includes('metabólico') && slug.includes('perfil'))) {
        return '⚡ Preview da Avaliação Metabólica - "Avaliação do Perfil Metabólico"'
      }
      if (slug.includes('quiz-eletrolito') || slug.includes('quiz-eletrólito') || slug.includes('eletrolito') || slug.includes('eletrólito') || slug.includes('eletrolitos') || slug.includes('eletrólitos')) {
        return '⚡ Preview do Diagnóstico de Eletrólitos - "Diagnóstico de Eletrólitos"'
      }
      if (slug.includes('quiz-sintomas-intestinais') || slug.includes('sintomas-intestinais') || (slug.includes('sintoma') && slug.includes('intestina'))) {
        return '🌿 Preview do Diagnóstico de Sintomas Intestinais - "Diagnóstico de Sintomas Intestinais"'
      }
      if (slug.includes('quiz-avaliacao-inicial') || slug.includes('avaliacao-inicial') || slug.includes('avaliação-inicial')) {
        return '🌟 Preview da Avaliação Inicial - "Avaliação Inicial"'
      }
      if (slug.includes('quiz-pronto-emagrecer') || slug.includes('pronto-emagrecer') || (slug.includes('pronto') && slug.includes('emagrecer'))) {
        return '🎯 Preview - Pronto para Emagrecer com Saúde'
      }
      if (slug.includes('quiz-tipo-fome') || slug.includes('tipo-fome') || (slug.includes('tipo') && slug.includes('fome'))) {
        return '🍽️ Preview - Qual é o seu Tipo de Fome?'
      }
      if (slug.includes('quiz-alimentacao-saudavel') || slug.includes('alimentacao-saudavel') || slug.includes('alimentação-saudável')) {
        return '🥗 Preview - Quiz: Alimentação Saudável'
      }
      if (slug.includes('quiz-sindrome-metabolica') || slug.includes('sindrome-metabolica') || slug.includes('síndrome-metabólica') || (slug.includes('sindrome') && slug.includes('metabolica'))) {
        return '⚠️ Preview - Risco de Síndrome Metabólica'
      }
      if (slug.includes('quiz-retencao-liquidos') || slug.includes('retencao-liquidos') || slug.includes('retenção-líquidos') || (slug.includes('retencao') && slug.includes('liquido'))) {
        return '💧 Preview - Teste de Retenção de Líquidos'
      }
      if (slug.includes('quiz-conhece-seu-corpo') || slug.includes('conhece-seu-corpo') || slug.includes('você conhece') || (slug.includes('conhece') && slug.includes('corpo'))) {
        return '🧠 Preview - Você Conhece o Seu Corpo?'
      }
      if (slug.includes('quiz-nutrido-vs-alimentado') || slug.includes('nutrido-vs-alimentado') || slug.includes('nutrido-alimentado') || (slug.includes('nutrido') && slug.includes('alimentado'))) {
        return '🍎 Preview - Você está Nutrido ou Apenas Alimentado?'
      }
      if (slug.includes('quiz-alimentacao-rotina') || slug.includes('alimentacao-rotina') || slug.includes('alimentação-rotina') || (slug.includes('alimentacao') && slug.includes('rotina'))) {
        return '⏰ Preview - Você está se Alimentando Conforme sua Rotina?'
      }
      if (slug.includes('quiz-ganhos-prosperidade') || slug.includes('ganhos-prosperidade') || slug.includes('ganhos e prosperidade') || (slug.includes('ganhos') && slug.includes('prosperidade'))) {
        return '💰 Preview - Quiz: Ganhos e Prosperidade'
      }
      if (slug.includes('quiz-potencial-crescimento') || slug.includes('potencial-crescimento') || slug.includes('potencial e crescimento') || (slug.includes('potencial') && slug.includes('crescimento'))) {
        return '🌱 Preview - Quiz: Potencial e Crescimento'
      }
      if (slug.includes('quiz-proposito-equilibrio') || slug.includes('proposito-equilibrio') || slug.includes('propósito-equilíbrio') || slug.includes('proposito e equilibrio') || slug.includes('propósito e equilíbrio') || (slug.includes('proposito') && slug.includes('equilibrio'))) {
        return '🎯 Preview - Quiz: Propósito e Equilíbrio'
      }
      if (slug.includes('checklist-alimentar') || slug.includes('checklist alimentar') || (slug.includes('checklist') && slug.includes('alimentar'))) {
        return '🍽️ Preview - Checklist Alimentar'
      }
      if (slug.includes('checklist-detox') || slug.includes('checklist detox') || (slug.includes('checklist') && slug.includes('detox'))) {
        return '🧪 Preview - Checklist Detox'
      }
      if (slug.includes('guia-hidratacao') || slug.includes('guia hidratacao') || slug.includes('guia-hidratacao') || (slug.includes('guia') && slug.includes('hidratacao'))) {
        return '💧 Preview - Guia de Hidratação'
      }
      if (slug.includes('calculadora-imc') || slug.includes('calculadora imc') || (slug.includes('calculadora') && slug.includes('imc'))) {
        return '📊 Preview - Calculadora de IMC'
      }
      if (slug.includes('calculadora-proteina') || slug.includes('calculadora-proteína') || slug.includes('calculadora proteina') || slug.includes('calculadora proteína') || (slug.includes('calculadora') && (slug.includes('proteina') || slug.includes('proteína')))) {
        return '🥩 Preview - Calculadora de Proteína'
      }
      if (slug.includes('calculadora-hidratacao') || slug.includes('calculadora-hidratação') || slug.includes('calculadora hidratacao') || slug.includes('calculadora hidratação') || slug.includes('calculadora-agua') || slug.includes('calculadora-água') || slug.includes('calculadora agua') || slug.includes('calculadora água') || (slug.includes('calculadora') && (slug.includes('hidratacao') || slug.includes('hidratação') || slug.includes('agua') || slug.includes('água')))) {
        return '💧 Preview - Calculadora de Hidratação'
      }
      if (slug.includes('calculadora-caloria') || slug.includes('calculadora-calorias') || slug.includes('calculadora caloria') || slug.includes('calculadora calorias') || (slug.includes('calculadora') && (slug.includes('caloria') || slug.includes('calorias')))) {
        return '🔥 Preview - Calculadora de Calorias'
      }
      return `🎯 Preview do Quiz - "${nome}"`
    }

    // getIntroContent já está definido no escopo mais amplo (linha ~830)
    // Não precisa redefinir aqui - a função já está disponível

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {getPreviewTitle()}
        </h3>
        
        <div className="relative">
          {/* Tela de Abertura - Etapa 0 */}
          {etapaAtual === 0 && (() => {
            const intro = getIntroContent()
            const slug = (template.slug || template.id || '').toLowerCase()
            const isEmocional = slug.includes('quiz-emocional') || slug.includes('avaliacao-emocional') || slug.includes('avaliação-emocional') || (slug.includes('emocional') && slug.includes('avaliacao'))
            const isIntolerancia = slug.includes('quiz-intolerancia') || slug.includes('quiz-intolerância') || slug.includes('intolerancia') || slug.includes('intolerância')
            const isPerfilMetabolico = slug.includes('quiz-perfil-metabolico') || slug.includes('quiz-perfil-metabólico') || slug.includes('perfil-metabolico') || slug.includes('perfil-metabólico') || (slug.includes('metabolico') && slug.includes('perfil')) || (slug.includes('metabólico') && slug.includes('perfil'))
            const isEletrolitos = slug.includes('quiz-eletrolito') || slug.includes('quiz-eletrólito') || slug.includes('eletrolito') || slug.includes('eletrólito') || slug.includes('eletrolitos') || slug.includes('eletrólitos')
            const isSintomasIntestinais = slug.includes('quiz-sintomas-intestinais') || slug.includes('sintomas-intestinais') || (slug.includes('sintoma') && slug.includes('intestina'))
            const isAvaliacaoInicial = slug.includes('quiz-avaliacao-inicial') || slug.includes('avaliacao-inicial') || slug.includes('avaliação-inicial')
            const isProntoEmagrecer = slug.includes('quiz-pronto-emagrecer') || slug.includes('pronto-emagrecer') || (slug.includes('pronto') && slug.includes('emagrecer'))
            const isTipoFome = slug.includes('quiz-tipo-fome') || slug.includes('tipo-fome') || (slug.includes('tipo') && slug.includes('fome'))
            const isAlimentacaoSaudavel = slug.includes('quiz-alimentacao-saudavel') || slug.includes('alimentacao-saudavel') || slug.includes('alimentação-saudável')
            const isSindromeMetabolica = slug.includes('quiz-sindrome-metabolica') || slug.includes('sindrome-metabolica') || slug.includes('síndrome-metabólica') || (slug.includes('sindrome') && slug.includes('metabolica'))
            const isRetencaoLiquidos = slug.includes('quiz-retencao-liquidos') || slug.includes('retencao-liquidos') || slug.includes('retenção-líquidos') || (slug.includes('retencao') && slug.includes('liquido'))
            const isConheceSeuCorpo = slug.includes('quiz-conhece-seu-corpo') || slug.includes('conhece-seu-corpo') || slug.includes('você conhece') || (slug.includes('conhece') && slug.includes('corpo'))
            const isNutridoVsAlimentado = slug.includes('quiz-nutrido-vs-alimentado') || slug.includes('nutrido-vs-alimentado') || slug.includes('nutrido-alimentado') || (slug.includes('nutrido') && slug.includes('alimentado'))
            const isAlimentacaoRotina = slug.includes('quiz-alimentacao-rotina') || slug.includes('alimentacao-rotina') || slug.includes('alimentação-rotina') || (slug.includes('alimentacao') && slug.includes('rotina'))
            const isGanhosProsperidade = slug.includes('quiz-ganhos-prosperidade') || slug.includes('ganhos-prosperidade') || slug.includes('ganhos e prosperidade') || (slug.includes('ganhos') && slug.includes('prosperidade'))
            const isPotencialCrescimento = slug.includes('quiz-potencial-crescimento') || slug.includes('potencial-crescimento') || slug.includes('potencial e crescimento') || (slug.includes('potencial') && slug.includes('crescimento'))
            const isPropositoEquilibrio = slug.includes('quiz-proposito-equilibrio') || slug.includes('proposito-equilibrio') || slug.includes('propósito-equilíbrio') || slug.includes('proposito e equilibrio') || slug.includes('propósito e equilíbrio') || (slug.includes('proposito') && slug.includes('equilibrio'))
            const isChecklistAlimentar = slug.includes('checklist-alimentar') || slug.includes('checklist alimentar') || (slug.includes('checklist') && slug.includes('alimentar'))
            const isChecklistDetox = slug.includes('checklist-detox') || slug.includes('checklist detox') || (slug.includes('checklist') && slug.includes('detox'))
            const isDesafio7Dias = slug.includes('desafio-7-dias') || slug.includes('desafio-7') || (slug.includes('desafio') && slug.includes('7'))
            const isDesafio21Dias = slug.includes('desafio-21-dias') || slug.includes('desafio-21') || (slug.includes('desafio') && slug.includes('21'))
            
            // Determinar cores baseado no template
            let gradientClass = 'from-purple-50 to-teal-50'
            let borderClass = 'border-gray-200'
            let textColorClass = 'text-purple-600'
            
            if (isEmocional) {
              gradientClass = 'from-pink-50 to-purple-50 border-2 border-pink-200'
              borderClass = 'border-pink-200'
              textColorClass = 'text-pink-600'
            } else if (isIntolerancia) {
              gradientClass = 'from-orange-50 to-red-50 border-2 border-orange-200'
              borderClass = 'border-orange-200'
              textColorClass = 'text-orange-600'
            } else if (isPerfilMetabolico) {
              gradientClass = 'from-blue-50 to-indigo-50 border-2 border-blue-200'
              borderClass = 'border-blue-200'
              textColorClass = 'text-blue-600'
            } else if (isEletrolitos) {
              gradientClass = 'from-cyan-50 to-blue-50 border-2 border-cyan-200'
              borderClass = 'border-cyan-200'
              textColorClass = 'text-cyan-600'
            } else if (isSintomasIntestinais) {
              gradientClass = 'from-teal-50 to-green-50 border-2 border-teal-200'
              borderClass = 'border-teal-200'
              textColorClass = 'text-teal-600'
            } else if (isAvaliacaoInicial) {
              gradientClass = 'from-green-50 to-emerald-50 border-2 border-green-200'
              borderClass = 'border-green-200'
              textColorClass = 'text-green-600'
            } else if (isProntoEmagrecer) {
              gradientClass = 'from-purple-50 to-pink-50 border-2 border-purple-200'
              borderClass = 'border-purple-200'
              textColorClass = 'text-purple-600'
            } else if (isTipoFome) {
              gradientClass = 'from-amber-50 to-orange-50 border-2 border-amber-200'
              borderClass = 'border-amber-200'
              textColorClass = 'text-amber-600'
            } else if (isAlimentacaoSaudavel) {
              gradientClass = 'from-emerald-50 to-teal-50 border-2 border-emerald-200'
              borderClass = 'border-emerald-200'
              textColorClass = 'text-emerald-600'
            } else if (isSindromeMetabolica) {
              gradientClass = 'from-rose-50 to-pink-50 border-2 border-rose-200'
              borderClass = 'border-rose-200'
              textColorClass = 'text-rose-600'
            } else if (isRetencaoLiquidos) {
              gradientClass = 'from-blue-50 to-cyan-50 border-2 border-blue-200'
              borderClass = 'border-blue-200'
              textColorClass = 'text-blue-600'
            } else if (isConheceSeuCorpo) {
              gradientClass = 'from-purple-50 to-pink-50 border-2 border-purple-200'
              borderClass = 'border-purple-200'
              textColorClass = 'text-purple-600'
            } else if (isNutridoVsAlimentado) {
              gradientClass = 'from-orange-50 to-amber-50 border-2 border-orange-200'
              borderClass = 'border-orange-200'
              textColorClass = 'text-orange-600'
            } else if (isAlimentacaoRotina) {
              gradientClass = 'from-indigo-50 to-violet-50 border-2 border-indigo-200'
              borderClass = 'border-indigo-200'
              textColorClass = 'text-indigo-600'
            } else if (isGanhosProsperidade) {
              gradientClass = 'from-amber-50 to-yellow-50 border-2 border-amber-200'
              borderClass = 'border-amber-200'
              textColorClass = 'text-amber-600'
            } else if (isPotencialCrescimento) {
              gradientClass = 'from-green-50 to-emerald-50 border-2 border-green-200'
              borderClass = 'border-green-200'
              textColorClass = 'text-green-600'
            } else if (isPropositoEquilibrio) {
              gradientClass = 'from-purple-50 to-indigo-50 border-2 border-purple-200'
              borderClass = 'border-purple-200'
              textColorClass = 'text-purple-600'
            } else if (isChecklistAlimentar) {
              gradientClass = 'from-teal-50 to-blue-50 border-2 border-teal-200'
              borderClass = 'border-teal-200'
              textColorClass = 'text-teal-600'
            } else if (isChecklistDetox) {
              gradientClass = 'from-purple-50 to-pink-50 border-2 border-purple-200'
              borderClass = 'border-purple-200'
              textColorClass = 'text-purple-600'
            } else if (isDesafio7Dias) {
              gradientClass = 'from-orange-50 to-red-50 border-2 border-orange-200'
              borderClass = 'border-orange-200'
              textColorClass = 'text-orange-600'
            } else if (isDesafio21Dias) {
              gradientClass = 'from-green-50 to-emerald-50 border-2 border-green-200'
              borderClass = 'border-green-200'
              textColorClass = 'text-green-600'
            }
            
            return (
              <div className={`bg-gradient-to-r ${gradientClass} p-6 rounded-lg`}>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{intro.titulo}</h4>
                {intro.descricao && (
                  <p className="text-gray-700 mb-3">{intro.descricao}</p>
                )}
                <p className={`font-semibold ${textColorClass}`}>{intro.mensagem}</p>
                {intro.beneficios && intro.beneficios.length > 0 && (
                  <div className={`bg-white rounded-lg p-4 mt-4 border ${borderClass}`}>
                    <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
                    <div className="space-y-2 text-sm text-gray-600">
                      {intro.beneficios.map((beneficio, idx) => (
                        <p key={idx}>✓ {beneficio}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Perguntas 1-N */}
          {etapaAtual >= 1 && etapaAtual <= totalPerguntas && (() => {
            const perguntaAtual = perguntas[etapaAtual - 1]
            const corAtual = getCor(etapaAtual - 1)
            
            return (
              <div className="space-y-6">
                <div className={`${corAtual.bg} p-4 rounded-lg`}>
                  <h4 className={`font-semibold ${corAtual.text} mb-3`}>
                    {etapaAtual}. {perguntaAtual.question}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {perguntaAtual.options && perguntaAtual.options.map((op: any, idx: number) => {
                      const opcaoLabel = op.label || op
                      const opcaoId = String(op.id ?? op.value ?? idx)
                      const respostaAtual = respostas[etapaAtual]

                      const isMultiSelect = perguntaAtual.type === 'multi_select'
                      const selectedArray = Array.isArray(respostaAtual) ? (respostaAtual as any[]).map(String) : []
                      const isSelected = isMultiSelect ? selectedArray.includes(opcaoId) : String(respostaAtual ?? '') === opcaoId
                      
                      // Multi-select (ex.: sinais)
                      if (isMultiSelect) {
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const current = Array.isArray(respostaAtual) ? (respostaAtual as any[]).map(String) : []
                              const selected = current.includes(opcaoId)

                              // "Nenhum" é exclusivo
                              let next: string[] = []
                              if (opcaoId === 'nenhum') {
                                next = selected ? [] : ['nenhum']
                              } else {
                                const withoutNenhum = current.filter((v) => v !== 'nenhum')
                                next = selected
                                  ? withoutNenhum.filter((v) => v !== opcaoId)
                                  : [...withoutNenhum, opcaoId]
                              }

                              setRespostas({ ...respostas, [etapaAtual]: next })
                            }}
                            className={`flex items-center p-3 bg-white rounded-lg border text-left transition-colors ${
                              isSelected ? corAtual.border + ' border-2' : corAtual.border
                            } hover:opacity-80`}
                          >
                            <span className={`mr-3 inline-flex w-5 justify-center ${isSelected ? corAtual.textLight : 'text-gray-400'}`}>
                              {isSelected ? '✓' : '•'}
                            </span>
                            <span className="text-gray-700">{opcaoLabel}</span>
                          </button>
                        )
                      }

                      return (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border ${isSelected ? corAtual.border + ' border-2' : corAtual.border} cursor-pointer hover:opacity-80 transition-colors ${isSelected ? 'bg-opacity-20 ' + corAtual.bg : ''}`}
                        >
                          <input 
                            type="radio" 
                            name={`pergunta-${etapaAtual}`} 
                            value={opcaoId}
                            checked={isSelected}
                            onChange={(e) => {
                              setRespostas({ ...respostas, [etapaAtual]: e.target.value })
                            }}
                            className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2" 
                            disabled={isPreview === false && false} // Sempre habilitado para cliente
                          />
                          <span className="text-gray-700">{opcaoLabel}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Tela de Resultados - Etapa N+1 */}
          {etapaAtual > totalPerguntas && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                {isPreview ? (
                  <>
                    <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis do Quiz</h4>
                    <p className="text-sm text-gray-600">
                      Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final, baseado nas respostas que ela informar no formulário original.
                    </p>
                    <p className="text-xs text-gray-500">
                      Use este quadro como referência para orientar a conversa e preparar o plano de acompanhamento correspondente a cada resultado.
                    </p>
                  </>
                ) : (
                  <h4 className="text-xl font-bold text-gray-900">📊 Seu Resultado</h4>
                )}
              </div>
              {/* ✅ NÃO mostrar description/objetivo do template para cliente - apenas diagnóstico puro */}
              {/* ✅ GARANTIR: Nenhum texto explicativo interno deve aparecer aqui */}
              {!isPreview && (
                <div className="hidden">
                  {/* Garantir que descrição/objetivo do template NÃO sejam renderizados para cliente */}
                  {descricao && descricao.toLowerCase().includes('identificar pessoas') && console.warn('⚠️ Texto explicativo detectado na descrição, mas não será renderizado para cliente')}
                </div>
              )}
              {renderDiagnosticsCards()}
              {renderCTA()}
            </div>
          )}

          {/* Navegação */}
          {isPreview ? (
            // PREVIEW: Navegação completa com botões numerados (para o dono)
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={etapaAtual === 0}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalEtapas + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setEtapaAtual(i)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      etapaAtual === i
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={etapaAtual === i ? {
                      background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                    } : {}}
                    title={labels[i] || `Etapa ${i}`}
                  >
                    {labels[i] || `${i}`}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={etapaAtual === totalEtapas}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                }}
              >
                Próxima →
              </button>
            </div>
          ) : (
            // CLIENTE: Apenas botão "Próximo" (sem navegação lateral)
            <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  // Verificar se tem resposta antes de avançar
                  if (etapaAtual >= 1 && etapaAtual <= totalPerguntas) {
                    if (!temRespostaNaEtapa(etapaAtual)) {
                      // Não avançar se não tiver resposta
                      return
                    }
                  }
                  handleNext()
                }}
                disabled={etapaAtual === totalEtapas || (etapaAtual >= 1 && etapaAtual <= totalPerguntas && !temRespostaNaEtapa(etapaAtual))}
                className="flex items-center px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                }}
              >
                {etapaAtual >= 1 && etapaAtual < totalPerguntas ? 'Próxima →' : etapaAtual === totalPerguntas ? 'Ver Resultado' : 'Próxima →'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Renderizar CALCULADORA
  if (templateType === 'calculator' && content.fields) {
    let campos = content.fields || []
    const slugCalc = (template.slug || template.id || '').toLowerCase()
    // Calculadora de proteína: não usa idade (fórmula = peso × objetivo × atividade)
    if (slugCalc.includes('proteina') || slugCalc.includes('proteína')) {
      campos = campos.filter((f: any) => {
        const id = String(f?.id || f?.name || '').toLowerCase()
        return id !== 'idade' && !id.includes('idade')
      })
    }
    const slugCalculadora = (template.slug || template.id || '').toLowerCase()
    const fieldKey = (field: any, index: number) => field?.id || field?.name || `field-${index}`
    const mockRespostas = useMemo(
      () => buildCalculatorMockResponses(slugCalculadora, campos),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [slugCalculadora, JSON.stringify(campos)]
    )
    const todosPreenchidos = campos.every((field: any, index: number) => respostas[fieldKey(field, index)])
    
    // Funções para título e introdução das calculadoras
    const getCalculadoraTitle = () => {
      const slug = (template.slug || template.id || '').toLowerCase()
      if (slug.includes('calculadora-imc') || slug.includes('calculadora imc') || (slug.includes('calculadora') && slug.includes('imc'))) {
        return '📊 Preview - Calculadora de IMC'
      }
      if (slug.includes('calculadora-proteina') || slug.includes('calculadora-proteína') || slug.includes('calculadora proteina') || slug.includes('calculadora proteína') || (slug.includes('calculadora') && (slug.includes('proteina') || slug.includes('proteína')))) {
        return '🥩 Preview - Calculadora de Proteína'
      }
      if (slug.includes('calculadora-hidratacao') || slug.includes('calculadora-hidratação') || slug.includes('calculadora hidratacao') || slug.includes('calculadora hidratação') || slug.includes('calculadora-agua') || slug.includes('calculadora-água') || slug.includes('calculadora agua') || slug.includes('calculadora água') || (slug.includes('calculadora') && (slug.includes('hidratacao') || slug.includes('hidratação') || slug.includes('agua') || slug.includes('água')))) {
        return '💧 Preview - Calculadora de Hidratação'
      }
      if (slug.includes('calculadora-caloria') || slug.includes('calculadora-calorias') || slug.includes('calculadora caloria') || slug.includes('calculadora calorias') || (slug.includes('calculadora') && (slug.includes('caloria') || slug.includes('calorias')))) {
        return '🔥 Preview - Calculadora de Calorias'
      }
      return `📊 Preview - ${nome}`
    }
    
    const getCalculadoraIntro = () => {
      const slug = (template.slug || template.id || '').toLowerCase()
      if (slug.includes('calculadora-imc') || slug.includes('calculadora imc') || (slug.includes('calculadora') && slug.includes('imc'))) {
        return {
          titulo: '📊 Calcule seu Índice de Massa Corporal',
          descricao: 'Descubra seu IMC e receba interpretação personalizada com orientações para alcançar seu objetivo de forma saudável.',
          mensagem: '🚀 Uma calculadora precisa que pode transformar sua relação com o peso e saúde.',
          beneficios: [
            'Seu IMC atual e interpretação personalizada',
            'Categoria de peso (Baixo, Normal, Sobrepeso ou Obesidade)',
            'Orientações específicas para seu perfil',
            'Plano personalizado para alcançar seu objetivo'
          ]
        }
      }
      if (slug.includes('calculadora-proteina') || slug.includes('calculadora-proteína') || slug.includes('calculadora proteina') || slug.includes('calculadora proteína') || (slug.includes('calculadora') && (slug.includes('proteina') || slug.includes('proteína')))) {
        return {
          titulo: '🥩 Calcule sua Necessidade Proteica Diária',
          descricao: 'Descubra quantas gramas de proteína você precisa por dia baseado no seu peso, atividade física e objetivo.',
          mensagem: '🚀 Uma calculadora personalizada que pode otimizar seus resultados.',
          beneficios: [
            'Sua necessidade proteica diária personalizada',
            'Distribuição ideal ao longo do dia',
            'Fontes de proteína adequadas ao seu perfil',
            'Estratégias para alcançar sua meta proteica'
          ]
        }
      }
      if (slug.includes('calculadora-hidratacao') || slug.includes('calculadora-hidratação') || slug.includes('calculadora hidratacao') || slug.includes('calculadora hidratação') || slug.includes('calculadora-agua') || slug.includes('calculadora-água') || slug.includes('calculadora agua') || slug.includes('calculadora água') || (slug.includes('calculadora') && (slug.includes('hidratacao') || slug.includes('hidratação') || slug.includes('agua') || slug.includes('água')))) {
        return {
          titulo: '💧 Calcule sua Necessidade de Hidratação Diária',
          descricao: 'Descubra quantos litros de água você precisa por dia baseado no seu peso, atividade física e condições climáticas.',
          mensagem: '🚀 Uma calculadora precisa que pode otimizar sua hidratação e performance.',
          beneficios: [
            'Sua necessidade hídrica diária personalizada',
            'Distribuição ideal ao longo do dia',
            'Estratégias para manter-se hidratado',
            'Otimização para performance e bem-estar'
          ]
        }
      }
      if (slug.includes('calculadora-caloria') || slug.includes('calculadora-calorias') || slug.includes('calculadora caloria') || slug.includes('calculadora calorias') || (slug.includes('calculadora') && (slug.includes('caloria') || slug.includes('calorias')))) {
        return {
          titulo: '🔥 Calcule suas Necessidades Calóricas Diárias',
          descricao: 'Descubra quantas calorias você precisa por dia baseado no seu peso, altura, idade, atividade física e objetivo.',
          mensagem: '🚀 Uma calculadora personalizada que pode transformar seus resultados.',
          beneficios: [
            'Suas necessidades calóricas diárias personalizadas',
            'Distribuição ideal de macronutrientes',
            'Estratégias para alcançar seu objetivo (perder, manter ou ganhar peso)',
            'Plano personalizado baseado no seu perfil'
          ]
        }
      }
      return {
        titulo: descricao ? descricao.split('.')[0] : nome,
        descricao: descricao || '',
        mensagem: '🚀 Uma calculadora que pode transformar sua relação com o bem-estar.',
        beneficios: undefined
      }
    }

    // Tela de abertura (etapa 0) para calculadoras
    if (etapaAtual === 0) {
      const intro = getCalculadoraIntro()
      const slug = (template.slug || template.id || '').toLowerCase()
      const isImc = slug.includes('calculadora-imc') || slug.includes('calculadora imc') || (slug.includes('calculadora') && slug.includes('imc'))
      const isProteina = slug.includes('calculadora-proteina') || slug.includes('calculadora-proteína') || slug.includes('calculadora proteina') || slug.includes('calculadora proteína') || (slug.includes('calculadora') && (slug.includes('proteina') || slug.includes('proteína')))
      const isHidratacao = slug.includes('calculadora-hidratacao') || slug.includes('calculadora-hidratação') || slug.includes('calculadora hidratacao') || slug.includes('calculadora hidratação') || slug.includes('calculadora-agua') || slug.includes('calculadora-água') || slug.includes('calculadora agua') || slug.includes('calculadora água') || (slug.includes('calculadora') && (slug.includes('hidratacao') || slug.includes('hidratação') || slug.includes('agua') || slug.includes('água')))
      const isCalorias = slug.includes('calculadora-caloria') || slug.includes('calculadora-calorias') || slug.includes('calculadora caloria') || slug.includes('calculadora calorias') || (slug.includes('calculadora') && (slug.includes('caloria') || slug.includes('calorias')))
      
      let gradientClass = 'from-blue-50 to-cyan-50'
      let borderClass = 'border-blue-200'
      let textColorClass = 'text-blue-600'
      
      if (isImc) {
        gradientClass = 'from-blue-50 to-indigo-50 border-2 border-blue-200'
        borderClass = 'border-blue-200'
        textColorClass = 'text-blue-600'
      } else if (isProteina) {
        gradientClass = 'from-orange-50 to-amber-50 border-2 border-orange-200'
        borderClass = 'border-orange-200'
        textColorClass = 'text-orange-600'
      } else if (isHidratacao) {
        gradientClass = 'from-cyan-50 to-blue-50 border-2 border-cyan-200'
        borderClass = 'border-cyan-200'
        textColorClass = 'text-cyan-600'
      } else if (isCalorias) {
        gradientClass = 'from-orange-50 to-red-50 border-2 border-orange-200'
        borderClass = 'border-orange-200'
        textColorClass = 'text-orange-600'
      }
      
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            {getCalculadoraTitle()}
          </h3>
          
          <div className={`bg-gradient-to-br ${gradientClass} rounded-xl p-6 border-2 ${borderClass} mb-6`}>
            <h4 className={`text-2xl font-bold ${textColorClass} mb-3`}>
              {intro.titulo}
            </h4>
            <p className="text-gray-700 mb-4 text-lg">
              {intro.descricao}
            </p>
            <p className={`${textColorClass} font-semibold mb-4`}>
              {intro.mensagem}
            </p>
            
            {intro.beneficios && intro.beneficios.length > 0 && (
              <div className="mt-6">
                <h5 className={`font-bold ${textColorClass} mb-3 text-lg`}>
                  O que você vai descobrir:
                </h5>
                <ul className="space-y-2">
                  {intro.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`${textColorClass} mr-2 font-bold`}>✓</span>
                      <span className="text-gray-700">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setEtapaAtual(1)}
            className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
              animation: 'pulse-subtle 2s ease-in-out infinite'
            }}
          >
            <span className="mr-2">✨</span>
            Iniciar Cálculo
            <span className="ml-2">→</span>
          </button>
        </div>
      )
    }

    if (etapaAtual === 1 && !todosPreenchidos) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {getCalculadoraTitle()}
          </h3>

          <p className="text-gray-600 mb-6">
            Veja todos os campos que o cliente preencherá. Mostramos o visual exato da calculadora, sem respostas predefinidas.
          </p>

          <div className="space-y-4">
            {campos.map((field: any, index: number) => (
              <div key={fieldKey(field, index)}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label || `Campo ${index + 1}`}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' && field.options ? (
                  <div className="border border-gray-300 rounded-lg bg-white">
                    <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                      Opções disponíveis
                    </div>
                    <div className="divide-y divide-gray-200">
                      {field.options.map((opt: any, optIndex: number) => (
                        <div
                          key={`${fieldKey(field, index)}-opt-${optIndex}`}
                          className="px-4 py-2 text-gray-700"
                        >
                          {pickOptionLabel(field, pickOptionValue(opt))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-500"
                    placeholder={
                      field.placeholder ||
                      (hasFriendlyPreset(field)
                        ? hasFriendlyPreset(field)?.labels.join(' / ')
                        : 'Campo disponível para o cliente')
                    }
                    disabled
                  />
                )}
                {field.unit && (
                  <p className="text-xs text-gray-500 mt-1">
                    Unidade: {field.unit}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setEtapaAtual(0)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Voltar para apresentação
            </button>
            <button
              onClick={() => {
                setRespostas({ ...(mockRespostas as Record<string, any>) })
                setEtapaAtual(2)
              }}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Ver resultado simulado
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            *O cliente verá exatamente estes campos e escolherá as opções de acordo com a realidade dele.
          </p>
        </div>
      )
    }

    // Resultado da calculadora
    if (todosPreenchidos) {
      const respostasVisiveis = Object.keys(respostas).length ? respostas : mockRespostas
      const resultadoSimulado = getSimulatedCalculatorResult(slugCalculadora, respostasVisiveis, profession)

      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {getCalculadoraTitle()}
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-900 font-semibold">
              {resultadoSimulado.destaque}
            </p>
            <p className="text-gray-700 mt-2">
              {resultadoSimulado.descricao}
            </p>
            <p className="text-sm text-gray-600 mt-4">
              {resultadoSimulado.detalhe}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {profession === 'coach' ? 'Diagnósticos Coach simulados' : profession === 'wellness' ? 'Diagnósticos Wellness simulados' : 'Diagnósticos Nutri simulados'}
              </h4>
              <p className="text-sm text-gray-600">
                Esta prévia mostra exatamente o que sua cliente verá como resultado final, conforme os dados que ela preencher.
              </p>
            </div>
            {renderCTA()}
            <div className="space-y-4">
              {renderDiagnosticsCards()}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setEtapaAtual(1)
                setRespostas({})
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              ← Revisar campos
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Fechar preview
              </button>
            )}
          </div>
        </div>
      )
    }

    // fallback
    return null
  }

  // Renderizar PLANILHA/CHECKLIST
  if ((templateType === 'planilha' || templateType === 'checklist') && content.items) {
    const itens = content.items
    const itemAtual = itens[etapaAtual - 1]
    const totalItens = itens.length

    if (etapaAtual <= totalItens && itemAtual) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                Item {etapaAtual} de {totalItens}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round((etapaAtual / totalItens) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
                  width: `${(etapaAtual / totalItens) * 100}%`
                }}
              />
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            {itemAtual.question || itemAtual.title || `Item ${etapaAtual}`}
          </h4>

          {itemAtual.options && (
            <div className="space-y-2 mb-4">
              {itemAtual.options.map((op: any, index: number) => (
                <label
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="mr-3"
                    disabled
                  />
                  <span className="text-gray-700">
                    {op.label || op}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setEtapaAtual(Math.max(1, etapaAtual - 1))}
              disabled={etapaAtual === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setEtapaAtual(etapaAtual + 1)}
              className="px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
              }}
            >
              {etapaAtual === totalItens ? 'Ver Resultado' : 'Próxima →'}
            </button>
          </div>
        </div>
      )
    }

    // Resultado da planilha
    if (etapaAtual > totalItens) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis</h4>
              <p className="text-sm text-gray-600">
                Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final, baseado nas respostas que ela informar no formulário original.
              </p>
              <p className="text-xs text-gray-500">
                Use este quadro como referência para orientar a conversa e preparar o plano de acompanhamento correspondente a cada resultado.
              </p>
            </div>
            
            {/* Seção Azul Explicativa - APENAS NO PREVIEW (para o dono) */}
            {isPreview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-2">📋 O que acontece na ferramenta real:</p>
                <p className="text-sm text-blue-700 mb-2">
                  A pessoa que preencher verá o diagnóstico abaixo correspondente às respostas dela.
                </p>
                <p className="text-sm text-blue-700">Em seguida, virá a seguinte mensagem:</p>
              </div>
            )}
            
            {/* CTA */}
            {renderCTA()}
            
            {/* Diagnósticos */}
            {renderDiagnosticsCards()}
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setEtapaAtual(0)
                setRespostas({})
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Reiniciar Preview
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                }}
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      )
    }
  }

  // Renderizar PLANILHA (SPREADSHEET) COM SECTIONS
  if (templateType === 'spreadsheet' && content.sections) {
    const secoes = content.sections
    const totalSecoes = secoes.length
    
    // Etapa 0: Landing
    if (etapaAtual === 0) {
      const slug = (template.slug || template.id || '').toLowerCase()
      const isCardapioDetox = slug.includes('cardapio-detox') || slug.includes('cardápio-detox') || slug.includes('cardapio detox') || slug.includes('cardápio detox')
      const isTabelaComparativa = slug.includes('tabela-comparativa') || slug.includes('tabela comparativa')
      const isTabelaSubstituicoes = slug.includes('tabela-substituicoes') || slug.includes('tabela-substituições') || slug.includes('tabela substituicoes') || slug.includes('tabela substituições')
      const isMiniEbook = slug.includes('mini-ebook') || slug.includes('mini-e-book') || slug.includes('mini ebook') || slug.includes('mini e-book') || slug.includes('ebook') || slug.includes('e-book')
      const isGuiaNutraceutico = slug.includes('guia-nutraceutico') || slug.includes('guia-nutracêutico') || slug.includes('guia nutraceutico') || slug.includes('guia nutracêutico') || (slug.includes('guia') && (slug.includes('nutraceutico') || slug.includes('nutracêutico')))
      const isGuiaProteico = slug.includes('guia-proteico') || slug.includes('guia-proteina') || slug.includes('guia proteico') || slug.includes('guia proteína') || slug.includes('guia de proteina') || slug.includes('guia de proteína') || (slug.includes('guia') && (slug.includes('proteico') || slug.includes('proteina')))
      
      let gradientClass = 'from-teal-50 to-green-50 border-2 border-teal-200'
      let borderClass = 'border-teal-200'
      let textColorClass = 'text-teal-600'
      let titulo = nome
      let descricaoTexto = descricao || 'Explore este conteúdo completo e estruturado.'
      
      if (isCardapioDetox) {
        gradientClass = 'from-green-50 to-emerald-50 border-2 border-green-200'
        borderClass = 'border-green-200'
        textColorClass = 'text-green-600'
        titulo = '🍽️ Cardápio Detox Completo'
        descricaoTexto = 'Plano completo de cardápio detox com refeições balanceadas para desintoxicação e bem-estar.'
      } else if (isTabelaComparativa) {
        gradientClass = 'from-indigo-50 to-purple-50 border-2 border-indigo-200'
        borderClass = 'border-indigo-200'
        textColorClass = 'text-indigo-600'
        titulo = '📊 Tabela Comparativa Nutricional'
        descricaoTexto = 'Compare valores nutricionais entre diferentes alimentos e faça escolhas mais informadas.'
      } else if (isTabelaSubstituicoes) {
        gradientClass = 'from-purple-50 to-pink-50 border-2 border-purple-200'
        borderClass = 'border-purple-200'
        textColorClass = 'text-purple-600'
        titulo = '🔄 Tabela de Substituições Alimentares'
        descricaoTexto = 'Aprenda a substituir alimentos processados por alternativas mais saudáveis e nutritivas.'
      } else if (isMiniEbook) {
        gradientClass = 'from-blue-50 to-cyan-50 border-2 border-blue-200'
        borderClass = 'border-blue-200'
        textColorClass = 'text-blue-600'
        titulo = '📚 Mini E-book Educativo'
        descricaoTexto = 'Guia completo sobre nutrição e bem-estar com informações práticas e aplicáveis.'
      } else if (isGuiaNutraceutico) {
        gradientClass = 'from-amber-50 to-orange-50 border-2 border-amber-200'
        borderClass = 'border-amber-200'
        textColorClass = 'text-amber-600'
        titulo = '💊 Guia Nutracêutico Completo'
        descricaoTexto = 'Aprenda tudo sobre nutracêuticos, como escolher e usar de forma segura para otimizar sua saúde.'
      } else if (isGuiaProteico) {
        gradientClass = 'from-red-50 to-rose-50 border-2 border-red-200'
        borderClass = 'border-red-200'
        textColorClass = 'text-red-600'
        titulo = '🥩 Guia Proteico Completo'
        descricaoTexto = 'Descubra tudo sobre proteínas: necessidades, fontes, distribuição e receitas práticas.'
      }
      
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📋 Preview - {nome}
          </h3>
          
          <div className={`bg-gradient-to-br ${gradientClass} rounded-xl p-6 border-2 ${borderClass} mb-6`}>
            <h4 className={`text-2xl font-bold ${textColorClass} mb-3`}>
              {titulo}
            </h4>
            <p className="text-gray-700 mb-4 text-lg">
              {descricaoTexto}
            </p>
            <p className={`${textColorClass} font-semibold mb-4`}>
              🚀 Um conteúdo completo que pode transformar sua relação com a alimentação.
            </p>
            
            <div className="mt-6">
              <h5 className={`font-bold ${textColorClass} mb-3 text-lg`}>
                O que você vai encontrar:
              </h5>
              <ul className="space-y-2">
                {secoes.slice(0, 5).map((secao: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className={`${textColorClass} mr-2 font-bold`}>✓</span>
                    <span className="text-gray-700">{secao.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setEtapaAtual(1)}
            className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
              animation: 'pulse-subtle 2s ease-in-out infinite'
            }}
          >
            <span className="mr-2">✨</span>
            Explorar Conteúdo
          </button>
        </div>
      )
    }
    
    // Seções de conteúdo (1 a totalSecoes)
    if (etapaAtual >= 1 && etapaAtual <= totalSecoes) {
      const secaoAtual = secoes[etapaAtual - 1]
      const slug = (template.slug || template.id || '').toLowerCase()
      const isCardapioDetox = slug.includes('cardapio-detox') || slug.includes('cardápio-detox') || slug.includes('cardapio detox') || slug.includes('cardápio detox')
      const isTabelaComparativa = slug.includes('tabela-comparativa') || slug.includes('tabela comparativa')
      const isTabelaSubstituicoes = slug.includes('tabela-substituicoes') || slug.includes('tabela-substituições') || slug.includes('tabela substituicoes') || slug.includes('tabela substituições')
      const isMiniEbook = slug.includes('mini-ebook') || slug.includes('mini-e-book') || slug.includes('mini ebook') || slug.includes('mini e-book') || slug.includes('ebook') || slug.includes('e-book')
      const isGuiaNutraceutico = slug.includes('guia-nutraceutico') || slug.includes('guia-nutracêutico') || slug.includes('guia nutraceutico') || slug.includes('guia nutracêutico') || (slug.includes('guia') && (slug.includes('nutraceutico') || slug.includes('nutracêutico')))
      const isGuiaProteico = slug.includes('guia-proteico') || slug.includes('guia-proteina') || slug.includes('guia proteico') || slug.includes('guia proteína') || slug.includes('guia de proteina') || slug.includes('guia de proteína') || (slug.includes('guia') && (slug.includes('proteico') || slug.includes('proteina')))
      
      let bgColor = 'bg-teal-50'
      let textColor = 'text-teal-900'
      let borderColor = 'border-teal-200'
      let badgeColor = 'bg-teal-600'
      
      if (isCardapioDetox) {
        bgColor = 'bg-green-50'
        textColor = 'text-green-900'
        borderColor = 'border-green-200'
        badgeColor = 'bg-green-600'
      } else if (isTabelaComparativa) {
        bgColor = 'bg-indigo-50'
        textColor = 'text-indigo-900'
        borderColor = 'border-indigo-200'
        badgeColor = 'bg-indigo-600'
      } else if (isTabelaSubstituicoes) {
        bgColor = 'bg-purple-50'
        textColor = 'text-purple-900'
        borderColor = 'border-purple-200'
        badgeColor = 'bg-purple-600'
      } else if (isMiniEbook) {
        bgColor = 'bg-blue-50'
        textColor = 'text-blue-900'
        borderColor = 'border-blue-200'
        badgeColor = 'bg-blue-600'
      } else if (isGuiaNutraceutico) {
        bgColor = 'bg-amber-50'
        textColor = 'text-amber-900'
        borderColor = 'border-amber-200'
        badgeColor = 'bg-amber-600'
      } else if (isGuiaProteico) {
        bgColor = 'bg-red-50'
        textColor = 'text-red-900'
        borderColor = 'border-red-200'
        badgeColor = 'bg-red-600'
      }
      
      return (
        <div className={`${bgColor} p-6 rounded-lg border-2 ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              Seção {etapaAtual} de {totalSecoes}
            </span>
            <span className="text-xs text-gray-600 font-medium">Planilha</span>
          </div>
          <h4 className={`text-xl font-bold ${textColor} mb-3`}>
            {secaoAtual.title}
          </h4>
          <div className="bg-white rounded-lg p-5 space-y-3">
            <p className="text-gray-700">{secaoAtual.content}</p>
            {secaoAtual.items && secaoAtual.items.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">Exemplos incluídos:</p>
                <ul className="space-y-1">
                  {secaoAtual.items.map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setEtapaAtual(Math.max(0, etapaAtual - 1))}
              disabled={etapaAtual === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setEtapaAtual(etapaAtual + 1)}
              className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${
                isCardapioDetox ? 'bg-green-600 hover:bg-green-700' : 
                'text-white transition-all duration-300 transform hover:scale-105 font-medium'
              }`}
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
              }}
            >
              {etapaAtual === totalSecoes ? 'Ver Resumo' : 'Próxima →'}
            </button>
          </div>
        </div>
      )
    }
    
    // Resumo final
    if (etapaAtual > totalSecoes) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis</h4>
              <p className="text-sm text-gray-600">
                Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final, baseado nas respostas que ela informar no formulário original.
              </p>
              <p className="text-xs text-gray-500">
                Use este quadro como referência para orientar a conversa e preparar o plano de acompanhamento correspondente a cada resultado.
              </p>
            </div>
            
            {/* Seção Azul Explicativa - APENAS NO PREVIEW (para o dono) */}
            {isPreview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-2">📋 O que acontece na ferramenta real:</p>
                <p className="text-sm text-blue-700 mb-2">
                  A pessoa que preencher verá o diagnóstico abaixo correspondente às respostas dela.
                </p>
                <p className="text-sm text-blue-700">Em seguida, virá a seguinte mensagem:</p>
              </div>
            )}
            
            {/* CTA */}
            {renderCTA()}
            
            {/* Diagnósticos */}
            {renderDiagnosticsCards()}
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setEtapaAtual(0)
                setRespostas({})
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Reiniciar Preview
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                }}
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      )
    }
  }

  // Renderizar GUIA
  if (templateType === 'guide' && content.sections) {
    const secoes = content.sections
    const totalSecoes = secoes.length
    const temFormulario = content.form && content.form.fields
    
    // Etapa 0: Landing
    if (etapaAtual === 0) {
      const slug = (template.slug || template.id || '').toLowerCase()
      const intro = getIntroContent()
      const isGuiaHidratacao = slug.includes('guia-hidratacao') || slug.includes('guia hidratacao') || (slug.includes('guia') && slug.includes('hidratacao'))
      
      let gradientClass = 'from-blue-50 to-cyan-50'
      let borderClass = 'border-2 border-blue-200'
      let textColorClass = 'text-blue-600'
      
      if (isGuiaHidratacao) {
        gradientClass = 'from-blue-50 to-cyan-50'
        borderClass = 'border-2 border-blue-200'
        textColorClass = 'text-blue-600'
      }
      
      return (
        <div className={`bg-gradient-to-r ${gradientClass} p-6 rounded-lg ${borderClass}`}>
          <h4 className="text-xl font-bold text-gray-900 mb-2">{intro.titulo}</h4>
          {intro.descricao && (
            <p className="text-gray-700 mb-3">{intro.descricao}</p>
          )}
          {intro.mensagem && (
            <p className={`${textColorClass} font-semibold mb-4`}>{intro.mensagem}</p>
          )}
          {intro.beneficios && (
            <div className="bg-white rounded-lg p-4 mt-4 border border-blue-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai aprender:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                {intro.beneficios.map((beneficio: string, index: number) => (
                  <p key={index}>✓ {beneficio}</p>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setEtapaAtual(1)}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-lg"
          >
            ▶️ Começar Leitura
          </button>
        </div>
      )
    }
    
    // Seções de conteúdo (1 a totalSecoes)
    if (etapaAtual >= 1 && etapaAtual <= totalSecoes) {
      const secaoAtual = secoes[etapaAtual - 1]
      const colorKey: 'blue' | 'cyan' | 'sky' = (secaoAtual?.color === 'blue' || secaoAtual?.color === 'cyan' || secaoAtual?.color === 'sky') 
        ? secaoAtual.color 
        : 'blue'
      const bgColorMap: Record<'blue' | 'cyan' | 'sky', string> = {
        blue: 'bg-blue-50',
        cyan: 'bg-cyan-50',
        sky: 'bg-sky-50'
      }
      const bgColor = bgColorMap[colorKey] || 'bg-gray-50'
      
      const textColorMap: Record<'blue' | 'cyan' | 'sky', string> = {
        blue: 'text-blue-900',
        cyan: 'text-cyan-900',
        sky: 'text-sky-900'
      }
      const textColor = textColorMap[colorKey] || 'text-gray-900'
      
      const borderColorMap: Record<'blue' | 'cyan' | 'sky', string> = {
        blue: 'border-blue-200',
        cyan: 'border-cyan-200',
        sky: 'border-sky-200'
      }
      const borderColor = borderColorMap[colorKey] || 'border-gray-200'
      
      const badgeColorMap: Record<'blue' | 'cyan' | 'sky', string> = {
        blue: 'bg-blue-600',
        cyan: 'bg-cyan-600',
        sky: 'bg-sky-600'
      }
      const badgeColor = badgeColorMap[colorKey] || 'bg-gray-600'
      
      return (
        <div className={`${bgColor} p-6 rounded-lg border-2 ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              Seção {etapaAtual} de {totalSecoes}
            </span>
            <span className="text-xs text-gray-600 font-medium">Guia</span>
          </div>
          <h4 className={`text-xl font-bold ${textColor} mb-3`}>
            {secaoAtual.emoji} {secaoAtual.title}
          </h4>
          <div className="bg-white rounded-lg p-5 space-y-3">
            <p className="text-gray-700">{secaoAtual.description}</p>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-600">
                <strong>Conteúdo completo:</strong> Esta seção inclui informações detalhadas, exemplos práticos e orientações específicas sobre {secaoAtual.title.toLowerCase()}.
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setEtapaAtual(Math.max(0, etapaAtual - 1))}
              disabled={etapaAtual === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setEtapaAtual(etapaAtual + 1)}
              className="px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
              }}
            >
              {etapaAtual === totalSecoes && !temFormulario ? 'Ver Resultado' : 'Próxima →'}
            </button>
          </div>
        </div>
      )
    }
    
    // Formulário (se existir, após todas as seções)
    if (temFormulario && etapaAtual === totalSecoes + 1) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">📝 Formulário de Avaliação</h4>
                <p className="text-gray-700">Preencha as informações para receber seu guia personalizado.</p>
              </div>
              <span className="text-white px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
                }}
              >
                Etapa {totalSecoes + 1}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="space-y-6">
              {content.form.fields.map((field: any) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      {field.options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'multiselect' && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {field.options.map((opt: string) => {
                        const selected = (formData[field.id] || []).includes(opt)
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              const current = formData[field.id] || []
                              setFormData({
                                ...formData,
                                [field.id]: selected ? current.filter((o: string) => o !== opt) : [...current, opt]
                              })
                            }}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors text-left text-sm ${
                              selected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                            }`}
                          >
                            {selected && '✓ '}{opt}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {field.help && (
                    <p className="text-sm text-gray-500 mt-1">{field.help}</p>
                  )}
                </div>
              ))}
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>💡 Preview:</strong> No template real, ao preencher e enviar, você receberá um cálculo personalizado e estratégias práticas.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setEtapaAtual(etapaAtual + 1)}
                className="w-full mt-6 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                  animation: 'pulse-subtle 2s ease-in-out infinite'
                }}
              >
                <span className="mr-2">✨</span>
                Gerar Meu Guia
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    // Resultados (após formulário ou seções)
    if (etapaAtual > totalSecoes + (temFormulario ? 1 : 0)) {
      return (
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Diagnósticos Possíveis</h4>
          {renderCTA()}
          {renderDiagnosticsCards()}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setEtapaAtual(etapaAtual - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => {
                setEtapaAtual(0)
                setRespostas({})
                setFormData({})
              }}
              className="px-6 py-2 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
              }}
            >
              Reiniciar Preview
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      )
    }
  }

  // Fallback: Template sem content ou tipo desconhecido
  // Se é quiz mas não tem questions array, mostrar mensagem específica
  if (templateType === 'quiz' && !questionsArray) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Preview: {nome}
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold mb-2">
            ⚠️ Este quiz não possui perguntas detalhadas no content JSONB.
          </p>
          <p className="text-sm text-yellow-700 mb-2">
            O content precisa ter um array <code className="bg-yellow-100 px-1 rounded">questions</code> ou <code className="bg-yellow-100 px-1 rounded">items</code> com as perguntas completas.
          </p>
          <p className="text-xs text-yellow-600 mt-3">
            <strong>Content atual:</strong>
            <pre className="mt-1 bg-yellow-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(content, null, 2).substring(0, 300)}
            </pre>
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        )}
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Preview: {nome}
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ Este template não possui content JSONB configurado ou o tipo não é suportado.
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          Tipo: {templateType || 'desconhecido'}
        </p>
        {template.content && (
          <p className="text-xs text-yellow-600 mt-2">
            Content: {JSON.stringify(template.content).substring(0, 150)}...
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Fechar
        </button>
      )}
    </div>
  )
}

