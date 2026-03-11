'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

const PASSOS = [
  { num: 1, titulo: 'Criar um diagnóstico', desc: 'Use a plataforma para criar quizzes e avaliações que ajudam seus clientes a descobrir problemas.' },
  { num: 2, titulo: 'Compartilhar o link', desc: 'Envie o link por WhatsApp, redes sociais ou onde seus clientes estão.' },
  { num: 3, titulo: 'Receber respostas e contatos', desc: 'As pessoas respondem e você recebe os contatos qualificados automaticamente.' },
  { num: 4, titulo: 'Converter clientes com mais facilidade', desc: 'Quando a pessoa chega, ela já entende o valor. A conversa fica muito mais produtiva.' },
]

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex gap-4">
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Método
            </Link>
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Como profissionais usam o YLADA
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Quatro passos simples para atrair clientes com mais clareza.
        </p>
        <div className="space-y-8">
          {PASSOS.map((passo) => (
            <div key={passo.num} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                {passo.num}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{passo.titulo}</h2>
                <p className="text-gray-600">{passo.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/pt/diagnostico"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            Testar diagnóstico
          </Link>
        </div>
      </main>
    </div>
  )
}
