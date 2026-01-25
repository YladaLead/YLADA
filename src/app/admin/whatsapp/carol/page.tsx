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
