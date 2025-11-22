'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ChecklistItem {
  id: string
  item_text: string
  ordem: number
  completed?: boolean
}

interface ChecklistProps {
  moduloId: string
  items: ChecklistItem[]
  onProgressChange?: (progress: number) => void
}

export default function Checklist({
  moduloId,
  items,
  onProgressChange,
}: ChecklistProps) {
  const { user } = useAuth()
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(items)
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Carregar progresso inicial
  useEffect(() => {
    if (!user || !moduloId) return

    const carregarProgresso = async () => {
      try {
        const response = await fetch(
          `/api/nutri/cursos/checklist?modulo_id=${moduloId}`,
          {
            credentials: 'include',
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.checklist) {
            setChecklistItems(data.data.checklist)
            
            if (onProgressChange) {
              onProgressChange(data.data.progresso.porcentagem)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar checklist:', error)
      }
    }

    carregarProgresso()
  }, [user, moduloId, onProgressChange])

  const toggleItem = async (itemId: string, currentCompleted: boolean) => {
    if (!user) return

    setLoading(prev => ({ ...prev, [itemId]: true }))

    try {
      const response = await fetch('/api/nutri/cursos/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checklist_id: itemId,
          completed: !currentCompleted,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        
        // Atualizar estado local
        setChecklistItems(prev =>
          prev.map(item =>
            item.id === itemId
              ? { ...item, completed: !currentCompleted }
              : item
          )
        )

        // Calcular novo progresso
        const updatedItems = checklistItems.map(item =>
          item.id === itemId
            ? { ...item, completed: !currentCompleted }
            : item
        )
        const total = updatedItems.length
        const concluidos = updatedItems.filter(item => item.completed).length
        const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0

        if (onProgressChange) {
          onProgressChange(porcentagem)
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error)
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: false }))
    }
  }

  if (checklistItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>Nenhum item de checklist disponível para este módulo.</p>
      </div>
    )
  }

  const total = checklistItems.length
  const concluidos = checklistItems.filter(item => item.completed).length
  const porcentagem = Math.round((concluidos / total) * 100)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Checklist do Módulo</h3>
        <span className="text-sm font-medium text-gray-600">
          {concluidos}/{total} ({porcentagem}%)
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>

      {/* Lista de itens */}
      <div className="space-y-3">
        {checklistItems.map((item) => (
          <label
            key={item.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              item.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={item.completed || false}
              onChange={() => toggleItem(item.id, item.completed || false)}
              disabled={loading[item.id]}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span
              className={`flex-1 text-sm ${
                item.completed
                  ? 'text-gray-600 line-through'
                  : 'text-gray-900'
              }`}
            >
              {item.item_text}
            </span>
            {loading[item.id] && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

