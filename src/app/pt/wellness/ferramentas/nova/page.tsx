'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
  slug: string // Ex: 'calc-imc', 'quiz-ganhos', etc
}

interface Configuracao {
  nomeFerramenta: string
  urlPersonalizada: string // Ex: "calculadora-imc"
  urlCompleta: string
  emoji: string
  cores: {
    principal: string
    secundaria: string
  }
  tipoCta: 'whatsapp' | 'url'
  numeroWhatsapp: string
  mensagemWhatsapp: string
  urlExterna: string
  textoBotao: string
}

export default function NovaFerramentaWellness() {
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | 'Calculadora' | 'Quiz' | 'Planilha'>('todas')
  const [busca, setBusca] = useState('')
  const [paisTelefone, setPaisTelefone] = useState('BR')
  const [configuracao, setConfiguracao] = useState<Configuracao>({
    nomeFerramenta: '',
    urlPersonalizada: '',
    urlCompleta: '',
    emoji: '',
    cores: {
      principal: '#10B981',
      secundaria: '#059669'
    },
    tipoCta: 'whatsapp',
    numeroWhatsapp: '',
    mensagemWhatsapp: '',
    urlExterna: '',
    textoBotao: 'Conversar com Especialista'
  })
  const [urlDisponivel, setUrlDisponivel] = useState(true)

  // Nome do usuário logado (simulado - depois virá do sistema)
  const nomeDoUsuario = 'Carlos Oliveira'

  // Códigos de telefone por país
  const codigosTelefone = {
    'BR': { codigo: '+55', bandeira: '🇧🇷', nome: 'Brasil' },
    'US': { codigo: '+1', bandeira: '🇺🇸', nome: 'EUA' },
    'MX': { codigo: '+52', bandeira: '🇲🇽', nome: 'México' },
    'AR': { codigo: '+54', bandeira: '🇦🇷', nome: 'Argentina' },
    'CO': { codigo: '+57', bandeira: '🇨🇴', nome: 'Colômbia' },
    'CL': { codigo: '+56', bandeira: '🇨🇱', nome: 'Chile' },
    'PE': { codigo: '+51', bandeira: '🇵🇪', nome: 'Peru' },
    'PY': { codigo: '+595', bandeira: '🇵🇾', nome: 'Paraguai' },
    'UY': { codigo: '+598', bandeira: '🇺🇾', nome: 'Uruguai' },
    'EC': { codigo: '+593', bandeira: '🇪🇨', nome: 'Equador' },
    'VE': { codigo: '+58', bandeira: '🇻🇪', nome: 'Venezuela' },
    'CR': { codigo: '+506', bandeira: '🇨🇷', nome: 'Costa Rica' },
    'BO': { codigo: '+591', bandeira: '🇧🇴', nome: 'Bolívia' },
    'PT': { codigo: '+351', bandeira: '🇵🇹', nome: 'Portugal' },
    'ES': { codigo: '+34', bandeira: '🇪🇸', nome: 'Espanha' }
  }

  // Todos os 13 templates disponíveis para Wellness
  const templates: Template[] = [
    {
      id: 'calc-imc',
      nome: 'Calculadora IMC',
      categoria: 'Calculadora',
      objetivo: 'Avaliar IMC',
      icon: '📊',
      descricao: 'Calcule o Índice de Massa Corporal',
      slug: 'calc-imc'
    },
    {
      id: 'calc-proteina',
      nome: 'Calculadora de Proteína',
      categoria: 'Calculadora',
      objetivo: 'Calcular proteína diária',
      icon: '💪',
      descricao: 'Necessidades proteicas individuais',
      slug: 'calc-proteina'
    },
    {
      id: 'calc-hidratacao',
      nome: 'Calculadora de Hidratação',
      categoria: 'Calculadora',
      objetivo: 'Calcular água diária',
      icon: '💧',
      descricao: 'Necessidades de água e eletrólitos',
      slug: 'calc-hidratacao'
    },
    {
      id: 'calc-composicao',
      nome: 'Composição Corporal',
      categoria: 'Calculadora',
      objetivo: 'Avaliar composição corporal',
      icon: '🎯',
      descricao: 'Massa muscular, gordura e hidratação',
      slug: 'calc-composicao'
    },
    {
      id: 'quiz-ganhos',
      nome: 'Quiz: Ganhos e Prosperidade',
      categoria: 'Quiz',
      objetivo: 'Avaliar potencial financeiro',
      icon: '💰',
      descricao: 'Descubra se permite ganhar mais',
      slug: 'quiz-ganhos'
    },
    {
      id: 'quiz-potencial',
      nome: 'Quiz: Potencial e Crescimento',
      categoria: 'Quiz',
      objetivo: 'Avaliar potencial',
      icon: '📈',
      descricao: 'Potencial está sendo aproveitado?',
      slug: 'quiz-potencial'
    },
    {
      id: 'quiz-proposito',
      nome: 'Quiz: Propósito e Equilíbrio',
      categoria: 'Quiz',
      objetivo: 'Alinhamento de vida',
      icon: '⭐',
      descricao: 'Dia a dia alinhado com sonhos?',
      slug: 'quiz-proposito'
    },
    {
      id: 'quiz-parasitas',
      nome: 'Quiz: Diagnóstico de Parasitas',
      categoria: 'Quiz',
      objetivo: 'Avaliar saúde intestinal',
      icon: '🧬',
      descricao: 'Parasitas afetando sua saúde?',
      slug: 'quiz-parasitas'
    },
    {
      id: 'quiz-alimentacao',
      nome: 'Quiz: Alimentação Saudável',
      categoria: 'Quiz',
      objetivo: 'Avaliar hábitos alimentares',
      icon: '🥗',
      descricao: 'Hábitos alimentares saudáveis',
      slug: 'quiz-alimentacao'
    },
    {
      id: 'quiz-wellness-profile',
      nome: 'Quiz: Perfil de Bem-Estar',
      categoria: 'Quiz',
      objetivo: 'Perfil completo de bem-estar',
      icon: '💚',
      descricao: 'Saúde física, mental e emocional',
      slug: 'quiz-perfil-bemestar'
    },
    {
      id: 'quiz-avaliacao',
      nome: 'Avaliação Nutricional',
      categoria: 'Quiz',
      objetivo: 'Avaliação nutricional completa',
      icon: '🔬',
      descricao: 'Questionário de hábitos alimentares',
      slug: 'quiz-avaliacao-nutricional'
    },
    {
      id: 'tabela-bemestar',
      nome: 'Tabela Bem-Estar Diário',
      categoria: 'Planilha',
      objetivo: 'Acompanhamento diário',
      icon: '📊',
      descricao: 'Acompanhe métricas diárias',
      slug: 'tabela-bemestar'
    },
    {
      id: 'planejador',
      nome: 'Planejador de Refeições',
      categoria: 'Calculadora',
      objetivo: 'Plano alimentar personalizado',
      icon: '🍽️',
      descricao: 'Cardápio e macronutrientes',
      slug: 'planejador-refeicoes'
    }
  ]

  // Gerar URL amigável
  const gerarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Função para tratar URL automaticamente (remove maiúsculas, espaços, acentos)
  const tratarUrl = (texto: string) => {
    return gerarSlug(texto) // Já faz tudo: minúsculo, remove acentos, espaços vira hífen
  }

  // Sugerir dados ao selecionar template
  useEffect(() => {
    if (templateSelecionado) {
      if (!configuracao.emoji) {
        setConfiguracao(prev => ({ ...prev, emoji: templateSelecionado.icon }))
      }
      if (!configuracao.nomeFerramenta) {
        setConfiguracao(prev => ({ ...prev, nomeFerramenta: templateSelecionado.nome }))
      }
      if (!configuracao.urlPersonalizada) {
        // Sugerir baseado no nome da ferramenta
        const sugestao = tratarUrl(templateSelecionado.nome)
        setConfiguracao(prev => ({ ...prev, urlPersonalizada: sugestao }))
      }
    }
  }, [templateSelecionado])

  // Atualizar URL completa automaticamente
  useEffect(() => {
    if (configuracao.urlPersonalizada && templateSelecionado) {
      const slugTratado = tratarUrl(configuracao.urlPersonalizada)
      const urlNome = tratarUrl(nomeDoUsuario)
      const url = `ylada.app/wellness/${urlNome}/${slugTratado}`
      
      // Verificar se URL está disponível
      const urlDisponivel = !['calculadora-imc', 'calculadora-imc-2', 'calculadora-imc-3'].includes(slugTratado)
      setUrlDisponivel(urlDisponivel)
      
      // Atualizar URL completa
      setConfiguracao(prev => ({ 
        ...prev, 
        urlPersonalizada: slugTratado, // Mantém sempre tratado
        urlCompleta: url
      }))
    }
  }, [configuracao.urlPersonalizada, templateSelecionado])

  // Validar URL disponível (simulação - depois virá da API)
  const validarUrl = (url: string) => {
    // Simulação: nomes já existentes
    const urlsUsadas = ['carlos', 'maria', 'joao-silva']
    const urlExiste = urlsUsadas.includes(url)
    setUrlDisponivel(!urlExiste)
    return !urlExiste
  }

  const criarFerramenta = (template: Template) => {
    setTemplateSelecionado(template)
    // Scroll para configuração
    setTimeout(() => {
      document.getElementById('configuracao')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const salvarFerramenta = () => {
    if (!validarUrl(configuracao.nomeUrl)) {
      alert('Este nome de URL já está em uso. Escolha outro.')
      return
    }
    
    alert('Ferramenta criada com sucesso! Em breve você terá o link completo.')
    console.log('Configuração:', configuracao)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {templateSelecionado ? `Configurar: ${templateSelecionado.nome}` : 'Criar Novo Link'}
              </h1>
            </div>
            <Link
              href="/pt/wellness/ferramentas"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Escolher Template */}
        {!templateSelecionado && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Qual ferramenta você quer usar?
              </h2>
              <p className="text-gray-600 mb-4">
                Escolha uma ferramenta e crie seu link personalizado. É grátis e leva segundos!
              </p>
              
              {/* Busca */}
              <div className="relative">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="🔍 Buscar ferramenta por nome..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
                <span className="absolute left-4 top-3.5 text-2xl">🔍</span>
              </div>
            </div>

            {/* Filtros por Categoria */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setFiltroCategoria('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'todas'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                Todas ({templates.length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Calculadora')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Calculadora'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                🧮 Calculadoras ({templates.filter(t => t.categoria === 'Calculadora').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Quiz'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                🎯 Quizzes ({templates.filter(t => t.categoria === 'Quiz').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Planilha')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Planilha'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                📋 Planilhas ({templates.filter(t => t.categoria === 'Planilha').length})
              </button>
            </div>

            {busca && (
              <p className="text-sm text-gray-600 mb-4">
                {templates.filter(t => {
                  const matchCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria
                  const matchBusca = busca === '' || 
                    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    t.descricao.toLowerCase().includes(busca.toLowerCase())
                  return matchCategoria && matchBusca
                }).length} ferramenta(s) encontrada(s)
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter(t => {
                  const matchCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria
                  const matchBusca = busca === '' || 
                    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    t.descricao.toLowerCase().includes(busca.toLowerCase())
                  return matchCategoria && matchBusca
                })
                .map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all hover:shadow-lg cursor-pointer group"
                  onClick={() => criarFerramenta(template)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {template.nome}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {template.categoria}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.descricao}
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                      <strong>Objetivo:</strong> {template.objetivo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Configurar Ferramenta */}
        {templateSelecionado && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Formulário */}
            <div className="space-y-6">
              <div id="configuracao" className="bg-white rounded-xl border-2 border-green-200 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-4xl">{templateSelecionado.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Criar seu link de {templateSelecionado.nome}</h2>
                    <p className="text-sm text-gray-600">{templateSelecionado.categoria}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Emoji da Ferramenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ícone/Emoji da Ferramenta
                    </label>
                    <input
                      type="text"
                      value={configuracao.emoji}
                      onChange={(e) => setConfiguracao({ ...configuracao, emoji: e.target.value })}
                      placeholder="🎯"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 <strong>Opcional.</strong> Digite seu emoji ou cole do celular/computador (botão direito → colar emoji)
                    </p>
                  </div>

                  {/* Nome da Ferramenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Ferramenta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={configuracao.nomeFerramenta}
                      onChange={(e) => setConfiguracao({ ...configuracao, nomeFerramenta: e.target.value })}
                      placeholder="Ex: Minha Calculadora IMC"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 <strong>O que é?</strong> Nome que aparecerá para o cliente quando usar a ferramenta
                    </p>
                  </div>

                  {/* Cores Personalizadas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cores Personalizadas
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      💡 <strong>O que é?</strong> Cores do botão que o cliente verá. Use tons de verde para Wellness
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Cor Principal</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={configuracao.cores.principal}
                            onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, principal: e.target.value } })}
                            className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={configuracao.cores.principal}
                            onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, principal: e.target.value } })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Cor Secundária</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={configuracao.cores.secundaria}
                            onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, secundaria: e.target.value } })}
                            className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={configuracao.cores.secundaria}
                            onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, secundaria: e.target.value } })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* URL Personalizada */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Projeto (para URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={configuracao.urlPersonalizada}
                      onChange={(e) => setConfiguracao({ ...configuracao, urlPersonalizada: e.target.value })}
                      onBlur={(e) => {
                        const tratado = tratarUrl(e.target.value)
                        setConfiguracao({ ...configuracao, urlPersonalizada: tratado })
                      }}
                      placeholder="Ex: calculadora-imc"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 <strong>O que é?</strong> Nome único para esta ferramenta. Ex: "calculadora-imc", "quiz-ganhos". Será tratado automaticamente.
                    </p>
                    {configuracao.urlCompleta && (
                      <div className={`mt-2 px-3 py-2 rounded ${urlDisponivel ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <p className="text-sm font-medium">
                          {urlDisponivel ? '✓ Disponível' : '✗ Já em uso'} 
                          <span className="ml-2 text-xs">{configuracao.urlCompleta}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Configuração do CTA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depois do resultado, o cliente vai para:
                    </label>
                    <select
                      value={configuracao.tipoCta}
                      onChange={(e) => setConfiguracao({ ...configuracao, tipoCta: e.target.value as 'whatsapp' | 'url' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="whatsapp">WhatsApp (recomendado)</option>
                      <option value="url">URL Externa</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 <strong>O que é?</strong> Para onde o cliente será redirecionado após ver o resultado
                    </p>
                  </div>

                  {/* Configuração WhatsApp */}
                  {configuracao.tipoCta === 'whatsapp' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          País <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={paisTelefone}
                          onChange={(e) => setPaisTelefone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {Object.entries(codigosTelefone).map(([codigo, dados]) => (
                            <option key={codigo} value={codigo}>
                              {dados.bandeira} {dados.nome} ({dados.codigo})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-16 h-12 bg-gray-100 rounded-lg border border-gray-300 font-medium">
                            {codigosTelefone[paisTelefone as keyof typeof codigosTelefone]?.codigo}
                          </div>
                          <input
                            type="text"
                            value={configuracao.numeroWhatsapp}
                            onChange={(e) => setConfiguracao({ ...configuracao, numeroWhatsapp: e.target.value })}
                            placeholder="11999999999"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Apenas DDD + número (sem parênteses ou espaços)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem pré-formatada <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={configuracao.mensagemWhatsapp}
                          onChange={(e) => setConfiguracao({ ...configuracao, mensagemWhatsapp: e.target.value })}
                          placeholder="Olá! Calculei meu IMC através do YLADA e gostaria de saber mais sobre como alcançar meu objetivo. Pode me ajudar?"
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="mt-2 bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-700 font-medium mb-1">💡 Placeholders disponíveis:</p>
                          <p className="text-xs text-blue-600">
                            [RESULTADO] - Resultado obtido na ferramenta<br/>
                            [NOME_CLIENTE] - Nome do cliente (se coletado)<br/>
                            [DATA] - Data/hora do uso
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto do Botão
                        </label>
                        <input
                          type="text"
                          value={configuracao.textoBotao}
                          onChange={(e) => setConfiguracao({ ...configuracao, textoBotao: e.target.value })}
                          placeholder="Conversar com Especialista"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          💡 <strong>O que é?</strong> Texto que aparecerá no botão de ação. Ex: "Conversar comigo", "Saiba mais"
                        </p>
                      </div>
                    </>
                  )}

                  {/* Configuração URL Externa */}
                  {configuracao.tipoCta === 'url' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL de Redirecionamento <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={configuracao.urlExterna}
                          onChange={(e) => setConfiguracao({ ...configuracao, urlExterna: e.target.value })}
                          placeholder="https://seu-site.com/contato"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto do Botão
                        </label>
                        <input
                          type="text"
                          value={configuracao.textoBotao}
                          onChange={(e) => setConfiguracao({ ...configuracao, textoBotao: e.target.value })}
                          placeholder="Saiba Mais"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setTemplateSelecionado(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    ← Escolher Outra Ferramenta
                  </button>
                  <button
                    onClick={salvarFerramenta}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Criar Meu Link
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Preview */}
            <div className="bg-white rounded-xl border-2 border-green-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{configuracao.emoji || templateSelecionado.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {configuracao.nomeFerramenta || templateSelecionado.nome}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Cliente preenche os dados e recebe o resultado...</p>
                  <div className="bg-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600">[Formulário da ferramenta]</p>
                  </div>
                </div>
                <div 
                  className="rounded-lg p-4 text-center"
                  style={{ background: `linear-gradient(135deg, ${configuracao.cores.principal} 0%, ${configuracao.cores.secundaria} 100%)` }}
                >
                  <p className="text-sm text-white mb-2 font-medium">Cliente verá este botão:</p>
                  <button
                    disabled
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-lg w-full hover:bg-gray-50 transition-all"
                  >
                    {configuracao.textoBotao || 'Conversar com Especialista'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  {configuracao.tipoCta === 'whatsapp' 
                    ? '📱 Abrirá WhatsApp automaticamente'
                    : '🌐 Redirecionará para URL externa'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
