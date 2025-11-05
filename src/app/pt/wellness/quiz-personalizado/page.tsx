'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface Pergunta {
  id: string
  tipo: 'multipla' | 'dissertativa' | 'escala' | 'simnao'
  titulo: string
  opcoes?: string[]
  obrigatoria: boolean
  ordem: number
}

interface QuizPersonalizado {
  id: string
  titulo: string
  descricao: string
  emoji: string
  perguntas: Pergunta[]
  cores: {
    primaria: string
    secundaria: string
    texto: string
    fundo: string
  }
  configuracao: {
    tempoLimite?: number
    mostrarProgresso: boolean
    permitirVoltar: boolean
  }
  entrega: {
    tipoEntrega: 'pagina' | 'whatsapp' | 'url'
    ctaPersonalizado: string
    urlRedirecionamento: string
    coletarDados: boolean
    camposColeta: {
      nome: boolean
      email: boolean
      telefone: boolean
      mensagemPersonalizada: string
    }
    customizacao: {
      tamanhoFonte: 'pequeno' | 'medio' | 'grande'
      corFundo: string
      corTexto: string
      corBotao: string
      espacamento: 'compacto' | 'normal' | 'amplo'
      estilo: 'minimalista' | 'moderno' | 'elegante'
    }
    blocosConteudo: Array<{
      id: string
      tipo: 'titulo' | 'subtitulo' | 'texto' | 'paragrafo' | 'destaque'
      conteudo: string
      tamanho: 'pequeno' | 'medio' | 'grande'
    }>
    acaoAposCaptura: 'redirecionar' | 'manter_pagina' | 'ambos'
  }
}

