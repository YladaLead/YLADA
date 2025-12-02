'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import AcaoPraticaCard from '@/components/formacao/AcaoPraticaCard'
import ChecklistItem from '@/components/formacao/ChecklistItem'
import ReflexaoDia from '@/components/formacao/ReflexaoDia'
import BlockedDayModal from '@/components/jornada/BlockedDayModal'
import { useAuth } from '@/hooks/useAuth'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import { canAccessDay } from '@/utils/jornada-access'
import type { JourneyDay } from '@/types/formacao'

export default function JornadaDiaPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { progress, loading: progressLoading } = useJornadaProgress()
  const dayNumber = parseInt(params.numero as string)

  const [day, setDay] = useState<(JourneyDay & { 
    progress: any
    is_completed: boolean
    is_locked: boolean
    checklist_notes?: Map<number, string>
    checklist_logs?: Map<number, boolean>
    daily_note?: string
  }) | null>(null)
  
  const [checklist, setChecklist] = useState<boolean[]>([])
  const [checklistNotes, setChecklistNotes] = useState<Map<number, string>>(new Map())
  const [dailyNote, setDailyNote] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [concluindo, setConcluindo] = useState(false)
  const [showBlockedModal, setShowBlockedModal] = useState(false)

  // Verificar acesso ao dia antes de carregar
  useEffect(() => {
    if (!progressLoading && progress) {
      if (!canAccessDay(dayNumber, progress)) {
        setShowBlockedModal(true)
        setCarregando(false)
        return
      }
    }
  }, [dayNumber, progress, progressLoading])

  useEffect(() => {
    // Não carregar se o dia está bloqueado
    if (showBlockedModal) return

    const carregarDia = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const res = await fetch(`/api/nutri/metodo/jornada/dia/${dayNumber}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          const errorData = await res.json()
          // Se o erro for de bloqueio, mostrar modal
          if (errorData.requires_previous_day || errorData.error?.includes('anterior')) {
            setShowBlockedModal(true)
            setCarregando(false)
            return
          }
          throw new Error(errorData.error || 'Erro ao carregar dia')
        }

        const data = await res.json()
        setDay(data.data)
        
        // Inicializar checklist com base nos logs
        // checklist_logs vem como objeto simples do JSON, converter para Map
        const logsObj = data.data.checklist_logs || {}
        const logsMap = new Map(Object.entries(logsObj).map(([k, v]) => [parseInt(k), v]))
        const initialChecklist = (data.data.checklist_items || []).map((_: any, index: number) => {
          return logsMap.get(index) || false
        })
        setChecklist(initialChecklist)

        // Inicializar notas do checklist
        // checklist_notes vem como objeto simples do JSON, converter para Map
        if (data.data.checklist_notes) {
          const notesObj = data.data.checklist_notes
          setChecklistNotes(new Map(Object.entries(notesObj).map(([k, v]: [string, any]) => [parseInt(k), v])))
        }

        // Inicializar anotação diária
        setDailyNote(data.data.daily_note || '')
      } catch (error: any) {
        console.error('Erro ao carregar dia:', error)
        setErro(error.message || 'Erro ao carregar dia')
      } finally {
        setCarregando(false)
      }
    }

    if (dayNumber) {
      carregarDia()
    }
  }, [dayNumber])

  const toggleChecklistItem = async (index: number) => {
    const newChecklist = [...checklist]
    newChecklist[index] = !newChecklist[index]
    setChecklist(newChecklist)

    // Salvar log no backend
    try {
      await fetch('/api/nutri/metodo/jornada/checklist/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          day_number: dayNumber,
          item_index: index,
          marcado: newChecklist[index]
        })
      })
    } catch (error) {
      console.error('Erro ao salvar log do checklist:', error)
    }
  }

  // Nota: handleChecklistNoteChange não é mais necessário
  // O componente ChecklistItem agora salva automaticamente com debounce

  const handleDailyNoteSave = async (content: string) => {
    setDailyNote(content)

    // Salvar anotação diária no backend
    try {
      await fetch('/api/nutri/metodo/jornada/daily-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          day_number: dayNumber,
          conteudo: content
        })
      })
    } catch (error) {
      console.error('Erro ao salvar anotação diária:', error)
    }
  }

  const concluirDia = async () => {
    try {
      setConcluindo(true)

      const res = await fetch(`/api/nutri/metodo/jornada/dia/${dayNumber}/concluir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          checklist_completed: checklist
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Erro ao concluir dia:', errorData)
        
        if (errorData.requires_previous_day) {
          setShowBlockedModal(true)
          return
        }
        
        // Mensagem de erro mais detalhada
        const errorMessage = errorData.details 
          ? `${errorData.error}\n\nDetalhes: ${errorData.details}`
          : errorData.error || 'Erro ao concluir dia'
        
        alert(errorMessage)
        return
      }

      const result = await res.json()
      
      // Mostrar feedback visual de sucesso
      alert('✔ Dia concluído! Continue avançando.')
      
      // Sucesso - redirecionar para o próximo dia disponível
      const nextDay = dayNumber < 30 ? dayNumber + 1 : null
      if (nextDay) {
        router.push(`/pt/nutri/metodo/jornada/dia/${nextDay}`)
      } else {
        // Último dia concluído - ir para página de conclusão
        router.push('/pt/nutri/metodo/jornada/concluida')
      }
    } catch (error: any) {
      console.error('Erro ao concluir dia:', error)
      // Não mostrar alert novamente se já foi mostrado
      if (!error.message?.includes('Erro ao concluir dia')) {
        alert(error.message || 'Erro ao concluir dia')
      }
    } finally {
      setConcluindo(false)
    }
  }

  const getActionLink = () => {
    if (!day) return '#'
    
    // Se action_id está definido no banco, usar ele
    if (day.action_id) {
      if (day.action_type === 'pilar') {
        return `/pt/nutri/metodo/pilares/${day.action_id}`
      } else if (day.action_type === 'exercicio') {
        return `/pt/nutri/metodo/exercicios/${day.action_id}`
      } else if (day.action_type === 'ferramenta') {
        return `/pt/nutri/metodo/ferramentas/${day.action_id}`
      }
    }
    
    // Mapeamento baseado no dia conforme tabela fornecida
    const dayActionMap: Record<number, { type: 'pilar' | 'exercicio' | 'ferramenta', id: string }> = {
      1: { type: 'pilar', id: '1' },
      2: { type: 'pilar', id: '1' },
      3: { type: 'pilar', id: '2' },
      4: { type: 'pilar', id: '1' },
      5: { type: 'pilar', id: '2' },
      6: { type: 'pilar', id: '1' },
      7: { type: 'pilar', id: '2' },
      // Semana 2 - Captação
      8: { type: 'pilar', id: '3' },
      9: { type: 'pilar', id: '3' },
      10: { type: 'exercicio', id: 'distribuicao-101010' },
      11: { type: 'pilar', id: '3' },
      12: { type: 'exercicio', id: 'objeções' },
      13: { type: 'pilar', id: '3' },
      14: { type: 'pilar', id: '3' },
      // Semana 3 - Rotina
      15: { type: 'pilar', id: '2' },
      16: { type: 'pilar', id: '2' },
      17: { type: 'exercicio', id: 'gestao-leads' },
      18: { type: 'pilar', id: '4' },
      19: { type: 'ferramenta', id: 'painel-diario' },
      20: { type: 'pilar', id: '2' },
      21: { type: 'pilar', id: '4' },
      // Semana 4 - GSAL
      22: { type: 'pilar', id: '5' },
      23: { type: 'exercicio', id: 'gsal-gerar' },
      24: { type: 'exercicio', id: 'gsal-servir' },
      25: { type: 'exercicio', id: 'gsal-acompanhar' },
      26: { type: 'ferramenta', id: 'agenda-estrategica' },
      27: { type: 'exercicio', id: 'checklist-crescimento' },
      28: { type: 'exercicio', id: 'plano-30' },
      29: { type: 'exercicio', id: 'ritual-final' },
      30: { type: 'exercicio', id: 'ritual-final' },
    }
    
    const action = dayActionMap[dayNumber]
    if (action) {
      if (action.type === 'pilar') {
        return `/pt/nutri/metodo/pilares/${action.id}`
      } else if (action.type === 'exercicio') {
        return `/pt/nutri/metodo/exercicios/${action.id}`
      } else if (action.type === 'ferramenta') {
        // Painel diário e agenda são rotas especiais
        if (action.id === 'painel-diario') {
          return `/pt/nutri/metodo/painel/diario`
        } else if (action.id === 'agenda-estrategica') {
          return `/pt/nutri/metodo/painel/agenda`
        }
        return `/pt/nutri/metodo/ferramentas/${action.id}`
      }
    }
    
    // Fallback para action_type do banco
    if (day.action_type === 'pilar') {
      const pilarMap: Record<number, string> = {
        1: '1', 2: '1', 4: '1', 6: '1',
        3: '2', 5: '2',
      }
      const pilarId = pilarMap[dayNumber] || '1'
      return `/pt/nutri/metodo/pilares/${pilarId}`
    } else if (day.action_type === 'exercicio') {
      return '/pt/nutri/metodo/exercicios'
    } else if (day.action_type === 'ferramenta') {
      return '/pt/nutri/metodo/ferramentas'
    }
    
    return '#'
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (erro || !day) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800">{erro || 'Dia não encontrado'}</p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar para Jornada
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Se o dia está bloqueado, mostrar apenas o modal
  if (showBlockedModal || (day && day.is_locked)) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <FormacaoHeader />
        </div>
        <BlockedDayModal
          isOpen={true}
          onClose={() => router.push('/pt/nutri/metodo/jornada')}
          blockedDay={dayNumber}
          currentDay={progress?.current_day || 1}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para Jornada
          </Link>
        </div>

        {/* Header do Dia */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              {day.day_number}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{day.title}</h1>
              <p className="text-sm text-gray-500">Semana {day.week_number} • Dia {day.day_number}</p>
            </div>
          </div>
        </div>

        {/* 1. OBJETIVO */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="font-bold text-gray-900 mb-2 text-lg">🎯 Objetivo do Dia</h2>
          <p className="text-gray-700">{day.objective}</p>
        </div>

        {/* 2. ORIENTAÇÃO */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-3 text-lg">📖 Orientação</h2>
          <p className="text-gray-700 leading-relaxed">{day.guidance}</p>
        </div>

        {/* 3. AÇÃO PRÁTICA */}
        <AcaoPraticaCard
          title={day.action_title}
          description={day.action_title} // Pode ser expandido no futuro
          actionType={day.action_type}
          actionLink={getActionLink()}
          actionId={day.action_id}
          dayNumber={dayNumber}
        />

        {/* 4. CHECKLIST DE FIXAÇÃO */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-2 text-lg">✓ Checklist de Fixação</h2>
          <p className="text-sm text-gray-600 mb-4 italic">
            Use este checklist depois de concluir a ação prática para garantir que absorveu o conteúdo.
          </p>
          <div className="space-y-3">
            {day.checklist_items.map((item, index) => (
              <ChecklistItem
                key={index}
                id={`day-${dayNumber}-item-${index}`}
                label={item}
                dayNumber={dayNumber}
                userId={user?.id || ''}
                itemIndex={index}
                checked={checklist[index] || false}
                note={checklistNotes.get(index) || ''}
                onToggle={toggleChecklistItem}
                disabled={day.is_completed}
              />
            ))}
          </div>
        </div>

        {/* 5. CAMPO DE REFLEXÃO DO DIA */}
        <ReflexaoDia
          dayNumber={dayNumber}
          initialContent={dailyNote}
          onSave={handleDailyNoteSave}
          disabled={day.is_completed}
        />

        {/* 6. MENSAGEM DO DIA */}
        {day.motivational_phrase && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border-l-4 border-amber-400">
            <p className="text-lg text-gray-800 italic text-center">
              "{day.motivational_phrase}"
            </p>
          </div>
        )}

        {/* Botão Concluir Dia */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <button
            onClick={concluirDia}
            disabled={concluindo || day.is_completed}
            className={`
              w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
              ${day.is_completed
                ? 'bg-green-600 text-white cursor-not-allowed'
                : concluindo
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {day.is_completed
              ? '✓ Dia Concluído'
              : concluindo
              ? 'Concluindo...'
              : 'Concluir Dia'
            }
          </button>
          {day.is_completed && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Concluído em {day.progress?.completed_at ? new Date(day.progress.completed_at).toLocaleDateString('pt-BR') : ''}
            </p>
          )}
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between mt-6">
          {dayNumber > 1 && (
            <Link
              href={`/pt/nutri/metodo/jornada/dia/${dayNumber - 1}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Dia Anterior
            </Link>
          )}
          {dayNumber < 30 && !day.is_completed && (
            <button
              onClick={() => {
                const nextDay = dayNumber + 1
                // Verificar se pode acessar o próximo dia
                if (canAccessDay(nextDay, progress)) {
                  router.push(`/pt/nutri/metodo/jornada/dia/${nextDay}`)
                } else {
                  setShowBlockedModal(true)
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
            >
              Próximo Dia →
            </button>
          )}
        </div>
      </div>

      {/* Modal de Bloqueio */}
      <BlockedDayModal
        isOpen={showBlockedModal}
        onClose={() => {
          setShowBlockedModal(false)
          router.push('/pt/nutri/metodo/jornada')
        }}
        blockedDay={dayNumber}
        currentDay={progress?.current_day || 1}
      />
    </div>
  )
}
