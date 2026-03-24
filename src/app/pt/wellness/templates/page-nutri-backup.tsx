"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import { diagnosticosNutri, calculadoraAguaDiagnosticos, calculadoraCaloriasDiagnosticos, checklistDetoxDiagnosticos, checklistAlimentarDiagnosticos, miniEbookDiagnosticos, guiaNutraceuticoDiagnosticos, guiaProteicoDiagnosticos, tabelaComparativaDiagnosticos, tabelaSubstituicoesDiagnosticos, planoAlimentarBaseDiagnosticos } from '@/lib/diagnosticos-nutri'
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
  const [etapaPreviewGuiaNutraceutico, setEtapaPreviewGuiaNutraceutico] = useState(0) // Para guia-nutraceutico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewGuiaProteico, setEtapaPreviewGuiaProteico] = useState(0) // Para guia-proteico: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewTabelaComparativa, setEtapaPreviewTabelaComparativa] = useState(0) // Para tabela-comparativa: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewTabelaSubstituicoes, setEtapaPreviewTabelaSubstituicoes] = useState(0) // Para tabela-substituicoes: 0 = landing, 1-5 = perguntas, 6 = resultados
  const [etapaPreviewParasitose, setEtapaPreviewParasitose] = useState(0) // Para diagnostico-parasitose: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewEletritos, setEtapaPreviewEletritos] = useState(0) // Para diagnostico-eletritos: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewMetabolico, setEtapaPreviewMetabolico] = useState(0) // Para diagnostico-perfil-metabolico: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewSintomasIntestinais, setEtapaPreviewSintomasIntestinais] = useState(0) // Para diagnostico-sintomas-intestinais: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewSono, setEtapaPreviewSono] = useState(0) // Para avaliacao-sono-energia: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewRetencao, setEtapaPreviewRetencao] = useState(0) // Para teste-retencao-liquidos: 0 = landing, 1-10 = perguntas, 11 = resultados
  const [etapaPreviewFomeEmocional, setEtapaPreviewFomeEmocional] = useState(0) // Para avaliacao-fome-emocional
  const [etapaPreviewTipoMetabolico, setEtapaPreviewTipoMetabolico] = useState(0) // Para diagnostico-tipo-metabolismo
  const [etapaPreviewSensibilidades, setEtapaPreviewSensibilidades] = useState(0) // Para avaliacao-sensibilidades-alimentares
  const [etapaPreviewSindMetabolica, setEtapaPreviewSindMetabolica] = useState(0) // Para avaliacao-risco-sindrome-metabolica
  const [etapaPreviewPerfilBemEstar, setEtapaPreviewPerfilBemEstar] = useState(0) // Para descoberta-perfil-bem-estar
  const [etapaPreviewTipoFome, setEtapaPreviewTipoFome] = useState(0) // Para quiz-tipo-fome
  const [etapaPreviewDetox, setEtapaPreviewDetox] = useState(0) // Para quiz-pedindo-detox
  const [etapaPreviewRotinaAlimentar, setEtapaPreviewRotinaAlimentar] = useState(0) // Para avaliacao-rotina-alimentar
  const [etapaPreviewProntidaoEmagrecer, setEtapaPreviewProntidaoEmagrecer] = useState(0) // Para pronto-emagrecer
  const [etapaPreviewAutoconhecimento, setEtapaPreviewAutoconhecimento] = useState(0) // Para autoconhecimento-corporal
  const [etapaPreviewDisciplinadoEmocional, setEtapaPreviewDisciplinadoEmocional] = useState(0) // Para disciplinado-emocional
  const [etapaPreviewNutridoAlimentado, setEtapaPreviewNutridoAlimentado] = useState(0) // Para nutrido-alimentado
  const [etapaPreviewPerfilIntestino, setEtapaPreviewPerfilIntestino] = useState(0) // Para perfil-intestino

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
    { id: 'guia-nutraceutico', nome: 'Guia Nutracêutico', categoria: 'Conteúdo', descricao: 'Guia completo sobre suplementos e nutracêuticos', icon: '💊', cor: 'blue', perguntas: 5, tempoEstimado: '3 min', leadsMedio: '48/mês', conversao: '29%', preview: 'Captação de interesse por suplementação' },
    { id: 'guia-proteico', nome: 'Guia Proteico', categoria: 'Conteúdo', descricao: 'Guia especializado sobre proteínas e fontes proteicas', icon: '🥛', cor: 'orange', perguntas: 5, tempoEstimado: '3 min', leadsMedio: '44/mês', conversao: '27%', preview: 'Especialização em nutrição proteica' },
    { id: 'tabela-comparativa', nome: 'Tabela Comparativa', categoria: 'Conteúdo', descricao: 'Tabelas comparativas de alimentos e nutrientes', icon: '📊', cor: 'green', perguntas: 5, tempoEstimado: '3 min', leadsMedio: '40/mês', conversao: '25%', preview: 'Ferramenta de conversão através de comparações' },
    { id: 'tabela-substituicoes', nome: 'Tabela de Substituições', categoria: 'Conteúdo', descricao: 'Tabela de substituições de alimentos para mais variedade', icon: '🔄', cor: 'blue', perguntas: 5, tempoEstimado: '3 min', leadsMedio: '36/mês', conversao: '23%', preview: 'Valor agregado através de substituições inteligentes' },
    
    
    // DIAGNÓSTICOS ESPECÍFICOS (19)
    { id: 'template-diagnostico-parasitose', nome: 'Diagnóstico de Parasitose', categoria: 'Diagnóstico', descricao: 'Ferramenta para diagnóstico de parasitose intestinal', icon: '🦠', cor: 'red', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '41/mês', conversao: '27%', preview: 'Diagnóstico específico de parasitose' },
    { id: 'diagnostico-eletritos', nome: 'Diagnóstico de Eletrólitos', categoria: 'Diagnóstico', descricao: 'Avalie sinais de desequilíbrio de sódio, potássio, magnésio e cálcio', icon: '⚡', cor: 'yellow', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '39/mês', conversao: '25%', preview: 'Detecta necessidade de reposição de eletrólitos' },
    { id: 'diagnostico-perfil-metabolico', nome: 'Avaliação do Perfil Metabólico', categoria: 'Diagnóstico', descricao: 'Identifique sinais de metabolismo acelerado, equilibrado ou lento', icon: '🔥', cor: 'orange', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '42/mês', conversao: '28%', preview: 'Classifica seu perfil metabólico e orienta próximos passos' },
    { id: 'diagnostico-sintomas-intestinais', nome: 'Diagnóstico de Sintomas Intestinais', categoria: 'Diagnóstico', descricao: 'Identifique sinais de constipação, disbiose, inflamação e irregularidade', icon: '💩', cor: 'purple', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '45/mês', conversao: '29%', preview: 'Detecta desequilíbrio intestinal e orienta próximos passos' },
    { id: 'avaliacao-sono-energia', nome: 'Avaliação do Sono e Energia', categoria: 'Diagnóstico', descricao: 'Avalie se o sono está restaurando sua energia diária', icon: '😴', cor: 'blue', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '40/mês', conversao: '26%', preview: 'Classifica o descanso e energia (baixo/moderado/alto comprometimento)' },
    { id: 'teste-retencao-liquidos', nome: 'Teste de Retenção de Líquidos', categoria: 'Diagnóstico', descricao: 'Avalie sinais de retenção hídrica e desequilíbrio mineral', icon: '💧', cor: 'teal', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '38/mês', conversao: '25%', preview: 'Detecta retenção hídrica e orienta próximos passos' },
    { id: 'avaliacao-fome-emocional', nome: 'Avaliação de Fome Emocional', categoria: 'Diagnóstico', descricao: 'Identifique se a alimentação está sendo influenciada por emoções e estresse', icon: '🧠', cor: 'pink', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '43/mês', conversao: '27%', preview: 'Avalia influência emocional na alimentação' },
    { id: 'diagnostico-tipo-metabolismo', nome: 'Diagnóstico do Tipo de Metabolismo', categoria: 'Diagnóstico', descricao: 'Avalie se seu metabolismo é lento, normal ou acelerado', icon: '⚙️', cor: 'gray', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '41/mês', conversao: '26%', preview: 'Classifica o tipo metabólico por sintomas e hábitos' },
    { id: 'disciplinado-emocional', nome: 'Você é mais disciplinado ou emocional com a comida?', categoria: 'Diagnóstico', descricao: 'Avalie se o comportamento alimentar é guiado mais por razão ou emoções', icon: '❤️‍🔥', cor: 'pink', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '43/mês', conversao: '28%', preview: 'Identifica perfil comportamental: disciplinado, intermediário ou emocional' },
    { id: 'nutrido-alimentado', nome: 'Você está nutrido ou apenas alimentado?', categoria: 'Diagnóstico', descricao: 'Descubra se está nutrido em nível celular ou apenas comendo calorias vazias', icon: '🍎', cor: 'orange', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '45/mês', conversao: '29%', preview: 'Avalia qualidade nutricional e deficiências celulares' },
    { id: 'perfil-intestino', nome: 'Qual é seu perfil de intestino?', categoria: 'Diagnóstico', descricao: 'Identifique o tipo de funcionamento intestinal e saúde digestiva', icon: '💩', cor: 'purple', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '42/mês', conversao: '27%', preview: 'Classifica perfil intestinal: equilibrado, preso/sensível ou disbiose' },
    { id: 'avaliacao-sensibilidades', nome: 'Avaliação de Intolerâncias/Sensibilidades', categoria: 'Diagnóstico', descricao: 'Detecte sinais de sensibilidades alimentares não diagnosticadas', icon: '⚠️', cor: 'red', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '44/mês', conversao: '28%', preview: 'Identifica possíveis reações alimentares e orienta próximos passos' },
    { id: 'avaliacao-sindrome-metabolica', nome: 'Risco de Síndrome Metabólica', categoria: 'Diagnóstico', descricao: 'Avalie fatores de risco ligados à resistência à insulina e inflamação', icon: '🚨', cor: 'gray', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '46/mês', conversao: '30%', preview: 'Sinaliza risco metabólico e orienta condutas' },
    { id: 'descoberta-perfil-bem-estar', nome: 'Descubra seu Perfil de Bem-Estar', categoria: 'Diagnóstico', descricao: 'Identifique se seu perfil é Estético, Equilibrado ou Saúde/Performance', icon: '🧭', cor: 'purple', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '47/mês', conversao: '31%', preview: 'Diagnóstico leve com convite à avaliação personalizada' },
    { id: 'quiz-tipo-fome', nome: 'Qual é o seu Tipo de Fome?', categoria: 'Diagnóstico', descricao: 'Identifique Fome Física, por Hábito ou Emocional', icon: '🍽️', cor: 'pink', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '44/mês', conversao: '29%', preview: 'Provoca curiosidade e direciona para avaliação' },
    { id: 'quiz-pedindo-detox', nome: 'Seu corpo está pedindo Detox?', categoria: 'Diagnóstico', descricao: 'Avalie sinais de sobrecarga e acúmulo de toxinas', icon: '💧', cor: 'teal', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '46/mês', conversao: '30%', preview: 'Sinaliza necessidade de detox guiado' },
    { id: 'avaliacao-rotina-alimentar', nome: 'Você está se alimentando conforme sua rotina?', categoria: 'Diagnóstico', descricao: 'Descubra se sua rotina alimentar está adequada aos horários e demandas', icon: '⏰', cor: 'blue', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '43/mês', conversao: '28%', preview: 'Aponta alinhamento da rotina e sugere reeducação' },
    { id: 'pronto-emagrecer', nome: 'Pronto para Emagrecer com Saúde?', categoria: 'Diagnóstico', descricao: 'Avalie seu nível de prontidão física e emocional', icon: '🏁', cor: 'green', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '48/mês', conversao: '32%', preview: 'Identifica prontidão e direciona para preparação personalizada' },
    { id: 'autoconhecimento-corporal', nome: 'Você conhece o seu corpo?', categoria: 'Diagnóstico', descricao: 'Avalie seu nível de autoconhecimento corporal e nutricional', icon: '🧠', cor: 'purple', perguntas: 10, tempoEstimado: '3 min', leadsMedio: '45/mês', conversao: '30%', preview: 'Mostra o quanto você entende seus sinais físicos e emocionais' }
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
      {/* Barra de Navegação */}
      <NutriNavBar showTitle title="Templates NUTRI" />

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                    setEtapaPreviewGuiaNutraceutico(0)
                    setEtapaPreviewGuiaProteico(0)
                    setEtapaPreviewTabelaComparativa(0)
                    setEtapaPreviewTabelaSubstituicoes(0)
                    setEtapaPreviewParasitose(0)
                    setEtapaPreviewEletritos(0)
                    setEtapaPreviewMetabolico(0)
                    setEtapaPreviewSintomasIntestinais(0)
                    setEtapaPreviewSono(0)
                    setEtapaPreviewRetencao(0)
                    setEtapaPreviewFomeEmocional(0)
                    setEtapaPreviewTipoMetabolico(0)
                    setEtapaPreviewSensibilidades(0)
                    setEtapaPreviewSindMetabolica(0)
                    setEtapaPreviewPerfilBemEstar(0)
                    setEtapaPreviewTipoFome(0)
                    setEtapaPreviewDetox(0)
                    setEtapaPreviewRotinaAlimentar(0)
                    setEtapaPreviewProntidaoEmagrecer(0)
                    setEtapaPreviewAutoconhecimento(0)
                    setEtapaPreviewDisciplinadoEmocional(0)
                    setEtapaPreviewNutridoAlimentado(0)
                    setEtapaPreviewPerfilIntestino(0)
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
      </main>
      {/* Modal de Preview do Fluxo */}
      {templatePreviewSelecionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setTemplatePreviewAberto(null)
          }
        }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
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
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              {/* Renderizar preview baseado no ID do template */}
              {templatePreviewSelecionado.id === 'diagnostico-eletritos' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">⚡ Preview do Diagnóstico de Eletrólitos</h3>
                  <div className="relative">
                    {etapaPreviewEletritos === 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Seu corpo está pedindo eletrólitos?</h4>
                        <p className="text-gray-700 mb-2">Eletrólitos (sódio, potássio, magnésio, cálcio) são essenciais para hidratação, energia e função muscular.</p>
                        <p className="text-amber-700 font-semibold">Faça este diagnóstico rápido e descubra se você precisa repor minerais.</p>
                      </div>
                    )}

                    {etapaPreviewEletritos >= 1 && etapaPreviewEletritos <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente cansaço ou fraqueza mesmo dormindo bem?',
                          'Tem dores de cabeça, especialmente em dias quentes?',
                          'Já sentiu câimbras ou tremores musculares?',
                          'Sua boca ou pele ficam ressecadas com frequência?',
                          'Você sua muito ou pratica atividade física regularmente?',
                          'Costuma beber pouca água (menos de 1,5L por dia)?',
                          'Sente tontura ao levantar (sensação de pressão baixa)?',
                          'Percebe retenção de líquidos (inchaço)?',
                          'Consome poucos alimentos ricos em minerais (banana, folhas verdes, coco, abacate, sementes)?',
                          'Usa álcool, café ou diuréticos com frequência?'
                        ].map((pergunta, index) => (
                          etapaPreviewEletritos === index + 1 && (
                            <div key={index} className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-amber-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência dos sinais.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {etapaPreviewEletritos === 11 && (
                      <div className="space-y-4">
                        {/* Baixo */}
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Equilíbrio Bom (0–10)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Níveis de eletrólitos aparentam estar equilibrados.</p>
                            <p><strong>CAUSA RAIZ:</strong> Bons hábitos de hidratação e alimentação mineralizada.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter ingestão hídrica e alimentação natural.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Água ao longo do dia; incluir água de coco, frutas e folhas.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Não necessária salvo orientação profissional.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar fontes ricas em minerais (banana, abacate, folhas, sementes).</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Monitorar sinais em dias quentes/treinos intensos.</p>
                          </div>
                        </div>

                        {/* Moderado */}
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Necessidade Moderada (11–25)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais de leve desequilíbrio eletrolítico.</p>
                            <p><strong>CAUSA RAIZ:</strong> Suor elevado, baixo consumo hídrico ou consumo de diuréticos.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Aumentar ingestão de água e alimentos ricos em minerais.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Rotina hídrica; sal marinho moderado; água de coco pós‑treino.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Considerar magnésio/potássio somente com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reforçar frutas, legumes, sementes e caldos.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Agendar avaliação para ajuste individualizado.</p>
                          </div>
                        </div>

                        {/* Alto */}
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Alta Necessidade (26–40)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Fortes sinais de desequilíbrio de eletrólitos.</p>
                            <p><strong>CAUSA RAIZ:</strong> Perdas elevadas por suor/diurese e baixa reposição mineral.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Procurar avaliação profissional antes de suplementar.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo de reidratação guiado; caldos e eletrólitos alimentares.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente com orientação e dosagem adequada.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reforçar alimentos mineralizantes e reduzir diuréticos.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Exames/avaliação para plano personalizado.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewEletritos(Math.max(0, etapaPreviewEletritos - 1))}
                        disabled={etapaPreviewEletritos === 0}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      <div className="flex space-x-2">
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map((etapa) => {
                          const labels = ['Início','1','2','3','4','5','6','7','8','9','10','Resultados']
                          return (
                            <button
                              key={etapa}
                              onClick={() => setEtapaPreviewEletritos(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewEletritos === etapa
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapa === 0 ? 'Tela Inicial' : etapa === 11 ? 'Resultados' : `Pergunta ${etapa}`}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewEletritos(Math.min(11, etapaPreviewEletritos + 1))}
                        disabled={etapaPreviewEletritos === 11}
                        className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'diagnostico-perfil-metabolico' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🔥 Preview da Avaliação do Perfil Metabólico</h3>
                  <div className="relative">
                    {etapaPreviewMetabolico === 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Como está seu metabolismo hoje?</h4>
                        <p className="text-gray-700 mb-2">Identifique sinais de metabolismo lento, equilibrado ou acelerado com 10 perguntas rápidas.</p>
                        <p className="text-orange-700 font-semibold">No final, veja o resultado e orientações personalizadas em 7 etapas.</p>
                      </div>
                    )}

                    {etapaPreviewMetabolico >= 1 && etapaPreviewMetabolico <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente cansaço constante mesmo dormindo bem?',
                          'Tem dificuldade para emagrecer, mesmo comendo pouco?',
                          'Sente-se inchado(a) com frequência, especialmente ao final do dia?',
                          'Costuma ter mãos e pés frios ou sente frio com facilidade?',
                          'Sente fome exagerada ou vontade de comer doces frequentemente?',
                          'Tem variação de humor e energia ao longo do dia?',
                          'Sua digestão é lenta ou sente empachamento após comer?',
                          'Dorme mal ou acorda cansado(a)?',
                          'Tem retenção de líquidos ou peso que oscila rapidamente?',
                          'Você pratica atividade física regularmente (3x por semana ou mais)?'
                        ].map((pergunta, index) => (
                          etapaPreviewMetabolico === index + 1 && (
                            <div key={index} className="bg-orange-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-orange-900 mb-3">{index + 1}. {pergunta}{index === 9 && ' (esta é invertida)'} </h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-orange-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência (a questão 10 é invertida na pontuação).</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {etapaPreviewMetabolico === 11 && (
                      <div className="space-y-4">
                        {/* Acelerado */}
                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-rose-900">Resultado: Metabolismo Acelerado (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-rose-600 text-white">Acelerado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais de queima energética alta e instável.</p>
                            <p><strong>CAUSA RAIZ:</strong> Baixa densidade nutricional/calórica, estresse ou treinos intensos sem reposição adequada.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Refeições equilibradas a cada 3h com proteína + gordura boa.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Ajuste calórico controlado; priorize sono e recuperação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Reposição mineral (magnésio, potássio) somente com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Enfatizar proteínas completas, carboidratos complexos e gorduras boas.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação metabólica para calibrar ingestão e proteger massa magra.</p>
                          </div>
                        </div>

                        {/* Equilibrado */}
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Metabolismo Equilibrado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Equilibrado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Funcionamento energético adequado e estável.</p>
                            <p><strong>CAUSA RAIZ:</strong> Bons hábitos de sono, hidratação, atividade e alimentação variada.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter rotina e revisar hidratação/fibras.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Plano equilibrado com proteínas, fibras e vegetais diariamente.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se houver necessidade identificada.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos in natura e timing adequado ao treino.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação metabólica para objetivo específico (emagrecer/ganhar/manter).</p>
                          </div>
                        </div>

                        {/* Lento */}
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-orange-900">Resultado: Metabolismo Lento (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-600 text-white">Lento</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais de queima reduzida com tendência a inchaço e fadiga.</p>
                            <p><strong>CAUSA RAIZ:</strong> Baixa massa magra, sono insuficiente e alimentação inadequada.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Aumentar proteína e fibras; evitar longos períodos em jejum.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições fracionadas ricas em proteína + treino de força leve.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Considerar apoio metabólico apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reduzir ultraprocessados e açúcar; priorizar integrais.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Consulta para identificar gatilhos e acelerar o metabolismo com segurança.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewMetabolico(Math.max(0, etapaPreviewMetabolico - 1))}
                        disabled={etapaPreviewMetabolico === 0}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      <div className="flex space-x-2">
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map((etapa) => {
                          const labels = ['Início','1','2','3','4','5','6','7','8','9','10','Resultados']
                          return (
                            <button
                              key={etapa}
                              onClick={() => setEtapaPreviewMetabolico(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewMetabolico === etapa
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapa === 0 ? 'Tela Inicial' : etapa === 11 ? 'Resultados' : `Pergunta ${etapa}`}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewMetabolico(Math.min(11, etapaPreviewMetabolico + 1))}
                        disabled={etapaPreviewMetabolico === 11}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'diagnostico-sintomas-intestinais' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">💩 Preview do Diagnóstico de Sintomas Intestinais</h3>
                  <div className="relative">
                    {etapaPreviewSintomasIntestinais === 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Como está o seu intestino?</h4>
                        <p className="text-gray-700 mb-2">Identifique sinais de disfunções intestinais, como constipação, disbiose, inflamação, gases e irregularidade.</p>
                        <p className="text-purple-700 font-semibold">Responda 10 perguntas e veja o diagnóstico com orientações em 7 etapas.</p>
                      </div>
                    )}

                    {etapaPreviewSintomasIntestinais >= 1 && etapaPreviewSintomasIntestinais <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente inchaço abdominal com frequência?',
                          'Costuma ter gases em excesso (arrotos ou flatulência)?',
                          'Percebe variações no ritmo intestinal (dias de diarreia e outros de prisão de ventre)?',
                          'Nota odor forte nas fezes ou gases?',
                          'Sente dores abdominais recorrentes, especialmente após comer?',
                          'Tem fezes muito ressecadas ou muito moles com frequência?',
                          'Observa muco, restos de alimentos ou gordura nas fezes?',
                          'Sente muito sono ou cansaço após as refeições?',
                          'Apresenta queda de imunidade (gripes, aftas ou infecções frequentes)?',
                          'Usa antibióticos, antiácidos ou laxantes com frequência?'
                        ].map((pergunta, index) => (
                          etapaPreviewSintomasIntestinais === index + 1 && (
                            <div key={index} className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-purple-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-purple-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência dos sinais.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {etapaPreviewSintomasIntestinais === 11 && (
                      <div className="space-y-4">
                        {/* Equilíbrio */}
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Equilíbrio Intestinal (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Equilíbrio</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Função intestinal dentro da normalidade.</p>
                            <p><strong>CAUSA RAIZ:</strong> Hábitos consistentes de alimentação, hidratação e rotina.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter fibras, água e probióticos naturais.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Rotina com frutas, vegetais, cereais integrais e água.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se indicado por profissional.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Evitar ultraprocessados; observar reações a industrializados.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter constância; reavaliar se surgirem sintomas novos.</p>
                          </div>
                        </div>

                        {/* Moderado */}
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Desequilíbrio Moderado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais de desajuste na microbiota/digestão irregular.</p>
                            <p><strong>CAUSA RAIZ:</strong> Baixa ingestão de fibras/água, excesso de açúcar/medicamentos.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Aumentar fibras solúveis, hidratação e reduzir açúcar.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Inclusão de prebióticos (aveia, banana verde) e probióticos alimentares.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Probióticos/enzimas apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Evitar frituras e ultraprocessados; refeições regulares.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação nutricional para identificar gatilhos e restaurar a microbiota.</p>
                          </div>
                        </div>

                        {/* Importante */}
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Disfunção Intestinal Importante (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Importante</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Forte suspeita de disbiose, inflamação ou má absorção.</p>
                            <p><strong>CAUSA RAIZ:</strong> Uso recorrente de medicamentos, alimentação inadequada, infecções.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Procurar avaliação para definir conduta e exames.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo anti-inflamatório leve; caldos, cozidos e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Probióticos específicos e suporte digestivo apenas com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Remover ultraprocessados; priorizar integrais e especiarias.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Consulta para plano de limpeza/regeneração intestinal baseado em evidências.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewSintomasIntestinais(Math.max(0, etapaPreviewSintomasIntestinais - 1))}
                        disabled={etapaPreviewSintomasIntestinais === 0}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      <div className="flex space-x-2">
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map((etapa) => {
                          const labels = ['Início','1','2','3','4','5','6','7','8','9','10','Resultados']
                          return (
                            <button
                              key={etapa}
                              onClick={() => setEtapaPreviewSintomasIntestinais(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewSintomasIntestinais === etapa
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapa === 0 ? 'Tela Inicial' : etapa === 11 ? 'Resultados' : `Pergunta ${etapa}`}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewSintomasIntestinais(Math.min(11, etapaPreviewSintomasIntestinais + 1))}
                        disabled={etapaPreviewSintomasIntestinais === 11}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'avaliacao-sono-energia' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">😴 Preview da Avaliação do Sono e Energia</h3>
                  <div className="relative">
                    {etapaPreviewSono === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Seu corpo está recuperando energia?</h4>
                        <p className="text-gray-700 mb-2">Descubra se seu sono está restaurando sua energia e foco ao longo do dia.</p>
                      </div>
                    )}
                    {etapaPreviewSono >= 1 && etapaPreviewSono <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você demora para adormecer ou acorda várias vezes à noite?',
                          'Acorda cansado(a) mesmo dormindo mais de 7 horas?',
                          'Sente sonolência ou queda de energia após o almoço?',
                          'Precisa de café ou estimulantes para “funcionar” de manhã?',
                          'Sente dificuldade de concentração ao longo do dia?',
                          'Tem variações fortes de humor ou irritabilidade?',
                          'Costuma dormir menos de 6 horas por noite?',
                          'Usa celular ou TV até poucos minutos antes de dormir?',
                          'Sente fome ou vontade de doce à noite?',
                          'Dorme em horários irregulares?'
                        ].map((pergunta, index) => (
                          etapaPreviewSono === index + 1 && (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-blue-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência dos sinais.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewSono === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Sono Restaurador (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Bom</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Seu corpo parece descansar bem e repor energia.</p>
                            <p><strong>CAUSA RAIZ:</strong> Rotina, sono adequado e exposição à luz natural.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter higiene do sono e constância de horários.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Horários fixos; reduzir telas à noite; luz natural pela manhã.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Jantar leve, evitar estimulantes noturnos.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter hábitos e monitorar energia ao longo do dia.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Sono Levemente Prejudicado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Há sinais de fadiga acumulada e ritmo circadiano alterado.</p>
                            <p><strong>CAUSA RAIZ:</strong> Cafeína, telas noturnas, horários irregulares.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Reduzir cafeína, telas à noite e regular horários.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Higiene do sono, luz matinal e pausas de foco.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Considerar magnésio/teanina sob orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Ajustar carboidratos à noite; evitar refeições tardias.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Reorganizar rotina e reavaliar energia em 7–14 dias.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Sono e Energia Comprometidos (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Forte desequilíbrio no descanso e possível impacto metabólico.</p>
                            <p><strong>CAUSA RAIZ:</strong> Privação crônica de sono, estresse e hábitos noturnos inadequados.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Avaliação profissional para ajuste de sono e rotina.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Agenda de sono rígida; reduzir telas/cafeína; técnicas de relaxamento.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Só com orientação; evitar automedicação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições leves à noite; hidratação adequada.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Procurar acompanhamento para restabelecer sono e energia.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewSono(Math.max(0, etapaPreviewSono - 1))} disabled={etapaPreviewSono === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewSono(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewSono===e?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewSono(Math.min(11, etapaPreviewSono + 1))} disabled={etapaPreviewSono === 11} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'teste-retencao-liquidos' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">💧 Preview do Teste de Retenção de Líquidos</h3>
                  <div className="relative">
                    {etapaPreviewRetencao === 0 && (
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Há sinais de retenção hídrica?</h4>
                        <p className="text-gray-700 mb-2">Avalie circulação, hidratação e possível desequilíbrio mineral.</p>
                      </div>
                    )}
                    {etapaPreviewRetencao >= 1 && etapaPreviewRetencao <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Sente pernas, pés ou mãos inchadas no fim do dia?',
                          'Seus anéis ou sapatos ficam mais apertados ao longo do dia?',
                          'Tem sensação de peso nas pernas ou cansaço corporal?',
                          'Sente rosto inchado ao acordar?',
                          'Urina em pouca quantidade mesmo bebendo água?',
                          'Tem variações rápidas de peso (2kg+ em poucos dias)?',
                          'Consome muito sal, embutidos ou alimentos industrializados?',
                          'Sente-se “estufado(a)” após refeições?',
                          'Usa diuréticos, anticoncepcionais ou medicamentos hormonais?',
                          'Sua alimentação tem poucas frutas e vegetais frescos?'
                        ].map((pergunta, index) => (
                          etapaPreviewRetencao === index + 1 && (
                            <div key={index} className="bg-teal-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-teal-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-teal-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência dos sinais.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewRetencao === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Baixa Retenção (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Circulação e equilíbrio hídrico adequados.</p>
                            <p><strong>CAUSA RAIZ:</strong> Hábitos de hidratação e alimentação equilibrados.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter hidratação e atividade física.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Água fracionada; caminhar diariamente.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Não necessária salvo orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Frutas e vegetais frescos diariamente.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter rotina e observar variações sazonais.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Retenção Moderada (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Pequeno acúmulo de líquidos requer atenção.</p>
                            <p><strong>CAUSA RAIZ:</strong> Excesso de sódio, ultraprocessados e baixa ingestão de potássio.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Reduzir sal e alimentos industrializados; aumentar potássio.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Água adequada; incluir banana, abacate e folhas verdes.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação; evitar diuréticos por conta.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Preferir in natura; evitar embutidos.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Reavaliar em 7–14 dias e ajustar plano.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Retenção Elevada (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alta probabilidade de retenção e desequilíbrio mineral.</p>
                            <p><strong>CAUSA RAIZ:</strong> Sódio elevado, hormônios/medicamentos, baixa hidratação.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Procurar orientação profissional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Hidratação guiada; reduzir sódio; acompanhar sintomas.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente com orientação; evitar automedicação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Foco em alimentos frescos e integrais.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação nutricional para plano individual.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewRetencao(Math.max(0, etapaPreviewRetencao - 1))} disabled={etapaPreviewRetencao === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewRetencao(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewRetencao===e?'bg-teal-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewRetencao(Math.min(11, etapaPreviewRetencao + 1))} disabled={etapaPreviewRetencao === 11} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'avaliacao-fome-emocional' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🧠 Preview da Avaliação de Fome Emocional</h3>
                  <div className="relative">
                    {etapaPreviewFomeEmocional === 0 && (
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Como suas emoções influenciam sua alimentação?</h4>
                        <p className="text-gray-700 mb-2">Identifique gatilhos emocionais e melhore sua relação com a comida.</p>
                      </div>
                    )}
                    {etapaPreviewFomeEmocional >= 1 && etapaPreviewFomeEmocional <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você come mesmo sem fome, por ansiedade ou tédio?',
                          'Sente necessidade de doces ou carboidratos quando está estressado(a)?',
                          'Come rápido, sem perceber o sabor?',
                          'Fica irritado(a) quando tenta controlar a comida?',
                          'Usa a comida como “recompensa” ou “conforto”?',
                          'Sente culpa após comer demais?',
                          'Tem episódios de compulsão alimentar?',
                          'Faz dietas muito restritivas e depois “descompensa”?',
                          'Evita eventos sociais por medo de exagerar?',
                          'Come mais quando está triste, cansado(a) ou frustrado(a)?'
                        ].map((pergunta, index) => (
                          etapaPreviewFomeEmocional === index + 1 && (
                            <div key={index} className="bg-pink-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-pink-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-pink-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewFomeEmocional === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Relação Saudável (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Boa percepção de fome e saciedade.</p>
                            <p><strong>CAUSA RAIZ:</strong> Consciência corporal e rotina estável.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter atenção plena às refeições.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições regulares e mastigação consciente.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Não necessária.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos in natura; hidratação.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Continuar atento(a) aos sinais do corpo.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Tendência à Fome Emocional (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alimentação em resposta às emoções.</p>
                            <p><strong>CAUSA RAIZ:</strong> Estresse, tédio ou restrições alimentares.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Mindfulness alimentar e registro de gatilhos.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Planejar lanches de qualidade; pausas de respiração.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se indicado; foco em rotina.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições completas com proteína e fibras.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Construir autoconsciência e revisar gatilhos.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Fome Emocional Acentuada (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Relação emocional intensa com a comida.</p>
                            <p><strong>CAUSA RAIZ:</strong> Estresse crônico/emocional e restrições extremas.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Procurar apoio nutricional e emocional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estruturar refeições e hidratação; remover gatilhos imediatos.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Foco em refeições completas; evitar compensações.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Trabalhar comportamento alimentar com acompanhamento.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewFomeEmocional(Math.max(0, etapaPreviewFomeEmocional - 1))} disabled={etapaPreviewFomeEmocional === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewFomeEmocional(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewFomeEmocional===e?'bg-pink-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewFomeEmocional(Math.min(11, etapaPreviewFomeEmocional + 1))} disabled={etapaPreviewFomeEmocional === 11} className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'diagnostico-tipo-metabolismo' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">⚙️ Preview do Diagnóstico do Tipo de Metabolismo</h3>
                  <div className="relative">
                    {etapaPreviewTipoMetabolico === 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Qual é o seu ritmo metabólico?</h4>
                        <p className="text-gray-700 mb-2">Avalie sintomas e hábitos para classificar seu tipo metabólico.</p>
                      </div>
                    )}
                    {etapaPreviewTipoMetabolico >= 1 && etapaPreviewTipoMetabolico <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Sente muito frio ou calor fora do normal?',
                          'Ganha ou perde peso facilmente?',
                          'Tem variações de energia ao longo do dia?',
                          'Come pouco e não emagrece?',
                          'Sente fome e irritação se demora a comer?',
                          'Pratica atividade física regular?',
                          'Dorme bem e acorda disposto(a)?',
                          'Tem digestão rápida ou lenta?',
                          'Retém líquidos com facilidade?',
                          'Se sente melhor com refeições leves ou reforçadas?'
                        ].map((pergunta, index) => (
                          etapaPreviewTipoMetabolico === index + 1 && (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-slate-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-slate-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewTipoMetabolico === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-rose-900">Resultado: Acelerado (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-rose-600 text-white">Acelerado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alta queima energética com maior demanda calórica.</p>
                            <p><strong>CAUSA RAIZ:</strong> Metabolismo rápido; treinos/estresse sem reposição adequada.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Evitar longos jejuns; distribuir proteínas e gorduras boas.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições fracionadas e calóricas na medida.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar proteínas completas e carboidratos complexos.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Ajustar ingestão para proteger massa magra e estabilidade de energia.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Normal/Equilibrado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Equilibrado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Funcionamento energético ideal.</p>
                            <p><strong>CAUSA RAIZ:</strong> Rotina estável de sono, atividade e alimentação.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter ritmo equilibrado.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Plano regular com proteínas, fibras e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições no timing adequado ao treino.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter rotina estável e revisar metas.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-orange-900">Resultado: Lento (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-600 text-white">Lento</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Baixa taxa metabólica, tendência a acúmulo e fadiga.</p>
                            <p><strong>CAUSA RAIZ:</strong> Baixa massa magra/sono ruim/sedentarismo.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Aumentar proteína e fibras; reduzir sedentarismo.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Treino de força leve; refeições fracionadas.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Só com avaliação; evitar estimulantes por conta.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Evitar restrições extremas e ultraprocessados.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Consulta para estratégia de aceleração metabólica segura.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewTipoMetabolico(Math.max(0, etapaPreviewTipoMetabolico - 1))} disabled={etapaPreviewTipoMetabolico === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewTipoMetabolico(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewTipoMetabolico===e?'bg-slate-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewTipoMetabolico(Math.min(11, etapaPreviewTipoMetabolico + 1))} disabled={etapaPreviewTipoMetabolico === 11} className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'avaliacao-sensibilidades' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">⚠️ Preview da Avaliação de Intolerâncias ou Sensibilidades Alimentares</h3>
                  <div className="relative">
                    {etapaPreviewSensibilidades === 0 && (
                      <div className="bg-gradient-to-r from-red-50 to-amber-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Existe uma sensibilidade alimentar escondida?</h4>
                        <p className="text-gray-700 mb-2">Detecte sinais de reações alimentares não diagnosticadas.</p>
                      </div>
                    )}
                    {etapaPreviewSensibilidades >= 1 && etapaPreviewSensibilidades <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Sente inchaço ou gases após comer?',
                          'Tem dor de cabeça ou enxaqueca após certos alimentos?',
                          'Percebe sonolência ou fadiga após as refeições?',
                          'Sente coceira, urticária ou vermelhidão após comer algo específico?',
                          'Nota variação de humor após laticínios, trigo ou açúcar?',
                          'Tem azia, refluxo ou dor de estômago com frequência?',
                          'Percebe muco, rinite ou congestão após refeições?',
                          'Tem constipação ou diarreia frequente?',
                          'Já notou melhora quando retirou um alimento específico?',
                          'Consome muitos industrializados ou adoçantes artificiais?'
                        ].map((pergunta, index) => (
                          etapaPreviewSensibilidades === index + 1 && (
                            <div key={index} className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewSensibilidades === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Baixo Risco (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Digestão e absorção parecem adequadas.</p>
                            <p><strong>CAUSA RAIZ:</strong> Rotina alimentar variada e estável.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter variedade e hidratação.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Rotina com fibras solúveis e probióticos alimentares.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Preferir in natura; evitar ultraprocessados.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Continuar variando a dieta.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Sensibilidade Leve a Moderada (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Reações ocasionais indicam possível intolerância leve.</p>
                            <p><strong>CAUSA RAIZ:</strong> Exposição intermitente a alimentos gatilho.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Observar padrões e registrar sintomas.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Diário alimentar e teste de exclusão curto.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apoio digestivo somente com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reduzir industrializados e adoçantes artificiais.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Anotar alimentos suspeitos e avaliar resposta.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Alta Probabilidade de Intolerância (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais compatíveis com reação alimentar frequente.</p>
                            <p><strong>CAUSA RAIZ:</strong> Exposição recorrente a alimentos gatilho e disbiose.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Avaliação nutricional e possível teste laboratorial.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo de exclusão orientado; foco em alimentos simples.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Probióticos/enzimas com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Eliminar ultraprocessados e investigar laticínios/trigo.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Identificar alimentos‑gatilho com acompanhamento profissional.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewSensibilidades(Math.max(0, etapaPreviewSensibilidades - 1))} disabled={etapaPreviewSensibilidades === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewSensibilidades(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewSensibilidades===e?'bg-amber-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewSensibilidades(Math.min(11, etapaPreviewSensibilidades + 1))} disabled={etapaPreviewSensibilidades === 11} className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'avaliacao-sindrome-metabolica' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🚨 Preview da Avaliação do Risco de Síndrome Metabólica</h3>
                  <div className="relative">
                    {etapaPreviewSindMetabolica === 0 && (
                      <div className="bg-gradient-to-r from-slate-50 to-red-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Quais são seus fatores de risco?</h4>
                        <p className="text-gray-700 mb-2">Detecte sinais ligados à resistência à insulina, obesidade central e inflamação.</p>
                      </div>
                    )}
                    {etapaPreviewSindMetabolica >= 1 && etapaPreviewSindMetabolica <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Possui gordura localizada no abdômen?',
                          'Tem pressão alta ou oscilante?',
                          'Apresenta glicemia elevada ou histórico familiar de diabetes?',
                          'Faz pouco ou nenhum exercício físico?',
                          'Costuma comer doces ou carboidratos refinados diariamente?',
                          'Tem triglicerídeos ou colesterol alterados?',
                          'Sente sono e fome logo após comer carboidratos?',
                          'Dorme pouco ou mal?',
                          'Está acima do peso ideal (IMC > 25)?',
                          'Sente fadiga após refeições ou à tarde?'
                        ].map((pergunta, index) => (
                          etapaPreviewSindMetabolica === index + 1 && (
                            <div key={index} className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-red-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewSindMetabolica === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Baixo Risco (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Estilo de vida e metabolismo equilibrados.</p>
                            <p><strong>CAUSA RAIZ:</strong> Bons hábitos de sono, atividade e alimentação.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter rotina saudável.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições equilibradas; atividade física regular.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Evitar ultraprocessados e açúcar excessivo.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter hábitos e monitorar indicadores periodicamente.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Risco Moderado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais de resistência à insulina e inflamação inicial.</p>
                            <p><strong>CAUSA RAIZ:</strong> Excesso de carboidratos refinados e sedentarismo.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Ajustar alimentação e iniciar exercícios regulares.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Reduzir açúcar/farinha; treinos moderados.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Foco em integrais, proteínas e fibras.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação metabólica para plano personalizado.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Risco Elevado (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alta probabilidade de síndrome metabólica.</p>
                            <p><strong>CAUSA RAIZ:</strong> Resistência à insulina, gordura abdominal e inflamação.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Procurar avaliação completa urgentemente.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Dieta anti-inflamatória inicial; caminhada diária; sono regular.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação; evitar uso por conta própria.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reduzir ultraprocessados, açúcar e álcool.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Consulta metabólica/nutricional para reduzir riscos cardiovasculares.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewSindMetabolica(Math.max(0, etapaPreviewSindMetabolica - 1))} disabled={etapaPreviewSindMetabolica === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewSindMetabolica(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewSindMetabolica===e?'bg-red-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewSindMetabolica(Math.min(11, etapaPreviewSindMetabolica + 1))} disabled={etapaPreviewSindMetabolica === 11} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'descoberta-perfil-bem-estar' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🧭 Preview – Descubra seu Perfil de Bem-Estar</h3>
                  <div className="relative">
                    {etapaPreviewPerfilBemEstar === 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-emerald-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Qual é seu perfil predominante?</h4>
                        <p className="text-gray-700 mb-2">Estético, Equilibrado ou Saúde/Performance — descubra em 1 minuto.</p>
                      </div>
                    )}
                    {etapaPreviewPerfilBemEstar >= 1 && etapaPreviewPerfilBemEstar <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você costuma priorizar o que come, mesmo com o dia corrido?',
                          'Dorme bem e acorda com disposição?',
                          'Pratica algum tipo de atividade física regularmente?',
                          'Cuida mais da aparência física do que da saúde interna?',
                          'Faz exames ou consultas de rotina com frequência?',
                          'Se sente cansado(a) ou sem energia no dia a dia?',
                          'Costuma lidar bem com o estresse?',
                          'Alimenta-se com frutas, verduras e água todos os dias?',
                          'Se preocupa mais com estética ou bem-estar?',
                          'Consegue manter disciplina mesmo nos fins de semana?'
                        ].map((pergunta, index) => (
                          etapaPreviewPerfilBemEstar === index + 1 && (
                            <div key={index} className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-purple-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewPerfilBemEstar === 11 && (
                      <div className="space-y-4">
                        {/* Perfil Estético */}
                        <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-pink-900">Resultado: Perfil Estético (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-pink-600 text-white">Estético</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Motivação voltada para resultados visuais e autoestima.</p>
                            <p><strong>CAUSA RAIZ:</strong> Preferência por mudanças rápidas e foco em aparência.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Unir beleza e saúde com estratégias sustentáveis.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Alimentação equilibrada, hidratação e treino moderado.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições completas com proteínas, fibras e vegetais.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer avaliação personalizada e alinhar beleza + saúde.</p>
                          </div>
                        </div>
                        {/* Perfil Equilibrado */}
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-emerald-900">Resultado: Perfil Equilibrado (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-600 text-white">Equilibrado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Valoriza corpo, mente e rotina de forma balanceada.</p>
                            <p><strong>CAUSA RAIZ:</strong> Bons hábitos mas com oportunidades de otimização.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Ajustes simples de metabolismo e energia.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Pequenas mudanças em hidratação, fibras e treino.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente se indicado.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Manter variedade e timing adequado.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer avaliação completa de bem‑estar.</p>
                          </div>
                        </div>
                        {/* Perfil Saúde/Performance */}
                        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-indigo-900">Resultado: Perfil Saúde/Performance (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-600 text-white">Saúde</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Foco em energia, saúde e longevidade.</p>
                            <p><strong>CAUSA RAIZ:</strong> Disciplina e rotina de longo prazo.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Refinar metabolismo e performance com ajustes finos.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estratégias de timing de carboidratos e treino.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Qualidade e densidade nutricional elevadas.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação metabólica para potencializar resultados.</p>
                          </div>
                        </div>
                        {/* CTA final demonstrativo */}
                        <div className="bg-gradient-to-r from-purple-50 to-emerald-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-800 mb-2">💬 Quer entender como seu perfil impacta seus resultados?</p>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold">Fazer Avaliação de Bem‑Estar Personalizada</button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewPerfilBemEstar(Math.max(0, etapaPreviewPerfilBemEstar - 1))} disabled={etapaPreviewPerfilBemEstar === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewPerfilBemEstar(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewPerfilBemEstar===e?'bg-purple-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewPerfilBemEstar(Math.min(11, etapaPreviewPerfilBemEstar + 1))} disabled={etapaPreviewPerfilBemEstar === 11} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'quiz-tipo-fome' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🍽️ Preview – Qual é o seu Tipo de Fome?</h3>
                  <div className="relative">
                    {etapaPreviewTipoFome === 0 && (
                      <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Fome Física, por Hábito ou Emocional?</h4>
                        <p className="text-gray-700">Identifique seu padrão e receba orientação personalizada.</p>
                      </div>
                    )}
                    {etapaPreviewTipoFome >= 1 && etapaPreviewTipoFome <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente vontade de comer mesmo sem estar com fome?',
                          'Busca doces ou alimentos específicos quando está triste ou estressado(a)?',
                          'Come rápido, quase sem perceber o sabor dos alimentos?',
                          'Come por tédio, ansiedade ou hábito de “beliscar”?',
                          'Sente culpa após comer demais?',
                          'Fica irritado(a) quando tenta controlar a comida?',
                          'Come mais quando está assistindo TV ou no celular?',
                          'Faz dietas muito restritivas e depois “descompensa”?',
                          'Consegue identificar facilmente quando está satisfeito(a)?',
                          'Usa comida como forma de recompensa?'
                        ].map((p, i) => (
                          etapaPreviewTipoFome === i + 1 && (
                            <div key={i} className="bg-orange-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-orange-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewTipoFome === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Fome Física (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Física</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Seu corpo pede energia real e você reconhece saciedade.</p>
                            <p><strong>CAUSA RAIZ:</strong> Sinais de fome/saciedade bem percebidos.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter refeições nutritivas e atenção plena.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições completas e mastigação consciente.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar in natura e equilíbrio de macros.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer avaliação personalizada de nutrição e bem‑estar.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Fome por Hábito (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Hábito</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Rotina e distração guiam a alimentação.</p>
                            <p><strong>CAUSA RAIZ:</strong> Comer automático, telas e horários irregulares.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Consciência alimentar e rotina de refeições.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Planejar lanches e reduzir distrações ao comer.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Não necessária.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições completas com proteína e fibras.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Receber análise do padrão alimentar.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Fome Emocional (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Emocional</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Emoções influenciam fortemente sua alimentação.</p>
                            <p><strong>CAUSA RAIZ:</strong> Estresse, ansiedade e recompensas com comida.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Iniciar avaliação comportamental nutricional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Registro de gatilhos e refeições estruturadas.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições completas e estratégias de mindfulness.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer Avaliação Comportamental Nutricional.</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-800 mb-2">💬 Quer entender de onde vem sua fome?</p>
                          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold">Fazer Avaliação Personalizada</button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewTipoFome(Math.max(0, etapaPreviewTipoFome - 1))} disabled={etapaPreviewTipoFome === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewTipoFome(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewTipoFome===e?'bg-orange-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewTipoFome(Math.min(11, etapaPreviewTipoFome + 1))} disabled={etapaPreviewTipoFome === 11} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'quiz-pedindo-detox' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">💧 Preview – Seu corpo está pedindo Detox?</h3>
                  <div className="relative">
                    {etapaPreviewDetox === 0 && (
                      <div className="bg-gradient-to-r from-teal-50 to-lime-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Avalie sinais de sobrecarga e acúmulo de toxinas</h4>
                        <p className="text-gray-700">Descubra se é hora de um detox leve e guiado.</p>
                      </div>
                    )}
                    {etapaPreviewDetox >= 1 && etapaPreviewDetox <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Sente-se cansado(a) mesmo dormindo bem?',
                          'Tem inchaço, gases ou sensação de empachamento após comer?',
                          'Sente a pele sem brilho, com acne ou olheiras?',
                          'Sofre com dores de cabeça ou dificuldade de concentração?',
                          'Tem vontade constante de doces ou cafeína?',
                          'Nota mau hálito ou odor corporal alterado?',
                          'Tem prisão de ventre ou intestino irregular?',
                          'Costuma consumir álcool, frituras ou alimentos processados?',
                          'Sente peso, lentidão ou falta de energia após as refeições?',
                          'Acorda com a sensação de corpo “carregado”?'
                        ].map((p, i) => (
                          etapaPreviewDetox === i + 1 && (
                            <div key={i} className="bg-teal-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-teal-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewDetox === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Corpo Equilibrado (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Equilíbrio</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sem sinais significativos de sobrecarga.</p>
                            <p><strong>CAUSA RAIZ:</strong> Sono, hidratação e alimentação natural consistentes.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter rotina e prevenção.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Hidratação e fibras; evitar ultraprocessados.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Preferir in natura; reduzir açúcar/álcool.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Receber plano de manutenção detox.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Sinais Leves de Toxinas (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Leve</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Primeiro sinais de acúmulo: cansaço e lentidão digestiva.</p>
                            <p><strong>CAUSA RAIZ:</strong> Excesso de processados, açúcar e rotina.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Detox leve e guiado, sem restrições extremas.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Aumentar água, vegetais e reduzir processados.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente com orientação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Cardápio simples com alimentos de verdade.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer mini avaliação detox personalizada.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Corpo Pedindo Detox (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Sinais claros de sobrecarga e acúmulo tóxico.</p>
                            <p><strong>CAUSA RAIZ:</strong> Estresse, alimentação processada e hábitos.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Iniciar avaliação detox com especialista.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo inicial anti-inflamatório leve e suporte intestinal.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Conforme orientação profissional.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Foco em simples, cozidos e hidratação.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Iniciar avaliação detox personalizada.</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-teal-50 to-lime-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-800 mb-2">💬 Quer descobrir o melhor detox para o seu corpo?</p>
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold">Fazer Avaliação Detox Personalizada</button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewDetox(Math.max(0, etapaPreviewDetox - 1))} disabled={etapaPreviewDetox === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewDetox(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewDetox===e?'bg-teal-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewDetox(Math.min(11, etapaPreviewDetox + 1))} disabled={etapaPreviewDetox === 11} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'avaliacao-rotina-alimentar' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">⏰ Preview – Você está se alimentando conforme sua rotina?</h3>
                  <div className="relative">
                    {etapaPreviewRotinaAlimentar === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Sua rotina alimentar acompanha seu dia?</h4>
                        <p className="text-gray-700">Descubra se horários, escolhas e energia estão em equilíbrio.</p>
                      </div>
                    )}
                    {etapaPreviewRotinaAlimentar >= 1 && etapaPreviewRotinaAlimentar <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Costuma pular refeições por falta de tempo?',
                          'Fica longos períodos sem comer e sente fraqueza?',
                          'Faz refeições rápidas ou na correria com frequência?',
                          'Belisca entre as refeições por ansiedade ou hábito?',
                          'Tem horários fixos para comer durante o dia?',
                          'Come mais à noite do que durante o dia?',
                          'Sente sonolência ou cansaço após comer?',
                          'Faz escolhas alimentares baseadas em praticidade (fast food, delivery)?',
                          'Leva lanches saudáveis quando sai de casa?',
                          'Sente fome intensa à noite ou de madrugada?'
                        ].map((p, i) => (
                          etapaPreviewRotinaAlimentar === i + 1 && (
                            <div key={i} className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              {(i===4 || i===8) && (
                                <p className="text-xs text-blue-700 mt-2">Pergunta inversa: aqui, respostas mais altas indicam melhor alinhamento.</p>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewRotinaAlimentar === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Alimentação Alinhada (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Alinhada</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Bom equilíbrio entre horários e energia.</p>
                            <p><strong>CAUSA RAIZ:</strong> Planejamento e constância nas refeições.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter variedade e timing adequado.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Refeições regulares e lanches planejados.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Preferir in natura; montar marmitas simples.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer avaliação nutricional para refinar o plano.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Desajuste Leve (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Desajuste</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Padrão com pequenos desequilíbrios de horário e qualidade.</p>
                            <p><strong>CAUSA RAIZ:</strong> Pular refeições, correria e escolhas por praticidade.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Organizar horários e preparar lanches saudáveis.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Kit lanche; agenda de refeições; hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Não necessária.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reforçar proteínas e fibras em cada refeição.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Fazer ajuste de rotina alimentar com especialista.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Rotina Caótica (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Caótica</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Padrão desregulado com impacto metabólico.</p>
                            <p><strong>CAUSA RAIZ:</strong> Falta de horários e escolhas rápidas frequentes.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Iniciar reeducação alimentar com orientação.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estruturar refeições simples e previsíveis.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Cardápio básico com alimentos de verdade.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Receber reeducação alimentar personalizada.</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-800 mb-2">💬 Quer descobrir se sua rotina alimentar está ajudando ou sabotando seus resultados?</p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Fazer Avaliação de Rotina Alimentar</button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewRotinaAlimentar(Math.max(0, etapaPreviewRotinaAlimentar - 1))} disabled={etapaPreviewRotinaAlimentar === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewRotinaAlimentar(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewRotinaAlimentar===e?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewRotinaAlimentar(Math.min(11, etapaPreviewRotinaAlimentar + 1))} disabled={etapaPreviewRotinaAlimentar === 11} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'pronto-emagrecer' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🏁 Preview – Você está pronto para emagrecer com saúde?</h3>
                  <div className="relative">
                    {etapaPreviewProntidaoEmagrecer === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Avalie sua prontidão física e emocional</h4>
                        <p className="text-gray-700">Veja se corpo e mente estão preparados para mudar.</p>
                      </div>
                    )}
                    {etapaPreviewProntidaoEmagrecer >= 1 && etapaPreviewProntidaoEmagrecer <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente que tem controle sobre o que come?',
                          'Come mais quando está ansioso(a), triste ou estressado(a)?',
                          'Consegue manter uma rotina alimentar por mais de 30 dias?',
                          'Dorme bem e acorda com energia?',
                          'Faz atividade física com regularidade?',
                          'Tem horários fixos para comer?',
                          'Se sente frustrado(a) quando não vê resultados rápidos?',
                          'Costuma beber pouca água?',
                          'Faz escolhas alimentares saudáveis na maioria das vezes?',
                          'Acredita que pode mudar seus hábitos de forma definitiva?'
                        ].map((p, i) => (
                          etapaPreviewProntidaoEmagrecer === i + 1 && (
                            <div key={i} className="bg-emerald-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-emerald-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewProntidaoEmagrecer === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Pronto para Começar (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Pronto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alta disciplina e consciência corporal.</p>
                            <p><strong>CAUSA RAIZ:</strong> Hábitos consistentes e boa organização.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Iniciar plano de emagrecimento saudável.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Calendário simples de refeições e treinos.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Somente com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Refeições equilibradas e hidratação.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação de início de programa de emagrecimento.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Quase Pronto (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Intermediário</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Boa intenção, falta consistência e ajustes.</p>
                            <p><strong>CAUSA RAIZ:</strong> Rotina e constância irregulares.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Preparação e organização com acompanhamento.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Ajustes simples de horários e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Reforçar proteínas e fibras.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Receber plano de preparação personalizado.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Precisa de Orientação (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Orientação</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Desorganização alimentar/emocional limitando resultados.</p>
                            <p><strong>CAUSA RAIZ:</strong> Falta de estrutura e gatilhos emocionais.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Reeducação alimentar com suporte profissional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estrutura mínima de refeições e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Base simples e previsível com alimentos de verdade.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação de reeducação alimentar.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewProntidaoEmagrecer(Math.max(0, etapaPreviewProntidaoEmagrecer - 1))} disabled={etapaPreviewProntidaoEmagrecer === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewProntidaoEmagrecer(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewProntidaoEmagrecer===e?'bg-emerald-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewProntidaoEmagrecer(Math.min(11, etapaPreviewProntidaoEmagrecer + 1))} disabled={etapaPreviewProntidaoEmagrecer === 11} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'autoconhecimento-corporal' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🧠 Preview – Você conhece o seu corpo?</h3>
                  <div className="relative">
                    {etapaPreviewAutoconhecimento === 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Avalie seu nível de autoconhecimento corporal</h4>
                        <p className="text-gray-700">Entenda como seu corpo responde a alimentação, sono, estresse e exercício.</p>
                      </div>
                    )}
                    {etapaPreviewAutoconhecimento >= 1 && etapaPreviewAutoconhecimento <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você percebe quando está com fome real ou emocional?',
                          'Reconhece quando seu corpo está cansado e precisa descansar?',
                          'Nota sinais de inchaço, desconforto ou má digestão após comer?',
                          'Observa como certos alimentos afetam seu humor ou energia?',
                          'Sente-se conectado(a) com o seu corpo durante o dia?',
                          'Faz check-ups ou avaliações corporais regulares?',
                          'Ajusta a alimentação conforme o que seu corpo pede?',
                          'Consegue identificar alimentos que te fazem bem ou mal?',
                          'Tem consciência da sua postura e respiração no dia a dia?',
                          'Sabe como seu corpo reage a estresse, sono e exercício?'
                        ].map((p, i) => (
                          etapaPreviewAutoconhecimento === i + 1 && (
                            <div key={i} className="bg-indigo-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-indigo-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewAutoconhecimento === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Alto Autoconhecimento (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Alto</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Excelente percepção corporal e emocional.</p>
                            <p><strong>CAUSA RAIZ:</strong> Atenção aos sinais e rotina consistente.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Aprofundar consciência com acompanhamento.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Rotina de sono, alimentação e respiração.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Qualidade nutricional e variedade.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação de equilíbrio corporal e nutricional.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Consciência Parcial (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Parcial</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Entende parte dos sinais, precisa de orientação.</p>
                            <p><strong>CAUSA RAIZ:</strong> Confusão entre fome/ansiedade e cansaço.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Olhar nutricional guiado para clareza.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Diário corporal: fome, energia, humor, sono.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Ajuste progressivo conforme sinais.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Análise de consciência corporal.</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Desconexão Corporal (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Baixo</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Pouca percepção dos sinais físicos e emocionais.</p>
                            <p><strong>CAUSA RAIZ:</strong> Rotina estressante e atenção externa.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Reconexão com suporte profissional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Práticas simples de respiração, sono e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Estruturar refeições básicas com alimentos de verdade.</p>
                            <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Avaliação de autoconhecimento físico e emocional.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewAutoconhecimento(Math.max(0, etapaPreviewAutoconhecimento - 1))} disabled={etapaPreviewAutoconhecimento === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewAutoconhecimento(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewAutoconhecimento===e?'bg-indigo-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewAutoconhecimento(Math.min(11, etapaPreviewAutoconhecimento + 1))} disabled={etapaPreviewAutoconhecimento === 11} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'disciplinado-emocional' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">❤️‍🔥 Preview – Você é mais disciplinado ou emocional com a comida?</h3>
                  <div className="relative">
                    {etapaPreviewDisciplinadoEmocional === 0 && (
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Avalie seu comportamento alimentar</h4>
                        <p className="text-gray-700">Descubra se sua relação com a comida é guiada por razão ou emoção.</p>
                      </div>
                    )}
                    {etapaPreviewDisciplinadoEmocional >= 1 && etapaPreviewDisciplinadoEmocional <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você come por ansiedade, tristeza ou tédio?',
                          'Consegue seguir um plano alimentar por mais de 30 dias?',
                          'Sente culpa depois de comer algo fora da dieta?',
                          'Já desistiu de um plano alimentar por impulso?',
                          'Come rápido, quase sem perceber o sabor dos alimentos?',
                          'Planeja suas refeições com antecedência?',
                          'Usa comida como forma de recompensa ou alívio?',
                          'Fica frustrado(a) quando não vê resultados rápidos?',
                          'Consegue dizer "não" a tentações facilmente?',
                          'Costuma comer mais quando está sob pressão emocional?'
                        ].map((p, i) => (
                          etapaPreviewDisciplinadoEmocional === i + 1 && (
                            <div key={i} className="bg-rose-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-rose-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-rose-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewDisciplinadoEmocional === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Perfil Disciplinado (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Disciplinado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alto controle e foco alimentar.</p>
                            <p><strong>CAUSA RAIZ:</strong> Disciplina estabelecida com boa consciência alimentar.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter equilíbrio sem rigidez excessiva.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Rotina estável com espaço para flexibilidade e prazer.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Manter variedade e qualidade nutricional.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Equilibrar prazer e consciência com avaliação comportamental nutricional.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Perfil Intermediário (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Intermediário</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Equilibra razão e emoção, mas pode oscilar.</p>
                            <p><strong>CAUSA RAIZ:</strong> Oscilações entre disciplina e emoção conforme o estresse.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Trabalhar rotina alimentar com acompanhamento.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estruturação de horários e estratégias de manejo emocional.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Planejamento com flexibilidade consciente.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Receber plano de equilíbrio alimentar personalizado.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Perfil Emocional (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Emocional</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alimentação fortemente guiada pelas emoções.</p>
                            <p><strong>CAUSA RAIZ:</strong> Emoções, ansiedade e estresse influenciando escolhas alimentares.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Buscar apoio nutricional e emocional.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Estratégias de manejo emocional e reeducação alimentar leve.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas com avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Construir relação saudável com comida, sem restrições extremas.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Iniciar avaliação emocional alimentar com nutricionista.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewDisciplinadoEmocional(Math.max(0, etapaPreviewDisciplinadoEmocional - 1))} disabled={etapaPreviewDisciplinadoEmocional === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewDisciplinadoEmocional(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewDisciplinadoEmocional===e?'bg-pink-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewDisciplinadoEmocional(Math.min(11, etapaPreviewDisciplinadoEmocional + 1))} disabled={etapaPreviewDisciplinadoEmocional === 11} className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'nutrido-alimentado' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🍎 Preview – Você está nutrido ou apenas alimentado?</h3>
                  <div className="relative">
                    {etapaPreviewNutridoAlimentado === 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Avalie sua nutrição celular</h4>
                        <p className="text-gray-700">Descubra se você está realmente nutrido ou apenas comendo calorias vazias.</p>
                      </div>
                    )}
                    {etapaPreviewNutridoAlimentado >= 1 && etapaPreviewNutridoAlimentado <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você costuma comer alimentos industrializados ou ultraprocessados?',
                          'Consome frutas, verduras e legumes diariamente?',
                          'Tem cansaço, unhas fracas ou queda de cabelo frequente?',
                          'Fica muito tempo sem se alimentar?',
                          'Bebe pouca água por dia?',
                          'Come rápido, sem mastigar direito?',
                          'Sente vontade de doces ou carboidratos com frequência?',
                          'Usa suplementos sem orientação profissional?',
                          'Dorme mal ou acorda sem disposição?',
                          'Tem digestão lenta ou sente empachamento?'
                        ].map((p, i) => (
                          etapaPreviewNutridoAlimentado === i + 1 && (
                            <div key={i} className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewNutridoAlimentado === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Bem Nutrido(a) (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Bem Nutrido</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alimentação rica em nutrientes e equilíbrio geral.</p>
                            <p><strong>CAUSA RAIZ:</strong> Boa variedade alimentar e qualidade nutricional.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Continuar investindo em variedade alimentar.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Manter qualidade nutricional e introduzir superalimentos.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos in natura e densidade nutricional.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Aprofundar avaliação nutricional completa para otimização.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Alimentado(a), mas com Carências (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Com Carências</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Possíveis deficiências leves e desequilíbrios nutricionais.</p>
                            <p><strong>CAUSA RAIZ:</strong> Quantidade suficiente, mas qualidade nutricional insuficiente.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Ajustes simples para elevar energia e vitalidade.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Aumentar densidade nutricional e reduzir processados.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Avaliar necessidade após análise de micronutrientes.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos ricos em vitaminas e minerais.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Receber análise de micronutrientes gratuita.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Subnutrido(a) Celularmente (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Subnutrido</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Déficit importante de nutrientes e energia celular.</p>
                            <p><strong>CAUSA RAIZ:</strong> Alimentação deficiente em micronutrientes e excesso de processados.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Plano de reposição nutricional guiado.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo de reequilíbrio nutricional com alimentos densos.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Necessária após avaliação completa de deficiências.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos in natura ricos em micronutrientes.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Iniciar avaliação de reposição nutricional com nutricionista.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewNutridoAlimentado(Math.max(0, etapaPreviewNutridoAlimentado - 1))} disabled={etapaPreviewNutridoAlimentado === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewNutridoAlimentado(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewNutridoAlimentado===e?'bg-orange-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewNutridoAlimentado(Math.min(11, etapaPreviewNutridoAlimentado + 1))} disabled={etapaPreviewNutridoAlimentado === 11} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id === 'perfil-intestino' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">💩 Preview – Qual é seu perfil de intestino?</h3>
                  <div className="relative">
                    {etapaPreviewPerfilIntestino === 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Identifique seu funcionamento intestinal</h4>
                        <p className="text-gray-700">Avalie sinais de equilíbrio, constipação, sensibilidade ou disbiose.</p>
                      </div>
                    )}
                    {etapaPreviewPerfilIntestino >= 1 && etapaPreviewPerfilIntestino <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você vai ao banheiro menos de uma vez por dia?',
                          'Suas fezes são muito ressecadas ou muito moles?',
                          'Tem gases, inchaço ou dor abdominal?',
                          'Sente que não evacua completamente?',
                          'Nota odor forte nas fezes ou gases?',
                          'Percebe muco ou resíduos alimentares nas fezes?',
                          'Usa laxantes ou medicamentos para o intestino?',
                          'Sente sono ou cansaço após comer?',
                          'Tem queda de imunidade (afta, gripe, resfriado frequente)?',
                          'Se sente irritado(a) ou ansioso(a) com frequência?'
                        ].map((p, i) => (
                          etapaPreviewPerfilIntestino === i + 1 && (
                            <div key={i} className="bg-indigo-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-indigo-900 mb-3">{i + 1}. {p}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca','Raramente','Às vezes','Frequentemente','Sempre'].map((op, j)=>(
                                  <label key={j} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {etapaPreviewPerfilIntestino === 11 && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-green-900">Resultado: Equilibrado (10–20)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Equilibrado</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Boa digestão e funcionamento regular.</p>
                            <p><strong>CAUSA RAIZ:</strong> Microbiota equilibrada e rotina alimentar estável.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Manter rotina atual.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Continuar consumo de fibras, probióticos e hidratação adequada.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se necessário.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Manter variedade e alimentos prebióticos.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Fazer avaliação digestiva preventiva.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-yellow-900">Resultado: Intestino Preso ou Sensível (21–35)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Preso/Sensível</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Alterações leves no ritmo intestinal.</p>
                            <p><strong>CAUSA RAIZ:</strong> Possível desequilíbrio de microbiota e rotina alimentar.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Ajustes de fibras, hidratação e rotina alimentar.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Aumentar fibras solúveis, probióticos e hidratação.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Probióticos leves podem ser considerados após avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos prebióticos e evitar ultraprocessados.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Receber análise de saúde intestinal gratuita.</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-red-900">Resultado: Disbiose Intestinal (36–50)</h5>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Disbiose</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                            <p><strong>DIAGNÓSTICO:</strong> Disfunção intestinal significativa; possível disbiose ou inflamação.</p>
                            <p><strong>CAUSA RAIZ:</strong> Desequilíbrio grave de microbiota e possível inflamação intestinal.</p>
                            <p><strong>AÇÃO IMEDIATA:</strong> Avaliação de restauração intestinal com nutricionista.</p>
                            <p><strong>PLANO 7 DIAS:</strong> Protocolo de reparo digestivo e alimentos anti-inflamatórios.</p>
                            <p><strong>SUPLEMENTAÇÃO:</strong> Probióticos específicos e suporte digestivo após avaliação.</p>
                            <p><strong>ALIMENTAÇÃO:</strong> Eliminar alimentos inflamatórios e focar em reparo intestinal.</p>
                            <div className="bg-purple-50 p-3 rounded-lg mt-2">
                              <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                              <p className="text-gray-700">Fazer avaliação de restauração intestinal completa com nutricionista.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => setEtapaPreviewPerfilIntestino(Math.max(0, etapaPreviewPerfilIntestino - 1))} disabled={etapaPreviewPerfilIntestino === 0} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Anterior</button>
                      <div className="flex space-x-2">{[0,1,2,3,4,5,6,7,8,9,10,11].map((e)=>{const l=['Início','1','2','3','4','5','6','7','8','9','10','Resultados'];return <button key={e} onClick={()=>setEtapaPreviewPerfilIntestino(e)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${etapaPreviewPerfilIntestino===e?'bg-purple-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={e===0?'Tela Inicial':e===11?'Resultados':`Pergunta ${e}`}>{l[e]}</button>})}</div>
                      <button onClick={() => setEtapaPreviewPerfilIntestino(Math.min(11, etapaPreviewPerfilIntestino + 1))} disabled={etapaPreviewPerfilIntestino === 11} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Próxima →</button>
                    </div>
                  </div>
                </div>
              )}

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
              {/* Guia Nutracêutico */}
              {templatePreviewSelecionado.id === 'guia-nutraceutico' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    💊 Preview do Guia Nutracêutico - "Qual é seu interesse em nutracêuticos?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewGuiaNutraceutico === 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">💊 Avalie Seu Interesse em Nutracêuticos</h4>
                        <p className="text-gray-700 mb-3">Descubra seu nível de interesse em nutracêuticos e receba orientações personalizadas para evoluir seu conhecimento sobre alimentos funcionais e suplementação baseadas em sua área de interesse.</p>
                        <p className="text-purple-600 font-semibold">💪 Uma avaliação que pode transformar seu interesse em nutracêuticos.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewGuiaNutraceutico >= 1 && etapaPreviewGuiaNutraceutico <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewGuiaNutraceutico === 1 && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">💊 1. Qual é seu interesse em suplementos nutracêuticos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="suplementos-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho muito interesse em suplementos nutracêuticos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="suplementos-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho interesse moderado em suplementos nutracêuticos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                <input type="radio" name="suplementos-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho pouco interesse em suplementos nutracêuticos</span>
                              </label>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Consciência suplementar</p>
                          </div>
                        )}

                        {etapaPreviewGuiaNutraceutico === 2 && (
                          <div className="bg-pink-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-pink-900 mb-3">🥗 2. Qual é seu interesse em alimentos funcionais?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="alimentos-funcionais" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho muito interesse em alimentos funcionais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="alimentos-funcionais" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho interesse moderado em alimentos funcionais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-pink-300">
                                <input type="radio" name="alimentos-funcionais" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho pouco interesse em alimentos funcionais</span>
                              </label>
                            </div>
                            <p className="text-xs text-pink-600 mt-2">🧠 Gatilho: Consciência funcional</p>
                          </div>
                        )}

                        {etapaPreviewGuiaNutraceutico === 3 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🌿 3. Qual é seu interesse em nutracêuticos naturais?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="naturais-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho muito interesse em nutracêuticos naturais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="naturais-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho interesse moderado em nutracêuticos naturais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="naturais-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho pouco interesse em nutracêuticos naturais</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Consciência natural</p>
                          </div>
                        )}

                        {etapaPreviewGuiaNutraceutico === 4 && (
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-900 mb-3">🧘‍♀️ 4. Qual é seu interesse em nutracêuticos para bem-estar?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho muito interesse em nutracêuticos para bem-estar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho interesse moderado em nutracêuticos para bem-estar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="bem-estar-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Tenho pouco interesse em nutracêuticos para bem-estar</span>
                              </label>
                            </div>
                            <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência de bem-estar</p>
                          </div>
                        )}

                        {etapaPreviewGuiaNutraceutico === 5 && (
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-teal-900 mb-3">📚 5. Com que frequência você busca informações sobre nutracêuticos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Diariamente busco informações sobre nutracêuticos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Semanalmente busco informações sobre nutracêuticos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="frequencia-nutraceutico" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente busco informações sobre nutracêuticos</span>
                              </label>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência de aprendizado</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewGuiaNutraceutico === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Guia Nutracêutico</h4>
                        
                        {/* Resultado 1: Baixo Interesse */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Baixo Interesse</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-40 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.diagnostico}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.causaRaiz}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.acaoImediata}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.plano7Dias}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.suplementacao}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.alimentacao}</p>
                            {guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaNutraceuticoDiagnosticos.nutri.baixoInteresse.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Interesse Moderado */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⚠️ Interesse Moderado</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">41-70 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.diagnostico}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.causaRaiz}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.acaoImediata}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.plano7Dias}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.suplementacao}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.alimentacao}</p>
                            {guiaNutraceuticoDiagnosticos.nutri.interesseModerado.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaNutraceuticoDiagnosticos.nutri.interesseModerado.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Alto Interesse */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🚀 Alto Interesse</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">71-100 pontos</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.diagnostico}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.causaRaiz}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.acaoImediata}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.plano7Dias}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.suplementacao}</p>
                            <p className="text-gray-700">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.alimentacao}</p>
                            {guiaNutraceuticoDiagnosticos.nutri.altoInteresse.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaNutraceuticoDiagnosticos.nutri.altoInteresse.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewGuiaNutraceutico(Math.max(0, etapaPreviewGuiaNutraceutico - 1))}
                        disabled={etapaPreviewGuiaNutraceutico === 0}
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
                              onClick={() => setEtapaPreviewGuiaNutraceutico(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewGuiaNutraceutico === etapa
                                  ? 'bg-purple-600 text-white'
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
                        onClick={() => setEtapaPreviewGuiaNutraceutico(Math.min(6, etapaPreviewGuiaNutraceutico + 1))}
                        disabled={etapaPreviewGuiaNutraceutico === 6}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Guia Proteico */}
              {templatePreviewSelecionado.id === 'guia-proteico' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🥩 Preview do Guia Proteico - "Qual é seu consumo de proteínas?"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewGuiaProteico === 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🥩 Avalie Seu Consumo de Proteínas</h4>
                        <p className="text-gray-700 mb-3">Descubra seu nível de consumo de proteínas e receba orientações personalizadas para otimizar sua ingestão proteica baseadas em sua área de interesse.</p>
                        <p className="text-orange-600 font-semibold">💪 Uma avaliação que pode transformar seu consumo de proteínas.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewGuiaProteico >= 1 && etapaPreviewGuiaProteico <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewGuiaProteico === 1 && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-3">🥩 1. Qual é seu consumo diário de proteínas?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="consumo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Consumo mais de 1.2g de proteína por kg de peso</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="consumo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Consumo entre 0.8-1.2g de proteína por kg de peso</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                <input type="radio" name="consumo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Consumo menos de 0.8g de proteína por kg de peso</span>
                              </label>
                            </div>
                            <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Consciência proteica</p>
                          </div>
                        )}

                        {etapaPreviewGuiaProteico === 2 && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-3">🍖 2. Quais são suas principais fontes de proteína?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="fontes-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Carnes, ovos, peixes e laticínios</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="fontes-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Mix de fontes animais e vegetais</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                <input type="radio" name="fontes-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Principalmente fontes vegetais</span>
                              </label>
                            </div>
                            <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Consciência de fontes</p>
                          </div>
                        )}

                        {etapaPreviewGuiaProteico === 3 && (
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-amber-900 mb-3">💪 3. Qual é seu objetivo com o consumo de proteínas?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Ganho de massa muscular e performance</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Manutenção da saúde e bem-estar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
                                <input type="radio" name="objetivo-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Perda de peso e definição</span>
                              </label>
                            </div>
                            <p className="text-xs text-amber-600 mt-2">🧠 Gatilho: Consciência de objetivos</p>
                          </div>
                        )}

                        {etapaPreviewGuiaProteico === 4 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-900 mb-3">⏰ 4. Como você distribui as proteínas ao longo do dia?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="distribuicao-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Distribuo uniformemente em todas as refeições</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="distribuicao-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Concentro principalmente no almoço e jantar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                <input type="radio" name="distribuicao-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Não tenho uma distribuição específica</span>
                              </label>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Consciência de timing</p>
                          </div>
                        )}

                        {etapaPreviewGuiaProteico === 5 && (
                          <div className="bg-lime-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-lime-900 mb-3">📚 5. Com que frequência você busca informações sobre proteínas?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="frequencia-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Diariamente busco informações sobre proteínas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="frequencia-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Semanalmente busco informações sobre proteínas</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-lime-300">
                                <input type="radio" name="frequencia-proteina" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente busco informações sobre proteínas</span>
                              </label>
                            </div>
                            <p className="text-xs text-lime-600 mt-2">🧠 Gatilho: Consciência de aprendizado</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewGuiaProteico === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Guia Proteico</h4>
                        
                        {/* Resultado 1: Baixa Proteína */}
                        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-red-900">📉 Baixa Proteína</h5>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 0.8g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaProteicoDiagnosticos.nutri.baixaProteina.diagnostico}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.baixaProteina.causaRaiz}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.baixaProteina.acaoImediata}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.baixaProteina.plano7Dias}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.baixaProteina.suplementacao}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.baixaProteina.alimentacao}</p>
                            {guiaProteicoDiagnosticos.nutri.baixaProteina.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaProteicoDiagnosticos.nutri.baixaProteina.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Proteína Moderada */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">✅ Proteína Moderada</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0.8-1.2g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaProteicoDiagnosticos.nutri.proteinaModerada.diagnostico}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.proteinaModerada.causaRaiz}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.proteinaModerada.acaoImediata}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.proteinaModerada.plano7Dias}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.proteinaModerada.suplementacao}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.proteinaModerada.alimentacao}</p>
                            {guiaProteicoDiagnosticos.nutri.proteinaModerada.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaProteicoDiagnosticos.nutri.proteinaModerada.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Alta Proteína */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">🚀 Alta Proteína</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 1.2g/kg</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{guiaProteicoDiagnosticos.nutri.altaProteina.diagnostico}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.altaProteina.causaRaiz}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.altaProteina.acaoImediata}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.altaProteina.plano7Dias}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.altaProteina.suplementacao}</p>
                            <p className="text-gray-700">{guiaProteicoDiagnosticos.nutri.altaProteina.alimentacao}</p>
                            {guiaProteicoDiagnosticos.nutri.altaProteina.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{guiaProteicoDiagnosticos.nutri.altaProteina.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewGuiaProteico(Math.max(0, etapaPreviewGuiaProteico - 1))}
                        disabled={etapaPreviewGuiaProteico === 0}
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
                              onClick={() => setEtapaPreviewGuiaProteico(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewGuiaProteico === etapa
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
                        onClick={() => setEtapaPreviewGuiaProteico(Math.min(6, etapaPreviewGuiaProteico + 1))}
                        disabled={etapaPreviewGuiaProteico === 6}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Tabela Comparativa */}
              {templatePreviewSelecionado.id === 'tabela-comparativa' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    📊 Preview da Tabela Comparativa - "Compare produtos e escolha o melhor"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewTabelaComparativa === 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Compare Produtos e Escolha o Melhor</h4>
                        <p className="text-gray-700 mb-3">Descubra as diferenças entre produtos e receba orientações personalizadas para fazer a melhor escolha baseadas em sua área de interesse.</p>
                        <p className="text-blue-600 font-semibold">💡 Uma comparação que pode transformar suas escolhas.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewTabelaComparativa >= 1 && etapaPreviewTabelaComparativa <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewTabelaComparativa === 1 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">📊 1. Que tipo de produtos você quer comparar?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="tipo-produto" className="mr-3" disabled />
                                <span className="text-gray-700">Produtos essenciais (básicos)</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="tipo-produto" className="mr-3" disabled />
                                <span className="text-gray-700">Produtos especializados (avançados)</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                                <input type="radio" name="tipo-produto" className="mr-3" disabled />
                                <span className="text-gray-700">Produtos de elite (premium)</span>
                              </label>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Consciência de categoria</p>
                          </div>
                        )}

                        {etapaPreviewTabelaComparativa === 2 && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-3">🔍 2. Qual é seu objetivo com a comparação?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="objetivo-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Encontrar o melhor custo-benefício</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="objetivo-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Identificar a melhor qualidade</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                                <input type="radio" name="objetivo-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Descobrir a melhor eficácia</span>
                              </label>
                            </div>
                            <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Consciência de objetivo</p>
                          </div>
                        )}

                        {etapaPreviewTabelaComparativa === 3 && (
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-900 mb-3">⚖️ 3. Que critérios são mais importantes para você?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="criterios" className="mr-3" disabled />
                                <span className="text-gray-700">Preço e disponibilidade</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="criterios" className="mr-3" disabled />
                                <span className="text-gray-700">Qualidade e composição</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="criterios" className="mr-3" disabled />
                                <span className="text-gray-700">Eficácia e resultados</span>
                              </label>
                            </div>
                            <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência de critérios</p>
                          </div>
                        )}

                        {etapaPreviewTabelaComparativa === 4 && (
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-teal-900 mb-3">🎯 4. Qual é sua experiência com produtos similares?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="experiencia" className="mr-3" disabled />
                                <span className="text-gray-700">Pouca experiência, preciso de orientação</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="experiencia" className="mr-3" disabled />
                                <span className="text-gray-700">Experiência moderada, quero otimizar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="experiencia" className="mr-3" disabled />
                                <span className="text-gray-700">Muita experiência, quero evoluir</span>
                              </label>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência de experiência</p>
                          </div>
                        )}

                        {etapaPreviewTabelaComparativa === 5 && (
                          <div className="bg-sky-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sky-900 mb-3">📈 5. Com que frequência você faz comparações de produtos?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Sempre comparo antes de comprar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Comparo ocasionalmente</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-comparacao" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente faço comparações</span>
                              </label>
                            </div>
                            <p className="text-xs text-sky-600 mt-2">🧠 Gatilho: Consciência de hábito</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewTabelaComparativa === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Tabela Comparativa</h4>
                        
                        {/* Resultado 1: Comparação Básica */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">📊 Comparação Básica</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Produtos essenciais</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.diagnostico}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.suplementacao}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.alimentacao}</p>
                            {tabelaComparativaDiagnosticos.nutri.comparacaoBasica.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaComparativaDiagnosticos.nutri.comparacaoBasica.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Comparação Avançada */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🚀 Comparação Avançada</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Produtos especializados</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.diagnostico}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.suplementacao}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.alimentacao}</p>
                            {tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaComparativaDiagnosticos.nutri.comparacaoAvancada.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Comparação Premium */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⭐ Comparação Premium</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Produtos de elite</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.diagnostico}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.suplementacao}</p>
                            <p className="text-gray-700">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.alimentacao}</p>
                            {tabelaComparativaDiagnosticos.nutri.comparacaoPremium.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaComparativaDiagnosticos.nutri.comparacaoPremium.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewTabelaComparativa(Math.max(0, etapaPreviewTabelaComparativa - 1))}
                        disabled={etapaPreviewTabelaComparativa === 0}
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
                              onClick={() => setEtapaPreviewTabelaComparativa(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewTabelaComparativa === etapa
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
                        onClick={() => setEtapaPreviewTabelaComparativa(Math.min(6, etapaPreviewTabelaComparativa + 1))}
                        disabled={etapaPreviewTabelaComparativa === 6}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabela de Substituições */}
              {templatePreviewSelecionado.id === 'tabela-substituicoes' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🔄 Preview da Tabela de Substituições - "Substitua alimentos e melhore sua alimentação"
                  </h3>
                  
                  {/* Container principal com navegação */}
                  <div className="relative">
                    {/* Tela de Abertura - Etapa 0 */}
                    {etapaPreviewTabelaSubstituicoes === 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">🔄 Substitua Alimentos e Melhore Sua Alimentação</h4>
                        <p className="text-gray-700 mb-3">Descubra alternativas saudáveis para seus alimentos e receba orientações personalizadas para fazer substituições inteligentes baseadas em sua área de interesse.</p>
                        <p className="text-green-600 font-semibold">💡 Uma substituição que pode transformar sua alimentação.</p>
                      </div>
                    )}

                    {/* Perguntas 1-5 - Navegação com setinhas */}
                    {etapaPreviewTabelaSubstituicoes >= 1 && etapaPreviewTabelaSubstituicoes <= 5 && (
                      <div className="space-y-6">
                        {etapaPreviewTabelaSubstituicoes === 1 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">🔄 1. Que tipo de alimentos você quer substituir?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="tipo-alimento" className="mr-3" disabled />
                                <span className="text-gray-700">Alimentos comuns (básicos)</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="tipo-alimento" className="mr-3" disabled />
                                <span className="text-gray-700">Alimentos específicos (avançados)</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                <input type="radio" name="tipo-alimento" className="mr-3" disabled />
                                <span className="text-gray-700">Alimentos de elite (premium)</span>
                              </label>
                            </div>
                            <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Consciência de categoria</p>
                          </div>
                        )}

                        {etapaPreviewTabelaSubstituicoes === 2 && (
                          <div className="bg-emerald-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-emerald-900 mb-3">🥗 2. Qual é seu objetivo com as substituições?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="objetivo-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Melhorar a saúde geral</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="objetivo-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Otimizar nutrientes específicos</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                <input type="radio" name="objetivo-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Evoluir para alimentação premium</span>
                              </label>
                            </div>
                            <p className="text-xs text-emerald-600 mt-2">🧠 Gatilho: Consciência de objetivo</p>
                          </div>
                        )}

                        {etapaPreviewTabelaSubstituicoes === 3 && (
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-teal-900 mb-3">⚖️ 3. Que critérios são mais importantes para você?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="criterios-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Facilidade e praticidade</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="criterios-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Valor nutricional e qualidade</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                                <input type="radio" name="criterios-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Sabor e experiência gastronômica</span>
                              </label>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Consciência de critérios</p>
                          </div>
                        )}

                        {etapaPreviewTabelaSubstituicoes === 4 && (
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-cyan-900 mb-3">🎯 4. Qual é sua experiência com substituições alimentares?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="experiencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Pouca experiência, preciso de orientação</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="experiencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Experiência moderada, quero otimizar</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                <input type="radio" name="experiencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Muita experiência, quero evoluir</span>
                              </label>
                            </div>
                            <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Consciência de experiência</p>
                          </div>
                        )}

                        {etapaPreviewTabelaSubstituicoes === 5 && (
                          <div className="bg-sky-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sky-900 mb-3">📈 5. Com que frequência você faz substituições alimentares?</h4>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Sempre faço substituições</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Faço substituições ocasionalmente</span>
                              </label>
                              <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300">
                                <input type="radio" name="frequencia-substituicao" className="mr-3" disabled />
                                <span className="text-gray-700">Raramente faço substituições</span>
                              </label>
                            </div>
                            <p className="text-xs text-sky-600 mt-2">🧠 Gatilho: Consciência de hábito</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tela de Resultados - Etapa 6 */}
                    {etapaPreviewTabelaSubstituicoes === 6 && (
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Tabela de Substituições</h4>
                        
                        {/* Resultado 1: Substituições Básicas */}
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-blue-900">🔄 Substituições Básicas</h5>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Alternativas simples</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.diagnostico}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.suplementacao}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.alimentacao}</p>
                            {tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesBasicas.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 2: Substituições Avançadas */}
                        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-green-900">🚀 Substituições Avançadas</h5>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Alternativas especializadas</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.diagnostico}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.suplementacao}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.alimentacao}</p>
                            {tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesAvancadas.proximoPasso}</p>
                            )}
                          </div>
                        </div>

                        {/* Resultado 3: Substituições Premium */}
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-yellow-900">⭐ Substituições Premium</h5>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Alternativas de elite</span>
                          </div>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="font-semibold text-gray-900">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.diagnostico}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.causaRaiz}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.acaoImediata}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.plano7Dias}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.suplementacao}</p>
                            <p className="text-gray-700">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.alimentacao}</p>
                            {tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.proximoPasso && (
                              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{tabelaSubstituicoesDiagnosticos.nutri.substituicoesPremium.proximoPasso}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navegação com Setinhas */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewTabelaSubstituicoes(Math.max(0, etapaPreviewTabelaSubstituicoes - 1))}
                        disabled={etapaPreviewTabelaSubstituicoes === 0}
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
                              onClick={() => setEtapaPreviewTabelaSubstituicoes(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewTabelaSubstituicoes === etapa
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
                        onClick={() => setEtapaPreviewTabelaSubstituicoes(Math.min(6, etapaPreviewTabelaSubstituicoes + 1))}
                        disabled={etapaPreviewTabelaSubstituicoes === 6}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Diagnóstico de Parasitose */}
              {templatePreviewSelecionado.id === 'template-diagnostico-parasitose' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🧫 Preview do Diagnóstico de Parasitose</h3>
                  <div className="relative">
                    {etapaPreviewParasitose === 0 && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Você sabia?</h4>
                        <p className="text-gray-700 mb-2">Parasitas intestinais podem interferir diretamente no seu metabolismo, causar inchaço, fadiga, dores abdominais e queda de imunidade.</p>
                        <p className="text-teal-700 font-semibold">Responda este diagnóstico rápido e descubra se você apresenta sinais compatíveis com parasitose intestinal.</p>
                      </div>
                    )}

                    {etapaPreviewParasitose >= 1 && etapaPreviewParasitose <= 10 && (
                      <div className="space-y-6">
                        {[
                          'Você sente inchaço abdominal com frequência, mesmo comendo pouco?',
                          'Tem episódios de gases ou cólicas intestinais?',
                          'Nota alterações no apetite (muita fome ou falta total)?',
                          'Percebe náuseas, enjoo ou gosto amargo na boca em alguns dias?',
                          'Sente coceira anal, especialmente à noite?',
                          'Tem episódios de diarreia alternando com prisão de ventre?',
                          'Sente cansaço excessivo mesmo dormindo bem?',
                          'Notou queda de cabelo, unhas fracas ou pele seca sem causa aparente?',
                          'Sofre com sono agitado ou ranger de dentes à noite?',
                          'Teve contato frequente com animais ou alimentos crus/mal higienizados?'
                        ].map((pergunta, index) => (
                          etapaPreviewParasitose === index + 1 && (
                            <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-emerald-900 mb-3">{index + 1}. {pergunta}</h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                                  <label key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300">
                                    <input type="radio" className="mr-3" disabled />
                                    <span className="text-gray-700">{op}</span>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-emerald-700 mt-2">Escala de 1 a 5 para estimar intensidade/frequência dos sinais.</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {etapaPreviewParasitose === 11 && (
                      <div className="space-y-6">
                        {/* Interpretação em 7 etapas por faixa de risco */}
                        <div className="space-y-4">
                          {/* Baixo */}
                          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-green-900">Resultado: Risco Baixo (0–10)</h5>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-600 text-white">Baixo</span>
                            </div>
                            <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                              <p><strong>DIAGNÓSTICO:</strong> Poucos sinais compatíveis com parasitose intestinal no momento.</p>
                              <p><strong>CAUSA RAIZ:</strong> Possível desequilíbrio pontual de hábitos de higiene/alimentação, sem evidência consistente de parasitas.</p>
                              <p><strong>AÇÃO IMEDIATA:</strong> Reforçar higiene de alimentos/água e monitorar sintomas por 7–14 dias.</p>
                              <p><strong>PLANO 7 DIAS:</strong> Hidratação adequada; higienização rigorosa; fibras solúveis; probióticos alimentares.</p>
                              <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se indicado por profissional. Probióticos leves podem ser considerados.</p>
                              <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos frescos higienizados, evitar crus de procedência duvidosa.</p>
                              <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Manter rotina e reavaliar se surgirem novos sintomas.</p>
                            </div>
                          </div>

                          {/* Moderado */}
                          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-yellow-900">Resultado: Risco Moderado (11–25)</h5>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">Moderado</span>
                            </div>
                            <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                              <p><strong>DIAGNÓSTICO:</strong> Alguns sinais sugerem possível parasitose ou disbiose intestinal.</p>
                              <p><strong>CAUSA RAIZ:</strong> Exposição a alimentos/água de risco, higiene inconsistente ou microbiota desequilibrada.</p>
                              <p><strong>AÇÃO IMEDIATA:</strong> Ajustar higiene alimentar e procurar avaliação profissional para triagem clínica.</p>
                              <p><strong>PLANO 7 DIAS:</strong> Protocolo leve de correção: hidratação, fibras, probióticos, reduzir açúcar ultraprocessado.</p>
                              <p><strong>SUPLEMENTAÇÃO:</strong> Considerar probióticos/fitoterápicos apenas após avaliação.</p>
                              <p><strong>ALIMENTAÇÃO:</strong> Cozinhar bem proteínas; lavar e sanitizar hortifrútis; evitar crus fora de casa.</p>
                              <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Marcar consulta para definir necessidade de exames laboratoriais.</p>
                            </div>
                          </div>

                          {/* Alto */}
                          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-red-900">Resultado: Risco Alto (26–40)</h5>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white">Alto</span>
                            </div>
                            <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                              <p><strong>DIAGNÓSTICO:</strong> Vários sintomas compatíveis com parasitose intestinal.</p>
                              <p><strong>CAUSA RAIZ:</strong> Alta probabilidade de exposição/colonização por parasitas; possível disbiose importante.</p>
                              <p><strong>AÇÃO IMEDIATA:</strong> Procurar nutricionista/médico para avaliação e solicitação de exames específicos.</p>
                              <p><strong>PLANO 7 DIAS:</strong> Medidas rigorosas de higiene alimentar; protocolo alimentar anti-inflamatório leve e suporte digestivo.</p>
                              <p><strong>SUPLEMENTAÇÃO:</strong> Somente com orientação profissional; uso direcionado conforme resultado clínico/lab.</p>
                              <p><strong>ALIMENTAÇÃO:</strong> Evitar crus; reforçar cozimento adequado; priorizar caldos, cozidos, especiarias.</p>
                              <p className="font-semibold bg-purple-50 p-3 rounded-lg">🎯 PRÓXIMO PASSO: Agendar avaliação e seguir conduta baseada em evidências.</p>
                            </div>
                          </div>
                        </div>

                        
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setEtapaPreviewParasitose(Math.max(0, etapaPreviewParasitose - 1))}
                        disabled={etapaPreviewParasitose === 0}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      <div className="flex space-x-2">
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map((etapa) => {
                          const labels = ['Início','1','2','3','4','5','6','7','8','9','10','Resultados']
                          return (
                            <button
                              key={etapa}
                              onClick={() => setEtapaPreviewParasitose(etapa)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreviewParasitose === etapa
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapa === 0 ? 'Tela Inicial' : etapa === 11 ? 'Resultados' : `Pergunta ${etapa}`}
                            >
                              {labels[etapa]}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setEtapaPreviewParasitose(Math.min(11, etapaPreviewParasitose + 1))}
                        disabled={etapaPreviewParasitose === 11}
                        className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {templatePreviewSelecionado.id !== 'quiz-interativo' && templatePreviewSelecionado.id !== 'calculadora-imc' && templatePreviewSelecionado.id !== 'quiz-bem-estar' && templatePreviewSelecionado.id !== 'quiz-perfil-nutricional' && templatePreviewSelecionado.id !== 'quiz-detox' && templatePreviewSelecionado.id !== 'quiz-energetico' && templatePreviewSelecionado.id !== 'calculadora-proteina' && templatePreviewSelecionado.id !== 'calculadora-agua' && templatePreviewSelecionado.id !== 'calculadora-calorias' && templatePreviewSelecionado.id !== 'checklist-detox' && templatePreviewSelecionado.id !== 'checklist-alimentar' && templatePreviewSelecionado.id !== 'mini-ebook' && templatePreviewSelecionado.id !== 'guia-nutraceutico' && templatePreviewSelecionado.id !== 'guia-proteico' && templatePreviewSelecionado.id !== 'tabela-comparativa' && templatePreviewSelecionado.id !== 'tabela-substituicoes' && templatePreviewSelecionado.id !== 'template-diagnostico-parasitose' && (
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
                    setEtapaPreviewGuiaNutraceutico(0)
                    setEtapaPreviewGuiaProteico(0)
                    setEtapaPreviewTabelaComparativa(0)
                    setEtapaPreviewTabelaSubstituicoes(0)
                    setEtapaPreviewParasitose(0)
                    setEtapaPreviewDisciplinadoEmocional(0)
                    setEtapaPreviewNutridoAlimentado(0)
                    setEtapaPreviewPerfilIntestino(0)
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