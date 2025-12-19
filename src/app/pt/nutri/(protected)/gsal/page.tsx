'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import NutriChatWidget from '@/components/nutri/NutriChatWidget'
import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import Card from '@/components/shared/Card'
import KPICard from '@/components/shared/KPICard'
import PrimaryButton from '@/components/shared/PrimaryButton'
import AttachToolModal from '@/components/gsal/AttachToolModal'

export default function GSALPage() {
  return <GSALPageContent />
}

function GSALPageContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({
    clientesAtivos: 0,
    novosClientes: 0,
    consultasMes: 0
  })
  const [pipelineStats, setPipelineStats] = useState({
    lead: 0,
    avaliacao: 0,
    plano: 0,
    acompanhamento: 0
  })
  const [carregando, setCarregando] = useState(true)
  const [attachToolId, setAttachToolId] = useState<string | null>(null)
  const [toolName, setToolName] = useState<string | null>(null)

  useEffect(() => {
    const carregarStats = async () => {
      try {
        // Carregar stats do dashboard
        const dashboardRes = await fetch('/api/nutri/dashboard', {
          credentials: 'include'
        })

        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json()
          if (dashboardData.stats) {
            setStats({
              clientesAtivos: dashboardData.stats.clientesAtivos || 0,
              novosClientes: 0, // TODO: calcular novos clientes do mês
              consultasMes: 0 // TODO: calcular consultas do mês
            })
          }
        }

        // Carregar contagens do pipeline por status
        const clientesRes = await fetch('/api/nutri/clientes?limit=1000', {
          credentials: 'include'
        })

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json()
          const clientes = clientesData.data?.clients || []
          
          // Contar por status do pipeline GSAL
          const counts = {
            lead: 0,
            avaliacao: 0,
            plano: 0,
            acompanhamento: 0
          }

          clientes.forEach((cliente: any) => {
            const status = cliente.status?.toLowerCase() || ''
            if (status === 'lead' || status === 'contato') {
              counts.lead++
            } else if (status === 'avaliacao' || status === 'avaliação') {
              counts.avaliacao++
            } else if (status === 'plano' || status === 'em_tratamento') {
              counts.plano++
            } else if (status === 'acompanhamento' || status === 'ativo') {
              counts.acompanhamento++
            }
          })

          setPipelineStats(counts)
        }
      } catch (error) {
        console.error('Erro ao carregar stats GSAL:', error)
      } finally {
        setCarregando(false)
      }
    }

    if (user) {
      carregarStats()
    }
  }, [user])

  // Verificar query param attachTool
  useEffect(() => {
    const toolId = searchParams.get('attachTool')
    if (toolId) {
      setAttachToolId(toolId)
      // Buscar nome da ferramenta
      fetch(`/api/nutri/ferramentas?profession=nutri`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          const tool = data.tools?.find((t: any) => t.id === toolId)
          if (tool) {
            setToolName(tool.title || tool.nome || 'Ferramenta')
          }
        })
        .catch(err => console.error('Erro ao buscar ferramenta:', err))
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 lg:ml-56">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Gestão GSAL</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            <Section
              title="📊 Gestão de Clientes"
              subtitle="GSAL: Gerar, Servir, Acompanhar, Lucrar"
            >
              {/* Explicação simples do GSAL - Versão MVP */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-800 mb-3">
                  <strong>💡 GSAL</strong> é como você organiza sua gestão: <strong>Gerar</strong> oportunidades, <strong>Servir</strong> com valor, <strong>Acompanhar</strong> evolução e <strong>Lucrar</strong> de forma organizada.
                </p>
                <p className="text-xs text-gray-600 italic">
                  💬 Dúvidas? Pergunte para a LYA: "Como usar o GSAL?"
                </p>
              </div>

              {/* Painel Resumo (KPIs) */}
              <Card className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo GSAL</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <KPICard
                    icon="👥"
                    value={stats.clientesAtivos}
                    label="Clientes Ativos"
                    description={carregando ? 'Carregando...' : 'Total de clientes ativos'}
                  />
                  <KPICard
                    icon="🆕"
                    value={stats.novosClientes}
                    label="Novos Clientes"
                    description="Este mês"
                  />
                  <KPICard
                    icon="📅"
                    value={stats.consultasMes}
                    label="Consultas do Mês"
                    description="Total agendadas"
                  />
                </div>
              </Card>

              {/* Pipeline Visual (Kanban) */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pipeline de Acompanhamento</h3>
                  <PrimaryButton href="/pt/nutri/clientes/kanban">
                    Abrir Kanban Completo
                  </PrimaryButton>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Lead</p>
                    <p className="text-2xl font-bold text-blue-600">{pipelineStats.lead}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Avaliação</p>
                    <p className="text-2xl font-bold text-purple-600">{pipelineStats.avaliacao}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Plano</p>
                    <p className="text-2xl font-bold text-green-600">{pipelineStats.plano}</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Acompanhamento</p>
                    <p className="text-2xl font-bold text-amber-600">{pipelineStats.acompanhamento}</p>
                  </div>
                </div>
              </Card>

              {/* Links Rápidos - MVP */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/pt/nutri/leads"
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="font-medium text-gray-900">Leads</p>
                </Link>
                <Link
                  href="/pt/nutri/clientes"
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">👤</div>
                  <p className="font-medium text-gray-900">Clientes</p>
                </Link>
                <Link
                  href="/pt/nutri/clientes/kanban"
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">🗂️</div>
                  <p className="font-medium text-gray-900">Kanban</p>
                </Link>
                <Link
                  href="/pt/nutri/acompanhamento"
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">📊</div>
                  <p className="font-medium text-gray-900">Acompanhamento</p>
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Modal para anexar ferramenta */}
      {attachToolId && (
        <AttachToolModal
          isOpen={!!attachToolId}
          onClose={() => {
            setAttachToolId(null)
            setToolName(null)
            // Remover query param da URL
            const url = new URL(window.location.href)
            url.searchParams.delete('attachTool')
            window.history.replaceState({}, '', url.toString())
          }}
          toolId={attachToolId}
          toolName={toolName || undefined}
        />
      )}

      {/* Chat Widget Flutuante - Suporte GSAL como padrão na página GSAL */}
      <NutriChatWidget chatbotId="gsal" />
    </PageLayout>
  )
}

