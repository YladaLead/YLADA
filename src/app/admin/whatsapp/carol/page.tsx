'use client'

import { useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

function CarolControlContent() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; errors: number; skipped?: number } | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testConversationId, setTestConversationId] = useState('')
  const [testMessage, setTestMessage] = useState('Olá, quero agendar uma aula')
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const handleDisparo = async (tipo: 'welcome' | 'remarketing' | 'reminders') => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/carol/disparos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({ sent: data.sent, errors: data.errors })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao disparar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestCarol = async () => {
    if (!testConversationId || !testMessage) {
      alert('Preencha o ID da conversa e a mensagem')
      return
    }

    setTestLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/test-carol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: testConversationId,
          message: testMessage,
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error: any) {
      setTestResult({ error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🤖 Carol - IA de Atendimento</h1>
              <p className="text-sm text-gray-500 mt-1">Sistema de automação e remarketing</p>
            </div>
            <Link
              href="/admin/whatsapp"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Disparo de Boas-vindas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👋 Disparo de Boas-vindas</h2>
            <p className="text-sm text-gray-600 mb-4">
              Envia mensagem automática para pessoas que preencheram o formulário mas ainda não chamaram no WhatsApp.
            </p>
            <button
              onClick={() => handleDisparo('welcome')}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Disparar Boas-vindas'}
            </button>
            {result && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Enviadas: {result.sent} | ❌ Erros: {result.errors}
                </p>
              </div>
            )}
          </div>

          {/* Disparo de Remarketing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Disparo de Remarketing</h2>
            <p className="text-sm text-gray-600 mb-4">
              Envia mensagem para pessoas que agendaram mas não participaram da aula.
            </p>
            <button
              onClick={() => handleDisparo('remarketing')}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Disparar Remarketing'}
            </button>
            {result && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ Enviadas: {result.sent} | ❌ Erros: {result.errors}
                </p>
              </div>
            )}
          </div>

          {/* Disparo de Lembretes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⏰ Disparo de Lembretes de Reunião</h2>
            <p className="text-sm text-gray-600 mb-4">
              Envia lembretes para participantes agendados:
              <br />• Padrão: 12h antes da reunião
              <br />• Segunda 10h: lembrete no domingo às 17h
              <br />• Respeita horário permitido (8h-19h seg-sex, até 13h sábado)
            </p>
            <button
              onClick={() => handleDisparo('reminders')}
              disabled={loading}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Processando...' : '⏰ Disparar Lembretes'}
            </button>
            {result && result.skipped !== undefined && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  ✅ Enviadas: {result.sent} | ❌ Erros: {result.errors} | ⏭️ Ignoradas: {result.skipped || 0}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Teste de Carol */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Testar Carol</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID da Conversa
              </label>
              <input
                type="text"
                value={testConversationId}
                onChange={(e) => setTestConversationId(e.target.value)}
                placeholder="Cole o ID da conversa aqui"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem de Teste
              </label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Mensagem que a Carol vai responder"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleTestCarol}
              disabled={testLoading}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {testLoading ? 'Testando...' : 'Testar Carol'}
            </button>
            {testResult && (
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-semibold mb-2">
                  {testResult.success ? '✅ Sucesso!' : '❌ Erro'}
                </p>
                {testResult.response && (
                  <p className="text-sm mb-2">
                    <strong>Resposta:</strong> {testResult.response}
                  </p>
                )}
                {testResult.error && (
                  <p className="text-sm text-red-700">
                    <strong>Erro:</strong> {testResult.error}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  OpenAI Key configurada: {testResult.hasOpenAIKey ? '✅ Sim' : '❌ Não'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Corrigir Telefones */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Corrigir Telefones Inválidos</h2>
          <p className="text-sm text-gray-600 mb-4">
            Corrige telefones inválidos (IDs do WhatsApp, etc) no banco de dados.
          </p>
          <button
            onClick={async () => {
              if (!confirm('Tem certeza? Isso vai corrigir telefones inválidos no banco de dados.')) {
                return
              }
              setLoading(true)
              try {
                const response = await fetch('/api/admin/whatsapp/corrigir-telefones', {
                  method: 'POST',
                  credentials: 'include',
                })
                const data = await response.json()
                if (data.success) {
                  alert(`✅ ${data.message}\n\nCorrigidas: ${data.corrigidas}\nInválidas: ${data.invalidas}\nTotal: ${data.total}`)
                  window.location.reload()
                } else {
                  alert(`Erro: ${data.error}`)
                }
              } catch (error: any) {
                alert(`Erro: ${error.message}`)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Corrigir Telefones'}
          </button>
        </div>

        {/* Analisar Conversas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Analisar Conversas Existentes</h2>
          <p className="text-sm text-gray-600 mb-4">
            Analisa todas as conversas e mostra resumo por status, tags e ações necessárias.
          </p>
          <button
            onClick={async () => {
              setLoading(true)
              try {
                const response = await fetch('/api/admin/whatsapp/analisar-conversas?area=nutri', {
                  method: 'GET',
                  credentials: 'include'
                })
                const data = await response.json()
                if (data.total !== undefined) {
                  setAnalysisData(data)
                } else {
                  alert(`Erro: ${data.error || 'Erro desconhecido'}`)
                }
              } catch (error: any) {
                alert(`Erro: ${error.message}`)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-3"
          >
            {loading ? 'Analisando...' : '📊 Analisar Conversas'}
          </button>
          
          {analysisData && (() => {
            const resumo = analysisData.resumo
            const detalhes = analysisData.detalhes || []
            
            // Agrupar por ação necessária (exceto "Enviar primeira mensagem")
            const porAcao: Record<string, Array<{phone: string, name: string, tags: string[]}>> = {}
            detalhes.forEach((d: any) => {
              if (d.precisa_acao !== 'Enviar primeira mensagem') {
                if (!porAcao[d.precisa_acao]) {
                  porAcao[d.precisa_acao] = []
                }
                porAcao[d.precisa_acao].push({
                  phone: d.phone,
                  name: d.name,
                  tags: d.tags || []
                })
              }
            })
            
            const formatPhone = (phone: string) => {
              if (phone.length === 13 && phone.startsWith('55')) {
                const ddd = phone.substring(2, 4)
                const part1 = phone.substring(4, 9)
                const part2 = phone.substring(9)
                return `(${ddd}) ${part1}-${part2}`
              }
              return phone
            }
            
            return (
              <div className="mt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">📊 Resumo</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Total:</strong> {resumo.total} conversas</p>
                    <p><strong>Sem tags:</strong> {resumo.sem_tags}</p>
                    <p><strong>Sem mensagem da Carol:</strong> {resumo.sem_mensagem_carol}</p>
                    <p><strong>Participou da aula:</strong> {resumo.participou_aula}</p>
                    <p><strong>Não participou:</strong> {resumo.nao_participou_aula}</p>
                    <p><strong>Agendou aula:</strong> {resumo.agendou_aula}</p>
                    <p><strong>Veio mas não agendou:</strong> {resumo.nao_agendou}</p>
                    <p><strong>Carol ativa:</strong> {resumo.carol_ativa}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">🎯 Ações Necessárias</h3>
                  <div className="space-y-3">
                    {Object.entries(porAcao).map(([acao, pessoas]) => {
                      const isExpanded = expandedCategories[acao] || false
                      return (
                        <div key={acao} className="border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedCategories({...expandedCategories, [acao]: !isExpanded})}
                            className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-left"
                          >
                            <span className="font-medium text-gray-900">
                              {acao}: <span className="text-blue-600">{pessoas.length}</span>
                            </span>
                            <span className="text-gray-500">
                              {isExpanded ? '🔽' : '▶️'}
                            </span>
                          </button>
                          {isExpanded && (
                            <div className="bg-white border-t border-gray-200 p-4">
                              <div className="space-y-2">
                                {pessoas.map((pessoa, idx) => (
                                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{pessoa.name}</p>
                                      <p className="text-sm text-gray-600">{formatPhone(pessoa.phone)}</p>
                                      {pessoa.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {pessoa.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                              {tag}
                                            </span>
                                          ))}
                                          {pessoa.tags.length > 3 && (
                                            <span className="text-xs text-gray-500">+{pessoa.tags.length - 3}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <Link
                                      href={`/admin/whatsapp?phone=${encodeURIComponent(pessoa.phone)}`}
                                      className="ml-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                      Ver →
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Processar Conversas Existentes */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Processar Conversas Existentes</h2>
          <p className="text-sm text-gray-600 mb-4">
            Analisa conversas existentes, identifica status (agendou, não agendou, participou, etc.) e envia mensagens apropriadas da Carol automaticamente.
          </p>
          <button
            onClick={async () => {
              if (!confirm('Isso vai analisar todas as conversas e enviar mensagens da Carol. Continuar?')) {
                return
              }
              setLoading(true)
              try {
                const response = await fetch('/api/admin/whatsapp/carol/processar-conversas', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ area: 'nutri' })
                })
                const data = await response.json()
                if (data.success) {
                  alert(`✅ Processamento concluído!\n\n📊 Estatísticas:\n- Analisadas: ${data.analyzed}\n- Processadas: ${data.processed}\n- Enviadas: ${data.sent}\n- Erros: ${data.errors}\n\n📋 Detalhes:\n${data.details || 'Nenhum detalhe disponível'}`)
                } else {
                  alert(`Erro: ${data.error}`)
                }
              } catch (error: any) {
                alert(`Erro: ${error.message}`)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Processando...' : '🚀 Processar Todas as Conversas'}
          </button>
        </div>

        {/* Limpar Duplicatas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧹 Limpar Duplicatas do Banco</h2>
          <p className="text-sm text-gray-600 mb-4">
            Remove conversas duplicadas do banco de dados, mantendo apenas a mais recente de cada telefone.
          </p>
          <button
            onClick={async () => {
              if (!confirm('Tem certeza? Isso vai remover conversas duplicadas do banco de dados permanentemente.')) {
                return
              }
              setLoading(true)
              try {
                const response = await fetch('/api/admin/whatsapp/limpar-duplicatas', {
                  method: 'POST',
                  credentials: 'include',
                })
                const data = await response.json()
                if (data.success) {
                  alert(`✅ ${data.message}\n\nRemovidas: ${data.removed}\nMantidas: ${data.kept}`)
                  window.location.reload()
                } else {
                  alert(`Erro: ${data.error}`)
                }
              } catch (error: any) {
                alert(`Erro: ${error.message}`)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Limpar Duplicatas do Banco'}
          </button>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ℹ️ Como Funciona</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">👋 Boas-vindas:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Busca pessoas que preencheram workshop nos últimos 7 dias</li>
                <li>Verifica se não têm conversa ativa no WhatsApp</li>
                <li>Envia mensagem com opções de dias/horários</li>
                <li>Adiciona tags automaticamente</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Remarketing:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Busca pessoas com tag "nao_participou_aula" ou "adiou_aula"</li>
                <li>Envia mensagem empática oferecendo novas opções</li>
                <li>Adiciona tag "recebeu_segundo_link"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 Resposta Automática:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Carol responde automaticamente quando alguém envia mensagem</li>
                <li>Usa contexto da conversa e tags</li>
                <li>Oferece opções de aula quando apropriado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarolControlPage() {
  return (
    <AdminProtectedRoute>
      <CarolControlContent />
    </AdminProtectedRoute>
  )
}
