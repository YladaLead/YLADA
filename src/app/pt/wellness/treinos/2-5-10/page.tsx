'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Progresso2510 {
  data: string
  convites: number
  follow_ups: number
  contatos_novos: number
  completo: boolean
}

export default function Treino2510Page() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <Treino2510Content />
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function Treino2510Content() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [hoje, setHoje] = useState({
    convites: 0,
    followUps: 0,
    contatosNovos: 0
  })
  const [salvando, setSalvando] = useState(false)
  const [historico, setHistorico] = useState<Progresso2510[]>([])

  useEffect(() => {
    const carregarProgresso = async () => {
      try {
        const response = await authenticatedFetch('/api/wellness/treinos/2-5-10/progresso', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setHoje({
              convites: data.data.convites || 0,
              followUps: data.data.follow_ups || 0,
              contatosNovos: data.data.contatos_novos || 0
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar progresso:', error)
      }
    }

    const carregarHistorico = async () => {
      try {
        const response = await authenticatedFetch('/api/wellness/treinos/2-5-10/historico?dias=7', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setHistorico(data.data)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      }
    }

    carregarProgresso()
    carregarHistorico()
  }, [authenticatedFetch])

  const atualizarContador = async (tipo: 'convites' | 'followUps' | 'contatosNovos', valor: number) => {
    try {
      setSalvando(true)
      const novoHoje = { ...hoje, [tipo]: Math.max(0, valor) }
      setHoje(novoHoje)

      // Salvar no backend
      const response = await authenticatedFetch('/api/wellness/treinos/2-5-10/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          convites: novoHoje.convites,
          follow_ups: novoHoje.followUps,
          contatos_novos: novoHoje.contatosNovos
        })
      })

      if (response.ok) {
        // Recarregar histórico após salvar
        const histResponse = await authenticatedFetch('/api/wellness/treinos/2-5-10/historico?dias=7', {
          credentials: 'include'
        })
        if (histResponse.ok) {
          const histData = await histResponse.json()
          if (histData.success) {
            setHistorico(histData.data || [])
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSalvando(false)
    }
  }

  const estaCompleto = hoje.convites >= 2 && hoje.followUps >= 5 && hoje.contatosNovos >= 10
  const progressoGeral = Math.min(100, ((hoje.convites / 2) + (hoje.followUps / 5) + (hoje.contatosNovos / 10)) * 100 / 3)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/pt/wellness/treinos')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
          >
            ← Voltar para Treinos
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">⚡ Treino 2-5-10</h1>
          <p className="text-lg text-gray-600">
            O método diário de crescimento: 2 convites, 5 follow-ups, 10 contatos. A base da duplicação.
          </p>
        </div>

        {/* Card de Progresso Geral */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Seu Progresso Hoje</h2>
            <span className={`text-2xl font-bold ${estaCompleto ? 'text-green-600' : 'text-gray-600'}`}>
              {Math.round(progressoGeral)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all ${
                estaCompleto ? 'bg-green-600' : 'bg-green-500'
              }`}
              style={{ width: `${progressoGeral}%` }}
            />
          </div>
          {estaCompleto && (
            <div className="bg-green-600 text-white rounded-lg p-3 text-center font-semibold">
              🎉 Parabéns! Você completou o 2-5-10 de hoje!
            </div>
          )}
        </div>

        {/* Contadores Interativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 2 Convites */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">2 Convites</h3>
              <p className="text-sm text-gray-600">Enviar 2 convites leves</p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => atualizarContador('convites', hoje.convites - 1)}
                disabled={hoje.convites === 0 || salvando}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="text-4xl font-bold text-gray-900 min-w-[60px] text-center">
                {hoje.convites}
              </span>
              <button
                onClick={() => atualizarContador('convites', hoje.convites + 1)}
                disabled={salvando}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className={`h-2 rounded-full ${hoje.convites >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <p className="text-xs text-center text-gray-500 mt-2">
              {hoje.convites >= 2 ? '✅ Completo!' : `${2 - hoje.convites} restante(s)`}
            </p>
          </div>

          {/* 5 Follow-ups */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">5 Follow-ups</h3>
              <p className="text-sm text-gray-600">Retornar 5 conversas</p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => atualizarContador('followUps', hoje.followUps - 1)}
                disabled={hoje.followUps === 0 || salvando}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="text-4xl font-bold text-gray-900 min-w-[60px] text-center">
                {hoje.followUps}
              </span>
              <button
                onClick={() => atualizarContador('followUps', hoje.followUps + 1)}
                disabled={salvando}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className={`h-2 rounded-full ${hoje.followUps >= 5 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <p className="text-xs text-center text-gray-500 mt-2">
              {hoje.followUps >= 5 ? '✅ Completo!' : `${5 - hoje.followUps} restante(s)`}
            </p>
          </div>

          {/* 10 Contatos Novos */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">10 Contatos</h3>
              <p className="text-sm text-gray-600">Adicionar 10 contatos novos</p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => atualizarContador('contatosNovos', hoje.contatosNovos - 1)}
                disabled={hoje.contatosNovos === 0 || salvando}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="text-4xl font-bold text-gray-900 min-w-[60px] text-center">
                {hoje.contatosNovos}
              </span>
              <button
                onClick={() => atualizarContador('contatosNovos', hoje.contatosNovos + 1)}
                disabled={salvando}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className={`h-2 rounded-full ${hoje.contatosNovos >= 10 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <p className="text-xs text-center text-gray-500 mt-2">
              {hoje.contatosNovos >= 10 ? '✅ Completo!' : `${10 - hoje.contatosNovos} restante(s)`}
            </p>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Como Funciona</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">2 Convites Leves</h3>
                <p className="text-sm text-gray-600">
                  Envie 2 convites leves para pessoas próximas, sem pressão. Use o Fluxo de Convite Leve.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">5 Follow-ups</h3>
                <p className="text-sm text-gray-600">
                  Retorne 5 conversas anteriores e acompanhe pessoas que já demonstraram interesse.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">10 Contatos Novos</h3>
                <p className="text-sm text-gray-600">
                  Adicione 10 pessoas novas à sua lista de contatos para expandir sua rede.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push('/pt/wellness/fluxos/convite-leve')}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-gray-900">Ver Fluxo de Convite</h3>
                <p className="text-xs text-gray-600">Scripts prontos para usar</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => router.push('/pt/wellness/noel')}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold text-gray-900">Falar com NOEL</h3>
                <p className="text-xs text-gray-600">Personalizar scripts e tirar dúvidas</p>
              </div>
            </div>
          </button>
        </div>

        {/* Histórico Semanal */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Histórico da Semana</h2>
          {historico.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              Seu histórico aparecerá aqui conforme você completa os dias.
            </p>
          ) : (
            <div className="space-y-2">
              {historico.map((dia, index) => {
                const dataObj = new Date(dia.data)
                const dataFormatada = dataObj.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit',
                  weekday: 'short'
                })
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{dataFormatada}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${dia.convites >= 2 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                        📨 {dia.convites}/2
                      </span>
                      <span className={`${dia.follow_ups >= 5 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                        🔄 {dia.follow_ups}/5
                      </span>
                      <span className={`${dia.contatos_novos >= 10 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                        👥 {dia.contatos_novos}/10
                      </span>
                      {dia.completo && <span className="text-green-600 font-semibold">✅</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
