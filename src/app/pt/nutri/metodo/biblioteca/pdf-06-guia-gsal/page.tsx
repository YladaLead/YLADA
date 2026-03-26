'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF06GuiaGSAL() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600 transition-all">
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <Link href="/pt/nutri/metodo/biblioteca" className="hover:text-blue-600 transition-all">
            Materiais de Apoio
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Guia Prático de Gestão GSAL</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Guia Prático de Gestão GSAL
            </h1>
            <p className="text-xl text-gray-600">
              Organize seu crescimento com clareza
            </p>
            <p className="text-sm text-gray-500 mt-2">
              YLADA Nutri • Gestão Estratégica Profissional
            </p>
          </div>

          {/* Botão Download */}
          <div className="flex justify-center">
            <button
              disabled
              className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
            >
              <span>📄</span>
              <span>PDF em preparação</span>
            </button>
          </div>
        </div>

        {/* Conteúdo dos Slides */}
        <div className="space-y-6">
          
          {/* Slide 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que significa GSAL</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Gerar</strong> oportunidades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Servir</strong> com qualidade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Acompanhar</strong> com constância</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Lucrar</strong> de forma sustentável</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">→</span>
                <span className="font-medium">GSAL é um modelo simples de gestão, não um sistema complexo.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Gestão é clareza, não complicação.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que usar o GSAL</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Visualizar seu movimento profissional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Organizar contatos e atendimentos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Acompanhar evolução de clientes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Tomar decisões com base em dados reais.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 O que é visível pode ser ajustado.</p>
          </div>

          {/* Slide 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quando o GSAL entra na sua rotina</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Após concluir o Dia 1 da Jornada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Quando você começa a gerar movimento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Para organizar o que já está acontecendo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Para evitar perda de informações.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 GSAL entra depois da direção definida.</p>
          </div>

          {/* Slide 5 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como registrar leads</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Registre toda pessoa que demonstrar interesse.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Inclua informações básicas (nome, contato).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Não espere virar cliente para registrar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Registro simples é suficiente.</span>
              </li>
            </ul>
            <p className="text-green-700 font-semibold mt-4">👉 Lead não registrado é oportunidade perdida.</p>
          </div>

          {/* Slide 6 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como registrar avaliações</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Marque quando a avaliação acontecer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Registre observações importantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use o GSAL para acompanhar o andamento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não confie apenas na memória.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Organização melhora o atendimento.</p>
          </div>

          {/* Slide 7 */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-sm border border-purple-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como acompanhar planos e clientes</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Atualize status dos atendimentos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Registre retornos e acompanhamentos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Observe quem precisa de contato.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Use o GSAL para não esquecer ninguém.</span>
              </li>
            </ul>
            <p className="text-purple-700 font-semibold mt-4">👉 Acompanhamento gera fidelização.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-sm border border-amber-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como usar os números a seu favor</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Veja quantos leads viram avaliações.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Observe quantos planos são fechados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Use números para ajustes, não cobrança.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Pequenos ajustes geram grandes melhorias.</span>
              </li>
            </ul>
            <p className="text-amber-700 font-semibold mt-4">👉 Número é informação, não julgamento.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rotina mínima com GSAL</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Atualize registros 1 a 2 vezes por semana.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Reserve um horário fixo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não deixe acumular.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mantenha simples e constante.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Gestão feita aos poucos evita caos.</p>
          </div>

          {/* Slide 10 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que evitar no GSAL</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Querer registrar tudo com excesso de detalhes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Atualizar de forma irregular.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Usar números para se pressionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Abandonar a ferramenta cedo demais.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 GSAL é apoio, não peso.</p>
          </div>

          {/* Slide 11 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O Noel como aliada na gestão</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Noel interpreta seus dados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ajuda a identificar gargalos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Sugere ajustes simples.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mantém você focada no essencial.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Gestão guiada gera decisões melhores.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Este guia está disponível para você organizar sua gestão no seu ritmo.<br/>
              Volte aqui sempre que precisar relembrar os fundamentos do GSAL.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 Gestão simples gera clareza e crescimento sustentável.
            </p>
          </div>

        </div>

        {/* Navegação */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/pt/nutri/metodo/biblioteca"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            ← Voltar para Materiais de Apoio
          </Link>
        </div>
      </div>
    </div>
  )
}
