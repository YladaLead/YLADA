'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DayCard from '@/components/jornada/DayCard'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import type { JourneyDay, JourneyStats } from '@/types/formacao'

interface JornadaSectionProps {
  /** Quando definido (ex.: /pt/med/trilha/jornada), links das etapas e conclusão usam este path em vez de Nutri. */
  basePath?: string
}

export default function JornadaSection({ basePath }: JornadaSectionProps = {}) {
  const [days, setDays] = useState<(JourneyDay & { progress: any; is_completed: boolean; is_locked: boolean })[]>([])
  const [stats, setStats] = useState<JourneyStats | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const { progress, refreshProgress } = useJornadaProgress()

  useEffect(() => {
    const carregarJornada = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Detectar qual rota usar baseado na URL atual
        const isFormacaoRoute = typeof window !== 'undefined' && (window.location.pathname.includes('/formacao') || window.location.pathname.includes('/trilha'))
        const apiRoute = isFormacaoRoute ? '/api/nutri/formacao/jornada' : '/api/nutri/metodo/jornada'
        
        const res = await fetch(apiRoute, {
          credentials: 'include'
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erro ao carregar jornada')
        }

        const data = await res.json()
        console.log('📊 Dados da API Jornada:', { 
          success: data.success, 
          daysCount: data.data?.days?.length || 0,
          days: data.data?.days || []
        })
        if (data.success && data.data) {
          setDays(data.data.days || [])
          setStats(data.data.stats || null)
          // Atualizar progresso local após carregar
          refreshProgress()
        } else {
          // Se não há dados ainda, inicializar com arrays vazios
          setDays([])
          setStats({
            total_days: 0,
            completed_days: 0,
            progress_percentage: 0,
            current_day: null,
            current_week: 1,
            week_progress: [
              { week: 1, completed: 0, total: 0, percentage: 0 },
              { week: 2, completed: 0, total: 0, percentage: 0 },
              { week: 3, completed: 0, total: 0, percentage: 0 },
              { week: 4, completed: 0, total: 0, percentage: 0 }
            ]
          })
        }
      } catch (error: any) {
        console.error('Erro ao carregar jornada:', error)
        // Verificar se é erro de tabela não existente
        const errorMessage = error.message || ''
        if (errorMessage.includes('does not exist') || errorMessage.includes('PGRST116')) {
          setErro('TABELA_NAO_EXISTE') // Flag especial para mostrar mensagem amigável
        } else {
          setErro(errorMessage || 'Erro ao carregar jornada')
        }
      } finally {
        setCarregando(false)
      }
    }

    carregarJornada()
  }, [])

  if (carregando) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando sua trilha...</p>
      </div>
    )
  }

  if (erro) {
    // Se não há dados ainda (tabelas não criadas), mostrar mensagem amigável
    if (erro === 'TABELA_NAO_EXISTE' || erro.includes('does not exist') || erro.includes('PGRST116')) {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Trilha em Preparação</h3>
          <p className="text-gray-700 mb-4">
            A estrutura da Trilha Empresarial está sendo configurada. Em breve você poderá iniciar sua transformação!
          </p>
          <p className="text-sm text-gray-600">
            Enquanto isso, explore o Método YLADA para conhecer a filosofia por trás de tudo.
          </p>
          <Link
            href="/pt/nutri/metodo/pilares"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Sobre o Método →
          </Link>
        </div>
      )
    }
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800">{erro}</p>
      </div>
    )
  }

  const semanas = [1, 2, 3, 4]

  return (
    <div className="space-y-8">
      {/* Barra de Progresso Geral — quando 100% concluído não mostra "Próximo etapa" */}
      {stats && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sua Trilha Empresarial</h2>
            <span className="text-lg font-semibold text-blue-600">
              {stats.completed_days} de {stats.total_days} etapas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress_percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {stats.progress_percentage}% concluído
          </p>
          {/* Só mostra "Próximo: Etapa X" se ainda houver etapa pendente (não mostrar Etapa 31 quando são 30 etapas) */}
          {stats.current_day != null && stats.completed_days < stats.total_days && stats.current_day <= stats.total_days && (
            <p className="text-sm text-blue-600 text-center mt-2 font-medium">
              Próximo: Etapa {stats.current_day}
            </p>
          )}
        </div>
      )}

      {/* Blocos (antes "semanas") — fluxo por etapas, sem vínculo a dias/calendário */}
      <div className="space-y-6">
        {semanas.map((semana) => {
          const etapasBloco = days.filter(d => d.week_number === semana)
          const blocoStats = stats?.week_progress.find(w => w.week === semana)

          return (
            <div key={semana} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bloco {semana}
                    {semana === 1 && ' — Base YLADA (Identidade & Mentalidade)'}
                    {semana === 2 && ' — Captação YLADA (Leads)'}
                    {semana === 3 && ' — Domínio da Rotina (Estrutura & Consistência)'}
                    {semana === 4 && ' — Crescimento & GSAL (Domínio da Profissão)'}
                  </h3>
                  {blocoStats && (
                    <p className="text-sm text-gray-600 mt-1">
                      {blocoStats.completed} de {blocoStats.total} etapas concluídas
                    </p>
                  )}
                </div>
                {blocoStats && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{blocoStats.percentage}%</div>
                    <div className="text-xs text-gray-500">Progresso</div>
                  </div>
                )}
              </div>

              {blocoStats && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${blocoStats.percentage}%` }}
                  ></div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {etapasBloco.length > 0 ? (
                  etapasBloco
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((day) => (
                      <DayCard
                        key={day.id}
                        day={{
                          day_number: day.day_number,
                          title: day.title,
                          is_completed: day.is_completed,
                          is_locked: false
                        }}
                        progress={progress}
                        currentDay={stats?.current_day || null}
                        basePath={basePath}
                      />
                    ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                    {days.length === 0
                      ? '⚠️ Execute as migrations no Supabase para carregar as etapas da trilha.'
                      : `Nenhuma etapa neste bloco.`
                    }
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensagem Motivacional */}
      {stats && stats.progress_percentage > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
          <p className="text-lg text-gray-800 font-medium text-center">
            {stats.progress_percentage === 100 ? (
              <>
                🎉 Parabéns! Você completou toda a Trilha Empresarial!
                <Link
                  href={basePath ? `${basePath}/concluida` : '/pt/nutri/metodo/jornada/concluida'}
                  className="block mt-4 text-blue-600 hover:text-blue-700 font-bold"
                >
                  Ver Certificado de Conclusão →
                </Link>
              </>
            ) : (
              `Continue assim! Você já completou ${stats.completed_days} ${stats.completed_days === 1 ? 'etapa' : 'etapas'}. Sua transformação está acontecendo!`
            )}
          </p>
        </div>
      )}
    </div>
  )
}
