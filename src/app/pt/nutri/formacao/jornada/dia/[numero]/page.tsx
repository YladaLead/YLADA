'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import type { JourneyDay } from '@/types/formacao'

export default function JornadaDiaPage() {
  const params = useParams()
  const router = useRouter()
  const dayNumber = parseInt(params.numero as string)

  const [day, setDay] = useState<(JourneyDay & { progress: any; is_completed: boolean; is_locked: boolean }) | null>(null)
  const [checklist, setChecklist] = useState<boolean[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [concluindo, setConcluindo] = useState(false)

  useEffect(() => {
    const carregarDia = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const res = await fetch(`/api/nutri/formacao/jornada/dia/${dayNumber}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Erro ao carregar dia')
        }

        const data = await res.json()
        setDay(data.data)
        
        // Inicializar checklist
        if (data.data.progress?.checklist_completed) {
          setChecklist(data.data.progress.checklist_completed)
        } else {
          setChecklist(new Array(data.data.checklist_items.length).fill(false))
        }
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

  const toggleChecklistItem = (index: number) => {
    const newChecklist = [...checklist]
    newChecklist[index] = !newChecklist[index]
    setChecklist(newChecklist)
  }

  const concluirDia = async () => {
    try {
      setConcluindo(true)

      const res = await fetch(`/api/nutri/formacao/jornada/dia/${dayNumber}/concluir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          checklist_completed: checklist
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.requires_previous_day) {
          alert('Conclua o dia anterior primeiro!')
          router.push(`/pt/nutri/formacao/jornada/dia/${dayNumber - 1}`)
          return
        }
        throw new Error(errorData.error || 'Erro ao concluir dia')
      }

      // Sucesso - redirecionar para a jornada ou próximo dia
      const nextDay = dayNumber < 30 ? dayNumber + 1 : null
      if (nextDay) {
        router.push(`/pt/nutri/formacao/jornada/dia/${nextDay}`)
      } else {
        // Último dia concluído - ir para página de conclusão
        router.push('/pt/nutri/formacao/jornada/concluida')
      }
    } catch (error: any) {
      console.error('Erro ao concluir dia:', error)
      alert(error.message || 'Erro ao concluir dia')
    } finally {
      setConcluindo(false)
    }
  }

  const getActionLink = () => {
    if (!day) return '#'
    
    if (day.action_type === 'pilar') {
      // Buscar trilha correspondente (por enquanto, usar primeira trilha)
      return '/pt/nutri/formacao/trilhas'
    } else if (day.action_type === 'exercicio') {
      return '/pt/nutri/formacao/microcursos'
    } else if (day.action_type === 'ferramenta') {
      return '/pt/nutri/formacao/biblioteca'
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
              href="/pt/nutri/formacao/jornada"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar para Jornada
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (day.is_locked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dia Bloqueado</h2>
            <p className="text-gray-700 mb-4">
              Conclua o dia anterior para desbloquear este dia.
            </p>
            <Link
              href={`/pt/nutri/formacao/jornada/dia/${dayNumber - 1}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para Dia {dayNumber - 1}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/formacao/jornada"
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

        {/* Objetivo */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="font-bold text-gray-900 mb-2 text-lg">🎯 Objetivo</h2>
          <p className="text-gray-700">{day.objective}</p>
        </div>

        {/* Orientação */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-3 text-lg">📖 Orientação</h2>
          <p className="text-gray-700 leading-relaxed">{day.guidance}</p>
        </div>

        {/* Ação Prática */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
          <h2 className="font-bold text-gray-900 mb-3 text-lg">💪 Ação Prática</h2>
          <p className="text-gray-700 mb-4">{day.action_title}</p>
          <Link
            href={getActionLink()}
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Acessar {day.action_type === 'pilar' ? 'Pilar' : day.action_type === 'exercicio' ? 'Exercício' : 'Ferramenta'} →
          </Link>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">✓ Checklist</h2>
          <div className="space-y-3">
            {day.checklist_items.map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checklist[index] || false}
                  onChange={() => toggleChecklistItem(index)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`flex-1 ${checklist[index] ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Frase Motivacional */}
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
              href={`/pt/nutri/formacao/jornada/dia/${dayNumber - 1}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Dia Anterior
            </Link>
          )}
          {dayNumber < 30 && (
            <Link
              href={`/pt/nutri/formacao/jornada/dia/${dayNumber + 1}`}
              className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
            >
              Próximo Dia →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

