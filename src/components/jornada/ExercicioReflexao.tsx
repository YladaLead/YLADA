'use client'

import { useState, useEffect, useRef } from 'react'

interface ExercicioReflexaoProps {
  id: string
  label: string
  dayNumber: number
  userId: string
  itemIndex: number
  note?: string
  disabled?: boolean
}

export default function ExercicioReflexao({
  id,
  label,
  dayNumber,
  userId,
  itemIndex,
  note,
  disabled = false
}: ExercicioReflexaoProps) {
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
        console.error('Erro ao salvar nota do exercício')
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
    if (localNote !== initialNote) {
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

  // Salvar imediatamente quando o usuário sair do campo (onBlur)
  const handleBlur = async () => {
    // Cancelar qualquer debounce pendente
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    // Salvar imediatamente se houve mudança
    const initialNote = note || ''
    if (localNote !== initialNote) {
      await saveNoteToSupabase(localNote)
    }
  }

  // Placeholder contextual baseado no conteúdo do exercício
  const getPlaceholder = () => {
    if (label.includes('fez sentido')) {
      return "O que você aprendeu? O que mais chamou atenção? Escreva aqui..."
    }
    if (label.includes('ajudar')) {
      return "Pense em 3 coisas práticas: como isso vai te ajudar? O que vai mudar? Escreva aqui..."
    }
    return "Escreva suas reflexões aqui..."
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 mb-4 border-l-4 border-purple-500 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3 text-base">
        {label}
      </h3>
      <textarea
        value={localNote}
        onChange={(e) => setLocalNote(e.target.value)}
        onBlur={handleBlur}
        placeholder={getPlaceholder()}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        rows={label.includes('ajudar') ? 4 : 3}
      />
      {isSaving && (
        <p className="text-xs text-gray-500 mt-2">Salvando...</p>
      )}
    </div>
  )
}
