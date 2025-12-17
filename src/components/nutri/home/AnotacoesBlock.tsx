'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import SecondaryButton from '@/components/shared/SecondaryButton'

export default function AnotacoesBlock() {
  const [anotacao, setAnotacao] = useState('')

  const handleSave = async () => {
    // TODO: Implementar salvamento no Supabase
    console.log('Salvando anotação:', anotacao)
  }

  return (
    <Section
      title="📝 Minhas Anotações"
      subtitle="Anote o que você aprendeu hoje"
    >
      <Card>
        <textarea
          value={anotacao}
          onChange={(e) => setAnotacao(e.target.value)}
          onBlur={handleSave}
          placeholder="O que você aprendeu hoje? Anote aqui..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-4"
          rows={4}
        />
        <div className="flex justify-end">
          <SecondaryButton href="/pt/nutri/anotacoes">
            Ver todas as anotações →
          </SecondaryButton>
        </div>
      </Card>
    </Section>
  )
}

