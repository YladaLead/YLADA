'use client'

import { useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

function AutomationContent() {
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

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
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro ao agendar boas-vindas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/admin/whatsapp" 
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Voltar para WhatsApp
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Automação WhatsApp</h1>
            <p className="text-gray-600 mt-2">
              Gerencie mensagens agendadas e automações
            </p>
          </div>

          {/* Cards de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Agendar Boas-vindas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Boas-vindas</h2>
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
              <h2 className="text-xl font-semibold mb-4">Processar Pendentes</h2>
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
          </div>

          {/* Botão de Diagnóstico */}
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

              <p className="text-sm text-gray-500 mt-4">
                {new Date(result.timestamp).toLocaleString('pt-BR')}
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
