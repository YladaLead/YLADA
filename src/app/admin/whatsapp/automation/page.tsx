'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

type DisparoType = 'remarketing' | 'reminders' | 'remarketing_hoje_20h' | null

function AutomationContent() {
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<DisparoType>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testConversationId, setTestConversationId] = useState('')
  const [testMessage, setTestMessage] = useState('Olá, quero agendar uma aula')
  const [telefonesEspecificos, setTelefonesEspecificos] = useState('')
  const [autoProcess, setAutoProcess] = useState(false)

  // Processar automaticamente ao carregar (se habilitado)
  useEffect(() => {
    const saved = localStorage.getItem('whatsapp-auto-process')
    if (saved === 'true') {
      setAutoProcess(true)
      // Processar após 1 segundo (dar tempo para carregar)
      setTimeout(() => {
        handleProcessAll()
      }, 1000)
    }
  }, [])

  // Agendar Boas-vindas
  const handleWelcome = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/automation/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'welcome',
          ...data,
        })
        // Processar automaticamente após agendar
        setTimeout(() => handleProcess(), 2000)
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao agendar boas-vindas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Processar Pendentes
  const handleProcess = async () => {
    setProcessing(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/automation/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ limit: 50 }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'process',
          ...data,
        })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao processar mensagens: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  // Processar TUDO automaticamente
  const handleProcessAll = async () => {
    if (!confirm('Isso vai processar TUDO automaticamente:\n\n1. Agendar boas-vindas para leads novos\n2. Processar mensagens pendentes\n3. Reprocessar quem tem tags mas não recebeu fluxo\n\nPode demorar alguns minutos. Continuar?')) {
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/automation/process-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'process-all',
          ...data,
        })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao processar tudo: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  // Disparar Remarketing
  const handleRemarketing = async () => {
    setLoading(true)
    setLoadingType('remarketing')
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/carol/disparos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo: 'remarketing' }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'remarketing',
          sent: data.sent,
          errors: data.errors,
          aborted: data.aborted,
        })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao disparar remarketing: ${error.message}`)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handlePararDisparo = async () => {
    if (!loadingType) return
    try {
      await fetch('/api/admin/whatsapp/carol/disparos/abort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo: loadingType }),
      })
    } catch {
      // silencioso
    }
  }

  // Remarque aula hoje 20h (não participou, exceto já agendados para hoje 20h)
  const handleRemarketingHoje20h = async () => {
    setLoading(true)
    setLoadingType('remarketing_hoje_20h')
    setResult(null)
    try {
      const response = await fetch('/api/admin/whatsapp/carol/disparos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo: 'remarketing_hoje_20h' }),
      })
      const data = await response.json()
      if (data.success) {
        setResult({
          type: 'remarketing_hoje_20h',
          sent: data.sent,
          errors: data.errors,
          skipped: data.skipped,
          aborted: data.aborted,
        })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao disparar: ${error.message}`)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  // Disparar Lembretes
  const handleReminders = async () => {
    setLoading(true)
    setLoadingType('reminders')
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/carol/disparos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo: 'reminders' }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'reminders',
          sent: data.sent,
          errors: data.errors,
          skipped: data.skipped,
          aborted: data.aborted,
        })
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao disparar lembretes: ${error.message}`)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  // Testar Carol
  const handleTestCarol = async () => {
    if (!testConversationId || !testMessage) {
      alert('Preencha o ID da conversa e a mensagem')
      return
    }

    setTestLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/carol/chat', {
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

  // Processar Pessoas Específicas
  const handleProcessEspecificos = async (tipo: 'fechamento' | 'remarketing') => {
    if (!telefonesEspecificos.trim()) {
      alert('Digite pelo menos um telefone')
      return
    }

    const telefones = telefonesEspecificos
      .split(/[,\n]/)
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (telefones.length === 0) {
      alert('Nenhum telefone válido encontrado')
      return
    }

    if (!confirm(`Enviar mensagem de ${tipo === 'fechamento' ? 'FECHAMENTO' : 'REMARKETING'} para ${telefones.length} pessoa(s)?`)) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/whatsapp/carol/processar-especificos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          telefones,
          tipo,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'especificos',
          processed: data.processed,
          sent: data.sent,
          errors: data.errors,
          results: data.results,
        })
        setTelefonesEspecificos('')
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Diagnóstico
  const handleDebug = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp/automation/debug', {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        console.log('Diagnóstico completo:', data.diagnostic)
        const diag = data.diagnostic
        const msg = `Diagnóstico completo! Veja o console (F12) para detalhes.\n\n📊 Resumo (últimos 7 dias):\n- Inscrições: ${diag.workshop_inscricoes.count_7d} (30d: ${diag.workshop_inscricoes.count_30d}, Total: ${diag.workshop_inscricoes.total})\n- Leads: ${diag.leads.count_7d} (30d: ${diag.leads.count_30d})\n- Conversas: ${diag.conversations.count}\n- Agendadas: ${diag.scheduled_messages.count}\n\n💡 Se todos são 0, não há leads novos para agendar. Isso é normal!`
        alert(msg)
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao fazer diagnóstico: ${error.message}`)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/admin/whatsapp" 
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Voltar para WhatsApp
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🤖 Automação WhatsApp</h1>
            <p className="text-gray-600 mt-2">
              Gerencie mensagens agendadas, disparos e automações
            </p>
          </div>

          {/* Botão Processar TUDO */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🚀 Processar TUDO Automaticamente</h2>
            <p className="text-purple-100 mb-4 text-sm">
              Processa tudo de uma vez: agenda boas-vindas, processa pendentes, reprocessa quem tem tags mas não recebeu fluxo.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleProcessAll}
                disabled={processing}
                className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {processing ? 'Processando TUDO...' : '🚀 Processar TUDO Automaticamente'}
              </button>
              <label className="flex items-center gap-2 text-purple-100 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoProcess}
                  onChange={(e) => {
                    setAutoProcess(e.target.checked)
                    localStorage.setItem('whatsapp-auto-process', e.target.checked ? 'true' : 'false')
                  }}
                  className="w-4 h-4 rounded"
                />
                Processar automaticamente ao abrir esta página
              </label>
            </div>
          </div>

          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Agendar Boas-vindas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">👋 Boas-vindas</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Agenda mensagens de boas-vindas para leads que preencheram workshop mas não têm conversa ativa.
              </p>
              <button
                onClick={handleWelcome}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Agendando...' : 'Agendar Boas-vindas'}
              </button>
            </div>

            {/* Processar Pendentes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">⚙️ Processar Pendentes</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Processa mensagens agendadas que estão prontas para envio.
              </p>
              <button
                onClick={handleProcess}
                disabled={processing}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processando...' : 'Verificar e Processar'}
              </button>
            </div>

            {/* Remarque aula hoje 20h */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">📅 Remarque: aula hoje 20h</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Quem não participou, exceto quem já está agendado para hoje às 20h. Mensagem: &quot;Hoje temos aula às 20h. Gostaria de participar?&quot;
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRemarketingHoje20h}
                  disabled={loading}
                  className="flex-1 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && loadingType === 'remarketing_hoje_20h' ? 'Disparando...' : 'Disparar remarque hoje 20h'}
                </button>
                {loading && loadingType === 'remarketing_hoje_20h' && (
                  <button
                    type="button"
                    onClick={handlePararDisparo}
                    className="px-4 py-2 rounded border-2 border-red-500 text-red-600 hover:bg-red-50 font-medium shrink-0"
                  >
                    Parar disparo
                  </button>
                )}
              </div>
            </div>

            {/* Disparar Remarketing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🔄 Remarketing</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Envia mensagem para pessoas que agendaram mas não participaram da aula.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRemarketing}
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && loadingType === 'remarketing' ? 'Disparando...' : 'Disparar Remarketing'}
                </button>
                {loading && loadingType === 'remarketing' && (
                  <button
                    type="button"
                    onClick={handlePararDisparo}
                    className="px-4 py-2 rounded border-2 border-red-500 text-red-600 hover:bg-red-50 font-medium shrink-0"
                  >
                    Parar disparo
                  </button>
                )}
              </div>
            </div>

            {/* Disparar Lembretes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">⏰ Lembretes</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Envia lembretes para participantes agendados (12h antes da reunião).
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReminders}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && loadingType === 'reminders' ? 'Disparando...' : 'Disparar Lembretes'}
                </button>
                {loading && loadingType === 'reminders' && (
                  <button
                    type="button"
                    onClick={handlePararDisparo}
                    className="px-4 py-2 rounded border-2 border-red-500 text-red-600 hover:bg-red-50 font-medium shrink-0"
                  >
                    Parar disparo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Testar Carol */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🧪 Testar Carol</h2>
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
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
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
                </div>
              )}
            </div>
          </div>

          {/* Processar Pessoas Específicas */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Processar Pessoas Específicas</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Processa pessoas específicas para fechamento (quem participou) ou remarketing (quem não participou).
              Cole os telefones separados por vírgula ou quebra de linha.
            </p>
            <div className="space-y-4">
              <textarea
                value={telefonesEspecificos}
                onChange={(e) => setTelefonesEspecificos(e.target.value)}
                rows={4}
                placeholder="Ex: 5519997230912, 5511999999999&#10;ou um por linha"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleProcessEspecificos('fechamento')}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : '💰 Fechamento (Participou)'}
                </button>
                <button
                  onClick={() => handleProcessEspecificos('remarketing')}
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : '🔄 Remarketing (Não Participou)'}
                </button>
              </div>
            </div>
          </div>

          {/* Reprocessar Quem Já Tem Tags */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🔄 Reprocessar Quem Já Tem Tags</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Se você já etiquetou quem participou/não participou mas o fluxo não aconteceu, use estes botões para reprocessar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={async () => {
                  if (!confirm('Isso vai enviar link de cadastro para TODAS as pessoas que têm tag "participou_aula" mas ainda não receberam. Continuar?')) {
                    return
                  }
                  setLoading(true)
                  setResult(null)
                  try {
                    // Buscar todas conversas com tag participou_aula
                    const response = await fetch('/api/admin/whatsapp/automation/reprocessar-participou', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                    })
                    const data = await response.json()
                    if (data.success) {
                      setResult({
                        type: 'reprocessar',
                        processed: data.processed,
                        sent: data.sent,
                        errors: data.errors,
                      })
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processando...' : '💰 Reprocessar Participou'}
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Isso vai enviar remarketing para TODAS as pessoas que têm tag "nao_participou_aula" mas ainda não receberam. Continuar?')) {
                    return
                  }
                  setLoading(true)
                  setResult(null)
                  try {
                    const response = await fetch('/api/admin/whatsapp/automation/reprocessar-nao-participou', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ force: false }),
                    })
                    const data = await response.json()
                    if (data.success) {
                      setResult({
                        type: 'reprocessar',
                        processed: data.processed,
                        sent: data.sent,
                        errors: data.errors,
                      })
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
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Processando...' : '🔄 Reprocessar Não Participou'}
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Reenviar remarketing para TODOS que estão etiquetados "Não participou" (incluindo quem já recebeu)? Útil para turma de ontem à noite. Continuar?')) {
                    return
                  }
                  setLoading(true)
                  setResult(null)
                  try {
                    const response = await fetch('/api/admin/whatsapp/automation/reprocessar-nao-participou', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ force: true }),
                    })
                    const data = await response.json()
                    if (data.success) {
                      setResult({
                        type: 'reprocessar',
                        processed: data.processed,
                        sent: data.sent,
                        errors: data.errors,
                      })
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
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                title="Reenvia mesmo para quem já recebeu (ex.: turma de ontem)"
              >
                {loading ? 'Processando...' : '📩 Reenviar para TODOS (forçar)'}
              </button>
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔍 Diagnóstico</h3>
            <p className="text-xs text-yellow-700 mb-3">
              Se não está agendando mensagens, clique aqui para verificar o que está acontecendo.
            </p>
            <button
              onClick={handleDebug}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
            >
              Fazer Diagnóstico
            </button>
          </div>

          {/* Resultado */}
          {result && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Resultado</h2>
              
              {result.type === 'welcome' && (
                <div className="space-y-2">
                  <p><strong>Agendadas:</strong> {result.scheduled}</p>
                  <p><strong>Puladas:</strong> {result.skipped}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                </div>
              )}

              {result.type === 'process' && (
                <div className="space-y-2">
                  <p><strong>Processadas:</strong> {result.processed}</p>
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Falhadas:</strong> {result.failed}</p>
                  <p><strong>Canceladas:</strong> {result.cancelled}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                </div>
              )}

              {result.type === 'remarketing_hoje_20h' && (
                <div className="space-y-2">
                  {result.aborted && (
                    <p className="font-semibold text-amber-700">⏹️ Disparo interrompido.</p>
                  )}
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                  <p><strong>Puladas:</strong> {result.skipped ?? 0}</p>
                </div>
              )}

              {result.type === 'remarketing' && (
                <div className="space-y-2">
                  {result.aborted && (
                    <p className="font-semibold text-amber-700">⏹️ Disparo interrompido.</p>
                  )}
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                </div>
              )}

              {result.type === 'reminders' && (
                <div className="space-y-2">
                  {result.aborted && (
                    <p className="font-semibold text-amber-700">⏹️ Disparo interrompido.</p>
                  )}
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                  <p><strong>Ignoradas:</strong> {result.skipped || 0}</p>
                </div>
              )}

              {result.type === 'especificos' && (
                <div className="space-y-2">
                  <p><strong>Processadas:</strong> {result.processed}</p>
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                  {result.results && result.results.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Detalhes:</p>
                      <div className="max-h-40 overflow-y-auto text-sm">
                        {result.results.map((r: any, i: number) => (
                          <p key={i} className={r.success ? 'text-green-700' : 'text-red-700'}>
                            {r.success ? '✅' : '❌'} {r.name || r.phone}: {r.error || 'Enviado'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.type === 'reprocessar' && (
                <div className="space-y-2">
                  <p><strong>Processadas:</strong> {result.processed}</p>
                  <p><strong>Enviadas:</strong> {result.sent}</p>
                  <p><strong>Erros:</strong> {result.errors}</p>
                </div>
              )}

              {result.type === 'process-all' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">👋 Boas-vindas:</h3>
                    <p>Agendadas: {result.welcome?.scheduled || 0} | Puladas: {result.welcome?.skipped || 0} | Erros: {result.welcome?.errors || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">⚙️ Processar Pendentes:</h3>
                    <p>Processadas: {result.process?.processed || 0} | Enviadas: {result.process?.sent || 0} | Falhadas: {result.process?.failed || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">⏰ Lembretes de aula (2h, 12h, 10min):</h3>
                    <p>Enviados: {result.pre_class?.sent || 0} | Erros: {result.pre_class?.errors || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">💰 Reprocessar Participou:</h3>
                    <p>Processadas: {result.reprocess_participou?.processed || 0} | Enviadas: {result.reprocess_participou?.sent || 0} | Erros: {result.reprocess_participou?.errors || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">🔄 Reprocessar Não Participou:</h3>
                    <p>Processadas: {result.reprocess_nao_participou?.processed || 0} | Enviadas: {result.reprocess_nao_participou?.sent || 0} | Erros: {result.reprocess_nao_participou?.errors || 0}</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                {new Date(result.timestamp || Date.now()).toLocaleString('pt-BR')}
              </p>
            </div>
          )}

          {/* Informações */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">ℹ️ Como funciona</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Boas-vindas:</strong> Busca leads dos últimos 7 dias que preencheram workshop 
                mas não têm conversa ativa. Agenda mensagens para envio.
              </li>
              <li>
                <strong>Processar Pendentes:</strong> Verifica mensagens agendadas que estão prontas 
                para envio e envia automaticamente. Cancela se a pessoa já respondeu.
              </li>
              <li>
                <strong>Lembretes de aula:</strong> Envia lembrete 2h, 12h ou 10min antes para quem tem 
                sessão agendada (context.workshop_session_id). Rodando &quot;Processar tudo&quot; agora envia para quem ainda não recebeu.
              </li>
              <li>
                <strong>Remarketing:</strong> Envia mensagem para quem agendou mas não participou da aula.
              </li>
              <li>
                <strong>Lembretes:</strong> Envia lembretes 12h antes da reunião.
              </li>
              <li>
                <strong>Notificações Pré-Aula:</strong> São agendadas automaticamente quando alguém 
                agenda uma sessão (24h, 12h, 2h e 30min antes).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

export default function AutomationPage() {
  return <AutomationContent />
}
