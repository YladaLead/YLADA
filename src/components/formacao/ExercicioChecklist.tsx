'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ExercicioChecklistProps {
  exercicioId: string
  items: string[]
  initialChecked?: boolean[]
  onSave?: (checked: boolean[]) => void
}

export default function ExercicioChecklist({
  exercicioId,
  items,
  initialChecked = [],
  onSave
}: ExercicioChecklistProps) {
  const { user } = useAuth()
  const [checked, setChecked] = useState<boolean[]>(
    initialChecked.length === items.length ? initialChecked : items.map(() => false)
  )
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Buscar dados iniciais do Supabase
    const carregarChecklist = async () => {
      if (!user) {
        setCarregando(false)
        return
      }

      try {
        const res = await fetch(`/api/nutri/metodo/exercicios/progress?exercicio_id=${exercicioId}`, {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data.data?.checklist_completed && Array.isArray(data.data.checklist_completed)) {
            const savedChecked = data.data.checklist_completed
            if (savedChecked.length === items.length) {
              setChecked(savedChecked)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar checklist:', error)
      } finally {
        setCarregando(false)
      }
    }

    if (initialChecked.length === items.length) {
      setChecked(initialChecked)
      setCarregando(false)
    } else {
      carregarChecklist()
    }
  }, [user, exercicioId, items.length, initialChecked])

  const toggleItem = async (index: number) => {
    const newChecked = [...checked]
    newChecked[index] = !newChecked[index]
    setChecked(newChecked)

    // Salvar automaticamente
    if (user && onSave) {
      onSave(newChecked)
    } else if (user) {
      // Salvar no Supabase
      try {
        await fetch('/api/nutri/metodo/exercicios/checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            exercicio_id: exercicioId,
            checklist_completed: newChecked
          })
        })
      } catch (error) {
        console.error('Erro ao salvar checklist:', error)
      }
    }
  }

  if (carregando) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="animate-pulse space-y-3">
          {items.map((_, index) => (
            <div key={index} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4">✓ Checklist</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <label
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checked[index] || false}
              onChange={() => toggleItem(index)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className={`flex-1 ${checked[index] ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

