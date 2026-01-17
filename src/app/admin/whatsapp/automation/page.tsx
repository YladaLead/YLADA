'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

const supabase = createClient()

interface AutomationRule {
  id: string
  name: string
  area: string | null
  trigger_type: string
  action_type: string
  is_active: boolean
  priority: number
  created_at: string
}

interface NotificationRule {
  id: string
  name: string
  area: string | null
  conditions: any
  notification_method: string
  is_active: boolean
  priority: number
  created_at: string
}

function AutomationPage() {
  return (
    <AdminProtectedRoute>
      <AutomationContent />
    </AdminProtectedRoute>
  )
}

function AutomationContent() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'automation' | 'notification'>('automation')

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      // Carregar regras de automação
      const { data: autoRules } = await supabase
        .from('whatsapp_automation_rules')
        .select('*')
        .order('priority', { ascending: false })

      // Carregar regras de notificação
      const { data: notifRules } = await supabase
        .from('whatsapp_notification_rules')
        .select('*')
        .order('priority', { ascending: false })

      setAutomationRules(autoRules || [])
      setNotificationRules(notifRules || [])
    } catch (error) {
      console.error('Erro ao carregar regras:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRule = async (table: 'automation' | 'notification', id: string, currentStatus: boolean) => {
    try {
      const tableName = table === 'automation' 
        ? 'whatsapp_automation_rules' 
        : 'whatsapp_notification_rules'

      const { error } = await supabase
        .from(tableName)
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      await loadRules()
    } catch (error) {
      console.error('Erro ao atualizar regra:', error)
      alert('Erro ao atualizar regra')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/admin/whatsapp"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Voltar
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Automações</h1>
            <div className="w-12"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('automation')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'automation'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🤖 Automações
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'notification'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔔 Notificações
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : activeTab === 'automation' ? (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Regras de Automação</h2>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                + Nova Regra
              </button>
            </div>

            {automationRules.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma regra criada</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Crie regras para enviar mensagens automáticas
                </p>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                  Criar Primeira Regra
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {automationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                          {rule.area && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {rule.area}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Trigger:</span> {rule.trigger_type}
                          </p>
                          <p>
                            <span className="font-medium">Ação:</span> {rule.action_type}
                          </p>
                          <p>
                            <span className="font-medium">Prioridade:</span> {rule.priority}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRule('automation', rule.id, rule.is_active)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            rule.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rule.is_active ? 'Ativa' : 'Inativa'}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          ⚙️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Regras de Notificação</h2>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                + Nova Regra
              </button>
            </div>

            {notificationRules.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma regra criada</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Crie regras para controlar quando notificar
                </p>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                  Criar Primeira Regra
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {notificationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                          {rule.area && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {rule.area}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Método:</span> {rule.notification_method}
                          </p>
                          {rule.conditions?.hours && (
                            <p>
                              <span className="font-medium">Horários:</span>{' '}
                              {rule.conditions.hours.join(', ')}h
                            </p>
                          )}
                          {rule.conditions?.keywords && (
                            <p>
                              <span className="font-medium">Palavras-chave:</span>{' '}
                              {rule.conditions.keywords.join(', ')}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Prioridade:</span> {rule.priority}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRule('notification', rule.id, rule.is_active)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            rule.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rule.is_active ? 'Ativa' : 'Inativa'}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          ⚙️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AutomationPage
