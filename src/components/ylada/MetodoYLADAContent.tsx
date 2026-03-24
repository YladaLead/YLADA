'use client'

import Link from 'next/link'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

interface MetodoYLADAContentProps {
  areaCodigo: string
  areaLabel: string
}

export default function MetodoYLADAContent({ areaCodigo, areaLabel }: MetodoYLADAContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksHref = `${prefix}/links`
  const homeHref = `${prefix}/home`

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Filosofia YLADA
        </h1>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Boas conversas começam com boas perguntas.
        </p>
        <p className="text-gray-600">
          Transforme curiosidade em conversas com clientes através de diagnósticos inteligentes.
        </p>
        <p className="text-gray-700 font-medium mt-2">
          A filosofia é aplicada através do Método YLADA.
        </p>
      </div>

      {/* 1. Nova lógica de atrair clientes */}
      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          A nova lógica de atrair clientes
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="font-semibold text-gray-800 mb-2">Marketing tradicional</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Postar muito</li>
              <li>• Convencer pessoas</li>
              <li>• Explicar várias vezes</li>
              <li>• Falar com curiosos</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="font-semibold text-gray-800 mb-2">Filosofia YLADA</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Criar diagnóstico</li>
              <li>• Atrair interessados</li>
              <li>• Iniciar conversa</li>
              <li>• Transformar em cliente</li>
            </ul>
          </div>
        </div>
        <p className="text-gray-700 font-medium">
          Pare de tentar convencer curiosos. Comece a conversar com quem já quer entender o que você faz.
        </p>
      </section>

      {/* 2. O funcionamento da filosofia YLADA */}
      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          O funcionamento da filosofia YLADA
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
          <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100 min-w-[140px]">
            <p className="font-bold text-blue-700">Diagnóstico</p>
            <p className="text-sm text-gray-600 mt-1">Gera curiosidade</p>
          </div>
          <span className="text-2xl text-gray-400">→</span>
          <div className="text-center p-4 rounded-xl bg-indigo-50 border border-indigo-100 min-w-[140px]">
            <p className="font-bold text-indigo-700">Conversa</p>
            <p className="text-sm text-gray-600 mt-1">Com interessados</p>
          </div>
          <span className="text-2xl text-gray-400">→</span>
          <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100 min-w-[140px]">
            <p className="font-bold text-green-700">Cliente</p>
            <p className="text-sm text-gray-600 mt-1">Conversão natural</p>
          </div>
        </div>
        <p className="text-center text-lg font-semibold text-gray-800 mt-2">
          Diagnóstico → Conversa → Cliente
        </p>
      </section>

      {/* 3. Comparação Tráfego vs Diagnóstico */}
      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Tráfego pago vs Diagnóstico YLADA
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Tráfego pago</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Diagnóstico YLADA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-2 text-gray-600">💰 Paga para aparecer</td>
                <td className="py-3 px-2 text-gray-600">🧠 Pessoas querem descobrir o resultado</td>
              </tr>
              <tr>
                <td className="py-3 px-2 text-gray-600">📉 Pessoas frias</td>
                <td className="py-3 px-2 text-gray-600">🎯 Pessoas interessadas</td>
              </tr>
              <tr>
                <td className="py-3 px-2 text-gray-600">🔁 Precisa repetir sempre</td>
                <td className="py-3 px-2 text-gray-600">🔁 Links se propagam</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Efeito de rede */}
      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          O efeito de rede
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>Pessoa responde diagnóstico → Conversa começa → Ela envia para amiga →</p>
          <p className="font-semibold text-blue-600">Diagnóstico se espalha → Novos leads aparecem</p>
        </div>
        <p className="mt-4 text-gray-600">
          Seu diagnóstico pode gerar conversas e também se espalhar naturalmente quando as pessoas compartilham.
        </p>
      </section>

      {/* 5. Os três motores do YLADA */}
      <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Os três motores do YLADA
        </h2>
        <p className="text-gray-600 text-sm mb-4">Captação → Conversa → Relacionamento → Cliente</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="font-bold text-blue-800 text-sm">Captação</p>
            <p className="text-xs text-gray-600">Diagnósticos despertam curiosidade.</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
            <p className="font-bold text-indigo-800 text-sm">Conversa</p>
            <p className="text-xs text-gray-600">Resultados iniciam conversas naturais.</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-100">
            <p className="font-bold text-green-800 text-sm">Relacionamento</p>
            <p className="text-xs text-gray-600">Histórico transforma contatos em clientes.</p>
          </div>
        </div>
      </section>

      {/* 6. Papel do Noel */}
      <section className="bg-sky-50 rounded-xl p-6 border border-sky-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          O papel do Noel
        </h2>
        <p className="text-gray-700 mb-4">
          O Noel é o mentor da filosofia YLADA e ajuda você a aplicá-la no dia a dia:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-sky-600">•</span>
            Criar diagnósticos que atraem
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-600">•</span>
            Melhorar seus diagnósticos
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-600">•</span>
            Gerar ideias de conteúdo
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-600">•</span>
            Organizar sua estratégia de crescimento
          </li>
        </ul>
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          Falar com o Noel
        </Link>
      </section>

      {/* 7. CTA final */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
        <p className="text-xl font-bold mb-2">
          Agora vamos colocar isso em prática
        </p>
        <p className="text-blue-100 mb-6">
          Crie seu primeiro diagnóstico e comece a atrair clientes interessados.
        </p>
        <Link
          href={linksHref}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
        >
          Criar diagnóstico
        </Link>
      </section>
    </div>
  )
}
