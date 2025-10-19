'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

// Templates pré-definidos por propósito - ORGANOGRAMA ESTRATÉGICO
const TEMPLATES = {
  'nutricionista': {
    // 🎯 ATRACTION - Atração e Engajamento
    'capturar-leads': [
      { id: 'quiz-perfil-energia', name: 'Descubra seu tipo de energia', type: 'quiz', description: 'Quiz interativo que gera curiosidade e coleta dados do lead', category: 'atracao' },
      { id: 'quiz-perfil-saude', name: 'Qual é o seu perfil de saúde?', type: 'quiz', description: 'Mini teste que estimula reflexão e engaja', category: 'atracao' },
      { id: 'calculadora-equilibrio', name: 'Calcule seu índice de equilíbrio corpo & mente', type: 'calculator', description: 'Resultado rápido e gamificado', category: 'atracao' },
      { id: 'checklist-rotina', name: '10 sinais de que você precisa mudar sua rotina', type: 'checklist', description: 'Ferramenta leve e compartilhável', category: 'atracao' }
    ],
    'engajar-clientes': [
      { id: 'teste-alimentacao', name: 'Você está realmente se alimentando bem?', type: 'quiz', description: 'Estimula reflexão e engaja seguidores', category: 'atracao' },
      { id: 'tabela-habitos', name: 'Rotina ideal para perder peso ou ganhar energia', type: 'table', description: 'Conteúdo de valor que pede e-mail/contato', category: 'atracao' },
      { id: 'planilha-autocuidado', name: 'Planejador semanal de autocuidado', type: 'spreadsheet', description: 'Incentiva salvar e compartilhar', category: 'atracao' }
    ],
    
    // 👥 INDICAÇÃO - Gerar Compartilhamento
    'gerar-indicacoes': [
      { id: 'link-indicacao', name: 'Indique e ganhe algo', type: 'link', description: 'Gera rede de contatos entre clientes', category: 'indicacao' },
      { id: 'quiz-compartilhavel', name: 'Qual desafio combina mais com você?', type: 'quiz', description: 'Estimula envio a amigos', category: 'indicacao' },
      { id: 'ranking-indicadores', name: 'Top Indicadores da Semana', type: 'ranking', description: 'Estimula competição saudável', category: 'indicacao' },
      { id: 'planilha-pontos', name: 'Pontue cada indicação e acompanhe seu progresso', type: 'spreadsheet', description: 'Mantém engajamento', category: 'indicacao' },
      { id: 'cupom-ia', name: 'Crie seu cupom inteligente de compartilhamento', type: 'coupon', description: 'Ferramenta para viralização', category: 'indicacao' },
      { id: 'tabela-recompensas', name: 'Quanto mais indicações, mais recompensas', type: 'table', description: 'Visualiza vantagens e incentiva engajamento', category: 'indicacao' }
    ],
    
    // 💼 CONVERSÃO - Venda e Monetização
    'promover-produtos': [
      { id: 'catalogo-inteligente', name: 'Monte sua rotina ideal de produtos', type: 'catalog', description: 'Sugestão automatizada via IA', category: 'conversao' },
      { id: 'tabela-comparacao', name: 'Diferença entre produtos / kits', type: 'table', description: 'Clareza para compra', category: 'conversao' },
      { id: 'quiz-produto-ideal', name: 'Qual produto é ideal para seu objetivo?', type: 'quiz', description: 'Direciona para checkout', category: 'conversao' },
      { id: 'calculadora-resultados', name: 'Em quantos dias você pode ver resultados?', type: 'calculator', description: 'Gatilho de ação', category: 'conversao' },
      { id: 'planilha-desafio-21', name: '21 dias de desafio pessoal', type: 'spreadsheet', description: 'Gera recorrência e comunidade', category: 'conversao' }
    ],
    'educar-valor': [
      { id: 'mini-ebook', name: 'Guia rápido de alimentação inteligente', type: 'ebook', description: 'Captura lead + reforça autoridade', category: 'conversao' },
      { id: 'tabela-educacional', name: 'Composição e função dos alimentos', type: 'table', description: 'Valor técnico', category: 'conversao' },
      { id: 'checklist-pratico', name: 'Comece bem a semana saudável', type: 'checklist', description: 'Viral e educativo', category: 'conversao' },
      { id: 'quiz-conhecimento', name: 'Você sabe o que está comendo?', type: 'quiz', description: 'Educativo + divertido', category: 'conversao' },
      { id: 'linha-tempo', name: 'Evolução da sua saúde ao longo do tempo', type: 'timeline', description: 'Visual e emocional', category: 'conversao' }
    ],
    'avaliar-habitos': [
      { id: 'diagnostico-ia', name: 'Avalie seus hábitos e descubra seu score', type: 'diagnostic', description: 'Ferramenta principal para leads quentes', category: 'conversao' },
      { id: 'quiz-diagnostico', name: 'Descubra o que está sabotando seus resultados', type: 'quiz', description: 'Detecção + CTA para ajuda', category: 'conversao' },
      { id: 'planilha-autoavaliacao', name: 'Rotina alimentar e sono', type: 'spreadsheet', description: 'Ferramenta para acompanhamento', category: 'conversao' },
      { id: 'tabela-pontuacao', name: 'Seu perfil de bem-estar em números', type: 'table', description: 'Gera curiosidade e desejo de melhorar', category: 'conversao' }
    ],
    'vender-consultas': [
      { id: 'agendador-ia', name: 'Reserve sua avaliação com desconto', type: 'scheduler', description: 'Converte direto', category: 'conversao' },
      { id: 'calculadora-investimento', name: 'Quanto vale transformar sua rotina?', type: 'calculator', description: 'Valor percebido', category: 'conversao' },
      { id: 'plano-ia-personalizado', name: 'Monte seu plano ideal em 1 minuto', type: 'planner', description: 'Diagnóstico → Checkout', category: 'conversao' },
      { id: 'simulador-resultados', name: 'Veja como você pode evoluir em 30 dias', type: 'simulator', description: 'Conversão emocional', category: 'conversao' },
      { id: 'planilha-metas', name: 'Acompanhe seus resultados com seu coach', type: 'spreadsheet', description: 'Gera fidelização', category: 'conversao' }
    ]
  },
  'fisioterapeuta': [
    { id: 'quiz-avaliacao-postural', name: 'Quiz de Avaliação Postural', type: 'quiz', description: 'Identifique problemas posturais e dores' },
    { id: 'teste-flexibilidade', name: 'Teste de Flexibilidade', type: 'quiz', description: 'Avalie amplitude de movimento articular' },
    { id: 'avaliacao-dor', name: 'Avaliação de Dor Muscular', type: 'quiz', description: 'Identifique origem e intensidade da dor' },
    { id: 'plano-exercicios', name: 'Plano de Exercícios', type: 'form', description: 'Crie rotina de exercícios terapêuticos' }
  ],
  'personal-trainer': [
    { id: 'quiz-condicionamento', name: 'Quiz de Condicionamento Físico', type: 'quiz', description: 'Avalie nível de condicionamento atual' },
    { id: 'teste-forca', name: 'Teste de Força', type: 'quiz', description: 'Meça força muscular e resistência' },
    { id: 'objetivos-fitness', name: 'Definir Objetivos Fitness', type: 'form', description: 'Estabeleça metas de treinamento' },
    { id: 'plano-treino', name: 'Plano de Treino', type: 'form', description: 'Crie programa de exercícios personalizado' }
  ],
      'coach-bemestar': [
        { id: 'quiz-bemestar', name: 'Quiz de Bem-estar', type: 'quiz', description: 'Avalie nível de bem-estar e qualidade de vida' },
        { id: 'avaliacao-estresse', name: 'Avaliação de Estresse', type: 'quiz', description: 'Identifique níveis de estresse e ansiedade' },
        { id: 'plano-mindfulness', name: 'Plano de Mindfulness', type: 'form', description: 'Crie rotina de meditação e relaxamento' },
        { id: 'consultoria-vida', name: 'Consultoria de Vida', type: 'form', description: 'Agende sessão de coaching pessoal' }
      ],
      'vendedor-saude': [
        { id: 'quiz-necessidades-saude', name: 'Quiz de Necessidades de Saúde', type: 'quiz', description: 'Identifique necessidades de produtos de saúde' },
        { id: 'avaliacao-produtos-saude', name: 'Avaliação de Produtos de Saúde', type: 'quiz', description: 'Recomende produtos baseado no perfil' },
        { id: 'calculadora-suplementos', name: 'Calculadora de Suplementos', type: 'calculator', description: 'Calcule dosagem ideal de produtos' },
        { id: 'plano-saude', name: 'Plano de Saúde', type: 'form', description: 'Crie cronograma de produtos de saúde' }
      ],
  'esteticista': [
    { id: 'quiz-tipo-pele', name: 'Quiz de Tipo de Pele', type: 'quiz', description: 'Identifique tipo e necessidades da pele' },
    { id: 'avaliacao-facial', name: 'Avaliação Facial', type: 'quiz', description: 'Avalie condições da pele facial' },
    { id: 'rotina-skincare', name: 'Rotina de Skincare', type: 'form', description: 'Crie rotina personalizada de cuidados' },
    { id: 'agendamento-tratamento', name: 'Agendamento de Tratamento', type: 'form', description: 'Agende consulta e tratamento' }
  ],
  'consultor-beleza': [
    { id: 'quiz-estilo', name: 'Quiz de Estilo Pessoal', type: 'quiz', description: 'Descubra estilo e preferências de beleza' },
    { id: 'avaliacao-maquiagem', name: 'Avaliação de Maquiagem', type: 'quiz', description: 'Identifique tons e produtos ideais' },
    { id: 'tutorial-produtos', name: 'Tutorial de Produtos', type: 'form', description: 'Demonstre uso de produtos cosméticos' },
    { id: 'consultoria-beleza', name: 'Consultoria de Beleza', type: 'form', description: 'Agende consultoria personalizada' }
  ],
  'distribuidor-cosmeticos': [
    { id: 'quiz-necessidades-beleza', name: 'Quiz de Necessidades de Beleza', type: 'quiz', description: 'Identifique necessidades cosméticas' },
    { id: 'avaliacao-produtos-cosmeticos', name: 'Avaliação de Produtos Cosméticos', type: 'quiz', description: 'Recomende produtos baseado no perfil' },
    { id: 'demonstracao-produtos', name: 'Demonstração de Produtos', type: 'form', description: 'Demonstre benefícios dos produtos' },
    { id: 'plano-beleza', name: 'Plano de Beleza', type: 'form', description: 'Crie rotina completa de beleza' }
  ],
  'dermatologista': [
    { id: 'quiz-avaliacao-dermatologica', name: 'Quiz de Avaliação Dermatológica', type: 'quiz', description: 'Avalie condições da pele e cabelo' },
    { id: 'teste-sensibilidade', name: 'Teste de Sensibilidade', type: 'quiz', description: 'Identifique sensibilidades cutâneas' },
    { id: 'agendamento-consulta', name: 'Agendamento de Consulta', type: 'form', description: 'Agende consulta dermatológica' },
    { id: 'prescricao-tratamento', name: 'Prescrição de Tratamento', type: 'form', description: 'Prescreva tratamento personalizado' }
  ]
}

