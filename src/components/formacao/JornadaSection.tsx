'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { JourneyDay, JourneyStats } from '@/types/formacao'

export default function JornadaSection() {
  const [days, setDays] = useState<(JourneyDay & { progress: any; is_completed: boolean; is_locked: boolean })[]>([])
  const [stats, setStats] = useState<JourneyStats | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarJornada = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Detectar qual rota usar baseado na URL atual
        const isFormacaoRoute = typeof window !== 'undefined' && window.location.pathname.includes('/formacao')
        const apiRoute = isFormacaoRoute ? '/api/nutri/formacao/jornada' : '/api/nutri/metodo/jornada'
        
        const res = await fetch(apiRoute, {
          credentials: 'include'
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erro ao carregar jornada')
        }

        const data = await res.json()
        if (data.success && data.data) {
          setDays(data.data.days || [])
          setStats(data.data.stats || null)
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
        <p className="text-gray-600">Carregando sua jornada...</p>
      </div>
    )
  }

  if (erro) {
    // Se não há dados ainda (tabelas não criadas), mostrar mensagem amigável
    if (erro === 'TABELA_NAO_EXISTE' || erro.includes('does not exist') || erro.includes('PGRST116')) {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Jornada em Preparação</h3>
          <p className="text-gray-700 mb-4">
            A estrutura da Jornada de 30 Dias está sendo configurada. Em breve você poderá iniciar sua transformação!
          </p>
          <p className="text-sm text-gray-600">
            Enquanto isso, explore os Pilares do Método YLADA para começar sua jornada.
          </p>
          <Link
            href="/pt/nutri/metodo/pilares"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Pilares do Método →
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
      {/* Barra de Progresso Geral */}
      {stats && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sua Jornada YLADA</h2>
            <span className="text-lg font-semibold text-blue-600">
              {stats.completed_days} de {stats.total_days} dias
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
          {stats.current_day && (
            <p className="text-sm text-blue-600 text-center mt-2 font-medium">
              Próximo: Dia {stats.current_day}
            </p>
          )}
        </div>
      )}

      {/* Semanas */}
      <div className="space-y-6">
        {semanas.map((semana) => {
          const diasSemana = days.filter(d => d.week_number === semana)
          const semanaStats = stats?.week_progress.find(w => w.week === semana)
          const isWeekLocked = semana > 1 && stats?.week_progress.find(w => w.week === semana - 1)?.percentage !== 100

          return (
            <div key={semana} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              {/* Cabeçalho da Semana */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Semana {semana}
                    {semana === 1 && ' — Base YLADA (Identidade & Mentalidade)'}
                    {semana === 2 && ' — Captação YLADA (Leads Diários)'}
                    {semana === 3 && ' — Domínio da Rotina YLADA (Estrutura & Consistência)'}
                    {semana === 4 && ' — Crescimento & GSAL (Domínio da Profissão)'}
                  </h3>
                  {semanaStats && (
                    <p className="text-sm text-gray-600 mt-1">
                      {semanaStats.completed} de {semanaStats.total} dias concluídos
                    </p>
                  )}
                </div>
                {semanaStats && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{semanaStats.percentage}%</div>
                    <div className="text-xs text-gray-500">Progresso</div>
                  </div>
                )}
              </div>

              {/* Barra de Progresso da Semana */}
              {semanaStats && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${semanaStats.percentage}%` }}
                  ></div>
                </div>
              )}

              {/* Dias da Semana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {diasSemana.map((day) => (
                  <Link
                    key={day.id}
                    href={`/pt/nutri/metodo/jornada/dia/${day.day_number}`}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all
                      ${day.is_completed
                        ? 'bg-green-50 border-green-300 hover:border-green-400'
                        : day.is_locked || isWeekLocked
                        ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                        : day.day_number === stats?.current_day
                        ? 'bg-blue-50 border-blue-400 hover:border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }
                    `}
                  >
                    {day.is_completed && (
                      <div className="absolute top-2 right-2">
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                    )}
                    {day.is_locked && (
                      <div className="absolute top-2 right-2">
                        <span className="text-gray-400 text-lg">🔒</span>
                      </div>
                    )}
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${
                        day.is_completed ? 'text-green-700' :
                        day.is_locked ? 'text-gray-400' :
                        day.day_number === stats?.current_day ? 'text-blue-700' :
                        'text-gray-700'
                      }`}>
                        {day.day_number}
                      </div>
                      <div className="text-xs font-medium text-gray-600 line-clamp-2">
                        {day.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {isWeekLocked && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Conclua a semana anterior para desbloquear
                </p>
              )}
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
                🎉 Parabéns! Você completou toda a Jornada YLADA!
                <Link
                  href="/pt/nutri/metodo/jornada/concluida"
                  className="block mt-4 text-blue-600 hover:text-blue-700 font-bold"
                >
                  Ver Certificado de Conclusão →
                </Link>
              </>
            ) : (
              `Continue assim! Você já completou ${stats.completed_days} ${stats.completed_days === 1 ? 'dia' : 'dias'}. Sua transformação está acontecendo!`
            )}
          </p>
        </div>
      )}
    </div>
  )
}

