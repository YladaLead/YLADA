'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import { useAuth } from '@/hooks/useAuth'
import RotinaMinimaChecklist from '@/components/nutri/RotinaMinimaChecklist'

export default function PainelDiarioPage() {
  const { user } = useAuth()
  const [carregando, setCarregando] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const carregarStats = async () => {
      try {
        // Buscar progresso da jornada e indicadores do dia em paralelo
        const [jornadaRes, indicadoresRes] = await Promise.all([
          fetch('/api/nutri/metodo/jornada', {
            credentials: 'include'
          }),
          fetch('/api/nutri/painel/stats', {
            credentials: 'include'
          })
        ])
        
        if (jornadaRes.ok) {
          const jornadaData = await jornadaRes.json()
          setStats(jornadaData.data?.stats)
        }

        if (indicadoresRes.ok) {
          const indicadoresData = await indicadoresRes.json()
          if (indicadoresData.success && indicadoresData.data) {
            setStats((prev: any) => ({
              ...prev,
              leadsHoje: indicadoresData.data.leadsHoje,
              conversasAtivas: indicadoresData.data.conversasAtivas,
              conversasEsteMes: indicadoresData.data.conversasEsteMes,
              atendimentosAgendados: indicadoresData.data.atendimentosAgendados
            }))
          }
        }
      } catch (error) {
        console.error('Erro ao carregar stats:', error)
      } finally {
        setCarregando(false)
      }
    }

    if (user) {
      carregarStats()
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para Jornada
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Painel Diário — Sistema de Conversas Ativas
          </h1>
          <p className="text-gray-600">
            Acompanhe conversas do mês, meta semanal e indicadores essenciais
          </p>
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando painel...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Progresso da Jornada */}
            {stats && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">🎯 Progresso da Jornada</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Dias Concluídos</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {stats.completed_days} / {stats.total_days}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stats.progress_percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.progress_percentage}% completo
                    </p>
                  </div>
                  {stats.current_day && (
                    <p className="text-sm text-blue-600 font-medium">
                      Próximo: Dia {stats.current_day}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ações Pendentes */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">📋 Ações Pendentes</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Revisar leads quentes
                </p>
                <p className="text-sm text-gray-600">
                  Enviar acompanhamento
                </p>
                <p className="text-sm text-gray-600">
                  Atualizar rotina mínima
                </p>
              </div>
            </div>

            {/* Indicadores Essenciais — Sistema de Conversas Ativas */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">⚡ Indicadores Essenciais</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversas este mês</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats?.conversasEsteMes ?? stats?.conversasAtivas ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Leads Hoje</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats?.leadsHoje ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversas Ativas</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats?.conversasAtivas ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atendimentos Agendados</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {stats?.atendimentosAgendados ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rotina Mínima */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Rotina Mínima Diária</h2>
          <RotinaMinimaChecklist />
        </div>

        {/* Navegação */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <Link
              href="/pt/nutri/metodo/jornada"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              ← Voltar para Jornada
            </Link>
            <Link
              href="/pt/nutri/metodo/painel/agenda"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Agenda Estratégica →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

