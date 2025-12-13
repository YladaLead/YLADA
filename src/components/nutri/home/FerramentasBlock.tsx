'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'
import PrimaryButton from '@/components/shared/PrimaryButton'

export default function FerramentasBlock() {
  const [ferramentasCount, setFerramentasCount] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarFerramentas = async () => {
      try {
        const res = await fetch('/api/nutri/ferramentas?profession=nutri', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          // A API retorna { tools: [...], quizzes: [...] }
          const tools = data.tools || []
          const quizzes = data.quizzes || []
          setFerramentasCount(tools.length + quizzes.length)
        }
      } catch (error) {
        console.error('Erro ao carregar ferramentas:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarFerramentas()
  }, [])

  return (
    <Section
      title="🧰 Ferramentas Profissionais"
      subtitle="Crie e gerencie suas ferramentas de captação"
    >
      {/* Atalhos Rápidos - Apenas Quiz Personalizado */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
        <PrimaryButton
          href="/pt/nutri/quiz-personalizado"
          className="bg-purple-600 hover:bg-purple-700"
        >
          Criar Quiz Personalizado
        </PrimaryButton>
      </div>
      
      {/* Informação sobre ferramentas fixas */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          💡 <strong>Dica:</strong> As ferramentas pré-definidas (calculadoras, templates) já estão prontas para uso. 
          Você pode criar apenas Quizzes personalizados. Acesse suas ferramentas abaixo.
        </p>
      </div>

      {/* Resumo */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {carregando ? 'Carregando...' : `${ferramentasCount} ferramentas criadas`}
            </h3>
            <p className="text-sm text-gray-600">
              Acesse todas as suas ferramentas e gerencie seus links de captação
            </p>
          </div>
          <Link
            href="/pt/nutri/ferramentas"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap ml-4"
          >
            Ver Todas →
          </Link>
        </div>
      </Card>
    </Section>
  )
}

