'use client'

import Link from 'next/link'
import Card from '@/components/shared/Card'
import Section from '@/components/shared/Section'

const bibliotecaItems = [
  {
    title: 'Manual Técnico',
    icon: '📖',
    href: '/pt/nutri/metodo/manual',
    description: 'Guia completo de uso do sistema'
  },
  {
    title: 'Tutoriais em Vídeo',
    icon: '🎥',
    href: '/pt/nutri/metodo/manual',
    description: 'Vídeos explicativos das funcionalidades'
  },
  {
    title: 'PDFs da Formação',
    icon: '📄',
    href: '/pt/nutri/metodo/manual',
    description: 'Materiais complementares do método'
  },
  {
    title: 'Bônus Exclusivos',
    icon: '🎁',
    href: '/pt/nutri/metodo/manual',
    description: 'Conteúdos extras e ferramentas'
  }
]

export default function BibliotecaBlock() {
  return (
    <Section
      title="🎒 Biblioteca / Materiais Extras"
      subtitle="Recursos de apoio para sua jornada"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bibliotecaItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card hover className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  )
}