// Profissões simplificadas - CONFORME SOLICITADO
const PROFESSIONS = [
  // Profissões conforme solicitado pelo usuário
  { id: 'nutricionista', name: 'Nutricionista', category: 'saude-bemestar', icon: '🥗', status: 'active' },
  { id: 'personal-trainer', name: 'Personal Trainer', category: 'saude-bemestar', icon: '🏋️', status: 'active' },
  { id: 'fisioterapeuta', name: 'Fisioterapeuta', category: 'saude-bemestar', icon: '🩺', status: 'active' },
  { id: 'coach-bemestar', name: 'Coach do Bem-estar', category: 'saude-bemestar', icon: '🧘', status: 'active' },
  { id: 'vendedor-saude', name: 'Vendedor de Produtos de Saúde', category: 'saude-bemestar', icon: '💊', status: 'active' },
  
  // Opção para outros casos
  { id: 'outro', name: 'Outro', category: 'outros', icon: '✏️', status: 'custom' }
]

// Propósitos por profissão - NOVA FILOSOFIA ESTRATÉGICA YLADA
const PURPOSES = {
  'nutricionista': [
    // 🎯 FOCO EM ATRACTION, CONVERSÃO E INDICAÇÃO
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos contatos interessados em nutrição, saúde e bem-estar', icon: '🎯', category: 'atracao', priority: 'essencial' },
    { id: 'engajar-clientes', name: 'Engajar Clientes e Seguidores', description: 'Criar curiosidade e interação com quem já te acompanha', icon: '💬', category: 'atracao', priority: 'alta' },
    { id: 'gerar-indicacoes', name: 'Gerar Indicações', description: 'Criar ferramentas que motivem clientes e amigos a compartilharem', icon: '👥', category: 'indicacao', priority: 'fundamental' },
    { id: 'promover-produtos', name: 'Promover Produtos e Desafios', description: 'Mostrar soluções e programas de forma criativa e interativa', icon: '⚡', category: 'conversao', priority: 'alta' },
    { id: 'educar-valor', name: 'Educar e Gerar Valor', description: 'Ajudar pessoas com informações práticas, reforçando autoridade', icon: '🧠', category: 'conversao', priority: 'alta' },
    { id: 'avaliar-habitos', name: 'Avaliar Hábitos e Estilo de Vida', description: 'Diagnosticar o perfil de energia, alimentação ou rotina do lead', icon: '📊', category: 'conversao', priority: 'media' },
    { id: 'vender-consultas', name: 'Vender Consultas e Programas', description: 'Converter leads em clientes pagos ou planos personalizados', icon: '💼', category: 'conversao', priority: 'alta' }
  ],
  'personal-trainer': [
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos clientes interessados em treinamento', icon: '🎯' },
    { id: 'avaliacao-fisica', name: 'Avaliação Física', description: 'Avaliar condicionamento físico e objetivos', icon: '📊' },
    { id: 'educacao-fitness', name: 'Educação Fitness', description: 'Ensinar sobre exercícios e condicionamento', icon: '📚' },
    { id: 'acompanhamento', name: 'Acompanhamento', description: 'Monitorar progresso e resultados dos alunos', icon: '📈' },
    { id: 'venda-servicos', name: 'Venda de Serviços', description: 'Promover treinos e planos personalizados', icon: '💰' }
  ],
  'fisioterapeuta': [
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos pacientes interessados em fisioterapia', icon: '🎯' },
    { id: 'avaliacao-postural', name: 'Avaliação Postural', description: 'Avaliar problemas posturais e dores', icon: '📊' },
    { id: 'educacao-prevencao', name: 'Educação Preventiva', description: 'Ensinar sobre prevenção de lesões', icon: '📚' },
    { id: 'acompanhamento', name: 'Acompanhamento', description: 'Monitorar evolução do tratamento', icon: '📈' },
    { id: 'venda-servicos', name: 'Venda de Serviços', description: 'Promover sessões e tratamentos', icon: '💰' }
  ],
  'coach-bemestar': [
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos clientes interessados em coaching', icon: '🎯' },
    { id: 'avaliacao-bemestar', name: 'Avaliação de Bem-estar', description: 'Avaliar nível de bem-estar e qualidade de vida', icon: '📊' },
    { id: 'educacao-mindfulness', name: 'Educação Mindfulness', description: 'Ensinar técnicas de relaxamento e mindfulness', icon: '📚' },
    { id: 'acompanhamento', name: 'Acompanhamento', description: 'Monitorar evolução pessoal e emocional', icon: '📈' },
    { id: 'venda-servicos', name: 'Venda de Serviços', description: 'Promover sessões de coaching e consultoria', icon: '💰' }
  ],
  'vendedor-saude': [
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos clientes interessados em produtos', icon: '🎯' },
    { id: 'avaliacao-necessidades', name: 'Avaliação de Necessidades', description: 'Identificar necessidades de produtos de saúde', icon: '📊' },
    { id: 'educacao-produtos', name: 'Educação sobre Produtos', description: 'Ensinar sobre benefícios dos produtos', icon: '📚' },
    { id: 'acompanhamento', name: 'Acompanhamento', description: 'Monitorar uso e resultados dos produtos', icon: '📈' },
    { id: 'venda-produtos', name: 'Venda de Produtos', description: 'Promover e vender produtos de saúde', icon: '💰' }
  ],
  'outro': [
    { id: 'capturar-leads', name: 'Capturar Leads', description: 'Gerar novos clientes interessados', icon: '🎯' },
    { id: 'avaliacao-cliente', name: 'Avaliação de Cliente', description: 'Avaliar necessidades e perfil do cliente', icon: '📊' },
    { id: 'educacao-area', name: 'Educação na Área', description: 'Ensinar sobre sua área de atuação', icon: '📚' },
    { id: 'acompanhamento', name: 'Acompanhamento', description: 'Monitorar progresso e resultados', icon: '📈' },
    { id: 'venda-servicos', name: 'Venda de Serviços', description: 'Promover seus serviços e produtos', icon: '💰' }
  ]
}


