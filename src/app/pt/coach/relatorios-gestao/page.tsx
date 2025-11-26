'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

export default function RelatoriosGestaoCoach() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <RelatoriosGestaoCoachContent />
    </ProtectedRoute>
  )
}

type TipoRelatorio = 'evolucao' | 'adesao' | 'consultas' | 'avaliacoes'

function RelatoriosGestaoCoachContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('evolucao')
  const [periodo, setPeriodo] = useState('30dias')
  const [carregando, setCarregando] = useState(false)
  const [dados, setDados] = useState<any>(null)

  // Calcular datas do período
  const calcularPeriodo = () => {
    const hoje = new Date()
    const inicio = new Date()
    
    switch (periodo) {
      case '7dias':
        inicio.setDate(hoje.getDate() - 7)
        break
      case '30dias':
        inicio.setDate(hoje.getDate() - 30)
        break
      case '90dias':
        inicio.setDate(hoje.getDate() - 90)
        break
      case '1ano':
        inicio.setFullYear(hoje.getFullYear() - 1)
        break
      default:
        inicio.setDate(hoje.getDate() - 30)
    }
    
    return { inicio, fim: hoje }
  }

  // Carregar dados do relatório
  useEffect(() => {
    if (!user) return

    const carregarDados = async () => {
      setCarregando(true)
      const { inicio, fim } = calcularPeriodo()

      try {
        switch (tipoRelatorio) {
          case 'evolucao':
            await carregarRelatorioEvolucao(inicio, fim)
            break
          case 'adesao':
            await carregarRelatorioAdesao(inicio, fim)
            break
          case 'consultas':
            await carregarRelatorioConsultas(inicio, fim)
            break
          case 'avaliacoes':
            await carregarRelatorioAvaliacoes(inicio, fim)
            break
        }
      } catch (error: any) {
        console.error('Erro ao carregar relatório:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [user, tipoRelatorio, periodo])

  const carregarRelatorioEvolucao = async (inicio: Date, fim: Date) => {
    // Buscar todos os clientes ativos
    const clientesResponse = await fetch('/api/coach/clientes?status=ativa&limit=100', {
      credentials: 'include'
    })
    const clientesData = await clientesResponse.json()
    const clientes = clientesData.data?.clients || []

    // Buscar evoluções de cada cliente
    const evolucoesPorCliente: any[] = []
    for (const cliente of clientes) {
      const evolResponse = await fetch(
        `/api/coach/clientes/${cliente.id}/evolucao?limit=100&order=asc`,
        { credentials: 'include' }
      )
      const evolData = await evolResponse.json()
      if (evolData.success && evolData.data.evolutions) {
        const evolucoesFiltradas = evolData.data.evolutions.filter((e: any) => {
          const data = new Date(e.measurement_date)
          return data >= inicio && data <= fim
        })
        if (evolucoesFiltradas.length > 0) {
          evolucoesPorCliente.push({
            cliente: cliente.name,
            evolucoes: evolucoesFiltradas
          })
        }
      }
    }

    // Calcular métricas
    const totalEvolucoes = evolucoesPorCliente.reduce((acc, c) => acc + c.evolucoes.length, 0)
    const clientesComEvolucao = evolucoesPorCliente.length
    const mediaEvolucoesPorCliente = clientesComEvolucao > 0 ? totalEvolucoes / clientesComEvolucao : 0

    // Calcular médias de peso e IMC
    let somaPeso = 0
    let somaIMC = 0
    let contador = 0
    evolucoesPorCliente.forEach(c => {
      c.evolucoes.forEach((e: any) => {
        if (e.weight) {
          somaPeso += parseFloat(e.weight)
          contador++
        }
        if (e.bmi) {
          somaIMC += parseFloat(e.bmi)
        }
      })
    })

    setDados({
      totalEvolucoes,
      clientesComEvolucao,
      mediaEvolucoesPorCliente: mediaEvolucoesPorCliente.toFixed(1),
      mediaPeso: contador > 0 ? (somaPeso / contador).toFixed(1) : 0,
      mediaIMC: contador > 0 ? (somaIMC / contador).toFixed(1) : 0,
      evolucoesPorCliente
    })
  }

  const carregarRelatorioAdesao = async (inicio: Date, fim: Date) => {
    // Buscar todos os programas ativos
    const clientesResponse = await fetch('/api/coach/clientes?status=ativa&limit=100', {
      credentials: 'include'
    })
    const clientesData = await clientesResponse.json()
    const clientes = clientesData.data?.clients || []

    const programasComAdesao: any[] = []
    for (const cliente of clientes) {
      const programasResponse = await fetch(
        `/api/coach/clientes/${cliente.id}/programas?status=ativo`,
        { credentials: 'include' }
      )
      const programasData = await programasResponse.json()
      if (programasData.success && programasData.data.programs) {
        programasData.data.programs.forEach((programa: any) => {
          programasComAdesao.push({
            cliente: cliente.name,
            programa: programa.name,
            adesao: programa.adherence_percentage || 0,
            status: programa.status
          })
        })
      }
    }

    const totalProgramas = programasComAdesao.length
    const mediaAdesao = totalProgramas > 0
      ? programasComAdesao.reduce((acc, p) => acc + (p.adesao || 0), 0) / totalProgramas
      : 0

    setDados({
      totalProgramas,
      mediaAdesao: mediaAdesao.toFixed(1),
      programasComAdesao
    })
  }

  const carregarRelatorioConsultas = async (inicio: Date, fim: Date) => {
    const response = await fetch(
      `/api/coach/appointments?start_date=${inicio.toISOString()}&end_date=${fim.toISOString()}&limit=500`,
      { credentials: 'include' }
    )
    const data = await response.json()
    const consultas = data.data?.appointments || []

    // Estatísticas
    const totalConsultas = consultas.length
    const porTipo: Record<string, number> = {}
    const porStatus: Record<string, number> = {}
    let confirmadas = 0
    let realizadas = 0

    consultas.forEach((c: any) => {
      porTipo[c.appointment_type] = (porTipo[c.appointment_type] || 0) + 1
      porStatus[c.status] = (porStatus[c.status] || 0) + 1
      if (c.status === 'confirmado') confirmadas++
      if (c.status === 'concluido') realizadas++
    })

    const taxaComparecimento = totalConsultas > 0 ? (realizadas / totalConsultas) * 100 : 0

    setDados({
      totalConsultas,
      porTipo,
      porStatus,
      confirmadas,
      realizadas,
      taxaComparecimento: taxaComparecimento.toFixed(1),
      consultas: consultas.slice(0, 20) // Últimas 20 para visualização
    })
  }

  const carregarRelatorioAvaliacoes = async (inicio: Date, fim: Date) => {
    // Buscar todos os clientes
    const clientesResponse = await fetch('/api/coach/clientes?limit=100', {
      credentials: 'include'
    })
    const clientesData = await clientesResponse.json()
    const clientes = clientesData.data?.clients || []

    let totalAvaliacoes = 0
    let totalReavaliacoes = 0
    const avaliacoesPorCliente: any[] = []

    for (const cliente of clientes) {
      const avalResponse = await fetch(
        `/api/coach/clientes/${cliente.id}/avaliacoes?limit=100`,
        { credentials: 'include' }
      )
      const avalData = await avalResponse.json()
      if (avalData.success && avalData.data.assessments) {
        const avaliacoesFiltradas = avalData.data.assessments.filter((a: any) => {
          const data = new Date(a.assessment_date || a.created_at)
          return data >= inicio && data <= fim
        })
        
        if (avaliacoesFiltradas.length > 0) {
          const iniciais = avaliacoesFiltradas.filter((a: any) => !a.is_reevaluation).length
          const reavaliacoes = avaliacoesFiltradas.filter((a: any) => a.is_reevaluation).length
          
          totalAvaliacoes += iniciais
          totalReavaliacoes += reavaliacoes
          
          avaliacoesPorCliente.push({
            cliente: cliente.name,
            total: avaliacoesFiltradas.length,
            iniciais,
            reavaliacoes
          })
        }
      }
    }

    setDados({
      totalAvaliacoes,
      totalReavaliacoes,
      totalGeral: totalAvaliacoes + totalReavaliacoes,
      avaliacoesPorCliente
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Relatórios de Gestão</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Relatórios de Gestão</h1>
            <p className="text-gray-600 mt-1">Acompanhe a evolução e performance dos seus clientes</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Relatório
                </label>
                <select
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value as TipoRelatorio)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="evolucao">Evolução Física</option>
                  <option value="adesao">Adesão ao Programa</option>
                  <option value="consultas">Consultas</option>
                  <option value="avaliacoes">Avaliações</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                  <option value="90dias">Últimos 90 dias</option>
                  <option value="1ano">Último ano</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo do Relatório */}
          {carregando ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tipoRelatorio === 'evolucao' && dados && (
                <RelatorioEvolucao dados={dados} />
              )}
              {tipoRelatorio === 'adesao' && dados && (
                <RelatorioAdesao dados={dados} />
              )}
              {tipoRelatorio === 'consultas' && dados && (
                <RelatorioConsultas dados={dados} />
              )}
              {tipoRelatorio === 'avaliacoes' && dados && (
                <RelatorioAvaliacoes dados={dados} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente: Relatório de Evolução Física
function RelatorioEvolucao({ dados }: { dados: any }) {
  return (
    <>
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Registros</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalEvolucoes}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes com Evolução</p>
              <p className="text-3xl font-bold text-gray-900">{dados.clientesComEvolucao}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média de Registros/Cliente</p>
              <p className="text-3xl font-bold text-gray-900">{dados.mediaEvolucoesPorCliente}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peso Médio</p>
              <p className="text-3xl font-bold text-gray-900">{dados.mediaPeso} kg</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução por Cliente */}
      {dados.evolucoesPorCliente && dados.evolucoesPorCliente.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolução por Cliente</h2>
          <div className="space-y-6">
            {dados.evolucoesPorCliente.map((item: any, idx: number) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-gray-900 mb-3">{item.cliente}</h3>
                <div className="space-y-2">
                  {item.evolucoes.map((evol: any, eIdx: number) => {
                    const data = new Date(evol.measurement_date)
                    return (
                      <div key={eIdx} className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 w-24">
                          {data.toLocaleDateString('pt-BR')}
                        </span>
                        {evol.weight && (
                          <span className="text-gray-900">
                            Peso: <strong>{evol.weight} kg</strong>
                          </span>
                        )}
                        {evol.bmi && (
                          <span className="text-gray-900">
                            IMC: <strong>{evol.bmi}</strong>
                          </span>
                        )}
                        {evol.waist_circumference && (
                          <span className="text-gray-900">
                            Cintura: <strong>{evol.waist_circumference} cm</strong>
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Componente: Relatório de Adesão
function RelatorioAdesao({ dados }: { dados: any }) {
  return (
    <>
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Programas Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalProgramas}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Adesão Média</p>
              <p className="text-3xl font-bold text-gray-900">{dados.mediaAdesao}%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Programas */}
      {dados.programasComAdesao && dados.programasComAdesao.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Adesão por Programa</h2>
          <div className="space-y-3">
            {dados.programasComAdesao.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.cliente}</p>
                  <p className="text-sm text-gray-600">{item.programa}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{item.adesao}%</p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        item.adesao >= 80 ? 'bg-green-600' :
                        item.adesao >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${item.adesao}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Componente: Relatório de Consultas
function RelatorioConsultas({ dados }: { dados: any }) {
  return (
    <>
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Consultas</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalConsultas}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmadas</p>
              <p className="text-3xl font-bold text-gray-900">{dados.confirmadas}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Realizadas</p>
              <p className="text-3xl font-bold text-gray-900">{dados.realizadas}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Comparecimento</p>
              <p className="text-3xl font-bold text-gray-900">{dados.taxaComparecimento}%</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consultas por Tipo */}
      {dados.porTipo && Object.keys(dados.porTipo).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultas por Tipo</h2>
          <div className="space-y-3">
            {Object.entries(dados.porTipo).map(([tipo, quantidade]: [string, any]) => (
              <div key={tipo} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">{tipo}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(quantidade / dados.totalConsultas) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 w-12 text-right">{quantidade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consultas por Status */}
      {dados.porStatus && Object.keys(dados.porStatus).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultas por Status</h2>
          <div className="space-y-3">
            {Object.entries(dados.porStatus).map(([status, quantidade]: [string, any]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">{status.replace('_', ' ')}</span>
                <span className="text-lg font-bold text-gray-900">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Componente: Relatório de Avaliações
function RelatorioAvaliacoes({ dados }: { dados: any }) {
  return (
    <>
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalGeral}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avaliações Iniciais</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalAvaliacoes}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reavaliações</p>
              <p className="text-3xl font-bold text-gray-900">{dados.totalReavaliacoes}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avaliações por Cliente */}
      {dados.avaliacoesPorCliente && dados.avaliacoesPorCliente.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliações por Cliente</h2>
          <div className="space-y-3">
            {dados.avaliacoesPorCliente.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.cliente}</p>
                  <p className="text-sm text-gray-600">
                    {item.iniciais} inicial(is) • {item.reavaliacoes} reavaliação(ões)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">Total: {item.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

