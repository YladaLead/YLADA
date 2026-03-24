'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

const PASSOS = [
  { num: 1, titulo: 'Escolher um diagnóstico', desc: 'Escolha um diagnóstico da biblioteca do YLADA ou personalize um modelo existente para sua área. O Noel orienta qual escolher e como adaptar ao seu caso.' },
  { num: 2, titulo: 'Compartilhar o link', desc: 'Envie o link por WhatsApp, redes sociais ou onde seus clientes estão. O Noel indica o melhor canal e a melhor forma de divulgar.' },
  { num: 3, titulo: 'Receber respostas qualificadas', desc: 'As pessoas respondem e você recebe contatos mais preparados automaticamente. O Noel acompanha e sugere ajustes na conversão.' },
  { num: 4, titulo: 'Conversar com clientes mais preparados', desc: 'Quando a pessoa chega até você, ela já entende o próprio problema. A conversa fica muito mais objetiva, e o Noel continua te direcionando quando travar.' },
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
              Fazer diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Como profissionais usam o YLADA
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Quatro passos simples para atrair clientes com mais clareza e resolver o problema de estar perdido em <em>o que fazer agora</em>.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">Noel</span>, seu guia estratégico
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            O YLADA não é só ferramenta. O <strong>Noel</strong> é uma inteligência que te direciona. Entende sua dor, sua área, seu objetivo e te diz o próximo passo certo. Não executa por você. Te impede de travar. Quando você não sabe por onde começar ou está preso num bloqueio, o Noel destrava tudo e coloca seu foco onde realmente importa.
          </p>
        </div>
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
            Fazer diagnóstico agora
          </Link>
        </div>
      </main>
    </div>
  )
}
