'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain, DollarSign, TrendingUp, Star, Zap, UtensilsCrossed, Search } from 'lucide-react'
import { calculadoraAguaDiagnosticos, calculadoraImcDiagnosticos, calculadoraProteinaDiagnosticos, calculadoraCaloriasDiagnosticos, checklistAlimentarDiagnosticos } from '@/lib/diagnosticos-nutri'
import { desafio21DiasDiagnosticos } from '@/lib/diagnostics/wellness/desafio-21-dias'

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
  const [etapaPreviewDesafio21Dias, setEtapaPreviewDesafio21Dias] = useState(0) // Para desafio-21-dias: 0 = landing, 1-5 = perguntas de conscientização, 6 = resultados

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
      id: 'daily-wellness',
      name: 'Tabela: Bem-Estar Diário',
      description: 'Acompanhe métricas de bem-estar diárias',
      icon: FileText,
      type: 'planilha',
      category: 'Acompanhamento',
      link: '/pt/wellness/templates/daily-wellness',
      color: 'bg-teal-500'
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
            const templatesFormatados = data.templates.map((t: any) => {
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
                        onClick={() => {
                          setTemplatePreviewAberto(template.id)
                          setEtapaPreview(0)
                          setEtapaPreviewChecklistAlimentar(0)
                          setEtapaPreviewDesafio21Dias(0)
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => {
          setTemplatePreviewAberto(null)
          setEtapaPreview(0)
          setEtapaPreviewChecklistAlimentar(0)
          setEtapaPreviewDesafio21Dias(0)
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
              
              // Detecção do Desafio 21 Dias
              const isDesafio21 = templateIdLower.includes('desafio-21') || 
                                   templateIdLower.includes('21-dias') ||
                                   templateNameLower.includes('21 dias') ||
                                   templateNameLower.includes('desafio 21')
              
              // Log para debug
              if (templateNameLower.includes('checklist') || templateNameLower.includes('alimentar') || templateNameLower.includes('detox') || isDesafio21) {
                console.log('🔍 DEBUG Template Detecção:', {
                  id: template.id,
                  idLower: templateIdLower,
                  name: template.name,
                  nameLower: templateNameLower,
                  type: template.type,
                  isAlimentar,
                  isDetox,
                  isChecklist,
                  isDesafio21,
                  totalEtapasCalculado: template.type === 'calculadora' ? 4 : template.type === 'quiz' ? 6 : isChecklist ? 5 : isDesafio21 ? 3 : 2
                })
              }
              
              // Checklist Alimentar tem 7 etapas (0=landing, 1-5=perguntas, 6=resultados)
              // Desafio 21 Dias tem 7 etapas (0=landing, 1-5=perguntas de conscientização, 6=resultados)
              const totalEtapas = template.type === 'calculadora' ? 4 
                : template.type === 'quiz' ? 6 
                : isAlimentar ? 7 // Checklist Alimentar: 0=landing, 1-5=perguntas, 6=resultados
                : isDesafio21 ? 7 // Desafio 21 Dias: 0=landing, 1-5=perguntas conscientização, 6=resultados
                : isChecklist ? 5 // Outros checklists: Landing (0) + 3 perguntas (1-3) + Resultado (4)
                : 2
              const etapasLabels = template.type === 'calculadora' 
                ? ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                : template.type === 'quiz'
                ? ['Início', 'Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Resultado', 'CTA']
                : isAlimentar
                ? ['Início', '1', '2', '3', '4', '5', 'Resultados'] // Checklist Alimentar: 7 etapas
                : isDesafio21
                ? ['Início', '1', '2', '3', '4', '5', 'Resultados'] // Desafio 21 Dias: 7 etapas
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
                          setEtapaPreviewDesafio21Dias(0)
                        }}
                        className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Preview */}
                  <div className="flex-1 overflow-y-auto p-6 pb-24">
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
                          const isDesafio21 = idCheck.includes('desafio-21') || 
                                               idCheck.includes('21-dias') ||
                                               nameCheck.includes('21 dias') ||
                                               nameCheck.includes('desafio 21')
                          
                          // Checklist Alimentar e Desafio 21 Dias usam estados próprios, não mostrar landing genérico aqui
                          if (isAlimentar || isDesafio21) {
                            return null // Landing específico está dentro da seção específica
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
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.baixoPeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.pesoNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.sobrepeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.obesidade.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso}</p>
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
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.altaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso}</p>
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

                        {/* Preview Desafio 21 Dias */}
                        {(() => {
                          const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                          const nameCheck = (template.name || '').toLowerCase()
                          const isDesafio21 = idCheck.includes('desafio-21') || 
                                               idCheck.includes('21-dias') ||
                                               nameCheck.includes('21 dias') ||
                                               nameCheck.includes('desafio 21')
                          
                          if (!isDesafio21) return null
                          
                          return (
                            <>
                              {/* Landing - Etapa 0 */}
                              {etapaPreviewDesafio21Dias === 0 && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">🤔 Você está pronto para uma transformação real?</h4>
                                  <p className="text-gray-700 mb-4 font-medium">Descubra através de perguntas estratégicas se você tem o que precisa para alcançar seus objetivos de bem-estar e saúde.</p>
                                  <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                                    <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <p>✓ Se você tem clareza sobre seus objetivos</p>
                                      <p>✓ Quais são seus principais obstáculos</p>
                                      <p>✓ Se você já tentou mudanças sozinho</p>
                                      <p>✓ O que você realmente precisa para ter sucesso</p>
                                    </div>
                                  </div>
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-green-800 font-semibold">
                                      🧠 <strong>Conscientização:</strong> Responda as perguntas com honestidade e descubra o que pode estar impedindo você de alcançar seus objetivos de bem-estar.
                                    </p>
                                  </div>
                                  <button className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg">
                                    ▶️ Descobrir Agora - É Grátis
                                  </button>
                                </div>
                              )}

                              {/* Perguntas de Conscientização - Etapas 1-5 */}
                              {etapaPreviewDesafio21Dias >= 1 && etapaPreviewDesafio21Dias <= 5 && (
                                <div className="space-y-6">
                                  {etapaPreviewDesafio21Dias === 1 && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-green-900 mb-3">🎯 1. Qual é seu principal objetivo nos próximos 21 dias?</h4>
                                      <p className="text-sm text-green-700 mb-4">Identifique o que mais motiva você</p>
                                      <div className="space-y-2">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                          <input type="radio" name="objetivo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Emagrecer e perder gordura</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                          <input type="radio" name="objetivo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Ganhar mais energia e disposição</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                          <input type="radio" name="objetivo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Melhorar saúde e bem-estar geral</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                          <input type="radio" name="objetivo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Criar hábitos saudáveis duradouros</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                          <input type="radio" name="objetivo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Transformação completa de vida</span>
                                        </label>
                                      </div>
                                      <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Conscientização de objetivos</p>
                                    </div>
                                  )}

                                  {etapaPreviewDesafio21Dias === 2 && (
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-emerald-900 mb-3">🚧 2. O que te impede de alcançar seus objetivos hoje?</h4>
                                      <p className="text-sm text-emerald-700 mb-4">Entenda os principais obstáculos</p>
                                      <div className="space-y-2">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                          <input type="radio" name="obstaculo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Falta de tempo e organização</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                          <input type="radio" name="obstaculo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Falta de conhecimento sobre nutrição</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                          <input type="radio" name="obstaculo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Falta de motivação e disciplina</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                          <input type="radio" name="obstaculo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Não tenho um plano estruturado</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                          <input type="radio" name="obstaculo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Já tentei antes e não consegui</span>
                                        </label>
                                      </div>
                                      <p className="text-xs text-emerald-600 mt-2">🧠 Gatilho: Conscientização de barreiras</p>
                                    </div>
                                  )}

                                  {etapaPreviewDesafio21Dias === 3 && (
                                    <div className="bg-teal-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-teal-900 mb-3">🔄 3. Você já tentou fazer mudanças sozinho antes?</h4>
                                      <p className="text-sm text-teal-700 mb-4">Identifique seu nível de experiência</p>
                                      <div className="space-y-2">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                          <input type="radio" name="experiencia-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Nunca tentei de forma séria</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                          <input type="radio" name="experiencia-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Tentei algumas vezes sem sucesso</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                          <input type="radio" name="experiencia-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Tentei e consegui parcialmente</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                          <input type="radio" name="experiencia-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Tentei mas desisti rápido</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                          <input type="radio" name="experiencia-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Sempre faço sozinho mas quero algo melhor</span>
                                        </label>
                                      </div>
                                      <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Conscientização de tentativas anteriores</p>
                                    </div>
                                  )}

                                  {etapaPreviewDesafio21Dias === 4 && (
                                    <div className="bg-cyan-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-cyan-900 mb-3">⏰ 4. Quanto tempo por dia você pode dedicar ao seu bem-estar?</h4>
                                      <p className="text-sm text-cyan-700 mb-4">Ajuste o desafio à sua rotina</p>
                                      <div className="space-y-2">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                          <input type="radio" name="tempo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Menos de 15 minutos</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                          <input type="radio" name="tempo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">15-30 minutos</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                          <input type="radio" name="tempo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">30-60 minutos</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                          <input type="radio" name="tempo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">1-2 horas</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                          <input type="radio" name="tempo-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Mais de 2 horas</span>
                                        </label>
                                      </div>
                                      <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Conscientização de disponibilidade</p>
                                    </div>
                                  )}

                                  {etapaPreviewDesafio21Dias === 5 && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-900 mb-3">💡 5. O que seria mais importante para você ter sucesso?</h4>
                                      <p className="text-sm text-blue-700 mb-4">Identifique o que você precisa</p>
                                      <div className="space-y-2">
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                          <input type="radio" name="sucesso-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Um plano claro e estruturado</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                          <input type="radio" name="sucesso-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Acompanhamento e suporte contínuo</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                          <input type="radio" name="sucesso-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Produtos que facilitem o processo</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                          <input type="radio" name="sucesso-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Motivação e responsabilização</span>
                                        </label>
                                        <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                          <input type="radio" name="sucesso-desafio-21" className="mr-3" disabled />
                                          <span className="text-gray-700">Tudo isso junto - um programa completo</span>
                                        </label>
                                      </div>
                                      <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Conscientização de necessidades</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Resultados - Etapa 6 */}
                              {etapaPreviewDesafio21Dias === 6 && (
                                <div className="space-y-6">
                                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Desafio 21 Dias</h4>
                                  
                                  {/* Resultado 1: Pronto para Transformação */}
                                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                    <div className="flex items-center justify-between mb-4">
                                      <h5 className="text-lg font-bold text-green-900">🎯 Pronto para Transformação</h5>
                                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Alta Motivação</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 space-y-2">
                                      <p className="font-semibold text-gray-900">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.diagnostico}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.causaRaiz}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.acaoImediata}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.plano7Dias}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.suplementacao}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.alimentacao}</p>
                                      {desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.proximoPasso && (
                                        <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{desafio21DiasDiagnosticos.wellness.prontoParaTransformacao.proximoPasso}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Resultado 2: Alta Motivação */}
                                  <div className="bg-emerald-50 rounded-lg p-6 border-2 border-emerald-200">
                                    <div className="flex items-center justify-between mb-4">
                                      <h5 className="text-lg font-bold text-emerald-900">⚡ Alta Motivação para Mudança</h5>
                                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Muito Motivado</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 space-y-2">
                                      <p className="font-semibold text-gray-900">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.diagnostico}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.causaRaiz}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.acaoImediata}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.plano7Dias}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.suplementacao}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.alimentacao}</p>
                                      {desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.proximoPasso && (
                                        <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{desafio21DiasDiagnosticos.wellness.altaMotivacaoParaMudanca.proximoPasso}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Resultado 3: Perfeito para Desafio Estruturado */}
                                  <div className="bg-teal-50 rounded-lg p-6 border-2 border-teal-200">
                                    <div className="flex items-center justify-between mb-4">
                                      <h5 className="text-lg font-bold text-teal-900">📋 Perfeito para Desafio Estruturado</h5>
                                      <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Precisa de Estrutura</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 space-y-2">
                                      <p className="font-semibold text-gray-900">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.diagnostico}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.causaRaiz}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.acaoImediata}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.plano7Dias}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.suplementacao}</p>
                                      <p className="text-gray-700">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.alimentacao}</p>
                                      {desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.proximoPasso && (
                                        <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{desafio21DiasDiagnosticos.wellness.perfeitoParaDesafioEstruturado.proximoPasso}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Navegação do Desafio 21 Dias */}
                              {isDesafio21 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewDesafio21Dias(Math.max(0, etapaPreviewDesafio21Dias - 1))}
                                    disabled={etapaPreviewDesafio21Dias === 0}
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
                                          onClick={() => setEtapaPreviewDesafio21Dias(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewDesafio21Dias === etapa
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
                                    onClick={() => setEtapaPreviewDesafio21Dias(Math.min(6, etapaPreviewDesafio21Dias + 1))}
                                    disabled={etapaPreviewDesafio21Dias === 6}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              )}
                            </>
                          )
                        })()}

                        {/* Planilha: Etapa de Conteúdo - Checklists */}
                        {(() => {
                          const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                          const nameCheck = (template.name || '').toLowerCase()
                          const isChecklist = template.type === 'planilha' && (nameCheck.includes('checklist') || nameCheck.includes('alimentar') || nameCheck.includes('detox'))
                          const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                               idCheck === 'checklist-alimentar' ||
                                               nameCheck === 'checklist alimentar' ||
                                               nameCheck.includes('checklist alimentar') ||
                                               (nameCheck.includes('checklist') && nameCheck.includes('alimentar'))
                          
                          // Checklist Alimentar usa estado próprio e não precisa da condição genérica
                          if (isAlimentar) {
                            return true // Sempre renderizar, pois o estado interno controla a visibilidade
                          }
                          
                          // Outros checklists usam etapaPreview normal
                          return isChecklist && etapaPreview >= 1 && etapaPreview <= 4
                        })() && (
                          <>
                            {/* Checklist Alimentar - Estrutura EXATA da Nutri */}
                            {(() => {
                              const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                              const nameCheck = (template.name || '').toLowerCase()
                              
                              const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                                   idCheck === 'checklist-alimentar' ||
                                                   nameCheck === 'checklist alimentar' ||
                                                   nameCheck.includes('checklist alimentar') ||
                                                   (nameCheck.includes('checklist') && nameCheck.includes('alimentar'))
                              
                              return isAlimentar
                            })() && (
                              <>
                                {/* Tela de Abertura - Etapa 0 */}
                                {etapaPreviewChecklistAlimentar === 0 && (
                                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">🍽️ Avalie Seus Hábitos Alimentares</h4>
                                    <p className="text-gray-700 mb-3">Descubra como está sua alimentação e receba orientações personalizadas para melhorar seus hábitos alimentares baseadas em sua rotina atual.</p>
                                    <p className="text-teal-600 font-semibold">💪 Uma avaliação que pode transformar sua relação com a comida.</p>
                                  </div>
                                )}

                                {/* Perguntas 1-5 - Navegação com setinhas */}
                                {etapaPreviewChecklistAlimentar >= 1 && etapaPreviewChecklistAlimentar <= 5 && (
                                  <div className="space-y-6">
                                    {etapaPreviewChecklistAlimentar === 1 && (
                                      <div className="bg-teal-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-teal-900 mb-3">🥗 1. Quantas refeições você faz por dia?</h4>
                                        <div className="space-y-2">
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                            <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">5-6 refeições pequenas</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                            <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">3-4 refeições principais</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                            <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">1-2 refeições por dia</span>
                                          </label>
                                        </div>
                                        <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência alimentar</p>
                                      </div>
                                    )}

                                    {etapaPreviewChecklistAlimentar === 2 && (
                                      <div className="bg-emerald-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-emerald-900 mb-3">🥕 2. Quantos vegetais você consome por dia?</h4>
                                        <div className="space-y-2">
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                            <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">5+ porções de vegetais</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                            <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">3-4 porções de vegetais</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                            <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Menos de 3 porções de vegetais</span>
                                          </label>
                                        </div>
                                        <p className="text-xs text-emerald-600 mt-2">🧠 Gatilho: Consciência nutricional</p>
                                      </div>
                                    )}

                                    {etapaPreviewChecklistAlimentar === 3 && (
                                      <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-3">🍎 3. Quantas frutas você consome por dia?</h4>
                                        <div className="space-y-2">
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                            <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">3+ porções de frutas</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                            <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">1-2 porções de frutas</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                            <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Raramente como frutas</span>
                                          </label>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Consciência de micronutrientes</p>
                                      </div>
                                    )}

                                    {etapaPreviewChecklistAlimentar === 4 && (
                                      <div className="bg-cyan-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-cyan-900 mb-3">🍔 4. Com que frequência você come alimentos processados?</h4>
                                        <div className="space-y-2">
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                            <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Raramente como processados</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                            <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Às vezes como processados</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                            <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Frequentemente como processados</span>
                                          </label>
                                        </div>
                                        <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência de qualidade</p>
                                      </div>
                                    )}

                                    {etapaPreviewChecklistAlimentar === 5 && (
                                      <div className="bg-sky-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-sky-900 mb-3">💧 5. Como está sua hidratação?</h4>
                                        <div className="space-y-2">
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                            <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Bebo 2-3L de água por dia</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                            <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Bebo 1-2L de água por dia</span>
                                          </label>
                                          <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                            <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                            <span className="text-gray-700">Bebo menos de 1L de água por dia</span>
                                          </label>
                                        </div>
                                        <p className="text-xs text-sky-600 mt-2">🧠 Gatilho: Consciência hidratacional</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Tela de Resultados - Etapa 6 */}
                                {etapaPreviewChecklistAlimentar === 6 && (
                                  <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Checklist</h4>
                                    
                                    {/* Resultado 1: Alimentação Deficiente */}
                                    <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                      <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-lg font-bold text-red-900">📉 Alimentação Deficiente</h5>
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-40 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-4 space-y-2">
                                        <p className="font-semibold text-gray-900">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.diagnostico}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.causaRaiz}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.acaoImediata}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.plano7Dias}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.suplementacao}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.alimentacao}</p>
                                        {checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.proximoPasso && (
                                          <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Resultado 2: Alimentação Moderada */}
                                    <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                      <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-lg font-bold text-yellow-900">⚠️ Alimentação Moderada</h5>
                                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">41-70 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-4 space-y-2">
                                        <p className="font-semibold text-gray-900">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.diagnostico}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.causaRaiz}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.acaoImediata}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.plano7Dias}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.suplementacao}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.alimentacao}</p>
                                        {checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.proximoPasso && (
                                          <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Resultado 3: Alimentação Equilibrada */}
                                    <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                      <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-lg font-bold text-green-900">✅ Alimentação Equilibrada</h5>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">71-100 pontos</span>
                                      </div>
                                      <div className="bg-white rounded-lg p-4 space-y-2">
                                        <p className="font-semibold text-gray-900">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.diagnostico}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.causaRaiz}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.acaoImediata}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.plano7Dias}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.suplementacao}</p>
                                        <p className="text-gray-700">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.alimentacao}</p>
                                        {checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.proximoPasso && (
                                          <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.proximoPasso}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Navegação com Setinhas - Checklist Alimentar */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                  <button
                                    onClick={() => setEtapaPreviewChecklistAlimentar(Math.max(0, etapaPreviewChecklistAlimentar - 1))}
                                    disabled={etapaPreviewChecklistAlimentar === 0}
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
                                          onClick={() => setEtapaPreviewChecklistAlimentar(etapa)}
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            etapaPreviewChecklistAlimentar === etapa
                                              ? 'bg-teal-600 text-white'
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
                                    onClick={() => setEtapaPreviewChecklistAlimentar(Math.min(6, etapaPreviewChecklistAlimentar + 1))}
                                    disabled={etapaPreviewChecklistAlimentar === 6}
                                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Próxima →
                                  </button>
                                </div>
                              </>
                            )}

                            {/* Checklist Detox */}
                            {(() => {
                              const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-')
                              const nameCheck = (template.name || '').toLowerCase()
                              const isDetox = idCheck.includes('checklist-detox') || 
                                             nameCheck.includes('checklist detox') || 
                                             nameCheck.includes('detox')
                              
                              return isDetox
                            })() && (
                              <>
                                {etapaPreview === 1 && (
                                  <div className="space-y-4">
                                    <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Pergunta 1 de 10</span>
                                        <span className="text-xs text-purple-700 font-medium">Avaliação de Sinais</span>
                                      </div>
                                      <h4 className="font-semibold text-purple-900 mb-2 text-lg">Você se sente cansado mesmo após dormir bem?</h4>
                                      <p className="text-sm text-purple-700 mb-4">Cansaço persistente pode indicar sobrecarga tóxica</p>
                                      <div className="space-y-2">
                                        {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((opcao, idx) => (
                                          <label key={idx} className="flex items-center p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                                            <input type="radio" name="checklist-detox-1" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs text-red-800">
                                          ⚠️ <strong>Atenção:</strong> Se você respondeu "Frequentemente" ou "Sempre", seu corpo pode estar pedindo ajuda para eliminar toxinas. Considere buscar orientação profissional para um processo de desintoxicação guiado e seguro.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {etapaPreview === 2 && (
                                  <div className="space-y-4">
                                    <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Pergunta 2 de 10</span>
                                      </div>
                                      <h4 className="font-semibold text-purple-900 mb-2 text-lg">Você tem dificuldade para perder peso mesmo com dieta?</h4>
                                      <p className="text-sm text-purple-700 mb-4">Metabolismo pode estar comprometido por toxinas</p>
                                      <div className="space-y-2">
                                        {['Não tenho dificuldade', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre tenho dificuldade'].map((opcao, idx) => (
                                          <label key={idx} className="flex items-center p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                                            <input type="radio" name="checklist-detox-2" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs text-red-800">
                                          ⚠️ <strong>Alerta:</strong> Se você tem dificuldade para perder peso mesmo com dieta, pode ser que seu organismo esteja sobrecarregado com toxinas. Considere buscar orientação profissional para um processo de desintoxicação guiado e personalizado.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {etapaPreview === 3 && (
                                  <div className="space-y-4">
                                    <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Pergunta 3 de 10</span>
                                      </div>
                                      <h4 className="font-semibold text-purple-900 mb-2 text-lg">Você tem problemas digestivos frequentes (constipação, gases)?</h4>
                                      <p className="text-sm text-purple-700 mb-4">Digestão comprometida pode indicar toxinas no trato digestivo</p>
                                      <div className="space-y-2">
                                        {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((opcao, idx) => (
                                          <label key={idx} className="flex items-center p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                                            <input type="radio" name="checklist-detox-3" className="mr-3" disabled />
                                            <span className="text-gray-700">{opcao}</span>
                                          </label>
                                        ))}
                                      </div>
                                      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <p className="text-xs text-orange-800">
                                          🎯 <strong>Importante:</strong> Problemas digestivos frequentes podem estar impedindo seu organismo de eliminar toxinas adequadamente. Considere incluir mais fibras, probióticos e água na sua alimentação para melhorar a digestão.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {etapaPreview === 4 && (
                                  // Resultado Checklist Detox
                                  <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                                      <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Seu Resultado: Toxicidade Moderada</h4>
                                      <div className="bg-white rounded-lg p-5 mb-4 border border-purple-200">
                                        <div className="text-center mb-4">
                                          <div className="text-4xl font-bold text-orange-600 mb-2">28 pontos</div>
                                          <div className="text-lg font-semibold text-gray-700">de 50 pontos possíveis</div>
                                        </div>
                                        <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                          <div className="absolute left-0 top-0 h-6 bg-orange-500 rounded-full" style={{width: '56%'}}></div>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                          <p className="text-sm text-gray-700 mb-2"><strong>Análise:</strong></p>
                                          <p className="text-sm text-gray-600">Sinais de acúmulo tóxico moderado que precisam de intervenção. Seu organismo está mostrando sinais de que precisa de suporte para eliminar toxinas adequadamente.</p>
                                        </div>
                                      </div>
                                      
                                      <div className="bg-white rounded-lg p-5 border border-purple-200 mb-4">
                                        <h5 className="font-semibold text-gray-900 mb-3">⚠️ Sinais Identificados:</h5>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                          <li className="flex items-start">
                                            <span className="text-orange-600 mr-2">•</span>
                                            <span>Cansaço persistente mesmo após descanso adequado</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="text-orange-600 mr-2">•</span>
                                            <span>Dificuldade para perder peso mesmo com dieta</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="text-orange-600 mr-2">•</span>
                                            <span>Problemas digestivos frequentes</span>
                                          </li>
                                        </ul>
                                      </div>

                                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-200 mb-4">
                                        <h5 className="font-bold text-lg mb-3 text-center text-gray-900">💡 Próximos Passos Recomendados:</h5>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                          <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            <span><strong>Implementar</strong> estratégias para apoiar a desintoxicação natural do organismo</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            <span><strong>Buscar</strong> orientação profissional para criar um plano de detox personalizado</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            <span><strong>Acompanhar</strong> seu progresso e ajustar estratégias conforme necessário</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Outras Planilhas Genéricas - Só mostrar se NÃO for nenhum checklist */}
                            {(() => {
                              const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-')
                              const nameCheck = (template.name || '').toLowerCase()
                              const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                                   nameCheck.includes('checklist alimentar')
                              const isDetox = idCheck.includes('checklist-detox') || 
                                             nameCheck.includes('checklist detox') || 
                                             nameCheck.includes('detox')
                              
                              // Só mostrar genérico se NÃO for nenhum checklist
                              return !isAlimentar && !isDetox
                            })() && etapaPreview === 1 && (
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

                      {/* Navegação por Etapas - Só mostrar se NÃO for Checklist Alimentar ou Desafio 21 Dias (eles têm navegação própria) */}
                      {(() => {
                        const idCheck = (template.id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                        const nameCheck = (template.name || '').toLowerCase()
                        const isAlimentar = idCheck.includes('checklist-alimentar') || 
                                             idCheck === 'checklist-alimentar' ||
                                             nameCheck === 'checklist alimentar' ||
                                             nameCheck.includes('checklist alimentar')
                        const isDesafio21 = idCheck.includes('desafio-21') || 
                                             idCheck.includes('21-dias') ||
                                             nameCheck.includes('21 dias') ||
                                             nameCheck.includes('desafio 21')
                        
                        // Checklist Alimentar e Desafio 21 Dias têm suas próprias navegações, não mostrar a genérica
                        if (isAlimentar || isDesafio21) {
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
                  </div>

                  {/* Footer do Modal */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => {
                        setTemplatePreviewAberto(null)
                        setEtapaPreview(0)
                        setEtapaPreviewChecklistAlimentar(0)
                        setEtapaPreviewDesafio21Dias(0)
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
                        setEtapaPreviewChecklistAlimentar(0)
                        setEtapaPreviewDesafio21Dias(0)
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
