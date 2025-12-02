'use client'

import Link from 'next/link'

export default function MetodoYLADAIntro() {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200 shadow-xl">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O Método YLADA
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            O que a faculdade não ensinou, mas que define o sucesso da Nutricionista moderna.
          </p>
        </div>

        {/* Texto Principal */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6 mb-8">
          <p className="text-lg leading-relaxed">
            A formação em Nutrição prepara você para cuidar do corpo, da saúde e da vida das pessoas.
          </p>
          
          <p className="text-lg leading-relaxed">
            Mas ela deixou de entregar algo fundamental:
          </p>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-600 shadow-md">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">👉</span>
                <span>Como construir uma <strong>rotina organizada</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">👉</span>
                <span>Como <strong>lotar a agenda</strong> com consistência.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">👉</span>
                <span>Como <strong>gerar leads todos os dias</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">👉</span>
                <span>Como <strong>encantar clientes</strong> e fazer elas indicarem naturalmente.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">👉</span>
                <span>Como pensar como <strong>empresária</strong>, e não apenas como profissional técnica.</span>
              </li>
            </ul>
          </div>

          <p className="text-lg leading-relaxed font-medium">
            Essas competências nunca estiveram em um livro, em uma disciplina, em uma aula.
          </p>
          
          <p className="text-lg leading-relaxed font-bold text-gray-900">
            Mas são elas que diferenciam uma Nutricionista comum de uma Nutri-Empresária.
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-xl font-bold mb-2">Foi por isso que criamos o Método YLADA.</p>
            <p className="text-lg">
              Um sistema simples, prático e aplicável, pensado para transformar sua rotina, sua agenda, sua segurança e sua forma de trabalhar — em apenas <strong>30 dias</strong>.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4 text-xl">Dentro do Método YLADA você vai encontrar:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span><strong>fundamentos</strong> que nunca foram ensinados na faculdade</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span><strong>pilares claros</strong> para evoluir como profissional</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span><strong>exercícios práticos</strong> que você aplica no mesmo dia</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span><strong>ferramentas prontas</strong> para captação, atendimento e gestão</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span><strong>orientação diária</strong>, passo a passo, sem confusão</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span>uma <strong>jornada de 30 dias</strong> que organiza tudo para você</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
            <p className="text-lg leading-relaxed mb-2">
              <strong>Não existe mágica.</strong>
            </p>
            <p className="text-lg leading-relaxed mb-2">
              Existe clareza, método, ação e constância.
            </p>
            <p className="text-lg leading-relaxed">
              É por isso que tantas nutricionistas se perdem no caminho: não faltam cursos, falta um sistema que guia, organiza e transforma.
            </p>
          </div>

          <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
            <p className="text-2xl md:text-3xl font-bold mb-4">
              O Método YLADA é esse sistema.
            </p>
            <p className="text-lg md:text-xl mb-6">
              É o mapa que faltou na faculdade.<br />
              É o manual que ninguém escreveu.<br />
              É a estrutura que você precisava para viver como uma <strong>Nutri-Empresária</strong> — com agenda cheia, rotina leve e resultados previsíveis.
            </p>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="text-center">
          <Link
            href="/pt/nutri/formacao"
            className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xl font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            🚀 Iniciar Minha Jornada de 30 Dias
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Sua jornada começa agora. Comece a transformação.
          </p>
        </div>
      </div>
    </div>
  )
}

