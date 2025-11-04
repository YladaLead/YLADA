'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain, DollarSign, TrendingUp, Star, Zap, UtensilsCrossed, Search } from 'lucide-react'
import { 
  calculadoraAguaDiagnosticos, 
  calculadoraImcDiagnosticos, 
  calculadoraCaloriasDiagnosticos, 
  calculadoraProteinaDiagnosticos,
  checklistAlimentarDiagnosticos,
  checklistDetoxDiagnosticos,
  guiaNutraceuticoDiagnosticos,
  guiaProteicoDiagnosticos
} from '@/lib/diagnosticos-nutri'

interface Template {
  id: string
  name: string
  description: string
  icon: any
  type: 'calculadora' | 'quiz' | 'planilha'
  category: string
  link: string
  color: string
}

export default function WellnessTemplatesPage() {
  // Estados do componente
  const [templates, setTemplates] = useState<Template[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [busca, setBusca] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)
  
  // Estados para controle de etapas do preview (igual à área de nutri)
  const [etapaPreviewCalc, setEtapaPreviewCalc] = useState(0) // Para calculadoras: 0 = landing, 1 = formulário, 2 = resultado, 3 = diagnósticos
  const [etapaPreviewQuiz, setEtapaPreviewQuiz] = useState(0) // Para quiz interativo: 0 = landing, 1-6 = perguntas, 7 = resultados
  const [etapaPreviewQuizBemEstar, setEtapaPreviewQuizBemEstar] = useState(0) // Para quiz-bem-estar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizEnergetico, setEtapaPreviewQuizEnergetico] = useState(0) // Para quiz-energetico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizPerfil, setEtapaPreviewQuizPerfil] = useState(0) // Para quiz-perfil-nutricional: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizDetox, setEtapaPreviewQuizDetox] = useState(0) // Para quiz-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizAvaliacaoNutricional, setEtapaPreviewQuizAvaliacaoNutricional] = useState(0) // Para quiz-avaliacao-nutricional: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizConheceCorpo, setEtapaPreviewQuizConheceCorpo] = useState(0) // Para quiz-conhece-corpo: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizDisciplinadoEmocional, setEtapaPreviewQuizDisciplinadoEmocional] = useState(0) // Para quiz-disciplinado-emocional: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizNutridoAlimentado, setEtapaPreviewQuizNutridoAlimentado] = useState(0) // Para quiz-nutrido-alimentado: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizAlimentacaoRotina, setEtapaPreviewQuizAlimentacaoRotina] = useState(0) // Para quiz-alimentacao-rotina: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizParasitose, setEtapaPreviewQuizParasitose] = useState(0) // Para quiz-parasitose: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizGanhos, setEtapaPreviewQuizGanhos] = useState(0) // Para quiz-ganhos: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizPotencial, setEtapaPreviewQuizPotencial] = useState(0) // Para quiz-potencial: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizProposito, setEtapaPreviewQuizProposito] = useState(0) // Para quiz-proposito: 0 = landing, 1-5 = perguntas, 6 = resultados
  // Estados para checklists e guias (5 perguntas + resultados)
  const [etapaPreviewChecklistAlimentar, setEtapaPreviewChecklistAlimentar] = useState(0) // Para checklist-alimentar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewChecklistDetox, setEtapaPreviewChecklistDetox] = useState(0) // Para checklist-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewGuiaNutraceutico, setEtapaPreviewGuiaNutraceutico] = useState(0) // Para guia-nutraceutico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewGuiaProteico, setEtapaPreviewGuiaProteico] = useState(0) // Para guia-proteico: 0 = landing, 1-5 = perguntas, 6 = resultados
  // Estados genéricos para quizzes diagnósticos (10 perguntas)
  const [etapaPreviewDiagnostico, setEtapaPreviewDiagnostico] = useState<{[key: string]: number}>({}) // Para diagnósticos: {templateId: etapa}
  const [etapaPreviewPlanilha, setEtapaPreviewPlanilha] = useState(0) // Para planilhas: 0 = landing, 1 = visualização

  // Debug: Log quando o preview mudar
  useEffect(() => {
    if (templatePreviewAberto) {
      console.log('✅ Modal aberto para template:', templatePreviewAberto)
      console.log('📋 Templates disponíveis:', templates.map(t => ({ id: t.id, name: t.name })))
      // Reset etapas quando abrir novo template
      setEtapaPreviewCalc(0)
      setEtapaPreviewQuiz(0)
      setEtapaPreviewQuizBemEstar(0)
      setEtapaPreviewQuizEnergetico(0)
      setEtapaPreviewQuizPerfil(0)
      setEtapaPreviewQuizDetox(0)
      setEtapaPreviewQuizAvaliacaoNutricional(0)
      setEtapaPreviewQuizConheceCorpo(0)
      setEtapaPreviewQuizDisciplinadoEmocional(0)
      setEtapaPreviewQuizNutridoAlimentado(0)
      setEtapaPreviewQuizAlimentacaoRotina(0)
      setEtapaPreviewQuizParasitose(0)
      setEtapaPreviewQuizGanhos(0)
      setEtapaPreviewQuizPotencial(0)
      setEtapaPreviewQuizProposito(0)
      setEtapaPreviewChecklistAlimentar(0)
      setEtapaPreviewChecklistDetox(0)
      setEtapaPreviewGuiaNutraceutico(0)
      setEtapaPreviewGuiaProteico(0)
      setEtapaPreviewDiagnostico({})
      setEtapaPreviewPlanilha(0)
    }
  }, [templatePreviewAberto, templates])

  // Templates hardcoded como fallback completo (38 templates com previews implementados)
  const templatesFallback: Template[] = [
    // CALCULADORAS (6)
    {
      id: 'imc',
      name: 'Calculadora IMC',
      description: 'Calcule o Índice de Massa Corporal dos seus clientes',
      icon: Calculator,
      type: 'calculadora',
      category: 'Avaliação',
      link: '/pt/wellness/templates/imc',
      color: 'bg-blue-500'
    },
    {
      id: 'proteina',
      name: 'Calculadora de Proteína',
      description: 'Calcule necessidades proteicas individuais',
      icon: Activity,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/proteina',
      color: 'bg-orange-500'
    },
    {
      id: 'hidratacao',
      name: 'Calculadora de Hidratação',
      description: 'Avalie necessidades de água e eletrólitos',
      icon: Droplets,
      type: 'calculadora',
      category: 'Bem-Estar',
      link: '/pt/wellness/templates/hidratacao',
      color: 'bg-cyan-500'
    },
    {
      id: 'calorias',
      name: 'Calculadora de Calorias',
      description: 'Calcule suas necessidades calóricas diárias',
      icon: Calculator,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/calorias',
      color: 'bg-red-500'
    },
    {
      id: 'composicao',
      name: 'Composição Corporal',
      description: 'Avalie massa muscular, gordura e hidratação',
      icon: Target,
      type: 'calculadora',
      category: 'Avaliação',
      link: '/pt/wellness/templates/composicao',
      color: 'bg-green-500'
    },
    {
      id: 'meal-planner',
      name: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: UtensilsCrossed,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/meal-planner',
      color: 'bg-pink-500'
    },
    // QUIZZES (17)
    {
      id: 'quiz-interativo',
      name: 'Quiz Interativo',
      description: 'Descubra seu tipo de metabolismo',
      icon: Target,
      type: 'quiz',
      category: 'Quiz',
      link: '/pt/wellness/templates/quiz-interativo',
      color: 'bg-purple-500'
    },
    {
      id: 'wellness-profile',
      name: 'Quiz: Perfil de Bem-Estar',
      description: 'Descubra o perfil de bem-estar dos seus leads',
      icon: Heart,
      type: 'quiz',
      category: 'Quiz',
      link: '/pt/wellness/templates/wellness-profile',
      color: 'bg-purple-500'
    },
    {
      id: 'quiz-energetico',
      name: 'Quiz Energético',
      description: 'Avalie seus níveis de energia e vitalidade',
      icon: Sparkles,
      type: 'quiz',
      category: 'Bem-Estar',
      link: '/pt/wellness/templates/quiz-energetico',
      color: 'bg-yellow-500'
    },
    {
      id: 'quiz-perfil-nutricional',
      name: 'Quiz: Perfil Nutricional',
      description: 'Descubra seu perfil de absorção e metabolismo',
      icon: Brain,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/quiz-perfil-nutricional',
      color: 'bg-indigo-500'
    },
    {
      id: 'quiz-detox',
      name: 'Quiz Detox',
      description: 'Descubra se seu corpo está acumulando toxinas',
      icon: Zap,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/quiz-detox',
      color: 'bg-green-500'
    },
    {
      id: 'nutrition-assessment',
      name: 'Quiz Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Search,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/nutrition-assessment',
      color: 'bg-indigo-500'
    },
    {
      id: 'voce-conhece-seu-corpo',
      name: 'Você conhece o seu corpo?',
      description: 'Avalie seu autoconhecimento sobre o próprio corpo',
      icon: Heart,
      type: 'quiz',
      category: 'Autoconhecimento',
      link: '/pt/wellness/templates/voce-conhece-seu-corpo',
      color: 'bg-pink-500'
    },
    {
      id: 'disciplinado-emocional',
      name: 'Você é mais disciplinado ou emocional com a comida?',
      description: 'Descubra sua relação com a alimentação',
      icon: Brain,
      type: 'quiz',
      category: 'Comportamento',
      link: '/pt/wellness/templates/disciplinado-emocional',
      color: 'bg-purple-500'
    },
    {
      id: 'nutrido-alimentado',
      name: 'Você está nutrido ou apenas alimentado?',
      description: 'Avalie se sua alimentação está nutrindo seu corpo',
      icon: Target,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/nutrido-alimentado',
      color: 'bg-green-500'
    },
    {
      id: 'alimentacao-rotina',
      name: 'Você está se alimentando conforme sua rotina?',
      description: 'Descubra se sua alimentação está alinhada com seu estilo de vida',
      icon: Activity,
      type: 'quiz',
      category: 'Comportamento',
      link: '/pt/wellness/templates/alimentacao-rotina',
      color: 'bg-blue-500'
    },
    {
      id: 'parasitas',
      name: 'Quiz: Diagnóstico de Parasitas',
      description: 'Descubra se você tem parasitas que estão afetando sua saúde',
      icon: Zap,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/parasitas',
      color: 'bg-red-500'
    },
    {
      id: 'ganhos',
      name: 'Quiz: Ganhos e Prosperidade',
      description: 'Avalie se o estilo de vida permite ganhar mais',
      icon: DollarSign,
      type: 'quiz',
      category: 'Negócio',
      link: '/pt/wellness/templates/ganhos',
      color: 'bg-blue-600'
    },
    {
      id: 'potencial',
      name: 'Quiz: Potencial e Crescimento',
      description: 'Descubra se o potencial está sendo bem aproveitado',
      icon: TrendingUp,
      type: 'quiz',
      category: 'Desenvolvimento',
      link: '/pt/wellness/templates/potencial',
      color: 'bg-green-600'
    },
    {
      id: 'proposito',
      name: 'Quiz: Propósito e Equilíbrio',
      description: 'Descubra se o dia a dia está alinhado com seus sonhos',
      icon: Star,
      type: 'quiz',
      category: 'Desenvolvimento',
      link: '/pt/wellness/templates/proposito',
      color: 'bg-purple-600'
    },
    // PLANILHAS/CHECKLISTS/GUIAS (15)
    {
      id: 'checklist-alimentar',
      name: 'Checklist Alimentar',
      description: 'Avalie seus hábitos alimentares diários',
      icon: FileText,
      type: 'planilha',
      category: 'Nutrição',
      link: '/pt/wellness/templates/checklist-alimentar',
      color: 'bg-orange-500'
    },
    {
      id: 'checklist-detox',
      name: 'Checklist Detox',
      description: 'Avalie sinais de acúmulo de toxinas no corpo',
      icon: FileText,
      type: 'planilha',
      category: 'Saúde',
      link: '/pt/wellness/templates/checklist-detox',
      color: 'bg-green-500'
    },
    {
      id: 'guia-nutraceutico',
      name: 'Guia Nutracêutico',
      description: 'Descubra quais nutracêuticos você precisa',
      icon: FileText,
      type: 'planilha',
      category: 'Suplementação',
      link: '/pt/wellness/templates/guia-nutraceutico',
      color: 'bg-purple-500'
    },
    {
      id: 'guia-proteico',
      name: 'Guia Proteico',
      description: 'Avalie sua necessidade proteica e fontes ideais',
      icon: FileText,
      type: 'planilha',
      category: 'Nutrição',
      link: '/pt/wellness/templates/guia-proteico',
      color: 'bg-orange-500'
    },
    // TEMPLATES ADICIONAIS (para completar os 38)
    {
      id: 'fome-emocional',
      name: 'Avaliação de Fome Emocional',
      description: 'Descubra se você está comendo por fome ou emoção',
      icon: Heart,
      type: 'quiz',
      category: 'Comportamento',
      link: '/pt/wellness/templates/fome-emocional',
      color: 'bg-pink-500'
    },
    {
      id: 'intolerancias',
      name: 'Avaliação de Intolerâncias/Sensibilidades',
      description: 'Identifique possíveis intolerâncias alimentares',
      icon: Brain,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/intolerancias',
      color: 'bg-red-500'
    },
    {
      id: 'perfil-metabolico',
      name: 'Avaliação do Perfil Metabólico',
      description: 'Descubra seu perfil metabólico personalizado',
      icon: Activity,
      type: 'quiz',
      category: 'Avaliação',
      link: '/pt/wellness/templates/perfil-metabolico',
      color: 'bg-blue-500'
    },
    {
      id: 'sono-energia',
      name: 'Avaliação do Sono e Energia',
      description: 'Avalie como seu sono afeta sua energia',
      icon: Target,
      type: 'quiz',
      category: 'Bem-Estar',
      link: '/pt/wellness/templates/sono-energia',
      color: 'bg-indigo-500'
    },
    {
      id: 'eletrolitos',
      name: 'Diagnóstico de Eletrólitos',
      description: 'Identifique desequilíbrios de eletrólitos',
      icon: Zap,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/eletrolitos',
      color: 'bg-yellow-500'
    },
    {
      id: 'sintomas-intestinais',
      name: 'Diagnóstico de Sintomas Intestinais',
      description: 'Avalie a saúde do seu intestino',
      icon: Heart,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/sintomas-intestinais',
      color: 'bg-green-500'
    },
    {
      id: 'tipo-metabolismo',
      name: 'Diagnóstico do Tipo de Metabolismo',
      description: 'Descubra seu tipo de metabolismo',
      icon: Activity,
      type: 'quiz',
      category: 'Avaliação',
      link: '/pt/wellness/templates/tipo-metabolismo',
      color: 'bg-purple-500'
    },
    {
      id: 'pronto-emagrecer',
      name: 'Pronto para Emagrecer com Saúde?',
      description: 'Avalie se você está pronto para emagrecer',
      icon: Target,
      type: 'quiz',
      category: 'Bem-Estar',
      link: '/pt/wellness/templates/pronto-emagrecer',
      color: 'bg-green-500'
    },
    {
      id: 'tipo-fome',
      name: 'Qual é o seu Tipo de Fome?',
      description: 'Identifique diferentes tipos de fome',
      icon: Brain,
      type: 'quiz',
      category: 'Comportamento',
      link: '/pt/wellness/templates/tipo-fome',
      color: 'bg-orange-500'
    },
    {
      id: 'perfil-intestino',
      name: 'Qual é seu perfil de intestino?',
      description: 'Descubra o perfil do seu intestino',
      icon: Heart,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/perfil-intestino',
      color: 'bg-teal-500'
    },
    {
      id: 'sindrome-metabolica',
      name: 'Risco de Síndrome Metabólica',
      description: 'Avalie seu risco de síndrome metabólica',
      icon: Target,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/sindrome-metabolica',
      color: 'bg-red-500'
    },
    {
      id: 'corpo-detox',
      name: 'Seu corpo está pedindo Detox?',
      description: 'Descubra se seu corpo precisa de detox',
      icon: Zap,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/corpo-detox',
      color: 'bg-green-500'
    },
    {
      id: 'retencao-liquidos',
      name: 'Teste de Retenção de Líquidos',
      description: 'Avalie se você está retendo líquidos',
      icon: Droplets,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/retencao-liquidos',
      color: 'bg-cyan-500'
    },
    {
      id: 'daily-wellness',
      name: 'Tabela: Bem-Estar Diário',
      description: 'Acompanhe métricas de bem-estar diárias',
      icon: FileText,
      type: 'planilha',
      category: 'Acompanhamento',
      link: '/pt/wellness/templates/daily-wellness',
      color: 'bg-teal-500'
    }
  ]

  // Mapeamento de ícones por categoria/tipo
  const iconMap: { [key: string]: any } = {
    calculadora: Calculator,
    quiz: Target,
    planilha: FileText,
    default: Calculator
  }

  // Mapeamento de cores por tipo
  const colorMap: { [key: string]: string } = {
    calculadora: 'bg-blue-500',
    quiz: 'bg-purple-500',
    planilha: 'bg-teal-500',
    default: 'bg-gray-500'
  }

  // Mapeamento de categorias
  const categoryMap: { [key: string]: string } = {
    calculadora: 'Calculadora',
    quiz: 'Quiz',
    planilha: 'Planilha',
    default: 'Outros'
  }

  // Carregar templates do banco
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/wellness/templates')
        if (response.ok) {
          const data = await response.json()
          // Se banco retornar poucos templates (< 10), usar fallback completo (comportamento anterior)
          if (data.templates && data.templates.length >= 10) {
            console.log('📦 Templates carregados do banco:', data.templates.length)
            
            // Transformar templates do banco para formato da página
            // Filtrar templates removidos (Mini E-book, Planilha Dieta Emagrecimento, Tabela Comparativa, Tabela de Substituições)
            const templatesFiltrados = data.templates.filter((t: any) => {
              const nomeLower = (t.nome || '').toLowerCase()
              return !nomeLower.includes('mini e-book') &&
                     !nomeLower.includes('mini ebook') &&
                     !nomeLower.includes('mini-book') &&
                     !nomeLower.includes('minibook') &&
                     !nomeLower.includes('ebook educativo') &&
                     !nomeLower.includes('e-book educativo') &&
                     !nomeLower.includes('dieta emagrecimento') &&
                     !nomeLower.includes('dieta-emagrecimento') &&
                     !nomeLower.includes('tabela comparativa') &&
                     !nomeLower.includes('tabela-comparativa') &&
                     !nomeLower.includes('tabela de substituições') &&
                     !nomeLower.includes('tabela-de-substituicoes') &&
                     !nomeLower.includes('tabela de substituicoes') &&
                     !nomeLower.includes('tabela substituições')
            })
            
            const templatesFormatados = templatesFiltrados.map((t: any) => {
              // Determinar tipo corretamente (priorizar type da API)
              let tipoFinal = 'calculadora' // default
              
              if (t.type) {
                const tipoLower = t.type.toLowerCase().trim()
                if (tipoLower === 'quiz' || tipoLower.includes('quiz')) {
                  tipoFinal = 'quiz'
                } else if (tipoLower === 'planilha' || tipoLower.includes('planilha') || tipoLower.includes('checklist') || tipoLower.includes('tabela')) {
                  tipoFinal = 'planilha'
                } else if (tipoLower === 'calculadora' || tipoLower.includes('calculadora') || tipoLower.includes('calculator')) {
                  tipoFinal = 'calculadora'
                }
              } else if (t.categoria) {
                const categoriaLower = t.categoria.toLowerCase()
                if (categoriaLower === 'planilha' || categoriaLower.includes('planilha')) {
                  tipoFinal = 'planilha'
                } else if (categoriaLower === 'quiz' || categoriaLower.includes('quiz')) {
                  tipoFinal = 'quiz'
                } else {
                  tipoFinal = 'calculadora'
                }
              }
              
              // Log para debug
              console.log(`[Frontend] Template ${t.nome}: type="${t.type}", categoria="${t.categoria}" → tipoFinal="${tipoFinal}"`)
              
              return {
                id: t.slug || t.id,
                name: t.nome,
                description: t.descricao || t.nome,
                icon: iconMap[tipoFinal] || iconMap['default'],
                type: tipoFinal as 'calculadora' | 'quiz' | 'planilha',
                category: t.categoria || categoryMap[tipoFinal] || 'Outros',
                link: `/pt/wellness/ferramentas/nova?template=${t.slug || t.id}`,
                color: colorMap[tipoFinal] || colorMap['default']
              }
            })
            
            console.log('✨ Templates formatados:', templatesFormatados.length)
            
            // Adicionar quizzes de negócio do fallback (não estão no banco)
            const quizzesNegocio = templatesFallback.filter(t => 
              t.id === 'ganhos' || 
              t.id === 'potencial' || 
              t.id === 'proposito'
            )
            
            // Combinar templates do banco com quizzes de negócio
            const templatesCombinados = [...templatesFormatados, ...quizzesNegocio]
            console.log('📊 Templates combinados (banco + negócio):', templatesCombinados.length)
            setTemplates(templatesCombinados)
          } else {
            // Fallback se banco retornar poucos templates (< 10) - restaurar estado anterior
            console.warn(`⚠️ Banco retornou apenas ${data.templates?.length || 0} templates, usando fallback completo (comportamento anterior)`)
            setTemplates(templatesFallback)
          }
        } else {
          // Fallback se erro na API
          console.error('⚠️ Erro ao buscar templates, usando fallback')
          setTemplates(templatesFallback)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar templates:', error)
        // Fallback se erro
        setTemplates(templatesFallback)
      } finally {
        setCarregandoTemplates(false)
      }
    }
    carregarTemplates()
  }, [])

  const categories = ['todas', ...new Set(templates.map(t => t.category))]
  
  // Filtrar templates por categoria e busca
  const templatesFiltrados = templates.filter(template => {
    const matchCategoria = selectedCategory === 'todas' || template.category === selectedCategory
    const matchBusca = busca === '' || 
      template.name.toLowerCase().includes(busca.toLowerCase()) ||
      template.description.toLowerCase().includes(busca.toLowerCase()) ||
      template.category.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <Image
                    src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                    alt="YLADA"
                    width={280}
                    height={84}
                    className="h-10 w-auto"
                  />
                </button>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Templates Wellness</h1>
            </div>
            <Link
              href="/pt/wellness/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-8 border border-teal-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ferramentas Prontas para Crescer 📈
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Templates validados e otimizados para captura de leads, avaliações profissionais e acompanhamento de clientes em bem-estar.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Campo de Busca */}
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Template
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="🔍 Buscar por nome, descrição ou categoria..."
                  className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <span className="absolute left-4 top-2.5 text-xl">🔍</span>
              </div>
              {busca && (
                <p className="mt-2 text-sm text-gray-600">
                  {templatesFiltrados.length} template(s) encontrado(s)
                </p>
              )}
            </div>
            
            {/* Filtro de Categoria */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {categories.map(categoria => {
                  const count = categoria === 'todas' 
                    ? templates.length 
                    : templates.filter(t => t.category === categoria).length
                  return (
                    <option key={categoria} value={categoria}>
                      {categoria === 'todas' ? `Todas (${count})` : `${categoria} (${count})`}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
        
        {/* Botões de Filtro Rápido */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-teal-300'
                }`}
              >
                {category === 'todas' ? 'Todas' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Templates */}
        {carregandoTemplates ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando templates...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg mb-2">Nenhum template encontrado</p>
                <p className="text-gray-400 text-sm">
                  {busca ? `Tente buscar por outros termos ou limpe o filtro de busca.` : 'Tente selecionar outra categoria.'}
                </p>
              </div>
            ) : (
              templatesFiltrados.map((template) => {
                const Icon = template.icon
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                            <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                              Demo
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 flex gap-3">
                      <button
                        onClick={() => {
                          console.log('🖱️ Clicou em Ver Demo para:', template.id, template.name)
                          setTemplatePreviewAberto(template.id)
                        }}
                        className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                      >
                        Ver Demo
                      </button>
                      <Link
                        href={template.link}
                        className="flex-1 bg-white border-2 border-teal-600 text-teal-600 text-center py-2.5 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                      >
                        Criar Link
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Como usar os templates?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Ver Demo:</strong> Veja como a ferramenta funciona antes de criar</li>
                <li>• <strong>Criar Link:</strong> Crie seu link personalizado e comece a usar</li>
                <li>• <strong>Compartilhar:</strong> Envie para seus clientes via WhatsApp, email ou redes sociais</li>
                <li>• <strong>Coletar Leads:</strong> Receba os resultados diretamente no seu dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Preview */}
      {templatePreviewAberto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('🖱️ Clicou no backdrop')
              setTemplatePreviewAberto(null)
            }
          }}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative',
              zIndex: 10000,
              maxHeight: '90vh'
            }}
          >
            {(() => {
              // Buscar template no array completo (incluindo fallback)
              const template = templates.find(t => t.id === templatePreviewAberto) || 
                               templatesFallback.find(t => t.id === templatePreviewAberto)
              
              if (!template) {
                console.error('❌ Template não encontrado:', templatePreviewAberto)
                console.error('📋 Templates disponíveis:', templates.map(t => ({ id: t.id, name: t.name })))
                console.error('📋 Templates fallback:', templatesFallback.map(t => ({ id: t.id, name: t.name })))
                return (
                  <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-semibold mb-2">Erro: Template não encontrado</p>
                      <p className="text-red-600 text-sm">ID procurado: <code>{templatePreviewAberto}</code></p>
                    </div>
                    <button
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                )
              }

              const Icon = template.icon
              console.log('✅ Template encontrado:', template.name, 'Tipo:', template.type)
              
              return (
                <div className="p-6">
                  {/* Header do Modal */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Preview Completo com Navegação por Etapas */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="relative">
                      {(() => {
                        const tipoPreview = template.type || 'calculadora'
                        const templateNameLower = template.name.toLowerCase()
                        
                        // Normalizar removendo acentos para comparação (usado em várias verificações)
                        const templateNameNormalizado = templateNameLower
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[çÇ]/g, 'c')
                        
                        // CHECKLIST ALIMENTAR - Verificar ANTES de planilhas
                        if (templateNameLower.includes('checklist alimentar') || templateNameLower.includes('checklist-alimentar') || templateNameLower.includes('checklist aliment') || (templateNameLower.includes('checklist') && templateNameLower.includes('aliment'))) {
                          return (
                            <>
                              {etapaPreviewChecklistAlimentar === 0 && (
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">🍽️ Avalie Seus Hábitos Alimentares</h4>
                                  <p className="text-gray-700 mb-3">{template.description || 'Descubra como está sua alimentação e receba orientações personalizadas para melhorar seus hábitos alimentares baseadas em sua rotina atual.'}</p>
                                  <p className="text-orange-600 font-semibold">💪 Uma avaliação que pode transformar sua relação com a comida.</p>
                                </div>
                              )}
                              {etapaPreviewChecklistAlimentar >= 1 && etapaPreviewChecklistAlimentar <= 5 && (
                                <div className="space-y-6">
                                  {etapaPreviewChecklistAlimentar === 1 && (
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-orange-900 mb-3">🥗 1. Quantas refeições você faz por dia?</h4>
                                      <div className="space-y-2">
                                        {['5-6 refeições pequenas', '3-4 refeições principais', '1-2 refeições por dia'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistAlimentar === 2 && (
                                    <div className="bg-amber-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-amber-900 mb-3">🥕 2. Quantos vegetais você consome por dia?</h4>
                                      <div className="space-y-2">
                                        {['5+ porções de vegetais', '3-4 porções de vegetais', 'Menos de 3 porções de vegetais'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistAlimentar === 3 && (
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-yellow-900 mb-3">🍎 3. Quantas frutas você consome por dia?</h4>
                                      <div className="space-y-2">
                                        {['3+ porções de frutas', '1-2 porções de frutas', 'Raramente como frutas'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistAlimentar === 4 && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-red-900 mb-3">🍔 4. Com que frequência você come alimentos processados?</h4>
                                      <div className="space-y-2">
                                        {['Raramente como processados', 'Às vezes como processados', 'Frequentemente como processados'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistAlimentar === 5 && (
                                    <div className="bg-pink-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-pink-900 mb-3">💧 5. Como está sua hidratação?</h4>
                                      <div className="space-y-2">
                                        {['Bebo 2-3L de água por dia', 'Bebo 1-2L de água por dia', 'Bebo menos de 1L de água por dia'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {etapaPreviewChecklistAlimentar === 6 && (
                                <div className="space-y-4">
                                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Checklist</h4>
                                  {[
                                    { titulo: '📉 Alimentação Deficiente', pontos: '0-40 pontos', cor: 'red', diagnostico: checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente },
                                    { titulo: '⚠️ Alimentação Moderada', pontos: '41-70 pontos', cor: 'yellow', diagnostico: checklistAlimentarDiagnosticos.nutri.alimentacaoModerada },
                                    { titulo: '✅ Alimentação Equilibrada', pontos: '71-100 pontos', cor: 'green', diagnostico: checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada }
                                  ].map((resultado) => {
                                    const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                    const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                    const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                    const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                    return (
                                      <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">{resultado.diagnostico.diagnostico}</p>
                                          <p>{resultado.diagnostico.causaRaiz}</p>
                                          <p>{resultado.diagnostico.acaoImediata}</p>
                                          <p>{resultado.diagnostico.plano7Dias}</p>
                                          <p>{resultado.diagnostico.suplementacao}</p>
                                          <p>{resultado.diagnostico.alimentacao}</p>
                                          {resultado.diagnostico.proximoPasso && (
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{resultado.diagnostico.proximoPasso}</p>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewChecklistAlimentar(Math.max(0, etapaPreviewChecklistAlimentar - 1))} disabled={etapaPreviewChecklistAlimentar === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                    const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                    return <button key={etapa} onClick={() => setEtapaPreviewChecklistAlimentar(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewChecklistAlimentar === etapa ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                  })}
                                </div>
                                <button onClick={() => setEtapaPreviewChecklistAlimentar(Math.min(6, etapaPreviewChecklistAlimentar + 1))} disabled={etapaPreviewChecklistAlimentar === 6} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // CHECKLIST DETOX - Verificar ANTES de planilhas
                        if (templateNameLower.includes('checklist detox') || templateNameLower.includes('checklist-detox')) {
                          return (
                            <>
                              {etapaPreviewChecklistDetox === 0 && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">🧽 Avalie Seu Nível de Toxicidade</h4>
                                  <p className="text-gray-700 mb-3">{template.description || 'Descubra se seu corpo está acumulando toxinas e receba orientações personalizadas para desintoxicação baseadas em seus hábitos e sinais corporais.'}</p>
                                  <p className="text-green-600 font-semibold">💪 Uma avaliação que pode transformar sua saúde e bem-estar.</p>
                                </div>
                              )}
                              {etapaPreviewChecklistDetox >= 1 && etapaPreviewChecklistDetox <= 5 && (
                                <div className="space-y-6">
                                  {etapaPreviewChecklistDetox === 1 && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-green-900 mb-3">🍎 1. Como você se sente após as refeições?</h4>
                                      <div className="space-y-2">
                                        {['Energizado e leve', 'Pesado e sonolento', 'Inchado e desconfortável'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="refeicoes-detox" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistDetox === 2 && (
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-emerald-900 mb-3">💧 2. Como está sua hidratação diária?</h4>
                                      <div className="space-y-2">
                                        {['Bebo 2-3L de água por dia', 'Bebo 1-2L de água por dia', 'Bebo menos de 1L de água por dia'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="hidratacao-detox" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistDetox === 3 && (
                                    <div className="bg-teal-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-teal-900 mb-3">🌱 3. Quantos vegetais você consome por dia?</h4>
                                      <div className="space-y-2">
                                        {['5+ porções de vegetais', '3-4 porções de vegetais', 'Menos de 3 porções de vegetais'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="vegetais-detox" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistDetox === 4 && (
                                    <div className="bg-cyan-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-cyan-900 mb-3">😴 4. Como está sua qualidade do sono?</h4>
                                      <div className="space-y-2">
                                        {['Durmo bem e acordo descansado', 'Durmo, mas acordo cansado', 'Tenho dificuldade para dormir'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="sono-detox" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewChecklistDetox === 5 && (
                                    <div className="bg-lime-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-lime-900 mb-3">⚡ 5. Como está seu nível de energia?</h4>
                                      <div className="space-y-2">
                                        {['Energia alta e constante', 'Energia moderada com altos e baixos', 'Energia baixa e fadiga constante'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="energia-detox" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {etapaPreviewChecklistDetox === 6 && (
                                <div className="space-y-4">
                                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Checklist</h4>
                                  {[
                                    { titulo: '🛡️ Baixa Toxicidade', pontos: '0-3 sinais', cor: 'green', diagnostico: checklistDetoxDiagnosticos.nutri.baixaToxicidade },
                                    { titulo: '⚠️ Toxicidade Moderada', pontos: '4-6 sinais', cor: 'yellow', diagnostico: checklistDetoxDiagnosticos.nutri.toxicidadeModerada },
                                    { titulo: '🚨 Alta Toxicidade', pontos: '7+ sinais', cor: 'red', diagnostico: checklistDetoxDiagnosticos.nutri.altaToxicidade }
                                  ].map((resultado) => {
                                    const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                    const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                    const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                    const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                    return (
                                      <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">{resultado.diagnostico.diagnostico}</p>
                                          <p>{resultado.diagnostico.causaRaiz}</p>
                                          <p>{resultado.diagnostico.acaoImediata}</p>
                                          <p>{resultado.diagnostico.plano7Dias}</p>
                                          <p>{resultado.diagnostico.suplementacao}</p>
                                          <p>{resultado.diagnostico.alimentacao}</p>
                                          {resultado.diagnostico.proximoPasso && (
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{resultado.diagnostico.proximoPasso}</p>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewChecklistDetox(Math.max(0, etapaPreviewChecklistDetox - 1))} disabled={etapaPreviewChecklistDetox === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                    const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                    return <button key={etapa} onClick={() => setEtapaPreviewChecklistDetox(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewChecklistDetox === etapa ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                  })}
                                </div>
                                <button onClick={() => setEtapaPreviewChecklistDetox(Math.min(6, etapaPreviewChecklistDetox + 1))} disabled={etapaPreviewChecklistDetox === 6} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // GUIA NUTRACÊUTICO - Verificar ANTES de planilhas
                        if (templateNameLower.includes('guia nutracêutico') || 
                            templateNameLower.includes('guia nutraceutico') || 
                            templateNameLower.includes('guia-nutraceutico') || 
                            templateNameLower.includes('guia-nutracêutico') ||
                            templateNameNormalizado.includes('guia nutraceutico') ||
                            templateNameNormalizado.includes('nutraceutico')) {
                          return (
                            <>
                              {etapaPreviewGuiaNutraceutico === 0 && (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">💊 Avalie Seu Interesse em Nutracêuticos</h4>
                                  <p className="text-gray-700 mb-3">{template.description || 'Descubra seu nível de interesse em nutracêuticos e receba orientações personalizadas para evoluir seu conhecimento sobre alimentos funcionais e suplementação baseadas em sua área de interesse.'}</p>
                                  <p className="text-purple-600 font-semibold">💪 Uma avaliação que pode transformar seu interesse em nutracêuticos.</p>
                                </div>
                              )}
                              {etapaPreviewGuiaNutraceutico >= 1 && etapaPreviewGuiaNutraceutico <= 5 && (
                                <div className="space-y-6">
                                  {etapaPreviewGuiaNutraceutico === 1 && (
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-purple-900 mb-3">💊 1. Qual é seu interesse em suplementos nutracêuticos?</h4>
                                      <div className="space-y-2">
                                        {['Tenho muito interesse em suplementos nutracêuticos', 'Tenho interesse moderado em suplementos nutracêuticos', 'Tenho pouco interesse em suplementos nutracêuticos'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="suplementos-nutraceutico" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewGuiaNutraceutico === 2 && (
                                    <div className="bg-pink-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-pink-900 mb-3">🥗 2. Qual é seu interesse em alimentos funcionais?</h4>
                                      <div className="space-y-2">
                                        {['Tenho muito interesse em alimentos funcionais', 'Tenho interesse moderado em alimentos funcionais', 'Tenho pouco interesse em alimentos funcionais'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="alimentos-funcionais" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {[3, 4, 5].map((etapa) => {
                                    const perguntas = [
                                      { num: 3, text: '🌿 3. Qual é seu interesse em nutracêuticos naturais?', opcoes: ['Tenho muito interesse em nutracêuticos naturais', 'Tenho interesse moderado em nutracêuticos naturais', 'Tenho pouco interesse em nutracêuticos naturais'], bg: 'bg-indigo-50', textColor: 'text-indigo-900' },
                                      { num: 4, text: '🧘‍♀️ 4. Qual é seu interesse em nutracêuticos para bem-estar?', opcoes: ['Tenho muito interesse em nutracêuticos para bem-estar', 'Tenho interesse moderado em nutracêuticos para bem-estar', 'Tenho pouco interesse em nutracêuticos para bem-estar'], bg: 'bg-cyan-50', textColor: 'text-cyan-900' },
                                      { num: 5, text: '📚 5. Com que frequência você busca informações sobre nutracêuticos?', opcoes: ['Diariamente busco informações sobre nutracêuticos', 'Semanalmente busco informações sobre nutracêuticos', 'Raramente busco informações sobre nutracêuticos'], bg: 'bg-teal-50', textColor: 'text-teal-900' }
                                    ]
                                    const pergunta = perguntas[etapa - 3]
                                    return etapaPreviewGuiaNutraceutico === etapa && (
                                      <div key={etapa} className={`${pergunta.bg} p-4 rounded-lg`}>
                                        <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.text}</h4>
                                        <div className="space-y-2">
                                          {pergunta.opcoes.map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name={`pergunta-${etapa}`} className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              {etapaPreviewGuiaNutraceutico === 6 && (
                                <div className="space-y-4">
                                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Guia Nutracêutico</h4>
                                  {[
                                    { titulo: '📉 Baixo Interesse', pontos: '0-40 pontos', cor: 'red', diagnostico: guiaNutraceuticoDiagnosticos.nutri.baixoInteresse },
                                    { titulo: '⚠️ Interesse Moderado', pontos: '41-70 pontos', cor: 'yellow', diagnostico: guiaNutraceuticoDiagnosticos.nutri.interesseModerado },
                                    { titulo: '🚀 Alto Interesse', pontos: '71-100 pontos', cor: 'green', diagnostico: guiaNutraceuticoDiagnosticos.nutri.altoInteresse }
                                  ].map((resultado) => {
                                    const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                    const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                    const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                    const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                    return (
                                      <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">{resultado.diagnostico.diagnostico}</p>
                                          <p>{resultado.diagnostico.causaRaiz}</p>
                                          <p>{resultado.diagnostico.acaoImediata}</p>
                                          <p>{resultado.diagnostico.plano7Dias}</p>
                                          <p>{resultado.diagnostico.suplementacao}</p>
                                          <p>{resultado.diagnostico.alimentacao}</p>
                                          {resultado.diagnostico.proximoPasso && (
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{resultado.diagnostico.proximoPasso}</p>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewGuiaNutraceutico(Math.max(0, etapaPreviewGuiaNutraceutico - 1))} disabled={etapaPreviewGuiaNutraceutico === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                    const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                    return <button key={etapa} onClick={() => setEtapaPreviewGuiaNutraceutico(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewGuiaNutraceutico === etapa ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                  })}
                                </div>
                                <button onClick={() => setEtapaPreviewGuiaNutraceutico(Math.min(6, etapaPreviewGuiaNutraceutico + 1))} disabled={etapaPreviewGuiaNutraceutico === 6} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // GUIA PROTEICO - Verificar ANTES de planilhas
                        // Usar a mesma normalização já criada acima
                        if (templateNameLower.includes('guia proteico') || 
                            templateNameLower.includes('guia-proteico') || 
                            templateNameLower.includes('guia prote') || 
                            templateNameNormalizado.includes('guia proteico') ||
                            templateNameNormalizado.includes('proteico')) {
                          return (
                            <>
                              {etapaPreviewGuiaProteico === 0 && (
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">🥩 Avalie Seu Consumo de Proteínas</h4>
                                  <p className="text-gray-700 mb-3">{template.description || 'Descubra seu nível de consumo de proteínas e receba orientações personalizadas para otimizar sua ingestão proteica baseadas em sua área de interesse.'}</p>
                                  <p className="text-orange-600 font-semibold">💪 Uma avaliação que pode transformar seu consumo de proteínas.</p>
                                </div>
                              )}
                              {etapaPreviewGuiaProteico >= 1 && etapaPreviewGuiaProteico <= 5 && (
                                <div className="space-y-6">
                                  {etapaPreviewGuiaProteico === 1 && (
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-orange-900 mb-3">🥩 1. Qual é seu consumo diário de proteínas?</h4>
                                      <div className="space-y-2">
                                        {['Consumo mais de 1.2g de proteína por kg de peso', 'Consumo entre 0.8-1.2g de proteína por kg de peso', 'Consumo menos de 0.8g de proteína por kg de peso'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="consumo-proteina" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {etapaPreviewGuiaProteico === 2 && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-red-900 mb-3">🍖 2. Quais são suas principais fontes de proteína?</h4>
                                      <div className="space-y-2">
                                        {['Carnes, ovos, peixes e laticínios', 'Mix de fontes animais e vegetais', 'Principalmente fontes vegetais'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="fontes-proteina" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {[3, 4, 5].map((etapa) => {
                                    const perguntas = [
                                      { num: 3, text: '💪 3. Qual é seu objetivo com o consumo de proteínas?', opcoes: ['Ganho de massa muscular e performance', 'Manutenção da saúde e bem-estar', 'Perda de peso e definição'], bg: 'bg-amber-50', textColor: 'text-amber-900' },
                                      { num: 4, text: '⏰ 4. Como você distribui as proteínas ao longo do dia?', opcoes: ['Distribuo uniformemente em todas as refeições', 'Concentro principalmente no almoço e jantar', 'Não tenho uma distribuição específica'], bg: 'bg-yellow-50', textColor: 'text-yellow-900' },
                                      { num: 5, text: '📚 5. Com que frequência você busca informações sobre proteínas?', opcoes: ['Diariamente busco informações sobre proteínas', 'Semanalmente busco informações sobre proteínas', 'Raramente busco informações sobre proteínas'], bg: 'bg-lime-50', textColor: 'text-lime-900' }
                                    ]
                                    const pergunta = perguntas[etapa - 3]
                                    return etapaPreviewGuiaProteico === etapa && (
                                      <div key={etapa} className={`${pergunta.bg} p-4 rounded-lg`}>
                                        <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.text}</h4>
                                        <div className="space-y-2">
                                          {pergunta.opcoes.map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name={`pergunta-${etapa}`} className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              {etapaPreviewGuiaProteico === 6 && (
                                <div className="space-y-4">
                                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Guia Proteico</h4>
                                  {[
                                    { titulo: '📉 Baixa Proteína', pontos: '< 0.8g/kg', cor: 'red', diagnostico: guiaProteicoDiagnosticos.nutri.baixaProteina },
                                    { titulo: '✅ Proteína Moderada', pontos: '0.8-1.2g/kg', cor: 'green', diagnostico: guiaProteicoDiagnosticos.nutri.proteinaModerada },
                                    { titulo: '🚀 Alta Proteína', pontos: '> 1.2g/kg', cor: 'blue', diagnostico: guiaProteicoDiagnosticos.nutri.altaProteina }
                                  ].map((resultado) => {
                                    const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'green' ? 'bg-green-50' : 'bg-blue-50'
                                    const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'green' ? 'border-green-200' : 'border-blue-200'
                                    const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'green' ? 'text-green-900' : 'text-blue-900'
                                    const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'green' ? 'bg-green-600' : 'bg-blue-600'
                                    return (
                                      <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">{resultado.diagnostico.diagnostico}</p>
                                          <p>{resultado.diagnostico.causaRaiz}</p>
                                          <p>{resultado.diagnostico.acaoImediata}</p>
                                          <p>{resultado.diagnostico.plano7Dias}</p>
                                          <p>{resultado.diagnostico.suplementacao}</p>
                                          <p>{resultado.diagnostico.alimentacao}</p>
                                          {resultado.diagnostico.proximoPasso && (
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{resultado.diagnostico.proximoPasso}</p>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewGuiaProteico(Math.max(0, etapaPreviewGuiaProteico - 1))} disabled={etapaPreviewGuiaProteico === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                    const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                    return <button key={etapa} onClick={() => setEtapaPreviewGuiaProteico(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewGuiaProteico === etapa ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                  })}
                                </div>
                                <button onClick={() => setEtapaPreviewGuiaProteico(Math.min(6, etapaPreviewGuiaProteico + 1))} disabled={etapaPreviewGuiaProteico === 6} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // CALCULADORAS
                        if (tipoPreview === 'calculadora') {
                          // Calculadora de Água/Hidratação
                          if (templateNameLower.includes('água') || templateNameLower.includes('agua') || templateNameLower.includes('hidratação') || templateNameLower.includes('hidratacao')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewCalc === 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">💧 Calcule Sua Necessidade Diária de Água</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra exatamente quanta água seu corpo precisa por dia e receba orientações personalizadas.'}</p>
                                    <p className="text-blue-600 font-semibold">💪 Uma recomendação que pode transformar sua hidratação e performance.</p>
                                  </div>
                                )}
                                
                                {/* Formulário - Etapa 1 */}
                                {etapaPreviewCalc === 1 && (
                                  <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-900 mb-3">⚖️ Informe seus dados</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                          <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Nível de atividade</label>
                                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled>
                                            <option>Sedentário</option>
                                            <option>Moderado</option>
                                            <option>Intenso</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-cyan-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-cyan-900 mb-3">🌡️ Clima</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        {['Temperado', 'Quente', 'Úmido', 'Altitude'].map((clima) => (
                                          <label key={clima} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="clima" className="mr-3" disabled />
                                            <span className="text-gray-700">{clima}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Resultado - Etapa 2 */}
                                {etapaPreviewCalc === 2 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-4">📊 Resultado da Calculadora</h4>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                      <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">2.8L</div>
                                        <div className="text-lg font-semibold text-green-600">Água Diária Recomendada</div>
                                      </div>
                                      <div className="space-y-2 text-sm mt-4">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🌅 Manhã:</span>
                                          <span className="font-semibold">0.8L</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>☀️ Tarde:</span>
                                          <span className="font-semibold">1.2L</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🌙 Noite:</span>
                                          <span className="font-semibold">0.8L</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Diagnósticos - Etapa 3 */}
                                {etapaPreviewCalc === 3 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {/* Baixa Hidratação */}
                                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-red-900">💧 Baixa Hidratação</h5>
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">&lt; 2L/dia</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.diagnostico}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.causaRaiz}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.acaoImediata}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.plano7Dias}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.suplementacao}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.alimentacao}</p>
                                        {calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Hidratação Moderada */}
                                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-yellow-900">⚖️ Hidratação Moderada</h5>
                                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">2-3L/dia</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.diagnostico}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.causaRaiz}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.acaoImediata}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.plano7Dias}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.suplementacao}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.alimentacao}</p>
                                        {calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Alta Hidratação */}
                                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-green-900">🚀 Alta Hidratação</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">&gt; 3L/dia</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.diagnostico}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.altaHidratacao.causaRaiz}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.altaHidratacao.acaoImediata}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.altaHidratacao.plano7Dias}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.altaHidratacao.suplementacao}</p>
                                        <p>{calculadoraAguaDiagnosticos.nutri.altaHidratacao.alimentacao}</p>
                                        {calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Navegação */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.max(0, etapaPreviewCalc - 1))}
                                    disabled={etapaPreviewCalc === 0}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ← Anterior
                                  </button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3].map((etapa) => {
                                      const labels = ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                                      return (
                                        <button
                                          key={etapa}
                                          onClick={() => setEtapaPreviewCalc(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewCalc === etapa
                                              ? 'bg-blue-600 text-white'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                        >
                                          {labels[etapa]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.min(3, etapaPreviewCalc + 1))}
                                    disabled={etapaPreviewCalc === 3}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )
                          }
                          
                          // Calculadora de Calorias
                          if (templateNameLower.includes('calorias') || templateNameLower.includes('caloria')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewCalc === 0 && (
                                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🔥 Calcule Sua Necessidade Diária de Calorias</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra exatamente quantas calorias seu corpo precisa por dia e receba orientações personalizadas baseadas em seu objetivo.'}</p>
                                    <p className="text-orange-600 font-semibold">💪 Uma recomendação que pode transformar sua composição corporal.</p>
                                  </div>
                                )}
                                
                                {/* Formulário - Etapa 1 */}
                                {etapaPreviewCalc === 1 && (
                                  <div className="space-y-6">
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-orange-900 mb-3">⚖️ Informe seus dados</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                          <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                          <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-red-900 mb-3">👤 Idade e sexo</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Idade (anos)</label>
                                          <input type="number" placeholder="Ex: 30" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled>
                                            <option>Masculino</option>
                                            <option>Feminino</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-yellow-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                      <div className="space-y-2">
                                        {['Sedentário', 'Leve', 'Moderado', 'Intenso'].map((nivel) => (
                                          <label key={nivel} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="atividade" className="mr-3" disabled />
                                            <span className="text-gray-700">{nivel}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-green-900 mb-3">🎯 Seu objetivo</h4>
                                      <div className="space-y-2">
                                        {['Emagrecer', 'Manter peso', 'Ganhar massa'].map((objetivo) => (
                                          <label key={objetivo} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="objetivo" className="mr-3" disabled />
                                            <span className="text-gray-700">{objetivo}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Resultado - Etapa 2 */}
                                {etapaPreviewCalc === 2 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-4">📊 Resultado da Calculadora</h4>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                      <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-orange-600 mb-2">2.200</div>
                                        <div className="text-lg font-semibold text-green-600">Calorias Diárias Recomendadas</div>
                                        <div className="text-sm text-gray-600">Baseado em TMB + atividade física</div>
                                      </div>
                                      <div className="space-y-2 text-sm mt-4">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🥩 Proteínas:</span>
                                          <span className="font-semibold">550 cal (137g)</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🍞 Carboidratos:</span>
                                          <span className="font-semibold">1.100 cal (275g)</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🥑 Gorduras:</span>
                                          <span className="font-semibold">550 cal (61g)</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Diagnósticos - Etapa 3 */}
                                {etapaPreviewCalc === 3 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {/* Déficit Calórico */}
                                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-blue-900">🔥 Déficit Calórico</h5>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Perda de peso</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.diagnostico}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.causaRaiz}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.acaoImediata}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.plano7Dias}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.suplementacao}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.alimentacao}</p>
                                        {calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Manutenção Calórica */}
                                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-green-900">⚖️ Manutenção Calórica</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Peso estável</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.diagnostico}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.causaRaiz}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.acaoImediata}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.plano7Dias}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.suplementacao}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.alimentacao}</p>
                                        {calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Superávit Calórico */}
                                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-yellow-900">🚀 Superávit Calórico</h5>
                                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Ganho de peso</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.diagnostico}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.causaRaiz}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.acaoImediata}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.plano7Dias}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.suplementacao}</p>
                                        <p>{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.alimentacao}</p>
                                        {calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Navegação */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.max(0, etapaPreviewCalc - 1))}
                                    disabled={etapaPreviewCalc === 0}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ← Anterior
                                  </button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3].map((etapa) => {
                                      const labels = ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                                      return (
                                        <button
                                          key={etapa}
                                          onClick={() => setEtapaPreviewCalc(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewCalc === etapa
                                              ? 'bg-orange-600 text-white'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                        >
                                          {labels[etapa]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.min(3, etapaPreviewCalc + 1))}
                                    disabled={etapaPreviewCalc === 3}
                                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )
                          }
                          
                          // Calculadora IMC - Preview completo com sexo e atividade física
                          if (templateNameLower.includes('imc')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewCalc === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Calcule seu Índice de Massa Corporal</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra seu IMC e receba orientações personalizadas baseadas em seus dados.'}</p>
                                    <p className="text-green-600 font-semibold">💪 Uma análise que pode transformar sua compreensão sobre saúde e composição corporal.</p>
                                  </div>
                                )}
                                
                                {/* Formulário - Etapa 1 */}
                                {etapaPreviewCalc === 1 && (
                                  <div className="space-y-6">
                                    {/* Dados Principais */}
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-green-900 mb-3">📏 Informe seus dados</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                          <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                          <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Sexo */}
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-emerald-900 mb-3">👤 Selecione seu sexo</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                          <input type="radio" name="sexo" className="mr-3" disabled />
                                          <span className="text-gray-700">👨 Masculino</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                          <input type="radio" name="sexo" className="mr-3" disabled />
                                          <span className="text-gray-700">👩 Feminino</span>
                                        </label>
                                      </div>
                                    </div>
                                    
                                    {/* Nível de Atividade */}
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ Nível de atividade física (opcional)</h4>
                                      <div className="space-y-2">
                                        {['Sedentário - Pouco ou nenhum exercício', 'Leve - Exercício leve 1-3 dias/semana', 'Moderado - Exercício moderado 3-5 dias/semana', 'Intenso - Exercício intenso 6-7 dias/semana'].map((nivel) => (
                                          <label key={nivel} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="atividade" className="mr-3" disabled />
                                            <span className="text-gray-700">{nivel}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {etapaPreviewCalc === 2 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                                      <div className="text-4xl font-bold text-green-600 mb-2">22.9</div>
                                      <div className="text-lg font-semibold text-gray-700">IMC Normal</div>
                                      <p className="text-sm text-gray-600 mt-2">Mantenha hábitos saudáveis</p>
                                    </div>
                                  </div>
                                )}
                                {etapaPreviewCalc === 3 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Interpretação do IMC</h4>
                                    {/* Abaixo do Peso */}
                                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-blue-900">Abaixo do Peso</h5>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">&lt; 18.5</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraImcDiagnosticos.nutri.baixoPeso.diagnostico}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.baixoPeso.causaRaiz}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.baixoPeso.acaoImediata}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.baixoPeso.plano7Dias}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.baixoPeso.suplementacao}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.baixoPeso.alimentacao}</p>
                                        {calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Peso Normal */}
                                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-green-900">Peso Normal</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">18.5 - 24.9</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraImcDiagnosticos.nutri.pesoNormal.diagnostico}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.pesoNormal.causaRaiz}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.pesoNormal.acaoImediata}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.pesoNormal.plano7Dias}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.pesoNormal.suplementacao}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.pesoNormal.alimentacao}</p>
                                        {calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Sobrepeso */}
                                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-yellow-900">Sobrepeso</h5>
                                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">25 - 29.9</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraImcDiagnosticos.nutri.sobrepeso.diagnostico}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.sobrepeso.causaRaiz}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.sobrepeso.acaoImediata}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.sobrepeso.plano7Dias}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.sobrepeso.suplementacao}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.sobrepeso.alimentacao}</p>
                                        {calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Obesidade */}
                                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-red-900">Obesidade</h5>
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">≥ 30</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraImcDiagnosticos.nutri.obesidade.diagnostico}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.obesidade.causaRaiz}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.obesidade.acaoImediata}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.obesidade.plano7Dias}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.obesidade.suplementacao}</p>
                                        <p>{calculadoraImcDiagnosticos.nutri.obesidade.alimentacao}</p>
                                        {calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewCalc(Math.max(0, etapaPreviewCalc - 1))} disabled={etapaPreviewCalc === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0,1,2,3].map((e)=>{const l=['Início','Formulário','Resultado','Diagnósticos'];return <button key={e} onClick={()=>setEtapaPreviewCalc(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewCalc===e?'bg-green-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l[e]}</button>})}
                                  </div>
                                  <button onClick={() => setEtapaPreviewCalc(Math.min(3, etapaPreviewCalc + 1))} disabled={etapaPreviewCalc === 3} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Calculadora de Proteína
                          if (templateNameLower.includes('proteína') || templateNameLower.includes('proteina')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewCalc === 0 && (
                                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🥩 Calcule Sua Necessidade Diária de Proteína</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra exatamente quantas proteínas seu corpo precisa por dia e receba orientações personalizadas baseadas em seu peso, atividade física e objetivos.'}</p>
                                    <p className="text-red-600 font-semibold">💪 Uma recomendação que pode transformar sua massa muscular e recuperação.</p>
                                  </div>
                                )}
                                
                                {/* Formulário - Etapa 1 */}
                                {etapaPreviewCalc === 1 && (
                                  <div className="space-y-6">
                                    <div className="bg-red-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-red-900 mb-3">⚖️ Informe seus dados</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                          <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                          <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                      <div className="space-y-2">
                                        {['Sedentário - Pouco ou nenhum exercício', 'Leve - Exercício leve 1-3 dias/semana', 'Moderado - Exercício moderado 3-5 dias/semana', 'Intenso - Exercício intenso 6-7 dias/semana'].map((nivel) => (
                                          <label key={nivel} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="atividade" className="mr-3" disabled />
                                            <span className="text-gray-700">{nivel}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-900 mb-3">🎯 Seus objetivos</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['Ganhar massa muscular', 'Manter peso atual', 'Perder gordura', 'Melhorar performance'].map((objetivo) => (
                                          <label key={objetivo} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name="objetivo" className="mr-3" disabled />
                                            <span className="text-gray-700">{objetivo}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Resultado - Etapa 2 */}
                                {etapaPreviewCalc === 2 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-4">📊 Resultado da Calculadora</h4>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                      <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-red-600 mb-2">112g</div>
                                        <div className="text-lg font-semibold text-green-600">Proteína Diária Recomendada</div>
                                        <div className="text-sm text-gray-600">Baseado em 1.6g/kg para ganho de massa</div>
                                      </div>
                                      <div className="space-y-2 text-sm mt-4">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🌅 Café da manhã:</span>
                                          <span className="font-semibold">28g</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🍽️ Almoço:</span>
                                          <span className="font-semibold">35g</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🍽️ Jantar:</span>
                                          <span className="font-semibold">35g</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>🥤 Lanche:</span>
                                          <span className="font-semibold">14g</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Diagnósticos - Etapa 3 */}
                                {etapaPreviewCalc === 3 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {/* Baixa Proteína */}
                                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-red-900">📉 Baixa Proteína</h5>
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">&lt; 0.8g/kg</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.diagnostico}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.baixaProteina.causaRaiz}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.baixaProteina.acaoImediata}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.baixaProteina.plano7Dias}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.baixaProteina.suplementacao}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.baixaProteina.alimentacao}</p>
                                        {calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Proteína Normal */}
                                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-green-900">⚖️ Proteína Normal</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">0.8-1.2g/kg</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.diagnostico}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.causaRaiz}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.acaoImediata}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.plano7Dias}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.suplementacao}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.alimentacao}</p>
                                        {calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                    {/* Alta Proteína */}
                                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-blue-900">🚀 Alta Proteína</h5>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">&gt; 1.2g/kg</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">{calculadoraProteinaDiagnosticos.nutri.altaProteina.diagnostico}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.altaProteina.causaRaiz}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.altaProteina.acaoImediata}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.altaProteina.plano7Dias}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.altaProteina.suplementacao}</p>
                                        <p>{calculadoraProteinaDiagnosticos.nutri.altaProteina.alimentacao}</p>
                                        {calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso && (
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Navegação */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.max(0, etapaPreviewCalc - 1))}
                                    disabled={etapaPreviewCalc === 0}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ← Anterior
                                  </button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3].map((etapa) => {
                                      const labels = ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                                      return (
                                        <button
                                          key={etapa}
                                          onClick={() => setEtapaPreviewCalc(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewCalc === etapa
                                              ? 'bg-red-600 text-white'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                        >
                                          {labels[etapa]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setEtapaPreviewCalc(Math.min(3, etapaPreviewCalc + 1))}
                                    disabled={etapaPreviewCalc === 3}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )
                          }
                          
                          // Outras calculadoras - fallback genérico
                          return (
                            <>
                              {etapaPreviewCalc === 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                                  <p className="text-gray-700">{template.description || 'Esta é uma calculadora interativa com orientações personalizadas.'}</p>
                                </div>
                              )}
                              {etapaPreviewCalc === 1 && (
                                <div className="bg-white rounded-lg p-6 border border-blue-100">
                                  <p className="text-sm text-gray-600 mb-4">Formulário com campos específicos da calculadora.</p>
                                  <div className="h-10 bg-gray-100 rounded-lg mb-2"></div>
                                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                                </div>
                              )}
                              {etapaPreviewCalc === 2 && (
                                <div className="bg-blue-50 p-6 rounded-lg">
                                  <div className="bg-white p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">Resultado</div>
                                    <p className="text-sm text-gray-600 mt-2">Resultado personalizado será exibido aqui</p>
                                  </div>
                                </div>
                              )}
                              {etapaPreviewCalc === 3 && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <p className="text-sm text-gray-700"><strong>Diagnóstico:</strong> Orientações personalizadas baseadas no resultado.</p>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewCalc(Math.max(0, etapaPreviewCalc - 1))} disabled={etapaPreviewCalc === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0,1,2,3].map((e)=>{const l=['Início','Formulário','Resultado','Diagnósticos'];return <button key={e} onClick={()=>setEtapaPreviewCalc(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewCalc===e?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l[e]}</button>})}
                                </div>
                                <button onClick={() => setEtapaPreviewCalc(Math.min(3, etapaPreviewCalc + 1))} disabled={etapaPreviewCalc === 3} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // QUIZZES
                        if (tipoPreview === 'quiz') {
                          // Quiz Avaliação Nutricional - Verificar PRIMEIRO
                          if (templateNameLower.includes('avaliação nutricional') || 
                              templateNameLower.includes('avaliacao nutricional') ||
                              templateNameNormalizado.includes('avaliacao nutricional')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewQuizAvaliacaoNutricional === 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Avalie Suas Necessidades Nutricionais</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra suas necessidades nutricionais através de perguntas estratégicas e receba orientações personalizadas para otimizar sua alimentação e suplementação.'}</p>
                                    <p className="text-blue-600 font-semibold">✨ Uma avaliação completa que pode transformar sua saúde nutricional.</p>
                                  </div>
                                )}
                                
                                {/* Perguntas 1-5 */}
                                {etapaPreviewQuizAvaliacaoNutricional >= 1 && etapaPreviewQuizAvaliacaoNutricional <= 5 && (
                                  <div className="space-y-6">
                                    {etapaPreviewQuizAvaliacaoNutricional === 1 && (
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-3">🎯 1. Qual seu principal objetivo?</h4>
                                        <div className="space-y-2">
                                          {['Emagrecer', 'Ganhar massa', 'Manter peso', 'Melhorar saúde'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="objetivo-avaliacao" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizAvaliacaoNutricional === 2 && (
                                      <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-indigo-900 mb-3">🍽️ 2. Quantas refeições você faz por dia?</h4>
                                        <div className="space-y-2">
                                          {['1-2 refeições', '3-4 refeições', '5-6 refeições'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="refeicoes-avaliacao" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizAvaliacaoNutricional === 3 && (
                                      <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-3">💧 3. Como está sua hidratação diária?</h4>
                                        <div className="space-y-2">
                                          {['Bebo menos de 1L por dia', 'Bebo 1-2L por dia', 'Bebo mais de 2L por dia'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="hidratacao-avaliacao" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizAvaliacaoNutricional === 4 && (
                                      <div className="bg-pink-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-pink-900 mb-3">🥗 4. Quantas porções de vegetais você consome por dia?</h4>
                                        <div className="space-y-2">
                                          {['Menos de 2 porções', '2-4 porções', '5+ porções'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="vegetais-avaliacao" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizAvaliacaoNutricional === 5 && (
                                      <div className="bg-cyan-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-cyan-900 mb-3">⚡ 5. Como está seu nível de energia?</h4>
                                        <div className="space-y-2">
                                          {['Baixa, me sinto sempre cansado', 'Moderada, varia durante o dia', 'Alta e constante'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="energia-avaliacao" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Resultados - Etapa 6 */}
                                {etapaPreviewQuizAvaliacaoNutricional === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Avaliação Nutricional</h4>
                                    {[
                                      { titulo: '📉 Necessidades Prioritárias', pontos: '5-10 pontos', cor: 'red', diagnostico: 'Suas necessidades nutricionais precisam de atenção imediata e personalizada', causaRaiz: 'Déficits nutricionais podem estar impactando sua saúde e bem-estar. Estudos indicam que 73% das pessoas com necessidades prioritárias têm carências não identificadas. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina', acaoImediata: 'Busque uma avaliação nutricional profissional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única', plano7Dias: 'Protocolo inicial de 7 dias personalizado, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta individual', suplementacao: 'A necessidade só é definida após avaliação completa. Multivitamínico, magnésio e ômega-3 são frequentemente considerados, mas sempre de acordo com a individualidade biológica', alimentacao: 'Um plano alimentar personalizado considera suas preferências e objetivos. Aumente frutas, verduras e proteínas de forma estratégica enquanto aguarda sua avaliação', proximoPasso: 'Seu organismo precisa de cuidado agora — e é totalmente possível melhorar com apoio profissional especializado.' },
                                      { titulo: '⚖️ Necessidades Moderadas', pontos: '11-15 pontos', cor: 'yellow', diagnostico: 'Suas necessidades nutricionais estão boas, mas podem ser otimizadas', causaRaiz: 'Boa base nutricional estabelecida, porém pode faltar micronutrientes específicos para elevar seus resultados. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença', acaoImediata: 'Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias', plano7Dias: 'Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas a dosagem é personalizada após análise do seu caso', alimentacao: 'Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil', proximoPasso: 'Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.' },
                                      { titulo: '✅ Necessidades Equilibradas', pontos: '16-20 pontos', cor: 'green', diagnostico: 'Excelente! Suas necessidades nutricionais estão bem atendidas; estratégias preventivas podem potencializar ainda mais', causaRaiz: 'Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você', acaoImediata: 'Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo', plano7Dias: 'Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros', suplementacao: 'Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual', alimentacao: 'Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados', proximoPasso: 'Parabéns! Seu equilíbrio nutricional atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                
                                {/* Navegação */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewQuizAvaliacaoNutricional(Math.max(0, etapaPreviewQuizAvaliacaoNutricional - 1))}
                                    disabled={etapaPreviewQuizAvaliacaoNutricional === 0}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ← Anterior
                                  </button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return (
                                        <button
                                          key={etapa}
                                          onClick={() => setEtapaPreviewQuizAvaliacaoNutricional(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewQuizAvaliacaoNutricional === etapa
                                              ? 'bg-blue-600 text-white'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                          title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}
                                        >
                                          {labels[etapa]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setEtapaPreviewQuizAvaliacaoNutricional(Math.min(6, etapaPreviewQuizAvaliacaoNutricional + 1))}
                                    disabled={etapaPreviewQuizAvaliacaoNutricional === 6}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz de Bem-Estar
                          if (templateNameLower.includes('bem-estar') || templateNameLower.includes('bem estar')) {
                            return (
                              <>
                                {/* Landing - Etapa 0 */}
                                {etapaPreviewQuizBemEstar === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🌟 Descubra Seu Nível de Bem-estar em 2 Minutos</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie como está sua energia, humor, sono e qualidade de vida — e descubra estratégias personalizadas para elevar seu bem-estar.'}</p>
                                    <p className="text-green-600 font-semibold">✨ Uma avaliação completa que pode transformar sua rotina.</p>
                                  </div>
                                )}
                                
                                {/* Perguntas 1-5 */}
                                {etapaPreviewQuizBemEstar >= 1 && etapaPreviewQuizBemEstar <= 5 && (
                                  <div className="space-y-6">
                                    {etapaPreviewQuizBemEstar === 1 && (
                                      <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-900 mb-3">🌅 1. Como você se sente ao acordar?</h4>
                                        <div className="space-y-2">
                                          {['Cansado, preciso de café para funcionar', 'Normal, mas preciso de um tempo para despertar', 'Energizado e pronto para o dia'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="acordar" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizBemEstar === 2 && (
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-3">😴 2. Como está a qualidade do seu sono?</h4>
                                        <div className="space-y-2">
                                          {['Dificuldade para dormir ou acordar várias vezes', 'Sono regular, mas não sempre reparador', 'Durmo bem e acordo descansado'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="sono" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizBemEstar === 3 && (
                                      <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-3">😊 3. Como está seu humor geral?</h4>
                                        <div className="space-y-2">
                                          {['Frequentemente irritado ou triste', 'Humor instável, depende do dia', 'Geralmente positivo e estável'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="humor" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizBemEstar === 4 && (
                                      <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-yellow-900 mb-3">⚡ 4. Como está seu nível de energia ao longo do dia?</h4>
                                        <div className="space-y-2">
                                          {['Baixo, me sinto sempre cansado', 'Variável, tenho altos e baixos', 'Alto e constante durante o dia'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="energia" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {etapaPreviewQuizBemEstar === 5 && (
                                      <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-indigo-900 mb-3">🏃‍♀️ 5. Como está sua disposição para atividades físicas?</h4>
                                        <div className="space-y-2">
                                          {['Sem energia para exercícios', 'Faço exercícios ocasionalmente', 'Pratico atividades físicas regularmente'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="atividade" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Resultados - Etapa 6 */}
                                {etapaPreviewQuizBemEstar === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                                    {/* Bem-estar Baixo */}
                                    <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-red-900">📉 Bem-estar Baixo</h5>
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">5-8 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">📋 DIAGNÓSTICO: Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada</p>
                                        <p>🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Estudos indicam que 73% das pessoas com bem-estar baixo têm carências de nutrientes essenciais sem perceber. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina</p>
                                        <p>⚡ AÇÃO IMEDIATA: Busque uma avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única</p>
                                        <p>📅 PLANO 7 DIAS: Protocolo inicial de 7 dias personalizado, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta individual</p>
                                        <p>💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Complexo B, magnésio e ômega-3 são frequentemente considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas</p>
                                        <p>🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas preferências e objetivos. Aumente frutas, verduras e grãos integrais de forma estratégica enquanto aguarda sua avaliação</p>
                                        <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — personalize seu plano e veja resultados reais.</p>
                                      </div>
                                    </div>
                                    {/* Bem-estar Moderado */}
                                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-yellow-900">⚖️ Bem-estar Moderado</h5>
                                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">9-12 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados</p>
                                        <p>🔍 CAUSA RAIZ: Boa base nutricional estabelecida, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença</p>
                                        <p>⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias</p>
                                        <p>📅 PLANO 7 DIAS: Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina</p>
                                        <p>💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas a dosagem é personalizada após análise do seu caso</p>
                                        <p>🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil</p>
                                        <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.</p>
                                      </div>
                                    </div>
                                    {/* Bem-estar Alto */}
                                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-green-900">🌟 Bem-estar Alto</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">13-15 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                        <p className="font-semibold">📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com nutrição preventiva e estratégias avançadas de performance</p>
                                        <p>🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você</p>
                                        <p>⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo</p>
                                        <p>📅 PLANO 7 DIAS: Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros</p>
                                        <p>💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual</p>
                                        <p>🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados</p>
                                        <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Navegação */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewQuizBemEstar(Math.max(0, etapaPreviewQuizBemEstar - 1))}
                                    disabled={etapaPreviewQuizBemEstar === 0}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ← Anterior
                                  </button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return (
                                        <button
                                          key={etapa}
                                          onClick={() => setEtapaPreviewQuizBemEstar(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewQuizBemEstar === etapa
                                              ? 'bg-green-600 text-white'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                          title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}
                                        >
                                          {labels[etapa]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setEtapaPreviewQuizBemEstar(Math.min(6, etapaPreviewQuizBemEstar + 1))}
                                    disabled={etapaPreviewQuizBemEstar === 6}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Interativo (Tipo de Metabolismo)
                          if (templateNameLower.includes('interativo') || templateNameLower.includes('metabolismo') || templateNameLower.includes('quiz interativo')) {
                            return (
                              <>
                                {etapaPreviewQuiz === 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.'}</p>
                                    <p className="text-blue-600 font-semibold">🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.</p>
                                  </div>
                                )}
                                {etapaPreviewQuiz >= 1 && etapaPreviewQuiz <= 6 && (
                                  <div className="space-y-6">
                                    {etapaPreviewQuiz === 1 && (
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-3">🕐 1. Como é seu nível de energia ao longo do dia?</h4>
                                        <div className="space-y-2">
                                          {['Vivo cansado, mesmo dormindo bem', 'Tenho altos e baixos', 'Energia constante o dia inteiro'].map((opcao) => (
                                            <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                              <input type="radio" name="energia-dia" className="mr-3" disabled />
                                              <span className="text-gray-700">{opcao}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {[2, 3, 4, 5, 6].map((num) => {
                                      const perguntas = [
                                        { titulo: '🍽️ 2. Como costuma ser sua fome?', opcoes: ['Forte, com vontade de comer o tempo todo', 'Varia conforme o dia', 'Como de forma leve, sem exagerar'] },
                                        { titulo: '💧 3. Quanta água você costuma beber por dia?', opcoes: ['Quase nenhuma', 'Mais ou menos 1 litro', 'Sempre carrego minha garrafinha'] },
                                        { titulo: '💤 4. Como anda a qualidade do seu sono?', opcoes: ['Péssima, acordo cansado', 'Regular, depende do dia', 'Durmo bem e acordo disposto'] },
                                        { titulo: '🏃‍♂️ 5. Você pratica atividade física com qual frequência?', opcoes: ['Quase nunca', '2 a 3 vezes por semana', 'Quase todos os dias'] },
                                        { titulo: '⚖️ 6. Qual dessas opções melhor descreve você?', opcoes: ['Tenho dificuldade em perder peso', 'Mantenho o peso com esforço', 'Emagreço facilmente'] }
                                      ]
                                      const pergunta = perguntas[num - 2]
                                      return etapaPreviewQuiz === num ? (
                                        <div key={num} className={`bg-${['green', 'purple', 'orange', 'red', 'indigo'][num - 2]}-50 p-4 rounded-lg`}>
                                          <h4 className={`font-semibold text-${['green', 'purple', 'orange', 'red', 'indigo'][num - 2]}-900 mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-${num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    })}
                                  </div>
                                )}
                                {etapaPreviewQuiz === 7 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                                    {[
                                      { titulo: '🐌 Metabolismo Lento', pontos: '6-9 pontos', cor: 'blue', diagnostico: 'Seu metabolismo está em modo de economia energética, sinalizando necessidade de revitalização personalizada', causaRaiz: 'Falta de nutrientes essenciais e horários irregulares de refeições podem estar reduzindo sua energia e disposição. Estudos indicam que 68% das pessoas com metabolismo lento apresentam carências nutricionais não identificadas. Uma avaliação completa identifica exatamente onde está o desequilíbrio', acaoImediata: 'Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única', plano7Dias: 'Protocolo inicial focado em reequilíbrio metabólico com horários consistentes e proteína em todas as refeições, ajustado conforme sua resposta individual', suplementacao: 'A necessidade de suplementos só é definida após avaliação completa. Magnésio e B12 costumam ser considerados para suporte energético, mas sempre de acordo com a individualidade biológica', alimentacao: 'Priorize proteínas magras e gorduras boas (abacate, oleaginosas) de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você', proximoPasso: 'Seu metabolismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra em minutos como seu corpo pode responder a um plano personalizado.' },
                                      { titulo: '⚖️ Metabolismo Equilibrado', pontos: '10-13 pontos', cor: 'green', diagnostico: 'Seu metabolismo está estável com potencial de otimização estratégica', causaRaiz: 'Boa base metabólica estabelecida. Pesquisas mostram que pequenos ajustes nutricionais podem elevar a eficiência metabólica em até 15%. Uma análise detalhada mostra exatamente onde ganhar performance', acaoImediata: 'Mantenha hábitos atuais e considere avaliação para identificar microajustes com maior impacto. Às vezes pequenas mudanças personalizadas geram grandes melhorias', plano7Dias: 'Otimização com estratégias de timing nutricional e alimentos funcionais específicos para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte preventivo. Vitaminas e minerais costumam ser considerados, mas apenas após análise do seu caso', alimentacao: 'Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil', proximoPasso: 'Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem potencializar ainda mais sua eficiência metabólica.' },
                                      { titulo: '🚀 Metabolismo Acelerado', pontos: '14-18 pontos', cor: 'yellow', diagnostico: 'Seu metabolismo rápido precisa de estabilização estratégica', causaRaiz: 'Alta queima calórica pode causar desequilíbrios e fadiga quando não há reposição adequada. Uma avaliação completa identifica exatamente como sustentar energia sem oscilações', acaoImediata: 'Aumente frequência de refeições (5-6x/dia) e busque avaliação para um plano que mantenha energia de forma consistente. Evite aumentar calorias de forma desordenada', plano7Dias: 'Estabilização com carboidratos complexos e proteína distribuídos ao longo do dia, ajustado conforme sua resposta individual', suplementacao: 'A necessidade só é definida após avaliação. Creatina e glutamina costumam ser considerados para recuperação, mas sempre conforme sua individualidade biológica', alimentacao: 'Priorize carboidratos complexos combinados a proteína para sustentar energia. Um plano personalizado ajusta quantidades e timing ideais para você', proximoPasso: 'Seu corpo está pedindo estabilização — e você já deu o primeiro passo. O próximo é descobrir como manter energia consistente com apoio personalizado.' }
                                    ].map((resultado) => (
                                      <div key={resultado.titulo} className={`bg-${resultado.cor}-50 rounded-lg p-4 border-2 border-${resultado.cor}-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold text-${resultado.cor}-900`}>{resultado.titulo}</h5>
                                          <span className={`bg-${resultado.cor}-600 text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                          <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                          <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                          <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                          <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                          <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuiz(Math.max(0, etapaPreviewQuiz - 1))} disabled={etapaPreviewQuiz === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6, 7].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', '6', 'Resultados']
                                      return (
                                        <button key={etapa} onClick={() => setEtapaPreviewQuiz(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuiz === etapa ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 7 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                      )
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuiz(Math.min(7, etapaPreviewQuiz + 1))} disabled={etapaPreviewQuiz === 7} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Energético
                          if (templateNameLower.includes('energético') || templateNameLower.includes('energetico') || templateNameLower.includes('energia')) {
                            return (
                              <>
                                {etapaPreviewQuizEnergetico === 0 && (
                                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">⚡ Descubra Seu Perfil Energético Natural em 2 Minutos</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie como seu corpo produz e mantém energia naturalmente — e descubra estratégias personalizadas para otimizar sua vitalidade e performance.'}</p>
                                    <p className="text-yellow-600 font-semibold">🚀 Uma avaliação que pode revolucionar sua energia e disposição.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizEnergetico >= 1 && etapaPreviewQuizEnergetico <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { titulo: '🌅 1. Como você se sente ao acordar pela manhã?', opcoes: ['Cansado, preciso de café para funcionar', 'Normal, mas preciso de um tempo para despertar', 'Energizado e pronto para o dia'], cor: 'yellow' },
                                      { titulo: '⚡ 2. Como está seu nível de energia durante o dia?', opcoes: ['Baixo, me sinto sempre cansado', 'Variável, tenho altos e baixos', 'Alto e constante durante o dia'], cor: 'orange' },
                                      { titulo: '💪 3. Como você se sente após atividades físicas?', opcoes: ['Exausto, preciso de muito tempo para recuperar', 'Cansado, mas recupero em algumas horas', 'Bem, com energia renovada'], cor: 'red' },
                                      { titulo: '🍽️ 4. Como sua energia muda após as refeições?', opcoes: ['Cai muito, me sinto sonolento', 'Fica estável', 'Aumenta, me sinto mais ativo'], cor: 'purple' },
                                      { titulo: '😴 5. Como está a qualidade do seu sono?', opcoes: ['Ruim, acordo cansado', 'Regular, mas não sempre reparador', 'Excelente, acordo renovado'], cor: 'indigo' }
                                    ].map((pergunta, idx) => (
                                      etapaPreviewQuizEnergetico === idx + 1 ? (
                                        <div key={idx} className={`bg-${pergunta.cor}-50 p-4 rounded-lg`}>
                                          <h4 className={`font-semibold text-${pergunta.cor}-900 mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`energetico-${idx}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizEnergetico === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                                    {[
                                      { titulo: '📉 Energia Baixa', pontos: '5-8 pontos', cor: 'red', diagnostico: 'Baixa energia natural que precisa de revitalização personalizada', causaRaiz: 'Deficiências nutricionais ou desequilíbrios metabólicos podem estar afetando sua produção energética. Pesquisas mostram que 68% das pessoas com baixa energia têm carências nutricionais não identificadas. Uma avaliação completa identifica exatamente o que está impactando sua vitalidade', acaoImediata: 'Busque avaliação nutricional para receber um protocolo energético seguro e adequado ao seu perfil. Evite auto-suplementação — carências específicas precisam ser identificadas primeiro', plano7Dias: 'Protocolo energético inicial personalizado, ajustado ao seu perfil metabólico e rotina, com foco em carboidratos complexos e proteínas distribuídas', suplementacao: 'A necessidade só é definida após avaliação completa. Suporte a energia celular costuma ser considerado, mas sempre de acordo com a individualidade biológica', alimentacao: 'Um plano alimentar energético personalizado considera suas preferências. Aumente carboidratos complexos e proteínas de forma estratégica enquanto aguarda sua avaliação', proximoPasso: 'Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra como seu corpo pode recuperar energia com apoio personalizado.' },
                                      { titulo: '⚡ Energia Moderada', pontos: '9-12 pontos', cor: 'yellow', diagnostico: 'Energia moderada que pode ser otimizada com estratégias personalizadas', causaRaiz: 'Boa base energética estabelecida, mas ajustes nutricionais específicos podem elevar sua vitalidade significativamente. Estudos indicam que otimizações estratégicas podem aumentar energia em até 35%. Uma análise detalhada mostra exatamente onde ganhar performance', acaoImediata: 'Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing nutricional que potencializam energia. Às vezes pequenos ajustes geram grandes melhorias', plano7Dias: 'Otimização energética com timing nutricional estratégico específico para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e ômega-3 costumam ser considerados, mas a dosagem é personalizada após análise do seu caso', alimentacao: 'Mantenha padrão atual e otimize horários e combinações alimentares. Um plano otimizado considera estratégias específicas para maximizar resultados conforme seu perfil', proximoPasso: 'Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem elevar ainda mais sua vitalidade.' },
                                      { titulo: '🚀 Energia Alta', pontos: '13-15 pontos', cor: 'green', diagnostico: 'Excelente energia natural; estratégias avançadas podem potencializar ainda mais', causaRaiz: 'Sistema energético eficiente e nutrição adequada. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para performance superior. Uma avaliação preventiva identifica oportunidades específicas para você', acaoImediata: 'Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam energia a longo prazo', plano7Dias: 'Manutenção energética com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual', alimentacao: 'Mantenha o padrão atual e considere introduzir superalimentos e alimentos funcionais premium para potencializar ainda mais seus resultados', proximoPasso: 'Parabéns! Seu equilíbrio energético é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais sua performance.' }
                                    ].map((resultado) => (
                                      <div key={resultado.titulo} className={`bg-${resultado.cor}-50 rounded-lg p-4 border-2 border-${resultado.cor}-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold text-${resultado.cor}-900`}>{resultado.titulo}</h5>
                                          <span className={`bg-${resultado.cor}-600 text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                          <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                          <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                          <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                          <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                          <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizEnergetico(Math.max(0, etapaPreviewQuizEnergetico - 1))} disabled={etapaPreviewQuizEnergetico === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizEnergetico(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizEnergetico === etapa ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizEnergetico(Math.min(6, etapaPreviewQuizEnergetico + 1))} disabled={etapaPreviewQuizEnergetico === 6} className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz de Perfil Nutricional
                          if (templateNameLower.includes('perfil nutricional') || templateNameLower.includes('perfil-nutricional') || templateNameLower.includes('absorção') || templateNameLower.includes('absorcao')) {
                            return (
                              <>
                                {etapaPreviewQuizPerfil === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🔬 Descubra Seu Perfil de Absorção Nutricional em 2 Minutos</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie como seu corpo está processando e absorvendo os nutrientes essenciais — e descubra estratégias personalizadas para otimizar sua digestão e absorção.'}</p>
                                    <p className="text-green-600 font-semibold">🧬 Uma avaliação que pode revolucionar sua saúde digestiva.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizPerfil >= 1 && etapaPreviewQuizPerfil <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { titulo: '🍽️ 1. Como você se sente após as refeições?', opcoes: ['Cansado, pesado, com sono', 'Normal, sem grandes mudanças', 'Energizado e satisfeito'], cor: 'green' },
                                      { titulo: '💊 2. Como seu corpo reage aos suplementos?', opcoes: ['Não sinto diferença ou tenho desconforto', 'Sinto alguns benefícios ocasionais', 'Sinto benefícios claros e consistentes'], cor: 'orange' },
                                      { titulo: '🚽 3. Como é sua digestão e eliminação?', opcoes: ['Irregular, constipação ou diarreia', 'Normal, mas às vezes irregular', 'Regular e consistente'], cor: 'blue' },
                                      { titulo: '⚡ 4. Como está sua energia ao longo do dia?', opcoes: ['Baixa, com picos e quedas', 'Moderada, estável', 'Alta e constante'], cor: 'purple' },
                                      { titulo: '🧠 5. Como está sua concentração e clareza mental?', opcoes: ['Difícil manter foco, mente nebulosa', 'Boa, mas pode melhorar', 'Excelente foco e clareza'], cor: 'indigo' }
                                    ].map((pergunta, idx) => (
                                      etapaPreviewQuizPerfil === idx + 1 ? (
                                        <div key={idx} className={`bg-${pergunta.cor}-50 p-4 rounded-lg`}>
                                          <h4 className={`font-semibold text-${pergunta.cor}-900 mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`perfil-${idx}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizPerfil === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                                    {[
                                      { titulo: '📉 Absorção Baixa', pontos: '5-8 pontos', cor: 'red', diagnostico: 'Dificuldades de absorção que precisam de intervenção personalizada', causaRaiz: 'Problemas digestivos ou inflamação podem estar reduzindo a absorção de nutrientes. Estudos indicam que 60% das pessoas com absorção baixa têm condições digestivas não identificadas. Uma avaliação completa identifica exatamente a origem e como reverter', acaoImediata: 'Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada caso tem necessidades específicas', plano7Dias: 'Protocolo inicial focado em reparo digestivo e alimentos anti-inflamatórios, com ajustes conforme sua resposta individual', suplementacao: 'A necessidade só é definida após avaliação. Suporte digestivo específico pode ser considerado, mas sempre de acordo com a individualidade biológica', alimentacao: 'Evite alimentos inflamatórios enquanto aguarda sua avaliação. Aumente fibras prebióticas de forma gradual. Um plano personalizado ajusta quantidades e combinações ideais', proximoPasso: 'Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.' },
                                      { titulo: '⚖️ Absorção Moderada', pontos: '9-12 pontos', cor: 'yellow', diagnostico: 'Boa base digestiva, mas pode ser otimizada com estratégias personalizadas', causaRaiz: 'Boa digestão estabelecida, mas timing e combinações podem ser refinados. Pesquisas mostram que otimizações estratégicas podem aumentar absorção em até 30%. Uma análise detalhada mostra exatamente onde ganhar eficiência', acaoImediata: 'Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing que potencializam absorção. Às vezes pequenos ajustes geram grandes melhorias', plano7Dias: 'Otimização com combinações alimentares estratégicas e timing nutricional específico para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas apenas após análise do seu caso', alimentacao: 'Combine nutrientes para melhor absorção (ex.: ferro + vitamina C). Um plano otimizado considera combinações específicas para maximizar resultados conforme seu perfil', proximoPasso: 'Esse é o primeiro passo. O próximo é descobrir como seu corpo pode responder a estratégias avançadas de absorção.' },
                                      { titulo: '🌟 Absorção Otimizada', pontos: '13-15 pontos', cor: 'green', diagnostico: 'Sistema digestivo funcionando bem; estratégias avançadas podem potencializar ainda mais', causaRaiz: 'Sistema digestivo saudável e eficiente. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis superiores. Uma avaliação preventiva identifica oportunidades específicas', acaoImediata: 'Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo', plano7Dias: 'Manutenção com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual', alimentacao: 'Mantenha o padrão atual e considere introduzir superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros', proximoPasso: 'Parabéns! Seu equilíbrio digestivo é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.' }
                                    ].map((resultado) => (
                                      <div key={resultado.titulo} className={`bg-${resultado.cor}-50 rounded-lg p-4 border-2 border-${resultado.cor}-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold text-${resultado.cor}-900`}>{resultado.titulo}</h5>
                                          <span className={`bg-${resultado.cor}-600 text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                          <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                          <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                          <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                          <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                          <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizPerfil(Math.max(0, etapaPreviewQuizPerfil - 1))} disabled={etapaPreviewQuizPerfil === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizPerfil(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizPerfil === etapa ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizPerfil(Math.min(6, etapaPreviewQuizPerfil + 1))} disabled={etapaPreviewQuizPerfil === 6} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Você é mais disciplinado ou emocional com a comida? - Verificar ANTES de diagnósticos genéricos
                          if ((templateNameLower.includes('disciplinado') && templateNameLower.includes('emocional')) || 
                              (templateNameLower.includes('disciplinado') && templateNameLower.includes('comida')) ||
                              (templateNameLower.includes('emocional') && templateNameLower.includes('comida')) ||
                              (templateNameNormalizado.includes('disciplinado') && templateNameNormalizado.includes('emocional'))) {
                            return (
                              <>
                                {etapaPreviewQuizDisciplinadoEmocional === 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🧠 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie se o comportamento alimentar é guiado mais por razão ou emoções — e descubra estratégias personalizadas para equilibrar disciplina e emoção na alimentação.'}</p>
                                    <p className="text-blue-600 font-semibold">⚖️ Uma avaliação que pode transformar sua relação com a comida.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizDisciplinadoEmocional >= 1 && etapaPreviewQuizDisciplinadoEmocional <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '🎯 1. Quando você está sob estresse, como reage à comida?', opcoes: ['Mantenho minha rotina alimentar normalmente', 'Às vezes como mais ou menos do que o normal', 'Sempre como mais, especialmente doces ou petiscos'], cor: 'blue', bg: 'bg-blue-50', textColor: 'text-blue-900' },
                                      { num: 2, titulo: '🍫 2. Como você lida com a vontade de comer algo específico?', opcoes: ['Planejo quando e como vou comer isso', 'Às vezes resisto, às vezes cedo', 'É difícil resistir, geralmente cedo à vontade'], cor: 'purple', bg: 'bg-purple-50', textColor: 'text-purple-900' },
                                      { num: 3, titulo: '📅 3. Você segue um plano alimentar mesmo quando não está motivado?', opcoes: ['Sim, sigo mesmo sem motivação', 'Às vezes sigo, às vezes não', 'Raramente sigo quando não estou motivado'], cor: 'indigo', bg: 'bg-indigo-50', textColor: 'text-indigo-900' },
                                      { num: 4, titulo: '😊 4. Você come para celebrar ou se confortar?', opcoes: ['Raramente, prefiro outras formas de celebrar', 'Às vezes, mas não é minha primeira opção', 'Frequentemente, comida é minha forma de celebrar ou me confortar'], cor: 'pink', bg: 'bg-pink-50', textColor: 'text-pink-900' },
                                      { num: 5, titulo: '⚡ 5. Como você toma decisões alimentares?', opcoes: ['Baseio-me em conhecimento e planejamento', 'Misto de conhecimento e impulso', 'Principalmente por impulso e emoção do momento'], cor: 'cyan', bg: 'bg-cyan-50', textColor: 'text-cyan-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizDisciplinadoEmocional === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-disciplinado-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizDisciplinadoEmocional === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '⚖️ Perfil Disciplinado', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Você tem um perfil predominantemente disciplinado; sua alimentação é guiada principalmente por razão e planejamento', causaRaiz: 'Excelente controle e planejamento alimentar. Você tem uma base sólida de disciplina que pode ser otimizada com estratégias avançadas para manter flexibilidade sem perder controle. Uma avaliação identifica oportunidades para equilibrar disciplina com bem-estar emocional', acaoImediata: 'Continue mantendo sua disciplina e considere uma avaliação para identificar estratégias que permitam flexibilidade sem comprometer seus resultados', plano7Dias: 'Manutenção da disciplina com introdução de estratégias de flexibilidade controlada, personalizadas conforme seu perfil', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para otimizar ainda mais sua disciplina e energia. O protocolo é personalizado', alimentacao: 'Mantenha seu planejamento e considere introduzir momentos de flexibilidade planejada para sustentabilidade a longo prazo', proximoPasso: 'Parabéns pela sua disciplina! Descubra como estratégias avançadas podem potencializar ainda mais seus resultados mantendo equilíbrio.' },
                                      { titulo: '⚖️ Perfil Equilibrado', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Você tem um perfil equilibrado entre disciplina e emoção; há oportunidades para fortalecer ambos os aspectos', causaRaiz: 'Boa base de equilíbrio entre razão e emoção na alimentação. Você pode desenvolver mais consistência e estratégias para fortalecer a disciplina quando necessário, mantendo espaço para flexibilidade. Uma avaliação identifica oportunidades específicas', acaoImediata: 'Continue desenvolvendo seu equilíbrio. Considere uma avaliação para identificar estratégias que fortaleçam sua disciplina sem perder conexão emocional positiva com a comida', plano7Dias: 'Fortalecimento do equilíbrio com estratégias específicas para desenvolver mais consistência e flexibilidade, personalizadas conforme seu perfil', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para otimizar seu equilíbrio e energia. Estratégias personalizadas são definidas após análise', alimentacao: 'Desenvolva estratégias de planejamento que permitam flexibilidade. Um plano equilibrado considera tanto disciplina quanto bem-estar emocional', proximoPasso: 'Seu equilíbrio é uma base sólida. Descubra como estratégias avançadas podem fortalecer ainda mais sua relação com a comida.' },
                                      { titulo: '💭 Perfil Emocional', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Você tem um perfil predominantemente emocional; há oportunidades para desenvolver mais disciplina e controle alimentar', causaRaiz: 'Alimentação guiada principalmente por emoções pode estar impactando seus resultados. Estudos mostram que desenvolver estratégias de disciplina pode melhorar significativamente a relação com a comida. Uma avaliação completa identifica exatamente o que está influenciando suas escolhas e como desenvolver mais controle', acaoImediata: 'Comece a observar os padrões emocionais relacionados à comida. Considere uma avaliação profissional para desenvolver estratégias de disciplina que funcionem para você', plano7Dias: 'Desenvolvimento gradual de disciplina com estratégias práticas para identificar e gerenciar gatilhos emocionais, personalizadas conforme seu perfil', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para melhorar controle e energia. Multivitamínico e estratégias específicas podem ser considerados', alimentacao: 'Comece a manter um diário alimentar e emocional. Observe padrões e desenvolva estratégias de planejamento que funcionem para você', proximoPasso: 'Desenvolver disciplina alimentar é totalmente possível e pode transformar sua relação com a comida. O primeiro passo é buscar orientação profissional.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-blue-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizDisciplinadoEmocional(Math.max(0, etapaPreviewQuizDisciplinadoEmocional - 1))} disabled={etapaPreviewQuizDisciplinadoEmocional === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizDisciplinadoEmocional(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizDisciplinadoEmocional === etapa ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizDisciplinadoEmocional(Math.min(6, etapaPreviewQuizDisciplinadoEmocional + 1))} disabled={etapaPreviewQuizDisciplinadoEmocional === 6} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Você está nutrido ou apenas alimentado? - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('nutrido') || 
                              templateNameLower.includes('alimentado') ||
                              templateNameNormalizado.includes('nutrido') ||
                              templateNameNormalizado.includes('alimentado')) {
                            return (
                              <>
                                {etapaPreviewQuizNutridoAlimentado === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🌱 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra se está nutrido em nível celular ou apenas comendo calorias vazias — e receba orientações personalizadas para otimizar sua nutrição verdadeira.'}</p>
                                    <p className="text-green-600 font-semibold">🔬 Uma avaliação que pode revelar a verdade sobre sua nutrição.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizNutridoAlimentado >= 1 && etapaPreviewQuizNutridoAlimentado <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '🍎 1. Quantas porções de frutas e vegetais você consome por dia?', opcoes: ['Menos de 2 porções', '2-4 porções', '5 ou mais porções'], cor: 'green', bg: 'bg-green-50', textColor: 'text-green-900' },
                                      { num: 2, titulo: '💊 2. Você consome alimentos processados ou ultraprocessados regularmente?', opcoes: ['Raramente, prefiro alimentos naturais', 'Às vezes, mas tento equilibrar', 'Frequentemente, é o que mais como'], cor: 'yellow', bg: 'bg-yellow-50', textColor: 'text-yellow-900' },
                                      { num: 3, titulo: '⚡ 3. Como você se sente ao longo do dia em termos de energia?', opcoes: ['Energia constante e estável', 'Energia varia, mas geralmente boa', 'Sinto cansaço frequente ou picos e quedas'], cor: 'orange', bg: 'bg-orange-50', textColor: 'text-orange-900' },
                                      { num: 4, titulo: '🥗 4. Você consome alimentos ricos em micronutrientes (castanhas, sementes, legumes)?', opcoes: ['Sim, regularmente incluo esses alimentos', 'Às vezes, mas não sempre', 'Raramente, não consumo esses alimentos'], cor: 'teal', bg: 'bg-teal-50', textColor: 'text-teal-900' },
                                      { num: 5, titulo: '🧠 5. Como está sua clareza mental e foco?', opcoes: ['Mente clara e foco excelente', 'Boa clareza, mas às vezes nebulosa', 'Mente nebulosa, difícil manter foco'], cor: 'cyan', bg: 'bg-cyan-50', textColor: 'text-cyan-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizNutridoAlimentado === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-nutrido-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizNutridoAlimentado === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '✅ Bem Nutrido', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Excelente! Você está nutrido em nível celular; sua alimentação fornece nutrientes essenciais de forma adequada', causaRaiz: 'Ótima base nutricional com alimentos ricos em micronutrientes. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para potencializar ainda mais', acaoImediata: 'Parabéns pela sua nutrição! Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo', plano7Dias: 'Manutenção nutricional com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros', suplementacao: 'Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual', alimentacao: 'Mantenha o padrão atual e considere introduzir superalimentos e alimentos funcionais premium para potencializar ainda mais seus resultados', proximoPasso: 'Parabéns! Sua nutrição está excelente. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados e saúde.' },
                                      { titulo: '⚖️ Nutrição Parcial', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Você está parcialmente nutrido; há oportunidades para melhorar a qualidade nutricional da sua alimentação', causaRaiz: 'Boa base nutricional, mas pode faltar micronutrientes específicos ou variedade para otimizar ainda mais sua nutrição. Estudos mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma avaliação identifica exatamente o que pode fazer a diferença', acaoImediata: 'Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias', plano7Dias: 'Otimização nutricional com introdução de alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas a dosagem é personalizada após análise do seu caso', alimentacao: 'Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil', proximoPasso: 'Sua nutrição pode melhorar significativamente com pequenos ajustes. Descubra o que seu corpo realmente precisa para evoluir.' },
                                      { titulo: '📉 Apenas Alimentado', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Você está principalmente alimentado, mas não nutrido; há necessidade de melhorar a qualidade nutricional', causaRaiz: 'Alimentação focada em calorias vazias pode estar deixando você sem nutrientes essenciais. Estudos indicam que 73% das pessoas com esse perfil têm carências nutricionais não identificadas. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua saúde', acaoImediata: 'Priorize a qualidade nutricional da sua alimentação. Considere uma avaliação profissional para identificar carências específicas e receber orientações personalizadas', plano7Dias: 'Protocolo inicial de 7 dias focado em introduzir alimentos ricos em micronutrientes, personalizado conforme seu perfil e rotina atual', suplementacao: 'Uma avaliação identifica necessidades específicas. Multivitamínico, magnésio e ômega-3 são frequentemente considerados, mas sempre de acordo com a individualidade biológica', alimentacao: 'Foque em alimentos naturais e integrais. Um plano alimentar personalizado considera suas preferências enquanto introduz gradualmente alimentos mais nutritivos', proximoPasso: 'Transformar sua alimentação de calorias vazias para nutrição verdadeira é totalmente possível e pode revolucionar sua saúde. O primeiro passo é buscar orientação profissional.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-green-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizNutridoAlimentado(Math.max(0, etapaPreviewQuizNutridoAlimentado - 1))} disabled={etapaPreviewQuizNutridoAlimentado === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizNutridoAlimentado(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizNutridoAlimentado === etapa ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizNutridoAlimentado(Math.min(6, etapaPreviewQuizNutridoAlimentado + 1))} disabled={etapaPreviewQuizNutridoAlimentado === 6} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Você está se alimentando conforme sua rotina? - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('alimentando') && templateNameLower.includes('rotina') ||
                              templateNameNormalizado.includes('alimentando') && templateNameNormalizado.includes('rotina')) {
                            return (
                              <>
                                {etapaPreviewQuizAlimentacaoRotina === 0 && (
                                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">⏰ {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra se sua rotina alimentar está adequada aos horários e demandas — e receba orientações personalizadas para otimizar seu timing nutricional.'}</p>
                                    <p className="text-teal-600 font-semibold">🕐 Uma avaliação que pode sincronizar sua alimentação com sua rotina.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizAlimentacaoRotina >= 1 && etapaPreviewQuizAlimentacaoRotina <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '⏰ 1. Você tem horários regulares para suas refeições?', opcoes: ['Sim, sempre como nos mesmos horários', 'Às vezes, mas nem sempre consigo', 'Não, como quando posso ou quando sinto fome'], cor: 'teal', bg: 'bg-teal-50', textColor: 'text-teal-900' },
                                      { num: 2, titulo: '🍽️ 2. Quantas refeições você faz por dia?', opcoes: ['1-2 refeições', '3-4 refeições', '5-6 refeições'], cor: 'blue', bg: 'bg-blue-50', textColor: 'text-blue-900' },
                                      { num: 3, titulo: '⚡ 3. Você sente fome entre as refeições?', opcoes: ['Raramente, me sinto satisfeito', 'Às vezes sinto fome moderada', 'Frequentemente, sempre estou com fome'], cor: 'cyan', bg: 'bg-cyan-50', textColor: 'text-cyan-900' },
                                      { num: 4, titulo: '🌙 4. Como está sua refeição noturna?', opcoes: ['Janto cedo e não como mais nada', 'Janto moderadamente e às vezes lancho depois', 'Como muito à noite ou bem tarde'], cor: 'indigo', bg: 'bg-indigo-50', textColor: 'text-indigo-900' },
                                      { num: 5, titulo: '🏃 5. Sua alimentação está alinhada com sua rotina de atividades?', opcoes: ['Sim, ajusto conforme minha rotina', 'Às vezes, mas nem sempre', 'Não, minha alimentação não considera minha rotina'], cor: 'purple', bg: 'bg-purple-50', textColor: 'text-purple-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizAlimentacaoRotina === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-rotina-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizAlimentacaoRotina === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '✅ Rotina Alimentar Sincronizada', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Excelente! Sua alimentação está bem sincronizada com sua rotina; horários e quantidades estão adequados', causaRaiz: 'Ótima organização e sincronização entre alimentação e rotina. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e otimizar ainda mais o timing nutricional. Uma avaliação preventiva identifica oportunidades específicas', acaoImediata: 'Parabéns pela sua organização! Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias avançadas de timing nutricional que potencializem ainda mais seus resultados', plano7Dias: 'Manutenção da rotina alimentar com otimizações avançadas de timing nutricional, personalizadas conforme seu perfil e atividades', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte para performance e otimização. O protocolo é personalizado conforme seu nível atual', alimentacao: 'Mantenha sua rotina e considere introduzir estratégias avançadas de timing nutricional que potencializem ainda mais seus resultados', proximoPasso: 'Parabéns! Sua rotina alimentar está excelente. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.' },
                                      { titulo: '⚖️ Rotina Alimentar Parcial', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Sua rotina alimentar está parcialmente sincronizada; há oportunidades para melhorar organização e timing', causaRaiz: 'Boa base de organização, mas pode melhorar a sincronização entre alimentação e rotina. Estudos mostram que otimizações de timing nutricional podem melhorar energia e resultados em até 35%. Uma avaliação identifica exatamente o que pode fazer a diferença', acaoImediata: 'Continue desenvolvendo sua organização alimentar. Considere uma avaliação para identificar estratégias de timing nutricional que funcionem melhor com sua rotina', plano7Dias: 'Otimização da rotina alimentar com estratégias de timing nutricional específicas para seu perfil e rotina diária', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para melhorar energia e organização. Estratégias personalizadas são definidas após análise', alimentacao: 'Desenvolva uma rotina mais estruturada. Um plano otimizado considera seus horários e atividades para maximizar resultados', proximoPasso: 'Sua rotina alimentar pode melhorar significativamente com pequenos ajustes. Descubra como sincronizar melhor sua alimentação com sua rotina.' },
                                      { titulo: '📉 Rotina Alimentar Desorganizada', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Sua rotina alimentar precisa de organização; há necessidade de melhorar timing e sincronização com suas atividades', causaRaiz: 'Falta de organização na rotina alimentar pode estar impactando sua energia e resultados. Estudos indicam que pessoas com rotina alimentar desorganizada têm 50% mais dificuldade em manter hábitos saudáveis. Uma avaliação completa identifica exatamente como reorganizar sua alimentação', acaoImediata: 'Priorize a organização da sua rotina alimentar. Considere uma avaliação profissional para desenvolver estratégias de timing nutricional que funcionem para você', plano7Dias: 'Protocolo inicial de 7 dias focado em estabelecer horários regulares e sincronizar alimentação com rotina, personalizado conforme seu perfil', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para melhorar energia e organização. Multivitamínico e estratégias específicas podem ser considerados', alimentacao: 'Estabeleça horários regulares para refeições. Um plano alimentar personalizado considera sua rotina e ajuda a criar uma estrutura sustentável', proximoPasso: 'Organizar sua rotina alimentar é totalmente possível e pode transformar sua energia e resultados. O primeiro passo é buscar orientação profissional.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-teal-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizAlimentacaoRotina(Math.max(0, etapaPreviewQuizAlimentacaoRotina - 1))} disabled={etapaPreviewQuizAlimentacaoRotina === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizAlimentacaoRotina(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizAlimentacaoRotina === etapa ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizAlimentacaoRotina(Math.min(6, etapaPreviewQuizAlimentacaoRotina + 1))} disabled={etapaPreviewQuizAlimentacaoRotina === 6} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Diagnóstico de Parasitose - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('parasitose') || 
                              templateNameLower.includes('parasita') ||
                              templateNameNormalizado.includes('parasitose') ||
                              templateNameNormalizado.includes('parasita')) {
                            return (
                              <>
                                {etapaPreviewQuizParasitose === 0 && (
                                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🐛 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra se você tem parasitas que estão afetando sua saúde através de uma avaliação de sinais e sintomas comuns.'}</p>
                                    <p className="text-red-600 font-semibold">🔬 Uma avaliação que pode revelar problemas ocultos de saúde.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizParasitose >= 1 && etapaPreviewQuizParasitose <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '😴 1. Você sente cansaço constante mesmo dormindo bem?', opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'], cor: 'red', bg: 'bg-red-50', textColor: 'text-red-900' },
                                      { num: 2, titulo: '🤢 2. Você tem problemas digestivos frequentes?', opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'], cor: 'orange', bg: 'bg-orange-50', textColor: 'text-orange-900' },
                                      { num: 3, titulo: '🍽️ 3. Você sente fome mesmo após comer refeições completas?', opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'], cor: 'yellow', bg: 'bg-yellow-50', textColor: 'text-yellow-900' },
                                      { num: 4, titulo: '💤 4. Você tem problemas de sono ou acorda frequentemente durante a noite?', opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'], cor: 'amber', bg: 'bg-amber-50', textColor: 'text-amber-900' },
                                      { num: 5, titulo: '🧠 5. Você tem dificuldade para manter o foco e concentração?', opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'], cor: 'rose', bg: 'bg-rose-50', textColor: 'text-rose-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizParasitose === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-parasitose-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizParasitose === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '⚠️ Risco Alto de Parasitose', pontos: '18-25 pontos', cor: 'red', diagnostico: 'Sinais indicam possível presença de parasitas; é importante buscar avaliação profissional para diagnóstico preciso', causaRaiz: 'Parasitas podem estar competindo por nutrientes e causando desequilíbrios no organismo. Estudos indicam que até 80% das pessoas podem ter algum tipo de parasitose sem saber. Uma avaliação completa identifica se há necessidade de tratamento específico', acaoImediata: 'Busque avaliação profissional para diagnóstico preciso. Evite auto-tratamento — cada tipo de parasita requer abordagem específica e segura', plano7Dias: 'Protocolo inicial de apoio nutricional enquanto aguarda avaliação profissional, focado em fortalecer sistema imunológico e digestivo', suplementacao: 'A necessidade de antiparasitários só é definida após diagnóstico profissional. Suporte nutricional (probióticos, zinco) pode ser considerado, mas sempre com orientação', alimentacao: 'Evite alimentos crus e mal lavados. Mantenha higiene rigorosa. Um plano nutricional de apoio pode fortalecer defesas naturais', proximoPasso: 'Seu organismo precisa de atenção profissional — descubra como identificar e tratar parasitoses de forma segura e eficaz.' },
                                      { titulo: '⚖️ Risco Moderado', pontos: '10-17 pontos', cor: 'yellow', diagnostico: 'Alguns sinais podem indicar necessidade de investigação; mantenha atenção aos sintomas', causaRaiz: 'Sinais podem estar relacionados a parasitose leve ou outras condições. Uma avaliação profissional ajuda a identificar a causa raiz e definir se há necessidade de tratamento específico', acaoImediata: 'Observe os sintomas e considere avaliação profissional se persistirem. Mantenha hábitos de higiene e alimentação adequados', plano7Dias: 'Protocolo preventivo com foco em fortalecimento do sistema imunológico e digestivo, enquanto monitora sintomas', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte nutricional preventivo. Probióticos podem ser considerados, mas após análise', alimentacao: 'Mantenha higiene rigorosa e evite alimentos crus. Foque em alimentos que fortalecem sistema imunológico', proximoPasso: 'Monitorar sintomas é importante. Descubra como fortalecer suas defesas naturais e quando buscar ajuda profissional.' },
                                      { titulo: '✅ Risco Baixo', pontos: '5-9 pontos', cor: 'green', diagnostico: 'Poucos sinais indicativos; mantenha hábitos preventivos e monitore sua saúde', causaRaiz: 'Boa saúde digestiva e sistema imunológico funcionando adequadamente. Manter hábitos preventivos ajuda a preservar essa condição ideal', acaoImediata: 'Continue mantendo hábitos de higiene e alimentação adequados. Considere avaliação preventiva para manter saúde digestiva', plano7Dias: 'Manutenção preventiva com foco em fortalecimento contínuo do sistema imunológico e digestivo', suplementacao: 'Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Probióticos podem ser considerados preventivamente', alimentacao: 'Mantenha padrão atual com foco em higiene e alimentos que fortalecem sistema imunológico. Continue boas práticas', proximoPasso: 'Parabéns! Seu risco é baixo. Descubra como estratégias preventivas podem manter sua saúde digestiva e imunológica em ótimo estado.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-red-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizParasitose(Math.max(0, etapaPreviewQuizParasitose - 1))} disabled={etapaPreviewQuizParasitose === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizParasitose(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizParasitose === etapa ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizParasitose(Math.min(6, etapaPreviewQuizParasitose + 1))} disabled={etapaPreviewQuizParasitose === 6} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Ganhos e Prosperidade - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('ganhos') || 
                              templateNameLower.includes('prosperidade') ||
                              templateNameNormalizado.includes('ganhos') ||
                              templateNameNormalizado.includes('prosperidade')) {
                            return (
                              <>
                                {etapaPreviewQuizGanhos === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">💰 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie se o estilo de vida permite ganhar mais — e descubra estratégias para aumentar prosperidade e resultados financeiros.'}</p>
                                    <p className="text-green-600 font-semibold">💎 Uma avaliação que pode transformar sua relação com ganhos e prosperidade.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizGanhos >= 1 && etapaPreviewQuizGanhos <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '💵 1. Você sente que seu estilo de vida está limitando seus ganhos?', opcoes: ['Não, estou satisfeito com meus ganhos', 'Às vezes, sinto que poderia ganhar mais', 'Sim, sinto que estou sendo limitado'], cor: 'green', bg: 'bg-green-50', textColor: 'text-green-900' },
                                      { num: 2, titulo: '📈 2. Você investe em seu desenvolvimento profissional regularmente?', opcoes: ['Sim, invisto constantemente', 'Às vezes, quando posso', 'Raramente, não tenho recursos'], cor: 'emerald', bg: 'bg-emerald-50', textColor: 'text-emerald-900' },
                                      { num: 3, titulo: '🎯 3. Você tem clareza sobre seus objetivos financeiros?', opcoes: ['Sim, tenho objetivos claros e planos', 'Tenho algumas ideias, mas não planos', 'Não, vivo sem planejamento financeiro'], cor: 'teal', bg: 'bg-teal-50', textColor: 'text-teal-900' },
                                      { num: 4, titulo: '⚡ 4. Você aproveita oportunidades que surgem para aumentar ganhos?', opcoes: ['Sim, sempre aproveito oportunidades', 'Às vezes, dependendo da situação', 'Raramente, tenho medo de arriscar'], cor: 'cyan', bg: 'bg-cyan-50', textColor: 'text-cyan-900' },
                                      { num: 5, titulo: '🌱 5. Você acredita que pode aumentar sua prosperidade?', opcoes: ['Sim, tenho certeza que posso', 'Acredito que talvez possa', 'Não, acho que está limitado'], cor: 'lime', bg: 'bg-lime-50', textColor: 'text-lime-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizGanhos === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-ganhos-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizGanhos === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '💰 Alta Prosperidade', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Excelente! Você tem um estilo de vida que favorece ganhos e prosperidade; há potencial para otimizar ainda mais', causaRaiz: 'Boa base de mentalidade e hábitos que favorecem prosperidade. Estratégias avançadas podem potencializar ainda mais seus resultados. Uma avaliação identifica oportunidades específicas para maximizar ganhos', acaoImediata: 'Continue mantendo seus hábitos e considere uma avaliação para identificar estratégias avançadas que podem elevar ainda mais sua prosperidade', plano7Dias: 'Otimização de estratégias de ganhos com foco em oportunidades específicas identificadas na avaliação, personalizadas conforme seu perfil', suplementacao: 'Mentalidade de prosperidade não requer suplementos, mas hábitos e estratégias específicas podem ser otimizados', alimentacao: 'Mantenha hábitos que favorecem energia e clareza mental para tomar melhores decisões financeiras', proximoPasso: 'Parabéns! Sua prosperidade está em ótimo caminho. Descubra como estratégias avançadas podem potencializar ainda mais seus ganhos.' },
                                      { titulo: '⚖️ Prosperidade Moderada', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Boa base de prosperidade; há oportunidades para desenvolver mais estratégias e mentalidade de ganhos', causaRaiz: 'Você tem uma base sólida, mas pode desenvolver mais estratégias específicas. Uma avaliação identifica exatamente onde focar para aumentar prosperidade', acaoImediata: 'Continue desenvolvendo sua mentalidade de prosperidade. Considere uma avaliação para identificar estratégias específicas que podem elevar seus ganhos', plano7Dias: 'Desenvolvimento de estratégias de prosperidade com foco em áreas específicas identificadas na avaliação', suplementacao: 'Mentalidade e estratégias são o foco; não há necessidade de suplementos específicos', alimentacao: 'Mantenha hábitos que favorecem energia e foco para aplicar estratégias de prosperidade', proximoPasso: 'Sua prosperidade pode crescer significativamente. Descubra estratégias específicas para elevar seus ganhos.' },
                                      { titulo: '📉 Prosperidade Limitada', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Seu estilo de vida pode estar limitando seus ganhos; há necessidade de desenvolver mentalidade e estratégias de prosperidade', causaRaiz: 'Crenças limitantes ou falta de estratégias podem estar impedindo prosperidade. Estudos mostram que mentalidade de prosperidade pode aumentar ganhos em até 40%. Uma avaliação completa identifica exatamente o que está limitando e como desenvolver prosperidade', acaoImediata: 'Comece a desenvolver mentalidade de prosperidade. Considere uma avaliação profissional para identificar estratégias específicas que funcionem para você', plano7Dias: 'Protocolo inicial de desenvolvimento de mentalidade e estratégias de prosperidade, personalizado conforme seu perfil', suplementacao: 'Mentalidade é o foco principal; não há necessidade de suplementos específicos', alimentacao: 'Desenvolva hábitos que favorecem energia e clareza mental para aplicar estratégias de prosperidade', proximoPasso: 'Desenvolver prosperidade é totalmente possível. Descubra como transformar crenças limitantes em estratégias de ganhos.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-green-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizGanhos(Math.max(0, etapaPreviewQuizGanhos - 1))} disabled={etapaPreviewQuizGanhos === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizGanhos(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizGanhos === etapa ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizGanhos(Math.min(6, etapaPreviewQuizGanhos + 1))} disabled={etapaPreviewQuizGanhos === 6} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Potencial e Crescimento - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('potencial') || 
                              templateNameLower.includes('crescimento') ||
                              templateNameNormalizado.includes('potencial') ||
                              templateNameNormalizado.includes('crescimento')) {
                            return (
                              <>
                                {etapaPreviewQuizPotencial === 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🚀 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra se o potencial está sendo bem aproveitado — e receba orientações para maximizar crescimento e desenvolvimento.'}</p>
                                    <p className="text-blue-600 font-semibold">📈 Uma avaliação que pode revelar seu verdadeiro potencial de crescimento.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizPotencial >= 1 && etapaPreviewQuizPotencial <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '🎯 1. Você sente que está aproveitando todo seu potencial?', opcoes: ['Sim, estou no meu máximo', 'Às vezes, mas sinto que posso mais', 'Não, sinto que estou abaixo do meu potencial'], cor: 'blue', bg: 'bg-blue-50', textColor: 'text-blue-900' },
                                      { num: 2, titulo: '📚 2. Você investe tempo em aprendizado e desenvolvimento?', opcoes: ['Sim, constantemente', 'Às vezes, quando tenho tempo', 'Raramente, não tenho tempo'], cor: 'indigo', bg: 'bg-indigo-50', textColor: 'text-indigo-900' },
                                      { num: 3, titulo: '💪 3. Você busca desafios que o fazem crescer?', opcoes: ['Sim, sempre busco desafios', 'Às vezes, quando me sinto confiante', 'Raramente, prefiro o conforto'], cor: 'purple', bg: 'bg-purple-50', textColor: 'text-purple-900' },
                                      { num: 4, titulo: '🔄 4. Você está aberto a mudanças e novas oportunidades?', opcoes: ['Sim, sempre aberto', 'Depende da situação', 'Não, prefiro estabilidade'], cor: 'violet', bg: 'bg-violet-50', textColor: 'text-violet-900' },
                                      { num: 5, titulo: '🌟 5. Você acredita que pode crescer ainda mais?', opcoes: ['Sim, tenho certeza', 'Acredito que talvez possa', 'Não, acho que já cheguei no limite'], cor: 'fuchsia', bg: 'bg-fuchsia-50', textColor: 'text-fuchsia-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizPotencial === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-potencial-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizPotencial === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '🚀 Potencial Máximo', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Excelente! Você está aproveitando bem seu potencial; há oportunidades para otimizar ainda mais o crescimento', causaRaiz: 'Boa base de mentalidade de crescimento e desenvolvimento. Estratégias avançadas podem potencializar ainda mais seus resultados. Uma avaliação identifica oportunidades específicas para maximizar crescimento', acaoImediata: 'Continue mantendo seus hábitos de crescimento. Considere uma avaliação para identificar estratégias avançadas que podem elevar ainda mais seu potencial', plano7Dias: 'Otimização de estratégias de crescimento com foco em áreas específicas identificadas na avaliação, personalizadas conforme seu perfil', suplementacao: 'Desenvolvimento pessoal não requer suplementos, mas hábitos e estratégias específicas podem ser otimizados', alimentacao: 'Mantenha hábitos que favorecem energia e clareza mental para maximizar crescimento', proximoPasso: 'Parabéns! Seu potencial está sendo bem aproveitado. Descubra como estratégias avançadas podem potencializar ainda mais seu crescimento.' },
                                      { titulo: '⚖️ Potencial Moderado', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Bom aproveitamento do potencial; há oportunidades para desenvolver mais estratégias de crescimento', causaRaiz: 'Você tem uma base sólida, mas pode desenvolver mais estratégias específicas. Uma avaliação identifica exatamente onde focar para maximizar crescimento', acaoImediata: 'Continue desenvolvendo seu potencial. Considere uma avaliação para identificar estratégias específicas que podem elevar seu crescimento', plano7Dias: 'Desenvolvimento de estratégias de crescimento com foco em áreas específicas identificadas na avaliação', suplementacao: 'Desenvolvimento pessoal é o foco; não há necessidade de suplementos específicos', alimentacao: 'Mantenha hábitos que favorecem energia e foco para aplicar estratégias de crescimento', proximoPasso: 'Seu potencial pode crescer significativamente. Descubra estratégias específicas para maximizar seu desenvolvimento.' },
                                      { titulo: '📉 Potencial Subutilizado', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Seu potencial pode estar subutilizado; há necessidade de desenvolver mentalidade e estratégias de crescimento', causaRaiz: 'Crenças limitantes ou falta de estratégias podem estar impedindo crescimento. Estudos mostram que mentalidade de crescimento pode aumentar resultados em até 50%. Uma avaliação completa identifica exatamente o que está limitando e como desenvolver potencial', acaoImediata: 'Comece a desenvolver mentalidade de crescimento. Considere uma avaliação profissional para identificar estratégias específicas que funcionem para você', plano7Dias: 'Protocolo inicial de desenvolvimento de mentalidade e estratégias de crescimento, personalizado conforme seu perfil', suplementacao: 'Desenvolvimento pessoal é o foco principal; não há necessidade de suplementos específicos', alimentacao: 'Desenvolva hábitos que favorecem energia e clareza mental para aplicar estratégias de crescimento', proximoPasso: 'Desenvolver seu potencial é totalmente possível. Descubra como transformar limitações em oportunidades de crescimento.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-blue-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizPotencial(Math.max(0, etapaPreviewQuizPotencial - 1))} disabled={etapaPreviewQuizPotencial === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizPotencial(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizPotencial === etapa ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizPotencial(Math.min(6, etapaPreviewQuizPotencial + 1))} disabled={etapaPreviewQuizPotencial === 6} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Propósito e Equilíbrio - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('propósito') || 
                              templateNameLower.includes('proposito') ||
                              templateNameLower.includes('equilíbrio') ||
                              templateNameLower.includes('equilibrio') ||
                              templateNameNormalizado.includes('proposito') ||
                              templateNameNormalizado.includes('equilibrio')) {
                            return (
                              <>
                                {etapaPreviewQuizProposito === 0 && (
                                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">⭐ {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Descubra se o dia a dia está alinhado com seus sonhos — e receba orientações para encontrar propósito e equilíbrio na vida.'}</p>
                                    <p className="text-purple-600 font-semibold">✨ Uma avaliação que pode revelar o alinhamento entre seus sonhos e realidade.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizProposito >= 1 && etapaPreviewQuizProposito <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '🎯 1. Você sente que seu dia a dia está alinhado com seus sonhos?', opcoes: ['Sim, totalmente alinhado', 'Às vezes, mas nem sempre', 'Não, sinto que estou distante'], cor: 'purple', bg: 'bg-purple-50', textColor: 'text-purple-900' },
                                      { num: 2, titulo: '⚖️ 2. Você consegue equilibrar trabalho, vida pessoal e sonhos?', opcoes: ['Sim, consigo equilibrar bem', 'Às vezes, mas é desafiador', 'Não, sinto desequilíbrio constante'], cor: 'pink', bg: 'bg-pink-50', textColor: 'text-pink-900' },
                                      { num: 3, titulo: '💫 3. Você tem clareza sobre seu propósito de vida?', opcoes: ['Sim, tenho clareza total', 'Tenho algumas ideias, mas não certeza', 'Não, ainda estou buscando'], cor: 'fuchsia', bg: 'bg-fuchsia-50', textColor: 'text-fuchsia-900' },
                                      { num: 4, titulo: '🌅 4. Você dedica tempo para atividades que te realizam?', opcoes: ['Sim, regularmente', 'Às vezes, quando posso', 'Raramente, não tenho tempo'], cor: 'rose', bg: 'bg-rose-50', textColor: 'text-rose-900' },
                                      { num: 5, titulo: '🌟 5. Você acredita que pode viver com mais propósito e equilíbrio?', opcoes: ['Sim, tenho certeza', 'Acredito que talvez possa', 'Não, acho que é difícil'], cor: 'violet', bg: 'bg-violet-50', textColor: 'text-violet-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizProposito === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-proposito-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizProposito === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '⭐ Propósito e Equilíbrio Alinhados', pontos: '15-20 pontos', cor: 'green', diagnostico: 'Excelente! Seu dia a dia está bem alinhado com seus sonhos; há oportunidades para otimizar ainda mais propósito e equilíbrio', causaRaiz: 'Boa base de alinhamento entre sonhos e realidade. Estratégias avançadas podem potencializar ainda mais seus resultados. Uma avaliação identifica oportunidades específicas para maximizar propósito e equilíbrio', acaoImediata: 'Continue mantendo seu alinhamento. Considere uma avaliação para identificar estratégias avançadas que podem elevar ainda mais propósito e equilíbrio', plano7Dias: 'Otimização de estratégias de propósito e equilíbrio com foco em áreas específicas identificadas na avaliação, personalizadas conforme seu perfil', suplementacao: 'Bem-estar e propósito não requerem suplementos, mas hábitos e estratégias específicas podem ser otimizados', alimentacao: 'Mantenha hábitos que favorecem energia e bem-estar para viver com propósito e equilíbrio', proximoPasso: 'Parabéns! Seu propósito e equilíbrio estão bem alinhados. Descubra como estratégias avançadas podem potencializar ainda mais sua realização.' },
                                      { titulo: '⚖️ Propósito e Equilíbrio Parciais', pontos: '10-14 pontos', cor: 'yellow', diagnostico: 'Bom alinhamento; há oportunidades para desenvolver mais estratégias de propósito e equilíbrio', causaRaiz: 'Você tem uma base sólida, mas pode desenvolver mais estratégias específicas. Uma avaliação identifica exatamente onde focar para maximizar propósito e equilíbrio', acaoImediata: 'Continue desenvolvendo seu propósito e equilíbrio. Considere uma avaliação para identificar estratégias específicas que podem elevar seu alinhamento', plano7Dias: 'Desenvolvimento de estratégias de propósito e equilíbrio com foco em áreas específicas identificadas na avaliação', suplementacao: 'Bem-estar é o foco; não há necessidade de suplementos específicos', alimentacao: 'Mantenha hábitos que favorecem energia e bem-estar para aplicar estratégias de propósito e equilíbrio', proximoPasso: 'Seu propósito e equilíbrio podem melhorar significativamente. Descubra estratégias específicas para maximizar alinhamento.' },
                                      { titulo: '📉 Desalinhamento de Propósito', pontos: '5-9 pontos', cor: 'red', diagnostico: 'Seu dia a dia pode estar desalinhado com seus sonhos; há necessidade de desenvolver propósito e equilíbrio', causaRaiz: 'Falta de clareza ou estratégias podem estar impedindo alinhamento. Estudos mostram que pessoas com propósito claro têm 60% mais satisfação na vida. Uma avaliação completa identifica exatamente o que está desalinhado e como desenvolver propósito', acaoImediata: 'Comece a desenvolver clareza sobre seu propósito. Considere uma avaliação profissional para identificar estratégias específicas que funcionem para você', plano7Dias: 'Protocolo inicial de desenvolvimento de propósito e equilíbrio, personalizado conforme seu perfil e sonhos', suplementacao: 'Bem-estar e propósito são o foco principal; não há necessidade de suplementos específicos', alimentacao: 'Desenvolva hábitos que favorecem energia e bem-estar para aplicar estratégias de propósito e equilíbrio', proximoPasso: 'Desenvolver propósito e equilíbrio é totalmente possível. Descubra como alinhar seus sonhos com sua realidade diária.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizProposito(Math.max(0, etapaPreviewQuizProposito - 1))} disabled={etapaPreviewQuizProposito === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizProposito(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizProposito === etapa ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizProposito(Math.min(6, etapaPreviewQuizProposito + 1))} disabled={etapaPreviewQuizProposito === 6} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Você Conhece o Seu Corpo? - Verificar ANTES de diagnósticos genéricos
                          if (templateNameLower.includes('você conhece') || 
                              templateNameLower.includes('voce conhece') ||
                              templateNameLower.includes('conhece seu corpo') ||
                              templateNameNormalizado.includes('voce conhece seu corpo') ||
                              templateNameNormalizado.includes('conhece seu corpo')) {
                            return (
                              <>
                                {etapaPreviewQuizConheceCorpo === 0 && (
                                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🧠 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie seu nível de autoconhecimento corporal e nutricional através de perguntas estratégicas e descubra oportunidades para melhorar sua relação com seu corpo.'}</p>
                                    <p className="text-purple-600 font-semibold">✨ Uma avaliação que pode transformar seu autoconhecimento sobre saúde e bem-estar.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizConheceCorpo >= 1 && etapaPreviewQuizConheceCorpo <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { num: 1, titulo: '🔍 1. Você consegue identificar quando seu corpo está pedindo água?', opcoes: ['Raramente, só quando estou com muita sede', 'Às vezes, percebo alguns sinais', 'Sim, reconheço os sinais de desidratação'], cor: 'purple', bg: 'bg-purple-50', textColor: 'text-purple-900' },
                                      { num: 2, titulo: '💪 2. Você percebe como seu corpo responde a diferentes tipos de alimentos?', opcoes: ['Não, como tudo sem perceber diferenças', 'Às vezes, noto algumas reações', 'Sim, sei exatamente o que me faz bem ou mal'], cor: 'pink', bg: 'bg-pink-50', textColor: 'text-pink-900' },
                                      { num: 3, titulo: '⚡ 3. Você identifica quando está com fome física vs. fome emocional?', opcoes: ['Não, não sei diferenciar', 'Às vezes, mas não sempre', 'Sim, consigo distinguir claramente'], cor: 'indigo', bg: 'bg-indigo-50', textColor: 'text-indigo-900' },
                                      { num: 4, titulo: '😴 4. Você percebe como seu sono afeta sua energia e disposição?', opcoes: ['Não, não noto conexão', 'Às vezes, percebo alguma relação', 'Sim, sei exatamente como o sono me afeta'], cor: 'cyan', bg: 'bg-cyan-50', textColor: 'text-cyan-900' },
                                      { num: 5, titulo: '🧘 5. Você consegue identificar sinais de estresse ou sobrecarga no seu corpo?', opcoes: ['Não, não reconheço esses sinais', 'Às vezes, percebo alguns sinais', 'Sim, reconheço os sinais e ajusto minha rotina'], cor: 'teal', bg: 'bg-teal-50', textColor: 'text-teal-900' }
                                    ].map((pergunta) => (
                                      etapaPreviewQuizConheceCorpo === pergunta.num ? (
                                        <div key={pergunta.num} className={`${pergunta.bg} p-4 rounded-lg`}>
                                          <h4 className={`font-semibold ${pergunta.textColor} mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`pergunta-conhece-${pergunta.num}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizConheceCorpo === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '📉 Autoconhecimento Inicial', pontos: '5-10 pontos', cor: 'red', diagnostico: 'Seu autoconhecimento corporal está em desenvolvimento inicial; há oportunidades para melhorar sua conexão com seu corpo', causaRaiz: 'Falta de atenção aos sinais corporais pode estar impedindo você de otimizar sua saúde. Estudos mostram que pessoas com maior autoconhecimento corporal têm 60% mais sucesso em manter hábitos saudáveis. Uma avaliação completa ajuda a desenvolver essa consciência', acaoImediata: 'Comece a observar mais atentamente os sinais do seu corpo. Considere uma avaliação profissional para aprender a interpretar melhor esses sinais e desenvolver maior autoconsciência', plano7Dias: 'Prática diária de observação corporal e registro de sinais, com orientações específicas para desenvolver autoconhecimento gradual', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para melhorar consciência corporal. Nem sempre são necessários suplementos, mas a avaliação define isso', alimentacao: 'Comece a manter um diário alimentar e de sinais corporais. Observe como diferentes alimentos e situações afetam seu corpo e energia', proximoPasso: 'Seu autoconhecimento pode melhorar significativamente com prática e orientação profissional. O primeiro passo é começar a observar mais.' },
                                      { titulo: '⚖️ Autoconhecimento Moderado', pontos: '11-15 pontos', cor: 'yellow', diagnostico: 'Bom nível de autoconhecimento; estratégias avançadas podem elevar ainda mais sua consciência corporal', causaRaiz: 'Você já tem uma boa base de autoconhecimento, mas pode desenvolver mais profundidade. Estudos indicam que pessoas com autoconhecimento moderado podem evoluir para níveis avançados com estratégias específicas. Uma avaliação identifica oportunidades específicas', acaoImediata: 'Continue desenvolvendo sua consciência corporal. Considere uma avaliação para identificar estratégias avançadas que podem elevar seu autoconhecimento para o próximo nível', plano7Dias: 'Estratégias avançadas de autoconhecimento com técnicas específicas para aprofundar sua consciência corporal e nutricional', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte para otimizar ainda mais sua consciência corporal. Estratégias personalizadas são definidas após análise', alimentacao: 'Aprofunde sua observação sobre como diferentes estratégias nutricionais afetam seu corpo. Um plano avançado considera essas observações', proximoPasso: 'Seu autoconhecimento já está bom, mas pode evoluir ainda mais. Descubra estratégias avançadas para potencializar sua consciência corporal.' },
                                      { titulo: '✅ Autoconhecimento Avançado', pontos: '16-20 pontos', cor: 'green', diagnostico: 'Excelente autoconhecimento corporal! Estratégias de manutenção e otimização podem potencializar ainda mais', causaRaiz: 'Você tem um alto nível de autoconhecimento corporal, o que é uma base excelente para otimizações. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas', acaoImediata: 'Parabéns pelo seu autoconhecimento! Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias avançadas que sustentam e potencializam seus resultados', plano7Dias: 'Manutenção e otimização com estratégias avançadas de autoconhecimento, personalizadas conforme seu perfil e nível atual', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte para performance e otimização. O protocolo é personalizado conforme seu nível atual', alimentacao: 'Mantenha suas práticas de observação e considere introduzir estratégias nutricionais avançadas que potencializem ainda mais seu autoconhecimento', proximoPasso: 'Parabéns! Seu autoconhecimento é um diferencial. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados e saúde.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizConheceCorpo(Math.max(0, etapaPreviewQuizConheceCorpo - 1))} disabled={etapaPreviewQuizConheceCorpo === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizConheceCorpo(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizConheceCorpo === etapa ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizConheceCorpo(Math.min(6, etapaPreviewQuizConheceCorpo + 1))} disabled={etapaPreviewQuizConheceCorpo === 6} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Quiz Detox
                          if (templateNameLower.includes('detox')) {
                            return (
                              <>
                                {etapaPreviewQuizDetox === 0 && (
                                  <div className="bg-gradient-to-r from-green-50 to-red-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🧽 Descubra Seu Nível de Toxicidade em 2 Minutos</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie sinais de acúmulo tóxico no seu corpo — e descubra estratégias personalizadas para eliminar toxinas e revitalizar sua saúde.'}</p>
                                    <p className="text-green-600 font-semibold">🔥 Uma avaliação que pode transformar sua saúde completamente.</p>
                                  </div>
                                )}
                                {etapaPreviewQuizDetox >= 1 && etapaPreviewQuizDetox <= 5 && (
                                  <div className="space-y-6">
                                    {[
                                      { titulo: '🍽️ 1. Como você se sente após comer alimentos processados?', opcoes: ['Normal, sem diferença', 'Leve desconforto ou peso', 'Cansaço, inchaço ou mal-estar'], cor: 'green' },
                                      { titulo: '🌍 2. Como você se sente em ambientes poluídos?', opcoes: ['Normal, sem problemas', 'Leve irritação ou cansaço', 'Dor de cabeça, irritação ou falta de ar'], cor: 'orange' },
                                      { titulo: '💧 3. Como está sua hidratação e eliminação?', opcoes: ['Bebo água regularmente e elimino bem', 'Bebo água ocasionalmente, eliminação normal', 'Pouca água, constipação ou retenção'], cor: 'blue' },
                                      { titulo: '😴 4. Como está seu sono e recuperação?', opcoes: ['Durmo bem e acordo renovado', 'Sono regular, mas às vezes cansado', 'Sono ruim, acordo cansado e sem energia'], cor: 'purple' },
                                      { titulo: '🧠 5. Como está sua clareza mental e foco?', opcoes: ['Mente clara e foco excelente', 'Boa clareza, mas às vezes nebulosa', 'Mente nebulosa, difícil manter foco'], cor: 'indigo' }
                                    ].map((pergunta, idx) => (
                                      etapaPreviewQuizDetox === idx + 1 ? (
                                        <div key={idx} className={`bg-${pergunta.cor}-50 p-4 rounded-lg`}>
                                          <h4 className={`font-semibold text-${pergunta.cor}-900 mb-3`}>{pergunta.titulo}</h4>
                                          <div className="space-y-2">
                                            {pergunta.opcoes.map((opcao) => (
                                              <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                                <input type="radio" name={`detox-${idx}`} className="mr-3" disabled />
                                                <span className="text-gray-700">{opcao}</span>
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {etapaPreviewQuizDetox === 6 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                                    {[
                                      { titulo: '🛡️ Baixa Toxicidade', pontos: '5-8 pontos', cor: 'green', diagnostico: 'Baixa carga tóxica mantendo boa saúde; estratégias preventivas podem preservar essa condição', causaRaiz: 'Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas', acaoImediata: 'Continue hábitos atuais e considere avaliação preventiva para introduzir estratégias de manutenção que sustentam saúde a longo prazo', plano7Dias: 'Manutenção preventiva com alimentos antioxidantes e protocolo de hidratação personalizado conforme seu perfil e estilo de vida', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte antioxidante. O protocolo é personalizado conforme sua necessidade biológica', alimentacao: 'Mantenha o padrão atual e considere introduzir chás detox e vegetais verdes para potencializar ainda mais seus resultados preventivos', proximoPasso: 'Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas avançadas podem preservar e potencializar ainda mais sua saúde.' },
                                      { titulo: '⚠️ Toxicidade Moderada', pontos: '9-12 pontos', cor: 'yellow', diagnostico: 'Sinais de acúmulo tóxico moderado que precisam de intervenção estratégica', causaRaiz: 'Exposição ambiental e alimentação podem estar aumentando toxinas no organismo. Estudos indicam que protocolos detox personalizados podem reduzir carga tóxica em até 45% em poucos meses. Uma avaliação completa identifica exatamente a origem e estratégias para reduzir', acaoImediata: 'Busque avaliação nutricional para receber um protocolo detox adequado ao seu perfil. Evite protocolos genéricos — cada organismo responde diferente', plano7Dias: 'Protocolo detox moderado personalizado, considerando seu perfil metabólico e estilo de vida, com ajustes conforme sua resposta individual', suplementacao: 'Uma avaliação identifica quais suplementos detox seu corpo realmente precisa. Suporte digestivo costuma ser considerado, mas apenas após análise detalhada do seu caso', alimentacao: 'Um plano alimentar detox personalizado considera suas preferências e objetivos. Aumente vegetais crucíferos de forma gradual enquanto aguarda sua avaliação', proximoPasso: 'Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir toxinas com um plano personalizado.' },
                                      { titulo: '🚨 Alta Toxicidade', pontos: '13-15 pontos', cor: 'red', diagnostico: 'Alta carga tóxica que precisa de intervenção personalizada e urgente', causaRaiz: 'Exposição excessiva a toxinas e sistema de eliminação comprometido podem estar afetando sua saúde significativamente. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança', acaoImediata: 'Busque avaliação nutricional imediata para receber um protocolo detox seguro e adequado ao seu perfil. Evite protocolos intensivos sem acompanhamento — cada caso requer abordagem específica', plano7Dias: 'Protocolo detox completo personalizado, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica', suplementacao: 'Uma avaliação completa identifica quais suplementos detox são adequados. Protocolos intensivos devem ser definidos apenas após análise detalhada do seu caso, sempre conforme sua individualidade biológica', alimentacao: 'Um plano alimentar detox rigoroso, totalmente personalizado, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional', proximoPasso: 'Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.' }
                                    ].map((resultado) => (
                                      <div key={resultado.titulo} className={`bg-${resultado.cor}-50 rounded-lg p-4 border-2 border-${resultado.cor}-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className={`font-bold text-${resultado.cor}-900`}>{resultado.titulo}</h5>
                                          <span className={`bg-${resultado.cor}-600 text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                          <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                          <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                          <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                          <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                          <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                          <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                          <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewQuizDetox(Math.max(0, etapaPreviewQuizDetox - 1))} disabled={etapaPreviewQuizDetox === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((etapa) => {
                                      const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewQuizDetox(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewQuizDetox === etapa ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 6 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewQuizDetox(Math.min(6, etapaPreviewQuizDetox + 1))} disabled={etapaPreviewQuizDetox === 6} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                          // Sistema genérico para quizzes diagnósticos (10 perguntas)
                          // Identifica quizzes diagnósticos por palavras-chave
                          const isDiagnostico = templateNameLower.includes('diagnóstico') || 
                            templateNameLower.includes('diagnostico') ||
                            templateNameLower.includes('parasitose') ||
                            templateNameLower.includes('eletrólitos') ||
                            templateNameLower.includes('eletrolitos') ||
                            templateNameLower.includes('sintomas intestinais') ||
                            templateNameLower.includes('retenção') ||
                            templateNameLower.includes('retencao') ||
                            templateNameLower.includes('fome emocional') ||
                            templateNameLower.includes('tipo de fome') ||
                            templateNameLower.includes('tipo fome') ||
                            templateNameLower.includes('pronto para emagrecer') ||
                            templateNameLower.includes('pronto emagrecer') ||
                            templateNameLower.includes('síndrome metabólica') ||
                            templateNameLower.includes('sindrome metabolica') ||
                            templateNameLower.includes('perfil intestino') ||
                            templateNameLower.includes('perfil de intestino') ||
                            templateNameLower.includes('autoconhecimento') ||
                            templateNameLower.includes('conhece seu corpo') ||
                            templateNameLower.includes('sensitividade') ||
                            templateNameLower.includes('sensibilidade') ||
                            templateNameLower.includes('sono e energia') ||
                            templateNameLower.includes('perfil metabólico') ||
                            templateNameLower.includes('perfil metabolico')
                          
                          if (isDiagnostico && tipoPreview === 'quiz') {
                            const templateKey = template.id || templateNameLower
                            const etapaAtual = etapaPreviewDiagnostico[templateKey] || 0
                            
                            // Perguntas genéricas para diagnósticos
                            const perguntasGenericas = [
                              'Você sente cansaço constante mesmo dormindo bem?',
                              'Tem dificuldade para emagrecer, mesmo comendo pouco?',
                              'Sente-se inchado(a) com frequência, especialmente ao final do dia?',
                              'Tem alterações de humor ou irritabilidade?',
                              'Costuma ter problemas digestivos (gases, constipação, diarreia)?',
                              'Sente dores de cabeça frequentes?',
                              'Tem dificuldade para manter o foco e concentração?',
                              'Sente necessidade de comer doces ou carboidratos?',
                              'Tem problemas de sono (dificuldade para dormir ou acordar)?',
                              'Sente-se desmotivado(a) ou sem energia para atividades do dia a dia?'
                            ]
                            
                            return (
                              <>
                                {etapaAtual === 0 && (
                                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 {template.name}</h4>
                                    <p className="text-gray-700 mb-3">{template.description || 'Avalie seu perfil através de perguntas estratégicas e descubra orientações personalizadas.'}</p>
                                    <p className="text-purple-600 font-semibold">✨ Uma avaliação completa que pode transformar sua saúde.</p>
                                  </div>
                                )}
                                {etapaAtual >= 1 && etapaAtual <= 10 && (
                                  <div className="space-y-6">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-purple-900 mb-3">{etapaAtual}. {perguntasGenericas[etapaAtual - 1]}</h4>
                                      <div className="space-y-2">
                                        {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((opcao) => (
                                          <label key={opcao} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-not-allowed opacity-60">
                                            <input type="radio" name={`pergunta-${etapaAtual}`} className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {etapaAtual === 11 && (
                                  <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
                                    {[
                                      { titulo: '📉 Necessita Atenção', pontos: '0-20 pontos', cor: 'red', diagnostico: 'Seus sintomas indicam necessidade de avaliação personalizada', causaRaiz: 'Vários fatores podem estar contribuindo para seus sintomas. Uma avaliação completa identifica exatamente a origem e como reverter', acaoImediata: 'Busque avaliação profissional para receber um protocolo adequado ao seu perfil. Evite auto-tratamento', plano7Dias: 'Protocolo inicial personalizado, ajustado conforme sua resposta individual', suplementacao: 'A necessidade só é definida após avaliação completa, sempre de acordo com a individualidade biológica', alimentacao: 'Um plano alimentar personalizado considera suas preferências e objetivos. Ajuste gradual enquanto aguarda sua avaliação', proximoPasso: 'Seu organismo precisa de cuidado agora — e é totalmente possível melhorar com apoio profissional especializado.' },
                                      { titulo: '⚖️ Atenção Moderada', pontos: '21-30 pontos', cor: 'yellow', diagnostico: 'Alguns sinais indicam necessidade de otimização', causaRaiz: 'Boa base estabelecida, mas ajustes estratégicos podem melhorar significativamente. Uma análise detalhada mostra oportunidades específicas', acaoImediata: 'Mantenha hábitos atuais e considere avaliação para identificar estratégias de otimização. Pequenos ajustes geram grandes melhorias', plano7Dias: 'Otimização com estratégias específicas para seu perfil metabólico e rotina', suplementacao: 'Uma avaliação identifica se você se beneficia de suporte preventivo, sempre após análise do seu caso', alimentacao: 'Otimize combinações e timing nutricional. Um plano otimizado considera estratégias específicas para maximizar resultados', proximoPasso: 'Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem potencializar ainda mais seus resultados.' },
                                      { titulo: '🌟 Perfil Saudável', pontos: '31-40 pontos', cor: 'green', diagnostico: 'Seu perfil está bem; estratégias preventivas podem potencializar ainda mais', causaRaiz: 'Boa base estabelecida. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis superiores', acaoImediata: 'Continue a rotina atual e considere avaliação preventiva para introduzir estratégias avançadas que sustentam resultados a longo prazo', plano7Dias: 'Manutenção com protocolo preventivo personalizado para sustentabilidade', suplementacao: 'Uma análise preventiva identifica se você se beneficia de suporte para performance, sempre personalizado conforme seu perfil', alimentacao: 'Mantenha o padrão atual e considere introduzir superalimentos para potencializar ainda mais seus resultados', proximoPasso: 'Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.' }
                                    ].map((resultado) => {
                                      const bgColor = resultado.cor === 'red' ? 'bg-red-50' : resultado.cor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'
                                      const borderColor = resultado.cor === 'red' ? 'border-red-200' : resultado.cor === 'yellow' ? 'border-yellow-200' : 'border-green-200'
                                      const textColor = resultado.cor === 'red' ? 'text-red-900' : resultado.cor === 'yellow' ? 'text-yellow-900' : 'text-green-900'
                                      const badgeColor = resultado.cor === 'red' ? 'bg-red-600' : resultado.cor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'
                                      return (
                                        <div key={resultado.titulo} className={`${bgColor} rounded-lg p-4 border-2 ${borderColor}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className={`font-bold ${textColor}`}>{resultado.titulo}</h5>
                                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{resultado.pontos}</span>
                                          </div>
                                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                                            <p className="font-semibold">📋 DIAGNÓSTICO: {resultado.diagnostico}</p>
                                            <p>🔍 CAUSA RAIZ: {resultado.causaRaiz}</p>
                                            <p>⚡ AÇÃO IMEDIATA: {resultado.acaoImediata}</p>
                                            <p>📅 PLANO 7 DIAS: {resultado.plano7Dias}</p>
                                            <p>💊 SUPLEMENTAÇÃO: {resultado.suplementacao}</p>
                                            <p>🍎 ALIMENTAÇÃO: {resultado.alimentacao}</p>
                                            <p className="font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: {resultado.proximoPasso}</p>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button onClick={() => setEtapaPreviewDiagnostico({...etapaPreviewDiagnostico, [templateKey]: Math.max(0, etapaAtual - 1)})} disabled={etapaAtual === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                  <div className="flex space-x-2">
                                    {[0, ...Array.from({length: 10}, (_, i) => i + 1), 11].map((etapa) => {
                                      const labels = ['Início', ...Array.from({length: 10}, (_, i) => String(i + 1)), 'Resultados']
                                      return <button key={etapa} onClick={() => setEtapaPreviewDiagnostico({...etapaPreviewDiagnostico, [templateKey]: etapa})} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaAtual === etapa ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : etapa === 11 ? 'Resultados' : `Pergunta ${etapa}`}>{labels[etapa]}</button>
                                    })}
                                  </div>
                                  <button onClick={() => setEtapaPreviewDiagnostico({...etapaPreviewDiagnostico, [templateKey]: Math.min(11, etapaAtual + 1)})} disabled={etapaAtual === 11} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                                </div>
                              </>
                            )
                          }
                          
                        }
                        
                        // PLANILHAS - Preview completo com landing e visualização
                        // Verificar se já não foi tratado como checklist ou guia específico
                        const isChecklistOuGuiaEspecifico = 
                          templateNameLower.includes('checklist alimentar') ||
                          templateNameLower.includes('checklist-detox') ||
                          templateNameLower.includes('guia nutraceutico') ||
                          templateNameLower.includes('guia-proteico') ||
                          templateNameLower.includes('guia proteico') ||
                          templateNameNormalizado.includes('guia nutraceutico') ||
                          templateNameNormalizado.includes('guia proteico')
                        
                        const tipoTemplate = template.type || ''
                        if ((tipoTemplate === 'planilha' || tipoTemplate === 'checklist' || tipoTemplate === 'tabela') && !isChecklistOuGuiaEspecifico) {
                          // Se for uma planilha genérica, mostra o preview
                          return (
                            <>
                              {etapaPreviewPlanilha === 0 && (
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">📋 {template.name}</h4>
                                  <p className="text-gray-700 mb-3">{template.description || 'Uma ferramenta prática para organizar e acompanhar suas informações de forma estruturada.'}</p>
                                  <p className="text-indigo-600 font-semibold">✨ Uma ferramenta completa para sua organização e acompanhamento.</p>
                                </div>
                              )}
                              {etapaPreviewPlanilha === 1 && (
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">📊 Visualização da {template.name}</h4>
                                    <div className="overflow-x-auto">
                                      <table className="w-full border-collapse">
                                        <thead>
                                          <tr className="bg-gray-50">
                                            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">Item</th>
                                            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">Observações</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {[1, 2, 3, 4, 5].map((item) => (
                                            <tr key={item} className="hover:bg-gray-50">
                                              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">Exemplo {item}</td>
                                              <td className="border border-gray-200 px-4 py-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                  Concluído
                                                </span>
                                              </td>
                                              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">Observação exemplo para item {item}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                      <p className="text-sm text-blue-800">
                                        <strong>💡 Dica:</strong> Esta planilha permite organizar e acompanhar suas informações de forma estruturada. 
                                        Você pode personalizar cada item conforme suas necessidades.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <button onClick={() => setEtapaPreviewPlanilha(Math.max(0, etapaPreviewPlanilha - 1))} disabled={etapaPreviewPlanilha === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                                <div className="flex space-x-2">
                                  {[0, 1].map((etapa) => {
                                    const labels = ['Início', 'Visualização']
                                    return <button key={etapa} onClick={() => setEtapaPreviewPlanilha(etapa)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewPlanilha === etapa ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={etapa === 0 ? 'Tela Inicial' : 'Visualização'}>{labels[etapa]}</button>
                                  })}
                                </div>
                                <button onClick={() => setEtapaPreviewPlanilha(Math.min(1, etapaPreviewPlanilha + 1))} disabled={etapaPreviewPlanilha === 1} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                              </div>
                            </>
                          )
                        }
                        
                        // Fallback para templates não identificados
                        return (
                          <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                              <p className="text-gray-700">{template.description || 'Preview completo em desenvolvimento.'}</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Fechar
                    </button>
                    <Link
                      href={`/pt/wellness/templates/${template.id}/criar-link`}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Criar Meu Link
                    </Link>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
