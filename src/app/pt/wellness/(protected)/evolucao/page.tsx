'use client'

import { useState, useEffect } from 'react'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface PVMensal {
  mes_ano: string
  pv_total: number
  pv_kits: number
  pv_produtos_fechados: number
  meta_pv?: number
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function EvolucaoWellness() {
  return <EvolucaoWellnessContent />
}

function EvolucaoWellnessContent() {
  const [pvMensal, setPvMensal] = useState<PVMensal | null>(null)
  const [historico, setHistorico] = useState<PVMensal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarPV()
  }, [])

  const carregarPV = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wellness/pv/mensal', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setPvMensal(data.pv_mensal)
        setHistorico(data.historico || [])
      }
    } catch (error) {
      console.error('Erro ao carregar PV:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarMes = (mesAno: string) => {
    const [ano, mes] = mesAno.split('-')
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]
    return `${meses[parseInt(mes) - 1]}/${ano}`
  }

  const calcularProgresso = () => {
    if (!pvMensal || !pvMensal.meta_pv) return 0
    return Math.min((pvMensal.pv_total / pvMensal.meta_pv) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Evolução" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Carregando evolução...</p>
          </div>
        </div>
      </div>
    )
  }

  const progresso = calcularProgresso()

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Minha Evolução" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">PV Total (Mês Atual)</p>
            <p className="text-3xl font-bold text-green-600">
              {pvMensal?.pv_total.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {pvMensal?.mes_ano ? formatarMes(pvMensal.mes_ano) : 'Carregando...'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">PV de Kits</p>
            <p className="text-3xl font-bold text-blue-600">
              {pvMensal?.pv_kits.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Bebidas funcionais</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">PV Produtos Fechados</p>
            <p className="text-3xl font-bold text-purple-600">
              {pvMensal?.pv_produtos_fechados.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Shake, Fiber, etc.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Meta do Mês</p>
            <p className="text-3xl font-bold text-gray-900">
              {pvMensal?.meta_pv?.toFixed(2) || '-'}
            </p>
            {pvMensal?.meta_pv && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${progresso}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progresso.toFixed(1)}% da meta</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Evolução dos Últimos 6 Meses</h2>
          </div>
          <div className="p-6">
            {historico.length > 0 ? (
              <div className="space-y-4">
                {historico.map((item) => {
                  const maxPV = Math.max(...historico.map(h => h.pv_total), 1)
                  const porcentagem = (item.pv_total / maxPV) * 100
                  
                  return (
                    <div key={item.mes_ano} className="flex items-center space-x-4">
                      <div className="w-20 text-sm text-gray-600 font-medium">
                        {formatarMes(item.mes_ano)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.pv_total.toFixed(2)} PV
                          </span>
                          {item.meta_pv && (
                            <span className="text-xs text-gray-500">
                              Meta: {item.meta_pv.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${porcentagem}%` }}
                          >
                            {porcentagem > 10 && (
                              <span className="text-xs text-white font-medium">
                                {item.pv_total.toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Ainda não há histórico de PV</p>
                <p className="text-sm text-gray-500 mt-2">
                  Registre compras de clientes para ver sua evolução aqui
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Passos</h3>
          <div className="space-y-3">
            {!pvMensal?.meta_pv && (
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium text-gray-900">Defina sua meta mensal</p>
                  <p className="text-sm text-gray-600">Configure uma meta de PV para acompanhar seu progresso</p>
                </div>
              </div>
            )}
            {pvMensal && pvMensal.pv_total < 500 && (
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-medium text-gray-900">Alcance 500 PV</p>
                  <p className="text-sm text-gray-600">
                    Você está a {((500 - pvMensal.pv_total) / pvMensal.pv_total * 100).toFixed(0)}% de alcançar 500 PV
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-gray-900">Peça ajuda ao NOEL</p>
                <p className="text-sm text-gray-600">
                  O NOEL pode te ajudar com estratégias para aumentar seu PV
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}





