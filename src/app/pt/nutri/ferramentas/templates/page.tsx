'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function TemplatesNutri() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)
  const [etapaPreviewQuiz, setEtapaPreviewQuiz] = useState(0) // Para quiz: 0 = landing, 1-6 = perguntas, 7 = resultados
  const [etapaPreviewQuizBemEstar, setEtapaPreviewQuizBemEstar] = useState(0) // Para quiz-bem-estar: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewCalc, setEtapaPreviewCalc] = useState(0) // Para calculadora: 0 = landing, 1-3 = campos, 4 = resultados

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
                    setEtapaPreviewCalc(0)
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
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Sinais de baixa eficiência metabólica que pedem intervenção personalizada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Possíveis carências nutricionais e ritmos de refeição irregulares podem reduzir energia e disposição. Uma avaliação completa identifica onde ajustar para recuperar estabilidade</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo inicial focado em horários consistentes e presença de proteína em todas as refeições, com ajustes conforme sua resposta</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: A avaliação definirá o suporte ideal. Exemplos comuns incluem suporte a energia celular após análise individual</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Fortaleça a base com proteínas magras e gorduras boas (ex.: abacate, oleaginosas) enquanto aguarda sua avaliação</p>
                          </div>
                        </div>

                        {/* Resultado 2: Metabolismo Equilibrado */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">⚖️ Metabolismo Equilibrado</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">10-13 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Boa base metabólica com espaço para otimização</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Absorção e eficiência podem evoluir com ajustes finos. Uma análise detalhada mostra exatamente onde ganhar performance</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere avaliação para identificar microajustes com maior impacto</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Estratégias de timing e alimentos funcionais alinhados ao seu ritmo, com ajustes conforme resposta</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Vitaminas e minerais</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes para sustentar a otimização</p>
                          </div>
                        </div>

                        {/* Resultado 3: Metabolismo Acelerado */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">🚀 Metabolismo Acelerado</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">14-18 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Alta queima metabólica que pede estabilização inteligente</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Exigência energética elevada pode gerar desequilíbrios e fadiga. Uma avaliação indica como sustentar energia sem oscilações</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Considere fracionar refeições (5–6x/dia) e buscar análise para um plano que segure energia de forma consistente</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Ajuste de carboidratos complexos com proteína distribuída ao longo do dia, monitorando resposta individual</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Definida após avaliação; foco em recuperação e estabilidade conforme seu perfil</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Priorize carboidratos complexos combinados a proteína para sustentar vitalidade</p>
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

                    {/* Campo 1: Dados - Etapa 1 */}
                    {etapaPreviewCalc === 1 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">📏 1. Informe seus dados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                            <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                            <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled />
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Precisão científica</p>
                      </div>
                    )}

                    {/* Campo 2: Sexo - Etapa 2 */}
                    {etapaPreviewCalc === 2 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-3">👤 2. Selecione seu sexo</h4>
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
                    )}

                    {/* Campo 3: Atividade - Etapa 3 */}
                    {etapaPreviewCalc === 3 && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ 3. Nível de atividade física (opcional)</h4>
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
                    )}

                    {/* Resultado Visual - Etapa 4 */}
                    {etapaPreviewCalc === 4 && (
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

                    {/* Resultados Possíveis - Etapa 5 */}
                    {etapaPreviewCalc === 5 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                        
                        {/* Resultado 1: Baixo Peso */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">📉 Baixo Peso</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 18.5</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica baixo peso, precisa de ganho saudável</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Ingestão calórica insuficiente ou metabolismo acelerado</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Aumente calorias com alimentos densos nutricionalmente</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo hipercalórico com 6 refeições diárias</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Whey Protein + Mass Gainer + Multivitamínico</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Aumente carboidratos complexos, proteínas e gorduras saudáveis</p>
                          </div>
                        </div>

                        {/* Resultado 2: Peso Normal */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">⚖️ Peso Normal</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">18.5 - 24.9</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC está normal, mantenha hábitos saudáveis</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa relação peso/altura, continue cuidando da saúde</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha alimentação equilibrada e exercícios regulares</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com alimentação variada e atividade física</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Multivitamínico + Ômega-3 + Probióticos</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha padrão atual, foque em qualidade nutricional</p>
                          </div>
                        </div>

                        {/* Resultado 3: Sobrepeso */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">📈 Sobrepeso</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">25.0 - 29.9</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica sobrepeso, precisa de redução controlada</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Desequilíbrio entre ingestão calórica e gasto energético</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Reduza calorias gradualmente com déficit de 300-500kcal/dia</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Protocolo de redução com alimentação controlada e exercícios</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Proteína magra + Termogênicos + Fibras</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Reduza carboidratos refinados, aumente proteínas e fibras</p>
                          </div>
                        </div>

                        {/* Resultado 4: Obesidade */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">⚠️ Obesidade</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">≥ 30.0</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">📋 DIAGNÓSTICO: Seu IMC indica obesidade, precisa de intervenção urgente</p>
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Desequilíbrio metabólico significativo com riscos à saúde</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque acompanhamento profissional para plano estruturado</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Intervenção nutricional com suporte multidisciplinar</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Suporte metabólico + Vitaminas + Minerais essenciais</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Reeducação alimentar completa com acompanhamento profissional</p>
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
                        {[0, 1, 2, 3, 4, 5].map((etapa) => {
                          const labels = ['Início', 'Dados', 'Sexo', 'Atividade', 'Resultado', 'Diagnósticos']
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
                        onClick={() => setEtapaPreviewCalc(Math.min(5, etapaPreviewCalc + 1))}
                        disabled={etapaPreviewCalc === 5}
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
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Uma avaliação completa identifica quais nutrientes estão faltando no seu organismo e como isso impacta sua rotina diária</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Busque uma avaliação nutricional para receber um protocolo de suplementação seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Um protocolo personalizado de 7 dias, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta ao plano</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação completa identifica quais suplementos seu corpo realmente precisa e em doses adequadas. Complexo B, magnésio e ômega-3 são frequentemente indicados, mas apenas após análise detalhada do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas preferências e objetivos para reequilibrar nutrientes de forma estratégica. Aumente frutas, verduras e grãos integrais enquanto aguarda sua avaliação profissional</p>
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
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Boa base nutricional, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Uma análise detalhada identifica exatamente o que pode fazer a diferença no seu desempenho e vitalidade</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Otimização com alimentos funcionais e estratégias de timing nutricional específicas para seu perfil metabólico e rotina</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você precisa de suplementação preventiva. Multivitamínico premium e probióticos costumam ser indicados, mas a dosagem e combinação são personalizadas após análise do seu caso</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Varie cores no prato e inclua alimentos antioxidantes. Um plano otimizado considera combinações específicas para maximizar absorção e resultados conforme seu perfil</p>
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
                            <p className="text-gray-700">🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores</p>
                            <p className="text-gray-700">⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias nutricionais avançadas que sustentam resultados a longo prazo</p>
                            <p className="text-gray-700">📅 PLANO 7 DIAS: Manutenção com alimentos anti-inflamatórios e protocolo preventivo personalizado para sustentabilidade e prevenção de declínios futuros</p>
                            <p className="text-gray-700">💊 SUPLEMENTAÇÃO: Uma análise preventiva identifica se você se beneficia de antioxidantes e adaptógenos para performance. O protocolo é personalizado conforme seu perfil metabólico atual</p>
                            <p className="text-gray-700">🍎 ALIMENTAÇÃO: Mantenha o padrão atual e considere introduzir alimentos funcionais premium e superalimentos para potencializar ainda mais seus resultados e prevenir declínios futuros</p>
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

              {/* Fallback para templates sem preview específico */}
              {templatePreviewSelecionado.id !== 'quiz-interativo' && templatePreviewSelecionado.id !== 'calculadora-imc' && templatePreviewSelecionado.id !== 'quiz-bem-estar' && (
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
                    setEtapaPreviewCalc(0)
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