export default function QuizPersonalizadoPage() {
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [perguntaPreviewAtual, setPerguntaPreviewAtual] = useState(0)
  const [paginaPreviewAtual, setPaginaPreviewAtual] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [slugQuiz, setSlugQuiz] = useState<string>('')
  // Função para calcular total de páginas do preview
  const calcularTotalPaginas = () => {
    let total = 1 // Página inicial
    total += quiz.perguntas.length // Páginas das perguntas
    total += 1 // Página de resultado
    return total
  }

  // Função para renderizar a página atual do preview
  const renderizarPaginaPreview = () => {
    const totalPaginas = calcularTotalPaginas()
    
    if (paginaPreviewAtual === 0) {
      // Página inicial
      return (
        <div className="text-center p-6">
          {quiz.emoji && quiz.emoji.trim() !== '' && (
            <div className="text-6xl mb-4">{quiz.emoji}</div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {quiz.titulo || 'Meu Quiz Personalizado'}
          </h1>
          <p className="text-gray-600 mb-6">
            {quiz.descricao || 'Descrição do quiz...'}
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Começar Quiz
          </button>
        </div>
      )
    } else if (paginaPreviewAtual <= quiz.perguntas.length) {
      // Páginas das perguntas
      const perguntaIndex = paginaPreviewAtual - 1
      const pergunta = quiz.perguntas[perguntaIndex]
      
      if (!pergunta) return null
      
      return (
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Pergunta {paginaPreviewAtual} de {quiz.perguntas.length}</span>
              <span className="text-sm text-gray-500">{Math.round((paginaPreviewAtual / quiz.perguntas.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(paginaPreviewAtual / quiz.perguntas.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {pergunta.titulo}
          </h2>
          
          {pergunta.tipo === 'multipla' && pergunta.opcoes && (
            <div className="space-y-3">
              {pergunta.opcoes.map((opcao, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name={`pergunta-${perguntaIndex}`} className="text-blue-600" />
                  <span>{opcao}</span>
                </label>
              ))}
            </div>
          )}
          
          {pergunta.tipo === 'dissertativa' && (
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={4}
              placeholder="Digite sua resposta aqui..."
              disabled
            />
          )}
          
          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              ← Anterior
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Próxima →
            </button>
          </div>
        </div>
      )
    } else {
      // Página de resultado
      return (
        <div className="p-6 text-center">
          <div className="mb-6">
            {quiz.entrega.blocosConteudo.map((bloco) => {
              const tamanhoClasse = bloco.tamanho === 'pequeno' ? 'text-sm' :
                                   bloco.tamanho === 'grande' ? 'text-xl' : 'text-base'
              
              if (bloco.tipo === 'titulo') {
                return (
                  <h1 key={bloco.id} className={`${tamanhoClasse} font-bold mb-4`}>
                    {bloco.conteudo}
                  </h1>
                )
              } else if (bloco.tipo === 'subtitulo') {
                return (
                  <h2 key={bloco.id} className={`${tamanhoClasse} font-semibold mb-3`}>
                    {bloco.conteudo}
                  </h2>
                )
              } else if (bloco.tipo === 'destaque') {
                return (
                  <div key={bloco.id} className={`${tamanhoClasse} font-semibold bg-yellow-100 p-3 rounded-lg mb-3 mx-auto max-w-xs`}>
                    {bloco.conteudo}
                  </div>
                )
              } else {
                return (
                  <p key={bloco.id} className={`${tamanhoClasse} mb-3`}>
                    {bloco.conteudo}
                  </p>
                )
              }
            })}
          </div>
          
          {quiz.entrega.coletarDados && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Receba seu resultado:</h4>
              <div className="space-y-3 max-w-xs mx-auto">
                {quiz.entrega.camposColeta.nome && (
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled
                  />
                )}
                {quiz.entrega.camposColeta.email && (
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled
                  />
                )}
                {quiz.entrega.camposColeta.telefone && (
                  <input
                    type="tel"
                    placeholder="Seu telefone"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled
                  />
                )}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button
              className="py-3 px-6 rounded-lg text-white font-medium"
              style={{ backgroundColor: quiz.entrega.customizacao.corBotao }}
              disabled
            >
              {quiz.entrega.ctaPersonalizado || 
               (quiz.entrega.coletarDados ? 'Enviar Dados' : 
                (quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos') ? 'Continuar' : 'OK')}
            </button>
          </div>
        </div>
      )
    }
  }
  const [quiz, setQuiz] = useState<QuizPersonalizado>({
    id: '',
    titulo: '',
    descricao: '',
    emoji: '🎯',
    perguntas: [],
    cores: {
      primaria: '#3B82F6',
      secundaria: '#1E40AF',
      texto: '#1F2937',
      fundo: '#FFFFFF'
    },
    configuracao: {
      mostrarProgresso: true,
      permitirVoltar: true
    },
    entrega: {
      tipoEntrega: 'pagina',
      ctaPersonalizado: 'Receber Meu Resultado',
      urlRedirecionamento: '',
      coletarDados: true,
      camposColeta: {
        nome: true,
        email: true,
        telefone: false,
        mensagemPersonalizada: 'Obrigado por completar o quiz!'
      },
      customizacao: {
        tamanhoFonte: 'medio',
        corFundo: '#FFFFFF',
        corTexto: '#1F2937',
        corBotao: '#3B82F6',
        espacamento: 'normal',
        estilo: 'moderno'
      },
      blocosConteudo: [
        {
          id: '1',
          tipo: 'titulo',
          conteudo: '🎉 Parabéns!',
          tamanho: 'grande'
        },
        {
          id: '2',
          tipo: 'paragrafo',
          conteudo: 'Você completou o quiz com sucesso!',
          tamanho: 'medio'
        },
        {
          id: '3',
          tipo: 'paragrafo',
          conteudo: 'Seu resultado personalizado será enviado em breve.',
          tamanho: 'medio'
        }
      ],
      acaoAposCaptura: 'ambos'
    }
  })

  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null)
  const [editandoPergunta, setEditandoPergunta] = useState(false)

  const tiposPergunta = [
    {
      tipo: 'multipla',
      nome: 'Múltipla Escolha',
      descricao: 'Pergunta com várias opções de resposta',
      icon: '📋',
      dica: 'Ideal para diagnósticos específicos e categorização'
    },
    {
      tipo: 'dissertativa',
      nome: 'Dissertativa',
      descricao: 'Resposta livre em texto',
      icon: '✍️',
      dica: 'Perfeita para coletar informações detalhadas'
    },
    {
      tipo: 'escala',
      nome: 'Escala',
      descricao: 'Avaliação em escala numérica',
      icon: '📊',
      dica: 'Ótima para medir intensidade ou frequência'
    },
    {
      tipo: 'simnao',
      nome: 'Sim/Não',
      descricao: 'Resposta binária simples',
      icon: '✅',
      dica: 'Ideal para perguntas diretas e rápidas'
    }
  ]

  const adicionarPergunta = (tipo: string) => {
    const novaPergunta: Pergunta = {
      id: `pergunta_${Date.now()}`,
      tipo: tipo as any,
      titulo: '',
      opcoes: tipo === 'multipla' ? ['', ''] : undefined,
      obrigatoria: true,
      ordem: quiz.perguntas.length + 1
    }
    
    setPerguntaAtual(novaPergunta)
    setEditandoPergunta(true)
  }

  const salvarPergunta = () => {
    if (!perguntaAtual) return
    
    const perguntasAtualizadas = [...quiz.perguntas, perguntaAtual]
    setQuiz({ ...quiz, perguntas: perguntasAtualizadas })
    setEditandoPergunta(false)
    setPerguntaAtual(null)
  }

  const removerPergunta = (id: string) => {
    const perguntasAtualizadas = quiz.perguntas.filter(p => p.id !== id)
    setQuiz({ ...quiz, perguntas: perguntasAtualizadas })
  }

  // Função para salvar quiz no banco de dados
  const salvarQuiz = async () => {
    setSalvando(true)
    try {
      // Gerar slug único
      const slugBase = quiz.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      const slug = `quiz-${slugBase}-${Date.now()}`
      
      // Preparar dados para salvar
      const quizData = {
        titulo: quiz.titulo,
        descricao: quiz.descricao,
        emoji: quiz.emoji,
        cores: quiz.cores,
        configuracoes: quiz.configuracao,
        entrega: quiz.entrega,
        slug: slug,
      }

      // Salvar no banco
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quizData,
          perguntas: quiz.perguntas.map(p => ({
            tipo: p.tipo,
            titulo: p.titulo,
            opcoes: p.opcoes || [],
            obrigatoria: p.obrigatoria,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar quiz')
      }

      // Publicar quiz
      await fetch(`/api/quiz`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: data.quiz.id,
          action: 'publish',
        }),
      })

      // Atualizar slug
      setSlugQuiz(slug)
      
      alert('Quiz salvo e publicado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      alert('Erro ao salvar quiz. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="🎯 Construtor de Quiz Personalizado" />
      
      {/* Descrição */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-sm text-gray-600">Crie quizzes únicos para engajar e educar seus clientes</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${etapaAtual === 4 ? '' : 'grid grid-cols-1 lg:grid-cols-2'} gap-8 min-h-screen`}>
          
          {/* Conteúdo Principal */}
          <div className={`${etapaAtual === 4 ? 'w-full' : 'lg:col-span-1'}`}>
            
            {/* Etapa 1: Informações Básicas */}
            {etapaAtual === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas do Quiz</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emoji do Quiz
                    </label>
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Coloque aqui um emoji"
                          className="w-20 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-center text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={quiz.emoji}
                          onChange={(e) => setQuiz({ ...quiz, emoji: e.target.value })}
                          maxLength={2}
                        />
                        <div className="group absolute inset-0 pointer-events-none">
                          <button
                            type="button"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer bg-transparent border-none p-1 hover:bg-gray-100 rounded pointer-events-auto"
                          >
                            ℹ️
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="text-center">
                              <strong>Como adicionar emoji:</strong><br/>
                              • <strong>Desktop:</strong> Clique com botão direito no campo<br/>
                              • <strong>Mobile:</strong> Toque no campo para abrir teclado de emojis<br/>
                              • <strong>Digite:</strong> Qualquer emoji diretamente
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Ex: Quiz de Avaliação Nutricional Completa"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={quiz.titulo}
                          onChange={(e) => setQuiz({ ...quiz, titulo: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Dica: Use um título claro que desperte curiosidade
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      placeholder="Ex: Descubra seu perfil nutricional e receba recomendações personalizadas para uma vida mais saudável."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                      value={quiz.descricao}
                      onChange={(e) => setQuiz({ ...quiz, descricao: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Dica: Explique o benefício que o cliente terá ao completar o quiz
                    </p>
                  </div>

                </div>

                {/* Filosofia YLADA - Colocada antes do botão */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center text-sm">
                    <span className="text-lg mr-2">🎯</span>
                    Filosofia YLADA
                  </h4>
                  
                  <div className="space-y-3 text-sm text-blue-800">
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <p className="text-xs">
                        Seu quiz deve <strong>educar</strong> e <strong>servir</strong> antes de vender. 
                        Quanto mais valor você oferecer, mais engajamento e leads qualificados você terá.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-900 text-xs">📚 Educar</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-900 text-xs">🤝 Servir</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-900 text-xs">🎯 Engajar</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-900 text-xs">💼 Converter</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setEtapaAtual(2)}
                    disabled={!quiz.titulo.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Próximo: Criar Perguntas
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 2: Criar Perguntas */}
            {etapaAtual === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Criar Perguntas</h2>
                  <button
                    onClick={() => setEtapaAtual(3)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Próximo: Personalizar
                  </button>
                </div>

                {/* Tipos de Pergunta */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Escolha o tipo de pergunta:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiposPergunta.map((tipo) => (
                      <button
                        key={tipo.tipo}
                        onClick={() => adicionarPergunta(tipo.tipo)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{tipo.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{tipo.nome}</h4>
                            <p className="text-sm text-gray-600">{tipo.descricao}</p>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600">{tipo.dica}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Perguntas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Perguntas Criadas ({quiz.perguntas.length})</h3>
                  
                  {quiz.perguntas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma pergunta criada ainda.</p>
                      <p className="text-sm">Clique em um tipo acima para começar!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quiz.perguntas.map((pergunta, index) => (
                        <div key={pergunta.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {tiposPergunta.find(t => t.tipo === pergunta.tipo)?.nome}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {pergunta.titulo || 'Pergunta sem título'}
                              </h4>
                              {pergunta.opcoes && (
                                <div className="text-sm text-gray-600">
                                  {pergunta.opcoes.length} opções
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removerPergunta(pergunta.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Remover pergunta"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal de Edição de Pergunta */}
            {editandoPergunta && perguntaAtual && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Criar Pergunta - {tiposPergunta.find(t => t.tipo === perguntaAtual.tipo)?.nome}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título da Pergunta
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Qual é sua idade?"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={perguntaAtual.titulo}
                        onChange={(e) => setPerguntaAtual({ ...perguntaAtual, titulo: e.target.value })}
                      />
                    </div>

                    {perguntaAtual.tipo === 'multipla' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opções de Resposta
                        </label>
                        <div className="space-y-2">
                          {perguntaAtual.opcoes?.map((opcao, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                              <input
                                type="text"
                                placeholder={`Opção ${index + 1}`}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={opcao}
                                onChange={(e) => {
                                  const novasOpcoes = [...(perguntaAtual.opcoes || [])]
                                  novasOpcoes[index] = e.target.value
                                  setPerguntaAtual({ ...perguntaAtual, opcoes: novasOpcoes })
                                }}
                              />
                              {perguntaAtual.opcoes && perguntaAtual.opcoes.length > 3 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novasOpcoes = perguntaAtual.opcoes?.filter((_, i) => i !== index) || []
                                    setPerguntaAtual({ ...perguntaAtual, opcoes: novasOpcoes })
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                  title="Remover opção"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            const novasOpcoes = [...(perguntaAtual.opcoes || []), '']
                            setPerguntaAtual({ ...perguntaAtual, opcoes: novasOpcoes })
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Adicionar opção
                        </button>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="obrigatoria"
                        checked={perguntaAtual.obrigatoria}
                        onChange={(e) => setPerguntaAtual({ ...perguntaAtual, obrigatoria: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="obrigatoria" className="text-sm text-gray-700">
                        Pergunta obrigatória
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditandoPergunta(false)
                        setPerguntaAtual(null)
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={salvarPergunta}
                      disabled={!perguntaAtual.titulo.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Salvar Pergunta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 3: Personalizar Visual */}
            {etapaAtual === 3 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalizar Visual</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Primária
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={quiz.cores.primaria}
                        onChange={(e) => setQuiz({
                          ...quiz,
                          cores: { ...quiz.cores, primaria: e.target.value }
                        })}
                        className="w-12 h-10 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={quiz.cores.primaria}
                        onChange={(e) => setQuiz({
                          ...quiz,
                          cores: { ...quiz.cores, primaria: e.target.value }
                        })}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Secundária
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={quiz.cores.secundaria}
                        onChange={(e) => setQuiz({
                          ...quiz,
                          cores: { ...quiz.cores, secundaria: e.target.value }
                        })}
                        className="w-12 h-10 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={quiz.cores.secundaria}
                        onChange={(e) => setQuiz({
                          ...quiz,
                          cores: { ...quiz.cores, secundaria: e.target.value }
                        })}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Preview das Cores</h4>
                    <div className="space-y-2">
                      <div 
                        className="p-3 rounded-lg text-white text-center"
                        style={{ backgroundColor: quiz.cores.primaria }}
                      >
                        Botão Primário
                      </div>
                      <div 
                        className="p-3 rounded-lg text-white text-center"
                        style={{ backgroundColor: quiz.cores.secundaria }}
                      >
                        Botão Secundário
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setEtapaAtual(4)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Próximo: Configurar Entrega
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 4: Editor de Conteúdo da Página de Resultado */}
            {etapaAtual === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Editor de Conteúdo */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">📝 Editor de Conteúdo da Página de Resultado</h2>
                  
                  <div className="space-y-6">
                    {/* Botões para Adicionar Blocos */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Bloco de Conteúdo</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const novoBloco = {
                              id: Date.now().toString(),
                              tipo: 'titulo' as const,
                              conteudo: 'Novo Título',
                              tamanho: 'grande' as const
                            }
                            setQuiz({ 
                              ...quiz, 
                              entrega: { 
                                ...quiz.entrega, 
                                blocosConteudo: [...quiz.entrega.blocosConteudo, novoBloco] 
                              } 
                            })
                          }}
                          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                        >
                          📝 Título Grande
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const novoBloco = {
                              id: Date.now().toString(),
                              tipo: 'subtitulo' as const,
                              conteudo: 'Novo Subtítulo',
                              tamanho: 'medio' as const
                            }
                            setQuiz({ 
                              ...quiz, 
                              entrega: { 
                                ...quiz.entrega, 
                                blocosConteudo: [...quiz.entrega.blocosConteudo, novoBloco] 
                              } 
                            })
                          }}
                          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                        >
                          📄 Subtítulo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const novoBloco = {
                              id: Date.now().toString(),
                              tipo: 'paragrafo' as const,
                              conteudo: 'Novo parágrafo de texto...',
                              tamanho: 'medio' as const
                            }
                            setQuiz({ 
                              ...quiz, 
                              entrega: { 
                                ...quiz.entrega, 
                                blocosConteudo: [...quiz.entrega.blocosConteudo, novoBloco] 
                              } 
                            })
                          }}
                          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                        >
                          📝 Parágrafo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const novoBloco = {
                              id: Date.now().toString(),
                              tipo: 'destaque' as const,
                              conteudo: 'Texto em destaque',
                              tamanho: 'grande' as const
                            }
                            setQuiz({ 
                              ...quiz, 
                              entrega: { 
                                ...quiz.entrega, 
                                blocosConteudo: [...quiz.entrega.blocosConteudo, novoBloco] 
                              } 
                            })
                          }}
                          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                        >
                          ⭐ Destaque
                        </button>
                      </div>
                    </div>

                    {/* Lista de Blocos */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Blocos de Conteúdo ({quiz.entrega.blocosConteudo.length})</h3>
                      
                      {quiz.entrega.blocosConteudo.map((bloco, index) => (
                        <div key={bloco.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {bloco.tipo === 'titulo' ? 'Título' : 
                                 bloco.tipo === 'subtitulo' ? 'Subtítulo' :
                                 bloco.tipo === 'paragrafo' ? 'Parágrafo' : 'Destaque'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {bloco.tamanho === 'pequeno' ? 'Pequeno' :
                                 bloco.tamanho === 'medio' ? 'Médio' : 'Grande'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const novosBlocos = quiz.entrega.blocosConteudo.filter(b => b.id !== bloco.id)
                                setQuiz({ 
                                  ...quiz, 
                                  entrega: { 
                                    ...quiz.entrega, 
                                    blocosConteudo: novosBlocos 
                                  } 
                                })
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={bloco.conteudo}
                              onChange={(e) => {
                                const novosBlocos = quiz.entrega.blocosConteudo.map(b => 
                                  b.id === bloco.id ? { ...b, conteudo: e.target.value } : b
                                )
                                setQuiz({ 
                                  ...quiz, 
                                  entrega: { 
                                    ...quiz.entrega, 
                                    blocosConteudo: novosBlocos 
                                  } 
                                })
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Digite o conteúdo do ${bloco.tipo}...`}
                            />
                            
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-gray-600">Tamanho:</label>
                              {['pequeno', 'medio', 'grande'].map((tamanho) => (
                                <label key={tamanho} className="flex items-center space-x-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`tamanho-${bloco.id}`}
                                    value={tamanho}
                                    checked={bloco.tamanho === tamanho}
                                    onChange={(e) => {
                                      const novosBlocos = quiz.entrega.blocosConteudo.map(b => 
                                        b.id === bloco.id ? { ...b, tamanho: e.target.value as any } : b
                                      )
                                      setQuiz({ 
                                        ...quiz, 
                                        entrega: { 
                                          ...quiz.entrega, 
                                          blocosConteudo: novosBlocos 
                                        } 
                                      })
                                    }}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs">{tamanho}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {quiz.entrega.blocosConteudo.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Nenhum bloco criado ainda.</p>
                          <p className="text-sm">Clique em um tipo acima para começar!</p>
                        </div>
                      )}
                    </div>

                 {/* Configurações de Coleta de Dados */}
                 <div className="bg-blue-50 rounded-lg p-4">
                   <h3 className="text-sm font-medium text-blue-900 mb-3">📊 Configurações de Coleta de Dados</h3>
                   
                   <div className="space-y-4">
                     {/* Coletar Dados */}
                     <div>
                       <label className="flex items-center space-x-2">
                         <input
                           type="checkbox"
                           checked={quiz.entrega.coletarDados}
                           onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, coletarDados: e.target.checked } })}
                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                         />
                         <span className="text-sm text-blue-800">Coletar dados do cliente na página de resultado</span>
                       </label>
                       
                       {quiz.entrega.coletarDados && (
                         <div className="ml-6 mt-3 space-y-2">
                           <h4 className="text-xs font-medium text-blue-700">Campos para coletar:</h4>
                           <div className="space-y-2">
                             <div className="flex items-center space-x-2">
                               <input
                                 type="checkbox"
                                 checked={quiz.entrega.camposColeta.nome}
                                 onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, camposColeta: { ...quiz.entrega.camposColeta, nome: e.target.checked } } })}
                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                               />
                               <span className="text-sm text-blue-700">Nome</span>
                             </div>
                             <div className="flex items-center space-x-2">
                               <input
                                 type="checkbox"
                                 checked={quiz.entrega.camposColeta.email}
                                 onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, camposColeta: { ...quiz.entrega.camposColeta, email: e.target.checked } } })}
                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                               />
                               <span className="text-sm text-blue-700">Email</span>
                             </div>
                             <div className="flex items-center space-x-2">
                               <input
                                 type="checkbox"
                                 checked={quiz.entrega.camposColeta.telefone}
                                 onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, camposColeta: { ...quiz.entrega.camposColeta, telefone: e.target.checked } } })}
                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                               />
                               <span className="text-sm text-blue-700">Telefone</span>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>

                     {/* Redirecionamento */}
                     <div>
                       <label className="flex items-center space-x-2">
                         <input
                           type="checkbox"
                           checked={quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos'}
                           onChange={(e) => {
                             const novoValor = e.target.checked ? 
                               (quiz.entrega.coletarDados ? 'ambos' : 'redirecionar') : 
                               (quiz.entrega.coletarDados ? 'manter_pagina' : 'manter_pagina')
                             setQuiz({ ...quiz, entrega: { ...quiz.entrega, acaoAposCaptura: novoValor as any } })
                           }}
                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                         />
                         <span className="text-sm text-blue-800">Redirecionar para WhatsApp ou URL</span>
                       </label>
                       
                       {(quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos') && (
                         <div className="ml-6 mt-3">
                           <input
                             type="url"
                             placeholder="https://wa.me/5511999999999 ou https://seusite.com/contato"
                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             value={quiz.entrega.urlRedirecionamento}
                             onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, urlRedirecionamento: e.target.value } })}
                           />
                         </div>
                       )}
                       
                       <p className="text-xs text-blue-600 mt-2 ml-6">
                         💡 Dica: Se ativado junto com "Coletar dados", captura os dados e depois redireciona
                       </p>
                     </div>
                   </div>
                 </div>

                    {/* Texto do Botão */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Botão
                      </label>
                      <input
                        type="text"
                        placeholder={quiz.entrega.coletarDados ? 'Ex: Enviar Dados' : 
                                     quiz.entrega.acaoAposCaptura === 'redirecionar' ? 'Ex: Continuar' :
                                     quiz.entrega.acaoAposCaptura === 'ambos' ? 'Ex: Ver Resultado' : 'Ex: OK'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={quiz.entrega.ctaPersonalizado}
                        onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, ctaPersonalizado: e.target.value } })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Dica: Use textos que incentivem a ação (Ex: "Ver Meu Resultado", "Continuar", "Próximo Passo")
                      </p>
                    </div>

                    {/* URL de Redirecionamento */}
                    {(quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL de Redirecionamento
                        </label>
                        <input
                          type="url"
                          placeholder="https://wa.me/5511999999999 ou https://seusite.com/contato"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={quiz.entrega.urlRedirecionamento}
                          onChange={(e) => setQuiz({ ...quiz, entrega: { ...quiz.entrega, urlRedirecionamento: e.target.value } })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setEtapaAtual(3)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ← Voltar
                    </button>
                 <button
                   onClick={() => setEtapaAtual(5)}
                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                 >
                   🚀 Finalizar Quiz
                 </button>
                  </div>
                </div>

                {/* Preview da Página de Resultado */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Preview da Página de Resultado</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div 
                      className="bg-white rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto"
                      style={{ 
                        backgroundColor: quiz.entrega.customizacao.corFundo,
                        color: quiz.entrega.customizacao.corTexto,
                        fontSize: quiz.entrega.customizacao.tamanhoFonte === 'pequeno' ? '14px' : 
                                 quiz.entrega.customizacao.tamanhoFonte === 'grande' ? '18px' : '16px',
                        padding: quiz.entrega.customizacao.espacamento === 'compacto' ? '16px' :
                                quiz.entrega.customizacao.espacamento === 'amplo' ? '32px' : '24px'
                      }}
                    >
                   <div className="p-4">
                     {/* Conteúdo da Página de Resultado */}
                     <div className="mb-6 text-center">
                       {quiz.entrega.blocosConteudo.map((bloco) => {
                         const tamanhoClasse = bloco.tamanho === 'pequeno' ? 'text-sm' :
                                              bloco.tamanho === 'grande' ? 'text-xl' : 'text-base'
                         
                         if (bloco.tipo === 'titulo') {
                           return (
                             <h1 key={bloco.id} className={`${tamanhoClasse} font-bold mb-4`}>
                               {bloco.conteudo}
                             </h1>
                           )
                         } else if (bloco.tipo === 'subtitulo') {
                           return (
                             <h2 key={bloco.id} className={`${tamanhoClasse} font-semibold mb-3`}>
                               {bloco.conteudo}
                             </h2>
                           )
                         } else if (bloco.tipo === 'destaque') {
                           return (
                             <div key={bloco.id} className={`${tamanhoClasse} font-semibold bg-yellow-100 p-3 rounded-lg mb-3 mx-auto max-w-xs`}>
                               {bloco.conteudo}
                             </div>
                           )
                         } else {
                           return (
                             <p key={bloco.id} className={`${tamanhoClasse} mb-3`}>
                               {bloco.conteudo}
                             </p>
                           )
                         }
                       })}
                     </div>
                        
                     {/* Formulário de Captura (se ativado) */}
                     {quiz.entrega.coletarDados && (
                       <div className="mb-6 text-center">
                         <h4 className="font-semibold mb-3">Receba seu resultado:</h4>
                         <div className="space-y-3 max-w-xs mx-auto">
                           {quiz.entrega.camposColeta.nome && (
                             <input
                               type="text"
                               placeholder="Seu nome"
                               className="w-full p-2 border border-gray-300 rounded"
                               disabled
                             />
                           )}
                           {quiz.entrega.camposColeta.email && (
                             <input
                               type="email"
                               placeholder="Seu email"
                               className="w-full p-2 border border-gray-300 rounded"
                               disabled
                             />
                           )}
                           {quiz.entrega.camposColeta.telefone && (
                             <input
                               type="tel"
                               placeholder="Seu telefone"
                               className="w-full p-2 border border-gray-300 rounded"
                               disabled
                             />
                           )}
                         </div>
                       </div>
                     )}
                     
                     {/* Botão Principal */}
                     <div className="text-center">
                       <button
                         className="py-3 px-6 rounded-lg text-white font-medium"
                         style={{ backgroundColor: quiz.entrega.customizacao.corBotao }}
                         disabled
                       >
                         {quiz.entrega.ctaPersonalizado || 
                          (quiz.entrega.coletarDados ? 'Enviar Dados' : 
                           (quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos') ? 'Continuar' : 'OK')}
                       </button>
                     </div>
                        
                        {/* Mensagem de Agradecimento */}
                        {quiz.entrega.coletarDados && (
                          <p className="text-sm text-gray-500 mt-3 text-center">
                            {quiz.entrega.camposColeta.mensagemPersonalizada}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
               {/* Informações Adicionais do Preview */}
               <div className="mt-6 grid grid-cols-2 gap-4">
                 {/* Configurações Ativas */}
                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                   <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                     <span className="text-lg mr-2">⚙️</span> Configurações Ativas
                   </h4>
                   <div className="text-sm text-blue-800 space-y-2">
                     <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                       <span>Captura de dados: {quiz.entrega.coletarDados ? 'Ativada' : 'Desativada'}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                       <span>Redirecionamento: {(quiz.entrega.acaoAposCaptura === 'redirecionar' || quiz.entrega.acaoAposCaptura === 'ambos') ? 'Ativado' : 'Desativado'}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                       <span>Blocos: {quiz.entrega.blocosConteudo.length}</span>
                     </div>
                   </div>
                 </div>

                 {/* Link do Quiz */}
                 <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                   <h4 className="font-medium text-green-900 mb-3 flex items-center">
                     <span className="text-lg mr-2">🔗</span> Link do Quiz
                   </h4>
                   <div className="text-sm text-green-800">
                     <p className="mb-2">Seu quiz estará disponível em:</p>
                     <code className="text-xs bg-white p-2 rounded border block break-all">
                       ylada.app/pt/wellness/seu-nome/quiz-personalizado
                     </code>
                     <p className="text-xs text-green-600 mt-2">
                       💡 Este link será gerado após finalizar
                     </p>
                   </div>
                 </div>
               </div>
                </div>
              </div>
            )}

         {/* Etapa 5: Quiz Finalizado */}
         {etapaAtual === 5 && (
           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
             <h2 className="text-xl font-semibold text-gray-900 mb-6">🎉 Quiz Finalizado!</h2>
                
               <div className="text-center py-8">
                 <div className="text-6xl mb-4">🎉</div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Criado com Sucesso!</h3>
                 <p className="text-gray-600 mb-6">
                   Seu quiz personalizado está pronto para gerar leads. 
                   Aqui está o link que você pode compartilhar:
                 </p>
                 
                <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-2">Link do seu quiz:</p>
                  <code className="text-blue-600 font-mono text-sm break-all">
                    {slugQuiz ? `ylada.app/pt/quiz/${slugQuiz}` : 'Gerando link...'}
                  </code>
                </div>
                 
                 <div className="flex justify-center space-x-4">
                   <button
                     onClick={() => setEtapaAtual(4)}
                     className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                   >
                     ← Voltar para Editar
                   </button>
                  <button
                    onClick={async () => {
                      if (slugQuiz) {
                        const linkText = `ylada.app/pt/quiz/${slugQuiz}`
                        navigator.clipboard.writeText(linkText).then(() => {
                          alert('Link copiado para a área de transferência!')
                        }).catch(() => {
                          // Fallback para navegadores mais antigos
                          const textArea = document.createElement('textarea')
                          textArea.value = linkText
                          document.body.appendChild(textArea)
                          textArea.select()
                          document.execCommand('copy')
                          document.body.removeChild(textArea)
                          alert('Link copiado para a área de transferência!')
                        })
                      } else {
                        // Salvar quiz primeiro
                        await salvarQuiz()
                      }
                    }}
                    disabled={salvando}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {salvando ? '⏳ Salvando...' : slugQuiz ? '📋 Copiar Link' : '💾 Salvar e Publicar Quiz'}
                  </button>
                 </div>
               </div>
              </div>
            )}
          </div>

          {/* Preview Completo e Navegável - Sempre Visível */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">👁️ Preview Completo do Quiz</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaginaPreviewAtual(Math.max(0, paginaPreviewAtual - 1))}
                    disabled={paginaPreviewAtual === 0}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-500 px-2">
                    {paginaPreviewAtual + 1} de {calcularTotalPaginas()}
                  </span>
                  <button
                    onClick={() => setPaginaPreviewAtual(Math.min(calcularTotalPaginas() - 1, paginaPreviewAtual + 1))}
                    disabled={paginaPreviewAtual === calcularTotalPaginas() - 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima →
                  </button>
                </div>
              </div>
              
              {/* Indicador de páginas */}
              <div className="flex justify-center space-x-1 mb-4">
                {Array.from({ length: calcularTotalPaginas() }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPaginaPreviewAtual(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === paginaPreviewAtual ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* Preview da página atual */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto"
                  style={{ 
                    backgroundColor: quiz.entrega.customizacao.corFundo,
                    color: quiz.entrega.customizacao.corTexto,
                    fontSize: quiz.entrega.customizacao.tamanhoFonte === 'pequeno' ? '14px' : 
                             quiz.entrega.customizacao.tamanhoFonte === 'grande' ? '18px' : '16px',
                    padding: quiz.entrega.customizacao.espacamento === 'compacto' ? '16px' :
                           quiz.entrega.customizacao.espacamento === 'amplo' ? '32px' : '24px'
                  }}
                >
                  {renderizarPaginaPreview()}
                </div>
              </div>
              
              {/* Informações da página atual */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {paginaPreviewAtual === 0 && '📱 Página inicial do quiz'}
                  {paginaPreviewAtual > 0 && paginaPreviewAtual <= quiz.perguntas.length && 
                   `❓ Pergunta ${paginaPreviewAtual}: ${quiz.perguntas[paginaPreviewAtual - 1]?.titulo.substring(0, 50)}...`}
                  {paginaPreviewAtual > quiz.perguntas.length && '🎉 Página de resultado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}