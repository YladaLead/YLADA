'use client'

import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'

const pilares = [
  {
    id: '1',
    title: 'Pilar 1 — Filosofia YLADA',
    subtitle: 'A Nova Nutri-Empresária',
    description: 'Fundamentos da transformação profissional',
    icon: '🌟'
  },
  {
    id: '2',
    title: 'Pilar 2 — Rotina Mínima YLADA',
    subtitle: 'Estrutura & Consistência',
    description: 'Rotina diária que gera resultados',
    icon: '⚡'
  },
  {
    id: '3',
    title: 'Pilar 3 — Captação YLADA',
    subtitle: 'Gerar Movimento',
    description: 'Estratégias para captar leads diários',
    icon: '🎯'
  },
  {
    id: '4',
    title: 'Pilar 4 — Atendimento que Encanta',
    subtitle: 'Profissionalismo de Verdade',
    description: 'Atendimento que converte e encanta',
    icon: '💎'
  },
  {
    id: '5',
    title: 'Pilar 5 — GSAL',
    subtitle: 'Gerar, Servir, Acompanhar, Lucrar',
    description: 'Sistema completo de gestão',
    icon: '📊'
  }
]

export default function PilaresBlock() {
  return (
    <Section
      title="📚 Pilares do Método YLADA"
      subtitle="A base sólida da sua transformação profissional"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {pilares.map((pilar) => (
          <Card key={pilar.id} hover className="text-center">
            <div className="text-4xl mb-3">{pilar.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">{pilar.title}</h3>
            <p className="text-xs text-gray-600 mb-3">{pilar.subtitle}</p>
            <p className="text-xs text-gray-500 mb-4 min-h-[2.5rem]">{pilar.description}</p>
            <Link
              href={`/pt/nutri/metodo/pilares/${pilar.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full"
            >
              Acessar
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  )
}

