'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NutriRelatorios() {
  const [periodo, setPeriodo] = useState('30dias')
  const [tipoRelatorio, setTipoRelatorio] = useState('geral')

  const dadosRelatorios = {
    conversaoPorFerramenta: [
      { ferramenta: 'Quiz Interativo', leads: 45, conversoes: 12, taxa: 26.7 },
      { ferramenta: 'Calculadora de IMC', leads: 32, conversoes: 8, taxa: 25.0 },
      { ferramenta: 'Post de Curiosidades', leads: 28, conversoes: 6, taxa: 21.4 },
      { ferramenta: 'Template Post Dica', leads: 22, conversoes: 5, taxa: 22.7 },
      { ferramenta: 'Reels Roteirizado', leads: 18, conversoes: 4, taxa: 22.2 }
    ],
    leadsPorDia: [
      { dia: '01/01', leads: 5 },
      { dia: '02/01', leads: 8 },
      { dia: '03/01', leads: 3 },
      { dia: '04/01', leads: 12 },
      { dia: '05/01', leads: 7 },
      { dia: '06/01', leads: 9 },
      { dia: '07/01', leads: 15 },
      { dia: '08/01', leads: 6 },
      { dia: '09/01', leads: 11 },
      { dia: '10/01', leads: 4 },
      { dia: '11/01', leads: 8 },
      { dia: '12/01', leads: 13 },
      { dia: '13/01', leads: 7 },
      { dia: '14/01', leads: 9 },
      { dia: '15/01', leads: 6 }
    ],
    demografia: {
      faixaEtaria: [
        { faixa: '18-25', quantidade: 15, porcentagem: 30 },
        { faixa: '26-35', quantidade: 20, porcentagem: 40 },
        { faixa: '36-45', quantidade: 10, porcentagem: 20 },
        { faixa: '46+', quantidade: 5, porcentagem: 10 }
      ],
      cidades: [
        { cidade: 'São Paulo', quantidade: 18, porcentagem: 36 },
        { cidade: 'Rio de Janeiro', quantidade: 12, porcentagem: 24 },
        { cidade: 'Belo Horizonte', quantidade: 8, porcentagem: 16 },
        { cidade: 'Outras', quantidade: 12, porcentagem: 24 }
      ]
    },
    metricasGerais: {
      totalLeads: 145,
      totalConversoes: 35,
      taxaConversaoGeral: 24.1,
      ticketMedio: 180,
      receitaTotal: 6300,
      crescimentoLeads: 15.2,
      crescimentoConversoes: 8.7
    }
  }

  const periodos = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: '1ano', label: 'Último ano' }
  ]

  const tiposRelatorio = [
    { value: 'geral', label: 'Relatório Geral' },
    { value: 'ferramentas', label: 'Por Ferramentas' },
    { value: 'demografia', label: 'Demografia' },
    { value: 'conversao', label: 'Conversão' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Relatórios NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periodos.map(periodoItem => (
                  <option key={periodoItem.value} value={periodoItem.value}>
                    {periodoItem.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposRelatorio.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{dadosRelatorios.metricasGerais.totalLeads}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +{dadosRelatorios.metricasGerais.crescimentoLeads}% vs período anterior
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversões</p>
                <p className="text-3xl font-bold text-gray-900">{dadosRelatorios.metricasGerais.totalConversoes}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +{dadosRelatorios.metricasGerais.crescimentoConversoes}% vs período anterior
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{dadosRelatorios.metricasGerais.taxaConversaoGeral}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">Acima da média do mercado</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-3xl font-bold text-gray-900">R$ {dadosRelatorios.metricasGerais.receitaTotal.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">Ticket médio: R$ {dadosRelatorios.metricasGerais.ticketMedio}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversão por Ferramenta */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversão por Ferramenta</h2>
            <div className="space-y-4">
              {dadosRelatorios.conversaoPorFerramenta.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.ferramenta}</h3>
                    <p className="text-sm text-gray-600">{item.leads} leads • {item.conversoes} conversões</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{item.taxa}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.taxa}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads por Dia */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Leads por Dia</h2>
            <div className="space-y-3">
              {dadosRelatorios.leadsPorDia.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.dia}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(item.leads / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.leads}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demografia */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Faixa Etária</h2>
            <div className="space-y-4">
              {dadosRelatorios.demografia.faixaEtaria.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.faixa} anos</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${item.porcentagem}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Cidades</h2>
            <div className="space-y-4">
              {dadosRelatorios.demografia.cidades.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.cidade}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${item.porcentagem}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Insights e Recomendações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎯 Oportunidade</h3>
              <p className="text-sm text-blue-800">
                O Quiz Interativo tem a maior taxa de conversão (26.7%). 
                Considere criar variações desta ferramenta para maximizar resultados.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">📈 Crescimento</h3>
              <p className="text-sm text-green-800">
                Seus leads cresceram 15.2% no período. 
                Mantenha o foco nas ferramentas que mais convertem.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">⚠️ Atenção</h3>
              <p className="text-sm text-yellow-800">
                A faixa etária 26-35 representa 40% dos seus leads. 
                Crie conteúdo específico para este público.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">💡 Sugestão</h3>
              <p className="text-sm text-purple-800">
                São Paulo concentra 36% dos leads. 
                Considere estratégias específicas para outras cidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
