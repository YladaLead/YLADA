'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SuporteNutri() {
  const [categoriaAjuda, setCategoriaAjuda] = useState('todas')
  const [buscaAjuda, setBuscaAjuda] = useState('')

  const artigosAjuda = [
    {
      id: 'como-criar-ferramenta',
      titulo: 'Como criar minha primeira ferramenta?',
      categoria: 'Ferramentas',
      resumo: 'Passo a passo completo para criar sua primeira ferramenta de captação de leads',
      icon: '🛠️',
      visualizacoes: 1250,
      ultimaAtualizacao: '2024-01-10'
    },
    {
      id: 'otimizar-conversao',
      titulo: 'Como otimizar a taxa de conversão das ferramentas?',
      categoria: 'Otimização',
      resumo: 'Dicas práticas para aumentar a conversão de leads em clientes',
      icon: '📈',
      visualizacoes: 890,
      ultimaAtualizacao: '2024-01-08'
    },
    {
      id: 'gerenciar-leads',
      titulo: 'Como gerenciar e organizar meus leads?',
      categoria: 'Leads',
      resumo: 'Estratégias para organizar, segmentar e acompanhar seus leads',
      icon: '👥',
      visualizacoes: 1100,
      ultimaAtualizacao: '2024-01-12'
    },
    {
      id: 'personalizar-ferramentas',
      titulo: 'Como personalizar minhas ferramentas?',
      categoria: 'Ferramentas',
      resumo: 'Aprenda a personalizar cores, textos e elementos das ferramentas',
      icon: '🎨',
      visualizacoes: 750,
      ultimaAtualizacao: '2024-01-05'
    },
    {
      id: 'relatorios-analytics',
      titulo: 'Como interpretar os relatórios e analytics?',
      categoria: 'Relatórios',
      resumo: 'Entenda as métricas e como usar os dados para melhorar resultados',
      icon: '📊',
      visualizacoes: 650,
      ultimaAtualizacao: '2024-01-07'
    },
    {
      id: 'integracao-redes-sociais',
      titulo: 'Como integrar com redes sociais?',
      categoria: 'Integração',
      resumo: 'Conecte suas ferramentas com Instagram, Facebook e WhatsApp',
      icon: '📱',
      visualizacoes: 920,
      ultimaAtualizacao: '2024-01-09'
    },
    {
      id: 'troubleshooting-comum',
      titulo: 'Problemas comuns e soluções',
      categoria: 'Suporte',
      resumo: 'Resolução dos problemas mais frequentes na plataforma',
      icon: '🔧',
      visualizacoes: 1400,
      ultimaAtualizacao: '2024-01-11'
    },
    {
      id: 'melhores-praticas',
      titulo: 'Melhores práticas para nutricionistas',
      categoria: 'Práticas',
      resumo: 'Dicas específicas para nutricionistas obterem melhores resultados',
      icon: '⭐',
      visualizacoes: 980,
      ultimaAtualizacao: '2024-01-06'
    }
  ]

  const categorias = ['todas', 'Ferramentas', 'Leads', 'Relatórios', 'Otimização', 'Integração', 'Suporte', 'Práticas']

  const artigosFiltrados = artigosAjuda.filter(artigo => {
    const categoriaMatch = categoriaAjuda === 'todas' || artigo.categoria === categoriaAjuda
    const buscaMatch = buscaAjuda === '' || 
      artigo.titulo.toLowerCase().includes(buscaAjuda.toLowerCase()) ||
      artigo.resumo.toLowerCase().includes(buscaAjuda.toLowerCase())
    
    return categoriaMatch && buscaMatch
  })

  const contatosSuporte = [
    {
      tipo: 'WhatsApp',
      contato: '(11) 99999-9999',
      horario: 'Seg-Sex: 9h-18h',
      icon: '💬',
      cor: 'green'
    },
    {
      tipo: 'Email',
      contato: 'suporte@ylada.com',
      horario: 'Resposta em até 2h',
      icon: '📧',
      cor: 'blue'
    },
    {
      tipo: 'Chat Online',
      contato: 'Disponível agora',
      horario: '24/7',
      icon: '💻',
      cor: 'purple'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/coach/home">
                <Image
                  src="/images/logo/coach-horizontal.png"
                  alt="Coach by YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Suporte NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/coach/home"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contatos de Suporte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contatosSuporte.map((contato, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${contato.cor}-100 mb-4`}>
                <span className="text-2xl">{contato.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{contato.tipo}</h3>
              <p className="text-gray-600 mb-1">{contato.contato}</p>
              <p className="text-sm text-gray-500">{contato.horario}</p>
            </div>
          ))}
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar ajuda
              </label>
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                value={buscaAjuda}
                onChange={(e) => setBuscaAjuda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoriaAjuda}
                onChange={(e) => setCategoriaAjuda(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas as categorias' : categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Artigos de Ajuda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Central de Ajuda ({artigosFiltrados.length} artigos)
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {artigosFiltrados.map((artigo) => (
              <div key={artigo.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{artigo.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 mb-2">{artigo.titulo}</h3>
                      <span className="text-sm text-gray-500">{artigo.visualizacoes} visualizações</span>
                    </div>
                    <p className="text-gray-600 mb-3">{artigo.resumo}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {artigo.categoria}
                      </span>
                      <span>Atualizado em {artigo.ultimaAtualizacao}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Ler artigo →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Como funciona a captação de leads?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Suas ferramentas capturam automaticamente os dados de contato quando os usuários interagem com elas. 
                Cada interação gera um lead qualificado no seu dashboard.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Posso personalizar minhas ferramentas?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sim! Você pode personalizar cores, textos, perguntas e resultados de todas as suas ferramentas 
                para refletir sua marca e especialidade.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Como acompanhar o desempenho?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Use a seção de Relatórios para ver métricas detalhadas de leads, conversões, 
                taxa de engajamento e ROI de cada ferramenta.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Não encontrou o que procura?</h2>
          <p className="text-gray-700 mb-4">
            Nossa equipe está sempre trabalhando para melhorar a plataforma. 
            Se você tem sugestões ou encontrou algum problema, entre em contato conosco!
          </p>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Enviar Feedback
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Solicitar Recurso
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
