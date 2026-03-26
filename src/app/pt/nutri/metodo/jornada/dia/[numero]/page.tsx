'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import AcaoPraticaCard from '@/components/formacao/AcaoPraticaCard'
import ExercicioReflexao from '@/components/jornada/ExercicioReflexao'
import ReflexaoDia from '@/components/formacao/ReflexaoDia'
import BlockedDayModal from '@/components/jornada/BlockedDayModal'
import DiaConcluidoModal from '@/components/jornada/DiaConcluidoModal'
import PilarContentInline from '@/components/jornada/PilarContentInline'
import FormatarOrientacao from '@/components/jornada/FormatarOrientacao'
import { useAuth } from '@/hooks/useAuth'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import type { JourneyDay } from '@/types/formacao'

const JORNADA_BASE = '/pt/nutri/metodo/jornada'

export default function JornadaDiaPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromMed = searchParams.get('from') === 'med'
  const backHref = fromMed ? '/pt/med/trilha' : JORNADA_BASE
  const backLabel = fromMed ? '← Voltar ao YLADA Medicina' : '← Voltar para Trilha'
  const { user } = useAuth()
  const { progress, loading: progressLoading, canAccessDay } = useJornadaProgress()
  const dayNumber = parseInt(params.numero as string)

  const [day, setDay] = useState<(JourneyDay & { 
    progress: any
    is_completed: boolean
    is_locked: boolean
    checklist_notes?: Map<number, string>
    checklist_logs?: Map<number, boolean>
    daily_note?: string
  }) | null>(null)
  
  const [checklistNotes, setChecklistNotes] = useState<Map<number, string>>(new Map())
  const [dailyNote, setDailyNote] = useState('')
  const [acaoPraticaNote, setAcaoPraticaNote] = useState('')
  const [carregando, setCarregando] = useState(true)
  const acaoPraticaDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [concluindo, setConcluindo] = useState(false)
  const [showBlockedModal, setShowBlockedModal] = useState(false)
  const [showConcluidoModal, setShowConcluidoModal] = useState(false)

  // Verificar acesso ao dia antes de carregar
  useEffect(() => {
    if (!progressLoading) {
      if (!canAccessDay(dayNumber)) {
        setShowBlockedModal(true)
        setCarregando(false)
        return
      }
    }
  }, [dayNumber, progressLoading, canAccessDay])

  useEffect(() => {
    // Não carregar se o dia está bloqueado
    if (showBlockedModal) return

    const carregarDia = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Criar AbortController para timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos

        try {
          const res = await fetch(`/api/nutri/metodo/jornada/dia/${dayNumber}`, {
            credentials: 'include',
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Erro ao carregar dia' }))
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
          
          // Inicializar notas dos exercícios de reflexão
          // checklist_notes vem como objeto simples do JSON, converter para Map
          if (data.data.checklist_notes) {
            const notesObj = data.data.checklist_notes
            const notesMap = new Map(Object.entries(notesObj).map(([k, v]: [string, any]) => [parseInt(k), v]))
            setChecklistNotes(notesMap)
            
            // Inicializar nota da ação prática (usando item_index -1 como identificador especial)
            const acaoPraticaNote = notesMap.get(-1) || ''
            setAcaoPraticaNote(acaoPraticaNote)
          }

          // Inicializar anotação diária
          setDailyNote(data.data.daily_note || '')
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            throw new Error('Tempo de carregamento excedido. Tente novamente.')
          }
          throw fetchError
        }
      } catch (error: any) {
        console.error('Erro ao carregar dia:', error)
        setErro(error.message || 'Erro ao carregar dia. Verifique sua conexão e tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    if (dayNumber) {
      carregarDia()
    }
  }, [dayNumber])

  // Nota: toggleChecklistItem removido - não há mais checkboxes
  // O componente ExercicioReflexao salva automaticamente as notas com debounce

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
          checklist_completed: [] // Não há mais checkboxes, mas API ainda espera este campo
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
      
      // Calcular próximo dia
      const nextDay = dayNumber < 30 ? dayNumber + 1 : null
      
      // Mostrar modal de parabéns
      setShowConcluidoModal(true)
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

  // Função auxiliar para obter o ID do Pilar quando a ação for um Pilar
  const getPilarId = (): string | null => {
    if (!day) return null
    
    // Se action_id está definido no banco e é pilar, usar ele
    if (day.action_id && day.action_type === 'pilar') {
      return day.action_id
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
    if (action && action.type === 'pilar') {
      return action.id
    }
    
    // Fallback para action_type do banco
    if (day.action_type === 'pilar') {
      const pilarMap: Record<number, string> = {
        1: '1', 2: '1', 4: '1', 6: '1',
        3: '2', 5: '2',
      }
      return pilarMap[dayNumber] || '1'
    }
    
    return null
  }

  const getActionLink = () => {
    if (!day) return '#'
    
    const pilarId = getPilarId()
    if (pilarId) {
      return `/pt/nutri/metodo/pilares/${pilarId}`
    }
    
    // Se action_id está definido no banco, usar ele
    if (day.action_id) {
      if (day.action_type === 'exercicio') {
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
      if (action.type === 'exercicio') {
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
    if (day.action_type === 'exercicio') {
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
            <p className="text-red-800">{erro || 'Etapa não encontrada'}</p>
            <Link
              href={backHref}
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              {backLabel}
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
          onClose={() => router.push(backHref)}
          blockedDay={dayNumber}
          currentDay={progress?.current_day || 1}
          basePath={fromMed ? '/pt/med/trilha/jornada' : JORNADA_BASE}
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
            href={backHref}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {backLabel}
          </Link>
        </div>

        {/* Header da Etapa */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              {day.day_number}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{day.title}</h1>
              <p className="text-sm text-gray-500">Bloco {day.week_number} • Etapa {day.day_number}</p>
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
          <FormatarOrientacao texto={day.guidance} />
        </div>

        {/* 3. AÇÃO PRÁTICA */}
        {/* 🚀 Modelo com Noel: campo de ação prática inline */}
        {/* Pilares não são mais renderizados - Noel conduz o conteúdo */}
        {(day.action_type === 'exercicio' && !day.action_id) || day.action_type === 'pilar' ? (
          /* 🚀 FLUXO FLUIDO: Exercícios sem action_id são renderizados inline (sem botão) */
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500 shadow-md">
            <h2 className="font-bold text-gray-900 mb-2 text-xl">💪 Ação Prática do Dia</h2>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">{day.action_title}</h3>
            <p className="text-sm text-purple-700 font-medium mb-4 italic">
              "Faça esta ação primeiro. É o passo essencial do dia."
            </p>
            
            {/* Campo de texto para escrever a ação prática */}
            <div className="mt-4">
              <textarea
                value={acaoPraticaNote}
                onChange={(e) => {
                  setAcaoPraticaNote(e.target.value)
                  
                  // Debounce: salvar 800ms após parar de digitar
                  if (acaoPraticaDebounceRef.current) {
                    clearTimeout(acaoPraticaDebounceRef.current)
                  }
                  
                  acaoPraticaDebounceRef.current = setTimeout(async () => {
                    if (user) {
                      try {
                        await fetch('/api/nutri/metodo/jornada/checklist/note', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({
                            day_number: dayNumber,
                            item_index: -1, // Usar -1 como identificador especial para ação prática
                            nota: e.target.value || null
                          })
                        })
                      } catch (error) {
                        console.error('Erro ao salvar ação prática:', error)
                      }
                    }
                  }, 800)
                }}
                onBlur={async () => {
                  // Cancelar debounce pendente e salvar imediatamente
                  if (acaoPraticaDebounceRef.current) {
                    clearTimeout(acaoPraticaDebounceRef.current)
                    acaoPraticaDebounceRef.current = null
                  }
                  
                  if (user) {
                    try {
                      await fetch('/api/nutri/metodo/jornada/checklist/note', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          day_number: dayNumber,
                          item_index: -1,
                          nota: acaoPraticaNote || null
                        })
                      })
                    } catch (error) {
                      console.error('Erro ao salvar ação prática:', error)
                    }
                  }
                }}
                placeholder={day.action_title}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 leading-relaxed resize-none"
              />
            </div>
          </div>
        ) : (
          <AcaoPraticaCard
            title={day.action_title}
            description={day.action_title} // Pode ser expandido no futuro
            actionType={day.action_type}
            actionLink={getActionLink()}
            actionId={day.action_id}
            dayNumber={dayNumber}
          />
        )}

        {/* Material complementar REMOVIDO - Noel conduz o conteúdo agora */}
        {/* Os PDFs podem ser acessados via Biblioteca quando necessário */}
        {false && (dayNumber >= 8 && dayNumber <= 14) && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-gray-100">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📄 Material complementar:</strong>{' '}
              <Link
                href="/pt/nutri/metodo/biblioteca/pdf-4-captacao-inteligente"
                className="text-green-700 hover:text-green-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
              >
                Ler PDF: Captação Inteligente YLADA
              </Link>
            </p>
          </div>
        )}
        {false && (dayNumber >= 15 && dayNumber <= 16) && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-gray-100">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📄 Material complementar:</strong>{' '}
              <Link
                href="/pt/nutri/metodo/biblioteca/pdf-3-rotina-produtividade"
                className="text-orange-700 hover:text-orange-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
              >
                Ler PDF: Rotina & Produtividade YLADA
              </Link>
            </p>
          </div>
        )}
        {false && (dayNumber >= 22 && dayNumber <= 30) && (
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-gray-100">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📄 Material complementar:</strong>{' '}
              <Link
                href="/pt/nutri/metodo/biblioteca/pdf-6-gestao-gsal"
                className="text-indigo-700 hover:text-indigo-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
              >
                Ler PDF: Gestão & Organização de Clientes (GSAL)
              </Link>
            </p>
          </div>
        )}

        {/* 4. EXERCÍCIO DE REFLEXÃO */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-2 text-lg">💭 Exercício de Reflexão</h2>
          <p className="text-sm text-gray-600 mb-4">
            Reflita sobre o que você aprendeu hoje. Suas respostas me ajudam a te orientar melhor.
          </p>
          <div>
            {day.checklist_items.map((item, index) => (
              <ExercicioReflexao
                key={index}
                id={`day-${dayNumber}-item-${index}`}
                label={item}
                dayNumber={dayNumber}
                userId={user?.id || ''}
                itemIndex={index}
                note={checklistNotes.get(index) || ''}
                disabled={false} // Sempre permitir edição de reflexões (importante paro Noel)
              />
            ))}
          </div>
        </div>

        {/* 5. CAMPO DE REFLEXÃO DO DIA */}
        <ReflexaoDia
          dayNumber={dayNumber}
          initialContent={dailyNote}
          onSave={handleDailyNoteSave}
          disabled={false} // Sempre permitir edição de anotações (importante paro Noel)
        />

        {/* 6. MENSAGEM DO DIA */}
        {day.motivational_phrase && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border-l-4 border-amber-400">
            <p className="text-lg text-gray-800 italic text-center">
              "{day.motivational_phrase}"
            </p>
          </div>
        )}

        {/* Botão Concluir Etapa */}
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
              ? '✓ Etapa Concluída'
              : concluindo
              ? 'Concluindo...'
              : 'Concluir Etapa'
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
              href={fromMed ? `/pt/med/trilha/jornada/dia/${dayNumber - 1}` : `${JORNADA_BASE}/dia/${dayNumber - 1}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Etapa Anterior
            </Link>
          )}
          {dayNumber < 30 && !day.is_completed && (
            <button
              onClick={() => {
                const nextDay = dayNumber + 1
                const nextHref = fromMed ? `/pt/med/trilha/jornada/dia/${nextDay}` : `${JORNADA_BASE}/dia/${nextDay}`
                if (canAccessDay(nextDay)) {
                  router.push(nextHref)
                } else {
                  setShowBlockedModal(true)
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
            >
              Próxima Etapa →
            </button>
          )}
        </div>

        {/* Link para Guia Completo removido - Noel conduz o fluxo */}
      </div>

      {/* Modal de Bloqueio */}
      <BlockedDayModal
        isOpen={showBlockedModal}
        onClose={() => {
          setShowBlockedModal(false)
          router.push(backHref)
        }}
        blockedDay={dayNumber}
        currentDay={progress?.current_day || 1}
        basePath={fromMed ? '/pt/med/trilha/jornada' : JORNADA_BASE}
      />

      <DiaConcluidoModal
        isOpen={showConcluidoModal}
        onClose={() => setShowConcluidoModal(false)}
        dayNumber={dayNumber}
        nextDay={dayNumber < 30 ? dayNumber + 1 : null}
        basePath={fromMed ? '/pt/med/trilha/jornada' : JORNADA_BASE}
      />
    </div>
  )
}
