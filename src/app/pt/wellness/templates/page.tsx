'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain, DollarSign, TrendingUp, Star, Zap, UtensilsCrossed, Search } from 'lucide-react'
import { 
  calculadoraAguaDiagnosticos, 
  calculadoraImcDiagnosticos, 
  calculadoraProteinaDiagnosticos, 
  calculadoraCaloriasDiagnosticos, 
  checklistAlimentarDiagnosticos,
  checklistDetoxDiagnosticos,
  quizInterativoDiagnosticos,
  quizBemEstarDiagnosticos,
  quizPerfilNutricionalDiagnosticos,
  quizDetoxDiagnosticos,
  quizEnergeticoDiagnosticos,
  guiaHidratacaoDiagnosticos,
  desafio7DiasDiagnosticos,
  desafio21DiasDiagnosticos
} from '@/lib/diagnostics'
import QuizInterativoPreview from '@/components/wellness-previews/quizzes/QuizInterativoPreview'
import QuizBemEstarPreview from '@/components/wellness-previews/quizzes/QuizBemEstarPreview'
import QuizPerfilNutricionalPreview from '@/components/wellness-previews/quizzes/QuizPerfilNutricionalPreview'
import QuizDetoxPreview from '@/components/wellness-previews/quizzes/QuizDetoxPreview'
import QuizEnergeticoPreview from '@/components/wellness-previews/quizzes/QuizEnergeticoPreview'
import ChecklistAlimentarPreview from '@/components/wellness-previews/checklists/ChecklistAlimentarPreview'
import ChecklistDetoxPreview from '@/components/wellness-previews/checklists/ChecklistDetoxPreview'
import GuiaHidratacaoPreview from '@/components/wellness-previews/guias/GuiaHidratacaoPreview'

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
  const [etapaPreview, setEtapaPreview] = useState<number>(0) // 0 = landing, 1+ = formulário/perguntas, último = resultado
  const [etapaPreviewChecklistAlimentar, setEtapaPreviewChecklistAlimentar] = useState(0) // Para checklist-alimentar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewChecklistDetox, setEtapaPreviewChecklistDetox] = useState(0) // Para checklist-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizInterativo, setEtapaPreviewQuizInterativo] = useState(0) // Para quiz-interativo: 0 = landing, 1-6 = perguntas, 7 = resultados
  const [etapaPreviewQuizBemEstar, setEtapaPreviewQuizBemEstar] = useState(0) // Para quiz-bem-estar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizPerfilNutricional, setEtapaPreviewQuizPerfilNutricional] = useState(0) // Para quiz-perfil-nutricional: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizDetox, setEtapaPreviewQuizDetox] = useState(0) // Para quiz-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizEnergetico, setEtapaPreviewQuizEnergetico] = useState(0) // Para quiz-energetico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewGuiaHidratacao, setEtapaPreviewGuiaHidratacao] = useState(0) // Para guia-hidratacao: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewDesafio7Dias, setEtapaPreviewDesafio7Dias] = useState(0) // Para desafio-7-dias: 0 = landing, 1-7 = perguntas, 8 = resultados
  const [etapaPreviewDesafio21Dias, setEtapaPreviewDesafio21Dias] = useState(0) // Para desafio-21-dias: 0 = landing, 1-7 = perguntas, 8 = resultados
  const [respostasDesafio7Dias, setRespostasDesafio7Dias] = useState<number[]>([]) // Respostas do Desafio 7 Dias
  const [respostasDesafio21Dias, setRespostasDesafio21Dias] = useState<number[]>([]) // Respostas do Desafio 21 Dias
  const [diagnosticoSelecionado7Dias, setDiagnosticoSelecionado7Dias] = useState<string>('') // ID do diagnóstico selecionado no preview 7 dias
  const [diagnosticoSelecionado21Dias, setDiagnosticoSelecionado21Dias] = useState<string>('') // ID do diagnóstico selecionado no preview 21 dias

  // Templates hardcoded como fallback mínimo (apenas se banco falhar)
  const templatesFallback: Template[] = [
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
      id: 'healthy-eating',
      name: 'Quiz: Alimentação Saudável',
      description: 'Avalie hábitos alimentares e oriente nutricionalmente',
      icon: Brain,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/healthy-eating',
      color: 'bg-emerald-500'
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
      id: 'meal-planner',
      name: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: UtensilsCrossed,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/meal-planner',
      color: 'bg-pink-500'
    },
    {
      id: 'nutrition-assessment',
      name: 'Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Search,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/nutrition-assessment',
      color: 'bg-indigo-500'
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
    let cancelled = false
    
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/wellness/templates', {
          cache: 'no-store',
          signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
        })
        
        if (cancelled) return
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            console.log('📦 Templates carregados do banco:', data.templates.length)
            
            // Transformar templates do banco para formato da página
            const templatesFormatados = data.templates
              .filter((t: any) => {
                // Filtrar templates que não devem aparecer
                const normalizedId = (t.slug || t.id || '').toLowerCase().replace(/\s+/g, '-')
                const normalizedName = (t.nome || '').toLowerCase()
                
                // Excluir templates removidos
                const templatesExcluidos = [
                  'food-tracker',
                  'rastreador-alimentar',
                  'planilha-rastreador-alimentar',
                  'daily-wellness',
                  'tabela-daily-wellness',
                  'planilha-daily-wellness'
                ]
                
                const isExcluido = templatesExcluidos.some(excluido => 
                  normalizedId.includes(excluido) || 
                  normalizedName.includes(excluido) ||
                  normalizedName.includes('rastreador de alimentos') ||
                  normalizedName.includes('rastreador alimentar') ||
                  normalizedName.includes('bem-estar diário') ||
                  normalizedName.includes('bem estar diario')
                )
                
                return !isExcluido
              })
              .map((t: any) => {
                // Normalizar ID para detecção (slug ou nome em lowercase com hífens)
                const normalizedId = (t.slug || t.id || '').toLowerCase().replace(/\s+/g, '-')
                const normalizedName = (t.nome || '').toLowerCase()
                
                // Log para debug de checklists
                if (normalizedName.includes('checklist') || normalizedName.includes('alimentar')) {
                  console.log('🔍 Checklist detectado no mapeamento:', {
                    id: normalizedId,
                    name: normalizedName,
                    type: t.type,
                    categoria: t.categoria,
                    slug: t.slug,
                    originalId: t.id
                  })
                }
                
                // Log para debug de guias
                if (normalizedName.includes('guia') || normalizedName.includes('ebook') || normalizedName.includes('e-book') || normalizedName.includes('mini')) {
                  console.log('📚 Guia detectado no mapeamento:', {
                    id: normalizedId,
                    name: normalizedName,
                    type: t.type,
                    categoria: t.categoria,
                    slug: t.slug,
                    originalId: t.id
                  })
                }
                
                // Determinar tipo corretamente
                // IMPORTANTE: Se o nome contém "checklist", SEMPRE é 'planilha'
                let tipoFinal = t.type || (t.categoria === 'Calculadora' ? 'calculadora' : t.categoria === 'Quiz' ? 'quiz' : 'planilha')
                
                // Forçar tipo 'planilha' para checklists (baseado no nome)
                if (normalizedName.includes('checklist')) {
                  tipoFinal = 'planilha'
                }
                
                return {
                  id: normalizedId || t.slug || t.id,
                  name: t.nome,
                  description: t.descricao || t.nome,
                  icon: iconMap[tipoFinal?.toLowerCase()] || iconMap[t.categoria?.toLowerCase()] || iconMap['default'],
                  type: tipoFinal,
                  category: t.categoria || categoryMap[tipoFinal] || 'Outros',
                  link: `/pt/wellness/ferramentas/nova?template=${t.slug || t.id}`,
                  color: colorMap[tipoFinal?.toLowerCase()] || colorMap[t.categoria?.toLowerCase()] || colorMap['default']
                }
              })
            
            console.log('✨ Templates formatados:', templatesFormatados.length)
            
            if (!cancelled) {
              setTemplates(templatesFormatados)
            }
          } else {
            // Fallback se não houver templates no banco
            console.warn('⚠️ Nenhum template encontrado no banco, usando fallback')
            if (!cancelled) {
              setTemplates(templatesFallback)
            }
          }
        } else {
          // Fallback se erro na API
          console.error('⚠️ Erro ao buscar templates, usando fallback')
          if (!cancelled) {
            setTemplates(templatesFallback)
          }
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar templates:', error)
        // Fallback se erro
        if (!cancelled && error.name !== 'AbortError') {
          setTemplates(templatesFallback)
        }
      } finally {
        if (!cancelled) {
          setCarregandoTemplates(false)
        }
      }
    }
    
    carregarTemplates()
    
    return () => {
      cancelled = true
    }
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
      <WellnessNavBar showTitle={true} title="Templates Wellness" />

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
                        onClick={() => setTemplatePreviewAberto(template.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => {
          setTemplatePreviewAberto(null)
          setEtapaPreview(0)
        }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = templates.find(t => t.id === templatePreviewAberto)
              if (!template) return null

              const Icon = template.icon
              
              // Determinar número de etapas baseado no tipo
              // Melhorar detecção de checklists (verificar ID normalizado e nome)
              const templateIdLower = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
              const templateNameLower = (template.name || '').toLowerCase()
              
              // Detecção mais robusta de checklists
              const isAlimentar = templateIdLower.includes('checklist-alimentar') ||
                                  templateIdLower.includes('alimentar') ||
                                  templateNameLower === 'checklist alimentar' ||
                                  templateNameLower.includes('checklist alimentar') ||
                                  (templateNameLower.includes('checklist') && templateNameLower.includes('alimentar'))
              
              const isDetox = templateIdLower.includes('checklist-detox') ||
                              templateIdLower.includes('detox') ||
                              templateNameLower === 'checklist detox' ||
                              templateNameLower.includes('checklist detox') ||
                              (templateNameLower.includes('checklist') && templateNameLower.includes('detox'))
              
              const isChecklist = isAlimentar || isDetox || (template.type === 'planilha' && (templateNameLower.includes('checklist') || templateNameLower.includes('alimentar')))
              
              // Log para debug
              if (templateNameLower.includes('checklist') || templateNameLower.includes('alimentar') || templateNameLower.includes('detox')) {
                console.log('🔍 DEBUG Checklist Detecção:', {
                  id: template.id,
                  idLower: templateIdLower,
                  name: template.name,
                  nameLower: templateNameLower,
                  type: template.type,
                  isAlimentar,
                  isDetox,
                  isChecklist,
                  totalEtapasCalculado: template.type === 'calculadora' ? 4 : template.type === 'quiz' ? 6 : isChecklist ? 5 : 2
                })
              }
              
              // Checklist Alimentar tem 7 etapas (0=landing, 1-5=perguntas, 6=resultados)
              const totalEtapas = template.type === 'calculadora' ? 4 
                : template.type === 'quiz' ? 6 
                : isAlimentar ? 7 // Checklist Alimentar: 0=landing, 1-5=perguntas, 6=resultados
                : isChecklist ? 5 // Outros checklists: Landing (0) + 3 perguntas (1-3) + Resultado (4)
                : 2
              const etapasLabels = template.type === 'calculadora' 
                ? ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                : template.type === 'quiz'
                ? ['Início', 'Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Resultado', 'CTA']
                : isAlimentar
                ? ['Início', '1', '2', '3', '4', '5', 'Resultados'] // Checklist Alimentar: 7 etapas
                : isChecklist
                ? ['Início', 'Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Resultado']
                : ['Início', 'Conteúdo']
              
              return (
                <>
                  {/* Header do Modal com Gradiente */}
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{template.name}</h2>
                          <p className="text-teal-100 text-sm">Visualize o fluxo completo deste template</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTemplatePreviewAberto(null)
                          setEtapaPreview(0)
                          setEtapaPreviewChecklistAlimentar(0)
                          setEtapaPreviewChecklistDetox(0)
                          setEtapaPreviewQuizInterativo(0)
                          setEtapaPreviewQuizBemEstar(0)
                          setEtapaPreviewQuizPerfilNutricional(0)
                          setEtapaPreviewQuizDetox(0)
                          setEtapaPreviewQuizEnergetico(0)
                          setEtapaPreviewGuiaHidratacao(0)
                          setEtapaPreviewDesafio7Dias(0)
                          setEtapaPreviewDesafio21Dias(0)
                          setRespostasDesafio7Dias([])
                          setRespostasDesafio21Dias([])
                        }}
                        className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Preview */}
                  <div className="flex-1 overflow-y-auto p-6 pb-24">
                    {(() => {
                      const templateIdLower = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                      const templateNameLower = (template.name || '').toLowerCase()
                      
                      // Debug: Log para TODOS os templates (para identificar problemas)
                      console.log('[DEBUG Template] Todos os templates:', {
                        id: template.id,
                        name: template.name,
                        type: template.type,
                        category: template.category,
                        idLower: templateIdLower,
                        nameLower: templateNameLower
                      })
                      
                      // Debug: Log para identificar templates (apenas para quizzes)
                      const isQuizType = template.type === 'quiz'
                      
                      // Detecção mais flexível para quizzes - Baseado nos nomes reais do banco
                      const isQuizInterativo = isQuizType && (
                        templateIdLower.includes('quiz-interativo') || 
                        templateIdLower.includes('interativo') ||
                        templateNameLower.includes('quiz interativo') ||
                        templateNameLower.includes('quiz: descubra seu tipo de metabolismo') ||
                        templateNameLower.includes('diagnóstico do tipo de metabolismo') ||
                        (templateNameLower.includes('quiz') && templateNameLower.includes('metabolismo')) ||
                        templateNameLower.includes('metabolismo')
                      )
                      
                      const isQuizBemEstar = isQuizType && (
                        templateIdLower.includes('quiz-bem-estar') || 
                        templateIdLower.includes('quiz-bemestar') ||
                        templateIdLower.includes('bem-estar') ||
                        templateNameLower.includes('quiz bem-estar') ||
                        templateNameLower.includes('quiz de bem-estar') ||
                        templateNameLower.includes('descubra seu perfil de bem-estar') ||
                        templateNameLower.includes('perfil de bem-estar') ||
                        templateNameLower.includes('wellness-profile')
                      )
                      
                      const isQuizPerfilNutricional = isQuizType && (
                        templateIdLower.includes('quiz-perfil-nutricional') || 
                        templateIdLower.includes('quiz-perfil') ||
                        templateIdLower.includes('perfil-nutricional') ||
                        templateNameLower.includes('quiz perfil nutricional') ||
                        templateNameLower.includes('perfil nutricional') ||
                        (templateNameLower.includes('quiz') && templateNameLower.includes('perfil'))
                      )
                      
                      const isQuizDetox = isQuizType && (
                        templateIdLower.includes('quiz-detox') || 
                        templateNameLower.includes('quiz detox') ||
                        templateNameLower.includes('seu corpo está pedindo detox') ||
                        templateNameLower.includes('corpo está pedindo detox') ||
                        (templateNameLower.includes('quiz') && templateNameLower.includes('detox')) ||
                        (templateNameLower.includes('detox') && templateNameLower.includes('corpo'))
                      )
                      
                      const isQuizEnergetico = isQuizType && (
                        templateIdLower.includes('quiz-energetico') || 
                        templateIdLower.includes('quiz-energético') ||
                        templateIdLower.includes('energetico') ||
                        templateNameLower.includes('quiz energético') ||
                        templateNameLower.includes('quiz energetico') ||
                        templateNameLower.includes('energético') ||
                        templateNameLower.includes('energia')
                      )
                      const isChecklistAlimentar = templateIdLower.includes('checklist-alimentar') || 
                                                   templateIdLower === 'checklist-alimentar' ||
                                                   templateNameLower === 'checklist alimentar' ||
                                                   templateNameLower.includes('checklist alimentar') ||
                                                   (templateNameLower.includes('checklist') && templateNameLower.includes('alimentar'))
                      const isChecklistDetox = templateIdLower.includes('checklist-detox') || 
                                               templateNameLower.includes('checklist detox') || 
                                               (templateNameLower.includes('checklist') && templateNameLower.includes('detox'))
                      // Debug: Log para identificar guias (baseado no nome, não no type)
                      const isPossivelGuia = templateNameLower.includes('guia') || templateNameLower.includes('ebook') || templateNameLower.includes('e-book') || templateNameLower.includes('mini')
                      if (isPossivelGuia) {
                        console.log('[DEBUG Guia] Template detectado:', {
                          id: template.id,
                          name: template.name,
                          type: template.type,
                          category: template.category,
                          idLower: templateIdLower,
                          nameLower: templateNameLower
                        })
                      }
                      
                      // Detecção mais robusta para Guia de Hidratação
                      const isGuiaHidratacao = templateIdLower.includes('guia-hidratacao') || 
                                              templateIdLower.includes('guia-hidratação') ||
                                              templateIdLower.includes('guia-de-hidratacao') ||
                                              templateIdLower.includes('guia-de-hidratação') ||
                                              templateIdLower.includes('hidratacao') ||
                                              templateIdLower.includes('hidratação') ||
                                              templateNameLower.includes('guia hidratacao') ||
                                              templateNameLower.includes('guia hidratação') ||
                                              templateNameLower.includes('guia de hidratacao') ||
                                              templateNameLower.includes('guia de hidratação') ||
                                              templateNameLower === 'guia de hidratação' ||
                                              templateNameLower === 'guia hidratação' ||
                                              templateNameLower.includes('hidratacao') ||
                                              templateNameLower.includes('hidratação') ||
                                              (templateNameLower.includes('guia') && (templateNameLower.includes('hidrat') || templateNameLower.includes('água') || templateNameLower.includes('agua')))
                      
                      // Detecção para Desafios
                      const isDesafio7Dias = templateIdLower.includes('desafio-7-dias') || 
                                            templateIdLower.includes('desafio-7') ||
                                            templateIdLower.includes('7-dias') ||
                                            templateNameLower.includes('desafio 7 dias') ||
                                            templateNameLower.includes('desafio 7') ||
                                            templateNameLower.includes('7 dias') ||
                                            (templateNameLower.includes('desafio') && templateNameLower.includes('7'))
                      
                      const isDesafio21Dias = templateIdLower.includes('desafio-21-dias') || 
                                             templateIdLower.includes('desafio-21') ||
                                             templateIdLower.includes('21-dias') ||
                                             templateNameLower.includes('desafio 21 dias') ||
                                             templateNameLower.includes('desafio 21') ||
                                             templateNameLower.includes('21 dias') ||
                                             (templateNameLower.includes('desafio') && templateNameLower.includes('21'))
                      
                      // Log de detecção para debug - TODOS os templates modulares
                      const isModular = isQuizInterativo || isQuizBemEstar || isQuizPerfilNutricional || isQuizDetox || isQuizEnergetico || 
                                       isChecklistAlimentar || isChecklistDetox || isGuiaHidratacao || isDesafio7Dias || isDesafio21Dias
                      
                      if (isModular) {
                        console.log('[DEBUG Modular] Detecção:', {
                          templateName: template.name,
                          templateId: template.id,
                          isQuizInterativo,
                          isQuizBemEstar,
                          isQuizPerfilNutricional,
                          isQuizDetox,
                          isQuizEnergetico,
                          isChecklistAlimentar,
                          isChecklistDetox,
                          isGuiaHidratacao,
                          isDesafio7Dias,
                          isDesafio21Dias
                        })
                      }
                      
                      // Quiz Interativo - Componente Modular
                      if (isQuizInterativo) {
                        return (
                          <QuizInterativoPreview 
                            etapa={etapaPreviewQuizInterativo}
                            onEtapaChange={setEtapaPreviewQuizInterativo}
                          />
                        )
                      }
                      
                      // Quiz Bem-Estar - Componente Modular
                      if (isQuizBemEstar) {
                        return (
                          <QuizBemEstarPreview 
                            etapa={etapaPreviewQuizBemEstar}
                            onEtapaChange={setEtapaPreviewQuizBemEstar}
                          />
                        )
                      }
                      
                      // Quiz Perfil Nutricional - Componente Modular
                      if (isQuizPerfilNutricional) {
                        return (
                          <QuizPerfilNutricionalPreview 
                            etapa={etapaPreviewQuizPerfilNutricional}
                            onEtapaChange={setEtapaPreviewQuizPerfilNutricional}
                          />
                        )
                      }
                      
                      // Quiz Detox - Componente Modular
                      if (isQuizDetox) {
                        return (
                          <QuizDetoxPreview 
                            etapa={etapaPreviewQuizDetox}
                            onEtapaChange={setEtapaPreviewQuizDetox}
                          />
                        )
                      }
                      
                      // Quiz Energético - Componente Modular
                      if (isQuizEnergetico) {
                        return (
                          <QuizEnergeticoPreview 
                            etapa={etapaPreviewQuizEnergetico}
                            onEtapaChange={setEtapaPreviewQuizEnergetico}
                          />
                        )
                      }
                      
                      // Checklist Alimentar - Componente Modular
                      if (isChecklistAlimentar) {
                        return (
                          <ChecklistAlimentarPreview 
                            etapa={etapaPreviewChecklistAlimentar}
                            onEtapaChange={setEtapaPreviewChecklistAlimentar}
                          />
                        )
                      }
                      
                      // Checklist Detox - Componente Modular
                      if (isChecklistDetox) {
                        return (
                          <ChecklistDetoxPreview 
                            etapa={etapaPreviewChecklistDetox}
                            onEtapaChange={setEtapaPreviewChecklistDetox}
                          />
                        )
                      }
                      
                      // Guia Hidratação - Componente Modular
                      if (isGuiaHidratacao) {
                        return (
                          <GuiaHidratacaoPreview 
                            etapa={etapaPreviewGuiaHidratacao}
                            onEtapaChange={setEtapaPreviewGuiaHidratacao}
                          />
                        )
                      }
                      
                      // Desafio 7 Dias - Preview Inline
                      if (isDesafio7Dias) {
                        const diagnosticos = desafio7DiasDiagnosticos.wellness
                        const totalEtapas = 8 // 0=landing, 1-7=perguntas, 8=diagnóstico
                        
                        // Sistema de pontuação: cada opção vale 0-4 pontos (total: 0-28 pontos)
                        // Baseado no SQL: ranges 0-14, 15-21, 22-28
                        const pontosPorOpcao = [0, 1, 2, 3, 4] // Cada pergunta tem 5 opções (0-4 pontos)
                        
                        // Calcular score baseado nas respostas reais
                        const calcularScore = (resps: number[]) => {
                          let score = 0
                          resps.forEach((resp) => {
                            score += pontosPorOpcao[resp] || 0
                          })
                          return score
                        }
                        
                        const scoreAtual = calcularScore(respostasDesafio7Dias)
                        
                        // Determinar diagnóstico baseado no score - 5 faixas diferentes
                        let diagnosticoPadrao = 'altaMotivacaoParaTransformacaoRapida'
                        if (scoreAtual >= 0 && scoreAtual <= 7) {
                          diagnosticoPadrao = 'motivacaoBaixa'
                        } else if (scoreAtual >= 8 && scoreAtual <= 14) {
                          diagnosticoPadrao = 'prontoParaResultadosRapidos'
                        } else if (scoreAtual >= 15 && scoreAtual <= 18) {
                          diagnosticoPadrao = 'altaMotivacaoParaTransformacaoRapida'
                        } else if (scoreAtual >= 19 && scoreAtual <= 22) {
                          diagnosticoPadrao = 'motivacaoMuitoAlta'
                        } else if (scoreAtual >= 23 && scoreAtual <= 28) {
                          diagnosticoPadrao = 'perfeitoParaDesafioEstruturado7Dias'
                        }
                        
                        // Usar diagnóstico selecionado ou padrão baseado no score
                        const diagnosticoAtualId = diagnosticoSelecionado7Dias || diagnosticoPadrao
                        const diagnosticoSelecionado = diagnosticos[diagnosticoAtualId] || diagnosticos[diagnosticoPadrao]
                        
                        const perguntasDesafio7 = [
                          {
                            id: 1,
                            pergunta: 'Você precisa de resultados rápidos e visíveis?',
                            descricao: 'Identifique seu nível de urgência',
                            opcoes: ['Sim, preciso ver resultados logo', 'Quero resultados mas posso esperar', 'Prefiro resultados consistentes e duradouros', 'Resultados rápidos me motivam mais', 'Preciso ver progresso logo para manter motivação']
                          },
                          {
                            id: 2,
                            pergunta: 'Quanto tempo você tem disponível para focar no seu bem-estar?',
                            descricao: 'Avalie sua disponibilidade',
                            opcoes: ['Muito pouco tempo, preciso de algo rápido', 'Tenho alguns minutos por dia', 'Tenho tempo moderado para dedicar', 'Tenho bastante tempo disponível', 'Posso dedicar o tempo necessário']
                          },
                          {
                            id: 3,
                            pergunta: 'O que você mais espera conseguir em 7 dias?',
                            descricao: 'Defina suas expectativas',
                            opcoes: ['Ver resultados visíveis rápidos', 'Criar hábitos básicos', 'Sentir mais energia e disposição', 'Começar uma transformação', 'Ganhar motivação e confiança']
                          },
                          {
                            id: 4,
                            pergunta: 'Você prefere um desafio intenso ou progressivo?',
                            descricao: 'Entenda seu estilo',
                            opcoes: ['Intenso, quero desafio completo', 'Progressivo, prefiro começar devagar', 'Moderado, algo equilibrado', 'Depende do suporte que tiver', 'Quero o que der mais resultados']
                          },
                          {
                            id: 5,
                            pergunta: 'O que mais te motivaria a completar um desafio de 7 dias?',
                            descricao: 'Identifique seus motivadores',
                            opcoes: ['Ver resultados rápidos', 'Ter acompanhamento diário', 'Ter um plano claro e estruturado', 'Sentir que estou progredindo', 'Saber que tem suporte profissional']
                          },
                          {
                            id: 6,
                            pergunta: 'Você já tentou mudanças rápidas antes?',
                            descricao: 'Avalie sua experiência',
                            opcoes: ['Nunca tentei', 'Tentei mas não consegui manter', 'Tentei e funcionou parcialmente', 'Tentei mas faltou suporte', 'Sempre faço mas quero algo melhor']
                          },
                          {
                            id: 7,
                            pergunta: 'Você está pronto para começar uma transformação hoje?',
                            descricao: 'Avalie seu nível de prontidão',
                            opcoes: ['Sim, estou muito pronto para começar', 'Sim, mas preciso de um plano claro', 'Talvez, preciso ver o que envolve', 'Preciso pensar melhor', 'Não tenho certeza ainda']
                          }
                        ]
                        
                        const responderDesafio7 = (opcaoIndex: number) => {
                          const novasRespostas = [...respostasDesafio7Dias, opcaoIndex]
                          setRespostasDesafio7Dias(novasRespostas)
                          
                          if (etapaPreviewDesafio7Dias < 7) {
                            setEtapaPreviewDesafio7Dias(etapaPreviewDesafio7Dias + 1)
                          } else {
                            setEtapaPreviewDesafio7Dias(8) // Ir para resultado
                          }
                        }
                        
                        return (
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              🎯 Preview do Desafio 7 Dias - "{template.name}"
                            </h3>
                            
                            {etapaPreviewDesafio7Dias === 0 && (
                              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">🚀 Desafio 7 Dias</h4>
                                <p className="text-gray-700 mb-3">{template.description || 'Transforme seus hábitos em apenas 7 dias com um plano personalizado.'}</p>
                                <p className="text-teal-600 font-semibold">✨ Uma jornada de transformação que pode mudar sua vida.</p>
                                <button
                                  onClick={() => {
                                    setEtapaPreviewDesafio7Dias(1)
                                    setRespostasDesafio7Dias([])
                                  }}
                                  className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Começar Desafio
                                </button>
                              </div>
                            )}
                            
                            {etapaPreviewDesafio7Dias >= 1 && etapaPreviewDesafio7Dias <= 7 && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm text-gray-500">Pergunta {etapaPreviewDesafio7Dias} de 7</span>
                                  <span className="text-sm text-gray-500">{Math.round((etapaPreviewDesafio7Dias / 7) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                  <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${(etapaPreviewDesafio7Dias / 7) * 100}%` }}></div>
                                </div>
                                
                                {perguntasDesafio7.map((pergunta) => {
                                  if (pergunta.id === etapaPreviewDesafio7Dias) {
                                    return (
                                      <div key={pergunta.id} className="space-y-4">
                                        <div>
                                          <h4 className="text-xl font-bold text-gray-900 mb-2">{pergunta.pergunta}</h4>
                                          {pergunta.descricao && (
                                            <p className="text-sm text-gray-600 mb-4">{pergunta.descricao}</p>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          {pergunta.opcoes.map((opcao, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => responderDesafio7(idx)}
                                              className="w-full text-left flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300 hover:bg-teal-50 transition-colors"
                                            >
                                              <span className="text-gray-700">{opcao}</span>
                                            </button>
                                          ))}
                                        </div>
                                        
                                        {/* Mostrar score atual enquanto responde */}
                                        {respostasDesafio7Dias.length > 0 && (
                                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                              <strong>Score atual:</strong> {scoreAtual} pontos (de 28 possíveis)
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            )}
                            
                            {etapaPreviewDesafio7Dias === 8 && (
                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Todos os Diagnósticos Disponíveis</h4>
                                
                                {/* Mostrar Score Final */}
                                <div className="bg-teal-100 rounded-lg p-4 border-2 border-teal-300 mb-4">
                                  <p className="text-center">
                                    <span className="text-2xl font-bold text-teal-700">{scoreAtual}</span>
                                    <span className="text-gray-600"> / 28 pontos</span>
                                    <span className="block text-sm text-gray-600 mt-2">Diagnóstico selecionado: {diagnosticoAtualId}</span>
                                  </p>
                                </div>

                                {/* Abas para navegar entre todos os diagnósticos */}
                                <div className="border-b border-gray-200 mb-4">
                                  <div className="flex flex-wrap gap-2">
                                    {Object.keys(diagnosticos).map((key) => {
                                      const labels: { [key: string]: string } = {
                                        motivacaoBaixa: 'Motivação Baixa',
                                        perfeitoParaDesafioEstruturado7Dias: 'Perfeito para Desafio',
                                        altaMotivacaoParaTransformacaoRapida: 'Alta Motivação',
                                        prontoParaResultadosRapidos: 'Pronto para Resultados',
                                        motivacaoMuitoAlta: 'Motivação Muito Alta'
                                      }
                                      return (
                                        <button
                                          key={key}
                                          onClick={() => {
                                            setDiagnosticoSelecionado7Dias(key)
                                          }}
                                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            diagnosticoAtualId === key
                                              ? 'bg-teal-600 text-white'
                                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                          }`}
                                        >
                                          {labels[key] || key}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                                
                                {/* Diagnóstico Completo - Todas as 7 seções do padrão */}
                                <div className="bg-teal-50 rounded-lg p-6 border-2 border-teal-200">
                                  <div className="bg-white rounded-lg p-4 space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="font-semibold text-gray-900">{diagnosticoSelecionado.diagnostico}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.causaRaiz}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.acaoImediata}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.plano7Dias}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.suplementacao}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.alimentacao}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-700 font-semibold">{diagnosticoSelecionado.proximoPasso}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* CTA para o Cliente fazer o Convite */}
                                <div className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg p-6 border-2 border-teal-300">
                                  <h5 className="font-bold text-gray-900 mb-2 text-center">💬 Próximo Passo</h5>
                                  <p className="text-gray-700 text-center mb-4">
                                    Este diagnóstico mostra que a pessoa está pronta para uma transformação. 
                                    Você pode fazer um convite personalizado para participar do Desafio 7 Dias.
                                  </p>
                                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                                    <p className="text-sm text-gray-600 mb-2"><strong>💡 Sugestão de mensagem:</strong></p>
                                    <p className="text-sm text-gray-700 italic">
                                      "Olá! Vi que você mostrou interesse em resultados rápidos. Tenho um Desafio de 7 Dias 
                                      que pode ser perfeito para você. Quer conhecer mais detalhes?"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Navegação */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  if (etapaPreviewDesafio7Dias > 0 && etapaPreviewDesafio7Dias <= 7) {
                                    setEtapaPreviewDesafio7Dias(etapaPreviewDesafio7Dias - 1)
                                    setRespostasDesafio7Dias(respostasDesafio7Dias.slice(0, -1))
                                  } else if (etapaPreviewDesafio7Dias === 8) {
                                    setEtapaPreviewDesafio7Dias(7)
                                  }
                                }}
                                disabled={etapaPreviewDesafio7Dias === 0}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                              >
                                ← Anterior
                              </button>
                              <div className="flex gap-2">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((etapa) => (
                                  <button
                                    key={etapa}
                                  onClick={() => {
                                    setEtapaPreviewDesafio7Dias(etapa)
                                    if (etapa === 0) {
                                      setRespostasDesafio7Dias([])
                                      setDiagnosticoSelecionado7Dias('')
                                    }
                                  }}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                      etapaPreviewDesafio7Dias === etapa
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {etapa === 0 ? 'Início' : etapa === 8 ? 'Resultado' : etapa}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => {
                                  if (etapaPreviewDesafio7Dias < 7 && etapaPreviewDesafio7Dias > 0) {
                                    // Avançar para próxima pergunta (precisa responder)
                                    // Não faz nada, precisa clicar na opção
                                  } else if (etapaPreviewDesafio7Dias === 7 && respostasDesafio7Dias.length === 7) {
                                    setEtapaPreviewDesafio7Dias(8)
                                  }
                                }}
                                disabled={etapaPreviewDesafio7Dias === 8 || (etapaPreviewDesafio7Dias < 7 && respostasDesafio7Dias.length <= etapaPreviewDesafio7Dias)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700"
                              >
                                Próxima →
                              </button>
                            </div>
                          </div>
                        )
                      }
                      
                      // Desafio 21 Dias - Preview Inline
                      if (isDesafio21Dias) {
                        const diagnosticos = desafio21DiasDiagnosticos.wellness
                        const totalEtapas = 8 // 0=landing, 1-7=perguntas, 8=diagnóstico
                        
                        // Sistema de pontuação: cada opção vale 0-4 pontos (total: 0-28 pontos)
                        // Baseado no SQL: ranges 0-14, 15-21, 22-28
                        const pontosPorOpcao = [0, 1, 2, 3, 4] // Cada pergunta tem 5 opções (0-4 pontos)
                        
                        // Calcular score baseado nas respostas reais
                        const calcularScore = (resps: number[]) => {
                          let score = 0
                          resps.forEach((resp) => {
                            score += pontosPorOpcao[resp] || 0
                          })
                          return score
                        }
                        
                        const scoreAtual = calcularScore(respostasDesafio21Dias)
                        
                        // Determinar diagnóstico baseado no score - 5 faixas diferentes
                        let diagnosticoPadrao = 'altaMotivacaoParaMudanca'
                        if (scoreAtual >= 0 && scoreAtual <= 7) {
                          diagnosticoPadrao = 'motivacaoBaixa'
                        } else if (scoreAtual >= 8 && scoreAtual <= 14) {
                          diagnosticoPadrao = 'prontoParaTransformacao'
                        } else if (scoreAtual >= 15 && scoreAtual <= 18) {
                          diagnosticoPadrao = 'altaMotivacaoParaMudanca'
                        } else if (scoreAtual >= 19 && scoreAtual <= 22) {
                          diagnosticoPadrao = 'motivacaoMuitoAlta'
                        } else if (scoreAtual >= 23 && scoreAtual <= 28) {
                          diagnosticoPadrao = 'perfeitoParaDesafioEstruturado'
                        }
                        
                        // Usar diagnóstico selecionado ou padrão baseado no score
                        const diagnosticoAtualId = diagnosticoSelecionado21Dias || diagnosticoPadrao
                        const diagnosticoSelecionado = diagnosticos[diagnosticoAtualId] || diagnosticos[diagnosticoPadrao]
                        
                        const perguntasDesafio21 = [
                          {
                            id: 1,
                            pergunta: 'Qual é seu principal objetivo nos próximos 21 dias?',
                            descricao: 'Identifique o que mais motiva você',
                            opcoes: ['Emagrecer e perder gordura', 'Ganhar mais energia e disposição', 'Melhorar saúde e bem-estar geral', 'Criar hábitos saudáveis duradouros', 'Transformação completa de vida']
                          },
                          {
                            id: 2,
                            pergunta: 'O que te impede de alcançar seus objetivos hoje?',
                            descricao: 'Entenda os principais obstáculos',
                            opcoes: ['Falta de tempo e organização', 'Falta de conhecimento sobre nutrição', 'Falta de motivação e disciplina', 'Não tenho um plano estruturado', 'Já tentei antes e não consegui']
                          },
                          {
                            id: 3,
                            pergunta: 'Você já tentou fazer mudanças sozinho antes?',
                            descricao: 'Identifique seu nível de experiência',
                            opcoes: ['Nunca tentei de forma séria', 'Tentei algumas vezes sem sucesso', 'Tentei e consegui parcialmente', 'Tentei mas desisti rápido', 'Sempre faço sozinho mas quero algo melhor']
                          },
                          {
                            id: 4,
                            pergunta: 'Quanto tempo por dia você pode dedicar ao seu bem-estar?',
                            descricao: 'Ajuste o desafio à sua rotina',
                            opcoes: ['Menos de 15 minutos', '15-30 minutos', '30-60 minutos', '1-2 horas', 'Mais de 2 horas']
                          },
                          {
                            id: 5,
                            pergunta: 'O que seria mais importante para você ter sucesso?',
                            descricao: 'Identifique suas necessidades',
                            opcoes: ['Um plano claro e estruturado', 'Acompanhamento e suporte', 'Produtos que facilitem o processo', 'Educação sobre nutrição', 'Uma comunidade que me motive']
                          },
                          {
                            id: 6,
                            pergunta: 'Como você se sente sobre sua saúde atual?',
                            descricao: 'Avalie seu estado atual',
                            opcoes: ['Muito insatisfeito, preciso mudar', 'Insatisfeito, mas não sei por onde começar', 'Mais ou menos, pode melhorar', 'Satisfeito, mas quero otimizar', 'Muito satisfeito, quero manter']
                          },
                          {
                            id: 7,
                            pergunta: 'Você está disposto a investir em sua transformação?',
                            descricao: 'Entenda seu nível de comprometimento',
                            opcoes: ['Sim, estou muito comprometido', 'Sim, mas preciso ver resultados primeiro', 'Talvez, depende do investimento', 'Não tenho certeza ainda', 'Prefiro algo gratuito']
                          }
                        ]
                        
                        const responderDesafio21 = (opcaoIndex: number) => {
                          const novasRespostas = [...respostasDesafio21Dias, opcaoIndex]
                          setRespostasDesafio21Dias(novasRespostas)
                          
                          if (etapaPreviewDesafio21Dias < 7) {
                            setEtapaPreviewDesafio21Dias(etapaPreviewDesafio21Dias + 1)
                          } else {
                            setEtapaPreviewDesafio21Dias(8) // Ir para resultado
                          }
                        }
                        
                        return (
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              🎯 Preview do Desafio 21 Dias - "{template.name}"
                            </h3>
                            
                            {etapaPreviewDesafio21Dias === 0 && (
                              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">🚀 Desafio 21 Dias</h4>
                                <p className="text-gray-700 mb-3">{template.description || 'Transforme seus hábitos em 21 dias com um plano completo e personalizado.'}</p>
                                <p className="text-teal-600 font-semibold">✨ Uma jornada completa de transformação que pode mudar sua vida.</p>
                                <button
                                  onClick={() => {
                                    setEtapaPreviewDesafio21Dias(1)
                                    setRespostasDesafio21Dias([])
                                  }}
                                  className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Começar Desafio
                                </button>
                              </div>
                            )}
                            
                            {etapaPreviewDesafio21Dias >= 1 && etapaPreviewDesafio21Dias <= 7 && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm text-gray-500">Pergunta {etapaPreviewDesafio21Dias} de 7</span>
                                  <span className="text-sm text-gray-500">{Math.round((etapaPreviewDesafio21Dias / 7) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                  <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${(etapaPreviewDesafio21Dias / 7) * 100}%` }}></div>
                                </div>
                                
                                {perguntasDesafio21.map((pergunta) => {
                                  if (pergunta.id === etapaPreviewDesafio21Dias) {
                                    return (
                                      <div key={pergunta.id} className="space-y-4">
                                        <div>
                                          <h4 className="text-xl font-bold text-gray-900 mb-2">{pergunta.pergunta}</h4>
                                          {pergunta.descricao && (
                                            <p className="text-sm text-gray-600 mb-4">{pergunta.descricao}</p>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          {pergunta.opcoes.map((opcao, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => responderDesafio21(idx)}
                                              className="w-full text-left flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300 hover:bg-teal-50 transition-colors"
                                            >
                                              <span className="text-gray-700">{opcao}</span>
                                            </button>
                                          ))}
                                        </div>
                                        
                                        {/* Mostrar score atual enquanto responde */}
                                        {respostasDesafio21Dias.length > 0 && (
                                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                              <strong>Score atual:</strong> {scoreAtual} pontos (de 28 possíveis)
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            )}
                            
                            {etapaPreviewDesafio21Dias === 8 && (
                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Todos os Diagnósticos Disponíveis</h4>
                                
                                {/* Mostrar Score Final */}
                                <div className="bg-teal-100 rounded-lg p-4 border-2 border-teal-300 mb-4">
                                  <p className="text-center">
                                    <span className="text-2xl font-bold text-teal-700">{scoreAtual}</span>
                                    <span className="text-gray-600"> / 28 pontos</span>
                                    <span className="block text-sm text-gray-600 mt-2">Diagnóstico selecionado: {diagnosticoAtualId}</span>
                                  </p>
                                </div>

                                {/* Abas para navegar entre todos os diagnósticos */}
                                <div className="border-b border-gray-200 mb-4">
                                  <div className="flex flex-wrap gap-2">
                                    {Object.keys(diagnosticos).map((key) => {
                                      const diagnostico = diagnosticos[key]
                                      const labels: { [key: string]: string } = {
                                        motivacaoBaixa: 'Motivação Baixa',
                                        perfeitoParaDesafioEstruturado: 'Perfeito para Desafio',
                                        altaMotivacaoParaMudanca: 'Alta Motivação',
                                        prontoParaTransformacao: 'Pronto para Transformação',
                                        motivacaoMuitoAlta: 'Motivação Muito Alta'
                                      }
                                      return (
                                        <button
                                          key={key}
                                          onClick={() => {
                                            setDiagnosticoSelecionado21Dias(key)
                                          }}
                                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            diagnosticoAtualId === key
                                              ? 'bg-teal-600 text-white'
                                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                          }`}
                                        >
                                          {labels[key] || key}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                                
                                {/* Diagnóstico Completo - Todas as 7 seções do padrão */}
                                <div className="bg-teal-50 rounded-lg p-6 border-2 border-teal-200">
                                  <div className="bg-white rounded-lg p-4 space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="font-semibold text-gray-900">{diagnosticoSelecionado.diagnostico}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.causaRaiz}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.acaoImediata}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.plano7Dias}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.suplementacao}</p>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                      <p className="text-gray-700">{diagnosticoSelecionado.alimentacao}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-700 font-semibold">{diagnosticoSelecionado.proximoPasso}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* CTA para o Cliente fazer o Convite */}
                                <div className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg p-6 border-2 border-teal-300">
                                  <h5 className="font-bold text-gray-900 mb-2 text-center">💬 Próximo Passo</h5>
                                  <p className="text-gray-700 text-center mb-4">
                                    Este diagnóstico mostra que a pessoa está pronta para uma transformação. 
                                    Você pode fazer um convite personalizado para participar do Desafio 21 Dias.
                                  </p>
                                  <div className="bg-white rounded-lg p-4 border border-teal-200">
                                    <p className="text-sm text-gray-600 mb-2"><strong>💡 Sugestão de mensagem:</strong></p>
                                    <p className="text-sm text-gray-700 italic">
                                      "Olá! Vi que você mostrou interesse em uma transformação completa. Tenho um Desafio de 21 Dias 
                                      que pode ser perfeito para você. Quer conhecer mais detalhes?"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Navegação */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  if (etapaPreviewDesafio21Dias > 0 && etapaPreviewDesafio21Dias <= 7) {
                                    setEtapaPreviewDesafio21Dias(etapaPreviewDesafio21Dias - 1)
                                    setRespostasDesafio21Dias(respostasDesafio21Dias.slice(0, -1))
                                  } else if (etapaPreviewDesafio21Dias === 8) {
                                    setEtapaPreviewDesafio21Dias(7)
                                  }
                                }}
                                disabled={etapaPreviewDesafio21Dias === 0}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                              >
                                ← Anterior
                              </button>
                              <div className="flex gap-2">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((etapa) => (
                                  <button
                                    key={etapa}
                                    onClick={() => {
                                      setEtapaPreviewDesafio21Dias(etapa)
                                      if (etapa === 0) {
                                        setRespostasDesafio21Dias([])
                                        setDiagnosticoSelecionado21Dias('')
                                      }
                                    }}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                      etapaPreviewDesafio21Dias === etapa
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {etapa === 0 ? 'Início' : etapa === 8 ? 'Resultado' : etapa}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => {
                                  if (etapaPreviewDesafio21Dias < 7 && etapaPreviewDesafio21Dias > 0) {
                                    // Avançar para próxima pergunta (precisa responder)
                                    // Não faz nada, precisa clicar na opção
                                  } else if (etapaPreviewDesafio21Dias === 7 && respostasDesafio21Dias.length === 7) {
                                    setEtapaPreviewDesafio21Dias(8)
                                  }
                                }}
                                disabled={etapaPreviewDesafio21Dias === 8 || (etapaPreviewDesafio21Dias < 7 && respostasDesafio21Dias.length <= etapaPreviewDesafio21Dias)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700"
                              >
                                Próxima →
                              </button>
                            </div>
                          </div>
                        )
                      }
                      
                      // Outros Previews - Código existente
                      return (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="text-2xl mr-2">🎯</span>
                            Preview do {template.type === 'calculadora' ? 'Calculadora' : template.type === 'quiz' ? 'Quiz' : 'Planilha'} - "{template.name}"
                          </h3>
                          
                          <div className="relative">
                        {/* Etapa 0: Landing */}
                        {(() => {
                          const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                          const nameCheck = (template.name || '').toLowerCase()
                          const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                               idCheck === 'checklist-alimentar' ||
                                               nameCheck === 'checklist alimentar' ||
                                               nameCheck.includes('checklist alimentar')
                          
                          // Checklist Alimentar usa estado próprio, não mostrar landing genérico aqui
                          if (isAlimentar) {
                            return null // Landing do Checklist Alimentar está dentro da seção específica
                          }
                          
                          // Para outros templates, mostrar landing normal quando etapaPreview === 0
                          if (etapaPreview === 0) {
                            return (
                              <>
                                {(template.id?.toLowerCase().replace(/\s+/g, '-').includes('checklist-detox') || 
                                    template.name?.toLowerCase().includes('checklist detox') || 
                                    template.name?.toLowerCase().includes('detox')) ? (
                                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🧪 {template.name}</h4>
                                    <p className="text-gray-700 mb-4 font-medium">{template.description}</p>
                                    <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
                                      <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
                                      <div className="space-y-2 text-sm text-gray-600">
                                        <p>✓ Identifique sinais de sobrecarga tóxica no seu organismo</p>
                                        <p>✓ Entenda como toxinas podem estar afetando sua energia e saúde</p>
                                        <p>✓ Receba orientações para um processo de detox eficaz</p>
                                      </div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                      <p className="text-sm text-red-800 font-semibold">
                                        ⚠️ <strong>Atenção:</strong> Se você sente cansaço constante, dificuldade para perder peso ou problemas digestivos, pode ser um sinal de que seu corpo precisa de suporte para eliminar toxinas. Descubra agora!
                                      </p>
                                    </div>
                                    <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg">
                                      ▶️ Começar Avaliação - É Grátis
                                    </button>
                                  </div>
                                ) : (
                                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                                    <p className="text-gray-700 mb-4">{template.description}</p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <p>✓ Descubra seu resultado personalizado</p>
                                      <p>✓ Receba recomendações específicas</p>
                                      <p>✓ Obtenha orientações profissionais</p>
                                    </div>
                                    <button className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                                      ▶️ Começar Agora - É Grátis
                                    </button>
                                  </div>
                                )}
                              </>
                            )
                          }
                          
                          return null
                        })()}

                        {/* Formulário Completo - Etapa 1 */}
                        {template.type === 'calculadora' && etapaPreview === 1 && (
                          <>
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Formulário específico para Calculadora de Água (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-blue-900 mb-3">⚖️ Informe seus dados</h4>
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
                                  <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-cyan-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-cyan-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Condições Climáticas */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">🌡️ Condições climáticas (opcional)</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">❄️ Clima frio/temperado</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">☀️ Clima quente/seco</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">🏔️ Altitude elevada</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">🏖️ Clima úmido</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>
                              </div>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Formulário específico para Calculadora de IMC (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-blue-900 mb-3">📏 Informe seus dados</h4>
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
                                  <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Sexo */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">👤 Selecione seu sexo</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="sexo-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">👨 Masculino</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="sexo-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">👩 Feminino</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-orange-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ Nível de atividade física (opcional)</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>
                              </div>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Formulário específico para Calculadora de Calorias (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
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
                                  <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Idade e Sexo */}
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
                                        <option value="">Selecione</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                      </select>
                                    </div>
                                  </div>
                                  <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-yellow-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>

                                {/* Objetivo */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">🎯 Seu objetivo</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">🔥 Emagrecer - Perder peso</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">⚖️ Manter - Peso estável</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">🚀 Ganhar - Aumentar massa</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Motivação</p>
                                </div>
                              </div>
                            ) : template.id === 'proteina' || template.name?.toLowerCase().includes('proteína') || template.name?.toLowerCase().includes('proteina') ? (
                              // Formulário específico para Calculadora de Proteína (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
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
                                  <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-orange-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Objetivo */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-purple-900 mb-3">🎯 Seu objetivo</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                      <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">🔥 Emagrecer - Perder peso</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                      <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">⚖️ Manter - Peso estável</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                      <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                      <span className="text-gray-700">🚀 Ganhar - Aumentar massa</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Motivação</p>
                                </div>
                              </div>
                            ) : (
                              // Formulário genérico para outras calculadoras
                              <div className="bg-white rounded-lg p-6 border-2 border-teal-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Formulário de Dados</h4>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campo 1</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Digite aqui..." disabled />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campo 2</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Digite aqui..." disabled />
                                  </div>
                                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium">
                                    Calcular →
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {template.type === 'quiz' && etapaPreview >= 1 && etapaPreview <= 3 && (
                          <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Pergunta {etapaPreview} de 5</h4>
                            <p className="text-base text-gray-700 mb-4">Esta é uma pergunta de exemplo do quiz?</p>
                            <div className="space-y-2">
                              {['Opção A', 'Opção B', 'Opção C'].map((opcao, idx) => (
                                <label key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                  <input type="radio" className="mr-3" disabled />
                                  <span className="text-gray-700">{opcao}</span>
                                </label>
                              ))}
                            </div>
                            <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-medium">
                              Próxima Pergunta →
                            </button>
                          </div>
                        )}

                        {/* Etapa de Resultado Visual - Etapa 2 */}
                        {template.type === 'calculadora' && etapaPreview === 2 && (
                          <>
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Resultado Visual específico para Calculadora de Água (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Água</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">2.8L</div>
                                    <div className="text-lg font-semibold text-green-600">Água Diária Recomendada</div>
                                    <div className="text-sm text-gray-600">Baseado em 40ml/kg para atividade moderada</div>
                                  </div>
                                  
                                  {/* Distribuição Diária */}
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-gray-800 mb-2">📅 Distribuição Diária:</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🌅 Manhã (6h-12h):</span>
                                        <span className="font-semibold">0.8L</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>☀️ Tarde (12h-18h):</span>
                                        <span className="font-semibold">1.2L</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🌙 Noite (18h-24h):</span>
                                        <span className="font-semibold">0.8L</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Escala Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-red-500 rounded-full" style={{width: '25%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-yellow-500 rounded-full" style={{width: '50%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '25%'}}></div>
                                  </div>
                                  
                                  {/* Legendas */}
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-red-600 font-semibold">Baixa</div>
                                      <div className="text-gray-600">&lt; 2L/dia</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-yellow-600 font-semibold">Moderada</div>
                                      <div className="text-gray-600">2-3L/dia</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-green-600 font-semibold">Alta</div>
                                      <div className="text-gray-600">&gt; 3L/dia</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Resultado Visual específico para Calculadora de IMC (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado Visual do IMC</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">IMC: 22.9</div>
                                    <div className="text-lg font-semibold text-green-600">Peso Normal</div>
                                    <div className="text-sm text-gray-600">Faixa: 18.5 - 24.9</div>
                                  </div>
                                  
                                  {/* Barra Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '35%'}}></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Resultado Visual específico para Calculadora de Calorias (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Calorias</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">2.200</div>
                                    <div className="text-lg font-semibold text-green-600">Calorias Diárias Recomendadas</div>
                                    <div className="text-sm text-gray-600">Baseado em TMB + atividade física para manutenção</div>
                                  </div>
                                  
                                  {/* Distribuição de Macronutrientes */}
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-gray-800 mb-2">🥗 Distribuição de Macronutrientes:</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🥩 Proteínas (25%):</span>
                                        <span className="font-semibold">550 cal (137g)</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🍞 Carboidratos (50%):</span>
                                        <span className="font-semibold">1.100 cal (275g)</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🥑 Gorduras (25%):</span>
                                        <span className="font-semibold">550 cal (61g)</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Escala Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-blue-500 rounded-full" style={{width: '30%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '40%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-yellow-500 rounded-full" style={{width: '30%'}}></div>
                                  </div>
                                  
                                  {/* Legendas */}
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-blue-600 font-semibold">Déficit</div>
                                      <div className="text-gray-600">Perda de peso</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-green-600 font-semibold">Manutenção</div>
                                      <div className="text-gray-600">Peso estável</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-yellow-600 font-semibold">Superávit</div>
                                      <div className="text-gray-600">Ganho de peso</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'proteina' || template.name?.toLowerCase().includes('proteína') || template.name?.toLowerCase().includes('proteina') ? (
                              // Resultado Visual específico para Calculadora de Proteína
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Proteína</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">120g</div>
                                    <div className="text-lg font-semibold text-green-600">Proteína Diária Recomendada</div>
                                    <div className="text-sm text-gray-600">Baseado em 1.6g/kg para atividade moderada</div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : (
                              // Resultado genérico para outras calculadoras
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-teal-600 mb-2">Resultado</div>
                                    <div className="text-lg font-semibold text-gray-600">Análise completa</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Etapa de Resultado para Quiz */}
                        {template.type === 'quiz' && etapaPreview === 4 && (
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-6 border-4 border-purple-200 shadow-lg">
                              <div className="text-center mb-6">
                                <div className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-lg mb-4">
                                  Perfil Moderado
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">Score: 8/12</h4>
                                <p className="text-gray-600">Seu resultado mostra potencial para melhoria</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-6">
                                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                                  <span className="text-xl mr-2">💡</span>
                                  Recomendações
                                </h5>
                                <ul className="space-y-2">
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Implemente pequenas mudanças gradativamente</span>
                                  </li>
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Estabeleça metas específicas e mensuráveis</span>
                                  </li>
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Busque orientação profissional para acelerar resultados</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Etapa de Diagnóstico Completo - Etapa 3 (todos os diagnósticos possíveis) */}
                        {template.type === 'calculadora' && etapaPreview === 3 && (
                          <div className="space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                            
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Água
                              <>
                                {/* Resultado 1: Baixa Hidratação */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">💧 Baixa Hidratação</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 2L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.wellness.baixaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.wellness.baixaHidratacao.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Hidratação Moderada */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">⚖️ Hidratação Moderada</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">2-3L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.wellness.hidratacaoModerada.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Alta Hidratação */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">🚀 Alta Hidratação</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 3L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.wellness.altaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.wellness.altaHidratacao.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Todos os diagnósticos possíveis para Calculadora de IMC
                              <>
                                {/* Resultado 1: Baixo Peso */}
                                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-blue-900">📉 Baixo Peso</h5>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 18.5</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.wellness.baixoPeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.baixoPeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.baixoPeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.baixoPeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.baixoPeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.baixoPeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.wellness.baixoPeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.wellness.baixoPeso.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Peso Normal */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Peso Normal</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">18.5 - 24.9</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.wellness.pesoNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.pesoNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.pesoNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.pesoNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.pesoNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.pesoNormal.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.wellness.pesoNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.wellness.pesoNormal.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Sobrepeso */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">📈 Sobrepeso</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">25.0 - 29.9</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.wellness.sobrepeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.sobrepeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.sobrepeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.sobrepeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.sobrepeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.sobrepeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.wellness.sobrepeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.wellness.sobrepeso.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 4: Obesidade */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">⚠️ Obesidade</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">≥ 30.0</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.wellness.obesidade.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.obesidade.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.obesidade.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.obesidade.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.obesidade.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.wellness.obesidade.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.wellness.obesidade.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.wellness.obesidade.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Calorias
                              <>
                                {/* Resultado 1: Déficit Calórico */}
                                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-blue-900">🔥 Déficit Calórico</h5>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Perda de peso</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.wellness.deficitCalorico.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Manutenção Calórica */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Manutenção Calórica</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Peso estável</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Superávit Calórico */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">🚀 Superávit Calórico</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Ganho de peso</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.wellness.superavitCalorico.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'proteina' || template.name?.toLowerCase().includes('proteína') || template.name?.toLowerCase().includes('proteina') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Proteína
                              <>
                                {/* Resultado 1: Baixa Proteína */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">📉 Baixa Proteína</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 1.0g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.wellness.baixaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.wellness.baixaProteina.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Proteína Normal */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Proteína Normal</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">1.0 - 1.6g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.wellness.proteinaNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.wellness.proteinaNormal.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Alta Proteína */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">📈 Alta Proteína</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 1.6g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.wellness.altaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.altaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.altaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.altaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.altaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.wellness.altaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.wellness.altaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.wellness.altaProteina.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        )}

                        {/* Etapa de CTA (apenas para quizzes) */}
                        {template.type === 'quiz' && etapaPreview === 5 && (
                          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border-2 border-teal-200">
                            <div className="text-center">
                              <p className="text-gray-700 font-medium mb-4">
                                💬 Quer orientações personalizadas para alcançar seu objetivo?
                              </p>
                              <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg">
                                📱 Falar no WhatsApp
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Planilha: Etapa de Conteúdo - Outros tipos (Checklists agora são modulares) */}
                        {(() => {
                          const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                          const nameCheck = (template.name || '').toLowerCase()
                          const isChecklist = template.type === 'planilha' && (nameCheck.includes('checklist') || nameCheck.includes('alimentar') || nameCheck.includes('detox'))
                          const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                               idCheck === 'checklist-alimentar' ||
                                               nameCheck === 'checklist alimentar' ||
                                               nameCheck.includes('checklist alimentar')
                          const isDetox = idCheck.includes('checklist-detox') || 
                                         nameCheck.includes('checklist detox')
                          
                          // Checklists agora são modulares, não renderizar aqui
                          if (isAlimentar || isDetox) {
                            return false
                          }
                          
                          // Outros tipos de planilha usam etapaPreview normal
                          return isChecklist && etapaPreview >= 1 && etapaPreview <= 4
                        })() && (
                          <>
                            {/* Outras Planilhas Genéricas - Checklists agora são modulares */}
                            {(() => {
                              const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                              const nameCheck = (template.name || '').toLowerCase()
                              const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                                   nameCheck.includes('checklist alimentar')
                              const isDetox = idCheck.includes('checklist-detox') || 
                                             nameCheck.includes('checklist detox')
                              
                              // Checklists agora são modulares, não renderizar aqui
                              if (isAlimentar || isDetox) {
                                return false
                              }
                              
                              return etapaPreview === 1
                            })() && (
                              <div className="bg-white rounded-lg p-6 border-2 border-teal-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Conteúdo da Planilha</h4>
                                <div className="space-y-3">
                                  {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, idx) => (
                                    <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                      <input type="checkbox" className="mr-3" disabled />
                                      <span className="text-gray-700">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Navegação por Etapas - Só mostrar se NÃO for componente modular */}
                      {(() => {
                        const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                        const nameCheck = (template.name || '').toLowerCase()
                        const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                             idCheck === 'checklist-alimentar' ||
                                             nameCheck === 'checklist alimentar' ||
                                             nameCheck.includes('checklist alimentar')
                        const isDetox = idCheck.includes('checklist-detox') || 
                                       nameCheck.includes('checklist detox')
                        const isQuiz = isQuizInterativo || isQuizBemEstar || isQuizPerfilNutricional || isQuizDetox || isQuizEnergetico
                        const isGuia = isGuiaHidratacao
                        const isDesafio = isDesafio7Dias || isDesafio21Dias
                        
                        // Componentes modulares têm sua própria navegação, não mostrar a genérica
                        if (isAlimentar || isDetox || isQuiz || isGuia || isDesafio) {
                          return null
                        }
                        
                        return (
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                            <button
                              onClick={() => setEtapaPreview(Math.max(0, etapaPreview - 1))}
                              disabled={etapaPreview === 0}
                              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ← Anterior
                            </button>

                            <div className="flex flex-wrap gap-2 justify-center">
                              {Array.from({ length: totalEtapas }, (_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setEtapaPreview(i)}
                                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                    etapaPreview === i
                                      ? 'bg-teal-600 text-white shadow-md'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  title={etapasLabels[i] || `Etapa ${i + 1}`}
                                >
                                  {etapasLabels[i] || `${i + 1}`}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => setEtapaPreview(Math.min(totalEtapas - 1, etapaPreview + 1))}
                              disabled={etapaPreview === totalEtapas - 1}
                              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Próxima →
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                })()}
              </div>

              {/* Footer do Modal */}
              <div className="bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setTemplatePreviewAberto(null)
                    setEtapaPreview(0)
                    setEtapaPreviewChecklistAlimentar(0)
                    setEtapaPreviewChecklistDetox(0)
                    setEtapaPreviewQuizInterativo(0)
                    setEtapaPreviewQuizBemEstar(0)
                    setEtapaPreviewQuizPerfilNutricional(0)
                    setEtapaPreviewQuizDetox(0)
                    setEtapaPreviewQuizEnergetico(0)
                    setEtapaPreviewGuiaHidratacao(0)
                    setEtapaPreviewDesafio7Dias(0)
                    setEtapaPreviewDesafio21Dias(0)
                    setRespostasDesafio7Dias([])
                    setRespostasDesafio21Dias([])
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Fechar
                </button>
                <Link
                  href={template.link}
                  onClick={() => {
                    setTemplatePreviewAberto(null)
                    setEtapaPreview(0)
                  }}
                  className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Criar Meu Link
                </Link>
              </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
