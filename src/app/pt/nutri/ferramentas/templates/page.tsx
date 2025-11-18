"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import DynamicTemplatePreview from '@/components/shared/DynamicTemplatePreview'

// Lazy load do componente pesado
const DynamicTemplatePreviewLazy = dynamic(() => import('@/components/shared/DynamicTemplatePreview'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Carregando preview...</p>
    </div>
  </div>
})

interface Template {
  id: string
  nome: string
  categoria: string
  descricao: string
  icon?: string
  cor?: string
  perguntas?: number
  tempoEstimado?: string
  leadsMedio?: string
  conversao?: string
  preview?: string
  slug?: string
  content?: any
  type?: string
}

export default function TemplatesNutri() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)

  // Mapear tipo para categoria
  const categoryMap: { [key: string]: string } = {
    quiz: 'Quiz',
    calculadora: 'Calculadora',
    planilha: 'Planilha',
    checklist: 'Checklist',
    conteudo: 'Conteúdo',
    diagnostico: 'Diagnóstico',
    default: 'Outros'
  }

  // Mapear categoria para ícone padrão
  const iconMap: { [key: string]: string } = {
    'Quiz': '🎯',
    'Calculadora': '🧮',
    'Planilha': '📊',
    'Checklist': '📋',
    'Conteúdo': '📚',
    'Diagnóstico': '🔍'
  }

  // Mapear categoria para cor padrão
  const corMap: { [key: string]: string } = {
    'Quiz': 'blue',
    'Calculadora': 'green',
    'Planilha': 'purple',
    'Checklist': 'blue',
    'Conteúdo': 'purple',
    'Diagnóstico': 'red'
  }

  // Carregar templates do banco
  useEffect(() => {
    let cancelled = false
    
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/nutri/templates', {
          cache: 'no-store',
          signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
        })
        
        if (cancelled) return
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            console.log('📦 Templates Nutri carregados do banco:', data.templates.length)
            
            // Transformar templates do banco para formato da página
            const templatesFormatados = data.templates
              .filter((t: any) => {
                // Apenas garantir que o template tem nome
                if (!t.nome || !t.nome.trim()) {
                  console.log('⚠️ Template sem nome ignorado:', t.id)
                  return false
                }
                return true
              })
              .map((t: any) => {
                // Normalizar ID para detecção (slug ou nome em lowercase com hífens)
                const normalizedId = (t.slug || t.id || '').toLowerCase().replace(/\s+/g, '-')
                const normalizedName = (t.nome || '').toLowerCase()
                
                // Determinar categoria
                const categoria = t.categoria || categoryMap[t.type] || categoryMap.default
                
                // Determinar ícone e cor
                const icon = t.icon || iconMap[categoria] || '📋'
                const cor = t.cor || corMap[categoria] || 'blue'
                
                // Extrair número de perguntas do content se disponível
                let perguntas = 0
                if (t.content && typeof t.content === 'object') {
                  if (t.content.questions && Array.isArray(t.content.questions)) {
                    perguntas = t.content.questions.length
                  } else if (t.content.items && Array.isArray(t.content.items)) {
                    perguntas = t.content.items.length
                  }
                }
                
                // Estimar tempo baseado no tipo e número de perguntas
                let tempoEstimado = '2 min'
                if (t.type === 'calculadora') {
                  tempoEstimado = '1-2 min'
                } else if (perguntas > 0) {
                  tempoEstimado = `${Math.ceil(perguntas * 0.3)} min`
                }
                
                return {
                  id: normalizedId || t.slug || t.id,
                  nome: t.nome,
                  categoria,
                  descricao: t.descricao || t.description || '',
                  icon,
                  cor,
                  perguntas,
                  tempoEstimado,
                  leadsMedio: '40/mês', // Valor padrão
                  conversao: '25%', // Valor padrão
                  preview: t.descricao || t.description || '',
                  slug: t.slug || normalizedId,
                  content: t.content, // Incluir content para preview dinâmico
                  type: t.type // Incluir type para preview dinâmico
                }
              })
            
            setTemplates(templatesFormatados)
            console.log(`✅ ${templatesFormatados.length} templates Nutri formatados e carregados`)
          } else {
            console.warn('⚠️ Nenhum template Nutri encontrado na API')
            setTemplates([])
          }
        } else {
          console.error('❌ Erro ao carregar templates Nutri:', response.status)
          setTemplates([])
        }
      } catch (error) {
        console.error('❌ Erro ao carregar templates Nutri:', error)
        setTemplates([])
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

  const categorias = ['todas', 'Quiz', 'Calculadora', 'Checklist', 'Conteúdo', 'Plano', 'Desafio', 'Guia', 'Receita', 'Simulador', 'Formulário', 'Social', 'Catálogo', 'Diagnóstico']

  const templatesFiltrados = templates.filter(template => {
    const matchCategoria = categoriaFiltro === 'todas' || template.categoria === categoriaFiltro
    const matchBusca = busca === '' || 
      template.nome.toLowerCase().includes(busca.toLowerCase()) ||
      template.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      template.preview.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  const getCorClasses = (cor: string) => {
    const cores = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return cores[cor as keyof typeof cores] || cores.blue
  }

  const templatePreviewSelecionado = templates.find(t => t.id === templatePreviewAberto)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Ver Templates
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/ferramentas"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar aos Meus Links
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introdução */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🎨</span>
            Templates Prontos para Nutricionistas
          </h2>
          <p className="text-gray-700 mb-4">
            Escolha um template testado e otimizado para nutricionistas. Temos <strong>{templates.length} templates</strong> validados 
            especificamente para capturar leads qualificados na área de nutrição.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>{templates.length} templates validados e testados</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⚡</span>
              <span>Configuração em menos de 5 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">🎯</span>
              <span>Alta taxa de conversão (22% - 38%)</span>
            </div>
          </div>
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
                  placeholder="🔍 Buscar por nome, descrição ou preview..."
                  className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categorias.map(categoria => {
                  const count = categoria === 'todas' 
                    ? templates.length 
                    : templates.filter(t => t.categoria === categoria).length
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

        {/* Grid de Templates */}
        {carregandoTemplates ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Carregando templates...</p>
            </div>
          </div>
        ) : templatesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum template encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesFiltrados.map((template) => (
            <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.nome}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCorClasses(template.cor)}`}>
                      {template.categoria}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{template.descricao}</p>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <p className="text-sm text-gray-700">{template.preview}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{template.perguntas}</p>
                  <p className="text-xs text-gray-600">Perguntas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{template.tempoEstimado}</p>
                  <p className="text-xs text-gray-600">Duração</p>
                </div>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-green-600">{template.leadsMedio}</p>
                  <p className="text-xs text-gray-600">Leads médio</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-blue-600">{template.conversao}</p>
                  <p className="text-xs text-gray-600">Conversão</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTemplatePreviewAberto(template.id)}
                  className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ver Preview
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Não encontrou o que procura?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/pt/nutri/ferramentas/nova"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h3 className="font-medium text-gray-900">Criar Link Personalizado</h3>
                <p className="text-sm text-gray-600">Crie um link do zero com suas especificações</p>
              </div>
            </Link>
            
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-medium text-gray-900">Sugerir Novo Template</h3>
                <p className="text-sm text-gray-600">Nos conte que tipo de ferramenta você gostaria</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Preview - Usando DynamicTemplatePreview para TODOS os templates */}
      {templatePreviewSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setTemplatePreviewAberto(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{templatePreviewSelecionado.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{templatePreviewSelecionado.nome}</h2>
                    <p className="text-blue-100 text-sm">Visualize o fluxo completo deste template</p>
                  </div>
                </div>
                <button
                  onClick={() => setTemplatePreviewAberto(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo do Preview - DynamicTemplatePreview para TODOS */}
            <div className="flex-1 overflow-y-auto p-6">
              <DynamicTemplatePreviewLazy
                template={templatePreviewSelecionado}
                profession="nutri"
                onClose={() => setTemplatePreviewAberto(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