export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [selectedProfession, setSelectedProfession] = useState('')
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleProfessionSelect = (professionId: string) => {
    const profession = PROFESSIONS.find(p => p.id === professionId)
    
    if (profession?.status === 'coming-soon') {
      alert('Esta área está em construção! Em breve teremos templates específicos para esta profissão.')
      return
    }
    
    setSelectedProfession(professionId)
    setStep(2) // Ir para etapa de Propósito
  }

  const handlePurposeSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId)
    setStep(3) // Ir para etapa de Templates/Ferramentas
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const profession = PROFESSIONS.find(p => p.id === selectedProfession)
      const template = TEMPLATES[selectedProfession as keyof typeof TEMPLATES]?.find(t => t.id === selectedTemplate)
      
      // Se não selecionou template, usar prompt personalizado
      const finalPrompt = selectedTemplate 
        ? `${template?.name}: ${template?.description}` 
        : customPrompt

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          profession: profession?.name,
          category: profession?.category,
          type: template?.type || 'quiz',
          templateId: selectedTemplate
        }),
      })

      const data = await response.json()

          if (data.success) {
            setGeneratedLink(data.data.url)
            setStep(4)
          } else {
        throw new Error(data.error || 'Erro ao gerar link')
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error)
      alert('Erro ao gerar link. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedProfession('')
    setSelectedPurpose('')
    setSelectedTemplate('')
    setCustomPrompt('')
    setGeneratedLink('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crie seu link inteligente com IA
            </h1>
            <p className="text-lg text-gray-600">
              Vamos personalizar sua ferramenta de geração de leads
            </p>
          </div>

              {/* Progress Steps */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step >= stepNumber 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {stepNumber}
                      </div>
                      {stepNumber < 4 && (
                        <div className={`w-6 h-0.5 ${
                          step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

          {/* Step 1: Profissão */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                O que você é?
              </h2>
              {/* Lista Vertical Mobile-First */}
              <div className="space-y-3">
                {PROFESSIONS.map((profession) => (
                  <button
                    key={profession.id}
                    onClick={() => handleProfessionSelect(profession.id)}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left relative ${
                      profession.status === 'coming-soon'
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                    disabled={profession.status === 'coming-soon'}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{profession.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{profession.name}</div>
                        {profession.status === 'coming-soon' && (
                          <div className="text-sm text-orange-600 mt-1">Em breve</div>
                        )}
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Propósito */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Qual é o seu propósito?
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Escolha o objetivo principal da sua ferramenta
              </p>
              
              {/* Lista de Propósitos - NOVA FILOSOFIA ESTRATÉGICA */}
              <div className="space-y-6">
                {selectedProfession === 'nutricionista' ? (
                  // Interface especial para nutricionistas com nova filosofia
                  <>
                    {/* 🎯 ATRACTION - Atração e Engajamento */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-blue-600 mr-2">🎯</span>
                        Atração e Engajamento
                      </h3>
                      <div className="space-y-2">
                        {PURPOSES.nutricionista.filter(p => p.category === 'atracao').map((purpose) => (
                          <button
                            key={purpose.id}
                            onClick={() => handlePurposeSelect(purpose.id)}
                            className="w-full p-4 border-2 rounded-xl transition-all text-left hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{purpose.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">{purpose.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{purpose.description}</div>
                                <div className="text-xs text-blue-600 mt-1 font-medium">
                                  {purpose.priority === 'essencial' ? '⭐ Essencial' : 
                                   purpose.priority === 'alta' ? '🔥 Alta Prioridade' : 
                                   purpose.priority === 'fundamental' ? '💎 Fundamental' : '📊 Média Prioridade'}
                                </div>
                              </div>
                              <div className="text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 👥 INDICAÇÃO - Gerar Compartilhamento */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-green-600 mr-2">👥</span>
                        Gerar Indicações e Compartilhamento
                      </h3>
                      <div className="space-y-2">
                        {PURPOSES.nutricionista.filter(p => p.category === 'indicacao').map((purpose) => (
                          <button
                            key={purpose.id}
                            onClick={() => handlePurposeSelect(purpose.id)}
                            className="w-full p-4 border-2 rounded-xl transition-all text-left hover:border-green-500 hover:bg-green-50 active:bg-green-100"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{purpose.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">{purpose.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{purpose.description}</div>
                                <div className="text-xs text-green-600 mt-1 font-medium">
                                  💎 Fundamental - Transforma clientes em promotores
                                </div>
                              </div>
                              <div className="text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 💼 CONVERSÃO - Venda e Monetização */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-purple-600 mr-2">💼</span>
                        Conversão e Monetização
                      </h3>
                      <div className="space-y-2">
                        {PURPOSES.nutricionista.filter(p => p.category === 'conversao').map((purpose) => (
                          <button
                            key={purpose.id}
                            onClick={() => handlePurposeSelect(purpose.id)}
                            className="w-full p-4 border-2 rounded-xl transition-all text-left hover:border-purple-500 hover:bg-purple-50 active:bg-purple-100"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{purpose.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">{purpose.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{purpose.description}</div>
                                <div className="text-xs text-purple-600 mt-1 font-medium">
                                  {purpose.priority === 'alta' ? '🔥 Alta Prioridade' : '📊 Média Prioridade'}
                                </div>
                              </div>
                              <div className="text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  // Interface padrão para outras profissões
                  <div className="space-y-3">
                    {PURPOSES[selectedProfession as keyof typeof PURPOSES]?.map((purpose) => (
                      <button
                        key={purpose.id}
                        onClick={() => handlePurposeSelect(purpose.id)}
                        className="w-full p-4 border-2 rounded-xl transition-all text-left hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{purpose.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-lg">{purpose.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{purpose.description}</div>
                          </div>
                          <div className="text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Templates ou Personalizado */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              {selectedProfession === 'outro' ? (
                // Interface para "Outro"
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Descreva sua profissão e o que você precisa
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua profissão:
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Coach de Vida, Consultor Financeiro, etc."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O que você quer criar:
                      </label>
                      <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Ex: Quero um quiz de avaliação financeira para capturar leads interessados em investimentos..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </>
              ) : (
                // Interface normal com templates
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Escolha um template ou crie personalizado
                  </h2>
                  
                      {/* Templates Organizados por Propósito */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ferramentas Recomendadas:</h3>
                        
                        {selectedProfession === 'nutricionista' && selectedPurpose ? (
                          // Interface especial para nutricionistas com templates por propósito
                          <div className="space-y-6">
                            {TEMPLATES.nutricionista[selectedPurpose as keyof typeof TEMPLATES.nutricionista]?.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                                  selectedTemplate === template.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                }`}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl">
                                    {template.type === 'quiz' ? '❓' : 
                                     template.type === 'calculator' ? '🧮' : 
                                     template.type === 'checklist' ? '✅' : 
                                     template.type === 'table' ? '📊' : 
                                     template.type === 'spreadsheet' ? '📈' : 
                                     template.type === 'link' ? '🔗' : 
                                     template.type === 'ranking' ? '🏆' : 
                                     template.type === 'coupon' ? '🎫' : 
                                     template.type === 'catalog' ? '📚' : 
                                     template.type === 'ebook' ? '📖' : 
                                     template.type === 'timeline' ? '⏰' : 
                                     template.type === 'diagnostic' ? '🔍' : 
                                     template.type === 'scheduler' ? '📅' : 
                                     template.type === 'planner' ? '📋' : 
                                     template.type === 'simulator' ? '🎮' : '📋'}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{template.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                    <div className="text-xs text-blue-600 font-medium">
                                      {template.category === 'atracao' ? '🎯 Atração e Engajamento' : 
                                       template.category === 'indicacao' ? '👥 Gera Compartilhamento' : 
                                       template.category === 'conversao' ? '💼 Conversão e Monetização' : ''}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          // Interface padrão para outras profissões
                          <div className="grid md:grid-cols-2 gap-4">
                            {TEMPLATES[selectedProfession as keyof typeof TEMPLATES]?.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                  selectedTemplate === template.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="text-2xl">
                                    {template.type === 'quiz' ? '❓' : 
                                     template.type === 'calculator' ? '🧮' : 
                                     template.type === 'form' ? '📝' : 
                                     template.type === 'tracker' ? '📊' : '📋'}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                                    <p className="text-sm text-gray-600">{template.description}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                  {/* Opção Personalizada */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ou crie algo personalizado:</h3>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Descreva exatamente o que você precisa..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                </>
              )}

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ← Voltar
                    </button>
                <button
                  onClick={handleGenerate}
                  className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isGenerating || (!selectedTemplate && !customPrompt.trim())}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Link em 60 Segundos'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Resultado */}
          {step === 4 && generatedLink && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Link Gerado com Sucesso!
                </h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <Link href={generatedLink} target="_blank" className="text-blue-600 hover:underline break-all">
                    {generatedLink}
                  </Link>
                </div>
                <p className="text-gray-600 mb-6">
                  Compartilhe este link para começar a gerar leads.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Criar Outro Link
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 YLADA. Transformando ideias em links inteligentes.</p>
        </div>
      </footer>
    </div>
  )
}