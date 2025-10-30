'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { diagnosticosNutri, calculadoraAguaDiagnosticos, calculadoraCaloriasDiagnosticos, checklistDetoxDiagnosticos, checklistAlimentarDiagnosticos, miniEbookDiagnosticos } from '@/lib/diagnosticos-nutri'

export default function TemplatesNutri() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)
  const [etapaPreviewQuiz, setEtapaPreviewQuiz] = useState(0) // Para quiz: 0 = landing, 1-6 = perguntas, 7 = resultados
  const [etapaPreviewQuizBemEstar, setEtapaPreviewQuizBemEstar] = useState(0) // Para quiz-bem-estar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizPerfil, setEtapaPreviewQuizPerfil] = useState(0) // Para quiz-perfil-nutricional: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizDetox, setEtapaPreviewQuizDetox] = useState(0) // Para quiz-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewQuizEnergetico, setEtapaPreviewQuizEnergetico] = useState(0) // Para quiz-energetico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewCalc, setEtapaPreviewCalc] = useState(0) // Para calculadora IMC: 0 = landing, 1 = formulário completo (dados+sexo+atividade), 2 = resultado visual, 3 = diagnósticos
  const [etapaPreviewCalcProteina, setEtapaPreviewCalcProteina] = useState(0) // Para calculadora proteína: 0 = landing, 1 = formulário completo, 2 = resultado visual, 3 = diagnósticos
  const [etapaPreviewCalcAgua, setEtapaPreviewCalcAgua] = useState(0) // Para calculadora água: 0 = landing, 1 = formulário completo, 2 = resultado visual, 3 = diagnósticos
  const [etapaPreviewCalcCalorias, setEtapaPreviewCalcCalorias] = useState(0) // Para calculadora calorias: 0 = landing, 1 = formulário completo, 2 = resultado visual, 3 = diagnósticos
  const [etapaPreviewChecklistDetox, setEtapaPreviewChecklistDetox] = useState(0) // Para checklist-detox: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewChecklistAlimentar, setEtapaPreviewChecklistAlimentar] = useState(0) // Para checklist-alimentar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewMiniEbook, setEtapaPreviewMiniEbook] = useState(0) // Para mini-ebook: 0 = landing, 1-5 = perguntas, 6 = resultados

  // Todos os 38 templates validados da área admin-diagnosticos
  const templates = [
    // QUIZES INTERATIVOS (5)
    { id: 'quiz-interativo', nome: 'Quiz Interativo', categoria: 'Quiz', descricao: 'Quiz com perguntas estratégicas para capturar informações dos clientes', icon: '🎯', cor: 'blue', perguntas: 6, tempoEstimado: '3 min', leadsMedio: '45/mês', conversao: '26%', preview: 'Perguntas estratégicas para atrair leads frios' },
    { id: 'quiz-bem-estar', nome: 'Quiz de Bem-Estar', categoria: 'Quiz', descricao: 'Avalie o bem-estar geral do cliente', icon: '🧘‍♀️', cor: 'purple', perguntas: 6, tempoEstimado: '2 min', leadsMedio: '38/mês', conversao: '28%', preview: 'Avaliação completa de bem-estar' },
    { id: 'quiz-perfil-nutricional', nome: 'Quiz de Perfil Nutricional', categoria: 'Quiz', descricao: 'Identifique o perfil nutricional do cliente', icon: '🥗', cor: 'green', perguntas: 7, tempoEstimado: '3 min', leadsMedio: '42/mês', conversao: '27%', preview: 'Diagnóstico inicial do perfil nutricional' },
    { id: 'quiz-detox', nome: 'Quiz Detox', categoria: 'Quiz', descricao: 'Avalie a necessidade de processo detox', icon: '🧽', cor: 'blue', perguntas: 5, tempoEstimado: '2 min', leadsMedio: '35/mês', conversao: '24%', preview: 'Captação através de curiosidade sobre detox' },
    { id: 'quiz-energetico', nome: 'Quiz Energético', categoria: 'Quiz', descricao: 'Identifique níveis de energia e cansaço', icon: '⚡', cor: 'yellow', perguntas: 6, tempoEstimado: '2 min', leadsMedio: '40/mês', conversao: '25%', preview: 'Segmentação por níveis de energia' },
    
    // CALCULADORAS (4)
    { id: 'calculadora-imc', nome: 'Calculadora de IMC', categoria: 'Calculadora', descricao: 'Calcule o Índice de Massa Corporal com interpretação personalizada', icon: '📊', cor: 'green', perguntas: 3, tempoEstimado: '1 min', leadsMedio: '50/mês', conversao: '30%', preview: 'Altura, peso e análise completa do resultado' },
    { id: 'calculadora-proteina', nome: 'Calculadora de Proteína', categoria: 'Calculadora', descricao: 'Calcule a necessidade proteica diária do cliente', icon: '🥩', cor: 'orange', perguntas: 5, tempoEstimado: '2 min', leadsMedio: '45/mês', conversao: '28%', preview: 'Recomendação nutricional baseada em peso e objetivos' },
    { id: 'calculadora-agua', nome: 'Calculadora de Água', categoria: 'Calculadora', descricao: 'Calcule a necessidade diária de hidratação', icon: '💧', cor: 'blue', perguntas: 4, tempoEstimado: '1 min', leadsMedio: '35/mês', conversao: '22%', preview: 'Engajamento leve através de hidratação' },
    { id: 'calculadora-calorias', nome: 'Calculadora de Calorias', categoria: 'Calculadora', descricao: 'Calcule o gasto calórico diário e necessidades energéticas', icon: '🔥', cor: 'red', perguntas: 6, tempoEstimado: '2 min', leadsMedio: '42/mês', conversao: '26%', preview: 'Diagnóstico completo de necessidades energéticas' },
    
    // CHECKLISTS (2)
    { id: 'checklist-detox', nome: 'Checklist Detox', categoria: 'Checklist', descricao: 'Lista de verificação para processo de detox', icon: '📋', cor: 'green', perguntas: 10, tempoEstimado: '2 min', leadsMedio: '32/mês', conversao: '24%', preview: 'Educação rápida sobre detox' },
    { id: 'checklist-alimentar', nome: 'Checklist Alimentar', categoria: 'Checklist', descricao: 'Avalie hábitos alimentares do cliente', icon: '🍽️', cor: 'blue', perguntas: 12, tempoEstimado: '3 min', leadsMedio: '38/mês', conversao: '26%', preview: 'Avaliação completa de hábitos alimentares' },
    
    // CONTEÚDO EDUCATIVO (6)
    { id: 'mini-ebook', nome: 'Mini E-book Educativo', categoria: 'Conteúdo', descricao: 'E-book compacto para demonstrar expertise e autoridade', icon: '📚', cor: 'purple', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '55/mês', conversao: '32%', preview: 'Demonstração de autoridade através de conteúdo educativo' },
    { id: 'guia-nutraceutico', nome: 'Guia Nutracêutico', categoria: 'Conteúdo', descricao: 'Guia completo sobre suplementos e nutracêuticos', icon: '💊', cor: 'blue', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '48/mês', conversao: '29%', preview: 'Atração de interesse por suplementação' },
    { id: 'guia-proteico', nome: 'Guia Proteico', categoria: 'Conteúdo', descricao: 'Guia especializado sobre proteínas e fontes proteicas', icon: '🥛', cor: 'orange', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '44/mês', conversao: '27%', preview: 'Especialização em nutrição proteica' },
    { id: 'tabela-comparativa', nome: 'Tabela Comparativa', categoria: 'Conteúdo', descricao: 'Tabelas comparativas de alimentos e nutrientes', icon: '📊', cor: 'green', perguntas: 0, tempoEstimado: 'Visualização', leadsMedio: '40/mês', conversao: '25%', preview: 'Ferramenta de conversão através de comparações' },
    { id: 'tabela-substituicoes', nome: 'Tabela de Substituições', categoria: 'Conteúdo', descricao: 'Tabela de substituições de alimentos para mais variedade', icon: '🔄', cor: 'blue', perguntas: 0, tempoEstimado: 'Visualização', leadsMedio: '36/mês', conversao: '23%', preview: 'Valor agregado através de substituições inteligentes' },
    { id: 'tabela-sintomas', nome: 'Tabela de Sintomas', categoria: 'Conteúdo', descricao: 'Tabela para diagnóstico de sintomas relacionados à alimentação', icon: '🩺', cor: 'red', perguntas: 0, tempoEstimado: 'Visualização', leadsMedio: '33/mês', conversao: '22%', preview: 'Diagnóstico leve através de sintomas' },
    
    // PLANOS E ORGANIZAÇÃO (5)
    { id: 'plano-alimentar-base', nome: 'Plano Alimentar Base', categoria: 'Plano', descricao: 'Plano alimentar base para início de jornada nutricional', icon: '📅', cor: 'green', perguntas: 5, tempoEstimado: 'Download', leadsMedio: '52/mês', conversao: '31%', preview: 'Valor prático através de plano alimentar estruturado' },
    { id: 'planner-refeicoes', nome: 'Planner de Refeições', categoria: 'Plano', descricao: 'Planner semanal de refeições para organização alimentar', icon: '🗓️', cor: 'blue', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '46/mês', conversao: '28%', preview: 'Organização através de planejamento de refeições' },
    { id: 'rastreador-alimentar', nome: 'Rastreador Alimentar', categoria: 'Plano', descricao: 'Rastreador para acompanhamento diário de consumo', icon: '📈', cor: 'purple', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '41/mês', conversao: '26%', preview: 'Acompanhamento detalhado de hábitos alimentares' },
    { id: 'diario-alimentar', nome: 'Diário Alimentar', categoria: 'Plano', descricao: 'Diário para registro de alimentos e sentimentos', icon: '📝', cor: 'orange', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '39/mês', conversao: '25%', preview: 'Engajamento através de registro diário' },
    { id: 'tabela-metas-semanais', nome: 'Tabela de Metas Semanais', categoria: 'Plano', descricao: 'Tabela para definição e acompanhamento de metas semanais', icon: '🎯', cor: 'yellow', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '37/mês', conversao: '24%', preview: 'Motivação através de metas claras e alcançáveis' },
    
    // DESAFIOS (2)
    { id: 'template-desafio-7dias', nome: 'Desafio 7 Dias', categoria: 'Desafio', descricao: 'Desafio gamificado de 7 dias para mudança de hábitos', icon: '🏆', cor: 'orange', perguntas: 7, tempoEstimado: '7 dias', leadsMedio: '58/mês', conversao: '35%', preview: 'Gamificação através de desafio estruturado' },
    { id: 'template-desafio-21dias', nome: 'Desafio 21 Dias', categoria: 'Desafio', descricao: 'Desafio de 21 dias para formação de hábitos duradouros', icon: '📅', cor: 'green', perguntas: 21, tempoEstimado: '21 dias', leadsMedio: '62/mês', conversao: '38%', preview: 'Comprometimento através de desafio de 21 dias' },
    
    // GUIAS ESPECÍFICOS (2)
    { id: 'guia-hidratacao', nome: 'Guia de Hidratação', categoria: 'Guia', descricao: 'Guia completo sobre hidratação e importância da água', icon: '💧', cor: 'blue', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '35/mês', conversao: '22%', preview: 'Educação visual sobre hidratação' },
    { id: 'infografico-educativo', nome: 'Infográfico Educativo', categoria: 'Guia', descricao: 'Infográficos educativos sobre nutrição e saúde', icon: '📊', cor: 'purple', perguntas: 0, tempoEstimado: 'Visualização', leadsMedio: '43/mês', conversao: '27%', preview: 'Autoridade através de infográficos visuais' },
    
    // RECEITAS E CARDÁPIOS (2)
    { id: 'template-receitas', nome: 'Receitas', categoria: 'Receita', descricao: 'Coleção de receitas saudáveis e práticas', icon: '👨‍🍳', cor: 'orange', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '49/mês', conversao: '30%', preview: 'Valor prático através de receitas saudáveis' },
    { id: 'cardapio-detox', nome: 'Cardápio Detox', categoria: 'Receita', descricao: 'Cardápio completo de detox para limpeza do organismo', icon: '🥗', cor: 'green', perguntas: 0, tempoEstimado: 'Download', leadsMedio: '47/mês', conversao: '29%', preview: 'Conversão indireta através de cardápio detox' },
    
    // SIMULADORES (1)
    { id: 'simulador-resultados', nome: 'Simulador de Resultados', categoria: 'Simulador', descricao: 'Simule resultados futuros baseados em mudanças de hábitos', icon: '🔮', cor: 'purple', perguntas: 6, tempoEstimado: '3 min', leadsMedio: '51/mês', conversao: '31%', preview: 'Curiosidade através de simulação de resultados' },
    
    // FORMULÁRIOS (2)
    { id: 'template-avaliacao-inicial', nome: 'Avaliação Inicial', categoria: 'Formulário', descricao: 'Formulário completo para avaliação inicial do cliente', icon: '📋', cor: 'blue', perguntas: 15, tempoEstimado: '5 min', leadsMedio: '44/mês', conversao: '28%', preview: 'Captação através de avaliação inicial detalhada' },
    { id: 'formulario-recomendacao', nome: 'Formulário de Recomendação', categoria: 'Formulário', descricao: 'Formulário para recomendações nutricionais personalizadas', icon: '📝', cor: 'green', perguntas: 10, tempoEstimado: '4 min', leadsMedio: '40/mês', conversao: '26%', preview: 'Diagnóstico rápido através de formulário' },
    
    // CONTEÚDO PARA REDES SOCIAIS (5)
    { id: 'template-story-interativo', nome: 'Story Interativo', categoria: 'Social', descricao: 'Template de stories interativos para Instagram', icon: '📱', cor: 'purple', perguntas: 5, tempoEstimado: '2 min', leadsMedio: '53/mês', conversao: '32%', preview: 'Engajamento nas redes através de stories' },
    { id: 'post-curiosidades', nome: 'Post de Curiosidades', categoria: 'Social', descricao: 'Posts educativos com curiosidades nutricionais', icon: '💡', cor: 'yellow', perguntas: 0, tempoEstimado: 'Leitura', leadsMedio: '45/mês', conversao: '28%', preview: 'Autoridade através de conteúdo educativo' },
    { id: 'template-post-dica', nome: 'Post com Dica', categoria: 'Social', descricao: 'Templates de posts com dicas práticas de nutrição', icon: '📝', cor: 'blue', perguntas: 0, tempoEstimado: 'Leitura', leadsMedio: '42/mês', conversao: '27%', preview: 'Conteúdo recorrente com dicas práticas' },
    { id: 'template-reels-roteirizado', nome: 'Reels Roteirizado', categoria: 'Social', descricao: 'Roteiros prontos para reels educativos no Instagram', icon: '🎬', cor: 'orange', perguntas: 0, tempoEstimado: 'Produção', leadsMedio: '56/mês', conversao: '34%', preview: 'Atração visual através de reels roteirizados' },
    { id: 'template-artigo-curto', nome: 'Artigo Curto', categoria: 'Social', descricao: 'Templates de artigos curtos para blog e redes sociais', icon: '📄', cor: 'green', perguntas: 0, tempoEstimado: 'Leitura', leadsMedio: '38/mês', conversao: '25%', preview: 'Autoridade escrita através de artigos' },
    
    // CATÁLOGOS (1)
    { id: 'template-catalogo-digital', nome: 'Catálogo Digital', categoria: 'Catálogo', descricao: 'Catálogo digital de produtos e serviços nutricionais', icon: '📱', cor: 'purple', perguntas: 0, tempoEstimado: 'Navegação', leadsMedio: '50/mês', conversao: '30%', preview: 'Conversão direta através de catálogo' },
    
    // SIMULADORES ESPECÍFICOS (1)
    { id: 'simulador-ganho', nome: 'Simulador de Ganho', categoria: 'Simulador', descricao: 'Simule ganhos financeiros com produtos nutricionais', icon: '💰', cor: 'yellow', perguntas: 5, tempoEstimado: '3 min', leadsMedio: '48/mês', conversao: '29%', preview: 'Recrutamento através de simulação de ganhos' },
    
    // DIAGNÓSTICOS ESPECÍFICOS (1)
    { id: 'template-diagnostico-parasitose', nome: 'Diagnóstico de Parasitose', categoria: 'Diagnóstico', descricao: 'Ferramenta para diagnóstico de parasitose intestinal', icon: '🦠', cor: 'red', perguntas: 8, tempoEstimado: '3 min', leadsMedio: '41/mês', conversao: '27%', preview: 'Diagnóstico específico de parasitose' }
  ]

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
                  src="/logos/ylada-logo-horizontal-vazado.png"
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
            Escolha um template testado e otimizado para nutricionistas. Temos <strong>38 templates</strong> validados 
            especificamente para capturar leads qualificados na área de nutrição.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>38 templates validados e testados</span>
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
                  onClick={() => {
                    setTemplatePreviewAberto(template.id)
                    setEtapaPreviewQuiz(0)
                    setEtapaPreviewQuizBemEstar(0)
                    setEtapaPreviewQuizPerfil(0)
                    setEtapaPreviewQuizDetox(0)
                    setEtapaPreviewQuizEnergetico(0)
                    setEtapaPreviewCalc(0)
                    setEtapaPreviewCalcProteina(0)
                    setEtapaPreviewCalcAgua(0)
                    setEtapaPreviewCalcCalorias(0)
                    setEtapaPreviewChecklistDetox(0)
                    setEtapaPreviewChecklistAlimentar(0)
                    setEtapaPreviewMiniEbook(0)
                  }}
                  className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ver Preview
                </button>
              </div>
            </div>
          ))}
        </div>

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

      {/* Modal de Preview do Fluxo */}
      {templatePreviewSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
                  onClick={() => {
                    setTemplatePreviewAberto(null)
                    setEtapaPreviewQuiz(0)
                    setEtapaPreviewQuizBemEstar(0)
                    setEtapaPreviewQuizPerfil(0)
                    setEtapaPreviewQuizDetox(0)
                    setEtapaPreviewQuizEnergetico(0)
                    setEtapaPreviewCalc(0)
                  }}
                  className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo do Preview - Mesmo formato do admin-diagnosticos */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Renderizar preview baseado no ID do template */}
              {templatePreviewSelecionado.id === 'quiz-interativo' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewQuiz === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos</h4>
                        <p className="text-gray-700 mb-3">Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.</p>
                        <p className="text-blue-600 font-semibold">🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.</p>
                      </div>
                    )}

                    {/* Perguntas 1-6 - Navegação com setinhas */}
                    {etapaPreviewQuiz >= 1 && etapaPreviewQuiz <= 6 && (
                      <div className="space-y-6">
                        {etapaPreviewQuiz === 1 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">🕐 1. Como é seu nível de energia ao longo do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="energia-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Vivo cansado, mesmo dormindo bem</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="energia-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Tenho altos e baixos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="energia-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Energia constante o dia inteiro</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Autopercepção e comparação</p>
                          </div>
                        )}

                        {etapaPreviewQuiz === 2 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🍽️ 2. Como costuma ser sua fome?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="fome" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Forte, com vontade de comer o tempo todo</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="fome" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Varia conforme o dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="fome" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Como de forma leve, sem exagerar</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Identificação emocional com comportamento alimentar</p>
                          </div>
                        )}

                        {etapaPreviewQuiz === 3 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">💧 3. Quanta água você costuma beber por dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="agua" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Quase nenhuma</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="agua" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Mais ou menos 1 litro</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="agua" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Sempre carrego minha garrafinha</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Contraste e consciência de hábito</p>
                          </div>
                        )}

                        {etapaPreviewQuiz === 4 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">💤 4. Como anda a qualidade do seu sono?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Péssima, acordo cansado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Regular, depende do dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Durmo bem e acordo disposto</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Reflexão + padrão de saúde percebida</p>
                          </div>
                        )}

                        {etapaPreviewQuiz === 5 && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-3">🏃‍♂️ 5. Você pratica atividade física com qual frequência?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="exercicio" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Quase nunca</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="exercicio" className="mr-3" disabled />
                                <span className="text-gray-700">(B) 2 a 3 vezes por semana</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="exercicio" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Quase todos os dias</span>
                              </label>
                            </div>
                            <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Comparação e autoavaliação social</p>
                          </div>
                        )}

                        {etapaPreviewQuiz === 6 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">⚖️ 6. Qual dessas opções melhor descreve você?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="peso" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Tenho dificuldade em perder peso</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="peso" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Mantenho o peso com esforço</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="peso" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Emagreço facilmente</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Diagnóstico rápido (dor e aspiração)</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 7 */}
                    {etapaPreviewQuiz === 7 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                        
                        {/* Resultado 1: Metabolismo Lento */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">🐌 Metabolismo Lento</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">6-9 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu metabolismo está em modo de economia energética, sinalizando necessidade de revitalização personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Falta de nutrientes essenciais e horários irregulares de refeições podem estar reduzindo sua energia e disposição. Estudos indicam que 68% das pessoas com metabolismo lento apresentam carências nutricionais não identificadas. Uma avaliação completa identifica exatamente onde está o desequilíbrio</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo inicial focado em reequilíbrio metabólico com horários consistentes e proteína em todas as refeições, ajustado conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Magnésio e B12 costumam ser considerados para suporte energético, mas sempre de acordo com a individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Priorize proteínas magras e gorduras boas (abacate, oleaginosas) de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu metabolismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra em minutos como seu corpo pode responder a um plano personalizado.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Metabolismo Equilibrado */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">⚖️ Metabolismo Equilibrado</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">10-13 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu metabolismo está estável com potencial de otimização estratégica</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa base metabólica estabelecida. Pesquisas mostram que pequenos ajustes nutricionais podem elevar a eficiência metabólica em até 15%. Uma análise detalhada mostra exatamente onde ganhar performance</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar microajustes com maior impacto. Às vezes pequenas mudanças personalizadas geram grandes melhorias</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização com estratégias de timing nutricional e alimentos funcionais específicos para seu perfil metabólico e rotina</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Vitaminas e minerais costumam ser considerados, mas apenas após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem potencializar ainda mais sua eficiência metabólica.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Metabolismo Acelerado */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">🚀 Metabolismo Acelerado</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">14-18 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu metabolismo rápido precisa de estabilização estratégica</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Alta queima calórica pode causar desequilíbrios e fadiga quando não há reposição adequada. Uma avaliação completa identifica exatamente como sustentar energia sem oscilações</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Aumente frequência de refeições (5-6x/dia) e busque avaliação para um plano que mantenha energia de forma consistente. Evite aumentar calorias de forma desordenada</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Estabilização com carboidratos complexos e proteína distribuídos ao longo do dia, ajustado conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Creatina e glutamina costumam ser considerados para recuperação, mas sempre conforme sua individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Priorize carboidratos complexos combinados a proteína para sustentar energia. Um plano personalizado ajusta quantidades e timing ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo está pedindo estabilização — e você já deu o primeiro passo. O próximo é descobrir como manter energia consistente com apoio personalizado.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewQuiz(Math.max(0, etapaPreviewQuiz - 1))}
                        disabled={etapaPreviewQuiz === 0}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>
                      
                      <div className="flex space-x-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((etapa) => {
                          const labels = ['Início', '1', '2', '3', '4', '5', '6', 'Resultados']
                          return (
                            <button
                              key={etapa}
                              onClick={() => setEtapaPreviewQuiz(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewQuiz === etapa
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapa === 0 ? 'Tela Inicial' : etapa === 7 ? 'Resultados' : `Pergunta ${etapa}`}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewQuiz(Math.min(7, etapaPreviewQuiz + 1))}
                        disabled={etapaPreviewQuiz === 7}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'calculadora-imc' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    📊 Preview da Calculadora de IMC - "Cálculo com resultado visual"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewCalc === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Calcule Seu IMC e Descubra Sua Avaliação Corporal</h4>
                        <p className="text-gray-700 mb-3">Descubra seu Índice de Massa Corporal com precisão científica — e receba orientações personalizadas baseadas nos padrões da OMS.</p>
                        <p className="text-blue-600 font-semibold">🎯 Uma avaliação que pode transformar sua saúde e bem-estar.</p>
                      </div>
                    )}

                    {/* Formulário Completo - Etapa 1 */}
                    {etapaPreviewCalc === 1 && (
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
                              <input type="radio" name="sexo" className="mr-3" disabled />
                              <span className="text-gray-700">👨 Masculino</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                              <input type="radio" name="sexo" className="mr-3" disabled />
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
                              <input type="radio" name="atividade" className="mr-3" disabled />
                              <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                              <input type="radio" name="atividade" className="mr-3" disabled />
                              <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                              <input type="radio" name="atividade" className="mr-3" disabled />
                              <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                              <input type="radio" name="atividade" className="mr-3" disabled />
                              <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                            </label>
                          </div>
                          <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Contextualização</p>
                        </div>
                      </div>
                    )}

                    {/* Resultado Visual - Etapa 2 */}
                    {etapaPreviewCalc === 2 && (
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
                      </div>
                    )}

                    {/* Resultados Possíveis - Etapa 3 */}
                    {etapaPreviewCalc === 3 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                        
                        {/* Resultado 1: Baixo Peso */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">📉 Baixo Peso</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 18.5</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica baixo peso, o que pode sinalizar carência energética e nutricional. É importante restaurar o equilíbrio de forma segura e personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Pode estar relacionado a ingestão calórica insuficiente, metabolismo acelerado ou má absorção. Estudos indicam que 40% das pessoas com baixo peso têm causas nutricionais não identificadas. Uma avaliação nutricional identifica exatamente onde está o desequilíbrio</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Evite aumentar calorias de forma desordenada. O ideal é ajustar alimentos densos nutricionalmente conforme seu estilo de vida e rotina diária</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo inicial para ganho saudável, com foco em refeições equilibradas, aumento gradual de calorias e estímulo do apetite natural</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Costuma-se considerar opções como whey protein, multivitamínicos e probióticos, sempre de acordo com a individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Priorize alimentos naturais e calóricos como abacate, castanhas, raízes e cereais integrais. Um plano personalizado ajusta quantidades e combinações ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Descubra em minutos como seu corpo pode responder a um plano de ganho saudável — solicite sua análise personalizada agora.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Peso Normal */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">⚖️ Peso Normal</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">18.5 - 24.9</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC está normal, o que indica boa relação peso/altura. Manter hábitos saudáveis e considerar estratégias preventivas</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa relação peso/altura estabelecida. Pesquisas mostram que pessoas com IMC normal que adotam estratégias nutricionais preventivas têm 60% menos risco de desenvolver desequilíbrios futuros. Continue cuidando da saúde com foco em qualidade nutricional</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha alimentação equilibrada e exercícios regulares. Considere avaliação preventiva para identificar oportunidades de otimização que preservam esse equilíbrio</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com alimentação variada e atividade física, ajustado conforme seu perfil metabólico e objetivos pessoais</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade nutricional. Um plano personalizado considera combinações específicas para maximizar absorção conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Sobrepeso */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">📈 Sobrepeso</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">25.0 - 29.9</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica sobrepeso, o que sinaliza necessidade de reequilíbrio controlado e personalizado</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Desequilíbrio entre ingestão calórica e gasto energético. Estudos mostram que pequenas mudanças de 300 kcal por dia já podem influenciar a composição corporal ao longo do tempo. Uma avaliação completa identifica exatamente onde ajustar</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Seu corpo está pedindo equilíbrio. Busque avaliação nutricional para um plano de redução gradual e segura. Evite dietas restritivas sem acompanhamento — cada organismo responde diferente</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo de redução controlada com alimentação ajustada e estratégias de exercício, personalizado conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Proteína magra e fibras costumam ser considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Reduza carboidratos refinados e aumente proteínas e fibras de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir peso de forma saudável e sustentável com apoio personalizado.</p>
                          </div>
                        </div>

                        {/* Resultado 4: Obesidade */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">⚠️ Obesidade</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">≥ 30.0</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica obesidade, o que requer intervenção personalizada e estruturada com acompanhamento profissional</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Desequilíbrio metabólico significativo que pode afetar sua saúde. Pesquisas indicam que intervenções nutricionais personalizadas podem resultar em melhoria significativa. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque acompanhamento profissional imediato para um plano estruturado e adequado ao seu perfil. Evite abordagens genéricas — cada caso requer estratégia específica e acompanhamento</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Intervenção nutricional inicial personalizada, com suporte multidisciplinar e acompanhamento para ajustes conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Suporte metabólico pode ser considerado, mas sempre de acordo com a individualidade biológica e sob acompanhamento profissional</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Reeducação alimentar completa, totalmente personalizada, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado e um plano estruturado.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
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
                              title={labels[etapa]}
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
                  </div>
                </div>
              )}

              {/* Quiz de Bem-Estar */}
              {templatePreviewSelecionado.id === 'quiz-bem-estar' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🧘‍♀️ Preview do Quiz de Bem-Estar - "Descubra seu Nível de Bem-estar"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewQuizBemEstar === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🌟 Descubra Seu Nível de Bem-estar em 2 Minutos</h4>
                        <p className="text-gray-700 mb-3">Avalie como está sua energia, humor, sono e qualidade de vida — e descubra estratégias personalizadas para elevar seu bem-estar.</p>
                        <p className="text-green-600 font-semibold">✨ Uma avaliação completa que pode transformar sua rotina.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewQuizBemEstar >= 1 && etapaPreviewQuizBemEstar <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewQuizBemEstar === 1 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🌅 1. Como você se sente ao acordar?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="acordar" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Cansado, preciso de café para funcionar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="acordar" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Normal, mas preciso de um tempo para despertar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="acordar" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Energizado e pronto para o dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Autopercepção matinal</p>
                          </div>
                        )}

                        {etapaPreviewQuizBemEstar === 2 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">😴 2. Como está a qualidade do seu sono?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Dificuldade para dormir ou acordar várias vezes</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Sono regular, mas não sempre reparador</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Durmo bem e acordo descansado</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Qualidade de recuperação</p>
                          </div>
                        )}

                        {etapaPreviewQuizBemEstar === 3 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">😊 3. Como está seu humor geral?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="humor" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Frequentemente irritado ou triste</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="humor" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Humor instável, depende do dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="humor" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Geralmente positivo e estável</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Estado emocional</p>
                          </div>
                        )}

                        {etapaPreviewQuizBemEstar === 4 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-900 mb-3">⚡ 4. Como está seu nível de energia ao longo do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Baixo, me sinto sempre cansado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Variável, tenho altos e baixos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Alto e constante durante o dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Vitalidade e disposição</p>
                          </div>
                        )}

                        {etapaPreviewQuizBemEstar === 5 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🏃‍♀️ 5. Como está sua disposição para atividades físicas?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="atividade" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Sem energia para exercícios</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="atividade" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Faço exercícios ocasionalmente</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="atividade" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Pratico atividades físicas regularmente</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Motivação e movimento</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewQuizBemEstar === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                        
                        {/* Resultado 1: Bem-estar Baixo */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Bem-estar Baixo</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-8 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Estudos indicam que 73% das pessoas com bem-estar baixo têm carências de nutrientes essenciais sem perceber. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque uma avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo inicial de 7 dias personalizado, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Complexo B, magnésio e ômega-3 são frequentemente considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas preferências e objetivos. Aumente frutas, verduras e grãos integrais de forma estratégica enquanto aguarda sua avaliação</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — personalize seu plano e veja resultados reais.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Bem-estar Moderado */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚖️ Bem-estar Moderado</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">9-12 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa base nutricional estabelecida, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suplementação preventiva. Multivitamínico e probióticos costumam ser considerados, mas a dosagem é personalizada após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Bem-estar Alto */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🌟 Bem-estar Alto</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">13-15 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com nutrição preventiva e estratégias avançadas de performance</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
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
                  </div>
                </div>
              )}

              {/* Quiz de Perfil Nutricional */}
              {templatePreviewSelecionado.id === 'quiz-perfil-nutricional' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🥗 Preview do Quiz de Perfil Nutricional - "Seu corpo está absorvendo bem os nutrientes?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewQuizPerfil === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🔬 Descubra Seu Perfil de Absorção Nutricional em 2 Minutos</h4>
                        <p className="text-gray-700 mb-3">Avalie como seu corpo está processando e absorvendo os nutrientes essenciais — e descubra estratégias personalizadas para otimizar sua digestão e absorção.</p>
                        <p className="text-green-600 font-semibold">🧬 Uma avaliação que pode revolucionar sua saúde digestiva.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewQuizPerfil >= 1 && etapaPreviewQuizPerfil <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewQuizPerfil === 1 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🍽️ 1. Como você se sente após as refeições?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="pos-refeicao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Cansado, pesado, com sono</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="pos-refeicao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Normal, sem grandes mudanças</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="pos-refeicao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Energizado e satisfeito</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Autopercepção digestiva</p>
                          </div>
                        )}

                        {etapaPreviewQuizPerfil === 2 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">💊 2. Como seu corpo reage aos suplementos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="suplementos" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Não sinto diferença ou tenho desconforto</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="suplementos" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Sinto alguns benefícios ocasionais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="suplementos" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Sinto benefícios claros e consistentes</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Experiência com suplementação</p>
                          </div>
                        )}

                        {etapaPreviewQuizPerfil === 3 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">🚽 3. Como é sua digestão e eliminação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="digestao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Irregular, constipação ou diarreia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="digestao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Normal, mas às vezes irregular</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="digestao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Regular e consistente</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Funcionamento intestinal</p>
                          </div>
                        )}

                        {etapaPreviewQuizPerfil === 4 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">⚡ 4. Como está sua energia ao longo do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Baixa, com picos e quedas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Moderada, estável</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="energia" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Alta e constante</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Nível energético</p>
                          </div>
                        )}

                        {etapaPreviewQuizPerfil === 5 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🧠 5. Como está sua concentração e clareza mental?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Difícil manter foco, mente nebulosa</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Boa, mas pode melhorar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Excelente foco e clareza</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Performance cognitiva</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewQuizPerfil === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                        
                        {/* Resultado 1: Absorção Baixa */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Absorção Baixa</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-8 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Dificuldades de absorção que precisam de intervenção personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Problemas digestivos ou inflamação podem estar reduzindo a absorção de nutrientes. Estudos indicam que 60% das pessoas com absorção baixa têm condições digestivas não identificadas. Uma avaliação completa identifica exatamente a origem e como reverter</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada caso tem necessidades específicas</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo inicial focado em reparo digestivo e alimentos anti-inflamatórios, com ajustes conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Suporte digestivo específico pode ser considerado, mas sempre de acordo com a individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Evite alimentos inflamatórios enquanto aguarda sua avaliação. Aumente fibras prebióticas de forma gradual. Um plano personalizado ajusta quantidades e combinações ideais</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Absorção Moderada */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚖️ Absorção Moderada</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">9-12 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Boa base digestiva, mas pode ser otimizada com estratégias personalizadas</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa digestão estabelecida, mas timing e combinações podem ser refinados. Pesquisas mostram que otimizações estratégicas podem aumentar absorção em até 30%. Uma análise detalhada mostra exatamente onde ganhar eficiência</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing que potencializam absorção. Às vezes pequenos ajustes geram grandes melhorias</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização com combinações alimentares estratégicas e timing nutricional específico para seu perfil metabólico e rotina</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e probióticos costumam ser considerados, mas apenas após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Combine nutrientes para melhor absorção (ex.: ferro + vitamina C). Um plano otimizado considera combinações específicas para maximizar resultados conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como seu corpo pode responder a estratégias avançadas de absorção.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Absorção Otimizada */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🌟 Absorção Otimizada</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">13-15 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sistema digestivo funcionando bem; estratégias avançadas podem potencializar ainda mais</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Sistema digestivo saudável e eficiente. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis superiores. Uma avaliação preventiva identifica oportunidades específicas</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio digestivo é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewQuizPerfil(Math.max(0, etapaPreviewQuizPerfil - 1))}
                        disabled={etapaPreviewQuizPerfil === 0}
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
                              onClick={() => setEtapaPreviewQuizPerfil(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewQuizPerfil === etapa
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
                        onClick={() => setEtapaPreviewQuizPerfil(Math.min(6, etapaPreviewQuizPerfil + 1))}
                        disabled={etapaPreviewQuizPerfil === 6}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Detox */}
              {templatePreviewSelecionado.id === 'quiz-detox' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🧽 Preview do Quiz Detox - "Seu corpo precisa de detox?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewQuizDetox === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-red-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🧽 Descubra Seu Nível de Toxicidade em 2 Minutos</h4>
                        <p className="text-gray-700 mb-3">Avalie sinais de acúmulo tóxico no seu corpo — e descubra estratégias personalizadas para eliminar toxinas e revitalizar sua saúde.</p>
                        <p className="text-green-600 font-semibold">🔥 Uma avaliação que pode transformar sua saúde completamente.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewQuizDetox >= 1 && etapaPreviewQuizDetox <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewQuizDetox === 1 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🍽️ 1. Como você se sente após comer alimentos processados?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="alimentos-processados" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Normal, sem diferença</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="alimentos-processados" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Leve desconforto ou peso</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="alimentos-processados" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Cansaço, inchaço ou mal-estar</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Sensibilidade alimentar</p>
                          </div>
                        )}

                        {etapaPreviewQuizDetox === 2 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">🌍 2. Como você se sente em ambientes poluídos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="poluicao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Normal, sem problemas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="poluicao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Leve irritação ou cansaço</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="poluicao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Dor de cabeça, irritação ou falta de ar</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Sensibilidade ambiental</p>
                          </div>
                        )}

                        {etapaPreviewQuizDetox === 3 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">💧 3. Como está sua hidratação e eliminação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="hidratacao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Bebo água regularmente e elimino bem</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="hidratacao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Bebo água ocasionalmente, eliminação normal</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="hidratacao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Pouca água, constipação ou retenção</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Funcionamento renal</p>
                          </div>
                        )}

                        {etapaPreviewQuizDetox === 4 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">😴 4. Como está seu sono e recuperação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Durmo bem e acordo renovado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Sono regular, mas às vezes cansado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="sono" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Sono ruim, acordo cansado e sem energia</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Qualidade do sono</p>
                          </div>
                        )}

                        {etapaPreviewQuizDetox === 5 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🧠 5. Como está sua clareza mental e foco?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="clareza-mental" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Mente clara e foco excelente</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="clareza-mental" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Boa clareza, mas às vezes nebulosa</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="clareza-mental" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Mente nebulosa, difícil manter foco</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Performance cognitiva</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewQuizDetox === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                        
                        {/* Resultado 1: Baixa Toxicidade */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🛡️ Baixa Toxicidade</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-8 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Baixa carga tóxica mantendo boa saúde; estratégias preventivas podem preservar essa condição</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa alimentação e estilo de vida saudável mantêm toxinas controladas. Estratégias preventivas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Continue hábitos atuais e considere avaliação preventiva para introduzir estratégias de manutenção que sustentam saúde a longo prazo</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção preventiva com alimentos antioxidantes e protocolo de hidratação personalizado conforme seu perfil e estilo de vida</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte antioxidante. O protocolo é personalizado conforme sua necessidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir chás detox e vegetais verdes para potencializar ainda mais seus resultados preventivos</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas avançadas podem preservar e potencializar ainda mais sua saúde.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Toxicidade Moderada */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚠️ Toxicidade Moderada</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">9-12 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sinais de acúmulo tóxico moderado que precisam de intervenção estratégica</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Exposição ambiental e alimentação podem estar aumentando toxinas no organismo. Estudos indicam que protocolos detox personalizados podem reduzir carga tóxica em até 45% em poucos meses. Uma avaliação completa identifica exatamente a origem e estratégias para reduzir</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo detox adequado ao seu perfil. Evite protocolos genéricos — cada organismo responde diferente</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo detox moderado personalizado, considerando seu perfil metabólico e estilo de vida, com ajustes conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica quais suplementos detox seu corpo realmente precisa. Suporte digestivo costuma ser considerado, mas apenas após análise detalhada do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Um plano alimentar detox personalizado considera suas preferências e objetivos. Aumente vegetais crucíferos de forma gradual enquanto aguarda sua avaliação</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir toxinas com um plano personalizado.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Alta Toxicidade */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">🚨 Alta Toxicidade</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">13-15 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Alta carga tóxica que precisa de intervenção personalizada e urgente</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Exposição excessiva a toxinas e sistema de eliminação comprometido podem estar afetando sua saúde significativamente. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional imediata para receber um protocolo detox seguro e adequado ao seu perfil. Evite protocolos intensivos sem acompanhamento — cada caso requer abordagem específica</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo detox completo personalizado, com acompanhamento para ajustes conforme sua resposta individual e necessidade metabólica</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos detox são adequados. Protocolos intensivos devem ser definidos apenas após análise detalhada do seu caso, sempre conforme sua individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Um plano alimentar detox rigoroso, totalmente personalizado, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewQuizDetox(Math.max(0, etapaPreviewQuizDetox - 1))}
                        disabled={etapaPreviewQuizDetox === 0}
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
                              onClick={() => setEtapaPreviewQuizDetox(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewQuizDetox === etapa
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
                        onClick={() => setEtapaPreviewQuizDetox(Math.min(6, etapaPreviewQuizDetox + 1))}
                        disabled={etapaPreviewQuizDetox === 6}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Energético */}
              {templatePreviewSelecionado.id === 'quiz-energetico' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    ⚡ Preview do Quiz Energético - "Descubra sua energia natural"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewQuizEnergetico === 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">⚡ Descubra Seu Perfil Energético Natural em 2 Minutos</h4>
                        <p className="text-gray-700 mb-3">Avalie como seu corpo produz e mantém energia naturalmente — e descubra estratégias personalizadas para otimizar sua vitalidade e performance.</p>
                        <p className="text-yellow-600 font-semibold">🚀 Uma avaliação que pode revolucionar sua energia e disposição.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewQuizEnergetico >= 1 && etapaPreviewQuizEnergetico <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewQuizEnergetico === 1 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-900 mb-3">🌅 1. Como você se sente ao acordar pela manhã?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="acordar-manha" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Cansado, preciso de tempo para despertar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="acordar-manha" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Normal, preciso de um café para despertar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="acordar-manha" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Energizado e pronto para o dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Energia matinal</p>
                          </div>
                        )}

                        {etapaPreviewQuizEnergetico === 2 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">🍽️ 2. Como sua energia muda após as refeições?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="energia-refeicoes" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Fico mais cansado e com sono</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="energia-refeicoes" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Mantenho o mesmo nível de energia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="energia-refeicoes" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Fico mais energizado e focado</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Resposta metabólica</p>
                          </div>
                        )}

                        {etapaPreviewQuizEnergetico === 3 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">🏃‍♂️ 3. Como você se sente durante exercícios físicos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="exercicios" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Cansado rapidamente, sem resistência</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="exercicios" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Consigo fazer exercícios moderados</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="exercicios" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Tenho energia para exercícios intensos</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Capacidade física</p>
                          </div>
                        )}

                        {etapaPreviewQuizEnergetico === 4 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">🧠 4. Como está sua concentração ao longo do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Difícil manter foco, mente nebulosa</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Boa concentração, mas às vezes cansa</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="concentracao" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Excelente foco e clareza mental</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Performance cognitiva</p>
                          </div>
                        )}

                        {etapaPreviewQuizEnergetico === 5 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🌙 5. Como você se sente no final do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="final-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(A) Exausto, sem energia para nada</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="final-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(B) Cansado, mas ainda consigo fazer algumas coisas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="final-dia" className="mr-3" disabled />
                                <span className="text-gray-700">(C) Ainda com energia para atividades</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Resistência energética</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewQuizEnergetico === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
                        
                        {/* Resultado 1: Energia Baixa */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Energia Baixa</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-8 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Baixa energia natural que precisa de revitalização personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Deficiências nutricionais ou desequilíbrios metabólicos podem estar afetando sua produção energética. Pesquisas mostram que 68% das pessoas com baixa energia têm carências nutricionais não identificadas. Uma avaliação completa identifica exatamente o que está impactando sua vitalidade</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo energético seguro e adequado ao seu perfil. Evite auto-suplementação — carências específicas precisam ser identificadas primeiro</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo energético inicial personalizado, ajustado ao seu perfil metabólico e rotina, com foco em carboidratos complexos e proteínas distribuídas</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Suporte a energia celular costuma ser considerado, mas sempre de acordo com a individualidade biológica</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Um plano alimentar energético personalizado considera suas preferências. Aumente carboidratos complexos e proteínas de forma estratégica enquanto aguarda sua avaliação</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra como seu corpo pode recuperar energia com apoio personalizado.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Energia Moderada */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚡ Energia Moderada</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">9-12 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Energia moderada que pode ser otimizada com estratégias personalizadas</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa base energética estabelecida, mas ajustes nutricionais específicos podem elevar sua vitalidade significativamente. Estudos indicam que otimizações estratégicas podem aumentar energia em até 35%. Uma análise detalhada mostra exatamente onde ganhar performance</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar estratégias de timing nutricional que potencializam energia. Às vezes pequenos ajustes geram grandes melhorias</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização energética com timing nutricional estratégico específico para seu perfil metabólico e rotina</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte preventivo. Multivitamínico e ômega-3 costumam ser considerados, mas a dosagem é personalizada após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha padrão atual e otimize horários e combinações alimentares. Um plano otimizado considera estratégias específicas para maximizar resultados conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem elevar ainda mais sua vitalidade.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Energia Alta */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🚀 Energia Alta</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">13-15 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Excelente energia natural; estratégias avançadas podem potencializar ainda mais</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Sistema energético eficiente e nutrição adequada. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para performance superior. Uma avaliação preventiva identifica oportunidades específicas para você</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam energia a longo prazo</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção energética com alimentos funcionais premium e protocolo preventivo personalizado para sustentabilidade</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de suporte para performance. O protocolo é personalizado conforme seu perfil metabólico atual</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir superalimentos e alimentos funcionais premium para potencializar ainda mais seus resultados</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio energético é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais sua performance.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewQuizEnergetico(Math.max(0, etapaPreviewQuizEnergetico - 1))}
                        disabled={etapaPreviewQuizEnergetico === 0}
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
                              onClick={() => setEtapaPreviewQuizEnergetico(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewQuizEnergetico === etapa
                                  ? 'bg-yellow-600 text-white'
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
                        onClick={() => setEtapaPreviewQuizEnergetico(Math.min(6, etapaPreviewQuizEnergetico + 1))}
                        disabled={etapaPreviewQuizEnergetico === 6}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback para templates sem preview específico */}
              {/* Calculadora de Proteína */}
              {templatePreviewSelecionado.id === 'calculadora-proteina' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🥩 Preview da Calculadora de Proteína - "Quantas proteínas você precisa por dia?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewCalcProteina === 0 && (
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🥩 Calcule Sua Necessidade Diária de Proteína</h4>
                        <p className="text-gray-700 mb-3">Descubra exatamente quantas proteínas seu corpo precisa por dia — e receba orientações personalizadas baseadas em seu peso, atividade física e objetivos.</p>
                        <p className="text-red-600 font-semibold">💪 Uma recomendação que pode transformar sua massa muscular e recuperação.</p>
                      </div>
                    )}

                    {/* Formulário Completo - Etapa 1 */}
                    {etapaPreviewCalcProteina === 1 && (
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

                        {/* Objetivos */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-3">🎯 Seus objetivos (opcional)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                              <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                              <span className="text-gray-700">💪 Ganhar massa muscular</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                              <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                              <span className="text-gray-700">⚖️ Manter peso atual</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                              <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                              <span className="text-gray-700">🔥 Perder gordura</span>
                            </label>
                            <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                              <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                              <span className="text-gray-700">🏃‍♂️ Melhorar performance</span>
                            </label>
                          </div>
                          <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Motivação</p>
                        </div>
                      </div>
                    )}

                    {/* Resultado Visual - Etapa 2 */}
                    {etapaPreviewCalcProteina === 2 && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Proteína</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-red-600 mb-2">112g</div>
                            <div className="text-lg font-semibold text-green-600">Proteína Diária Recomendada</div>
                            <div className="text-sm text-gray-600">Baseado em 1.6g/kg para ganho de massa</div>
                          </div>
                          
                          {/* Distribuição Diária */}
                          <div className="mb-4">
                            <h5 className="font-semibold text-gray-800 mb-2">📅 Distribuição Diária:</h5>
                            <div className="space-y-2 text-sm">
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
                          
                          {/* Escala Visual */}
                          <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                            <div className="absolute left-0 top-0 h-6 bg-red-500 rounded-full" style={{width: '20%'}}></div>
                            <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '60%'}}></div>
                            <div className="absolute left-0 top-0 h-6 bg-blue-500 rounded-full" style={{width: '20%'}}></div>
                          </div>
                          
                          {/* Legendas */}
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-red-600 font-semibold">Baixa</div>
                              <div className="text-gray-600">&lt; 0.8g/kg</div>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-green-600 font-semibold">Normal</div>
                              <div className="text-gray-600">0.8-1.2g/kg</div>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-blue-600 font-semibold">Alta</div>
                              <div className="text-gray-600">&gt; 1.2g/kg</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                      </div>
                    )}

                    {/* Resultados Possíveis - Etapa 3 */}
                    {etapaPreviewCalcProteina === 3 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                        
                        {/* Resultado 1: Baixa Proteína */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Baixa Proteína</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 0.8g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sua ingestão proteica está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saciedade</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que 70% das pessoas que treinam consomem menos proteína do que precisam para otimizar resultados. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação nutricional para um plano personalizado que distribua proteína ao longo do dia de forma estratégica</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo proteico inicial com 1.2-1.6g/kg de peso corporal, distribuído em 4-5 refeições, ajustado conforme sua resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Whey protein pode ser considerado, mas sempre de acordo com a individualidade biológica e em doses adequadas</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Aumente carnes magras, ovos, leguminosas e laticínios de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.</p>
                          </div>
                        </div>

                        {/* Resultado 2: Proteína Normal */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">⚖️ Proteína Normal</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0.8-1.2g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sua ingestão proteica está adequada, mantenha o padrão e considere otimizações estratégicas</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise nutricional identifica oportunidades específicas para você</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada, ajustada conforme seu perfil metabólico e objetivos pessoais</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade proteica. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.</p>
                          </div>
                        </div>

                        {/* Resultado 3: Alta Proteína */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">🚀 Alta Proteína</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 1.2g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sua ingestão proteica está elevada, o que pode ser otimizada para máximo benefício com menor sobrecarga</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Ingestão proteica acima do necessário pode não trazer benefícios adicionais. Estudos mostram que acima de 2.2g/kg há pouco ganho adicional. Uma avaliação nutricional identifica se está dentro da faixa ideal ou pode ser ajustada</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha proteína em nível adequado (1.6-2.0g/kg) e redistribua calorias para outros nutrientes essenciais. Considere avaliação para otimização do plano</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização com redistribuição nutricional balanceada, ajustada conforme seu perfil metabólico e objetivos</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você realmente precisa de suplementação adicional. O protocolo é personalizado conforme seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Otimize distribuição proteica e diversifique outros nutrientes. Um plano personalizado ajusta quantidades e combinações ideais para você</p>
                            <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua nutrição de forma completa e equilibrada com apoio personalizado.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewCalcProteina(Math.max(0, etapaPreviewCalcProteina - 1))}
                        disabled={etapaPreviewCalcProteina === 0}
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
                              onClick={() => setEtapaPreviewCalcProteina(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewCalcProteina === etapa
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={labels[etapa]}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewCalcProteina(Math.min(3, etapaPreviewCalcProteina + 1))}
                        disabled={etapaPreviewCalcProteina === 3}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculadora de Água */}
              {templatePreviewSelecionado.id === 'calculadora-agua' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    💧 Preview da Calculadora de Água - "Quanta água você precisa por dia?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewCalcAgua === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">💧 Calcule Sua Necessidade Diária de Água</h4>
                        <p className="text-gray-700 mb-3">Descubra exatamente quanta água seu corpo precisa por dia — e receba orientações personalizadas baseadas em seu peso, atividade física e clima.</p>
                        <p className="text-blue-600 font-semibold">💪 Uma recomendação que pode transformar sua hidratação e performance.</p>
                      </div>
                    )}

                    {/* Formulário Completo - Etapa 1 */}
                    {etapaPreviewCalcAgua === 1 && (
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
                    )}

                    {/* Resultado Visual - Etapa 2 */}
                    {etapaPreviewCalcAgua === 2 && (
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
                    )}

                    {/* Resultados Possíveis - Etapa 3 */}
                    {etapaPreviewCalcAgua === 3 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                        
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
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewCalcAgua(Math.max(0, etapaPreviewCalcAgua - 1))}
                        disabled={etapaPreviewCalcAgua === 0}
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
                              onClick={() => setEtapaPreviewCalcAgua(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewCalcAgua === etapa
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={labels[etapa]}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewCalcAgua(Math.min(3, etapaPreviewCalcAgua + 1))}
                        disabled={etapaPreviewCalcAgua === 3}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculadora de Calorias */}
              {templatePreviewSelecionado.id === 'calculadora-calorias' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🔥 Preview da Calculadora de Calorias - "Quantas calorias você precisa por dia?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewCalcCalorias === 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🔥 Calcule Sua Necessidade Diária de Calorias</h4>
                        <p className="text-gray-700 mb-3">Descubra exatamente quantas calorias seu corpo precisa por dia — e receba orientações personalizadas baseadas em seu objetivo: emagrecer, manter ou ganhar peso.</p>
                        <p className="text-orange-600 font-semibold">💪 Uma recomendação que pode transformar sua composição corporal.</p>
                      </div>
                    )}

                    {/* Formulário Completo - Etapa 1 */}
                    {etapaPreviewCalcCalorias === 1 && (
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
                    )}

                    {/* Resultado Visual - Etapa 2 */}
                    {etapaPreviewCalcCalorias === 2 && (
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
                    )}

                    {/* Resultados Possíveis - Etapa 3 */}
                    {etapaPreviewCalcCalorias === 3 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                        
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
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewCalcCalorias(Math.max(0, etapaPreviewCalcCalorias - 1))}
                        disabled={etapaPreviewCalcCalorias === 0}
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
                              onClick={() => setEtapaPreviewCalcCalorias(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewCalcCalorias === etapa
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={labels[etapa]}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewCalcCalorias(Math.min(3, etapaPreviewCalcCalorias + 1))}
                        disabled={etapaPreviewCalcCalorias === 3}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Detox */}
              {templatePreviewSelecionado.id === 'checklist-detox' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🧽 Preview do Checklist Detox - "Seu corpo precisa de detox?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewChecklistDetox === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🧽 Avalie Seu Nível de Toxicidade</h4>
                        <p className="text-gray-700 mb-3">Descubra se seu corpo está acumulando toxinas e receba orientações personalizadas para desintoxicação baseadas em seus hábitos e sinais corporais.</p>
                        <p className="text-green-600 font-semibold">💪 Uma avaliação que pode transformar sua saúde e bem-estar.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewChecklistDetox >= 1 && etapaPreviewChecklistDetox <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewChecklistDetox === 1 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🍎 1. Como você se sente após as refeições?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="refeicoes-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Energizado e leve</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="refeicoes-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Pesado e sonolento</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="refeicoes-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Inchado e desconfortável</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Autoconhecimento</p>
                          </div>
                        )}

                        {etapaPreviewChecklistDetox === 2 && (
                          <div className="bg-emerald-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-emerald-900 mb-3">💧 2. Como está sua hidratação diária?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="hidratacao-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo 2-3L de água por dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="hidratacao-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo 1-2L de água por dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="hidratacao-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo menos de 1L de água por dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-emerald-600 mt-2">🧠 Gatilho: Consciência hidratacional</p>
                          </div>
                        )}

                        {etapaPreviewChecklistDetox === 3 && (
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-teal-900 mb-3">🌱 3. Quantos vegetais você consome por dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="vegetais-detox" className="mr-3" disabled />
                                <span className="text-gray-700">5+ porções de vegetais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="vegetais-detox" className="mr-3" disabled />
                                <span className="text-gray-700">3-4 porções de vegetais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="vegetais-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Menos de 3 porções de vegetais</span>
                              </label>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência nutricional</p>
                          </div>
                        )}

                        {etapaPreviewChecklistDetox === 4 && (
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-900 mb-3">😴 4. Como está sua qualidade do sono?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="sono-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Durmo bem e acordo descansado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="sono-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Durmo, mas acordo cansado</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="sono-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho dificuldade para dormir</span>
                              </label>
                            </div>
                            <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência do sono</p>
                          </div>
                        )}

                        {etapaPreviewChecklistDetox === 5 && (
                          <div className="bg-lime-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-lime-900 mb-3">⚡ 5. Como está seu nível de energia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="energia-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Energia alta e constante</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="energia-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Energia moderada com altos e baixos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="energia-detox" className="mr-3" disabled />
                                <span className="text-gray-700">Energia baixa e fadiga constante</span>
                              </label>
                            </div>
                            <p className="text-xs text-lime-600 mt-2">🧠 Gatilho: Consciência energética</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewChecklistDetox === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Checklist</h4>
                        
                        {/* Resultado 1: Baixa Toxicidade */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🛡️ Baixa Toxicidade</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-3 sinais</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.diagnostico}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.causaRaiz}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.acaoImediata}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.plano7Dias}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.suplementacao}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.alimentacao}</p>
                            {checklistDetoxDiagnosticos.nutri.baixaToxicidade.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistDetoxDiagnosticos.nutri.baixaToxicidade.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Toxicidade Moderada */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚠️ Toxicidade Moderada</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">4-6 sinais</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.diagnostico}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.causaRaiz}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.acaoImediata}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.plano7Dias}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.suplementacao}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.alimentacao}</p>
                            {checklistDetoxDiagnosticos.nutri.toxicidadeModerada.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistDetoxDiagnosticos.nutri.toxicidadeModerada.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Alta Toxicidade */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">🚨 Alta Toxicidade</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">7+ sinais</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{checklistDetoxDiagnosticos.nutri.altaToxicidade.diagnostico}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.altaToxicidade.causaRaiz}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.altaToxicidade.acaoImediata}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.altaToxicidade.plano7Dias}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.altaToxicidade.suplementacao}</p>
                            <p className="text-gray-700">{checklistDetoxDiagnosticos.nutri.altaToxicidade.alimentacao}</p>
                            {checklistDetoxDiagnosticos.nutri.altaToxicidade.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistDetoxDiagnosticos.nutri.altaToxicidade.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewChecklistDetox(Math.max(0, etapaPreviewChecklistDetox - 1))}
                        disabled={etapaPreviewChecklistDetox === 0}
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
                              onClick={() => setEtapaPreviewChecklistDetox(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewChecklistDetox === etapa
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
                        onClick={() => setEtapaPreviewChecklistDetox(Math.min(6, etapaPreviewChecklistDetox + 1))}
                        disabled={etapaPreviewChecklistDetox === 6}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Alimentar */}
              {templatePreviewSelecionado.id === 'checklist-alimentar' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🍽️ Preview do Checklist Alimentar - "Como está sua alimentação?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewChecklistAlimentar === 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🍽️ Avalie Seus Hábitos Alimentares</h4>
                        <p className="text-gray-700 mb-3">Descubra como está sua alimentação e receba orientações personalizadas para melhorar seus hábitos alimentares baseadas em sua rotina atual.</p>
                        <p className="text-orange-600 font-semibold">💪 Uma avaliação que pode transformar sua relação com a comida.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewChecklistAlimentar >= 1 && etapaPreviewChecklistAlimentar <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewChecklistAlimentar === 1 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">🥗 1. Quantas refeições você faz por dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">5-6 refeições pequenas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">3-4 refeições principais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="refeicoes-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">1-2 refeições por dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Consciência alimentar</p>
                          </div>
                        )}

                        {etapaPreviewChecklistAlimentar === 2 && (
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-900 mb-3">🥕 2. Quantos vegetais você consome por dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">5+ porções de vegetais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">3-4 porções de vegetais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="vegetais-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Menos de 3 porções de vegetais</span>
                              </label>
                            </div>
                            <p className="text-xs text-amber-600 mt-2">🧠 Gatilho: Consciência nutricional</p>
                          </div>
                        )}

                        {etapaPreviewChecklistAlimentar === 3 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-900 mb-3">🍎 3. Quantas frutas você consome por dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">3+ porções de frutas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">1-2 porções de frutas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="frutas-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente como frutas</span>
                              </label>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Consciência de micronutrientes</p>
                          </div>
                        )}

                        {etapaPreviewChecklistAlimentar === 4 && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-3">🍔 4. Com que frequência você come alimentos processados?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente como processados</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Às vezes como processados</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="processados-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Frequentemente como processados</span>
                              </label>
                            </div>
                            <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Consciência de qualidade</p>
                          </div>
                        )}

                        {etapaPreviewChecklistAlimentar === 5 && (
                          <div className="bg-pink-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-pink-900 mb-3">💧 5. Como está sua hidratação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo 2-3L de água por dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo 1-2L de água por dia</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="hidratacao-alimentar" className="mr-3" disabled />
                                <span className="text-gray-700">Bebo menos de 1L de água por dia</span>
                              </label>
                            </div>
                            <p className="text-xs text-pink-600 mt-2">🧠 Gatilho: Consciência hidratacional</p>
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
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoDeficiente.proximoPasso}</p>
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
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoModerada.proximoPasso}</p>
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
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{checklistAlimentarDiagnosticos.nutri.alimentacaoEquilibrada.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
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
                                  ? 'bg-orange-600 text-white'
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
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mini E-book Educativo */}
              {templatePreviewSelecionado.id === 'mini-ebook' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    📚 Preview do Mini E-book Educativo - "Como está seu conhecimento?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewMiniEbook === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">📚 Avalie Seu Conhecimento Nutricional</h4>
                        <p className="text-gray-700 mb-3">Descubra seu nível de conhecimento sobre nutrição e receba orientações personalizadas para evoluir seus conhecimentos baseadas em sua área de interesse.</p>
                        <p className="text-blue-600 font-semibold">💪 Uma avaliação que pode transformar seu conhecimento nutricional.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewMiniEbook >= 1 && etapaPreviewMiniEbook <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewMiniEbook === 1 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">📖 1. Qual é seu nível de conhecimento sobre macronutrientes?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="macronutrientes-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço bem carboidratos, proteínas e gorduras</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="macronutrientes-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço o básico sobre macronutrientes</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="macronutrientes-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Não sei muito sobre macronutrientes</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Consciência nutricional</p>
                          </div>
                        )}

                        {etapaPreviewMiniEbook === 2 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">💊 2. Qual é seu conhecimento sobre suplementação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="suplementacao-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço bem tipos e funções dos suplementos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="suplementacao-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço o básico sobre suplementos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="suplementacao-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Não sei muito sobre suplementos</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Consciência suplementar</p>
                          </div>
                        )}

                        {etapaPreviewMiniEbook === 3 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">🥗 3. Qual é seu conhecimento sobre alimentação funcional?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="funcional-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço bem alimentos funcionais e seus benefícios</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="funcional-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço o básico sobre alimentos funcionais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="funcional-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Não sei muito sobre alimentos funcionais</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Consciência funcional</p>
                          </div>
                        )}

                        {etapaPreviewMiniEbook === 4 && (
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-900 mb-3">🧘‍♀️ 4. Qual é seu conhecimento sobre bem-estar e saúde?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço bem pilares do bem-estar e saúde</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Conheço o básico sobre bem-estar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Não sei muito sobre bem-estar</span>
                              </label>
                            </div>
                            <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência de bem-estar</p>
                          </div>
                        )}

                        {etapaPreviewMiniEbook === 5 && (
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-teal-900 mb-3">📚 5. Com que frequência você busca conhecimento nutricional?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Diariamente busco conhecimento nutricional</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Semanalmente busco conhecimento nutricional</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-ebook" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente busco conhecimento nutricional</span>
                              </label>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência de aprendizado</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewMiniEbook === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Mini E-book</h4>
                        
                        {/* Resultado 1: Baixo Conhecimento */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Baixo Conhecimento</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-40 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{miniEbookDiagnosticos.nutri.baixoConhecimento.diagnostico}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.baixoConhecimento.causaRaiz}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.baixoConhecimento.acaoImediata}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.baixoConhecimento.plano7Dias}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.baixoConhecimento.suplementacao}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.baixoConhecimento.alimentacao}</p>
                            {miniEbookDiagnosticos.nutri.baixoConhecimento.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{miniEbookDiagnosticos.nutri.baixoConhecimento.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Conhecimento Moderado */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚠️ Conhecimento Moderado</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">41-70 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{miniEbookDiagnosticos.nutri.conhecimentoModerado.diagnostico}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.conhecimentoModerado.causaRaiz}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.conhecimentoModerado.acaoImediata}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.conhecimentoModerado.plano7Dias}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.conhecimentoModerado.suplementacao}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.conhecimentoModerado.alimentacao}</p>
                            {miniEbookDiagnosticos.nutri.conhecimentoModerado.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{miniEbookDiagnosticos.nutri.conhecimentoModerado.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Alto Conhecimento */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🚀 Alto Conhecimento</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">71-100 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{miniEbookDiagnosticos.nutri.altoConhecimento.diagnostico}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.altoConhecimento.causaRaiz}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.altoConhecimento.acaoImediata}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.altoConhecimento.plano7Dias}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.altoConhecimento.suplementacao}</p>
                            <p className="text-gray-700">{miniEbookDiagnosticos.nutri.altoConhecimento.alimentacao}</p>
                            {miniEbookDiagnosticos.nutri.altoConhecimento.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{miniEbookDiagnosticos.nutri.altoConhecimento.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewMiniEbook(Math.max(0, etapaPreviewMiniEbook - 1))}
                        disabled={etapaPreviewMiniEbook === 0}
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
                              onClick={() => setEtapaPreviewMiniEbook(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewMiniEbook === etapa
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
                        onClick={() => setEtapaPreviewMiniEbook(Math.min(6, etapaPreviewMiniEbook + 1))}
                        disabled={etapaPreviewMiniEbook === 6}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id !== 'quiz-interativo' && templatePreviewSelecionado.id !== 'calculadora-imc' && templatePreviewSelecionado.id !== 'quiz-bem-estar' && templatePreviewSelecionado.id !== 'quiz-perfil-nutricional' && templatePreviewSelecionado.id !== 'quiz-detox' && templatePreviewSelecionado.id !== 'quiz-energetico' && templatePreviewSelecionado.id !== 'calculadora-proteina' && templatePreviewSelecionado.id !== 'calculadora-agua' && templatePreviewSelecionado.id !== 'calculadora-calorias' && templatePreviewSelecionado.id !== 'checklist-detox' && templatePreviewSelecionado.id !== 'checklist-alimentar' && templatePreviewSelecionado.id !== 'mini-ebook' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    {templatePreviewSelecionado.icon} Preview do {templatePreviewSelecionado.nome}
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{templatePreviewSelecionado.nome}</h4>
                    <p className="text-gray-700 mb-3">{templatePreviewSelecionado.descricao}</p>
                    <p className="text-blue-600 font-semibold">{templatePreviewSelecionado.preview}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      Preview completo em desenvolvimento. Este template está disponível para uso.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - apenas botão de fechar */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setTemplatePreviewAberto(null)
                    setEtapaPreviewQuiz(0)
                    setEtapaPreviewQuizBemEstar(0)
                    setEtapaPreviewQuizPerfil(0)
                    setEtapaPreviewQuizDetox(0)
                    setEtapaPreviewQuizEnergetico(0)
                    setEtapaPreviewCalc(0)
                    setEtapaPreviewCalcProteina(0)
                    setEtapaPreviewCalcAgua(0)
                    setEtapaPreviewCalcCalorias(0)
                    setEtapaPreviewChecklistDetox(0)
                    setEtapaPreviewChecklistAlimentar(0)
                    setEtapaPreviewMiniEbook(0)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Fechar Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
