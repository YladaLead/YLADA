'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import KPICard from '@/components/shared/KPICard'
import PrimaryButton from '@/components/shared/PrimaryButton'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'

export default function GSALBlock() {
  const { progress } = useJornadaProgress()
  const dia1Completo = progress && progress.current_day >= 2
  const [pipelineStats, setPipelineStats] = useState({
    lead: 0,
    avaliacao: 0,
    plano: 0,
    acompanhamento: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!dia1Completo) {
      setCarregando(false)
      return
    }

    const carregarStats = async () => {
      try {
        // Carregar contagens do pipeline por status
        const clientesRes = await fetch('/api/c/clientes', {
          credentials: 'include'
        })

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json()
          if (clientesData.success && clientesData.data?.clientes) {
            const clientes = clientesData.data.clientes
            
            // Contar por status do pipeline GSAL
            const stats = {
              lead: clientes.filter((c: any) => c.status === 'lead' || c.status === 'novo').length,
              avaliacao: clientes.filter((c: any) => c.status === 'avaliacao' || c.status === 'avaliando').length,
              plano: clientes.filter((c: any) => c.status === 'plano' || c.status === 'em_plano').length,
              acompanhamento: clientes.filter((c: any) => c.status === 'acompanhamento' || c.status === 'ativo').length
            }
            
            setPipelineStats(stats)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar stats GSAL:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarStats()
  }, [dia1Completo])

  // Se não completou Dia 1, mostrar card bloqueado
  if (!dia1Completo) {
    return (
      <Section
        title="📊 Gestão GSAL"
        subtitle="Gerar, Servir, Acompanhar, Lucrar"
      >
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔒 Complete o Dia 1 da Jornada
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              A Gestão GSAL será desbloqueada após você concluir o primeiro dia da sua jornada de transformação.
            </p>
            <PrimaryButton href="/pt/nutri/metodo/jornada/dia/1">
              Ir para o Dia 1 →
            </PrimaryButton>
          </div>
        </Card>
      </Section>
    )
  }

  return (
    <Section
      title="📊 Gestão GSAL"
      subtitle="Gerar, Servir, Acompanhar, Lucrar"
    >
      {/* Microcopy sobre LYA */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700">
          💡 <strong>Dica:</strong> A LYA usa os dados do seu GSAL para te orientar com precisão. 
          Mantenha seus números atualizados para receber orientações mais personalizadas.
        </p>
      </div>

      {/* Resumo Simplificado - Apenas números essenciais */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Resumo GSAL</h3>
            <p className="text-xs text-gray-500">
              Números essenciais do seu negócio
            </p>
          </div>
          <PrimaryButton href="/pt/nutri/gsal">
            Ver Detalhes
          </PrimaryButton>
        </div>

        {/* KPIs Essenciais - Apenas 4 números principais do pipeline GSAL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KPICard
            icon="🎯"
            value={carregando ? '...' : pipelineStats.lead}
            label="Leads"
          />
          <KPICard
            icon="📋"
            value={carregando ? '...' : pipelineStats.avaliacao}
            label="Avaliações"
          />
          <KPICard
            icon="📝"
            value={carregando ? '...' : pipelineStats.plano}
            label="Planos"
          />
          <KPICard
            icon="📊"
            value={carregando ? '...' : pipelineStats.acompanhamento}
            label="Acompanhamento"
          />
        </div>
      </Card>
    </Section>
  )
}

