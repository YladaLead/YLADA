'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PilarAnotacaoProps {
  pilarId: string
  placeholder: string
  initialContent?: string
  disabled?: boolean
}

export default function PilarAnotacao({
  pilarId,
  placeholder,
  initialContent = '',
  disabled = false
}: PilarAnotacaoProps) {
  const { user } = useAuth()
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleBlur = async () => {
    if (!user || content === initialContent) return

    try {
      setIsSaving(true)
      const res = await fetch('/api/nutri/metodo/pilares/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pilar_id: pilarId,
          conteudo: content || null
        })
      })

      if (!res.ok) {
        console.error('Erro ao salvar anotação do pilar')
      }
    } catch (error) {
      console.error('Erro ao salvar anotação:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
      <h2 className="font-bold text-gray-900 mb-3 text-lg">📝 Anotações do Pilar</h2>
      <p className="text-sm text-gray-600 mb-4">{placeholder}</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        rows={6}
      />
      {isSaving && (
        <p className="text-xs text-gray-500 mt-2">Salvando...</p>
      )}
    </div>
  )
}

