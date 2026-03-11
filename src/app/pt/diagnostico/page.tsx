'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

const PERGUNTAS = [
  {
    id: 'q1',
    texto: 'Seus clientes costumam pedir apenas preço antes de entender seu serviço?',
    opcoes: [
      { valor: 2, label: 'Sim, com frequência' },
      { valor: 1, label: 'Às vezes' },
      { valor: 0, label: 'Não, geralmente entendem antes' },
    ],
  },
  {
    id: 'q2',
    texto: 'Você sente que precisa explicar várias vezes o que faz?',
    opcoes: [
      { valor: 2, label: 'Sim, sempre' },
      { valor: 1, label: 'Às vezes' },
      { valor: 0, label: 'Não, explicam bem antes' },
    ],
  },
  {
    id: 'q3',
    texto: 'Seus conteúdos geram conversas ou apenas curtidas?',
    opcoes: [
      { valor: 2, label: 'Apenas curtidas' },
      { valor: 1, label: 'Às vezes conversas' },
      { valor: 0, label: 'Sim, geram conversas' },
    ],
  },
  {
    id: 'q4',
    texto: 'As pessoas chegam até você já entendendo o valor do seu trabalho?',
    opcoes: [
      { valor: 0, label: 'Sim, na maioria das vezes' },
      { valor: 1, label: 'Às vezes' },
      { valor: 2, label: 'Não, preciso explicar' },
    ],
  },
  {
    id: 'q5',
    texto: 'Você tem dificuldade em filtrar quem realmente quer contratar você?',
    opcoes: [
      { valor: 2, label: 'Sim, muita dificuldade' },
      { valor: 1, label: 'Às vezes' },
      { valor: 0, label: 'Não, consigo filtrar bem' },
    ],
  },
]

export default function DiagnosticoPage() {
  const router = useRouter()
  const [respostas, setRespostas] = useState<Record<string, number>>({})
  const [etapaAtual, setEtapaAtual] = useState(0)

  const perguntaAtual = PERGUNTAS[etapaAtual]
  const totalPerguntas = PERGUNTAS.length
  const todasRespondidas = Object.keys(respostas).length === totalPerguntas

  const handleResposta = (valor: number) => {
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: valor }))
    if (etapaAtual < totalPerguntas - 1) {
      setEtapaAtual((e) => e + 1)
    }
  }

  const handleVerDiagnostico = () => {
    const pontuacao = Object.values(respostas).reduce((a, b) => a + b, 0)
    // 0-3: atrai clientes | 4-7: desenvolvimento | 8-10: atrai curiosos
    const perfil = pontuacao >= 6 ? 'curiosos' : pontuacao >= 3 ? 'desenvolvimento' : 'clientes'
    router.push(`/pt/resultado?perfil=${perfil}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Método YLADA
          </Link>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Seu marketing atrai curiosos ou clientes realmente interessados?
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Responda algumas perguntas rápidas e descubra se sua comunicação profissional está atraindo clientes ou apenas curiosos.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-200">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Pergunta {etapaAtual + 1} de {totalPerguntas}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((etapaAtual + 1) / totalPerguntas) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            {perguntaAtual.texto}
          </h2>

          <div className="space-y-3">
            {perguntaAtual.opcoes.map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => handleResposta(opcao.valor)}
                className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
              >
                {opcao.label}
              </button>
            ))}
          </div>

          {etapaAtual > 0 && (
            <button
              type="button"
              onClick={() => setEtapaAtual((e) => e - 1)}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              ← Voltar
            </button>
          )}
        </div>

        {todasRespondidas && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleVerDiagnostico}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              Ver diagnóstico
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">YLADA</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">Método</Link>
        </div>
      </footer>
    </div>
  )
}
