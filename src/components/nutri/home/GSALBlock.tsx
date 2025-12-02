'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import KPICard from '@/components/shared/KPICard'
import PrimaryButton from '@/components/shared/PrimaryButton'

export default function GSALBlock() {
  const [stats, setStats] = useState({
    clientesAtivos: 0,
    novosClientes: 0,
    consultasMes: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const res = await fetch('/api/nutri/dashboard', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          if (data.stats) {
            setStats({
              clientesAtivos: data.stats.clientesAtivos || 0,
              novosClientes: 0, // TODO: calcular novos clientes do mês
              consultasMes: 0 // TODO: calcular consultas do mês
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar stats GSAL:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarStats()
  }, [])

  return (
    <Section
      title="📊 Gestão GSAL"
      subtitle="Gerar, Servir, Acompanhar, Lucrar"
    >
      {/* Resumo */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Resumo GSAL</h3>
            <p className="text-sm text-gray-600">
              {carregando ? 'Carregando...' : `Clientes ativos: ${stats.clientesAtivos} • Novos: ${stats.novosClientes}`}
            </p>
          </div>
          <PrimaryButton href="/pt/nutri/gsal">
            Acessar Painel de Gestão
          </PrimaryButton>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <KPICard
            icon="👥"
            value={stats.clientesAtivos}
            label="Clientes Ativos"
          />
          <KPICard
            icon="🆕"
            value={stats.novosClientes}
            label="Novos Clientes"
          />
          <KPICard
            icon="📅"
            value={stats.consultasMes}
            label="Consultas do Mês"
          />
        </div>
      </Card>

      {/* Pipeline Visual */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Pipeline de Acompanhamento</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-xs font-medium text-gray-700">Lead</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-xs font-medium text-gray-700">Avaliação</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-xs font-medium text-gray-700">Plano</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs font-medium text-gray-700">Acompanhamento</p>
          </div>
        </div>
      </Card>
    </Section>
  )
}

