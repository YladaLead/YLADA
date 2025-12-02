'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ExercicioCampoTextoProps {
  exercicioId: string
  campoId: string
  label: string
  placeholder: string
  initialValue?: string
  rows?: number
}

export default function ExercicioCampoTexto({
  exercicioId,
  campoId,
  label,
  placeholder,
  initialValue = '',
  rows = 4
}: ExercicioCampoTextoProps) {
  const { user } = useAuth()
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    // Buscar valor inicial do Supabase se não foi fornecido
    if (initialValue || !user) return

    const carregarValor = async () => {
      try {
        const res = await fetch(`/api/nutri/metodo/exercicios/note?exercicio_id=${exercicioId}&campo_id=${campoId}`, {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data.data?.conteudo) {
            setValue(data.data.conteudo)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar campo:', error)
      }
    }

    carregarValor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, exercicioId, campoId])

  const saveValue = async (text: string) => {
    if (!user) return

    try {
      setIsSaving(true)
      await fetch('/api/nutri/metodo/exercicios/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          exercicio_id: exercicioId,
          campo_id: campoId,
          conteudo: text || null
        })
      })
    } catch (error) {
      console.error('Erro ao salvar campo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Debounce: salvar 800ms após parar de digitar
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      saveValue(newValue)
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      {label && (
        <label className="block font-bold text-gray-900 mb-3">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        rows={rows}
      />
      {isSaving && (
        <p className="text-xs text-gray-500 mt-2">Salvando...</p>
      )}
    </div>
  )
}

