'use client'

import { useState, useEffect } from 'react'

interface ReflexaoDiaProps {
  dayNumber: number
  initialContent?: string
  onSave: (content: string) => void
  disabled?: boolean
}

export default function ReflexaoDia({
  dayNumber,
  initialContent = '',
  onSave,
  disabled = false
}: ReflexaoDiaProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleBlur = async () => {
    if (content !== initialContent) {
      setIsSaving(true)
      await onSave(content)
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
      <h2 className="font-bold text-gray-900 mb-3 text-lg">📝 Anotações do Dia</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use este espaço para registrar seus aprendizados, percepções e insights importantes do dia.
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Escreva aqui o que aprendeu hoje, suas percepções ou qualquer insight importante."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        rows={6}
      />
      {isSaving && (
        <p className="text-xs text-gray-500 mt-2">Salvando...</p>
      )}
    </div>
  )
}

