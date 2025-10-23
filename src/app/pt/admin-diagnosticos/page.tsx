'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'

// Lista das 60 ferramentas YLADA (Catálogo Completo)
const ferramentasYLADA = [
  { id: 'quiz-interativo', nome: 'Quiz Interativo', categoria: 'Atrair Leads', objetivo: 'Atrair leads frios', icon: '🎯' },
  { id: 'quiz-bem-estar', nome: 'Quiz de Bem-Estar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🧘‍♀️' },
  { id: 'quiz-perfil-nutricional', nome: 'Quiz de Perfil Nutricional', categoria: 'Diagnóstico', objetivo: 'Diagnóstico inicial', icon: '🥗' },
  { id: 'quiz-detox', nome: 'Quiz Detox', categoria: 'Captação', objetivo: 'Captação + curiosidade', icon: '🧽' },
  { id: 'quiz-energetico', nome: 'Quiz Energético', categoria: 'Segmentação', objetivo: 'Segmentação', icon: '⚡' },
  { id: 'calculadora-imc', nome: 'Calculadora de IMC', categoria: 'Avaliação', objetivo: 'Avaliação corporal', icon: '📊' },
  { id: 'calculadora-proteina', nome: 'Calculadora de Proteína', categoria: 'Nutrição', objetivo: 'Recomendação nutricional', icon: '🥩' },
  { id: 'calculadora-agua', nome: 'Calculadora de Água', categoria: 'Engajamento', objetivo: 'Engajamento leve', icon: '💧' },
  { id: 'calculadora-calorias', nome: 'Calculadora de Calorias', categoria: 'Diagnóstico', objetivo: 'Diagnóstico', icon: '🔥' },
  { id: 'checklist-detox', nome: 'Checklist Detox', categoria: 'Educação', objetivo: 'Educação rápida', icon: '📋' },
  { id: 'checklist-alimentar', nome: 'Checklist Alimentar', categoria: 'Avaliação', objetivo: 'Avaliação de hábitos', icon: '🍽️' },
  { id: 'mini-ebook', nome: 'Mini E-book Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📚' },
  { id: 'guia-nutraceutico', nome: 'Guia Nutracêutico', categoria: 'Atração', objetivo: 'Atração de interesse', icon: '💊' },
  { id: 'guia-proteico', nome: 'Guia Proteico', categoria: 'Especialização', objetivo: 'Especialização', icon: '🥛' },
  { id: 'tabela-comparativa', nome: 'Tabela Comparativa', categoria: 'Conversão', objetivo: 'Conversão', icon: '📊' },
  { id: 'tabela-substituicoes', nome: 'Tabela de Substituições', categoria: 'Valor', objetivo: 'Valor agregado', icon: '🔄' },
  { id: 'tabela-sintomas', nome: 'Tabela de Sintomas', categoria: 'Diagnóstico', objetivo: 'Diagnóstico leve', icon: '🩺' },
  { id: 'plano-alimentar-base', nome: 'Plano Alimentar Base', categoria: 'Valor', objetivo: 'Valor prático', icon: '📅' },
  { id: 'planner-refeicoes', nome: 'Planner de Refeições', categoria: 'Organização', objetivo: 'Organização', icon: '🗓️' },
  { id: 'rastreador-alimentar', nome: 'Rastreador Alimentar', categoria: 'Acompanhamento', objetivo: 'Acompanhamento', icon: '📈' },
  { id: 'diario-alimentar', nome: 'Diário Alimentar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📝' },
  { id: 'tabela-metas-semanais', nome: 'Tabela de Metas Semanais', categoria: 'Motivação', objetivo: 'Motivação', icon: '🎯' },
  { id: 'template-desafio-7dias', nome: 'Template de Desafio 7 Dias', categoria: 'Gamificação', objetivo: 'Gamificação', icon: '🏆' },
  { id: 'template-desafio-21dias', nome: 'Template de Desafio 21 Dias', categoria: 'Comprometimento', objetivo: 'Comprometimento', icon: '📅' },
  { id: 'guia-hidratacao', nome: 'Guia de Hidratação', categoria: 'Educação', objetivo: 'Educação visual', icon: '💧' },
  { id: 'infografico-educativo', nome: 'Infográfico Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📊' },
  { id: 'template-receitas', nome: 'Template de Receitas', categoria: 'Valor', objetivo: 'Valor prático', icon: '👨‍🍳' },
  { id: 'cardapio-detox', nome: 'Cardápio Detox', categoria: 'Conversão', objetivo: 'Conversão indireta', icon: '🥗' },
  { id: 'simulador-resultados', nome: 'Simulador de Resultados', categoria: 'Curiosidade', objetivo: 'Curiosidade', icon: '🔮' },
  { id: 'template-avaliacao-inicial', nome: 'Template de Avaliação Inicial', categoria: 'Captação', objetivo: 'Captação', icon: '📋' },
  { id: 'formulario-recomendacao', nome: 'Formulário de Recomendação', categoria: 'Diagnóstico', objetivo: 'Diagnóstico rápido', icon: '📝' },
  { id: 'template-acompanhamento-semanal', nome: 'Template de Acompanhamento Semanal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📊' },
  { id: 'template-checkin-mensal', nome: 'Template de Check-in Mensal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📅' },
  { id: 'ficha-cliente', nome: 'Ficha de Cliente', categoria: 'Profissionalização', objetivo: 'Profissionalização', icon: '📋' },
  { id: 'template-progresso-visual', nome: 'Template de Progresso Visual', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📈' },
  { id: 'template-story-interativo', nome: 'Template de Story Interativo', categoria: 'Engajamento', objetivo: 'Engajamento nas redes', icon: '📱' },
  { id: 'post-curiosidades', nome: 'Post de Curiosidades', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '💡' },
  { id: 'template-post-dica', nome: 'Template de Post com Dica', categoria: 'Conteúdo', objetivo: 'Conteúdo recorrente', icon: '📝' },
  { id: 'template-reels-roteirizado', nome: 'Template de Reels Roteirizado', categoria: 'Atração', objetivo: 'Atração visual', icon: '🎬' },
  { id: 'template-artigo-curto', nome: 'Template de Artigo Curto', categoria: 'Autoridade', objetivo: 'Autoridade escrita', icon: '📄' },
  { id: 'template-catalogo-digital', nome: 'Template de Catálogo Digital', categoria: 'Conversão', objetivo: 'Conversão direta', icon: '📱' },
  { id: 'simulador-ganho', nome: 'Simulador de Ganho', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '💰' },
  { id: 'template-oportunidade', nome: 'Template de Oportunidade', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '🚀' },
  { id: 'template-apresentacao-negocio', nome: 'Template de Apresentação de Negócio', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '📊' },
  { id: 'template-script-convite', nome: 'Template de Script de Convite', categoria: 'Duplicação', objetivo: 'Duplicação', icon: '💬' },
  { id: 'template-onboarding-parceiro', nome: 'Template de Onboarding de Parceiro', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '👥' },
  { id: 'template-plano-acao-equipe', nome: 'Template de Plano de Ação da Equipe', categoria: 'Gestão', objetivo: 'Gestão', icon: '📋' },
  { id: 'template-feedback-cliente', nome: 'Template de Feedback de Cliente', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '⭐' },
  { id: 'template-mensagem-pos-compra', nome: 'Template de Mensagem Pós-Compra', categoria: 'Retenção', objetivo: 'Retenção', icon: '🎉' },
  { id: 'template-email-reposicao', nome: 'Template de E-mail de Reposição', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📧' },
  { id: 'template-aniversario', nome: 'Template de Aniversário', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🎂' },
  { id: 'template-recompensa-cashback', nome: 'Template de Recompensa / Cashback', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '🎁' },
  { id: 'template-agradecimento', nome: 'Template de Agradecimento', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🙏' },
  { id: 'template-plano-semanal-conteudo', nome: 'Template de Plano Semanal de Conteúdo', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-reels-educativo', nome: 'Template de Reels Educativo', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🎓' },
  { id: 'template-conteudo-autoridade', nome: 'Template de Conteúdo de Autoridade', categoria: 'Branding', objetivo: 'Branding', icon: '👑' },
  { id: 'template-testemunho-visual', nome: 'Template de Testemunho Visual', categoria: 'Prova Social', objetivo: 'Prova social', icon: '💬' },
  { id: 'template-calendario-postagens', nome: 'Template de Calendário de Postagens', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-estrategia-lancamento', nome: 'Template de Estratégia de Lançamento', categoria: 'Negócio', objetivo: 'Negócio', icon: '🚀' },
  { id: 'template-jornada-cliente', nome: 'Template de Jornada do Cliente', categoria: 'Estratégico', objetivo: 'Estratégico', icon: '🗺️' }
]

// Dados dos diagnósticos por profissão e categoria de IMC (exemplo para Calculadora de IMC)
const diagnosticosPorProfissao = {
  nutri: {
    baixoPeso: [
      '📋 Avaliação nutricional completa para ganho de peso saudável',
      '🥗 Plano alimentar hipercalórico e nutritivo',
      '💊 Suplementação para aumento de massa muscular',
      '📅 Acompanhamento nutricional semanal'
    ],
    pesoNormal: [
      '📋 Manutenção do peso com alimentação equilibrada',
      '🥗 Plano alimentar para otimização da saúde',
      '💪 Estratégias para ganho de massa muscular',
      '📅 Consultas de manutenção mensais'
    ],
    sobrepeso: [
      '📋 Plano alimentar para redução de peso',
      '🥗 Reeducação alimentar e mudança de hábitos',
      '💊 Suplementação para controle do apetite',
      '📅 Acompanhamento nutricional quinzenal'
    ],
    obesidade: [
      '📋 Plano alimentar para redução de peso',
      '🥗 Reeducação alimentar completa',
      '💊 Suplementação para controle metabólico',
      '📅 Acompanhamento nutricional semanal intensivo'
    ]
  },
  sales: {
    baixoPeso: [
      '💊 Whey Protein para ganho de massa muscular',
      '🍯 Maltodextrina para aumento calórico',
      '🥛 Mass Gainer para ganho de peso',
      '📞 Consultoria personalizada de suplementação'
    ],
    pesoNormal: [
      '💊 Multivitamínicos para otimização da saúde',
      '🥗 Proteínas para manutenção muscular',
      '💪 Creatina para performance física',
      '📞 Consultoria de suplementação preventiva'
    ],
    sobrepeso: [
      '💊 Termogênicos para aceleração metabólica',
      '🥗 Proteínas para preservação muscular',
      '💪 L-Carnitina para queima de gordura',
      '📞 Consultoria de suplementação para emagrecimento'
    ],
    obesidade: [
      '💊 Suplementos para controle metabólico',
      '🥗 Proteínas para preservação muscular',
      '💪 Suplementos para redução de apetite',
      '📞 Consultoria especializada em suplementação'
    ]
  },
  coach: {
    baixoPeso: [
      '🧘‍♀️ Programa de ganho de peso saudável',
      '💪 Treinos para aumento de massa muscular',
      '🍎 Coaching nutricional para ganho de peso',
      '📅 Acompanhamento semanal de transformação'
    ],
    pesoNormal: [
      '🧘‍♀️ Programa de otimização da saúde',
      '💪 Treinos para manutenção e performance',
      '🍎 Coaching de hábitos saudáveis',
      '📅 Acompanhamento mensal de bem-estar'
    ],
    sobrepeso: [
      '🧘‍♀️ Programa de transformação corporal',
      '💪 Treinos para redução de peso',
      '🍎 Coaching de mudança de hábitos',
      '📅 Acompanhamento quinzenal de progresso'
    ],
    obesidade: [
      '🧘‍♀️ Programa intensivo de transformação',
      '💪 Treinos adaptados para início da jornada',
      '🍎 Coaching completo de mudança de vida',
      '📅 Acompanhamento semanal intensivo'
    ]
  }
}

// Categorias dinâmicas baseadas na ferramenta escolhida
const getCategoriasPorFerramenta = (ferramentaId: string) => {
  const categoriasMap: { [key: string]: any[] } = {
    'calculadora-imc': [
      { id: 'baixoPeso', label: 'Baixo Peso', range: '< 18.5', color: 'blue' },
      { id: 'pesoNormal', label: 'Peso Normal', range: '18.5 - 24.9', color: 'green' },
      { id: 'sobrepeso', label: 'Sobrepeso', range: '25.0 - 29.9', color: 'yellow' },
      { id: 'obesidade', label: 'Obesidade', range: '≥ 30.0', color: 'red' }
    ],
    'quiz-interativo': [
      { id: 'metabolismo-lento', label: 'Metabolismo Lento', range: '0-30 pontos', color: 'blue' },
      { id: 'metabolismo-normal', label: 'Metabolismo Normal', range: '31-60 pontos', color: 'green' },
      { id: 'metabolismo-rapido', label: 'Metabolismo Rápido', range: '61-100 pontos', color: 'yellow' }
    ],
    'calculadora-proteina': [
      { id: 'baixa-proteina', label: 'Baixa Proteína', range: '< 0.8g/kg', color: 'blue' },
      { id: 'proteina-normal', label: 'Proteína Normal', range: '0.8-1.2g/kg', color: 'green' },
      { id: 'alta-proteina', label: 'Alta Proteína', range: '> 1.2g/kg', color: 'yellow' }
    ],
    'quiz-detox': [
      { id: 'baixa-toxicidade', label: 'Baixa Toxicidade', range: '0-3 sinais', color: 'green' },
      { id: 'toxicidade-moderada', label: 'Toxicidade Moderada', range: '4-6 sinais', color: 'yellow' },
      { id: 'alta-toxicidade', label: 'Alta Toxicidade', range: '7+ sinais', color: 'red' }
    ],
    'calculadora-calorias': [
      { id: 'deficit-calorico', label: 'Déficit Calórico', range: 'Perda de peso', color: 'blue' },
      { id: 'manutencao-calorica', label: 'Manutenção', range: 'Peso estável', color: 'green' },
      { id: 'superavit-calorico', label: 'Superávit Calórico', range: 'Ganho de peso', color: 'yellow' }
    ]
  }
  
  return categoriasMap[ferramentaId] || categoriasMap['calculadora-imc']
}

const profissoes = [
  { id: 'nutri', label: 'Nutricionista', icon: '🥗', color: 'green' },
  { id: 'sales', label: 'Consultor Nutra', icon: '💊', color: 'blue' },
  { id: 'coach', label: 'Coach de Bem-estar', icon: '🧘‍♀️', color: 'purple' }
]

export default function AdminDiagnosticos() {
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<'nutri' | 'sales' | 'coach'>('nutri')
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState<string>('calculadora-imc')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('baixoPeso')

  // Filtrar ferramentas por profissão
  const ferramentasFiltradas = ferramentasYLADA.filter(ferramenta => {
    if (profissaoSelecionada === 'nutri') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'sales') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico', 'Recrutamento', 'Duplicação', 'Gestão', 'Fidelização', 'Retenção', 'Relacionamento'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'coach') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    }
    return true
  })

  // Obter categorias dinâmicas baseadas na ferramenta
  const categoriasAtuais = getCategoriasPorFerramenta(ferramentaSelecionada)

  const diagnosticosAtuais = diagnosticosPorProfissao[profissaoSelecionada][categoriaSelecionada as keyof typeof diagnosticosPorProfissao['nutri']]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt/templates-environment">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <div className="text-sm text-gray-600">
            Área Administrativa - Diagnósticos
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📊 Diagnósticos por Profissão
            </h1>
            <p className="text-gray-600">
              Visualize todas as respostas padrão da Calculadora de IMC por profissão e categoria
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seleção de Profissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <select
                  value={profissaoSelecionada}
                  onChange={(e) => setProfissaoSelecionada(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {profissoes.map((profissao) => (
                    <option key={profissao.id} value={profissao.id}>
                      {profissao.icon} {profissao.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Ferramenta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ferramenta ({ferramentasFiltradas.length} disponíveis)
                </label>
                <select
                  value={ferramentaSelecionada}
                  onChange={(e) => setFerramentaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {ferramentasFiltradas.map((ferramenta) => (
                    <option key={ferramenta.id} value={ferramenta.id}>
                      {ferramenta.icon} {ferramenta.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Categoria/Resultado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado/Categoria
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {categoriasAtuais.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.label} ({categoria.range})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Informações dos Filtros */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">
                  <strong>Profissão:</strong> {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </span>
                <span className="text-blue-800">
                  <strong>Ferramenta:</strong> {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </span>
                <span className="text-blue-800">
                  <strong>Categoria:</strong> {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Diagnósticos para {profissoes.find(p => p.id === profissaoSelecionada)?.label} - {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome} - {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
              </h2>
              <div className="text-sm text-gray-500">
                {diagnosticosAtuais.length} recomendações
              </div>
            </div>

            {/* Lista de Diagnósticos */}
            <div className="space-y-3">
              {diagnosticosAtuais.map((diagnostico, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 mr-3 mt-1 font-bold">
                    {index + 1}.
                  </span>
                  <span className="text-gray-800 flex-1">
                    {diagnostico}
                  </span>
                </div>
              ))}
            </div>

            {/* Informações Adicionais */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Categoria</h3>
                <p className="text-blue-800 text-sm">
                  {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label} 
                  ({categoriasAtuais.find(c => c.id === categoriaSelecionada)?.range})
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">👨‍⚕️ Profissão</h3>
                <p className="text-green-800 text-sm">
                  {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🛠️ Ferramenta</h3>
                <p className="text-purple-800 text-sm">
                  {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">📝 Total</h3>
                <p className="text-orange-800 text-sm">
                  {diagnosticosAtuais.length} recomendações específicas
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="mt-8 flex justify-center">
            <Link 
              href="/calculadora-imc"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              🧪 Testar Calculadora de IMC
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Área Administrativa YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
