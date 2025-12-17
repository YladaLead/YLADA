'use client'

import { useState, useEffect, useRef } from 'react'

interface ChecklistItemProps {
  id: string
  label: string
  dayNumber: number
  userId: string
  itemIndex: number
  checked: boolean
  note?: string
  onToggle: (index: number) => void
  disabled?: boolean
}

export default function ChecklistItem({
  id,
  label,
  dayNumber,
  userId,
  itemIndex,
  checked,
  note,
  onToggle,
  disabled = false
}: ChecklistItemProps) {
  const [localNote, setLocalNote] = useState(note || '')
  const [isSaving, setIsSaving] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar com prop note quando mudar externamente
  useEffect(() => {
    setLocalNote(note || '')
  }, [note])

  // Salvar nota no Supabase com debounce
  const saveNoteToSupabase = async (text: string) => {
    if (!userId) return

    try {
      setIsSaving(true)
      const res = await fetch('/api/nutri/metodo/jornada/checklist/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          day_number: dayNumber,
          item_index: itemIndex,
          nota: text || null
        })
      })

      if (!res.ok) {
        console.error('Erro ao salvar nota do checklist')
      }
    } catch (error) {
      console.error('Erro ao salvar nota:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Debounce: salvar 800ms após parar de digitar
  useEffect(() => {
    // Limpar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Se o texto mudou e não é apenas sincronização inicial, agendar salvamento
    const initialNote = note || ''
    if (localNote !== initialNote && localNote.trim() !== '') {
      debounceTimerRef.current = setTimeout(() => {
        saveNoteToSupabase(localNote)
      }, 800) // 800ms de debounce
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNote])

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(itemIndex)}
          disabled={disabled}
          className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span
          className={`flex-1 ${
            checked ? 'line-through text-gray-500' : 'text-gray-700'
          }`}
        >
          {label}
        </span>
      </label>

      {/* Campo de anotação sempre visível (não precisa clicar para abrir) */}
      <div className="mt-3 ml-8">
        <textarea
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          placeholder={
            label.includes('fez sentido')
              ? "O que você aprendeu? O que mais chamou atenção? Escreva aqui..."
              : label.includes('ajudar')
              ? "Pense em 3 coisas práticas: como isso vai te ajudar? O que vai mudar? Escreva aqui..."
              : "Escreva suas anotações aqui..."
          }
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={label.includes('ajudar') ? 4 : 3}
        />
        {isSaving && (
          <p className="text-xs text-gray-500 mt-1">Salvando...</p>
        )}
      </div>
    </div>
  )
}
