'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ChatIA from '../../../../components/ChatIA'

export default function ConsultorDashboard() {
  // Dados do usuário (simulados - depois virão do banco de dados)
  const usuarioConsultor = {
    nome: 'Roberto Santos',
    certificacao: 'Consultor Certificado',
    email: 'roberto@consultor.com',
    especialidade: 'Suplementos e Nutraceuticos',
    experiencia: '6 anos'
  }

  const [stats, setStats] = useState({
    ferramentasAtivas: 0,
    leadsGerados: 0,
    conversoes: 0,
    clientesAtivos: 0
  })

  const [chatAberto, setChatAberto] = useState(false)

  const [ferramentasAtivas, setFerramentasAtivas] = useState([
    {
      id: 'quiz-interativo',
      nome: 'Quiz Interativo',
      categoria: 'Quiz',
      leads: 45,
      conversoes: 12,
      status: 'ativo',
      icon: '🧬'
    },
    {
      id: 'calculadora-imc',
      nome: 'Calculadora de IMC',
      categoria: 'Calculadora',
      leads: 32,
      conversoes: 8,
      status: 'ativo',
      icon: '📊'
    },
    {
      id: 'post-curiosidades',
      nome: 'Post de Curiosidades',
      categoria: 'Conteúdo',
      leads: 28,
      conversoes: 6,
      status: 'ativo',
      icon: '📱'
    }
  ])

  const [leadsRecentes, setLeadsRecentes] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-9999',
      ferramenta: 'Quiz Interativo',
      data: '2024-01-15',
      status: 'novo'
    },
    {
      id: 2,
      nome: 'João Santos',
      email: 'joao@email.com',
      telefone: '(11) 88888-8888',
      ferramenta: 'Calculadora de IMC',
      data: '2024-01-14',
      status: 'contatado'
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 77777-7777',
      ferramenta: 'Post de Curiosidades',
      data: '2024-01-13',
      status: 'convertido'
    }
  ])

  useEffect(() => {
    // Simular carregamento de dados
    setStats({
      ferramentasAtivas: ferramentasAtivas.length,
      leadsGerados: ferramentasAtivas.reduce((acc, f) => acc + f.leads, 0),
      conversoes: ferramentasAtivas.reduce((acc, f) => acc + f.conversoes, 0),
      clientesAtivos: leadsRecentes.filter(l => l.status === 'convertido').length
    })
  }, [ferramentasAtivas, leadsRecentes])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Image
                src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                alt="YLADA"
                width={220}
                height={70}
                className="h-14 sm:h-16 w-auto"
              />
              <div className="h-14 sm:h-16 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dashboard CONSULTOR
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-base sm:text-lg font-medium text-gray-700">{usuarioConsultor.nome}</p>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {usuarioConsultor.certificacao}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/consultor/suporte"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Suporte
              </Link>
              <Link 
                href="/pt/consultor/quiz-personalizado"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🎯 Criar Quiz Personalizado
              </Link>
              <Link 
                href="/pt/consultor/ferramentas/nova"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nova Ferramenta
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ações Rápidas - Movido para cima */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
          
          {/* Quiz Personalizado - Destaque */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Quiz Personalizado</h3>
                  <p className="text-sm text-purple-700">Crie quizzes únicos com perguntas dissertativas e alternativas</p>
                </div>
              </div>
              <Link 
                href="/pt/consultor/quiz-personalizado"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg font-medium"
              >
                Criar Agora
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link 
              href="/pt/consultor/ferramentas/templates"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">🎨</span>
              <div>
                <h3 className="font-medium text-gray-900">Templates Prontos</h3>
                <p className="text-sm text-gray-600">Usar templates testados e otimizados</p>
              </div>
            </Link>
            
            <Link 
              href="/pt/consultor/ferramentas"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">🛠️</span>
              <div>
                <h3 className="font-medium text-gray-900">Minhas Ferramentas</h3>
                <p className="text-sm text-gray-600">Gerenciar ferramentas ativas</p>
              </div>
            </Link>
            
            <Link 
              href="/pt/consultor/leads"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h3 className="font-medium text-gray-900">Meus Leads</h3>
                <p className="text-sm text-gray-600">Ver leads capturados</p>
              </div>
            </Link>
            
            <Link 
              href="/pt/consultor/relatorios"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">Ver analytics detalhados</p>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ferramentas Ativas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.ferramentasAtivas}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+2 esta semana</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.leadsGerados}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+15% vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversões</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversoes}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">26% taxa de conversão</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.clientesAtivos}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+3 novos clientes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ferramentas Ativas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Ferramentas Ativas</h2>
              <Link 
                href="/pt/consultor/ferramentas" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {ferramentasAtivas.map((ferramenta) => (
                <div key={ferramenta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{ferramenta.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{ferramenta.nome}</h3>
                      <p className="text-sm text-gray-600">{ferramenta.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{ferramenta.leads} leads</p>
                    <p className="text-xs text-gray-600">{ferramenta.conversoes} conversões</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads Recentes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Leads Recentes</h2>
              <Link 
                href="/pt/consultor/leads" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {leadsRecentes.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{lead.nome}</h3>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <p className="text-xs text-gray-500">{lead.ferramenta}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contatado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{lead.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Como os Leads são Gerados */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">📈</span>
            Como os Leads são Gerados e Medidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">🔄 Processo de Geração de Leads</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <p><strong>Cliente acessa sua ferramenta</strong> através do link personalizado</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <p><strong>Interage com a ferramenta</strong> (quiz, calculadora, conteúdo)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <p><strong>Fornece dados de contato</strong> para receber o resultado</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <p><strong>Lead é capturado automaticamente</strong> no seu dashboard</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">📊 Métricas de Conversão</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span><strong>Taxa de Conversão:</strong></span>
                  <span className="text-green-600 font-bold">26%</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Tempo Médio de Conversão:</strong></span>
                  <span className="text-blue-600 font-bold">3-7 dias</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Ticket Médio:</strong></span>
                  <span className="text-purple-600 font-bold">R$ 180</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>ROI das Ferramentas:</strong></span>
                  <span className="text-orange-600 font-bold">400%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">💡 Dica Importante:</h4>
            <p className="text-sm text-gray-700">
              Cada ferramenta funciona 24/7 capturando leads qualificados. Quanto mais ferramentas você ativar, 
              mais leads receberá. O sistema mede automaticamente todas as interações e conversões.
            </p>
          </div>
        </div>
      </div>

      {/* Chat com IA */}
      <ChatIA isOpen={chatAberto} onClose={() => setChatAberto(false)} />
      
      {/* Botão Flutuante do Chat */}
      {!chatAberto && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setChatAberto(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-2xl">💬</span>
          </button>
        </div>
      )}
    </div>
  )
}
