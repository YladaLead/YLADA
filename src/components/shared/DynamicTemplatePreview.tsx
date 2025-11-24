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
}

interface DiagnosticEntry {
  resultadoId: string
  diagnostico: DiagnosticoCompleto
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
    if (normalized.startsWith('template-')) {
      candidates.add(normalized.replace(/^template-/, ''))
    }
    candidates.add(normalized.replace(/-de-/g, '-'))
    candidates.add(normalized.replace(/-da-/g, '-'))
  })

  return Array.from(candidates).filter(Boolean)
}

const slugMatches = (candidate: string, key: string) =>
  candidate === key || candidate.includes(key) || key.includes(candidate)

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
  'diagnostico-eletrolitos': wellnessDiagnostics.eletrolitosDiagnosticos,
  'diagnostico-sintomas-intestinais': wellnessDiagnostics.sintomasIntestinaisDiagnosticos,
  'pronto-emagrecer': wellnessDiagnostics.prontoEmagrecerDiagnosticos,
  'tipo-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
  'alimentacao-saudavel': wellnessDiagnostics.alimentacaoSaudavelDiagnosticos,
  'sindrome-metabolica': wellnessDiagnostics.sindromeMetabolicaDiagnosticos,
  'retencao-liquidos': wellnessDiagnostics.retencaoLiquidosDiagnosticos,
  'conhece-seu-corpo': wellnessDiagnostics.conheceSeuCorpoDiagnosticos,
  'nutrido-vs-alimentado': wellnessDiagnostics.nutridoVsAlimentadoDiagnosticos,
  'alimentacao-rotina': wellnessDiagnostics.alimentacaoRotinaDiagnosticos,
  'ganhos-prosperidade': wellnessDiagnostics.ganhosProsperidadeDiagnosticos,
  'potencial-crescimento': wellnessDiagnostics.potencialCrescimentoDiagnosticos,
  'proposito-equilibrio': wellnessDiagnostics.propositoEquilibrioDiagnosticos,
  'calculadora-imc': wellnessDiagnostics.calculadoraImcDiagnosticos,
  'calculadora-proteina': wellnessDiagnostics.calculadoraProteinaDiagnosticos,
  'calculadora-agua': wellnessDiagnostics.calculadoraAguaDiagnosticos,
  'calculadora-calorias': wellnessDiagnostics.calculadoraCaloriasDiagnosticos,
  'checklist-alimentar': wellnessDiagnostics.checklistAlimentarDiagnosticos,
  'checklist-detox': wellnessDiagnostics.checklistDetoxDiagnosticos,
  'mini-ebook': wellnessDiagnostics.miniEbookDiagnosticos,
  'guia-nutraceutico': wellnessDiagnostics.guiaNutraceuticoDiagnosticos,
  'guia-proteico': wellnessDiagnostics.guiaProteicoDiagnosticos,
  'guia-hidratacao': wellnessDiagnostics.guiaHidratacaoDiagnosticos,
  'desafio-7-dias': wellnessDiagnostics.desafio7DiasDiagnosticos,
  'desafio-21-dias': wellnessDiagnostics.desafio21DiasDiagnosticos
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
  return resultadoId
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
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
  const fallbackMap = (profession === 'nutri' || profession === 'coach') ? diagnosticsMapsByProfession.wellness : undefined
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

  // Usar a função getDiagnostico correta baseada na profissão
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
  onClose 
}: DynamicTemplatePreviewProps) {
  // Padrão para Previews: Etapa 0 = Apresentação, Etapa 1+ = Perguntas (igual Quiz Bem-Estar)
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<number, any>>({})
  const [formData, setFormData] = useState<Record<string, any>>({})

  const content = template.content || {}
  const templateType = content.template_type || template.type || 'quiz'
  const nome = template.nome || template.name || 'Template'
  const descricao = (template as any).description || (template as any).descricao || ''
  const diagnosticsInfo = getDiagnosticsInfoForTemplate(template, profession)
  const fallbackDiagnosticsSlug =
    diagnosticsInfo.slug ||
    normalizeSlug(template.slug || template.id || template.nome || template.name || '')

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
          <div className="flex items-center justify-between mb-4">
            <h5 className={`text-lg font-bold ${colors.text}`}>
              {formatResultadoLabel(entry.resultadoId)}
            </h5>
            <span className={`${colors.badge} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              Resultado #{index + 1}
            </span>
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

  // Renderizar QUIZ
  // Verificar se questions é array (formato completo) ou número (formato básico)
  const questionsArray = Array.isArray(content.questions) 
    ? content.questions 
    : (content.items && Array.isArray(content.items) ? content.items : null)
  
  if (templateType === 'quiz' && questionsArray && questionsArray.length > 0) {
    const perguntas = questionsArray
    const totalPerguntas = perguntas.length
    const totalEtapas = totalPerguntas + 1 // 0=landing, 1-N=perguntas, N+1=resultados

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

    // Texto da introdução (etapa 0) baseado no slug
    const getIntroContent = () => {
      const slug = (template.slug || template.id || '').toLowerCase()
      if (slug.includes('quiz-interativo') || slug.includes('interativo')) {
        return {
          titulo: '🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos',
          descricao: 'Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.',
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
          descricao: 'Estético, Equilibrado ou Saúde/Performance — descubra em 1 minuto.',
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
            'Sinais de sobrecarga tóxica no seu organismo',
            'Como toxinas podem estar afetando sua energia e saúde',
            'Orientações para um processo de detox eficaz',
            'Estratégias para aumentar sua vitalidade'
          ]
        }
      }
      if (slug.includes('quiz-energetico') || slug.includes('quiz-energético') || slug.includes('energetico') || slug.includes('energético')) {
        return {
          titulo: '⚡ Como Está Sua Energia?',
          descricao: 'Identifique seu nível de energia e receba orientações personalizadas para aumentar sua vitalidade e disposição.',
          mensagem: '🚀 Uma avaliação que pode transformar sua energia diária.',
          beneficios: [
            'Seu nível atual de energia e vitalidade',
            'Fatores que podem estar afetando sua disposição',
            'Como aumentar sua energia de forma natural',
            'Estratégias para manter energia constante ao longo do dia'
          ]
        }
      }
      if (slug.includes('quiz-emocional') || slug.includes('avaliacao-emocional') || slug.includes('avaliação-emocional') || (slug.includes('emocional') && slug.includes('avaliacao'))) {
        return {
          titulo: '💖 Avaliação de Forma Emocional',
          descricao: 'Descubra como suas emoções influenciam sua jornada de transformação e receba orientações personalizadas para potencializar seu bem-estar.',
          mensagem: '🚀 Uma avaliação personalizada que pode transformar sua relação com o bem-estar e autoestima.',
          beneficios: [
            'Seu nível de autoestima e confiança',
            'Sua motivação para transformação',
            'Como você lida com desafios',
            'Seu perfil emocional completo'
          ]
        }
      }
      if (slug.includes('quiz-intolerancia') || slug.includes('quiz-intolerância') || slug.includes('intolerancia') || slug.includes('intolerância')) {
        return {
          titulo: '🔍 Avaliação de Intolerância Alimentar',
          descricao: 'Descubra se você tem intolerâncias ou sensibilidades alimentares',
          mensagem: '🚀 Uma avaliação personalizada para identificar alimentos que podem estar afetando seu bem-estar.',
          beneficios: [
            'Possíveis intolerâncias alimentares',
            'Alimentos que causam desconforto',
            'Estratégias personalizadas para seu perfil',
            'Produtos adequados ao seu organismo'
          ]
        }
      }
      if (slug.includes('quiz-perfil-metabolico') || slug.includes('quiz-perfil-metabólico') || slug.includes('perfil-metabolico') || slug.includes('perfil-metabólico') || (slug.includes('metabolico') && slug.includes('perfil')) || (slug.includes('metabólico') && slug.includes('perfil'))) {
        return {
          titulo: '⚡ Avaliação do Perfil Metabólico',
          descricao: 'Descubra seu perfil metabólico e como otimizá-lo',
          mensagem: '🚀 Uma avaliação personalizada para entender seu metabolismo e criar estratégias eficazes.',
          beneficios: [
            'Seu perfil metabólico completo',
            'Como acelerar seu metabolismo',
            'Estratégias personalizadas',
            'Produtos otimizados para seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-eletrolito') || slug.includes('quiz-eletrólito') || slug.includes('eletrolito') || slug.includes('eletrólito') || slug.includes('eletrolitos') || slug.includes('eletrólitos')) {
        return {
          titulo: '⚡ Diagnóstico de Eletrólitos',
          descricao: 'Descubra seu equilíbrio eletrolítico e como otimizá-lo',
          mensagem: '🚀 Uma avaliação personalizada para identificar desequilíbrios e criar estratégias eficazes.',
          beneficios: [
            'Possíveis desequilíbrios eletrolíticos',
            'Como melhorar seu equilíbrio',
            'Estratégias personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-sintomas-intestinais') || slug.includes('sintomas-intestinais') || (slug.includes('sintoma') && slug.includes('intestina'))) {
        return {
          titulo: '🌿 Diagnóstico de Sintomas Intestinais',
          descricao: 'Descubra sua saúde intestinal e como otimizá-la',
          mensagem: '🚀 Uma avaliação personalizada para identificar problemas e criar estratégias eficazes.',
          beneficios: [
            'Possíveis problemas intestinais',
            'Como melhorar sua saúde digestiva',
            'Estratégias personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-avaliacao-inicial') || slug.includes('avaliacao-inicial') || slug.includes('avaliação-inicial')) {
        return {
          titulo: '🌟 Avaliação Inicial',
          descricao: 'Descubra como podemos ajudar na sua transformação',
          mensagem: '🚀 Uma avaliação rápida para entender seu perfil e criar um plano personalizado.',
          beneficios: [
            'Seu perfil e necessidades',
            'Como podemos te ajudar',
            'Estratégias personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-pronto-emagrecer') || slug.includes('pronto-emagrecer') || (slug.includes('pronto') && slug.includes('emagrecer'))) {
        return {
          titulo: '🎯 Pronto para Emagrecer com Saúde',
          descricao: 'Descubra se você está pronto para começar sua jornada de emagrecimento',
          mensagem: '🚀 Uma avaliação rápida para entender seu perfil e criar um plano personalizado.',
          beneficios: [
            'Sua prontidão para emagrecer',
            'Como podemos te ajudar',
            'Estratégias personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-tipo-fome') || slug.includes('tipo-fome') || (slug.includes('tipo') && slug.includes('fome'))) {
        return {
          titulo: '🍽️ Qual é o seu Tipo de Fome?',
          descricao: 'Descubra seu padrão de fome e como controlá-lo',
          mensagem: '🚀 Uma avaliação personalizada para entender se sua fome é física ou emocional.',
          beneficios: [
            'Seu tipo de fome',
            'Se é fome física ou emocional',
            'Estratégias personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-alimentacao-saudavel') || slug.includes('alimentacao-saudavel') || slug.includes('alimentação-saudável')) {
        return {
          titulo: '🥗 Quiz: Alimentação Saudável',
          descricao: 'Descubra como está sua alimentação e como melhorá-la',
          mensagem: '🚀 Uma avaliação personalizada para entender seus hábitos alimentares.',
          beneficios: [
            'Pontos de melhoria na alimentação',
            'Como criar hábitos mais saudáveis',
            'Recomendações personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-sindrome-metabolica') || slug.includes('sindrome-metabolica') || slug.includes('síndrome-metabólica') || (slug.includes('sindrome') && slug.includes('metabolica'))) {
        return {
          titulo: '⚠️ Risco de Síndrome Metabólica',
          descricao: 'Descubra seu risco e como preveni-lo',
          mensagem: '🚀 Uma avaliação personalizada para identificar riscos metabólicos.',
          beneficios: [
            'Seu risco de síndrome metabólica',
            'Como prevenir complicações',
            'Recomendações personalizadas',
            'Produtos preventivos adequados'
          ]
        }
      }
      if (slug.includes('quiz-retencao-liquidos') || slug.includes('retencao-liquidos') || slug.includes('retenção-líquidos') || (slug.includes('retencao') && slug.includes('liquido'))) {
        return {
          titulo: '💧 Teste de Retenção de Líquidos',
          descricao: 'Descubra seu nível de retenção e como reduzir',
          mensagem: '🚀 Uma avaliação personalizada para identificar retenção de líquidos.',
          beneficios: [
            'Seu nível de retenção de líquidos',
            'Como reduzir inchaço e desconforto',
            'Recomendações personalizadas',
            'Produtos específicos adequados'
          ]
        }
      }
      if (slug.includes('quiz-conhece-seu-corpo') || slug.includes('conhece-seu-corpo') || slug.includes('você conhece') || (slug.includes('conhece') && slug.includes('corpo'))) {
        return {
          titulo: '🧠 Você Conhece o Seu Corpo?',
          descricao: 'Descubra seu nível de autoconhecimento corporal',
          mensagem: '🚀 Uma avaliação personalizada para entender seu autoconhecimento.',
          beneficios: [
            'Seu nível de conhecimento sobre seu corpo',
            'Como conhecer melhor seus sinais',
            'Recomendações personalizadas',
            'Produtos e estratégias adequadas'
          ]
        }
      }
      if (slug.includes('quiz-nutrido-vs-alimentado') || slug.includes('nutrido-vs-alimentado') || slug.includes('nutrido-alimentado') || (slug.includes('nutrido') && slug.includes('alimentado'))) {
        return {
          titulo: '🍎 Você está Nutrido ou Apenas Alimentado?',
          descricao: 'Descubra se você está realmente nutrido',
          mensagem: '🚀 Uma avaliação personalizada para entender nutrição adequada.',
          beneficios: [
            'Se você está nutrido ou apenas alimentado',
            'Como transformar alimentação em nutrição',
            'Recomendações personalizadas',
            'Produtos adequados ao seu perfil'
          ]
        }
      }
      if (slug.includes('quiz-alimentacao-rotina') || slug.includes('alimentacao-rotina') || slug.includes('alimentação-rotina') || (slug.includes('alimentacao') && slug.includes('rotina'))) {
        return {
          titulo: '⏰ Você está se Alimentando Conforme sua Rotina?',
          descricao: 'Descubra se sua alimentação está adequada à sua rotina',
          mensagem: '🚀 Uma avaliação personalizada para entender adequação alimentar.',
          beneficios: [
            'Se sua alimentação está adequada à rotina',
            'Como adequar alimentação ao seu estilo de vida',
            'Recomendações personalizadas',
            'Produtos adaptados à rotina'
          ]
        }
      }
      if (slug.includes('quiz-ganhos-prosperidade') || slug.includes('ganhos-prosperidade') || slug.includes('ganhos e prosperidade') || (slug.includes('ganhos') && slug.includes('prosperidade'))) {
        return {
          titulo: '💰 Quiz: Ganhos e Prosperidade',
          descricao: 'Descubra seu potencial para ganhos e prosperidade',
          mensagem: '🚀 Uma avaliação personalizada para entender suas oportunidades de crescimento.',
          beneficios: [
            'Seu potencial para ganhos',
            'Oportunidades de crescimento financeiro',
            'Insights personalizados',
            'Caminhos para prosperidade'
          ]
        }
      }
      if (slug.includes('quiz-potencial-crescimento') || slug.includes('potencial-crescimento') || slug.includes('potencial e crescimento') || (slug.includes('potencial') && slug.includes('crescimento'))) {
        return {
          titulo: '🌱 Quiz: Potencial e Crescimento',
          descricao: 'Descubra seu potencial de crescimento',
          mensagem: '🚀 Uma avaliação personalizada para entender suas oportunidades de desenvolvimento.',
          beneficios: [
            'Seu potencial de crescimento',
            'Oportunidades de desenvolvimento',
            'Insights personalizados',
            'Caminhos para alcançar seu máximo'
          ]
        }
      }
      if (slug.includes('quiz-proposito-equilibrio') || slug.includes('proposito-equilibrio') || slug.includes('propósito-equilíbrio') || slug.includes('proposito e equilibrio') || slug.includes('propósito e equilíbrio') || (slug.includes('proposito') && slug.includes('equilibrio'))) {
        return {
          titulo: '🎯 Quiz: Propósito e Equilíbrio',
          descricao: 'Descubra se seu dia a dia está alinhado com seus sonhos',
          mensagem: '🚀 Uma avaliação personalizada para entender seu alinhamento com propósito.',
          beneficios: [
            'Seu alinhamento com propósito',
            'Oportunidades de equilíbrio',
            'Insights personalizados',
            'Caminhos para viver seu propósito'
          ]
        }
      }
      if (slug.includes('checklist-alimentar') || slug.includes('checklist alimentar') || (slug.includes('checklist') && slug.includes('alimentar'))) {
        return {
          titulo: '🍽️ Avalie Seus Hábitos Alimentares',
          descricao: 'Descubra como está sua alimentação e receba orientações personalizadas para melhorar seus hábitos alimentares baseadas em sua rotina atual.',
          mensagem: '💪 Uma avaliação que pode transformar sua relação com a comida.',
          beneficios: [
            'Como está sua alimentação atual',
            'Hábitos que podem ser melhorados',
            'Orientações personalizadas',
            'Estratégias para transformação'
          ]
        }
      }
      if (slug.includes('checklist-detox') || slug.includes('checklist detox') || (slug.includes('checklist') && slug.includes('detox'))) {
        return {
          titulo: '🧪 Checklist Detox',
          descricao: 'Identifique sinais de sobrecarga tóxica e receba orientações para um processo de detox eficaz.',
          mensagem: '🚀 Uma avaliação que pode transformar sua vitalidade e energia.',
          beneficios: [
            'Sinais de sobrecarga tóxica no seu organismo',
            'Como toxinas podem estar afetando sua energia e saúde',
            'Orientações para um processo de detox eficaz',
            'Estratégias para aumentar sua vitalidade'
          ]
        }
      }
      if (slug.includes('guia-hidratacao') || slug.includes('guia hidratacao') || slug.includes('guia-hidratacao') || (slug.includes('guia') && slug.includes('hidratacao'))) {
        return {
          titulo: '💧 Guia Completo de Hidratação',
          descricao: 'Aprenda tudo sobre hidratação e como otimizar seu consumo de água para saúde e performance.',
          mensagem: '🚀 Um guia completo que pode transformar sua relação com a hidratação.',
          beneficios: [
            'Por que hidratação é fundamental',
            'Como calcular sua necessidade diária',
            'Estratégias práticas para manter-se hidratado',
            'Otimização para performance'
          ]
        }
      }
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
      if (slug.includes('desafio-7-dias') || slug.includes('desafio-7') || (slug.includes('desafio') && slug.includes('7'))) {
        return {
          titulo: '🚀 Desafio 7 Dias',
          descricao: 'Um desafio de 7 dias para transformar seus hábitos e ver resultados rápidos.',
          mensagem: '🚀 Uma jornada de 7 dias que pode transformar seus hábitos e resultados.',
          beneficios: [
            'Resultados rápidos e visíveis',
            'Plano estruturado para 7 dias',
            'Hábitos que você pode manter',
            'Transformação real em pouco tempo'
          ]
        }
      }
      if (slug.includes('desafio-21-dias') || slug.includes('desafio-21') || (slug.includes('desafio') && slug.includes('21'))) {
        return {
          titulo: '🌱 Desafio 21 Dias',
          descricao: 'Um desafio completo de 21 dias para transformação profunda e duradoura.',
          mensagem: '🚀 Uma jornada de 21 dias que pode transformar sua vida completamente.',
          beneficios: [
            'Transformação profunda e duradoura',
            'Plano estruturado para 21 dias',
            'Hábitos que se tornam parte da sua vida',
            'Resultados que você mantém para sempre'
          ]
        }
      }
      // Fallback genérico
      return {
        titulo: descricao ? descricao.split('.')[0] : nome,
        descricao: descricao || '',
        mensagem: '🚀 Uma avaliação que pode transformar sua relação com o bem-estar.',
        beneficios: undefined
      }
    }

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
                      return (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border ${corAtual.border} cursor-pointer hover:opacity-60 transition-colors`}
                        >
                          <input 
                            type="radio" 
                            name={`pergunta-${etapaAtual}`} 
                            className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2" 
                            disabled 
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
                <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis do Quiz</h4>
                <p className="text-sm text-gray-600">
                  Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final, baseado nas respostas que ela informar no formulário original.
                </p>
                <p className="text-xs text-gray-500">
                  Use este quadro como referência para orientar a conversa e preparar o plano de acompanhamento correspondente a cada resultado.
                </p>
              </div>
              {renderDiagnosticsCards()}
            </div>
          )}

          {/* Navegação com Setinhas e Botões Numerados (igual Quiz Bem-Estar) */}
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
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={labels[i] || `Etapa ${i}`}
                >
                  {labels[i] || `${i}`}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={etapaAtual === totalEtapas}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar CALCULADORA
  if (templateType === 'calculator' && content.fields) {
    const campos = content.fields || []
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
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isImc ? 'bg-blue-600 hover:bg-blue-700' : 
              isProteina ? 'bg-orange-600 hover:bg-orange-700' : 
              isHidratacao ? 'bg-cyan-600 hover:bg-cyan-700' :
              isCalorias ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Iniciar Cálculo
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
                className="h-2 rounded-full bg-purple-600"
                style={{ width: `${(etapaAtual / totalItens) * 100}%` }}
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
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resultado
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-gray-700">
              Resultado baseado nas respostas fornecidas.
            </p>
          </div>
          <button
            onClick={() => {
              setEtapaAtual(0)
              setRespostas({})
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reiniciar Preview
          </button>
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
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isCardapioDetox ? 'bg-green-600 hover:bg-green-700' : 
              isTabelaComparativa ? 'bg-indigo-600 hover:bg-indigo-700' : 
              isTabelaSubstituicoes ? 'bg-purple-600 hover:bg-purple-700' :
              isMiniEbook ? 'bg-blue-600 hover:bg-blue-700' :
              isGuiaNutraceutico ? 'bg-amber-600 hover:bg-amber-700' :
              isGuiaProteico ? 'bg-red-600 hover:bg-red-700' :
              'bg-teal-600 hover:bg-teal-700'
            }`}
          >
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
                isTabelaComparativa ? 'bg-indigo-600 hover:bg-indigo-700' : 
                isTabelaSubstituicoes ? 'bg-purple-600 hover:bg-purple-700' :
                isMiniEbook ? 'bg-blue-600 hover:bg-blue-700' :
                isGuiaNutraceutico ? 'bg-amber-600 hover:bg-amber-700' :
                isGuiaProteico ? 'bg-red-600 hover:bg-red-700' :
                'bg-teal-600 hover:bg-teal-700'
              }`}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Resumo do Conteúdo
          </h3>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3">
              Você explorou todas as seções deste conteúdo completo.
            </p>
            <p className="text-sm text-gray-600">
              No template real, você terá acesso ao conteúdo completo para download e uso prático.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
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
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
      
      let gradientClass = 'from-blue-50 to-cyan-50 border-2 border-blue-200'
      let borderClass = 'border-blue-200'
      let textColorClass = 'text-blue-600'
      
      if (isGuiaHidratacao) {
        gradientClass = 'from-blue-50 to-cyan-50 border-2 border-blue-200'
        borderClass = 'border-blue-200'
        textColorClass = 'text-blue-600'
      }
      
      return (
        <div className={`bg-gradient-to-r ${gradientClass} p-6 rounded-lg`}>
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
      const bgColor = {
        blue: 'bg-blue-50',
        cyan: 'bg-cyan-50',
        sky: 'bg-sky-50'
      }[secaoAtual.color] || 'bg-gray-50'
      
      const textColor = {
        blue: 'text-blue-900',
        cyan: 'text-cyan-900',
        sky: 'text-sky-900'
      }[secaoAtual.color] || 'text-gray-900'
      
      const borderColor = {
        blue: 'border-blue-200',
        cyan: 'border-cyan-200',
        sky: 'border-sky-200'
      }[secaoAtual.color] || 'border-gray-200'
      
      const badgeColor = {
        blue: 'bg-blue-600',
        cyan: 'bg-cyan-600',
        sky: 'bg-sky-600'
      }[secaoAtual.color] || 'bg-gray-600'
      
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Gerar Meu Guia →
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

