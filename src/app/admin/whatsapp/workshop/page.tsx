'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type WorkshopSettings = {
  id: string
  area: string
  flyer_url: string | null
  flyer_caption: string | null
}

type WorkshopSession = {
  id: string
  area: string
  title: string
  starts_at: string
  zoom_link: string
  is_active: boolean
  confirmed_participants?: number
}

type Participant = {
  conversationId: string
  phone: string
  name: string | null
  hasParticipated: boolean
  hasNotParticipated: boolean
  tags: string[]
  createdAt: string
  lastMessageAt: string | null
}

function formatDateTimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatPtBR(iso: string) {
  const d = new Date(iso)
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${weekday}, ${date} • ${time}`
}

function WorkshopContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<WorkshopSettings | null>(null)
  const [sessions, setSessions] = useState<WorkshopSession[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [flyerUrl, setFlyerUrl] = useState('')
  const [flyerCaption, setFlyerCaption] = useState('')

  const [newTitle, setNewTitle] = useState('Aula prática exclusiva para nutricionistas')
  const [newStartsAt, setNewStartsAt] = useState('')
  const [newZoomLink, setNewZoomLink] = useState('')
  const [newActive, setNewActive] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar')
  // Se hoje for domingo, já mostra a próxima semana (que começa na segunda)
  const getInitialWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = domingo, 1 = segunda, etc.
    return dayOfWeek === 0 ? 1 : 0 // Se domingo, próxima semana; senão, semana atual
  }
  const [currentWeek, setCurrentWeek] = useState(getInitialWeek()) // 0 = esta semana, 1 = próxima, -1 = anterior, etc.
  const [selectedSessionForParticipants, setSelectedSessionForParticipants] = useState<WorkshopSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [showPastSessions, setShowPastSessions] = useState(false)
  const [selectedForLembrete, setSelectedForLembrete] = useState<Set<string>>(new Set())
  const [sendingLembrete, setSendingLembrete] = useState(false)
  const [lembreteResult, setLembreteResult] = useState<{ sent: number; errors?: string[] } | null>(null)
  const [reenviandoRemarketing, setReenviandoRemarketing] = useState<Set<string>>(new Set())

  const upcoming = useMemo(
    () => sessions.filter((s) => s.is_active).sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [sessions]
  )

  useEffect(() => {
    if (selectedSessionForParticipants) {
      setSelectedForLembrete(new Set())
      setLembreteResult(null)
    }
  }, [selectedSessionForParticipants])

  // Função para obter sessões da semana atual
  const getWeekSessions = (weekOffset: number = 0) => {
    const now = new Date()
    // Calcular segunda-feira da semana (getDay() retorna 0=domingo, 1=segunda, etc)
    const currentDay = now.getDay()
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1 // Se domingo, volta 6 dias; senão, volta (dia-1)
    
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - daysToMonday + (weekOffset * 7))
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setMinutes(0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const filtered = sessions.filter(s => {
      const sessionDate = new Date(s.starts_at)
      // Comparar apenas data (ignorar timezone)
      const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate())
      const weekStartOnly = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
      const weekEndOnly = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate())
      return sessionDateOnly >= weekStartOnly && sessionDateOnly <= weekEndOnly
    })
    
    console.log('[Workshop] getWeekSessions:', {
      totalSessions: sessions.length,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      filteredCount: filtered.length,
      filtered: filtered.map(s => ({ id: s.id, starts_at: s.starts_at }))
    })
    
    return filtered.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
  }

  // Organizar sessões por dia e horário
  const organizeSessionsByDay = (weekSessions: WorkshopSession[]) => {
    const organized: Record<string, Record<string, WorkshopSession[]>> = {}
    
    // Mapear nomes dos dias em português
    const dayNames: Record<number, string> = {
      0: 'Domingo',
      1: 'Segunda-feira',
      2: 'Terça-feira',
      3: 'Quarta-feira',
      4: 'Quinta-feira',
      5: 'Sexta-feira',
      6: 'Sábado',
    }
    
    weekSessions.forEach(session => {
      const date = new Date(session.starts_at)
      const dayOfWeek = date.getDay()
      const dayKey = dayNames[dayOfWeek] || date.toLocaleDateString('pt-BR', { weekday: 'long' })
      
      // Formatar horário como HH:MM (2 dígitos)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const timeKey = `${hours}:${minutes}`
      
      if (!organized[dayKey]) organized[dayKey] = {}
      if (!organized[dayKey][timeKey]) organized[dayKey][timeKey] = []
      organized[dayKey][timeKey].push(session)
    })
    
    return organized
  }

  // Obter data da semana
  const getWeekDateRange = (weekOffset: number = 0) => {
    const now = new Date()
    const currentDay = now.getDay()
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
    
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - daysToMonday + (weekOffset * 7))
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return {
      start: weekStart,
      end: weekEnd,
      startStr: weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      endStr: weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    }
  }

  const loadAll = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const [settingsRes, sessionsRes] = await Promise.all([
        fetch('/api/admin/whatsapp/workshop-settings', { credentials: 'include' }),
        fetch('/api/admin/whatsapp/workshop-sessions', { credentials: 'include' }),
      ])
      const settingsJson = await settingsRes.json()
      const sessionsJson = await sessionsRes.json()

      if (!settingsRes.ok) throw new Error(settingsJson.error || 'Erro ao carregar settings')
      if (!sessionsRes.ok) throw new Error(sessionsJson.error || 'Erro ao carregar sessões')

      setSettings(settingsJson.settings)
      // Mostrar TODAS as sessões (não filtrar por participantes)
      setSessions(sessionsJson.sessions || [])

      setFlyerUrl(settingsJson.settings?.flyer_url || '')
      setFlyerCaption(settingsJson.settings?.flyer_caption || '')
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const uploadFlyer = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/community/upload', {
      method: 'POST',
      credentials: 'include',
      body: form,
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'Erro ao fazer upload do flyer')
    return json.url as string
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const res = await fetch('/api/admin/whatsapp/workshop-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          flyer_url: flyerUrl || null,
          flyer_caption: flyerCaption || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao salvar settings')
      setSettings(json.settings)
      setSuccess('Configurações salvas!')
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar settings')
    } finally {
      setSaving(false)
    }
  }

  const createSession = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!newStartsAt || !newZoomLink.trim()) {
        throw new Error('Preencha data/hora e link do Zoom')
      }

      const iso = new Date(newStartsAt).toISOString()
      const res = await fetch('/api/admin/whatsapp/workshop-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTitle,
          starts_at: iso,
          zoom_link: newZoomLink.trim(),
          is_active: newActive,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao criar sessão')
      setSuccess('Sessão criada!')
      setNewZoomLink('')
      setNewStartsAt('')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao criar sessão')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s: WorkshopSession) => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`/api/admin/whatsapp/workshop-sessions/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !s.is_active }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao atualizar sessão')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao atualizar sessão')
    } finally {
      setSaving(false)
    }
  }

  const deleteSession = async (s: WorkshopSession) => {
    if (!confirm('Deletar esta sessão?')) return
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`/api/admin/whatsapp/workshop-sessions/${s.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao deletar sessão')
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao deletar sessão')
    } finally {
      setSaving(false)
    }
  }

  const loadParticipants = async (session: WorkshopSession) => {
    try {
      setLoadingParticipants(true)
      setError(null)
      const res = await fetch(`/api/admin/whatsapp/workshop/participants?session_id=${session.id}`, {
        credentials: 'include',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao carregar participantes')
      setParticipants(json.participants || [])
      setSelectedSessionForParticipants(session)
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar participantes')
    } finally {
      setLoadingParticipants(false)
    }
  }

  const markParticipated = async (conversationId: string, participated: boolean) => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch('/api/admin/whatsapp/workshop/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, participated }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao marcar participação')
      setSuccess(json.message || 'Participação atualizada!')
      if (participated && json.linkSent === false && json.messageForManual) {
        setTimeout(() => {
          if (window.confirm('A mensagem automática não foi enviada. Clique em OK para copiar o texto e enviar manualmente no WhatsApp.')) {
            navigator.clipboard.writeText(json.messageForManual).then(() => alert('Texto copiado! Cole no WhatsApp e envie.'))
          }
        }, 500)
      }
      if (!participated && json.remarketingSent === false && json.remarketingError) {
        setError(`Remarketing não enviado: ${json.remarketingError}. Use "Reenviar remarketing" no card da pessoa para tentar de novo.`)
      }
      if (selectedSessionForParticipants) {
        await loadParticipants(selectedSessionForParticipants)
      }
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao marcar participação')
    } finally {
      setSaving(false)
    }
  }

  const reenviarRemarketing = async (conversationId: string) => {
    try {
      setReenviandoRemarketing((prev) => new Set(prev).add(conversationId))
      setError(null)
      const res = await fetch('/api/admin/whatsapp/workshop/participants/reenviar-remarketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, force: true }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = json.error || 'Erro ao reenviar remarketing'
        setError(msg)
        alert(msg)
        return
      }
      setSuccess(json.message || 'Remarketing reenviado!')
      if (selectedSessionForParticipants) {
        await loadParticipants(selectedSessionForParticipants)
      }
    } catch (e: any) {
      const msg = e.message || 'Erro ao reenviar remarketing'
      setError(msg)
      alert(msg)
    } finally {
      setReenviandoRemarketing((prev) => {
        const next = new Set(prev)
        next.delete(conversationId)
        return next
      })
    }
  }

  const removerAgendamento = async (conversationId: string) => {
    if (!selectedSessionForParticipants) return
    if (!confirm('Remover esta pessoa do agendamento desta aula? Ela deixará de constar como confirmada e poderá receber novas opções de horário.')) return
    try {
      setSaving(true)
      setError(null)
      const res = await fetch('/api/admin/whatsapp/workshop/participants/remover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId,
          sessionId: selectedSessionForParticipants.id,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao remover agendamento')
      setSuccess(json.message || 'Agendamento removido.')
      await loadParticipants(selectedSessionForParticipants)
      await loadAll()
    } catch (e: any) {
      setError(e.message || 'Erro ao remover agendamento')
    } finally {
      setSaving(false)
    }
  }

  type LembreteTipo = 'aula_hoje' | '30min' | '10min'
  const sendLembretes = async (tipo: LembreteTipo) => {
    if (!selectedSessionForParticipants) return
    const ids = selectedForLembrete.size > 0
      ? Array.from(selectedForLembrete)
      : participants.map((p) => p.conversationId)
    if (ids.length === 0) {
      alert('Nenhum participante selecionado.')
      return
    }
    const label = tipo === 'aula_hoje' ? 'Lembrete da aula de hoje' : tipo === '30min' ? '30 min antes' : '10 min antes'
    if (!confirm(`Enviar "${label}" para ${ids.length} participante(s) por WhatsApp?`)) return
    setSendingLembrete(true)
    setLembreteResult(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/whatsapp/workshop/participants/enviar-lembretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: selectedSessionForParticipants.id,
          conversationIds: ids,
          tipo,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Erro ao enviar lembretes')
      setLembreteResult({ sent: json.sent, errors: json.errors })
      setSuccess(`Enviado: ${json.sent} de ${json.total}. ${json.errors?.length ? `Erros: ${json.errors.length}` : ''}`)
    } catch (e: any) {
      setError(e.message || 'Erro ao enviar lembretes')
    } finally {
      setSendingLembrete(false)
    }
  }

  const toggleSelectAllLembrete = () => {
    if (selectedForLembrete.size >= participants.length) {
      setSelectedForLembrete(new Set())
    } else {
      setSelectedForLembrete(new Set(participants.map((p) => p.conversationId)))
    }
  }

  const toggleParticipantLembrete = (conversationId: string) => {
    setSelectedForLembrete((prev) => {
      const next = new Set(prev)
      if (next.has(conversationId)) next.delete(conversationId)
      else next.add(conversationId)
      return next
    })
  }

  const formatPhone = (phone: string) => {
    if (phone.length === 13 && phone.startsWith('55')) {
      const ddd = phone.substring(2, 4)
      const part1 = phone.substring(4, 9)
      const part2 = phone.substring(9)
      return `(${ddd}) ${part1}-${part2}`
    }
    return phone
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/admin/whatsapp" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Voltar
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Workshop (Nutri)</h1>
            <p className="text-xs text-gray-500">Agenda + Flyer padrão</p>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : (
          <>
            {/* AGENDA - PRIMEIRA SEÇÃO */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold text-gray-900 text-lg">Agenda (próximas aulas)</h2>
                    <Link
                      href="/admin/whatsapp/cadastros-workshop"
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                    >
                      📋 Cadastros
                    </Link>
                    {sessions.length > 0 && (
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        📊 Total de {sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''} cadastrada{sessions.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Sessões <span className="font-medium text-green-700">abertas</span> são divulgadas pela Carol. 
                    Sessões <span className="font-medium text-red-700">fechadas</span> não aparecem nas opções.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      viewMode === 'calendar'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📅 Agenda
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📋 Tabela
                  </button>
                <button
                  onClick={async () => {
                    try {
                      console.log('[Workshop] Iniciando geração de sessões...')
                      setSaving(true)
                      setError(null)
                      setSuccess(null)
                      
                      const res = await fetch('/api/admin/whatsapp/workshop/generate-sessions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ weeksAhead: 4 }),
                      })
                      
                      console.log('[Workshop] Resposta recebida:', res.status, res.statusText)
                      
                      let json: any = {}
                      try {
                        json = await res.json()
                        console.log('[Workshop] JSON recebido:', json)
                      } catch (parseError) {
                        console.error('[Workshop] Erro ao parsear JSON:', parseError)
                        const text = await res.text()
                        console.error('[Workshop] Resposta como texto:', text)
                        throw new Error('Resposta inválida do servidor')
                      }
                      
                      if (!res.ok) {
                        const errorMsg = json.error || json.details || `Erro HTTP ${res.status}`
                        console.error('[Workshop] Erro na resposta:', errorMsg)
                        throw new Error(errorMsg)
                      }
                      
                      if (json.created === 0) {
                        const errorMsg = '⚠️ Nenhuma sessão foi criada. Os links do Zoom estão fixos no código. Verifique se há sessões futuras para criar.'
                        console.warn('[Workshop]', errorMsg)
                        setError(errorMsg)
                      } else {
                        const successMsg = json.message || `✅ Criadas ${json.created} sessões!`
                        console.log('[Workshop] Sucesso:', successMsg)
                        setSuccess(successMsg)
                      }
                      
                      await loadAll()
                      // Voltar para semana atual após gerar
                      setCurrentWeek(0)
                    } catch (e: any) {
                      console.error('[Workshop] Erro capturado:', e)
                      const errorMsg = e.message || 'Erro ao gerar sessões. Verifique o console para mais detalhes.'
                      setError(errorMsg)
                      alert(`Erro: ${errorMsg}\n\nVerifique o console (F12) para mais detalhes.`)
                    } finally {
                      setSaving(false)
                      console.log('[Workshop] Finalizado')
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {saving ? 'Gerando...' : '🔄 Gerar Sessões Automáticas (4 semanas)'}
                </button>
                </div>
              </div>

              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                <strong>✅ Links do Zoom configurados:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Segunda-feira às 10:00 (usa link das 9:00)</li>
                  <li>Terça a Sexta às 9:00 (link das 9:00)</li>
                  <li>Segunda a Sexta às 15:00 (link das 15:00)</li>
                  <li>Segunda-feira às 20:00 (link específico)</li>
                  <li>Quarta-feira às 20:00 (link específico)</li>
                  <li>Quinta-feira às 20:00 (link específico)</li>
                </ul>
                <p className="mt-2 text-xs">
                  Os links estão fixos no sistema. Você pode gerar sessões automaticamente clicando no botão acima.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e hora</label>
                  <input
                    type="datetime-local"
                    value={newStartsAt}
                    onChange={(e) => setNewStartsAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700" title="Se marcado, a sessão será divulgada pela Carol. Se desmarcado, não aparecerá nas opções.">
                    <input
                      type="checkbox"
                      checked={newActive}
                      onChange={(e) => setNewActive(e.target.checked)}
                    />
                    <span className={newActive ? 'text-green-700 font-medium' : 'text-gray-500'}>
                      {newActive ? '✅ Aberta' : '🔒 Fechada'}
                    </span>
                  </label>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Zoom</label>
                  <input
                    value={newZoomLink}
                    onChange={(e) => setNewZoomLink(e.target.value)}
                    placeholder="https://us02web.zoom.us/j/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={createSession}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Visualização em Agenda Semanal */}
              {viewMode === 'calendar' && (() => {
                const weekSessions = getWeekSessions(currentWeek)
                const organized = organizeSessionsByDay(weekSessions)
                const weekRange = getWeekDateRange(currentWeek)
                const weekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']
                const fixedTimes = ['09:00', '10:00', '15:00', '20:00']

                return (
                  <div className="mt-4 space-y-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">📅 Agenda Semanal</h3>
                      <p className="text-xs text-gray-500">
                        {weekSessions.length > 0 
                          ? `${weekSessions.length} sessão${weekSessions.length !== 1 ? 'ões' : ''} nesta semana`
                          : 'Nenhuma sessão nesta semana'}
                      </p>
                    </div>
                    {/* Navegação da Semana */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setCurrentWeek(currentWeek - 1)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        ← Semana Anterior
                      </button>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900">
                          {currentWeek === 0
                            ? 'Esta Semana'
                            : currentWeek === -1
                              ? 'Semana anterior'
                              : currentWeek < -1
                                ? `${-currentWeek} semanas atrás`
                                : currentWeek === 1
                                  ? 'Próxima Semana'
                                  : `Daqui ${currentWeek} semana${currentWeek > 1 ? 's' : ''}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {weekRange.startStr} a {weekRange.endStr}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentWeek(currentWeek + 1)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Próxima Semana →
                      </button>
                    </div>

                    {/* Gerar Sessões da Semana */}
                    {weekSessions.length === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Nenhuma sessão cadastrada para esta semana. Clique em "Gerar Sessões" para criar automaticamente.
                          </p>
                          <button
                            onClick={async () => {
                              try {
                                setSaving(true)
                                setError(null)
                                setSuccess(null)
                                const res = await fetch('/api/admin/whatsapp/workshop/generate-sessions', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ weeksAhead: 1 }),
                                })
                                const json = await res.json().catch(() => ({}))
                                if (!res.ok) throw new Error(json.error || 'Erro ao gerar sessões')
                                setSuccess(json.message || `Criadas ${json.created} sessões!`)
                                await loadAll()
                                setCurrentWeek(0)
                              } catch (e: any) {
                                setError(e.message || 'Erro ao gerar sessões')
                              } finally {
                                setSaving(false)
                              }
                            }}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                          >
                            {saving ? 'Gerando...' : '🔄 Gerar Sessões desta Semana'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Agenda Semanal */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-700">Horário</th>
                            {weekdays.map(day => (
                              <th key={day} className="border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-medium text-gray-700">
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fixedTimes.map(time => (
                            <tr key={time}>
                              <td className="border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                                {time}
                              </td>
                              {weekdays.map(day => {
                                // Mostrar TODAS as sessões, não apenas as com participantes
                                const daySessions = organized[day]?.[time] || []
                                return (
                                  <td key={`${day}-${time}`} className="border border-gray-200 px-2 py-2 min-h-[80px]">
                                    {daySessions.map(session => (
                                      <div
                                        key={session.id}
                                        onClick={() => loadParticipants(session)}
                                        className={`mb-2 p-2 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${
                                          session.is_active
                                            ? session.confirmed_participants && session.confirmed_participants > 0
                                              ? 'bg-blue-50 border-blue-400 border-2'
                                              : 'bg-green-50 border-green-300'
                                            : 'bg-red-50 border-red-300'
                                        }`}
                                        title={session.confirmed_participants && session.confirmed_participants > 0 
                                          ? `Clique para ver ${session.confirmed_participants} participante(s) confirmado(s)`
                                          : 'Sessão sem participantes confirmados'}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`text-xs font-medium ${
                                            session.is_active ? 'text-green-700' : 'text-red-700'
                                          }`}>
                                            {session.is_active ? '✅ Aberta' : '🔒 Fechada'}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              toggleActive(session)
                                            }}
                                            disabled={saving}
                                            className={`text-xs px-2 py-0.5 rounded ${
                                              session.is_active
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            } disabled:opacity-50`}
                                            title={session.is_active ? 'Fechar' : 'Abrir'}
                                          >
                                            {session.is_active ? '🔒' : '✅'}
                                          </button>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {formatPtBR(session.starts_at)}
                                        </div>
                                        {session.confirmed_participants !== undefined && session.confirmed_participants > 0 ? (
                                          <div className="mt-2">
                                            <div className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded shadow-sm">
                                              ✅ {session.confirmed_participants} CONFIRMADO{session.confirmed_participants !== 1 ? 'S' : ''} - Clique para gerenciar
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="mt-2">
                                            <div className="text-xs text-gray-500 italic">
                                              Sem participantes confirmados - Clique para ver
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {daySessions.length === 0 && (
                                      <div className="text-xs text-gray-400 text-center py-2">
                                        —
                                      </div>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })()}

              {/* Visualização em Tabela */}
              {viewMode === 'table' && (() => {
                const now = new Date()
                const futureSessions = sessions.filter(s => new Date(s.starts_at) >= now)
                const pastSessions = sessions.filter(s => new Date(s.starts_at) < now)
                const sessionsToShow = showPastSessions ? sessions : futureSessions

                return (
                  <div className="mt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">📋 Lista de Todas as Sessões</h3>
                        <p className="text-xs text-gray-500">
                          {futureSessions.length > 0 
                            ? `${futureSessions.length} sessão${futureSessions.length !== 1 ? 'ões' : ''} futura${futureSessions.length !== 1 ? 's' : ''}`
                            : 'Nenhuma sessão futura'}
                          {pastSessions.length > 0 && (
                            <span className="ml-2">
                              • {pastSessions.length} anterior{pastSessions.length !== 1 ? 'es' : ''}
                            </span>
                          )}
                        </p>
                      </div>
                      {pastSessions.length > 0 && (
                        <button
                          onClick={() => setShowPastSessions(!showPastSessions)}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {showPastSessions ? '🔽 Ocultar Anteriores' : '🔼 Ver Anteriores'}
                        </button>
                      )}
                    </div>
                    {sessions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhuma sessão cadastrada ainda.</p>
                        <p className="text-xs mt-2">Use o botão "Gerar Sessões Automáticas" acima para criar sessões.</p>
                      </div>
                    ) : (
                      <>
                        {sessionsToShow.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>Nenhuma sessão para exibir.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-200">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700">Data/Hora</th>
                                  <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                                  <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700">Participantes</th>
                                  <th className="border border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-700">Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sessionsToShow.map(session => (
                            <tr key={session.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {formatPtBR(session.starts_at)}
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  session.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {session.is_active ? '✅ Aberta' : '🔒 Fechada'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <button
                                  onClick={() => loadParticipants(session)}
                                  className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                  {session.confirmed_participants !== undefined && session.confirmed_participants > 0
                                    ? `✅ ${session.confirmed_participants} confirmado${session.confirmed_participants !== 1 ? 's' : ''} - Clique para ver`
                                    : 'Ver detalhes (sem confirmados)'}
                                </button>
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => toggleActive(session)}
                                    disabled={saving}
                                    className={`text-xs px-2 py-1 rounded ${
                                      session.is_active
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    } disabled:opacity-50`}
                                    title={session.is_active ? 'Fechar' : 'Abrir'}
                                  >
                                    {session.is_active ? '🔒' : '✅'}
                                  </button>
                                  <button
                                    onClick={() => deleteSession(session)}
                                    disabled={saving}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                                    title="Deletar"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  </>
                )}
              </div>
            )})()}

              {upcoming.length > 0 && (
                <div className="mt-4 text-sm text-gray-700">
                  <span className="font-medium">Próxima ativa:</span> {formatPtBR(upcoming[0].starts_at)}
                </div>
              )}
            </div>

            {/* FLYER - SEGUNDA SEÇÃO */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Flyer padrão</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (URL)</label>
                  <div className="flex gap-2">
                    <input
                      value={flyerUrl}
                      onChange={(e) => setFlyerUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <label className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 cursor-pointer text-sm">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          try {
                            setSaving(true)
                            const url = await uploadFlyer(file)
                            setFlyerUrl(url)
                            setSuccess('Flyer enviado. Clique em “Salvar” para aplicar.')
                          } catch (err: any) {
                            setError(err.message || 'Erro ao subir flyer')
                          } finally {
                            setSaving(false)
                            e.target.value = ''
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Esse flyer será enviado como imagem no WhatsApp.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
                  <input
                    value={flyerCaption}
                    onChange={(e) => setFlyerCaption(e.target.value)}
                    placeholder="Ex.: Aula prática gratuita"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Se vazio, a legenda usa título + data/hora.</p>
                </div>
              </div>

              {flyerUrl && (
                <div className="mt-4">
                  <div className="text-sm text-gray-700 mb-2">Preview</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flyerUrl} alt="Flyer" className="max-h-80 rounded-lg border border-gray-200" />
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>

            {/* Modal de Participantes */}
            {selectedSessionForParticipants && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        👥 Participantes Confirmados
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPtBR(selectedSessionForParticipants.starts_at)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <a
                          href={selectedSessionForParticipants.zoom_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          Abrir link do Zoom
                        </a>
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                          onClick={async () => {
                            const link = selectedSessionForParticipants.zoom_link
                            try {
                              await navigator.clipboard.writeText(link)
                              alert('Link do Zoom copiado!')
                            } catch {
                              window.prompt('Copie o link do Zoom:', link)
                            }
                          }}
                        >
                          Copiar link
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSessionForParticipants(null)
                        setParticipants([])
                      }}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="add-participant-phone-existing"
                        placeholder="Telefone (ex: 5519997230912)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={async () => {
                          const input = document.getElementById('add-participant-phone-existing') as HTMLInputElement
                          const phone = input.value.trim().replace(/\D/g, '')
                          
                          if (!phone || phone.length < 10) {
                            alert('Digite um telefone válido')
                            return
                          }
                          
                          if (!selectedSessionForParticipants) {
                            alert('Selecione uma sessão primeiro')
                            return
                          }
                          
                          try {
                            setSaving(true)
                            setError(null)
                            const res = await fetch('/api/admin/whatsapp/workshop/participants/adicionar', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                sessionId: selectedSessionForParticipants.id,
                                phone: phone
                              })
                            })
                            const json = await res.json()
                            if (!res.ok) throw new Error(json.error || 'Erro ao adicionar participante')
                            setSuccess(json.message || 'Participante adicionado!')
                            input.value = ''
                            await loadParticipants(selectedSessionForParticipants)
                            await loadAll()
                          } catch (e: any) {
                            setError(e.message || 'Erro ao adicionar participante')
                          } finally {
                            setSaving(false)
                          }
                        }}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        {saving ? 'Adicionando...' : '➕ Adicionar'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Digite o telefone da pessoa (apenas números, com DDD e código do país)
                    </p>
                  </div>
                  {!loadingParticipants && participants.length > 0 && (
                    <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-amber-900">Enviar lembrete:</span>
                        <button
                          type="button"
                          onClick={toggleSelectAllLembrete}
                          className="text-xs px-2 py-1 rounded bg-amber-200 text-amber-900 hover:bg-amber-300"
                        >
                          {selectedForLembrete.size >= participants.length ? 'Desmarcar todos' : 'Selecionar todos'}
                        </button>
                        <span className="text-xs text-amber-700">
                          {selectedForLembrete.size > 0 ? `${selectedForLembrete.size} selecionado(s)` : 'Nenhum selecionado = envia para todos'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => sendLembretes('aula_hoje')}
                          disabled={sendingLembrete}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 font-medium"
                        >
                          📅 Lembrete da aula de hoje
                        </button>
                        <button
                          type="button"
                          onClick={() => sendLembretes('30min')}
                          disabled={sendingLembrete}
                          className="px-3 py-1.5 text-sm rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50 font-medium"
                        >
                          ⏰ 30 min antes
                        </button>
                        <button
                          type="button"
                          onClick={() => sendLembretes('10min')}
                          disabled={sendingLembrete}
                          className="px-3 py-1.5 text-sm rounded-lg bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50 font-medium"
                        >
                          ⏰ 10 min antes
                        </button>
                      </div>
                      {lembreteResult && (
                        <p className="text-xs text-amber-800 mt-2">
                          Enviados: {lembreteResult.sent}. {lembreteResult.errors?.length ? `Erros: ${lembreteResult.errors.join('; ')}` : ''}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    {loadingParticipants ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Carregando participantes...</p>
                      </div>
                    ) : participants.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <p className="text-gray-500">Nenhum participante confirmado para esta sessão.</p>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h3 className="text-sm font-semibold text-blue-900 mb-2">➕ Adicionar Participante Manualmente</h3>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id="add-participant-phone"
                              placeholder="Telefone (ex: 5519997230912)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button
                              onClick={async () => {
                                const input = document.getElementById('add-participant-phone') as HTMLInputElement
                                const phone = input.value.trim().replace(/\D/g, '')
                                
                                if (!phone || phone.length < 10) {
                                  alert('Digite um telefone válido')
                                  return
                                }
                                
                                if (!selectedSessionForParticipants) {
                                  alert('Selecione uma sessão primeiro')
                                  return
                                }
                                
                                try {
                                  setSaving(true)
                                  setError(null)
                                  const res = await fetch('/api/admin/whatsapp/workshop/participants/adicionar', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                      sessionId: selectedSessionForParticipants.id,
                                      phone: phone
                                    })
                                  })
                                  const json = await res.json()
                                  if (!res.ok) throw new Error(json.error || 'Erro ao adicionar participante')
                                  setSuccess(json.message || 'Participante adicionado!')
                                  input.value = ''
                                  await loadParticipants(selectedSessionForParticipants)
                                  await loadAll()
                                } catch (e: any) {
                                  setError(e.message || 'Erro ao adicionar participante')
                                } finally {
                                  setSaving(false)
                                }
                              }}
                              disabled={saving}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                            >
                              {saving ? 'Adicionando...' : 'Adicionar'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Digite o telefone da pessoa (apenas números, com DDD e código do país)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {participants.map((participant) => (
                          <div
                            key={participant.conversationId}
                            className={`border-2 rounded-xl p-4 transition-all ${
                              participant.hasParticipated
                                ? 'bg-green-50 border-green-300 shadow-sm'
                                : participant.hasNotParticipated
                                ? 'bg-red-50 border-red-300 shadow-sm'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            {/* Linha 1: checkbox + nome + status */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <label className="flex items-center gap-2 shrink-0 cursor-pointer" title="Selecionar para enviar lembrete">
                                <input
                                  type="checkbox"
                                  checked={selectedForLembrete.has(participant.conversationId)}
                                  onChange={() => toggleParticipantLembrete(participant.conversationId)}
                                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="text-xs text-gray-500">Lembrete</span>
                              </label>
                              <p className={`font-bold text-lg min-w-0 truncate ${
                                participant.hasParticipated
                                  ? 'text-green-800'
                                  : participant.hasNotParticipated
                                  ? 'text-red-800'
                                  : 'text-gray-900'
                              }`}>
                                {participant.name || 'Sem nome'}
                              </p>
                              {participant.hasParticipated && (
                                <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full font-semibold shrink-0">
                                  ✅ Participou
                                </span>
                              )}
                              {participant.hasNotParticipated && (
                                <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full font-semibold shrink-0">
                                  ❌ Não participou
                                </span>
                              )}
                            </div>
                            {/* Linha 2: telefone + link */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
                              <p className="text-sm text-gray-600">{formatPhone(participant.phone)}</p>
                              <Link
                                href={`/admin/whatsapp?conversation=${participant.conversationId}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Ver conversa →
                              </Link>
                            </div>
                            {/* Linha 3: botões de ação — duas linhas para não amontoar */}
                            <div className="pt-3 border-t border-gray-200 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => markParticipated(participant.conversationId, true)}
                                  disabled={saving || participant.hasParticipated}
                                  className={`w-full px-3 py-2.5 text-sm rounded-lg font-semibold transition-all touch-manipulation ${
                                    participant.hasParticipated
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                                  } disabled:opacity-50`}
                                  title="Marcar como participou"
                                >
                                  ✅ Participou
                                </button>
                                <button
                                  onClick={() => markParticipated(participant.conversationId, false)}
                                  disabled={saving || participant.hasNotParticipated}
                                  className={`w-full px-3 py-2.5 text-sm rounded-lg font-semibold transition-all touch-manipulation ${
                                    participant.hasNotParticipated
                                      ? 'bg-red-600 text-white cursor-not-allowed'
                                      : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                                  } disabled:opacity-50`}
                                  title="Marcar como não participou"
                                >
                                  ❌ Não participou
                                </button>
                              </div>
                              <button
                                onClick={() => removerAgendamento(participant.conversationId)}
                                disabled={saving}
                                className="w-full px-3 py-2.5 text-sm rounded-lg font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 disabled:opacity-50 touch-manipulation"
                                title="Remover do agendamento"
                              >
                                🚫 Remover agendamento
                              </button>
                              {participant.hasNotParticipated && (
                                <button
                                  onClick={() => reenviarRemarketing(participant.conversationId)}
                                  disabled={saving || reenviandoRemarketing.has(participant.conversationId)}
                                  className="w-full px-3 py-2.5 text-sm rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 disabled:opacity-50 touch-manipulation"
                                  title="Reenviar mensagem de remarketing (reagendar)"
                                >
                                  {reenviandoRemarketing.has(participant.conversationId) ? 'Enviando…' : '📩 Reenviar remarketing'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function WorkshopAdminPage() {
  return (
    <AdminProtectedRoute>
      <WorkshopContent />
    </AdminProtectedRoute>
  )
}

