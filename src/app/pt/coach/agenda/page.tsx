'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function CoachAgenda() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <CoachAgendaContent />
    </ProtectedRoute>
  )
}

type ViewMode = 'semanal' | 'mensal' | 'lista'

function CoachAgendaContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [consultas, setConsultas] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('semanal')
  const [dataAtual, setDataAtual] = useState(new Date())
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [consultaSelecionada, setConsultaSelecionada] = useState<any | null>(null)
  const [notificacoes, setNotificacoes] = useState<any[]>([])
  const [mostrarModalNovaConsulta, setMostrarModalNovaConsulta] = useState(false)
  const [dataHoraPreenchida, setDataHoraPreenchida] = useState<{ data?: Date; hora?: number } | null>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [carregandoClientes, setCarregandoClientes] = useState(false)

  // Carregar clientes
  useEffect(() => {
    if (!user) return

    const carregarClientes = async () => {
      try {
        setCarregandoClientes(true)
        const response = await fetch('/api/coach/clientes?limit=100&order=asc', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setClientes(data.data.clients || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      } finally {
        setCarregandoClientes(false)
      }
    }

    carregarClientes()
  }, [user])

  // Carregar consultas
  useEffect(() => {
    if (!user) return

    const carregarConsultas = async () => {
      try {
        setCarregando(true)
        const params = new URLSearchParams()
        
        // Para visualização semanal
        if (viewMode === 'semanal') {
          const inicioSemana = new Date(dataAtual)
          inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay())
          inicioSemana.setHours(0, 0, 0, 0)
          
          const fimSemana = new Date(inicioSemana)
          fimSemana.setDate(inicioSemana.getDate() + 6)
          fimSemana.setHours(23, 59, 59, 999)
          
          params.append('start_date', inicioSemana.toISOString())
          params.append('end_date', fimSemana.toISOString())
        } else if (viewMode === 'mensal') {
          const inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1)
          const fimMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0, 23, 59, 59)
          
          params.append('start_date', inicioMes.toISOString())
          params.append('end_date', fimMes.toISOString())
        }
        
        if (filtroStatus !== 'todos') {
          params.append('status', filtroStatus)
        }
        if (filtroTipo !== 'todos') {
          params.append('appointment_type', filtroTipo)
        }
        params.append('limit', '200')
        params.append('order', 'asc')

        const response = await fetch(`/api/coach/appointments?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar consultas')
        }

        const data = await response.json()
        if (data.success) {
          setConsultas(data.data.appointments || [])
          
          // Verificar notificações (consultas próximas em 15 minutos)
          const agora = new Date()
          const proximas = (data.data.appointments || []).filter((c: any) => {
            const inicio = new Date(c.start_time)
            const diff = (inicio.getTime() - agora.getTime()) / (1000 * 60) // minutos
            return diff > 0 && diff <= 15 && c.status !== 'concluido' && c.status !== 'cancelado'
          })
          setNotificacoes(proximas)
        }
      } catch (error: any) {
        console.error('Erro ao carregar consultas:', error)
        setErro(error.message || 'Erro ao carregar consultas')
      } finally {
        setCarregando(false)
      }
    }

    carregarConsultas()
    
    // Verificar notificações a cada minuto
    const interval = setInterval(() => {
      if (consultas.length > 0) {
        const agora = new Date()
        const proximas = consultas.filter((c: any) => {
          const inicio = new Date(c.start_time)
          const diff = (inicio.getTime() - agora.getTime()) / (1000 * 60)
          return diff > 0 && diff <= 15 && c.status !== 'concluido' && c.status !== 'cancelado'
        })
        setNotificacoes(proximas)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [user, viewMode, dataAtual, filtroStatus, filtroTipo])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendado: 'bg-purple-100 text-purple-800 border-purple-200',
      confirmado: 'bg-green-100 text-green-800 border-green-200',
      em_andamento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      concluido: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
      falta: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      falta: 'Falta'
    }
    return labels[status] || status
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      consulta: 'Consulta',
      retorno: 'Retorno',
      avaliacao: 'Avaliação',
      acompanhamento: 'Acompanhamento',
      outro: 'Outro'
    }
    return labels[tipo] || tipo
  }

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      consulta: '🏥',
      retorno: '🔄',
      avaliacao: '📊',
      acompanhamento: '📋',
      outro: '📝'
    }
    return icons[tipo] || '📅'
  }

  const navegarSemana = (direcao: 'anterior' | 'proxima') => {
    const novaData = new Date(dataAtual)
    if (direcao === 'anterior') {
      novaData.setDate(novaData.getDate() - 7)
    } else {
      novaData.setDate(novaData.getDate() + 7)
    }
    setDataAtual(novaData)
  }

  const navegarMes = (direcao: 'anterior' | 'proxima') => {
    const novaData = new Date(dataAtual)
    if (direcao === 'anterior') {
      novaData.setMonth(novaData.getMonth() - 1)
    } else {
      novaData.setMonth(novaData.getMonth() + 1)
    }
    setDataAtual(novaData)
  }

  const irParaHoje = () => {
    setDataAtual(new Date())
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || !active.data.current) return

    const consultaId = active.id as string
    const novoSlot = over.id as string // formato: "2024-01-15-14:00"

    // Parse do novo slot (data e hora)
    const [data, hora] = novoSlot.split('-')
    const [ano, mes, dia] = data.split('-')
    const [h, m] = hora.split(':')
    
    const novaDataInicio = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(h), parseInt(m))
    const novaDataFim = new Date(novaDataInicio)
    novaDataFim.setMinutes(novaDataFim.getMinutes() + 60) // padrão 1 hora

    try {
      const response = await fetch(`/api/coach/appointments/${consultaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          start_time: novaDataInicio.toISOString(),
          end_time: novaDataFim.toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao reagendar consulta')
      }

      // Recarregar consultas
      window.location.reload()
    } catch (error: any) {
      console.error('Erro ao reagendar:', error)
      alert('Erro ao reagendar consulta. Tente novamente.')
    }
  }

  const obterDiasSemana = () => {
    const inicioSemana = new Date(dataAtual)
    inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay())
    inicioSemana.setHours(0, 0, 0, 0)
    
    const dias = []
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana)
      dia.setDate(inicioSemana.getDate() + i)
      dias.push(dia)
    }
    return dias
  }

  const obterConsultasDoDia = (dia: Date) => {
    return consultas.filter(c => {
      const dataConsulta = new Date(c.start_time)
      return dataConsulta.toDateString() === dia.toDateString()
    })
  }

  const obterConsultasDoMes = () => {
    const consultasPorDia: Record<string, any[]> = {}
    consultas.forEach(c => {
      const data = new Date(c.start_time)
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
      if (!consultasPorDia[chave]) {
        consultasPorDia[chave] = []
      }
      consultasPorDia[chave].push(c)
    })
    return consultasPorDia
  }

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Agenda</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600 mt-1">Gerencie todas as suas consultas em um só lugar</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDataHoraPreenchida(null)
                  setMostrarModalNovaConsulta(true)
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                + Nova Consulta
              </button>
            </div>
          </div>

          {/* Notificações de consultas próximas */}
          {notificacoes.length > 0 && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔔</span>
                <h3 className="font-semibold text-yellow-900">Consultas próximas (15 minutos)</h3>
              </div>
              <div className="space-y-2">
                {notificacoes.map((notif) => {
                  const inicio = new Date(notif.start_time)
                  const minutos = Math.floor((inicio.getTime() - new Date().getTime()) / (1000 * 60))
                  return (
                    <div key={notif.id} className="flex items-center justify-between bg-white rounded p-2">
                      <div>
                        <span className="font-medium">{notif.title}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          - {typeof notif.clients === 'object' && notif.clients ? notif.clients.name : 'Cliente'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-yellow-800">
                        Em {minutos} min
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Controles de Visualização */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Modo de visualização */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('semanal')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'semanal'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semanal
                </button>
                <button
                  onClick={() => setViewMode('mensal')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'mensal'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setViewMode('lista')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'lista'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lista
                </button>
              </div>

              {/* Navegação de data */}
              {viewMode !== 'lista' && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => viewMode === 'semanal' ? navegarSemana('anterior') : navegarMes('anterior')}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={irParaHoje}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Hoje
                  </button>
                  <span className="text-sm font-medium text-gray-900 min-w-[200px] text-center">
                    {viewMode === 'semanal'
                      ? `Semana de ${obterDiasSemana()[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${obterDiasSemana()[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`
                      : dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => viewMode === 'semanal' ? navegarSemana('proxima') : navegarMes('proxima')}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Filtros */}
              <div className="flex gap-2">
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="todos">Todos os status</option>
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="acompanhamento">Acompanhamento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo da Agenda */}
          {viewMode === 'semanal' && (
            <CalendarioSemanal
              dias={obterDiasSemana()}
              consultas={consultas}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getTipoLabel={getTipoLabel}
              getTipoIcon={getTipoIcon}
              onConsultaClick={setConsultaSelecionada}
              onCelulaVaziaClick={(dia, hora) => {
                setDataHoraPreenchida({ data: dia, hora })
                setMostrarModalNovaConsulta(true)
              }}
            />
          )}

          {viewMode === 'mensal' && (
            <CalendarioMensal
              dataAtual={dataAtual}
              consultasPorDia={obterConsultasDoMes()}
              getStatusColor={getStatusColor}
              getTipoIcon={getTipoIcon}
              onConsultaClick={setConsultaSelecionada}
              onDiaClick={(dia) => {
                setDataHoraPreenchida({ data: dia })
                setMostrarModalNovaConsulta(true)
              }}
            />
          )}

          {viewMode === 'lista' && (
            <ListaConsultas
              consultas={consultas}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getTipoLabel={getTipoLabel}
              onConsultaClick={setConsultaSelecionada}
            />
          )}

          {/* Modal de Nova Consulta */}
          {mostrarModalNovaConsulta && (
            <ModalNovaConsulta
              clientes={clientes}
              carregandoClientes={carregandoClientes}
              dataHoraPreenchida={dataHoraPreenchida}
              onClose={() => {
                setMostrarModalNovaConsulta(false)
                setDataHoraPreenchida(null)
              }}
              onSuccess={() => {
                setMostrarModalNovaConsulta(false)
                setDataHoraPreenchida(null)
                // Recarregar consultas
                window.location.reload()
              }}
            />
          )}

          {/* Modal de Detalhes */}
          {consultaSelecionada && (
            <ModalDetalhesConsulta
              consulta={consultaSelecionada}
              onClose={() => setConsultaSelecionada(null)}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getTipoLabel={getTipoLabel}
              router={router}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Componente: Calendário Semanal
function CalendarioSemanal({
  dias,
  consultas,
  getStatusColor,
  getStatusLabel,
  getTipoLabel,
  getTipoIcon,
  onConsultaClick,
  onCelulaVaziaClick
}: {
  dias: Date[]
  consultas: any[]
  getStatusColor: (s: string) => string
  getStatusLabel: (s: string) => string
  getTipoLabel: (s: string) => string
  getTipoIcon: (s: string) => string
  onConsultaClick: (c: any) => void
  onCelulaVaziaClick?: (dia: Date, hora: number) => void
}) {
  const horas = Array.from({ length: 24 }, (_, i) => i)

  const obterConsultasDoDiaHora = (dia: Date, hora: number) => {
    return consultas.filter(c => {
      const dataConsulta = new Date(c.start_time)
      return (
        dataConsulta.toDateString() === dia.toDateString() &&
        dataConsulta.getHours() === hora
      )
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-3 border-r border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
          Hora
        </div>
        {dias.map((dia, idx) => (
          <div
            key={idx}
            className={`p-3 border-r border-gray-200 text-center ${
              dia.toDateString() === new Date().toDateString()
                ? 'bg-purple-50 font-semibold'
                : 'bg-gray-50'
            }`}
          >
            <div className="text-xs text-gray-600">
              {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {dia.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {horas.map((hora) => (
          <div key={hora} className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-2 border-r border-gray-200 text-xs text-gray-500 text-center">
              {String(hora).padStart(2, '0')}:00
            </div>
            {dias.map((dia, diaIdx) => {
              const consultasSlot = obterConsultasDoDiaHora(dia, hora)
              return (
                <div
                  key={diaIdx}
                  className="p-1 border-r border-gray-100 min-h-[60px] bg-white relative group cursor-pointer"
                  onClick={() => {
                    if (consultasSlot.length === 0 && onCelulaVaziaClick) {
                      onCelulaVaziaClick(dia, hora)
                    }
                  }}
                >
                  {consultasSlot.length === 0 && onCelulaVaziaClick && (
                    <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 hover:bg-purple-50 transition-opacity flex items-center justify-center text-purple-600 text-xs font-medium pointer-events-none">
                      + Clique para adicionar
                    </div>
                  )}
                  {consultasSlot.map((consulta) => {
                    const inicio = new Date(consulta.start_time)
                    const fim = new Date(consulta.end_time)
                    const duracao = (fim.getTime() - inicio.getTime()) / (1000 * 60)
                    return (
                      <div
                        key={consulta.id}
                        onClick={() => onConsultaClick(consulta)}
                        className={`mb-1 p-2 rounded border cursor-pointer hover:shadow-md transition-shadow text-xs ${getStatusColor(consulta.status)}`}
                        style={{ minHeight: `${Math.max(duracao / 15 * 15, 30)}px` }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span>{getTipoIcon(consulta.appointment_type)}</span>
                          <span className="font-medium truncate">
                            {consulta.title || 'Consulta'}
                          </span>
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {typeof consulta.clients === 'object' && consulta.clients
                            ? consulta.clients.name
                            : 'Cliente'}
                        </div>
                        <div className="text-xs opacity-75">
                          {inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente: Calendário Mensal
function CalendarioMensal({
  dataAtual,
  consultasPorDia,
  getStatusColor,
  getTipoIcon,
  onConsultaClick,
  onDiaClick
}: {
  dataAtual: Date
  consultasPorDia: Record<string, any[]>
  getStatusColor: (s: string) => string
  getTipoIcon: (s: string) => string
  onConsultaClick: (c: any) => void
  onDiaClick?: (dia: Date) => void
}) {
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1)
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0)
  const diasNoMes = ultimoDia.getDate()
  const diaInicioSemana = primeiroDia.getDay()

  const dias = []
  // Dias vazios no início
  for (let i = 0; i < diaInicioSemana; i++) {
    dias.push(null)
  }
  // Dias do mês
  for (let i = 1; i <= diasNoMes; i++) {
    dias.push(new Date(dataAtual.getFullYear(), dataAtual.getMonth(), i))
  }

  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {nomesDias.map((dia) => (
          <div key={dia} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia, idx) => {
          if (!dia) {
            return <div key={idx} className="min-h-[100px] border-r border-b border-gray-100 bg-gray-50" />
          }
          
          const chave = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, '0')}-${String(dia.getDate()).padStart(2, '0')}`
          const consultas = consultasPorDia[chave] || []
          const ehHoje = dia.toDateString() === new Date().toDateString()

          return (
            <div
              key={idx}
              className={`min-h-[100px] border-r border-b border-gray-100 p-2 relative group ${
                ehHoje ? 'bg-purple-50' : 'bg-white'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${ehHoje ? 'text-purple-700' : 'text-gray-900'}`}>
                {dia.getDate()}
              </div>
              {onDiaClick && (
                <button
                  onClick={() => onDiaClick(dia)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-opacity"
                  title={`Criar consulta em ${dia.toLocaleDateString('pt-BR')}`}
                >
                  +
                </button>
              )}
              <div className="space-y-1">
                {consultas.slice(0, 3).map((consulta) => (
                  <div
                    key={consulta.id}
                    onClick={() => onConsultaClick(consulta)}
                    className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow truncate ${getStatusColor(consulta.status)}`}
                  >
                    <span className="mr-1">{getTipoIcon(consulta.appointment_type)}</span>
                    {consulta.title || 'Consulta'}
                  </div>
                ))}
                {consultas.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{consultas.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente: Lista de Consultas
function ListaConsultas({
  consultas,
  getStatusColor,
  getStatusLabel,
  getTipoLabel,
  onConsultaClick
}: {
  consultas: any[]
  getStatusColor: (s: string) => string
  getStatusLabel: (s: string) => string
  getTipoLabel: (s: string) => string
  onConsultaClick: (c: any) => void
}) {
  if (consultas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600 mb-4">Nenhuma consulta encontrada.</p>
        <p className="text-sm text-gray-500">
          Agende consultas na página de detalhes do cliente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {consultas.map((consulta) => (
        <div
          key={consulta.id}
          onClick={() => onConsultaClick(consulta)}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{consulta.title || 'Consulta'}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                  {getStatusLabel(consulta.status)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Cliente:</span>{' '}
                  {typeof consulta.clients === 'object' && consulta.clients
                    ? consulta.clients.name
                    : 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Data/Hora:</span>{' '}
                  {new Date(consulta.start_time).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div>
                  <span className="font-medium">Tipo:</span> {getTipoLabel(consulta.appointment_type)}
                </div>
                {consulta.duration_minutes && (
                  <div>
                    <span className="font-medium">Duração:</span> {consulta.duration_minutes} minutos
                  </div>
                )}
              </div>
              {consulta.description && (
                <p className="mt-2 text-sm text-gray-700">{consulta.description}</p>
              )}
              {consulta.location_url && (
                <a
                  href={consulta.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-block text-sm text-purple-600 hover:text-purple-700"
                >
                  🔗 Acessar link da reunião
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente: Modal de Nova Consulta
function ModalNovaConsulta({
  clientes,
  carregandoClientes,
  dataHoraPreenchida,
  onClose,
  onSuccess
}: {
  clientes: any[]
  carregandoClientes: boolean
  dataHoraPreenchida: { data?: Date; hora?: number } | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mostrarModalNovoCliente, setMostrarModalNovoCliente] = useState(false)
  const [listaClientes, setListaClientes] = useState(clientes)

  // Preparar data/hora inicial
  const dataInicial = dataHoraPreenchida?.data || new Date()
  const horaInicial = dataHoraPreenchida?.hora !== undefined ? dataHoraPreenchida.hora : new Date().getHours()
  const minutoInicial = new Date().getMinutes()

  // Formatar data para datetime-local
  const formatarDataHora = (data: Date, hora: number, minuto: number) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const horaStr = String(hora).padStart(2, '0')
    const minutoStr = String(minuto).padStart(2, '0')
    return `${ano}-${mes}-${dia}T${horaStr}:${minutoStr}`
  }

  const [formData, setFormData] = useState({
    client_id: '',
    title: 'Consulta',
    description: '',
    appointment_type: 'consulta',
    start_time: formatarDataHora(dataInicial, horaInicial, minutoInicial),
    end_time: formatarDataHora(dataInicial, horaInicial + 1, minutoInicial),
    location_type: 'online',
    location_address: '',
    location_url: '',
    notes: ''
  })

  // Atualizar lista de clientes quando prop mudar
  useEffect(() => {
    setListaClientes(clientes)
  }, [clientes])

  const criarClienteRapido = async (dadosCliente: { name: string; email?: string; phone?: string }) => {
    try {
      const response = await fetch('/api/coach/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: dadosCliente.name,
          email: dadosCliente.email || null,
          phone: dadosCliente.phone || null,
          status: 'ativa' // Criar já como cliente ativo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cliente')
      }

      if (data.success && data.data.client) {
        // Adicionar novo cliente à lista
        setListaClientes(prev => [...prev, data.data.client])
        // Selecionar o novo cliente automaticamente
        setFormData(prev => ({
          ...prev,
          client_id: data.data.client.id
        }))
        setMostrarModalNovoCliente(false)
        setMensagemSucesso('Cliente criado e selecionado!')
        setTimeout(() => setMensagemSucesso(null), 3000)
      }
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      setErro(error.message || 'Erro ao criar cliente. Tente novamente.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!formData.client_id) {
      setErro('Selecione um cliente')
      return
    }

    if (!formData.start_time || !formData.end_time) {
      setErro('Data e hora são obrigatórias')
      return
    }

    setSalvando(true)

    try {
      const response = await fetch('/api/coach/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          client_id: formData.client_id,
          title: formData.title,
          description: formData.description || null,
          appointment_type: formData.appointment_type,
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
          location_type: formData.location_type,
          location_address: formData.location_address || null,
          location_url: formData.location_url || null,
          notes: formData.notes || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar consulta')
      }

      if (data.success) {
        setMensagemSucesso('Consulta agendada com sucesso!')
        setTimeout(() => {
          onSuccess()
        }, 1000)
      }
    } catch (error: any) {
      console.error('Erro ao criar consulta:', error)
      setErro(error.message || 'Erro ao criar consulta. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Nova Consulta</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mensagemSucesso && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800">{mensagemSucesso}</p>
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                Cliente *
              </label>
              <button
                type="button"
                onClick={() => setMostrarModalNovoCliente(true)}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <span>+</span>
                Novo Cliente
              </button>
            </div>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
              disabled={carregandoClientes}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">{carregandoClientes ? 'Carregando clientes...' : 'Selecione um cliente'}</option>
              {listaClientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Consulta inicial"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora Início *
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora Fim *
              </label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointment_type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                id="appointment_type"
                name="appointment_type"
                value={formData.appointment_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="consulta">Consulta</option>
                <option value="retorno">Retorno</option>
                <option value="avaliacao">Avaliação</option>
                <option value="acompanhamento">Acompanhamento</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Localização *
              </label>
              <select
                id="location_type"
                name="location_type"
                value={formData.location_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="domicilio">Domicílio</option>
              </select>
            </div>
          </div>

          {formData.location_type === 'presencial' && (
            <div>
              <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                id="location_address"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Endereço completo"
              />
            </div>
          )}

          {formData.location_type === 'online' && (
            <div>
              <label htmlFor="location_url" className="block text-sm font-medium text-gray-700 mb-2">
                Link da Reunião
              </label>
              <input
                type="url"
                id="location_url"
                name="location_url"
                value={formData.location_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Observações sobre a consulta..."
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas Internas
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Notas que só você verá..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
            >
              {salvando ? 'Agendando...' : 'Agendar Consulta'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Novo Cliente Rápido */}
      {mostrarModalNovoCliente && (
        <ModalNovoClienteRapido
          onClose={() => setMostrarModalNovoCliente(false)}
          onCriar={criarClienteRapido}
        />
      )}
    </div>
  )
}

// Componente: Modal de Novo Cliente Rápido
function ModalNovoClienteRapido({
  onClose,
  onCriar
}: {
  onClose: () => void
  onCriar: (dados: { name: string; email?: string; phone?: string }) => Promise<void>
}) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!formData.name.trim()) {
      setErro('Nome é obrigatório')
      return
    }

    setSalvando(true)
    try {
      await onCriar({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined
      })
      // Limpar formulário
      setFormData({ name: '', email: '', phone: '' })
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar cliente')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Novo Cliente</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{erro}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: maria@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ex: (11) 99999-9999"
            />
          </div>

          <p className="text-xs text-gray-500">
            * Campos obrigatórios. Você pode completar os dados depois no perfil do cliente.
          </p>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
            >
              {salvando ? 'Criando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente: Modal de Detalhes
function ModalDetalhesConsulta({
  consulta,
  onClose,
  getStatusColor,
  getStatusLabel,
  getTipoLabel,
  router
}: {
  consulta: any
  onClose: () => void
  getStatusColor: (s: string) => string
  getStatusLabel: (s: string) => string
  getTipoLabel: (s: string) => string
  router: any
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{consulta.title || 'Consulta'}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                  {getStatusLabel(consulta.status)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Tipo:</span>
              <p className="mt-1 text-sm text-gray-900">{getTipoLabel(consulta.appointment_type)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Cliente:</span>
              <p className="mt-1 text-sm text-gray-900">
                {typeof consulta.clients === 'object' && consulta.clients
                  ? consulta.clients.name
                  : 'Não informado'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Data/Hora:</span>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(consulta.start_time).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {consulta.duration_minutes && (
              <div>
                <span className="text-sm font-medium text-gray-700">Duração:</span>
                <p className="mt-1 text-sm text-gray-900">{consulta.duration_minutes} minutos</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-700">Localização:</span>
              <p className="mt-1 text-sm text-gray-900">
                {consulta.location_type === 'online' ? 'Online' : consulta.location_type === 'domicilio' ? 'Domicílio' : 'Presencial'}
              </p>
            </div>
          </div>
          {consulta.description && (
            <div>
              <span className="text-sm font-medium text-gray-700">Descrição:</span>
              <p className="mt-1 text-sm text-gray-900">{consulta.description}</p>
            </div>
          )}
          {consulta.location_url && (
            <div>
              <a
                href={consulta.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                🔗 Acessar link da reunião
              </a>
            </div>
          )}
          {consulta.notes && (
            <div>
              <span className="text-sm font-medium text-gray-700">Observações:</span>
              <p className="mt-1 text-sm text-gray-900">{consulta.notes}</p>
            </div>
          )}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (typeof consulta.clients === 'object' && consulta.clients) {
                  router.push(`/pt/coach/clientes/${consulta.clients.id}`)
                }
                onClose()
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Ver Cliente
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
